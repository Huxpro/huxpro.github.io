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
[homebrew](https://brew.sh/index_zh-cn)是一款MacOS平台下的一款软件包管理工具，具有安装、卸载、搜索、更新等功能的工具。其中文官网道：又提示缺少套件啦？别担心，Homebrew 随时守候。Homebrew —— OS X 不可或缺的套件管理器。
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
- 卸载安装包
```
$ brew uninstall <packgename>
```
&#160;&#160;&#160;&#160;&#160;&#160;&#160;示例：卸载git
```
$ brew uninstall git
```