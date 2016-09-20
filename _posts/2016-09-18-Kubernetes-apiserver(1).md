---
layout:     post
title:      "Kubernetes API Server分析（1）"
subtitle:   "apiserver功能分析"
date:       2016-09-18 00:00:00
author:     "lvjiangzhao"
header-img: "img/tag-bg.jpg"
catalog: true
tags:
    - Kubernetes
    - apiserver
---

# apiserver功能分析
Kubernetes Version: v1.3.0

## 1. apiserver简介
API Server对外提供Kubernetes API，作为Kubernetes系统的入口，封装了核心对象的增删改查操作，以RESTful接口方式提供给外部客户和内部组件调用。它维护的REST对象将持久化到etcd。

## 2. 提供集群管理API接口
- 本地端口。默认为8080，接收HTTP请求，无需认证（Authentication）和授权（Authorization）即可访问apiserver
- 安全端口。默认为6443，接收HTTPS请求，基于Token文件或客户端证书及HTTP Base的认证，基于策略的授权
- kubectl

## 3. 集群内各个功能模块之间数据交互和通信的中心枢纽
- 集群内功能模块通过API Server将信息存入etcd，其他模块通过API Server（get、list、watch）读取这些信息，从而实现模块之间的信息交互
- 本地缓存

![](img/2016-09-18-kube-apiserver/architecture.png)

## 4. 集群安全机制
k8s集群的安全机制比较完备，包括API Server认证、授权、准入控制和保护敏感信息的Secret机制。
### 4.1 Authentication认证
- CA认证：API Server启动参数 --client-ca-file、--tls-cert-file、--tls-private-key-file 分别指向根证书文件、服务端证书文件和私钥文件；客户端参数 certificate-authoritiy、client-certificate、client-key 分别指向根证书文件、客户端证书文件和私钥文件
- Token认证：API Server启动参数 --token-auth-file 指向存储Token的Token文件（包含3列的csv文件，第一列为Token，第二列为用户名，第三列为用户UID）；HTTP请求头中的Authorization域需包含“Bearer SOMETOKEN”字段
- HTTP Base基本认证方式：API Server启动参数 --basic-auth-file 指向存储用户名和密码信息的基本认证文件（包含3列的csv文件，第一列为密码，第二列为用户名，第三列为用户UID）；HTTP请求头中的Authorization域需包含相关认证信息。
- OpenID Connect Tokens
- Service Account Tokens
- Webhook Token Authentication
- Keystone Password：API Server启动参数 --experimental-keystone-url=<AuthURL>，目前仅之前基于用户名和密码的基本认证，不涉及token，社区会加大力度在这方面开发；[blueprint](https://github.com/kubernetes/kubernetes/issues/11626)

### 4.2 Authorization授权
授权流程通过访问策略比较请求上下文的属性（用户名、资源、Namespace），在通过API访问资源之前必须通过访问策略进行校验。访问策略通过API Server启动参数 --authorization-mode指定，目前可以配置的模式有AlwaysDeny、AlwaysAllow（默认）、ABAC、RBAC、Webhook 五种。
- AlwaysDeny：拒绝所有请求
- AlwaysAllow：接收所有请求
- ABAC（Attribute-Based Access Control）：基于属性的访问控制。参数 --authorization-policy-file 指定授权策略文件（每一行都是一个json对象）
  *examples：*
  用户alice可以对所有资源做任何操作：
```json
{"apiVersion": "abac.authorization.kubernetes.io/v1beta1", "kind": "Policy", "spec": {"user": "alice", "namespace": "*", "resource": "*", "apiGroup": "*"}}
```
  用户bob可以读取projectCaribou命名空间中的所有pod：
```json
{"apiVersion": "abac.authorization.kubernetes.io/v1beta1", "kind": "Policy", "spec": {"user": "bob", "namespace": "projectCaribou", "resource": "pods", "readonly": true}}
```

- RBAC（Role-Based Access Control）：基于角色的访问控制。“As of 1.3 RBAC mode is in alpha and considered experimental.“
- Webhook：When specified, mode Webhook causes Kubernetes to query an outside REST service when determining user privileges.

### 4.3 Admission Control准入控制
Admission Controll 插件用于过滤所有经过认证和授权后的访问API Server的请求，通过参数 --admission-control 指定。
- AlwaysAdmit：允许所有请求通过
- AlwaysDeny：拒绝所有请求，一般用于测试
- DenyExecOnPrivileged：拦截所有带有SecurityContext属性的Pod请求，拒绝在一个特权容器中执行命令
- ServiceAccount：配合Service Account Controller使用，为设定了Service Account的Pod自动管理Secret，使得Pod能够使用相应的Secret下载镜像和访问API Server
- SecurityContextDeny：不允许带有SecurityContext属性的Pod存在，SecurityContext属性用于创建特权容器
- ResourceQuota：在Namespace中做资源配额限制
- LimitRanger：限制Namespace中的Pod和Container的CPU和内存配额
- NamespaceExists：读取请求中的Namespace属性，如果该Namespace不存在，则拒绝该请求
- NamespaceLifecycle：该插件限制访问处于终止状态的Namespace，禁止在该Namespace中创建新的内容。

### 4.4 Secret私密凭据
Secret用于保管私密数据，如密码、OAuth Tokens、SSH Keys等。

*三种Secret type：*
- Opaque
- kubernetes.io/service-account-token
- kubernetes.io/dockerconfigjson

```yaml
kind: Secret
apiVersion: v1
metadata:
  name: mysecret
type: Opaque
data:
  password: MWYyZDFlMmU2N2Rm
  username: YWRtaW4=
```

```yaml
kind: Secret
apiVersion: v1
metadata:
  name: mysecretname
  annotations: { kubernetes.io/service-account.name: myserviceaccount }
type: kubernetes.io/service-account-token
```

```yaml
kind: Secret
apiVersion: v1
metadata:
  name: myregistrykey
  namespace: awesomeapps
data:
  .dockerconfigjson: UmVhbGx5IHJlYWxseSByZWVlZWVlZWVlZWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGx5eXl5eXl5eXl5eXl5eXl5eXl5eSBsbGxsbGxsbGxsbGxsbG9vb29vb29vb29vb29vb29vb29vb29vb29vb25ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubmdnZ2dnZ2dnZ2dnZ2dnZ2dnZ2cgYXV0aCBrZXlzCg==
type: kubernetes.io/dockerconfigjson
```

*Secret的使用：*
- 在创建Pod时，通过为Pod指定Service Account来自动使用该Secret
- 通过挂载该Secret到Pod来使用
- 在创建Pod时，指定Pod的spec.ImagePullSecret来引用
- 创建Pod时，作为环境变量引用

### 4.5 Service Account
> A service account provides an identity for processes that run in a Pod.

Service Account是相对User account的概念。区别如下：
- User account是对用户/管理员而言，而Service Account是对运行在Pod中的进程而言的；
- User account是全局的，而Service Account是在namespace中的；
- 新增User Account通常需要复杂的业务流程，而新增Service Account是比较简单的，允许k8s集群的用户创建Service Account来完成特定的任务。

一个Service Account下面可以有多个Secret。Secret种类如4.4节所述。在创建Pod时指定 spec.serviceAccount为相应的Service Account，Pod（Container）使用该Service Account来访问API Server。
