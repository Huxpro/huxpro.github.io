---
title: "Word Vector Representations：word2vec"
subtitle: "CS224N 284「2」"
layout: post
author: "echisenyang"
header-style: text
hidden: true
catalog: true
tags:
  - 笔记
  - CS224N
---



## Word Vector Representations：word2vec

> 在上一节中，以非常宏观的角度讲解了什么是深度学习，什么是自然语言处理，在这一节中，我们将从最底层的词向量开始讲起。

![a00FvF](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/a00FvF.png)

### 1. How do we represent the *meaning* of a word?

#### **Definition: meaning** (Webster dictionary)

- the idea that is represented by a word, phrase, etc.
- the idea that a person wants to express by using words, signs, etc.
- the idea that is expressed in a work of writing, art, etc.

> 通常，人们会**用一系列的短语、词汇去描述**这个词的含义（meaning），词典就是这么做的

#### How do we have **usable meaning in a computer**?

- Common answer: Use a **taxonomy(分类学表征)** like **WordNet** that has hypernyms (is-a) relationships and synonym sets

> 在word vector之前，计算机中可用的描述词的含义的是：WordNet

![c8maBB](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/c8maBB.png)

#### Problems with this discrete representation(WordNet)

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/HowpFs.png" alt="HowpFs" style="zoom: 25%;" />

> 可以找到一个词的许多相似词，但是WordNet忽略了这些相似词之间的差异性；并且WordNet对新词的扩展性也不好；同时也无法计算词之间的相似度

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/5cZ69f.png" alt="5cZ69f" style="zoom:25%;" />

> WordNet的另一个严重问题，由于是采用**分类学表征**构建，意味着所有的词都是**离散化表征**，即每个词都是一个 **one-hot** 向量（one-hot的严重缺陷就是当词典非常大时，每一个单词的**维度会非常**大；另外，每一个词与其他的词都是**正交**的，这意味着丢失了词之间的相似度，there is **no natural notion of similarity** in a set of one-hot vectors）。

#### Distributional similarity based representations

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/cqtbZ4.png" alt="cqtbZ4" style="zoom:25%;" />



> **Distributional similarity(分布式相似性)**是一种关于词汇语义的理论，可以通过理解单词出现的上下文来描述词汇的意思。这是一个天才的想法，如果想知道一个词的含义，我们只需去观察几个包含这个词的例句，即根据这个词的上下文就可以推断这个词的含义。

> **Distributed representation(分布式表示)**：即用密集型向量表示这些词汇的含义，它与one-hot的表示完全不同。

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/mqnK0Z.png" alt="mqnK0Z" style="zoom:25%;" />

#### Basic idea of learning neural network word embeddings

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/LiCBMf.png" alt="LiCBMf" style="zoom: 25%;" />

> 深度学习的解决方案：学习中心词的周围词出现的概率，并据此建立损失函数，从而来不断调整中心词的词向量表征。

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/yBxdhj.png" alt="yBxdhj" style="zoom:25%;" />

> A neural probabilistic language model (Bengio et al., 2003) 展示了词汇的分布值表示的巨大价值，并且还能预测上下文的其他词汇
>
> A recent, even simpler and faster model: word2vec (Mikolov et al. 2013) word2vec是谷歌2013年提出的词向量表示方法，也是各种词向量表征的工业级鼻祖。
>

### 2. Main idea of word2vec

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/Yfu8UT.png" alt="Yfu8UT" style="zoom:25%;" />

> word2vec包含了两个模型（skip-gram与CBOW），还包含了两种高效的训练算法。本章将先介绍最简单，最低效，但是包含了word2vec所有核心想法的算法：skip-gram。

#### Skip-gram prediction

![GhtO5p](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/GhtO5p.png)

> Skip-gram：在each estimation step，都取一个词作为中心词（比如这里的banking），然后尝试去预测它一定范围内的上下文词汇。故 Skip-gram is a probability of a word appearing in the context given this center word。

#### Details of word2vec

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/BaoZnA.png" alt="BaoZnA" style="zoom:25%;" />

> **neative log likelihood**的妙用：将最大化概率的乘积转为最小化log概率的和，并加上归一化处理（归一化处理本身不影响优化）。

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/B19OM0.png" alt="B19OM0" style="zoom:25%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/ylnXvv.png" alt="ylnXvv" style="zoom:25%;" />

> 可以看到用点积的形式构造出了概率模型，而这个概率模型正是softmax的形式。**softmax是一种将数值转变为概率的标准方法**。
>
> ❓ ***每个词都有两个word vector来表示*** ❓

#### Softmax function补充

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/YTpdOp.png" alt="YTpdOp" style="zoom:25%;" />

![ub0zcL](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/ub0zcL.png)

### 3.【Research Highlight】：A Simple but Tough-to-beat Baseline for Sentence Embeddings

![E7xSYx](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/E7xSYx.png)

#### From Bag-of-words to Complex Models

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/S4aOAe.png" alt="S4aOAe" style="zoom:25%;" />

> 传统的sentence embedding就是词向量的平均，或者用其他复杂模型来表征（这里没介绍）

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/vKX2sB.png" alt="vKX2sB" style="zoom:25%;" />

> 对做 sentence embedding 提供了一种思路

### 4. Derivations of gradient

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/muffTa.png" alt="muffTa" style="zoom: 25%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/LX44Vx.png" alt="LX44Vx" style="zoom:25%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/3OJ9cF.png" alt="3OJ9cF" style="zoom:25%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/r4a8tE.png" alt="r4a8tE" style="zoom:25%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/cTJfDb.png" alt="cTJfDb" style="zoom:25%;" />

> expected含义：**this is an expectation average over all context vectors weighted by their probability**

#### [Why does word2vec use 2 representations for each word?](https://stackoverflow.com/questions/29381505/why-does-word2vec-use-2-representations-for-each-word)

![8FRKSK](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/8FRKSK.png)

### 5. Cost/Objective functions

- SGD

$$
\theta^{n e w}=\theta^{o l d}-\alpha \nabla_{\theta} J(\theta)
$$

## {Word2Vec Tutorial - The Skip-Gram Model}

### The Model

Let’s start with a **high-level insight** about where we’re going. Word2Vec uses a **trick** you may have seen elsewhere in machine learning. We’re going to train a simple neural network with a single hidden layer to perform a certain task, but then **we’re not actually going to use that neural network for the task we trained it on! Instead, the goal is actually just to learn the weights of the hidden layer–we’ll see that these weights are actually the “word vectors” that we’re trying to learn.**

> Another place you may have seen this **trick** is in **unsupervised feature learning**, where you train an auto-encoder to compress an input vector in the hidden layer, and decompress it back to the original in the output layer. After training it, **you strip off the output layer (the decompression step) and just use the hidden layer**--it's a trick for learning good image features without having labeled training data.

### The Fake Task

We’re going to train the neural network to do the following. **Given a specific word** in the middle of a sentence (the input word), **look at the words nearby and pick one at random**. The network is going to tell us **the probability for every word in our vocabulary of being the “nearby word” that we chose**.

We’ll train the neural network to do this by feeding it word pairs found in our training documents. The below example shows some of the training samples (word pairs) we would take from the sentence “*The quick brown fox jumps over the lazy dog.*” I’ve used a small **window size of 2** just for the example. **The word highlighted in blue is the input word.**

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/LSfU3q.jpg" alt="LSfU3q" style="zoom: 50%;" />

### Model Details

First of all, you know you **can’t feed a word just as a text string to a neural network**, so we need a way to represent the words to the network. To do this, **we first build a vocabulary of words from our training documents**–let’s say we have a vocabulary of 10,000 unique words.

We’re going to **represent an input word** like “ants” **as a one-hot vector**.

The **output of the network** is **a single vector** (also with 10,000 components) **containing**, for every word in our vocabulary, **the probability that a randomly selected nearby word** is that vocabulary word.

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/BB9mMu.jpg" alt="BB9mMu" style="zoom:33%;" />

There is no activation function on the hidden layer neurons, but the **output neurons use softmax**. We’ll come back to this later.

When *training* this network on word pairs, **the input is a one-hot vector** representing the input word and **the training output *is also a one-hot vector*** representing the output word. *But when you **evaluate** the trained network on an input word, the output vector will actually be a **probability distribution (i.e., a bunch of floating point values, not a one-hot vector)**.*

### The Hidden Layer

For our example, we’re going to say that we’re learning word vectors with 300 features. So the **hidden layer** is going to be represented by a weight matrix with **10,000 rows (one for every word in our vocabulary) and 300 columns (one for every hidden neuron)**

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/tV0XBH.jpg" alt="tV0XBH" style="zoom: 50%;" />

So **the end goal of all of this is really just to learn this hidden layer weight matrix** – the output layer we’ll just toss when we’re done!

Now, you might be asking yourself–“That one-hot vector is almost all zeros… what’s the effect of that?” **If you multiply a 1 x 10,000 one-hot vector by a 10,000 x 300 matrix, it will effectively just *select* the matrix row corresponding to the “1”**. Here’s a small example to give you a visual.

![YQi2cw](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/YQi2cw.jpg)

This means that **the hidden layer of this model is really just operating as a lookup table**. **The output of the hidden layer is just the “word vector” for the input word**.

### The Output Layer

The `1 x 300` word vector for “ants” then gets fed to the output layer. **The output layer is a softmax regression classifier**. There’s an in-depth tutorial on Softmax Regression [here](http://ufldl.stanford.edu/tutorial/supervised/SoftmaxRegression/), but **the gist of it is that each output neuron (one per word in our vocabulary!) will produce an output between 0 and 1, and the sum of all these output values will add up to 1.**

![h4vvpx](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/h4vvpx.jpg)

> 所以 output layer 输出的是在给定 center word "ants" 的前提下，词表中所有词（10000）对应的概率，这个概率就是 softmax 概率，和为1。

### Intuition

**If two different words have very similar “contexts” (that is, what words are likely to appear around them), then our model needs to output very similar results for these two words.** And one way for the network to output similar context predictions for these two words is if *the word vectors are similar*. So, **if two words have similar contexts, then our network is motivated to learn similar word vectors for these two words!**

### Next Up

You may have noticed that the **skip-gram neural network contains a huge number of weights**… For our example with **300 features and a vocab of 10,000 words, that’s 3M weights in the hidden layer and output layer each!** Training this on a large dataset would be prohibitive, so the word2vec authors introduced a number of tweaks to make training feasible. These are covered in [part 2 of this tutorial](http://mccormickml.com/2017/01/11/word2vec-tutorial-part-2-negative-sampling/).

