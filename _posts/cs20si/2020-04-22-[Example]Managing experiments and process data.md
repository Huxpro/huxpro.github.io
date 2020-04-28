---
title: "Managing experiments and process data (word2vec)"
subtitle: "CS 20SI「05」"
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



## Managing experiments and process data (word2vec)

本章概要

1. tf.train.Saver
2. tf.summary
3. Randomization
4. Data Readers

### recall gradients

- Reverse mode automatic differentiation

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/MPqPyr.png" alt="MPqPyr" style="zoom:50%;" />

- `tf.gradients(y, [xs])`

  Take derivative of y with respect to each tensor in the list [xs]

  在我们构建 inference (forward propogation) 时，有关反向传播的梯度计算方式已经自动存储了，就等开启会话传入数据，从而automatic differentiation

```python
x = tf.Variable(2.0) 
y = 2.0 * (x ** 3) 
z = 3.0 + y ** 2 
grad_z = tf.gradients(z, [x, y]) 
with tf.Session() as sess:
	sess.run(x.initializer)
	print sess.run(grad_z) # >> [768.0, 32.0]
```



### `tf.train.Saver()`

> **Only save variables, not graph; Checkpoints map variable names to tensors**

A good practice is to **periodically save the model’s parameters** after a certain number of steps
so that we can restore/retrain our model from that step if need be. The `tf.train.Saver()` class
allows us to do so by **saving the graph’s variables in binary files**.

```python
tf.train.Saver.save(sess, 
                    save_path, 
                    global_step=None, 
                    latest_filename=None,
                    meta_graph_suffix='meta', 
                    write_meta_graph=True, 
                    write_state=True)
```

For example, if we want to **save the variables of the graph** after **every 1000 training steps**, we
do the following:

```python
# define model
# create a saver object saver = tf.train.Saver()
# launch a session to compute the graph

with tf.Session() as sess:
	# actual training loop
	for step in range(training_steps):
		sess.run([optimizer])
		if (step + 1) % 1000==0:
			saver.save(sess, 'checkpoint_directory/model_name',
					   global_step=model.global_step)
```

- **checkpoint (global_step)**

  In TensorFlow lingo, ***the step at which you save your graph’s variables*** is called a ***checkpoint***.
  Since we will be creating many checkpoints, it’s helpful to append the number of training steps
  our model has gone through in a variable called ***global_step****. It’s a very common variable to see in TensorFlow program. We first need to create it, **initialize it to 0 and set it to be not trainable**,*
  since we don’t want to TensorFlow to optimize it.

```python
self.global_step = tf.Variable(0, dtype=tf.int32, trainable=False, name='global_step')
```

We need to ***pass global_step as a parameter*** to the ***optimizer*** so it knows to **i*ncrement global_step by one with each training step***:

```python
self.optimizer = tf.train.GradientDescentOptimizer(self.lr).minimize(self.loss,
	global_step=self.global_step)
```

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/tdWBkD.png" alt="tdWBkD" style="zoom: 33%;" />

- TensorFlow, why there are 3 files after saving the model?

```
model.ckpt.data-00000-of-00001
model.ckpt.index
model.ckpt.meta
```

- three files
  - **meta file**: describes the **saved graph structure**, includes GraphDef, SaverDef, and so on; then apply `tf.train.import_meta_graph('/tmp/model.ckpt.meta')`, will restore `Saver` and `Graph`.
  - **index file**: it is a string-string immutable table(tensorflow::table::Table). Each key is a name of a tensor and its value is a serialized BundleEntryProto. Each BundleEntryProto describes the metadata of a tensor: which of the "data" files contains the content of a tensor, the offset into that file, checksum, some auxiliary data, etc.
  - **data file**: it is TensorBundle collection, **save the values of all variables**. 

```python
with tf.Session() as sess:
    saver = tf.train.import_meta_graph('/tmp/model.ckpt.meta')
    saver.restore(sess, "/tmp/model.ckpt")
```



### `tf.summary`

We’ve been using matplotlib to visualize our losses and accuracy, which is cool but
unnecessary because **TensorBoard provides us with a great set of tools to visualize our**
**summary statistics during our training**. Some popular statistics to visualize is loss, average loss, accuracy. You can visualize them as scalar plots, histograms, or even images. So we have a new namescope in our graph to hold all the summary ops.

```python
def _create_summaries(self):
    # Step 1: create summaries
	with tf.name_scope("summaries"):
		tf.summary.scalar("loss", self.loss
		tf.summary.scalar("accuracy", self.accuracy) 
		tf.summary.histogram("histogram loss", self.loss)
		# because you have several summaries, we should merge them all 
		# into one op to make it easier to manage
		self.summary_op = tf.summary.merge_all()
```

Because it’s an op, you have to **execute** it with sess.run()

```python
# Step 2: run them, Like everything else in TF, summaries are ops
loss_batch, _, summary = sess.run([model.loss, model.optimizer, model.summary_op],
		feed_dict=feed_dict)
```

Now you’ve obtained the summary, you need to **write the summary to file** using the same FileWriter object we created to visual our graph.

```python
# Step 3: write summaries to file
writer.add_summary(summary, global_step=step)
```

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/TbV8jf.png" alt="TbV8jf" style="zoom:50%;" />



### Control Randomization

- Set random seed at operation level. 

  All random tensors allow you to pass in seed value in their initialization.

```python
my_var = tf.Variable(tf.truncated_normal((-1.0,1.0), stddev=0.1, seed=0))
```

- Note that, session is the thing that keeps track of random state, so each new session will start

  the random state all over again.

```python
c = tf.random_uniform([], -10, 10, seed=2)

with tf.Session() as sess:
	print sess.run(c) # >> 3.57493 
    # Each new session restarts the random state
	print sess.run(c) # >> -5.97319 
	
c = tf.random_uniform([], -10, 10, seed=2)

with tf.Session() as sess:
	print sess.run(c) # >> 3.57493

with tf.Session() as sess:
	print sess.run(c) # >> 3.57493
```

- With operation level random seed, each op keeps its own seed.

```python
c = tf.random_uniform([], -10, 10, seed=2) 
d = tf.random_uniform([], -10, 10, seed=2)

with tf.Session() as sess:
	print sess.run(c) # >> 3.57493 
	print sess.run(d) # >> 3.57493
```

- Graph level seed

  If you don’t care about the randomization for each op inside the graph, but just want to **be able to replicate result on another graph** (so that other people can replicate your results on their own graph), you can use tf.set_random_seed instead. Setting the current TensorFlow random seed affects the current default graph only.

```python
tf.set_random_seed(seed)
```



### Reading Data in TensorFlow

There are **two main ways to load data into a TensorFlow graph**: one is through **feed_dict** that we are familiar with, and another is through **readers** that allow us to read tensors directly from file. There is, of course, the third way which is to load in your data using constants, but you should only use this if you want your graph to be seriously bloated and un-runnable (I made up another word but you know what I mean).

- To see why we need something more than feed_dict, we need to look into how feed_dict works under the hood. ***Feed_dict will first send data from the storage system to the client, and then from client to the worker process***. This will ***cause the data to slow down, especially if the client is on a different machine from the worker process***. 
- TensorFlow has **readers that allow us to load data directly into the worker process**. The improvement will not be noticeable when we aren’t on a **distributed system** or when our dataset is small, but it’s still something worth looking into. TensorFlow has several built in readers to match your reading needs.

Data Readers: Ops that return different values every time you call them (**Think Python’s generator**)

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/D4SfJV.png" alt="D4SfJV" style="zoom:50%;" />

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/gU7oes.png" alt="gU7oes" style="zoom:50%;" />



```python
""" word2vec with NCE loss and code to visualize the embeddings on TensorBoard
"""

from __future__ import absolute_import
from __future__ import division
from __future__ import print_function

import os
os.environ['TF_CPP_MIN_LOG_LEVEL']='2'

import numpy as np
from tensorflow.contrib.tensorboard.plugins import projector
import tensorflow as tf

from process_data import process_data
import utils

VOCAB_SIZE = 50000
BATCH_SIZE = 128
EMBED_SIZE = 128 # dimension of the word embedding vectors
SKIP_WINDOW = 1 # the context window
NUM_SAMPLED = 64    # Number of negative examples to sample.
LEARNING_RATE = 1.0
NUM_TRAIN_STEPS = 100000
WEIGHTS_FLD = 'processed/'
SKIP_STEP = 2000

class SkipGramModel:
    """ Build the graph for word2vec model """
    def __init__(self, vocab_size, embed_size, batch_size, num_sampled, learning_rate):
        self.vocab_size = vocab_size
        self.embed_size = embed_size
        self.batch_size = batch_size
        self.num_sampled = num_sampled
        self.lr = learning_rate
        self.global_step = tf.Variable(0, dtype=tf.int32, trainable=False, name='global_step')

    def _create_placeholders(self):
        """ Step 1: define the placeholders for input and output """
        with tf.name_scope("data"):
            self.center_words = tf.placeholder(tf.int32, shape=[self.batch_size], name='center_words')
            self.target_words = tf.placeholder(tf.int32, shape=[self.batch_size, 1], name='target_words')

    def _create_embedding(self):
        """ Step 2: define weights. In word2vec, it's actually the weights that we care about """
        # Assemble this part of the graph on the CPU. You can change it to GPU if you have GPU
        with tf.device('/cpu:0'):
            with tf.name_scope("embed"):
                self.embed_matrix = tf.Variable(tf.random_uniform([self.vocab_size, 
                                                                    self.embed_size], -1.0, 1.0), 
                                                                    name='embed_matrix')

    def _create_loss(self):
        """ Step 3 + 4: define the model + the loss function """
        with tf.device('/cpu:0'):
            with tf.name_scope("loss"):
                # Step 3: define the inference
                embed = tf.nn.embedding_lookup(self.embed_matrix, self.center_words, name='embed')

                # Step 4: define loss function
                # construct variables for NCE loss
                nce_weight = tf.Variable(tf.truncated_normal([self.vocab_size, self.embed_size],
                                                            stddev=1.0 / (self.embed_size ** 0.5)), 
                                                            name='nce_weight')
                nce_bias = tf.Variable(tf.zeros([VOCAB_SIZE]), name='nce_bias')

                # define loss function to be NCE loss function
                self.loss = tf.reduce_mean(tf.nn.nce_loss(weights=nce_weight, 
                                                    biases=nce_bias, 
                                                    labels=self.target_words, 
                                                    inputs=embed, 
                                                    num_sampled=self.num_sampled, 
                                                    num_classes=self.vocab_size), name='loss')
    def _create_optimizer(self):
        """ Step 5: define optimizer """
        with tf.device('/cpu:0'):
            self.optimizer = tf.train.GradientDescentOptimizer(self.lr).minimize(self.loss, 
                                                              global_step=self.global_step)

    def _create_summaries(self):
        with tf.name_scope("summaries"):
            tf.summary.scalar("loss", self.loss)
            tf.summary.histogram("histogram loss", self.loss)
            # because you have several summaries, we should merge them all
            # into one op to make it easier to manage
            self.summary_op = tf.summary.merge_all()

    def build_graph(self):
        """ Build the graph for our model """
        self._create_placeholders()
        self._create_embedding()
        self._create_loss()
        self._create_optimizer()
        self._create_summaries()

def train_model(model, batch_gen, num_train_steps, weights_fld):
    saver = tf.train.Saver() # defaults to saving all variables - in this case embed_matrix, nce_weight, nce_bias

    initial_step = 0
    utils.make_dir('checkpoints')
    with tf.Session() as sess:
        sess.run(tf.global_variables_initializer())
        ckpt = tf.train.get_checkpoint_state(os.path.dirname('checkpoints/checkpoint'))
        # if that checkpoint exists, restore from checkpoint
        if ckpt and ckpt.model_checkpoint_path:
            saver.restore(sess, ckpt.model_checkpoint_path)

        total_loss = 0.0 # we use this to calculate late average loss in the last SKIP_STEP steps
        writer = tf.summary.FileWriter('improved_graph/lr' + str(LEARNING_RATE), sess.graph)
        initial_step = model.global_step.eval()
        for index in range(initial_step, initial_step + num_train_steps):
            centers, targets = next(batch_gen)
            feed_dict={model.center_words: centers, model.target_words: targets}
            loss_batch, _, summary = sess.run([model.loss, model.optimizer, model.summary_op], 
                                              feed_dict=feed_dict)
            writer.add_summary(summary, global_step=index)
            total_loss += loss_batch
            if (index + 1) % SKIP_STEP == 0:
                print('Average loss at step {}: {:5.1f}'.format(index, total_loss / SKIP_STEP))
                total_loss = 0.0
                saver.save(sess, 'checkpoints/skip-gram', index)
        
        ####################
        # code to visualize the embeddings. uncomment the below to visualize embeddings
        # run "'tensorboard --logdir='processed'" to see the embeddings
        # final_embed_matrix = sess.run(model.embed_matrix)
        
        # # it has to variable. constants don't work here. you can't reuse model.embed_matrix
        # embedding_var = tf.Variable(final_embed_matrix[:1000], name='embedding')
        # sess.run(embedding_var.initializer)

        # config = projector.ProjectorConfig()
        # summary_writer = tf.summary.FileWriter('processed')

        # # add embedding to the config file
        # embedding = config.embeddings.add()
        # embedding.tensor_name = embedding_var.name
        
        # # link this tensor to its metadata file, in this case the first 500 words of vocab
        # embedding.metadata_path = 'processed/vocab_1000.tsv'

        # # saves a configuration file that TensorBoard will read during startup.
        # projector.visualize_embeddings(summary_writer, config)
        # saver_embed = tf.train.Saver([embedding_var])
        # saver_embed.save(sess, 'processed/model3.ckpt', 1)

def main():
    model = SkipGramModel(VOCAB_SIZE, EMBED_SIZE, BATCH_SIZE, NUM_SAMPLED, LEARNING_RATE)
    model.build_graph()
    batch_gen = process_data(VOCAB_SIZE, BATCH_SIZE, SKIP_WINDOW)
    train_model(model, batch_gen, NUM_TRAIN_STEPS, WEIGHTS_FLD)

if __name__ == '__main__':
    main()
```

