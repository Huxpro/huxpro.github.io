---
title: "Seq2seq with Attention"
subtitle: "CS 20SI「13」"
layout: post
author: "echisenyang"
header-style: text
hidden: true
catalog: true
tags:
  - 笔记
  - 课程
  - TensorFlow
---



## Seq2seq with Attention

![kEwgg4](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/kEwgg4.png)

Sequence to Sequence

- Consists of two recurrent neural networks (RNNs):
  - Encoder maps a variable-length source sequence (input) to a fixed-length vector
  - Decoder maps the vector representation back to a variable-length target sequence (output)
  - Two RNNs are trained jointly to maximize the conditional probability of the target sequence given a source sequence

![ltnkRb](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/ltnkRb.png)

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/lQv5oU.png" alt="lQv5oU" style="zoom: 33%;" />

- Encoder and Decoder in TensorFlow
  - Each box in the picture represents a cell of the RNN, most commonly a GRU cell or an LSTM cell.
  - Encoder and decoder often have different weights, but sometimes

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/iPO5PG.png" alt="iPO5PG" style="zoom: 50%;" />

- With Attention
  - In the vanilla model, each input has to be encoded into a fixed-size state vector, as that is the only thing passed to the decoder.
  - Attention mechanism that gives decoder direct access to the input.

- Bucketing

  - Avoid too much padding that leads to extraneous computation
  - Group sequences of similar lengths into the same buckets

  - Create a separate subgraph for each bucket
  - In practice, use the bucketing algorithm used in TensorFlow’s translate model

- Sampled Softmax

  - Avoid the growing complexity of computing the normalization constant
  - Approximate the negative term of the gradient, by importance sampling with a small number of samples.
  - At each step, update only the vectors associated with the correct word w and with the sampled words in V’
  - Once training is over, use the full target vocabulary to compute the output probability of each target word

[code](https://github.com/chiphuyen/stanford-tensorflow-tutorials/tree/master/assignments/chatbot)

