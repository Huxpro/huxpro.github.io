---
title: "Convolutional Neural Networks"
subtitle: "CS224N 284「13」"
layout: post
author: "echisenyang"
header-style: text
hidden: true
catalog: true
tags:
  - 笔记
  - CS224N
---



## Convolutional Neural Networks

![XPNRbU](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/XPNRbU.png)

### 1.From RNNs to CNNs

- rnn网络遇到的困难：

  不能捕捉isolation的短语或词，必须读完整个句子，这意味着如果我们只希望捕捉某个词会带入句子中其他成分的信息。

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/7xPRkx.jpg" alt="7xPRkx" style="zoom:25%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/4tSQp1.png" alt="4tSQp1" style="zoom:25%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/Ywg1cC.png" alt="Ywg1cC" style="zoom:25%;" />



<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/mpTChw.png" alt="mpTChw" style="zoom:25%;" />

### 2.【hightlight】Character-Aware Neural Language Models

![cDDejw](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/cDDejw.png)

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/itVOHj.png" alt="itVOHj" style="zoom:25%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/8vV4PF.png" alt="8vV4PF" style="zoom:25%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/hvE198.png" alt="hvE198" style="zoom:25%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/DTOOWF.png" alt="DTOOWF" style="zoom:25%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/cx22bm.png" alt="cx22bm" style="zoom: 33%;" />

### 3.Tricks to make it work better

- **Dropout**: ***相当于是在训练过程中加入噪音，所有的优化方法都可以理解为加入噪音***

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/xkAKmm.png" alt="xkAKmm" style="zoom:25%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/kpYfU0.png" alt="kpYfU0" style="zoom:25%;" />

- **ensemble**

  **<font color=red>一个好问题是：我们不应该致力于单一模型，并将它性能提升到最大吗？为什么需要ensemble？</font>**

  **确实，我们应该尝试各种优化方法，比如dropout或者正则化，或者其他方式来提高模型性能，但是当我们对单一模型取得了最佳的效果后，我们可以尝试下ensemble，因为同一个模型，同一组超参数可能在运行多次后由于陷入的局部最优解不同，从而导致结果不那么一致，那么可以通过ensemble的方式，我感觉这也是一种正则化的思想，而且实际表明，确实有助于提升性能。**

- **CNN alternatives**

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/sNbJY5.png" alt="sNbJY5" style="zoom:33%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/Eee28x.png" alt="Eee28x" style="zoom:25%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/htiWy1.png" alt="htiWy1" style="zoom:25%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/o287hx.png" alt="o287hx" style="zoom:25%;" />

https://blog.einstein.ai/new-neural-network-building-block-allows-faster-and-more-accurate-text-understanding/

