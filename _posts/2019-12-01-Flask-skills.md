---
layout:     post
title:      "Flask的异步及多线程"
subtitle:   " \"Asynchronous and Multithreading in Flask\""
date:       2018-12-01 12:00:00
author:     "Mkd"
header-img: "img/post-bg-2015.jpg"
tags:
    - Flask
    - Python
---
>  作为著名Python web框架之一的Flask，具有简单轻量、灵活、扩展丰富且上手难度低的特点，因此成为了机器学习和深度学习模型上线跑定时任务，提供API的首选框架。  
> 众所周知，Flask默认支持`非阻塞IO`的，当`请求A`还未完成时候，`请求B`需要等待`请求A`完成后才能被处理，所以效率非常低。但是线上任务通常需要异步、高并发等需求，本文总结一些在日常使用过程中所常用的技巧。

## 一、前沿  
  
