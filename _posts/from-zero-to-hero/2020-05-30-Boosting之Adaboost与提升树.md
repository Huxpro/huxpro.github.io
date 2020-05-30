---
title: "Boosting之Adaboost与提升树"
subtitle: "ID3/C4.5/CART/Random Forest/Adaboost/GBDT/Xgboost/LightGBM"
layout: post
author: "echisenyang"
header-style: text
hidden: true
catalog: true
tags:
  - 输出计划
---



![C87U4t](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/C87U4t.jpg)

### Adaboost（Boosting思想）

#### 强可学习与弱可学习

- **弱可学习的最低要求：比随机猜测好，即大于0.5**
- **发现弱可学习比发现强可学习更简单，故想办法找到弱可学习算法并将其提升为强可学习**
- **弱可学习，即我们之前提及的“弱模型”，具有偏差大，方差小的特点，主要目标是降偏差**

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/oLYkIS.png" alt="oLYkIS" style="zoom:50%;" />

#### Adaboost的巧妙思想

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/PJoiFb.png" alt="PJoiFb" style="zoom: 50%;" />

![8.提升方法-1](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/8.提升方法-1.jpg)

![8.提升方法-2](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/8.提升方法-2.jpg)

#### 前向分布算法

![8.提升方法-3](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/8.提升方法-3.jpg)

#### 前向分布算法看Adaboost（指数损失）

![8.提升方法-4](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/8.提升方法-4.jpg)

### 提升树

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/pRb2ok.png" alt="pRb2ok" style="zoom:50%;" />

#### 1.回归提升树 (平方损失)

![8.提升方法-5](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/8.提升方法-5.jpg)

#### 2.梯度提升树 (GBDT、一般损失)

提升树利用法模型与前向分歩算法实现学习的优化过程。**当损失函数是平方损失和指数损失函数时，每一步优化是很简单的**。但对**一般损失函数**而言，往往**每一步优化并不那容易**。

- GDBT中文名称叫做梯度提升树。其基本原理和残差树类似，基学习器是基于CART算法的回归树，模型依旧为加法模型、学习算法为前向分步算法。不同的是，**GDBT没有规定损失函数的类型，设损失函数为 ![[公式]](https://www.zhihu.com/equation?tex=L%28y%2Cf%28x%29%29) 。前向加法算法的每一步都是拟合损失函数的负梯度**

  ![[公式]](https://www.zhihu.com/equation?tex=-%5B%5Cfrac%7B%5Cdelta+L%28y%2Cf%28x_%7Bi%7D%29%29%7D%7B%5Cdelta+f%28x_%7Bi%7D%29%7D%5D_%7Bf%28x%29%3Df_%7Bm-1%7D%28x%29%7D)

  **如果一个函数到达极小值，那么其梯度值一定为零；当函数没有到达最小值的时候，我们每次都选择梯度的反方向走，这样可以最快的到达极小值。这也就是GDBT的思想**。

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/ytIn1x.png" alt="ytIn1x" style="zoom:50%;" />

