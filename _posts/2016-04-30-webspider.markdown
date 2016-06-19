---
layout:     post
title:      "A Simple Webspider for Fantasy Novel"
subtitle:    "玄幻小说的这个翻译有点难度啊"
data:        2015-03-23 14:23:22
author:      "Dann"
header-img:  "img/post-4-30.png"
tags:
       - Pyhon
       - Webspider
       - Text Mining
---


> 支教学校的孩子很少有足够的图书，也几乎不去主动阅读。但是常常在课堂上看到学生偷偷摸摸看一些漫画书，没收过几本发现都是玄幻流小说的衍生品。所以这些作品的架构是怎样的？吸引学生的内容主要是哪些？干脆尝试去爬一些小说下来并且按章试图做一些简单的文本分析。

### Python Code 

最后需要实现的是小说能够按章节区分成`txt`文本，以便能够实现对故事的线性分析（有些插叙的章节从全书考虑并不会影响对情节进展的分析，所以就不单独分析了）。文本的命名需要按照小说章节顺序和章节名命名。这就是爬虫需要实现的基础目标。代码运行的环境是OS X EI Capitan的`V3.4.3`。贴上代码和笔记。

```Python

#!/usr/bin/env python3

#确保代码运行

import urllib.request

import re

import time

import socket

# timeout in seconds

timeout = 4

socket.setdefaulttimeout(timeout)

socket.settimeout(None)

#设定时间以免堵死进程

targetDir=r"/Users/tanyang/GitHub/rp/text"

 #设置最终文本保存的目录

LXBM='gbk' 

#文件的编码类型，需要单独设置

weburlT='http://www.bxwx8.org/b/70/70093/' 

#找到小说的目录页作为爬虫的起始页面并最终按照单线程的运作方式进行

weburlN='11969970.html' 

#设定爬虫需要进入的第二页面

weburl=weburlT + weburlN

webheaders={

    'Connection':'Keep_Alive',

    'Accept':'text/html,application/xhtml+xml,*/*',

    'Accept-Language':'zh-CN,zh;q=0.8',

    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.154 Safari/537.36 LBBROWSER',

    } #报头，模拟浏览器的访问行为

def getDate(Burl,Bheaders):

    #根据url地址得到该url中的文本数据

    req = urllib.request.Request(url=Burl,headers=Bheaders)#构造请求头

    data = urllib.request.urlopen(req).read() #读取数据

    data1 = data.decode(LXBM,'ignore')#把读取的数据转换为utf-8的格式

    return data1

def saveDataFileN(DData,DFileN): 

    #保存文件，传入的为文件数据，文件名

    f = open(DFileN,'w', encoding = LXBM)

    f.write(DData)

    f.close()

def getTitle(DData): 

#得到文章的题目

    zb=r'<div id="title">(.*?)</div>' 

    #正则表达式 查找内容

    titleL=re.findall(zb,DData)

    print(titleL[0])

    title = titleL[0]

    title = title.replace('?','')

    return title

def getNext(DData): #得到下一章的url 最后一章没有返回值

    zb=r'录</a> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <a href="(.*?)">下一'

    nextL=re.findall(zb,DData)

    #print(nextL[0])

    if nextL:

        return nextL[0]

    return 0

def getNr(DData): #读取正文内容

    zb=r'<div id="content"><div id="adright"></div>(.*?)<div'

    #观察网页源代码，设定正则表达式

    mainBodyL=re.findall(zb,DData,re.S)

    mainBody=mainBodyL[0]

    mainBody=mainBody.replace('<br />','\n')

    mainBody=mainBody.replace('&nbsp;',' ')

    return mainBody

if __name__ == '__main__': #程序运行的入口

    num = 0

    while True:

        html=getDate(weburl,webheaders)

        title = getTitle(html)#得到这一章的题目

        body = getNr(html) #得到内容

        text='      ' + title + '\n' + body

        num =num + 1

        file=targetDir + str(num) + title +'.txt'

        saveDataFileN(text, file) #保存到单章中

        Nurl=getNext(html)#得到下一章的url

        if Nurl == 0:#如果是最后一章则跳出去

            break

        weburl=weburlT+Nurl

        print(weburl)

        time.sleep(1) #睡眠50毫秒，防止被封ip
 ```

在实际操作中，有两个问题，一是学校的网络问题的确太过悲剧，三五分钟会断一次网。哪怕网络不断线，往往开始爬虫后，也常常堵死进程。一开始设置的timeout代码冷酷的提醒着我暂时没有办法去解决这个问题，所以文本的收集内容止步不前。其次是在已经收集的文本中，发现在统一转换编码的过程中，有些文本编码依旧会出现错乱，需要设定自动根据源代码进行编码转换的优化。



