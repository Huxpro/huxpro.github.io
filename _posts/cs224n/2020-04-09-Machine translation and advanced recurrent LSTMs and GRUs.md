---
title: "Machine translation and advanced recurrent LSTMs and GRUs"
subtitle: "CS224N 284「9」"
layout: post
author: "echisenyang"
header-style: text
hidden: true
catalog: true
tags:
  - 笔记
  - CS224N
---


## Machine translation and advanced recurrent LSTMs and GRUs

![I3Quuo](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/I3Quuo.png)

### 1.Recap of most important concepts & equations

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/UXBOah.png" alt="UXBOah" style="zoom:25%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/TOyXI5.png" alt="TOyXI5" style="zoom:25%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/8wDvXZ.png" alt="8wDvXZ" style="zoom:25%;" />

### 2.Machine Transla8on

#### Current statistical machine translation systems(统计机器学习翻译)

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/k5XqrP.png" alt="k5XqrP" style="zoom:25%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/qhkavp.png" alt="qhkavp" style="zoom:25%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/uMHz2H.png" alt="uMHz2H" style="zoom:25%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/fmkdYu.png" alt="fmkdYu" style="zoom:25%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/TbZoH4.png" alt="TbZoH4" style="zoom:25%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/9up1K9.png" alt="9up1K9" style="zoom:25%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/oMRre9.png" alt="oMRre9" style="zoom:25%;" />

#### Deep learning to the rescue! … ?

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/oW1kz2.png" alt="oW1kz2" style="zoom:25%;" />

> 端到端的模型，简单的encoder-decoder，可行的方案。在神经网络结构中，**我们假设并希望隐状态实际上捕获了一些语法结构以及我们人类有的语法直觉。**我们不会再显示的给出那些计算方法。另一个问题是预测什么时候停止：我们在softmax用的词表末尾加上一个停止的标记，当softmax预测出的最大概率是这个停止标记时，表示翻译结束。

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/mfnpPD.png" alt="mfnpPD" style="zoom:25%;" />

#### **how to improve?**

- step1：**在编码与解码阶段使用不同的权重矩阵w**

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/Bd72Vb.png" alt="Bd72Vb" style="zoom:25%;" />

- step2：**decoder阶段的每个隐层信息有三个输入**

  - 问题：为什么要把 $y_{t-1}$ 作为一个参数，不是已经包含在 $h_{t-1}$ 中了吗？

    **<font color=red>答：1. it would allow to have the softmax weights also modify a little bit how that hidden state behaves at test time; 2. we tell the model wo choose exactly this one, instead of having the distribution. 相当于我们认为这个词有最高的概率，因为他有最高的概率被模型从上一步预测出，这个改进可以帮助模型防止多次重复预测同一个单词，在计算中也间接包含了softmax的权重</font>**

  - 问题：模型可以向前多看几个单词吗？或者模型可能输出为空吗？

    **<font color=red>答：the model basically has to output the words in the right order. and it doesnt have the ability to do the whole thing recording step or look ahead kind of thing .(模型按照既定顺序输出单词，并且模型不具备重新排序或者向前看几个单词的能力，或者模型并没有后续处理，即在最后调整词序的能力。因此这个模型没有能力output the word at the right time stamp)</font>**

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/B2UWV2.png" alt="B2UWV2" style="zoom:25%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/GX5TZN.png" alt="GX5TZN" style="zoom: 33%;" />

- step3、4、5：**更深、双向、逆序**

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/SblNcz.png" alt="SblNcz" style="zoom:25%;" />

- 6. **Main Improvement: Better Units**

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/XzyWfh.png" alt="XzyWfh" style="zoom:33%;" />

### 3.【highlight】Towards Better Language Modeling

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/S7P8ZC.jpg" alt="S7P8ZC" style="zoom:25%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/B8TmbH.png" alt="B8TmbH" style="zoom:25%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/xkYDYX.png" alt="xkYDYX" style="zoom: 33%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/a2asHN.png" alt="a2asHN" style="zoom:25%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/QziybL.png" alt="QziybL" style="zoom:25%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/N4Rtkc.png" alt="N4Rtkc" style="zoom:25%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/vFuHqp.png" alt="vFuHqp" style="zoom:25%;" />

### 4. 6. Main Improvement: Better Units

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/lJmLht.png" alt="lJmLht" style="zoom:25%;" />

- GRUs

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/EBOgua.png" alt="EBOgua" style="zoom: 25%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/BUzIpd.png" alt="BUzIpd" style="zoom:25%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/hRyc6n.png" alt="hRyc6n" style="zoom:25%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/t7NIUX.png" alt="t7NIUX" style="zoom:25%;" />

- Long-short-term-memories (LSTMs)

> LSTMs是在GRUs的基础上分离出更多的步骤

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/fUgQZC.png" alt="fUgQZC" style="zoom:25%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/EfaAYY.png" alt="EfaAYY" style="zoom:25%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/6bwimT.png" alt="6bwimT" style="zoom:25%;" />

### 5.A recent improvement to RNNs

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/3h9yMM.png" alt="3h9yMM" style="zoom:50%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/gWPLRK.png" alt="gWPLRK" style="zoom:50%;" />

> 这是一种修复问题的尝试，本质上是一种混合模型。什么是pointer？pointer是一种机制，maybe the next word is one of the previous words in the context，maybe just wanna copy a word over from the last 100 words，and if not, then i will use my standard softmax for the rest. 

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/L9VStS.png" alt="L9VStS" style="zoom:50%;" />

> pointer计算方式是之前词出现的频数集合。

## Lecture Notes: Part V

- pdf值得一看