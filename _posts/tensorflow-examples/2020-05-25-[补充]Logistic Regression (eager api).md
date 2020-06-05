---
title: "Logistic Regression (eager api)"
subtitle: "TF EXAMPLES「2.4」"
layout: post
author: "echisenyang"
header-style: text
hidden: true
catalog: true
tags:
  - TensorFlow
  - 输出计划
---



### 交叉熵损失函数

![B1gRHF](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/B1gRHF.jpg)

![Tensorflow-2](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/Tensorflow-2.jpg)



### Implement a Logistic Regression using TensorFlow's Eager API.

- 损失函数：

```python
def logistic_regression(inputs):
    return tf.matmul(inputs, W) + b

def loss_fn(inference_fn, inputs, labels):
    return tf.reduce_mean(tf.nn.sparse_softmax_cross_entropy_with_logits(
        logits=inference_fn(inputs), labels=labels))

# Compute the batch loss
batch_loss = loss_fn(logistic_regression, x_batch, y_batch)
average_loss += batch_loss
```

- accuracy:

```python
def accuracy_fn(inference_fn, inputs, labels):
    prediction = tf.nn.softmax(inference_fn(inputs))
    correct_pred = tf.equal(tf.argmax(prediction, 1), labels)
    return tf.reduce_mean(tf.cast(correct_pred, tf.float32))

# Compute the batch accuracy
batch_accuracy = accuracy_fn(logistic_regression, x_batch, y_batch)
average_acc += batch_accuracy
```

- 优化器 

```python
# SGD Optimizer
optimizer = tf.train.GradientDescentOptimizer(learning_rate=learning_rate)
# Compute gradients
grad = tfe.implicit_gradients(loss_fn)
# Update the variables following gradients info
optimizer.apply_gradients(grad(logistic_regression, x_batch, y_batch))
```

### [What's the difference between GradientTape, implicit_gradients, gradients_function and implicit_value_and_gradients?](https://stackoverflow.com/questions/50098971/whats-the-difference-between-gradienttape-implicit-gradients-gradients-functi)

![idigml](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/idigml.png)



```python
from __future__ import absolute_import, division, print_function

import tensorflow as tf
import os
os.environ["CUDA_DEVICE_ORDER"] = "PCI_BUS_ID"
os.environ["CUDA_VISIBLE_DEVICES"] = "2"

# Set Eager API
tf.enable_eager_execution()
tfe = tf.contrib.eager

# Import MNIST data
from tensorflow.examples.tutorials.mnist import input_data
mnist = input_data.read_data_sets("/home/jiale/codes/2020gogogo", one_hot=False)

# Parameters
learning_rate = 0.1
batch_size = 128
num_steps = 1000
display_step = 100

dataset = tf.data.Dataset.from_tensor_slices(
    (mnist.train.images, mnist.train.labels))
dataset = dataset.repeat().batch(batch_size).prefetch(batch_size)
dataset_iter = tfe.Iterator(dataset)

# Variables
W = tfe.Variable(tf.zeros([784, 10]), name='weights')
b = tfe.Variable(tf.zeros([10]), name='bias')


# Logistic regression (Wx + b)
def logistic_regression(inputs):
    """
    :param inputs: (128, 784)
    :return: (128, 10)
    """
    return tf.matmul(inputs, W) + b


# Cross-Entropy loss function
def loss_fn(inference_fn, inputs, labels):
    """
    :param inference_fn: (128, 10)
    :param inputs: (128, 784)
    :param labels: (128,)
    :param tf.nn.sparse_softmax_cross_entropy_with_logits(
           logits=inference_fn(inputs), labels=labels): (128,)
    :return: ()
    """
    # Using sparse_softmax cross entropy
    return tf.reduce_mean(tf.nn.sparse_softmax_cross_entropy_with_logits(
        logits=inference_fn(inputs), labels=labels))


# Calculate accuracy
def accuracy_fn(inference_fn, inputs, labels):
    prediction = tf.nn.softmax(inference_fn(inputs))
    correct_pred = tf.equal(tf.argmax(prediction, 1), labels)
    return tf.reduce_mean(tf.cast(correct_pred, tf.float32))


# SGD Optimizer
optimizer = tf.train.GradientDescentOptimizer(learning_rate=learning_rate)
# Compute gradients
grad = tfe.implicit_gradients(loss_fn)

# Training
average_loss = 0.
average_acc = 0.
for step in range(num_steps):

    # Iterate through the dataset
    d = dataset_iter.next()

    # Images
    x_batch = d[0]
    # Labels
    y_batch = tf.cast(d[1], dtype=tf.int64)

    # Compute the batch loss
    batch_loss = loss_fn(logistic_regression, x_batch, y_batch)
    average_loss += batch_loss
    # Compute the batch accuracy
    batch_accuracy = accuracy_fn(logistic_regression, x_batch, y_batch)
    average_acc += batch_accuracy

    if step == 0:
        # Display the initial cost, before optimizing
        print("Initial loss= {:.9f}".format(average_loss))

    # Update the variables following gradients info
    optimizer.apply_gradients(grad(logistic_regression, x_batch, y_batch))

    # Display info
    if (step + 1) % display_step == 0 or step == 0:
        if step > 0:
            average_loss /= display_step
            average_acc /= display_step
        print("Step:", '%04d' % (step + 1), " loss=",
              "{:.9f}".format(average_loss), " accuracy=",
              "{:.4f}".format(average_acc))
        average_loss = 0.
        average_acc = 0.

# Evaluate model on the test image set
testX = mnist.test.images
testY = mnist.test.labels

test_acc = accuracy_fn(logistic_regression, testX, testY)
print("Testset Accuracy: {:.4f}".format(test_acc))
```