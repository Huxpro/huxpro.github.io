---
title: "Introduction to NLP and Deep Learning"
subtitle: "CS224N 284「1」"
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



## Introduction to NLP and Deep Learning

![NYkiCK](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/NYkiCK.png)

### 1. What is Natural Language Processing (NLP)?


> apple：把language变成消费级的产品，since siri

> 成熟的工业级应用：机器翻译、语音识别、情感分析

### 2. What’s Deep Learning (DL)?

> 深度学习与传统机器学习的核心区别：
>
> **Most machine learning methods work Feature well because of human-designed representations and input features**
>
> 传统机器学习都是围绕决策树、逻辑回归、朴素贝叶斯、支持向量机等概念，**本质在于我们所做的就是由人类来仔细审视一个特定的问题，找出解决这个问题的关键要素，然后设计出与该问题相关的重要特征要素，然后手写代码来识别这些特征**。
>
> by these way, machine learned nothing.
>
> 倒是研究员仔细研究问题、做了大量的数据分析、做理论研究，究竟哪些属性事重要的。
>
> **Machine learning becomes just optimizing weights to best make a final prediction.**

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/lXJVyC.png" alt="lXJVyC" style="zoom:25%;" />

> 深度学习是表证学习的一个分支，我们可以只向电脑提供来自世界的原始信号（无论是视觉信号还是语言信号）
>
> then computer can **automatically good intermedia representations that will allow it to do tasks well**.
>
> 所以从某种意义上来说，它是在自己定义特征（与机器学习中人们自己定义特征一样）**自动学习到好的特征，学习到多层表证**（deep learning名字的来源）

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/D9RyoU.png" alt="D9RyoU" style="zoom: 25%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/zisYWC.png" alt="zisYWC" style="zoom:25%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/AImEsf.png" alt="AImEsf" style="zoom:25%;" />

### 3. Course logistics in brief

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/zaREmW.png" alt="zaREmW" style="zoom: 25%;" />

### 4. Why is NLP hard?

![YEqZ2D](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/YEqZ2D.png)

- **语言本身存在模糊性**

> The Pope’s baby steps on gays

> Boy paralyzed after tumor fights back to gain black belt

> Scientists study whales from space

> Juvenile Court to Try Shooting Defendant

### 5. Deep NLP = Deep Learning + NLP

> next lecture「2」

- Word meaning as a neural word vector – visualization
- Word similarities http://nlp.stanford.edu/projects/glove/

> future lecture

- Representations of NLP Levels: Morphology(形态)

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/RMD0mL.png" alt="RMD0mL" style="zoom:33%;" />

- NLP Tools: Parsing for sentence structure（句法分析：找出句法结构，找到句子的停顿点）
- Representations of NLP Levels: Semantics（understand the meaning of sentence，语义分析）
- NLP Applications: Sentiment Analysis（情感分析，理解句子中正负面情绪）
- Question Answering（语音机器人：拥有语音和语言理解界面）
- Dialogue agents / Response Generation
- Machine Translation
- **Neural Machine Translation**

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/EmuRxO.png" alt="EmuRxO" style="zoom: 33%;" />

> Conclusion: Representation for all levels? Vectors

