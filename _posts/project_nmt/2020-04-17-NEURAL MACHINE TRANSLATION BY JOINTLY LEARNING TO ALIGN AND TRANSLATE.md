---
title: "读paper「nmt02」"
subtitle: "NEURAL MACHINE TRANSLATION BY JOINTLY LEARNING TO ALIGN AND TRANSLATE, Bengio 2015"
layout: post
author: "echisenyang"
header-style: text
hidden: false
catalog: true
tags:
  - nmt
  - paper with code
---



### SMT vs NMT

- SMT (statistical machine translation)
  - 以 phrase-based translation system 为例，which **consists of many small sub-components that are tuned separately**. 
  - traditional phrase-based translation systems performed their task by breaking up source sentences into multiple chunks and then translated them phrase-by-phrase. This led to disfluency in the translation outputs and was not quite like how we, humans, translate.
- NMT (neural machine translation) 
  - aims at building a single neural network that can be **jointly tuned** to maximize the translation performance.



### NMT的缺陷与要解决的问题

- The models proposed recently for neural machine translation often **belong to a family of encoder–decoders** and **encode a source sentence into a ﬁxed-length vector (这个fixed vactor指的就是rnn最后一个节点的输出隐状态)** from which a decoder generates a translation. 这将给encoder带来巨大的压力，因为要把 **all the necessary information of a source sentence compressed  into a ﬁxed-length vector**。
- 为此，作者提出 **(soft-)search** for parts of a source sentence that are relevant to predicting a target word，这个可以看作是attention思想的前身吧？或者说异曲同工之妙，毕竟本文（2015）和attention（2014）都是**Bengio团队**提出的。
  - The most important distinguishing feature of this approach from the basic encoder–decoder is that **it does not attempt to encode a whole input sentence into a single ﬁxed-length vector**. Instead, **it encodes the input sentence into a sequence of vectors and chooses a subset of these vectors adaptively while decoding the translation**. This **frees** a neural translation model **from having to squash all the information** of a source sentence, regardless of its length, into a ﬁxed-length vector. We show this allows a model to cope better with long sentences.



### NMT的背景

1. 从概率的角度来看，机器翻译 is equivalent to ﬁnding a target sentence $y$ that **maximizes the conditional probability** of y given a source sentence $x$, i.e., $argmax_y {p(y \mid x)}$.

2. 一系列的学术研究表明 NMT 可以 directly learn this conditional distribution.
3. RNN Encoder–Decoder的运作方式：
   - encoder把输入句子 $x=\{x_{1}, \cdots, x_{T_{x}}\}$ 转换为 $c=q\{\left\{h_{1}, \cdots, h_{T_{x}}\right\}\}$ 
   - decoder根据 **context vector** $c$ 和 **all the previously predicted words** $\{\{y_{1}, \cdots, y_{t-1}\}$ 来预测下一个词，$p(y=\prod_{t=1}^{T} p\{y_{t}  \mid \{y_{1}, \cdots, y_{t-1}\}, c\}$. 



### Decoder Architecture

果然就是attention，只不过这个时候还没有明着称呼。。。

![qsfqia](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/qsfqia.png)

含义：

- Let $α_{ij}$ be **a probability that the target word $y_i$ is aligned to, or translated from, a source word** $x_j$. Then, the i-th context vector $c_i$ is the expected annotation over all the annotations with probabilities $α_{ij}$. 
- Then, **the i-th context vector $c_i$ is the expected annotation over all the annotations with probabilities** $α_{ij}$ .

- **The probability $α_{ij}$ , or its associated energy $e_{ij}$ , reﬂects the importance of the annotation $h_j$ with respect to the previous hidden state $s_{i−1}$ in deciding the next state $s_i$ and generating $y_i$**.

打扰了，这里还是提到了attention。。。

Intuitively, this implements a mechanism of attention in the decoder. **The decoder decides parts of the source sentence to pay attention to**. By letting the decoder have an attention mechanism, we **relieve the encoder from the burden of having to encode all information in the source sentence into a ﬁxed length vector**. With this new approach the information can be spread throughout the sequence of annotations, which can be **selectively retrieved** by the decoder accordingly.



### Encoder Architecture

采用双向 BiRNN，双向的概念 $h_{j}=\left[\overrightarrow{h}_{j}^{\top} ; \overleftarrow{h}_{j}^{\top}\right]$ 使得 the annotation $h_j$ will be **focused on the words around** $x_j$. 



### 实验结果

![5usmh5](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/5usmh5.png)

**One of the motivations behind the proposed approach was the use of a ﬁxed-length context vector in the basic encoder–decoder approach**. 

- **We conjectured that this limitation may make the basic encoder–decoder approach to underperform with long sentences**. 
- In Fig. 2, we see that the performance of **RNNencdec** dramatically **drops as the length of the sentences increases**. 
- On the other hand, **both RNNsearch-30 and RNNsearch-50** are more **robust to the length of the sentences**. RNNsearch50, especially, shows no performance deterioration even with sentences of length 50 or more. This superiority of the proposed model over the basic encoder–decoder is further conﬁrmed by the fact that the RNNsearch-30 even outperforms RNNencdec-50 (see Table 1).

![hxokpF](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/hxokpF.png)

![15cWUX](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/15cWUX.png)

**The strength of the soft-alignment**, opposed to a hard-alignment, is evident, for instance, from Fig. 3 (d). Consider the source phrase [**the man**] which was translated into [**l’ homme**].

- Any **hard alignment** will **map [the] to [l’] and [man] to [homme]**. This is not helpful for translation, as one must consider the word following [the] to determine whether it should be translated into [le], [la], [les] or [l’]. Our soft-alignment solves this issue naturally by letting the model look at both [the] and [man], and in this example, we see that the model was able to correctly translate [the] into [l’]. 
- We observe similar behaviors in all the presented cases in Fig. 3. **An additional beneﬁt of the soft alignment is that it naturally deals with source and target phrases of different lengths, without requiring a counter-intuitive way of mapping some words to or from nowhere ([NULL])** (see, e.g., Chapters 4 and 5 of Koehn, 2010).



### challenges

One of challenges left for the future is to better handle unknown, or rare words. This will be required for the model to be more widely used and to match the performance of current state-of-the-art machine translation systems in all contexts.

