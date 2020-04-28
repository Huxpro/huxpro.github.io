---
title: "Linear and Logistic Regression"
subtitle: "CS 20SI「03」"
layout: post
author: "echisenyang"
header-style: text
hidden: true
catalog: true
tags:
  - 笔记
  - CS20SI
  - TensorFlow
---



## Linear and Logistic Regression

本章概要

1. Review
2. Linear regression in TensorFlow 
3. Optimizers 
4. Logistic regression on MNIST 
5. Loss functions



## Basic Models in TensorFlow

### Review

- Computation graph

  **TensorFlow separates definition of computations from their execution**

  - Phase 1: assemble a graph 

  - Phase 2: use a session to execute operations in the graph.

- tf.constant and tf.Variable
  - Constant values are stored in the graph definition 
  - Sessions allocate memory to store variable values

- tf.placeholder and feed_dict
  - Feed values into placeholders by dictionary (feed_dict) 
  - You can feed values in variables too
- Avoid lazy loading
  - Separate the assembling of graph and executing ops
  - Use Python attribute to ensure a function is only loaded the first time it’s called

### Linear Regression

Phase 1: Assemble our graph

- Step 1: Read in data
- Step 2: Create placeholders for inputs and labels
- Step 3: Create weight and bias
- Step 4: Build model to predict Y
- Step 5: Specify loss function
- Step 6: Create optimizer

Phase 2: Train our model

- See your model in TensorBoard
- Plot the results with matplotlib

```python
""" Simple linear regression example in TensorFlow
This program tries to predict the number of thefts from 
the number of fire in the city of Chicago
"""
import os
os.environ['TF_CPP_MIN_LOG_LEVEL']='2'

import numpy as np
import matplotlib.pyplot as plt
import tensorflow as tf
import xlrd

import utils

DATA_FILE = 'data/fire_theft.xls'

# Step 1: read in data from the .xls file
book = xlrd.open_workbook(DATA_FILE, encoding_override="utf-8")
sheet = book.sheet_by_index(0)
data = np.asarray([sheet.row_values(i) for i in range(1, sheet.nrows)])
n_samples = sheet.nrows - 1

>>> 
X Y
6.2	29
9.5	44
10.5 36


# Step 2: create placeholders for input X (number of fire) and label Y (number of theft)
X = tf.placeholder(tf.float32, name='X')
Y = tf.placeholder(tf.float32, name='Y')

# Step 3: create weight and bias, initialized to 0
w = tf.Variable(0.0, name='weights')
b = tf.Variable(0.0, name='bias')

# Step 4: build model to predict Y
Y_predicted = X * w + b 

# Step 5: use the square error as the loss function
loss = tf.square(Y - Y_predicted, name='loss')
# loss = utils.huber_loss(Y, Y_predicted)

# Step 6: using gradient descent with learning rate of 0.01 to minimize loss
optimizer = tf.train.GradientDescentOptimizer(learning_rate=0.001).minimize(loss)

with tf.Session() as sess:
	# Step 7: initialize the necessary variables, in this case, w and b
	sess.run(tf.global_variables_initializer()) 
	
	writer = tf.summary.FileWriter('./graphs/linear_reg', sess.graph)
	
	# Step 8: train the model
	for i in range(50): # train the model 100 epochs
		total_loss = 0
		for x, y in data:
			# Session runs train_op and fetch values of loss
			_, l = sess.run([optimizer, loss], feed_dict={X: x, Y:y}) 
			total_loss += l
		print('Epoch {0}: {1}'.format(i, total_loss/n_samples))

	# close the writer when you're done using it
	writer.close() 
	
	# Step 9: output the values of w and b
	w, b = sess.run([w, b]) 

# plot the results
X, Y = data.T[0], data.T[1]
plt.plot(X, Y, 'bo', label='Real data')
plt.plot(X, X * w + b, 'r', label='Predicted data')
plt.legend()
plt.show()
```

![LtCkNQ](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/LtCkNQ.png)

**How does TensorFlow know what variables to update?**

```python
optimizer = tf.train.GradientDescentOptimizer(learning_rate=0.001).minimize(loss) 
_, l = sess.run([optimizer, loss], feed_dict={X: x, Y:y})

# Session looks at all trainable variables that loss depends on and update them

# Trainable variables
tf.Variable(initial_value=None, trainable=True, collections=None, validate_shape=True, caching_device=None, name=None, variable_def=None, dtype=None, expected_shape=None, import_scope=None)
```

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/hpnUgz.png" alt="hpnUgz" style="zoom:50%;" />

**List of optimizers in TF**

```python
tf.train.GradientDescentOptimizer 
tf.train.AdagradOptimizer 
tf.train.MomentumOptimizer 
tf.train.AdamOptimizer 
tf.train.ProximalGradientDescentOptimizer 
tf.train.ProximalAdagradOptimizer 
tf.train.RMSPropOptimizer
```

![gli8li](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/gli8li.png)

```python
def huber_loss(labels, predictions, delta=1.0):

	residual = tf.abs(predictions - labels) 
	condition = tf.less(residual, delta) 
	small_res = 0.5 * tf.square(residual) 
	large_res = delta * residual - 0.5 * tf.square(delta) 
	return tf.select(condition, small_res, large_res)
```

### Logistic Regression

```python
""" Simple logistic regression model to solve OCR task 
with MNIST in TensorFlow
MNIST dataset: yann.lecun.com/exdb/mnist/
"""
import os
os.environ['TF_CPP_MIN_LOG_LEVEL']='2'

import numpy as np
import tensorflow as tf
from tensorflow.examples.tutorials.mnist import input_data
import time

# Define paramaters for the model
learning_rate = 0.01
batch_size = 128
n_epochs = 30

# Step 1: Read in data
# using TF Learn's built in function to load MNIST data to the folder data/mnist
mnist = input_data.read_data_sets('/data/mnist', one_hot=True) 

# Step 2: create placeholders for features and labels
# each image in the MNIST data is of shape 28*28 = 784
# therefore, each image is represented with a 1x784 tensor
# there are 10 classes for each image, corresponding to digits 0 - 9. 
# each lable is one hot vector.
X = tf.placeholder(tf.float32, [batch_size, 784], name='X_placeholder') 
Y = tf.placeholder(tf.int32, [batch_size, 10], name='Y_placeholder')

# Step 3: create weights and bias
# w is initialized to random variables with mean of 0, stddev of 0.01
# b is initialized to 0
# shape of w depends on the dimension of X and Y so that Y = tf.matmul(X, w)
# shape of b depends on Y
w = tf.Variable(tf.random_normal(shape=[784, 10], stddev=0.01), name='weights')
b = tf.Variable(tf.zeros([1, 10]), name="bias")

# Step 4: build model
# the model that returns the logits.
# this logits will be later passed through softmax layer
logits = tf.matmul(X, w) + b 

# Step 5: define loss function
# use cross entropy of softmax of logits as the loss function
entropy = tf.nn.softmax_cross_entropy_with_logits(logits=logits, labels=Y, name='loss')
loss = tf.reduce_mean(entropy) # computes the mean over all the examples in the batch

# Step 6: define training op
# using gradient descent with learning rate of 0.01 to minimize loss
optimizer = tf.train.AdamOptimizer(learning_rate).minimize(loss)

with tf.Session() as sess:
	# to visualize using TensorBoard
	writer = tf.summary.FileWriter('./graphs/logistic_reg', sess.graph)

	start_time = time.time()
	sess.run(tf.global_variables_initializer())	
	n_batches = int(mnist.train.num_examples/batch_size)
	for i in range(n_epochs): # train the model n_epochs times
		total_loss = 0

		for _ in range(n_batches):
			X_batch, Y_batch = mnist.train.next_batch(batch_size)
			_, loss_batch = sess.run([optimizer, loss], feed_dict={X: X_batch, Y:Y_batch}) 
			total_loss += loss_batch
		print('Average loss epoch {0}: {1}'.format(i, total_loss/n_batches))

	print('Total time: {0} seconds'.format(time.time() - start_time))

	print('Optimization Finished!') # should be around 0.35 after 25 epochs

	# test the model
	
	preds = tf.nn.softmax(logits)
	correct_preds = tf.equal(tf.argmax(preds, 1), tf.argmax(Y, 1))
	accuracy = tf.reduce_sum(tf.cast(correct_preds, tf.float32)) # need numpy.count_nonzero(boolarr) :(
	
	n_batches = int(mnist.test.num_examples/batch_size)
	total_correct_preds = 0
	
	for i in range(n_batches):
		X_batch, Y_batch = mnist.test.next_batch(batch_size)
		accuracy_batch = sess.run([accuracy], feed_dict={X: X_batch, Y:Y_batch}) 
		total_correct_preds += accuracy_batch	
	
	print('Accuracy {0}'.format(total_correct_preds/mnist.test.num_examples))

	writer.close()
```

