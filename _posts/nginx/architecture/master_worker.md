---
layout: default
title: master-worker
parent: Nginx Architecture
grand_parent: Nginx
nav_order: 1
# permalink: docs/nginx/architecture/
---

*2021-03-08*
# ngx_http_request_body.c
{: .no_toc }

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## master-worker

master责任：
	管理worker进程，也就是向worker发送命令，具体来说包含：接受来自外界的信号，向worker发送信号，监控worker进程。
worker责任：
         接收、处理、响应请求。
管理：
master管理监控worker，那么master与worker直接需要通信，假定我们以多进程的方式运行，则可供选择的方式有


## Master进程
![main](/assets/images/nginx/main.png)