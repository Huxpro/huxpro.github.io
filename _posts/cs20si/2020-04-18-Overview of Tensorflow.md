---
title: "Overview of Tensorflow"
subtitle: "CS 20SI「01」"
layout: post
author: "echisenyang"
header-style: text
hidden: true
catalog: true
tags:
  - 笔记
  - CS20SI
  - TensorFlow
---



## Overview of Tensorflow

本章总结：

1. 介绍tensorflow over其他深度学习框架的优势
2. data flow graph主要包含 nodes（operations, variables, constants）和 edges（tensors）
3. 介绍session相关的概念：
   - A Session object **encapsulates the environment** in which Operation objects are executed, and Tensor objects are evaluated.
   - How to get the value of a ? **compute all the nodes lead to** a. 
   - **lazy computation**：only calculate the resource that we need
4. subgraph：no need to build more than one graph
5.  `tf.Graph` 与 `tf.Session` 的区别：
   - **A graph defines the computation**. It doesn’t compute anything, it doesn’t hold any values, it just defines the operations that you specified in your code.
   - **A session allows to execute graphs or part of graphs**. It allocates resources (on one or more machines) for that and holds the actual values of intermediate results and variables.

---

![0oCGaP](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/0oCGaP.png)

- How to get the value of operator ?

![ClmF1r](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/ClmF1r.png)

- lazy computation：only calculate the resource that we need

![SOdckZ](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/SOdckZ.png)

- subgraph：no need to build more than one graph

![oryeLX](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/oryeLX.png)

![UrP8fm](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/UrP8fm.png)

- one-line tensorflow

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/Oo3MaK.png" alt="Oo3MaK" style="zoom: 50%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/0GIDJ0.png" alt="0GIDJ0" style="zoom:50%;" />

