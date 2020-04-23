---
title: "TensorFlow重要概念"
subtitle: "TensorFlow：实战Google深度学习框架「03」"
layout: post
author: "echisenyang"
header-style: text
hidden: true
catalog: true
tags:
  - TensorFlow
---



## TensorFlow重要概念

### TensorFlow计算模型：计算图

计算图是 TensorFlow 中最基本的一个概念，TensorFlow 中的所有计算都会被 转化为计算图上的节点。

- **不同计算图上的张量和运算都不会共享**，在计算图 g1 中， 将 v 初始化为 0；在计算图 g2 中， 将 v 初始化为 1 。可以看到当运行不同计算图时，变量 v 的值也是不一样的。 **TensorFlow 中的计算图不仅仅可以用来隔离张量和计算，它还提供了管理张量和计算的机制**。计算图可以通过 tf.Graph.device 函数来指定运行计算的设备。这为 TensorFlow 使用 GPU 提供了机制。

### TensorFlow数据模型：张量

在 TensorFlow 程序中，所有的数据都通过张量的形式来表示。但张量在 TensorFlow 中的实现并不是直接采用数组的形式，**它只是对 TensorFlow 中运算结果的引用**。***在张量中并没有真正保存数字，它保存的是如何得到这些数字的计算过程。还是以向量加法为例，当运行如下代码时，并不会得到加法的结果，而会得到对结果的一个引用。***

![5NHszQ](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/5NHszQ.png)

- 如果不指定类型，TensorFlow会给出默认的类型，比如不带小数点的数会被默认为int32，带小数点的会默认为float32。**因为使用默认类型有可能会导致潜在的类型不匹配问题**，所以一般建议通过指定dtype来明确指出变量或者常量的类型。

张量使用主要可以总结为两大类:

- 第一类用途：是**对中间计算结果的引用**。 当一个计算包含很多中间结果时，使用张量可以**大大提高代码的可读性。**同时，通过张量来存储中间结果可以方便获取中间结果 。

- 第二类用途：当计算图构造完成之后，张量可以用来获得计算结果，也就是得到真实的数字 。可以使用

  tf. Session().run( result）语句得到计算结果。

### TensorFlow运行模型：会话

**会话拥有并管理TensorFlow程序运行时的所有资源**。所有计算完成之后需要关闭会话来帮助系统回收资源，否则就可能出现资源泄漏的问题。

- 为了解决异常退出时资源释放的问题，TensorFlow可以通过Python的上下文管理器来使用会话。

![Qd9wK3](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/Qd9wK3.png)

![jCdsoN](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/jCdsoN.png)

- https://playground.tensorflow.org/

![EeiKM8](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/EeiKM8.png)

### 神经网络参数与TensorFlow 变量

```python
weights= tf.Variable(tf.random_normal([2,3], stddev=2))
# 这段代码调用了 TensorFlow 变量的声明函数 tf.Variable。在变量声明函数中给出了初始化这个变量的方法。 TensorFlow中变量的初始值可以设置成随机数、常数或者是通过其他变量的初始值计算得到。
```

![4jXgcc](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/4jXgcc.png)

![peZ2zr](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/peZ2zr.png)

### 通过TensorFlow训练神经网络模型

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/xDK8rA.png" alt="xDK8rA" style="zoom:50%;" />

- placeholder替代常量

![fccxGi](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/fccxGi.png)

```python
# 模拟batch输入
x = tf.placeholder(tf.float32, shape=(3, 2), name="input")
a = tf.matmul(x, w1)
y = tf.matmul(a, w2)

sess = tf.Session()
#使用tf.global_variables_initializer()来初始化所有的变量
init_op = tf.global_variables_initializer()  
sess.run(init_op)

print(sess.run(y, feed_dict={x: [[0.7,0.9],[0.1,0.4],[0.5,0.8]]})) 
>>> [[ 3.95757794]
 [ 1.15376544]
 [ 3.16749239]]
```

```python
# 完整样例示范
import tensorflow as tf
from numpy.random import RandomState

batch_size = 8
w1= tf.Variable(tf.random_normal([2, 3], stddev=1, seed=1))
w2= tf.Variable(tf.random_normal([3, 1], stddev=1, seed=1))
x = tf.placeholder(tf.float32, shape=(None, 2), name="x-input")
y_= tf.placeholder(tf.float32, shape=(None, 1), name='y-input')

a = tf.matmul(x, w1)
y = tf.matmul(a, w2)
y = tf.sigmoid(y)
cross_entropy = -tf.reduce_mean(y_ * tf.log(tf.clip_by_value(y, 1e-10, 1.0))
                                + (1 - y_) * tf.log(tf.clip_by_value(1 - y, 1e-10, 1.0)))
train_step = tf.train.AdamOptimizer(0.001).minimize(cross_entropy)

rdm = RandomState(1)
X = rdm.rand(128,2)
Y = [[int(x1+x2 < 1)] for (x1, x2) in X]

with tf.Session() as sess:
    init_op = tf.global_variables_initializer()
    sess.run(init_op)
    
    # 输出目前（未经训练）的参数取值。
    print(sess.run(w1))
    print(sess.run(w2))
    print("\n")
    
    # 训练模型。
    STEPS = 5000
    for i in range(STEPS):
        start = (i*batch_size) % 128
        end = (i*batch_size) % 128 + batch_size
        sess.run([train_step, y, y_], feed_dict={x: X[start:end], y_: Y[start:end]})
        if i % 1000 == 0:
            total_cross_entropy = sess.run(cross_entropy, feed_dict={x: X, y_: Y})
            print("After %d training step(s), cross entropy on all data is %g" % (i, total_cross_entropy))
    
    # 输出训练后的参数取值。
    print("\n")
    print(sess.run(w1))
    print(sess.run(w2))
    
>>> [[-0.81131822  1.48459876  0.06532937]
 [-2.4427042   0.0992484   0.59122431]]
[[-0.81131822]
 [ 1.48459876]
 [ 0.06532937]]


After 0 training step(s), cross entropy on all data is 1.89805
After 1000 training step(s), cross entropy on all data is 0.655075
After 2000 training step(s), cross entropy on all data is 0.626172
After 3000 training step(s), cross entropy on all data is 0.615096
After 4000 training step(s), cross entropy on all data is 0.610309


[[ 0.02476984  0.5694868   1.69219422]
 [-2.19773483 -0.23668921  1.11438966]]
[[-0.45544702]
 [ 0.49110931]
 [-0.9811033 ]]
```

