---
title: "TensorBoard可视化"
subtitle: "TensorFlow：实战Google深度学习框架「11」"
layout: post
author: "echisenyang"
header-style: text
hidden: true
catalog: true
tags:
  - TensorFlow
---



为了更好地管理、调试和优化神经网络的训练过程，TensorFlow提供了一个可视化工具TensorBoard。**TensorBoard可以有效地展示TensorFlow在运行过程中的计算图、各种指标随着时间的变化趋势以及训练中使用到的图像等信息**。

### TensorBoard简介

TensorBoard是TensorFlow的可视化工具，它可以**通过TensorFlow程序运行过程中输出的日志文件可视化TensorFlow程序的运行状态**。TensorBoard和TensorFlow程序跑在不同的进程中，TensorBoard会自动读取最新的TensorFlow日志文件，并呈现当前TensorFlow程序运行的最新状态。

```python
tensorboard --logdir=tf_log_path --host="192.168.100.199"
```

### TensorFlow计算图可视化

#### 命名空间与 TensorBoard 图上节点

当神经网络模型的结构更加复杂、运算更多时，其所对应的TensorFlow计算图会复杂很多，那么**没有经过整理得到的可视化效果图**可能就无法很好地帮助理解神经网络模型的结构了。这些节点的排列可能会比较乱，这导致**主要的计算节点可能被埋没在大量信息量不大的节点中**，使得可视化得到的效果图很难理解。

```python
# 1. 不同的命名空间。
import tensorflow as tf
with tf.variable_scope("foo"):
    # 在命名空间 foo 下获取变量"bar", 于是得到的变量名称为"foo/bar".
    a = tf.get_variable("bar", [1])
    print a.name
	>>> foo/bar:0
with tf.variable_scope("bar"):
    b = tf.get_variable("bar", [1])
    print b.name
	>>> bar/bar:0
    
# 2. tf.Variable和tf.get_variable的区别
with tf.name_scope("a"):
    # 使用tf.Variable函数生成变量会受tf.name_scope影响，于是这个变量的名称为"a/Variable"
    a = tf.Variable([1])
    print a.name
    >>> a/Variable:0
    # tf.get_variable函数不受tf.name_scope函数的影响，于是变量并不在a这个命名空间中。
    a = tf.get_variable("b", [1])
    print a.name
	>>> b:0
    
# 3. TensorBoard可以根据命名空间来整理可视化效果图上的节点
with tf.name_scope("input1"):
    input1 = tf.constant([1.0, 2.0, 3.0], name="input2")
with tf.name_scope("input2"):
    input2 = tf.Variable(tf.random_uniform([3]), name="input2")
output = tf.add_n([input1, input2], name="add")

writer = tf.summary.FileWriter("log/simple_example.log", tf.get_default_graph())
writer.close()
```

- 改进后的 MNIST 样例程序 TensorFlow 计算图可视化效果图

  - input节点代表了训练神经网络需要的输入数据，这些输入数据会提供给神经网络的第一层layer1，然后神经网络第一层layer1的结果会被传到第二层layer2，经过layer2的计算得到**前向传播的结果**。
  - loss_function节点表示计算损失函数的过程，**这个过程既依赖于前向传播的结果来计算交叉熵** (layer2到loss_function的边)，**又依赖于每一层中所定义的变量来计算L2正则化损失** (layer1和layer2到loss_function的边)。**loss_function的计算结果会提供给神经网络的优化过程**，也就是图中train_step所代表的节点。
  - TensorBoard 可视化效果图的边上还标注了张量的维度信息。效果图上**边的粗细表示的是两 个节点之间传输的标量维度的总大小**，而不是传输的标量个数。比如 layer2 和位ain_step 之间虽然传输了 6 个张量，但其维度都比较小 ，所以这条边比layer1和moving_average之间的边（只传输了4个张量）还要细。
  - **当张量的维度无法确定时，TensorBoard会使用最细的边来表示**。比如layer1与layer2之间的边。

- 节点之间有两种不同的边

  - 一种边是通过**实线**表示的，这种边**刻画了数据传输，边上箭头方向表达了数据传输的方向**。比如 layerl 和 layer2 之间的边表示 了 layerl 的输出将会作为 layer2 的输入。
  - 另外一种边是通过**虚线**表示的，比如moving_average和train_step之间的边。**虚边表达了计算之间的依赖关系**，比如在程序中，通过tf.control_dependencies函数指定了更新参数滑动平均值的操作和通过反向传播更新变量的操作需要同时进行，于是moving_average与train_step之间存在一条虚边。

- TensorBoard 将 TensorFlow 计算图分成了**主图 (Main Graph) 和辅助图 (Auxiliary nodes)两个部分**来呈现。**TensorBoard会自动将连接比较多的节点放在辅助图中，使得主图的结构更加清晰**。

![FeQB53](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/FeQB53.png)

#### 节点信息

除了展示TensorFlow计算图的结构，TensorBoard还可以展示TensorFlow计算图上每个节点的基本信息以及运行时消耗的时间和空间。

```python
writer = tf.summary.FileWriter("log", tf.get_default_graph())
    
    # 训练模型。
    with tf.Session() as sess:
        tf.global_variables_initializer().run()
        for i in range(TRAINING_STEPS):
            xs, ys = mnist.train.next_batch(BATCH_SIZE)

            # 每 1000 轮记录一次运行状态
            if i % 1000 == 0:
                # 配置运行时需要记录的信息。
                run_options = tf.RunOptions(trace_level=tf.RunOptions.FULL_TRACE)
                # 运行时记录运行信息的proto。
                run_metadata = tf.RunMetadata()
                # 将配置信息和记录运行信息的 proto 传入运行的过程，
                # 从而记录运行时每一个节点的时间、空间开销信息。
                _, loss_value, step = sess.run(
                    [train_op, loss, global_step], feed_dict={x: xs, y_: ys},
                    options=run_options, run_metadata=run_metadata)
                # 将节点在运行时的信息写入日志文件
                writer.add_run_metadata(run_metadata=run_metadata, tag=("tag%d" % i), global_step=i)
                print("After %d training step(s), loss on training batch is %g." % (step, loss_value))
            else:
                _, loss_value, step = sess.run([train_op, loss, global_step], feed_dict={x: xs, y_: ys})
                
    writer.close()
```

![2vXgNt](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/2vXgNt.png)

![jk3om7](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/jk3om7.png)

![zU77h3](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/zU77h3.png)

- 通过对每一个计算节点消耗时间的可视化，**可以很容易地找到TensorFlow计算图上的性能瓶颈**，这大大方便了算法优化的工作。在性能调优时，一般会选择迭代轮数较大时的数据（比如图11-9中第10000轮迭代时的数据）作为不同计算节点时间／空间消耗的标准，因为这样可以减少TensorFlow初始化对性能的影响。

- 空心的小椭圆对应了TensorFlow计算图上的一个计算节点，而一个矩形对应了计算图上的一个命名空间

### 监控指标可视化

除了GRAPHS以外，TensorBoard界面中还提供了SCALARS、IMAGES、AUDIO、DISTRIBUTIONS、HISTOGRAMS和TEXT六个界面来可视化其他的监控指标。

![96RwtE](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/96RwtE.png)

### 高维向量可视化

![mCDGtK](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/mCDGtK.png)

