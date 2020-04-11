---
title: "brief summary of papers"
subtitle: "nmt"
layout: post
author: "echisenyang"
header-style: text
hidden: true
catalog: true
tags:
  - nmt
---





## 〇、总结

- **traditional phrase-based v.s NMT**

  Back in the old days, traditional phrase-based translation systems performed their task by breaking up source sentences into multiple chunks and then translated them phrase-by-phrase. This led to disfluency in the translation outputs and was not quite like how we, humans, translate. We read the entire source sentence, understand its meaning, and then produce a translation. Neural Machine Translation (NMT) mimics that!

  - By using encoder-decoder architecture, **NMT addresses the local translation problem in the traditional phrase-based approach**: it can capture *long-range dependencies* in languages, e.g., gender agreements; syntax structures; etc., and produce much more fluent translations
  - 

## 一、Paraphrase

### 1.Neural Clinical Paraphrase Generation with Attention [2015,huawei]

Clinical paraphrase generation is especially vital in building patient-centric clinical decision support (CDS) applications where users are able to understand complex clinical jargons via easily comprehensible alternative paraphrases.

> 专业领域背景：临床医学

Unlike **bilingual** machine translation, **monolingual** machine translation considers the source language the same as the target language, which allows for its adaptation as a paraphrase generation task.

> 学术背景：monolingual machine translation（单一语种）、paraphrase generation task

We propose an **end-to-end neural network** built on an **attention-based bidirectional Recurrent Neural Network (RNN) architecture** with an **encoderdecoder framework** to perform the task. Conventional bilingual NMT models mostly rely on word-level modeling and are often **limited by out-of-vocabulary (OOV)** issues. In contrast, we represent the **source and target paraphrase pairs** as character sequences to address this limitation. 

> end-to-end、attention-based、biRNN、encoderdecoder、支持word-level/character-level
>
> ❓ source and target paraphrase pairs

**评估结果：未提供完整的实现，只提供了RNN模块的实现https://github.com/lisa-groundhog/GroundHog（RNN templates provided by the GroundHog library），环境基于Theano，实验结果偏向于短语的组合而不是完整的句子。**

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/1Uelw8.png" alt="1Uelw8" style="zoom:33%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/HqluPS.png" alt="HqluPS" style="zoom:50%;" />

### 

### 2.Decomposable Neural Paraphrase Generation [2019,huawei]

**Paraphrases** are texts that convey the same meaning using different wording. (**Paraphrases定义**)

**Paraphrase generation** is an important technique in natural language processing (NLP)

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/a0sMop.png" alt="a0sMop" style="zoom:50%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/2sTced.png" alt="2sTced" style="zoom:50%;" />

- **Separator**

  In this work we employ the stacked LSTMs to compute the distribution of the latent variables recursively

- **Multi-granularity encoder and decoder**

  Based on the Transformer design in Vaswani et al. (2017), each encoder or decoder is composed of positional encoding, stacked multihead attention, layer normalization, and feedforward neural networks.

  <img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/xBuooR.png" alt="xBuooR" style="zoom:50%;" />

- **Aggregator**

  <img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/UF1MGR.png" alt="UF1MGR" style="zoom:50%;" />

评估：是一个比较新的思路，但是没有相应的实现，而且对数据的要求比较高（**相同模式**）

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/hXPIOs.png" alt="hXPIOs" style="zoom:67%;" />

### 3.Query and Output: Generating Words by Querying Distributed Word Representations for Paraphrase Generation【2018】

---

**Abstract**

- 背景：翻译的句子语法正确但是语义有问题

**Most recent approaches use the sequenceto-sequence model for paraphrase generation**. The existing sequence-to-sequence model tends to memorize the words and the patterns in the training dataset instead of learning the meaning of the words. **Therefore, the generated sentences are often grammatically correct but semantically improper.**

- how to evaluate

Following previous work, we evaluate our model on two paraphrase-oriented tasks, namely **text simpliﬁcation** and **short text abstractive summarization**.

---

**Introduction**

- definition

  **Paraphrase is a restatement of the meaning of a text using other words**. Many natural language generation tasks are paraphrase-orientated, such as text simpliﬁcation and short text summarization.

- problem

  One of the problem is that the **existing sequence-to-sequence model tends to memorize the words and the patterns in the training dataset instead of the meaning of the words**.

---

**Proposed Model**

![4kjomi](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/4kjomi.png)

- Word Embedding Attention Network is based on the encoder-decoder framework, which consists of two components: **a source text encoder, and a target text decoder**.
  - Given the source texts, the **encoder** compresses the **source texts into dense representation vectors**, and the **decoder** generates the **paraphrased texts**.
  - Our proposed model **generates the words by querying distributed word representations (i.e. neural word embeddings), hoping to capturing the meaning of the according words.**

---

**最大创新点：加入了更新word embedding的query机制，the word embedding is updated from three sources: the input of the encoder, the input of the decoder, and the query of the output layer. 达到捕捉语义信息的目的，但是本质还是encoderdecoder framework**

基于pytorch实现 https://github.com/lancopku/WEAN

### 4.Paraphrase Generation with Latent Bag of Words

**Introduction**

- Paraphrases are **deﬁned** as sentences conveying the same meaning but with different surface realization.

![QkOGIs](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/QkOGIs.png)

- we propose a **hierarchical latent bag of words mode**l for planning and realization. Our model uses words of the **source sentence** to **predict** their **neighbors** in the bag of words from target sentences

![8oTAPA](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/8oTAPA.png)

**总结：seq2seq模型，加入了cbow加强语义信息**

tensorflow实现 https://github.com/FranxYao/dgm_latent_bow

### 5.Automatic Compilation of Resources for Academic Writing and Evaluating with Informal Word Identiﬁcation and Paraphrasing System

![Wzs7u5](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/Wzs7u5.png)

总结：做的是Academic writing，就是把某些词替换为更学术专业的词，不符合

### 6.Learning Semantic Sentence Embeddings using Pair-wise Discriminator

![gr8SDU](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/gr8SDU.png)

总结：encoder-decorder框架+pair-wise discriminator

pytorch版 https://github.com/badripatro/PQG

### 7.Building a Non-Trivial Paraphrase Corpus using Multiple Machine Translation Systems

总结 Paraphrase Identification领域文章，Paraphrase Identification的任务是Given any pair of sentences, automatically identifies whether these two sentences are paraphrases。



### 二、NMT

### 1.NEURAL MACHINE TRANSLATION BY JOINTLY LEARNING TO ALIGN AND TRANSLATE [2015,ICLR,Yoshua Bengio]

The models proposed recently for neural machine translation often belong to **a family of encoder–decoders** and **encode a source sentence into a ﬁxed-length vector** from which a decoder generates a translation. 

> In this paper, we **conjecture that the use of a ﬁxed-length vector is a bottleneck** in improving the performance of this basic encoder–decoder architecture, and propose to extend this by allowing a model to **automatically (soft-)search for parts of a source sentence that are relevant to predicting a target word, without having to form these parts as a hard segment explicitly.(打破了encode输出是fix-length的局限)**

> **In order to address this issue, we introduce an extension to** the encoder–decoder model which learns to align and translate jointly. Each time the proposed model generates a word in a translation, it (soft-)searches for **a set of positions in a source sentence (a set of input words)** where the most relevant information is concentrated. The model then predicts a target word based on the context vectors associated with these source positions and all the previous generated target words.

**未解决的挑战**：One of challenges left for the future is to better handle unknown, or rare words. This will be required for the model to be more widely used and to match the performance of current state-of-the-art machine translation systems in all contexts.

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/drbcGv.png" alt="drbcGv" style="zoom:50%;" />

框架与Neural Clinical Paraphrase Generation with Attention [2015,huawei]一致，实现的复现代码都是基于https://github.com/lisa-groundhog/GroundHog，同样也是基于Theano

还有一个5k🌟的tensorflow版本，这个还挺靠谱 https://github.com/tensorflow/nmt

### 2.Google’s Neural Machine Translation System: Bridging the Gap between Human and Machine Translation [2016,google]

Unfortunately, NMT systems are known to be **computationally expensive** both in training and in translation inference – sometimes prohibitively so in the case of very large data sets and large models. Several authors have also charged that NMT systems **lack robustness**, particularly when input sentences contain rare words. These issues have **hindered NMT’s use in practical deployments and services**, where both accuracy and speed are essential.

> GNMT就是处理这些issues的，训练预测提速，解决robustness问题

**Three inherent weaknesses of Neural Machine Translation** are responsible for this gap: 

- its slower training and inference speed, 

  > **residual** connections

- ineﬀectiveness in dealing with rare words, 

  > There are two broad categories of approaches to address the translation of out-of-vocabulary (OOV) words. **One approach is to simply copy rare words from source to target**. Another broad category of approaches is to **use sub-word units**, e.g., chararacters [10], mixed word/characters [28], or more intelligent sub-words [38]. (**wordpiece**)

- and sometimes failure to translate all words in the source sentence.

  > decoder阶段用beam search technique

![TnmVRt](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/TnmVRt.png)

实现：找到了一个**非官方不再维护的tensorflow版本**https://github.com/shawnxu1318/Google-Neural-Machine-Translation-GNMT

![z9PjoK](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/z9PjoK.png)

❓ 中文有wordpiece吗？

### 3.OpenNMT: Open-Source Toolkit for Neural Machine Translation [2017,harvard]

4k 🌟PyTorch https://github.com/OpenNMT/OpenNMT-py

1k 🌟tf版本  https://github.com/OpenNMT/OpenNMT-tf
使用文档 https://opennmt.net/OpenNMT/

![4ge1dp](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/4ge1dp.jpg)

![qZQgrI](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/qZQgrI.png)

![QCHsyh](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/QCHsyh.png)

![Bg5stA](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/Bg5stA.png)





