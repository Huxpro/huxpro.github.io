---
title: "Backpropagation and Project Advice"
subtitle: "CS224N 284「5」"
layout: post
author: "echisenyang"
header-style: text
hidden: true
catalog: true
tags:
  - 笔记
  - 课程
  - CS224N
---

## Backpropagation and Project Advice

![R18ZVh](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/R18ZVh.jpg)

### 1.Explanation #1 for backprop

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/e5OAQi.jpg" alt="e5OAQi" style="zoom:25%;" />

### 2.Explanation #2 for backprop: “Circuits”

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/2syrqM.jpg" alt="2syrqM" style="zoom:25%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/Gae6JS.jpg" alt="Gae6JS" style="zoom:25%;" />

> 在**前向过程**中会记录 local gradient，当方向信号传播时，通过前向过程中这些局部梯度计算得最终的更新梯度。**可以将梯度看作是信号的分配规则**。(这里的weight视为1)

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/qT3a6Z.png" alt="qT3a6Z" style="zoom:25%;" />

> ‼️ **可以把 w 也视为节点**，这样更新 w 或 x 都是用（**更高层传下的梯度信号 x 局部梯度**）

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/svAB9O.png" alt="svAB9O" style="zoom:25%;" />

> ❗️ forward propagation：compute the value of your overall function



> ‼️ **the ralationship between the two** is **forward propagation** is waht you compute what you do at the **test time**, to compute the final output of your function. so, you want a probability for this node to be a location or for this word to be a location, you'd do forward propagation to compute the probability. 
>
> and then you do **backward propagation** to compute the gradients you want to **train and update** your model if you have a training data and so on.

### 3.Explanation #3 for backprop

- **The high-level flowgraph** 

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/bYVyaf.png" alt="bYVyaf" style="zoom:25%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/ioZ3cY.png" alt="ioZ3cY" style="zoom:25%;" />

### 4.Explanation #4 for backprop

- **The delta error signals in real neural nets** 

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/JzXgWy.png" alt="JzXgWy" style="zoom:25%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/zPK19l.png" alt="zPK19l" style="zoom:25%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/xJzMYL.png" alt="xJzMYL" style="zoom:25%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/5EWF4y.png" alt="5EWF4y" style="zoom:25%;" />

### 5.【highlight】Bag of Tricks for Efficient Text Classification

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/IdZrxt.png" alt="IdZrxt" style="zoom:25%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/dgoheL.png" alt="dgoheL" style="zoom:25%;" />

![oJdkVh](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/oJdkVh.jpg)

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/QGRKVY.png" alt="QGRKVY" style="zoom:25%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/rYsBsq.png" alt="rYsBsq" style="zoom:25%;" />

## lecture notes: part iii

- **dropout**

![BR9vtk](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/BR9vtk.png)

- **Neuron Units**

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/eOcUBh.png" alt="eOcUBh" style="zoom: 33%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/QrUhek.png" alt="QrUhek" style="zoom: 50%;" />

