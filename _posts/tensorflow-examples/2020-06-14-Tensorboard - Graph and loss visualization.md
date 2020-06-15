---
title: "Tensorboard - Graph and loss visualization "
subtitle: "TF EXAMPLES「4.2」"
layout: post
author: "echisenyang"
header-style: text
hidden: true
catalog: true
tags:
  - TensorFlow
  - 输出计划
---



Use Tensorboard to visualize the computation Graph and plot the loss.

## Tensorboard的可视化过程

- 首先肯定是先建立一个graph,你想从这个graph中获取某些数据的信息
- 确定要在graph中的哪些节点放置summary operations以记录信息
  - 使用tf.summary.scalar记录标量
    使用tf.summary.histogram记录数据的直方图
    使用tf.summary.distribution记录数据的分布图
    使用tf.summary.image记录图像数据
- 但是呢，一份程序下来可能有超多这样的summary 节点，要手动一个一个去启动自然是及其繁琐的，因此我们可以使用**tf.summary.merge_all**去将所有summary节点合并成一个节点，只要运行这个节点，就能**产生**所有我们之前设置的**summary data**。
- 使用**tf.summary.FileWriter**将运行后输出的数据都保存到本地磁盘中
- 运行整个程序，并在命令行输入运行tensorboard的指令，之后打开web端可查看可视化的结果

```python
logs_path = '/tmp/tensorflow_logs/example/'

# tf Graph Input
# mnist data image of shape 28*28=784
x = tf.placeholder(tf.float32, [None, 784], name='InputData')
# 0-9 digits recognition => 10 classes
y = tf.placeholder(tf.float32, [None, 10], name='LabelData')

# Set model weights
W = tf.Variable(tf.zeros([784, 10]), name='Weights')
b = tf.Variable(tf.zeros([10]), name='Bias')

# Construct model and encapsulating all ops into scopes, making
# Tensorboard's Graph visualization more convenient
with tf.name_scope('Model'):
    # Model
    pred = tf.nn.softmax(tf.matmul(x, W) + b) # Softmax
with tf.name_scope('Loss'):
    # Minimize error using cross entropy
    cost = tf.reduce_mean(-tf.reduce_sum(y*tf.log(pred), reduction_indices=1))
with tf.name_scope('SGD'):
    # Gradient Descent
    optimizer = tf.train.GradientDescentOptimizer(learning_rate).minimize(cost)
with tf.name_scope('Accuracy'):
    # Accuracy
    acc = tf.equal(tf.argmax(pred, 1), tf.argmax(y, 1))
    acc = tf.reduce_mean(tf.cast(acc, tf.float32))

# Initialize the variables (i.e. assign their default value)
init = tf.global_variables_initializer()

# Create a summary to monitor cost tensor
tf.summary.scalar("loss", cost)
# Create a summary to monitor accuracy tensor
tf.summary.scalar("accuracy", acc)
# Merge all summaries into a single op
merged_summary_op = tf.summary.merge_all()

# Start training
with tf.Session() as sess:

    # Run the initializer
    sess.run(init)

    # op to write logs to Tensorboard
    summary_writer = tf.summary.FileWriter(logs_path, graph=tf.get_default_graph())

    # Training cycle
    for epoch in range(training_epochs):
        ...
            # Run optimization op (backprop), cost op (to get loss value)
            # and summary nodes
            _, c, summary = sess.run([optimizer, cost, merged_summary_op],
                                     feed_dict={x: batch_xs, y: batch_ys})
            # Write logs at every iteration
            summary_writer.add_summary(summary, epoch * total_batch + i)

    print("Run the command line:\n" \
          "--> tensorboard --logdir=/tmp/tensorflow_logs " \
          "\nThen open http://0.0.0.0:6006/ into your web browser")

```

