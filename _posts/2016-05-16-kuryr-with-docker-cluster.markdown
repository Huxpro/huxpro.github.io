---
layout:     post
title:      "用docker cluster store实现kuryr的共享subnet"
subtitle:   "Kuryr with docker cluster store"
date:       2016-05-16 8:00:00
author:     "XuXinkun"
header-img: "img/post-bg-kuryr-re-learn.jpg"
tags:
    - openstack
    - kuryr
    - neutron
    - docker
---

# kuryr共享网络

在上一篇分享中，提到共享网络需要在`10.8.65.80`和`10.8.65.81`上分别通过`docker network create`来创建网络。而实际上，通过对docker源码的解读，发现其实并不需要在两台宿主机上分别创建，而可以让他们共享`network`的信息。这一方式需要通过docker cluster store功能实现。

# docker cluster store配置

docker本身有许多的数据需要，在先前的版本中，docker一般将这些数据存储在本地的文件中。在新版本中，docker提供了cluster store的功能。
该功能主要是将docker的**部分数据**存储在一个一致的kv存储中。
因此docker cluster store需要一个一致的kv存储，可供选择的存储后端包括zk，consul，etcd等。这里使用etcd作为存储后端。

1. 在`10.8.65.79`上搭建etcd，client连接端口为2379。
1. 分别在`10.8.65.80`和`10.8.65.81`上配置docker的启动脚本为`/usr/bin/docker daemon -H fd:// -H 0.0.0.0:5555 --cluster-store etcd://10.8.65.79:2379`。
1. kuryr也需要对应的修改。修改`/etc/kuryr/kuryr.conf`中增加`capability_scope = global`。
1. 重新启动kuryr
1. 重新启动docker。

# 实验

本实验目标是实现多个容器共享neutron的subnet。

![docker neutron](http://xuxinkun.github.io/img/kuryr/docker_neutron.png)

## 创建网络

在`10.8.65.80`上创建网络

    docker network create --driver=kuryr --ipam-driver=kuryr --subnet 10.0.0.0/16 --gateway 10.0.0.1 --ip-range 10.0.0.0/24 -o neutron.net.uuid=a11ce6f4-59aa-4868-8a6e-d86ad06b34b2 kuryr

在`10.8.65.80`上查看网络

```sh
[root@node1 kuryr]# docker network inspect kuryr 
[
    {
        "Name": "kuryr",
        "Id": "1a28609ce7075ff6dd3061ac2e6f97724552c78a8d59c438ac7c97dcd5420ea6",
        "Scope": "global",
        "Driver": "kuryr",
        "EnableIPv6": false,
        "IPAM": {
            "Driver": "kuryr",
            "Options": {},
            "Config": [
                {
                    "Subnet": "10.0.0.0/16",
                    "IPRange": "10.0.0.0/24",
                    "Gateway": "10.0.0.1"
                }
            ]
        },
        "Internal": false,
        "Containers": {},
        "Options": {
            "neutron.net.uuid": "a11ce6f4-59aa-4868-8a6e-d86ad06b34b2"
        },
        "Labels": {}
    }
]
```

这时候并不需要在`10.8.65.81`上创建网络。直接在`10.8.65.81`上查看

```sh
[root@node2 kuryr]# docker network ls
NETWORK ID          NAME                DRIVER
42be121377cf        bridge              bridge              
38400993c880        host                host                
1a28609ce707        kuryr               kuryr               
df595008f88a        none                null   
```

就可以看到在`10.8.65.80`上创建的网络，在`10.8.65.81`上同样可见。在`10.8.65.81`上使用`docker network inspect kuryr`查看可以得到与`10.8.65.80`上相同的结果。

## 原理分析

在`10.8.65.79`上通过查看etcd中存储的数据

```sh
[root@master ~]# etcdctl ls /docker/network/v1.0
/docker/network/v1.0/endpoint
/docker/network/v1.0/network
/docker/network/v1.0/endpoint_count
[root@master ~]# etcdctl get /docker/network/v1.0/network/1a28609ce7075ff6dd3061ac2e6f97724552c78a8d59c438ac7c97dcd5420ea6
{"addrSpace":"global_scope","enableIPv6":false,"generic":{"com.docker.network.enable_ipv6":false,"com.docker.network.generic":{"neutron.net.uuid":"a11ce6f4-59aa-4868-8a6e-d86ad06b34b2"}},"id":"1a28609ce7075ff6dd3061ac2e6f97724552c78a8d59c438ac7c97dcd5420ea6","inDelete":false,"internal":false,"ipamOptions":{},"ipamType":"kuryr","ipamV4Config":"[{\"PreferredPool\":\"10.0.0.0/16\",\"SubPool\":\"10.0.0.0/24\",\"Gateway\":\"10.0.0.1\",\"AuxAddresses\":null}]","ipamV4Info":"[{\"IPAMData\":\"{\\\"AddressSpace\\\":\\\"\\\",\\\"Gateway\\\":\\\"10.0.0.1/24\\\",\\\"Pool\\\":\\\"10.0.0.0/24\\\"}\",\"PoolID\":\"9d5d5610-1628-4cb8-bede-1f721e4c32a5\"}]","labels":{},"name":"kuryr","networkType":"kuryr","persist":true,"postIPv6":false,"scope":"global"}
```

可以看到docker将相关的网络信息存储在了etcd中，不同宿主机上的docker daemon通过访问相同的etcd，达到存储一致的目的。

当然，docker并不是将所有的网络信息都存在了etcd中。`docker network inspect kuryr`中可以看到其中`"Scope": "global"`，即其范围为global的`network`相关数据才会存储在etcd中。

## 创建容器

使用`docker run -it -d --net kuryr --privileged=true  index.alauda.cn/xuxinkun/net_test`在`10.8.65.80`和`10.8.65.81`上分别创建容器。在容器中互`ping`可以访问。

这时候在`10.8.65.80`上再次查看网络

```sh
[root@node1 kuryr]# docker network inspect kuryr 
[
    {
        "Name": "kuryr",
        "Id": "1a28609ce7075ff6dd3061ac2e6f97724552c78a8d59c438ac7c97dcd5420ea6",
        "Scope": "global",
        "Driver": "kuryr",
        "EnableIPv6": false,
        "IPAM": {
            "Driver": "kuryr",
            "Options": {},
            "Config": [
                {
                    "Subnet": "10.0.0.0/16",
                    "IPRange": "10.0.0.0/24",
                    "Gateway": "10.0.0.1"
                }
            ]
        },
        "Internal": false,
        "Containers": {
            "ee273452ce9f5104cb322dfabb85580191a2c12b7f8bff6c8bdcb48a2e6b012b": {
                "Name": "cranky_heyrovsky",
                "EndpointID": "4bf61eae0f2123876151eefba77ecc73f615bb04658dfd44263482315f523b11",
                "MacAddress": "fa:16:3e:3b:88:ff",
                "IPv4Address": "10.0.0.11/24",
                "IPv6Address": ""
            },
            "ep-050d727097abd6c66bc75c08dc228e10fe0fa50fdb5ade549fbbbe9f82c68e2e": {
                "Name": "boring_cray",
                "EndpointID": "050d727097abd6c66bc75c08dc228e10fe0fa50fdb5ade549fbbbe9f82c68e2e",
                "MacAddress": "fa:16:3e:e7:5f:16",
                "IPv4Address": "10.0.0.12/24",
                "IPv6Address": ""
            }
        },
        "Options": {
            "neutron.net.uuid": "a11ce6f4-59aa-4868-8a6e-d86ad06b34b2"
        },
        "Labels": {}
    }
]
```

不仅可以看到本地容器分配的ip(10.0.0.11)，还可以看到其他宿主机上分配的ip(10.0.0.12)。

# 小结

上次分享中所说的`reuse networks`的坑，正确的解决方法应该是使用本文的`cluster-store`来解决。无需修改代码。