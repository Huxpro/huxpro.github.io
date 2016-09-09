---
layout:     post
title:      "kuryr环境搭建"
subtitle:   "Deploy Kuryr"
date:       2016-05-06 8:00:00
author:     "XuXinkun"
header-img: "img/post-bg-deploy-kuryr.jpg"
tags:
    - openstack
    - kuryr
    - neutron
    - docker
---

# 前言

kuryr是docker和neutron结合的一个项目。docker自1.9之后，支持libnetwork的remote的driver，使得可以通过json rpc调用，为docker提供网络。

本文主要记录了neutron/kuryr/docker环境的搭建过程。

# neutron环境搭建

## 环境说明

操作系统使用centos7.2。包括有三个节点。

| ip         | role         |
| ---------- | ------------ |
| 10.8.65.79 | controller   |
| 10.8.65.80 | network node |
| 10.8.65.81 | network node |

## 安装

使用RDO进行安装。由于只需要neutron和keystone服务，所以对answer-file进行调整。neutron的网络有vlan/vxlan/GRE三种。这里因为使用的是虚拟机，我采用了vxlan的方式进行配置。我的[answer-file样例](http://xuxinkun.github.io/file/answer-file)。

在使用RDO之前，首先要关闭三个机器的selinux。并添加三个机器，可以无密钥登录。这里就不详细描述了。具体怎样做可以搜一下。

接下来，安装packstack，并进行安装:

	yum install -y centos-release-openstack-liberty.noarch
	yum install -y openstack-packstack
	packstack --answer-file=answer-file

## 验证安装

成功安装后，对安装结果进行验证。

	source keystonerc_admin
	neutron --debug net-list

# 安装kuryr

在network node安装kuryr。

	git clone https://github.com/openstack/kuryr.git
	pip install -r requirements.txt
	python setup.py install

kuryr的配置文件可以通过tox自动生成(需要提前`easy_install tox`来安装tox)。这里给一个范例[kuryr](http://xuxinkun.github.io/file/kuryr.conf)。

# 运行kuryr

首先运行kuryr，并启动docker。

> docker要求1.9以上的版本。最好是1.10+的。


	./scripts/run_kuryr.sh
	systemctl restart docker
	
## 创建	

在10.8.65.80上创建network:
	
	docker network create --driver=kuryr --ipam-driver=kuryr --subnet 10.0.0.0/16 --gateway 10.0.0.1 --ip-range 10.0.0.0/24 kuryr

创建容器:

	docker run -it -d --net kuryr --privileged=true  index.alauda.cn/xuxinkun/net_test /bin/bash

通过`docker network ls`可以看到容器

在10.8.65.81上创建network，可以复用刚才的network，也可以新创建一个。如果是复用的话，使用以下命令:

	docker network create --driver=kuryr --ipam-driver=kuryr --subnet 10.0.0.0/16 --gateway 10.0.0.1 --ip-range 10.0.0.0/24 -o neutron.net.uuid=8c31997a-97f4-4283-9872-5e00250a014d kuryr
