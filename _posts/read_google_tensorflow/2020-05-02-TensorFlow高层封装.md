---
title: "TensorFlow高层封装"
subtitle: "TensorFlow：实战Google深度学习框架「10」"
layout: post
author: "echisenyang"
header-style: text
hidden: true
catalog: true
tags:
  - TensorFlow
  - keras
---



### TensorFlow 高层封装总览

目前比较主流的 TensorFlow 高层封装主要有 4 个，分别是 TensorFlow-Slim、 TFLearn 、 Keras 和 Estimator

- TensorFlow-Slim是Google官方给出的相对较早的TensorFlow高层封装，Google通过
TensorFlow-Slim开源了一些己经训练好的图像分析的模型，所以目前在**图像识别问题**中
  TensorFlow-Slim仍被较多地使用

```python
"""
通过TensorFlow-Slim定义卷机神经网络
"""

import tensorflow as tf
import tensorflow.contrib.slim as slim
import numpy as np

from tensorflow.examples.tutorials.mnist import input_data

# 通过TensorFlow-Slim来定义LeNet-5的网络结构。
def lenet5(inputs):
    inputs = tf.reshape(inputs, [-1, 28, 28, 1])
    net = slim.conv2d(inputs, 32, [5, 5], padding='SAME', scope='layer1-conv')
    net = slim.max_pool2d(net, 2, stride=2, scope='layer2-max-pool')
    net = slim.conv2d(net, 64, [5, 5], padding='SAME', scope='layer3-conv')
    net = slim.max_pool2d(net, 2, stride=2, scope='layer4-max-pool')
    net = slim.flatten(net, scope='flatten')
    net = slim.fully_connected(net, 500, scope='layer5')
    net = slim.fully_connected(net, 10, scope='output')
    return net

def train(mnist):
    x = tf.placeholder(tf.float32, [None, 784], name='x-input')
    y_ = tf.placeholder(tf.float32, [None, 10], name='y-input')
    y = lenet5(x)

    cross_entropy = tf.nn.sparse_softmax_cross_entropy_with_logits(logits=y, labels=tf.argmax(y_, 1))
    loss = tf.reduce_mean(cross_entropy)

    train_op = tf.train.GradientDescentOptimizer(0.01).minimize(loss)
    with tf.Session() as sess:
        tf.global_variables_initializer().run()
        for i in range(3000):
            xs, ys = mnist.train.next_batch(100)
            _, loss_value = sess.run([train_op, loss], feed_dict={x: xs, y_: ys})

            if i % 1000 == 0:
                print("After %d training step(s), loss on training batch is %g." % (i, loss_value))
                
                
def main(argv=None):
    mnist = input_data.read_data_sets("../../datasets/MNIST_data", one_hot=True)
    train(mnist)

if __name__ == '__main__':
    main()
```

- 与TensorFlow-Slim相比，TFLeam是一个更加简洁的TensorFlow高层封装。通过TFLeam可以更加容易地完成模型定义、模型训练以及模型评测的全过程。TFLeam没有集成在TensorFlow的安装包中，故需要单独安装 `pip install tflearn`

```python
"""
通过TFLearn的API定义卷机神经网络
"""

import tflearn
from tflearn.layers.core import input_data, dropout, fully_connected
from tflearn.layers.conv import conv_2d, max_pool_2d
from tflearn.layers.estimator import regression
 
import tflearn.datasets.mnist as mnist

trainX, trainY, testX, testY = mnist.load_data(
    data_dir="../../datasets/MNIST_data", one_hot=True)
# 将图像数据resize成卷积卷积神经网络输入的格式。
trainX = trainX.reshape([-1, 28, 28, 1])
testX = testX.reshape([-1, 28, 28, 1])
 
# 构建神经网络。
net = input_data(shape=[None, 28, 28, 1], name='input')
net = conv_2d(net, 32, 5, activation='relu')
net = max_pool_2d(net, 2)
net = conv_2d(net, 64, 5, activation='relu')
net = max_pool_2d(net, 2)
net = fully_connected(net, 500, activation='relu')
net = fully_connected(net, 10, activation='softmax')
# 定义学习任务。指定优化器为sgd，学习率为0.01，损失函数为交叉熵。
net = regression(net, optimizer='sgd', learning_rate=0.01,
                 loss='categorical_crossentropy')


# 通过定义的网络结构训练模型，并在指定的验证数据上验证模型的效果。
model = tflearn.DNN(net, tensorboard_verbose=0)
model.fit(trainX, trainY, n_epoch=10,
          validation_set=([testX, testY]),
          show_metric=True)
```

- 与TFLearn不同的是，Keras和Estimator都己经加入了TensorFlow代码库，而且它们是使用最为广泛的TensorFlow高层封装。

### Keras 介绍

Keras是目前使用最为广泛的深度学习工具之一，它的底层可以支持TensorFlow、MXNet、CNTK和Theano。如今，Keras更是被直接引入了TensorFlow的核心代码库，成为TensorFlow官方提供的高层封装之一。

- 可以分为数据处理、模型定义和模型训练三个部分

- 使用原生态的 KerasAPI 需要先安装 Keras 包

```python
"""
使用原生态Keras在MNIST数据集上实现LeNet-5模型
"""

import keras
from keras.datasets import mnist
from keras.models import Sequential
from keras.layers import Dense, Flatten, Conv2D, MaxPooling2D
from keras import backend as K

########################################################################
# 1. 数据预处理
num_classes = 10
img_rows, img_cols = 28, 28
 
# 通过Keras封装好的API加载MNIST数据。其中trainX就是一个60000 * 28 * 28的数组，
# trainY是每一张图片对应的数字。
(trainX, trainY), (testX, testY) = mnist.load_data()

# 根据对图像编码的格式要求来设置输入层的格式。
if K.image_data_format() == 'channels_first':
    trainX = trainX.reshape(trainX.shape[0], 1, img_rows, img_cols)
    testX = testX.reshape(testX.shape[0], 1, img_rows, img_cols)
    input_shape = (1, img_rows, img_cols)
else:
    trainX = trainX.reshape(trainX.shape[0], img_rows, img_cols, 1)
    testX = testX.reshape(testX.shape[0], img_rows, img_cols, 1)
    input_shape = (img_rows, img_cols, 1)
    
trainX = trainX.astype('float32')
testX = testX.astype('float32')
trainX /= 255.0
testX /= 255.0
 
# 将标准答案转化为需要的格式（one-hot编码）。
trainY = keras.utils.to_categorical(trainY, num_classes)
testY = keras.utils.to_categorical(testY, num_classes)


########################################################################
# 2. 通过Keras的API定义卷机神经网络。

# 使用Keras API定义模型。
model = Sequential()
model.add(Conv2D(32, kernel_size=(5, 5), activation='relu', input_shape=input_shape))
model.add(MaxPooling2D(pool_size=(2, 2)))
model.add(Conv2D(64, (5, 5), activation='relu'))
model.add(MaxPooling2D(pool_size=(2, 2)))
model.add(Flatten())
model.add(Dense(500, activation='relu'))
model.add(Dense(num_classes, activation='softmax'))
 
# 定义损失函数、优化函数和评测方法。
model.compile(loss=keras.losses.categorical_crossentropy,
              optimizer=keras.optimizers.SGD(),
              metrics=['accuracy'])


########################################################################
# 3. 通过Keras的API训练模型并计算在测试数据上的准确率
model.fit(trainX, trainY,
          batch_size=128,
          epochs=10,
          validation_data=(testX, testY))
 
# 在测试数据上计算准确率。
score = model.evaluate(testX, testY)
print('Test loss:', score[0])
print('Test accuracy:', score[1])
```

![kpojid](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/kpojid.png)

![HEePnx](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/HEePnx.jpg)

```python
"""
使用循环神经网络实现情感分析模型
"""

from keras.preprocessing import sequence
from keras.models import Sequential
from keras.layers import Dense, Embedding
from keras.layers import LSTM
from keras.datasets import imdb

max_features = 20000
maxlen = 80  
batch_size = 32

###########################################################################
# 1. 数据预处理
# 加载数据并将单词转化为ID，max_features给出了最多使用的单词数。
(trainX, trainY), (testX, testY) = imdb.load_data(num_words=max_features)
print(len(trainX), 'train sequences')
print(len(testX), 'test sequences')

# 在自然语言中，每一段话的长度是不一样的，但循环神经网络的循环长度是固定的，
# 所以这里需要先将所有段落统一成固定长度。
trainX = sequence.pad_sequences(trainX, maxlen=maxlen)
testX = sequence.pad_sequences(testX, maxlen=maxlen)
print('trainX shape:', trainX.shape)
print('testX shape:', testX.shape)
>>> (25000, 'train sequences')
(25000, 'test sequences')
('trainX shape:', (25000, 80))
('testX shape:', (25000, 80))


###########################################################################
# 2. 定义模型
model = Sequential()
model.add(Embedding(max_features, 128))
model.add(LSTM(128, dropout=0.2, recurrent_dropout=0.2))
# 构建最后的全连接层。 注意在上面构建 LSTM 层时只会得到最后一个节点的输出，
# 如果需要输出每个时间点的结果， 那么可以将 return_sequences 参数设为 True
model.add(Dense(1, activation='sigmoid'))
model.compile(loss='binary_crossentropy',
              optimizer='adam',
              metrics=['accuracy'])


###########################################################################
# 3. 训练、评测模型
model.fit(trainX, trainY,
          batch_size=batch_size,
          epochs=10,
          validation_data=(testX, testY))

score = model.evaluate(testX, testY, batch_size=batch_size)
print('Test loss:', score[0])
print('Test accuracy:', score[1])
```

以上两个样例针对Keras的基本用法做了详细的介绍。虽然通过Keras的封装，很多经典的神经网络结构能够很快地被实现，不过要实现一些更加灵活的网络结构、损失函数或者数据输入方法，就需要对Keras的高级用法有更多的了解。

#### Keras 高级用法

![uB5Tu4](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/uB5Tu4.png)

```python
import keras
from tflearn.layers.core import fully_connected
from keras.datasets import mnist
from keras.layers import Input, Dense
from keras.models import Model


##############################################################
# 1. 数据预处理
num_classes = 10
img_rows, img_cols = 28, 28

# 通过Keras封装好的API加载MNIST数据。
(trainX, trainY), (testX, testY) = mnist.load_data()
trainX = trainX.reshape(trainX.shape[0], img_rows * img_cols)
testX = testX.reshape(testX.shape[0], img_rows * img_cols)
 
# 将图像像素转化为0到1之间的实数。
trainX = trainX.astype('float32')
testX = testX.astype('float32')
trainX /= 255.0
testX /= 255.0
 
# 将标准答案转化为需要的格式（one-hot编码）。
trainY = keras.utils.to_categorical(trainY, num_classes)
testY = keras.utils.to_categorical(testY, num_classes)


##############################################################
# 2. 通过返回值的方式定义模型
inputs = Input(shape=(784,))
x = Dense(500, activation='relu')(inputs)
predictions = Dense(10, activation='softmax')(x)
model = Model(inputs=inputs, outputs=predictions)
model.compile(loss=keras.losses.categorical_crossentropy,
              optimizer=keras.optimizers.SGD(),
              metrics=['accuracy'])


##############################################################
# 3. 训练模型
model.fit(trainX, trainY,
          batch_size=32,
          epochs=10,
          validation_data=(testX, testY))
```

![GvNcuE](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/GvNcuE.png)

![LBuSHO](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/LBuSHO.png)

```python
"""
输入层 l 含有784个节点，代表MNIST图片中784个像素。输入层2含有10个节点，代表该图片所对应的数字。输出层在预测时仅仅依赖维度为1的隐藏层，因此预测的准确度比较低；而输出层 2 的输入中直接包含了正确答案，因此预测的准确度很高。
"""
# 定义两个输入。
input1 = Input(shape=(784,), name = "input1")
input2 = Input(shape=(10,), name = "input2")

# 定义第一个输出。
x = Dense(1, activation='relu')(input1)
output1 = Dense(10, activation='softmax', name = "output1")(x)

# 定义第二个输出。
y = keras.layers.concatenate([x, input2])
output2 = Dense(10, activation='softmax', name = "output2")(y)

model = Model(inputs=[input1, input2], outputs=[output1, output2])

# 定义损失函数、优化函数和评测方法。
model.compile(loss=keras.losses.categorical_crossentropy,
              optimizer=keras.optimizers.SGD(),
              loss_weights = [1, 0.1],
              metrics=['accuracy'])
```

虽然通过返回值的方式已经可以实现大部分的神经网络模型，然而KerasAPI还存在两大问题。

- 第一，原生态KerasAPI对训练数据的处理流程支持得不太好，**基本上需要一次性将数据全部加载到内存**。
- 第二，原生态KerasAPI**无法支持分布式训练**。

为了解决这两个问题，**Keras提供了一种与原生态TensorFlow结合得更加紧密的方式**。以下代码显示了如何将Keras和原生态 TensorFlow API 联合起来解决MNIST问题。

- 通过TensorFlow中的placeholder定义输入。这样可以有效避免一次性加载所有数据的问题。
- 使用原生态 TensorFlow 的方式训练模型。这样可以有效地实现分布式。

```python
# 1. 模型定义
import tensorflow as tf
from tensorflow.examples.tutorials.mnist import input_data

mnist_data = input_data.read_data_sets('../../datasets/MNIST_data', one_hot=True)

# 通过TensorFlow中的placeholder定义输入。类似地，Keras封装的网络层结构也可以支 
# 持使用第7章中介绍的输入队列。这样可以有效避免一次性加载所有数据的问题。
x = tf.placeholder(tf.float32, shape=(None, 784))
y_ = tf.placeholder(tf.float32, shape=(None, 10))

# 直接使用 TensorFlow 中提供的 Keras API 定义网络层结构。
net = tf.keras.layers.Dense(500, activation='relu')(x)
y = tf.keras.layers.Dense(10, activation='softmax')(net)
acc_value = tf.reduce_mean(
    tf.keras.metrics.categorical_accuracy(y_, y))

# 定义损失函数和优化方法。注意这里可以混用 Keras 的 API 和原生态 TensorFlow 的 API 。
loss = tf.reduce_mean(tf.keras.losses.categorical_crossentropy(y_, y))
train_step = tf.train.GradientDescentOptimizer(0.5).minimize(loss)

# 2. 模型训练
with tf.Session() as sess:
    # 使用原生态 TensorFlow 的方式训练模型。这样可以有效地实现分布式。
    tf.global_variables_initializer().run()
    for i in range(3000):
        xs, ys = mnist_data.train.next_batch(100)
        _, loss_value = sess.run([train_step, loss], feed_dict={x: xs, y_: ys})
        if i % 1000 == 0:
            print("After %d training step(s), loss on training batch is "
                  "%g." % (i, loss_value))

    print acc_value.eval(feed_dict={x: mnist_data.test.images,
                                    y_: mnist_data.test.labels})
```

### Estimator 介绍

```python
import numpy as np
import tensorflow as tf
from tensorflow.examples.tutorials.mnist import input_data

# 将 TensorFlow 日志信息输出到屏幕。
tf.logging.set_verbosity(tf.logging.INFO)


#############################################################################
# 1. 模型定义
mnist = input_data.read_data_sets("../../datasets/MNIST_data", one_hot=False)
# 定义模型的输入。
feature_columns = [tf.feature_column.numeric_column("image", shape=[784])]
# 通过DNNClassifier定义模型。
# 通过 TensorFlow 提供的封装好的 Estimator 定义神经网络模型。 
# feature_columns 参数给出了神经网络输入层需要用到的数据， 
# hidden_units 参数给出了神经网络的结构。
# 注意这 DNNClassifier 只能定义多层全连接层神经网络，而 hidden_units 列表中纷出了每一层隐藏层的节点个数。 n_classes 给出了总共类目的数量， optimizer 给出了使用的优化函数。 Estimator 会将模型训练过程中的 loss 变化以及一些其他指标保存到 model_dir 目录下，通过 TensorBoard 可以可视化这些指标的变化过程
estimator = tf.estimator.DNNClassifier(feature_columns=feature_columns,
                                       hidden_units=[500],
                                       n_classes=10,
                                       optimizer=tf.train.AdamOptimizer(),
                                       model_dir="log")


#############################################################################
# 2. 训练模型
train_input_fn = tf.estimator.inputs.numpy_input_fn(
      x={"image": mnist.train.images},
      y=mnist.train.labels.astype(np.int32),
      num_epochs=None,
      batch_size=128,
      shuffle=True)
estimator.train(input_fn=train_input_fn, steps=10000)


#############################################################################
# 3. 测试模型
test_input_fn = tf.estimator.inputs.numpy_input_fn(
      x={"image": mnist.test.images},
      y=mnist.test.labels.astype(np.int32),
      num_epochs=1,
      batch_size=128,
      shuffle=False)

test_results = estimator.evaluate(input_fn=test_input_fn)
accuracy_score = test_results["accuracy"]
print("\nTest accuracy: %g %%" % (accuracy_score*100))

print test_results
```

![4D1BVN](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/4D1BVN.png)

#### Estimator 自定义模型

若使用预先定义好的模型，除了不能灵活选择模型的结构，模型使用的损失函数和每一层使用的激活函数等也都是预先定义好的。为了更加灵活地构建模型，Estimator支持使用自定义的模型结构。

```python
import numpy as np
import tensorflow as tf
from tensorflow.examples.tutorials.mnist import input_data

tf.logging.set_verbosity(tf.logging.INFO)


##################################################################
# 1. 自定义模型并训练
def lenet(x, is_training):
    x = tf.reshape(x, shape=[-1, 28, 28, 1])
    conv1 = tf.layers.conv2d(x, 32, 5, activation=tf.nn.relu)
    conv1 = tf.layers.max_pooling2d(conv1, 2, 2)
    conv2 = tf.layers.conv2d(conv1, 64, 3, activation=tf.nn.relu)
    conv2 = tf.layers.max_pooling2d(conv2, 2, 2)
    fc1 = tf.contrib.layers.flatten(conv2)
    fc1 = tf.layers.dense(fc1, 1024)
    fc1 = tf.layers.dropout(fc1, rate=0.4, training=is_training)
    return tf.layers.dense(fc1, 10)

def model_fn(features, labels, mode, params):
    """
    自定义Estimator中使用的模型。 定义的函数有4个输入：
    1. features 给出了在输入函数中会提供的输入层张盘。注意这是一个字典，字典里的内容是通过
    	tf.estimator.inputs.numpy_input_fn中x参数的内容指定的。 
    2. labels是正确答案，这个字段的内容是通过numpy_input_fn中y参数给出的。 
    3. mode的取值有3种可能，分别对应Estimator类的train、evaluate和predict这3个函数。通过这个
    	参数可以判断当前是否是训练过程
    4. 最后params是一个字典，这个字典中可以给出模型相关的任何超参数（hyper-parameter）。 
    	比如这里将学习率放在 params 中。
    """
    # 定义神经网络的结构并通过输入的到前向传播的结果
    predict = lenet(
        features["image"], mode == tf.estimator.ModeKeys.TRAIN)

    # 如果有预测模式，那么只需要将结果返回即可。
    if mode == tf.estimator.ModeKeys.PREDICT:
        return tf.estimator.EstimatorSpec(
            mode=mode,
            predictions={"result": tf.argmax(predict, 1)})
    loss = tf.reduce_mean(
        tf.nn.sparse_softmax_cross_entropy_with_logits(
           logits=predict, labels=labels))

    optimizer = tf.train.GradientDescentOptimizer(
        learning_rate=params["learning_rate"])

    train_op = optimizer.minimize(
        loss=loss, global_step=tf.train.get_global_step())

    eval_metric_ops = {
        "accuracy": tf.metrics.accuracy(
            tf.argmax(predict, 1), labels)
    }

    return tf.estimator.EstimatorSpec(
        mode=mode,
        loss=loss,
        train_op=train_op,
        eval_metric_ops=eval_metric_ops)

mnist = input_data.read_data_sets("../../datasets/MNIST_data", one_hot=False)
model_params = {"learning_rate": 0.01}
estimator = tf.estimator.Estimator(model_fn=model_fn, params=model_params)
train_input_fn = tf.estimator.inputs.numpy_input_fn(
      x={"image": mnist.train.images},
      y=mnist.train.labels.astype(np.int32),
      num_epochs=None,
      batch_size=128,
      shuffle=True)
estimator.train(input_fn=train_input_fn, steps=30000)


##################################################################
# 2. 在测试数据上测试模型
test_input_fn = tf.estimator.inputs.numpy_input_fn(
      x={"image": mnist.test.images},
      y=mnist.test.labels.astype(np.int32),
      num_epochs=1,
      batch_size=128,
      shuffle=False)

test_results = estimator.evaluate(input_fn=test_input_fn)
accuracy_score = test_results["accuracy"]
print("\nTest accuracy: %g %%" % (accuracy_score*100))


##################################################################
# 3. 预测过程
predict_input_fn = tf.estimator.inputs.numpy_input_fn(
      x={"image": mnist.test.images[:10]},
      num_epochs=1,
      shuffle=False)

predictions = estimator.predict(input_fn=predict_input_fn)
for i, p in enumerate(predictions):
    print("Prediction %s: %s" % (i + 1, p["result"]))
```

- 使用数据集（Dataset）作为Estimator输入

Estimator 作为 TensorFlow 官方推荐的高层封装，它可以原生地支持 TensorFlow 中数据处理流程的接口 。

![4Wiuor](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/4Wiuor.png)

