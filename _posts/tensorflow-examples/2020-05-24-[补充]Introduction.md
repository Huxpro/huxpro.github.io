---
title: "Introduction"
subtitle: "TF EXAMPLES「1」"
layout: post
author: "echisenyang"
header-style: text
hidden: true
catalog: true
tags:
  - TensorFlow
---



### **Hello World**

Very simple example to learn how to print "hello world" using TensorFlow.

```python
from __future__ import print_function

import tensorflow as tf

# Simple hello world using TensorFlow

# Create a Constant op
# The op is added as a node to the default graph.
#
# The value returned by the constructor represents the output
# of the Constant op.
hello = tf.constant('Hello, TensorFlow!')

# Start tf session
sess = tf.Session()

# Run the op
print(sess.run(hello))
```

### **Basic Operations**

A simple example that cover TensorFlow basic operations.

- #### **Ops constructor**

"**Ops constructor**" refers to functions creating new instances of objects being Ops. For example `tf.constant` constructs a new op, but actualy returns **a reference to Tensor being a result of this operation**, namely instance of `tensorflow.python.framework.ops.Tensor`, **but it is not a constructor in the OOP sense**.



![6OFFSC](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/6OFFSC.jpg)

- #### tensor **定义**
  
  - A Tensor is **a symbolic handle** to one of the **outputs of an Operation**. It does not hold the values of that operation’s output, but instead provides a means of computing those values in a TensorFlow tf.Session
  - 在 TensorFlow 中，所有在节点之间传递的`数据`都为 Tensor 对象(可以看作 `n 维的数组`)，常用图像数据的表示形式 为：`batch*height*width*channel`
- #### tensor **name**
  
  - eg: `w1 = tf.Variable(tf.random_normal([2, 3], stddev=1), name='weight1')`, 这里面定义了变量 w1，为什么又给了它一个 name='weight1'？ **这个 tensor 中的 name 属性和其变量名有什么区别呢？**为什么要这样做呢？
    答：**w1是代码中的变量名（标识符）**，代码中都用这个。**name='weight1'这个是参数名(权重)**，在**参数存储或读取的时候使用**，方便在其它环境(C++等)中部署。还有个作用是**跟 scope 配合使用**的，用于**参数共享** 
  - Note that： tf.Tensor objects are implicitly named after the tf.Operation that produces the tensor as output. A tensor name has the form **<OP_NAME>:\<i\>** where:
    **<OP_NAME> ：节点的名称**
    **\<i\> ：表示当前张量来自节点的第几个输出**

```python
from __future__ import print_function

import tensorflow as tf

# Basic constant operations
a = tf.constant(2)
b = tf.constant(3)

# Launch the default graph.
with tf.Session() as sess:
    print("a=2, b=3")
    print("Addition with constants: %i" % sess.run(a+b))
    print("Multiplication with constants: %i" % sess.run(a*b))
    >>> 
    a: 2 b: 3
    Addition with constants: 5
    Multiplication with constants: 6
    >>> a
    Tensor("Const:0", shape=(), dtype=int32)
    >>> b
    Tensor("Const_1:0", shape=(), dtype=int32)
    >>> sess.run(a)
    2

    
a = tf.placeholder(tf.int16)
b = tf.placeholder(tf.int16)

# Define some operations
add = tf.add(a, b)
mul = tf.multiply(a, b)

# Launch the default graph.
with tf.Session() as sess:
    # Run every operation with variable input
    print("Addition with variables: %i" % sess.run(add, feed_dict={a: 2, b: 3}))
    print("Multiplication with variables: %i" % sess.run(mul, feed_dict={a: 2, b: 3}))
    >>>
    Addition with variables: 5
	Multiplication with variables: 6
	>>> add
    Tensor("Add_2:0", dtype=int16)
    >>> a
    Tensor("Placeholder:0", dtype=int16)
    

# ----------------
# More in details:
# Matrix Multiplication from TensorFlow official tutorial

# Create a Constant op that produces a 1x2 matrix.  The op is
# added as a node to the default graph.
#
# The value returned by the constructor represents the output
# of the Constant op.
matrix1 = tf.constant([[3., 3.]])
matrix2 = tf.constant([[2.],[2.]])

product = tf.matmul(matrix1, matrix2)

# To run the matmul op we call the session 'run()' method, passing 'product'
# which represents the output of the matmul op.  This indicates to the call
# that we want to get the output of the matmul op back.
#
# All inputs needed by the op are run automatically by the session.  They
# typically are run in parallel.
#
# The call 'run(product)' thus causes the execution of threes ops in the
# graph: the two constants and matmul.
with tf.Session() as sess:
    result = sess.run(product)
    print(result)
    # ==> [[ 12.]]

```

### Eager API

- #### What is TensorFlow's Eager API ?

*Eager execution is an imperative, define-by-run interface where operations are
executed immediately as they are called from Python. This makes it easier to
get started with TensorFlow, and can make research and development more
intuitive. A vast majority of the TensorFlow API remains the same whether eager
execution is enabled or not. As a result, the exact same code that constructs
TensorFlow graphs (e.g. using the layers API) can be executed imperatively
by using eager execution. Conversely, most models written with Eager enabled
can be converted to a graph that can be further optimized and/or extracted
for deployment in production without changing code. - Rajat Monga*



- #### TensorFlow Eager 模式

PyTorch 的动态图一直是 TensorFlow 用户求之不得的功能，谷歌也一直试图在 TensorFlow 中实现类似的功能。最近，Google Brain 团队发布了 Eager Execution，一个由运行定义的新接口，让 TensorFlow 开发变得简单许多。

**它是一个命令式、由运行定义的接口，一旦从 Python 被调用，其操作立即被执行。**这使得入门 TensorFlow 变的更简单，也使研发更直观。

```python
# 启动 Eager Execution
import tensorflow.contrib.eager as tfe
tfe.enable_eager_execution()

# Define constant tensors
print("Define constant tensors")
a = tf.constant(2)
print("a = %i" % a)
b = tf.constant(3)
print("b = %i" % b)
>>> 
Define constant tensors
a = 2
b = 3

# Run the operation without the need for tf.Session
print("Running operations, without tf.Session")
c = a + b
print("a + b = %i" % c)
>>> 
Running operations, without tf.Session
a + b = 5
```

