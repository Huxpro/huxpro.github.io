---
title: "Simple Neural Network (eager api)"
subtitle: "TF EXAMPLES「3.3」"
layout: post
author: "echisenyang"
header-style: text
hidden: true
catalog: true
tags:
  - TensorFlow
  - 输出计划
---



Use TensorFlow Eager API to build a simple neural network (a.k.a Multi-layer Perceptron) to classify MNIST digits dataset.

### tensorflow新出的Eager execution

```python
import tensorflow as tf
import tensorflow.contrib.eager as tfe
tfe.enable_eager_execution()
```

就开启了Eager模式，这时，TensorFlow会从原先的**声明式（declarative）**编程形式变成**命令式（imperative）**编程形式。当写下语句"c = tf.matmul(a, b)"后（以及其他任何tf开头的函数），就会直接执行相应的操作并得到值，而不再像之前那样，生成一个Tensor，通过sess.run()才能拿到值。**注意：这种Eager模式一旦被开启就不能被关闭。**

#### **1.好处**

使用Eager模式的好处大家应当都很清楚，可以直接参考PyTorch的相关问题来看：[PyTorch到底好用在哪里?](https://www.zhihu.com/question/65578911)。这里就简单说一说，大概有以下几点：

1. **搭模型更方便了：**之前搭模型通常要认真记下每一步Tensor的shape和意义，然后再操作。现在可以轻松点，边搭边写，忘记形状或者含义的时候可以直接打出来看。另外流程控制可以使用Python的内建语法，更加直观。
2. **调试时**no more sess.run() ! 之前在调试时必须要加上sess.run()，很麻烦，现在可以直接把变量print出来，亦可使用IDE的监控工具单步调试。
3. 最后，如果之前我们想**在自己的程序中用tf开头的函数**，需要手动开启Session将结果的Tensor转换成Numpy数组，或者使用官方提供的函数修饰器。现在只需要用开启这个Eager模式，就可以直接把tf开头的函数当普通函数用了。

#### 2.如何在Eager模式下反向传播求梯度

好处简单说完，再来讲一些实现上的技术细节。**在Eager模式中，正向传播很直观很好理解，但应该怎么求梯度呢？**

大致研究了一下，在tfe中共有四个函数直接服务于反向传播，它们是：

- tfe.gradients_function
- tfe.value_and_gradients_function
- tfe.implicit_gradients
- tfe.implicit_value_and_gradients

这四个函数的功能非常类似于Python中的**函数修饰器**，直接来看代码：

```python
def f(x, y):
    return x ** 2 + y ** 2
g = tfe.gradients_function(f)
g(2., 3.)
```

tfe.gradients_function的输入是一个**函数**，输出是**输入函数相对于它所有参数的梯度函数**。例如在这里的代码中f(x, y) = x ** 2 + y ** 2，f关于x的偏导是2*x，关于y的偏导是2*y，因此g(x, y) =   (2 * x, 2* y)。调用g(2., 3.)的返回值就是(4., 6.)。这就是Eager模式下的自动求导，f中可以使用绝大多数tf开头的函数，都能自动得到计算导数的函数。

如果你了解Python的函数修饰器语法的话，上面的代码就可以直接写成：

```python
@tfe.gradients_function
def g(x, y):
    return x ** 2 + y ** 2
g(2., 3.)
```

tfe.gradients_function的功能是**对函数的输入参数求导，**但在实际使用中，我们往往更希望**对TensorFlow中的变量（Variable）求导**，因为变量中保存的是模型的参数，这才是我们真正要优化、做梯度下降的部分。tfe.implicit_gradients的功能就是，生成可以对“计算过程中所有用到的变量”求导的函数。为了说清楚，还是来看代码：

```python
vx = tfe.Variable(initial_value=1.0, name="vx")
vy = tfe.Variable(initial_value=1.0, name="vy")
def f(x):
    return 2 * vx * x
g = tfe.implicit_gradients(f)
g(2.)
```

我们定义了两个变量vx和vy，**但在f在计算过程中，只用到了vx这个变量，所以只会对vx求导**，相应的导数为2 * x ，这就是g所要做的计算。g的返回值是一个列表，列表中以(梯度，变量)的形式存储了所有计算的梯度的值和变量的值。这里就应当是[(4, 1)]。

**如果需要同时获取f的值和f的梯度，**就可以分别用tfe.value_and_gradients_function和tfe.implicit_value_and_gradients取代tfe.gradients_function、tfe.implicit_gradient。原先tfe.gradients_function返回的是梯度，tfe.value_and_gradients_function返回的就是(函数值，梯度)，tfe.implicit_value_and_gradients的效果也是类似的。

**将求出的梯度应用到变量上**的方法可以参照下面的代码：

```python
def loss_fn(...):
    ....
optimizer = tf.train.GradientDescentOptimizer(learning_rate=0.1)
value_and_gradients_fn = tfe.implicit_value_and_gradients(loss_fn)
empirical_loss, gradients_and_variables = value_and_gradients_fn(.....)
optimizer.apply_gradients(gradients_and_variables)
```

#### UPDATE

TensorFlow's eager execution is an imperative programming environment that evaluates operations immediately, **without building graphs**: operations **return concrete values** instead of constructing a computational graph to run later. This makes it easy to get started with TensorFlow and **debug models**, and it reduces boilerplate as well. 

- tf2.0下求导

```python
w = tf.Variable([[1.0]])
with tf.GradientTape() as tape:
  loss = w * w

grad = tape.gradient(loss, w)
print(grad)  # => tf.Tensor([[ 2.]], shape=(1, 1), dtype=float32)
```





### **TensorFlow全新的数据读取方式：Dataset API**

**此外，如果想要用到TensorFlow新出的Eager模式，就必须要使用Dataset API来读取数据。**

#### 1.基本概念：Dataset与Iterator

<img src="https://pic2.zhimg.com/80/v2-f9f42cc5c00573f7baaa815795f1ce45_1440w.jpg" alt="img" style="zoom:50%;" />

**在Eager模式中，创建Iterator的方式有所不同。**是通过tfe.Iterator(dataset)的形式直接创建Iterator并迭代。迭代时可以直接取出值，不需要使用sess.run()：

```python
import tensorflow.contrib.eager as tfe
tfe.enable_eager_execution()

dataset = tf.data.Dataset.from_tensor_slices(np.array([1.0, 2.0, 3.0, 4.0, 5.0]))

for one_element in tfe.Iterator(dataset):
    print(one_element)
```

其实，tf.data.Dataset.from_tensor_slices的功能不止如此，它的真正作用是**切分传入Tensor的第一个维度，生成相应的dataset。**

- 在实际使用中，我们可能还希望Dataset中的每个元素具有更复杂的形式，如每个元素是一个Python中的**元组**，或是Python中的**词典**。
- **例如，在图像识别问题中，一个元素可以是{"image": image_tensor, "label": label_tensor}的形式，这样处理起来更方便。**



```python
import tensorflow as tf
import numpy as np


d = np.arange(0,60).reshape([6, 10])

# 将array转化为tensor
data = tf.data.Dataset.from_tensor_slices(d)

# 从data数据集中按顺序抽取buffer_size个样本放在buffer中，然后打乱buffer中的样本
# buffer中样本个数不足buffer_size，继续从data数据集中安顺序填充至buffer_size，
# 此时会再次打乱
data = data.shuffle(buffer_size=3)

# 每次从buffer中抽取4个样本
data = data.batch(4)

# 将data数据集重复，其实就是2个epoch数据集
data = data.repeat(2)

# 构造获取数据的迭代器
iters = data.make_one_shot_iterator()

# 每次从迭代器中获取一批数据
batch = iters.get_next()

sess = tf.Session()

sess.run(batch)
# 数据集完成遍历完之后，继续抽取的话会报错：OutOfRangeError

```



#### 2.tf.data API提升流水线性能的原因

##### 1.Prefetching

Start with a naive pipeline using no tricks, iterating over the dataset as-is.

- opening a file if it hasn't been opened yet,
- fetching a data entry from the file,
- using the data for training.

![xog5lY](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/xog5lY.jpg)

在未经优化的pipeline流程中，当读取数据时，模型处于idle状态；当模型训练时，input pipeline也处于idle状态。这种同步的机制导致的时间的极大浪费。

![WecWRX](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/WecWRX.jpg)

可以看到，使用了Prefetching预取机制之后，idle时间明显降低，It can be used to **decouple the time** when data is produced from the time when data is consumed.

```python
dataset = dataset.repeat().batch(batch_size).prefetch(batch_size)
```



##### 2.Parallelizing data extraction

- **Sequential interleave**：The default arguments of the [`tf.data.Dataset.interleave`](https://www.tensorflow.org/api_docs/python/tf/data/Dataset?hl=zh-cn#interleave) transformation make it interleave single samples from two datasets sequentially.

![sfazAt](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/sfazAt.jpg)

- **Parallel interleave**：Now use the `num_parallel_calls` argument of the `interleave` transformation. This loads multiple datasets in parallel, reducing the time waiting for the files to be opened.

![uoqxkq](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/uoqxkq.jpg)

##### 3.Parallelizing data transformation

使用[`tf.data.Dataset.map`](https://www.tensorflow.org/api_docs/python/tf/data/Dataset?hl=zh-cn#map) 接口对数据进行预处理，同样可以选用参数来进行并行处理 `num_parallel_calls`

```python
dataset = tf.data.Dataset.from_tensor_slices(np.array([1.0, 2.0, 3.0, 4.0, 5.0]))
dataset = dataset.map(lambda x: x + 1) # 2.0, 3.0, 4.0, 5.0, 6.0
```

##### 4.Caching

使用缓存机制存储在memory or on local storage中，这样可以节省某些操作的开销，(like file opening and data reading) from being executed during each epoch。

##### 总结

Here is a summary of the best practices for designing performant TensorFlow input pipelines:

- [Use the `prefetch` transformation](https://www.tensorflow.org/guide/data_performance?hl=zh-cn#Pipelining) to overlap the work of a producer and consumer.
- [Parallelize the data reading transformation](https://www.tensorflow.org/guide/data_performance?hl=zh-cn#Parallelizing_data_extraction) using the `interleave` transformation.
- [Parallelize the `map` transformation](https://www.tensorflow.org/guide/data_performance?hl=zh-cn#Parallelizing_data_transformation) by setting the `num_parallel_calls` argument.
- [Use the `cache` transformation](https://www.tensorflow.org/guide/data_performance?hl=zh-cn#Caching) to cache data in memory during the first epoch
- [Vectorize user-defined functions](https://www.tensorflow.org/guide/data_performance?hl=zh-cn#Map_and_batch) passed in to the `map` transformation
- [Reduce memory usage](https://www.tensorflow.org/guide/data_performance?hl=zh-cn#Reducing_memory_footprint) when applying the `interleave`, `prefetch`, and `shuffle` transformations.



### **Simple Neural Network (eager api)**

#### step1: Using TF Dataset to split data into batches

```python
import tensorflow as tf

# Set Eager API
tf.enable_eager_execution()
tfe = tf.contrib.eager

# Using TF Dataset to split data into batches
dataset = tf.data.Dataset.from_tensor_slices(
    (mnist.train.images, mnist.train.labels))
dataset = dataset.repeat().batch(batch_size).prefetch(batch_size)
dataset_iter = tfe.Iterator(dataset)
```

#### step2: Define the neural network

官方推荐应该使用 Python 的 class 来组织模型结构而不是 function。Eager Execution 带有的 `tfe.Network` 就是设计用来作为模型的父类的，继承这个类之后就支持网络的套嵌。

```python
# Define the neural network. To use eager API and tf.layers API together,
# we must instantiate a tfe.Network class as follow:
class NeuralNet(tfe.Network):
    def __init__(self):
        # Define each layer
        super(NeuralNet, self).__init__()
        # Hidden fully connected layer with 256 neurons
        self.layer1 = self.track_layer(
            tf.layers.Dense(n_hidden_1, activation=tf.nn.relu))
        # Hidden fully connected layer with 256 neurons
        self.layer2 = self.track_layer(
            tf.layers.Dense(n_hidden_2, activation=tf.nn.relu))
        # Output fully connected layer with a neuron for each class
        self.out_layer = self.track_layer(tf.layers.Dense(num_classes))

    def call(self, x):
        x = self.layer1(x)
        x = self.layer2(x)
        return self.out_layer(x)


neural_net = NeuralNet()
```

##### 哇，这也封装的太好了吧

```python
# Cross-Entropy loss function
def loss_fn(inference_fn, inputs, labels):
    # Using sparse_softmax cross entropy
    return tf.reduce_mean(tf.nn.sparse_softmax_cross_entropy_with_logits(
        logits=inference_fn(inputs), labels=labels))


# Calculate accuracy
def accuracy_fn(inference_fn, inputs, labels):
    prediction = tf.nn.softmax(inference_fn(inputs))
    correct_pred = tf.equal(tf.argmax(prediction, 1), labels)
    return tf.reduce_mean(tf.cast(correct_pred, tf.float32))
```

```python
# SGD Optimizer
optimizer = tf.train.AdamOptimizer(learning_rate=learning_rate)
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
    batch_loss = loss_fn(neural_net, x_batch, y_batch)
    average_loss += batch_loss
    # Compute the batch accuracy
    batch_accuracy = accuracy_fn(neural_net, x_batch, y_batch)
    average_acc += batch_accuracy

    if step == 0:
        # Display the initial cost, before optimizing
        print("Initial loss= {:.9f}".format(average_loss))

    # Update the variables following gradients info
    optimizer.apply_gradients(grad(neural_net, x_batch, y_batch))
```

##### tfe.implicit_gradients搭配apply_gradients

![Rc4m9s](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/Rc4m9s.png)

