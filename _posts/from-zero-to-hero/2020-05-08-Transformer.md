---
title: "Transformer"
subtitle: "gpt、bert先导知识点"
layout: post
author: "echisenyang"
header-style: text
hidden: true
catalog: true
tags:
  - 输出计划
---



The Transformer was proposed in the paper [Attention is All You Need](https://arxiv.org/abs/1706.03762). A TensorFlow implementation of it is available as a part of the [Tensor2Tensor](https://github.com/tensorflow/tensor2tensor) package. Harvard’s NLP group created a [guide annotating the paper with PyTorch implementation](http://nlp.seas.harvard.edu/2018/04/03/attention.html).



### **A High-Level Look**

我们先将整个模型视为黑盒，比如在机器翻译中，接收一种语言的句子作为输入，然后将其翻译成其他语言输出。

![iElVoC](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/iElVoC.png)

Popping open that Optimus Prime goodness, we see **an encoding component**, **a decoding component**, and **connections between them**.

![wKcAkd](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/wKcAkd.png)



The **encoding** component is a **stack of encoders** (the paper stacks six of them on top of each other – there’s nothing magical about the number six, one can definitely experiment with other arrangements). The **decoding** component is a **stack of decoders** of the same number.

![ZA7tJX](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/ZA7tJX.jpg)

**The encoders are all identical in structure** (yet they do not share weights). Each one is broken down into **two sub-layers**:

- **The encoder’s inputs** first flow through a **self-attention layer** – a layer that **helps the encoder look at other words in the input sentence as it encodes a specific word**. We’ll look closer at self-attention later in the post.
- **The outputs of the self-attention layer** are fed to a **feed-forward neural network**. The exact same feed-forward network is independently applied to each position.
- The **decoder** has both those layers, but **between** them is an attention layer that **helps the decoder focus on relevant parts of the input sentence** (similar what attention does in [seq2seq models](https://jalammar.github.io/visualizing-neural-machine-translation-mechanics-of-seq2seq-models-with-attention/)).

![5pEu7b](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/5pEu7b.png)

![fHTZYi](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/fHTZYi.png)

### Bringing The Tensors Into The Picture

As is the case in NLP applications in general, we begin by turning each input word into a vector using an [embedding algorithm](https://medium.com/deeper-learning/glossary-of-deep-learning-word-embedding-f90c3cec34ca).

![Xh6inf](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/Xh6inf.png)

**The embedding only happens in the bottom-most encoder**. The abstraction that is common to all the encoders is that they receive a list of vectors each of the size 512 – **In the bottom encoder that would be the word embeddings, but in other encoders, it would be the output of the encoder that’s directly below**. The size of this list is hyperparameter we can set – basically it would be the length of the longest sentence in our training dataset.

After embedding the words in our input sequence, each of them flows through each of the two layers of the encoder.

![w4C9Oi](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/w4C9Oi.png)

### Now We’re Encoding!

As we’ve mentioned already, **an encoder receives a list of vectors as input. It processes this list by passing these vectors into a ‘self-attention’ layer, then into a feed-forward neural network, then sends out the output upwards to the next encoder**.

![8cr58y](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/8cr58y.png)

### Self-Attention at a High Level

Say the following sentence is an input sentence we want to translate:

”`The animal didn't cross the street because it was too tired`”

What does “`it`” in this sentence refer to? Is it referring to the street or to the animal? It’s a simple question to a human, but not as simple to an algorithm.

When the model is processing the word “`it`”, self-attention allows it to associate “`it`” with “`animal`”.

As the model processes each word (each position in the input sequence), **self attention allows it to look at other positions in the input sequence for clues that can help lead to a better encoding for this word**.

If you’re familiar with RNNs, think of how maintaining a hidden state allows an RNN to incorporate its representation of previous words/vectors it has processed with the current one it’s processing. **Self-attention is the method the Transformer uses to bake the “understanding” of other relevant words into the one we’re currently processing.**

![5iDh5U](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/5iDh5U.png)



Be sure to check out the [Tensor2Tensor notebook](https://colab.research.google.com/github/tensorflow/tensor2tensor/blob/master/tensor2tensor/notebooks/hello_t2t.ipynb) where you can load a Transformer model, and examine it using this **interactive visualization**.

### Self-Attention in Detail

The **first step** in calculating self-attention is to **create three vectors from each of the encoder’s input vectors (in this case, the embedding of each word)**. So **for each word, we create a Query vector, a Key vector, and a Value vector**. These vectors are created **by multiplying the embedding by three matrices** that we trained during the training process.

![d6NayD](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/d6NayD.png)

What are the “query”, “key”, and “value” vectors?

- They’re abstractions that are useful for calculating and thinking about attention. Once you proceed with reading how attention is calculated below, you’ll know pretty much all you need to know about **the role each of these vectors plays**.

The **second step** in calculating self-attention is to **calculate a score**. Say we’re calculating the self-attention for the first word in this example, “Thinking”. We need to score each word of the input sentence against this word. **The score determines how much focus to place on other parts of the input sentence as we encode a word at a certain position**.

- The score is calculated by **taking the dot product of the query vector with the key vector** of the respective word we’re scoring. So if we’re processing the self-attention for the word in position #1, **the first score would be the dot product of q1 and k1**. The **second** score would be the **dot product of q1 and k2**.

![c31jyS](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/c31jyS.png)

The **third and forth steps** are to divide the scores by 8 (**the square root of the dimension of the key vectors used in the paper – 64. This leads to having more stable gradients**. There could be other possible values here, but this is the default), then pass the result through a softmax operation. Softmax normalizes the scores so they’re all positive and add up to 1.

![HjdcFk](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/HjdcFk.png)

**This softmax score determines how much each word will be expressed at this position**. Clearly the word at this position will have the highest softmax score, but sometimes it’s useful to attend to another word that is relevant to the current word.

The **fifth step** is to multiply each value vector by the softmax score (**in preparation to sum them up**). The intuition here is to **keep intact the values of the word(s) we want to focus on, and drown-out irrelevant words** (by multiplying them by tiny numbers like 0.001, for example).

The **sixth step** is to **sum up the weighted value vectors**. **This produces the output of the self-attention layer at this position** (for the first word).

![YReiYz](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/YReiYz.png)

That concludes the self-attention calculation. **The resulting vector is one we can send along to the feed-forward neural network**. In the actual implementation, however, this calculation is done in matrix form for faster processing. So let’s look at that now that we’ve seen the intuition of the calculation on the word level.

### Matrix Calculation of Self-Attention

**The first step** is to **calculate the Query, Key, and Value matrices**. We do that by **packing our embeddings into a matrix X**, and multiplying it by the **weight matrices we’ve trained (WQ, WK, WV)**.

![MzoLro](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/MzoLro.png)

**Finally**, since we’re dealing with matrices, we can condense steps two through six in one formula to calculate the outputs of the self-attention layer.

![C0PnrF](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/C0PnrF.png)

### The Beast With Many Heads

The paper further refined the self-attention layer by adding a mechanism called “**multi-headed**” attention. This improves the performance of the attention layer in two ways:

- **多头机制扩展了模型集中于不同位置的能力**。在上面的例子中，z1只包含了其他词的很少信息，仅由实际自己词决定。在其他情况下，比如翻译 “The animal didn’t cross the street because it was too tired”时，我们想知道单词"it"指的是什么。
- **多头机制赋予attention多种子表达方式**。像下面的例子所示，在多头下有多组query/key/value-matrix，**而非仅仅一组**（论文中使用8-heads）。每一组都是随机初始化，经过训练之后，输入向量可以被映射到不同的子表达空间中。

![m2X75H](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/m2X75H.png)

If we do the same self-attention calculation we outlined above, just **eight different times with different weight matrices, we end up with eight different Z matrices**.

![ln0ZLY](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/ln0ZLY.png)

This leaves us with a bit of a challenge. **The feed-forward layer is not expecting eight matrices – it’s expecting a single matrix (a vector for each word)**. So we need a way to **condense** these **eight down into a single matrix**.

How do we do that? We **concat the matrices then multiple them by an additional weights matrix WO**.

![cEqvDG](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/cEqvDG.png)

### Sum Up

![UApeHb](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/UApeHb.jpg)

Now that we have touched upon attention heads, let’s revisit our example from before to see where the different attention heads are focusing as we encode the word “it” in our example sentence:

![ZzEKml](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/ZzEKml.png)

If we add all the attention heads to the picture, however, things can be harder to interpret:

![TXtvGh](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/TXtvGh.png)

### Representing The Order of The Sequence Using Positional Encoding

截止到目前为止，我们还没有讨论如何理解输入语句中词的顺序。

为解决词序的利用问题，Transformer新增了一个向量对每个词，这些向量遵循模型学习的指定模式，来决定词的位置，或者序列中不同词的举例。对其理解，增加这些值来提供词向量间的距离，当其映射到Q/K/V向量以及点乘的attention时。

![S2pNC8](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/S2pNC8.png)

If we assumed the embedding has a dimensionality of 4, the actual positional encodings would look like this:

![8VZYcH](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/8VZYcH.png)

What might this pattern look like?

- In the following figure, **each row corresponds the a positional encoding of a vector**. So the first row would be the vector we’d add to the embedding of the first word in an input sequence. Each row contains 512 values – each with a value between 1 and -1. We’ve color-coded them so the pattern is visible.

![vFR8Sm](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/vFR8Sm.png)

The formula for positional encoding is described in the paper (section 3.5). You can see the code for generating positional encodings in [`get_timing_signal_1d()`](https://github.com/tensorflow/tensor2tensor/blob/23bd23b9830059fbc349381b70d9429b5c40a139/tensor2tensor/layers/common_attention.py). This is not the only possible method for positional encoding. It, however, gives the advantage of being able to scale to unseen lengths of sequences (e.g. if our trained model is asked to translate a sentence longer than any of those in our training set).

### The Residuals

One detail in the architecture of the encoder that we need to mention before moving on, is that each sub-layer (self-attention, ffnn) in each encoder has a residual connection around it, and is followed by a [layer-normalization](https://arxiv.org/abs/1607.06450) step.

![wAmvy2](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/wAmvy2.png)

If we’re to visualize the vectors and the layer-norm operation associated with self attention, it would look like this:

![kDTwLB](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/kDTwLB.jpg)

This goes for the sub-layers of the decoder as well. If we’re to think of a Transformer of 2 stacked encoders and decoders, it would look something like this:

![U9qYWo](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/U9qYWo.png)

### The Decoder Side

The encoder start by processing the input sequence. **The output of the top encoder** is then **transformed into a set of attention vectors K and V**. These are to be **used by each decoder** in its **“encoder-decoder attention” layer** which helps the decoder focus on appropriate places in the input sequence:

![transformer_decoding_1](https://jalammar.github.io/images/t/transformer_decoding_1.gif)

<video width="100%" height="auto" loop autoplay controls>
  <source src="https://gitee.com/echisenyang/GiteeForFileUse/raw/master/gif/transformer_decoding_1.gif" type="video/gif">
</video>

The following steps repeat the process until a special symbol is reached indicating the transformer decoder has completed its output. The output of each step is fed to the bottom decoder in the next time step, and the decoders bubble up their decoding results just like the encoders did. And just like we did with the encoder inputs, we embed and add positional encoding to those decoder inputs to indicate the position of each word.

<video width="100%" height="auto" loop autoplay controls>
  <source src="https://gitee.com/echisenyang/GiteeForFileUse/raw/master/gif/transformer_decoding_2.gif" type="video/gif">
</video>

The self attention layers in the decoder operate in a slightly different way than the one in the encoder:

- In the **decoder**, the self-attention layer is **only allowed to attend to earlier positions** in the output sequence. This is done by **masking future positions (setting them to `-inf`)** before the softmax step in the self-attention calculation.

The “Encoder-Decoder Attention” layer works just like multiheaded self-attention, except it creates its Queries matrix from the layer below it, and takes the Keys and Values matrix from the output of the encoder stack.

### The Final Linear and Softmax Layer

**The decoder stack outputs a vector of floats**. How do we turn that into a word? That’s the job of the final Linear layer which is followed by a Softmax Layer.

**线性层**是个简单的全连接层，将解码器的最后输出映射到一个非常大的**logits向量**上。假设模型已知有1万个单词（输出的词表）从训练集中学习得到。那么，logits向量就有1万维，每个值表示是某个词的可能倾向值。
softmax层将这些分数转换成概率值（都是正值，且加和为1），最高值对应的维上的词就是这一步的输出单词。

![tIsdSE](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/tIsdSE.png)

### Recap Of Training

During training, an untrained model would go through the exact same forward pass. But since we are training it on a labeled training dataset, we can compare its output with the actual correct output.

To visualize this, let’s assume our output vocabulary only contains six words(“a”, “am”, “i”, “thanks”, “student”, and “\<eos\>” (short for ‘end of sentence’)).

![oH5GXB](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/oH5GXB.png)

Once we define our output vocabulary, we can use a vector of the same width to indicate each word in our vocabulary. This also known as one-hot encoding. So for example, we can indicate the word “am” using the following vector:

![5WOkCE](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/5WOkCE.png)

### The Loss Function

![guOLr0](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/guOLr0.png)

**How do you compare two probability distributions**? We simply subtract one from the other. For more details, look at [cross-entropy](https://colah.github.io/posts/2015-09-Visual-Information/) and [Kullback–Leibler divergence](https://www.countbayesie.com/blog/2017/5/9/kullback-leibler-divergence-explained).

But note that this is an oversimplified example. More realistically, we’ll use a sentence longer than one word. For example – input: “je suis étudiant” and expected output: “i am a student”. What this really means, is that we want our model to successively output probability distributions where:

- **Each probability distribution is represented by a vector of width vocab_size** (6 in our toy example, but more realistically a number like 3,000 or 10,000)
- **The first probability distribution has the highest probability** at the cell associated with the word “i”
- **The second probability distribution has the highest probability** at the cell associated with the word “am”
- And so on, until the fifth output distribution indicates ‘``’ symbol, which also has a cell associated with it from the 10,000 element vocabulary.

![6xqF1y](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/6xqF1y.png)

**After training the model** for enough time on a large enough dataset, we would hope the produced probability distributions would look like this:

![eY5NqZ](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/eY5NqZ.png)

Now, because the model produces the outputs one at a time, we can **assume that the model is selecting the word with the highest probability from that probability distribution and throwing away the rest**. That’s one way to do it (called **greedy decoding**). 

Another way to do it would be to hold on to, say, **the top two words** (say, ‘I’ and ‘a’ for example), then in the next step, run the model twice: once assuming the first output position was the word ‘I’, and another time assuming the first output position was the word ‘a’, and whichever version produced less error considering both positions #1 and #2 is kept. We repeat this for positions #2 and #3…etc. This method is called “**beam search**”, where in our example, **beam_size was two** (because we compared the results after calculating the beams for positions #1 and #2), and top_beams is also two (since we kept two words). These are both hyperparameters that you can experiment with.

### Go Forth And Transform

I hope you’ve found this a useful place to start to break the ice with the major concepts of the Transformer. If you want to go deeper, I’d suggest these next steps:

- Read the [Attention Is All You Need](https://arxiv.org/abs/1706.03762) paper, the Transformer blog post ([Transformer: A Novel Neural Network Architecture for Language Understanding](https://ai.googleblog.com/2017/08/transformer-novel-neural-network.html)), and the [Tensor2Tensor announcement](https://ai.googleblog.com/2017/06/accelerating-deep-learning-research.html).
- Watch [Łukasz Kaiser’s talk](https://www.youtube.com/watch?v=rBCqOTEfxvg) walking through the model and its details
- Play with the [Jupyter Notebook provided as part of the Tensor2Tensor repo](https://colab.research.google.com/github/tensorflow/tensor2tensor/blob/master/tensor2tensor/notebooks/hello_t2t.ipynb)
- Explore the [Tensor2Tensor repo](https://github.com/tensorflow/tensor2tensor).

Follow-up works:

- [Depthwise Separable Convolutions for Neural Machine Translation](https://arxiv.org/abs/1706.03059)
- [One Model To Learn Them All](https://arxiv.org/abs/1706.05137)
- [Discrete Autoencoders for Sequence Models](https://arxiv.org/abs/1801.09797)
- [Generating Wikipedia by Summarizing Long Sequences](https://arxiv.org/abs/1801.10198)
- [Image Transformer](https://arxiv.org/abs/1802.05751)
- [Training Tips for the Transformer Model](https://arxiv.org/abs/1804.00247)
- [Self-Attention with Relative Position Representations](https://arxiv.org/abs/1803.02155)
- [Fast Decoding in Sequence Models using Discrete Latent Variables](https://arxiv.org/abs/1803.03382)
- [Adafactor: Adaptive Learning Rates with Sublinear Memory Cost](https://arxiv.org/abs/1804.04235)

Thanks to:

https://jalammar.github.io/illustrated-transformer/

- [The Illustrated GPT-2 (Visualizing Transformer Language Models)](https://jalammar.github.io/illustrated-gpt2/)

- 这里强行插入一段简单提下Transformer，尽管上面提到了，但是说的还不完整，补充两句。首先，Transformer是个叠加的“自注意力机制（Self Attention）”构成的深度网络，是目前NLP里最强的特征提取器，注意力这个机制在此被发扬光大，从任务的配角不断抢戏，直到Transformer一跃成为踢开RNN和CNN传统特征提取器，荣升头牌，大红大紫。你问了：什么是注意力机制？这里再插个广告，对注意力不了解的可以参考鄙人16年出品17年修正的下文：“[深度学习中的注意力模型](https://zhuanlan.zhihu.com/p/37601161)”，补充下相关基础知识，如果不了解注意力机制你肯定会落后时代的发展。而介绍Transformer比较好的文章可以参考以下两篇文章：一个是Jay Alammar可视化地介绍Transformer的博客文章[The Illustrated Transformer](https://link.zhihu.com/?target=https%3A//jalammar.github.io/illustrated-transformer/) ，非常容易理解整个机制，建议先从这篇看起；然后可以参考哈佛大学NLP研究组写的“[The Annotated Transformer.](https://link.zhihu.com/?target=http%3A//nlp.seas.harvard.edu/2018/04/03/attention.html) ”，代码原理双管齐下，讲得非常清楚。我相信上面两个文章足以让你了解Transformer了，所以这里不展开介绍。

- 其次，我的判断是Transformer在未来会逐渐替代掉RNN成为主流的NLP工具，RNN一直受困于其并行计算能力，这是因为它本身结构的序列性依赖导致的，尽管很多人在试图通过修正RNN结构来修正这一点，但是我不看好这种模式，因为给马车换轮胎不如把它升级到汽车，这个道理很好懂，更何况目前汽车的雏形已经出现了，干嘛还要执着在换轮胎这个事情呢？是吧？再说CNN，CNN在NLP里一直没有形成主流，CNN的最大优点是易于做并行计算，所以速度快，但是在捕获NLP的序列关系尤其是长距离特征方面天然有缺陷，不是做不到而是做不好，目前也有很多改进模型，但是特别成功的不多。综合各方面情况，很明显Transformer同时具备并行性好，又适合捕获长距离特征，没有理由不在赛跑比赛中跑不过RNN和CNN。

