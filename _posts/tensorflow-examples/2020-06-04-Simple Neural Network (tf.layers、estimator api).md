---
title: "NN(tf.layers、estimator api)"
subtitle: "TF EXAMPLES「3.2」"
layout: post
author: "echisenyang"
header-style: text
hidden: true
catalog: true
tags:
  - TensorFlow
  - 输出计划
---



Use TensorFlow 'layers' and 'estimator' API to build a simple neural network (a.k.a Multi-layer Perceptron) to classify MNIST digits dataset.

- TensorFlow 的高层次机器学习 API(tf.estimator) 使得配置，训练，和评估各种各样的机器学习模型变得更加的容易。
- 与TFLearn不同的是，Keras和Estimator都己经加入了TensorFlow代码库，而且它们是使用最为广泛的TensorFlow高层封装。

![](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/SwDf6C.jpg)

> 高级API

`tf.keras` 好用！本来是一个独立的深度学习库，tensorflow将其学习过来，增加这部分模块在于快速构建模型

`tf.layes` 以更高级的概念层来定义一个模型，类似 `tf.keras`

`tf.contrib` tf.contrib.layers提供能够将计算图中的 网络层、正则化、摘要操作 睡构建计算图的高级操作，但是tf.contrib包含不稳定的代码，后续的版本可能会改变

`tf.estimator` 一个estimator相当于 model+training+evaluate的合体，在模块中，已经实现了几种简单的分类和回归器，包括：baseline、learing和dnn，这里的dnn网络只是全连接层，没有提供卷积之类的

### tf.layers.dense用法

dense：全连接层

相当于添加一个层，即初学的add_layer()函数

```python
tf.layers.dense(
    inputs,
    units,
    activation=None,
    use_bias=True,
    kernel_initializer=None,
    bias_initializer=tf.zeros_initializer(),
    kernel_regularizer=None,
    bias_regularizer=None,
    activity_regularizer=None,
    kernel_constraint=None,
    bias_constraint=None,
    trainable=True,
    name=None,
    reuse=None
)
"""
inputs:该层的输入。
units: 输出的大小（维数），整数或long。
activation: 使用什么激活函数（神经网络的非线性层），默认为None，不使用激活函数。
use_bias: 使用bias为True（默认使用），不用bias改成False即可。
kernel_initializer:权重矩阵的初始化函数。 如果为None（默认值），则使用tf.get_variable使用的默认初
				   始化程序初始化权重。
bias_initializer:bias的初始化函数。
kernel_regularizer：权重矩阵的正则函数。
bias_regularizer：bias的的正则函数。
activity_regularizer:输出的的正则函数。
kernel_constraint:由优化器更新后应用于内核的可选投影函数（例如，用于实现层权重的范数约束或值约束）。 
				  该函数必须将未投影的变量作为输入，并且必须返回投影变量（必须具有相同的形状）。 在进
				  行异步分布式培训时，使用约束是不安全的。
bias_constraint:由优化器更新后应用于偏差的可选投影函数。
trainable:Boolean，如果为True，还将变量添加到图集collectionGraphKeys.TRAINABLE_VARIABLES
		 （参见tf.Variable）。
name:名字
reuse:Boolean，是否以同一名称重用前一层的权重。
"""
```

### tf.estimator.Estimator

#### step1: 构建model_fn

```python
def model_fn(features, labels, mode, params):
   # Logic to do the following:
   # 1. Configure the model via TensorFlow operations
   # 2. Define the loss function for training/evaluation
   # 3. Define the training operation/optimizer
   # 4. Generate predictions
   # 5. Return predictions/loss/train_op/eval_metric_ops in EstimatorSpec object
   return EstimatorSpec(mode, predictions, loss, train_op, eval_metric_ops)

"""
model_fn接受3个参数：
	features：
		一个字典（dict），它包含的特征会通过input_fn传给模型
	labels：
		一个Tensor，它包含的labels会通过input_fn传给模型。对于predict()的调用该labels会为空，该模
		型会infer出这些值。
	mode: 
		tf.estimator.ModeKeys的其中一种字符串值，可以表示model_fn会被哪种上下文所调用：
        	tf.estimator.ModeKeys.TRAIN： 
        		model_fn将在training模式下通过一个train()被调用
	        tf.estimator.ModeKeys.EVAL： 
	        	model_fn将在evaluation模式下通过一个evaluate()被调用
    	    tf.estimator.ModeKeys.PREDICT：
    	    	model_fn将在predict模式下通过一个predict()被调用

model_fn也接受一个params参数，它包含了一个用于训练的超参数字典（所上所述）
	该函数体会执行下面的任务：
		配置模型：对于这里的示例任务，就是一个NN.
		定义loss function：来计算模型的预测与target值有多接近
		定义training操作：指定了optimizer算法来通过loss function最小化loss。

model_fn必须返回一个tf.estimator.EstimatorSpec对象，它包含了以下的值：
	mode(必须):
		该模型以何种模式运行。通常，这里你将返回model_fn的mode参数
	predictions（在PREDICT模式下必须）:
		它是一个字典，包含了所选Tensor（它包含了模型预测）的key names，
		例如：predictions = {“results”: tensor_of_predictions}。
		在PREDICT模式下，你在EstimatorSpec中返回的该字典，会接着被predict()返回。
		因此，你可以你喜欢的格式来构建它
	loss（在EVAL 和 TRAIN模式下必须）:
		一个Tensor包含了一个标量的loss值：模型的loss function的输出（将在下面详细说明）。
		在TRAIN模式下用于error handling和logging，在EVAL模式下自动当成是一个metric。
	train_op（在TRAIN模式下必须）:
		一个Op，它可以运行训练的一个step。
	eval_metric_ops（可选参数）:
		一个name/value pairs的字典，它指定了在EVAL模式下模型运行的metrics。
		其中，name是一个你要选择的metrics的标签，值就是你的metric计算的结果。
		tf.metrics 模块提供了一些常用metrics的预定义函数。
			下面的eval_metric_ops包含了一个“accuracy” metric，使用tf.metrics.accuracy进行计
			算：eval_metric_ops={“accuracy”: tf.metrics.accuracy(labels, predictions)}。
		如果你不指定eval_metric_ops，loss只会在evaluation期间被计算。
"""
```

#### step2: 实例化一个Estimator

当你要从头创建自己的estimator时，构造函数会接受两个高级参数进行模型配置，model_fn和params。

```python
model = tf.estimator.Estimator(model_fn=model_fn, params=model_params)
"""
model_fn: 一个函数对象，它包含了所有前面提到的逻辑：支持training, evaluation, prediction。你只负责
		  实现功能。下面会讲述所何构建model_fn。
params：一个可选的超参数字典（例如：learning_rate，dropout），它们会被传给model_fn。
"""
```

#### step3: 接着你可以去train/evaluate/predict

```python
# Build the Estimator
model = tf.estimator.Estimator(model_fn)

# Define the input function for training
input_fn = tf.estimator.inputs.numpy_input_fn(
    x={'images': mnist.train.images}, y=mnist.train.labels,
    batch_size=batch_size, num_epochs=None, shuffle=True)
# Train the Model
model.train(input_fn, steps=num_steps)

# Evaluate the Model
# Define the input function for evaluating
input_fn = tf.estimator.inputs.numpy_input_fn(
    x={'images': mnist.test.images}, y=mnist.test.labels,
    batch_size=batch_size, shuffle=False)
# Use the Estimator 'evaluate' method
e = model.evaluate(input_fn)

print("Testing Accuracy:", e['accuracy'])
```

![vQvPnw](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/vQvPnw.png)

![ZyIrbs](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/ZyIrbs.png)

![Vnqm70](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/Vnqm70.png)

