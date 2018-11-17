---
layout:     post
title:      "macOS使用技巧"
subtitle:   " \"skills for macOs\""
date:       2018-11-16 12:00:00
author:     "Mkd"
header-img: "img/post-bg-2015.jpg"
tags:
    - macOs
---

> “let's begin. ”

## 前言  
小白第一次使用macOS，在使用过程中收录一下使用技巧  
## HomeBrew
### 1、HomeBrew介绍   
[homebrew](https://brew.sh/index_zh-cn)是一款MacOS平台下的一款软件包管理工具，具有安装、卸载、搜索、更新等功能的工具，可以很简单的方式安装git、wget、cpp等工具。  
在其中文官网道：又提示缺少套件啦？别担心，Homebrew 随时守候。Homebrew —— OS X 不可或缺的套件管理器。
### 2、HomeBrew安装
homebrew官网点击[这里](https://brew.sh/index_zh-cn)。在官网首页介绍了其安装方法： 
#### 要求
- Intel CPU
- OS X 10.9 or higer
- Xcode命令工具（Mojave）
    ```
    $ xcode-select --install
    ```
- 支持shell(sh或者bash)
#### 安装
```
$ /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)" 
```
#### 卸载  
```
$ /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/uninstall)"
```
### 3、HomeBrew基本命令
- 查询可用的包
```
$ brew serach <packgename>
```
- 查询已安装包
```
$ brew list
```
- 安装包
```
$ brew install <packgename>
```
&#160;&#160;&#160;&#160;&#160;&#160;&#160;示例：安装git
```
$ brew install git
```
- 更新包
```
$ brew upgrade <packgename>
```
&#160;&#160;&#160;&#160;&#160;&#160;&#160;示例：更新git
```
$ brew upgrade git
```
- 卸载安装包
```
$ brew uninstall <packgename>
```
&#160;&#160;&#160;&#160;&#160;&#160;&#160;示例：卸载git
```
$ brew uninstall git
```
### 4、注意事项  
1、检查包是否冲突使用
```
$ brew doctor
```
一般终端里会提示解决冲突的办法，按照提示基本能解决问题
2、升级Mojave后brewhome后```/usr```下的系统目录需要root权限才能读写，而在之前版本的系统中，默认将homebrew安装在```/usr/local/```下，导致有些指令需要添加sudo前缀来执行，比如升级Homebrew需要：
```
$ sudo brew update
```
如果不想每次执行都需要加上超级用户的权限，一般有以下几种解决方法：
- 对/usr/local 目录下的文件读写进行root用户授权
```
$ sudo chown -R $(whoami) /usr/local
```
- 安装Homebrew时对安装路径进行指定，直接安装在不需要系统root用户授权就可以自由读写的目录下
```
$ <install path> -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```
- 卸载重新安装（推荐使用）
&#160;我就只有采用这种方法最终奏效，前两种方法在StackOverFlow也有人成功过。
