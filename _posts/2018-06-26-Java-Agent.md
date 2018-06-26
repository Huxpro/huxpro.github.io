---
layout:     post
title:      "Java Agent"
subtitle:   " \"好好学习，天天向上\""
date:       2018-06-26 16:27:00
author:     "WQ"
header-img: "img/blogImg/2018-06-26.jpg"
catalog: true
tags:
    - Java
---

# Java Agent

![java-agent](../img/blogImg/2018-06-26/java-agent.png)

Java Instrumentation指的是可以用独立于应用程序之外的代理（agent）程序来监测和协助运行在JVM上的应用程序。这种监测和协助包括但不限于获取JVM运行时状态，替换和修改类定义等。 java SE5中使用JVM TI替代了JVM PI和JVM DI。提供一套代理机制，支持独立于JVM应用程序之外的程序以代理的方式连接和访问JVM。Instrumentation 的最大作用就是类定义的动态改变和操作。

优缺点：直接修改字节码，可以实现类似于Aop代理，对底层的入侵较大，但是对开发者更加的透明,很多性能风险工具，debug工具，动态诊断工具，spring-loaded都是通过这种方式实现的。注意lombok使用的技术和这个有点不同，lombok使用的是`JSR 269 Pluggable Annotation Processing APi`,这两者是有很大的不同。

JVMTI（Java Virtual Machine Tool Interface）是一套本地编程接口集合，它提供了一套”代理”程序机制，可以支持第三方工具程序以代理的方式连接和访问 JVM，并利用 JVMTI 提供的丰富的编程接口，完成很多跟 JVM 相关的功能，而Java Instruemtation就是使用的这个机制，但是JVMTI需要打包成动态链接库（随操作系统，如.dll/.so文件），并通过JVMTI agent加载。

这里稍微描述下JVMTI，作为jvm提供的额native编程接口，它的功能远大于Instrumentation API，并且可以再启动时（Agent_OnLoad)和运行时Attach（Agent_OnAttach）。

* 获取所有线程、查看线程状态、线程调用栈、查看线程组、中断线程、查看线程持有和等待的锁、获取线程的CPU时间、甚至将一个运行中的方法强制返回值……
* 获取Class、Method、Field的各种信息，类的详细信息、方法体的字节码和行号、向Bootstrap/System Class Loader添加jar、修改System Property……
* 堆内存的遍历和对象获取、获取局部变量的值、监测成员变量的值……
* 各种事件的callback函数，事件包括：类文件加载、异常产生与捕获、线程启动和结束、进入和退出临界区、成员变量修改、gc开始和结束、方法调用进入和退出、临界区竞争与等待、VM启动与退出……
* 设置与取消断点、监听断点进入事件、单步执行事件……

## Premain方式

从jdk5开始提供该方式，即在真正的main方法执行之前启动之前的代理程序（使用相同的类加载器），命令如下：`java -avaagent:agent_jar_path[=options] java_app_name`。

这个jar需要满足两个条件：

1. 代理类必须提供一个`public static void premain(String args, Instrumentation inst)`或者`public static void premain(String args)`。
1. jar包中的manifest必须含有Premain-Class属性，并且改属性的值为代理类全路径名。

多个agent同时被使用，会被顺序执行。

## Agentmain方式

 以Attach的方式载入，在Java程序启动后执行,这种方式是跨JVM进程的，例如jps，jstack，jmap都是使用的Attach api。

 这需要使用一个main方法运行，例如attach进程号为1234的JVM，然后加载agent的jar包

 ```java
 // VirtualMachine等相关Class位于JDK的tools.jar，需要手动导入这个jar
VirtualMachine vm = VirtualMachine.attach("1234");  // 1234表示目标JVM进程pid
try {
    vm.loadAgent(".../agent.jar");    // 指定agent的jar包路径，发送给目标进程
} finally {
    vm.detach();
}
```

目标jvm会执行agentmain方法。

这个jar需要满足两个条件：

 1. 代理类必须提供`public static void agentmain(String agentArgs, Instrumentation inst);`
 1. jar包的manifest需要配置属性Agent-Class

提醒，在编写manifest时候，idea会提示，或者使用maven的`maven-assembly-plugin`，如下

```xml
<plugin>
    <artifactId>maven-assembly-plugin</artifactId>
    <configuration>
        <archive>
            <manifestEntries>
                <Premain-Class>**.**.InstrumentTest</Premain-Class>
                <Agent-Class>**.**..InstrumentTest</Agent-Class>
                <Can-Redefine-Classes>true</Can-Redefine-Classes>
                <Can-Retransform-Classes>true</Can-Retransform-Classes>
            </manifestEntries>
        </archive>
    </configuration>
</plugin>
```

## 热部署

谈到这里就需要谈谈热部署的问题，jvm本身没有提供热部署的功能，就上面提到的instrumentation实现热部署的方案也有很大的局限性，只能修改方法体，不能修改或删除方法/成员。

现有的热部署方案有：

1. IDE提供的hotswap功能：例如idea或eclipse在debug时，默认开启HotSwap功能。用户可以在IDE里修改代码时，直接替换到目标程序的类里。不过这个功能只允许修改方法体，而不允许对方法进行增删改。
1. Jrebel、Spring-reload：突破了jvm只能修改方法体的限制，其实现方式是每个method call和field access的地方都做了一层代理，对于每次修改类，并不是直接retransformClasses，而是直接加载一个全新的类，由于方法调用和成员变量读写都被动态代理过，新修改的类自然能够成功“篡位”了。

题外话：

ide提供的debug功能，实质上也是通过JVMTI的agent实现的，在运行方法的时候，仔细看看idea控制台的输出，能够看到agent参数。JVITI agent会在debug连接时加载到debugee的JVM中。debuger（IDE）通过JDI（Java debug interface）与debugee（目标Java程序）通过进程通讯来设置断点、获取调试信息(通讯协议为Java Debug Wire Protocal(JDWP协议))。除了这些debug的功能之外，JDI还有一项redefineClass的方法，可以直接修改一个类的字节码。没错，它其实就是暴露了JVMTI的bytecode instrument功能，而IDE作为debugger，也顺带实现了这种HotSwap功能。

注意：所以在线上debug时，不能修改方法体，否则代码会直接被hotswap到线上。

## 参考

1. [谈谈Java Intrumentation和相关应用](http://www.fanyilun.me/2017/07/18/%E8%B0%88%E8%B0%88Java%20Intrumentation%E5%92%8C%E7%9B%B8%E5%85%B3%E5%BA%94%E7%94%A8/)