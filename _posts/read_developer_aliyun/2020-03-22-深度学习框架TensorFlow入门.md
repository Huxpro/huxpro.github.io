---
title: "「人工智能学习路线」4"
subtitle: "TensorFlow框架及常用库"
layout: post
author: "echisenyang"
header-style: text
hidden: true
tags:
  - 笔记
  - 人工智能学习路线
---



### 1.深度学习与机器学习的区别

- 机器学习需要先经过人工特征提取，再经过分类器；而深度学习网络具有自动提取特征的功能

- 但是深度学习需要大量的训练数据与大量的算力
- 算法方面用了深度神经网络

### 2.深度学习框架

- 最常用的是tensorflow与pytorch
- tensorboard可视化，方便调试
- cpu综合能力强，更适合做sequentail任务，gpu核芯树多，更适合做parallel任务

### 3.tensorflow结构

> 开启会话的目的：看到具体的值

- tensorflow有两个阶段：构建图阶段与操作图阶段

  - **构建图阶段**：数据与操作的步骤被描述成了一个图

    怎么理解：图是定义了数据和操作的一个步骤，在开启会话前都算图

  - **执行阶段**：使用会话执行构建好的图中的操作

    怎么理解：构建图阶段只是做了定义，但是还未真正执行，要想实际 的运行起来，我们需要把数据与操作加载到内存中，去掉用具体的资源，去运行我们的数据与操作，这就是开启会话的作用

  - **图**：tensorflow将计算表示为指令之间的依赖关系的一种表示法，可以理解为一个流程图，定义了数据与操作，但是还是静态的

  - **会话**：tensorflow跨一个或者多个本地或者远程设备运行数据流图的机制，调用各方资源将之前定义好的数据与操作运行起来

  - **张量Tensor**：tensorflow中的基本数据对象（用张量定义数据）

  - **节点OP** ：提供图中执行的操作（用节点定义操作）

> **数据流图**：


![](http://www.tensorfly.cn/images/tensors_flowing.gif)

```python
def tensorflow_add_demo():
		#构建图：定义数据与操作
    a_t=tf.constant(1)
    b_t=tf.constant(2)
    c_t=a_t+b_t
    
    #执行图：用会话运行数据与操作
    with tf.Session() as sess:
        c_t_value=sess.run(c_t)
    print("tensorflow结果c_t_value：\n",c_t_value)
```

### 4.图的介绍

> **什么是图结构？**

- 图包含了一组tf.operation代表的**计算单元对象**和tf.tensor代表的**计算单元之间流动的数据** （就是数据tensor对象+操作operation对象）

> **图相关的操作**

- 默认图（在一开始，如果我们不自己创建图，则数据和操作都会定义在默认图中）

  - 查看默认图的方法

    1.调用方法 `tf.get_default_graph()` 

    2.查看属性 `.graph` op与session都含有图的属性

```python
  def graph_demo1():
      
      a_t=tf.constant(1)
      b_t=tf.constant(2)
      c_t=a_t+b_t
      
      # 查看默认图
      ## 方法一：调用函数
      default_g = tf.compat.v1.get_default_graph()
      print("调用函数查看默认图 default_g \n", default_g)
      
      ## 方法二：调用属性
      print("调用属性查看默认图 a_t \n", a_t.graph)
      print("调用属性查看默认图 b_t \n", b_t.graph)
      print("调用属性查看默认图 c_t \n", c_t.graph)
      
      with tf.compat.v1.Session() as sess:
          c_t_value=sess.run(c_t)
          print("tensorflow结果c_t_value：\n",c_t_value)
          print("调用属性查看默认图 sess \n", sess.graph)
```

- 创建图

  - 用 `new_g = tf.Graph()` 自定义创建图，new_g 保存实例化好的图

  - 如何在这张图里定义数据与操作？

    使用 `tf.Graph.as_default()` 构成一个上下文管理器，在上下文管理器内部定义数据与操作，这样数据与操作就被绑在我们自己定义的图中

```python
    with new_g.as_default():
    		#定义数据与操作
```
```python
    def graph_demo2():
        
        # 在自定义的图中定义数据与操作
        new_g = tf.Graph()
        with new_g.as_default():
            a_t=tf.constant(1)
            b_t=tf.constant(2)
            c_t=a_t+b_t
            print("自定义图中的 c_t \n",c_t)
        
        with tf.compat.v1.Session(graph=new_g) as sess:
            c_t_value=sess.run(c_t)
            print("tensorflow结果c_t_value：\n",c_t_value)
            print("调用属性查看自定义的图 sess \n", sess.graph)
```

### 5. Tensorboard的介绍：可视化学习
> **step1：数据序列化-events文件** 

- `tf.summary.FileWriter(logdir,graph=sess.graph)` Tensorboard通过读取tensorflow的事件文件来运行，需要将数据生成一个序列化的summary protobuf对象。

> step2：启动 Tensorboard

- `tensorboard --logdir="path"`


### 6.Operation介绍

> 数据：Tensor对象

> 操作：Operation对象-Op

|      类型      |                      实例                      |
| :------------: | :--------------------------------------------: |
|    标量运算    |   add/sub/mul/div/exp/log/greater/less/equal   |
|    向量运算    | concat/slice/splot/constant/rank/shape/shuffle |
|    矩阵运算    |     matmul/matrixinverse/matrixdateminant      |
|  带状态的运算  |            variable/assign/assigned            |
|  神经网络组件  |   softmax/sigmoid/relu/convolution/max_pool    |
|   存储，恢复   |                  save/restore                  |
| 队列及同步运算 |   enqueue/dequeue/mutexacquire/mutexrelease    |
|     控制流     |     merge/switch/enter/leave/nextileration     |

- 什么是操作函数？什么是操作对象

  - 操作函数在运行的过程中会产生一个操作对象

    操作函数 `tf.constant(Tensor对象)` 会输出一个Const类型的Tensor对象

  - 一个操作对象（Operation）是tensorflow图中的一个节点，可以接收0个或者多个输入Tensor，并且可以输出0个或者多个Tensor，Operation对象是通过op构造函数（如tf.matmul()）创建的

- 指令名称

  - 一张图一个命名空间，指令名称是唯一的，如果有重复会加 _1 等区分
  - `<OP_NAME>`是生成该张量的指令名称
  - `<i>`是一个整数，表示该张量在指令的输出中的索引
  - 指令名称可以修改 `tf.constant(42.0,name="Answer")` 

### 7.会话

> 一个运行的tensorflow operation类，**会话包含以下两种开启方式**：

- `tf.Session()` 用于完整的程序当中，用`sess.run()`查看变量值
- `tf.InteractiveSession()` 用于交互式上下文，直接用`.eval()`查看值，若不开启`tf.InteractiveSession()`则只能在`tf.Session()` 内部调用`.eval()`查看值

> 会话掌握资源，用完会话需要回收资源，所以使用上下文管理器方便管理

> **初始化对象时的参数**

- `__init__(target="",graph=None,config=None)`
  - `graph=None` 使用默认图，否则传入自定义图
  - `target=None` 参数留空，会话将仅使用本地计算机的资源，可以指定服务器的地址来访问该服务器控制的计算机上的所有设备
  - `config` 可以用来打印设备信息，查看变量都在哪个设备上

> **会话的**`run()`

- `run(fetches,feed_dict=None,option=None,run_metadata=None)`
  - fetches：单一的operation，或者列表，元组
  - feed_dict：与tf.placeholder搭配使用

> **feed操作**

- InvalidArgumentError: You must feed a value for placeholder tensor 'Placeholder_3' with dtype float

```python
def session_demo():
    a_ph = tf.placeholder(tf.float32)
    b_ph = tf.placeholder(tf.float32)
    c_ph = tf.add(a_ph,b_ph)
    
    with tf.Session(config=tf.ConfigProto(allow_soft_placement=True,
                                         log_device_placement=True)) as sess:
        c_ph_value=sess.run(c_ph,feed_dict={a_ph:8.88,b_ph:8.88})
        print("c_ph_value \n", c_ph_value)
```

### 8.张量的属性与生成

> 张量在计算中如何存储？

- 标量：一个数字 1 						（0阶张量）
- 向量：一维数组 [1,2,3] 	           （1阶张量）
- 矩阵：二维数组 [[1,2,3],[4,5,6]] （2阶张量）
- 张量：n维数组                             （n阶张量）

> 张量的属性

- type：数据类型
- shape：形状

> 创建张量：默认float32

- `tf.zeros()`
- `tf.ones()`
- `tf.random_normal()`

### 9.张量的修改与运算

> ndarray属性的修改

- 类型的修改

  `ndarray.astype(type)`

  `ndarray.tostring()`

- 形状的修改

  `ndarray.reshape(shape)`：-1自动计算形状

  `ndarray.resize(shape)`

> 张量的变换

- 类型的修改

  `tf.cast(x,dtype,name=None)`相当于`ndarray.astype(type)`

  不会改变原始的tensor，返回新的改变类型后的tensor

- 形状的修改

  - 静态形状（初始创建张量时的形状）

    `tensor.set_shape(tensor,shape)`：静态形状只能修改/更新其没有完全固定下来的部分，即不能跨阶修改，不能修改已经固定的部分。


```python
def tensor_op_demo():
    a_tf = tf.placeholder(dtype=tf.float32,shape=[None,None])
    b_tf = tf.placeholder(dtype=tf.float32,shape=[None,10])
    c_tf = tf.placeholder(dtype=tf.float32,shape=[2,3])
    print("a_tf:",a_tf)
    print("b_tf:",b_tf)

    a_tf.set_shape(shape=[8,8])
    b_tf.set_shape(shape=[5,10])
    print("a_tf:",a_tf)
    print("b_tf:",b_tf)

>>> a_tf: Tensor("Placeholder_18:0", shape=(?, ?), dtype=float32)
    b_tf: Tensor("Placeholder_19:0", shape=(?, 10), dtype=float32)
    a_tf: Tensor("Placeholder_18:0", shape=(8, 8), dtype=float32)
    b_tf: Tensor("Placeholder_19:0", shape=(5, 10), dtype=float32)
    # 注意1: shape中带 ？的部分即为没有完全固定下来的部分，对于这部分静态形状可以修改或更新  
    # 注意2: 如果对c_tf进行形状修改会报错 -》raise ValueError("Dimensions %s and %s are not compatible"
    # 注意3: 会改变原始的tensor
```

  - 动态形状

    `tf.reshape(tensor,shape)`：不会改变原始的tensor，返回新的改变类型后的tensor；可以任意修改，但是张量元素总个数必须匹配。

```python
def tensor_op_demo():
    a_tf = tf.placeholder(dtype=tf.float32,shape=[None,None])
    b_tf = tf.placeholder(dtype=tf.float32,shape=[None,10])
    c_tf = tf.placeholder(dtype=tf.float32,shape=[2,3])
    print("c_tf:",c_tf)
    
    c_tf_reshape = tf.reshape(c_tf, shape=[2,3,1])
    
    print("c_tf:",c_tf)
    print("c_tf_reshape:",c_tf_reshape)

>>> c_tf: Tensor("Placeholder_29:0", shape=(2, 3), dtype=float32)
    c_tf: Tensor("Placeholder_29:0", shape=(2, 3), dtype=float32)
    c_tf_reshape: Tensor("Reshape:0", shape=(2, 3, 1), dtype=float32)
    # 注意1: 不会改变原始的tensor，返回新的改变类型后的tensor
    # 注意2: 张量元素总个数必须匹配
    # 注意3: 如果变换前后elements总数不匹配会报错 InvalidArgumentError: Cannot reshape a tensor with 6 elements to shape [2,3,2] (12 elements) 
```

> 张量的数学运算 [**API v2.1**](https://www.tensorflow.org/api_docs/python/tf/math/) 

- 算术运算符
- 基本数学函数
- 矩阵运算
- reduce操作
- 序列索引操作

### 10.变量的介绍

> tensorflow变量是表示程序处理的共享持久化的最佳方法，变量通过`tf.Variable` OP类进行操作

> 变量的特点

- 存储持久化
- 可修改值
- 可指定被训练（变量存储模型参数）

> 创建变量

```python
tf.Variable(
    initial_value=None, trainable=None, name=None)

# initial_value：初始化的值
# trainable：是否被训练
```

```python
def variable_demo():
    # 指定命名空间的好处：代码模块化，用命名空间会显示的更清晰
    with tf.variable_scope("my_scope"):
        a_var = tf.Variable(initial_value=40)
        b_var = tf.Variable(initial_value=50)
        c_var = a_var + b_var
    print("a_var:",a_var)
    print("b_var:",b_var)
    print("c_var:",c_var)
    
    # FailedPreconditionError: Attempting to use uninitialized value Variable
        # initial_value只是给定初始的值，但是并没有对变量进行初始化
        
    init = tf.global_variables_initializer()    
    
    with tf.Session() as sess:
        # 变量需要显示初始化，才能运行值
        
        sess.run(init)
        c_var_value = sess.run([c_var,a_var,b_var])
    print("c_var_value:",c_var_value)
    
>>> a_var: <tf.Variable 'my_scope_1/Variable:0' shape=() dtype=int32_ref>
    b_var: <tf.Variable 'my_scope_1/Variable_1:0' shape=() dtype=int32_ref>
    c_var: Tensor("my_scope_1/add:0", shape=(), dtype=int32)
    c_var_value: [90, 40, 50]
```

### 11.基础与高级API

> 基础的神经网络组件

`tf.app` 相当于为tensorflow进行的脚本提供了一个main函数的入口，可以指定脚本运行的flags

`tf.image` 图处理操作

`tf.gfile` 文件操作函数

`tf.summary` 用来生成tensorboard可用的统计日志

`tf.python_io` 用来读写TFRecords文件

`tf.train` 提供了一些训练器，与`tf.nn` 组合起来，实现一些网络的优化计算

`tf.nn` 提供了构建神经网络的底层函数，是tenorflow构建网络的核心模块。其中包含了添加各种层的函数，比如卷积层，池化层

> 高级API

`tf.keras` 好用！本来是一个独立的深度学习库，tensorflow将其学习过来，增加这部分模块在于快速构建模型

`tf.layes` 以更高级的概念层来定义一个模型，类似 `tf.keras`

`tf.contrib` tf.contrib.layers提供能够将计算图中的 网络层、正则化、摘要操作 睡构建计算图的高级操作，但是tf.contrib包含不稳定的代码，后续的版本可能会改变

`tf.estimator` 一个estimator相当于 model+training+evaluate的合体，在模块中，已经实现了几种简单的分类和回归器，包括：baseline、learing和dnn，这里的dnn网络只是全连接层，没有提供卷积之类的

![](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/SwDf6C.jpg)

### 12.案例：自实现线性回归

> 流程分析

```python
def linear_regression_demo():
    #1.准备数据
    x = tf.random_normal(shape=[100,1])
    y_true = tf.matmul(x,[[0.8]]) + 0.7
    
    #2.构建模型
    weights = tf.Variable(initial_value=tf.random_normal(shape=[1,1]))
    bias = tf.Variable(initial_value=tf.random_normal(shape=[1,1]))
    y_predict = tf.matmul(x,weights) + bias
    
    #3.构造损失函数
    err_loss = tf.reduce_mean(tf.square(y_predict - y_true))
    
    #4.优化损失
    optimizer = tf.train.GradientDescentOptimizer(learning_rate=0.01).minimize(err_loss)
    ## 显示初始化变量
    init = tf.global_variables_initializer()
    ## 开启会话
    with tf.Session() as sess:
        # 初始化变量
        sess.run(init)
        # 查看初始化模型参数后的值
        print("训练前模型的参数为：权重%f,偏置%f,损失%f" % (weights.eval(),bias.eval(),err_loss.eval()))
        
        for i in range(400):
            sess.run(optimizer)
            # 打印每次训练的值
            print("训练前模型的参数为：权重%f,偏置%f,损失%f" % (weights.eval(),bias.eval(),err_loss.eval()))
            
>>> 训练前模型的参数为：权重-1.175952,偏置0.759938,损失4.053728
    训练前模型的参数为：权重-1.137560,偏置0.755754,损失3.646768
    训练前模型的参数为：权重-1.097856,偏置0.764003,损失2.874465
    训练前模型的参数为：权重-1.067260,偏置0.765181,损失2.794361
    ...
    训练前模型的参数为：权重0.799374,偏置0.699995,损失0.000000
		训练前模型的参数为：权重0.799386,偏置0.699992,损失0.000000
```

> 学习率设置、步数的设置与梯度爆炸

在极端情况下，权重的权值变得非常大以至于溢出，导致nan值

如何解决梯度爆炸哦的问题

- 重新设计网络
- 调整学习率
- 使用梯度截断（在训练过程中检查和限制梯度的大小）
- 使用激活函数

```python
# 设置learning_rate=5的情形
>>> 
训练前模型的参数为：权重-0.928330,偏置-2.045089,损失10.530254
训练前模型的参数为：权重11.713202,偏置22.232876,损失503.227844
训练前模型的参数为：权重-99.408081,偏置-195.594910,损失50171.000000
训练前模型的参数为：权重1305.262573,偏置1970.778076,损失5345798.500000
训练前模型的参数为：权重-12858.165039,偏置-19413.482422,损失525646880.000000
...
训练前模型的参数为：权重1238439457430962176.000000,偏置3726078330521255936.000000,损失inf
训练前模型的参数为：权重-9055882331084029952.000000,偏置-32826618936647745536.000000,损失inf
训练前模型的参数为：权重117351658884811456512.000000,偏置301370648411355742208.000000,损失inf
...
训练前模型的参数为：权重nan,偏置nan,损失nan
训练前模型的参数为：权重nan,偏置nan,损失nan
```

```python
# 定义weights参数时 trainable=False
>>>
训练前模型的参数为：权重-0.974608,偏置0.621385,损失2.850980
训练前模型的参数为：权重-0.974608,偏置0.601612,损失3.234275
训练前模型的参数为：权重-0.974608,偏置0.669482,损失3.580407
...
训练前模型的参数为：权重-0.974608,偏置0.679230,损失2.966820
训练前模型的参数为：权重-0.974608,偏置0.651485,损失2.860602
```

### 14.增加其他功能

- ## 功能一：增加变量显示

  - 1.收集变量

    `tf.summary.scalar(name='',tensor)` ：收集对于损失函数和准确率等单值变量

    `tf.summary.histogram(name='',tensor)` ：收集高维度的变量参数，看分布状况

  - 2.合并变量写入事件文件

    `merged = tf.summary.merge_all()`

    运行合并： `summary=sess.run(merged)` 每次迭代都运行

    添加：`FileWriter.add_summary(summary,i)` i表示第几次的值

  > 增加变量显示功能（tensorboard）
  >
  > 1）创建事件文件读写器 
  >
  > ​      file_writer = tf.summary.FileWriter("./tmp/linear/",graph=sess.graph)
  > 2）收集变量
  > ​      tf.summary.scalar("err_loss",err_loss)
  > ​      tf.summary.histogram("weights",weights)
  > ​      tf.summary.histogram("bias",bias)
  > 3）合并变量
  > ​      merged = tf.summary.merge_all()
  > 4）运行合并&写入事件文件
  > ​      summary = sess.run(merged)
  > ​      file_writer.add_summary(summary,i)
  > 5）开启localhost:6006
  > ​      tensorboard --logdir="./tmp/linear/"

```python
def linear_regression_demo():
  	"""
  	增加变量显示功能（tensorboard）
  	"""
    #1.准备数据
    x = tf.random_normal(shape=[100,1])
    y_true = tf.matmul(x,[[0.8]]) + 0.7
    
    #2.构建模型
    weights = tf.Variable(initial_value=tf.random_normal(shape=[1,1]))
    bias = tf.Variable(initial_value=tf.random_normal(shape=[1,1]))
    y_predict = tf.matmul(x,weights) + bias
    
    #3.构造损失函数
    err_loss = tf.reduce_mean(tf.square(y_predict - y_true))
    
    #4.优化损失
    optimizer = tf.train.GradientDescentOptimizer(learning_rate=0.1).minimize(err_loss)
    
    ### step2:收集变量
    tf.summary.scalar("err_loss",err_loss)
    tf.summary.histogram("weights",weights)
    tf.summary.histogram("bias",bias)
    
    ### step3:合并变量
    merged = tf.summary.merge_all()
    
    init = tf.global_variables_initializer()
    with tf.Session() as sess:
        sess.run(init)
        print("训练前模型的参数为：权重%f,偏置%f,损失%f" % (weights.eval(),bias.eval(),err_loss.eval()))
        
        ### step1:创建事件文件读写器
        file_writer = tf.summary.FileWriter("./tmp/linear/",graph=sess.graph)
        
        for i in range(100):
            sess.run(optimizer)
            print("训练前模型的参数为：权重%f,偏置%f,损失%f" % (weights.eval(),bias.eval(),err_loss.eval()))
            ### step4:运行合并&写入事件文件
            summary = sess.run(merged)
            file_writer.add_summary(summary,i)
```

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/HEbwDe.png" style="zoom:50%;" />

![](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/uXi3vM.png)

- ## 功能二：增加命名空间+修改指令名称

```python
def linear_regression_demo():
  	"""
  	add function:增加命名空间+修改指令名称
  	"""
    with tf.variable_scope("prepare_data"):
        #1.准备数据
        x = tf.random_normal(shape=[100,1],name="feature")
        y_true = tf.matmul(x,[[0.8]]) + 0.7
    
    with tf.variable_scope("bulid_model"):
        #2.构建模型
        weights = tf.Variable(initial_value=tf.random_normal(shape=[1,1]),name="Weights")
        bias = tf.Variable(initial_value=tf.random_normal(shape=[1,1]),name="Bias")
        y_predict = tf.matmul(x,weights) + bias
    
    with tf.variable_scope("loss_function"):
        #3.构造损失函数
        err_loss = tf.reduce_mean(tf.square(y_predict - y_true))
    
    with tf.variable_scope("optimizer"):
        #4.优化损失
        optimizer = tf.train.GradientDescentOptimizer(learning_rate=0.1).minimize(err_loss)
    
    ### step2:收集变量
    tf.summary.scalar("err_loss",err_loss)
    tf.summary.histogram("weights",weights)
    tf.summary.histogram("bias",bias)
    
    ### step3:合并变量
    merged = tf.summary.merge_all()
    
    init = tf.global_variables_initializer()
    with tf.Session() as sess:
        sess.run(init)
        print("训练前模型的参数为：权重%f,偏置%f,损失%f" % (weights.eval(),bias.eval(),err_loss.eval()))
        
        ### step1:创建事件文件
        file_writer = tf.summary.FileWriter("./tmp/linear/",graph=sess.graph)
        
        for i in range(100):
            sess.run(optimizer)
            print("训练前模型的参数为：权重%f,偏置%f,损失%f" % (weights.eval(),bias.eval(),err_loss.eval()))
            ### step4:运行合并&写入事件文件
            summary = sess.run(merged)
            file_writer.add_summary(summary,i)
```

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/RzfKZe.png" style="zoom:50%;" />

- ## 功能三：模型的保存与加载

  `tf.train.Saver(var_list=None,max_to_keep=5)` 

  1.保存和加载模型，文件保存格式为checkpoint文件

  2.var_list 指定将要保存和还原的变量，可以作为一个dict或者列表传递

  3.max_to_keep 指示要保留的最近检查点文件的最大数量，创建新文件时，会删除旧的文件。如果无或0，则保留所有检查点文件。默认为5，即保留最新的5个检查点文件

  > 模型的报错与加载
  >
  > 1）实例化 Saver
  >
  > 2）保存 `saver.save(sess,path)`  
  >
  > ​      ⚠️这里传入的参数是sess，因为模型保存的是参数，参数在sess中可以看到
  >
  > 3）加载 `saver.restore(sess,path)`

```python
def linear_regression_demo():
    with tf.variable_scope("prepare_data"):
        #1.准备数据 x y_true
    
    with tf.variable_scope("bulid_model"):
        #2.构建模型 weights bias y_predict
        
    with tf.variable_scope("loss_function"):
        #3.构造损失函数 err_loss
        
    with tf.variable_scope("optimizer"):
        #4.优化损失 optimizer
        
    ### step2:收集变量
    ### step3:合并变量
   
    #### 实例化 Saver
    saver = tf.train.Saver()
    
    init = tf.global_variables_initializer()
    with tf.Session() as sess:
        sess.run(init)
        ### step1:创建事件文件
        
#         for i in range(100):
#             sess.run(optimizer)
#             print("训练前模型的参数为：权重%f,偏置%f,损失%f" % (weights.eval(),bias.eval(),err_loss.eval()))
#             ### step4:运行合并&写入事件文件
#             summary = sess.run(merged)
#             file_writer.add_summary(summary,i)
            
#             #### 保存模型
#             if i%10==0:
#                 saver.save(sess,"./tmp/model/my_linear.ckpt")

        #### 加载模型
        if os.path.exists("./tmp/model/checkpoint"):
            saver.restore(sess,"./tmp/model/my_linear.ckpt")
            
        print("训练后模型的参数为：权重%f,偏置%f,损失%f" % (weights.eval(),bias.eval(),err_loss.eval()))
        
>>> 训练前模型的参数为：权重-1.062648,偏置0.165306,损失4.385647
    INFO:tensorflow:Restoring parameters from ./tmp/model/my_linear.ckpt
    训练后模型的参数为：权重0.800000,偏置0.700000,损失0.000000

```

- ## 功能四：命令行参数

> 命令行参数的使用
>
> 1）`tf.app.flags` 支持应用从命令行接受参数，可以用来指定集群配置等
>
> tf.app.flags.DEFINE_integer("max_step",0,"训练模型的步骤")
>
> tf.app.flags.DEFINE_string("model_dir"," ","模型保存的路径+模型名称")
>
> 2）`FLAGS = tf.app.flags.FLAGS` 简化使用
>
> 通过FLAGS.max_step调用命令行中传过来的参数
>
> 3）通过`tf.app.run()`启动`main(argv)`函数

```python
tf.app.flags.DEFINE_string("model_dir","./tmp/model/","模型保存的路径+模型名称")
tf.app.flags.DEFINE_integer("max_step",100,"训练模型的步骤")
FLAGS = tf.app.flags.FLAGS

# 开启训练
for i in range(FLAGS.max_step):
		sess.run(train_op)
# 保存模型
saver.save(sess,FLAGS.model_dir)
```

```python
# command_line_demo.py

import tensorflow as tf
# 1)定义命令行参数
tf.app.flags.DEFINE_integer("max_step",100,"训练模型的步骤")
tf.app.flags.DEFINE_string("model_dir","unknown","模型保存的路径+模型名称")
tf.app.flags.DEFINE_string('f', '', 'kernel')
# 2）简化变量名
FLAGS = tf.app.flags.FLAGS

def command_line():
    print("max_step:",FLAGS.max_step)
    print("model_dir:",FLAGS.model_dir)
    return None
  
def main(argv):
  	command_line()
  	ruturn None

if __name__ == "__main__":
    # command_line()
    tf.app.run()
    
    
>>> python command_line_demo.py
>>> max_step: 100
		model_dir: unknown
>>> python command_line_demo.py --max_step=200 --model_dir="hello world"
>>> max_step: 200
		model_dir: hello world
```

