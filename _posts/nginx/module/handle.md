---
layout: default
title: Handle
parent: Nginx Modules
grand_parent: Nginx
nav_order: 1
# permalink: docs/nginx/modules/
---

*2021-03-08*
# Handle模块
{: .no_toc }

nginx启动时，每个handle都可以挂载到对应的location上，如果有多个handler关联到同一个location，则只有一个起作用。
handler模块的处理结果通常有三种：处理成功、失败、拒绝。拒绝处理时会由默认handler完成处理。
{: .fs-6 .fw-300 }

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---

##  | 1. handler模块的组成

有两部分：基本结构（配置、指令、上下文结构、模块定义）、处理函数。

### 基本结构

    i. 模块配置结构：存储配置信息
    ```c
        1 typedef struct
        2 {
        3         ngx_str_t hello_string;
        4         ngx_int_t hello_counter;
        5 }ngx_http_hello_loc_conf_t;
    ```
    ii. 模块配置指令：conf文件中命令与动作的对应
    ```c
        1 static ngx_command_t ngx_http_hello_commands[] = {
        2       {
        3                 ngx_string("hello_string"),
        4                 NGX_HTTP_LOC_CONF|NGX_CONF_NOARGS|NGX_CONF_TAKE1,
        5                 ngx_http_hello_string,
        6                 NGX_HTTP_LOC_CONF_OFFSET,
        7                 offsetof(ngx_http_hello_loc_conf_t, hello_string),
        8                 NULL },
        9         ngx_null_command
       10 };
    ```c
    iii. 模块上下文结构：配置信息与结构体的转换  
    ```c  
        1 static ngx_http_module_t ngx_http_hello_module_ctx = {
        2         NULL,                          /* preconfiguration */
        3         ngx_http_hello_init,           /* postconfiguration */
        4 
        5         NULL,                          /* create main configuration */
        6         NULL,                          /* init main configuration */
        7 
        8         NULL,                          /* create server configuration */
        9         NULL,                          /* merge server configuration */
       10 
       11         ngx_http_hello_create_loc_conf, /* create location configuration */
       12         NULL                        /* merge location configuration */
       13 };
    ```c
    Nginx里面的配置信息都是上下一层层的嵌套的，对于具体某个location的话，对于同一个配置，如果当前层次没有定义，那么就使用上层的配置，否则使用当前层次的配置。
    iv. 模块定义：与ngxin的交互接口
    ```c
        1 ngx_module_t ngx_http_hello_module = {
        2         NGX_MODULE_V1,
        3         &ngx_http_hello_module_ctx,    /* module context */
        4         ngx_http_hello_commands,       /* module directives */
        5         NGX_HTTP_MODULE,               /* module type */
        6         NULL,                          /* init master */
        7         NULL,                          /* init module */
        8         NULL,                          /* init process */
        9         NULL,                          /* init thread */
       10         NULL,                          /* exit thread */
       11         NULL,                          /* exit process */
       12         NULL,                          /* exit master */
       13         NGX_MODULE_V1_PADDING
       14 };
    ```c

### 处理函数：对报文的处理，生成响应

该函数处理成功返回NGX_OK，处理发生错误返回NGX_ERROR，拒绝处理（留给后续的handler进行处理）返回NGX_DECLINE。 返回NGX_OK也就代表给客户端的响应已经生成好了，否则返回NGX_ERROR就发生错误了。
    i. 挂载：分为阶段挂载和按需挂载两种
        1) 阶段挂载phase handlers：
        报文的处理过程共有11个阶段，其中7个阶段可以挂载。每个阶段有一个数组，将处理函数放到此数组中即可。nginx会顺序的执行数组中的函数。

        | NGX_HTTP_POST_READ_PHASE: | 读取请求内容阶段 |
        | NGX_HTTP_SERVER_REWRITE_PHASE: | Server请求地址重写阶段 |
        | NGX_HTTP_FIND_CONFIG_PHASE: | 配置查找阶段: |
        | NGX_HTTP_REWRITE_PHASE: | Location请求地址重写阶段 |
        | NGX_HTTP_POST_REWRITE_PHASE: | 请求地址重写提交阶段 |
        | NGX_HTTP_PREACCESS_PHASE: | 访问权限检查准备阶段 |
        | NGX_HTTP_ACCESS_PHASE: | 访问权限检查阶段 |
        | NGX_HTTP_POST_ACCESS_PHASE: | 访问权限检查提交阶段 |
        | NGX_HTTP_TRY_FILES_PHASE: | 配置项try_files处理阶段 |
        | NGX_HTTP_CONTENT_PHASE: | 内容产生阶段 |
        | NGX_HTTP_LOG_PHASE: | 日志模块处理阶段 |

        例如挂载hello module的handler  
        ```c     
            1 static ngx_int_t
            2 ngx_http_hello_init(ngx_conf_t *cf)
            3 {
            4                 ngx_http_handler_pt        *h;
            5                 ngx_http_core_main_conf_t  *cmcf;
            6 
            7                 cmcf = ngx_http_conf_get_module_main_conf(cf, ngx_http_core_module);
            8 
            9                 h = ngx_array_push(&cmcf->phases[NGX_HTTP_CONTENT_PHASE].handlers);
           10                 if (h == NULL) {
           11                                 return NGX_ERROR;
           12                 }
           13 
           14                 *h = ngx_http_hello_handler;
           15 
           16                 return NGX_OK;
           17 }
        ```c
        2) 按需挂载content handler：NGX_HTTP_CONTENT_PHASE阶段特有
        将handler句柄指向要挂载的函数。
        当一个请求进来以后，nginx从NGX_HTTP_POST_READ_PHASE阶段开始依次执行每个阶段中所有handler。执行到 NGX_HTTP_CONTENT_PHASE阶段的时候，如果这个location有一个对应的content handler模块，那么就去执行这个content handler模块真正的处理函数。否则继续依次执行NGX_HTTP_CONTENT_PHASE阶段中所有content phase handlers，直到某个函数处理返回NGX_OK或者NGX_ERROR。
        换句话说，当某个location处理到NGX_HTTP_CONTENT_PHASE阶段时，如果有content handler模块，那么NGX_HTTP_CONTENT_PHASE挂载的所有content phase handlers都不会被执行了。
        例如
        ```c
            1 static char *
            2 ngx_http_circle_gif(ngx_conf_t *cf, ngx_command_t *cmd, void *conf)
            3 {
            4                 ngx_http_core_loc_conf_t  *clcf;
            5 
            6                 clcf = ngx_http_conf_get_module_loc_conf(cf, ngx_http_core_module);
            7                 clcf->handler = ngx_http_circle_gif_handler;
            8 
            9                 return NGX_CONF_OK;
           10 }
        ```

## 各个阶段的checker函数以及返回值

### NGX_HTTP_POST_READ_PHASE 阶段

checker函数为ngx_http_core_generic_phase

ngx_http_core_generic_phases调用的ngx_http_handler_pt方法，有如下返回值，及返回值的影响：
| 返回值 | 意义 |
|---|--- |
| NGX_OK | 执行下一个ngx_http_phases阶段中的第一个ngx_http_handler_pt处理方法，如果下个阶段没设置，则找下下个阶段 |
| NGX_DECLINED | 按照顺序执行下一个ngx_http_handler_pt方法 |
| NGX_AGAIN | 当前的ngx_http_handler_pt尚未结束，后面有机会继续被调用，暂时归还控制权 |
| NGX_DONE | 当前的ngx_http_handler_pt尚未结束，后面有机会继续被调用，暂时归还控制权 |
| NGX_ERROR | 需要调动ngx_http_finalize_request结束请求 |
| 其他 | 需要调动ngx_http_finalize_request结束请求 |

### NGX_HTTP_SERVER_REWRITE_PHASE阶段
checker函数是 ngx_http_core_reweite_phase
ngx_http_core_reweite_phase调用的ngx_http_handler_pt方法，有如下返回值，及返回值的影响：
| 返回值 | 意义 |
| ---|--- |
| NGX_DECLINED | 按照顺序执行下一个ngx_http_handler_pt方法 |
| NGX_DONE | 当前的ngx_http_handler_pt尚未结束，后面有机会继续被调用，暂时归还控制权 |
| NGX_AGAIN | 需要调动ngx_http_finalize_request结束请求 |
| NGX_ERROR | 需要调动ngx_http_finalize_request结束请求 |
| 其他 | 需要调动ngx_http_finalize_request结束请求 |
### NGX_HTTP_FIND_CONFIG_PHASE阶段
不能往该阶段添加函数，该阶段使用ngx_http_core_find_config_phase寻找location
### NGX_HTTP_REWRITE_PHASE阶段
checker函数是ngx_http_core_rewrite_phase，与NGX_HTTP_SERVER_REWRITE_PHASE阶段通，详情见上面
### NGX_HTTP_POST_REWRITE_PHASE阶段
不能往该阶段加函数，checker方法ngx_http_core_post_rewrite_phase
### NGX_HTTP_PREACCESS_PHASE阶段
不能往该阶段加函数，checker方法ngx_http_core_generic_phase
### NGX_HTTP_ACCESS_PHASE阶段
checker函数是ngx_http_core_access_phase
ngx_http_core_access_phase调用的ngx_http_handler_pt方法，有如下返回值，及返回值的影响：
| 返回值 | 意义 |
|---|--- |
| NGX_OK | 如果配置的是statisfy all，则执行下一个ngx_http_handler_pt，如果配置的是statisfy any，则执行下个阶段的ngx_http_handler_pt |
| NGX_DECLINED | 按照顺序执行下一个ngx_http_handler_pt方法 |
| NGX_AGAIN | 当前的ngx_http_handler_pt尚未结束，后面有机会继续被调用，暂时归还控制权 |
| NGX_DONE | 当前的ngx_http_handler_pt尚未结束，后面有机会继续被调用，暂时归还控制权 |
| NGX_FORBIDDEN | 如果配置的是statisfy all,jiang ngx_http_request_t中的access_code当返回值，执行下一个ngx_http_handler_pt，如果配置的是statisfy any,执行下个阶段的ngx_http_handler_pt |
| NGX_HTTP_UNAUTHORIZED | 如果配置的是statisfy all,jiang ngx_http_request_t中的access_code当返回值，执行下一个ngx_http_handler_pt，如果配置的是statisfy any,执行下个阶段的ngx_http_handler_pt |
| NGX_ERROR | 需要调动ngx_http_finalize_request结束请求 |
| 其他 | 需要调动ngx_http_finalize_request结束请求 |
### NGX_HTTP_POST_ACCESS_PHASE阶段
不允许添加函数，checker函数是ngx_http_core_post_access_phase
### NGX_HTTP_TRY_FILES_PHASE 阶段
不允许添加函数，checker函数是ngx_http_core_try_files_phase
NGX_HTTP_CONTENT_PHASE 函数
后面说
### NGX_HTTP_LOG_PHASE阶段
checker函数是ngx_http_core_generic_phase
