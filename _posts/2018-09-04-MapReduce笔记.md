---
layout:     post
title:      "MapReduce"
subtitle:   " \"好好学习，天天向上\""
date:       2018-09-04 10:18:00
author:     "WQ"
header-img: "img/blogImg/2018-09-04.jpg"
catalog: true
tags:
    - Hadoop
---


# MR笔记

1. `org.apache.hadoop.mapred`是旧的api，`org.apache.hadoop.mapreduce`是新的api。


## 本地无hadoop环境debug MR

本地不需要安装hadoop也可以执行

在windows中需要下载相应版本的winutils.exe文件（和引入的hadoop-core版本一致），默认的路径是\bin下，例如我这里讲其放在`e:\bin\winutils.exe`中，然后在启动mr之前设置hadoop的路径参数为
`System.setProperty("hadoop.home.dir", "e:\\");`,

```xml
 <dependency>
    <groupId>org.apache.hadoop</groupId>
    <artifactId>hadoop-client</artifactId>
    <version>3.1.0</version>
</dependency>

```

如果执行过程中找不到某类就添加相应的类。

需要修改NativeIO中win类的access代码，直接返回true。

注意：我在网上找到很多都是使用hadoop-core包的，这个包在1.2.1版本之后就被hadoop-client取代了，所以现在只要引入这一个包就行。

## 遇到的坑

1. 自定义的分区函数只有在reducer的数量大于1的时候才会有作用
1. 自定义类型的compareTo方法，其作用就是在没有设置`job.setSortComparatorClass();`或者`job.setPartitionerClass();`时使用的。
1. 自定义比较器，需要继承`WritableComparator`类，需要注意的是在构造器中需要父类带有createInstances参数的构造器，并设置参数为true。参考别的类的实现方式，使用的是`WritableComparator.define(Class,WritableComparator)`这个static方法（实现对象的创建），这个方法可以定义某个类使用的比较器。
1. 在job上需要设置map和reducer阶段的输出类型，否则的话会有一个默认的策略，有时候会比较隐晦，所以建议还是直接设置上
1. 本地调试需要设置log4j配置，否则的话会看不到错误日志
1. 设置combiner类的时需要注意，由于combiner的输出是reducer的输入，所以类型必须匹配
1. 说明两个容易混淆的参数
```java
// 首先是MR的pipeline
// map-->partition-->sort-->group-->reducer
// 设置每个分区中key-value的顺序
job.setSortComparatorClass();                                   
// 设置reducer中那些key需要合并在一起，也就是key1----v1,v2,v3...
job.setGroupingComparatorClass();

```

## 例子

```java
package com.go2going.domain;


import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.fs.Path;
import org.apache.hadoop.io.IntWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.io.WritableComparable;
import org.apache.hadoop.io.WritableComparator;
import org.apache.hadoop.mapreduce.Job;
import org.apache.hadoop.mapreduce.Mapper;
import org.apache.hadoop.mapreduce.Partitioner;
import org.apache.hadoop.mapreduce.Reducer;
import org.apache.hadoop.mapreduce.lib.input.FileInputFormat;
import org.apache.hadoop.mapreduce.lib.input.KeyValueTextInputFormat;
import org.apache.hadoop.mapreduce.lib.output.FileOutputFormat;

import java.io.DataInput;
import java.io.DataOutput;
import java.io.IOException;

/**
 * 自定义类型，不考虑自己对reducer的values进行排序
 * <p>
 *
 * 输入数据样例：<P>
 * str1	2
 * str2	5
 * str3	9
 * str1	1
 * str2	3
 * str3	12
 * str1	8
 * str2	7
 * str3	18
 * <P>
 * 输出数据样例：
 * <p>
 * str1    1,2,8
 * str2    3,5,7
 * str3    9,12,19
 */
public class CustomizeTypeMain {

    public static void main(String[] args) throws IOException, ClassNotFoundException, InterruptedException {

        System.setProperty("hadoop.home.dir", "E:\\wq\\hadoop-3.1.0");
        Configuration conf = new Configuration();
        Job job = Job.getInstance(conf, "customize my type");
        job.setJarByClass(CustomizeTypeMain.class);

        //设置行切分方式
        job.setInputFormatClass(KeyValueTextInputFormat.class);

        job.setMapperClass(MyMapper.class);
        job.setReducerClass(MyReducer.class);

        // 注意reducer不是随便用的，其中一个条件是combiner的输出的key-value和reducer的输入key-value一致
        // job.setCombinerClass(MyReducer.class);

        //在reduce前，key-value的排序方式
        job.setGroupingComparatorClass(MyGroupComparator.class);
        job.setSortComparatorClass(MySortComparator.class);
        job.setPartitionerClass(MyPartitioner.class);

        job.setNumReduceTasks(2);
        //这两个不能少
        job.setOutputKeyClass(Text.class);
        job.setOutputValueClass(Text.class);
        job.setMapOutputKeyClass(MyType.class);
        job.setMapOutputValueClass(IntWritable.class);

        //辅助类，设置config的参数
        FileInputFormat.addInputPath(job, new Path(args[0]));
        FileOutputFormat.setOutputPath(job, new Path(args[1]));
        System.exit(job.waitForCompletion(true) ? 0 : 1);
    }

    private static class MyType implements WritableComparable<MyType> {


        private String name;
        private Integer value;


        /**
         * 这个没啥特殊含义，因为自定义排序了
         * @param o
         * @return
         */
        @Override
        public int compareTo(MyType o) {

            // TODO 没有定义sort和group函数时使用对象的compareTo方法
            /*int i = o.getName().compareTo(this.getName());
            if (i == 0) {
                return o.getValue() - this.getValue();
            }
            return i;*/
            return this.name.compareTo(o.name);
        }

        @Override
        public void write(DataOutput out) throws IOException {
            out.writeUTF(name);
            out.writeInt(value);
        }

        @Override
        public void readFields(DataInput in) throws IOException {
            this.name = in.readUTF();
            this.value = in.readInt();
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public Integer getValue() {
            return value;
        }

        public void setValue(Integer value) {
            this.value = value;
        }

        @Override
        public String toString() {
            return "MyType{" +
                    "name='" + name + '\'' +
                    ", value=" + value +
                    '}';
        }
    }

    private static class MyMapper extends Mapper<Text, Text, MyType, IntWritable> {
        @Override
        protected void map(Text key, Text value, Context context) throws IOException, InterruptedException {
            MyType myType = new MyType();
            myType.setName(key.toString());
            Integer of = Integer.valueOf(value.toString());
            myType.setValue(of);
            context.write(myType, new IntWritable(of));
        }
    }

    private static class MyReducer extends Reducer<MyType, IntWritable, Text, Text> {
        @Override
        protected void reduce(MyType key, Iterable<IntWritable> values, Context context) throws IOException, InterruptedException {
            StringBuilder sb = new StringBuilder();
            values.forEach(intWritable -> {
                sb.append(intWritable.get());
                sb.append(",");
            });


            if (sb.toString().endsWith(",")) {
                sb.delete(sb.length() - 1, sb.length());
            }


            context.write(new Text(key.getName()), new Text(sb.toString()));
        }
    }

    /**
     * 自定义分区函数。保证一个name在一个分区，这样才能对value进行排序
     */
    private static class MyPartitioner extends Partitioner<MyType, IntWritable> {

        @Override
        public int getPartition(MyType myType, IntWritable intWritable, int numReduceTasks) {
            return (myType.getName().hashCode() & Integer.MAX_VALUE) % numReduceTasks;
        }
    }

    private static class MySortComparator extends WritableComparator {

        /**
         * 这个不能少，否则NPE
         */
        public MySortComparator() {
            super(MyType.class, true);
        }

        @Override
        public int compare(WritableComparable a, WritableComparable b) {
            MyType mya = (MyType) a;
            MyType myb = (MyType) b;
            if (mya.getName().equals(myb.getName())) {
                return mya.getValue().compareTo(myb.getValue())  ;
            }
            return mya.getName().compareTo(myb.getName());
        }
    }

    private static class MyGroupComparator extends WritableComparator {
        public MyGroupComparator() {
            super(MyType.class, true);
        }

        @Override
        public int compare(WritableComparable a, WritableComparable b) {
            MyType mya = (MyType) a;
            MyType myb = (MyType) b;
            return mya.getName().compareTo(myb.getName());
        }
    }
}

```


## 提醒

在遇到错误的时候记得看源码，很多参数的来源就在源码当中。