---
title: "从决策树到GBDT、Xgboost"
subtitle: "ID3/C4.5/CART/Random Forest/Adaboost/GBDT/Xgboost/LightGBM"
layout: post
author: "echisenyang"
header-style: text
hidden: true
catalog: true
tags:
  - 输出计划
---



### ID3/C4.5/CART

to be continued



### 集成学习背景

集成学习是把多个学习器结合起来，那么如何获得比单一学习器更好的性能呢？

- 前提条件：**单一学习器至少不差于弱学习器**
  - 弱学习器（弱模型）：偏差大（在训练集上准确度低）、方差小（防止过拟合能力强）
  - 强学习器（强模型）：偏差小（训练充分，提升了准确度）、方差大（但是容易过拟合）

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/aDJykF.png" alt="aDJykF" style="zoom:50%;" />

- 核心：**如何产生并结合“好而不同”的个体学习器**

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/o1Vk5z.png" alt="o1Vk5z" style="zoom:50%;" />

- 结合策略的**理论支撑**

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/wcdIo5.png" alt="wcdIo5" style="zoom:50%;" />



### 集成学习

常见的集成学习框架有三种：Bagging，Boosting 和 Stacking。

#### 1.Bagging (Random Forest)

Bagging 全称叫 **Bootstrap aggregating**，看到 Bootstrap 我们立刻想到著名的开源前端框架（抖个机灵，是 Bootstrap 抽样方法） ，每个基学习器都会对训练集进行有放回抽样得到子训练集，比较著名的采样法为 0.632 自助法。**每个基学习器基于不同子训练集进行训练（K折交叉验证：不然总有一部分数据得不到有效利用）**，并综合所有基学习器的预测值得到最终的预测结果。**Bagging 常用的综合方法是投票法，票数最多的类别为预测类别。**

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/d3TO1h.png" alt="d3TO1h" style="zoom:50%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/OlS54z.png" alt="OlS54z" style="zoom:50%;" />

![3DjAEt](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/3DjAEt.jpg)

- 自助采样带给bagging的优点

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/a4zXdZ.png" alt="a4zXdZ" style="zoom:50%;" />



#### 2.Boosting (Adaboost/GBDT)

Boosting 训练过程为阶梯状，基模型的训练是有顺序的，每个基模型都会在前一个基模型学习的基础上进行学习，最终综合所有基模型的预测值产生最终的预测结果，用的比较多的综合方式为加权法。

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/eB7DeJ.png" alt="eB7DeJ" style="zoom:50%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/nmWBpi.png" alt="nmWBpi" style="zoom:50%;" />

![7ZL0K0](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/7ZL0K0.jpg)



#### 3.Stacking

简单来说 stacking 就是当用初始训练数据学习出若干个基学习器后，将这几个学习器的预测结果作为新的训练集，来学习一个新的学习器。

> 两层堆叠的一种基本的原始思路想法：在不同模型预测的结果基础上再加一层模型，进行再训练（把前一层的输出当作当前层的输入），从而得到模型最终的预测。

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/V52jJF.png" alt="V52jJF" style="zoom:50%;" />

![Tk0x5R](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/Tk0x5R.jpg)

Stacking本质上就是这么直接的思路，但是直接这样有时对于**如果训练集和测试集分布不那么一致**的情况下是有一点问题的，**其问题在于用初始模型训练的标签再利用真实标签进行再训练**，毫无疑问会导致一定的模型过拟合训练集，这样或许模型在测试集上的泛化能力或者说效果会有一定的下降，因此现在的问题变成了如何降低再训练的过拟合性，这里我们一般有两种方法。

- 次级模型尽量选择简单的线性模型
- **利用K折交叉验证**

![hlPmEG](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/hlPmEG.jpg)

![llMQ6R](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/llMQ6R.jpg)

下图是我打天池比赛时采用keras搭建的两层Stacking模型，直接杀进了top50，MAE降了20个点

![qjT6VA](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/qjT6VA.jpg)





### 理解集成学习的另一个角度：偏差与方差

#### 什么是方差？什么是偏差

- **What is bias?**
  - Bias is the difference between the average prediction of our model and the correct value which we are trying to predict. 低偏差对应的点都打在靶心附近，所以瞄的很准，但不一定很稳；
- **What is variance?**
  - Variance is the variability of model prediction for a given data point or a value which tells us spread of our data. 低方差对应就是点都打的很集中，但不一定是靶心附近，手很稳，但不一定瞄的准。

![](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/FhLHLg.jpg)

![](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/vml3pj.jpg)

![](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/eenZ26.jpg)

#### 强模型与弱模型

- 我们常说集成学习中的基模型是弱模型，通常来说**弱模型是偏差高（在训练集上准确度低）方差小（防止过拟合能力强）的模型**，**但并不是所有集成学习框架中的基模型都是弱模型**。
- **Bagging 和 Stacking 中的基模型为强模型（偏差低，方差高，主要关注降低方差），而Boosting 中的基模型为弱模型（偏差高，方差低，主要关注降低偏差）**。

#### 偏差与方差的量化分析

- 在 Bagging 和 Boosting 框架中，通过计算基模型的期望和方差我们可以得到模型整体的期望和方差。为了简化模型，我们假设基模型的期望为 $\mu$ ，方差 $\sigma^2$，模型的权重为 $r$ ，两两模型间的相关系数 $\rho$ 相等。由于 Bagging 和 Boosting 的基模型都是线性组成的，那么有：

  - 模型总体期望：

  $$
  \begin{aligned} E(F) &=E\left(\sum_{i}^{m} r_{i} f_{i}\right) \\ &=\sum_{i}^{m} r_{i} E\left(f_{i}\right) \end{aligned}
  $$

  - 模型总体方差（公式推导参考协方差的性质，协方差与方差的关系）

  $$
  \begin{aligned} \operatorname{Var}(F) &=\operatorname{Var}\left(\sum_{i}^{m} r_{i} f_{i}\right) \\ &=\sum_{i}^{m} \operatorname{Var}\left(r_{i} f_{i}\right)+\sum_{i \neq j}^{m} \operatorname{Cov}\left(r_{i} f_{i}, r_{j} f_{j}\right) \\ &=\sum_{i}^{m} r_{i}^{2} \operatorname{Var}\left(f_{i}\right)+\sum_{i \neq j}^{m} \rho r_{i} r_{j} \sqrt{\operatorname{Var}\left(f_{i}\right)} \sqrt{\operatorname{Var}\left(f_{j}\right)} \\ &=m r^{2} \sigma^{2}+m(m-1) \rho r^{2} \sigma^{2} \\ &=m r^{2} \sigma^{2}(1-\rho)+m^{2} r^{2} \sigma^{2} \rho \end{aligned}
  $$

- **Bagging 的偏差与方差**

  - 对于 Bagging 来说，每个基模型的权重等于 1/m 且期望近似相等，故我们可以得到：

  $$
  \begin{aligned} E(F) &=\sum_{i}^{m} r_{i} E\left(f_{i}\right) \\ &=m \frac{1}{m} \mu \\ &=\mu  \end{aligned}
  $$

  $$
  \begin{aligned} \operatorname{Var}(F) &=m r^{2} \sigma^{2}(1-\rho)+m^{2} r^{2} \sigma^{2} \rho \\ &=m \frac{1}{m^{2}} \sigma^{2}(1-\rho)+m^{2} \frac{1}{m^{2}} \sigma^{2} \rho \\ &=\frac{\sigma^{2}(1-\rho)}{m}+\sigma^{2} \rho \end{aligned}
  $$

  - 通过上式我们可以看到：
        1. **整体模型的期望等于基模型的期望，这也就意味着整体模型的偏差和基模型的偏差近似。**
           2. **整体模型的方差小于等于基模型的方差，当且仅当相关性为 1 时取等号，随着基模型数量增多，整体模型的方差减少，从而防止过拟合的能力增强，模型的准确度得到提高。**但是，模型的准确度一定会无限逼近于 1 吗？并不一定，当基模型数增加到一定程度时，方差公式第一项的改变对整体方差的作用很小，防止过拟合的能力达到极限，这便是准确度的极限了。
  - 在此我们知道了为什么 **Bagging 中的基模型一定要为强模型（偏差低，方差高）**，如果 Bagging 使用弱模型则会导致整体模型的偏差提高，而准确度降低。
  - **<font color=red>Random Forest 是经典的基于 Bagging 框架的模型，并在此基础上通过引入属性扰动（从结点的属性集中随机选择一个包含k个属性的子集，然后从这个子集选一个最优属性进行划分）和样本扰动（数据采样）来降低基模型间的相关性</font>**，在公式中显著降低方差公式中的第二项，略微升高第一项，从而使得整体降低模型整体方差。

- **Boosting 的偏差与方差**

  - 对于 Boosting 来说，由于基模型**共用同一套训练集，所以基模型间具有强相关性**，故模型间的相关系数近似等于 1，针对 Boosting 化简公式为：
    
    $$
    E(F)=\sum_{i}^{m} r_{i} E\left(f_{i}\right)
    $$
    
    $$
    \begin{aligned} \operatorname{Var}(F) &=m r^{2} \sigma^{2}(1-\rho)+m^{2} r^{2} \sigma^{2} \rho \\ &=m \frac{1}{m^{2}} \sigma^{2}(1-1)+m^{2} \frac{1}{m^{2}} \sigma^{2} 1 \\ &=\sigma^{2} \end{aligned}
    $$
    
  - 通过观察整体方差的表达式我们容易发现：
  
    1. **整体模型的方差等于基模型的方差，如果基模型不是弱模型，其方差相对较大**，这将导致整体模型的方差很大，即无法达到防止过拟合的效果。因此，**Boosting 框架中的基模型必须为弱模型**。
    2. 此外 Boosting 框架中采用基于贪心策略的前向加法，整体模型的期望由基模型的期望累加而成，所以随着基模型数的增多，整体模型的期望值增加，整体模型的准确度提高。
  
  - AdaBoost：通过对样本分布的调整使下一轮学习可以纠正上一轮学习的一些错误，从而提升性能
  
  - 基于 Boosting 框架的 Gradient Boosting Decision Tree 模型中基模型也为树模型，同 Random Forrest，我们也可以对特征进行随机抽样来使基模型间的相关性降低，从而达到减少方差的效果。

- 小结
  - 对于 Bagging（**使用相互交叠的采样子集**）来说，整体模型的偏差与基模型近似，而随着模型的增加可以降低整体模型的方差，故其基模型需要为**强模型**；
  - 对于 Boosting（**使用全量训练集**）来说，整体模型的方差近似等于基模型的方差，而整体模型的偏差由基模型累加而成，故基模型需要为**弱模型**。
  
  - **属性扰动与样本数据扰动可以增强多样性**，从而提升性能



### Random Forest/Adaboost/GBDT

- Random Forest

  - Random Forest（随机森林），用随机的方式建立一个森林。RF 算法由很多决策树组成，每一棵决策树之间没有关联。建立完森林后，当有新样本进入时，每棵决策树都会分别进行判断，然后基于投票法给出分类结果。

  - 随机选择样本和 Bagging 相同，采用的是 Bootstrap 自助采样法；**随机选择特征是指在每个节点在分裂过程中都是随机选择特征的**（区别与每棵树随机选择一批特征）。

    这种随机性导致随机森林的偏差会有稍微的增加（相比于单棵不随机树），但是由于随机森林的“平均”特性，会使得它的方差减小，而且方差的减小补偿了偏差的增大，因此总体而言是更好的模型。

- Adaboost

  - AdaBoost（Adaptive Boosting，自适应增强），其自适应在于：**前一个基本分类器分错的样本会得到加强，加权后的全体样本再次被用来训练下一个基本分类器。同时，在每一轮中加入一个新的弱分类器，直到达到某个预定的足够小的错误率或达到预先指定的最大迭代次数。**

- GBDT

  - GBDT（Gradient Boosting Decision Tree）是一种迭代的决策树算法，该算法由多棵决策树组成，从名字中我们可以看出来它是属于 Boosting 策略。GBDT 是被公认的泛化能力较强的算法。
  - 如果认为 GBDT 由很多分类树那就大错特错了（虽然调整后也可以分类）。对于分类树而言，其值加减无意义（如性别），而对于回归树而言，其值加减才是有意义的（如说年龄）。GBDT 的核心在于累加所有树的结果作为最终结果，所以 GBDT 中的树都是回归树，不是分类树，这一点相当重要。

- GBDT 与 Adaboost 的对比

  - **迭代思路不同**：Adaboost 是通过提升错分数据点的权重来弥补模型的不足（利用错分样本），而 GBDT 是通过算梯度来弥补模型的不足（利用残差）；
  - **损失函数不同**：AdaBoost 采用的是指数损失，GBDT 使用的是绝对损失或者 Huber 损失函数；



### Xgboost/LightGBM

to be continued

