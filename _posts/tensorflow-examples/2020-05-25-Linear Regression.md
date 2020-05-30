---
title: "Linear Regression"
subtitle: "TF EXAMPLES「2.1」"
layout: post
author: "echisenyang"
header-style: text
hidden: true
catalog: true
tags:
  - TensorFlow
---



### Implement a Linear Regression with TensorFlow.

- 损失函数 Mean squared error：`tf.reduce_sum(tf.pow(pred-Y, 2))/(2*n_samples)`
- 优化器 Gradient descent：`tf.train.GradientDescentOptimizer(learning_rate).minimize(cost)`

```python
'''
A linear regression learning algorithm example using TensorFlow library.

Author: Aymeric Damien
Project: https://github.com/aymericdamien/TensorFlow-Examples/
'''

from __future__ import print_function

import tensorflow as tf
import numpy
import matplotlib.pyplot as plt
import os
os.environ["CUDA_DEVICE_ORDER"] = "PCI_BUS_ID"
os.environ["CUDA_VISIBLE_DEVICES"] = "2"

rng = numpy.random

# Parameters
learning_rate = 0.01
training_epochs = 1000
display_step = 50

# Training Data
train_X = numpy.asarray([3.3,4.4,5.5,6.71,6.93,4.168,9.779,6.182,7.59,2.167,
                         7.042,10.791,5.313,7.997,5.654,9.27,3.1])
train_Y = numpy.asarray([1.7,2.76,2.09,3.19,1.694,1.573,3.366,2.596,2.53,1.221,
                         2.827,3.465,1.65,2.904,2.42,2.94,1.3])
n_samples = train_X.shape[0]

# tf Graph Input
X = tf.placeholder("float") # 未指定大小
Y = tf.placeholder("float") # 未指定大小

# Set model weights
W = tf.Variable(rng.randn(), name="weight") # 未指定大小
b = tf.Variable(rng.randn(), name="bias") # 未指定大小

# Construct a linear model
pred = tf.add(tf.multiply(X, W), b)

# Mean squared error
cost = tf.reduce_sum(tf.pow(pred-Y, 2))/(2*n_samples)
# Gradient descent
#  Note, minimize() knows to modify W and b because Variable objects are trainable=True by default
optimizer = tf.train.GradientDescentOptimizer(learning_rate).minimize(cost)

# Initialize the variables (i.e. assign their default value)
init = tf.global_variables_initializer()

# Start training
with tf.Session() as sess:

    # Run the initializer
    sess.run(init)

    # Fit all training data
    for epoch in range(training_epochs):
        # 每个epoch内，一次传入一个tuple的数据，采用随机梯度下降法SGD 
        for (x, y) in zip(train_X, train_Y):
            sess.run(optimizer, feed_dict={X: x, Y: y})

        # Display logs per epoch step
        if (epoch+1) % display_step == 0:
            # 每50个epoch，计算一次全量数据的 Mean squared error，并打印此刻的参数 W,b
            c = sess.run(cost, feed_dict={X: train_X, Y:train_Y})
            print("Epoch:", '%04d' % (epoch+1), "cost=", "{:.9f}".format(c), \
                "W=", sess.run(W), "b=", sess.run(b))

    print("Optimization Finished!")
    training_cost = sess.run(cost, feed_dict={X: train_X, Y: train_Y})
    print("Training cost=", training_cost, "W=", sess.run(W), "b=", sess.run(b), '\n')

    # Graphic display
    plt.plot(train_X, train_Y, 'ro', label='Original data')
    plt.plot(train_X, sess.run(W) * train_X + sess.run(b), label='Fitted line')
    plt.legend()
    plt.show()

    # Testing example, as requested (Issue #2)
    test_X = numpy.asarray([6.83, 4.668, 8.9, 7.91, 5.7, 8.7, 3.1, 2.1])
    test_Y = numpy.asarray([1.84, 2.273, 3.2, 2.831, 2.92, 3.24, 1.35, 1.03])

    print("Testing... (Mean square loss Comparison)")
    testing_cost = sess.run(
        tf.reduce_sum(tf.pow(pred - Y, 2)) / (2 * test_X.shape[0]),
        feed_dict={X: test_X, Y: test_Y})  # same function as cost above
    print("Testing cost=", testing_cost)
    print("Absolute mean square loss difference:", abs(
        training_cost - testing_cost))

    plt.plot(test_X, test_Y, 'bo', label='Testing data')
    plt.plot(train_X, sess.run(W) * train_X + sess.run(b), label='Fitted line')
    plt.legend()
    plt.show()
    
>>> Epoch: 0050 cost= 0.148400649 W= 0.39906093 b= -0.2737909
Epoch: 0100 cost= 0.140146628 W= 0.39017144 b= -0.20984046
Epoch: 0150 cost= 0.132845908 W= 0.38181067 b= -0.14969318
Epoch: 0200 cost= 0.126388520 W= 0.37394702 b= -0.09312324
Epoch: 0250 cost= 0.120677024 W= 0.36655116 b= -0.039917763
Epoch: 0300 cost= 0.115625337 W= 0.3595951 b= 0.010123347
Epoch: 0350 cost= 0.111157246 W= 0.35305285 b= 0.057188325
Epoch: 0400 cost= 0.107205383 W= 0.34689957 b= 0.10145406
Epoch: 0450 cost= 0.103710122 W= 0.3411124 b= 0.1430871
Epoch: 0500 cost= 0.100618765 W= 0.3356693 b= 0.182244
Epoch: 0550 cost= 0.097884625 W= 0.3305499 b= 0.21907203
Epoch: 0600 cost= 0.095466442 W= 0.3257351 b= 0.25370994
Epoch: 0650 cost= 0.093327738 W= 0.32120654 b= 0.28628787
Epoch: 0700 cost= 0.091436245 W= 0.31694728 b= 0.31692845
Epoch: 0750 cost= 0.089763500 W= 0.31294155 b= 0.34574556
Epoch: 0800 cost= 0.088284060 W= 0.309174 b= 0.3728495
Epoch: 0850 cost= 0.086975686 W= 0.30563045 b= 0.3983415
Epoch: 0900 cost= 0.085818663 W= 0.3022977 b= 0.42231682
Epoch: 0950 cost= 0.084795423 W= 0.29916325 b= 0.44486612
Epoch: 1000 cost= 0.083890535 W= 0.29621506 b= 0.46607503
Optimization Finished!
Training cost= 0.083890535 W= 0.29621506 b= 0.46607503 

Testing... (Mean square loss Comparison)
Testing cost= 0.077546
Absolute mean square loss difference: 0.0063445345
```

![Gvdlf8](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/Gvdlf8.jpg)

