---
title: "Structure your TensorFlow model (word2vec)"
subtitle: "CS 20SI「04」"
layout: post
author: "echisenyang"
header-style: text
hidden: false
catalog: true
tags:
  - 笔记
  - CS20SI
  - TensorFlow
  - 输出计划
---



## Structure your TensorFlow model (word2vec)

本章概要

1. Overall structure of a model in TensorFlow
2. word2vec
3. Name scope
4. Embedding visualization

In the next two lectures, we will discuss a way to efficiently structure our models. And we will be doing that through an example: word2vec.



### Overall structure of a model in TensorFlow

**Phase 1: Assemble graph**

1. Define placeholders for input and output
2. Define the weights
3. Define the inference model
4. Define loss function
5. Define optimizer

**Phase 2: Compute**

![NTyc7P](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/NTyc7P.png)



### Word Embedding

**SVD（count based method）的局限性：**

- huge complex operation to carry out the SVD to find these lower rank representations
- add one more word in the vocabulary have to do whole co-occurence matrix and also do the whole SVD

![Z8pNOT](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/Z8pNOT.png)

**AI predicting based method更为合适**

![hiLZv9](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/hiLZv9.png)

### Recall Skip-gram

#### CS224N-Skip-gram

$w_t$ 为one-hot向量，矩阵w为hidden layer相当于一个lookup table，隐层的输出向量 $v_c$ （也即center word）相当于“word vector” for the input word；再看输出层，这里的 $u_x$ （多个context word）也应该通过类似 $v_c$ 的方式得到，然后 $v_c$ 与这些context words分别做softmax，output layer 输出即为在给定 center word 的前提下，词表中所有词（10000）对应的概率，这个概率就是 softmax 概率，和为1。

![ub0zcL](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/ub0zcL.png)

![qAoBaO](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/qAoBaO.png)

### [Distributed Representations of Words and Phrases and their Compositionality, Mikolov, etc]

The training objective is to learn word vector representations that are good at predicting the nearby words. More formally, given a sequence of training words $w_1 , w_2 , w_3 , . . . , w_T$ , the objective of the Skip-gram model is to maximize the average log probability
$$
\frac{1}{T} \sum_{t=1}^{T} \sum_{c \leq j \leq c, j \neq 0} \log p\left(w_{t+j} \mid w_{t}\right)
$$
The basic Skip-gram formulation deﬁnes $p(w_{t+j} \mid w_t )$ using the softmax function:
$$
p\left(w_{O} \mid w_{I}\right)=\frac{\exp \left(v_{w_{O}}^{\prime} \bar{v}_{w_{I}}\right)}{\sum_{w=1}^{W} \exp \left({v_{w}^{\prime}}^{\top} v_{w_{I}}\right)}
$$
This formulation is impractical because the cost of computing $∇ log p(w_O \mid w_I )$ is proportional to W, which is often large ($10^5 –10^7$ terms). 

- 结论：采用softmax效率太低！！！

- 改进一：Hierarchical Softmax，有进步但还不够好

  A computationally efﬁcient approximation of the full softmax is the hierarchical softmax. instead of evaluating W output nodes, only about $log_2 (W)$ nodes. 

- 改进二：Noise Contrastive Estimation (NCE)

  An alternative to the hierarchical softmax, which is used to replace every $log P(w_O \mid w_I )$ term in the Skip-gram objective. 
  $$
  \log \sigma{\left({v_{w_{O}}^{\prime}}^{\top} v_{w_{I}}\right)}+ \sum_{i=1}^{k} {\mathbb{E}_{w_{i} \sim P_{n}(w)}\left[\log \sigma\left(-v_{w_{i}}^{\prime \top} v_{w_{I}}\right)\right]}
  $$
  Our experiments indicate that values of k in the range 5–20 are useful for small training datasets, while for large datasets the k can be as small as 2–5.

- 改进三：Subsampling of Frequent Words

  To counter the imbalance between the rare and frequent words（the vector representations of frequent words do not change signiﬁcantly after training on several million examples）
  $$
  P\left(w_{i}\right)=1-\sqrt{\frac{t}{f\left(w_{i}\right)}}
  $$
  where $f(w_i )$ is the frequency of word w i and t is a chosen threshold, typically around $10^{−5}$ . We chose this subsampling formula because it aggressively subsamples words whose frequency is greater than t while preserving the ranking of the frequencies.

### Implementing word2vec skip-gram

In the skip-gram model, to get the vector representations of words, we train a simple neural network with a single hidden layer to perform a certain task, but then we don’t use that neural network for the task we trained it on. Instead, **we care about the weights of the hidden layer**. These weights are actually the “word vectors”, or “embedding matrix” that we’re trying to learn.

#### [Dive into Negative sampling](https://ruder.io/word-embeddings-softmax/index.html)

**Negative sampling** is actually **a simplified model** of an approach called **Noise Contrastive Estimation** (NCE). We train a model **to differentiate the target word from noise**. We can thus reduce the problem of predicting the correct word to a binary classification task, where the model tries to distinguish positive, genuine data from noise samples. 

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/wibZEy.jpg" alt="wibZEy" style="zoom:50%;" />

 As we need labels to perform our binary classification task, we designate all correct words $w_i$ given their **context** $c_i$ as **true** ($y=1$) and **all noise samples** $\tilde{w}_{i k}$ as **false** ($y=0$).

We can now use logistic regression **to minimize the negative log-likelihood**, i.e. cross-entropy of our training examples against the noise
$$
J_{\theta}=-\sum_{w_{i} \in V}\left[\log P\left(y=1 \mid  w_{i}, c_{i}\right)+k \mathbb{E}_{\tilde{w}_{i k} \sim Q}\left[\log P\left(y=0 \mid  \tilde{w}_{i j}, c_{i}\right)\right]\right]
$$
**Instead of computing the expectation** $\mathbb{E}_{\tilde{w}_{i k} \sim Q}$ of our noise samples, which would still require summing over all words in VV to predict the normalised probability of a negative label, we can again **take the mean with the Monte Carlo approximation**:
$$
J_{\theta}=-\sum_{w_{i} \in V}\left[\log P\left(y=1 \mid  w_{i}, c_{i}\right)+k \sum_{j=1}^{k} \frac{1}{k} \log P\left(y=0 \mid  \tilde{w}_{i j}, c_{i}\right)\right]
$$
which reduces to:
$$
J_{\theta}=-\sum_{w_{i} \in V}\left[\log P\left(y=1 \mid  w_{i}, c_{i}\right)+\sum_{j=1}^{k} \log P\left(y=0 \mid  \tilde{w}_{i j}, c_{i}\right)\right]
$$
By generating $k$ noise samples for every genuine word $w_i$ given its context $c$, we are effectively sampling words from **two different distributions**: **Correct** words are sampled from the empirical distribution of the **training** set $P_{train}$ and depend on their context $c$, whereas **noise samples** come from the **noise distribution** $Q$. We can thus represent **the probability of sampling either a positive or a noise sample as a mixture of those two distributions**, which are weighted based on the number of samples that come from each:
$$
P(y, w \mid  c)=\frac{1}{k+1} P_{\text {train }}(w \mid  c)+\frac{k}{k+1} Q(w)
$$
Given this mixture, we can now calculate the probability that a sample came from the training $P_{train}$ distribution as a conditional probability of $y$ given ww and $c$:
$$
P(y=1 \mid  w, c)=\frac{\frac{1}{k+1} P_{\operatorname{train}}(w \mid  c)}{\frac{1}{k+1} P_{\operatorname{train}}(w \mid  c)+\frac{k}{k+1} Q(w)}
$$
which can be simplified to:
$$
P(y=1 \mid  w, c)=\frac{P_{\operatorname{train}}(w \mid  c)}{P_{\operatorname{train}}(w \mid  c)+k Q(w)}
$$
As we don't know $P_{train}$  (which is what we would like to calculate), we replace $P_{train}$  with the probability of our model $P$
$$
P(y=1 \mid  w, c)=\frac{P(w \mid  c)}{P(w \mid  c)+k Q(w)}
$$

Note that computing $P(w \mid c)$, i.e. the probability of a word ww given its context $c$ is essentially the definition of our softmax:
$$
P(w \mid c)=\frac{\exp \left(h^{\top} v_{w}^{\prime}\right)}{\sum_{w_{i} \in V} \exp \left(h^{\top} v_{w_{i}}^{\prime}\right)}=\frac{\exp \left(h^{\top} v_{w}^{\prime}\right)}{Z(c)}
$$
Having to compute $P(w \mid c)$ means that -- again -- we need to compute $Z(c)$, which **requires us to sum over the probabilities of all words** in $V$. In the case of NCE, there exists **a neat trick to circumvent this issue**: We can treat the normalisation denominator $Z(c)$ as a parameter that the model can learn.
Mnih and Teh (2012) and Vaswani et al. (2013) [[16\]](https://ruder.io/word-embeddings-softmax/index.html#fn16) actually keep $Z(c)$ **fixed at 1, which they report does not affect the model's performance**. This assumption has the nice side-effect of reducing the model's parameters, while ensuring that the model self-normalises by not depending on the explicit normalisation in $Z(c)$. Indeed, Zoph et al. (2016) [[17\]](https://ruder.io/word-embeddings-softmax/index.html#fn17) find that even when learned, $Z(c)$ is **close to 1 and has low variance**.
$$
P(w \mid  c)=\exp \left(h^{\top} v_{w}^{\prime}\right)
$$

$$
P(y=1 \mid  w, c)=\frac{\exp \left(h^{\top} v_{w}^{\prime}\right)}{\exp \left(h^{\top} v_{w}^{\prime}\right)+k Q(w)}
$$

$$
J_{\theta}=-\sum_{w_{i} \in V}\left[\log \frac{\exp \left(h^{\top} v_{w_{i}}^{\prime}\right)}{\exp \left(h^{\top} v_{w_{i}}^{\prime}\right)+k Q\left(w_{i}\right)}+\sum_{j=1}^{k} \log \left(1-\frac{\exp \left(h^{\top} v_{\tilde{w}_{i j}}^{\prime}\right)}{\exp \left(h^{\top} v_{\tilde{w}_{i j}}^{\prime}\right)+k Q\left(\tilde{w}_{i j}\right)}\right)\right]
$$

![0W2ODi](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/0W2ODi.png)

```python
""" The no frills implementation of word2vec skip-gram model using NCE loss.
"""

from __future__ import absolute_import
from __future__ import division
from __future__ import print_function

import os
os.environ['TF_CPP_MIN_LOG_LEVEL']='2'

import numpy as np
import tensorflow as tf
from tensorflow.contrib.tensorboard.plugins import projector

from process_data import process_data

VOCAB_SIZE = 50000
BATCH_SIZE = 128
EMBED_SIZE = 128 # dimension of the word embedding vectors
SKIP_WINDOW = 1 # the context window
NUM_SAMPLED = 64    # Number of negative examples to sample.
LEARNING_RATE = 1.0
NUM_TRAIN_STEPS = 10000
SKIP_STEP = 2000 # how many steps to skip before reporting the loss

def word2vec(batch_gen):
    """ Build the graph for word2vec model and train it """
    # Step 1: define the placeholders for input and output
    with tf.name_scope('data'):
        center_words = tf.placeholder(tf.int32, shape=[BATCH_SIZE], name='center_words')
        # target_words的shape中的[,1]记录在词表的序号
        target_words = tf.placeholder(tf.int32, shape=[BATCH_SIZE, 1], name='target_words')

    # Assemble this part of the graph on the CPU. You can change it to GPU if you have GPU
    # Step 2: define weights. In word2vec, it's actually the weights that we care about

    with tf.name_scope('embedding_matrix'):
        embed_matrix = tf.Variable(tf.random_uniform([VOCAB_SIZE, EMBED_SIZE], -1.0, 1.0), 
                            name='embed_matrix')

    # Step 3: define the inference (compute the forward path of the graph)
    # to get the embedding (or vector representation) of the input center words
    with tf.name_scope('loss'):
        embed = tf.nn.embedding_lookup(embed_matrix, center_words, name='embed')

        # Step 4: construct variables for NCE loss
        nce_weight = tf.Variable(tf.truncated_normal([VOCAB_SIZE, EMBED_SIZE],
                                                    stddev=1.0 / (EMBED_SIZE ** 0.5)), 
                                                    name='nce_weight')
        nce_bias = tf.Variable(tf.zeros([VOCAB_SIZE]), name='nce_bias')

        # define loss function to be NCE loss function
        loss = tf.reduce_mean(tf.nn.nce_loss(weights=nce_weight, 
                                            biases=nce_bias, 
                                            labels=target_words, 
                                            inputs=embed, 
                                            num_sampled=NUM_SAMPLED, 
                                            num_classes=VOCAB_SIZE), name='loss')

    # Step 5: define optimizer
    optimizer = tf.train.GradientDescentOptimizer(LEARNING_RATE).minimize(loss)
    
    with tf.Session() as sess:
        sess.run(tf.global_variables_initializer())

        total_loss = 0.0 # we use this to calculate late average loss in the last SKIP_STEP steps
        writer = tf.summary.FileWriter('./graphs/no_frills/', sess.graph)
        for index in range(NUM_TRAIN_STEPS):
            centers, targets = next(batch_gen)
            loss_batch, _ = sess.run([loss, optimizer], 
                                    feed_dict={center_words: centers, target_words: targets})
            total_loss += loss_batch
            if (index + 1) % SKIP_STEP == 0:
                print('Average loss at step {}: {:5.1f}'.format(index, total_loss / SKIP_STEP))
                total_loss = 0.0
        writer.close()

def main():
    batch_gen = process_data(VOCAB_SIZE, BATCH_SIZE, SKIP_WINDOW)
    word2vec(batch_gen)

if __name__ == '__main__':
    main()
```

```python
from __future__ import absolute_import
from __future__ import division
from __future__ import print_function

from collections import Counter
import random
import os
import sys
sys.path.append('..')
import zipfile

import numpy as np
from six.moves import urllib
import tensorflow as tf

import utils

# Parameters for downloading data
DOWNLOAD_URL = 'http://mattmahoney.net/dc/'
EXPECTED_BYTES = 31344016
DATA_FOLDER = 'data/'
FILE_NAME = 'text8.zip'

def download(file_name, expected_bytes):
    """ Download the dataset text8 if it's not already downloaded """
    file_path = DATA_FOLDER + file_name
    if os.path.exists(file_path):
        print("Dataset ready")
        return file_path
    file_name, _ = urllib.request.urlretrieve(DOWNLOAD_URL + file_name, file_path)
    file_stat = os.stat(file_path)
    if file_stat.st_size == expected_bytes:
        print('Successfully downloaded the file', file_name)
    else:
        raise Exception('File ' + file_name +
                        ' might be corrupted. You should try downloading it with a browser.')
    return file_path

def read_data(file_path):
    """ Read data into a list of tokens 
    There should be 17,005,207 tokens
    """
    with zipfile.ZipFile(file_path) as f:
        words = tf.compat.as_str(f.read(f.namelist()[0])).split() 
        # tf.compat.as_str() converts the input into the string
    return words

def build_vocab(words, vocab_size):
    """ Build vocabulary of VOCAB_SIZE most frequent words """
    dictionary = dict()
    count = [('UNK', -1)]
    count.extend(Counter(words).most_common(vocab_size - 1))
    index = 0
    utils.make_dir('processed')
    with open('processed/vocab_1000.tsv', "w") as f:
        for word, _ in count:
            dictionary[word] = index
            if index < 1000:
                f.write(word + "\n")
            index += 1
    index_dictionary = dict(zip(dictionary.values(), dictionary.keys()))
    return dictionary, index_dictionary

def convert_words_to_index(words, dictionary):
    """ Replace each word in the dataset with its index in the dictionary """
    return [dictionary[word] if word in dictionary else 0 for word in words]

def generate_sample(index_words, context_window_size):
    """ Form training pairs according to the skip-gram model. """
    for index, center in enumerate(index_words):
        context = random.randint(1, context_window_size)
        # get a random target before the center word
        for target in index_words[max(0, index - context): index]:
            yield center, target
        # get a random target after the center wrod
        for target in index_words[index + 1: index + context + 1]:
            yield center, target

def get_batch(iterator, batch_size):
    """ Group a numerical stream into batches and yield them as Numpy arrays. """
    while True:
        center_batch = np.zeros(batch_size, dtype=np.int32)
        target_batch = np.zeros([batch_size, 1])
        for index in range(batch_size):
            center_batch[index], target_batch[index] = next(iterator)
        yield center_batch, target_batch

def process_data(vocab_size, batch_size, skip_window):
    file_path = download(FILE_NAME, EXPECTED_BYTES)
    words = read_data(file_path)
    dictionary, _ = build_vocab(words, vocab_size)
    index_words = convert_words_to_index(words, dictionary)
    del words # to save memory
    single_gen = generate_sample(index_words, skip_window)
    return get_batch(single_gen, batch_size)

def get_index_vocab(vocab_size):
    file_path = download(FILE_NAME, EXPECTED_BYTES)
    words = read_data(file_path)
    return build_vocab(words, vocab_size)
```

### Name Scope

![H8YHxm](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/H8YHxm.png)

**This doesn’t look very readable**, as you can see in the graph, the nodes are scattering all over. TensorBoard doesn’t know which nodes are similar to which nodes and should be grouped together. This setback can grow to be extremely daunting when you build complex models with hundreds of ops.

```python
# our graph can have 3 op blocks: “Data”, “embed”, and “NCE_LOSS” 
with tf.name_scope('data'):
	center_words = tf.placeholder(tf.int32, shape=[BATCH_SIZE], name='center_words') 	target_words = tf.placeholder(tf.int32, shape=[BATCH_SIZE, 1], name='target_words')
	
with tf.name_scope('embed'):
	embed_matrix = tf.Variable(tf.random_uniform([VOCAB_SIZE, EMBED_SIZE], -1.0, 1.0), name='embed_matrix')

with tf.name_scope('loss'):
	embed = tf.nn.embedding_lookup(embed_matrix, center_words, name='embed') 		
    nce_weight = tf.Variable(tf.truncated_normal([VOCAB_SIZE, EMBED_SIZE], 
                                                 stddev=1.0 / math.sqrt(EMBED_SIZE)), 
                             name='nce_weight')
	nce_bias = tf.Variable(tf.zeros([VOCAB_SIZE]), name='nce_bias')
	loss = tf.reduce_mean(tf.nn.nce_loss(weights=nce_weight, biases=nce_bias, 	
                                         labels=target_words, inputs=embed, 
                                         num_sampled=NUM_SAMPLED, 
                                         num_classes=VOCAB_SIZE), name='loss')
```

![mXnon3](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/mXnon3.png)

**TensorBoard has two kinds of edges**: 

- the solid lines:  

  The solid lines represent data flow edges. For example, the value of op tf.add(x + y) depends on the value of x and y.

- the dotted lines:

   The dotted arrows represent control dependence edges. For example, a variable can only be used after being initialized, as you see variable embed_matrix depends on the op init). 

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/iaAJap.png" alt="iaAJap" style="zoom: 33%;" />

### visualization with less than 10 lines of code

```python
from tensorflow.contrib.tensorboard.plugins import projector

# obtain the embedding_matrix after you’ve trained it
final_embed_matrix = sess.run(model.embed_matrix)

# create a variable to hold your embeddings. It has to be a variable. Constants # don’t work. You also can’t just use the embed_matrix we defined earlier for our model. Why

# is that so? I don’t know. I get the 500 most popular words. embedding_var = tf.Variable(final_embed_matrix[:500], name='embedding')
sess.run(embedding_var.initializer) config = projector.ProjectorConfig()
summary_writer = tf.summary.FileWriter(LOGDIR)

# add embeddings to config embedding = config.embeddings.add()
embedding.tensor_name = embedding_var.name

# link the embeddings to their metadata file. In this case, the file that contains
# the 500 most popular words in our vocabulary embedding.metadata_path = LOGDIR + '/vocab_500.tsv'
# save a configuration file that TensorBoard will read during startup
projector.visualize_embeddings(summary_writer, config)

# save our embedding saver_embed = tf.train.Saver([embedding_var])
saver_embed.save(sess, LOGDIR + '/skip-gram.ckpt', 1)
```

