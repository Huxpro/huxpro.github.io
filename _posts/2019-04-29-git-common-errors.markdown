---
layout:     post
title:      "git常见错误汇总"
subtitle:   "Git -- summary of common errors"
date:       2019-04-29 
author:     "zzw"
header-style: text
catalog:    true
tags:
    - git
---


> 记录一下学习git时经常遇到的报错情况。


## git pull报错Pulling is not possible because you have unmerged files

分析：本地有代码与与主干代码冲突,导致pull失败。

[参考](https://blog.csdn.net/yyx3214/article/details/81261733)


## git push错误failed to push some refs to

分析：在github库中对某个文件进行了在线的编辑，并且没有同步到本地库。

1.粗暴简单的解决方案：如果项目小，可以重新克隆到本地

2.把远程库同步到本地库：` git pull --rebase origin master `,[参考](https://blog.csdn.net/rocling/article/details/82956402)


## fatal: HttpRequestException encountered.

分析：Github 禁用了TLS v1.0 and v1.1，必须更新Windows的git凭证管理器。

解决：进去后点击下载安装 GCMW-1.14.0.exe即可：[https://github.com/Microsoft/Git-Credential-Manager-for-Windows/releases/tag/v1.14.0](https://github.com/Microsoft/Git-Credential-Manager-for-Windows/releases/tag/v1.14.0)

[参考](https://blog.csdn.net/zy20120580223/article/details/79618880)

## fatal：Not a git repository

分析：没有.git文件夹

解决：` git init `
