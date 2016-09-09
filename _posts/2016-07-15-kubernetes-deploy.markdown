---
layout:     post
title:      "kubernetes入门之快速部署"
subtitle:   "Deploy kubernetes."
date:       2016-07-15 8:00:00
author:     "XuXinkun"
header-img: "img/post-bg-deploy-kubernetes.jpg"
tags:
    - kubernetes
---

# 角色说明

这里主要有三个角色，分别部署不同的服务。

|角色|服务|
|-----|-------|
|etcd|etcd|
|master|kube-apiserver/kube-scheduler/kube-controller|
|node|kube-proxy/flannl/kubelet/docker|

这里网络使用了最简单的flannel网络。

# kubernetes-ansible安装

这里主要参考了[kubernetes-ansible](https://github.com/eparis/kubernetes-ansible)的脚本。并作了裁剪和定制。

主要做的一些变化包括:

- 使用epel源作为安装的源
- 裁剪了fedora的安装脚本
- 裁剪了firewalld的配置
- 增加了iptables的安装和配置
- 增加了flannel的iptables规则
- 修改了skydns部署的一些问题

修改后的脚本开源在了[kubernetes-ansible](https://github.com/xuxinkun/kubernetes-ansible)中。

因此需要用户做的是

- 准备至少两台vm。centos7的系统。保证其联网。本文中使用了三台vm。在本文环境中，安排各个角色如下：

|ip|角色|
|--|--|
|10.8.65.57|etcd|
|10.8.65.57|master|
|10.8.65.58|node|
|10.8.65.61|node|

- 在一台(master)上安装ansible1.9。
- 从[kubernetes-ansible](https://github.com/xuxinkun/kubernetes-ansible)中下载代码，然后修改根据环境修改inventory。
- 根据需求定制自己的`group_vars`中的`all.yml`中的变量(包括可以配置子网的大小，掩码，是否安装skydns等)。
- 执行`ansible-playbook -i inventory setup.yml`
- 等待自动部署完成。

全部安装完成后，可以在master上执行`kubectl get node`查看服务是否已经成功启动。

至此，一个简易的kubernetes集群环境就搭建完毕了。