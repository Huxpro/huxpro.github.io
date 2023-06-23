---
layout:       post
title:        "How many instances of String are created?"
author:       "Jake"
header-style: text
catalog:      true
tags:
    - Tech
    - Java
    - Interview
    - 炒冷面
---

# 炒冷面一：String s = new String("Hello");创建了多少个String实例

## 前言
本篇开始将会连载关于面试题相关的文章，赐御名**炒冷面**系列，就此开始第一话。

## 背景
很多在面试的时候回遇到面试官问，以下 Java 代码在运行时会产生几个对象？
```java
String str1 = new String("Hello");
String str2 = new String("Hello");
```

通常面试答案很简单粗暴：总共 3 个对象，2 个在堆里还有 1 个在常量池里。没“追求”的面试官就会就此打住，但是秉持面试说的更深入越有优势的规律，咱高低得深入探讨一波，凭池里就 only one，堆有俩。

## 掰开揉碎
在讨论代码运行时的时候，我们会很自然地按解释型语言（例如 Python）的逻辑去看代码。在这样的视角下看，代码由机器自上而下按顺序执行，当执行到第一行新建 String 对象的代码时，jvm 会把字符串字面量 `Hello` 新建一个实例对象放进常量池，然后再由常量池对象作为构造器参数去新建一个 String 对象。执行到第二行时，从常量池中取出已经存在的对象，再去 new 出一个对象。
```java
-> String str1 = new String("Hello");
String str2 = new String("Hello");
```

然而这么看待 Java 代码的执行过程是错误🙅的，题目中提到的 “在代码运行时” 要分两个阶段来看，即`类加载`阶段和`代码执行`阶段。
在代码还没真正执行前，JVM 会进行`类加载`操作，而字符串字面量**有可能**会在这个时候成为新对象进入常量池中”等待召唤“。请注意⚠️，**有可能**是指若常量池中已经有 `Hello` 字符串对象，便不会新建。到了`代码执行`阶段，new 语句会把字面量对象作为参数传入构造器，按顺序新建 2 个放进堆的对象。

那么答案就会是这样：若常量池中无 `Hello` 字符串变量则会在类加载时新建对象，否则不会。在实际执行代码时，会从堆中创建 2 个新对象，所以新建的对象可能是 2 个有可能是 3 个。如果面试题语义想要更精准点，那么就应该修改成：以下 Java 代码在运行时会涉及几个对象？这样答案就固定下来了。

## 加餐
既然这两行代码轻则新建俩，重则新建仨对象，那必然开销很大。如果狠一点把 new String 放进循环不得爆炸💥（参考以下捣乱代码）
```java
for (int i = 0; i < 10000; i++) {
    String str = new String("Hello");
}
```
所以 Java 程序员口口相传的圣经《Effective Java》第三版第 6 条，翻译过来就是不要创建无用的对象，正确的做法是直接引用常量池中的对象
> Item 6: Avoid creating unnecessary objects
```java
for (int i = 0; i < 10000; i++) {
    String str = "Hello";
    ...
}
```

## 参考
《Effectiv Java》
[请别再拿“String s = new String("xyz");创建了多少个String实例”来面试了吧](https://www.iteye.com/blog/rednaxelafx-774673)