---
layout:     post
title:      "kubernetes入门之kube-proxy实现原理"
subtitle:   "kube-proxy of kubernetes."
date:       2016-07-22 8:00:00
author:     "XuXinkun"
header-img: "img/post-bg-kubernetes-proxy.jpg"
tags:
    - kubernetes
---


# kube-proxy 

service是一组pod的服务抽象，相当于一组pod的LB，负责将请求分发给对应的pod。service会为这个LB提供一个IP，一般称为cluster IP。
kube-proxy的作用主要是负责service的实现，具体来说，就是实现了内部从pod到service和外部的从node port向service的访问。

举个例子，现在有podA，podB，podC和serviceAB。serviceAB是podA，podB的服务抽象(service)。
那么kube-proxy的作用就是可以将pod(不管是podA，podB或者podC)向serviceAB的请求，进行转发到service所代表的一个具体pod(podA或者podB)上。
请求的分配方法一般分配是采用轮询方法进行分配。

另外，kubernetes还提供了一种在node节点上暴露一个端口，从而提供从外部访问service的方式。

比如我们使用这样的一个manifest来创建service

```yaml
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
      nodePort: 30964
  type: NodePort
  selector:
    mysql-service: "true"
```

他的含义是在node上暴露出30964端口。当访问node上的30964端口时，其请求会转发到service对应的cluster IP的3306端口，并进一步转发到pod的3306端口。

kuer-proxy目前有userspace和iptables两种实现方式。

userspace是在用户空间，通过kuber-proxy实现LB的代理服务。这个是kube-proxy的最初的版本，较为稳定，但是效率也自然不太高。

另外一种方式是iptables的方式。是纯采用iptables来实现LB。是目前一般kube默认的方式。

# userspace

这里具体举个例子，以ssh-service1为例，kube为其分配了一个clusterIP。分配clusterIP的作用还是如上文所说，是方便pod到service的数据访问。

```sh
[minion@te-yuab6awchg-0-z5nlezoa435h-kube-master-udhqnaxpu5op ~]$ kubectl get service
NAME             LABELS                                    SELECTOR              IP(S)            PORT(S)
kubernetes       component=apiserver,provider=kubernetes   <none>                10.254.0.1       443/TCP
ssh-service1     name=ssh,role=service                     ssh-service=true      10.254.132.107   2222/TCP
```

使用describe可以查看到详细信息。可以看到暴露出来的NodePort端口30239。

```sh
[minion@te-yuab6awchg-0-z5nlezoa435h-kube-master-udhqnaxpu5op ~]$ kubectl describe service ssh-service1 
Name:			ssh-service1
Namespace:		default
Labels:			name=ssh,role=service
Selector:		ssh-service=true
Type:			LoadBalancer
IP:			10.254.132.107
Port:			<unnamed>	2222/TCP
NodePort:		<unnamed>	30239/TCP
Endpoints:		<none>
Session Affinity:	None
No events.
```

nodePort的工作原理与clusterIP大致相同，是发送到node上指定端口的数据，通过iptables重定向到kube-proxy对应的端口上。然后由kube-proxy进一步把数据发送到其中的一个pod上。

> 该node的ip为10.0.0.5

```sh
[minion@te-yuab6awchg-0-z5nlezoa435h-kube-master-udhqnaxpu5op ~]$ sudo iptables -S -t nat
...
-A KUBE-NODEPORT-CONTAINER -p tcp -m comment --comment "default/ssh-service1:" -m tcp --dport 30239 -j REDIRECT --to-ports 36463
-A KUBE-NODEPORT-HOST -p tcp -m comment --comment "default/ssh-service1:" -m tcp --dport 30239 -j DNAT --to-destination 10.0.0.5:36463
-A KUBE-PORTALS-CONTAINER -d 10.254.132.107/32 -p tcp -m comment --comment "default/ssh-service1:" -m tcp --dport 2222 -j REDIRECT --to-ports 36463
-A KUBE-PORTALS-HOST -d 10.254.132.107/32 -p tcp -m comment --comment "default/ssh-service1:" -m tcp --dport 2222 -j DNAT --to-destination 10.0.0.5:36463
```

可以看到访问node时候的30239端口会被转发到node上的36463端口。而且在访问clusterIP 10.254.132.107的2222端口时，也会把请求转发到本地的36463端口。
36463端口实际被kube-proxy所监听，将流量进行导向到后端的pod上。

# iptables

iptables的方式则是利用了linux的iptables的nat转发进行实现。在本例中，创建了名为mysql-service的service。

```yaml
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
      nodePort: 30964
  type: NodePort
  selector:
    mysql-service: "true"
```

mysql-service对应的nodePort暴露出来的端口为30964，对应的cluster IP(10.254.162.44)的端口为3306，进一步对应于后端的pod的端口为3306。

mysql-service后端代理了两个pod，ip分别是192.168.125.129和192.168.125.131。先来看一下iptables。

```bash
[root@localhost ~]# iptables -S -t nat
...
-A PREROUTING -m comment --comment "kubernetes service portals" -j KUBE-SERVICES
-A OUTPUT -m comment --comment "kubernetes service portals" -j KUBE-SERVICES
-A POSTROUTING -m comment --comment "kubernetes postrouting rules" -j KUBE-POSTROUTING
-A KUBE-MARK-MASQ -j MARK --set-xmark 0x4000/0x4000
-A KUBE-NODEPORTS -p tcp -m comment --comment "default/mysql-service:" -m tcp --dport 30964 -j KUBE-MARK-MASQ
-A KUBE-NODEPORTS -p tcp -m comment --comment "default/mysql-service:" -m tcp --dport 30964 -j KUBE-SVC-67RL4FN6JRUPOJYM
-A KUBE-SEP-ID6YWIT3F6WNZ47P -s 192.168.125.129/32 -m comment --comment "default/mysql-service:" -j KUBE-MARK-MASQ
-A KUBE-SEP-ID6YWIT3F6WNZ47P -p tcp -m comment --comment "default/mysql-service:" -m tcp -j DNAT --to-destination 192.168.125.129:3306
-A KUBE-SEP-IN2YML2VIFH5RO2T -s 192.168.125.131/32 -m comment --comment "default/mysql-service:" -j KUBE-MARK-MASQ
-A KUBE-SEP-IN2YML2VIFH5RO2T -p tcp -m comment --comment "default/mysql-service:" -m tcp -j DNAT --to-destination 192.168.125.131:3306
-A KUBE-SERVICES -d 10.254.162.44/32 -p tcp -m comment --comment "default/mysql-service: cluster IP" -m tcp --dport 3306 -j KUBE-SVC-67RL4FN6JRUPOJYM
-A KUBE-SERVICES -m comment --comment "kubernetes service nodeports; NOTE: this must be the last rule in this chain" -m addrtype --dst-type LOCAL -j KUBE-NODEPORTS
-A KUBE-SVC-67RL4FN6JRUPOJYM -m comment --comment "default/mysql-service:" -m statistic --mode random --probability 0.50000000000 -j KUBE-SEP-ID6YWIT3F6WNZ47P
-A KUBE-SVC-67RL4FN6JRUPOJYM -m comment --comment "default/mysql-service:" -j KUBE-SEP-IN2YML2VIFH5RO2T
```

下面来逐条分析

首先如果是通过node的30964端口访问，则会进入到以下链

```sh
-A KUBE-NODEPORTS -p tcp -m comment --comment "default/mysql-service:" -m tcp --dport 30964 -j KUBE-MARK-MASQ
-A KUBE-NODEPORTS -p tcp -m comment --comment "default/mysql-service:" -m tcp --dport 30964 -j KUBE-SVC-67RL4FN6JRUPOJYM
```

然后进一步跳转到KUBE-SVC-67RL4FN6JRUPOJYM的链

```sh
-A KUBE-SVC-67RL4FN6JRUPOJYM -m comment --comment "default/mysql-service:" -m statistic --mode random --probability 0.50000000000 -j KUBE-SEP-ID6YWIT3F6WNZ47P
-A KUBE-SVC-67RL4FN6JRUPOJYM -m comment --comment "default/mysql-service:" -j KUBE-SEP-IN2YML2VIFH5RO2T
```

这里利用了iptables的--probability的特性，使连接有50%的概率进入到KUBE-SEP-ID6YWIT3F6WNZ47P链，50%的概率进入到KUBE-SEP-IN2YML2VIFH5RO2T链。

KUBE-SEP-ID6YWIT3F6WNZ47P的链的具体作用就是将请求通过DNAT发送到192.168.125.129的3306端口。

```sh
-A KUBE-SEP-ID6YWIT3F6WNZ47P -s 192.168.125.129/32 -m comment --comment "default/mysql-service:" -j KUBE-MARK-MASQ
-A KUBE-SEP-ID6YWIT3F6WNZ47P -p tcp -m comment --comment "default/mysql-service:" -m tcp -j DNAT --to-destination 192.168.125.129:3306
```

同理KUBE-SEP-IN2YML2VIFH5RO2T的作用是通过DNAT发送到192.168.125.131的3306端口。

```sh
-A KUBE-SEP-IN2YML2VIFH5RO2T -s 192.168.125.131/32 -m comment --comment "default/mysql-service:" -j KUBE-MARK-MASQ
-A KUBE-SEP-IN2YML2VIFH5RO2T -p tcp -m comment --comment "default/mysql-service:" -m tcp -j DNAT --to-destination 192.168.125.131:3306
```

分析完nodePort的工作方式，接下里说一下clusterIP的访问方式。
对于直接访问cluster IP(10.254.162.44)的3306端口会直接跳转到KUBE-SVC-67RL4FN6JRUPOJYM。

```sh
-A KUBE-SERVICES -d 10.254.162.44/32 -p tcp -m comment --comment "default/mysql-service: cluster IP" -m tcp --dport 3306 -j KUBE-SVC-67RL4FN6JRUPOJYM
```

接下来的跳转方式同上文，这里就不再赘述了。