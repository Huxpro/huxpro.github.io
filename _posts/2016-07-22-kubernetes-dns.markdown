---
layout:     post
title:      "kubernetes入门之skydns"
subtitle:   "Skydns of kubernetes."
date:       2016-07-22 8:00:00
author:     "XuXinkun"
header-img: "img/post-bg-skydns-kubernetes.jpg"
tags:
    - kubernetes
---

# 部署kubernetes dns服务

kubernetes可以为pod提供dns内部域名解析服务。其主要作用是为pod提供可以直接通过service的名字解析为对应service的ip的功能。

部署kubernetes dns服务主要需要两部分。

## kubelet

在kubelet中增加启动项，修改

```
$ vi /etc/kubernetes/kubelet
KUBELET_ARGS="--cluster_dns=10.254.0.10 --cluster_domain=kube.local"
```

## 创建dns rc和service

以下为两个dns rc和service的配置文件

```
[root@localhost calico]# cat /etc/kubernetes/skydns-rc.yaml 
apiVersion: v1
kind: ReplicationController
metadata:
  name: kube-dns-v6
  namespace: default
  labels:
    k8s-app: kube-dns
    version: v6
    kubernetes.io/cluster-service: "true"
spec:
  replicas: 1
  selector:
    k8s-app: kube-dns
    version: v6
  template:
    metadata:
      labels:
        k8s-app: kube-dns
        version: v6
        kubernetes.io/cluster-service: "true"
    spec:
      containers:
      - name: etcd
        image: gcr.io/google_containers/etcd:2.0.9
        command:
        - /usr/local/bin/etcd
        - -listen-client-urls
        - http://0.0.0.0:2379,http://0.0.0.0:4001
        - -advertise-client-urls
        - http://127.0.0.1:2379,http://127.0.0.1:4001
        - -initial-cluster-token
        - skydns-etcd
      - name: kube2sky
        image: gcr.io/google_containers/kube2sky:1.11
        resources:
          limits:
            cpu: 100m
            memory: 50Mi
        command:
        - /kube2sky
        - --kube_master_url=http://10.8.65.48:8080
        - -domain=kube.local
      - name: skydns
        image: gcr.io/google_containers/skydns:2015-03-11-001
        resources:
        command:
        - /skydns
        - -machines=http://localhost:4001
        - -addr=0.0.0.0:53
        - -domain=kube.local.
        ports:
        - containerPort: 53
          name: dns
          protocol: UDP
        - containerPort: 53
          name: dns-tcp
          protocol: TCP
      dnsPolicy: Default
      
[root@localhost calico]# cat /etc/kubernetes/skydns-svc.yaml 
apiVersion: v1
kind: Service
metadata:
  name: kube-dns
  namespace: default
  labels:
    k8s-app: kube-dns
    kubernetes.io/cluster-service: "true"
    kubernetes.io/name: "KubeDNS"
spec:
  selector:
    k8s-app: kube-dns
  clusterIP: 10.254.0.10
  ports:
  - name: dns
    port: 53
    protocol: UDP
  - name: dns-tcp
    port: 53
    protocol: TCP
```

然后使用`kubectl`进行创建

```
kubectl create -f /etc/kubernetes/skydns-rc.yaml 
kubectl create -f /etc/kubernetes/skydns-svc.yaml 
```

最后使用`kubectl get rc`和`kubectl get service`进行检查，验证其是否创建成功。

# dns实验

在部署完成后，进行验证实验。首先创建一个名为mysql-service的service。

```
[root@localhost k8s]# cat srv.yml 
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
```

通过`kubectl create -f srv.yml`创建，然后进行查看


```
[root@localhost k8s]# kubectl get service
NAME            CLUSTER-IP      EXTERNAL-IP   PORT(S)         AGE
kube-dns        10.254.0.10     <none>        53/UDP,53/TCP   3d
kubernetes      10.254.0.1      <none>        443/TCP         3d
mysql-service   10.254.162.44   nodes         3306/TCP        3d
```

可以看到mysql-service服务创建成功。

现在我再创建一个pod，查看其是否能正确解析域名。这里使用最简单的busybox镜像。

```
[root@localhost k8s]# cat busybox.yml 
apiVersion: v1
kind: Pod
metadata:
  labels:
    name: busybox
    role: master
  name: busybox
spec:
  containers:
    - name: busybox
      image: busybox  
      command:
      - sleep
      - "360000"
```

使用`kubectl create -f busybox.yml`创建。

使用`exec`进入到容器中进行域名解析

```
[root@localhost k8s]# kubectl exec -i -t busybox sh
/ # nslookup mysql-service
Server:    10.254.0.10
Address 1: 10.254.0.10 localhost

Name:      mysql-service
Address 1: 10.254.162.44
/ # nslookup mysql-service.default.kube.local
Server:    10.254.0.10
Address 1: 10.254.0.10

Name:      mysql-service.default.kube.local
Address 1: 10.254.162.44
/ # nslookup mysql-service.default.svc.kube.local
Server:    10.254.0.10
Address 1: 10.254.0.10

Name:      mysql-service.default.svc.kube.local
Address 1: 10.254.162.44
```



可以看到`mysql-service`、`mysql-service.default.svc.kube.local`、`mysql-service.default.kube.local`的域名均能正确解析为`mysql-service`的service中的ip`10.254.162.44`。

其中`mysql-service.default.kube.local`为完整域名，其组成为`<service-name>.<namespace>.<domain-name>`。

# kubernetes dns原理

现在反过来看kubernetes dns的原理。

首先在部署时候创建了一个dns的rc，最终会产生三个容器(不含pause)

```
[root@localhost ~]# docker ps -a
CONTAINER ID        IMAGE                                            COMMAND                  CREATED              STATUS              PORTS               NAMES
033800f393b9        index.alauda.cn/tutum/centos:centos6             "/run.sh"                3 days ago           Up 3 days           22/tcp              awesome_newton
0fb60dcfb8b4        gcr.io/google_containers/etcd:2.0.9              "/usr/local/bin/etcd "   3 days ago           Up 3 days                               k8s_etcd.8d001f7f_kube-dns-v6-ju8cb_default_149fdba5-4e50-11e6-ba47-0800273d5f3f_6afe5c27
0a0efd5f0aaa        gcr.io/google_containers/skydns:2015-03-11-001   "/skydns -machines=ht"   3 days ago           Up 3 days                               k8s_skydns.5d0f4a29_kube-dns-v6-ju8cb_default_149fdba5-4e50-11e6-ba47-0800273d5f3f_f7c4ee06
cfef318e4032        gcr.io/google_containers/kube2sky:1.11           "/kube2sky --kube_mas"   3 days ago           Up 3 days                               k8s_kube2sky.eb7ac18c_kube-dns-v6-ju8cb_default_149fdba5-4e50-11e6-ba47-0800273d5f3f_19b79770
afad7b2ebd3d        docker.io/kubernetes/pause                       "/pause"                 3 days ago           Up 3 days                               k8s_POD.87e723e6_kube-dns-v6-ju8cb_default_149fdba5-4e50-11e6-ba47-0800273d5f3f_3c3f7c87
```

## dns解析过程

在创建的pod中，可以查看其所使用的域名解析服务器:

```
[root@localhost k8s]# kubectl exec -i -t busybox sh
/ # cat /etc/resolv.conf 
search default.svc.kube.local svc.kube.local kube.local 
nameserver 10.254.0.10
options ndots:5
```

在kubelet创建pod时，会使用为kubelet配置的`-cluster_dns=10.254.0.10 --cluster_domain=kube.local`，在创建的pod中从而使用对应的dns服务器。

而这一dns解析服务，实际是由dns的rc中的`gcr.io/google_containers/skydns:2015-03-11-001`容器`0a0efd5f0aaa`完成的。

skydns的数据源来自于`gcr.io/google_containers/etcd:2.0.9`的容器`0fb60dcfb8b4`。

```
[root@localhost ~]# docker exec -it 0fb etcdctl get /skydns/local/kube/svc/default/mysql-service/2f1020d6
{"host":"10.254.162.44","priority":10,"weight":10,"ttl":30,"targetstrip":0}
[root@localhost ~]# docker exec -it 0fb etcdctl get /skydns/local/kube/default/mysql-service
{"host":"10.254.162.44","priority":10,"weight":10,"ttl":30,"targetstrip":0}
```

## service同步过程

etcd的数据源自于`gcr.io/google_containers/kube2sky:1.11`创建的`cfef318e4032`容器。

`cfef318e4032`容器通过watch kube-api的service，查看service的变化。

当service创建/删除/修改时，`cfef318e4032`容器获取对应的service信息，将其保存在etcd的容器`0fb60dcfb8b4`中，进而提供给skydns使用。