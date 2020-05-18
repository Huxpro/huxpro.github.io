---
title: "机器翻译评价指标"
subtitle: "bleu & ppl"
layout: post
author: "echisenyang"
header-style: text
hidden: true
catalog: true
tags:
  - nmt
  - paper with code
---



### Bleu

- reference: [BLEU: a Method for Automatic Evaluation of Machine Translation]

Bleu 全称为 Bilingual Evaluation Understudy（双语评估研究） ，意为双语评估替换，是衡量一个有多个正确输出结果的模型的精确度的评估指标。

BLEU的设计思想与评判机器翻译好坏的思想是一致的：机器翻译结果越接近专业人工翻译的结果，则越好。BLEU算法实际上在做的事：判断两个句子的相似程度。我想知道一个句子翻译前后的表示是否意思一致，显然没法直接比较，那我就拿这个句子的标准人工翻译与我的机器翻译的结果作比较，如果它们是很相似的，说明我的翻译很成功。因此，BLUE去做判断：一句机器翻译的话与其相对应的几个参考翻译作比较，算出一个综合分数。这个分数越高说明机器翻译得越好。

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/CfZg2W.png" alt="CfZg2W" style="zoom: 50%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/vL3jen.png" alt="vL3jen" style="zoom: 50%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/dsrgRm.png" alt="dsrgRm" style="zoom: 50%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/nLCnO1.png" alt="nLCnO1" style="zoom: 50%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/zsskjp.png" alt="zsskjp" style="zoom: 50%;" />

#### 计算公式

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/qJTtpi.jpg" alt="qJTtpi" style="zoom: 33%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/l9InsX.png" alt="l9InsX" style="zoom: 67%;" />

#### 举例

![bleu，ppl-1](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/bleu，ppl-1.jpg)

### Perplexity (ppl)

In general, perplexity is a measurement of **how well a probability model predicts a sample**.

![Z1BZmq](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/Z1BZmq.jpg)

**But why is perplexity in NLP defined the way it is?**

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/Wis15J.jpg" alt="Wis15J" style="zoom:33%;" />

If you look up **the perplexity of a discrete probability distribution** in Wikipedia:

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/vpJO34.jpg" alt="vpJO34" style="zoom: 33%;" />

where **H(p) is the entropy of the distribution p(x)** and *x* is a random variable over all possible events.

Then, **perplexity is just an exponentiation of the entropy!**

- Yes. Entropy is the average number of bits to encode the information contained in a random variable, so the exponentiation of the entropy should be **the total amount of all possible information,** or more precisely, the weighted average number of choices a random variable has**.**
- For example, **if the average sentence in the test set could be coded in 100 bits, the model perplexity is 2¹⁰⁰ per sentence.**

![EQ4r3N](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/EQ4r3N.jpg)

