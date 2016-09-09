---
layout:     post
title:      "浅析flannel与docker结合的机制和原理"
subtitle:   "Analysis of flannel"
date:       2016-07-18 8:00:00
author:     "XuXinkun"
header-img: "img/post-bg-flannel.jpg"
tags:
    - flannel
    - docker
---

# flannel

[flannel](https://github.com/coreos/flannel)可以为容器提供网络服务。
其模型为全部的容器使用一个network，然后在每个host上从network中划分一个子网subnet。
为host上的容器创建网络时，从subnet中划分一个ip给容器。

其采用目前比较流行的no server的方式，即不存在所谓的控制节点，而是每个host上的flanneld从一个etcd中获取相关数据，然后声明自己的子网网段，并记录在etcd中。

其他的host对数据转发时，从etcd中查询到该子网所在的host的ip，然后将数据发往对应host上的flanneld，交由其进行转发。

根据kubernetes的模型，即为每个pod提供一个ip。flannel的模型正好与之契合。因此flannel是最简单易用的kubernetes集群网络方案。

# flannel与docker的结合

flannel的工作原理这里不重复赘述。网上有很多资料。本文主要讲一下flannel是怎么与docker结合起来的。

## flannel服务启动

flannel服务需要先于docker启动。flannel服务启动时主要做了以

下几步的工作：

- 从etcd中获取network的配置信息
- 划分subnet，并在etcd中进行注册
- 将子网信息记录到`/run/flannel/subnet.env`中

```
[root@localhost run]# cat /run/flannel/subnet.env 
FLANNEL_NETWORK=4.0.0.0/16
FLANNEL_SUBNET=4.0.34.1/24
FLANNEL_MTU=1472
FLANNEL_IPMASQ=false
```

- 之后将会有一个脚本将subnet.env转写成一个docker的环境变量文件`/run/flannel/docker`

```
[root@localhost run]# cat /run/flannel/docker 
DOCKER_OPT_BIP="--bip=4.0.34.1/24"
DOCKER_OPT_IPMASQ="--ip-masq=true"
DOCKER_OPT_MTU="--mtu=1472"
DOCKER_NETWORK_OPTIONS=" --bip=4.0.34.1/24 --ip-masq=true --mtu=1472 "
```

## docker服务启动

接下来，docker daemon启动，使用`/run/flannel/docker`中的变量，作为启动参数，启动后的进程如下

```
[root@localhost ~]# ps -fe|grep docker
root      4538  4536  0 Jul20 ?        00:08:04 /usr/bin/docker-current daemon --exec-opt native.cgroupdriver=systemd --selinux-enabled --log-driver=journald --bip=4.0.100.1/24 --ip-masq=true --mtu=1472
```

## 容器启动

容器之后的启动，就是由docker daemon负责了。因为配置了`bip`，因此创建出来的容器会使用该网段的ip，并赋给容器。即容器其实还是按照bridge的模式，进行创建的。

# flannel与docker结合原理

现在问题来了，容器之间是怎么互通的呢？这里先要说道flanneld，他会在宿主机host上创建一个flannel0的设备。

```
[root@localhost ~]# ip add
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN 
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
    inet6 ::1/128 scope host 
       valid_lft forever preferred_lft forever
2: enp0s3: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc pfifo_fast state UP qlen 1000
    link/ether 08:00:27:b7:7e:f3 brd ff:ff:ff:ff:ff:ff
    inet 10.8.65.66/24 brd 10.8.65.255 scope global dynamic enp0s3
       valid_lft 67134sec preferred_lft 67134sec
    inet6 fe80::a00:27ff:feb7:7ef3/64 scope link 
       valid_lft forever preferred_lft forever
5: flannel0: <POINTOPOINT,MULTICAST,NOARP,UP,LOWER_UP> mtu 1472 qdisc pfifo_fast state UNKNOWN qlen 500
    link/none 
    inet 4.0.100.0/16 scope global flannel0
       valid_lft forever preferred_lft forever
6: docker0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1472 qdisc noqueue state UP 
    link/ether 02:42:2e:5e:cd:90 brd ff:ff:ff:ff:ff:ff
    inet 4.0.100.1/24 scope global docker0
       valid_lft forever preferred_lft forever
    inet6 fe80::42:2eff:fe5e:cd90/64 scope link 
       valid_lft forever preferred_lft forever
```

接下来我们在看宿主机host上的路由信息。

```
[root@localhost ~]# route -n
Kernel IP routing table
Destination     Gateway         Genmask         Flags Metric Ref    Use Iface
0.0.0.0         10.8.65.1       0.0.0.0         UG    100    0        0 enp0s3
4.0.0.0         0.0.0.0         255.255.0.0     U     0      0        0 flannel0
4.0.100.0       0.0.0.0         255.255.255.0   U     0      0        0 docker0
10.8.64.10      10.8.65.1       255.255.255.255 UGH   100    0        0 enp0s3
10.8.65.0       0.0.0.0         255.255.255.0   U     100    0        0 enp0s3
```

现在有三个容器分别是A/B/C

|容器|ip|
|---|---|
|A|4.0.100.3|
|B|4.0.100.5|
|C|4.0.32.3|

当容器A发送到同一个subnet的容器B时，因为二者处于同一个子网，所以容器A/B位于同一个宿主机host上，而容器A/B也均桥接在docker0上。

```
[root@localhost ~]# brctl show
bridge name	bridge id		STP enabled	interfaces
docker0		8000.02422e5ecd90	no		veth2d1c803
							veth916067e
```

借助于网桥docker0，容器A/B即可实现通信。

那么位于不同宿主机的容器A和C如何通信呢？这个时候就要用到了flannel0这个设备了。
容器A想要发送给容器C，查路由表，可以知道需要使用flannel0接口，因此将数据发送到flannel0。
flanneld进程接收到flannel0接收的数据，然后从etcd中查询出`4.0.32.0/24`的子网的宿主机host的ip`10.8.65.53`。

```
[root@localhost calico]# etcdctl get /coreos.com/network/subnets/4.0.32.0-24
{"PublicIP":"10.8.65.53"}
```

然后将数据封包，发送到`10.8.65.53`的对应端口，由`10.8.65.53`的flanneld接收，解包，并转发到对应的容器中。