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
> 异步和多线程有什么区别？其实，异步是目的，而多线程是实现这个目的的方法。异步是说，A发起一个操作后（一般都是比较耗时的操作，如果不耗时的操作就没有必要异步了），可以继续自顾自的处理它自己的事儿，不用干等着这个耗时操作返回。  
> 实现异步可以采用多线程技术或则交给另外的进程来处理,详解常见[这里](https://www.cnblogs.com/dream844/archive/2012/06/12/2546083.html)。

## 二、实现方法  
- Flask启动自带方法
- 采用gunicorn部署
### 1、Flask中自带方法实现  
 
 > run.py  
   
```Python 
#!/usr/bin/env python  
# -*- coding: utf-8 -*-  
# @Time    : 2018-12-01 16:37  
# @Author  : mokundong  
from flask import Flask  
import socket  
from time import sleep  

myhost = socket.gethostbyname(socket.gethostname())  
app = Flask(__name__)  

@app.route('/job1')  
def some_long_task1():  
    print("Task #1 started!")  
    sleep(10)  
    print("Task #1 is done!")  

@app.route('/job2')  
def some_long_task2(arg1, arg2):  
    print("Task #2 started with args: %s %s!" % (arg1, arg2))
    sleep(5)  
    print("Task #2 is done!")  

if __name__ == '__main__':  
    app.run(host=myhost,port=5000,threaded=True)  
```  
  
`app.run(host=xxx,port=xx,threaded=True)`
中threaded开启后则不需要等队列。 
### 2、gunicorn部署  
> Gunicorn 是一个高效的Python WSGI Server,通常用它来运行 wsgi application 或者 wsgi framework(如Django,Paster,Flask),地位相当于Java中的Tomcat。gunicorn 会启动一组 worker进程，所有worker进程公用一组listener，在每个worker中为每个listener建立一个wsgi server。每当有HTTP链接到来时，wsgi server创建一个协程来处理该链接，协程处理该链接的时候，先初始化WSGI环境，然后调用用户提供的app对象去处理HTTP请求。
> 关于gunicorn的详细说明，可以参考[这里](https://gunicorn.org/)。  

> 使用命令行启动gunicorn有两种方式获取配置项，一种是在命令行配置，一种是在配置文件中获取。 
 
> run.py  

```Python
#!/usr/bin/env python  
# -*- coding: utf-8 -*-  
# @Time    : 2018-12-01 17:00  
# @Author  : mokundong  
from flask import Flask  
from time import sleep  

app = Flask(__name__)  

@app.route('/job1')  
def some_long_task1():  
    print("Task #1 started!")  
    sleep(10)  
    print("Task #1 is done!")  

@app.route('/job2')  
def some_long_task2(arg1, arg2):  
    print("Task #2 started with args: %s %s!" % (arg1, arg2))
    sleep(5)  
    print("Task #2 is done!")  

if __name__ == '__main__':  
    app.run()  
```  

#### 命令行配置  
```bash
gunicorn --workers=4 --bind=127.0.0.1:8000 run:app
```  
更多配置见官网  

#### 配置文件获取配置  
> gunicorn_config.py  
 
```Python 
#!/usr/bin/env python  
# -*- coding: utf-8 -*-  
# @Time    : 2018-12-01 17:10  
# @Author  : mokundong  
import os
import socket
import multiprocessing
import gevent.monkey

gevent.monkey.patch_all()
myhost = socket.gethostbyname(socket.gethostname())  

debug = False
loglevel = 'info'
hosts = get_host_ip()
bind = hosts+":5000"
timeout = 30      #超时

pidfile = "log/gunicorn.pid"
accesslog = "log/access.log"
errorlog = "log/debug.log"

daemon = True #意味着开启后台运行，默认为False
workers = 4 # 启动的进程数
threads = 2 #指定每个进程开启的线程数
worker_class = 'gevent' #默认为sync模式，也可使用gevent模式。
x_forwarded_for_header = 'X-FORWARDED-FOR'
```  
  
> 启动命令如下 
>  
```bash  
gunicorn -c gunicorn_config.py run:app
```  

## 三、补充  
### 1、关于线程的补充
> 在工作中我还遇到一种情况，当一个请求过来后，我需要两种回应，一个是及时返回app运行结果，第二个响应是保存数据到日志或者数据库。往往我们在写数据的过程中会花销一定的时间，导致结果返回会有所延迟，因此我们需要用两个线程处理这两个任务，那么我们如下处理。

> run.py  

```Python
#!/usr/bin/env python  
# -*- coding: utf-8 -*-  
# @Time    : 2018-12-01 17:20  
# @Author  : mokundong
from flask import Flask,request
from time import sleep
from concurrent.futures import ThreadPoolExecutor
executor = ThreadPoolExecutor(2)
app = Flask(__name__)

@app.route('/job')
def run_jobs():
    executor.submit(some_long_task1)
    executor.submit(some_long_task2, 'hello', 123)
    return 'Two jobs was launched in background!'
def some_long_task1():
    print("Task #1 started!")
    sleep(10)
    print("Task #1 is done!")

def some_long_task2(arg1, arg2):
    print("Task #2 started with args: %s %s!" % (arg1, arg2))
    sleep(5)
    print("Task #2 is done!")

if __name__ == '__main__':
    app.run()
```  
### 2、关于获取IP的补充
> 上述代码中通过获取`hostname`，然后再通过`hostname`反查处机器的IP。这个方法是不推荐的。因为很多的机器没有规范这个`hostname`的设置。 
> 另外就是有些服务器会在 `/etc/hosts` 中添加本机的`hostname`的地址，这个做法也不是不可以，但是如果设置成了 `127.0.0.1`，那么获取出来的IP就都是这个地址了。 
> 这里给出一种优雅的方式获取IP，利用 UDP 协议来实现的，生成一个UDP包，把自己的 IP 放如到 UDP 协议头中，然后从UDP包中获取本机的IP。  
```Python
#!/usr/bin/env python  
# -*- coding: utf-8 -*-  
# @Time    : 2018-12-01 17:30  
# @Author  : mokundong
# 可以封装成函数，方便 Python 的程序调用
import socket
 
def get_host_ip():
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(('8.8.8.8', 80))
        ip = s.getsockname()[0]
    finally:
        s.close()
 
    return ip
``` 

## 总结  
在写作过程中才发现自己知识漏洞不是一般多，共勉！