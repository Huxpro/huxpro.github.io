---
title: "Variational Auto-Encoder(Unsupervised)"
subtitle: "TF EXAMPLES「3.8」"
layout: post
author: "echisenyang"
header-style: text
hidden: true
catalog: true
tags:
  - TensorFlow
  - 输出计划
---



Build a variational auto-encoder (VAE), to encode and generate images from noise.

## AutoEncoder

![7TViXH](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/7TViXH.jpg)

- 这里我们可以看到，AutoEncoder在优化过程中无需使用样本的label，本质上是把样本的输入同时作为神经网络的输入和输出，通过**最小化重构误差**希望学习到样本的抽象特征表示z。这种无监督的优化方式大大提升了模型的通用性。
- 对于基于神经网络的AutoEncoder模型来说，则是**encoder部分通过逐层降低神经元个数来对数据进行压缩**；**decoder部分基于数据的抽象表示逐层提升神经元数量**，最终实现对输入样本的重构。
- 这里指的注意的是，由于AutoEncoder通过神经网络来学习每个样本的唯一抽象表示，这会带来一个问题：当神经网络的参数复杂到一定程度时AutoEncoder很容易**存在过拟合的风险**。



## Denoising AutoEncoder

为了缓解经典AutoEncoder容易过拟合的问题，一个办法是在输入中**加入随机噪声**；

- Vincent等人[3]提出了Denoising AutoEncoder，在传统AutoEncoder**输入层加入随机噪声**来增强模型的鲁棒性。

另一个办法就是结合正则化思想，

- Rifai等人[4]提出了Contractive AutoEncoder，通过在AutoEncoder**目标函数中加上encoder的Jacobian矩阵范式**来约束使得encoder能够学到具有抗干扰的抽象特征。

下图是Denoising AutoEncoder的模型框架。目前添加噪声的方式大多分为两种：

- 添加服从特定分布的随机噪声；随机将输入x中特定比例置为0。有没有觉得第二种方法跟现在广泛使用的Dropout很相似，但是Dropout方法是Hinton等人在2012年才提出来的，
- 而第二种加噪声的方法在08年就已经被应用了。这其中的关系，就留给你思考一下。

![rqklLX](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/rqklLX.jpg)



## CNN/LSTM AutoEncoder

其实无论是Convolutional Autoencoder[6]、 Recursive Autoencoder还是LSTM Autoencoder[7]等等，思路都是将传统NN网络的结构融入到AutoEncoder中。

以LSTM AutoEncoder为例，目标是针对输入的样本序列学习得到抽象特征z。因此encoder部分是输入一个样本序列输出抽象特征z，采用如下的Many-to-one LSTM；**而decoder部分则是根据抽象特征z，重构出序列**，采用如下的One-to-many LSTM。

![WKVrnJ](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/WKVrnJ.jpg)

将传统NN网络的结构引入AutoEncoder其实更多是一个大概的思想，具体实现的时候，编码器和解码器都是不固定的，可选的有CNN/RNN/双向RNN/LSTM/GRU等等，而且可以根据需要自由组合。

## Variational AutoEncoder

Vairational AutoEncoder（VAE）是Kingma等人与2014年提出。VAE比较大的不同点在于：VAE不再将输入x映射到一个固定的抽象特征z上，而是假设样本x的抽象特征z服从（μ，σ^2）的正态分布，然后再通过分布生成抽象特征z。最后基于z通过decoder得到输出。模型框架如下图所示：

![VQNzv2](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/VQNzv2.jpg)

由于抽象特征z是从正态分布采样生成而来，因此**VAE的encoder部分是一个生成模型**，然后再结合decoder来实现重构保证信息没有丢失。VAE是一个里程碑式的研究成果，倒不是因为他是一个效果多么好的生成模型，主要是**提供了一个结合概率图的思路来增强模型的鲁棒性**。后续有很多基于VAE的扩展，包括infoVAE、betaVAE和factorVAE等。

### Glorot init

```python
def glorot_init(shape):
    return tf.random_normal(shape=shape, stddev=1. / tf.sqrt(shape[0] / 2.))
```



<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/yJt4xC.png" alt="yJt4xC" style="zoom:50%;" />

### VAE

![qWQWhk](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/qWQWhk.jpg)

看出了什么问题了吗？如果像这个图的话，我们其实完全不清楚：**究竟经过重新采样出来的Zk，是不是还对应着原来的Xk，所以我们如果直接最小化D(X̂ k,Xk)^2（这里D代表某种距离函数）是很不科学的，而事实上你看代码也会发现根本不是这样实现的**。





## Adversarial AutoEncoder

既然说到生成模型引入AutoEncoder，那必定也少不了将GAN的思路引入AutoEncoder[9]，也取得了不错的效果。

对抗自编码器的网络结构主要分成两大部分：自编码部分（上半部分）、GAN判别网络（下半部分）。整个框架也就是GAN和AutoEncoder框架二者的结合。训练过程分成两个阶段：首先是样本重构阶段，通过梯度下降更新自编码器encoder部分、以及decoder的参数、使得重构损失函数最小化；然后是正则化约束阶段，交替更新判别网络参数和生成网络（encoder部分）参数以此提高encoder部分混淆判别网络的能力。

一旦训练完毕，自编码器的encoder部分便学习到了从样本数据x到抽象特征z的映射关系。

![f9g3rY](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/f9g3rY.jpg)

