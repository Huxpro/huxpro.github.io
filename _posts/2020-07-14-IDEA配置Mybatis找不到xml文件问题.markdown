---
layout:     post
title:      "IDEA 配置 MyBatis 后无法找到 mapper 的xml文件"
subtitle:   ""
date:       2020-07-14 16:43:00
author:     "lvjb"
header-img: "img/blog-mybatis-idea-head.jpeg"
catalog: true
tags:
    - MyBatis
    - 编程
---

### 问题

&emsp;&emsp;今天写了个 MyBatis 测试代码，运行时报下面的错

`org.apache.ibatis.binding.BindingException: Invalid bound statement (not found): com.lvjb.mapper.RegionMapper.getRegion
 	at org.apache.ibatis.binding.MapperMethod$SqlCommand.<init>(MapperMethod.java:189)
 	at org.apache.ibatis.binding.MapperMethod.<init>(MapperMethod.java:43)
 	at org.apache.ibatis.binding.MapperProxy.cachedMapperMethod(MapperProxy.java:58)
 	at org.apache.ibatis.binding.MapperProxy.invoke(MapperProxy.java:51)
 	at com.sun.proxy.$Proxy0.getRegion(Unknown Source)
 at com.lvjb.test.Main.main(Main.java:34)`
    
### 解决方案

1. 在 pom 文件里加入 xml 文件的编译配置。
2. 将 xml 文件放进 resources 文件夹里。
    
### 解决过程

&emsp;&emsp;一开始看到这个报错，'Invalid bound statement (not found)'，我认为是 xml 的命名空间地址没有和接口对应上。
检查完地址、文件名之后均没问题。后来考虑没有找到会不会编译时出了问题，看了下 target 文件夹，果然没有 xml 的编译文件。
 ![](../img/in-post/post-idea-mybatis/post-mybatis-no-xml.png)
找到问题之后，解决就是顺势而为的事情了。^_^
 
### 问题分析
&emsp;&emsp; 使用 IDEA 开发工程就有出现这种问题的可能，原因是 IDEA 不会将 xml 等资源文件打包进 class 文件夹，不过 Eclipse开发
不会碰到这种问题。
我采用的具体的解决方式如下：
 ![](../img/in-post/post-idea-mybatis/post-mybatis-pom-build.jpg)
 
### 拓展
&emsp;&emsp;一般来说这个报错是由于 xml 文件和相应的 interface 文件没有对应上导致的。首先排查 xml 文件的 namespace，其次应检查
函数名是否一一对应。这样应该能解决绝大多数此问题。

### 思考总结
&emsp;&emsp;这次的问题是超出我平时的解决的问题范围外的，整理了下解决思路，碰到问题首先排查了该框架（MyBatis）本身限制可能导致的问题，
如无法解决，就应该考虑更深一层，比如这次问题排除掉代码本身的问题，应该从整个工程的角度考虑，比如编译、maven配置等等。另一方面，后面如果碰到找不到文件等问题，
我会考虑编译器本身 feature 的影响，如果有碰到，我会继续整理更新。

 
 





