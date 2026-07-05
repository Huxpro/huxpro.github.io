---
layout: post
title: "macOS 全栈开发环境总览与安装路线图"
subtitle: "先选一条稳妥主线，再按前端、后端、数据库、容器和测试逐步补齐"
date: 2026-05-31 09:00:00 +0800
author: "CodeWater517"
header-img: "img/home-bg-geek.jpg"
header-mask: 0.35
tags:
  - macOS
  - 全栈
  - 环境配置
  - 开发
  - 工具
last_modified_at: 2026-05-31 09:00:00 +0800
revision_history:
  - time: 2026-05-31 09:00:00 +0800
    description: "新增 macOS 全栈开发环境系列总览。"
---

> 这篇是整个系列的地图。不要一上来把所有工具都装满，先跑通一条能做项目的主线：Homebrew、VS Code、Node.js、React、Python、FastAPI、PostgreSQL、Redis、Docker Compose。后面的 11 篇会把每一步拆开讲。

## 结论

推荐路线是：

```text
Xcode Command Line Tools
-> Homebrew
-> Git / GitHub SSH / GitHub CLI
-> VS Code
-> Node.js / pnpm / TypeScript / Vite
-> React / Tailwind
-> uv / FastAPI
-> PostgreSQL / Redis
-> Docker Desktop / Docker Compose
-> 接口调试 / 测试 / 本地 HTTPS
-> Java / Go / MongoDB / 云平台 CLI 作为可选扩展
```

这条路线的优点是够完整，又不失控。你能用它做一个典型全栈项目：前端页面、后端 API、数据库、缓存、本地容器编排、接口调试、自动化测试。

## 我找到的教程类型

| 来源 | 类型 | 时间/版本 | 优点 | 问题 | 推荐度 |
| --- | --- | --- | --- | --- | ---: |
| [Apple Command Line Tools](https://developer.apple.com/documentation/xcode/installing-the-command-line-tools/) | 官方文档 | 当前在线文档 | 明确解释 CLT 与完整 Xcode 的区别 | 对全栈读者不讲后续工具链 | 5 |
| [Homebrew Installation](https://docs.brew.sh/Installation.html) | 官方文档 | 当前在线文档 | Apple Silicon 与 Intel 前缀说明清楚 | 对新手来说安装后 PATH 容易漏 | 5 |
| [VS Code macOS Setup](https://code.visualstudio.com/docs/setup/mac) | 官方文档 | 当前在线文档 | 讲清 `code` 命令和 macOS 安装 | 不负责解释全栈插件取舍 | 5 |
| [Docker Compose Docs](https://docs.docker.com/compose/) | 官方文档 | 当前在线文档 | 解释多容器应用的核心模型 | 新手需要一个完整本地项目串起来 | 5 |
| [MIT Missing Semester](https://missing.csail.mit.edu/) | 课程 | 持续可用 | 对 Shell、Git、编辑器、调试很有帮助 | 不是 macOS 全栈安装手册 | 4 |
| [Navendu Pottekkat macOS dev setup](https://navendu.me/posts/development-environment/) | 社区文章 | 2025 | 展示真实开发者工具组合 | 偏个人偏好，需要筛选 | 4 |
| [Sourabh Bajaj Mac Setup](https://sourabhbajaj.com/mac-setup/) | 社区教程 | 长期维护 | 覆盖 Homebrew、VS Code、语言环境 | 部分选择偏通用，不一定适合全栈主线 | 4 |

综合下来，官方文档负责“命令是否可靠”，社区文章负责“真实开发时哪些工具常一起出现”。本系列只保留对全栈学习最有用的路径。

## 全栈环境到底包含什么

一套全栈开发环境不是“装很多软件”。它应该能回答六个问题：

1. 代码在哪里写？
2. 依赖怎么装？
3. 前端怎么启动？
4. 后端怎么启动？
5. 数据放在哪里？
6. 出问题怎么验证和排查？

对应到工具就是：

| 层级 | 工具 | 作用 |
| --- | --- | --- |
| 系统基础 | Xcode Command Line Tools、Homebrew | 给 macOS 补齐编译工具和包管理器 |
| 协作基础 | Git、SSH、GitHub CLI | 拉代码、提交代码、连接 GitHub |
| 编辑器 | VS Code、扩展 | 写代码、看错误、调试、格式化 |
| 前端 | Node.js、pnpm、TypeScript、Vite、React、Tailwind | 做用户界面 |
| 后端 | uv、Python、FastAPI | 做 API 服务 |
| 数据 | PostgreSQL、Redis、SQLite | 存数据、做缓存、本地测试 |
| 容器 | Docker Desktop、Docker Compose | 把服务组合成可复现环境 |
| 测试调试 | Bruno/Postman、Vitest、Playwright、pytest、mkcert | 调接口、跑测试、启用本地 HTTPS |
| 扩展 | Java、Go、MongoDB、Vercel/Railway/AWS CLI | 以后按项目需要补 |

## 推荐安装顺序

### 1. 先装系统基础

先安装 Xcode Command Line Tools，再安装 Homebrew。

为什么先做这一步？因为后面很多工具都要通过 Homebrew 安装。Command Line Tools 里包含 Git、编译器、SDK、常用构建工具。没有它，很多包会安装失败。

成功信号：

```bash
xcode-select -p
brew --version
brew doctor
```

`xcode-select -p` 应该输出类似 `/Library/Developer/CommandLineTools`。`brew --version` 能看到 Homebrew 版本。`brew doctor` 如果只有提醒而不是严重错误，通常可以继续。

### 2. 再装协作基础

安装 Git，设置用户名和邮箱，创建 SSH key，把公钥加到 GitHub，然后安装 GitHub CLI。

成功信号：

```bash
git --version
ssh -T git@github.com
gh auth status
```

新手最常见的问题是：Git 能用，但 GitHub 推不上去。大多数时候是 SSH key 没加、远程地址还是 HTTPS、或者 `ssh-agent` 没加载密钥。

### 3. 进入编辑器

安装 VS Code，打开 `code` 命令，装少量核心扩展：

- ESLint
- Prettier
- Tailwind CSS IntelliSense
- Docker
- GitLens
- REST Client 或 Bruno/Postman 作为接口调试工具

不要一口气装几十个扩展。编辑器扩展也是代码，会影响性能和安全。先装可信来源、常用、能解释用途的扩展。

### 4. 前端主线

前端环境建议：

```text
Node.js LTS + pnpm + TypeScript + Vite + React + Tailwind
```

这套组合适合学习，也适合项目原型。Vite 启动快，React 生态大，Tailwind 适合快速做界面，pnpm 对多项目和磁盘空间更友好。

成功信号：

```bash
node -v
pnpm -v
pnpm create vite
pnpm dev
```

浏览器能打开 `http://localhost:5173`，说明前端开发服务器跑起来了。

### 5. 后端主线

后端环境建议：

```text
uv + Python + FastAPI + Uvicorn
```

`uv` 负责 Python 版本、虚拟环境和依赖管理。FastAPI 负责写接口。Uvicorn 负责本地开发服务器。

成功信号：

```bash
uv --version
uv run fastapi dev
```

浏览器能打开 `http://127.0.0.1:8000/docs`，说明后端 API 文档页面正常。

### 6. 数据库和缓存

主线用 PostgreSQL 和 Redis。

PostgreSQL 适合作为长期数据存储，Redis 适合缓存、队列、会话、限流等场景。SQLite 可以作为轻量学习工具，但如果你要练全栈项目，建议早点接触 PostgreSQL。

成功信号：

```bash
psql --version
redis-cli ping
```

Redis 成功时会返回：

```text
PONG
```

### 7. 容器化本地开发

当你已经能分别启动前端、后端、数据库、Redis，就可以用 Docker Compose 把它们组合起来。

成功信号：

```bash
docker --version
docker compose version
docker compose up
```

一个完整本地全栈项目至少应该能做到：

- 前端访问后端；
- 后端连接 PostgreSQL；
- 后端连接 Redis；
- 重启容器后数据库数据还在；
- 一条命令启动全部服务。

## 安装前的检查清单

在正式开始之前，先打开 Terminal，运行：

```bash
uname -m
sw_vers
echo $SHELL
```

你会得到三类信息：

- `uname -m`：`arm64` 通常是 Apple Silicon，`x86_64` 通常是 Intel。
- `sw_vers`：当前 macOS 版本。
- `echo $SHELL`：默认 Shell，现代 macOS 多数是 `/bin/zsh`。

这些信息决定了 Homebrew 的默认路径、部分二进制包的架构，以及你应该把 PATH 写进 `~/.zprofile` 还是其他文件。

## 常见路线分歧

### Homebrew 还是手动安装？

本系列优先 Homebrew。原因是容易更新、容易卸载、路径统一。

但有例外：

- Docker Desktop 用官方安装包或 Homebrew Cask 都可以；
- AWS CLI 官方更推荐自己的 pkg 安装器；
- 某些 GUI 数据库客户端直接下载 app 更自然。

### 本机装数据库，还是 Docker 跑数据库？

学习阶段可以先本机安装 PostgreSQL 和 Redis，因为命令更直观。项目阶段建议 Docker Compose 跑数据库，因为更可复现，也不容易污染系统。

本系列两条都会讲：第 8 篇讲本机安装，第 10 篇讲 Docker Compose 组合。

### npm、pnpm、yarn 怎么选？

新手可以认识 npm，但主线用 pnpm。npm 随 Node.js 自带，最普遍；pnpm 在速度、磁盘空间和 monorepo 体验上更适合长期项目。不要同时在一个项目里混用多个包管理器。

### Python 用系统 Python 吗？

不要依赖 macOS 系统自带 Python。项目里使用 `uv` 管理 Python 版本和虚拟环境。这样换电脑、换项目、换依赖时更可控。

## 推荐学习节奏

如果你有 3 天：

1. 第一天：系统基础、Git、VS Code。
2. 第二天：Node.js、React、Tailwind。
3. 第三天：FastAPI、PostgreSQL、Redis。

如果你有 1 周：

1. 前 2 天补系统基础和编辑器。
2. 中间 2 天做一个前端页面。
3. 第 5 天做一个后端 API。
4. 第 6 天接数据库。
5. 第 7 天用 Docker Compose 串起来并写最小测试。

如果你有 1 个月：

目标应该是做一个完整小项目，例如：

- 任务清单；
- 读书记录；
- 课程作业管理；
- 简历作品集后台；
- 文献笔记 API。

不要只安装工具。安装环境的最终目的，是能稳定做项目。

## 验证方式

完成整个系列后，应该能跑通这些命令：

```bash
git --version
gh --version
code --version
node -v
pnpm -v
uv --version
python --version
psql --version
redis-cli ping
docker --version
docker compose version
```

还应该能打开这些地址：

```text
http://localhost:5173
http://127.0.0.1:8000/docs
```

如果进入 Docker Compose 阶段，还应该能：

```bash
docker compose ps
docker compose logs api
docker compose logs web
```

## 常见错误与解决

### `command not found: brew`

通常是 Homebrew 已安装但 PATH 没生效。Apple Silicon 常见路径是 `/opt/homebrew/bin`，Intel 常见路径是 `/usr/local/bin`。

先运行：

```bash
/opt/homebrew/bin/brew --version
```

如果能看到版本，把 Homebrew shellenv 写入 `~/.zprofile`。

### `permission denied`

不要第一反应就加 `sudo`。先看你在操作哪个目录：

```bash
pwd
ls -ld .
```

如果是在系统目录、`/usr/bin`、`/Library` 等位置，普通用户本来就不应该随便写。开发项目尽量放在自己的用户目录，例如 `~/Developer`。

### 端口被占用

前端常用 5173，后端常用 8000，PostgreSQL 常用 5432，Redis 常用 6379。

检查端口：

```bash
lsof -i :5173
lsof -i :8000
```

如果是自己之前启动的进程，可以停止对应开发服务器。不要随便杀不认识的系统进程。

## 可直接交给 Codex 的 Prompt

```text
你是我的编程助手。请在我的 macOS 上检查全栈开发环境是否完整。

目标：
确认 Homebrew、Git、GitHub SSH、VS Code、Node.js、pnpm、uv、FastAPI、PostgreSQL、Redis、Docker Compose 是否可用。

约束：
1. 只做检查，不要卸载或修改系统配置。
2. 每个工具都给出检查命令、成功信号和失败时的下一步建议。
3. 如果发现 PATH 问题，先解释原因，再给出最小修改方案。
4. 不要要求我粘贴私钥、token 或密码。

最终输出：
- 已安装并可用的工具
- 缺失或异常的工具
- 建议的安装顺序
- 下一步应该阅读本系列哪一篇文章
```

## 参考来源

- [Apple：Installing the command-line tools](https://developer.apple.com/documentation/xcode/installing-the-command-line-tools/)
- [Homebrew：Installation](https://docs.brew.sh/Installation.html)
- [Homebrew：Manpage](https://docs.brew.sh/Manpage)
- [VS Code：macOS setup](https://code.visualstudio.com/docs/setup/mac)
- [Node.js：Downloads](https://nodejs.org/en/download/)
- [pnpm：Installation](https://pnpm.io/installation)
- [Vite：Getting Started](https://vite.dev/guide/)
- [React：Installation](https://react.dev/learn/installation)
- [Tailwind CSS：Installation](https://tailwindcss.com/docs/installation)
- [uv：Installation](https://docs.astral.sh/uv/getting-started/installation/)
- [FastAPI：First Steps](https://fastapi.tiangolo.com/tutorial/first-steps/)
- [Docker：Compose documentation](https://docs.docker.com/compose/)
- [MIT：The Missing Semester of Your CS Education](https://missing.csail.mit.edu/)
- [Sourabh Bajaj：Mac OS X Setup Guide](https://sourabhbajaj.com/mac-setup/)
- [Navendu Pottekkat：My Complete macOS Development Environment Setup](https://navendu.me/posts/development-environment/)
