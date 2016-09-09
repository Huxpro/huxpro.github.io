---
layout:     post
title:      "使用docker搭建kafka环境"
subtitle:   "Deploy kafka with docker"
date:       2016-05-08 8:00:00
author:     "XuXinkun"
header-img: "img/post-bg-deploy-kafka.jpg"
tags:
    - docker
    - kafka
---

# Requirements

最近学习了下kafka，为方便搭建环境，使用docker进行部署。

需要首先安装docker的环境。要求操作系统是linux的64位系统。

docker的安装(适于rpm/deb安装):
    
    curl -fsSL https://get.docker.com/ | sh

docker-compose的安装:
    
    curl -L https://github.com/docker/compose/releases/download/1.7.0/docker-compose-`uname -s`-`uname -m` > /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose

# Kafka Image

## Dockerfile

Dockerfile是用于描述镜像的制作过程。根据[kafka的教程](http://kafka.apache.org/documentation.html#quickstart_send)，编写对应的Dockerfile。

基础镜像使用了centos6的版本，当然根据需要也可以使用其他的版本。

    FROM index.alauda.cn/tutum/centos:centos6
    RUN yum install -y wget
    RUN wget --no-check-certificate --no-cookies --header "Cookie: oraclelicense=accept-securebackup-cookie"  http://download.oracle.com/otn-pub/java/jdk/8u91-b14/jdk-8u91-linux-x64.rpm
    RUN rpm -ivh jdk-8u91-linux-x64.rpm
    RUN mkdir -p /kafka && cd /kafka && wget http://mirrors.cnnic.cn/apache/kafka/0.9.0.0/kafka_2.11-0.9.0.0.tgz && tar -xzf kafka_2.11-0.9.0.0.tgz && cd kafka_2.11-0.9.0.0
    WORKDIR /kafka/kafka_2.11-0.9.0.0

有了这样的一个Dockerfile，可以在本地，也可以使用公有云进行镜像制作。在本地制作的话，可以使用该命令:
    
    docker build -t index.alauda.cn/xuxinkun/kafka .
    
我使用了灵雀云的镜像服务进行build，可以在[这里](https://hub.alauda.cn/repos/xuxinkun/kafka)查看。

# Docker-Compose 

有了镜像之后，现在需要对服务进行启动。这里使用了docker的编排服务docker-compose，进行编排。

kafka主要包括两个服务，zookeeper和kafka。所以需要分别启动两个服务。这里将两个服务直接使用宿主机的网络。编写`docker-compose.yaml`如下:

    zk:
      image: index.alauda.cn/xuxinkun/kafka
      net: host
      stdin_open: true
      tty: true
      command: bin/zookeeper-server-start.sh config/zookeeper.properties
    kafka:
      image: index.alauda.cn/xuxinkun/kafka
      net: host
      stdin_open: true
      tty: true
      command: bin/kafka-server-start.sh config/server.properties

## 启动服务      
      
现在可以一条命令启动所有的服务:

    [root@node1 Dockerfile]# docker-compose up -d
    Creating dockerfile_kafka_1
    Creating dockerfile_zk_1

## 查看服务状态

对服务状态进行查看。

    [root@node1 Dockerfile]# docker-compose ps
            Name                       Command               State   Ports 
    ----------------------------------------------------------------------
    dockerfile_kafka_1      bin/kafka-server-start.sh  ...   Up            
    dockerfile_zk_1         bin/zookeeper-server-start ...   Up  

当然也可以使用`docker ps -a`进行查看。

## 停止服务

    [root@node1 Dockerfile]# docker-compose stop zk kafka
    Stopping dockerfile_kafka_1 ... done
    Stopping dockerfile_zk_1 ... done

## 删除服务
   
    [root@node1 Dockerfile]# docker-compose rm zk kafka