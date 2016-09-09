---
layout:     post
title:      "nginx健康检查模块源码分析"
subtitle:   "nginx_upstream_check_module Analysis"
date:       2016-03-17 8:00:00
author:     "XuXinkun"
header-img: "img/post-bg-nginx.jpg"
tags:
    - nginx
---

# nginx健康检查模块

本文所说的nginx健康检查模块是指nginx_upstream_check_module模块。[nginx_upstream_check_module模块](https://github.com/yaoweibin/nginx_upstream_check_module)是Taobao定制的用于健康检查的模块。

其主要作用是根据配置，对upstream中的每个server进行定期健康检查，在其超时或连续多次失败后，将其置为down状态。

其基本用法如下：

    upstream cluster {

        # simple round-robin
        server 192.168.0.1:80;
        server 192.168.0.2:80;

        check interval=5000 rise=1 fall=3 timeout=4000;
    }
    
更多的用法可以参看[README](https://github.com/yaoweibin/nginx_upstream_check_module/blob/master/README)。

# 模块源码分析

分析的版本是[TAG:v0.3.0](https://github.com/yaoweibin/nginx_upstream_check_module/tree/v0.3.0)。

## 模块定义

ngx_http_upstream_check_module模块的定义在这里。

    ngx_module_t  ngx_http_upstream_check_module = {
        NGX_MODULE_V1,
        &ngx_http_upstream_check_module_ctx,   /* module context */
        ngx_http_upstream_check_commands,      /* module directives */
        NGX_HTTP_MODULE,                       /* module type */
        NULL,                                  /* init master */
        NULL,                                  /* init module */
        ngx_http_upstream_check_init_process,  /* init process */
        NULL,                                  /* init thread */
        NULL,                                  /* exit thread */
        NULL,                                  /* exit process */
        NULL,                                  /* exit master */
        NGX_MODULE_V1_PADDING
    };
    
ngx_http_upstream_check_module_ctx用于描述模块的一些上下文。

    static ngx_http_module_t  ngx_http_upstream_check_module_ctx = {
        NULL,                                    /* preconfiguration */
        NULL,                                    /* postconfiguration */
    
        ngx_http_upstream_check_create_main_conf,/* create main configuration */
        ngx_http_upstream_check_init_main_conf,  /* init main configuration */
    
        ngx_http_upstream_check_create_srv_conf, /* create server configuration */
        NULL,                                    /* merge server configuration */
    
        ngx_http_upstream_check_create_loc_conf, /* create location configuration */
        ngx_http_upstream_check_merge_loc_conf   /* merge location configuration */
    };
    
`ngx_http_upstream_check_module_ctx`中比较需要关注的是`ngx_http_upstream_check_create_srv_conf`，用于产生本模块server级别的配置。因为check的配置时在upstream里，属于server级别。所有`ngx_http_upstream_check_create_srv_conf`会为每个upstream产生一个`ngx_http_upstream_check_srv_conf_t`配置。

## 配置分解

`ngx_http_upstream_check_srv_conf_t`即`ngx_http_upstream_check_srv_conf_s`的结构如下：

    struct ngx_http_upstream_check_srv_conf_s {
        ngx_uint_t                               port;
        ngx_uint_t                               fall_count;
        ngx_uint_t                               rise_count;
        ngx_msec_t                               check_interval;
        ngx_msec_t                               check_timeout;
        ngx_uint_t                               check_keepalive_requests;
    
        ngx_check_conf_t                        *check_type_conf;
        ngx_str_t                                send;
    
        union {
            ngx_uint_t                           return_code;
            ngx_uint_t                           status_alive;
        } code;
    
        ngx_array_t                             *fastcgi_params;
    
        ngx_uint_t                               default_down;
    };

`ngx_http_upstream_check_commands`用于分解相关的check命令。

    static ngx_command_t  ngx_http_upstream_check_commands[] = {
    
        { ngx_string("check"),
          NGX_HTTP_UPS_CONF|NGX_CONF_1MORE,
          ngx_http_upstream_check,
          0,
          0,
          NULL },
        ....
    };
 
以上代码用于分解以"check"开头的命令行。在解析该行时，将会调用 `ngx_http_upstream_check` 函数。
具体对于ngx_command_t的含义可以参考[Nginx模块开发入门](http://blog.chinaunix.net/uid-22400280-id-3214815.html)。

`ngx_http_upstream_check`函数的主要作用就是将诸如`check interval=5000 rise=1 fall=3 timeout=4000`的指令分解，并赋值给`ngx_http_upstream_check_srv_conf_t`。

## 模块运行

运行的入口函数在`ngx_http_upstream_check_init_process`

    static ngx_int_t
    ngx_http_upstream_check_init_process(ngx_cycle_t *cycle)
    {
        return ngx_http_upstream_check_add_timers(cycle);
    }

    static ngx_int_t
    ngx_http_upstream_check_add_timers(ngx_cycle_t *cycle)
    {
       ...
    
        for (i = 0; i < peers->peers.nelts; i++) {  //这里对每个server进行循环
            peer[i].shm = &peer_shm[i];
    
            peer[i].check_ev.handler = ngx_http_upstream_check_begin_handler; //配置check的钩子函数
            ...
    
            peer[i].check_timeout_ev.handler =
                ngx_http_upstream_check_timeout_handler;  //配置超时的钩子函数
            ...
    
            /*
             * We add a random start time here, since we don't want to trigger
             * the check events too close to each other at the beginning.
             */
            delay = ucscf->check_interval > 1000 ? ucscf->check_interval : 1000;
            t = ngx_random() % delay;    //这里的设计比较特别，在一个随机的实际开始检查，以免所有的检查在一起撞车
    
            ngx_add_timer(&peer[i].check_ev, t);
        }
    
        return NGX_OK;
    }

至于具体是如何运行check检查的，可以参看`ngx_http_upstream_check_begin_handler`函数。