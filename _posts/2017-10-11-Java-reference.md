---
layout:     post
title:      "Java Reference"
subtitle:   " \"Java的四种引用状态\""
date:       2017-10-11 22:50:00
author:     "WQ"
header-img: "img/blogImg/2016-11-06.jpg"
catalog: true
tags:
    - Java
---

# jvm对象的四种引用状态

主要是解决内存不够的问题，所以经常在缓存功能上使用。如果reference类型的数据中存储的数值代表的是另外一块内存的起始地址，就称这块内存代表着一个引用。当内存空间还足够时，则能保留在内存之中；如果内存空间在进行垃圾收集后还是非常紧张，则可以抛弃这些对象。

在jdk1.2之后，将引用分为强引用（Strong Reference）、软引用（Soft Reference）、弱引用（Weak Reference）、虚引用（Phantom Reference）4种，这4中引用强度一次减弱。

* 强引用就是指在程序代码之中普遍存在的，类似"Object obj = new Object()"这类的引用，只要强引用还存在，垃圾收集器永远不会回收掉被引用的对象
* 软引用是用来描述一些还有用但并非必需的对象，对于软引用关联着的对象，在系统将要发生内存溢出异常之前，将会把这些对象列进回收范围进行第二次回收。如果这次回收还没有足够的内存，才会抛出内存溢出异常。在JDK1.2之后，提供了SoftReference类来实现软引用
* 弱引用也是用来描述非必需对象的，但是它的强度比软引用更弱一些，被弱引用关联的对象，只能生存到下一次垃圾收集发生之前。当垃圾收集器工作时，无论当前内存是否足够，都会回收掉只被弱引用关联的对象。在JDK1.2之后，提供了WeakReference类来实现弱引用
* 虚引用也成为幽灵引用或者幻影引用，它是最弱的一中引用关系。一个对象是否有虚引用的存在，完全不会对其生存时间构成影响，也无法通过虚引用来取得一个对象实例。为一个对象设置虚引用关联的唯一目的就是能在这个对象被收集器回收时收到一个系统通知。在JDK1.2之后，提供给了PhantomReference类来实现虚引用

## 测试准备

```java
public class ReferenceTest {
    private static final int _1MB = 1024 * 1024;
    public static void main(String[] args) {

    }
}
```

测试环境jdk1.9,JVM参数`-Xms20M -Xmx20M -Xmn10M -XX:SurvivorRatio=8 -verbose:gc  -Xlog:gc*`。
参数解释：

* 堆大小固定为20M
* 新生代大小为10M，SurvivorRatio设置为8，则Eden区大小=8M，每个Survivor区大小=1M，每次有8M的新生代内存空间可用来new对象
* 在jdk1.9中默认是g1收集器
* 当发生GC的时候打印GC的简单信息，当程序运行结束打印GC详情

```
[0.027s][info][gc,heap] Heap region size: 1M
[0.029s][info][gc     ] Using G1
[0.029s][info][gc,heap,coops] Heap address: 0x00000000fec00000, size: 20 MB, Compressed Oops mode: 32-bit
[0.630s][info][gc,start     ] GC(0) Pause Young (G1 Evacuation Pause)
[0.630s][info][gc,task      ] GC(0) Using 4 workers of 4 for evacuation
[0.633s][info][gc,phases    ] GC(0)   Pre Evacuate Collection Set: 0.0ms
[0.633s][info][gc,phases    ] GC(0)   Evacuate Collection Set: 2.6ms
[0.633s][info][gc,phases    ] GC(0)   Post Evacuate Collection Set: 0.6ms
[0.633s][info][gc,phases    ] GC(0)   Other: 0.1ms
[0.633s][info][gc,heap      ] GC(0) Eden regions: 10->0(8)
[0.633s][info][gc,heap      ] GC(0) Survivor regions: 0->2(2)
[0.633s][info][gc,heap      ] GC(0) Old regions: 0->2
[0.633s][info][gc,heap      ] GC(0) Humongous regions: 0->0
[0.633s][info][gc,metaspace ] GC(0) Metaspace: 6641K->6641K(1056768K)
[0.633s][info][gc           ] GC(0) Pause Young (G1 Evacuation Pause) 10M->3M(20M) 3.430ms
[0.633s][info][gc,cpu       ] GC(0) User=0.00s Sys=0.00s Real=0.00s
[0.814s][info][gc,heap,exit ] Heap
[0.814s][info][gc,heap,exit ]  garbage-first heap   total 20480K, used 10489K [0x00000000fec00000, 0x00000000fed000a0, 0x0000000100000000)
[0.814s][info][gc,heap,exit ]   region size 1024K, 8 young (8192K), 2 survivors (2048K)
[0.814s][info][gc,heap,exit ]  Metaspace       used 7467K, capacity 7644K, committed 7936K, reserved 1056768K
[0.814s][info][gc,heap,exit ]   class space    used 683K, capacity 712K, committed 768K, reserved 1048576K

```

堆的内存：

|组成|	详解|
|----|----|
|Young Generation|	即图中的Eden + From Space + To Space|
|Eden|存放新生的对象|
|Survivor Space|有两个，存放每次垃圾回收后存活的对象|
|Old Generation	Tenured Generation| 即图中的Old Space 主要存放应用程序中生命周期长的存活对象|

对于[java9的G1参看文章](http://www.jianshu.com/p/fd18fa1d09d2)

具体测试[参考文章](http://www.cnblogs.com/xrq730/p/7082471.html)