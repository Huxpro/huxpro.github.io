---
title: "Dependency Parsing"
subtitle: "CS224N 284「6」"
layout: post
author: "echisenyang"
header-style: text
hidden: true
catalog: true
tags:
  - 笔记
  - CS224N
---

## Dependency Parsing

![PIC6ot](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/PIC6ot.jpg)

### 1. Syntactic Structure: Consistency and Dependency

#### Two views of linguistic structure: 

- Constituency = phrase structure grammar = **context-free grammars (CFGs)**

  上下文无关语法：不看一个句子的具体上下文，只看其结构，比如一个句子的合理语法结构是主谓宾。

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/rarXiH.png" alt="rarXiH" style="zoom:25%;" />

- **Dependency structure**

  Dependency structure shows **which words depend on (modify or are arguments of) which other words**. 句法依存看的是在一个句子的具体上下文中，某个与他的上下文其他词的依赖关系。

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/prIlSC.png" alt="prIlSC" style="zoom:25%;" />

> 人类语言具有歧义性，我们希望通过句法依存来描述人类语言。

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/Eno8pP.png" alt="Eno8pP" style="zoom:25%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/Vnh7Yb.png" alt="Vnh7Yb" style="zoom:25%;" />

### 2. Dependency Grammar and Dependency Structure

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/uct0Em.png" alt="uct0Em" style="zoom:25%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/eNm23r.png" alt="eNm23r" style="zoom:25%;" />

### 3.【Research highlight】Improving Distributional Similarity with Lessons Learned from Word Embeddings

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/PtRP0l.png" alt="PtRP0l" style="zoom:25%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/Tqcx4K.jpg" alt="Tqcx4K" style="zoom:25%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/9kSFHl.png" alt="9kSFHl" style="zoom:25%;" />

### 4. Transition-based dependency parsing

- **Arc-standard transition-based parser**

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/dml7E5.png" alt="dml7E5" style="zoom:25%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/cVFSZj.png" alt="cVFSZj" style="zoom:25%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/7UgA2j.png" alt="7UgA2j" style="zoom:25%;" />

> 基于转换的依存分析的思想是：你有一个合理操作的集合，以shift、reduced的方式来分析句子，我们把这个称为弧标准（arc-standard），是因为其中有不同的方式来定义你的依存集合。刚才介绍的是其中最简单的一种，也是比较有效的一种。

- **MaltParser [Nivre and Hall 2005] ** **构建机器学习依存分析**

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/dpGpHv.jpg" alt="dpGpHv" style="zoom:25%;" />

- **Evaluation of Dependency Parsing**: (labeled) dependency accuracy

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/ynspLZ.png" alt="ynspLZ" style="zoom:25%;" />

### 5. Neural dependency parsing

- **problem of previous methods**

  1.sparse

  2.incomplete

  3.expensive computation( More than 95% of parsing time is consumed by feature computation.)

- **构建神经网络依存分析**

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/DFSDtK.png" alt="DFSDtK" style="zoom:25%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/T4Py10.jpg" alt="T4Py10" style="zoom:25%;" />

> 非线性层是必须的，如果只有线性层，无论神经网络有多深，线性仿射变换的叠加本质上还是线性变换，加多少层都没有用。

- **Non-linearities: What’s used**

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/IdjWOr.png" alt="IdjWOr" style="zoom:25%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/FaJzfh.png" alt="FaJzfh" style="zoom:25%;" />

