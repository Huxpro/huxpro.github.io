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

- 开启会话的目的：看到具体的值

- tensorflow有两个阶段：构建图阶段与操作图阶段

  - **构建图阶段**：数据与操作的步骤被描述成了一个图

    怎么理解：图是定义了数据和操作的一个步骤，在开启会话前都算图

  - **执行阶段**：使用会话执行构建好的图中的操作

    怎么理解：构建图阶段只是做了定义，但是还未真正执行，要想实际 的运行起来，我们需要把数据与操作加载到内存中，去掉用具体的资源，去运行我们的数据与操作，这就是开启会话的作用

  - **图**：tensorflow将计算表示为指令之间的依赖关系的一种表示法，可以理解为一个流程图，定义了数据与操作，但是还是静态的

  - **会话**：tensorflow跨一个或者多个本地或者远程设备运行数据流图的机制，调用各方资源将之前定义好的数据与操作运行起来

  - **张量Tensor**：tensorflow中的基本数据对象（用张量定义数据）

  - **节点OP** ：提供图中执行的操作（用节点定义操作）

- **数据流图**：

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

**什么是图结构？**

- 图包含了一组tf.operation代表的**计算单元对象**和tf.tensor代表的**计算单元之间流动的数据** （就是数据tensor对象+操作operation对象）

**图相关的操作**

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

**step1：数据序列化-events文件**

- ``tf.summary.FileWriter(logdir,graph=sess.graph)` Tensorboard通过读取tensorflow的事件文件来运行，需要将数据生成一个序列化的summary protobuf对象。

step2：启动 Tensorboard

- `tensorboard --logdir="path"`

### 6.Operation介绍

数据：Tensor对象

操作：Operation对象-Op

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

一个运行的tensorflow operation类，**会话包含以下两种开启方式**：

- `tf.Session()` 用于完整的程序当中，用`sess.run()`查看变量值
- `tf.InteractiveSession()` 用于交互式上下文，直接用`.eval()`查看值，若不开启`tf.InteractiveSession()`则只能在`tf.Session()` 内部调用`.eval()`查看值

会话掌握资源，用完会话需要回收资源，所以使用上下文管理器方便管理

**初始化对象时的参数**

- `__init__(target="",graph=None,config=None)`
  - `graph=None` 使用默认图，否则传入自定义图
  - `target=None` 参数留空，会话将仅使用本地计算机的资源，可以指定服务器的地址来访问该服务器控制的计算机上的所有设备
  - `config` 可以用来打印设备信息，查看变量都在哪个设备上

**会话的**`run()`

- `run(fetches,feed_dict=None,option=None,run_metadata=None)`
  - fetches：单一的operation，或者列表，元组
  - feed_dict：与tf.placeholder搭配使用

**feed操作**

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

### 8.张量

张量在计算中如何存储？

- 标量：一个数字 1 						（0阶张量）
- 向量：一维数组 [1,2,3] 	           （1阶张量）
- 矩阵：二维数组 [[1,2,3],[4,5,6]] （2阶张量）
- 张量：n维数组                             （n阶张量）

张量的属性

- type：数据类型
- shape：形状

创建张量：默认float32

- `tf.zeros()`
- `tf.ones()`
- `tf.random_normal()`

