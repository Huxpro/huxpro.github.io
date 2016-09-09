---
layout:     post
title:      "用Bottle开发web程序(一)"
subtitle:   "Develop web with bottle，Part One"
date:       2016-04-06 8:00:00
author:     "XuXinkun"
header-img: "img/post-bg-dev-with-bottle.jpg"
tags:
    - python
    - bottle
---

# Bottle

[Bottle](http://www.bottlepy.org/docs/stable/)是一个轻量级的web app框架。相较与django等框架，bottle几乎没有任何依赖，而且只有一个文件。而相对于python默认的SimpleHTTPServer，功能更加丰富，实用更加灵活。如果只是开发一个小型的web程序，bottle已经足够了。`easy_install bottle`即可完成bottle的安装。

本文使用的bottle版本是v0.12.9的稳定版。

# Hello, world

最简单的程序当然要从hello,world写起。以下是基于bottle的一个程序。

    import sys
    from bottle import run, route
    
    @route('/')
    def hello():
        return 'hello, world'
    
    
    def main():
        run(host='0.0.0.0', port=9001)
    
    if __name__ == "__main__":
        sys.exit(main())

可以从浏览器直接访问127.0.0.1:9001，当然也可以使用命令行直接访问。

    [root@localhost ~]# curl 127.0.0.1:9001
    hello, world[root@localhost ~]# 
        
# 可扩展的server

我们可以看到`run(host='0.0.0.0', port=9001)`，这一行是用来启动服务器的。但是这个服务器是阻塞式的，当一个用户请求的时候，其他用户的请求会被阻塞。不要着急，你可以很简单的使用其他的框架来配合bottle来实现无阻塞的web服务器。

目前支持的框架有paste, fapws3, bjoern, gae, cherrypy or any other WSGI capable HTTP server。

不过我这里比较推荐的是paste，用起来也比较简单。首先需要`easy_install paste`安装paste。然后把启动命令改为

    run(server='paste', host='0.0.0.0', port=9001)

# 动态路由

bottle可以支持动态的路由，即可以根据路径进行不同的处理。

    @route('/path/<subpath>')
    def do_path(subpath):
        return 'You are visiting /path/%s' % subpath

从这里可以看到，路径作为参数进入到了`request`函数中。并可以在函数中可以进行进一步的处理。
 
    [root@localhost ~]# curl 127.0.0.1:9001/path/test
    You are visiting /path/test[root@localhost ~]# 

# 文件服务器

bottle可以轻松开发成一个文件服务器，可以支持上传和下载功能。

## 文件下载

这里使用bottle开发了一个可以下载/tmp文件的服务器。

    from bottle import static_file
    @route('/static/<filename>')
    def do_download(filename):
        return static_file(filename, root="/tmp")

根据前面的动态路由可以知道，路径会作为参数进入到函数中。

    [root@localhost ~]# ll /tmp/
    total 8
    -rw-r--r--. 1 root root  648 Apr  5 17:20 test.yaml

可以看到/tmp下有test.yaml文件。然后尝试对其进行下载。

    [root@localhost ~]# wget 127.0.0.1:9001/static/test.yaml
    --2016-04-06 16:43:20--  http://127.0.0.1:9001/static/test.yaml
    Connecting to 127.0.0.1:9001... connected.
    HTTP request sent, awaiting response... 200 OK
    Length: 648 [text/html]
    Saving to: ‘test.yaml’
    2016-04-06 16:43:20 (7.84 MB/s) - ‘test.yaml’ saved [648/648]

可以看到可以成功下载该文件。

## 文件上传

文件的上传需要使用form的方式进行提交。这里举个例子。

    @route('/upload/<savename>', method='POST')
    def do_upload(savename):
        upload = request.files.get('filename')
        save_path = os.path.join('/tmp', savename)
        upload.save(save_path)
        return 'OK'

这个函数的主要功能是首先从提交的文件中，取出name为`filename`的文件，然后将其保存在/tmp目录下。

这里form提交文件时，需要设置提交文件的name为`filename`。这里使用curl命令进行验证。

    [root@localhost ~]# curl -g -i 127.0.0.1:9001/upload/test.txt -X POST -F "filename=@/root/test.txt"
    HTTP/1.1 100 Continue
    
    HTTP/1.0 200 OK
    Server: PasteWSGIServer/0.5 Python/2.7.5
    Date: Wed, 06 Apr 2016 09:39:37 GMT
    Content-Length: 2
    Content-Type: text/html; charset=UTF-8
    
    OK[root@localhost ~]# 

curl命令需要使用-F参数以 multipart/form-data 的方式发送POST请求。-F参数以name=value的方式来指定参数内容，如果值是一个文件，则需要以name=@file的方式来指定。因为程序中要求key为`filename`，所以这里使用`"filename=@/root/test.txt"`。

可以看到返回值为OK，说明已经上传成功，可以到/tmp下查看。

    [root@localhost ~]# ll /tmp/
    -rw-r--r--. 1 root root    2 Apr  6 17:07 test.txt
    -rw-r--r--. 1 root root  648 Apr  5 17:20 test.yaml

# JSON支持

bottle很好的支持了json的请求。当请求是json形式的时候，bottle将会直接将其load进来，程序就可以直接进行处理。

    @route('/json', method='POST')
    def do_json():
        data = request.json
        message = data.get('message')
        re = {}
        re['message'] = 'Your message is %s.' % message
        re['status'] = 'success'
        return  re

这里可以看到，data直接是使用dict的方式进行处理。同时，如果返回的是dict的话，bottle也会自动将其转换为json进行返回。

    [root@localhost ~]# curl 127.0.0.1:9001/json -H "Content-type: application/json" -d '{"message":"hello,world"}' -X POST -g -i
    HTTP/1.0 200 OK
    Server: PasteWSGIServer/0.5 Python/2.7.5
    Date: Wed, 06 Apr 2016 09:32:39 GMT
    Content-Length: 64
    Content-Type: application/json
    
    {"status": "success", "message": "Your message is hello,world."}[root@localhost ~]#

> 这里特别注意，request需要在header里增加`Content-type: application/json`进行说明请求体是json格式。否则的话不会进行处理。

# 其他

bottle还有更多更为丰富的功能，比如对函数的请求进行限制，限制其为GET还是POST还是其他方式，设置header，cookie以及其他http metadata的处理。又比如模板功能等等。这些功能可以在[官网文档](http://www.bottlepy.org/docs/stable/)中进一步学习。这里就不一一赘述了。

# 完整样例

    import sys
    import os
    from bottle import run, request, route, static_file
    
    @route('/')
    def hello():
        return 'hello, world'
    
    @route('/json', method='POST')
    def do_json():
        data = request.json
        message = data.get('message')
        re = {}
        re['message'] = 'Your message is %s.' % message
        re['status'] = 'success'
        return  re
    
    @route('/path/<subpath>')
    def do_path(subpath):
        return 'You are visiting /path/%s' % subpath
    
    @route('/static/<filename>')
    def do_download(filename):
        return static_file(filename, root="/tmp")
    
    @route('/upload/<filename>', method='POST')
    def do_upload(filename):
        upload = request.files.get('filename')
        save_path = os.path.join('/tmp', filename)
        upload.save(save_path)
        return 'OK'
    
    def main():
        run(server='paste', host='0.0.0.0', port=9001)
    
    if __name__ == "__main__":
        sys.exit(main())
