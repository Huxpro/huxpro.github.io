---
title: "Advanced Word Vector Representations"
subtitle: "CS224N 284「3」"
layout: post
author: "echisenyang"
header-style: text
hidden: true
catalog: true
tags:
  - 笔记
  - CS224N
---

## {[word2vec skip-gram+negative sampling tf 实现](https://github.com/echisenyang/word2vec-tensorflow)}

![3gx2Pt](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/3gx2Pt.png)

## Advanced Word Vector Representations

![atc9Wt](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/atc9Wt.png)

### 1.Finish word2vec

#### Review: Main ideas of word2vec

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/Of7gLT.png" alt="Of7gLT" style="zoom:25%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/pVuY12.png" alt="pVuY12" style="zoom:25%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/9HWWQI.png" alt="9HWWQI" style="zoom:25%;" />

#### Approximations
<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/RrnJx4.png" alt="RrnJx4" style="zoom: 25%;" />

#### Ass 1: The skip-gram model and negative sampling

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/pHZnMh.png" alt="pHZnMh" style="zoom: 25%;" />![ejE2pC](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/ejE2pC.png)

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/ejE2pC.png" alt="ejE2pC" style="zoom:25%;" />

> 负采样 $\sigma(-x) = 1 - \sigma(x)$ ，我们对从语料库中抽取出的随机单词进行重采样，而不是遍历所有不同的单词。这样大大减少了计算量。

#### Ass 1: The continuous bag of words model

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/wTS9iL.png" alt="wTS9iL" style="zoom:25%;" />

### 2.Summary of word2vec

- Go through each word of the whole corpus
- Predict surrounding words of each word 
- This captures cooccurrence of words **one at a time**

> ❗️ **problem：Why not capture cooccurrence counts directly?**
>
> ‼️ **Yes we can!** With a co-occurrence matrix X

#### Example: Window based co-occurrence matrix

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/YiWvzj.png" alt="YiWvzj" style="zoom:25%;" />

#### **Problems with simple co-occurrence vectors**

- Increase in size with vocabulary
- Very high dimensional: require a lot of storage
- Subsequent classiﬁcaRon models have sparsity issues

#### **Solution: Low dimensional vectors**

- Idea: **store “most” of the important information** in a ﬁxed, small number of dimensions: a dense vector

- Method 1: Dimensionality Reduction on X

  <img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/JkHoL4.png" alt="JkHoL4" style="zoom:25%;" />

#### **Problems with SVD**

- Computational cost scales quadratically for n x m matrix: O(mn 2 ) ﬂops (when n<m)
- Bad for millions of words or documents
- Hard to incorporate new words or documents

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/pO37EN.png" alt="pO37EN" style="zoom:33%;" />

### 3.Combining the best of both worlds: GloVe

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/0sW6MI.png" alt="0sW6MI" style="zoom:25%;" />

> $P(i,j)$ 表示 Window based co-occurrence matrix 中对应位置出现的频数

#### What to do with the two sets of vectors?

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/4iriq7.png" alt="4iriq7" style="zoom:25%;" />

> 为什么不用一组向量：事实表明，在优化期间有独立的向量并且最后把他们整合到一起会更稳定。

#### glove 对比 skip-gram

- skip-gram model tries to capture co-occurrence one window at a time
- glove model tries to capture the counts of the overall statistics of how often these words appear together

![uuDcmt](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/uuDcmt.png)

![VKIRJc](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/VKIRJc.png)

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/b7g6rp.png" alt="b7g6rp" style="zoom: 50%;" />

![PTYXBJ](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/PTYXBJ.png)

### 4.【Research Highlight】:Linear Algebraic Structure of Word Senses, with Applications to Polysemy(一词多义)

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/iAEdlG.png" alt="iAEdlG" style="zoom:33%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/b1IJ3h.png" alt="b1IJ3h" style="zoom:33%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/Ml4qAn.png" alt="Ml4qAn" style="zoom:33%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/2Vrv9Z.png" alt="2Vrv9Z" style="zoom:33%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/8Wcdgv.png" alt="8Wcdgv" style="zoom:33%;" />

### 5.How to evaluate word vectors?

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/UfjeuK.png" alt="UfjeuK" style="zoom: 33%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/97F6OS.png" alt="97F6OS" style="zoom:33%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/45hAmQ.png" alt="45hAmQ" style="zoom:33%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/FUWVLf.png" alt="FUWVLf" style="zoom:33%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/09EJOg.png" alt="09EJOg" style="zoom:33%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/pPpkYx.png" alt="pPpkYx" style="zoom:33%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/S9jqd4.png" alt="S9jqd4" style="zoom:33%;" />

## Word2Vec Tutorial Part 2 - Negative Sampling

The authors of Word2Vec addressed these issues in their second [paper](http://arxiv.org/pdf/1310.4546.pdf) with the following two innovations:

1. **Subsampling frequent words to decrease the number of training examples.**
2. **Modifying the optimization objective with a technique they called “Negative Sampling”, which causes each training sample to update only a small percentage of the model’s weights.**

It’s worth noting that subsampling frequent words and applying Negative Sampling **not only reduced the compute burden of the training process, but also improved the quality of their resulting word vectors as well.**

### Subsampling Frequent Words

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/iUtbdt.jpg" alt="iUtbdt" style="zoom: 67%;" />

**There are two “problems” with common words like “the”**:

1. When looking at word pairs, (“fox”, “the”) doesn’t tell us much about the meaning of “fox”. **“the” appears in the context of pretty much every word.**
2. **We will have many more samples of (“the”, …) than we need to learn a good vector for “the”**.

Word2Vec implements a “subsampling” scheme to address this. For each word we encounter in our training text, **there is a chance that we will effectively delete it from the text. The probability that we cut the word is related to the word’s frequency.**

If we have a window size of 10, and we remove a specific instance of “the” from our text:

1. As we train on the remaining words, “the” will not appear in any of their context windows.
2. We’ll have 10 fewer training samples where “the” is the input word.

### Sampling rate

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/HuEVKU.png" alt="HuEVKU" style="zoom:50%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/MIMRml.jpg" alt="MIMRml"  />

![mbbGQY](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/mbbGQY.png)

### Negative Sampling

Training a neural network means taking a training example and adjusting all of the neuron weights slightly so that it predicts that training sample more accurately. In other words, each training sample will tweak *all* of the weights in the neural network.

Negative sampling addresses this by having **each training sample only modify a small percentage of the weights, rather than all of them**. Here’s how it works.

With negative sampling, we are instead going to **randomly select just a small number of “negative” words (let’s say 5) to update the weights** for. (In this context, a “negative” word is one for which we want the network to output a 0 for). We will also still update the weights for our “positive” word (which is the word “quick” in our current example).

> Recall that the output layer of our model has a weight matrix that’s 300 x 10,000. **So we will just be updating the weights for our positive word (“quick”), plus the weights for 5 other words that we want to output 0**. That’s a total of 6 output neurons, and 1,800 weight values total. **That’s only 0.06% of the 3M weights in the output layer!**

### Selecting Negative Samples

The “negative samples” (that is, the 5 output words that we’ll train to output 0) are selected using a “unigram distribution”, where **more frequent words are more likely to be selected as negative samples**.

![KbLLI4](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/KbLLI4.png)

