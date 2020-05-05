---
title: "Recurrent Neural Networks and Language Models"
subtitle: "CS224N 284「8」"
layout: post
author: "echisenyang"
header-style: text
hidden: true
catalog: true
tags:
  - 笔记
  - CS224N
---



## Recurrent Neural Networks and Language Models

![ZBVZMo](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/ZBVZMo.png)

### 1.Traditional Language Models

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/MBX8W5.png" alt="MBX8W5" style="zoom:25%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/qBCSDN.png" alt="qBCSDN" style="zoom:25%;" />

### 2.Recurrent Neural Networks!

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/xUIPuZ.png" alt="xUIPuZ" style="zoom:25%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/hjePGk.png" alt="hjePGk" style="zoom:25%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/ARbRoZ.png" alt="ARbRoZ" style="zoom:25%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/kVz3Zh.png" alt="kVz3Zh" style="zoom:25%;" />

#### The vanishing gradient problem - Details 

> 但是随着时间的推移，讯号可能愈发强烈或者微弱，这便是梯度消失问题。

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/ZqRSXa.png" alt="ZqRSXa" style="zoom:25%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/RitYnk.png" alt="RitYnk" style="zoom:25%;" />

### 3.【highlight】Structured Training for Neural Network Transition-Based Parsing

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/zb2gtI.png" alt="zb2gtI" style="zoom:25%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/6EHrt2.png" alt="6EHrt2" style="zoom:25%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/gcqayM.png" alt="gcqayM" style="zoom:25%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/U8sMv2.png" alt="U8sMv2" style="zoom:25%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/G5h6ZU.jpg" alt="G5h6ZU" style="zoom:25%;" />

#### Trick for exploding gradient: clipping trick

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/kYpp8P.png" alt="kYpp8P" style="zoom:25%;" />

> 梯度爆炸的原因，从右往左正常传播后，撞到了墙，然后被阻断正常传播，相反被撞飞到其他不可控的地方去了。

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/15ohTJ.png" alt="15ohTJ" style="zoom:25%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/A88iYQ.png" alt="A88iYQ" style="zoom:25%;" />

## {The Problem with Softmax Activation Function}

Softmax is by far the most common activation function used. It is usually used in classification of tasks in the output layer of the Neural Network. What softmax actually does is it **turns output (logits) into probabilities.**

For classifiers that may have **out-of-distribution samples** during testing, **consider adding a new option for the output: *“I don’t know.”*** This way, we quantify the uncertainty through the network directly. If the network chooses the uncertain option as the most likely, then we cannot make a prediction within the possible outputs.

