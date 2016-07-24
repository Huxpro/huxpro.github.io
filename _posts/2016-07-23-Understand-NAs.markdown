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

>>numeric(0)
```
