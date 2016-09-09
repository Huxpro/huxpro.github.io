---
layout:     post
title:      "OpenCV环境搭建"
subtitle:   "Deploy OpenCV"
date:       2016-06-12 8:00:00
author:     "XuXinkun"
header-img: "img/post-bg-deploy-opencv.jpg"
tags:
    - opencv
---

# 前言

我在上本科时候曾经用过`opencv`，那时候还是1.x版本，还必须在linux下自己编译。
时过境迁，最近突然想起来写个小程序来分析图片，就又想起了`opencv`。现在已然是2.4的版本。

# 环境搭建

环境推荐使用fedora18。官方文档介绍可以使用windows。但是经实践，在windows下搭建了很久依然没有搞定。
最终放弃。而使用fedora18，几乎是分分钟搞定。

安装极为简单，只需要运行yum安装即可。

```sh
[root@localhost opencv]#  yum install numpy opencv*
```

如果需要使用`matplotlib`，可以使用`yum install python-matplotlib*`进行安装。

安装完后，进入`python`进行验证：

```sh
[root@localhost opencv]# python
Python 2.7.3 (default, Aug  9 2012, 17:23:57) 
[GCC 4.7.1 20120720 (Red Hat 4.7.1-5)] on linux2
Type "help", "copyright", "credits" or "license" for more information.
>>> import cv2
>>> cv2.__version__
'2.4.6.1'
```

`yum`安装最高只提供到**2.4.6**的版本。如果需要使用最新版本的opencv，则需要自己进行编译。具体步骤可以参看[install-opencv-python-in-fedora](http://opencv-python-tutroals.readthedocs.io/en/latest/py_tutorials/py_setup/py_setup_in_fedora/py_setup_in_fedora.html#install-opencv-python-in-fedora)。

这里特别注意，最新的opencv已经到了**2.4.13**，一些API都已经有了不小的变动，所以在查看文档时，需要对照[opencv api 2.4.6](http://docs.opencv.org/2.4.6/modules/refman.html)进行使用。

# Hello, world

开始第一个程序。`opencv`支持`C++`和`python`。最近几年一直在用`python`，用起来甚是顺手。因此使用`python`进行开发。

程序的效果就是读取`/root/hello.png`图片，并进行显示。

```python
import cv2

filename = '/root/hello.png'
img = cv2.imread(filename)
cv2.imshow('hello', img)
cv2.waitKey(0)
cv2.destroyAllWindows()
```

# 参考资料

- [py_tutorials](http://opencv-python-tutroals.readthedocs.io/en/latest/py_tutorials/py_tutorials.html)
- [opencv api 2.4.6](http://docs.opencv.org/2.4.6/modules/refman.html)