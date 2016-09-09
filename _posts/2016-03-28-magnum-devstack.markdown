---
layout:     post
title:      "magnum devstack部署"
subtitle:   "Deploy magnum with devstack"
date:       2016-03-28 12:00:00
author:     "XuXinkun"
header-img: "img/post-bg-magnum-devstack.jpg"
tags:
    - openstack
    - magnum
    - devstack
---


# magnum安装

安装条件：

* 至少要10G以上内存的机器。亲测使用6G的虚拟机，所有操作均有至少一秒延迟。
* 硬盘至少50G
* 良好的上网环境
    
操作步骤参见[快速入门](http://docs.openstack.org/developer/magnum/dev/dev-quickstart.html)

以下是我操作的步骤记录

	sudo mkdir -p /opt/stack
	sudo chown $USER /opt/stack
	
	git clone https://git.openstack.org/openstack-dev/devstack /opt/stack/devstack
	
我的local.conf样例

	[[local|localrc]]
	HOST_IP=10.8.65.216
	FIXED_RANGE=10.24.0.0/24
	NETWORK_GATEWAY=10.24.0.1
	SERVICE_TOKEN=azertytoken
	ADMIN_PASSWORD=xxkxxkxxk
	DATABASE_PASSWORD=xxkxxkxxk
	RABBIT_PASSWORD=xxkxxkxxk
	SERVICE_PASSWORD=xxkxxkxxk
	
	PUBLIC_INTERFACE=eth0
	enable_plugin magnum https://git.openstack.org/openstack/magnum
	LOGFILE=$DEST/logs/stack.sh.log
	LOGDAYS=2
	enable_service tempest
	disable_service n-net
	enable_service q-svc
	enable_service q-agt
	enable_service q-dhcp
	enable_service q-l3
	enable_service q-meta
	
执行安装。由于网络问题，经常下包失败，所以失败时候手动安装部分包或者重新执行stack.sh
	
	cd /opt/stack/devstack
    ./stack.sh

# 运行magnum

## 创建flavor
    
	stack@magnum:~/devstack$ nova flavor-create m1.1g 11 1024 20 1
	+----+-------+-----------+------+-----------+------+-------+-------------+-----------+
	| ID | Name  | Memory_MB | Disk | Ephemeral | Swap | VCPUs | RXTX_Factor | Is_Public |
	+----+-------+-----------+------+-----------+------+-------+-------------+-----------+
	| 11 | m1.1g | 1024      | 20   | 0         |      | 1     | 1.0         | True      |
	+----+-------+-----------+------+-----------+------+-------+-------------+-----------+

## 创建秘钥
	
	stack@magnum:~/devstack$ nova keypair-add testkey

## 创建bay-model

	magnum baymodel-create --name k8sbaymodel \
                           --image-id fedora-21-atomic-5 \
                           --keypair-id testkey \
                           --external-network-id public \
                           --dns-nameserver 8.8.8.8 \
                           --flavor-id m1.1g \
                           --docker-volume-size 5 \
                           --network-driver flannel \
                           --coe kubernetes

## 创建bay     
                      
	magnum --debug bay-create --name k8sbay --baymodel k8sbaymodel --node-count 1 
	
## 查看bay
	
	magnum bay-list
	magnum bay-show k8sbay

## 创建pod

首先编写manifest

	[root@A01-R06-I141-86 mysql]# cat mysql.yaml 
	apiVersion: v1
	kind: Pod
	metadata:
	  labels:
	    name: mysql
	    role: master
	  name: mysql-pod
	spec:
	  containers:
	    - name: master
	      image: index.alauda.cn/tutum/mysql:5.5
	      env:
	        - name: MYSQL_PASS
	          value: admin
	      ports:
	        - containerPort: 3306	

通过命令创建pod
	
	magnum pod-create --bay k8sbay --manifest mysql.yaml
	
## 创建service

首先创建manifest

	[root@A01-R06-I141-86 mysql]# cat mysql-service.yaml 
	apiVersion: v1
	kind: Service
	metadata:
	  labels:
	    name: mysql
	    role: service
	  name: mysql-service
	spec:
	  ports:
	    - port: 3306
	      targetPort: 3306
	  type: NodePort
	  selector:
	    name: mysql
	
创建service
	    
	magnum coe-service-create --bay k8sbay --manifest mysql-service.yaml 

## 创建rc

首先创建manifest

	[root@A01-R06-I141-86 mysql]# cat mysql-rc.yaml 
	apiVersion: v1
	kind: ReplicationController
	metadata:
	  name: mysql-controller
	spec:
	  replicas: 2
	  # selector identifies the set of Pods that this
	  # replication controller is responsible for managing
	  selector:
	    name: mysql
	  # podTemplate defines the 'cookie cutter' used for creating
	  # new pods when necessary
	  template:
	    metadata:
	      labels:
	        name: mysql
	        role: master
	    name: mysql-pod
	    spec:
	      containers:
	        - name: master
	          image: index.alauda.cn/tutum/mysql:5.5
	          env:
	            - name: MYSQL_PASS
	              value: admin
	          ports:
	           - containerPort: 3306
	
创建rc
	    
	magnum rc-create --manifest mysql-rc.yaml --bay k8sbay
