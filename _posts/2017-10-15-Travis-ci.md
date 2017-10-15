---
layout:     post
title:      "Travis-Ci自动部署"
subtitle:   " \"github上使用travis-ci实现自定部署\""
date:       2017-10-15 17:17:00
author:     "WQ"
header-img: "img/blogImg/rickAndMorty.png"
catalog: true
tags:
    - Travis-ci
    - Github
---

## travis-ci 实现自动化部署

TODO:部署后，启动错误回滚

travis怎么在github上使用不是本文的重点，下面介绍如何自动化部署。

## 生成travis访问vps的ssh key

ssh免密码登录，公匙放到vps上，私匙用于登录，不清楚的朋友自己看下相关的文章。

```bash
ssh-keygen -f travis                    # 生成 travis, travis.pub
cat travis.pub >> ~/.ssh/authorized_keys    # 将公钥添加到服务器
```

1. 在vps上安装ruby,centos使用`yum install ruby-devl`

2. 使用gem安装travis对密匙加密

```
ssh-keygen -f travis                    # 生成 travis, travis.pub
travis.pub >> ~/.ssh/authorized_keys    # 将公钥添加到服务器
```

下面的前提是有`.travis.yml`文件

```
gem install travis
travis login                        # github 帐号和密码，token 我没登录上
travis encrypt-file travis  --add   # 加密 travis 私钥，--add 将解密命令添加到 .travis.yml
```

之后将 vps 上生成的 travis.enc 和 修改过的 .travis.yml 文件复制到本地的项目目录里。提交到github。

可以看下，上面的命令执行后的`.travis.yml`文件

```
before_install:
- openssl aes-256-cbc -K $encrypted_6094e4f462c1_key -iv $encrypted_6094e4f462c1_iv -in .travis/travis.enc -out ~/.ssh/id_rsa -d

```

3. ssh known_hosts

因为 travis-ci 默认只添加了 github.com, gist.github.com 和 ssh.github.com 为 known_hosts，rsync 执行时会提示是否添加，但是 travis-ci 里不能输入确认，所以需要将自动服务器的域名和商品添加到 known_hosts

```
addons:
  ssh_known_hosts: uedsky.com:1223
```

4. 执行脚本

```
after_success:
  - ssh your-user@your-ip "./your-shell-script"
```

目前完整的`.travis.yml`文件如下

```yaml
language: java
jdk:
  - oraclejdk8
before_install:
- openssl aes-256-cbc -K $encrypted_66bfa865dee4_key -iv $encrypted_66bfa865dee4_iv
  -in travis.enc -out ~/.ssh/id_rsa -d
- chmod 600 ~/.ssh/id_rsa
addons:
  ssh_known_hosts: 45.76.205.80
after_success:
  - scp ./target/*.jar  root@45.76.205.80:~
  - ssh root@45.76.205.80 "bash" < ./deploy.sh
```

上面scp用于将生成的jar放到vps上

看下`deploy.sh`
```bash
#!/bin/bash
#cd /path/to/your-project
# git pull origin master

cd /usr/java/
if [ ! -d "./core_proj_bak" ]; then
  mkdir core_proj_bak
fi
# 备份文件
temp=$(date +%Y-%m-%d-%H-%M-%S)
filetemp=*.jar
mv $filetemp core_proj_bak/$temp.jar

mv ~/*.jar /usr/java/core-blog.jar

# 重启

varNum=$(ps x | grep core | grep 'java' | awk '{print $1}')

#echo "varNum='$varNum'"
##
if [ -n $varNum ]
then 	
  kill -9 $varNum
fi
##
echo 'kill core success'
# 删除日志文件
if [ -d "/usr/java/core.blog" ]; then
  rm -rf /usr/java/core.blog
fi

nohup java -jar /usr/java/core-blog.jar > core.blog &
echo 'start core success'
echo 'travis build done!'
```