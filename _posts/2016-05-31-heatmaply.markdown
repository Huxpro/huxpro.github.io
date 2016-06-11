---
layout:     post
title:      "New Interactive Heatmap with Plotly"
subtitle:   "基于heatmaply和plotly的交互式热力图"
data:       2016-5-31 15:23:22
author:     "Dann"
header-img: "img/post-heatmaply.png"
tags:
     - Heatmap
     - R
     - plotly
     - Data Visual
---

> 手把手做个新鲜出炉的网页交互热图

### Interactive Heatmap

利用R绘制热力图比较简单，而随着可视化工具喷涌，交互式热力图在R中的实现也常见起来。以前有`heatmap`包，`d3heatmap`包，今天则出现了干脆利落的`heatmaply`包（我喜欢）。

新包作者<a href="https://gist.github.com/jonocarroll">Jonathan Carroll</a>基于gglot2和plotly.js开发了这一款新包，并且可以完美运行在各个端口。如下图，用老家伙`mtcars`生成了内嵌在网页中的交互热力图。

<iframe src="https://plot.ly/~talgalili/23.embed" width="630" height="560" frameborder="0" scrolling="no"></iframe>

而当我们运行下方的代码时，在Rstudio中会出现同样的效果：

```r
install.packages("heatmaply")

library(heatmaply)

heatmaply(mtcars, k_col = 2, k_row = 3) %>% layout(margin = list(l = 130, b = 40))
```
![img](/img/in-post/heatmap.png)

高维数据瞬间被推平的感觉实在是太美好了。所以轮到我们我自己要怎么实现呢？

### Do It Yourself

#### 1. 安装相关的包：作者提供了以下两种安装方式
```r
#1-稳定版本的

install.packages("heatmaply") 

#2-github开发版

#先安装或者运行

install.packages('installr'); install.Rtools()

#安装devtools

install.packages.2 <- function (pkg) if (!require(pkg)) install.packages(pkg)#制定函数

install.packages.2('devtools')

devtools::install_github("ropensci/plotly") 

devtools::install_github('talgalili/heatmaply')
```
随后开始运行

```r
library(heatmaply)

heatmaply(mtcars)

heatmaply(mtcars, k_col = 2, k_row = 3) %>% layout(margin = list(l = 100, b = 100))

#k_col、k_row设定色彩种类,数值不应该超过所涉变量的范围
#Pipe操作连接margin函数以调整显示尺寸
```

```r
heatmaply(cor(mtcars), k_col = 2, k_row = 2,limits = c(-1,1)) %>% layout(margin = list(l =

40, b = 40),colors = heat.colors(100))

#插入相关系数函数作为热力数值，limits作为显示范围从负相关到正相关.colors函数用以调整色彩，其他命令如下

heatmaply(cor(mtcars),

scale_fill_gradient_fun = ggplot2::scale_fill_gradient2(low = "blue", 

high = "red", midpoint = 5, limits = c(-1, 1)),k_col = 2, k_row = 3) %>% layout(margin = 

list(l = 100, b = 100))
```
基本上，这些代码已经可以在R实现交互式热力图了。下面的问题是如何在网页端中实现？


### Plotly For R
作为第三方开源库的`Plotly`出场了。`heatmaply`就是依托`Plotly`服务的。

首先需要注册一个<a href="https://plot.ly">Plotly</a>网站的帐号，注册成功后，进入到个人页面（profile）中，点击API Keys产生自己的钥匙。

![img](/img/in-post/plotlyapi.png)

之后，就可以回到R部署所需的包：

```r
install.packages("plotly")

library(plotly)

plotly_username="******"#你的用户名

plotly_api_key="*****"#你的API

library(heatmaply)#加载heatmaply包

a<-heatmaply(mtcars, k_col = 2, k_row = 3) %>% layout(margin = list(l = 130, b = 40))

plotly_POST(a, filename = "heatmap", fileopt = "new",sharing = "public")
```
到此，`plotly`就已经成功上传了你的作品。然后回到自己的页面，就会看到已经出现的分享页面

![img](/img/in-post/plotlyshare.png)

选择`iframe`格式，就可以轻松把他们插入到自己的页面了。如下是我生成的页面：

<iframe width="900" height="800" frameborder="0" scrolling="no" src="https://plot.ly/~dannsaoyou/1.embed"></iframe>

### Another Way
如果从R本地生成`Html`文件的话，可以使用`<iframe>`，`</iframe>`的方式将其移入自己的网站中，这样子比使用`Plotly`更加方便，但是传播并不方便。

### Over
以上是对5月31日发布的heatmaply的使用说明，如果有错误或优化，<a href="mailto:dannsaoyou@gmail.com">欢迎告诉我。</a>




