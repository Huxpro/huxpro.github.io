---
title: "Save and Restore a model"
subtitle: "TF EXAMPLES「4.1」"
layout: post
author: "echisenyang"
header-style: text
hidden: true
catalog: true
tags:
  - TensorFlow
  - 输出计划
---



Save and Restore a model with TensorFlow.

### `tf.train.Saver()`

- **恢复部分预训练模型的参数**。

```python
weight=[weights['wc1'],weights['wc2'],weights['wc3a']]
saver = tf.train.Saver(weight)#创建一个saver对象，.values是以列表的形式获取字典值
saver.restore(sess, model_filename)
```

- **手动初始化剩下**的（预训练模型中没有的）参数

```python
var = tf.get_variable(name, shape, initializer=tf.contrib.layers.xavier_initializer())
```

- **想保存全部变量**，所以要重新写一个对象，名字和恢复的那个saver对象不同
  - 这个时候就保存了全部变量，如果你**想保存部分变量，只需要在构造器里传入想要保存的变量的名字就行**

```python
saver_out=tf.train.Saver()
saver_out.save(sess,'file_name')
```

### 实例

```python

model_path = "/tmp/model.ckpt"

# Network Parameters
...
# tf Graph input
...

"""
Create multilayer_perceptron model写的真漂亮

# 'Saver' op to save and restore all the variables
saver = tf.train.Saver() # 申明Saver对象，用于模型参数的恢复与更新
	save_path = saver.save(sess, model_path) # 经过模型训练，参数有所更新，则重写checkpoint
	saver.restore(sess, model_path) # 恢复上一个checkpoint中的参数
"""


# Create model
def multilayer_perceptron(x, weights, biases):
    # Hidden layer with RELU activation
    layer_1 = tf.add(tf.matmul(x, weights['h1']), biases['b1'])
    layer_1 = tf.nn.relu(layer_1)
    # Hidden layer with RELU activation
    layer_2 = tf.add(tf.matmul(layer_1, weights['h2']), biases['b2'])
    layer_2 = tf.nn.relu(layer_2)
    # Output layer with linear activation
    out_layer = tf.matmul(layer_2, weights['out']) + biases['out']
    return out_layer

# Store layers weight & bias
weights = {
    'h1': tf.Variable(tf.random_normal([n_input, n_hidden_1])),
    'h2': tf.Variable(tf.random_normal([n_hidden_1, n_hidden_2])),
    'out': tf.Variable(tf.random_normal([n_hidden_2, n_classes]))
}
biases = {
    'b1': tf.Variable(tf.random_normal([n_hidden_1])),
    'b2': tf.Variable(tf.random_normal([n_hidden_2])),
    'out': tf.Variable(tf.random_normal([n_classes]))
}

# Construct model
pred = multilayer_perceptron(x, weights, biases)

# Define loss and optimizer
...

# Initialize the variables (i.e. assign their default value)
init = tf.global_variables_initializer()

# 'Saver' op to save and restore all the variables
saver = tf.train.Saver()

# Running first session
with tf.Session() as sess:
    # Run the initializer
    sess.run(init)

    # Training cycle
    for epoch in range(3):
		...

    # Test model
    ...
    # Calculate accuracy
    ...

    # Save model weights to disk
    save_path = saver.save(sess, model_path)
    print("Model saved in file: %s" % save_path)

# Running a new session
print("Starting 2nd session...")
with tf.Session() as sess:
    # Initialize variables
    sess.run(init)

    # Restore model weights from previously saved model
    saver.restore(sess, model_path)
    print("Model restored from file: %s" % save_path)

    # Resume training
    for epoch in range(7):
        ...

    # Test model
    ...
```

