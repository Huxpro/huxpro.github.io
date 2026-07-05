---
layout: post
title: "安装 PostgreSQL、Redis 与数据库客户端"
subtitle: "本机跑通关系型数据库、缓存和 GUI 客户端，为后端项目准备数据层"
date: 2026-05-31 10:10:00 +0800
author: "CodeWater517"
header-img: "img/home-bg-geek.jpg"
header-mask: 0.35
tags:
  - macOS
  - PostgreSQL
  - Redis
  - 数据库
  - 环境配置
last_modified_at: 2026-05-31 10:10:00 +0800
revision_history:
  - time: 2026-05-31 10:10:00 +0800
    description: "新增 PostgreSQL、Redis 与数据库客户端安装教程。"
---

> 前端和后端都跑起来以后，下一步是数据层。本文先讲本机安装 PostgreSQL 和 Redis，后面 Docker Compose 篇会讲如何把它们容器化。

## 结论

推荐主线：

```text
Homebrew 安装 PostgreSQL
-> brew services 启动
-> 创建开发数据库和用户
-> 安装 Redis
-> 验证 PONG
-> 安装数据库客户端
```

学习阶段本机安装能帮助你理解命令。项目协作阶段再用 Docker Compose 提高可复现性。

## 我找到的教程类型

| 来源 | 类型 | 时间/版本 | 优点 | 问题 | 推荐度 |
| --- | --- | --- | --- | --- | ---: |
| [PostgreSQL Homebrew Wiki](https://wiki.postgresql.org/wiki/Homebrew) | 官方社区 Wiki | 当前在线页面 | 解释 Homebrew 安装和 `brew services` | 页面偏 Wiki，需筛选命令 | 5 |
| [PostgreSQL Platform Notes](https://www.postgresql.org/docs/current/installation-platform-notes.html) | 官方文档 | PostgreSQL 当前版本 | macOS 平台注意事项权威 | 偏源码安装，不适合新手主线 | 4 |
| [Redis macOS Homebrew](https://redis.io/docs/latest/operate/oss_and_stack/install/install-stack/homebrew/) | 官方文档 | 当前在线文档 | Redis 8、Homebrew cask、验证 PING/PONG 说明清楚 | 与旧 `brew install redis` 教程有差异 | 5 |
| [Postgres Docker Official Image](https://hub.docker.com/_/postgres/) | 官方镜像文档 | 当前镜像页 | 后续 Compose 环境变量要用 | 本篇本机安装只引用概念 | 4 |
| [Docker Blog：Postgres Official Image](https://www.docker.com/blog/how-to-use-the-postgres-docker-official-image/) | 官方博客 | 2022 | 解释 `POSTGRES_USER`、`POSTGRES_PASSWORD` 等变量 | 用于后续容器篇更合适 | 4 |
| [Ercan Sormaz：Installing PostgreSQL on macOS](https://ercan.dev/blog/notes/installing-postgresql-on-macos) | 社区文章 | 2025 | 对 Apple Silicon/Intel 和本机开发场景讲得细 | 版本号需以 Homebrew 当前为准 | 4 |
| [TablePlus](https://tableplus.com/) / [DBeaver](https://dbeaver.io/) / [Postico](https://eggerapps.at/postico2/) | 工具官网 | 当前页面 | GUI 客户端选择 | GUI 偏个人偏好 | 4 |

## 1. 安装 PostgreSQL

先查看可安装版本：

```bash
brew search postgresql
brew info postgresql
```

如果你不需要固定版本，可以安装默认公式：

```bash
brew install postgresql
```

如果项目要求特定大版本，例如 17：

```bash
brew install postgresql@17
```

这一步在做什么：安装 PostgreSQL 服务端和 `psql` 客户端。

验证：

```bash
psql --version
which psql
```

如果安装的是带版本后缀的公式，可能需要把对应 `bin` 加入 PATH。先看 Homebrew 安装后的提示，不要盲目复制别人的路径。

## 2. 启动 PostgreSQL

默认公式：

```bash
brew services start postgresql
```

特定版本：

```bash
brew services start postgresql@17
```

查看状态：

```bash
brew services list
```

成功信号：对应服务状态是 `started`。

如果你只想当前终端临时运行，不想开机自启，可以使用 Homebrew Wiki 提到的 `brew services run` 思路，但新手阶段先用 `start` 更简单。

## 3. 创建开发数据库和用户

先进入 PostgreSQL：

```bash
psql postgres
```

创建用户和数据库：

```sql
CREATE USER fullstack WITH PASSWORD 'fullstack';
CREATE DATABASE fullstack OWNER fullstack;
GRANT ALL PRIVILEGES ON DATABASE fullstack TO fullstack;
```

退出：

```sql
\q
```

测试连接：

```bash
psql "postgresql://fullstack:fullstack@localhost:5432/fullstack"
```

成功信号：进入 `fullstack=>` 提示符。

学习环境可以使用简单密码。真实项目不要使用这种默认密码。

## 4. 常用 psql 命令

进入数据库后：

```sql
\l
\dt
\du
\conninfo
\q
```

含义：

- `\l`：列出数据库；
- `\dt`：列出表；
- `\du`：列出用户/角色；
- `\conninfo`：查看当前连接；
- `\q`：退出。

## 5. 安装 Redis

Redis 官方当前 macOS 文档推荐使用 Redis Homebrew tap 和 cask：

```bash
brew tap redis/redis
brew install --cask redis
```

启动：

```bash
redis-server $(brew --prefix)/etc/redis.conf
```

另开一个 Terminal：

```bash
redis-cli ping
```

成功信号：

```text
PONG
```

注意：Redis 官方文档说明这个 cask 安装方式不集成 `brew services`。如果你看到旧教程使用 `brew install redis` 和 `brew services start redis`，要意识到它可能对应旧版本或 Homebrew core 公式。

## 6. Redis 常用命令

```bash
redis-cli
```

进入后：

```text
PING
SET hello world
GET hello
DEL hello
INFO server
QUIT
```

Redis 默认端口是 6379。

开发阶段你可以先不设置密码，但不要把无密码 Redis 暴露到公网。

## 7. 安装数据库客户端

推荐选一个，不要全装：

| 客户端 | 特点 | 安装 |
| --- | --- | --- |
| DBeaver | 免费、跨平台、支持多数据库 | `brew install --cask dbeaver-community` |
| TablePlus | 体验好、商业软件 | `brew install --cask tableplus` |
| Postico | macOS 原生、PostgreSQL 体验好 | `brew install --cask postico` |
| Redis Insight | Redis 官方 GUI | 见 Redis 官网 |

如果你是新手，DBeaver 免费且够用；如果你长期在 macOS 上写项目，TablePlus 或 Postico 体验更好。

连接 PostgreSQL：

```text
Host: localhost
Port: 5432
User: fullstack
Password: fullstack
Database: fullstack
```

## 8. 给 FastAPI 准备连接串

后端 `.env.example` 可以写：

```text
DATABASE_URL=postgresql://fullstack:fullstack@localhost:5432/fullstack
REDIS_URL=redis://localhost:6379/0
```

解释：

- `postgresql://`：协议；
- `fullstack:fullstack`：用户名和密码；
- `localhost:5432`：主机和端口；
- `/fullstack`：数据库名；
- `redis://localhost:6379/0`：Redis 第 0 号库。

`.env` 放真实值，`.env.example` 放示例值。

## 9. 本机安装 vs Docker 安装

| 方式 | 优点 | 缺点 |
| --- | --- | --- |
| 本机安装 | 容易理解命令，性能好，GUI 连接直观 | 版本切换、清理、团队一致性较差 |
| Docker Compose | 项目可复现，团队一致，易清理 | 初学者要理解容器、卷、网络 |

建议：先本机跑通，再用 Docker Compose 重建一遍。

## 10. 常见错误与解决

### `psql: command not found`

检查：

```bash
brew list postgresql
brew info postgresql
which psql
```

如果安装的是 `postgresql@17`，需要按 Homebrew 提示把对应路径加入 PATH。

### `connection refused`

说明 PostgreSQL 服务没在监听。

检查：

```bash
brew services list
lsof -i :5432
```

启动服务：

```bash
brew services start postgresql
```

或者对应版本：

```bash
brew services start postgresql@17
```

### `password authentication failed`

检查连接串里的用户名、密码、数据库名。学习阶段可以重新进入 `psql postgres` 修改密码：

```sql
ALTER USER fullstack WITH PASSWORD 'fullstack';
```

### `redis-cli ping` 没有 PONG

检查 Redis 服务是否启动。若你使用官方 cask 方式，需要手动运行：

```bash
redis-server $(brew --prefix)/etc/redis.conf
```

另开终端再执行：

```bash
redis-cli ping
```

### 5432 或 6379 被占用

检查：

```bash
lsof -i :5432
lsof -i :6379
```

不要随便杀进程。先看是不是你之前安装的数据库服务、Docker 容器或 GUI 客户端启动了服务。

## 验证方式

最终检查：

```bash
psql --version
brew services list
psql "postgresql://fullstack:fullstack@localhost:5432/fullstack" -c "SELECT version();"
redis-cli ping
```

成功时：

- PostgreSQL 返回版本；
- Redis 返回 `PONG`；
- GUI 客户端能连接 `fullstack` 数据库。

## 可直接交给 Codex 的 Prompt

```text
你是我的 macOS 数据库环境检查助手。请只检查和给建议，不要删除数据。

目标：
确认 PostgreSQL、Redis 和数据库客户端是否能用于本地全栈开发。

请检查：
1. psql 版本和路径。
2. Homebrew PostgreSQL 服务状态。
3. fullstack 数据库和 fullstack 用户是否存在。
4. 是否能用连接串连接数据库。
5. Redis 是否能返回 PONG。
6. 给出 FastAPI 可用的 DATABASE_URL 和 REDIS_URL 示例。

约束：
- 不要删除数据库、用户或数据目录。
- 不要运行 DROP DATABASE。
- 不要输出真实密码，只用示例值。
```

## 参考来源

- [PostgreSQL Wiki：Homebrew](https://wiki.postgresql.org/wiki/Homebrew)
- [PostgreSQL Docs：Platform-Specific Notes](https://www.postgresql.org/docs/current/installation-platform-notes.html)
- [Redis Docs：Install Redis Open Source on macOS](https://redis.io/docs/latest/operate/oss_and_stack/install/install-stack/homebrew/)
- [Postgres Docker Official Image](https://hub.docker.com/_/postgres/)
- [Docker Blog：How to use the Postgres Docker Official Image](https://www.docker.com/blog/how-to-use-the-postgres-docker-official-image/)
- [Ercan Sormaz：Installing PostgreSQL on macOS](https://ercan.dev/blog/notes/installing-postgresql-on-macos)
- [DBeaver Community](https://dbeaver.io/)
- [TablePlus](https://tableplus.com/)
- [Postico](https://eggerapps.at/postico2/)
