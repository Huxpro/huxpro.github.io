---
layout:     post
title: Nginx Connection 连接过程
author:     "Jay"
catalog: true
header-style: text
tags:
  - Nginx
---

## 监听与连接
在Nginx main函数的ngx_init_cycle()方法中，调用了ngx_open_listening_sockets函数，这个函数负责将创建的监听套接字进行套接字选项的设置（比如非阻塞、接受发送的缓冲区、绑定、监听处理）
HTTP模块初始化优先于Event模块，HTTP模块通过ngx_http_block()方法进行初始化，然后调用ngx_http_optimize_servers()进行套接字的创建和初始化（ngx_http_init_listening、ngx_http_add_listening、ngx_create_listening）。根据每一个IP地址:port这种配置创建监听套接字。
ngx_http_add_listening函数，还会将ls->handler监听套接字的回调函数设置为ngx_http_init_connection。ngx_http_init_connection此函数主要初始化一个客户端连接connection。
Event模块的初始化主要调用ngx_event_process_init()函数。该函数每个worker工作进程都会初始化调用。然后设置read/write的回调函数。
ngx_event_process_init函数中，会将接收客户端连接的事件，设置为rev->handler=ngx_event_accept方法，ngx_event_accept方法，只有在第一次客户端和Nginx服务端创建连接关系的时候调用。
当客户端有连接上来，Nginx工作进程就会进入事件循环（epoll事件循环函数：ngx_epoll_process_events），发现有read读取的事件，则会调用ngx_event_accept函数。
调用ngx_event_accept函数，会调用ngx_get_connection方法，得到一个客户端连接结构：ngx_connection_t结构。ngx_event_accept函数最终会调用监听套接字的handler回调函数，ls->handler(c);  。
从流程3中，我们知道ls->handler的函数对应ngx_http_init_connection方法。此方法主要初始化客户端的连接ngx_connection_t，并将客户端连接read读取事件的回调函数修改成rev->handler = ngx_http_wait_request_handler
也就是说，当客户端连接上来，第一次事件循环的read事件会调用回调函数：ngx_event_accept函数；而后续的read事件的handler已经被ngx_http_init_connection方法修改掉，改成了ngx_http_wait_request_handler函数了。所以客户端的读取事件都会走ngx_http_wait_request_handler函数。
ngx_http_wait_request_handler函数也是整个HTTP模块的数据处理的入口函数了。
如下图表格：
![connection](/_post/nginx/images/connection.png)


## 问题疑难点
### 如何做到只有一个worker监听一个请求？
worker进程都是从master进程fork出来，此时master已经建立完成对socket的listen。
因此每个worker都能获取完整的listenfd表。当有新连接到来listenfg变成可读，每个work在注册listenfd读事件前抢accept_mutex，抢到互斥锁的worker注册listenfd读事件，在读事件里调用accept接受该连接。

### 避免所有连接被一个worker监听
已获取的请求数/8>剩余可用，才能获取   
```c
ngx_accept_disabled = ngx_cycle->connection_n / 8
    - ngx_cycle->free_connection_n;

if (ngx_accept_disabled > 0) {
    ngx_accept_disabled--;

} else {
    if (ngx_trylock_accept_mutex(cycle) == NGX_ERROR) {
        return;
    }

    if (ngx_accept_mutex_held) {
        flags |= NGX_POST_EVENTS;

    } else {
        if (timer == NGX_TIMER_INFINITE
                || timer > ngx_accept_mutex_delay)
        {
            timer = ngx_accept_mutex_delay;
        }
    }
}
```
