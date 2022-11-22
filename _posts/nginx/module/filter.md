---
layout: default
title: Filter
parent: Nginx Modules
grand_parent: Nginx
nav_order: 1
# permalink: docs/nginx/modules/
---

*2021-03-08*
# Filter模块
{: .no_toc }

filter模块是过滤响应头和内容的模块，可以对响应的头和内容进行处理。它的处理时间在生成响应内容之后，向用户发送响应之前。
{: .fs-6 .fw-300 }

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---

##  1. 执行顺序

	在每个模块内，先用本文件内的全局变量(ngx_http_next_header_filter)保存全局变量ngx_http_top_head_filter(此时，此函数指针指向了某个函数）。然后修改ngx_http_top_header_filter指针指向本模块的处理函数。最后在本模块的处理函数内完后逻辑后，执行ngx_http_next_header_filter，也就是把之前的函数执行。
	总体来说，每个模块先执行本模块的处理函数，然后调用下一个模块的处理函数，像是一个链表，链表的头就是全局函数指针。函数的入口是这两个分别对应，调用这两个函数，最后会走到write_filter，输出内容。
	   
    ```c
	    1 ngx_int_t
	    2 ngx_http_send_header(ngx_http_request_t *r)
	    3 {
	    4                 ...
	    5 
	    6                 return ngx_http_top_header_filter(r);
	    7 }
	    8 
	    9 ngx_int_t
	   10 ngx_http_output_filter(ngx_http_request_t *r, ngx_chain_t *in)
	   11 {
	   12         ngx_int_t          rc;
	   13         ngx_connection_t  *c;
	   14 
	   15         c = r->connection;
	   16 
	   17         rc = ngx_http_top_body_filter(r, in);
	   18 
	   19         if (rc == NGX_ERROR) {
	   20                 /* NGX_ERROR may be returned by any filter */
	   21                 c->error = 1;
	   22         }
	   23 
	   24         return rc;
	   25 }
    ```

	过滤模块的顺序，依次如下：
	| filter module | description |
    | --- | --- |
	| ngx_http_not_modified_filter_module | 默认打开，如果请求的if-modified-since等于回复的last-modified间值，说明回复没有变化，清空所有回复的内容，返回304。 |
	| ngx_http_range_body_filter_module | 默认打开，只是响应体过滤函数，支持range功能，如果请求包含range请求，那就只发送range请求的一段内容。 |
	| ngx_http_copy_filter_module | 始终打开，只是响应体过滤函数， 主要工作是把文件中内容读到内存中，以便进行处理。 |
	| ngx_http_headers_filter_module | 始终打开，可以设置expire和Cache-control头，可以添加任意名称的头 |
	| 第三方HTTP过滤模块	 | |
	| ngx_http_userid_filter_module | 默认关闭，可以添加统计用的识别用户的cookie。 |
	| ngx_http_charset_filter_module | 默认关闭，可以添加charset，也可以将内容从一种字符集转换到另外一种字符集，不支持多字节字符集。 |
	| ngx_http_ssi_filter_module | 默认关闭，过滤SSI请求，可以发起子请求，去获取include进来的文件 |
	| ngx_http_postpone_filter_module | 始终打开，用来将子请求和主请求的输出链合并 |
	| ngx_http_gzip_filter_module | 默认关闭，支持流式的压缩内容 |
	| ngx_http_range_header_filter_module | 默认打开，只是响应头过滤函数，用来解析range头，并产生range响应的头。 |
	| ngx_http_chunked_filter_module | 默认打开，对于HTTP/1.1和缺少content-length的回复自动打开。 |
	| ngx_http_header_filter_module | 始终打开，用来将所有header组成一个完整的HTTP头。 |
	| ngx_http_write_filter_module | 始终打开，将输出链拷贝到r->out中，然后输出内容。 |
	
##	2. 第三方模块

	一般情况下，第三方过滤模块的config文件会将模块名追加到变量HTTP_AUX_FILTER_MODULES中，此时该模块只能加入到copy_filter和headers_filter模块之间执行。
	实例：打印请求与响应