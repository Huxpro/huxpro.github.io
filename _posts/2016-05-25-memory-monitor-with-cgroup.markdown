---
layout:     post
title:      "Docker容器内存监控"
subtitle:   "Memory Monitor for docker container"
date:       2016-05-16 8:00:00
author:     "XuXinkun"
header-img: "img/post-bg-docker-mem-monitor.jpg"
tags:
    - docker
    - cgroup
    - monitor
---

# linux内存监控

要明白docker容器内存是如何计算的，首先要明白linux中内存的相关概念。

使用`free`命令可以查看当前内存使用情况。

```
[root@localhost ~]$ free 
             total       used       free     shared    buffers     cached
Mem:     264420684  213853512   50567172   71822688    2095364  175733516
-/+ buffers/cache:   36024632  228396052
Swap:     16777212    1277964   15499248
```

这里有几个概念:

- mem: 物理内存
- swap: 虚拟内存。即可以把数据存放在硬盘上的数据
- shared: 共享内存。存在在物理内存中。
- buffers: 用于存放要输出到disk（块设备）的数据的
- cached: 存放从disk上读出的数据

可以参考[这里](http://www.cnblogs.com/coldplayerest/archive/2010/02/20/1669949.html)。

为方便说明，我对`free`的结果做了一个对应。

```
[root@localhost ~]$ free 
             total       used       free        shared    buffers   cached
Mem:     total_mem   used_mem    free_mem   shared_mem    buffer     cache
-/+ buffers/cache:  real_used   real_free
Swap:   total_swap  used_swap   free_swap
```

| 名称         | 说明          |
| ---------- | ----------- |
| total_mem  | 物理内存总量      |
| used_mem   | 已使用的物理内存量   |
| free_mem   | 空闲的物理内存量    |
| shared_mem | 共享内存量       |
| buffer     | buffer所占内存量 |
| cache      | cache所占内存量  |
| real_used  | 实际使用的内存量    |
| real_free  | 实际空闲的内存量    |
| total_swap | swap总量      |
| used_swap  | 已使用的swap    |
| free_swap  | 空闲的swap     |

一般认为，buffer和cache是还可以再进行利用的内存，所以在计算空闲内存时，会将其剔除。
因此这里有几个等式:

```
real_used = used_mem - buffer - cache
real_free = free_mem + buffer + cache
total_mem = used_mem + free_mem
```

了解了这些，我们再来看`free`的数据源。其实其数据源是来自于`/proc/memeinfo`文件。

```
[root@localhost ~]$ cat /proc/meminfo 
MemTotal:       264420684 kB
MemFree:        50566436 kB
Buffers:         2095356 kB
Cached:         175732644 kB
SwapCached:       123688 kB
Active:         165515340 kB
Inactive:       37004224 kB
Active(anon):   92066880 kB
Inactive(anon):  4455076 kB
Active(file):   73448460 kB
Inactive(file): 32549148 kB
Unevictable:      362900 kB
Mlocked:           74696 kB
SwapTotal:      16777212 kB
SwapFree:       15499248 kB
Dirty:              2860 kB
Writeback:             0 kB
AnonPages:      24932928 kB
Mapped:         58165040 kB
Shmem:          71822688 kB
Slab:            8374496 kB
SReclaimable:    8163096 kB
SUnreclaim:       211400 kB
KernelStack:       45824 kB
PageTables:       606296 kB
NFS_Unstable:          0 kB
Bounce:                0 kB
WritebackTmp:          0 kB
CommitLimit:    148987552 kB
Committed_AS:   114755628 kB
VmallocTotal:   34359738367 kB
VmallocUsed:      772092 kB
VmallocChunk:   34225428328 kB
HardwareCorrupted:     0 kB
AnonHugePages:  22083584 kB
HugePages_Total:       0
HugePages_Free:        0
HugePages_Rsvd:        0
HugePages_Surp:        0
Hugepagesize:       2048 kB
DirectMap4k:        7168 kB
DirectMap2M:     2015232 kB
DirectMap1G:    266338304 kB

```

# docker

说完linux的内存，我们再来看下docker的内存监控。docker自身提供了一种内存监控的方式，即可以通过`docker stats`对容器内存进行监控。
该方式实际是通过对cgroup中相关数据进行取值从而计算得到。

## cgroup

cgroup中的memory子系统为hierarchy提供了如下文件。

```
[root@localhost ~]$ ll /cgroup/memory/docker/53a11f13c08099dd6d21030dd2ddade54d5cdd7ae7e9e68f5ba055ad28498b6f/
总用量 0
--w--w--w- 1 root root 0 2月  22 12:51 cgroup.event_control
-rw-r--r-- 1 root root 0 5月  25 17:07 cgroup.procs
-rw-r--r-- 1 root root 0 2月  22 12:51 memory.failcnt
--w------- 1 root root 0 2月  22 12:51 memory.force_empty
-rw-r--r-- 1 root root 0 3月  30 17:06 memory.limit_in_bytes
-rw-r--r-- 1 root root 0 2月  22 12:51 memory.max_usage_in_bytes
-rw-r--r-- 1 root root 0 2月  22 12:51 memory.memsw.failcnt
-rw-r--r-- 1 root root 0 3月  30 17:06 memory.memsw.limit_in_bytes
-rw-r--r-- 1 root root 0 2月  22 12:51 memory.memsw.max_usage_in_bytes
-r--r--r-- 1 root root 0 2月  22 12:51 memory.memsw.usage_in_bytes
-rw-r--r-- 1 root root 0 2月  22 12:51 memory.move_charge_at_immigrate
-rw-r--r-- 1 root root 0 2月  22 12:51 memory.oom_control
-rw-r--r-- 1 root root 0 3月  30 17:06 memory.soft_limit_in_bytes
-r--r--r-- 1 root root 0 2月  22 12:51 memory.stat
-rw-r--r-- 1 root root 0 2月  22 12:51 memory.swappiness
-r--r--r-- 1 root root 0 2月  22 12:51 memory.usage_in_bytes
-rw-r--r-- 1 root root 0 2月  22 12:51 memory.use_hierarchy
-rw-r--r-- 1 root root 0 2月  22 12:51 notify_on_release
-rw-r--r-- 1 root root 0 2月  22 12:51 tasks
```

这些文件的具体含义可以查看相关资料[cgroup memory](https://access.redhat.com/documentation/en-US/Red_Hat_Enterprise_Linux/6/html/Resource_Management_Guide/sec-memory.html)。
这里主要介绍几个与docker监控相关的。

| 文件名                         | 说明                          |
| --------------------------- | --------------------------- |
| memory.usage_in_bytes       | 已使用的内存量(包含cache和buffer)(字节)，相当于linux的used_meme|
| memory.limit_in_bytes       | 限制的内存总量(字节)，相当于linux的total_mem |
| memory.failcnt              | 申请内存失败次数计数                  |
| memory.memsw.usage_in_bytes | 已使用的内存和swap(字节)             |
| memory.memsw.limit_in_bytes | 限制的内存和swap容量(字节)            |
| memory.memsw.failcnt        | 申请内存和swap失败次数计数             |
| memory.stat                 | 内存相关状态                      |

以下为一个容器的样例。

```
[root@localhost 53a11f13c08099dd6d21030dd2ddade54d5cdd7ae7e9e68f5ba055ad28498b6f]$ cat memory.usage_in_bytes 
135021858816

[root@localhost 53a11f13c08099dd6d21030dd2ddade54d5cdd7ae7e9e68f5ba055ad28498b6f]$ cat memory.memsw.usage_in_bytes 
135679291392

[root@localhost 53a11f13c08099dd6d21030dd2ddade54d5cdd7ae7e9e68f5ba055ad28498b6f]$ cat memory.stat 
cache 134325506048
rss 695980032
mapped_file 16155119616
pgpgin 21654116032
pgpgout 21705492352
swap 655171584
inactive_anon 4218880
active_anon 74202603520
inactive_file 8365199360
active_file 52449439744
unevictable 0
hierarchical_memory_limit 137438953472
hierarchical_memsw_limit 274877906944
total_cache 134325506048
total_rss 695980032
total_mapped_file 16155119616
total_pgpgin 21654116032
total_pgpgout 21705492352
total_swap 655171584
total_inactive_anon 4218880
total_active_anon 74202603520
total_inactive_file 8365199360
total_active_file 52449439744
total_unevictable 0
```



## memory.stat

memory.stat包含有最丰富的

| 统计                        | 描述                                       |
| ------------------------- | ---------------------------------------- |
| cache                     | 页缓存，包括 tmpfs（shmem），单位为字节                |
| rss                       | 匿名和 swap 缓存，不包括 tmpfs（shmem），单位为字节       |
| mapped_file               | memory-mapped 映射的文件大小，包括 tmpfs（shmem），单位为字节 |
| pgpgin                    | 存入内存中的页数                                 |
| pgpgout                   | 从内存中读出的页数                                |
| swap                      | swap 用量，单位为字节                            |
| active_anon               | 在活跃的最近最少使用（least-recently-used，LRU）列表中的匿名和 swap 缓存，包括 tmpfs（shmem），单位为字节 |
| inactive_anon             | 不活跃的 LRU 列表中的匿名和 swap 缓存，包括 tmpfs（shmem），单位为字节 |
| active_file               | 活跃 LRU 列表中的 file-backed 内存，以字节为单位        |
| inactive_file             | 不活跃 LRU 列表中的 file-backed 内存，以字节为单位       |
| unevictable               | 无法再生的内存，以字节为单位                           |
| hierarchical_memory_limit | 包含 memory cgroup 的层级的内存限制，单位为字节          |
| hierarchical_memsw_limit  | 包含 memory cgroup 的层级的内存加 swap 限制，单位为字节   |


active_anon + inactive_anon = anonymous memory + file cache for tmpfs + swap cache

active_file + inactive_file = cache - size of tmpfs

## docker原生内存监控

再来说到docker原生的`docker stats`。其具体实现在[libcontainer](https://github.com/opencontainers/runc/blob/v0.1.1/libcontainer/cgroups/fs/memory.go#L148)中可以看到。其将容器的内存监控分为`cache`,`usage`,`swap usage`,`kernel usage`,`kernel tcp usage`。

其中`cache`是从`memory.stat`中的`cache`中获取。

`usage`是使用`memory.usage_in_bytes`和`memory.limit_in_bytes`进行相除来计算使用率。这一方式有一个弊端，就是不够细化，没有区分出cache部分，不能真正反映内存使用率。因为一般来说cache是可以复用的内存部分，因此一般将其计入到可使用的部分。

## 可以考虑的改进计算方式

改进方式在统计内存使用量时将`cache`计算排除出去。类似于linux中计算`real_used`时将`buffer`和`cache`排除一样。

cache并不能直接应用`memory.stat`中的`cache`，因为其中包括了`tmpfs`，而`tmpfs`算是实际使用的内存部分。

> tmpfs即share memory，共享内存

因为在`memory.stat`中存在有

```
active_file + inactive_file = cache - size of tmpfs
```

因此可以计算实际使用的内存量为

```
real_used = memory.usage_in_bytes - (rss + active_file + inactive_file)
```