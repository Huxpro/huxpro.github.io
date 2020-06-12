---
title: "Dynamic Recurrent Neural Network (LSTM)"
subtitle: "TF EXAMPLES「3.6」"
layout: post
author: "echisenyang"
header-style: text
hidden: true
catalog: true
tags:
  - TensorFlow
  - 输出计划
---



Build a recurrent neural network (LSTM) that performs dynamic calculation to **classify** sequences of different length.

```python
"""
NOTICE:
    We have to pad each sequence to reach 'max_seq_len' for TensorFlow
    consistency (we cannot feed a numpy array with inconsistent
    dimensions). The dynamic calculation will then be perform thanks to
    'seqlen' attribute that records every actual sequence length.
"""
```



### RNN vs Dynamic RNN

在每一个train step，传入model的是一个batch的数据（这一个batch的数据forward得到predictions，计算loss，backpropagation更新参数），这一个batch内的数据一定是padding成相同长度的。

那么，如果可以**只在一个batch内部进行padding**，例如一个batch中数据长度均在6-10这个范围内，就可以让这个batch中所有数据pad到固定长度10，而整个dataset上的数据最大长度很可能是100，这样就不需要让这些数据也pad到100那么长，白白浪费空间。

所以dynamic_rnn实现的功能就是可以让**不同迭代**传入的batch可以是长度不同数据，但**同一次迭代**一个batch内部的所有数据长度仍然是固定的。例如，**第一时刻传入的数据shape=[batch_size, 10]，第二时刻传入的数据shape=[batch_size, 12]，第三时刻传入的数据shape=[batch_size, 8]等等**。

- 但是rnn不能这样，它要求**每一时刻传入的batch数据的[batch_size, max_seq]，在每次迭代过程中都保持不变**。



### tf.concat与tf.stack的个人理解

- `tf.concat`保持维度不变
- `tf.stack`则会从低维升至高维

```python
import tensorflow as tf
a = tf.constant([[1,2,3],[4,5,6]]) 
b = tf.constant([[7,8,9],[10,11,12]])
ab1 = tf.concat([a,b],axis=0)
ab2 = tf.stack([a,b], axis=0)
sess = tf.Session()
print(sess.run(ab1)) 
print(sess.run(ab2))
print(ab1)
print(ab2)

>>>
[[ 1  2  3]
 [ 4  5  6]
 [ 7  8  9]
 [10 11 12]] #ab1的值

 [[[ 1  2  3]
   [ 4  5  6]]

  [[ 7  8  9]
   [10 11 12]]] #ab2的值
Tensor("concat:0", shape=(4, 3), dtype=int32) #ab1的属性
Tensor("stack:0", shape=(2, 2, 3), dtype=int32) #ab2的属性
```

### tf.transpose(x, perm=[])

```python
import tensorflow as tf

# x shape (2,3,4)
x = [[[1,2,3,4],
      [5,6,7,8],
      [9,10,11,12]],
     [[21,22,23,24],
      [25,26,27,28],
      [29,30,31,32]]]
a=tf.transpose(x, [0, 1, 2])
b=tf.transpose(x, [0, 2, 1])
c=tf.transpose(x, [1, 0, 2])
d=tf.transpose(x, [1, 2, 0])
e=tf.transpose(x, [2, 1, 0])
f=tf.transpose(x, [2, 0, 1])
 
with tf.Session() as sess:
    print ('---------------')
    print (sess.run(a)) # [0, 1, 2]
    print ('---------------')
    print (sess.run(b)) # [0, 2, 1]
    print ('---------------')
    print (sess.run(c)) # [1, 0, 2] <- focus
    print ('---------------')
    print (sess.run(d)) # [1, 2, 0]
    print ('---------------')
    print (sess.run(e)) # [2, 1, 0]
    print ('---------------')
    print (sess.run(f)) # [2, 0, 1]
    print ('---------------')

>>>
---------------
[[[ 1  2  3  4]
  [ 5  6  7  8]
  [ 9 10 11 12]]
 
 [[21 22 23 24]
  [25 26 27 28]
  [29 30 31 32]]]
---------------
[[[ 1  5  9]
  [ 2  6 10]
  [ 3  7 11]
  [ 4  8 12]]
 
 [[21 25 29]
  [22 26 30]
  [23 27 31]
  [24 28 32]]]
---------------
[[[ 1  2  3  4]  <- focus (3,2,4)
  [21 22 23 24]]
 
 [[ 5  6  7  8]
  [25 26 27 28]]
 
 [[ 9 10 11 12]
  [29 30 31 32]]]
---------------
[[[ 1 21]
  [ 2 22]
  [ 3 23]
  [ 4 24]]
 
 [[ 5 25]
  [ 6 26]
  [ 7 27]
  [ 8 28]]
 
 [[ 9 29]
  [10 30]
  [11 31]
  [12 32]]]
---------------
[[[ 1 21]
  [ 5 25]
  [ 9 29]]
 
 [[ 2 22]
  [ 6 26]
  [10 30]]
 
 [[ 3 23]
  [ 7 27]
  [11 31]]
 
 [[ 4 24]
  [ 8 28]
  [12 32]]]
---------------
[[[ 1  5  9]
  [21 25 29]]
 
 [[ 2  6 10]
  [22 26 30]]
 
 [[ 3  7 11]
  [23 27 31]]
 
 [[ 4  8 12]
  [24 28 32]]]
---------------
```



### tf.gather vs tf.slice

```python
输出：
input = [[[1, 1, 1], [2, 2, 2]],
         [[3, 3, 3], [4, 4, 4]],
         [[5, 5, 5], [6, 6, 6]]]
tf.slice(input, [1, 0, 0], [1, 1, 3]) ==> [[[3, 3, 3]]]
tf.slice(input, [1, 0, 0], [1, 2, 3]) ==> [[[3, 3, 3],
                                            [4, 4, 4]]]
tf.slice(input, [1, 0, 0], [2, 1, 3]) ==> [[[3, 3, 3]],
                                           [[5, 5, 5]]]
                                           
tf.gather(input, [0, 2]) ==> [[[1, 1, 1], [2, 2, 2]],
                              [[5, 5, 5], [6, 6, 6]]]
```

```python
def dynamicRNN(x, seqlen, weights, biases):

    # Prepare data shape to match `rnn` function requirements
    # Current data input shape: (batch_size, n_steps, n_input)
    # Required shape: 'n_steps' tensors list of shape (batch_size, n_input)
    
    # Unstack to get a list of 'n_steps' tensors of shape (batch_size, n_input)
    x = tf.unstack(x, seq_max_len, 1)

    # Define a lstm cell with tensorflow
    lstm_cell = tf.contrib.rnn.BasicLSTMCell(n_hidden)

    # Get lstm cell output, providing 'sequence_length' will perform dynamic
    # calculation.
    outputs, states = tf.contrib.rnn.static_rnn(lstm_cell, x, dtype=tf.float32,
                                sequence_length=seqlen)

    # When performing dynamic calculation, we must retrieve the last
    # dynamically computed output, i.e., if a sequence length is 10, we need
    # to retrieve the 10th output.
    # However TensorFlow doesn't support advanced indexing yet, so we build
    # a custom op that for each sample in batch size, get its length and
    # get the corresponding relevant output.

    # 'outputs' is a list of output at every timestep, we pack them in a Tensor
    # and change back dimension to [batch_size, n_step, n_input]
    outputs = tf.stack(outputs)
    outputs = tf.transpose(outputs, [1, 0, 2]) # [batch_size, numsteps, n_hidden]

    # Hack to build the indexing and retrieve the right output.
    batch_size = tf.shape(outputs)[0]
    # Start indices for each sample
    index = tf.range(0, batch_size) * seq_max_len + (seqlen - 1)
	"""
	[0, 1, 2, 3, 4, 5, 6, 7, 8] #tf.range(0, batch_size)
	[ 0, 10, 20, 30, 40, 50, 60, 70, 80] #tf.range(0, batch_size) * seq_max_len
	[ 1, 12, 23, 34, 45, 56, 67, 78, 89] #偏移真实长度之后的index
	"""
    # Indexing
    outputs = tf.gather(tf.reshape(outputs, [-1, n_hidden]), index)
    """
    取出outputs中每个batch_size的最后一个位置进行分类
    """

    # Linear activation, using outputs computed above
    return tf.matmul(outputs, weights['out']) + biases['out']
```

```python
pred = dynamicRNN(x, seqlen, weights, biases)

# Define loss and optimizer
cost = tf.reduce_mean(tf.nn.softmax_cross_entropy_with_logits(logits=pred, labels=y))
optimizer = tf.train.GradientDescentOptimizer(learning_rate=learning_rate).minimize(cost)

# Evaluate model
correct_pred = tf.equal(tf.argmax(pred,1), tf.argmax(y,1))
accuracy = tf.reduce_mean(tf.cast(correct_pred, tf.float32))

# Initialize the variables (i.e. assign their default value)
init = tf.global_variables_initializer()
```

### TOY DATA GENERATOR

```python
class ToySequenceData(object):
    """ Generate sequence of data with dynamic length.
    This class generate samples for training:
    - Class 0: linear sequences (i.e. [0, 1, 2, 3,...])
    - Class 1: random sequences (i.e. [1, 3, 10, 7,...])

    NOTICE:
    We have to pad each sequence to reach 'max_seq_len' for TensorFlow
    consistency (we cannot feed a numpy array with inconsistent
    dimensions). The dynamic calculation will then be perform thanks to
    'seqlen' attribute that records every actual sequence length.
    """
    def __init__(self, n_samples=1000, max_seq_len=20, min_seq_len=3,
                 max_value=1000):
        self.data = [] # padding后的数据
        self.labels = [] # linear 数据为 [1,0]；random sequence 数据为 [0,1]
        self.seqlen = [] # 记录真实长度
        for i in range(n_samples):
            # Random sequence length
            len = random.randint(min_seq_len, max_seq_len)
            # Monitor sequence length for TensorFlow dynamic calculation
            self.seqlen.append(len)
            # Add a random or linear int sequence (50% prob)
            if random.random() < .5:
                # Generate a linear sequence
                rand_start = random.randint(0, max_value - len) # 一个随机数作为linear sequence的开头
                s = [[float(i)/max_value] for i in
                     range(rand_start, rand_start + len)]
                # Pad sequence for dimension consistency
                s += [[0.] for i in range(max_seq_len - len)] # 将sequence从seqlen做padding至max_seq_len
                self.data.append(s)
                self.labels.append([1., 0.])
            else:
                # Generate a random sequence
                s = [[float(random.randint(0, max_value))/max_value]
                     for i in range(len)]
                # Pad sequence for dimension consistency
                s += [[0.] for i in range(max_seq_len - len)]
                self.data.append(s)
                self.labels.append([0., 1.])
        self.batch_id = 0

    def next(self, batch_size):
        """ Return a batch of data. When dataset end is reached, start over.
        """
        if self.batch_id == len(self.data):
            self.batch_id = 0
        batch_data = (self.data[self.batch_id:min(self.batch_id +
                                                  batch_size, len(self.data))])
        batch_labels = (self.labels[self.batch_id:min(self.batch_id +
                                                  batch_size, len(self.data))])
        batch_seqlen = (self.seqlen[self.batch_id:min(self.batch_id +
                                                  batch_size, len(self.data))])
        self.batch_id = min(self.batch_id + batch_size, len(self.data))
        return batch_data, batch_labels, batch_seqlen
```

