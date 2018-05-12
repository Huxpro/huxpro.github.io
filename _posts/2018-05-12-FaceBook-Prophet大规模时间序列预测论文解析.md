---
layout:     post
title:      Facebook Prophet大规模时间序列预测论文解析
subtitle:   可爱的论文搬运工
date:       2018-05-12
autor:      Yan He
header-img: img/facebook-prophet-1.jpg
catalog:    true
tags:
    - 论文
    - 时间序列
    - 机器学习
    - R
    - Python
---

>原文发在知乎上。

在今年三月prophet刚发布的时候就简单用过，但最近才想起去读paper……

------

首先，prophet是一个工业级应用，而不是说在时间序列预测的模型上有非常大的创新。

记得今年在参加一次猫眼电影票房预测的内部分享时，旁边坐了一个外卖的PM。结束时对方问我，有什么方法可以预测外卖的订单量。我当时想了想，诸如Holt-Winters指数平滑、ARIMA、或者deep learning的LSTM，似乎都不是那么容易解释。

时间序列预测对大部分公司而言都存在必要的需求，比如电商预测GMV，外卖O2O预测成交量波动以便于运力分配，酒店预测间夜量来调整定价与销售，等等。但通常而言，时间序列预测对不少公司来说是一个难题。主要原因除了时间序列预测本身就是玄学（大雾）之外，还要求分析师同时具备深厚的专业领域知识（domain knowledge）和时间序列建模的统计学知识。此外，时间序列模型的调参也是一个比较复杂而繁琐的工作。

prophet就是在这样的背景下的产物，将一些时间序列建模常见的流程与参数default化，来使不太懂统计的业务分析师也能够针对需求快速建立一个相对可用的模型。

很多商业行为是存在一定的时间相依的模式的。作者以Facebook上用户创造“事件”（events）来举例：

![img](https://pic4.zhimg.com/80/v2-ef385d40037fbbfd5b87e199e89683ef_hd.jpg)

可以看到用户创造事件的数量有很明显的时间序列特征：多种周期性、趋势性、节假日效应，以及部分异常值。

然后作者用R的forecast包里的几种常见的时间序列预测技术（ARIMA, 指数平滑等等）来建模，效果惨不忍睹：

![img](https://pic3.zhimg.com/80/v2-d8a8f169bfa29c87b95b0eb615e53733_hd.jpg)

图1是ARIMA，图2是指数平滑，图3是snaive，图4是tbats。

#模型结构

Prophet的本质是一个可加模型，基本形式如下：

![y(t) = g(t) + s(t) + h(t) + \varepsilon_{t}](https://www.zhihu.com/equation?tex=y%28t%29+%3D+g%28t%29+%2B+s%28t%29+%2B+h%28t%29+%2B+%5Cvarepsilon_%7Bt%7D)

其中$g(t)$是趋势项(trend)，$s(t)$是周期项(period)，$h(t)$是节假日项(holiday)，$\varepsilon_{t}$是误差项并且服从正态分布。

**趋势模型**

prophet里使用了两种趋势模型：饱和增长模型（saturating growth model）和分段线性模型（piecewise linear model）。两种模型都包含了不同程度的假设和一些调节光滑度的参数，并通过选择变化点（changepoints）来预测趋势变化。具体推导就不写了（展开来讲是一个很漫长的过程，有空补充），只写下最终形式：

**saturating growth model:**

![g(t) = \frac{C(t)}{1 + exp(-(k + a(t)^{T}\delta)(t - (m + a(t)^T\gamma)))}](https://www.zhihu.com/equation?tex=g%28t%29+%3D+%5Cfrac%7BC%28t%29%7D%7B1+%2B+exp%28-%28k+%2B+a%28t%29%5E%7BT%7D%5Cdelta%29%28t+-+%28m+%2B+a%28t%29%5ET%5Cgamma%29%29%29%7D)

**piecewise linear model：**

![g(t) = (k + a(t)^T\delta)t + (m + a(t)^T\gamma)](https://www.zhihu.com/equation?tex=g%28t%29+%3D+%28k+%2B+a%28t%29%5ET%5Cdelta%29t+%2B+%28m+%2B+a%28t%29%5ET%5Cgamma%29)

**周期模型**

prophet用傅里叶级数（Fourier series）来建立周期模型：

![s(t) = \sum_{n=1}^{N}({a_ncos(\frac{2\pi nt}{P}) + b_nsin(\frac{2\pi nt}{P}}))](https://www.zhihu.com/equation?tex=s%28t%29+%3D+%5Csum_%7Bn%3D1%7D%5E%7BN%7D%28%7Ba_ncos%28%5Cfrac%7B2%5Cpi+nt%7D%7BP%7D%29+%2B+b_nsin%28%5Cfrac%7B2%5Cpi+nt%7D%7BP%7D%7D%29%29)

对N的调节起到了低通滤波（low-pass filter）的作用。作者说对于年周期与星期周期，N分别选取为10和3的效果比较好。

**节假日与突发事件模型**

节假日需要用户事先指定，每一个节假日都包含其前后的若干天。模型形式如下（感觉就是一个虚拟变量）：

![Z(t) = [1(t\in D_1), ...,1(t\in D_L)]](https://www.zhihu.com/equation?tex=Z%28t%29+%3D+%5B1%28t%5Cin+D_1%29%2C+...%2C1%28t%5Cin+D_L%29%5D)

![h(t) = Z(t)\kappa](https://www.zhihu.com/equation?tex=h%28t%29+%3D+Z%28t%29%5Ckappa)

![\kappa \sim Normal(0, \nu^2)](https://www.zhihu.com/equation?tex=%5Ckappa+%5Csim+Normal%280%2C+%5Cnu%5E2%29)

#模型性能

还是使用上面Facebook的例子，作者给出了Prophet的模型拟合与预测能力：

![img](https://pic2.zhimg.com/80/v2-cb808afc95f559b0c7895e8a75b11086_hd.jpg)

![img](https://pic2.zhimg.com/80/v2-d83ed58f86a1459f4195acc217ec75ec_hd.jpg)

看起来比前面用R的forecast做的效果好了很多，并且不需要使用者具有很强的统计背景就能够轻松进行建模。

同时prophet支持将模型分解为单独的各项组成部分，并且实现起来很容易，只需要调用一行代码prophet_plot_components：

![img](https://pic1.zhimg.com/v2-9eb5121f2ad91362e3ae470cfe6f6174_r.jpg)

#适用范围

很明显，Prophet只适用于具有**明显的内在规律（或者说，模式）的商业行为数据。**

虽然官方案例里通常使用日数据的序列，但对于更短时间频段，比如小时数据，也是支持的。

但对于不具有明显趋势性、周期性的时间序列，使用Prophet进行预测就不适合了。比如前面有同学用Prophet来预测沪深300……先不说有效市场假说（EMH）否定了历史数据对未来价格拟合的可能性，就算市场存在模式，也不是能够被一个通用模型简单的线性分解成趋势和周期的。

我自己最早是基于内部历史数据，尝试公司风控的潜在损失做一个简单预测，但很明显，没有任何证据能说明过去的序列特征（比如风险集中趋势，外部环境影响，公司层面的合并等等）会在2017年重演。所以充其量就是拿来写写周报，以及为2017年风控预算做一点微小的贡献……

#总结

Prophet是一个比较好用的预测工具，特别是对我这种拿着forecast的ets和auto.arima也懒到自动定阶和模型选择的人来说（逃……

对业务分析师很友好，因为原理很简单，有R和python的基础上手也很容易。

通常能够给出一个还不错的预测结果。比如我就对某些业务线的交易数据跑了下预测，发现大部分都能work，诸如“春节效应”这种中国特色也能抓得比较准。
