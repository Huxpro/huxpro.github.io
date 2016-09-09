---
layout:     post
title:      "Facebook开源的基于SQL的操作系统检测和监控框架:osquery daemon详解"
subtitle:   "Analysis of osquery daemon"
date:       2016-06-29 8:00:00
author:     "XuXinkun"
header-img: "img/post-bg-osquery-daemon.jpg"
tags:
    - monitor
    - osquery
---


# osqueryd

osqueryd(osquery daemon)是可以定期执行SQL查询和记录系统状态改变的驻守程序。
osqueryd能够根据配置手机归档查询结果，并产生日志。
同时也可以使用系统事件的API来记录文件、文件夹的变化，硬件事件，网络事件等等。

osqueryd启动默认读取`/var/osquery/osqueryd.conf`配置文件。
当然也可以使用`osqueryd --config_path`来指定启动时使用的配置文件。

# 日志

osqueryd可以以日志的方式，记录下其工作，及执行结果。日志保存在/var/log/osquery中。

/var/log/osquery中主要有两种日志：

- osqueryd.INFO/osqueryd.WARNING:主要记录了osqueryd运行时的一些日志。
- osqueryd.results.log/osqueryd.snapshots.log:主要记录了osqueryd定期执行的查询的结果。

执行结果可以看到有results和snapshots之分。

日志的结果可以使用logstash之类的工具，通过监控对应的文件实现[收集](https://osquery.readthedocs.io/en/stable/deployment/log-aggregation/)。

## results

results是不仅仅执行SQL查询，同时会保存执行的结果。在下次执行时，会进行比较。
如果结果改变，则会在osqueryd.results.log中生成一条新增的记录。如果没有改变，则不生成。

```
{
	"name": "proc_num",
	"hostIdentifier": "localhost.localdomain",
	"calendarTime": "Fri Jul  1 03:14:31 2016 UTC",
	"unixTime": "1467342871",
	"decorations": {
		"aluptime": "413315",
		"host_uuid": "faa346a2-1b63-4279-a478-d53811043d77",
		"inuptime": "413284",
		"seconds": "413150",
		"username": ""
	},
	"columns": {
		"num_proc": "113"
	},
	"action": "added"
}
```

生成新的数据记录的同时会移除先前的数据记录，并生成一条`"action":"removed"`的记录(也可以选择不记录。可以在schedule里配置)。

从记录里可以看到，除了action，记录里还有几部分。

- name: schedule的名字，来自于schedule中的配置(下文详述)
- hostIdentifier: host的id，可以在options中配置(下文详述)
- calendarTime: 执行命令发生的时间
- unixTime: 执行命令发生的unix时间
- decorations: 一些附加的信息，来自于decorators中的配置(下文详述)
- columns: 一个字典来自于schedule的查询结果。key是sql中对应的列，value是查询的结果值。所以这里要求schedule查询的结果最多只能有一行。

## snapshots

snapshots跟result大同小异。区别在于snapshots是对每次查询结果均生成记录。其样例如下:

```
{
	"snapshot": [{
		"num_proc": "112"
	}],
	"action": "snapshot",
	"name": "proc_num",
	"hostIdentifier": "localhost.localdomain",
	"calendarTime": "Thu Jun 30 18:26:40 2016 UTC",
	"unixTime": "1467311200",
	"decorations": {
		"aluptime": "381644",
		"host_uuid": "faa346a2-1b63-4279-a478-d53811043d77",
		"username": ""
	}
}
```

# osqueryd.conf

osqueryd.conf是osqueryd的配置文件，json格式。下面是一个样例。

```
{
  "options": {
    "config_plugin": "filesystem",
    "logger_plugin": "filesystem",
    "logger_path": "/var/log/osquery",
    "log_result_events": "true",
    "schedule_splay_percent": "10",
    "events_expiry": "3600",
    "verbose": "true",
    "worker_threads": "2",
    "enable_monitor": "true"
  },
  "schedule": {
    "system_info": {
      "query": "SELECT hostname, cpu_brand, physical_memory FROM system_info;",
      "interval": 60
    }
  },
  "decorators": {
    "load": [
      "SELECT uuid AS host_uuid FROM system_info;",
      "SELECT user AS username FROM logged_in_users ORDER BY time DESC LIMIT 1;"
    ]
  },
  "packs": {
     "process-monitor": "/etc/osquery/process-monitor.conf"
  }
}
```

可以看到这里包含了options，schedule，decorators，packs几个部分。下面分别来进行介绍。

## options

options里主要包含的是osquery daemon的一些配置。这里主要介绍几个：

- logger_path 日志路径
- worker_threads worker的线程数(并不是越大越好，根据自己任务的多少设定)
- host_identifier 在产生result时候的hostIdentifier

更多配置的含义可以参考[这里](https://osquery.readthedocs.io/en/stable/deployment/configuration/)。

## decorators

decorators主要用于在记录result的时候，添加额外的信息到`decorations`中。
decorator分为三种，load，always，interval。

decorator的查询结果最多只能有一行(可以为空)。

- load: 在配置加载的时候，执行一次，并记录结果，之后在每次decorations添加的是加载时的执行结果
- always: 每次记录result的时候执行，并在decorations中添加执行结果
- interval: 配置是一个字典。只有当匹配中对应的key时，才进行执行，并添加执行结果

如下例:

```
{
  "decorators": {
    "load": [
      "SELECT version FROM osquery_info",
      "SELECT uuid AS host_uuid FROM system_info"
    ],
    "always": [
      "SELECT user AS username FROM logged_in_users WHERE user <> '' ORDER BY time LIMIT 1;"
    ],
    "interval": {
      "3600": [
        "SELECT total_seconds AS uptime FROM uptime;"
      ]
    }
  }
}
```

在加载时获得version和host_uuid。在每次执行时临时获取username。当定时执行的任务时间间隔为3600是，获取uptime。

## schedule

定时执行的任务。该任务会定时去执行SQL查询，并生成result/snapshot记录。其配置样例如下：

```
{
  "schedule": {
    "system_info": {
      "query": "SELECT hostname, cpu_brand, physical_memory FROM system_info;",
      "interval": 60,
      "removed": false,
      #"snapshot":true
    }
  }
}
```

schedule是一个字典。key就是每个schedule的name，value是每个schedule的配置。
比如这个system_info即是schedule的name。

在schedule的配置里

- query: 查询的SQL语句
- interval: 查询间隔
- removed: 是否生成removed的记录
- snapshot: 是否是snapshot类型(默认为result)

可以到这里查看更多关于[schedule配置的信息](https://osquery.readthedocs.io/en/stable/deployment/configuration/#schedule)。

## packs

packs可以看做是一系列schedule的集合。osquery提供了一些[常用的查询](https://osquery.io/docs/packs/)。在配置文件里，可以做如下配置:

```
{
  "packs": {
     "process-monitor": "/etc/osquery/process-monitor.conf"
  }
}
```

packs是一个字典。key是pack的名字，value是pack文件的路径。再来看`/etc/osquery/process-monitor.conf`:

```
{
  "discovery": [
    "select pid from processes where name = 'foobar';",
    "select count(*) from users where username like 'www%';"
  ],
  "queries": {
    "pack_proc_num":{
      "query": "select count(*) as num_proc from processes;",
      "interval": 60,
      "removed": false
    }
  }
}
```

discovery是用于判定是否在该host上执行queries。discovery是一个列表，包含多个SQL查询。多个查询结果直接是or关系。如上例，如果该host上存在一个foobar的进程或者存在以www开头的用户名，则执行queries。这个discovery的判断只在配置加载时做一次判断。如果没有该配置，默认queries会都进行执行。

queries是一个字典。其格式和内容与schedule一致，这里不再重复。