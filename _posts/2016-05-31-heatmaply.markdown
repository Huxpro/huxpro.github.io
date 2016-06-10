---
layout:    post
title:     "New Interactive Heatmap with Plotly.js"
subtitle:  "基于heatmaply和plotly的交互式热力图"
date:      2016-05-31
author:    "Dann"
header-img:  "img/blog-helloworld.jpg"
catalog: true
tags:
    - Heatmap
    - R
    - plotly
    -Interactive
---

>新鲜出炉的交互式热图！

 ### Interactive Heatmap

 利用R绘制热力图比较简单，而随着可视化工具喷涌，交互式热力图在R中的实现也常见起来。以前有`heatmap`包，`d3heatmap`,现在则出现了速度更快，交互效果更好的`heatmaply`。

新包的作者<a href="https://gist.github.com/jonocarroll">Jonathan Carroll</a>基于gglot和plotly.js开发了这一款新包，并且可以完美的运行在各个端口。

```r

install.packages("heatmaply")

library(heatmaply)

heatmaply(mtcars, k_col = 2, k_row = 3) %>% layout(margin = list(l = 130, b = 40))
```
<iframe src="https://plot.ly/~talgalili/23.embed" width="450" height="400" frameborder="0" scrolling="no"></iframe>