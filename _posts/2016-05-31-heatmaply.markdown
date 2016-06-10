---
layout:     post
title:      "New Interactive Heatmap with Plotly.js "
subtitle:   "基于heatmaply和plotly的交互式热力图"
data:       2016-5-31 15:23:22
author:     "Dann"
header-img: "img/post-spplot.jpg"
tags:
     - Heatmap
     - R
     - plotly
     - Data Visual
---

> 快做个新鲜出炉的交互式热图

### Interactive Heatmap

利用R绘制热力图比较简单，而随着可视化工具喷涌，交互式热力图在R中的实现也常见起来。以前有`heatmap`包，`d3heatmap`包，今天则出现了速度更快，交互效果更好的`heatmaply`包（我喜欢）。

新包作者<a href="https://gist.github.com/jonocarroll">Jonathan Carroll</a>基于gglot和plotly.js开发了这一款新包，并且可以完美的运行在各个端口。如下图，用老家伙`mtcars`生成了内嵌在网页中的交互热力图。

<iframe src="https://plot.ly/~talgalili/23.embed" width="630" height="560" frameborder="0" scrolling="no"></iframe>

而当我们运行下方的代码时，在Rstudio中则会出现同样的效果：

```r

install.packages("heatmaply")

library(heatmaply)

heatmaply(mtcars, k_col = 2, k_row = 3) %>% layout(margin = list(l = 130, b = 40))
```
![img](/img/in-post/heatmap.png)



