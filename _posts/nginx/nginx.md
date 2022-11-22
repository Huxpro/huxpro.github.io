---
layout: default
title: Nginx
nav_order: 3
has_children: true
permalink: docs/nginx
---

# Nginx介绍与理解
{: .no_toc }

Nginx代码结构、工作模式、数据处理与流转过程.
{: .fs-6 .fw-300 }


## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## 需求分析

Nginx是由伊戈尔·赛索耶夫为俄罗斯访问量第二的Rambler.ru站点开发。由此我们可以猜测一下伊戈尔当时面对的情况，访问量巨大，部署更新会中断服务，某请求错误导致进程崩溃进而影响其他请求，代码耦合度高。
针对不同的需求的解决方案：
	• 访问量巨大
	高并发处理能力强
	• 部署更新
	master-woker
	• 崩溃
	master-worker
	• 代码耦合度
	模块化

## 码源文件结构
![文件目录](/assets/images/nginx/code_struct.png)