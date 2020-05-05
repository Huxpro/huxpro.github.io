---
title: "Word Window Classification and Neural Networks"
subtitle: "CS224N 284「4」"
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



## Word Window Classification and Neural Networks

![qwUoke](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/qwUoke.png)

### 1-3.Classiﬁcation background & Updating word vectors for classiﬁcation & Window classification

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/1hizFR.png" alt="1hizFR" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/boeoQZ.png" alt="boeoQZ" style="zoom: 50%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/TZM2WM.png" alt="TZM2WM" style="zoom:25%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/iLEzzJ.png" alt="iLEzzJ" style="zoom: 33%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/jx7EWa.png" alt="jx7EWa" style="zoom:33%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/auQW6a.png" alt="auQW6a" style="zoom:33%;" />

### 4-5.neural networks

#### The max-margin loss

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/G8ARBs.png" alt="G8ARBs" style="zoom:25%;" />



> max-margin loss:经过一段时间训练后，参数学习的越来越好，这时比如 $s=5,s_c=2$ ，则 $1-s+s_c < 0$ ，所以这些元素的损失为0，可以看到这是目标函数非常好的一个特性，久而久之模型可以开始忽略越来越多的训练集，因为已经足够好（误差为0），而**更加关注那些模型还无法区分的数据上**。

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/aCglv1.png" alt="aCglv1" style="zoom:25%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/AfvVmu.png" alt="AfvVmu" style="zoom:25%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/afgHWO.png" alt="afgHWO" style="zoom:25%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/7aC9Wl.png" alt="7aC9Wl" style="zoom:25%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/4jhpQp.png" alt="4jhpQp" style="zoom:25%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/L7oldd.png" alt="L7oldd" style="zoom:25%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/mw6ksx.png" alt="mw6ksx" style="zoom:25%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/QFEvfb.png" alt="QFEvfb" style="zoom:25%;" />

### Lecture Notes: Part III 2

#### Feed-forward Computation

![LEpw8F](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/LEpw8F.png)

#### Maximum Margin Objective Function

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/BOxnpL.png" alt="BOxnpL" style="zoom:40%;" />

#### Training with Backpropagation – Elemental

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/5upwU1.png" alt="5upwU1" style="zoom: 40%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/Jupf6c.png" alt="Jupf6c" style="zoom: 40%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/r65nuh.png" alt="r65nuh" style="zoom:40%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/BsrHv2.png" alt="BsrHv2" style="zoom:50%;" />

