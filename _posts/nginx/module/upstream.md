---
layout: default
title: Upstream
parent: Nginx Modules
grand_parent: Nginx
nav_order: 3
permalink: docs/nginx/modules/
---

*2021-03-08*
# Upstream模块
{: .no_toc }

upstream是通过handler的方式运作，其模块名为ngx_http_proxy_module，工作在NGX_HTTP_CONTENT_PHASE阶段，通过按需挂载的方式，设置回调函数ngx_http_proxy_handler.
{: .fs-6 .fw-300 }

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---

##  报文转发过程

Nginx访问上游服务器的流程大致分以下几个阶段：启动upstream、连接上游服务器、向上游发送请求、接收上游响应（包头/包体）、结束请求。本篇主要从代码流程的角度，梳理一下upstream的整个的数据的处理流程。

### 基本结构

下面先看一下upstream相关的两个重要数据结构ngx_http_upstream_t和ngx_http_upstream_conf_t：
相关数据结构

```c
1. typedef struct ngx_http_upstream_s    ngx_http_upstream_t;
2. struct ngx_http_upstream_s {
3.     ngx_http_upstream_handler_pt read_event_handler;    // 处理读事件的回调方法
4.     ngx_http_upstream_handler_pt write_event_handler;   // 处理写事件的回调方法
5.     ngx_peer_connection_t peer;                         // 主动向上游发起的连接，稍后会详细分析
6.     ngx_event_pipe_t *pipe;                             // 当开启缓存配置，会用pipe来转发响应，需要http模块在使用upstream机制前构造pipe结构体
7.     ngx_chain_t *request_bufs;                          // 用链表将ngx_buf_t缓冲区链接起来，表示所有需要发送到上游的请求内容，
8.                                                         // create_request回调在于构造request_buf链表
9.     ngx_output_chain_ctx_t output;                      // 向下游发送响应的方式，稍后会详细分析
10.     ngx_chain_writer_ctx_t writer;                      // 向下游发送响应的方式，稍后会详细分析
11.     ngx_http_upstream_conf_t *conf;                     // upstream相关的配置信息
12. #if (NGX_HTTP_CACHE)
13.     ngx_array_t *caches;                                // 缓存数组，稍后会单独介绍缓存相关内容
14. #endif
15.     ngx_http_upstream_headers_in_t headers_in;          // 当直接转发时，process_header将解析的头部适配为http头部，同时将包头信息放在headers_in中
16.     ngx_http_upstream_resolved_t *resolved;             // 用于解析主机域名，后面会详细介绍
17.     ngx_buf_t from_client;                              // ToDo....
18.     ngx_buf_t buffer;                                   // 接收上游服务器响应包头的缓存区，当不需要直接响应或buffering为0时，也作为转发包体缓冲区  
19.     off_t length;                                       // 来自上游服务器的响应包体的长度
20.     ngx_chain_t *out_bufs;                              // 使用时再具体介绍，不同场景下有不同意义
21.     ngx_chain_t *busy_bufs;                             // 当buffering为0时，表示上一次向下游转发响应时没有发送完成的内容
22.     ngx_chain_t *free_bufs;                             // 当buffering为0时，用于回收out_bufs中已经发送给下游的ngx_buf_t结构体
23.     ngx_int_t (*input_filter_init)(void *data);         // 处理包体前的初始化方法，其中data用于传递用户数据结构，即下方的input_filter_ctx
24.     ngx_int_t (*input_filter)(void *data, ssize_t bytes)// 处理包体的方法，bytes表示本次接收到的包体长度，data同上
25.     void *input_filter_ctx;                             // 传递http模块的自定义的数据结构
26. #if (NGX_HTTP_CACHE)
27.     ngx_int_t (*create_key)(ngx_http_request_t *r);     // cache部分，后面再分析
28. #endif
29.     ngx_int_t (*create_request)(ngx_http_request_t *r); // 用于构造发往上游服务器的请求
30.     ngx_int_t (*reinit_request)(ngx_http_request_t *r); // 与上游通讯失败，需要重新发起连接时，用该方法重新初始化请求信息
31.     ngx_int_t (*process_header)(ngx_http_request_t *r); // 解析上游服务器返回响应的包头，NGX_AGAIN接收不完整，NGX_OK解析到完整包头
32.     void (*abort_request)(ngx_http_request_t *r);       // 暂时没有用到
33.     void (*finalize_request)(ngx_http_request_t *r,     // 请求结束时会调用，目前没有实际作用
34.                                          ngx_int_t rc);
35.     ngx_int_t (*rewrite_redirect)(ngx_http_request_t *r,// 上游返回响应中含Location或Refresh时，process_header会调用http模块实现的该方法
36.                      ngx_table_elt_t *h, size_t prefix);
37.     ngx_int_t (*rewrite_cookie)(ngx_http_request_t *r,  // 同上，当响应中含Set-Cookie时，会调用http模块实现的该方法
38.                                ngx_table_elt_t *h);
39.     ngx_msec_t timeout;                                 // 暂时没有用到
40.     ngx_http_upstream_state_t *state;                   // 用于表示上游响应的错误码、包体长度等信息
41.     ngx_str_t method;                                   // 用于文件缓存，稍后再进行分析
42.     ngx_str_t schema;                                   // 记录日志时使用
43.     ngx_str_t uri;                                      // 记录日志时使用
44.     ngx_http_cleanup_pt *cleanup;                       // 用于标识是否需要清理资源，相当于一个标志位，实际不会调用该方法
45.     unsigned store:1;                                   // 是否指定文件缓存路径的标志位
46.     unsigned cacheable:1;                               // 是否启用文件缓存
47.     unsigned accel:1;                                   // 目前没有用到
48.     unsigned ssl:1;                                     // 是否基于SSL协议访问上游服务器
49.     unsigned buffering:1;                               // 向下游转发响应包体时，是否开启更大内存及临时磁盘文件用于缓存来不及发送到下游的响应包体
50.     unsigned keepalive:1;                               // 标识与后端是否开启keepalive ?
51.     unsigned upgrade:1;                                 // 是否存在upgrade header
52.     unsigned request_sent:1;                            // 是否向上游服务器发送了请求
53.     unsigned header_sent:1;                             // 为1时，表示包头已经转发给客户端了
54. }
```

### 处理过程

ngx_http_upstream_conf_t：指定了upstream的运行方式，必须在启动upstream之前设置

```c

55. typedef struct {
56.     ngx_http_upstream_srv_conf_t *upstream; // 当上面没有实现resolved成员时，用该结构体定义上游服务器的配置
57.     ngx_msec_t connect_timeout;       // 建立tcp连接的超时时间，即写事件添加到定时器中设置的超时时间
58.     ngx_msec_t send_timeout;          // 发送请求的超时时间，即写事件添加到定时器中设置的超时时间
59.     ngx_msec_t read_timeout;          // 接收响应的超时时间，即读事件添加到定时器中设置的超时时间
60.     ngx_msec_t timeout;               // 暂时没有使用
61.     ngx_msec_t next_upstream_timeout; // 
62.     size_t send_lowat;                // 发送缓存区的下限，即TCP的SO_SNOLOWAT选项
63.     size_t buffer_size;               // 指定接收头部缓冲区分配的内存大小，当buffering为0时，由于上述buffer同时用于接收包体，也表示接收包体缓冲区大小
64.     size_t limit_rate;                // 
65.     size_t busy_buffers_size;         // 当buffering为1，且向下游转发响应时生效，会设置到ngx_event_pipe_t结构体的busy_size中
66.     size_t max_temp_file_size;        // 指定临时文件的大小，限制ngx_event_pipe_t中的temp_file
67.     size_t temp_file_write_size;      // 将缓冲区的响应写入临时文件时，一次写入字符流的最大长度
68.     ......
69.     ngx_bufs_t bufs;                  // 以缓存响应的方式转发上游服务器的包体时所使用的内存大小
70.     ngx_uint_t ignore_headers;        // 以位图的形式标识在转发时需要忽略的headers
71.     ngx_uint_t next_upstream;         // 以位图的方式表示一些错误码，当处理上游响应时发现该错误码，选择下一个上游服务器重发请求
72.     ngx_uint_t store_access;          // 表示创建的临时目录和文件的权限
73.     ngx_uint_t next_upstream_tries;   // 
74.     ngx_flag_t buffering;             // 为1时表示打开缓存，尽量在内存和磁盘中缓存来自上游的响应，为0时则开辟固定大小内存块作为缓存来转发响应
75.     ......
76.     ngx_flag_t ignore_client_abort;   // 为1时，表示与上游服务器交互时不检查nginx与下游服务器是否断开，即使下游主动关闭连接，也不会中断与上游交互
77.     ngx_flag_t intercept_errors;      // 详见ngx_http_upstream_intercept_errors
78.     ngx_flag_t cyclic_temp_file;      // 为1时，会尝试复用临时文件中已经使用过的空间
79.     ......
80.     ngx_path_t *temp_path;            // buffering为1的情况下转发响应时，存放临时文件的路径
81.     ngx_hash_t hide_headers_hash;     // 不转发的头部，根据hide_headers和pass_headers动态数组构造出的需要隐藏的http头部散列表
82.     ngx_array_t *hide_headers;        // 当转发上游头部给下游时，如果不希望将某些头部转发给下游，则设置到该数组中
83.     ngx_array_t *pass_headers;        // 转发头部时upstream机制默认不会转发某些头部，当确定需要转发时，需要设置到该数组中
84.     ngx_http_upstream_local_t *local; // 连接上游服务器时，需要使用的本机地址
85.     ngx_array_t *store_lengths;       // 当需要将上游响应缓存到文件中时，表示存放路径的长度
86.     ngx_array_t *store_values;        // 当需要将上游响应缓存到文件中时，表示存放路径
87.     ......
88.     signed store:2;                   // 同ngx_http_upstream_t中的store
89.     unsigned intercept_404:1;         // 如果该值设为1，当上游返回404时直接转发该错误码给下游，而不会去与error_page进行比较
90.     unsigned change_buffering:1;      // 当为1时，根据上游服务器返回的响应头部，动态决定是以上游网速优先，还是下游网速优先
91.     ......
92.     ngx_str_t module;                 // 使用upstream的模块名称，仅用于记录日志
93. } ngx_http_upstream_conf_t
启动upstream
当收到请求后，http的代理模块是ngx_http_proxy_module，其NGX_HTTP_CONTENT_PHASE阶段的处理函数为ngx_http_proxy_handler


94. static ngx_int_t
95. ngx_http_proxy_handler(ngx_http_request_t *r)
96. {
97.     // 创建ngx_http_upstream_t结构，并赋值给r->upstream
98.     if (ngx_http_upstream_create(r) != NGX_OK) {
99.         return NGX_HTTP_INTERNAL_SERVER_ERROR;
100.     }
101.     .....
102.     plcf = ngx_http_get_module_loc_conf(r, ngx_http_proxy_module);
103.     .....
104.     u = r->upstream;
105.     .....
106.     // 给upstream的conf成员赋值，记录相关的配置信息
107.     u->conf = &plcf->upstream;
108.     // 设置相关的回调信息
109.     u->create_request = ngx_http_proxy_create_request;
110.     u->reinit_request = ngx_http_proxy_reinit_request;
111.     u->process_header = ngx_http_proxy_process_status_line;
112.     u->abort_request = ngx_http_proxy_abort_request;
113.     u->finalize_request = ngx_http_proxy_finalize_request;
114.     ......
115.     u->buffering = plcf->upstream.buffering;
116.     .....
117.     // 调用ngx_http_upstream_init函数
118.     rc = ngx_http_read_client_request_body(r, ngx_http_upstream_init);
119.     .....
120.     return NGX_DONE;
121. }
首先创建upstream的结构并进行设置，然后设置ngx_http_upstream_conf_t配置结构体给upstream->conf。ngx_http_upstream_init函数会根据
ngx_http_upstream_conf_t配置的信息初始化upstream，同时开始连接上游服务器，由此展开整个upstream的处理流程。


122. void ngx_http_upstream_init(ngx_http_request_t *r)
123. {
124.     ngx_connection_t *c;
125.     // 客户端的连接
126.     c = r->connection;
127.     ......
128.     // 当启用upstream时，需要将客户端对应的读事件从定时器中删除，此时主要关注上游的连接相关的事件
129.     if (c->read->timer_set) {
130.         ngx_del_timer(c->read);
131.     }
132.     ......
133.     ngx_http_upstream_init_request(r);
134. }
继续看ngx_http_upstream_init_request函数


135. static void ngx_http_upstream_init_request(ngx_http_request_t *r)
136. {
137.     u = r->upstream;
138.     u->store = u->conf->store;
139.     ......
140.     // 设置Nginx与下游客户端之间TCP连接的检查方法，注意几个条件，ignore来自之前配置属性，是否忽略客户端的连接状态
141.     if (!u->store && !r->post_action && !u->conf->ignore_client_abort) {
142.         r->read_event_handler = ngx_http_upstream_rd_check_broken_connection;
143.         r->write_event_handler = ngx_http_upstream_wr_check_broken_connection;
144.     }
145.     ......
146.     // 调用http模块实现的create_request方法，即前面注册的ngx_http_proxy_create_request函数，用于构造发到上游服务器的请求
147.     if (u->create_request(r) != NGX_OK) {
148.         ngx_http_finalize_request(r, NGX_HTTP_INTERNAL_SERVER_ERROR);
149.         return;
150.     }
151.     ......
152.     // 向当前请求的main成员指向的原始请求中的cleanup链表末尾添加一个新成员
153.     cln = ngx_http_cleanup_add(r, 0);
154.     // 将handler的回调方法设置为ngx_http_upstream_cleanup
155.     cln->handler = ngx_http_upstream_cleanup;
156.     cln->data = r;
157.     u->cleanup = &cln->handler;
158.     ......
159.     // 调用ngx_http_upstream_connect向上游服务器发起连接
160.     ngx_http_upstream_connect(r, u);
161. }
与上游服务器建立连接
upstream机制与上游服务器之间通过tcp建立连接，为了保证三次握手的过程中不阻塞进程，Nginx采用了无阻塞的套接字来连接上游服务器。
ngx_http_upstream_connect负责发起建连动作，如果没有立即返回成功，需要在epoll中监控该套接字，当出现可写事件时，则说明连接已经建立成功。



162. static void ngx_http_upstream_connect(ngx_http_request_t *r, ngx_http_upstream_t *u)
163. {
164.     // 建连的动作主要由下面函数进行.....
165.     rc = ngx_event_connect_peer(&u->peer);
166.     ....
167.     


168. ngx_int_t ngx_event_connect_peer(ngx_peer_connection_t *pc)
169. {
170.     // 创建tcp socket套接字
171.     s = ngx_socket(pc->sockaddr->sa_family, SOCK_STREAM, 0);
172.     ......
173.     // 获取空闲的ngx_connection_t结构来承载连接，从ngx_cycle_t的free_connections指向的空闲连接池中获取
174.     c = ngx_get_connection(s, pc->log);
175.     ......
176.     // 设置连接为非阻塞的模式
177.     if (ngx_nonblocking(s) == -1) {
178.         ......
179.     // 绑定地址和端口
180.     if (pc->local) {
181.         if (bind(s, pc->local->sockaddr, pc->local->socklen) == -1) {
182.         ......
183.     // 设置连接收发相关的回调函数
184.     c->recv = ngx_recv;
185.     c->send = ngx_send;
186.     c->recv_chain = ngx_recv_chain;
187.     c->send_chain = ngx_send_chain;
188.     // 启用sendfile的支持
189.     c->sendfile = 1;
190.     ......
191.     rev = c->read;
192.     wev = c->write;
193.     ......
194.     pc->connection = c;
195.     // 调用ngx_event_actions.add_conn将tcp套接字以期待可读、可写的方式添加到事件搜集器中，这里是把套接字加到epoll中
196.     if (ngx_add_conn) {
197.         if (ngx_add_conn(c) == NGX_ERROR) {
198.             goto failed;
199.         }
200.     }
201.     // 向上游服务器发起连接，由于非阻塞，调用会立即返回
202.     rc = connect(s, pc->sockaddr, pc->socklen);
203.     ......
回到ngx_http_upstream_connect继续分析


204. static void ngx_http_upstream_connect(ngx_http_request_t *r, ngx_http_upstream_t *u)
205. {
206.     ......
207.     // 上面已经分析了，该函数主要进行上游服务器的连接
208.     rc = ngx_event_connect_peer(&u->peer);
209.     ......
210.     c = u->peer.connection;
211.     c->data = r;
212.     // 将上游connection上读写事件的回调，都设置为ngx_http_upstream_handler
213.     c->write->handler = ngx_http_upstream_handler;
214.     c->read->handler = ngx_http_upstream_handler;
215.     // 设置upstream机制的write_event_handler和read_event_handler，具体使用见后续的ngx_upstream_handler函数
216.     // ngx_http_upstream_send_request_handler用于向上游发送请求
217.     u->write_event_handler = ngx_http_upstream_send_request_handler;
218.     // ngx_http_upstream_process_header接收和解析上游服务器的响应
219.     u->read_event_handler = ngx_http_upstream_process_header;
220.     ......
221.     if (rc == NGX_AGAIN) {
222.         // 当连接没有建立成功时，套接字已经在epoll中了，将写事件添加到定时器中，超时时间是ngx_http_upstream_conf_t中的connect_timeout成员
223.         ngx_add_timer(c->write, u->conf->connect_timeout);
224.         return;
225.     }
226.     ......
227.     // 当成功建立连接时，向上游服务器发送请求，注意：此处的函数与上面设置的定时器回调的函数有所不同，下文会进行说明
228.     ngx_http_upstream_send_request(r, u);
229. }
下面先简单看一下connection的读写回调函数——ngx_http_upstream_handler


230. static void
231. ngx_http_upstream_handler(ngx_event_t *ev)
232. {
233.     ......
234.     // 由事件的data成员取得ngx_connection_t连接，该连接是nginx与上游服务器之间的连接
235.     c = ev->data;
236.     // 由连接的data取得ngx_http_request_t结构体
237.     r = c->data;
238.     // 由请求的upstream成员取的表示upstream机制的ngx_http_upstream_t结构体
239.     u = r->upstream;
240.     // 此处ngx_http_request_t结构中的connection成员代表的是客户端与nginx之间连接
241.     c = r->connection;
242.     ......
243.     if (ev->write) {
244.         // nginx与上游服务器间的tcp连接的可写事件被触发时，该方法被调用
245.         u->write_event_handler(r, u);
246.     } else {
247.         // nginx与上游服务器间的tcp连接的可读事件被触发时，该方法被调用
248.         u->read_event_handler(r, u);
249.     }
250.     // 与nginx_http_request_handler相同，最后一步执行post请求
251.     ngx_http_run_posted_requests(c);
252. }
发送请求到上游服务器
前面在介绍ngx_http_upstream_connect函数时，我们看到将ngx_http_upstream_t中的write_event_handler设置为了ngx_http_upstream_send_request_handler，而ngx_http_upstream_connect的最后直接调用了ngx_http_upstream_send_request发送请求。
下面先来看一下两者的区别


253. static void ngx_http_upstream_send_request_handler(ngx_http_request_t *r, ngx_http_upstream_t *u)
254. {
255.     ngx_connection_t *c;
256.     // 获取与上游服务器间表示连接的ngx_connection_t结构体
257.     c = u->peer.connection;
258.     // 当写事件的timeout被设置为1时，则代表向上游发送http请求已经超时
259.     if (c->write->timedout) {
260.         // 将超时错误传给next方法，next方法根据允许的重传策略决定：重新发起连接执行upstream请求，还是结束upstream请求
261.         ngx_http_upstream_next(r, u, NGX_HTTP_UPSTREAM_FT_TIMEOUT);
262.         return;
263.     }
264.     ......
265.     // header_sent为1时，表示上游服务器的响应需要直接转发给客户端，而且此时响应包头已经转给客户端了
266.     if (u->header_sent) {
267.         // 由于此时已经收到了上游服务器的完整包头，此时不需要再向上游发送请求，因此将write回调设置为空函数（只记录日志）
268.         u->write_event_handler = ngx_http_upstream_dummy_handler;
269.         // 将写事件添加到epoll中
270.         (void) ngx_handle_write_event(c->write, 0);
271.         return;
272.     }
273.     // 调用下面函数向上游发送http请求
274.     ngx_http_upstream_send_request(r, u);
275. }
通过上面的分析，现在很容易看出两者的区别，ngx_http_upstream_send_request_handler更多的是在检测请求的状态，而实际的发送函数是
ngx_http_upstream_send_request，下面继续看一下该函数。


276. static void ngx_http_upstream_send_request(ngx_http_request_t *r, ngx_http_upstream_t *u)
277. {
278.     ......
279.     // 发送u->request_bufs链表上的请求内容，该函数会把未一次发送完的链表缓冲区保存下来，再次调用时不需要request_bufs参数
280.     rc = ngx_output_chain(&u->output, u->request_sent ? NULL : u->request_bufs);
281.     
282.     // 标识已经向上游发送了请求，实际上是为了标识是否调用过ngx_output_chain，除了第一次，其他时候不需要再传送request_bufs，直接设置为NULL
283.     u->request_sent = 1;
284.     ......
285.     // 当写事件仍在定时器中时，先将写事件从定时器中移出，由ngx_output_chain的返回值决定是否需要向定时器中增加写事件
286.     if (c->write->timer_set) {
287.         ngx_del_timer(c->write);
288.     }
289.     // 当ngx_output_chain返回NGX_AGAIN时，说明请求还没有发完，此时需要设置写事件定时器
290.     if (rc == NGX_AGAIN) {
291.         ngx_add_timer(c->write, u->conf->send_timeout);
292.         // 将写事件添加到epoll中
293.         if (ngx_handle_write_event(c->write, u->conf->send_lowat) != NGX_OK) {
294.             ngx_http_upstream_finalize_request(r, u,
295.                                                NGX_HTTP_INTERNAL_SERVER_ERROR);
296.             return;
297.         }
298.         // 结束ngx_http_upstream_send_request的执行，等待epoll事件触发
299.         return;
300.     }
301.     /* rc == NGX_OK */
302.     // 当ngx_output_chain返回NGX_OK时，表示向上游服务器发送完了所有的请求，将写事件的回调设置为空函数
303.     ......
304.     u->write_event_handler = ngx_http_upstream_dummy_handler;
305.     // 重新添加到epoll中
306.     if (ngx_handle_write_event(c->write, 0) != NGX_OK) {
307.         ngx_http_upstream_finalize_request(r, u,
308.                                            NGX_HTTP_INTERNAL_SERVER_ERROR);
309.         return;
310.     }
311.     // 发送完请求后，需要开始读上游返回的响应，设置读事件的超时时间
312.     ngx_add_timer(c->read, u->conf->read_timeout);
313.     // 当ready已经设置时，说明应答已经到位，调用process_header开始处理来自上游的响应
314.     if (c->read->ready) {
315.         ngx_http_upstream_process_header(r, u);
316.         return;
317.     }
318. }
接收上游服务器的响应
Nginx的upstream机制支持三种响应包体的处理方式：不转发响应、转发响应时以下游网速优先、转发响应时以上游网速优先。当ngx_http_request_t结构体的
subrequest_in_memory标志位为1时，即不转发响应；当subrequest_in_memory为0时，则转发响应；而ngx_http_upstream_conf_t配置结构中的buffering
为0时，则以下游网速优先，即使用固定大小的内存作为缓存；当buffering为1时，则以上游网速优先，即采用更多的内存、硬盘文件作为缓存。

下面看一下用于接收、解析响应头部的ngx_http_upstream_process_header方法


319. static void
320. ngx_http_upstream_process_header(ngx_http_request_t *r, ngx_http_upstream_t *u)
321. {
322.     ......
323.     // 获取到上游服务器的连接信息
324.     c = u->peer.connection;
325.     ......
326.     // 检查是否发生了读事件超时，如果发生了超时，则调用ngx_http_upstream_next函数决定下一步动作
327.     if (c->read->timedout) {
328.         ngx_http_upstream_next(r, u, NGX_HTTP_UPSTREAM_FT_TIMEOUT);
329.         return;
330.     }
331.     // request_sent为1则代表已经向上游发过请求；为0则代表还没有发送请求，没有发送请求却收到上游的响应时，则不符合逻辑，进行下一步动作
332.     // ngx_http_upstream_next会根据配置信息决定是否直接结束请求，还是寻找下一个上游服务器
333.     if (!u->request_sent && ngx_http_upstream_test_connect(c) != NGX_OK) {
334.         ngx_http_upstream_next(r, u, NGX_HTTP_UPSTREAM_FT_ERROR);
335.         return;
336.     }
337.     // 检查用于接收上游响应的buffer，当start为NULL时，代表该缓冲区尚未进行分配，此时会按照配置指定的buffer_size进行缓冲区的分配
338.     if (u->buffer.start == NULL) {
339.         u->buffer.start = ngx_palloc(r->pool, u->conf->buffer_size);
340.         if (u->buffer.start == NULL) {
341.             ngx_http_upstream_finalize_request(r, u, NGX_HTTP_INTERNAL_SERVER_ERROR);
342.             return;
343.         }
344.         // 针对新申请的缓冲区进行初始化，省略
345.         .......
346.     }
347.     for ( ;; ) {
348.         // 读取响应的内容存储在buffer中，每次读取的最大不超过buffer_size，即当前缓冲区的剩余空间大小
349.         n = c->recv(c, u->buffer.last, u->buffer.end - u->buffer.last);
350.         // NGX_AGAIN代表响应还没有读完，设置读事件到epoll中，等待下一次读取
351.         if (n == NGX_AGAIN) {
352.             if (ngx_handle_read_event(c->read, 0) != NGX_OK) {
353.                 ngx_http_upstream_finalize_request(r, u, NGX_HTTP_INTERNAL_SERVER_ERROR);
354.                 return;
355.             }
356.             return;
357.         }
358.         // 读取出错或者连接已关闭，则调用next函数决定是终止连接，还是重新选择上游服务器
359.         if (n == NGX_ERROR || n == 0) {
360.             ngx_http_upstream_next(r, u, NGX_HTTP_UPSTREAM_FT_ERROR);
361.             return;
362.         }
363.         // n 大于0时，代表读取到的数据，此时last游标需要往后移动n个字节，last初始化时与start相同，指向buffer起始地址
364.         u->buffer.last += n;
365.         // 开始处理读取到的响应头部信息
366.         rc = u->process_header(r);
367.         // 检查process_header的返回值，当返回NGX_AGAIN时，需要判断一下是否当前的缓冲区已经被用尽，如果被用尽说明一个buffer_size无法容纳整个响应头部
368.         if (rc == NGX_AGAIN) {
369.             // 当buffer无法容纳整个响应头部时，调用next决定是终止连接还是选择下一个上游服务器
370.             if (u->buffer.last == u->buffer.end) {
371.                 ngx_http_upstream_next(r, u, NGX_HTTP_UPSTREAM_FT_INVALID_HEADER);
372.             ......
373.     }
374.     // 当process_header处理的是完整的响应头部时，会进一步判断其返回值，检测到无效的响应头部时，进行next的进一步决策处理
375.     if (rc == NGX_HTTP_UPSTREAM_INVALID_HEADER) {
376.         ngx_http_upstream_next(r, u, NGX_HTTP_UPSTREAM_FT_INVALID_HEADER);
377.         return;
378.     }
379.     // 当process_header返回ERROR时，直接终止当前的请求
380.     if (rc == NGX_ERROR) {
381.         ngx_http_upstream_finalize_request(r, u, NGX_HTTP_INTERNAL_SERVER_ERROR);
382.         return;
383.     }
384.     // 走到目前位置，当前的process_header至少是执行成功了，完整的解析了响应的头部信息
385.     /* rc == NGX_OK */
386.     .......
387.     // 处理已经解析出的头部，该函数会把已经解析出的头部，设置到ngx_http_request_t结构体的headers_out成员中
388.     // 当调用ngx_http_send_header时，可以将设置到headers_out中的响应头部发送给客户端
389.     if (ngx_http_upstream_process_headers(r, u) != NGX_OK) {
390.         return;
391.     }
392.     // subrequest_in_memory字段为0时，表示需要转发响应到客户端；为1时，表示不需要转发响应到客户端
393.     if (!r->subrequest_in_memory) {
394.         // 发送响应给客户端
395.         ngx_http_upstream_send_response(r, u);
396.         return;
397.     }
398.     // 以下的逻辑是不需要转发响应给客户端，即subrequest_in_memory为1的情况
399.     /* subrequest content in memory */
400.     // 检查一下input_filter是否为NULL，input_filter用于处理响应的包体，当没有定义自己的实现方法时，使用默认的处理方法
401.     if (u->input_filter == NULL) {
402.         u->input_filter_init = ngx_http_upstream_non_buffered_filter_init; 
403.         u->input_filter = ngx_http_upstream_non_buffered_filter;  
404.         u->input_filter_ctx = r; 
405.     }
406.     // 调用init方法为即将进行的包体处理做一些初始化的工作，默认的init函数是空的，什么也没做    
407.     if (u->input_filter_init(u->input_filter_ctx) == NGX_ERROR) {
408.         ngx_http_upstream_finalize_request(r, u, NGX_ERROR);
409.         return;
410.     }
411.     // pos与last之间的内容是已经读取但尚未处理的数据
412.     n = u->buffer.last - u->buffer.pos;
413.     // 当process_header处理完后，如果还有尚未处理的数据，那说明除了读到了包头之外，还读到部分包体信息
414.     if (n) {
415.         u->buffer.last = u->buffer.pos;
416.         u->state->response_length += n;
417.         // 调用input_filter处理已经读到的包体信息
418.         if (u->input_filter(u->input_filter_ctx, n) == NGX_ERROR) {
419.             ngx_http_upstream_finalize_request(r, u, NGX_ERROR);
420.             return;
421.         }
422.     }
423.     ......
424.     // 设置处理上游响应包体的回调函数
425.     u->read_event_handler = ngx_http_upstream_process_body_in_memory;
426.     // 开始处理包体的信息
427.     ngx_http_upstream_process_body_in_memory(r, u);
428. }
下面继续分析一下，不用upstream直接转发响应时的具体处理流程，主要是上面subrequest_memory为1的场景，此时该请求属于一个子请求。
我们看一下上面分析时提到的默认的input_filter的处理方法，在上面的分析中，如果读取包头时同时读到了包体信息，会调用input_filter方法处理：


429. static ngx_int_t ngx_http_upstream_non_buffered_filter(void *data, ssize_t bytes)
430. {
431.     // data指向了请求的ngx_http_request_t结构，前面函数中当没有定义input_filter时，对input_filter_ctx进行了重新初始化，指向了ngx_http_request_t
432.     ngx_http_request_t *r = data;
433.     ......
434.     u = r->upstream;
435.     
436.     // 遍历out_bufs使ll指向最后一个缓冲区->next的地址
437.     for (cl = u->out_bufs, ll = &u->out_bufs; cl; cl = cl->next) {
438.         ll = &cl->next;
439.     }
440.     // 申请新的缓冲区
441.     cl = ngx_chain_get_free_buf(r->pool, &u->free_bufs);
442.     if (cl == NULL) {
443.         return NGX_ERROR;
444.     }
445.     // 将新申请的缓冲区挂在out_bufs的链表末尾
446.     *ll = cl;
447.     ......
448.     // buffer为接收上游响应包体的缓冲区
449.     b = &u->buffer;
450.     // b->last在调用该函数时，已经指向了接收到的包体的首地址，cl->buf->pos指向首地址后，将b->last和cl->buf->last设置为保存包体尾部
451.     cl->buf->pos = b->last;
452.     b->last += bytes;
453.     cl->buf->last = b->last;
454.     cl->buf->tag = u->output.tag;
455.     // 如果没有设置包体长度，则到此可以结束了
456.     if (u->length == -1) {
457.         return NGX_OK;
458.     }
459.     // 计算还需要接收的包体的长度
460.     u->length -= bytes;
461.     return NGX_OK;
462. }
继续向下分析，process_header调用input_filter处理完包体后，最后调用的函数时ngx_http_upstream_process_body_in_memory，
该函数实际上会接收上游服务器的包体内容，下面看一下具体实现。


463. static void ngx_http_upstream_process_body_in_memory(ngx_http_request_t *r, ngx_http_upstream_t *u)
464. {
465.     ......
466.     // 获取到上游的连接信息
467.     c = u->peer.connection;
468.     // 获取该连接的读事件，判断是否发生了读事件的超时，如果超时，则直接结束连接
469.     rev = c->read;
470.     if (rev->timedout) {
471.         ngx_connection_error(c, NGX_ETIMEDOUT, "upstream timed out");
472.         ngx_http_upstream_finalize_request(r, u, NGX_HTTP_GATEWAY_TIME_OUT);
473.         return;
474.     }
475.     // buffer为存储上游响应包体的缓冲区
476.     b = &u->buffer;
477.     for ( ;; ) {
478.         // 计算剩余空闲缓冲区的大小
479.         size = b->end - b->last;
480.         ......
481.         // 如果还有空闲的空间，调用recv方法继续读取响应
482.         n = c->recv(c, b->last, size);
483.         // 此处NGX_AGAIN代表需要等待下一次的读事件
484.         if (n == NGX_AGAIN) {
485.             break;
486.         }
487.         // 如果上游主动关闭连接，或者读取出现错误，则直接关闭连接    
488.         if (n == 0 || n == NGX_ERROR) {
489.             ngx_http_upstream_finalize_request(r, u, n);
490.             return;
491.         }
492.         // 更新读到的响应包体的长度
493.         u->state->response_length += n;
494.         // 处理读到的包体内容
495.         if (u->input_filter(u->input_filter_ctx, n) == NGX_ERROR) {
496.             ngx_http_upstream_finalize_request(r, u, NGX_ERROR);
497.             return;
498.         }
499.             
500.         if (!rev->ready) {
501.             break;
502.         }
503.     }
504.     // 如果包体长度没有设置，则可以直接结束请求了
505.     if (u->length == 0) {
506.         ngx_http_upstream_finalize_request(r, u, 0);
507.         return;
508.     }
509.     // 将读事件增加到Epoll中
510.     if (ngx_handle_read_event(rev, 0) != NGX_OK) {
511.         ngx_http_upstream_finalize_request(r, u, NGX_ERROR);
512.         return;
513.     }
514.     // 将读事件同时添加到定时器中，超时时间为配置的read_timeout，避免长时间等待
515.     if (rev->active) {
516.         ngx_add_timer(rev, u->conf->read_timeout);
517.     
518.     } else if (rev->timer_set) {
519.         ngx_del_timer(rev);
520.     }
521. }
上面流程很容易看出一个问题，那就是读取响应头的Buffer的空间可能不足，导致处理出现问题。使用时关键还在于Input_filter方法中对buffer的管理。
分析完不转发响应的过程后，继续看一下转发响应的两种实现方式，下游网速优先和上游网速优先的实现。由于上游网速优先的方式，实现较为复杂，下面先看一下下游网速优先的方式，即采用固定的内存大小，作为响应的缓冲区。代码上也删减不必要的逻辑。

下游网速优先


522. static void
523. ngx_http_upstream_send_response(ngx_http_request_t *r, ngx_http_upstream_t *u)
524. {
525.     ......
526.     // 向下游的客户端发送响应头部，前面process_header处理时先将响应头部设置到了headers_in中，然后upstream_process_headers将headers_in中的
527.     // 头部设置到headers_out中，ngx_http_send_header就是将headers_out中的http包头发送给客户端
528.     rc = ngx_http_send_header(r);
529.     ......
530.     // 设置头部已发送的标志
531.     u->header_sent = 1;
532.     ......
533.     // 如果早期的请求携带了包体信息，且用到了临时文件，则先清理临时文件，因为已经收到响应了，请求的临时文件肯定用不到了
534.     if (r->request_body && r->request_body->temp_file) {
535.         ngx_pool_run_cleanup_file(r->pool, r->request_body->temp_file->file.fd);
536.         r->request_body->temp_file->file.fd = NGX_INVALID_FILE;
537.     }
538.     ......
539.     // buffering为1代表上游网速优先，为0代表下游网速优先
540.     if (!u->buffering) {
541.         // 看一下用户有没有设置input_filter，没有的话使用默认的input_filter函数
542.         if (u->input_filter == NULL) {
543.             u->input_filter_init = ngx_http_upstream_non_buffered_filter_init;
544.             u->input_filter = ngx_http_upstream_non_buffered_filter;
545.             u->input_filter_ctx = r;
546.         }
547.         // 设置接收上游响应的回调函数
548.         u->read_event_handler = ngx_http_upstream_process_non_buffered_upstream;
549.         // 设置向下游客户端发送报文的回调函数
550.         r->write_event_handler = ngx_http_upstream_process_non_buffered_downstream;
551.     
552.         r->limit_rate = 0;
553.         // 为input_filter处理包体做初始化的准备函数，默认实现是空的
554.         if (u->input_filter_init(u->input_filter_ctx) == NGX_ERROR) {
555.             ngx_http_upstream_finalize_request(r, u, NGX_ERROR);
556.             return;
557.         }
558.         ......
559.         // 看一下解析完包头后，是否还有未解析的包体信息，如果存在包体，则先处理一次包体，和前面分析不转发响应的逻辑是一样的
560.         n = u->buffer.last - u->buffer.pos;
561.         if (n) {
562.             // last指向代处理的包体的起始地址，更新response_length，调用input_filter处理当前的包体
563.             u->buffer.last = u->buffer.pos;
564.             u->state->response_length += n;
565.             if (u->input_filter(u->input_filter_ctx, n) == NGX_ERROR) {
566.                 ngx_http_upstream_finalize_request(r, u, NGX_ERROR);
567.                 return;
568.             }
569.             // 调用downstream将本次的包体转发给客户端
570.             ngx_http_upstream_process_non_buffered_downstream(r);
571.         } else {
572.             // 清空buff，实际上是将pos和last指针复位
573.             u->buffer.pos = u->buffer.start;
574.             u->buffer.last = u->buffer.start;
575.             // Todo....
576.             if (ngx_http_send_special(r, NGX_HTTP_FLUSH) == NGX_ERROR) {
577.                 ngx_http_upstream_finalize_request(r, u, NGX_ERROR);
578.                 return;
579.             }
580.             // 如果连接上的读事件已经准备好或者响应头部没有指定包体长度时，直接调用downstream方法处理响应
581.             if (u->peer.connection->read->ready || u->length == 0) {
582.                 ngx_http_upstream_process_non_buffered_upstream(r, u);
583.             }
584.         }
585.         // 将控制权转交给Nginx框架
586.         return;
587.     }
588.     ......
589. }
ngx_http_upstream_process_non_buffered_downstream函数，用于处理上游服务器响应的读事件


590. static void ngx_http_upstream_process_non_buffered_downstream(ngx_http_request_t *r)
591. {
592.     // 获取与上游服务器的连接信息，和写事件信息
593.     c = r->connection;
594.     u = r->upstream;
595.     wev = c->write;
596.     ......
597.     // 如果出现写事件超时，则设置超时标签，同时终止连接
598.     if (wev->timedout) {
599.         c->timedout = 1;
600.         ngx_connection_error(c, NGX_ETIMEDOUT, "client timed out");
601.         ngx_http_upstream_finalize_request(r, u, NGX_HTTP_REQUEST_TIME_OUT);
602.         return;
603.     }
604.     // non_buffered即固定内存，用固定内存处理转发响应，其中第二个参数是个标签，为1时代表向下游发送响应，为0时代表读取上游的响应
605.     ngx_http_upstream_process_non_buffered_request(r, 1);
606. }
下面继续分析一下ngx_http_upstream_process_non_buffered_request


607. static void
608. ngx_http_upstream_process_non_buffered_request(ngx_http_request_t *r, ngx_uint_t do_write)
609. {
610.     // 获取上游和现有的连接信息，记录为downstream和upstream
611.     u = r->upstream;
612.     downstream = r->connection;
613.     upstream = u->peer.connection;
614.     b = &u->buffer;
615.     // 判断是否向下游写，do_write是调用方设置的，而u->length表示还需要接收的上游响应的长度，为0则代表不需要继续接收
616.     do_write = do_write || u->length == 0;
617.     for ( ;; ) {
618.         // 判断是否需要向客户端写数据
619.         if (do_write) {
620.             // out_bufs中记录的是需要向下游写的数据，而busy_bufs用于记录当out_bufs无法一次发完时指向out_bufs，从而将out_bufs置空
621.             if (u->out_bufs || u->busy_bufs) {
622.                 // 向下游发送out_bufs指向的内容，busy_bufs中记录的是上一次的out_bufs的内容，现在已经合并当前的out_bufs中了
623.                 rc = ngx_http_output_filter(r, u->out_bufs);
624.                 // 回收out_bufs上已经发送的buf，将未发送完的buf设置到busy_buf上，清空out_bufs
625.                 ngx_chain_update_chains(r->pool, &u->free_bufs, &u->busy_bufs, &u->out_bufs, u->output.tag);
626.             }
627.             // 当busy_bufs为空时，说明当前没有需要发送到客户端的内容了
628.             if (u->busy_bufs == NULL) {
629.                 ......
630.                 // 将pos和last重新置位
631.                 b->pos = b->start;
632.                 b->last = b->start;
633.             }
634.         }
635.         // 计算一下buffer的可用空间
636.         size = b->end - b->last;
637.         // 继续读取响应
638.         if (size && upstream->read->ready) {
639.             n = upstream->recv(upstream, b->last, size);
640.             // NGX_AGAIN代表需要等待下一次读事件
641.             if (n == NGX_AGAIN) {
642.                 break;
643.             }
644.             // n > 0表示读到的n字节的正常响应包体
645.             if (n > 0) {
646.                 // 更新response_length
647.                 u->state->response_length += n;
648.                 // 调用input_filter处理包体
649.                 if (u->input_filter(u->input_filter_ctx, n) == NGX_ERROR) {
650.                     ngx_http_upstream_finalize_request(r, u, NGX_ERROR);
651.                     return;
652.                 }
653.             }
654.             // 设置do_write标签，标识已经读到新的响应包体，需要向客户端转发数据
655.             do_write = 1;
656.             continue;
657.         }
658.         break;
659.     }
660.     ......
661.     if (downstream->data == r) {
662.         // 将下游的写事件添加到epoll中
663.         if (ngx_handle_write_event(downstream->write, clcf->send_lowat) != NGX_OK)
664.         ......
665.     }
666.     // 同时设置超时定时器，控制等待时间，超时时间为配置的send_timeout
667.     if (downstream->write->active && !downstream->write->ready) {
668.         ngx_add_timer(downstream->write, clcf->send_timeout);
669.     } 
670.     ......
671.     // 将连接上游的读事件也添加到epoll中去
672.     if (ngx_handle_read_event(upstream->read, 0) != NGX_OK) {
673.         ngx_http_upstream_finalize_request(r, u, NGX_ERROR);
674.         return;
675.     }
676.     // 设置读定时器，控制等待时间，超时时间为配置的read_timeout
677.     if (upstream->read->active && !upstream->read->ready) {
678.         ngx_add_timer(upstream->read, u->conf->read_timeout);
679.     }
680.     ......
681. }
上游网速优先
上游网速优先的实现比较复杂，目前官方携带的ngx_http_proxy_module即采用了上游网速优先的实现方式。当ngx_http_upstream_conf_t中的Buffering设置
为1时，则说明需要使用上游网速优先的方式。此时需要用ngx_event_pipe_t结构，这个结构维护着上下游间转发的响应包体，用于解决内存复制的问题。


682. typedef struct ngx_event_pipe_s ngx_event_pipe_t;
683. struct ngx_event_pipe_s {
684.     ngx_connection_t *upstream;                        // 与上游服务器间的连接
685.     ngx_connection_t *downstream;                      // 与下游客户端间的连接                        
686.     ngx_chain_t *free_raw_bufs;                        // 用于接收上游服务器响应的缓冲区链表，新收到的响应向链表头部插入
687.     ngx_chain_t *in;                                   // 接收到上游响应的缓冲区，ngx_event_pipe_copy_input_filter将buffer中的数据设置到in中
688.     ngx_chain_t **last_in;                             // 指向刚刚接收到的缓冲区
689.     ngx_chain_t *out;                                  // 将要发给客户端的缓冲区链表，
690.     ngx_chain_t *free;                                 // 等待释放的缓冲区
691.     ngx_chain_t *busy;                                 // 表示上次发送响应时未发完的缓冲区链表，下一次发送时会合并到out链表中
692.     /*
693.      * the input filter i.e. that moves HTTP/1.1 chunks
694.      * from the raw bufs to an incoming chain
695.      */
696.     ngx_event_pipe_input_filter_pt input_filter;       // 处理接收到的来自上游服务器的缓冲区，接收响应的处理方法
697.     void *input_ctx;                                   // input_filter函数的参数，通常设置为ngx_http_request_t
698.     ngx_event_pipe_output_filter_pt output_filter;     // 向下游发送响应的方法，默认为ngx_http_output_filter
699.     void *output_ctx;                                  // output_filter函数的参数，通常设置为ngx_http_request_t
700.     unsigned read:1;                                   // 为1表示当前已经读到来自上游的响应
701.     unsigned cacheable:1;                              // 为1时表示启用文件缓存
702.     unsigned single_buf:1;                             // 为1时表示接收上游的响应时一次只能接收一个ngx_buf_t缓冲区
703.     unsigned free_bufs:1;                              // 为1时表示当不再接收上游的响应包体时，尽可能快的释放缓冲区
704.     unsigned upstream_done:1;                          // input_filter中用到的标识位，表示Nginx与上游间的交互已经结束
705.     unsigned upstream_error:1;                         // 与上游连接出现错误时，将该标识为置为1，比如超时，解析错误等
706.     unsigned upstream_eof:1;                           // 与上游的连接已经关闭时，该标志位置为1
707.     unsigned upstream_blocked:1;                       // 表示暂时阻塞读取上游响应的流程，先发送响应，再用释放的缓冲区接收响应
708.     unsigned downstream_done:1;                        // 为1时表示与下游的交互已经结束
709.     unsigned downstream_error:1;                       // 与下游连接出现错误时，设置为1
710.     unsigned cyclic_temp_file:1;                       // 为1时会试图复用临时文件中曾用过的空间
711.     ngx_int_t allocated;                               // 表示已经分配的缓冲区的数目，其受bufs.num成员的限制
712.     ngx_bufs_t bufs;                                   // 记录了接收上游响应的内存缓冲区的大小，bufs.size记录每个缓冲区大小，bufs.num记录缓冲区个数
713.     ngx_buf_tag_t tag;                                 // 用于设置、比较缓冲区链表中ngx_buf_t结构体的tag标志位
714.     ssize_t busy_size;
715.     off_t read_length;                                 // 已经接收到上游响应包体长度
716.     off_t length;                                      // 表示临时文件的最大长度
717.     off_t max_temp_file_size;                          // 表示临时文件的最大长度
718.     ssize_t temp_file_write_size;                      // 表示一次写入文件时的最大长度
719.     ngx_msec_t read_timeout;                           // 读取上游响应的超时时间
720.     ngx_msec_t send_timeout;                           // 向下游发送响应的超时时间
721.     ssize_t send_lowat;                                // 向下游发送响应时，TCP连接中设置的参数
722.     ngx_pool_t *pool;                                  // 用于分配内存缓冲区的连接池对象
723.     ngx_log_t *log;                                    // 用于记录日志的ngx_log_t对象
724.     ngx_chain_t *preread_bufs;                         // 表示接收上游服务器响应头部的阶段，已经读到的响应包体
725.     size_t preread_size;                               // 表示接收上游服务器响应头部的阶段，已经读到的响应包体长度
726.     ngx_buf_t *buf_to_file;                            // 
727.     size_t limit_rate;                                 // 发送速率的限制
728.     time_t start_sec;                                  // 连接的启动时间
729.     ngx_temp_file_t *temp_file;                        // 存放上游响应的临时文件
730.     /* STUB */ int num;                                // 已经使用的ngx_buf_t的数目
731. }
不管上游网速优先还是下游网速优先，响应的转发都是通过ngx_http_upstream_send_response函数进行的。前面分析过下游网速优先的部分流程，
下面再继续分析一下剩下的部分


732. static void ngx_http_upstream_send_response(ngx_http_request_t *r, ngx_http_upstream_t *u)
733. {
734.     // 发送设置到r->headers_out中的响应头部
735.     rc = ngx_http_send_header(r);
736.     ......
737.     // 如果客户端的请求携带了包体，且包体已经保存到了临时文件中，则清理临时文件，前面分析过了
738.     if (r->request_body && r->request_body->temp_file) {
739.         ngx_pool_run_cleanup_file(r->pool, r->request_body->temp_file->file.fd);
740.         r->request_body->temp_file->file.fd = NGX_INVALID_FILE;
741.     }
742.     ......
743.     // buffering为1时走的是上游网速优先的流程，为0时走的是下游网速优先的流程
744.     if (!u->buffering) {
745.         ......
746.         return ;
747.     }
748.     
749.     /* TODO: preallocate event_pipe bufs, look "Content-Length" */
750.     // pipe的内存在upstream启动时已经分配了，这里直接使用，对pipe进行初始化
751.     p = u->pipe;
752.     // 设置向下游发送响应的方法
753.     p->output_filter = (ngx_event_pipe_output_filter_pt) ngx_http_output_filter;
754.     // 将pipe的output_ctx指向ngx_http_request_t结构，后续传入的参数都是pipe，通过pipe->output_ctx找到ngx_http_request_t
755.     p->output_ctx = r;
756.     // 设置转发响应时启用的每个缓冲区的tag标志位
757.     p->tag = u->output.tag;
758.     // bufs指定了内存缓冲区的限制
759.     p->bufs = u->conf->bufs;
760.     // 设置busy缓冲区中待发送的响应长度触发值
761.     p->busy_size = u->conf->busy_buffers_size;
762.     // upstream指向nginx与上游服务器的连接
763.     p->upstream = u->peer.connection;
764.     // downstream指向nginx与客户端之间的连接
765.     p->downstream = c;
766.     // 初始化用于分配内存缓冲区的内存池
767.     p->pool = r->pool;
768.     // 初始化用于记录日志的log成员
769.     p->log = c->log;
770.     // 初始化速率阀值
771.     p->limit_rate = u->conf->limit_rate;
772.     // 记录当前的时间
773.     p->start_sec = ngx_time();
774.     // 记录是否进行文件缓存
775.     p->cacheable = u->cacheable || u->store;
776.     // 申请临时文件结构
777.     p->temp_file = ngx_pcalloc(r->pool, sizeof(ngx_temp_file_t));
778.     if (p->temp_file == NULL) {
779.         ngx_http_upstream_finalize_request(r, u, NGX_ERROR);
780.         return;
781.     }
782.     // 初始化临时文件的结构信息
783.     p->temp_file->file.fd = NGX_INVALID_FILE;
784.     p->temp_file->file.log = c->log;
785.     p->temp_file->path = u->conf->temp_path;
786.     p->temp_file->pool = r->pool;
787.     ......
788.     // 设置临时存放上游响应的单个缓存文件的最大长度
789.     p->max_temp_file_size = u->conf->max_temp_file_size;
790.     // 设置一次写入临时文件时写入的最大长度
791.     p->temp_file_write_size = u->conf->temp_file_write_size;
792.     // 申请预读缓冲区链表，该链表的缓冲区不会分配内存来存放上游的响应内容，而用ngx_buf_t指向实际存放包体的内容
793.     p->preread_bufs = ngx_alloc_chain_link(r->pool);
794.     if (p->preread_bufs == NULL) {
795.         ngx_http_upstream_finalize_request(r, u, NGX_ERROR);
796.         return;
797.     }
798.     // 初始化预读缓冲区的链表，（预读是在读取包头时，同时读到了包体的情况）
799.     p->preread_bufs->buf = &u->buffer;
800.     p->preread_bufs->next = NULL;
801.     u->buffer.recycled = 1;
802.     p->preread_size = u->buffer.last - u->buffer.pos;
803.     .......
804.     // 设置读取上游服务器响应的超时时间
805.     p->read_timeout = u->conf->read_timeout;
806.     // 设置发送到下游客户端的超时时间
807.     p->send_timeout = clcf->send_timeout;
808.     // 设置向客户端发送响应时TCP的send_lowat选项
809.     p->send_lowat = clcf->send_lowat;
810.     .......
811.     // 设置处理上游读事件的回调
812.     u->read_event_handler = ngx_http_upstream_process_upstream;
813.     // 设置处理下游写事件的回调
814.     r->write_event_handler = ngx_http_upstream_process_downstream;
815.     // 处理上游发来的响应包体
816.     ngx_http_upstream_process_upstream(r, u);
817. }
不管是读取上游的响应事件process_upstream，还是向客户端写数据的process_downstream，最终都是通过ngx_event_pipe实现缓存转发响应的。
下面来看一下ngx_event_pipe的具体实现：


818. ngx_int_t ngx_event_pipe(ngx_event_pipe_t *p, ngx_int_t do_write)
819. {
820.     // do_write为1表示需要向下游客户端发送响应，为0表示需要从上游客户端接收响应
821.     for ( ;; ) {
822.         if (do_write) {
823.             // do_write为1，向下游发送响应包体，并检查其返回值
824.             rc = ngx_event_pipe_write_to_downstream(p);
825.             ......
826.             // 返回NGX_OK时继续读取上游的响应事件，返回其他值需要终止ngx_event_pipe函数
827.         }
828.         ......
829.         // 从上游读取响应数据
830.         if (ngx_event_pipe_read_upstream(p) == NGX_ABORT) {
831.             return NGX_ABORT;
832.         }
833.         // 当没有读取到响应数据，并且也不需要暂停读取响应的读取时，跳出当前循环，即不对do_write进行设置
834.         if (!p->read && !p->upstream_blocked) {
835.             break;
836.         }
837.         // 当读到的响应数据，或者需要暂停读取数据，先给客户端发送响应以释放缓冲区时，设置do_write进行响应的发送
838.         do_write = 1;
839.     }
840.     if (p->upstream->fd != (ngx_socket_t) -1) {
841.         // 将上游读事件添加到epoll中
842.         if (ngx_handle_read_event(rev, flags) != NGX_OK) {
843.             return NGX_ABORT;
844.         }
845.         // 同时设置读事件的超时定时器
846.         if (!rev->delayed) {
847.             if (rev->active && !rev->ready) {
848.                 ngx_add_timer(rev, p->read_timeout);
849.             ......
850.     }
851.     // 将下游的写事件添加到epoll中，并且设置写事件的定时器
852.     if (p->downstream->fd != (ngx_socket_t) -1 && p->downstream->data == p->output_ctx)
853.     {
854.         wev = p->downstream->write;
855.         if (ngx_handle_write_event(wev, p->send_lowat) != NGX_OK) {
856.             return NGX_ABORT;
857.         }
858.         if (!wev->delayed) {
859.             if (wev->active && !wev->ready) {
860.                 ngx_add_timer(wev, p->send_timeout);
861.             .......
862.     }
863.     return NGX_OK;
864. }
上面函数中提到的ngx_event_pipe_read_upstream用于接收上游的响应，下面来具体看一下：


865. static ngx_int_t ngx_event_pipe_read_upstream(ngx_event_pipe_t *p)
866. {
867.     ......
868.     for ( ;; ) {
869.         // 检查上游连接是否结束，如果已经结束，不再接收新的响应，跳出循环
870.         if (p->upstream_eof || p->upstream_error || p->upstream_done) {
871.             break;
872.         }
873.         // 如果preread_bufs为NULL代表读包头时没有读到包体信息或者已经处理完成，ready为0表示没有上游响应可以接收，跳出循环
874.         if (p->preread_bufs == NULL && !p->upstream->read->ready) {
875.             break;
876.         }
877.         // preread_bufs存放着接收包头时可能读取到的包体信息，如果不为空，则先要优先处理这部分包体信息
878.         if (p->preread_bufs) {
879.             chain = p->preread_bufs;
880.             // 用chain保存待处理的缓冲区，重置preread_bufs，下次循环则不会再走到该逻辑
881.             p->preread_bufs = NULL;
882.             n = p->preread_size;
883.             // 有待处理的包体信息，将read设置为1，表示接收到的包体待处理
884.             if (n) {
885.                 p->read = 1;
886.             }
887.         } else {
888.             .......
889.             } else {
890.                 limit = 0;
891.             }
892.             // free_raw_bufs用于表示一次ngx_event_pipe_read_upstream方法调用过程中接收到的上游响应
893.             if (p->free_raw_bufs) {
894.                 chain = p->free_raw_bufs;
895.                 if (p->single_buf) {
896.                     p->free_raw_bufs = p->free_raw_bufs->next;
897.                     chain->next = NULL;
898.                 } else {
899.                     p->free_raw_bufs = NULL;
900.                 }
901.             // 判断当前已分配的缓冲区的数量是否超过了bufs.num，没有超过时可以继续分配
902.             } else if (p->allocated < p->bufs.num) {
903.                 b = ngx_create_temp_buf(p->pool, p->bufs.size);
904.                 if (b == NULL) {
905.                     return NGX_ABORT;
906.                 }
907.                 p->allocated++;
908.                 chain = ngx_alloc_chain_link(p->pool);
909.                 if (chain == NULL) {
910.                     return NGX_ABORT;
911.                 }
912.                 chain->buf = b;
913.                 chain->next = NULL;
914.             // 缓冲区已经达到上限，如果写事件的ready为1时表示可以向下游发送响应，而delay为0代表并不是由于限速的原因导致写事件就绪
915.             // 当ready为1，且delay为0时，可以向下游发送响应来释放缓冲区了
916.             } else if (!p->cacheable
917.                        && p->downstream->data == p->output_ctx
918.                        && p->downstream->write->ready
919.                        && !p->downstream->write->delayed)
920.             {
921.                 p->upstream_blocked = 1;
922.                 break;
923.             // offset表示临时文件中已经写入的响应内容的长度，检查是否达到了配置的上限，当达到上限时，暂时不再接收上游响应
924.             // 没有达到上限时，调用下面write方法将响应写入临时文件中
925.             } else if (p->cacheable
926.                        || p->temp_file->offset < p->max_temp_file_size)
927.             {
928.                 /*
929.                  * if it is allowed, then save some bufs from p->in
930.                  * to a temporary file, and add them to a p->out chain
931.                  */
932.                 // 该函数将in缓冲区链表中的内容写入temp_file临时文件中，再将写入临时文件的ngx_buf_t缓冲区由in缓冲区链表中移出，添加到out缓冲区链表中
933.                 rc = ngx_event_pipe_write_chain_to_temp_file(p);
934.                 ......
935.             // 调用recv_chain接收上游的响应
936.             n = p->upstream->recv_chain(p->upstream, chain, limit);
937.             // 将新接收到的缓冲区放置到free_raw_bufs链表的最后
938.             if (p->free_raw_bufs) {
939.                 chain->next = p->free_raw_bufs;
940.             }
941.             ......
942.         while (cl && n > 0) {
943.             // 从接收到的缓冲区链表中取出一块缓冲区，将其shadow域释放掉
944.             ngx_event_pipe_remove_shadow_links(cl->buf);
945.             // 检查当前收到的包体长度是否小于缓冲区的大小，小于时当前缓冲区可以继续接收响应包体，否则缓冲区已满，需要调用input_filter函数处理
946.             size = cl->buf->end - cl->buf->last;
947.             if (n >= size) {
948.                 // 当前缓冲区已满，需要处理，下面的input_filter方法是ngx_event_pipe_copy_input_filter函数，其主要在in链表中增加这个缓冲区
949.                 cl->buf->last = cl->buf->end;
950.                 if (p->input_filter(p, cl->buf) == NGX_ERROR) {
951.                     return NGX_ABORT;
952.                 }
953.                 // 更新待处理的包体的长度，释放已经处理的缓冲区
954.                 n -= size;
955.                 ln = cl;
956.                 cl = cl->next;
957.                 ngx_free_chain(p->pool, ln);
958.             } else {
959.                 // 缓冲区没有满，更新last位置，n可以设置为0了，因为last的位置已经包含当前读到的包体信息
960.                 cl->buf->last += n;
961.                 n = 0;
962.             }
963.         }
964.         // 走到这里时cl的链表中一定有缓冲区没有用满（最后一个？），此时cl不为NULL；或者cl的所有缓冲区都已经被处理回收了，此时cl为NULL
965.         if (cl) {
966.             for (ln = cl; ln->next; ln = ln->next) { /* void */ }
967.             // 此时的p->free_raw_bufs已经为NULL了，将p->free_raw_bufs指向当前待处理的缓冲区链表
968.             ln->next = p->free_raw_bufs;
969.             p->free_raw_bufs = cl;
970.         }
971.         ......
972.     }
973.     ......
974.     // upstream_eof为1时表示上游服务器关闭了连接，upstream_error表示处理过程中出现了错误，而free_raw_bufs不为空代表还有需要处理的包体信息
975.     if ((p->upstream_eof || p->upstream_error) && p->free_raw_bufs) {
976.         // 调用input_filter处理剩余的包体信息
977.         if (p->input_filter(p, p->free_raw_bufs->buf) == NGX_ERROR) {
978.             return NGX_ABORT;
979.         }
980.         p->free_raw_bufs = p->free_raw_bufs->next;
981.         // free_bufs为1时代表需要尽快释放缓冲区中用到内存，此时应该调用ngx_pfree尽快释放shadow域为空的缓冲区
982.         if (p->free_bufs && p->buf_to_file == NULL) {
983.             for (cl = p->free_raw_bufs; cl; cl = cl->next) {
984.                 if (cl->buf->shadow == NULL) {
985.                     ngx_pfree(p->pool, cl->buf->start);
986.                     ......
987.     }
988.     .......
989. }
看完接收响应的处理过程，再来看一下发送响应的处理流程，对应的函数是ngx_event_pipe_write_to_downstream


990. static ngx_int_t ngx_event_pipe_write_to_downstream(ngx_event_pipe_t *p)
991. {
992.     ......
993.     for ( ;; ) {
994.         if (p->downstream_error) {
995.             return ngx_event_pipe_drain_chains(p);
996.         }
997.         // 检查与上游的连接是否结束
998.         if (p->upstream_eof || p->upstream_error || p->upstream_done) {
999.             // 发送out链表中的缓冲区给客户端
1000.             if (p->out) {
1001.                 for (cl = p->out; cl; cl = cl->next) {
1002.                     cl->buf->recycled = 0;
1003.                 }
1004.                 rc = p->output_filter(p->output_ctx, p->out);
1005.                 ......
1006.             }
1007.             // 发送in链表中的缓冲区给客户端
1008.             if (p->in) {
1009.                 for (cl = p->in; cl; cl = cl->next) {
1010.                     cl->buf->recycled = 0;
1011.                 }
1012.                 rc = p->output_filter(p->output_ctx, p->in);
1013.                 ......
1014.             }
1015.             // 标识需要向下游发送的响应已经完成
1016.             p->downstream_done = 1;
1017.             break;
1018.         }
1019.         ......
1020.         // 计算busy缓冲区中待发送的响应长度
1021.         for (cl = p->busy; cl; cl = cl->next) {
1022.             if (cl->buf->recycled) {
1023.                 ......
1024.                 bsize += cl->buf->end - cl->buf->start;
1025.                 prev = cl->buf->start;
1026.             }
1027.         }
1028.         ......
1029.         // 检查是否超过了busy_size的配置，当超过配置值时跳转至flush处检查和发送out缓冲区
1030.         if (bsize >= (size_t) p->busy_size) {
1031.             flush = 1;
1032.             goto flush;
1033.         }
1034.         ......
1035.         for ( ;; ) {
1036.             // 先检查out链表是否为NULL，不为空则先发送out链表的缓冲区
1037.             if (p->out) {
1038.                 cl = p->out;
1039.                 p->out = p->out->next;
1040.             // 当out链表中的数据被处理完成后，开始处理in链表中的数据
1041.             } else if (!p->cacheable && p->in) {
1042.                 cl = p->in;
1043.                 .....
1044.             } else {
1045.                 break;
1046.             }
1047.             cl->next = NULL;
1048.             if (out) {
1049.                 *ll = cl;
1050.             } else {
1051.                 out = cl;
1052.             }
1053.             ll = &cl->next;
1054.         }
1055.     flush:
1056.         ......
1057.         // 发送响应给客户端
1058.         rc = p->output_filter(p->output_ctx, out);
1059.         // 更新free、busy和out缓冲区
1060.         ngx_chain_update_chains(p->pool, &p->free, &p->busy, &out, p->tag);
1061.         ......
1062.         // 遍历free链表中的缓冲区，释放缓冲区中shadow域
1063.         for (cl = p->free; cl; cl = cl->next) {
1064.             ......
1065.             if (cl->buf->last_shadow) {
1066.                 if (ngx_event_pipe_add_free_buf(p, cl->buf->shadow) != NGX_OK) {
1067.                     return NGX_ABORT;
1068.                 }
1069.                 cl->buf->last_shadow = 0;
1070.             }
1071.             cl->buf->shadow = NULL;
1072.         }
1073.     }
1074.     return NGX_OK;
1075. }
终于快要结束了，upstream的流程还是比较复杂的，最后看一下结束upstream的请求
结束upstream的请求
upstream请求的结束的流程，有三个函数可以进来，ngx_http_upstream_finalize_request、ngx_http_upstream_cleanup、ngx_http_upstream_next。
其中cleanup和next真正终止upstream时还是会调用到finalize_request函数。ngx_http_upstream_cleanup函数在启动upstream时，会挂在到请求的cleanup
链表中，当HTTP框架结束http请求时一定会调用到upstream_cleanup函数。


1076. static void ngx_http_upstream_cleanup(void *data)
1077. {
1078.     ngx_http_request_t *r = data;
1079.     ngx_http_upstream_finalize_request(r, r->upstream, NGX_DONE);
1080. }
可以看到upstream_cleanup的实现，其实是直接调用了ngx_http_upstream_finalize_request，这个流程是我们期待的关闭方式。

而ngx_http_upstream_next函数，是在处理请求的的流程中出现错误才会主动调用到，该函数通过重连服务器、选取新的服务器等策略来提高服务的可用性。目前
nginx的负载均衡的功能就是通过next函数来实现的，我们后面会进行详细分析，这里只简单说明一下。


1081. static void ngx_http_upstream_next(ngx_http_request_t *r, ngx_http_upstream_t *u, ngx_uint_t ft_type)
1082. {
1083.     ......
1084.     if (status) {
1085.         u->state->status = status;
1086.         timeout = u->conf->next_upstream_timeout;
1087.         // 当tries为0时，才最终结束upstream的请求
1088.         if (u->peer.tries == 0
1089.             || !(u->conf->next_upstream & ft_type)
1090.             || (timeout && ngx_current_msec - u->peer.start_time >= timeout))
1091.         {
1092.             ngx_http_upstream_finalize_request(r, u, status);
1093.             return;
1094.         }
1095.     }
1096.     // 由于要发起新的连接，所以需要先关闭和上游服务器的已有连接
1097.     if (u->peer.connection) {     
1098.         if (u->peer.connection->pool) {
1099.             ngx_destroy_pool(u->peer.connection->pool);
1100.         }
1101.         ngx_close_connection(u->peer.connection);
1102.         u->peer.connection = NULL;
1103.     }
1104.     // 重新发起连接
1105.     ngx_http_upstream_connect(r, u);
1106. }
最后看一下ngx_http_upstream_finalize_request的具体实现


1107. static void ngx_http_upstream_finalize_request(ngx_http_request_t *r, ngx_http_upstream_t *u, ngx_int_t rc)
1108. {
1109.     // 将cleanup指向的清理资源回调方法设置为NULL
1110.     if (u->cleanup) {
1111.         *u->cleanup = NULL;
1112.         u->cleanup = NULL;
1113.     }
1114.     // 释放解析主机域名时分配的资源
1115.     if (u->resolved && u->resolved->ctx) {
1116.         ngx_resolve_name_done(u->resolved->ctx);
1117.         u->resolved->ctx = NULL;
1118.     }
1119.     ......
1120.     // 调用http模块实现的finalize_request方法
1121.     u->finalize_request(r, rc);
1122.     // 释放与上游的连接
1123.     if (u->peer.connection) {
1124.         if (u->peer.connection->pool) {
1125.             ngx_destroy_pool(u->peer.connection->pool);
1126.         }
1127.         ngx_close_connection(u->peer.connection);
1128.     }
1129.     u->peer.connection = NULL;
1130.     // 删除用于缓存响应的临时文件
1131.     if (u->store && u->pipe && u->pipe->temp_file
1132.         && u->pipe->temp_file->file.fd != NGX_INVALID_FILE)
1133.     {
1134.         if (ngx_delete_file(u->pipe->temp_file->file.name.data)
1135.             == NGX_FILE_ERROR)
1136.         ......
1137.     }
1138.     ......
1139.     // 最后还是调用HTTP框架提供的方法结束请求
1140.     ngx_http_finalize_request(r, rc);
1141. }
至此，大概的梳理了一下upstream的处理流程，后面会针对目前已经实现的负载均衡各类算法，以及Nginx cache功能进行分析。。

```