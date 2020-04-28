---
title: "From RNN to LSTM and GRU"
subtitle: "追溯RNN的发展历程"
layout: post
author: "echisenyang"
header-style: text
hidden: true
catalog: true
tags:
  - 输出计划
---



# From RNN to LSTM and GRU

Humans don’t start their thinking from scratch every second. As you read this essay, you understand each word based on your understanding of previous words. You don’t throw everything away and start thinking from scratch again. Your thoughts have persistence.

Traditional neural networks can’t do this, and it seems like a major shortcoming. It’s unclear how a traditional neural network could use its reasoning about **previous events** in the film **to inform later ones**.

**Recurrent neural networks address this issue**. They are networks with loops in them, allowing information to **persist**.

<img src="http://colah.github.io/posts/2015-08-Understanding-LSTMs/img/RNN-unrolled.png" style="zoom:25%;" />

**A loop allows information to be passed from one step of the network to the next**. These loops make recurrent neural networks seem kind of mysterious. However, if you think a bit more, it turns out that they aren’t all that different than a normal neural network. **A recurrent neural network can be thought of as multiple copies of the same network, each passing a message to a successor.** 

This chain-like nature reveals that recurrent neural networks are **intimately related to sequences and lists**. They’re the natural architecture of neural network to use for such data.

- Applying RNNs to a variety of problems: speech recognition, language modeling, translation, image captioning… 

![](http://karpathy.github.io/assets/rnn/diags.jpeg)

- Each rectangle is a vector and arrows represent functions (e.g. matrix multiply). Input vectors are in red, output vectors are in blue and green vectors hold the RNN's state (more on this soon). From left to right: **(1)** Vanilla mode of processing without RNN, from **fixed-sized input to fixed-sized output** (e.g. image classification). **(2)** **Sequence output** (e.g. image captioning takes an image and outputs a sentence of words). **(3)** **Sequence input** (e.g. sentiment analysis where a given sentence is classified as expressing positive or negative sentiment). **(4)** **Sequence input and sequence output** (e.g. Machine Translation: an RNN reads a sentence in English and then outputs a sentence in French). **(5)** **Synced sequence input and output** (e.g. video classification where we wish to label each frame of the video). Notice that in every case are no pre-specified constraints on the lengths sequences because the recurrent transformation (green) is fixed and can be applied as many times as we like.

## The Problem of Long-Term Dependencies

One of the **appeals** of RNNs is the idea that they might be able to **connect previous information to the present task**. But can they? It depends. 

Sometimes, we only need to look at recent information to perform the present task. In such cases, where **the gap between the relevant information and the place that it’s needed is smal**l, RNNs can learn to use the past information.

<img src="http://colah.github.io/posts/2015-08-Understanding-LSTMs/img/RNN-shorttermdepdencies.png" style="zoom: 25%;" />

But there are also cases where we need more context. Unfortunately, **as that gap grows, RNNs become unable to learn to connect the information**.

<img src="http://colah.github.io/posts/2015-08-Understanding-LSTMs/img/RNN-longtermdependencies.png" style="zoom: 25%;" />

**In theory**, RNNs are absolutely capable of handling such “long-term dependencies.” A human could carefully pick parameters for them to solve toy problems of this form. Sadly, **in practice**, RNNs don’t seem to be able to learn them. 

## LSTM Networks

Long Short Term Memory networks – usually just called “LSTMs” – are a special kind of RNN, capable of learning long-term dependencies. 

**LSTMs are explicitly designed to avoid the long-term dependency problem. Remembering information for long periods of time is practically their default behavior, not something they struggle to learn!**

- [QA] : As far as I know, the ReLU activation function can also mitigate the gradient decay problem. **Can we just use RNN with ReLU to achieve the same thing as LSTM**?
  - RNN having long unfolding in time becomes impossible. But LSTM avoids this decay of gradient problem by allowing you to make a **super highway (cell states) through time, these highways allow the gradient to freely flow backward in time**.
  - RNN可以通过梯度裁剪解决梯度爆炸的问题，但无法解决梯度消失的问题，而LSTM从设计上就消除了梯度消失于提督爆炸的问题

<img src="http://colah.github.io/posts/2015-08-Understanding-LSTMs/img/LSTM3-SimpleRNN.png" style="zoom:25%;" />



LSTMs also have this chain like structure, but the repeating module has a different structure. **Instead of having a single neural network layer**, there are **four**, interacting in a very special way.

<img src="http://colah.github.io/posts/2015-08-Understanding-LSTMs/img/LSTM3-chain.png" style="zoom:25%;" />

<img src="http://colah.github.io/posts/2015-08-Understanding-LSTMs/img/LSTM2-notation.png" style="zoom: 50%;" />

## The Core Idea Behind LSTMs

**The key to LSTMs is the cell state, the horizontal line running through the top of the diagram.**

<img src="http://colah.github.io/posts/2015-08-Understanding-LSTMs/img/LSTM3-C-line.png" style="zoom: 50%;" />

The cell state is kind of **like a conveyor belt**. It runs straight down the entire chain, with only some minor linear interactions. It’s very **easy for information to just flow along it unchanged**.

## Step-by-Step LSTM Walk Through

- The **first step** in our LSTM is to **decide what information we’re going to throw away from the cell state**. This decision is made by a sigmoid layer called the “**forget gate layer**.” 

The sigmoid layer outputs numbers between zero and one, describing how much of each component should be let through. **A value of zero means “let nothing through,” while a value of one means “let everything through!”**

<img src="http://colah.github.io/posts/2015-08-Understanding-LSTMs/img/LSTM3-focus-f.png" style="zoom:50%;" />

- The **next step** is to **decide what new information we’re going to store in the cell state**. This has two parts. **First, a sigmoid layer called the “input gate layer” decides which values we’ll update**. Next, a tanh layer creates a vector of new candidate values, $\widetilde{C}_t$. In the next step, we’ll combine these two to create an update to the state.

<img src="http://colah.github.io/posts/2015-08-Understanding-LSTMs/img/LSTM3-focus-i.png" style="zoom:50%;" />

- **It’s now time to** update the old cell state, $C_{t−1}$, into the new cell state $C_t$. We multiply the old state by $f_t$, **forgetting the things we decided to forget earlier**. Then we add $i_t∗\widetilde{C}_t$. This is the new candidate values, scaled by how much we decided to update each state value. 

In the case of the language model, this is where we’d actually **drop the information about the old subject’s gender and add the new information**, as we decided in the previous steps. 

<img src="http://colah.github.io/posts/2015-08-Understanding-LSTMs/img/LSTM3-focus-C.png" style="zoom:50%;" />

- **Finally**, we need to **decide what we’re going to output** . This output will be based on our cell state, but will be a filtered version. First, we run a **sigmoid layer which decides what parts of the cell state we’re going to output**. Then, we put the cell state through $tanh$ (to push the values to be between −1 and 1) and multiply it by the output of the sigmoid gate, so that we only output the parts we decided to.

<img src="http://colah.github.io/posts/2015-08-Understanding-LSTMs/img/LSTM3-focus-o.png" style="zoom:50%;" />

## Variants on Long Short Term Memory

- One popular LSTM variant, introduced by [Gers & Schmidhuber (2000)](ftp://ftp.idsia.ch/pub/juergen/TimeCount-IJCNN2000.pdf), is adding “peephole connections.” This means that we let the gate layers look at the cell state.

<img src="http://colah.github.io/posts/2015-08-Understanding-LSTMs/img/LSTM3-var-peepholes.png" style="zoom:50%;" />

- Another variation is to use coupled forget and input gates. Instead of separately deciding what to forget and what we should add new information to, we make those decisions together. We only forget when we’re going to input something in its place. We only input new values to the state when we forget something older.

<img src="http://colah.github.io/posts/2015-08-Understanding-LSTMs/img/LSTM3-var-tied.png" style="zoom:50%;" />

- A slightly more dramatic variation on the LSTM is the Gated Recurrent Unit, or GRU, introduced by [Cho, et al. (2014)](http://arxiv.org/pdf/1406.1078v3.pdf). It **combines the forget and input gates into a single “update gate.**” It also **merges the cell state and hidden state, and makes some other changes**. The resulting model is simpler than standard LSTM models, and has been growing increasingly popular.

<img src="http://colah.github.io/posts/2015-08-Understanding-LSTMs/img/LSTM3-var-GRU.png" style="zoom:50%;" />

## Another version

<img src="https://miro.medium.com/max/2840/1*0f8r3Vd-i4ueYND1CUrhMA.png" style="zoom: 33%;" />

- **Forget gate**

<img src="https://miro.medium.com/max/1900/1*GjehOa513_BgpDDP6Vkw2Q.gif" style="zoom: 50%;" />

- **Input Gate**

<img src="https://miro.medium.com/max/1900/1*TTmYy7Sy8uUXxUXfzmoKbA.gif" style="zoom: 50%;" />

- **Cell State**

<img src="https://miro.medium.com/max/1900/1*S0rXIeO_VoUVOyrYHckUWg.gif" style="zoom:50%;" />

- **Output Gate**

<img src="https://miro.medium.com/max/1900/1*VOXRGhOShoWWks6ouoDN3Q.gif" style="zoom:50%;" />



## Conclusion

**LSTMs were a big step in what we can accomplish with RNNs**. It’s natural to wonder: is there another big step? A common opinion among researchers is: “Yes! **There is a next step and it’s attention!**” The idea is to let every step of an RNN pick information to look at from some larger collection of information. For example, if you are using an RNN to create a caption describing an image, it might pick a part of the image to look at for every word it outputs. In fact, [Xu, *et al.* (2015)](http://arxiv.org/pdf/1502.03044v2.pdf) do exactly this – it might be a fun starting point if you want to explore attention! There’s been a number of really exciting results using attention, and it seems like a lot more are around the corner…

Attention isn’t the only exciting thread in RNN research. For example, Grid LSTMs by [Kalchbrenner, *et al.* (2015)](http://arxiv.org/pdf/1507.01526v1.pdf) seem extremely promising. Work using RNNs in generative models – such as [Gregor, *et al.* (2015)](http://arxiv.org/pdf/1502.04623.pdf), [Chung, *et al.* (2015)](http://arxiv.org/pdf/1506.02216v3.pdf), or [Bayer & Osendorfer (2015)](http://arxiv.org/pdf/1411.7610v3.pdf) – also seems very interesting. The last few years have been an exciting time for recurrent neural networks, and the coming ones promise to only be more so!

## GRU

Gated Recurrent Unit (pictured below), is a type of Recurrent Neural Network that **addresses the issue of long term dependencies** which can lead to vanishing gradients in large networks. **GRUs address this issue by storing "memory" from the previous time point to help inform the network for future predictions.**

<img src="http://colah.github.io/posts/2015-08-Understanding-LSTMs/img/LSTM3-var-GRU.png" style="zoom:50%;" />

### GRUs vs Longterm Short Term Memory (LSTM) RNNs

The main differences between GRUs and the popular LSTMs (nicely explained by Chris Olah) are the **number of gates and maintenance of cell states**. Unlike GRUs, **LSTMs have 3 gates (input, forget, output) and maintains an internal memory cell state, which makes it more flexible, but less efficient memory and time wise**. However, since both of these networks are great at addressing the vanishing gradient problem required for efficiently tracking long term dependencies. **Choosing between them are usually done using a rule of thumb**. As such, it is recommended that you first train a LSTM, since it has more parameters and is a bit more flexible, followed by a GRU, and if there are no sizable differences between the performance of the two, then use the much simpler and efficient GRU.

