---
title: "Prerequisite"
subtitle: "TF EXAMPLES「0」"
layout: post
author: "echisenyang"
header-style: text
hidden: true
catalog: true
tags:
  - TensorFlow
---



### An Introduction to Machine Learning Theory and Its Applications: A Visual Tutorial with Examples

![G47lrS](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/G47lrS.jpg)

- 什么是机器学习？
  - 我的理解：数据驱动，学习模型，解决问题

- 主要分为监督学习与无监督学习两大类
  - **Supervised machine learning:** The program is “trained” on a pre-defined set of “training examples”, which then facilitate its ability to reach an accurate conclusion when given new data.
  - **Unsupervised machine learning:** The program is given a bunch of data and must find patterns and relationships therein.



### A Gentle Guide to Machine Learning

- 什么是机器学习？
  - Machine Learning is a subfield within Artificial Intelligence that builds algorithms that allow computers to learn to perform tasks from data **instead of being explicitly programmed**.



### MNIST Dataset Introduction

Most examples are using MNIST dataset of handwritten digits. The dataset contains **60,000** examples for training and **10,000** examples for testing. The digits have been size-normalized and centered in a fixed-size image (**28x28 pixels**) with values **from 0 to 1**. For simplicity, **each image has been flatten and converted to a 1-D numpy array of 784 features (28*28)**.



#### Google的gfile模块

```python
SOURCE_URL = 'http://yann.lecun.com/exdb/mnist/'

def maybe_download(filename, work_directory):
  """Download the data from Yann's website, unless it's already here."""
  # 检查工作目录
  if not tf.gfile.Exists(work_directory):
  	tf.gfile.MakeDirs(work_directory)
  # 检查路径
  filepath = os.path.join(work_directory, filename)
  if not tf.gfile.Exists(filepath):
    # 如果本地没有文件，则从远程下载，并将远程获取的数据存入指定的路径
    filepath, _ = urllib.request.urlretrieve(SOURCE_URL + filename, filepath)
    # 类似于 python的open函数
    with tf.gfile.GFile(filepath) as f:
      size = f.Size()
    print('Successfully downloaded', filename, size, 'bytes.')
  return filepath
```

```python
def _read32(bytestream):
  # 控制 byte order
  # ref: https://stackoverflow.com/questions/39091765/regarding-using-dtype-newbyteorder
  dt = numpy.dtype(numpy.uint32).newbyteorder('>')
  return numpy.frombuffer(bytestream.read(4), dtype=dt)[0]


def extract_images(filename):
  """Extract the images into a 4D uint8 numpy array [index, y, x, depth]."""
  print('Extracting', filename)
  with tf.gfile.Open(filename, 'rb') as f, gzip.GzipFile(fileobj=f) as bytestream:
    magic = _read32(bytestream)
    if magic != 2051:
      raise ValueError(
          'Invalid magic number %d in MNIST image file: %s' %
          (magic, filename))
    num_images = _read32(bytestream)
    rows = _read32(bytestream)
    cols = _read32(bytestream)
    buf = bytestream.read(rows * cols * num_images)
    data = numpy.frombuffer(buf, dtype=numpy.uint8)
    data = data.reshape(num_images, rows, cols, 1)
    return data
```

```python
VALIDATION_SIZE = 5000
validation_images = train_images[:VALIDATION_SIZE]
validation_labels = train_labels[:VALIDATION_SIZE]
train_images = train_images[VALIDATION_SIZE:]
train_labels = train_labels[VALIDATION_SIZE:]

# 切分训练集、验证集、测试集
data_sets.train = DataSet(train_images, train_labels, dtype=dtype)
data_sets.validation = DataSet(validation_images, validation_labels,
dtype=dtype)
data_sets.test = DataSet(test_images, test_labels, dtype=dtype)
```

#### mnist

```python
# Import MNIST
from tensorflow.examples.tutorials.mnist import input_data
mnist = input_data.read_data_sets("/home/jiale/codes/2020gogogo", one_hot=True)

# Load data
X_train = mnist.train.images # (55000, 784)
Y_train = mnist.train.labels # (55000, 10)
X_test = mnist.test.images # (10000, 784)
Y_test = mnist.test.labels # (10000, 10)

# Get the next 64 images array and labels
batch_X, batch_Y = mnist.train.next_batch(64) # (64, 784), (64, 10)
```

