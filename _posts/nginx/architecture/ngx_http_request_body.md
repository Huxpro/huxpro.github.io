---
layout: default
title: request 请求体获取过程
parent: Nginx Architecture
grand_parent: Nginx
nav_order: 10
# permalink: docs/nginx/modules/
---

*2021-03-08*
# ngx_http_request_body.c
{: .no_toc }

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---


```c
#include <ngx_config.h>
#include <ngx_core.h>
#include <ngx_http.h>


static void ngx_http_read_client_request_body_handler(ngx_http_request_t *r);
static ngx_int_t ngx_http_do_read_client_request_body(ngx_http_request_t *r);
static ngx_int_t ngx_http_write_request_body(ngx_http_request_t *r);
static ngx_int_t ngx_http_read_discarded_request_body(ngx_http_request_t *r);
static ngx_int_t ngx_http_discard_request_body_filter(ngx_http_request_t *r,
    ngx_buf_t *b);
static ngx_int_t ngx_http_test_expect(ngx_http_request_t *r);

static ngx_int_t ngx_http_request_body_filter(ngx_http_request_t *r,
    ngx_chain_t *in);
static ngx_int_t ngx_http_request_body_length_filter(ngx_http_request_t *r,
    ngx_chain_t *in);
static ngx_int_t ngx_http_request_body_chunked_filter(ngx_http_request_t *r,
    ngx_chain_t *in);

//HTTP包体的长度有可能非常大，如果试图一次性调用并读取完所有的包体，那么多半会阻塞Nginx进程。HTTP框架提供了一种方法来异步地接收包体：
/*
ngx_http_read_client_request_body是一个异步方法，调用它只是说明要求Nginx开始接收请求的包体，并不表示是否已经接收完，当接收完所有的包体内容后，
post_handler指向的回调方法会被调用。因此，即使在调用了ngx_http_read_client_request_body方法后它已经返回，也无法确定这时是否已经调用过post_handler
指向的方法。换句话说，ngx_http_read_client_request_body返回时既有可能已经接收完请求中所有的包体（假如包体的长度很小），也有可能还没开始接收包体。
如果ngx_http_read_client_request_body是在ngx_http_mytest_handler处理方法中调用的，那么后者一般要返回NGX_DONE，因为下一步就是将它的返回值作为参数
传给ngx_http_finalize_request。 
*/ //包体接收完毕后会执行回调方法ngx_http_client_body_handler_pt post_handler

//ngx_http_parse_request_line解析请求行， ngx_http_process_request_headers(ngx_http_parse_header_line)解析头部行(请求头部) 接收包体ngx_http_read_client_request_body

/*
调用了ngx_http_read_client_request_body方法就相当于启动了接收包体这一动作，在这个动作完成后，就会回调HTTP模块定义的post_handler方法  
丢弃包体时，HTTP框架提供的方法是ngx_http_discard_request_body
*/
/* HTTP框架提供了两种方式处理HTTP包体，当然，这两种方式保持了完全无阻塞的事件驱动机制，非常高效。第一种方式就是把请求中的包体
接收到内存或者文件中，当然，由于包体的长度是可变的，同时内存又是有限的，因此，一般都是将包体存放到文件中。第二种方式是选择丢弃包体，
注意，丢弃不等于可以不接收包体，这样做可能会导致客户端出现发送请求超时的错误，所以，这个丢弃只是对于HTTP模块而言的，HTTP框架还是需
要“尽职尽责”地接收包体，在接收后直接丢弃。 */
ngx_int_t  //一般都是需要访问上游服务器的时候才会读取包体，例如ngx_http_proxy_handler ，

/*
一般都是如果解析头部行后，后面有携带包体，则会走到这里，如果包体还没读完，下次也不会走到该函数，而是走ngx_http_do_read_client_request_body
实际上走到这里面的包体内容是在读取头部的时候，一起读出来的，读取地方见ngx_http_wait_request_handler
在NGX_HTTP_CONTENT_PHASE阶段通过ngx_http_core_content_phase调用content阶段的handler从而执行ngx_http_proxy_handler  ngx_http_redis2_handler  ngx_http_fastcgi_handler等，在这些函数中开始读取包体
*/
ngx_http_read_client_request_body(ngx_http_request_t *r,  //只有在连接后端服务器的时候才会读取客户端请求包体，见ngx_http_xxx_handler(proxy fastcgi等)
    ngx_http_client_body_handler_pt post_handler) //post_handler在ngx_http_do_read_client_request_body接收完所有包体后执行，或者在本函数能读取完包体后也会执行
    //post_handler方法被回调时，务必调用类似ngx_http_finalize_request的方法去结束请求，否则引用计数会始终无法清零，从而导致请求无法释放。
{
    size_t                     preread;
    ssize_t                    size;
    ngx_int_t                  rc;
    ngx_buf_t                 *b;
    ngx_chain_t                out, *cl;
    ngx_http_request_body_t   *rb;
    ngx_http_core_loc_conf_t  *clcf;

    /*
        这里开辟真正的读取数据的空间后，buf的指针指向终端空间的头尾以及解析完的数据的位置，
                    buf1                       buf2                    buf3
        _________________________________________________________________________________
        |                          |                         |                           |
        |__________________________|_________________________|___________________________|
     1.第一次开辟好存储数据的空间ngx_create_temp_buf后，r->request_body->buf pos last start指向buf1的头部，end指向buf3尾部
     2.假设第一次读取完内核协议栈的数据后填充好了buf1,r->request_body->buf中的pos start指向buf1的头部，last指向buf1尾部(buf2头部)，end指向buf3尾部
     3.开始调用ngx_http_request_body_filter，在该函数里面会重新分配一个ngx_buf_t，把r->request_body->buf成员赋值给她。然后把这个新的ngx_buf_t
     添加到r->request_body->bufs链表中。赋值完后r->request_body->buf中的start指向buf1的头部，pos last指向buf1尾部(buf2头部)，end指向buf3尾部
     4.从复上面的2 3步骤
     5.当解析完buf3的内容后，发现r->request_body->buf从内核读取到buf空间中的网络数据包已经被三个新的ngx_buf_t指向，并且这三个ngx_buf_t
       通过r->request_body->bufs链表连接在了一起，这时候r->request_body->buf中的end = last,也就是所有ngx_create_temp_buf开辟的内存空间
       已经存满了(recv的数据存在该空间里面)，并且数据分成三个ngx_buf_t指向这些空间，然后连接到了转存到了r->request_body->bufs链表上。在
     6.ngx_http_request_body_save_filter中检测到rb->buf->last == rb->buf->end，上面的buf(buf1+buf2+buf3)已经填满，然后通过r->request_body->bufs
       把三个ngx_buf_t指向的内存空间一次性写入临时文件，写入临时文件后，r->request_body->buf中的pos last指针重新指向头部，又可以从新从
       内核协议栈读取数据存储在里面了，然后从复1-5的过程
*/

    /*
     首先把该请求对应的原始请求的引用计数加l。这同时是在要求每一个HTTP模块在传入的post_handler方法被回调时，务必调用类似
     ngx_http_finalize_request的方法去结束请求，否则引用计数会始终无法清零，从而导致请求无法释放。
     */
    r->main->count++;
    //因为执行该函数一般都是向后端转发，例如可以参考ngx_http_read_client_request_body(r, ngx_http_upstream_init);，在ngx_http_upstream_init没有执行count++操作，实际上在这里

#if (NGX_HTTP_V2)
    /* HTTP2 data帧以外的所有帧的数据读取在ngx_http_v2_read_handler，
    data帧读取在ngx_http_read_client_request_body->ngx_http_v2_read_request_body */
    if (r->stream && r == r->main) {
        r->request_body_no_buffering = 0;
        rc = ngx_http_v2_read_request_body(r, post_handler);
        goto done;
    }
#endif

    /*
    检查请求ngx_http_request_t结构体中的request_body成员，如果它已经被分配过了，证明已经读取过HTTP包体了，不需要再次读取一遍；
再检查请求ngx_http_request_t结构体中的discard_body标志位，如果discard_body为1，则证明曾经执行过丢弃包体的方法，现在包体正在被丢弃中。
只有这两个条件都不满足，才说明真正需要接收HTTP包体。
     */
    if (r != r->main || r->request_body || r->discard_body) {
        r->request_body_no_buffering = 0;
        post_handler(r); //直接执行各HTTP模块提供的post_handler回调方法
        return NGX_OK;
    }

    if (ngx_http_test_expect(r) != NGX_OK) {
        rc = NGX_HTTP_INTERNAL_SERVER_ERROR;
        goto done;
    }

    if (r->request_body_no_buffering) { //如果不缓存包体，request_body_no_buffering和request_body_in_file_only是互斥的
        r->request_body_in_file_only = 0; //设置为不缓存包体，则就不能把包体写道文件中
    }

    /* 分配请求的ngx_http_request_t结构体中的request_body成员（之前request_body是NULL空指针），准备接收包体。 */
    rb = ngx_pcalloc(r->pool, sizeof(ngx_http_request_body_t));
    if (rb == NULL) {
        rc = NGX_HTTP_INTERNAL_SERVER_ERROR;
        goto done;
    }

    /*
     * set by ngx_pcalloc():
     *
     *     rb->bufs = NULL;
     *     rb->buf = NULL;
     *     rb->free = NULL;
     *     rb->busy = NULL;
     *     rb->chunked = NULL;
     */

    rb->rest = -1;
    rb->post_handler = post_handler;

    r->request_body = rb; //把创建的ngx_http_request_body_t空间赋值给request_body

    /* 检查请求的content-length头部，如果指定了包体长度的content-length字段小于或等于0，当然不用继续接收包体：
    如果content-length大于0，则意味着继续执行，但HTTP模块定义的post_handler方法不会知道在哪一次事件的触发中会被回调，
    所以先把它设置到request_body结构体的post_handler成员中。 */
    if (r->headers_in.content_length_n < 0 && !r->headers_in.chunked) {
        r->request_body_no_buffering = 0;
        post_handler(r);
        return NGX_OK;
    }

    /* 接收HTTP头部的流程中，是有可能接收到HTTP包体的。首先我们需要检查在header_in缓冲区中已经接收到的包体长度，确定其是否大于或者等于
content-length头部指定的长度，如果大干或等于则说明已经接收到完整的包体 */
    preread = r->header_in->last - r->header_in->pos;

    if (preread) { //注意在ngx_http_wait_request_handler中第一次读的时候默认是读1024字节，有可能ngx_http_wait_request_handler已经把包体读了

        /* there is the pre-read part of the request body */

        ngx_log_debug1(NGX_LOG_DEBUG_HTTP, r->connection->log, 0,
                       "http client request body preread %uz", preread);

        out.buf = r->header_in;//
        out.next = NULL;

        //把最新读取到的buf数据添加到r->request_body->bufs中，并且让free指向该bufs中所有数据中已经解析了的数据节点信息(重复利用ngx_buf_t)
        //busy链表中的ngx_buf_t节点指向bufs中所有数据中还没有解析完毕的数据
        rc = ngx_http_request_body_filter(r, &out); 

        if (rc != NGX_OK) {
            goto done;
        }

        r->request_length += preread - (r->header_in->last - r->header_in->pos);

        /* 当上述条件不满足时，再检查header—in缓冲区里的剩余空闲空间是否可以存放下全部的包体（content-length头部指定），如果可以，就不用分配新的包体缓冲区浪费内存了 */
        if (!r->headers_in.chunked
            && rb->rest > 0 //还需要读取rb->rest才能保证包体读完
            && rb->rest <= (off_t) (r->header_in->end - r->header_in->last)) //判断header_in指向的剩余未用空间是否足够存取剩余的rest字节数据
        {
            /* the whole request body may be placed in r->header_in */
            //header_in中剩余的未用空间足够，例如还差rest = 1000字节才能读取完包体，但是header_in中剩余空间end - last超过1000，则不需要从新开辟空间
            //直接使用header_in剩余空间，开辟新的ngx_buf_t空间，使用新的ngx_buf_t中的各个指针指向header_in中剩余未用空间，用来继续读取
            b = ngx_calloc_buf(r->pool);
            if (b == NULL) {
                rc = NGX_HTTP_INTERNAL_SERVER_ERROR;
                goto done;
            }

            b->temporary = 1;
            b->start = r->header_in->pos;
            b->pos = r->header_in->pos;
            b->last = r->header_in->last;
            b->end = r->header_in->end;

            rb->buf = b;

            r->read_event_handler = ngx_http_read_client_request_body_handler;
            r->write_event_handler = ngx_http_request_empty_handler;

            
            rc = ngx_http_do_read_client_request_body(r);
            goto done;
        }

    } else {
        /* set rb->rest */

        if (ngx_http_request_body_filter(r, NULL) != NGX_OK) {
            rc = NGX_HTTP_INTERNAL_SERVER_ERROR;
            goto done;
        }
    }

    if (rb->rest == 0) { //包体读取完毕
        /* the whole request body was pre-read */

        if (r->request_body_in_file_only) { //如果配置"client_body_in_file_only" on | clean 表示包体存储在磁盘文件中
            if (ngx_http_write_request_body(r) != NGX_OK) {
                rc = NGX_HTTP_INTERNAL_SERVER_ERROR;
                goto done;
            }

            if (rb->temp_file->file.offset != 0) {

                cl = ngx_chain_get_free_buf(r->pool, &rb->free);
                if (cl == NULL) {
                    rc = NGX_HTTP_INTERNAL_SERVER_ERROR;
                    goto done;
                }

                b = cl->buf;

                ngx_memzero(b, sizeof(ngx_buf_t));

                b->in_file = 1;
                b->file_last = rb->temp_file->file.offset;
                b->file = &rb->temp_file->file;

                rb->bufs = cl; //如果包体存入临时文件中，则读取包体完成后，bufs指向的ngx_chain_t中的各个指针指向文件中的相关偏移

            } else {
                rb->bufs = NULL;
            }
        }

        r->request_body_no_buffering = 0;

        post_handler(r);

        return NGX_OK;
    }

    //只有读取包体执行一次到该下面流程，则表示读取一次的时候没有读取完


    //包体长度出错
    if (rb->rest < 0) {
        ngx_log_error(NGX_LOG_ALERT, r->connection->log, 0,
                      "negative request body rest");
        rc = NGX_HTTP_INTERNAL_SERVER_ERROR;
        goto done;
    }

    clcf = ngx_http_get_module_loc_conf(r, ngx_http_core_module);

    size = clcf->client_body_buffer_size;
    size += size >> 2; //实际上就是四分之五5/4个client_body_buffer_size

    /* TODO: honor r->request_body_in_single_buf */
    //走到这里之前至少在ngx_http_wait_request_handler函数中读取过一次，也就是读取头部的时候，可能会读取一部分包体，在读取头部的时候
    //读取的最大报文长度为client_header_buffer_size，所以包体有可能在那里读取后处理了头部行后，会走到本函数处理包体，这时候可能包体没有读完

    if (!r->headers_in.chunked && rb->rest < size) {
        size = (ssize_t) rb->rest;
        
        if (r->request_body_in_single_buf) { //需要缓存到同一个buf中，那么开辟的空间就必须一次分配完，这样可以存储后面所有的。
            size += preread; //如果是把读取的网络数据存到同一个single buffer中，则本次读到preread字节，但是还有size字节没读，所以需要相加，表示一共需要这么多空间，
        }
    } else {
        size = clcf->client_body_buffer_size; //如果不是缓存到同一个buf，则一次最多开辟这么多空间，这样可能需要多个buf才能读取完
    }

    /*
    说明确实需要分配用于接收包体的缓冲区了。缓冲区长度由nginx.conf丈件中的client_body_buffer_size配置项指定，缓冲区就在ngx_http_request_body_t
    结构体的buf成员中存放着，同时，bufs和to_ write这两个缓冲区链表首部也指向该buf。
     */

/*
        这里开辟真正的读取数据的空间后，buf的指针指向终端空间的头尾以及解析完的数据的位置，
                    buf1                       buf2                    buf3
        _________________________________________________________________________________
        |                          |                         |                           |
        |__________________________|_________________________|___________________________|
     1.第一次开辟好存储数据的空间ngx_create_temp_buf后，r->request_body->buf pos last start指向buf1的头部，end指向buf3尾部
     2.假设第一次读取完内核协议栈的数据后填充好了buf1,r->request_body->buf中的pos start指向buf1的头部，last指向buf1尾部(buf2头部)，end指向buf3尾部
     3.开始调用ngx_http_request_body_filter，在该函数里面会重新分配一个ngx_buf_t，把r->request_body->buf成员赋值给她。然后把这个新的ngx_buf_t
     添加到r->request_body->bufs链表中。赋值完后r->request_body->buf中的start指向buf1的头部，pos last指向buf1尾部(buf2头部)，end指向buf3尾部
     4.从复上面的2 3步骤
     5.当解析完buf3的内容后，发现r->request_body->buf从内核读取到buf空间中的网络数据包已经被三个新的ngx_buf_t指向，并且这三个ngx_buf_t
       通过r->request_body->bufs链表连接在了一起，这时候r->request_body->buf中的end = last,也就是所有ngx_create_temp_buf开辟的内存空间
       已经存满了(recv的数据存在该空间里面)，并且数据分成三个ngx_buf_t指向这些空间，然后连接到了转存到了r->request_body->bufs链表上。在
     6.ngx_http_request_body_save_filter中检测到rb->buf->last == rb->buf->end，上面的buf(buf1+buf2+buf3)已经填满，然后通过r->request_body->bufs
       把三个ngx_buf_t指向的内存空间一次性写入临时文件，写入临时文件后，r->request_body->buf中的pos last指针重新指向头部，又可以从新从
       内核协议栈读取数据存储在里面了，然后从复1-5的过程
     
    //读取客户包体即使是存入临时文件中，当所有包体读取完毕后(ngx_http_do_read_client_request_body)，还是会让r->request_body->bufs指向文件中的相关偏移内存地址
*/
    rb->buf = ngx_create_temp_buf(r->pool, size); //这个是为下次读取准备的
    if (rb->buf == NULL) {
        rc = NGX_HTTP_INTERNAL_SERVER_ERROR;
        goto done;
    }

    /*
     设置请求ngx_http_request_t结构体的read_ event_ handler成员为上面介绍过的ngx_http_read_client_request_body_handler方法，
     它意味着如果epoll再次检测到可读事件或者读事件的定时器超时，HTTP框架将调用ngx_http_read_client_request_body_handler方法处理
     */
    r->read_event_handler = ngx_http_read_client_request_body_handler;
    r->write_event_handler = ngx_http_request_empty_handler;

    /*
    调用ngx_http_do_read_client_request_body方法接收包体。该方法的意义在于把客户端与Nginx之间TCP连接上套接字缓冲区中的当前字符流全
    部读出来，并判断是否需要写入文件，以及是否接收到全部的包体，同时在接收到完整的包体后激活post_handler回调方法
     */
    rc = ngx_http_do_read_client_request_body(r);//这里面添加ngx_handle_read_event的时候，对应的handler为ngx_http_read_client_request_body_handler

done:

    if (r->request_body_no_buffering
        && (rc == NGX_OK || rc == NGX_AGAIN))
    {
        if (rc == NGX_OK) {
            r->request_body_no_buffering = 0;

        } else {
            /* rc == NGX_AGAIN */
            r->reading_body = 1;
        }

        r->read_event_handler = ngx_http_block_reading;
        post_handler(r);
    }

    if (rc >= NGX_HTTP_SPECIAL_RESPONSE) {//如果返回出错
        r->main->count--; //该函数处理结束后-1，因为该函数开始处理的时候有+1
    }

    return rc;
}


ngx_int_t
ngx_http_read_unbuffered_request_body(ngx_http_request_t *r)
{
    ngx_int_t  rc;

    if (r->connection->read->timedout) {
        r->connection->timedout = 1;
        return NGX_HTTP_REQUEST_TIME_OUT;
    }

    rc = ngx_http_do_read_client_request_body(r);

    if (rc == NGX_OK) {
        r->reading_body = 0;
    }

    return rc;
}

/*
在接收较大的包体时，无法在一次调度中完成。通俗地讲，就是接收包体不是调用一次ngx_http_read_client_request_body方法就能完成的。但是HTTP框架希望对于它
的用户，也就是HTTP模块而言，接收包体时只需要调用一次ngx_http_read_client_request_body方法就好，这时就需要有另一个方法在
ngx_http_read_client_request_body没接收到完整的包体时，如果连接上再次接收到包体就被调用(触发ngx_http_request_handler)，这个方
法就是ngx_http_read_client_request_body_handler。通过ngx_http_request_handler执行这里的handler
*/
static void
ngx_http_read_client_request_body_handler(ngx_http_request_t *r)
{
    ngx_int_t  rc;

    /* 
    首先检查连接上读事件的timeout标志位，如果为l，则表示接收HTTP包体超时，这时把连接ngx_connection_t结构体上的timeout标志位也置为1，
同时调用ngx_http_finalize_request方法结束请求，并发送408超时错误码
     */
    if (r->connection->read->timedout) {
        r->connection->timedout = 1;
        ngx_http_finalize_request(r, NGX_HTTP_REQUEST_TIME_OUT);
        return;
    }

    rc = ngx_http_do_read_client_request_body(r);
    
    //检测这个方法的返回值，如果它大于300，那么一定表示希望返回错误码
    if (rc >= NGX_HTTP_SPECIAL_RESPONSE) {
        ngx_http_finalize_request(r, rc);
    }
}

/*
调用ngx_http_do_read_client_request_body方法接收包体。该方法的意义在于把客户端与Nginx之间TCP连接上套接字缓冲区中的当前字符流全
部读出来，并判断是否需要写入文件，以及是否接收到全部的包体，同时在接收到完整的包体后激活post_handler回调方法
 */
//负责具体的读取包体工作，该函数会在for循环中会反复读直到包体读取完毕,如果内核已经没有数据并且包体还没有读完，则添加读事件，并推出循环，这样HTTP模块还能继续作用其他功能，避免阻塞
/* 读取的时候一个buf装满后，会把buf中存储的数据写道临时文件中(不管有没有配置request_body_in_file_only)，然后继续使用该buf读取数据，存储
数据的内存分配地方有两个:1.在读取报文头部的时候ngx_http_wait_request_handler  2.如果在1中读到的内容里面不包括完整包体，则需要在
ngx_http_read_client_request_body中会重新分配内存读取，触发再次读取的地方未ngx_http_read_client_request_body中为读取到完整包体的时候
添加的ngx_handle_read_event */
static ngx_int_t
ngx_http_do_read_client_request_body(ngx_http_request_t *r)//返回值大于NGX_HTTP_SPECIAL_RESPONSE表示返回错误码
{
    off_t                      rest;
    size_t                     size;
    ssize_t                    n;
    ngx_int_t                  rc;
    ngx_buf_t                 *b;
    ngx_chain_t               *cl, out;
    ngx_connection_t          *c;
    ngx_http_request_body_t   *rb;
    ngx_http_core_loc_conf_t  *clcf;

    c = r->connection;
    rb = r->request_body;

    ngx_log_debug0(NGX_LOG_DEBUG_HTTP, c->log, 0,
                   "http read client request body");

    for ( ;; ) {
        for ( ;; ) {
            /*
              首先检查请求的request_body成员中的buf缓冲区，如果缓冲区还有空闲的空间，则跳过该if{}去读取内核中套接字缓冲区里的TCP字符流；
              如果缓冲区已经写满，则调用ngx_http_write_request_body方法把缓冲区中的字符流写入文件。不管有没有配置request_body_in_file_only置1
               */
            if (rb->buf->last == rb->buf->end) {
            /*该buf内容已经计算完毕(也就是通过指针指向空间尾部)，需要把该buf指向空间的所有内容拷贝到临时文件中，不管是否有配置
            request_body_in_file_only置1, 因为该buf指向的空间会重复利用来读取包体内容*/

                if (rb->buf->pos != rb->buf->last) {

                    /* pass buffer to request body filter chain */

                    out.buf = rb->buf;
                    out.next = NULL;
                    //这里肯定会调用ngx_http_request_body_save_filter->ngx_http_write_request_body写该buf中的内容到临时文件，因为该buf指向的空间
                    //会重复利用来读取包体内容
                    rc = ngx_http_request_body_filter(r, &out);

                    if (rc != NGX_OK) {
                        return rc;
                    }

                } else {

                    /* update chains */

                    rc = ngx_http_request_body_filter(r, NULL);

                    if (rc != NGX_OK) {
                        return rc;
                    }
                }

                if (rb->busy != NULL) { //如果头部行中的content-length:LEN中的len长度表示后面的包体大小，如果后面的包体数据长度实际比头部中的LEN大，则会走这里，
                    if (r->request_body_no_buffering) {
                        if (c->read->timer_set) {
                            ngx_del_timer(c->read, NGX_FUNC_LINE);
                        }

                        if (ngx_handle_read_event(c->read, 0, NGX_FUNC_LINE) != NGX_OK) {
                            return NGX_HTTP_INTERNAL_SERVER_ERROR;
                        }

                        return NGX_AGAIN;
                    }

                    return NGX_HTTP_INTERNAL_SERVER_ERROR;
                }

              /*
                   为什么能下次还可以直接利用rb->buf空间来读取数据呢?
                       当一个rb->buf填满后就会通过ngx_http_write_request_body把bufs链表中的所有ngx_chain_t->ngx_buf_t中指向的数据
                   写入到临时文件，因此rb->buf中的内存就可以再次使用了
                  */
                //只需要把缓冲区ngx_buf_t结构体的last指针指向start指针，缓冲区即可复用。
                rb->buf->pos = rb->buf->start;
                rb->buf->last = rb->buf->start;
            }
            
            size = rb->buf->end - rb->buf->last; //buf中还剩余这么多空间
            rest = rb->rest - (rb->buf->last - rb->buf->pos); //还有多少字节包体没有读取

            if ((off_t) size > rest) { //说明空间够用来存储剩余的没有读取的字节数
                size = (size_t) rest;
            }
//负责具体的读取包体工作，该函数会在for循环中会反复读直到包体读取完毕,如果内核已经没有数据并且包体还没有读完，则添加读事件，并退出循环，这样HTTP模块还能继续作用其他功能，避免阻塞
            //调用封装了recv的方法从套接字缓冲区中读取包体到缓冲区中。
            n = c->recv(c, rb->buf->last, size); //在for循环中会反复读，直到读内核中数据读取完毕，如果读取完毕返回NGX_AGIN

            ngx_log_debug1(NGX_LOG_DEBUG_HTTP, c->log, 0,
                           "http client request body recv %z", n);

            if (n == NGX_AGAIN) {
                break;
            }

            if (n == 0) {//如果recv方法返回错误，或者客户端主动关闭了连接
                ngx_log_error(NGX_LOG_INFO, c->log, 0,
                              "client prematurely closed connection");
            }

            if (n == 0 || n == NGX_ERROR) {//如果recv方法返回错误，或者客户端主动关闭了连接
                c->error = 1;
                return NGX_HTTP_BAD_REQUEST;
            }

            /*
               根据接收到的TCP流长度，修改缓冲区参数。例如，把缓冲区ngx_buf_t结构体的last揩针加上接收到的长度，同时更新request_body结
               构体中表示待接收的剩余包体长度的rest成员、更新ngx_http_request_t结构体中表示已接收请求长度的request_length成员。
               */ //从这里可以看出在多次读取包体的时候，需要先把前面开辟空间buf中没有填充的部分填满，如果buf填满了，则重新利用该buf读取数据
               //之前读取到填满buf中的数据取出来存放到临时文件中，参考前面的if (rb->buf->last == rb->buf->end)
            rb->buf->last += n;
            r->request_length += n;

            if (n == rest) {//根据rest成员检查是否接收到完整的包体
                /* pass buffer to request body filter chain */

                out.buf = rb->buf;
                out.next = NULL;

                rc = ngx_http_request_body_filter(r, &out);

                if (rc != NGX_OK) {
                    return rc;
                }
            }
            
            if (rb->rest == 0) {
                break; //所有包体读取处理完毕，则退出for
            }

            if (rb->buf->last < rb->buf->end) {
                break;
            }

            //break;//yang test xxxxxxxxxxx
        }

        ngx_log_debug1(NGX_LOG_DEBUG_HTTP, c->log, 0,
                       "http client request body rest %O", rb->rest);

        if (rb->rest == 0) {
            break;
        }
        
        //printf("yang test ngx agin xxxxxxxxxxxxxxxxxxxxxxxxx\n");
        //
        //return NGX_AGAIN; //yang test xxxxxxxxxxxxxx
        /*
        如果当前已经没有可读的字符流，同时还没有接收到完整的包体，则说明需要把读事件添加到事件模块，等待可读事件发生时，事件框架可以再次
        调度到这个方法接收包体。这一步是调用ngx_add_timer方法将读事件添加到定时器中，超时时间以nginx.conf文件中的client_body_timeout配置项参数为准。
          */ //说明前面的 n = c->recv(c, rb->buf->last, size);返回的是NGX_AGAIN，所以在recv中会把ready置0
        if (!c->read->ready) {

            if (r->request_body_no_buffering
                && rb->buf->pos != rb->buf->last)
            {
                /* pass buffer to request body filter chain */

                out.buf = rb->buf;
                out.next = NULL;

                rc = ngx_http_request_body_filter(r, &out);

                if (rc != NGX_OK) {
                    return rc;
                }
            }

            clcf = ngx_http_get_module_loc_conf(r, ngx_http_core_module);
            //当读取到完整的包体后，会删除该定时器，见后面的ngx_del_timer(c->read);
            ngx_add_timer(c->read, clcf->client_body_timeout, NGX_FUNC_LINE);//handle应该是ngx_http_request_handler

            /*
             这个请求连接上的读事件触发时的回调方法ngx_http_request_handler,从而会调用read_event_handler方法(ngx_http_read_client_request_body_handler)
               */
            if (ngx_handle_read_event(c->read, 0, NGX_FUNC_LINE) != NGX_OK) { //handle应该是ngx_http_request_handler，通过这里触发再次读取包体
                return NGX_HTTP_INTERNAL_SERVER_ERROR;
            }

            return NGX_AGAIN; //把控制器交给HTTP框架，由框架感知读事件，当读事件发生，也就是数据到来，继续读取包体
        }
    }

    //只有包体读取完毕，才会从上面的for()循环中退出
    
    
    /*
       表明已经接收到完整的包体，需要做一些收尾工作了。首先不需要检查是否接收HTTP包体超时了，要把读事件从定时器中取出，防止不必要的定时器触发。这一
    步会检查读事件的timer set标志位，如果为1，则调用ngx_del_timer方法把读事件从定时器中移除。
     */
    if (c->read->timer_set) {
        ngx_del_timer(c->read, NGX_FUNC_LINE);
    }

    //如果缓冲区中还有未写入文件的内容，调用ngx_http_write_request_body方法把最后的包体内容也写入文件。
    if (rb->temp_file || r->request_body_in_file_only) { //只要之前的内存有写入文件，那么剩余的部分也要写入文件

        /* save the last part */

        if (ngx_http_write_request_body(r) != NGX_OK) {
            return NGX_HTTP_INTERNAL_SERVER_ERROR;
        }

        if (rb->temp_file->file.offset != 0) {

            cl = ngx_chain_get_free_buf(r->pool, &rb->free);
            if (cl == NULL) {
                return NGX_HTTP_INTERNAL_SERVER_ERROR;
            }

            b = cl->buf;

            ngx_memzero(b, sizeof(ngx_buf_t));

            b->in_file = 1;
            b->file_last = rb->temp_file->file.offset;
            b->file = &rb->temp_file->file;

            rb->bufs = cl; //读取客户包体即使是存入临时文件中，当所有包体读取完毕后(ngx_http_do_read_client_request_body)，还是会让r->request_body->bufs指向文件中的相关偏移内存地址

        } else {
            rb->bufs = NULL;
        }
    }

    /*
    在之前read_event_handler成员设置为ngx_http_read_client_request_body_handler方法，现在既然已经接收到完整的包体了，就会把
    read_event_handler设为ngx_http_block_reading方法，表示连接上再有读事件将不做任何处理。
     */
    if (!r->request_body_no_buffering) {
        r->read_event_handler = ngx_http_block_reading;
        rb->post_handler(r); //执行ngx_http_read_client_request_body的第二个参数
    }

    return NGX_OK;
}

/*
        这里开辟真正的读取数据的空间后，buf的指针指向终端空间的头尾以及解析完的数据的位置，
                    buf1                       buf2                    buf3
        _________________________________________________________________________________
        |                          |                         |                           |
        |__________________________|_________________________|___________________________|
     1.第一次开辟好存储数据的空间ngx_create_temp_buf后，r->request_body->buf pos last start指向buf1的头部，end指向buf3尾部
     2.假设第一次读取完内核协议栈的数据后填充好了buf1,r->request_body->buf中的pos start指向buf1的头部，last指向buf1尾部(buf2头部)，end指向buf3尾部
     3.开始调用ngx_http_request_body_filter，在该函数里面会重新分配一个ngx_buf_t，把r->request_body->buf成员赋值给她。然后把这个新的ngx_buf_t
     添加到r->request_body->bufs链表中。赋值完后r->request_body->buf中的start指向buf1的头部，pos last指向buf1尾部(buf2头部)，end指向buf3尾部
     4.从复上面的2 3步骤
     5.当解析完buf3的内容后，发现r->request_body->buf从内核读取到buf空间中的网络数据包已经被三个新的ngx_buf_t指向，并且这三个ngx_buf_t
       通过r->request_body->bufs链表连接在了一起，这时候r->request_body->buf中的end = last,也就是所有ngx_create_temp_buf开辟的内存空间
       已经存满了(recv的数据存在该空间里面)，并且数据分成三个ngx_buf_t指向这些空间，然后连接到了转存到了r->request_body->bufs链表上。在
     6.ngx_http_request_body_save_filter中检测到rb->buf->last == rb->buf->end，上面的buf(buf1+buf2+buf3)已经填满，然后通过r->request_body->bufs
       把三个ngx_buf_t指向的内存空间一次性写入临时文件，写入临时文件后，r->request_body->buf中的pos last指针重新指向头部，又可以从新从
       内核协议栈读取数据存储在里面了，然后从复1-5的过程
*/
//创建零食文件，并把rb = r->request_body->bufs中的所有ngx_chain_t中的所有数据写入到临时文件中，当一个ngx_chain_t中的ngx_buf_t填满后
//就会通过ngx_http_write_request_body把bufs链表中的所有ngx_chain_t->ngx_buf_t中指向的数据写入到临时文件，并把ngx_buf_t结构加入poll->chain,通过poll统一释放他们
static ngx_int_t //把bufs数据写入临时文件，然后把对应节点从bufs中摘除，之前bufs中ngx_http_request_body_t节点所指向的空间可以继续使用，来读写数据
ngx_http_write_request_body(ngx_http_request_t *r) //ngx_http_write_request_body把bufs中的内容写入临时文件后，会把bufs(ngx_chain_t)节点放入r->pool->chain中
{
    ssize_t                    n;
    ngx_chain_t               *cl, *ln;
    ngx_temp_file_t           *tf;
    ngx_http_request_body_t   *rb;
    ngx_http_core_loc_conf_t  *clcf;

    rb = r->request_body;

    ngx_log_debug1(NGX_LOG_DEBUG_HTTP, r->connection->log, 0,
                   "http write client request body, bufs %p", rb->bufs);

    if (rb->temp_file == NULL) {
        tf = ngx_pcalloc(r->pool, sizeof(ngx_temp_file_t));
        if (tf == NULL) {
            return NGX_ERROR;
        }

        clcf = ngx_http_get_module_loc_conf(r, ngx_http_core_module);

        tf->file.fd = NGX_INVALID_FILE;
        tf->file.log = r->connection->log;
        tf->path = clcf->client_body_temp_path;
        tf->pool = r->pool;
        tf->warn = "a client request body is buffered to a temporary file";
        tf->log_level = r->request_body_file_log_level;
        tf->persistent = r->request_body_in_persistent_file;
        tf->clean = r->request_body_in_clean_file;

        if (r->request_body_file_group_access) {
            tf->access = 0660;
        }

        rb->temp_file = tf;

        if (rb->bufs == NULL) {
            /* empty body with r->request_body_in_file_only */
            //创建临时文件
            if (ngx_create_temp_file(&tf->file, tf->path, tf->pool,
                                     tf->persistent, tf->clean, tf->access)
                != NGX_OK)
            {
                return NGX_ERROR;
            }

            return NGX_OK;
        }
    }

    if (rb->bufs == NULL) {
        return NGX_OK;
    }
    //创建temp_file临时文件，并把bufs链表中的数据写入文件
    n = ngx_write_chain_to_temp_file(rb->temp_file, rb->bufs);

    /* TODO: n == 0 or not complete and level event */

    if (n == NGX_ERROR) {
        return NGX_ERROR;
    }

    rb->temp_file->offset += n;

    /* mark all buffers as written */

    for (cl = rb->bufs; cl; /* void */) { //把bufs中的ngx_chain_t节点全部取出来添加到r->pool->chain中

        cl->buf->pos = cl->buf->last;

        ln = cl;
        cl = cl->next;
        ngx_free_chain(r->pool, ln);
    }

    rb->bufs = NULL;

    return NGX_OK;
}

//如果不想处理请求中的包体，那么可以调用ngx_http_discard_request_body方法将接收自客户端的HTTP包体丢弃掉。
/* //丢弃请求中的包体
ngx_http_discard_request_body只是丢弃包体，不处理包体不就行了吗？何必还要调用ngx_http_discard_request_body方法呢？其实这一步非常有意义，
因为有些客户端可能会一直试图发送包体，而如果HTTP模块不接收发来的TCP流，有可能造成客户端发送超时。
*/ //获取接收请求包体的函数为ngx_http_read_client_request_body

/*
对于HTTP模块而言，放弃接收包体就是简单地不处理包体了，可是对于HTTP框架而言，并不是不接收包体就可以的。因为对于客户端而言，通常
会调用一些阻塞的发送方法来发送包体，如果HTTP框架一直不接收包体，会导致实现上不够健壮的客户端认为服务器超时无响应，因而简单地关
闭连接，可这时Nginx模块可能还在处理这个连接。因此，HTTP模块中的放弃接收包体，对HTTP框架而言就是接收包体，但是接收后不做保存，直接丢弃。
HTTP模块调用的ngx_http_discard_request_body方法用于第一次启动丢弃包体动作，而ngx_http_discarded_request_body_handler是作为请
求的read_event_handler方法的，在有新的可读事件时会调用它处理包体。ngx_http_read discarded_request_body方法则是根据上述两个方法
通用部分提取出的公共方法，用来读取包体且不做任何处理。
*/
ngx_int_t
ngx_http_discard_request_body(ngx_http_request_t *r)
{
    ssize_t       size;
    ngx_int_t     rc;
    ngx_event_t  *rev;

#if (NGX_HTTP_V2)
    if (r->stream && r == r->main) {
        r->stream->skip_data = NGX_HTTP_V2_DATA_DISCARD;
        return NGX_OK;
    }
#endif

    /*
     首先检查当前请求是一个子请求还是原始请求。为什么要检查这个呢？因为对于子请求而言，它不是来自客户端的请求，所以不存在处理HTTP
     请求包体的概念。如果当前请求是原始请求，则继续执行；如果它是子请求，则直接返回NGX_OK表示丢弃包体成功。检查ngx_http_request_t结构
     体的request_body成员，如果它已经被赋值过且不再为NULL空指针，则说明已经接收过包体了，这时也需要返回NGX_OK表示成功。
     */
    if (r != r->main || r->discard_body || r->request_body) {
        return NGX_OK;
    }

    if (ngx_http_test_expect(r) != NGX_OK) {
        return NGX_HTTP_INTERNAL_SERVER_ERROR;
    }

    rev = r->connection->read;

    ngx_log_debug0(NGX_LOG_DEBUG_HTTP, rev->log, 0, "http set discard body");

    /*
    检查请求连接上的读事件是否在定时器中，这是因为丢弃包体不用考虑超时问题（linger_timer例外，本章不考虑此情况）。如果读事件
    的timer set标志位为1，则从定时器中移除此事件。还要检查content-length头部，如果它的值小于或等于0，同样意味着可以直接返回
    NGX一OK，表示成功丢弃了全部包体。
     */
    if (rev->timer_set) {
        ngx_del_timer(rev, NGX_FUNC_LINE);
    }
    if (r->headers_in.content_length_n <= 0 && !r->headers_in.chunked) {
        return NGX_OK;
    }
    

    size = r->header_in->last - r->header_in->pos;

    if (size || r->headers_in.chunked) {
        rc = ngx_http_discard_request_body_filter(r, r->header_in);

        if (rc != NGX_OK) {
            return rc;
        }

        if (r->headers_in.content_length_n == 0) {
            return NGX_OK;
        }
    }

    /*
        在接收HTTP头部时，还是要检查是否凑巧已经接收到完整的包体（如果包体很小，那么这是非常可能发生的事），如果已经接收到完整的包
    体，则直接返回NGX OK，表示丢弃包体成功，否则，说明需要多次的调度才能完成丢弃包体这一动作，此时把请求的read_event_handler
    成员设置为ngx_http_discarded_request_body_handler方法。
      */
    rc = ngx_http_read_discarded_request_body(r);

    if (rc == NGX_OK) {
        /* 返回NGX一OK表示已经接收到完整的包体了，这时将请求的lingering_close延时关闭标志位设为0，表示不需要为了包体的接收而
        延时关闭了，同时返回NGX—OK表示丢弃包体成功。 */
        r->lingering_close = 0;
        return NGX_OK;
    }

    if (rc >= NGX_HTTP_SPECIAL_RESPONSE) {
        return rc;
    }

    //返回非NGX_OK表示Nginx的事件框架触发事件需要多次调度才能完成丢弃包体这一动作

    /* rc == NGX_AGAIN */
    
    r->read_event_handler = ngx_http_discarded_request_body_handler; //下次读事件到来时通过ngx_http_request_handler来调用
    /* 有可能执行了ngx_http_block_reading->ngx_http_block_reading，所以如果需要继续读取客户端请求，需要add event */
    if (ngx_handle_read_event(rev, 0, NGX_FUNC_LINE) != NGX_OK) { //调用ngx_handle_read_event方法把读事件添加到epoll中handle为ngx_http_request_handler
        return NGX_HTTP_INTERNAL_SERVER_ERROR;
    }

    /*
    返回非NGX_OK表示Nginx的事件框架触发事件需要多次调度才能完成丢弃包体这一动作，于是先把引用计数加1，防止这边还在丢弃包体，
    而其他事件却已让请求意外销毁，引发严重错误。同时把ngx_http_request_t结构体的discard_body标志位置为1，表示正在丢弃包体，并
    返回NGX_OK，当然，达时的NGX_OK绝不表示已经成功地接收完包体，只是说明ngx_http_discard_request_body执行完毕而已。
     */
    r->count++;
    r->discard_body = 1;

    return NGX_OK;
}

/*
HTTP模块调用的ngx_http_discard_request_body方法用于第一次启动丢弃包体动作，而ngx_http_discarded_request_body_handler是作为请
求的read_event_handler方法的，在有新的可读事件时会调用它处理包体。ngx_http_read_discarded_request_body方法则是根据上述两个方法
通用部分提取出的公共方法，用来读取包体且不做任何处理。
*/ //当读取客户端包体一次读取不能完成的时候，会分多次调用该函数ngx_http_discarded_request_body_handler
void
ngx_http_discarded_request_body_handler(ngx_http_request_t *r)
{
    ngx_int_t                  rc;
    ngx_msec_t                 timer;
    ngx_event_t               *rev;
    ngx_connection_t          *c;
    ngx_http_core_loc_conf_t  *clcf;

    c = r->connection;
    rev = c->read;

    //首先检查TCP连接上的读事件的timedout标志位，为1时表示已经超时，这时调用ngx_http_finalize_request方法结束请求，传递的参数是NGX_ERROR，流程结束
    if (rev->timedout) {
        c->timedout = 1;
        c->error = 1;
        ngx_http_finalize_request(r, NGX_ERROR);
        return;
    }

    if (r->lingering_time) {
        timer = (ngx_msec_t) r->lingering_time - (ngx_msec_t) ngx_time();

        if ((ngx_msec_int_t) timer <= 0) {
            r->discard_body = 0;
            r->lingering_close = 0;
            ngx_http_finalize_request(r, NGX_ERROR);
            return;
        }

    } else {
        timer = 0;
    }

    //调用ngx_http_read_discarded_request_body方法接收包体，检测其返回值。
    rc = ngx_http_read_discarded_request_body(r);

    if (rc == NGX_OK) {
        r->discard_body = 0;
        r->lingering_close = 0;
        ngx_http_finalize_request(r, NGX_DONE);
        return;
    }

    if (rc >= NGX_HTTP_SPECIAL_RESPONSE) {
        c->error = 1;
        ngx_http_finalize_request(r, NGX_ERROR);
        return;
    }

    /* rc == NGX_AGAIN */

    if (ngx_handle_read_event(rev, 0, NGX_FUNC_LINE) != NGX_OK) {
        c->error = 1;
        ngx_http_finalize_request(r, NGX_ERROR);
        return;
    }

    if (timer) {

        clcf = ngx_http_get_module_loc_conf(r, ngx_http_core_module);

        timer *= 1000;

        if (timer > clcf->lingering_timeout) {
            timer = clcf->lingering_timeout;
        }

        ngx_add_timer(rev, timer, NGX_FUNC_LINE);
    }
}

/*
HTTP模块调用的ngx_http_discard_request_body方法用于第一次启动丢弃包体动作，而ngx_http_discarded_request_body_handler是作为请
求的read_event_handler方法的，在有新的可读事件时会调用它处理包体。ngx_http_read discarded_request_body方法则是根据上述两个方法
通用部分提取出的公共方法，用来读取包体且不做任何处理。
*/ //ngx_http_read_discarded_request_body方法与ngx_http_do_read_client_request_body方法很类似
static ngx_int_t
ngx_http_read_discarded_request_body(ngx_http_request_t *r)
{
    size_t     size;
    ssize_t    n;
    ngx_int_t  rc;
    ngx_buf_t  b;
    u_char     buffer[NGX_HTTP_DISCARD_BUFFER_SIZE];

    ngx_log_debug0(NGX_LOG_DEBUG_HTTP, r->connection->log, 0,
                   "http read discarded body");

    ngx_memzero(&b, sizeof(ngx_buf_t));

    b.temporary = 1;

    for ( ;; ) {
/*
    丢弃包体时请求的request_body成员实际上是NULL室指针，那么用什么变量来表示已经丢弃的包体有多大呢？实际上这时使用
了请求ngx_http_request_t结构体headers_in成员里的content_length_n，最初它等于content-length头部，而每丢弃一部分包体，就会在
content_length_n变量中减去相应的大小。因此，content_length_n表示还需要丢弃的包体长度，这里首先检查请求的content_length_n成员，
如果它已经等于0，则表示已经接收到完整的包体，这时要把read event_handler重置为ngx_http_block_reading方法，表示如果再有可读
事件被触发时，不做任何处理。同时返回NGX_OK，告诉上层的方法已经丢弃了所有包体。
  */
        if (r->headers_in.content_length_n == 0) {
            r->read_event_handler = ngx_http_block_reading;
            return NGX_OK;
        }

        /* 如果连接套接字的缓冲区上没有可读内容，则直接返回NGX_AGAIN，告诉上层方法需要等待读事件的触发，等待Nginx框架的再次调度。 */
        if (!r->connection->read->ready) {
            return NGX_AGAIN;
        }

        size = (size_t) ngx_min(r->headers_in.content_length_n,
                                NGX_HTTP_DISCARD_BUFFER_SIZE);

        n = r->connection->recv(r->connection, buffer, size);

        if (n == NGX_ERROR) {
            r->connection->error = 1;
            return NGX_OK;
        }

        if (n == NGX_AGAIN) { //如果套接字缓冲区中没有读取到内容
            return NGX_AGAIN;
        }

        if (n == 0) { //如果客户端主动关闭了连接
            return NGX_OK;
        }

        b.pos = buffer;
        b.last = buffer + n;

        //接收到包体后，要更新请求的content_length_n成员,从而判断是否读取完毕，如果为0表示读取完毕，同时继续循环
        rc = ngx_http_discard_request_body_filter(r, &b);

        if (rc != NGX_OK) {
            return rc;
        }
    }
}


static ngx_int_t
ngx_http_discard_request_body_filter(ngx_http_request_t *r, ngx_buf_t *b)
{
    size_t                    size;
    ngx_int_t                 rc;
    ngx_http_request_body_t  *rb;

    if (r->headers_in.chunked) {

        rb = r->request_body;

        if (rb == NULL) {

            rb = ngx_pcalloc(r->pool, sizeof(ngx_http_request_body_t));
            if (rb == NULL) {
                return NGX_HTTP_INTERNAL_SERVER_ERROR;
            }

            rb->chunked = ngx_pcalloc(r->pool, sizeof(ngx_http_chunked_t));
            if (rb->chunked == NULL) {
                return NGX_HTTP_INTERNAL_SERVER_ERROR;
            }

            r->request_body = rb;
        }

        for ( ;; ) {

            rc = ngx_http_parse_chunked(r, b, rb->chunked);

            if (rc == NGX_OK) {

                /* a chunk has been parsed successfully */

                size = b->last - b->pos;

                if ((off_t) size > rb->chunked->size) {
                    b->pos += (size_t) rb->chunked->size;
                    rb->chunked->size = 0;

                } else {
                    rb->chunked->size -= size;
                    b->pos = b->last;
                }

                continue;
            }

            if (rc == NGX_DONE) {

                /* a whole response has been parsed successfully */

                r->headers_in.content_length_n = 0;
                break;
            }

            if (rc == NGX_AGAIN) {

                /* set amount of data we want to see next time */

                r->headers_in.content_length_n = rb->chunked->length;
                break;
            }

            /* invalid */

            ngx_log_error(NGX_LOG_ERR, r->connection->log, 0,
                          "client sent invalid chunked body");

            return NGX_HTTP_BAD_REQUEST;
        }

    } else { 
    //接收到包体后，要更新请求的content_length_n成员,表示还有多少字节没有读取，计算后如果其值为0，表示读取数据完毕
        size = b->last - b->pos;

        if ((off_t) size > r->headers_in.content_length_n) {
            b->pos += (size_t) r->headers_in.content_length_n;
            r->headers_in.content_length_n = 0;

        } else {
            b->pos = b->last;
            r->headers_in.content_length_n -= size;
        }
    }

    return NGX_OK;
}


static ngx_int_t
ngx_http_test_expect(ngx_http_request_t *r)
{
    ngx_int_t   n;
    ngx_str_t  *expect;

    if (r->expect_tested
        || r->headers_in.expect == NULL
        || r->http_version < NGX_HTTP_VERSION_11)
    {
        return NGX_OK;
    }

    r->expect_tested = 1;

    expect = &r->headers_in.expect->value;

    if (expect->len != sizeof("100-continue") - 1
        || ngx_strncasecmp(expect->data, (u_char *) "100-continue",
                           sizeof("100-continue") - 1)
           != 0)
    {
        return NGX_OK;
    }

    ngx_log_debug0(NGX_LOG_DEBUG_HTTP, r->connection->log, 0,
                   "send 100 Continue");

    n = r->connection->send(r->connection,
                            (u_char *) "HTTP/1.1 100 Continue" CRLF CRLF,
                            sizeof("HTTP/1.1 100 Continue" CRLF CRLF) - 1);

    if (n == sizeof("HTTP/1.1 100 Continue" CRLF CRLF) - 1) {
        return NGX_OK;
    }

    /* we assume that such small packet should be send successfully */

    return NGX_ERROR;
}

/*
        这里开辟真正的读取数据的空间后，buf的指针指向终端空间的头尾以及解析完的数据的位置，
                    buf1                       buf2                    buf3
        _________________________________________________________________________________
        |                          |                         |                           |
        |__________________________|_________________________|___________________________|
     1.第一次开辟好存储数据的空间ngx_create_temp_buf后，r->request_body->buf pos last start指向buf1的头部，end指向buf3尾部
     2.假设第一次读取完内核协议栈的数据后填充好了buf1,r->request_body->buf中的pos start指向buf1的头部，last指向buf1尾部(buf2头部)，end指向buf3尾部
     3.开始调用ngx_http_request_body_filter，在该函数里面会重新分配一个ngx_buf_t，把r->request_body->buf成员赋值给她。然后把这个新的ngx_buf_t
     添加到r->request_body->bufs链表中。赋值完后r->request_body->buf中的start指向buf1的头部，pos last指向buf1尾部(buf2头部)，end指向buf3尾部
     4.从复上面的2 3步骤
     5.当解析完buf3的内容后，发现r->request_body->buf从内核读取到buf空间中的网络数据包已经被三个新的ngx_buf_t指向，并且这三个ngx_buf_t
       通过r->request_body->bufs链表连接在了一起，这时候r->request_body->buf中的end = last,也就是所有ngx_create_temp_buf开辟的内存空间
       已经存满了(recv的数据存在该空间里面)，并且数据分成三个ngx_buf_t指向这些空间，然后连接到了转存到了r->request_body->bufs链表上。在
     6.ngx_http_request_body_save_filter中检测到rb->buf->last == rb->buf->end，上面的buf(buf1+buf2+buf3)已经填满，然后通过r->request_body->bufs
       把三个ngx_buf_t指向的内存空间一次性写入临时文件，写入临时文件后，r->request_body->buf中的pos last指针重新指向头部，又可以从新从
       内核协议栈读取数据存储在里面了，然后从复1-5的过程
     
//读取客户包体即使是存入临时文件中，当所有包体读取完毕后(ngx_http_do_read_client_request_body)，还是会让r->request_body->bufs指向文件中的相关偏移内存地址
*/
static ngx_int_t
ngx_http_request_body_filter(ngx_http_request_t *r, ngx_chain_t *in)
{//in其实也是从r->request_body->buf中来的
    if (r->headers_in.chunked) {
        return ngx_http_request_body_chunked_filter(r, in);

    } else {
        return ngx_http_request_body_length_filter(r, in);
    }
}
/*
        这里开辟真正的读取数据的空间后，buf的指针指向终端空间的头尾以及解析完的数据的位置，
                    buf1                       buf2                    buf3
        _________________________________________________________________________________
        |                          |                         |                           |
        |__________________________|_________________________|___________________________|
     1.第一次开辟好存储数据的空间ngx_create_temp_buf后，r->request_body->buf pos last start指向buf1的头部，end指向buf3尾部
     2.假设第一次读取完内核协议栈的数据后填充好了buf1,r->request_body->buf中的pos start指向buf1的头部，last指向buf1尾部(buf2头部)，end指向buf3尾部
     3.开始调用ngx_http_request_body_filter，在该函数里面会重新分配一个ngx_buf_t，把r->request_body->buf成员赋值给她。然后把这个新的ngx_buf_t
     添加到r->request_body->bufs链表中。赋值完后r->request_body->buf中的start指向buf1的头部，pos last指向buf1尾部(buf2头部)，end指向buf3尾部
     4.从复上面的2 3步骤
     5.当解析完buf3的内容后，发现r->request_body->buf从内核读取到buf空间中的网络数据包已经被三个新的ngx_buf_t指向，并且这三个ngx_buf_t
       通过r->request_body->bufs链表连接在了一起，这时候r->request_body->buf中的end = last,也就是所有ngx_create_temp_buf开辟的内存空间
       已经存满了(recv的数据存在该空间里面)，并且数据分成三个ngx_buf_t指向这些空间，然后连接到了转存到了r->request_body->bufs链表上。在
     6.ngx_http_request_body_save_filter中检测到rb->buf->last == rb->buf->end，上面的buf(buf1+buf2+buf3)已经填满，然后通过r->request_body->bufs
       把三个ngx_buf_t指向的内存空间一次性写入临时文件，写入临时文件后，r->request_body->buf中的pos last指针重新指向头部，又可以从新从
       内核协议栈读取数据存储在里面了，然后从复1-5的过程
//读取客户包体即使是存入临时文件中，当所有包体读取完毕后(见ngx_http_do_read_client_request_body)，还是会让r->request_body->bufs指向文件中的相关偏移内存地址
*/

/*
ngx_http_request_body_filter 函数的目的就是要解析读取到的数据 in，追加到 request body 里的 bufs 列表中，busy 也指向要解析到的 chain 和 buf，
同时 函数会更新 request body 中 rest 的值，此值表示当前请求还有多少字节没有读取。
*/ //指向该函数后一般in->buf->last = in->buf->pos
static ngx_int_t
ngx_http_request_body_length_filter(ngx_http_request_t *r, ngx_chain_t *in)
{ //in其实也是从r->request_body->buf中来的
    size_t                     size;
    ngx_int_t                  rc;
    ngx_buf_t                 *b;
    ngx_chain_t               *cl, *tl, *out, **ll;
    ngx_http_request_body_t   *rb;

    rb = r->request_body;

    if (rb->rest == -1) {//第一次执行该函数  rest 设置为请求头的 content-length
        
        ngx_log_debug0(NGX_LOG_DEBUG_HTTP, r->connection->log, 0,
                       "http request body content length filter");

        rb->rest = r->headers_in.content_length_n;
    }

    out = NULL;
    ll = &out;

    //把in中的所有数据节点数据连接在一起添加到out头中
    for (cl = in; cl; cl = cl->next) {//遍历r->request_body中的所有buf

        if (rb->rest == 0) {//表示包体数据已经处理完毕
            break;
        }

        tl = ngx_chain_get_free_buf(r->pool, &rb->free); //从free链表中poll中获取ngx_chain_t空间，如果free中为空，则直接创建
        if (tl == NULL) {
            return NGX_HTTP_INTERNAL_SERVER_ERROR;
        }

        b = tl->buf; //获取tl中的buf

        ngx_memzero(b, sizeof(ngx_buf_t));

        //b的相关成员指针指向in中的各个节点里面的对于成员，即新的b指向获取到的包体数据中的各个ngx_buf_t
        //b指向的数据和cl->buf指向的数据时一致的，最后实际读取到的数据的头尾用b指向
        b->temporary = 1;
        b->tag = (ngx_buf_tag_t) &ngx_http_read_client_request_body;
        b->start = cl->buf->pos;
        b->pos = cl->buf->pos;
        b->last = cl->buf->last;
        b->end = cl->buf->end;
        b->flush = r->request_body_no_buffering;

        size = cl->buf->last - cl->buf->pos;

        if ((off_t) size < rb->rest) { //说明数据还不够r->headers_in.content_length_n;
            cl->buf->pos = cl->buf->last;
            rb->rest -= size; //已经获取到size了，还差rb->rest才到content_length_n

        } else { //说明已经获取到了content_length_n这么多包体，也就是包体已经够了
            cl->buf->pos += (size_t) rb->rest; //注意这时候的last没有移动，如果头部行content-length:len中的len小于实际携带的包体数据，就会造成pos小于last
            rb->rest = 0;//表示包体有这么多了
            b->last = cl->buf->pos; //实际读到的数据比我们期望的rest数据多，因此我们截取实际需要的数据即可
            b->last_buf = 1; //标记该buf是组成包体数据的buf数组中的最后一个ngx_buf_t
        }

        *ll = tl;
        ll = &tl->next; //前面创建的所有tl(ngx_chain_t)通过next连接在一起,所有这些节点的头部是前面的out
    }

//把in表中的数据(通过从新创建ngx_buf_t指向in表中各个数据的成员)连接到r->request_body->bufs中，这样所有的out数据都会添加到r->request_body->bufs数组中
//通过新创建的ngx_chain_t(之前out中的ngx_chain_t就通过下面的ngx_chain_update_chains进行回收)中的各个指针来执行新读取到的out数据，ngx_http_request_body_save_filter，通过该函数后所有的out数据都连接到rb->bufs中缓存了
    rc = ngx_http_top_request_body_filter(r, out); //ngx_http_request_body_save_filter
    

    //rb中的bufs链表中的成员中的各个指针指向读取到的原始数据位置(如pos指向读取到数据的头，last指向读取到数据的尾部)
    //rb->busy最初是直接从out中拷贝的，指向的数据空间最初与bufs是一样的，但是一旦http模块从网络读取到的数据中解析出一部分数据，那么free中成员的各个指针就会移动，例如pos会
    //向last方向移动，直到pos=list，这时候busy中的这个ngx_buf_t节点成员就可以从busy链表中取出，然后添加到free链表中
    ngx_chain_update_chains(r->pool, &rb->free, &rb->busy, &out,
                            (ngx_buf_tag_t) &ngx_http_read_client_request_body);

    return rc;
}


static ngx_int_t
ngx_http_request_body_chunked_filter(ngx_http_request_t *r, ngx_chain_t *in)
{
    size_t                     size;
    ngx_int_t                  rc;
    ngx_buf_t                 *b;
    ngx_chain_t               *cl, *out, *tl, **ll;
    ngx_http_request_body_t   *rb;
    ngx_http_core_loc_conf_t  *clcf;

    rb = r->request_body;

    if (rb->rest == -1) {

        ngx_log_debug0(NGX_LOG_DEBUG_HTTP, r->connection->log, 0,
                       "http request body chunked filter");

        rb->chunked = ngx_pcalloc(r->pool, sizeof(ngx_http_chunked_t));
        if (rb->chunked == NULL) {
            return NGX_HTTP_INTERNAL_SERVER_ERROR;
        }

        r->headers_in.content_length_n = 0;
        rb->rest = 3;
    }

    out = NULL;
    ll = &out;

    for (cl = in; cl; cl = cl->next) {

        for ( ;; ) {

            ngx_log_debug7(NGX_LOG_DEBUG_EVENT, r->connection->log, 0,
                           "http body chunked buf "
                           "t:%d f:%d %p, pos %p, size: %z file: %O, size: %O",
                           cl->buf->temporary, cl->buf->in_file,
                           cl->buf->start, cl->buf->pos,
                           cl->buf->last - cl->buf->pos,
                           cl->buf->file_pos,
                           cl->buf->file_last - cl->buf->file_pos);

            rc = ngx_http_parse_chunked(r, cl->buf, rb->chunked);

            if (rc == NGX_OK) {

                /* a chunk has been parsed successfully */

                clcf = ngx_http_get_module_loc_conf(r, ngx_http_core_module);

                if (clcf->client_max_body_size
                    && clcf->client_max_body_size
                       - r->headers_in.content_length_n < rb->chunked->size)
                {
                    ngx_log_error(NGX_LOG_ERR, r->connection->log, 0,
                                  "client intended to send too large chunked "
                                  "body: %O+%O bytes",
                                  r->headers_in.content_length_n,
                                  rb->chunked->size);

                    r->lingering_close = 1;

                    return NGX_HTTP_REQUEST_ENTITY_TOO_LARGE;
                }

                tl = ngx_chain_get_free_buf(r->pool, &rb->free);
                if (tl == NULL) {
                    return NGX_HTTP_INTERNAL_SERVER_ERROR;
                }

                b = tl->buf;

                ngx_memzero(b, sizeof(ngx_buf_t));

                b->temporary = 1;
                b->tag = (ngx_buf_tag_t) &ngx_http_read_client_request_body;
                b->start = cl->buf->pos;
                b->pos = cl->buf->pos;
                b->last = cl->buf->last;
                b->end = cl->buf->end;
                b->flush = r->request_body_no_buffering;

                *ll = tl;
                ll = &tl->next;

                size = cl->buf->last - cl->buf->pos;

                if ((off_t) size > rb->chunked->size) {
                    cl->buf->pos += (size_t) rb->chunked->size;
                    r->headers_in.content_length_n += rb->chunked->size;
                    rb->chunked->size = 0;

                } else {
                    rb->chunked->size -= size;
                    r->headers_in.content_length_n += size;
                    cl->buf->pos = cl->buf->last;
                }

                b->last = cl->buf->pos;

                continue;
            }

            if (rc == NGX_DONE) {

                /* a whole response has been parsed successfully */

                rb->rest = 0;

                tl = ngx_chain_get_free_buf(r->pool, &rb->free);
                if (tl == NULL) {
                    return NGX_HTTP_INTERNAL_SERVER_ERROR;
                }

                b = tl->buf;

                ngx_memzero(b, sizeof(ngx_buf_t));

                b->last_buf = 1;

                *ll = tl;
                ll = &tl->next;

                break;
            }

            if (rc == NGX_AGAIN) {

                /* set rb->rest, amount of data we want to see next time */

                rb->rest = rb->chunked->length;

                break;
            }

            /* invalid */

            ngx_log_error(NGX_LOG_ERR, r->connection->log, 0,
                          "client sent invalid chunked body");

            return NGX_HTTP_BAD_REQUEST;
        }
    }

    rc = ngx_http_top_request_body_filter(r, out);

    ngx_chain_update_chains(r->pool, &rb->free, &rb->busy, &out,
                            (ngx_buf_tag_t) &ngx_http_read_client_request_body);

    return rc;
}

/*
        这里开辟真正的读取数据的空间后，buf的指针指向终端空间的头尾以及解析完的数据的位置，
                    buf1                       buf2                    buf3
        _________________________________________________________________________________
        |                          |                         |                           |
        |__________________________|_________________________|___________________________|
     1.第一次开辟好存储数据的空间ngx_create_temp_buf后，r->request_body->buf pos last start指向buf1的头部，end指向buf3尾部
     2.假设第一次读取完内核协议栈的数据后填充好了buf1,r->request_body->buf中的pos start指向buf1的头部，last指向buf1尾部(buf2头部)，end指向buf3尾部
     3.开始调用ngx_http_request_body_filter，在该函数里面会重新分配一个ngx_buf_t，把r->request_body->buf成员赋值给她。然后把这个新的ngx_buf_t
     添加到r->request_body->bufs链表中。赋值完后r->request_body->buf中的start指向buf1的头部，pos last指向buf1尾部(buf2头部)，end指向buf3尾部
     4.从复上面的2 3步骤
     5.当解析完buf3的内容后，发现r->request_body->buf从内核读取到buf空间中的网络数据包已经被三个新的ngx_buf_t指向，并且这三个ngx_buf_t
       通过r->request_body->bufs链表连接在了一起，这时候r->request_body->buf中的end = last,也就是所有ngx_create_temp_buf开辟的内存空间
       已经存满了(recv的数据存在该空间里面)，并且数据分成三个ngx_buf_t指向这些空间，然后连接到了转存到了r->request_body->bufs链表上。在
     6.ngx_http_request_body_save_filter中检测到rb->buf->last == rb->buf->end，上面的buf(buf1+buf2+buf3)已经填满，然后通过r->request_body->bufs
       把三个ngx_buf_t指向的内存空间一次性写入临时文件，写入临时文件后，r->request_body->buf中的pos last指针重新指向头部，又可以从新从
       内核协议栈读取数据存储在里面了，然后从复1-5的过程
*/

//把in表中的成员buff拼接到r->request_body后面,如果rb->buf->last == rb->buf->end则会把
//当一个rb->buf填满后就会通过ngx_http_write_request_body把bufs链表中的所有ngx_chain_t->ngx_buf_t中指向的数据
//写入到临时文件，并把ngx_buf_t结构加入poll->chain,通过poll统一释放他们
ngx_int_t //通过ngx_http_top_request_body_filter调用
ngx_http_request_body_save_filter(ngx_http_request_t *r, ngx_chain_t *in)
{
#if (NGX_DEBUG)
    ngx_chain_t               *cl;
#endif
    ngx_http_request_body_t   *rb;

    rb = r->request_body;

#if (NGX_DEBUG)

    for (cl = rb->bufs; cl; cl = cl->next) {
        ngx_log_debug7(NGX_LOG_DEBUG_EVENT, r->connection->log, 0,
                       "http body old buf t:%d f:%d %p, pos %p, size: %z "
                       "file: %O, size: %O",
                       cl->buf->temporary, cl->buf->in_file,
                       cl->buf->start, cl->buf->pos,
                       cl->buf->last - cl->buf->pos,
                       cl->buf->file_pos,
                       cl->buf->file_last - cl->buf->file_pos);
    }

    for (cl = in; cl; cl = cl->next) {
        ngx_log_debug7(NGX_LOG_DEBUG_EVENT, r->connection->log, 0,
                       "http body new buf t:%d f:%d %p, pos %p, size: %z "
                       "file: %O, size: %O",
                       cl->buf->temporary, cl->buf->in_file,
                       cl->buf->start, cl->buf->pos,
                       cl->buf->last - cl->buf->pos,
                       cl->buf->file_pos,
                       cl->buf->file_last - cl->buf->file_pos);
    }

#endif

    /* TODO: coalesce neighbouring buffers */

    if (ngx_chain_add_copy(r->pool, &rb->bufs, in) != NGX_OK) {
        return NGX_HTTP_INTERNAL_SERVER_ERROR;
    }

//当一个rb->buf填满后就会通过ngx_http_write_request_body把bufs链表中的所有ngx_chain_t->ngx_buf_t中指向的数据
//写入到临时文件，并把ngx_buf_t结构加入poll->chain,通过poll统一释放他们
    if (rb->rest > 0
        && rb->buf && rb->buf->last == rb->buf->end
        && !r->request_body_no_buffering) 
        //需要缓存数据，并且rb->buf数据已经解析完毕，并且buf已经满了，但是包体还没有读完，那么就可以把buf中的数据写入临时文件，
        //这样改buf指向的内存空间在该函数退出后可以继续用来读取数据
    {
        if (ngx_http_write_request_body(r) != NGX_OK) {
            return NGX_HTTP_INTERNAL_SERVER_ERROR;
        }
    }

    return NGX_OK;
}

```