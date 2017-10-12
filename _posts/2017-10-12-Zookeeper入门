---
layout:     post
title:      "Hello Zookeeper"
subtitle:   " \"Zookeeper入门学习\""
date:       2017-10-12 15:56:00
author:     "WQ"
header-img: "img/blogImg/zookeeper_cartoon.jpg"
catalog: true
tags:
    - Zookeeper
---

# Zookeeper入门学习

注：参考文章
1. [ZooKeeper入门](http://newliferen.github.io/2015/07/24/ZooKeeper%E5%85%A5%E9%97%A8/)

Zookeeper作为分布式系统的基础组件，提供了很多功能（ps:都是玩家脑洞出来的，哈哈哈！）。例如：命名服务，发布订阅服务，负载均衡，分布式协调/通知，分布式锁服务，分布式队列服务等。
zk的基本安装使用，这里就不介绍了，下面就列出如何实现上面所说的功能。

## 命名服务

命名服务(Naming Service)提供了一种为对象命名的机制，可以定位任何通过网络可以访问的机器上的对象，使得用户可以在无需知道对象位置的情况下获取和使用对象。服务提供方在ZK上创建临时Node（全局唯一），服务消费方通过读取ZK上的临时Node节点获取到服务提供方信息，进而调用服务提供者。通过ZK的命名服务，可以达到服务提供者动态增加或减少服务提供者服务器数量。典型示例：阿里的Dubbo框架，即采用ZK作为注册中心。很多微服务基础组件也使用zk。[代码示例](https://github.com/ted-wq-x/personalCode/tree/master/zookeeper/src/main/java/com/go2going/naming),和参考文章有点不同。

## 发布订阅服务

发布订阅模型，即配置中心，可将应用可配置项发布到ZK上，供订阅者动态获取配置，同一集群使用同一套配置，实现配置集中、动态管理，避免修改配置后重启应用服务。（ps:这个太常见了，solr就是用的这个，所以我才接触zk的，哈哈哈哈!)，[代码示例](https://github.com/ted-wq-x/personalCode/tree/master/zookeeper/src/main/java/com/go2going/pubandsub)

注意事项：
1. watch是一次性触发的，如果获取一个watch事件并希望得到新变化的通知，需要重新设置watch
2. watch是一次性触发的并且在获取watch事件和设置新watch事件之间有延迟，所以不能可靠的观察到节点的每一次变化。要认识到这一点。
3. watch object只触发一次，比如，一个watch object被注册到同一个节点的getData()和exists()，节点被删除，仅对应于exists()的watch ojbect被调用
4. 若与服务端断开连接，直到重连后才能获取watch事件。

对于`getData`方法，有两个版本：同步调用的版本是：byte[] getData(String path, boolean watch,Stat stat)，异步调用的版本是：void getData(String path,Watcher watcher,AsyncCallback.DataCallback cb,Object ctx)，可以看到，前者是直接返回获取的结果，后者是通过AsyncCallback回调处理结果的。ctx是用于将参数传入cb的回调函数中。

## 负载均衡

服务器端负载均衡分为算法包括：轮循算法（Round Robin）、哈希算法（HASH）、响应速度算法（Response Time）、加权法（Weighted ）等。网上有文章提到“最少连接算法（Least Connection）”也是负载均衡算法的一种，当然，这样说是需要有前提条件的，就是当服务器性能良好，可以及时处理所有请求的时候，最少连接算法才能达到负载均衡的目的，否则最少连接的服务器可能正在处理比较耗时的操作，继续将请求分发到该服务器可能导致该服务器load值升高，性能下降。参见https://devcentral.f5.com/articles/back-to-basics-least-connections-is-not-least-loaded 。

这个就不演示了，命名服务就做了个轮询的负载均衡。

## 分布式锁

分布式锁有三中实现方式：Zookeeper、Memcached、Redis 。 

利用Zookeeper的EPHEMERAL_SEQUENTIAL类型节点及watcher机制，创建的节点都是有顺序的，每次选择最小编号的节点获得锁。当前节点watcher上一个节点，当上一个节点被删除时，或者上一个节点与zookeeper断开连接时（因为是临时节点），当前节点成为最小节点，从而获得锁。

简单来说，在路径下的节点都是要锁的（包含已经拿到锁的和等待拿锁的），是否拿到锁的依据是是否有比自己小的节点，没有则拿到锁，有则等待。[代码示例](https://github.com/ted-wq-x/personalCode/tree/master/zookeeper/src/main/java/com/go2going/lock)

## 分布式队列

分布式队列的实现和分布式锁的思想很类似，在指定的节点下，写入有序的子节点，出队时节点序号最小的先出队。[代码示例](https://github.com/ted-wq-x/personalCode/tree/master/zookeeper/src/main/java/com/go2going/queue)

注意该代码只适合一个消费者和多生产者的情况，如果是多消费者的解决方案得用到上面提到的分布式锁，在获取节点之前加锁，获取获取、删除、解锁，从而实现完整的FIFO。当然这种方案不适合性能高的场合，当然队列的数据也有限制。