---
layout:     post
title:      "Facebook开源的基于SQL的操作系统检测和监控框架:osquery"
subtitle:   "An introduction of osquery"
date:       2016-06-27 8:00:00
author:     "XuXinkun"
header-img: "img/post-bg-intro-osquery.jpg"
tags:
    - monitor
    - osquery
---

# osquery简介

[osquery](https://github.com/facebook/osquery)是一款由facebook开源的，面向OSX和Linux的操作系统检测框架。
osquery顾名思义，就是query os，允许通过使用SQL的方式来获取操作系统的数据。
通过osquery，SQL表可以提供诸如正在运行的进程，已加载的内核模块，已打开的网络连接，硬件事件等等信息。

# 下载与安装

osquery的安装很简单，在[这里](https://osquery.io/downloads/)可以找到对应的下载。本文使用的centos6进行的安装:

```shell
$rpm -ivh https://osquery-packages.s3.amazonaws.com/centos6/noarch/osquery-s3-centos6-repo-1-0.0.noarch.rpm
$yum install osquery
```

# osqueryi 

`osqueryi`命令可以用于进行查询。osquery提供了若干个[table](https://osquery.io/docs/tables/)。用户可以通过sql语句查询对应的系统信息。

比如，列举所有用户的uid,gid和username，使用如下命令：

```
[root@localhost osquery]# osqueryi 
osquery - being built, with love, at Facebook
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Using a virtual database. Need help, type '.help'
osquery>  select uid,gid,username from users;
+-----+-----+----------------+
| uid | gid | username       |
+-----+-----+----------------+
| 0   | 0   | root           |
| 1   | 1   | bin            |
+-----+-----+----------------+
```

借助于SQL语句的灵活性，可以更容易的从数据中筛选出想要的结果。比如查询现有的进程数量:

```
osquery> select count(*) from processes;
+----------+
| count(*) |
+----------+
| 110      |
+----------+
```

又比如，查询在运行状态，即state为R的进程相关信息:

```
osquery> select pid,name,cmdline,state from processes where state='R';
+------+-----------+----------+-------+
| pid  | name      | cmdline  | state |
+------+-----------+----------+-------+
| 4714 | osqueryi  | osqueryi | R     |
| 7    | rcu_sched |          | R     |
+------+-----------+----------+-------+
```

更高级的用法，还可以进行连表查询。比如要显示进程状态为R的进程打开的文件的信息。从`process_open_files`表的信息如下:

|Column|Type|Description|
|---|---|---|
|pid|BIGINT_TYPE|Process (or thread) ID|
|fd	|BIGINT_TYPE|Process-specific file descriptor number|
|path|TEXT_TYPE|Filesystem path of descriptor|

可以看到process_open_files和process有公用的pid列。
因此只要将`process_open_files`表和`processes`表进行联合查找，
查找条件为processes的state为R且processes.pid与process_open_files.pid匹配的对应行的信息:

```
osquery> select processes.pid, processes.name, process_open_files.fd, process_open_files.path,processes.state from process_open_files,processes where process_open_files.pid = processes.pid and processes.state='R';
+------+----------+----+---------------+-------+
| pid  | name     | fd | path          | state |
+------+----------+----+---------------+-------+
| 4791 | osqueryi | 0  | /dev/pts/5    | R     |
| 4791 | osqueryi | 1  | /dev/pts/5    | R     |
| 4791 | osqueryi | 2  | /dev/pts/5    | R     |
| 4791 | osqueryi | 8  | /proc/4791/fd | R     |
+------+----------+----+---------------+-------+
```

还有更高级的功能，比如查询最大的pid:

```
osquery> select max(pid) from processes;
+----------+
| max(pid) |
+----------+
| 7706     |
+----------+
```

比如查询每个进程打开的文件数:

```
osquery> select pid, count(fd) from process_open_files group by pid;
+------+------------+
| pid  | count(pid) |
+------+------------+
| 1    | 10         |
| 456  | 6          |
| 475  | 2          |
+------+------------+
```

还有更多复合的功能，只要是SQL里支持的，osquery都尽力做了支持。这样需要取什么样的数据，可以轻松的使用sql来进行取值。

# 小结

osquery的各种监控指标目前来看，并不是特别完善。但是已经相当够用。而且其能够自行扩展table(需要进行二次开发)。
该项目的主要价值在于可以用SQL的方式灵活获取数据，并发送到后端进行收集(后面的博客再进行介绍)。
SQL的数据模型使得对于一些监控信息进行组合变得更容易。