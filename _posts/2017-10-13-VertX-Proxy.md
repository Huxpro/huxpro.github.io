---
layout:     post
title:      "Vert.X Proxy"
subtitle:   " \"代理有问题\""
date:       2017-10-13 15:39:00
author:     "WQ"
header-img: "img/blogImg/evening.jpg"
catalog: true
tags:
    - Vert.X
---

# 遇到的问题
在使用vertx的websocket时，由于需要使用`wss`协议，且需要翻墙，所以使用了代理，而后出现这样的错误，
`io.netty.handler.codec.CorruptedFrameException: RSV != 0 and no extension negotiated, RSV:1 `
，google了很久发现是在netty的问题（[github问题地址](https://github.com/netty/netty/issues/5070)），由于netty原生不支持https，
所以无法解析数据。同样在vertx的github上也有人贡献了解决方案，但还没有merge，目前的版本是vertx-3.4.2,netty版本4.1.8.final。

由于之前没有设置代理类型，默认为http，所以解决方法是设置为`SOCKS5`。

## PS

使用websocket且为wss地址，有点问题。经过测试下面的方式是ok的.

```java
HttpClientOptions options = new HttpClientOptions().
                setDefaultPort(443).
                setProxyOptions(new ProxyOptions().setType(ProxyType.SOCKS5).setHost("127.0.0.1") .setPort(1080)).
                setLogActivity(true).
                setTrustAll(true).
                setDefaultHost("www.go2going.com").
                setSsl(true);
```

即使是默认端口，也得加上端口号！
