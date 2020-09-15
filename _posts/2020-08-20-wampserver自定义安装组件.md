# 在wampserver上自定义安装组件

[TOC]

## 安装php

#### 1.将php包解压到\bin\php目录下

#### 2.进入php目录,配置php.ini

从 php.ini-dist 或者 php.ini-recommended 复制一份，重命名为**php.ini**，适应修改php.ini配置（如extension_dir），再从php.ini复制一份，重命名为 **phpForApache.ini**。

#### 3.配置wampserver.conf

从已有的版本目录中复制一份**wampserver.conf**到该目录

#### 4.修改wampmanager.ini

定位到**[phpVersion]**项,复制一行PHP配置,修改相应的版本号和目录

复制一段**[switchPhp]**,修改相应的版本号和目录

#### 5.重启wampserver

## 安装mysql

#### 1.将mysql文件夹放在 \bin\mysql  目录下

把原始mysql版本目录下的my.ini和wampserver.conf 文件拷贝到mysql目录中，并更改my.ini文件中的配置路径信息

```ini
basedir="D:/wamp64/bin/mysql/mysql8.0.18"
datadir="D:/wamp64/bin/mysql/mysql8.0.18/data"
lc-messages-dir="D:/wamp64/bin/mysql/mysql8.0.18/share"
```

#### 2.初始化Mysql

在mysql文件夹下bin目录下执行

```bash
mysqld --initialize --console
```

初始化完成之后，会生成一个**临时密码**

#### 3.安装mysql(一定要用超级管理员身份运行，不然会报错：Install/Remove of the Service Denied!）

```bash
mysqld -install
```

#### 4.验证是否安装成功,使用刚刚生成的临时密码

```bash
mysql -u root -p
```

#### 5.更改临时密码

```mysql
alter user 'root'@'localhost' identified by 'password';
flush privileges;
```

#### 6.常见报错

1.**Server sent charset (255) unknown to the client**

> 修改my.ini
>
> ```ini
> [client]
> default-character-set=utf8
> 
> [mysql]
> default-character-set=utf8
> 
> 
> [mysqld]
> collation-server = utf8_unicode_ci
> character-set-server = utf8
> ```
>
> 

