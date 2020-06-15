---
title: "Tensorboard - Advanced visualization"
subtitle: "TF EXAMPLES「4.3」"
layout: post
author: "echisenyang"
header-style: text
hidden: true
catalog: true
tags:
  - TensorFlow
  - 输出计划
---



Going deeper into Tensorboard; visualize the variables, gradients, and more...

### *tf.train.Optimizer*

`apply_gradients`和`compute_gradients`是所有的优化器都有的方法。

![3CUMaR](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/3CUMaR.png)

***在使用它们之前处理梯度***

使用minimize()操作，该操作不仅可以计算出梯度，而且还可以将梯度作用在变量上。如果想在使用它们之前处理梯度，可以按照以下三步骤使用optimizer ：

```python
1、使用函数compute_gradients()计算梯度
2、按照自己的愿望处理梯度(比如梯度截断)
3、使用函数apply_gradients()应用处理过后的梯度
```

#### 使用样例

```
#Now we apply gradient clipping. For this, we need to get the gradients,
#use the `clip_by_value()` function to clip them, then apply them:
threshold = 1.0
optimizer = tf.train.GradientDescentOptimizer(learning_rate)
grads_and_vars = optimizer.compute_gradients(loss)
#list包括的是：梯度和更新变量的元组对
capped_gvs = [(tf.clip_by_value(grad, -threshold, threshold), var) 
             for grad, var in grads_and_vars]
 #执行对应变量的更新梯度操作
training_op = optimizer.apply_gradients(capped_gvs)
```

