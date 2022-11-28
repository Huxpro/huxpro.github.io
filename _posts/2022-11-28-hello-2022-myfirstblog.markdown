---
layout:     post
title:      "Hello 2022"
subtitle:   " \"Hello World, Hello Blog\""
date:       2022-11-28 20:00:00
author:     "Jiasheng"
header-img: "img/post-bg-2015.jpg"
catalog: true
tags:
    - Meta
---

> “Yeah It's on. ”


JIASHENG 的 Blog 就这么开通了。

[跳过废话，直接看技术实现 ](#build) 

2022 年，JIASHENG 总算有个地方可以好好写点东西了。


作为一个小白，这是我搭建的第一博客，接下来会讲诉一下我遇到的问题和搭建博客的过程


<p id = "build"></p>

## 正文

### 我为什么要搭建这个博客
听室友说他搭了个博客，然后最近找了个阿里机器学习的实习，月薪1万，他说有问到他后端的，那人对他自己搭建的网站挺感兴趣的....其实我早就想搭博客了，之前搞过几次，半途而废没搭起来，
这次折腾了一个下午要搞出来了

### 我搭建这个博客主要经历了什么
GitHub我不会用...今日之前的水平仅限于download zip（每错，我之前把GitHub当成Google用来搜索代码，有用的就下载下来...从未用GitHub来管理过我的代码或者用GitHub搭建一个界面）
#### 1.看bilibili上的教程（实际上没帮到我）
为了搭建这个博客，我先是上bilibili搜了一下：“如何搭建一个博客”，主要看了两个视频，一个是关于[搭建个人博客的理论](https://www.bilibili.com/video/BV1qD4y1z783)
主要是将理论，和我这里搭建的博客没啥关系...
然后看了另外一个[搭建个人网站的视频](https://www.bilibili.com/video/BV1rU4y1J785)，讲可以租一个云服务器然后把网页利用云服务器发布，并且还推荐了一个模块化跟搭积木一样做博客的网页，实际上和我这里搭建的博客也没啥关系，我这个博客完全在
GitHub上不需要云服务器。
#### 2.在必应上搜索如何搭建个人博客
我主要找的教程是和GitHub相关的，其他技术路线有很多

我先学了怎么在本地使用github（我先注册了github账号、在windows电脑上安装了Git、Node.js、Hexo）
然后学了一下怎么将本地的代码和github上的代码进行同步等基本操作（和我这里搭建的博客也没有关系）...
主要内容都在csdn，csdn的很多文章非常乱...非常难以复现...
基本上照着上面某个教程弄，弄到一半发现莫名其妙的问题，然后就弄不下去了，大概是说要在setting里面下拉找到**Github Pages**这里找到一个链接
![image](https://user-images.githubusercontent.com/119298299/204282276-ef685bc3-5431-4a9c-98e4-5f47928cfa9f.png)
我发现我跟着这些教程走，完全没有这个选项，我的github代码进入setting后，连**option**都没有
我的是**general**，也没有直接找到**Github Pages**
![image](https://user-images.githubusercontent.com/119298299/204282568-86bafcf9-0388-4d80-82a1-396f6d971beb.png)
然后我到油管上找了找教程，就发现了，压根就不是在setting里面下拉找到**Github Pages**
![image](https://user-images.githubusercontent.com/119298299/204283426-a920f7cc-48d1-4c12-bcb3-6691c4a9a6b9.png)
....主要原因是：国内的教程大多数翻译过来的、并且更新不及时、人家github网页的操作都更新了，csdn上很多教程还是很旧的。

然后我跟着[油管教程搭建了一个博客](https://www.youtube.com/watch?v=AIEJP-igDro)
跟着他搭发现可以用，fork了一个别人的博客到我自己仓库
![image](https://user-images.githubusercontent.com/119298299/204284170-c0872022-36d1-411c-8508-43ff4417d403.png)
然后我要把这个模板替换为自己的，我发现我直接在github网站上改，但是的博客网站上没有同步（大致原因是我fork了别人的代码
我改动代码，然后提交，需要原来的那个主人同意....然后折腾了好久，我去查了一下关于github版本管理的，大多数教程是在本地
电脑上，用命令行实现与云端代码同步的，最后我想到branch...原来如此，我把branch从原来主人的master，新建了一个我自己的，
每次我在我自己的分支修改完代码，我都要提交给自己，然后点同意，然后我就可以用这个模板了...也就是本博客的来源）
![image](https://user-images.githubusercontent.com/119298299/204285072-28dd427b-b1e8-4bcd-81ca-1e5c5f07c664.png)
![image](https://user-images.githubusercontent.com/119298299/204285342-0f3db8bb-9906-46e9-96bb-8795ef8c068f.png)
![image](https://user-images.githubusercontent.com/119298299/204285561-dc5fb1a5-f461-4389-a3ca-8a156bbade49.png)

接下来说说搭建这个博客的技术细节。  


