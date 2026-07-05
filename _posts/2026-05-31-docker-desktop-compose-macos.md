---
layout: post
title: "安装 Docker Desktop 与 Docker Compose"
subtitle: "理解镜像、容器、卷和 Compose，给本地全栈项目准备可复现运行环境"
date: 2026-05-31 10:20:00 +0800
author: "CodeWater517"
header-img: "img/home-bg-geek.jpg"
header-mask: 0.35
tags:
  - macOS
  - Docker
  - Docker Compose
  - 环境配置
  - 开发工具
last_modified_at: 2026-05-31 10:20:00 +0800
revision_history:
  - time: 2026-05-31 10:20:00 +0800
    description: "新增 Docker Desktop 与 Docker Compose 安装教程。"
---

> Docker 不是为了显得高级，而是为了让“我电脑能跑”的环境变成“别人电脑也能跑”。这篇先把 Docker Desktop 和 Compose 装好，并理解最小概念。

## 结论

推荐路线：

```text
安装 Docker Desktop
-> 启动 Docker Desktop
-> 验证 docker 和 docker compose
-> 运行 hello-world
-> 运行 nginx 容器
-> 理解镜像、容器、端口、卷
```

macOS 上 Docker 需要一个 Linux 虚拟化环境。Docker Desktop 把这层复杂度包装好了，所以适合新手主线。

## 我找到的教程类型

| 来源 | 类型 | 时间/版本 | 优点 | 问题 | 推荐度 |
| --- | --- | --- | --- | --- | ---: |
| [Docker Desktop for Mac](https://docs.docker.com/desktop/setup/install/mac-install/) | 官方文档 | 当前在线文档 | Apple Silicon、Intel、系统要求和安装方式清楚 | 许可和账号细节需读原文 | 5 |
| [Docker Compose Docs](https://docs.docker.com/compose/) | 官方文档 | 当前在线文档 | 解释 Compose 是多容器应用工具 | 新手需要项目示例 | 5 |
| [Docker Compose Quickstart](https://docs.docker.com/compose/gettingstarted/) | 官方教程 | 当前在线文档 | 用示例串起 Compose 概念 | 示例不是本文技术栈 | 5 |
| [Compose File Reference](https://docs.docker.com/reference/compose-file/) | 官方参考 | 当前在线文档 | 查字段最可靠 | 不适合第一次通读 | 5 |
| [Compose startup order](https://docs.docker.com/compose/how-tos/startup-order/) | 官方排错 | 当前在线文档 | 讲清 `depends_on` 与 healthcheck | 新手容易忽略 | 5 |
| [Docker Blog：Redis Official Image](https://www.docker.com/blog/how-to-use-the-redis-docker-official-image/) | 官方博客 | 2022 | 适合理解容器化 Redis | 本篇只做基础引用 | 4 |
| [Docker Blog：Postgres Official Image](https://www.docker.com/blog/how-to-use-the-postgres-docker-official-image/) | 官方博客 | 2022 | 解释 Postgres 环境变量和数据卷 | 具体版本要看 Docker Hub | 4 |

## 1. 安装 Docker Desktop

方式一：官网下载。

打开：

```text
https://docs.docker.com/desktop/setup/install/mac-install/
```

选择适合 Apple Silicon 或 Intel 的版本。

方式二：Homebrew Cask。

```bash
brew install --cask docker
```

安装后从 Applications 打开 Docker Desktop。第一次启动可能需要授权和等待后台服务启动。

## 2. 验证 Docker

运行：

```bash
docker --version
docker compose version
docker info
```

成功信号：

```text
Docker version ...
Docker Compose version ...
```

如果 `docker info` 报错，通常是 Docker Desktop 没启动，或者后台服务还没准备好。

## 3. 运行 hello-world

```bash
docker run hello-world
```

这一步在做什么：

1. Docker 检查本机有没有 `hello-world` 镜像；
2. 没有就从 Docker Hub 拉取；
3. 用镜像创建一个容器；
4. 容器打印说明后退出。

成功信号：终端输出 Docker 安装成功的说明。

## 4. 运行一个 nginx 容器

```bash
docker run --name web-demo -p 8080:80 nginx:alpine
```

打开：

```text
http://localhost:8080
```

你应该能看到 nginx 欢迎页。

停止：在终端按 `Ctrl+C`。

如果要后台运行：

```bash
docker run -d --name web-demo -p 8080:80 nginx:alpine
```

查看：

```bash
docker ps
```

停止并删除：

```bash
docker stop web-demo
docker rm web-demo
```

## 5. 理解四个核心概念

### 镜像 image

镜像像“应用模板”。例如 `nginx:alpine` 里包含运行 nginx 需要的文件。

查看本地镜像：

```bash
docker images
```

### 容器 container

容器是由镜像启动出来的运行实例。

查看运行中的容器：

```bash
docker ps
```

查看所有容器：

```bash
docker ps -a
```

### 端口 port

`-p 8080:80` 的意思是：

```text
本机 8080 -> 容器 80
```

浏览器访问 `localhost:8080`，请求会转发到容器内部的 80 端口。

### 卷 volume

容器删除后，容器内部文件通常也会消失。数据库需要持久化数据，所以要用 volume。

查看卷：

```bash
docker volume ls
```

## 6. 创建第一个 Compose 文件

创建目录：

```bash
mkdir -p ~/Developer/compose-check
cd ~/Developer/compose-check
```

创建 `compose.yml`：

```yaml
services:
  web:
    image: nginx:alpine
    ports:
      - "8080:80"
```

启动：

```bash
docker compose up
```

后台启动：

```bash
docker compose up -d
```

查看：

```bash
docker compose ps
```

停止：

```bash
docker compose down
```

## 7. Compose 比 docker run 好在哪里

单个 nginx 用 `docker run` 也行。但全栈项目至少有：

- web 前端；
- api 后端；
- db 数据库；
- redis 缓存。

如果每个服务都手写 `docker run`，命令会很长，也很难分享给别人。Compose 把它们写进一个 YAML 文件，一条命令启动。

## 8. Docker Desktop 资源设置

打开 Docker Desktop Settings，可以关注：

- CPU；
- Memory；
- Disk；
- File sharing；
- Resource Saver。

如果你 Mac 内存是 8GB，不要一次启动太多容器。PostgreSQL、Redis、前端、后端四个服务通常还可以，再加大模型、Elasticsearch、Kubernetes 就可能吃紧。

## 9. 常见错误与解决

### `Cannot connect to the Docker daemon`

通常是 Docker Desktop 没启动。

解决：

1. 打开 Docker Desktop；
2. 等待状态变为 Running；
3. 重新运行 `docker info`。

### 端口被占用

错误可能类似：

```text
Bind for 0.0.0.0:8080 failed: port is already allocated
```

检查：

```bash
lsof -i :8080
```

换端口：

```yaml
ports:
  - "8081:80"
```

### 镜像拉取很慢

先确认网络。不要随便配置来源不明的镜像加速器。公司或学校网络可能限制 Docker Hub。

### 容器启动后马上退出

查看日志：

```bash
docker logs 容器名
docker compose logs 服务名
```

容器退出不是 Docker 坏了，通常是容器里的主进程报错或正常执行完毕。

### `depends_on` 不等于服务可用

Docker Compose 官方文档说明，普通 `depends_on` 只能控制启动顺序，不保证数据库已经准备好接收连接。要等数据库 ready，需要 healthcheck 和 `condition: service_healthy`。

## 验证方式

最终检查：

```bash
docker --version
docker compose version
docker run hello-world
docker compose up -d
docker compose ps
docker compose down
```

浏览器能打开 `http://localhost:8080`，说明基础容器环境可用。

## 可直接交给 Codex 的 Prompt

```text
你是我的 Docker Desktop 和 Docker Compose 检查助手。请只检查，不要删除镜像、卷或容器，除非我确认。

目标：
确认 macOS 上 Docker Desktop 和 Docker Compose 能运行本地开发服务。

请检查：
1. docker 和 docker compose 版本。
2. Docker daemon 是否可连接。
3. hello-world 是否能运行。
4. 一个最小 nginx compose.yml 是否能启动。
5. 如果端口冲突，指出冲突进程和替代端口。

约束：
- 不要运行 docker system prune。
- 不要删除 volume。
- 不要修改 Docker Desktop 全局设置，先给建议。
```

## 参考来源

- [Docker Docs：Install Docker Desktop on Mac](https://docs.docker.com/desktop/setup/install/mac-install/)
- [Docker Docs：Docker Compose](https://docs.docker.com/compose/)
- [Docker Docs：Compose Quickstart](https://docs.docker.com/compose/gettingstarted/)
- [Docker Docs：Compose file reference](https://docs.docker.com/reference/compose-file/)
- [Docker Docs：Control startup order in Compose](https://docs.docker.com/compose/how-tos/startup-order/)
- [Docker Blog：How to use the Redis Docker Official Image](https://www.docker.com/blog/how-to-use-the-redis-docker-official-image/)
- [Docker Blog：How to use the Postgres Docker Official Image](https://www.docker.com/blog/how-to-use-the-postgres-docker-official-image/)
