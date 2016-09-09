---
layout:     post
title:      "用Bottle开发web程序(二)"
subtitle:   "Develop web with bottle, Part Two"
date:       2016-04-07 8:00:00
author:     "XuXinkun"
header-img: "img/post-bg-dev-with-bottle2.jpg"
tags:
    - python
    - bottle
---

# 返回码

在开发web程序时，除了一些服务器错误等，常常需要自定义返回码，以便告诉用户处理请求的结果或者状态。bottle支持自定义的返回码，可以通过以下几种方式进行实现。

## abort

在bottle中，如果需要设置返回错误码，可以简单的通过abort函数来设置。返回内容会是一个带有错误信息的页面。

    @route('/abort', method='POST')
    def do_abort():
        data = request.body
        data = data.read()
        if data != 'abort':
            abort(400, 'Your request is not abort.')
        return 'abort test.'

试一下：

    [root@localhost ~]# curl -g -i 127.0.0.1:9001/abort -X POST -d 'abort'
    HTTP/1.0 200 OK
    Server: PasteWSGIServer/0.5 Python/2.7.5
    Date: Thu, 07 Apr 2016 03:25:52 GMT
    Content-Length: 11
    Content-Type: text/html; charset=UTF-8
    
    abort test.[root@localhost ~]#
    [root@localhost ~]# curl -g -i 127.0.0.1:9001/abort -X POST -d 'test'
    HTTP/1.0 400 Bad Request
    Server: PasteWSGIServer/0.5 Python/2.7.5
    Date: Thu, 07 Apr 2016 03:26:11 GMT
    Content-Length: 731
    Content-Type: text/html; charset=UTF-8
    
    
        <!DOCTYPE HTML PUBLIC "-//IETF//DTD HTML 2.0//EN">
        <html>
            <head>
                <title>Error: 400 Bad Request</title>
                <style type="text/css">
                  html {background-color: #eee; font-family: sans;}
                  body {background-color: #fff; border: 1px solid #ddd;
                        padding: 15px; margin: 15px;}
                  pre {background-color: #eee; border: 1px solid #ddd; padding: 5px;}
                </style>
            </head>
            <body>
                <h1>Error: 400 Bad Request</h1>
                <p>Sorry, the requested URL <tt>&#039;http://127.0.0.1:9001/abort&#039;</tt>
                   caused an error:</p>
                <pre>Your request is not abort.</pre>
            </body>
        </html>

abort函数用起来比较方便，弊端是返回的是页面，比较难于获取具体的出错信息。

## abort and error

error函数可以自定义某个error code的返回内容。可以使用abort函数触发该函数。

自定义的error函数的参数是一个HttpError的实例。可以通过error.body获取实例的相关信息。

    @route('/code', method='POST')
    def do_abort():
        data = request.body
        data = data.read()
        if data != 'code':
            abort(499, 'Your request is not code.')
        return 'code test.'
    
    @error(499)
    def error499(error):
        return error.body

试一下：

    [root@localhost ~]# curl -g -i 127.0.0.1:9001/code -X POST -d 'test'
    HTTP/1.0 499 Unknown
    Server: PasteWSGIServer/0.5 Python/2.7.5
    Date: Fri, 08 Apr 2016 02:36:04 GMT
    Content-Length: 25
    Content-Type: text/html; charset=UTF-8
    
    Your request is not code.[root@localhost ~]# 

## HttpResponse

另外一种方式就是自己设定实例化一个HttpResponse进行返回。

    @route('/httpresponse', method='POST')
    def do_httpresponse():
        data = request.body
        data = data.read()
        if data != 'httpresponse':
            return HTTPResponse(body='Your request is not httpresponse.', status=400)
        return 'httpresponse test.'

试一下：

    [root@localhost ~]# curl -g -i 127.0.0.1:9001/httpresponse -X POST -d 'test'
    HTTP/1.0 400 Bad Request
    Server: PasteWSGIServer/0.5 Python/2.7.5
    Date: Thu, 07 Apr 2016 03:30:17 GMT
    Content-Length: 26
    Content-Type: text/html; charset=UTF-8
    
    Your request is not httpresponse.

这种方式比较灵活，而且返回的body同样支持字典的类型。bottle会将其自动转换为json。

    @route('/httpresponse', method='POST')
    def do_httpresponse():
        data = request.body
        data = data.read()
        if data != 'httpresponse':
            return HTTPResponse(body={'info':'Your request is not httpresponse.'}, status=400)
        return 'httpresponse test.'

试一下：
        
    [root@localhost ~]# curl -g -i 127.0.0.1:9001/httpresponse -X POST -d 'test'
    HTTP/1.0 400 Bad Request
    Server: PasteWSGIServer/0.5 Python/2.7.5
    Date: Thu, 07 Apr 2016 03:34:55 GMT
    Content-Length: 38
    Content-Type: application/json
    
    {"info": "Your request is not httpresponse."}
    
# 完整样例
 
    import sys
    from bottle import abort, run, route , request, HTTPResponse, error
    
    
    @route('/abort', method='POST')
    def do_abort():
        data = request.body
        data = data.read()
        if data != 'abort':
            abort(400, 'Your request is not abort.')
        return 'abort test.'
    
    @route('/httpresponse', method='POST')
    def do_httpresponse():
        data = request.body
        data = data.read()
        if data != 'httpresponse':
            return HTTPResponse(body='Your request is not abort.', status=400)
            # return HTTPResponse(body={'info':'Your request is not abort.'}, status=400)
        return 'httpresponse test.'
    
    @route('/code', method='POST')
    def do_abort():
        data = request.body
        data = data.read()
        if data != 'code':
            abort(499, 'Your request is not code.')
        return 'code test.'
    
    @error(499)
    def error499(error):
        return error.body
    
    def main():
        run(server='paste', host='0.0.0.0', port=9001)
    
    
    if __name__ == "__main__":
        sys.exit(main())
