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

----

上面所有的4中引用在java中对应的类是：

- FinalReference：实现类是Finalizer（经常会看到有一个Finalizer线程），该引用因为是package级别的，所以基本上不在开发者熟知
- PhantomReference：虚引用
- SoftReference：软引用
- WeakReference：弱引用

但是没有StrongReference，因为默认对象就是强引用。

### Finalizer(Object.finalize())

该类是package访问级别，所以我们是无法调用这个类的，构造器是private的，在唯一的new对象的地方：

```java
        /* Invoked by VM */
        static void register(Object finalizee) {
            new Finalizer(finalizee);
        }
```

看到该类是jvm调用的，在该类的静态代码块中，创建了FinalizerThread线程（daemon）并启动（这就是上面说的Finalizer线程），该线程会删除queue中的对象，然后从对象链中去掉并调用对象的finalize方法，，哈哈是不是恍然大悟！并且在register时传入的对象会添加到静态对象链当中，所以链中的对象无法被gc掉，除非手动删除。
这里需要说道Object.finalize()，jvm对f类的确定在类加载时就做出判断了，判断标准是：*是否实现了Object.finalize()，并且方法体是非空的*。

#### JVM何时调用register方法

调用时机有两个：执行new字节码分配内存空间时或者执行invokespecial字节码调用构造器时。
可以通过JVM参数`-XX:RegisterFinalizersAtInit`修改，默认值是true。

注意：当调用clone方法时，如果被clone的类是f类，那么在clone完成时会调用register。

##### JVM如何调用register方法

对于hotspot虚拟机，任何对象都继承于Object，该对象的构造器有一个空的构造器，该构造器的字节码指令有3条，最后一条是return，hotspot的实现是，在初始化Object类时将构造函数里的return指令替换为_return_register_finalizer指令，该指令并不是标准的字节码指令，是hotspot扩展的指令，这样在处理该指令时调用Finalizer.register方法，以很小的侵入性代价完美地解决了这个问题。

在object的finalize方法的注释中有几点需要强调的：

* finalize方法抛出的异常会被忽略，在runFinalizer()方法中可以看到这点
* 在finalize方法中重新赋值该对象，是对象可以被达到，finalize也只会被执行一次，因为一旦执行执行finalize方法就表示已经从对象链中删除了，根据代码如果链中不存在该对象就不会执行finalize
* finalize对象何时被放到ReferenceQueue中

在reference父类中，有一个`Reference Handler`线程，该线程会等待jvm调用lock.notify()并将需要回收的对象赋值给pending,然后执行代码将对象放到queue当中，能够让finalize线程执行。
所以对象需不需要进行回收是由gc决定的，如果f类对象只被finalize对象链中引用，那么jvm就会执行上面的逻辑。

finalize在SocksSocketImpl中被用于关闭socket，防止用户忘记关了，造成资源泄漏。

#### finalizer总结

- finalizer对象的主要作用，将f对象变成一个临时的强引用，防止被回收，然后执行finalize方法。
- f对象被回收至少经历2次gc，第一次确定需要执行finalize方法，第二次执行gc。但是有可能执行多次gc依然没有执行finalize方法。
- 由于finalize线程的优先级比较低，在cpu资源比较紧张时，有肯能延迟执行f类的finalize方法。这可能能造成对象进入老年代，造成gc时间变长。


# 总结

|引用类型|gc回收时间|用途|生存时间|
|---|----|---|---|
|强引用|never|对象的一般用途|JVM停止运行时|
|软引用|内存不足时|对象缓存|内存不足时，或者超时|
|弱引用|GC时|对象缓存|gc后终止|
|虚引用|unknown|unknown|unknown|

注：在Threadlocal中使用的ThreadLocalMap存放的Entry实现了WeakReference，这是为了解决map中key的内存泄漏（ThreadLocal没有提供remove）。
key是ThreadLocal，令ThreadLocal=null并不能被gc回收，因为该ThreadLocal还在Map中做为key，但是设为null，解除了对象的强引用，只有弱引用了，在下次gc时会被清除，防止了内存泄漏。