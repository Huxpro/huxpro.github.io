---
layout:     post
title:      "Hazelcast"
subtitle:   " \"好好学习，天天向上\""
date:       2019-06-11 00:00:00
author:     "WQ"
header-img: "img/blogImg/2019-06-11/2019-06-11-1.jpg"
catalog: true
tags:
    - Hazelcast
---

# Hazelcast学习

Server和client是分开的

server的创建使用 Hazelcast.newHazelcastInstance(cfg)，使用hazelcast的jar。

client的创建使用HazelcastClient.newHazelcastClient(cfg)，使用hazelcast-client的jar。

## 日志

由于jar本身不依赖于任何jar，所以其内部提供了一个日志框架用于融化其他日志系统。

关键类：

```
ILogger
LoggerFactory：创建ILogger，每个日志类型都有对于的工厂类，
LogListener：监听器
LogEvent:事件的定义
LoggingService：核心类，负责使用LoggerFactory创建ILogger，这里对创建方法进行了包装添加了监听器
Logger：核心创建类，按照配置的参数，先创建工厂然后创建ILogger
```

实现方式很不错，值得学习。

## SPI

基于java的SPI机制进行了修改，使其能够在多classloader上工作。基本代码比较一致，但是在获取classLoader时有几处不同，主要在于其内部定义了classLoader。

还有很多的插件机制是使用xml配置的方式，用于将特定接口的实现jar放到usr-lib目录中（start.sh会加载这个路径），然后在xml配置中进行声明即可。



## 生命周期

这里管理的是程序的生命周期而不是对象的生命周期，通过注册Listener对周期中的关键时间点进行监控，这里对这些Listener的回调是使用单独的线程（单独的client端）。其内部实现有3种。



## 配置xml解析

对xml进行解析时，使用 JDK自带的解析器，对解析完成后的数据放到各个config类中（相当多），这些配置在Config类中都能拿到。配置的来源包括配置文件，系统配置，java命令行参数，默认配置。



## Collection类的创建

通过HazelcastInstance 获取相关的类如list，set等，调用HazelcastInstanceImpl中的ProxyService.getDistributedObject()获取每个类型的Service。

在ProxyServiceImpl中，Service的创建在ProxyRegistry中，这里很绕，到最后是在ServiceManagerImpl中获取的service，在这个类中手动注册了所有的service。

在获取了各个类的service，获取相应类的Proxy，该类实现默认的java集合类接口或继承默认的父类

# Jet

设计思路
将DAG进行并行化计算。

使用ringbuffer进行任务缓存，使用多线程进行计算实现MapReduce。

reduce阶段如何并行化？

对数据进行分区从而实现并行化计算，即将单一的数据发送到相同的计算线程中去

数据分区带来的问题及解决方式？

额外的序列化/反序列化开销和网络开销。解决方式是在本地先进行reduce，将reduce后的结果进行combine





### DAG

#### Vertex

name,ProcessorSupplier（提供Processor）

表示处理单元，分为source，processor，sink

#### Edge

表示输出的流通方向，从source vertex到destination vertex

#### DAG

使用邻接表表示

#### RingBuffer

相对于Blocked Queue，基于Array的优势

1. 无锁（单生产者对N消费者当然不用锁，一个只写，N个只读）
2. 利用cpu的cache line，即缓存友好， 缓存填充，这样可以避免伪共享
3. 复用内存减少分配新空间带来的时间和空间损耗，防止GC

#### TaskLet

作为线程调度的最小单位，

```
ProcessorTasklet
StoreSnapshotTasklet
ReceiverTasklet
SenderTasklet
```

执行由TaskletExecutionService负责，对于非Cooperative的tasklet在单独的线程中执行，否则共享执行线程（使用CopyOnWriteArrayList缓存taskLet），对于默认的8线程数，意味着同时有8个tasklet被执行。

![1554279497229](/img/blogImg/2019-06-11/hazelcast-1.png)

# 补充

## CPU cache

以8600K为例，参数是6核心

| L1$  | 384 KiB | `L1I$192 KiB6x32 KiB 8-way set associative`   <br />  `L1D$192 KiB6x32 KiB 8-way set associative` |
| ---- | ------- | ------------------------------------------------------------ |
|      |         |                                                              |
| L2$  | 1.5 MiB | 6x256 KiB4-way set associative write-back                    |
|      |         |                                                              |
| L3$  | 9 MiB   | 6x1.5 MiB12-way set associative write-back                   |

每个核心的缓存大小除以6。

L1缓存有分为L1i和L1d，分别用来存储指令和数据。

L2缓存是不区分指令和数据的。L3缓存多个核心共用一个，通常也不区分指令和数据

还有一种缓存叫TLB，它主要用来缓存MMU（内存管理单元）使用的页表，通常我们讲缓存（cache)的时候是不算它的。

Cache存储数据是固定大小为单位的，称为一个Cache entry，这个单位称为Cache line或Cache block。它的Cache line大小与DDR3、4一次访存能得到的数据大小是一致的，即64Bytes。对于ARM来讲，较旧的架构(新的不知道有没有改）的Cache line是32Bytes，但一次内存访存只访问一半的数据也不太合适，所以它经常是一次填两个Cache line，叫做double fill。

CPU从Cache数据的最小单位是字节，Cache从Memory拿数据的最小单位（这里不讲嵌入式系统）是64Bytes，Memory从硬盘拿数据通常最小是4092Bytes。

针对写操作，有两种写入策略，分别为write back和write through。write through策略下，数据直接同时被写入到Memory中，在write back策略中，数据仅写到Cache中，此时Cache中的数据与Memory中的数据不一致，Cache中的数据就变成了脏数据(dirty)。如果其他部件（DMA， 另一个核）访问这段数据的时候，就需要通过**Cache一致性协议**(Cache coherency protocol)保证取到的是最新的数据。另外这个Cache被替换出去的时候就需要写回到内存中。

### Java中对Cpu cache的利用

为了提高缓存命中率，需要充分发挥时间局部性和空间局部性

空间局部性：一个Cache Line有64字节块，我们可以充分利用一次加载64字节的空间，把程序后续会访问的数据，一次性全部加载进来，从而提高Cache Line命中率（而不是重新去寻址读取）

时间局部性：自第一次加载到Cache Line后，后面的访问就可以多次从Cache Line中命中，从而提高读取速度（而不是从下层缓存读取）

在多线程情况如果多个core同时加载相同的cache line，那么当一个core中修改了cache line中的值会造成其他core中缓存行失效，如果多个core修改一个行中的数据，会造成串行执行。

处理伪共享有两种方式

1. 使用行填充，增大数组元素的间隔使得不同线程存取的元素位于不同的cache line上。
2. 在每个线程中创建全局数组各个元素的本地拷贝，然后结束后再写回全局数组。

例如：

```java
public final static class VolatileLong {
    volatile long p0, p1, p2, p3, p4, p5, p6;
    //按照java对象的内存分配策略，value值会独占一个缓存行
    public volatile long value = 0;
    volatile long q0, q1, q2, q3, q4, q5, q6;
}
```

最优化的设计是考虑清楚哪些变量是不变的，哪些是经常变化的，哪些变化是完全相互独立的，哪些属性一起变化，将一起变化的放在一个缓存行中，在jdk1.8中有个@sun.misc.Contended注解避免伪共享（需要 -XX:-RestrictContended），表示变量独占一个缓存行，相同的value表示在同一缓存行中。原理是在使用此注解的对象或字段的前后各增加128字节大小的padding，使用2倍于大多数硬件缓存行的大小来避免相邻扇区预取导致的伪共享冲突。具体可以参考[http://mail.openjdk.java.net/pipermail/hotspot-dev/2012-November/007309.html](https://link.jianshu.com?t=http://mail.openjdk.java.net/pipermail/hotspot-dev/2012-November/007309.html)。

```java
public class FalseSharing implements Runnable {

    public final static int NUM_THREADS = 4; // change
    public final static long ITERATIONS = 500L * 1000L * 1000L;
    private final int arrayIndex;

    // private static VolatileLong[] longs = new VolatileLong[NUM_THREADS];
   // private static VolatileLong2[] longs = new VolatileLong2[NUM_THREADS];
   private static VolatileLong3[] longs = new VolatileLong3[NUM_THREADS];

    static {
        for (int i = 0; i < longs.length; i++) {
            // longs[i] = new VolatileLong(); //38s
            // longs[i] = new VolatileLong2(); //4s
            longs[i] = new VolatileLong3();//启用-XX:-RestrictContended 4s,没启用44s
        }
    }

    public FalseSharing(final int arrayIndex) {
        this.arrayIndex = arrayIndex;
    }

    public static void main(final String[] args) throws Exception {
        long start = System.nanoTime();
        runTest();
        System.out.println("duration = " + TimeUnit.NANOSECONDS.toSeconds(System.nanoTime() - start));
    }

    private static void runTest() throws InterruptedException {
        Thread[] threads = new Thread[NUM_THREADS];

        for (int i = 0; i < threads.length; i++) {
            threads[i] = new Thread(new FalseSharing(i));
        }

        for (Thread t : threads) {
            t.start();
        }

        for (Thread t : threads) {
            t.join();
        }
    }

    public void run() {
        long i = ITERATIONS ;
        while (0 != i--) {
            longs[arrayIndex].value = i;
        }
    }

    public final static class VolatileLong {
        public volatile long value = 0L;
    }

    // long padding避免false sharing
    // 按理说jdk7以后long padding应该被优化掉了，但是从测试结果看padding仍然起作用
    public final static class VolatileLong2 {
        volatile long p0, p1, p2, p3, p4, p5, p6;
        public volatile long value = 0L;
        volatile long q0, q1, q2, q3, q4, q5, q6;
    }

    /**
     * jdk8新特性，Contended注解避免false sharing
     * Restricted on user classpath
     * Unlock: -XX:-RestrictContended
     */
    @sun.misc.Contended
    public final static class VolatileLong3 {
        public volatile long value = 0L;
    }
}
```

