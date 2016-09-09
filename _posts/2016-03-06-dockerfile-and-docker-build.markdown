---
layout:     post
title:      "Dockerfile与Docker构建流程解读"
subtitle:   "Dockerfile and docker build"
date:       2016-03-06 12:00:00
author:     "XuXinkun"
header-img: "img/post-bg-dockerfile.jpg"
tags:
    - share
    - docker
---

# 摘要

本文主要讨论了对docker build的源码流程进行了梳理和解读，并分享了在制作Dockerfile过程中的一些实践经验，包括如何调试、优化和build中的一些要点。另外，还针对现有Dockerfile的不足进行了简要说明，并分享了对于Dockerfile的一些理解。这是2015年初第一次在社区的微信分享，原文刊载在[dockone社区](http://dockone.io/article/346)

# 听众

这次的分享主要面向有一定Docker基础的。我希望你已经：

- 用过Docker，熟悉docker commit命令
- 自己动手编写过Dockerfile
- 自己动手build过一个镜像，有亲身的体验

我主要分享一些现在网上或者文档中没有的东西，包括我的理解和一些实践，有误之处也请大家指正。好了，正文开始。

# Dockerfile

Dockerfile其实可以看做一个命令集。每行均为一条命令。每行的第一个单词，就是命令command。后面的字符串是该命令所要接收的参数。比如ENTRYPOINT /bin/bash。ENTRYPOINT命令的作用就是将后面的参数设置为镜像的entrypoint。至于现有命令的含义，这里不再详述。DockOne上有很多的介绍。

# Docker构建（docker build）

## docker build的流程

docker build的流程（这部分代码基本都在docker/builder中）

1. 提取Dockerfile（evaluator.go/RUN）。
2. 将Dockerfile按行进行分析（parser/parser.go/Parse） Dockerfile，每行第一个单词，如CMD、FROM等，这个叫做command。根据command，将之后的字符串用对应的数据结构进行接收。
3. 根据分析的command，在dispatchers.go中选择对应的函数进行处理（dispatchers.go）。
4. 处理完所有的命令，如果需要打标签，则给最后的镜像打上tag，结束。

在这里，我举一个例子来说明一下在第4步命令的执行过程。以CMD命令为例：

    func cmd(b *Builder, args []string, attributes map[string]bool, original string) error {
    cmdSlice := handleJsonArgs(args, attributes)
    
    if !attributes["json"] {
      cmdSlice = append([]string{"/bin/sh", "-c"}, cmdSlice...)
    }
    
    b.Config.Cmd = runconfig.NewCommand(cmdSlice...)
    
    if err := b.commit("", b.Config.Cmd, fmt.Sprintf("CMD %q", cmdSlice)); err != nil {
      return err
    }
    
    if len(args) != 0 {
      b.cmdSet = true
    }
    
    return nil
    }

可以看到，b.Config.Cmd = runconfig.NewCommand(cmdSlice...)就是根据传入的CMD，更新了Builder里面的Config。然后进行b.commit。Builder这里的commit大致含义其实与docker/daemon的commit功能大同小异。不过这里commit是包含了以下的一个完整过程(参见internals.go/commit)：

1. 根据Config，create一个container出来。
2. 然后将这个container通过commit(这个commit是指的docker的commit,与docker commit的命令是相同的)得到一个新的镜像。

不仅仅是CMD命令，几乎所有的命令(除了FROM外)，在最后都是使用b.commit来产生一个新的镜像的。

所以这会导致的结果就是，Dockerfile里每一行，最后都会变为镜像中的一层。几乎是有多少有效行，就有多少层。

## Dockerfile逆向

通过docker history image可以看到该镜像的历史来源。即使没有Dockerfile，也可以通过history来逆向产生Dockerfile。

    [root@jd ~]# docker history 2d8
    IMAGE               CREATED             CREATED BY                                      SIZE
    2d80e15fcfdb        8 days ago          /bin/sh -c #(nop) COPY dir:86faa820e8bf5dcc06   16.29 MB
    0f601e909d72        8 days ago          /bin/sh -c #(nop) ENTRYPOINT [hack/dind]        0 B
    68aed19c5994        8 days ago          /bin/sh -c set -x                               && git clone https://githu   3.693 MB
    ebc6ef15552b        8 days ago          /bin/sh -c #(nop) ENV TOMLV_COMMIT=9baf8a8a9f   0 B
    fe22e308201a        8 days ago          /bin/sh -c set -x                               && git clone -b v1.0.1 htt   5.834 MB
    f514c504c9b1        8 days ago          /bin/sh -c #(nop) COPY dir:d9a19910e57f47cb3b   3.114 MB
    e4e3ec8edf1a        8 days ago          /bin/sh -c ./contrib/download-frozen-image.sh   1.155 MB
    6250561532fa        8 days ago          /bin/sh -c #(nop) COPY file:9679abce578bcaa2c   3.73 kB
    ...

例如0f601e909d72就是由ENTRYPOINT [hack/dind]产生。这里的信息展示的不完全，可以通过docker inspect -f {{.ContainerConfig.Cmd}} layer来看某一层产生的具体信息。

# 如何做Dockerfile

## Dockerfile调试

Dockerfile更多的像一个脚本，类似于安装脚本。特别是大篇幅的脚本，想一次写成是比较有难度的。免不了进行一些调试。调试时最好利用Dockerfile的cache功能，可以大幅度节约调试的时间。

举个例子，如果我现在有一个Dockerfile。但是我发现。我还需要再开几个端口，或者再安装其他的软件。这个时候最好不要直接修改已经有的Dockerfile的内容。而是在后面追加命令。这样再build的时候，可以利用已有的cache。

## Dockerfile优化

调试过后的Dockerfile当然可以作为最终的Dockerfile，提供给用户。但是调试的Dockerfile的缺点就是层数可能过多，而且不易越多。所以最好进行一定的优化和整理。经过整理的Dockerfile生成出来的镜像可以使得层数更少，条理更清晰，也可以更好的复用。

DockerOne里有[一篇文章](http://dockerone.com/article/255)写得很好，可以参考。

这里有两点要强调：

- 尽量生成一个base：这样便于版本的迭代和作为公用镜像。
- 清晰的注释：有一些注释会帮助别人理解这些命令的目的

## Dockerfile自动build

有了Dockerfile，很多人都是在本地build。其实这个是相当耗时的。这个工作其实完全可以交给registry.hub.docker.com来完成。

具体的做法就是：

1. 把你的Dockerfile上传到GitHub上。
2. 进入到registry.hub.docker.com的自己的账户中，选择Automated Build。
3. 然后就可以build了。

根据你的Dockerfile内容大小，build时长不确定。但是应该算是比较快了。docker源码的Dockerfile在我本地build了一个多小时。但是registry.hub.docker.com只用了半小时左右。大约是因为外国的月亮比较圆吧。

build完成后，可以在线查看版本信息等。本地需要的话，可以直接pull下来。

国内有多家公司提供了registry.hub.docker.com的Mirror服务，可以直接从国内的源中pull下来。速度快很多。

## Dockerfile的不足

- 层数过多:过多行的Dockerfile
- 不能清理volume等配置：volume、expose等多个参数只能单向增加。不能删除。比如在某个镜像层加入了VOLUME /var/lib/docker。那么在该镜像之后的所有层将继承这一属性。
- IMPORT功能

## 其他

现在我们回过头来看Docker的分层的另一个可能的用途。

Docker的镜像可以看做是一个软件栈。那么其中有多个软件组成。好了，那么我们是不是可以考虑让软件进行自由叠加呢？

比如：从CentOS镜像上安装了Python形成镜像A，从CentOS镜像上安装了Apache形成镜像B。如果用户想从CentOS上形成一个既有Python又有Apache的镜像，如何做呢？

我想有两种方式，一种是dockerfile的import。我们可以基于镜像A，然后import安装Apache的Dockerfile，从而得到目标镜像。

另外一种是可以直接引入，就是基于镜像A，然后我们直接把B的最后一层（假设B安装apache只形成了一层），搬到镜像A的子层上，不是也可以得到目标镜像么？
