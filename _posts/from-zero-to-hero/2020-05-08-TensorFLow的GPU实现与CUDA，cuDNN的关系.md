---
title: "GPU CUDA cuDNN"
subtitle: "gpt、bert先导知识点"
layout: post
author: "echisenyang"
header-style: text
hidden: true
catalog: true
tags:
  - tools
  - 输出计划
---



### TensorFLow的GPU

只采用CPU在大规模数据集中训练卷积神经网络的速度很慢，因此可以结合图处理单元（Graphic Processing Unit，GPU）进行加速。GPU具有单指令多数据流结构，非常适合用一个程序处理各种大规模并行数据的计算问题。最常用的GPU是英伟达（nvidia）生产的。编写GPU代码可在CUDA环境下进行。

![ApPEYV](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/ApPEYV.png)



### CUDA

CUDA的官方文档是这么介绍CUDA的：a general purpose parallel computing platform and programming model that leverages the parallel compute engine in NVIDIA GPUs to solve many complex computational problems in a more efficient way than on a CPU.

- 换句话说**CUDA是NVIDIA推出的用于自家GPU的并行计算框架**，也就是说CUDA只能在**NVIDIA的GPU**上运行，而且只有当要解决的计算问题是可以**大量并行计算的时候才能发挥CUDA的作用**。

- 如果在一个TensorFlow程序中只需要使用部分GPU，可以通过设置CUDA_VISIBLE_DEVICES环境变量来控制。`CUDA_VISIBLE_DEVICES=O,l python demo_code.py` , TensorFlow也支持在程序中设置环境变量 `os.environ["CUDA_VISIBLE_DEVICES"]="2"` , 也支持动态分配 GPU 的显存 `config.gpu_ options.allow_growth = True` `config.gpu_options.per_process_gpu_memory_fraction = 0.4` 

- nohup命令

```python
CUDA_VISIBLE_DEVICES=0,1 nohup python -u -m nmt.nmt \
--attention=scaled_luong \
--src=szh --tgt=tzh \
--vocab_prefix=/home/jiale/tmp/nmt_933491_data/vocab  \
--train_prefix=/home/jiale/tmp/nmt_933491_data/train_st \
--dev_prefix=/home/jiale/tmp/nmt_933491_data/val_st  \
--test_prefix=/home/jiale/tmp/nmt_933491_data/test_st \
--out_dir=/home/jiale/tmp/nmt_933491_model \
--num_train_steps=120000 \
--steps_per_stats=100 \
--num_layers=2 \
--num_units=128 \
--dropout=0.2 \
--metrics=bleu \
> /home/jiale/tmp/nmt_933491_model/nohup.out 2>&1 &

# tail -f nohup.out -n 30
```

- kill nohup的进程

```python
# 筛选需要kill的进程pid
ps -aux|grep "process name"
kill -9 pid
```



### cuDNN

**cuDNN**（CUDA Deep Neural Network library）：**是NVIDIA打造的针对深度神经网络的加速库**，是一个用于深层神经网络的GPU加速库。

- 如果你要用GPU训练模型，cuDNN不是必须的，但是一般会采用这个加速库。

- 服务器版本记录

```python
nvcc --version
>>> Cuda compilation tools, release 9.1, V9.1.85
cat /usr/local/cuda/version.txt
>>> CUDA Version 9.0.176
cat /usr/local/cuda/include/cudnn.h | grep CUDNN_MAJOR -A 2
>>> 7.1.4
```



### There are a few things to note:

- As of version 1.2, TensorFlow no longer provides GPU support on macOS.

- **On macOS, Python 3.6 might gives warning but still works**.

- TensorFlow with GPU support will only work with CUDA® Toolkit 8.0 and cuDNN v6.0, not the newest CUDA and cnDNN version. Make sure that you install the correct CUDA and cuDNN versions to avoid frustrating issues.

- If you see the warning: `Your CPU supports instructions that this TensorFlow binary was not compiled to use: SSE4.1 SSE4.2 AVX AVX2 FMA` it's because you didn't install TensorFlow from sources to take advantage of all these settings. You can choose to install TensorFlow from sources -- the process might take up to 30 minutes. **To silence the warning**, add this before importing TensorFlow:

```python
import os
os.environ['TF_CPP_MIN_LOG_LEVEL']='2'
```



