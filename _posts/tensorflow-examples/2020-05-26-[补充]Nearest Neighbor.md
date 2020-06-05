---
title: "Nearest Neighbor"
subtitle: "TF EXAMPLES「2.5」"
layout: post
author: "echisenyang"
header-style: text
hidden: true
catalog: true
tags:
  - TensorFlow
  - 输出计划
---



### Implement Nearest Neighbor algorithm with TensorFlow.

- 没有构造kd树，直接用numpy的高效运算特性找出最近邻，把训练集视为模型，直接评估测试集（看训练集预测的结果是否和测试集的真实标签相同）
- 关键函数

```
distance = tf.reduce_sum(tf.abs(tf.add(xtr, tf.negative(xte))), reduction_indices=1)
pred = tf.arg_min(distance, 0)
```

![Tensorflow-3](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/Tensorflow-3.jpg)

```python
from __future__ import print_function

import numpy as np
import tensorflow as tf
import os
os.environ["CUDA_DEVICE_ORDER"] = "PCI_BUS_ID"
os.environ["CUDA_VISIBLE_DEVICES"] = "0"

# Import MNIST data
from tensorflow.examples.tutorials.mnist import input_data
mnist = input_data.read_data_sets("/home/jiale/codes/2020gogogo", one_hot=True)

# In this example, we limit mnist data
Xtr, Ytr = mnist.train.next_batch(5000) #5000 for training (nn candidates)
Xte, Yte = mnist.test.next_batch(200) #200 for testing

# tf Graph Input
xtr = tf.placeholder("float", [None, 784])
xte = tf.placeholder("float", [784])

# Nearest Neighbor calculation using L1 Distance
    # Calculate L1 Distance
    # 计算 xtr 中所有点到 xte 这一个点的 L1 Distance，保留batch维度（axis=0）的信息
distance = tf.reduce_sum(tf.abs(tf.add(xtr, tf.negative(xte))), reduction_indices=1)
# Prediction: Get min distance index (Nearest neighbor)
	# 计算所有 batch维度的最小值，即在 xte 中找到与 xte 这一个点距离最近的那个点
pred = tf.arg_min(distance, 0)

accuracy = 0.

# Initialize the variables (i.e. assign their default value)
init = tf.global_variables_initializer()

# Start training
with tf.Session() as sess:

    # Run the initializer
    sess.run(init)

    # loop over test data
    for i in range(len(Xte)):
        # Get nearest neighbor
        nn_index = sess.run(pred, feed_dict={xtr: Xtr, xte: Xte[i, :]})
        # Get nearest neighbor class label and compare it to its true label
        print("Test", i, "Prediction:", np.argmax(Ytr[nn_index]), \
            "True Class:", np.argmax(Yte[i]))
        # Calculate accuracy
        if np.argmax(Ytr[nn_index]) == np.argmax(Yte[i]):
            accuracy += 1./len(Xte)
    print("Done!")
    print("Accuracy:", accuracy)
```

