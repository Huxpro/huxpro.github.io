---
layout:     post
title: master-worker
author:     "Jay"
catalog: true
header-style: text
tags:
  - Nginx
---
## master-worker

master责任：
	管理worker进程，也就是向worker发送命令，具体来说包含：接受来自外界的信号，向worker发送信号，监控worker进程。
worker责任：
         接收、处理、响应请求。
管理：
master管理监控worker，那么master与worker直接需要通信，假定我们以多进程的方式运行，则可供选择的方式有


## Master进程
![main](/_post/nginx/images/main.png)
