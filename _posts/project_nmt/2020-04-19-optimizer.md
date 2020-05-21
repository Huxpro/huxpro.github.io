---
title: "优化方法optimizer总结"
subtitle: "SGD & "
layout: post
author: "echisenyang"
header-style: text
hidden: true
catalog: true
tags:
  - nmt
  - paper with code
---



本文仅对一些常见的优化方法进行直观介绍和简单的比较，主要是一阶的梯度法，包括SGD, Momentum, Nesterov Momentum, AdaGrad, RMSProp, Adam。 其中**SGD,Momentum,Nesterov Momentum是手动指定学习速率的**,而后面的**AdaGrad, RMSProp, Adam,就能够自动调节学习速率**。

## 梯度下降法

### **SGD**

SGD全名 stochastic gradient descent， 即随机梯度下降。不过这里的SGD其实跟MBGD(minibatch gradient descent)是一个意思，现在的SGD一般都指mini-batch gradient descent，即随机抽取一批样本,以此为根据来更新参数。
$$
W_{t+1} = W_t - \eta_t \Delta  
J(W_t)
$$
基本策略可以理解为”**在有限视距内寻找最快路径下山**“，因此每走一步，参考当前位置最陡的方向(即**梯度**)进而迈出下一步。可以形象的表示为：

![4t59d7](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/4t59d7.jpg)

- **优点**
  1. 训练速度快,对于很大的数据集,也能够以较快的速度收敛.SGD应用于凸问题时，k次迭代后泛化误差的数量级是O(1/sqrt(k))，强凸下是O(1/k)。
  2. **可能由于SGD在学习中增加了噪声，有正则化的效果**

- 缺点:
  1. 由于是抽取,因此不可避免的,得到的梯度肯定有误差.因此**学习速率需要逐渐减小.否则模型无法收敛** ，因为误差,所以每一次迭代的梯度受抽样的影响比较大,也就是说**梯度含有比较大的噪声,不能很好的反映真实梯度.**
  2. **容易陷入局部最优解**：由于是在有限视距内寻找下山的反向。当陷入平坦的洼地，会误以为到达了山地的最低点，从而不会继续往下走。所谓的局部最优解就是鞍点。落入鞍点，梯度为0，使得模型参数不在继续更新。



## 动量优化法

### **Momentum**

动量优化方法是在梯度下降法的基础上进行的改变，具有加速梯度下降的作用。SGD方法的一个缺点是，其更新方向完全依赖于当前的batch，因而其更新十分不稳定，每次迭代计算的梯度含有比较大的噪音。解决这一问题的一个简单的做法便是引入momentum。

![iFUKes](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/iFUKes.jpg)

**momentum即动量，它模拟的是物体运动时的惯性，即更新的时候在一定程度上保留之前更新的方向，同时利用当前batch的梯度微调最终的更新方向。这样一来，可以在一定程度上增加稳定性，从而学习地更快，并且还有一定摆脱局部最优的能力。**使用动量(Momentum)的随机梯度下降法(SGD)，主要思想是引入一个**积攒历史梯度信息动量**来加速SGD。

从训练集中取一个大小为n的小批量 ${X(1),X(2),...,X(n)}$ 样本，对应的真实值分别为 $Y(i)$，则**Momentum优化**表达式为：
$$
\left\{ \begin{aligned} & v_t = \alpha v_{t-1} + \eta_t \Delta J(W_t, X^{(i_s)}, Y^{(i_s)}  ) \\ & W_{t+1} = W_t - v_t \end{aligned} \right.
$$
其中，$v_t$ 表示 t 时刻积攒的加速度。$α$表示动力的大小，一般取值为0.9（表示最大速度10倍于SGD）。

**理解策略为：由于当前权值的改变会受到上一次权值改变的影响，类似于小球向下滚动的时候带上了惯性。这样可以加快小球向下滚动的速度。**

动量主要解决SGD的两个问题：

- 一是随机梯度的方法（引入的噪声）；
- 二是Hessian矩阵病态问题（可以理解为SGD在收敛过程中和正确梯度相比**来回摆动比较大**的问题）。

在梯度方向改变时，momentum能够降低参数更新速度，从而减少震荡；在梯度方向相同时，momentum可以加速参数更新， 从而加速收敛。总而言之，momentum能够**加速SGD收敛，抑制震荡**。



## 自适应学习率优化算法

目前的自适应学习率优化算法主要有：**AdaGrad算法**，**RMSProp算法**，**Adam算法**以及**AdaDelta算法**。

### **AdaGrad**

AdaGrad可以**自动变更学习速率**,只是需要设定一个**全局的学习速率ϵ**, AdaGrad算法，独立地适应所有模型参数的学习率，缩放每个参数反比于其所有梯度历史平均值总和的平方根。具有代价函数最大梯度的参数相应地有个快速下降的学习率，而具有小梯度的参数在学习率上有相对较小的下降。
$$
W_{t+1}=W_t -\frac{\eta_0}{\sqrt{\sum_{t'=1}^t (g_{t',i})+\epsilon}} \odot g_{t,i}
$$
从表达式可以看出，对出现比较多的类别数据，Adagrad给予越来越小的学习率，而对于比较少的类别数据，会给予较大的学习率。因此Adagrad适用于数据稀疏或者分布不平衡的数据集。

Adagrad 的主要优势在于不需要人为的调节学习率，它可以自动调节；缺点在于，随着迭代次数增多，学习率会越来越小，最终会趋近于0。

优点: 

- 能够实现学习率的自动更改。如果这次梯度大,那么学习速率衰减的就快一些;如果这次梯度小,那么学习速率衰减的慢一些。对于每个参数，随着其更新的总距离增多，其学习速率也随之变慢。

缺点: 

- 任然要设置一个变量ϵ ,经验表明，在普通算法中也许效果不错，但在深度学习中，深度过深时会造成训练提前结束。



### **RMSProp**

RMSProp通过引入一个衰减系数，**让r每回合都衰减一定比例**，类似于Momentum中的做法，是对AdaGrad算法的改进。RMSProp算法修改了AdaGrad的梯度积累为指数加权的移动平均，使得其在非凸设定下效果更好。
$$
\left\{ \begin{aligned} & E[g^2]_t = \alpha  E[g^2]_{t-1} + (1-\alpha)g_t^2  \\ &W_{t+1} = W_t - \frac{\eta_0}{\sqrt{E[g^2]_t+\epsilon}} \odot g_t\end{aligned} \right.
$$
RMSProp借鉴了Adagrad的思想，观察表达式，分母为$\sqrt{E[g^2]_t+\epsilon}$。由于**取了个加权平均，避免了学习率越来越低的的问题**，而且能自适应地调节学习率。

优点：

- 相比于AdaGrad,这种方法很好的解决了深度学习中过早结束的问题



### **AdaDelta**

思想：AdaGrad算法和RMSProp算法都需要指定全局学习率，AdaDelta算法结合两种算法每次参数的更新步长即:
$$
\Delta W_{AdaGrad, \ t} = - \frac{\eta_0}{\sqrt{\sum_{t'=1}^t (g_{t',i})+\epsilon}} \odot g_t\\ \Delta W_{RMSProp, \ t} =- \frac{\eta_0}{\sqrt{E[g^2]_t+\epsilon}} \odot g_t
$$

$$
\left\{ \begin{aligned} & E[g^2]_t = \alpha  E[g^2]_{t-1} + (1-\alpha)g_t^2  \\ & \Delta W_t = - \frac{\sqrt{\sum_{i=1}^{t-1}\Delta W_i }}{\sqrt{E[g^2]_t+\epsilon}}  \\ &W_{t+1} = W_t + \Delta W_t \end{aligned} \right.
$$

![PmUB1X](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/PmUB1X.png)

- 在模型训练的初期和中期，AdaDelta表现很好，加速效果不错，训练速度快。
- 在模型训练的后期，模型会反复地在局部最小值附近抖动。



### **Adam**

Adam(Adaptive Moment Estimation)本质上是**带有动量项的RMSprop**，它利用梯度的一阶矩估计和二阶矩估计动态调整每个参数的学习率。Adam的优点主要在于经过偏置校正后，每一次迭代学习率都有个确定范围，使得参数比较平稳。

$$
\left\{ \begin{aligned} & m_t = \beta_1m_{t-1}+(1-\beta_1)g_t \\& v_t = \beta_2v_{t-1}+(1-\beta_2)g_t^2  \\ & \hat{m}_t = \frac{m_t}{1-\beta_1^t}, \ \  \hat{v}_t = \frac{v_t}{1-\beta_2^t} \\ & W_{t+1} = W_t -\frac{\eta}{\sqrt{\hat{v}_t}+\epsilon}\hat{m}_t\end{aligned} \right.
$$
结合了Adagrad善于处理稀疏梯度和RMSprop善于处理非平稳目标的优点 ，对内存需求较小

为不同的参数计算不同的自适应学习率 ，也适用于大多非凸优化适用于大数据集和高维空间。



## 效果动图对比

![](https://img-blog.csdn.net/20180426130002689)

**下降速度**：

- 三个自适应学习优化器Adagrad、RMSProp与AdaDelta的下降速度明显比SGD要快，其中，Adagrad和RMSProp齐头并进，要比AdaDelta要快。
- 两个动量优化器Momentum和NAG由于刚开始走了岔路，初期下降的慢；随着慢慢调整，下降速度越来越快，其中NAG到后期甚至超过了领先的Adagrad和RMSProp。

![](https://img-blog.csdn.net/20180426113728916)



上图在一个存在鞍点的曲面，比较6中优化器的性能表现，从图中大致可以看出：

- 三个自适应学习率优化器没有进入鞍点，其中，AdaDelta下降速度最快，Adagrad和RMSprop则齐头并进。
- 两个动量优化器Momentum和NAG以及SGD都顺势进入了鞍点。但两个动量优化器在鞍点抖动了一会，就逃离了鞍点并迅速地下降，后来居上超过了Adagrad和RMSProp。
- 很遗憾，SGD进入了鞍点，却始终停留在了鞍点，没有再继续下降。

![](https://pic2.zhimg.com/v2-ed8f70ed5bb8e8a5ba4dd0cf99c0f557_1200x500.gif)

- 两个动量优化器Momentum和NAG的速度最快，其次是三个自适应学习率优化器AdaGrad、AdaDelta以及RMSProp，最慢的则是SGD。

- 两个动量优化器虽然运行速度很快，但是初中期走了很长的”岔路”。
- 三个自适应优化器中，Adagrad初期走了岔路，但后来迅速地调整了过来，但相比其他两个走的路最长；AdaDelta和RMSprop的运行轨迹差不多，但在快接近目标的时候，RMSProp会发生很明显的抖动。
- SGD相比于其他优化器，走的路径是最短的，路子也比较正。
  