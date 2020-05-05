---
title: "Coreference Resolution"
subtitle: "CS224N 284「15」"
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



## Coreference Resolution

![njFGoj](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/njFGoj.png)

### 1. What is coreference? A worked example (25 mins)

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/dVLid2.png" alt="dVLid2" style="zoom:25%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/XyjvSv.png" alt="XyjvSv" style="zoom:25%;" />

- 共指消解：用coreference chain来处理machine translation中的性别问题。

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/VUqiRb.png" alt="VUqiRb" style="zoom:25%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/8MViSz.png" alt="8MViSz" style="zoom:25%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/5m4gY6.png" alt="5m4gY6" style="zoom:25%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/ayQqui.png" alt="ayQqui" style="zoom:25%;" />

### 2.Anaphora vs. coreference

- **共指下解**：一般遇到的指代都是指上文出现的词，但是这里是指代下文。

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/IxZLkv.png" alt="IxZLkv" style="zoom:25%;" />

- 目前的共指消解并没有处理好这完全不同的两方面

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/54JEFy.png" alt="54JEFy" style="zoom:25%;" />

### 3.【highlight】Summarizing Source Code using a Neural Attention Model

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/8BHDj9.png" alt="8BHDj9" style="zoom:25%;" />

### 4. Introduction to coreference resolution (15 mins)

- 复杂的机械过程，用于决定一个代词指代什么

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/KqqseJ.png" alt="KqqseJ" style="zoom:25%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/RBaT5z.png" alt="RBaT5z" style="zoom:25%;" />

- 基于知识之上的代词共指

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/vD4sDQ.png" alt="vD4sDQ" style="zoom:25%;" />

- 基于mention pair的二元决策、对candidate进行排序、Entity-Mention

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/0QvHbh.png" alt="0QvHbh" style="zoom:25%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/JPJik7.png" alt="JPJik7" style="zoom:25%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/MFXqOD.png" alt="MFXqOD" style="zoom:25%;" />

### 5. Neural coreference resolution (Clark and Manning 2016) (20m)

- 利用神经网络做共指消解的文章不多

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/DYvU8t.png" alt="DYvU8t" style="zoom:25%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/z3Kg0n.png" alt="z3Kg0n" style="zoom:25%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/fIU53M.png" alt="fIU53M" style="zoom:25%;" />

- 利用强化学习

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/0oLYsZ.png" alt="0oLYsZ" style="zoom:25%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/oGPstR.png" alt="oGPstR" style="zoom:25%;" />

