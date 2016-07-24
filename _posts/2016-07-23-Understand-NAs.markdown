---
layout:      post
title:       "Understanding NAs In R"
subtitle:    "理解R中缺失值的办法"
data:        2016-7-24 10:23:22
author:      "Dann"
header-img:  "img/nas.png"
tags:
       - R
       - NAs
---

> 理解NAs的一种小技巧

在数据分析中，NA（缺失值）和NULL（未知值）是清理中经常遇到的情形，前者表示遗失，后者则表示不存在。但在处理中，究竟怎么看待这两类情形呢？看到一篇<a href="http://www.r-bloggers.com/the-trick-to-understanding-nas-missing-values-in-r/">文章</a>给了一个非常有意思的办法

我们在R中运行以下的代码：

```r
NA^0

>> 1

NULL^0

>> numeric(0)
```
出现了一个有意思的状态：为什么NA的零次方是1呢？按照直觉，缺失值既然表示数据遗失，那么进行任何操作的结果都应该是NA。比如：

```r
NA*0

>> NA
```
首先理解NA的状态。把NA想像成数据框中的一个坑，这里面**一定**存在某个数值，但我们暂时不知道。那么按照定理，所有数的零次方都是为1。所以即便不能看见数，我们也知道结果必然是1。
而对于NULL，表示不存在这个数字，意味着在数据中根本不存在他的位置，那么无论是什么运算都无法产生结果。

更好得理解“坑”这个比喻，我们可以使用length函数来理解：
```r
a<-c(1,2,3,NA,4,5)

b<-c(1,2,3,NULL,4,5)

length(a);length(b)

>> [1] 6
[1] 5

mean(a);mean(b)
>> [1] NA
[1] 3
```
所以NULL所在的位置直接被忽略而不纳入考虑。因此a的均值受到NA的影响，不能给出计算值。后者则因为无视NULL，可以直接计算五个数值的均值。
当然我们还可以用别的方法理解NA和NULL的区别。如：

```r
NA || TRUE

>> TRUE
```
在逻辑序列中，逻辑值也可以进行判断,而如果是使用NULL进行逻辑判断，则提示出错。

当然还有很多办法来理解NA和NULL的区别。而在具体处理中，则要明确判断缺失值的状态和准确处理方式，以尽可能得到贴近事实的分析结果。关于R对NA处理的方式，可以查看手册中的<a href="https://cran.r-project.org/doc/manuals/r-release/R-lang.html#NA-handling">相关章节</a>。
