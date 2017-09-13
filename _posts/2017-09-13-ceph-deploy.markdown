---
layout:     post
title:      "利用虚拟机部署Ceph集群"
subtitle:   ""
date:       2017-09-13 14:55:00
author:     "Liuyuan"
header-img: "img/ceph.png"
catalog: true
tags:
    - Ceph
---

> “Ceph-deploy”

# 安装ceph-deploy
首先需要修改当前节点的主机名，命令为
'''
hostnamectl set-hostname ceph-node1
'''
然后修改hosts文件

'''
vi /etc/hosts
'''

将以下回还ip
'''
127.0.0.1   localhost localhost.localdomain localhost4 localhost4.localdomain4
::1         localhost localhost.localdomain localhost6 localhost6.localdomain6
'''
改成真实ip和主机名（hostname）
'''
192.168.1.1 localhost ceph-node1 localhost4 localhost4.localdomain4
::1         localhost localhost.localdomain localhost6 localhost6.localdomain6
'''

