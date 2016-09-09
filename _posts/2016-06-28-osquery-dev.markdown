---
layout:     post
title:      "Facebook开源的基于SQL的操作系统检测和监控框架:osquery Table源码分析"
subtitle:   "Analysis of Osquery Table "
date:       2016-06-27 8:00:00
author:     "XuXinkun"
header-img: "img/post-bg-osquery-dev.jpg"
tags:
    - monitor
    - osquery
---

# 写在前面

上一篇介绍了osquery的一些用法，即如何使用SQL语句查询系统信息。本文就来介绍下这个table是如何定义的，及table中的数据是如何取得的。
本文以uptime和process两张表为例。本文介绍的osquery版本是[1.7.6](https://github.com/facebook/osquery/blob/1.7.6)。

# uptime

uptime主要用来获取系统的启动时间:

```
osquery> select * from uptime;
+------+-------+---------+---------+---------------+
| days | hours | minutes | seconds | total_seconds |
+------+-------+---------+---------+---------------+
| 1    | 23    | 19      | 53      | 170393        |
+------+-------+---------+---------+---------------+
```

uptime表中的这条数据是如何获取的呢？
一般来说，对于table的描述分为两部分。一部分是spec，一部分是impl。

- spec用于说明表的名称、结构以及对应实现的方法，其代码主要在[/specs](https://github.com/facebook/osquery/tree/1.7.6/specs)中。
- impl则是表的具体实现，其代码主要在[/osquery/tables](https://github.com/facebook/osquery/blob/1.7.6/osquery/tables/)中。

## Spec

首先来看[uptime.table](https://github.com/facebook/osquery/blob/1.7.6/specs/uptime.table)

```
table_name("uptime")
description("Track time passed since last boot.")
schema([
    Column("days", INTEGER, "Days of uptime"),
    Column("hours", INTEGER, "Hours of uptime"),
    Column("minutes", INTEGER, "Minutes of uptime"),
    Column("seconds", INTEGER, "Seconds of uptime"),
    Column("total_seconds", BIGINT, "Total uptime seconds"),
])
implementation("system/uptime@genUptime")
```

可以看到uptime表有5列，分别是days，hours，minutes，seconds，total_seconds。

其实现的代码是`system/uptime`中的`genUptime`函数。

## Impl

那么直接来看具体实现[uptime.cpp](https://github.com/facebook/osquery/blob/1.7.6/osquery/tables/system/uptime.cpp)。

```
QueryData genUptime(QueryContext& context) {
  Row r;
  QueryData results;
  long uptime_in_seconds = getUptime(); //获取启动的时间(根据不同的系统，有不同的方法获取)

  if (uptime_in_seconds >= 0) {
    r["days"] = INTEGER(uptime_in_seconds / 60 / 60 / 24);
    r["hours"] = INTEGER((uptime_in_seconds / 60 / 60) % 24);
    r["minutes"] = INTEGER((uptime_in_seconds / 60) % 60);
    r["seconds"] = INTEGER(uptime_in_seconds % 60);
    r["total_seconds"] = BIGINT(uptime_in_seconds);
    results.push_back(r);
  }

  return results;
}
```

- `Row r`是一行数据，其对应于SQL查询结果的一行，包含有该表的每一列。
- `QueryData results`是SQL查询返回的所有查询结果的集合，可以包含若干行。

可以看到该函数是首先获取启动时间，然后在行`Row r`中对应的字段填入相应的数据。
之后将结果通过`results.push_back(r);`填入到返回数据中，然后最终返回查询的结果。

因为uptime表只是获取对应的时间，所以只有一行。这里`genUptime`也就对应只填写了一行进行返回。

`uptime`是一个比较简单的表，下面对一个更为复杂的表`processes`进行分析。

# Process

processes表相对来说，就复杂一些，其提供了正在running的进程的相关信息。

## spec

首先来看[processes.table](https://github.com/facebook/osquery/blob/1.7.6/specs/processes.table)，
可以看到该表包含了很多列。这里就不一一介绍了。

```
table_name("processes")
description("All running processes on the host system.")
schema([
    Column("pid", BIGINT, "Process (or thread) ID", index=True),
    Column("name", TEXT, "The process path or shorthand argv[0]"),
    Column("path", TEXT, "Path to executed binary"),
    Column("cmdline", TEXT, "Complete argv"),
    Column("state", TEXT, "Process state"),
    Column("cwd", TEXT, "Process current working directory"),
    Column("root", TEXT, "Process virtual root directory"),
    Column("uid", BIGINT, "Unsigned user ID"),
    Column("gid", BIGINT, "Unsigned group ID"),
    Column("euid", BIGINT, "Unsigned effective user ID"),
    Column("egid", BIGINT, "Unsigned effective group ID"),
    Column("suid", BIGINT, "Unsigned saved user ID"),
    Column("sgid", BIGINT, "Unsigned saved group ID"),
    Column("on_disk", INTEGER,
        "The process path exists yes=1, no=0, unknown=-1"),
    Column("wired_size", BIGINT, "Bytes of unpagable memory used by process"),
    Column("resident_size", BIGINT, "Bytes of private memory used by process"),
    Column("phys_footprint", BIGINT, "Bytes of total physical memory used"),
    Column("user_time", BIGINT, "CPU time spent in user space"),
    Column("system_time", BIGINT, "CPU time spent in kernel space"),
    Column("start_time", BIGINT,
        "Process start in seconds since boot (non-sleeping)"),
    Column("parent", BIGINT, "Process parent's PID"),
    Column("pgroup", BIGINT, "Process group"),
    Column("nice", INTEGER, "Process nice level (-20 to 20, default 0)"),
])
implementation("system/processes@genProcesses")
examples([
  "select * from processes where pid = 1",
])
```

可以看到起其实现是`processes`中的`genProcesses`函数。

## Impl

`processes`中的`genProcesses`函数为不同系统提供了不同的实现。本文主要是从[linux/processes.cpp](https://github.com/facebook/osquery/blob/1.7.6/osquery/tables/system/linux/processes.cpp)来做分析。

首先看实现函数`genProcesses`：

```
QueryData genProcesses(QueryContext& context) {
  QueryData results;

  auto pidlist = getProcList(context);
  for (const auto& pid : pidlist) {
    genProcess(pid, results);
  }

  return results;
}
```

可以看到该函数主要有两部分。

1. 根据context获取pid列表
2. 根据pid列表依次获取每个pid的信息

### 获取pid列表

`getProcList`函数主要是根据context获取pid列表。

```
std::set<std::string> getProcList(const QueryContext& context) {
  std::set<std::string> pidlist;
  if (context.constraints.count("pid") > 0 &&
      context.constraints.at("pid").exists(EQUALS)) {
    for (const auto& pid : context.constraints.at("pid").getAll(EQUALS)) {
      if (isDirectory("/proc/" + pid)) {
        pidlist.insert(pid);
      }
    }
  } else {
    osquery::procProcesses(pidlist);
  }

  return pidlist;
}
```

从代码里可以看到，这里可以根据查询条件进行筛选。如果查询条件里面有`where pid=xxxx`的时候，即符合了
`if (context.constraints.count("pid") > 0 && context.constraints.at("pid").exists(EQUALS))`的条件，因此只需要将该pid加入到pidList中。
这一步的好处在于如果有`where pid=xxxx`的条件，就不需要检索所有的pid，只需要去获取特定的pid信息就可以了。
如果没有这种限制条件，则去获取所有的pid。获取的方法是`procProcesses`函数:

```
const std::string kLinuxProcPath = "/proc";
Status procProcesses(std::set<std::string>& processes) {
  // Iterate over each process-like directory in proc.
  boost::filesystem::directory_iterator it(kLinuxProcPath), end;
  try {
    for (; it != end; ++it) {
      if (boost::filesystem::is_directory(it->status())) {
        // See #792: std::regex is incomplete until GCC 4.9
        if (std::atoll(it->path().leaf().string().c_str()) > 0) {
          processes.insert(it->path().leaf().string());
        }
      }
    }
  } catch (const boost::filesystem::filesystem_error& e) {
    VLOG(1) << "Exception iterating Linux processes " << e.what();
    return Status(1, e.what());
  }

  return Status(0, "OK");
}
```

可以看到，获取所有的pid就是遍历`/proc`下的所有文件夹，判断文件夹是不是纯数字，如果是，则加入到`processes`集合里。

### 获取process的信息

有了pidList，接下来就是根据pidList，依次获取每个pid的信息。

```
void genProcess(const std::string& pid, QueryData& results) {
  // Parse the process stat and status.
  auto proc_stat = getProcStat(pid);

  Row r;
  r["pid"] = pid;
  r["parent"] = proc_stat.parent;
  r["path"] = readProcLink("exe", pid);
  r["name"] = proc_stat.name;
  r["pgroup"] = proc_stat.group;
  r["state"] = proc_stat.state;
  r["nice"] = proc_stat.nice;
  // Read/parse cmdline arguments.
  r["cmdline"] = readProcCMDLine(pid);
  r["cwd"] = readProcLink("cwd", pid);
  r["root"] = readProcLink("root", pid);
  r["uid"] = proc_stat.real_uid;
  r["euid"] = proc_stat.effective_uid;
  r["suid"] = proc_stat.saved_uid;
  r["gid"] = proc_stat.real_gid;
  r["egid"] = proc_stat.effective_gid;
  r["sgid"] = proc_stat.saved_gid;

  // If the path of the executable that started the process is available and
  // the path exists on disk, set on_disk to 1. If the path is not
  // available, set on_disk to -1. If, and only if, the path of the
  // executable is available and the file does NOT exist on disk, set on_disk
  // to 0.
  r["on_disk"] = osquery::pathExists(r["path"]).toString();

  // size/memory information
  r["wired_size"] = "0"; // No support for unpagable counters in linux.
  r["resident_size"] = proc_stat.resident_size;
  r["phys_footprint"] = proc_stat.phys_footprint;

  // time information
  r["user_time"] = proc_stat.user_time;
  r["system_time"] = proc_stat.system_time;
  r["start_time"] = proc_stat.start_time;

  results.push_back(r);
}
```

可以看到首先是用[getProcStat函数](https://github.com/facebook/osquery/blob/1.7.6/osquery/tables/system/linux/processes.cpp#L174)获取pid的信息。
这里`getProcStat`函数就不展开分析了，其主要就是读取`/proc/<pid>/stat`文件，然后将对应的字段获取出来。

然后`genProcess`函数将从`getProcStat`获取到的信息，填入到行`r`中的对应列，最后将行`r`加到返回的结果集中。

# Creating Tables

如果想要添加一个新的table，可以参考[creating-tables](https://osquery.readthedocs.io/en/stable/development/creating-tables/)

## 环境搭建

添加新的table需要搭建osquery的编译环境。centos6下好像会有问题。最好使用centos7。

```
yum install -y make gcc git cmake python-argparse bzip2 bzip2-devel openssl-devel tar doxygen sudo
git clone http://github.com/facebook/osquery.git --recursive
cd osquery
sudo make deps
make
```
