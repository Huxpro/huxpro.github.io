---
layout:     post
title:      "kuryr从入门到入门"
subtitle:   "Kuryr From beginer to beginer"
date:       2016-05-10 8:00:00
author:     "XuXinkun"
header-img: "img/post-bg-kuryr-share.jpg"
tags:
    - openstack
    - kuryr
    - neutron
    - docker
---


# 写在前面

------------

docker自1.9之后，支持了插件化的方式来提供，这就为扩展提供了各种可能。

# docker

## docker network

![docker network](http://xuxinkun.github.io/img/kuryr/docker_network.png)

-----------------------------

### Sandbox

A Sandbox contains the configuration of a container's network stack. This includes management of the container's interfaces, routing table and DNS settings. An implementation of a Sandbox could be a Linux Network Namespace, a FreeBSD Jail or other similar concept. A Sandbox may contain many endpoints from multiple networks.

-----------------------------

### Endpoint

An Endpoint joins a Sandbox to a Network. An implementation of an Endpoint could be a veth pair, an Open vSwitch internal port or similar. An Endpoint can belong to only one network but may only belong to one Sandbox.

-----------------------------

### Network

A Network is a group of Endpoints that are able to communicate with each-other directly. An implementation of a Network could be a Linux bridge, a VLAN, etc. Networks consist of many endpoints.

## docker plugin

![docker plugin](http://xuxinkun.github.io/img/kuryr/docker_plugin.png)

-------------------------------

### ipam

During the Network and Endpoints lifecyle, the CNM model controls the IP address assignment for network and endpoint interfaces via the [ipam](https://github.com/docker/libnetwork/blob/master/docs/ipam.md) driver(s). Libnetwork has a default, built-in IPAM driver and allows third party IPAM drivers to be dynamically plugged.

--------------------------------

### libnetwork remote plugin

The [remote plugin](https://github.com/docker/libnetwork/blob/master/docs/remote.md) package provides the integration point for dynamically-registered drivers. Unlike the other driver packages, it does not provide a single implementation of a driver; rather, it provides a proxy for remote driver processes, which are registered and communicate with LibNetwork via the Docker plugin package.

# kuryr Detail

## libnetwork & neutron

| libnetwork | Neutron                |
| ---------- | ---------------------- |
| Network    | Network                |
| Sandbox    | Subnet, Port and netns |
| Endpoint   | Port                   |

## Detail

-------------------

### Create Network

1. /IpamDriver.RequestPool: 创建subnetpool用于分配IP
2. /IpamDriver.RequestAddress: 为gateway获取IP
3. /NetworkDriver.CreateNetwork: 创建neutron network和subnet

-------------------

### Create Container

1. /IpamDriver.RequestAddress: 为容器获取IP
2. /NetworkDriver.CreateEndpoint: 创建neutron port
3. /NetworkDriver.Join: 为容器和port绑定
4. /NetworkDriver.ProgramExternalConnectivity: 不知道干啥的
5. /NetworkDriver.EndpointOperInfo: 没啥用

-------------------

### Delete Container

1. /NetworkDriver.RevokeExternalConnectivity: 不知道干啥的
2. /NetworkDriver.Leave: 容器和port解绑
3. /NetworkDriver.DeleteEndpoint: 实际不做操作
4. /IpamDriver.ReleaseAddress: 删除port并释放IP

-------------------

### Delete Network

1. /NetworkDriver.DeleteNetwork: 删除network
2. /IpamDriver.ReleaseAddress: 释放gateway的IP
3. /IpamDriver.ReleasePool: 删除subnetpool

# 演示

## 环境说明

操作系统使用centos7.2。包括有三个节点。

| ip         | role                   |
| ---------- | ---------------------- |
| 10.8.65.79 | controller+network node|
| 10.8.65.80 | network node           |
| 10.8.65.81 | network node           |

## One host One subnet

![docker kuryr](http://xuxinkun.github.io/img/kuryr/docker_kuryr.png)

------------------------------

	10.8.65.80:
	docker network create --driver=kuryr --ipam-driver=kuryr --subnet 10.0.0.0/16 --gateway 10.0.0.1 --ip-range 10.0.0.0/25 -o neutron.net.uuid=8c31997a-97f4-4283-9872-5e00250a014d kuryr
	docker run -it -d --net kuryr --privileged=true  index.alauda.cn/xuxinkun/net_test
	
	10.8.65.81:
	docker network create --driver=kuryr --ipam-driver=kuryr --subnet 10.0.0.0/16 --gateway 10.0.0.254 --ip-range 10.0.0.128/25 -o neutron.net.uuid=8c31997a-97f4-4283-9872-5e00250a014d kuryr
	docker run -it -d --net kuryr --privileged=true  index.alauda.cn/xuxinkun/net_test
	
	10.8.65.79:
	neutron router-create --tenant-id cda812f7ea84447282bb7ac130e9b192 router
	为router添加两个子网

## Share subnet

![docker neutron](http://xuxinkun.github.io/img/kuryr/docker_neutron.png)

------------------------------

    10.8.65.80:
    docker network create --driver=kuryr --ipam-driver=kuryr --subnet 10.0.0.0/16 --gateway 10.0.0.1 --ip-range 10.0.0.0/24 -o neutron.net.uuid=a11ce6f4-59aa-4868-8a6e-d86ad06b34b2 kuryr
    docker run -it -d --net kuryr --privileged=true  index.alauda.cn/xuxinkun/net_test
    
    10.8.65.81:
    docker network create --driver=kuryr --ipam-driver=kuryr --subnet 10.0.0.0/16 --gateway 10.0.0.1 --ip-range 10.0.0.0/24 -o neutron.net.uuid=8c31997a-97f4-4283-9872-5e00250a014d kuryr
    docker run -it -d --net kuryr --privileged=true  index.alauda.cn/xuxinkun/net_test

​	

# 踩过的坑

## MTU

> 容器的网卡默认mtu为1500。会导致相互ping没问题，curl的时候长时间卡住不动。

解决办法: mtu设置小一些。目前设置为1410。对于已经创建的可以使用`ifconfig eth0 mtu 1400 up`修改。

## reuse networks

[Reuse of the existing Neutron networks](http://docs.openstack.org/developer/kuryr/specs/existing-neutron-network.html)

> L版本之前没有neutron的tag功能，所以kuryr用network的name来对应docker的networkID。如果复用network，会导致每个机器上都去设置一下network的name，导致前一个节点无法准确找到network。

## gateway

> 在节点上创建network的时候，如果设置gateway会为其创建一个空的port。而kuryr实际并不没有创建对应的gateway。