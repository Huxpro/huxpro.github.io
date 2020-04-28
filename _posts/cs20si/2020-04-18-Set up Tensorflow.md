---
title: "Set up Tensorflow"
subtitle: "CS 20SI「00」"
layout: post
author: "echisenyang"
header-style: text
hidden: true
catalog: true
tags:
  - 笔记
  - 课程
  - TensorFlow
---



## **「CS 20SI」setup_instruction**

For this course, I will use **Python 3.6** and **TensorFlow 1.4**. 

You don't need GPU for most code examples in this course, though having GPU won't hurt. If you install TensorFlow on your local machine, my ecommendation is always set up Tensorflow using virtualenv.

There are a few things to note:

- As of version 1.2, TensorFlow no longer provides GPU support on macOS.

- **On macOS, Python 3.6 might gives warning but still works**.

- TensorFlow with GPU support will only work with CUDA® Toolkit 8.0 and cuDNN v6.0, not the newest CUDA and cnDNN version. Make sure that you install the correct CUDA and cuDNN versions to avoid frustrating issues.

- If you see the warning: `Your CPU supports instructions that this TensorFlow binary was not compiled to use: SSE4.1 SSE4.2 AVX AVX2 FMA` it's because you didn't install TensorFlow from sources to take advantage of all these settings. You can choose to install TensorFlow from sources -- the process might take up to 30 minutes. **To silence the warning**, add this before importing TensorFlow:

```python
import os
os.environ['TF_CPP_MIN_LOG_LEVEL']='2'
```

服务器版本记录

```python
nvcc --version
>>> Cuda compilation tools, release 9.1, V9.1.85
cat /usr/local/cuda/version.txt
>>> CUDA Version 9.0.176
cat /usr/local/cuda/include/cudnn.h | grep CUDNN_MAJOR -A 2
>>> 7.1.4
```

![ApPEYV](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/ApPEYV.png)

生成requirements.txt文件 `pip freeze > requirements.txt`

安装requirements.txt依赖 `pip install -r requirements.txt`

```python
tensorflow==1.4.1
scipy==1.0.0
scikit-learn==0.19.1
matplotlib==2.1.1
xlrd==1.1.0
ipdb==0.10.3
Pillow==5.0.0
lxml==4.1.1
```

