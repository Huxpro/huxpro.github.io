---
title: "Tree Recursive Neural Networks and Constituency Parsing"
subtitle: "CS224N 284「14」"
layout: post
author: "echisenyang"
header-style: text
hidden: true
catalog: true
tags:
  - 笔记
  - CS224N
---



## Tree Recursive Neural Networks and Constituency Parsing

![kmCros](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/kmCros.png)

### 1. The spectrum of language in CS

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/mTO0UJ.png" alt="mTO0UJ" style="zoom:25%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/kZh7l4.png" alt="kZh7l4" style="zoom:25%;" />

![JpKm6R](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/JpKm6R.png)

![dFv68f](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/dFv68f.png)

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/kbmlxM.png" alt="kbmlxM" style="zoom:25%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/Hwb1nO.png" alt="Hwb1nO" style="zoom:25%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/EmnOA6.png" alt="EmnOA6" style="zoom:33%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/QLPDOr.png" alt="QLPDOr" style="zoom:25%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/wb0kVC.png" alt="wb0kVC" style="zoom:25%;" />

- ***tree structure model使用的不多的原因：***

  tree recursive model必须构建一个树型结构，因为puting a sentence over tree structure 是一种确定性的分类，需要确定 which words are goning to be together to be constituents while others are not. 任何进行分类选择的地方都将成为使用反向传播学习模型的一个问题（正确对句子进行划分不是一件容易的事），将复杂性置入了模型，导致会对gpu使用不友好，因为阻碍了 simple step of computation. 

- ***tree rnn与cnn的区别：***

  主要的区别在于 tree rnn calaulate representations, compositional vectors only for phrases that sort of make sense, that are grammatical. 从语言学角度讲，这时句子结构的一部分。而 cnn 只是计算出每两个词汇，每三个词汇，每四个词汇（根据卷积核来定）的表示，而不管它们组合起来是否有意义。虽然这样做也有好处，因为不用自己做任何选择来进行解析选择，但是这样其实不具备语言学的认知和特点。从某种程度上来讲， rnn 更具认知力 cognitively plausible。

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/t5BxC7.png" alt="t5BxC7" style="zoom:25%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/7XAWQf.png" alt="7XAWQf" style="zoom:25%;" />

### 2. Recursive Neural Networks for Structure Predic9on

- **Version 1: greedily incrementally building up parse structures**

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/HizC73.png" alt="HizC73" style="zoom:25%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/Ero4VQ.png" alt="Ero4VQ" style="zoom:25%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/uxTWyZ.png" alt="uxTWyZ" style="zoom:25%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/yWsu3U.png" alt="yWsu3U" style="zoom:25%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/GEP0Y1.png" alt="GEP0Y1" style="zoom:25%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/0Qf7Dm.png" alt="0Qf7Dm" style="zoom:25%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/pIlbmz.png" alt="pIlbmz" style="zoom:25%;" />

### 3.【highlight】Deep Reinforcement Learning

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/Vm0QDT.png" alt="Vm0QDT" style="zoom:25%;" />

- **Version 2：Syntactically-Untied RNN**

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/rPsC68.png" alt="rPsC68" style="zoom:25%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/93GEfD.png" alt="93GEfD" style="zoom:25%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/aQyeZU.png" alt="aQyeZU" style="zoom:25%;" />

- **Version 3: Compositionality Through Recursive Matrix-Vector Spaces**

  之前的方法，version 1，当矩阵 w 与 向量 a，b 相乘时，向量之间没有发生交互（各自与矩阵的一半相乘）。为了修复这个问题，我们对每一个词都采用两种表示方式：vector & matrix

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/cM9AOM.png" alt="cM9AOM" style="zoom:25%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/s3IOJv.png" alt="s3IOJv" style="zoom:25%;" />

