---
layout:     post
title:      "spark单机部署及样例运行"
subtitle:   "Deploy spark in local host."
date:       2016-08-12 8:00:00
author:     "XuXinkun"
header-img: "img/post-bg-local-spark.jpg"
tags:
    - spark
---

# spark单机运行部署

## 环境预装

需要预先下载jdk和spark。机器使用centos6.6(推荐)。然后依次运行

```
[root@spark-master root]# cd /root

#安装必要的软件
[root@spark-master root]# yum install -y tar git curl wget

#下载jdk
[root@spark-master root]# wget --no-check-certificate --no-cookies --header "Cookie: oraclelicense=accept-securebackup-cookie"  http://download.oracle.com/otn-pub/java/jdk/8u91-b14/jdk-8u91-linux-x64.rpm

#安装jdk
[root@spark-master root]# rpm -ivh jdk-8u91-linux-x64.rpm

#下载spark
[root@spark-master root]# wget http://mirrors.hust.edu.cn/apache/spark/spark-1.6.2/spark-1.6.2-bin-hadoop2.6.tgz
  
#解压spark
[root@spark-master root]# tar xzvf spark-1.6.2-bin-hadoop2.6.tgz
```

## 配置

1. 关闭selinux。`setenfore 0`。
2. 通过`hostname`查看机器名，然后加入到`/etc/hosts`中。
3. 配置`/etc/profile`。在文件最后添加`export JAVA_HOME=/usr/java/jdk1.8.0_91`。然后运行`source /etc/profile`使其生效。

## 运行spark服务

启动spark master服务

```
[root@spark-master root]# cd /root/spark-1.6.2-bin-hadoop2.6
[root@spark-master spark-1.6.2-bin-hadoop2.6]# ./sbin/start-master.sh
```

启动spark node服务

```
[root@spark-master root]# cd /root/spark-1.6.2-bin-hadoop2.6
[root@spark-master spark-1.6.2-bin-hadoop2.6]# ./sbin/start-slave.sh spark://node1:7077
```

> node1为机器名。根据实际的机器名进行修改。

# spark样例运行

## 通过pyspark进行运算

这里以统计`/etc/profile`的行数为例。

```
[root@spark-master root]# cd /root/spark-1.6.2-bin-hadoop2.6/bin
[root@spark-master bin]# ./pyspark --master local[2]

# 导入数据
>>> distFile = sc.textFile("/etc/profile")

# 统计行数
>>> distFile.count()
```

这里`local[2]`代表了在本地启动两个线程模拟node进行计算。如果搭建完成了本地的搭建，即可以使用`./pyspark --master spark://node1:7077`,从而使用本地的node进行计算。

## 任务提交

pyspark是使用交互的方式进行提交任务。当然也可以通过`spark-submit`进行提交。

首先创建test.py文件，文件内容如下：

```
from pyspark import SparkContext
sc = SparkContext("local", "Simple App")
distFile = sc.textFile("/etc/profile")
print distFile.count()
```

使用`spark-submit`提交任务。

```
[root@spark-master root]# cd /root/spark-1.6.2-bin-hadoop2.6
[root@spark-master spark-1.6.2-bin-hadoop2.6]# ./bin/spark-submit --master local[2] test.py
```

# 参考资料

- [spark官网文档](http://spark.apache.org/docs/1.6.2/)
- [spark入门](http://spark.apache.org/docs/1.6.2/quick-start.html)
- [spark部署](http://spark.apache.org/docs/1.6.2/spark-standalone.html)
- [spark编程指南](http://spark.apache.org/docs/1.6.2/programming-guide.html)

