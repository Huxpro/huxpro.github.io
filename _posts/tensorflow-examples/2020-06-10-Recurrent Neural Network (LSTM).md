---
title: "Recurrent Neural Network (LSTM)"
subtitle: "TF EXAMPLES「3.4」"
layout: post
author: "echisenyang"
header-style: text
hidden: true
catalog: true
tags:
  - TensorFlow
  - 输出计划
---



Build a recurrent neural network (LSTM) to **classify** MNIST digits dataset.

### tf.unstack()

```python
import tensorflow as tf

c = tf.constant([[1, 2, 3],
				 [4, 5, 6]])

d = tf.unstack(c, axis=0)
e = tf.unstack(c, axis=1)
with tf.Session() as sess:
	print(sess.run(d))
	print(sess.run(e))
    
>>> [array([1, 2, 3]), array([4, 5, 6])] # d = tf.unstack(c, axis=0)
[array([1, 4]), array([2, 5]), array([3, 6])] # e = tf.unstack(c, axis=1)
```

### 静态 vs 动态

- `BasicLSTMCell`：
  （num_units: 是指一个Cell中神经元的个数,forget_bias:忘记门记住多少，1.0代表全部记住）

- `tf.contrib.rnn.static_rnn`：
  静态 rnn的意思就是**按照样本时间序列个数（n_steps）展开，在图中创建（n_steps）个序列的cell**

- `tf.nn.dynamic_rnn`：
  动态rnn的意思是**只创建样本中的一个序列RNN，其他序列数据会通过循while环进入该RNN运算**。 

通过静态static_rnn生成的RNN网络，生成过程所需的时间会更长，网络所占有的内存会更多，导出的模型会更大。**static_rnn模型中会带有第个序列中间态的信息，利于调试。**static_rnn在使用时必须与训练的样本序列个数相同。dynamic_rnn通过动态生成的RNN网络，所占用内存较少。**dynamic_rnn模型中只会有最后的状态，在使用时还能支持不同的序列个数。**



```python
def RNN(x, weights, biases):

    # Prepare data shape to match `rnn` function requirements
    # Current data input shape: (batch_size, timesteps, n_input)
    # Required shape: 'timesteps' tensors list of shape (batch_size, n_input)

    # Unstack to get a list of 'timesteps' tensors of shape (batch_size, n_input)
    x = tf.unstack(x, timesteps, 1)

    # Define a lstm cell with tensorflow
    lstm_cell = rnn.BasicLSTMCell(num_hidden, forget_bias=1.0)
    """
    Args:
      num_units: int, The number of units in the LSTM cell.
      forget_bias: float, The bias added to forget gates (see above).
        Must set to `0.0` manually when restoring from CudnnLSTM-trained
        checkpoints.
    """

    # Get lstm cell output
    outputs, states = rnn.static_rnn(lstm_cell, x, dtype=tf.float32)
    """
    The simplest form of RNN network generated is:
      ```python
        state = cell.zero_state(...)
        outputs = []
        for input_ in inputs:
          output, state = cell(input_, state)
          outputs.append(output)
        return (outputs, state)
      ```
      
    Args:
        cell: An instance of RNNCell.
        inputs: A length T list of inputs, each a `Tensor` of shape
          `[batch_size, input_size]`, or a nested tuple of such elements.
        initial_state: (optional) An initial state for the RNN.
        sequence_length: Specifies the length of each sequence in inputs.
    Returns:
        A pair (outputs, state) where:
            - outputs is a length T list of outputs (one for each input), or a nested
              tuple of such elements.
            - state is the final state
    """

    # Linear activation, using rnn inner loop last output
    # 因为是分类任务，所以只用最后一个outputs
    return tf.matmul(outputs[-1], weights['out']) + biases['out']
```

```python
logits = RNN(X, weights, biases)
prediction = tf.nn.softmax(logits)
```



![Tensorflow-22](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/Tensorflow-22.jpg)

![Tensorflow-23](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/Tensorflow-23.jpg)
![Tensorflow-24](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/Tensorflow-24.jpg)

