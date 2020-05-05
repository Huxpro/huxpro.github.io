---
title: "Neural Machine Translation and Models with Attention"
subtitle: "CS224N 284「10」"
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



## Neural Machine Translation and Models with Attention

![Sc21OA](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/Sc21OA.png)

### 1. Translation, Machine Translation, Neural Machine Translation

> neraul machine translation is used to mean what we want to do is build one big neural network which we can train the entire end-to-end machine translation process in and optimize end-to-end. 以一种端到端的方式进行训练与优化。

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/usOkDI.png" alt="usOkDI" style="zoom:25%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/cw01E8.png" alt="cw01E8" style="zoom:25%;" />

- **[Sutskever et al. 2014, cf. Bahdanau et al. 2014, et seq.]**

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/cPSS1j.png" alt="cPSS1j" style="zoom:33%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/LN2wpR.png" alt="LN2wpR" style="zoom:33%;" />

> **<font color=red>如果我们采用这种RNNs模型，when we have this Y that we've encoded the source, there's a question how we use it. 本质上，当我们计算到encoder的最后一个节点输出 Y ，然后我们使用 Y 作为隐层的起点并开始解码的过程。如果采用这种极具google风格的方案，we put most of the pressure on the forget gats not doing too much forgetting，因为我们源语句的所有信息都在 Y 中，我们必须确保 Y 在前向传递时能够携带足够的信息，这样才能在生成目标语句的时候仍能持有源语句的语义信息。</font>**

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/qXAGHT.png" alt="qXAGHT" style="zoom:25%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/gocOCO.png" alt="gocOCO" style="zoom:25%;" />

- **蒙特利尔大学**

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/SFBZIY.png" alt="SFBZIY" style="zoom:25%;" />

> 为了在 Y 保留尽可能多的信息，可以采用 LSTM 的方式，但是这不是唯一的solution。这篇蒙特利尔大学的文章提出：once calculate  Y (the representation of the source) , they fed that Y into every time step during the period of generation. 在解码的每一步中都使用了 Y ，这样在每一步预测中 Y 与 上一个预测的输出可以作为条件概率供下一个预测使用。

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/vaLXlf.png" alt="vaLXlf" style="zoom:25%;" />

![XwHymH](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/XwHymH.png)

![PON2Ws](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/PON2Ws.png)

- **Four big wins of Neural MT**
  1. End-to-end training：用端到端的方式进行训练，意味着可以用一个单一的损失函数同时训练模型的所有参数。这已被证明是一个巨大的成功，意味着我们可以用单一的反向传播算法对模型整体进行优化，所以很容易做端到端的训练，并且十分有效。
  2. Distributed representations share strength：分布式的表示允许我们在相似的词语和短语之间建立统计关系，share statistical strength between similar words, similar phrases，并且借此获得更好的预测。
  3. Better exploitation of context：能够更好的利用上下文信息。
  4. More fluent text generation：神经机器翻译的模型非常善于生成流畅的文本，尽管有时生成的文本质量不高，但是流畅性可以一直得到保证。

![X01Xnt](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/X01Xnt.png)

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/ygZcyt.png" alt="ygZcyt" style="zoom:25%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/yWjXD4.png" alt="yWjXD4" style="zoom:25%;" />

> 比较好的机器翻译模型基本都是在2016年后，因为从那之后采用了nmt。

### 2.【hightlight】Google’s Multilingual Neural Machine Translation System: Enabling Zero-Shot Translation

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/lRLrhb.png" alt="lRLrhb" style="zoom: 33%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/bkqVC7.png" alt="bkqVC7" style="zoom:33%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/afgam2.png" alt="afgam2" style="zoom:33%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/AXDWT0.png" alt="AXDWT0" style="zoom:33%;" />

> **google nmt的巨大成就：在这之前，传统的机器翻译模型处理“桥接”问题时，需要利用中间语言，翻译两次（比如法语->中文的翻译，需要从法语->英语，再用英语作为中间语言interlingua，实现英语->中文的翻译）如果将世界上80种语言都实现双语翻译，需要80个encoder与80个decoder，所以在这之前需要构建所有的双语bilingual系统。nmt的高明之处在于可以直接将the encoding of neural network system ba an effective interlingual，即直接将这种编码当作中间语言。**

### 3. Introducing Attention: Vanilla seq2seq & long sentences

![2rWjIo](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/2rWjIo.png)

> **<font color=red>用简单的encoder-decoder会遭遇一个这样的问题：即我们只用一个固定维数的向量 Y 来表示输入，即encoder中的最后一个状态。而整个解码过程中，我们都将依赖这个 Y。 人们发现，如果使用这样的系统，往往只在翻译短句的时候表现比较好，但是翻译长句时效果会显著降低。</font>**

- 第一种假设solution

  与其使用编码器的最后一个隐状态 Y 生成目标语句，不如直接使用编码过程中所有的隐层编码向量。这样在翻译时，可以根据需求找到所需的source语句的encoding。注意力attention机制便是上述过程的一种具体形式，但从更广泛的意义上来说

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/VB58J4.png" alt="VB58J4" style="zoom: 25%;" />

> **<font color=red>attention：when we want to retrive as needed, 可以将这个过程理解成，请为我输出原编码的状态中的一部分，we want to be looking at where in the input we want to retrive stuff from，即在source中哪一个词是我们在翻译下一个词时着重关注的。因此，我们说，attenton模型在某种意义上成为了一种alignment model对齐模型，因为它告诉我们which part of the source are you next gonna be translating，也就构建了source与translation之间的一种隐式的对应关系。</font>**

![zd3OhC](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/zd3OhC.png)

具体做法：我们想要生成下一个词，并且我们想用隐层状态（🏾第一个棕色块）去 decide where to access our random access memory(图中蓝色部分表示所有内存)，此时我们还没有生成下一个隐状态。所以最好的方法是使用前一个隐层状态作为attenton模型的判别基准，为上个隐层状态（🏾第一个棕色块）和encoder阶段的所有隐层状态进行打分，每一个positon的打分结果表明分配了多少注意力。

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/6aY9kX.png" alt="6aY9kX" style="zoom: 33%;" />

so the model that they propose was, we get a score for each component of the momery, and what we gonna to do is combining all of the momeries weighted by the score. 之后将生成的分数交给softmax，softmax函数会返回一个概率分布，代表了不同的位置应该分配多少注意力机制。

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/MjvQlp.png" alt="MjvQlp" style="zoom:33%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/LzwR4a.png" alt="LzwR4a" style="zoom: 33%;" />

we combine together all of the hidden states of the encoder, weighted by how much attention we are paying on it. 这样，对他们进行**加权求和并得到上下文向量**，这样就可以不是简单的只使用last hidden unit (Y) ,而是用到了**entire hidden state of the encoder as our representation of meaning**. 并且在不同的时刻，我们生成的权重也不同，这表示我们在不同的位置分配的注意力分数是不一样的。然后我么就可以用 the previous hidden state of the encoder and the previous word of the decoder but also conditioned on the context vector，可以**用这三部分来generate the next word**. 

![kPyYAf](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/kPyYAf.png)

**三种不同的attention score function**：**第二种**score function中的w矩阵学习到了如何将不同的权重分配到点乘的不同部分，实际效果非常好，这样做可以让 $h_t$ 与 $h_s$ 产生交互，即使像**第一种**简单的点乘已经实现了这样的交互，但是加入 w 可以实现更复杂的交互。如果使用**第三种**那样的单层神经网络，那么实际上将会失去这种交互，因为 $h_t$ 与 $h_s$ 时分开的，并且分别乘以矩阵 $w_a$ 的不同区域，接下来的tanh指示按元素进行非线性变换，整个过程 $h_t$ 与 $h_s$ 没有任何交互（这和经典的单层感知机无法实现异或函数类似）。所以**第二种**是一种用少量参数就能实现 $h_t$ 与 $h_s$ 交互的方法。

![lDJZkl](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/lDJZkl.png)

之前的attention方式spread over the entire source encoding并且将此score函数的输出作为权重，这是一个kind of simple, easy to learn, a continuous, nice differentiable model，但是如果序列过长，模型的复杂度就会令人头疼（在后向传播过程中需要每时每刻将误差传递到所有的位置），因此人们开始寻求**局部注意力模型**，每次只将注意力放在一部分状态上的模型，这更像是从记忆中检索某些事物的概念。（局部注意力又叫hard attention，因为这丢失了可微性，一般结合用增强学习）

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/xas1Pj.png" alt="xas1Pj" style="zoom:25%;" />

![bs2Wjh](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/bs2Wjh.png)

> 想法来自于image caption，需要确保**注意到所有主要的位置**。这样才能根据图像生成描述文本，即不希望漏掉图像中的重要区域。这种想法被人们移植到了神经机器翻译中。

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/5cESvc.png" alt="5cESvc" style="zoom:25%;" />



<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/NFuHvu.png" alt="NFuHvu" style="zoom:25%;" />

> 还有很多注意力的变形，比如self-attention等。。。2017可能还没更新吧

### 4. Sequence Model Decoders: Decoding (0) – Exhaustive Search

![6KbX1i](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/6KbX1i.png)

不可能使用穷举的方式，因为我们有着巨大的词汇表。所以从概率上说一种非常好的方法是基于采样，即连续采样。即基于之前生成的词具有的概率分布，一次采样一个词，直到生成句尾的结束符号。

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/fBSW4v.png" alt="fBSW4v" style="zoom:25%;" />

从理论上来讲可以通过采样的方式得到无偏的且渐进准确的模型。但是如果从实践的角度讲，这不是一个好主意，因为它的方差特别大并且每次解码同一个句子时得到的结果都不相同。

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/LBw3RP.png" alt="LBw3RP" style="zoom:25%;" />

贪婪搜素的方式，当我们生成到 $t-1$ 个词时，我们使用模型，解出下一个概率最高的词，我们使用这个概率最高的词并重复这一过程。（贪婪搜索：每一步都是在给定前面的序列的情况下选出最好的词，但这无法保证整体生成的句子是最好的，因为每一步都有可能犯错。尽管这是有效的，但却远远不是最优的。）

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/ZxU2B0.png" alt="ZxU2B0" style="zoom:25%;" />

beam search，当我们生成到 $t-1$ 个词后，我们在下一时刻即 t 时刻，生成最可能的5个词（beam=5），然后在下一个时刻 $t+1$ 时刻也生成5个最有可能词，这时我们从这25个组合中挑出最可能的5个，并循环下去（每个时刻t保证选出固定大小的5个词）

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/d3EVqr.png" alt="d3EVqr" style="zoom:25%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/qcX8nR.png" alt="qcX8nR" style="zoom:25%;" />

目前最好的方法是beam search with small beam(通常取5-10)



