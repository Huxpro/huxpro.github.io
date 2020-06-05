---
title: "Mechanics of Seq2seq Models With Attention"
subtitle: "transformer先导知识点"
layout: post
author: "echisenyang"
header-style: text
hidden: false
catalog: true
tags:
  - 输出计划
---



### Visualizing A Neural Machine Translation Model (Mechanics of Seq2seq Models With Attention)

A **sequence-to-sequence model** is a model that takes a sequence of items (words, letters, features of an images…etc) and outputs another sequence of items. A trained model would work like this:

<video width="100%" height="auto" loop autoplay controls>
  <source src="https://gitee.com/echisenyang/GiteeForFileUse/raw/master/gif/seq2seq_1.mp4" type="video/mp4">
</video>

In **neural machine translation**, a sequence is a series of words, processed one after another. The output is, likewise, a series of words:

<video width="100%" height="auto" loop autoplay controls>
  <source src="https://gitee.com/echisenyang/GiteeForFileUse/raw/master/gif/seq2seq_2.mp4" type="video/mp4">
</video>


The **encoder** processes each item in the input sequence, it **compiles the information it captures into a vector (called the context)**. After processing the entire input sequence, **the encoder sends the context over to the decoder**, which begins producing the output sequence item by item.

<video width="100%" height="auto" loop autoplay controls>
  <source src="https://gitee.com/echisenyang/GiteeForFileUse/raw/master/gif/seq2seq_3.mp4" type="video/mp4">
</video>

The same applies in the case of machine translation.

<video width="100%" height="auto" loop autoplay controls>
  <source src="https://gitee.com/echisenyang/GiteeForFileUse/raw/master/gif/seq2seq_4.mp4" type="video/mp4">
</video>

The **context** is a vector (an array of numbers, basically) in the case of machine translation. The encoder and decoder tend to both be recurrent neural networks (Be sure to check out Luis Serrano’s [A friendly introduction to Recurrent Neural Networks](https://www.youtube.com/watch?v=UNmqTiOnRfg) for an intro to RNNs).

You can set the size of the context vector when you set up your model. It is basically the number of hidden units in the encoder RNN. These visualizations show a vector of size 4, but in real world applications the context vector would be of a size like 256, 512, or 1024.

![YRjiXe](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/YRjiXe.png)

By design, **a RNN takes two inputs at each time step**: an **input** (in the case of the encoder, one word from the input sentence), and a **hidden state**. The word, however, needs to be represented by a vector. To transform a word into a vector, we turn to the class of methods called “[word embedding](https://machinelearningmastery.com/what-are-word-embeddings/)” algorithms. These turn words into vector spaces that capture a lot of the meaning/semantic information of the words (e.g. [king - man + woman = queen](http://p.migdal.pl/2017/01/06/king-man-woman-queen-why.html)).

![oLdqP3](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/oLdqP3.png)

Now that we’ve introduced our main vectors/tensors, let’s recap the mechanics of an RNN and establish a visual language to describe these models:


<video width="100%" height="auto" loop autoplay controls>
  <source src="https://gitee.com/echisenyang/GiteeForFileUse/raw/master/gif/RNN_1.mp4" type="video/mp4">
</video>


The next RNN step takes **the second input vector** and **hidden state #1** to create the output of that time step. Later in the post, we’ll use an animation like this to describe the vectors inside a neural machine translation model.

In the following visualization, each pulse for the encoder or decoder is that RNN processing its inputs and generating an output for that time step. Since the encoder and decoder are both RNNs, each time step one of the RNNs does some processing, it updates its hidden state based on its inputs and previous inputs it has seen.

Let’s look at the hidden states for the encoder. Notice how the last hidden state is actually the context we pass along to the decoder.

<video width="100%" height="auto" loop autoplay controls>
  <source src="https://gitee.com/echisenyang/GiteeForFileUse/raw/master/gif/seq2seq_5.mp4" type="video/mp4">
</video>

The decoder also maintains a hidden states that it passes from one time step to the next. We just didn’t visualize it in this graphic because we’re concerned with the major parts of the model for now.

Let’s now look at another way to visualize a sequence-to-sequence model. This animation will make it easier to understand the static graphics that describe these models. This is called **an “unrolled” view** where instead of showing the one decoder, we show a copy of it for each time step. This way we can look at the inputs and outputs of each time step.


<video width="100%" height="auto" loop autoplay controls>
  <source src="https://gitee.com/echisenyang/GiteeForFileUse/raw/master/gif/seq2seq_6.mp4" type="video/mp4">
</video>


### Let’s Pay Attention Now

**The context vector turned out to be a bottleneck for these types of models**. It made it challenging for the models to deal with long sentences. A solution was proposed in [Bahdanau et al., 2014](https://arxiv.org/abs/1409.0473) and [Luong et al., 2015](https://arxiv.org/abs/1508.04025). These papers introduced and refined a technique called “Attention”, which highly improved the quality of machine translation systems. **Attention allows the model to focus on the relevant parts of the input sequence as needed.**

![ly7wAF](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/ly7wAF.png)

Let’s continue looking at attention models at this high level of abstraction. An attention model differs from a classic sequence-to-sequence model in two main ways:

First, the encoder passes a lot more data to the decoder. **Instead of passing the last hidden state of the encoding stage, the encoder passes *all* the hidden states to the decoder**:

<video width="100%" height="auto" loop autoplay controls>
  <source src="https://gitee.com/echisenyang/GiteeForFileUse/raw/master/gif/seq2seq_7.mp4" type="video/mp4">
</video>

Second, an attention decoder does an extra step before producing its output. **In order to focus on the parts of the input that are relevant to this decoding time step, the decoder does the following**:

1. Look at the set of encoder hidden states it received – each encoder hidden states is most associated with a certain word in the input sentence
2. Give each hidden states a score (let’s ignore how the scoring is done for now)
3. Multiply each hidden states by its softmaxed score, thus amplifying hidden states with high scores, and drowning out hidden states with low scores

<video width="100%" height="auto" loop autoplay controls>
  <source src="https://gitee.com/echisenyang/GiteeForFileUse/raw/master/gif/attention_process.mp4" type="video/mp4">
</video>

This scoring exercise is done at each time step on the decoder side.

Let us now bring the whole thing together in the following visualization and look at how the attention process works:

1. The attention decoder RNN takes in the embedding of the \<END\> token, and an initial decoder hidden state.
2. The RNN processes its inputs, producing an output and a new hidden state vector (h4). The output is discarded.
3. Attention Step: We use the encoder hidden states and the h4 vector to calculate a context vector (C4) for this time step.
4. We concatenate h4 and C4 into one vector.
5. We pass this vector through a feedforward neural network (one trained jointly with the model).
6. The output of the feedforward neural networks indicates the output word of this time step.
7. Repeat for the next time steps

<video width="100%" height="auto" loop autoplay controls>
  <source src="https://gitee.com/echisenyang/GiteeForFileUse/raw/master/gif/attention_tensor_dance.mp4" type="video/mp4">
</video>

This is another way to look at which part of the input sentence we’re paying attention to at each decoding step:

<video width="100%" height="auto" loop autoplay controls>
  <source src="https://gitee.com/echisenyang/GiteeForFileUse/raw/master/gif/seq2seq_9.mp4" type="video/mp4">
</video>
**Note that the model isn’t just mindless aligning the first word at the output with the first word from the input. It actually learned from the training phase how to align words in that language pair** (French and English in our example). An example for how precise this mechanism can be comes from the attention papers listed above:

![Sf2Lf4](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/Sf2Lf4.png)

If you feel you’re ready to learn the **implementation**, be sure to check TensorFlow’s [Neural Machine Translation (seq2seq) Tutorial](https://github.com/tensorflow/nmt).

