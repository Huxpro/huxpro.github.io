---
title: "Introduction to RNN LSTM GRU"
subtitle: "CS 20SI「11」"
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



## Introduction to RNN LSTM GRU

本章概要

1. Implementation tricks & treats
2. Live demo of Language Modeling



### From feed-forward to RNNs

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/tz3gXB.png" alt="tz3gXB" style="zoom: 33%;" />

- RNNs take advantage of sequential information of data (texts, genomes, spoken words, etc.)
- Directed cycles
- All steps share weights to reduce the total number of parameters
- Form the backbone of NLP
- Can also be used for images

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/Lt7Qi7.png" alt="Lt7Qi7" style="zoom:33%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/bmsc3N.png" alt="bmsc3N" style="zoom:33%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/Tin9Uy.png" alt="Tin9Uy" style="zoom:33%;" />

- The problem with RNNs

  - **In practice, RNNs aren’t very good at capturing long-term dependencies**

    *“I grew up in France… I speak fluent ???” -> Needs information from way back*

- **The rise of LSTMs**

  - Control how much of new input to take, how much of the previous hidden state to forget

  - Closer to how humans process information

  - The idea is not new. Hochreiter and Schmidhuber published the paper in 1997*

    **Hochreiter, Sepp, and Jürgen Schmidhuber. "Long short-term memory." Neural computation 9.8 (1997): 1735-1780.*

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/GHpxih.png" alt="GHpxih" style="zoom:33%;" />

- **LSTMs vs GRUs**
  - People find LSTMs work well, but **unnecessarily complicated**, so they introduced GRUs

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/eWsvtd.png" alt="eWsvtd" style="zoom:33%;" />

- GRUs (Gated Recurrent Units)

  - Computationally less expensive

  - Performance on par with LSTMs*

    **Chung, Junyoung, et al. "Empirical evaluation of gated recurrent neural networks on sequence modeling." arXiv preprint arXiv:1412.3555 (2014).*



### What can RNNs do?

- Language Modeling
  - Allows us to measure how likely a sentence is
  - Important input for Machine Translation (since high-probability sentences are typically correct)
  - Can generate new text
- Character-level Language Modeling
  - [Multi-layer Recurrent Neural Networks (LSTM, GRU, RNN) for character-level language models in Torch](http://karpathy.github.io/2015/05/21/rnn-effectiveness/)

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/Cx4ZsG.png" alt="Cx4ZsG" style="zoom:33%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/0dmwyx.png" alt="0dmwyx" style="zoom:33%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/zYdG17.png" alt="zYdG17" style="zoom:33%;" />

#### character-level generative language model

- RNNs in TensorFlow
  - Cell Support (``tf.nn.rnn_cell`)
    - BasicRNNCell: The most basic RNN cell.
    - RNNCell: Abstract object representing an RNN cell.
    - BasicLSTMCell: Basic LSTM recurrent network cell.
    - LSTMCell: LSTM recurrent network cell.
    - GRUCell: Gated Recurrent Unit cell

```python
# utils
import os
os.environ['TF_CPP_MIN_LOG_LEVEL']='2'
import tensorflow as tf

def huber_loss(labels, predictions, delta=1.0):
    residual = tf.abs(predictions - labels)
    def f1(): return 0.5 * tf.square(residual)
    def f2(): return delta * residual - 0.5 * tf.square(delta)
    return tf.cond(residual < delta, f1, f2)

def make_dir(path):
    """ Create a directory if there isn't one already. """
    try:
        os.mkdir(path)
    except OSError:
    	pass
```

```python
""" A clean, no_frills character-level generative language model.
Based on Andrej Karpathy's blog: 
http://karpathy.github.io/2015/05/21/rnn-effectiveness/
"""
import os
os.environ['TF_CPP_MIN_LOG_LEVEL']='2'
import sys
sys.path.append('..')
import time
import tensorflow as tf
import utils

DATA_PATH = 'data/arvix_abstracts.txt'
HIDDEN_SIZE = 200
BATCH_SIZE = 64
NUM_STEPS = 50
SKIP_STEP = 40
TEMPRATURE = 0.7
LR = 0.003
LEN_GENERATED = 300

def vocab_encode(text, vocab):
    return [vocab.index(x) + 1 for x in text if x in vocab]

def vocab_decode(array, vocab):
    return ''.join([vocab[x - 1] for x in array])

def read_data(filename, vocab, window=NUM_STEPS, overlap=NUM_STEPS//2):
    for text in open(filename):
        text = vocab_encode(text, vocab)
        for start in range(0, len(text) - window, overlap):
            chunk = text[start: start + window]
            chunk += [0] * (window - len(chunk))
            yield chunk

def read_batch(stream, batch_size=BATCH_SIZE):
    batch = []
    for element in stream:
        batch.append(element)
        if len(batch) == batch_size:
            yield batch
            batch = []
    yield batch

def create_rnn(seq, hidden_size=HIDDEN_SIZE):
    cell = tf.contrib.rnn.GRUCell(hidden_size)
    in_state = tf.placeholder_with_default(
            cell.zero_state(tf.shape(seq)[0], tf.float32), [None, hidden_size])
    # this line to calculate the real length of seq
    # all seq are padded to be of the same length which is NUM_STEPS
    length = tf.reduce_sum(tf.reduce_max(tf.sign(seq), 2), 1)
    output, out_state = tf.nn.dynamic_rnn(cell, seq, length, in_state)
    return output, in_state, out_state

def create_model(seq, temp, vocab, hidden=HIDDEN_SIZE):
    seq = tf.one_hot(seq, len(vocab))
    output, in_state, out_state = create_rnn(seq, hidden)
    # fully_connected is syntactic sugar for tf.matmul(w, output) + b
    # it will create w and b for us
    logits = tf.contrib.layers.fully_connected(output, len(vocab), None)
    loss = tf.reduce_sum(tf.nn.softmax_cross_entropy_with_logits(logits=logits[:, :-1], labels=seq[:, 1:]))
    # sample the next character from Maxwell-Boltzmann Distribution with temperature temp
    # it works equally well without tf.exp
    sample = tf.multinomial(tf.exp(logits[:, -1] / temp), 1)[:, 0] 
    return loss, sample, in_state, out_state

def training(vocab, seq, loss, optimizer, global_step, temp, sample, in_state, out_state):
    saver = tf.train.Saver()
    start = time.time()
    with tf.Session() as sess:
        writer = tf.summary.FileWriter('graphs/gist', sess.graph)
        sess.run(tf.global_variables_initializer())
        
        ckpt = tf.train.get_checkpoint_state(os.path.dirname('checkpoints/arvix/checkpoint'))
        if ckpt and ckpt.model_checkpoint_path:
            saver.restore(sess, ckpt.model_checkpoint_path)
        
        iteration = global_step.eval()
        for batch in read_batch(read_data(DATA_PATH, vocab)):
            batch_loss, _ = sess.run([loss, optimizer], {seq: batch})
            if (iteration + 1) % SKIP_STEP == 0:
                print('Iter {}. \n    Loss {}. Time {}'.format(iteration, batch_loss, time.time() - start))
                online_inference(sess, vocab, seq, sample, temp, in_state, out_state)
                start = time.time()
                saver.save(sess, 'checkpoints/arvix/char-rnn', iteration)
            iteration += 1

def online_inference(sess, vocab, seq, sample, temp, in_state, out_state, seed='T'):
    """ Generate sequence one character at a time, based on the previous character
    """
    sentence = seed
    state = None
    for _ in range(LEN_GENERATED):
        batch = [vocab_encode(sentence[-1], vocab)]
        feed = {seq: batch, temp: TEMPRATURE}
        # for the first decoder step, the state is None
        if state is not None:
            feed.update({in_state: state})
        index, state = sess.run([sample, out_state], feed)
        sentence += vocab_decode(index, vocab)
    print(sentence)

def main():
    vocab = (
            " $%'()+,-./0123456789:;=?ABCDEFGHIJKLMNOPQRSTUVWXYZ"
            "\\^_abcdefghijklmnopqrstuvwxyz{|}")
    seq = tf.placeholder(tf.int32, [None, None])
    temp = tf.placeholder(tf.float32)
    loss, sample, in_state, out_state = create_model(seq, temp, vocab)
    global_step = tf.Variable(0, dtype=tf.int32, trainable=False, name='global_step')
    optimizer = tf.train.AdamOptimizer(LR).minimize(loss, global_step=global_step)
    utils.make_dir('checkpoints')
    utils.make_dir('checkpoints/arvix')
    training(vocab, seq, loss, optimizer, global_step, temp, sample, in_state, out_state)
    
if __name__ == '__main__':
    main()
```

#### Construct Cells (`tf.nn.rnn_cell`)

```python
# Stack multiple cells
cell = tf.nn.rnn_cell.GRUCell(hidden_size)
rnn_cells = tf.nn.rnn_cell.MultiRNNCell([cell] * num_layers)

# Construct Recurrent Neural Network
tf.nn.dynamic_rnn # uses a tf.While loop to dynamically construct the graph when it is executed. Graph creation is faster and you can feed batches of variable size.
tf.nn.bidirectional_dynamic_rnn: # dynamic_rnn with bidirectional
 
# Q: Any problem with this?
output, out_state = tf.nn.dynamic_rnn(cell, seq, length, initial_state)
# A: Most sequences are not of the same length

# Approach 1
full_loss = tf.nn.softmax_cross_entropy_with_logits(preds, labels) 
loss = tf.reduce_mean(tf.boolean_mask(full_loss, mask))
# Approach 2
tf.reduce_sum(tf.reduce_max(tf.sign(seq), 2), 1)
output, out_state = tf.nn.dynamic_rnn(cell, seq, length, initial_state)
```

- Dealing with variable sequence length
  - **Pad** all sequences with zero vectors and all labels with zero label (to make them of the same length)
  - Most current models can’t deal with sequences of length larger than 120 tokens, so there is usually **a fixed max_length** and we truncate the sequences to that max_length

- Problem?
  - **The padded labels change the total loss, which affects the gradients**
  - Approach 1:
    - **Maintain a mask** (True for real, False for padded tokens)
    - Run your model on both the real/padded tokens (model will predict labels for the padded tokens as well)
    - **Only take into account the loss caused by the real elements**
  - Approach 2:
    - **Let your model know the real sequence length** so it only predict the labels for the real tokens

#### Vanishing Gradients

- CS224N
  - with the naive transition function in particular, what it means we've doing this sequence of matrix multipiers. 矩阵连乘意味着前面的时刻会对最后一个时间点做决策的影响有多大，我们再通过反向传播去更新这种影响。门控网络的提出是要做什么呢？我们想证明 ***the effect of early time steps on much later time steps without having to do this long sequence matrix multiplies***, 因为这些长序列的矩阵连乘会因为梯度消失等问题而带来消灭证据的风险。因此我们想在序列之间增加 shortcut connections，这样无论是前向传播还是反向传播，都能更好的验证不同节点间的影响（这便是门控网络提出的institution）。 
  - **为什么gru不会遭受梯度消失？**密码在这个式子里$f\left(h_{t-1}, x_{t}\right)=u_{t} \odot \tilde{h}_{t}+\left(1-u_{t}\right) \odot h_{t-1}$ ，当 $u_{t}$ 趋向于0时，$h_{t-1}$ 前的系数趋向于1，这意味着 $h_{t}$ 对 $h_{t-1}$ 的导数趋向于1，***that's the perfect case for gradients to flow beautifully, nothing is lost, it's just going straight back down the line, so that's why it can carry information for a long time***. 当然如果 $u_{t}=1$ ，这意味着模型学出来的句子就是表征没有 long distance dependancy 。这条 ***direct pathway, where you getting this straight linear flow of grdient information, goning back in time***. 

- Use different activation units:
  - tf.nn.relu
  - tf.nn.relu6
  - tf.nn.crelu
  - tf.nn.elu
- In addition to:
  - tf.nn.softplus
  - tf.nn.softsign
  - tf.nn.bias_add
  - tf.sigmoid
  - tf.tanh

#### Exploding Gradients

- Clip gradients with `tf.clip_by_global_norm`

```python
# take gradients of cosst w.r.t. all trainable variables
gradients = tf.gradients(cost, tf.trainable_variables()) 

# clip the gradients by a pre-defined max norm
clipped_gradients, _ = tf.clip_by_global_norm(gradients, max_grad_norm) 

# add the clipped gradients to the optimizer
optimizer = tf.train.AdamOptimizer(learning_rate)
train_op = optimizer.apply_gradients(zip(gradients, trainables))
```

#### Anneal the learning rate

```python
# Optimizers accept both scalars and tensors as learning rate
learning_rate = tf.train.exponential_decay(init_lr, global_step, decay_steps, decay_rate, staircase=True) 
optimizer = tf.train.AdamOptimizer(learning_rate)
```

#### Overfitting

```python
# Use dropout through tf.nn.dropout or DropoutWrapper for cells
hidden_layer = tf.nn.dropout(hidden_layer, keep_prob)

cell = tf.nn.rnn_cell.GRUCell(hidden_size) 
cell = tf.nn.rnn_cell.DropoutWrapper(cell, output_keep_prob=keep_prob)
```

### Language Modeling: Character-level

- Introduced in the early 2010s
- Both input and output are characters

**Pros**:

- Very small vocabulary
- Doesn’t require word embeddings
- Faster to train

**Cons**:

- Low fluency (many words can be gibberish)

#### Language Modeling: Hybrid

- Word-level by default, switching to character-level for unknown tokens

#### Language Modeling: Subword-Level

- Input and output are subwords

- Keep W most frequent words

- Keep S most frequent syllables

- Split the rest into characters

- Seem to perform better than both word-level and character-level models*

  *Mikolov, Tomáš, et al. "Subword language modeling with neural networks."*

