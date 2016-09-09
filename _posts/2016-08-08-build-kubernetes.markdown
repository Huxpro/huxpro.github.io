---
layout:     post
title:      "kubernetes源码阅读及编译"
subtitle:   "Build kubernetes from source."
date:       2016-08-05 8:00:00
author:     "XuXinkun"
header-img: "img/post-bg-build-k8s.jpg"
tags:
    - kubernetes
---

# kubernetes源码阅读

工欲善其事，必先利其器。在阅读kubernetes源码时，我也先后使用过多个IDE，最终还是停留在IDEA上。

我惯用的是pycharm(IDEA的python IDE版本)，配上go的插件，把源码目录进行合理组织后，加入到go的lib，即可实现跳转。更多的方法可以参看[这里](http://xuxinkun.github.io/2016/03/21/idea-svn/)。

# kubernetes源码编译

kubernetes的源码编译可以分为两种方式。一种是在宿主机/物理机上进行编译，这就意味着你需要完整的搭建编译环境，这个会依赖于各种问题，做法相当不fashion。另外一种则是使用docker进行编译。这也是目前最为流行的编译方式。

## 使用docker进行编译

本文以[kubernetes 1.2](https://github.com/kubernetes/kubernetes/tree/release-1.2/)为例进行介绍。

kubernetes自身提供了[基于docker的编译方式](https://github.com/kubernetes/kubernetes/blob/release-1.2/build/README.md)，按照说明，只需要运行
`run.sh hack/build-go.sh`即可从源码编译出对应的二进制文件。

# 流程详解

可以看到[run.sh](https://github.com/kubernetes/kubernetes/blob/release-1.2/build/run.sh)中有如下几个步骤：

```
kube::build::verify_prereqs
kube::build::build_image
kube::build::run_build_command "$@"
```

## verify_prereqs

`kube::build::verify_prereqs`是为编译做一些检查，包括检查需要的镜像是否存在等。

## build_image

`kube::build::build_image`这一步骤主要是根据[Dockerfile](https://github.com/kubernetes/kubernetes/blob/release-1.2/build/build-image/Dockerfile)，进行构建镜像。这一[步骤](https://github.com/kubernetes/kubernetes/blob/release-1.2/build/common.sh#L494)如下:

```
function kube::build::build_image() {
  kube::build::ensure_tar

  mkdir -p "${LOCAL_OUTPUT_BUILD_CONTEXT}"
  
  //对于源码进行打包，打成tar包
  "${TAR}" czf "${LOCAL_OUTPUT_BUILD_CONTEXT}/kube-source.tar.gz" $(kube::build::source_targets)  

  kube::version::get_version_vars
  kube::version::save_version_vars "${LOCAL_OUTPUT_BUILD_CONTEXT}/kube-version-defs"

  //组织待构建镜像的文件夹
  cp build/build-image/Dockerfile "${LOCAL_OUTPUT_BUILD_CONTEXT}/Dockerfile"
  kube::build::update_dockerfile
  
  //构建镜像
  kube::build::docker_build "${KUBE_BUILD_IMAGE}" "${LOCAL_OUTPUT_BUILD_CONTEXT}" 'false'
}
```

待构建镜像的文件夹位于`_output`文件夹中。可以看到`_output`的目录结构如下：

```
[root@localhost kubernetes]# tree _output/
_output/
└── images
    └── kube-build:build-cbc077d244
        ├── Dockerfile
        ├── kube-source.tar.gz
        └── kube-version-defs
```

`kube-source.tar.gz`即为kubernetes源码打成的tar包。Dockerfile即为[build-image/Dockerfile](https://github.com/kubernetes/kubernetes/blob/release-1.2/build/build-image/Dockerfile)文件。

之后`docker build`将在`kube-build:build-cbc077d244`文件夹中进行，编译成`kube-build:build-cbc077d244`的镜像。

> cbc077d244为git提交时的id，根据源码commit时情况不同该id不同。

```
[root@localhost kubernetes]# docker images
REPOSITORY                             TAG                 IMAGE ID            CREATED             VIRTUAL SIZE
kube-build                             build-cbc077d244    46bca394905f        42 hours ago        1.628 GB
gcr.io/google_containers/kube-cross    v1.4.2-1            eb4273dc5e30        5 months ago        1.551 GB
```

## run_build_command

到现在为止，必要的工作已经基本做完，代码也已经打包进入镜像，此时只要使用docker从`kube-build:build-cbc077d244`的镜像run一个容器出来，进行编译即可。

实际`kube::build::run_build_command`也就是这样工作的。不过这里面还做了一些额外的工作，比如把编译输出的文件夹通过`-v`参数挂载到`_output/dockerized/bin`下。这样当编译完成之后，生成的二进制文件就可以直接在`_output/dockerized/bin`目录下获取了。

> 这一过程参见[common.sh#L75](https://github.com/kubernetes/kubernetes/blob/release-1.2/build/common.sh#L75)

# 实际问题

一条命令进行编译的愿望很美好。但是理想很丰满，现实很骨感，在实际中有一些问题，导致这一编译不能正常进行。其中首要的问题就是镜像无法拉取的问题。

## 镜像无法拉取

[Dockerfile](https://github.com/kubernetes/kubernetes/blob/release-1.2/build/build-image/Dockerfile)中的第一行命令:
`FROM gcr.io/google_containers/kube-cross:KUBE_BUILD_IMAGE_CROSS_TAG`。因此需要依赖于`gcr.io/google_containers/kube-cross:KUBE_BUILD_IMAGE_CROSS_TAG`这个镜像。但是由于网络原因，往往无法正常拉取该镜像。所以会导致镜像构建失败。

对于这一问题，有两种方式可以解决：

- 自己进行构建kube-cross镜像
- 通过代理或者其他方式，获取`gcr.io/google_containers/kube-cross:KUBE_BUILD_IMAGE_CROSS_TAG`镜像

本文主要介绍前一种方式。其实kube-cross镜像的内容，可以在[kube-cross文件夹](https://github.com/kubernetes/kubernetes/blob/release-1.2/build/build-image/cross/Dockerfile)中获取。当然，要想在国内直接构建这个镜像，仍然会存在无法下载部分包的问题。这里我使用了灵雀云的系统来构建这个镜像。这里是[我的kubernetes镜像](https://hub.alauda.cn/repos/xuxinkun/kubernetes)。

所以你需要做的只是运行以下命令即可:

```
docker pull index.alauda.cn/xuxinkun/kubernetes
docker tag index.alauda.cn/xuxinkun/kubernetes gcr.io/google_containers/kube-cross:v1.4.2-1
```

## 编译极为耗时

当使用`run.sh hack/build-go.sh`会编译项目中linux下的所有二进制文件。这一过程极为耗时，大概要十几分钟的样子。根据配置不同时间或有增减。

其实在实际过程中，并不需要每次编译所有的文件。比如本次只需要kubelet，那么可以直接运行`run.sh hack/build-go.sh cmd/kubelet`，即可只编译kubelet文件，缩短编译时间。