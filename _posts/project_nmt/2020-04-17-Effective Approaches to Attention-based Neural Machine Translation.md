---
title: "读paper「nmt02」"
subtitle: "Effective Approaches to Attention-based Neural Machine Translation, manning 2015"
layout: post
author: "echisenyang"
header-style: text
hidden: true
catalog: true
tags:
  - nmt
  - paper with code
---



An **attentional** mechanism has lately been used to improve neural machine translation (NMT) by **selectively focusing on parts of** the source sentence during translation.

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/4idBS6.png" alt="4idBS6" style="zoom:50%;" />



### Global vs Local attention

This paper **examines two simple and effective classes of attentional mechanism**: 

- a **global** approach which always attends to **all source words**
  - 由(Bahdanau et al., 2015)简化而来
- a **local** one that only looks at **a subset of source words** at a time.
  - viewed as an interesting **blend between the hard and soft attention models** proposed in (Xu et al., 2015): it is **computationally less expensive** than the global model or the soft attention; at the same time, unlike the hard attention, the local attention is **differentiable almost everywhere,** making it easier to implement and train.

![8dy2Lt](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/8dy2Lt.png)





### Hard vs Soft attention

- **soft attention** is when we **calculate the context vector as a weighted sum of the encoder hidden states** as we had seen in the figures above.
  - 传统的Attention Mechanism就是Soft Attention,即**通过确定性的得分计算来得到attended之后的编码隐状态**。Soft Attention是参数化的（Parameterization），因此可导，可以被嵌入到模型中去，直接训练。梯度可以经过Attention Mechanism模块，反向传播到模型其他部分。
- **Hard attention** is when, instead of weighted average of all hidden states, **we use attention scores to select a single hidden state**. 
  - **The selection is an issue**, because we could **use** a function like **argmax** to make the selection, but it is **not differentiable**
  -  (*we are selecting an index corresponding to max score when we use argmax and nudging the weights to move the scores a little as part of backprop will not change this index selection*) and therefore more complex techniques are employed. 
  - 相反，Hard Attention是一个随机的过程。**Hard Attention不会选择整个encoder的隐层输出做为其输入**，Hard Attention会依概率Si来采样输入端的隐状态一部分来进行计算，而不是整个encoder的隐状态。为了实现梯度的反向传播，需要采用**蒙特卡洛采样**的方法来估计模块的梯度。

![tbUTO0](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/tbUTO0.png)



### Neural Machine Translation

A neural machine translation system is a neural network that directly **models the conditional probability $p(y \mid x)$ of translating a source sentence, $x_1 , . . . , x_n$ , to a target sentence, $y_1 , . . . , y_m$.**

two components:

- an ***encoder*** which computes a representation **s** for each source sentence
- a ***decoder*** which generates one target word at a time and hence **decomposes the conditional probability** as: $\log p(y  \mid  x)=\sum_{j=1}^{m} \log p\left(y_{j}  \mid  y_{<j}, \boldsymbol{s}\right)$ 
  - In more detail, one can **parameterize the probability of decoding each word** $y_j$ as:

    $$
p\left(y_{j}  \mid  y_{<j}, \boldsymbol{s}\right)=\operatorname{softmax}\left(g\left(\boldsymbol{h}_{j}\right)\right)
    $$
    
  - where **f** **computes the current hidden state** given the previous hidden state and can be *either a vanilla RNN unit, a GRU, or an LSTM unit*.

    $$
\boldsymbol{h}_{j}=f\left(\boldsymbol{h}_{j-1}, \boldsymbol{s}\right)
    $$
    
  - the source representation **s** is only **used once to initialize the decoder hidden state**. (不用attention的话)
  
  - Our training objective is formulated as follows:

$$
J_{t}=\sum_{(x, y) \in \mathbb{D}}-\log p(y  \mid  x)
$$



### attention技术细节

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/Y0r61g.png" alt="Y0r61g" style="zoom: 50%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/qq6AGH.png" alt="qq6AGH" style="zoom:50%;" />

Global attention 通过遍历每一个encoder层的隐状态 $\overline{h_{s}}$，来获得与当前decoder层状态打分函数值，这个值代表了某种程度上的关联性。 从而，the context vector $c_t$ is computed as the weighted average over all the source hidden states  $\overline{\boldsymbol{h}}_{s}$.  

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/BPoOHa.png" alt="BPoOHa" style="zoom:50%;" />

下面是部分attention的打分函数

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/uZKWDp.png" alt="uZKWDp" style="zoom:50%;" />

**计算顺序简单**：we go from $h_t → a_t → c_t → \overline{h_t}$ then make a prediction as detailed.

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/2eYoKZ.png" alt="2eYoKZ" style="zoom:50%;" />

**The global attention has a drawback that it has to attend to all words on the source side for each target word, which is expensive** and can potentially **render it impractical to translate longer sequences**, e.g., paragraphs or documents. 

- To address this deﬁciency, we propose a local attentional mechanism that **chooses to focus only on a small subset of the source positions per target word**.
- This model takes inspiration from the **tradeoff between the soft and hard attentional** models proposed by Xu et al. (2015) to tackle the image caption generation task.
  - In their work, **soft attention** refers to the global attention approach in which weights are placed “softly” **over all patches** in the source image. 
  - The **hard attention**, on the other hand, **selects one patch** of the image to attend to at a time. While less expensive at inference time, the hard attention model is **non-differentiable and requires more complicated techniques** such as ***variance reduction*** or ***reinforcement learning*** to train.

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/GVp6qm.png" alt="GVp6qm" style="zoom:50%;" />



### 实验结果

![JqzYJi](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/JqzYJi.png)

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/zqAKZg.png" alt="zqAKZg" style="zoom:50%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/iFsedc.png" alt="iFsedc" style="zoom:50%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/R1cWn8.png" alt="R1cWn8" style="zoom: 67%;" />

