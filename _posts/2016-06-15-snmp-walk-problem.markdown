---
layout:     post
title:      "snmpwalk高延时问题分析"
subtitle:   "Snmpwalk Problem Analysis"
date:       2016-06-15 8:00:00
author:     "XuXinkun"
header-img: "img/post-bg-snmp-problem.jpg"
tags:
    - snmp
---

# 问题出现

有两台物理机，一台是`192.168.1.15`，另一台是`192.168.1.43`。二者的netsnmp版本相同。

使用snmpwalk去访问两台机器，获取tcp重传数(tcpRetransSegs)时，`192.168.1.43`回复时间非常长。多达140s+，但是相同配置的`192.168.1.15`只需要30ms。


```
-bash-4.1# time snmpwalk -v 2C  -c cluster -t 200 -r 0 192.168.1.15 .1.3.6.1.2.1.6.12
TCP-MIB::tcpRetransSegs.0 = Counter32: 2364728

real	0m0.030s
user	0m0.020s
sys	0m0.003s

-bash-4.1# time snmpwalk -v 2C  -c cluster -t 200 -r 0 192.168.1.43 .1.3.6.1.2.1.6.12
TCP-MIB::tcpRetransSegs.0 = Counter32: 3771986491

real	2m27.554s
user	0m0.020s
sys	0m0.003s
```

这个现象非常奇怪，按理说`tcpRetransSegs`是从`/proc/net/snmp`中直接拿数据然后解析，耗时应该非常短。不应该到秒级。
而且在使用`time snmpwalk -v 2C  -c cluster -t 200 -r 0 192.168.1.43 .1.3.6.1.2.1.6.12`进行访问时，是立即返回了`TCP-MIB::tcpRetransSegs.0 = Counter32: 3771986491`的信息，但是接着卡住长达140s+，然后该命令才结束。
说明返回`tcpRetransSegs`的数据并没有消耗多少时间，但是之后未知的流程导致了巨大时间的消耗。


# 问题分析

对比了两台机器，发现二者最大的区别在于`192.168.1.15`上有较少的连接数，大概10+。而`192.168.1.43`上有多达4000+的连接数。

尝试只用`snmpget`来获取`192.168.1.43`上`tcpRetransSegs`的值

```
-bash-4.1#  time snmpget -v 2C  -c cluster -t 200 -r 0 192.168.1.43 .1.3.6.1.2.1.6.12.0
TCP-MIB::tcpRetransSegs.0 = Counter32: 3850778646

real	0m0.025s
user	0m0.023s
sys	0m0.002s
```

可以发现立即返回，而使用`snmpwalk`依然耗时巨大。

# snmpwalk

`snmpwalk`是遍历mib上的某棵子树，包含了至少两个动作，get和getnext。

首先对于oid进行get操作，然后进行getnext，获取返回值和名称(oid)。
然后判断该返回的oid是否还在这个子树上，如果不在了，那么就结束。
如果还在该子树上，则使用返回的oid继续getnext，直到结束。

具体来说，就是`time snmpwalk -v 2C  -c cluster -t 200 -r 0 192.168.1.43 .1.3.6.1.2.1.6.12`命令可以分为以下几部分：

首先对oid`.1.3.6.1.2.1.6.12`进行get。

```sh
-bash-4.1# time snmpget -v 2C  -c cluster -t 200 -r 0 192.168.1.43 .1.3.6.1.2.1.6.12
TCP-MIB::tcpRetransSegs = No Such Instance currently exists at this OID

real	0m0.025s
user	0m0.019s
sys	0m0.001s
```

然后进行getnext

```sh
-bash-4.1# time snmpgetnext -v 2C  -c cluster -t 200 -r 0 192.168.1.43 .1.3.6.1.2.1.6.12
TCP-MIB::tcpRetransSegs.0 = Counter32: 3815361069

real	0m0.025s
user	0m0.022s
sys	0m0.001s
```

因为返回的`tcpRetransSegs.0`在`.1.3.6.1.2.1.6.12`树上，因此继续getnext

```sh
-bash-4.1# time snmpgetnext -v 2C  -c cluster -t 200 -r 0 192.168.1.43 .1.3.6.1.2.1.6.12.0
TCP-MIB::tcpConnState.0.0.0.0.22.0.0.0.0.0 = INTEGER: listen(2)

real	2m20.125s
user	0m0.022s
sys	0m0.002s
```

这次返回的`tcpConnState.0.0.0.0.22.0.0.0.0.0`已经出了`.1.3.6.1.2.1.6.12`树，因此`snmpwalk`结束。
这里也可以看到主要的耗时就是在这一步上了。而这一步耗时的主要原因是获取`tcpConnState`需要将所有的连接遍历一遍。
这也与观察到的`192.168.1.43`上连接数高相吻合。

# 结论

`time snmpwalk -v 2C  -c cluster -t 200 -r 0 192.168.1.43 .1.3.6.1.2.1.6.12`耗时巨大的主要原因是错用了`snmpwalk`。导致去获取`tcpConnState`的数据，从而致使`snmpd`在分析所有的连接时，耗费了巨大的时间和CPU资源。

正确的方法应该是使用`snmpget -v 2C  -c cluster -t 200 -r 0 192.168.1.43 .1.3.6.1.2.1.6.12.0`去获取数据。

这里也有一个教训，就是如果能够准确回去的oid数据，最好使用get，使用getnext会降低其效率。