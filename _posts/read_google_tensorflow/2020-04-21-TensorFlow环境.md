---
title: "TensorFlow环境"
subtitle: "TensorFlow：实战Google深度学习框架「02」"
layout: post
author: "echisenyang"
header-style: text
hidden: true
catalog: true
tags:
  - TensorFlow
---



## TensorFlow环境

### TensorFlow的主要依赖包

- **Protocol Buffer**：是谷歌开发的处理结构化数据的工具，在 TensorFlow 中大部分数据结构都是通过 Protocol Buffer 的形式存储的。（有点像c++中的结构体？）
  - 将结构化的数据序列化，井从序列化之后的数据流中还原出原来的结构化数据，统称为处理结构化数据，这就是 Protocol Buffer 解决的主要问题。
  - 除 Protocol Buffer 之外， XML 和 JSON 是两种比较常用的结构化数据处理工具。

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/DyxcN5.png" alt="DyxcN5" style="zoom: 33%;" />

- **Bazel**：谷歌开源的自动化构建工具，谷哥大内部绝大部分的应用都是通过它来编译的。
  - 相比传统的 Makefile、 Ant 或者 Maven, Bazel 在速度 、可伸缩性、 灵活性以及对不 同 程序语言和平台 的支持上都要更 加出色。

