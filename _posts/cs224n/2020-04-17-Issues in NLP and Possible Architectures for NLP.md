---
title: "Issues in NLP and Possible Architectures for NLP"
subtitle: "CS224N 284「17」"
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



## Issues in NLP and Possible Architectures for NLP

![gkxtVF](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/gkxtVF.png)

### 1. Solving language: High-level needs

- Yann LeCun, Geoff Hinton, Yoshua Benjio

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/n9mf7J.png" alt="n9mf7J" style="zoom:25%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/Or7Dav.png" alt="Or7Dav" style="zoom:25%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/jhPzcW.png" alt="jhPzcW" style="zoom:25%;" />

- 回看过去是怎么处理nlp技术的，然后从历史中取其精华
  -  we are going to have any kind of natural language understanding was to have a knowledge base that you could work with and reason on. (30年前：可以用于推理使用的知识库)
  - 在过去20年的时间内，显示出实际上有很多自然语言处理是可以仅仅通过文本的组成而不需要任何知识库就可以进行
- 现在
  - **BiLSTMs with attention** seem to be taking over the field and improving our ability to do everything
  - **Neural methods** are leading to a renaissance for all language generation tasks (i.e., MT, dialog, QA, summarization, …)

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/nYuLyl.png" alt="nYuLyl" style="zoom:25%;" />

- 但是
  - 我们拥有的记忆依然是短期记忆，并不像大脑一样可以记忆那么久
  - 我们可以处理好一句好中的语义理解问题，但是无法处理好从句，以及多个句子之间的语义逻辑

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/NguXaX.png" alt="NguXaX" style="zoom:25%;" />

### 2. Political Ideology Detection Using Recursive Neural Networks

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/HyXAlg.png" alt="HyXAlg" style="zoom:25%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/I2uiEf.png" alt="I2uiEf" style="zoom:25%;" />

- 循环网络的缺陷：通常很慢，但是可以并行计算；而tree rnn因为每一句结构都不相同，所以削弱了并行计算的能力

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/ocTR23.png" alt="ocTR23" style="zoom:25%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/HaoHhN.png" alt="HaoHhN" style="zoom:25%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/MF0Dps.png" alt="MF0Dps" style="zoom:25%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/wd3YcM.png" alt="wd3YcM" style="zoom:25%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/VArCdr.png" alt="VArCdr" style="zoom:25%;" />

- **manning依然相信tree rnn的优势**：当语句具有更精细的语义事实，比如否定语义、树模型会表现的更好，另外对于非常长的句子，树模型通常表现较好

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/aEHyW8.png" alt="aEHyW8" style="zoom:25%;" />

### 3.【hightlight】Learning to Compose Neural Networks for Question Answering

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/J6m2jZ.png" alt="J6m2jZ" style="zoom:25%;" />

### 4. Brief Interlude: Models with a pointer/copying

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/nG1WNy.png" alt="nG1WNy" style="zoom:25%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/TrOlLV.png" alt="TrOlLV" style="zoom:25%;" />

### 5. Below the word: Writing systems

- 中文的writting system不能很明确的区分单词

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/fPRdYu.png" alt="fPRdYu" style="zoom:25%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/mHPquy.png" alt="mHPquy" style="zoom:25%;" />

- 传统意义上来讲，**更小的语义单位是词素Morphology** 

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/iHD7Cz.png" alt="iHD7Cz" style="zoom:25%;" />

- 用n-gram的方式进行替代

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/njPw4P.png" alt="njPw4P" style="zoom:25%;" />

- Character-Level Models：letter by letter

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/GOdtks.png" alt="GOdtks" style="zoom:25%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/KY6PRd.png" alt="KY6PRd" style="zoom:25%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/QgCBIs.png" alt="QgCBIs" style="zoom:25%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/krS12J.png" alt="krS12J" style="zoom:25%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/HdYTUv.png" alt="HdYTUv" style="zoom:25%;" />

- Sub-word NMT: two trends
  - 趋势一：使用sub-word units的神经机器翻译模型，但是架构和之前是一样的
  - 趋势二：将字符输入架构中

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/fvLr3g.png" alt="fvLr3g" style="zoom:25%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/cqAt1p.png" alt="cqAt1p" style="zoom: 50%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/OCwRkW.png" alt="OCwRkW" style="zoom:25%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/uSObKk.png" alt="uSObKk" style="zoom:25%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/Drxw0R.png" alt="Drxw0R" style="zoom: 50%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/Zt9zAt.png" alt="Zt9zAt" style="zoom: 50%;" />

Hybrid NMT的工作既保留了character层级系统的好处，同时也允许用户能够在word层级进行翻译。

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/eEg57o.png" alt="eEg57o" style="zoom:25%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/i0ypWy.png" alt="i0ypWy" style="zoom:25%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/CVTHwv.png" alt="CVTHwv" style="zoom:25%;" />

