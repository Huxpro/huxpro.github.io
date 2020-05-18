---
title: "Gated recurrent units and further topics in NMT"
subtitle: "CS224N 284「11」"
layout: post
author: "echisenyang"
header-style: text
hidden: true
catalog: true
tags:
  - 笔记
  - CS224N
---



## Gated recurrent units and further topics in NMT

![pbIuKX](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/pbIuKX.png)

### 1. A final look at gated recurrent units like GRUs/LSTMs

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/hKOUvD.png" alt="hKOUvD" style="zoom: 25%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/oQUsrZ.png" alt="oQUsrZ" style="zoom:25%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/TYXHyk.png" alt="TYXHyk" style="zoom:25%;" />

我们想搞清楚在时刻 t 看到的东西是如何影响 t+1 时刻的，如果我们有一个 basic rnn 网络，我们要做的就是在rnn的每一个时刻，we've got some hidden state and we're multiplying it by matrix and then we're adding some stuff to do with the input and then we got onto next，然后我们进入下一个时刻，我们将隐状态再次乘以相同的矩阵，并且加入一些输入的东西，然后继续进入下一时刻。当时正是这些matrix的连乘可能会使我们陷入麻烦，比如说遇到梯度消失的问题，我们就无法再知晓前一时刻是如何真实影响后续时刻的。

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/85YUNC.png" alt="85YUNC" style="zoom: 25%;" />

with the naive transition function in particular, what it means we've doing this sequence of matrix multipiers. 矩阵连乘意味着前面的时刻会对最后一个时间点做决策的影响有多大，我们再通过反向传播去更新这种影响。门控网络的提出是要做什么呢？我们想证明 ***the effect of early time steps on much later time steps without having to do this long sequence matrix multiplies***, 因为这些长序列的矩阵连乘会因为梯度消失等问题而带来消灭证据的风险。因此我们想在序列之间增加 shortcut connections，这样无论是前向传播还是反向传播，都能更好的验证不同节点间的影响（这便是门控网络提出的institution）。 

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/uz1Qwf.png" alt="uz1Qwf" style="zoom:25%;" />

Candidate Update 是regular rnn 的迭代，但是不同的是$f\left(h_{t-1}, x_{t}\right)=u_{t} \odot \tilde{h}_{t}+\left(1-u_{t}\right) \odot h_{t-1}$ 我们需要**自适应学习用多少维度和用哪些维度去更新 Candidate Update，有多少需要 shortcut 并使用 previous time step**，相当于我们直接从过去获取内容，影响现在并进一步影响决定。

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/SRh6up.png" alt="SRh6up" style="zoom:25%;" />

gru的最后一步，we might want to prune away some of the past stuff adaptively so it doesnt hang around forever. 因此我们加入 Reset gate 来做修剪，删掉一些在 t-1 时间点的东西when it no longer relevant，因此重置门与之前的隐层做点积，使我们能够忘掉过去的隐层。

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/8Qtl0W.png" alt="8Qtl0W" style="zoom:25%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/jH87sO.png" alt="jH87sO" style="zoom:25%;" />

**为什么gru不会遭受梯度消失？**密码在这个式子里$f\left(h_{t-1}, x_{t}\right)=u_{t} \odot \tilde{h}_{t}+\left(1-u_{t}\right) \odot h_{t-1}$ ，当 $u_{t}$ 趋向于0时，$h_{t-1}$ 前的系数趋向于1，这意味着 $h_{t}$ 对 $h_{t-1}$ 的导数趋向于1，***that's the perfect case for gradients to flow beautifully, nothing is lost, it's just going straight back down the line, so that's why it can carry information for a long time***. 当然如果 $u_{t}=1$ ，这意味着模型学出来的句子就是表征没有 long distance dependancy 。这条 ***direct pathway, where you getting this straight linear flow of grdient information, goning back in time***. 



<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/NPPada.png" alt="NPPada" style="zoom:25%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/qz9wAi.png" alt="qz9wAi" style="zoom:25%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/YVYYcY.png" alt="YVYYcY" style="zoom:25%;" />

![4sxkHq](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/4sxkHq.png)

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/3SqD1u.png" alt="3SqD1u" style="zoom:25%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/UZO6XZ.png" alt="UZO6XZ" style="zoom:25%;" />

> dropout一般用在垂直方向，如果水平方向用那网络就废了

### 2.【highlight】Lip Reading Sentences in the Wild

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/yqYt2f.png" alt="yqYt2f" style="zoom:25%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/TRslfd.png" alt="TRslfd" style="zoom:25%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/p70Fwt.png" alt="p70Fwt" style="zoom:25%;" />

### 3. Machine translation evaluation（BLEU）

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/I4orVk.png" alt="I4orVk" style="zoom: 25%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/CfZg2W.png" alt="CfZg2W" style="zoom:25%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/vL3jen.png" alt="vL3jen" style="zoom:25%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/dsrgRm.png" alt="dsrgRm" style="zoom:25%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/nLCnO1.png" alt="nLCnO1" style="zoom:25%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/zsskjp.png" alt="zsskjp" style="zoom:25%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/poTrEw.png" alt="poTrEw" style="zoom:25%;" />

### 4. The word generation problem: dealing with a large output vocab

![v9DuXY](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/v9DuXY.png)

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/EQY8kW.png" alt="EQY8kW" style="zoom:25%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/YkwzSo.png" alt="YkwzSo" style="zoom:25%;" />

![zbMiGj](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/zbMiGj.png)

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/weXh7G.png" alt="weXh7G" style="zoom:25%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/y038Mz.png" alt="y038Mz" style="zoom:25%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/F4saLr.png" alt="F4saLr" style="zoom:25%;" />

### 5.未来得及讲的部分

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/3NAVvl.png" alt="3NAVvl" style="zoom: 25%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/H2nvat.png" alt="H2nvat" style="zoom:25%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/rYEdZX.png" alt="rYEdZX" style="zoom:25%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/xis6PP.png" alt="xis6PP" style="zoom:25%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/UFN7wO.png" alt="UFN7wO" style="zoom:25%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/hBiIaN.png" alt="hBiIaN" style="zoom:25%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/5wI6Bx.png" alt="5wI6Bx" style="zoom:25%;" />

![X58SKW](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/X58SKW.png)

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/49rwwY.png" alt="49rwwY" style="zoom:25%;" />

![TqFjHh](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/TqFjHh.png)

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/6ISx90.png" alt="6ISx90" style="zoom:25%;" />

![VUFXV5](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/VUFXV5.png)

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/hk5cCv.png" alt="hk5cCv" style="zoom:25%;" />

## Lecture Notes: Part VI

pdf值得一看