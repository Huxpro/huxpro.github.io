---
layout: post
title: "用 Docker Compose 跑通前端、后端、数据库、缓存"
subtitle: "把 React、FastAPI、PostgreSQL、Redis 组合成一条本地可复现的全栈开发链路"
date: 2026-05-31 10:30:00 +0800
author: "CodeWater517"
header-img: "img/home-bg-geek.jpg"
header-mask: 0.35
tags:
  - macOS
  - 全栈
  - Docker
  - Docker Compose
  - 工程实践
last_modified_at: 2026-05-31 10:30:00 +0800
revision_history:
  - time: 2026-05-31 10:30:00 +0800
    description: "新增 Docker Compose 全栈本地编排教程。"
---

> 这一篇是整个系列的闭环：前端、后端、PostgreSQL、Redis 都放进 Docker Compose。你会得到一套能被同学、同事或未来的自己复现的本地环境。

## 结论

推荐项目结构：

```text
fullstack-local/
  compose.yml
  .env.example
  web/
  api/
```

服务关系：

```text
web -> api -> postgres
          -> redis
```

启动命令：

```bash
docker compose up --build
```

## 我找到的教程类型

| 来源 | 类型 | 时间/版本 | 优点 | 问题 | 推荐度 |
| --- | --- | --- | --- | --- | ---: |
| [Docker Compose Docs](https://docs.docker.com/compose/) | 官方文档 | 当前在线文档 | 多容器应用模型最权威 | 需要结合具体技术栈 | 5 |
| [Compose Quickstart](https://docs.docker.com/compose/gettingstarted/) | 官方教程 | 当前在线文档 | `compose.yml` 入门清楚 | 示例不是 React + FastAPI | 5 |
| [Compose File Reference](https://docs.docker.com/reference/compose-file/) | 官方参考 | 当前在线文档 | 字段查阅可靠 | 初学不宜通读 | 5 |
| [Compose startup order](https://docs.docker.com/compose/how-tos/startup-order/) | 官方排错 | 当前在线文档 | 解释 healthcheck 与启动顺序 | 新手常忽略 | 5 |
| [Postgres Official Image](https://hub.docker.com/_/postgres/) | 官方镜像 | 当前镜像页 | 环境变量和数据目录权威 | 细节较多 | 5 |
| [Redis Official Image](https://hub.docker.com/_/redis) | 官方镜像 | 当前镜像页 | 镜像标签和运行方式权威 | 本篇只用基础能力 | 5 |
| [FastAPI First Steps](https://fastapi.tiangolo.com/tutorial/first-steps/) | 官方文档 | 当前在线文档 | 后端健康检查基础 | Compose 需自己组织 | 5 |

## 1. 创建项目结构

```bash
mkdir -p ~/Developer/fullstack-local
cd ~/Developer/fullstack-local
mkdir web api
```

如果你已经按前面文章创建了 React 项目和 FastAPI 项目，可以把它们放进：

```text
web/
api/
```

目标不是生成一个完美生产模板，而是先跑通本地开发闭环。

## 2. 准备后端 Dockerfile

创建 `api/Dockerfile`：

```dockerfile
FROM python:3.12-slim

WORKDIR /app

COPY pyproject.toml uv.lock* ./

RUN pip install --no-cache-dir uv \
    && uv sync --frozen || uv sync

COPY . .

EXPOSE 8000

CMD ["uv", "run", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
```

说明：

- `python:3.12-slim`：Python 基础镜像；
- `WORKDIR /app`：容器里的工作目录；
- `uv sync`：安装 Python 依赖；
- `--host 0.0.0.0`：让容器外可以访问服务；
- `--reload`：开发阶段自动重载。

如果 `uv.lock` 不存在，`uv sync --frozen` 会失败，所以示例里给了回退。真实团队项目建议提交 lockfile 并保持 frozen。

## 3. 准备前端 Dockerfile

创建 `web/Dockerfile`：

```dockerfile
FROM node:24-alpine

WORKDIR /app

RUN corepack enable pnpm

COPY package.json pnpm-lock.yaml* ./
RUN pnpm install

COPY . .

EXPOSE 5173

CMD ["pnpm", "dev", "--host", "0.0.0.0"]
```

说明：

- `node:24-alpine`：Node.js 镜像；
- `corepack enable pnpm`：启用 pnpm；
- `--host 0.0.0.0`：让宿主机能访问 Vite 开发服务器。

如果你的项目固定 Node LTS 版本，可以把 `24` 改成项目要求版本。

## 4. 写 compose.yml

在项目根目录创建 `compose.yml`：

```yaml
services:
  postgres:
    image: postgres:17-alpine
    environment:
      POSTGRES_USER: fullstack
      POSTGRES_PASSWORD: fullstack
      POSTGRES_DB: fullstack
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U fullstack -d fullstack"]
      interval: 5s
      timeout: 5s
      retries: 10

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 5s
      retries: 10

  api:
    build:
      context: ./api
    environment:
      DATABASE_URL: postgresql://fullstack:fullstack@postgres:5432/fullstack
      REDIS_URL: redis://redis:6379/0
    ports:
      - "8000:8000"
    volumes:
      - ./api:/app
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy

  web:
    build:
      context: ./web
    environment:
      VITE_API_BASE_URL: http://localhost:8000
    ports:
      - "5173:5173"
    volumes:
      - ./web:/app
      - /app/node_modules
    depends_on:
      - api

volumes:
  postgres_data:
```

关键点：

- 容器之间访问 PostgreSQL，用服务名 `postgres`，不是 `localhost`。
- 容器之间访问 Redis，用服务名 `redis`。
- 浏览器访问 API，用宿主机地址 `http://localhost:8000`。
- PostgreSQL 数据放在 named volume `postgres_data`。

## 5. 准备 .env.example

创建 `.env.example`：

```text
POSTGRES_USER=fullstack
POSTGRES_PASSWORD=fullstack
POSTGRES_DB=fullstack
DATABASE_URL=postgresql://fullstack:fullstack@postgres:5432/fullstack
REDIS_URL=redis://redis:6379/0
VITE_API_BASE_URL=http://localhost:8000
```

学习项目可以把示例值写清楚。真实项目不要提交 `.env`。

## 6. 启动全栈环境

```bash
docker compose up --build
```

成功后访问：

```text
http://localhost:5173
http://localhost:8000/docs
```

另开 Terminal 查看服务：

```bash
docker compose ps
docker compose logs api
docker compose logs web
```

## 7. 验证数据库和 Redis

进入 PostgreSQL：

```bash
docker compose exec postgres psql -U fullstack -d fullstack
```

执行：

```sql
SELECT version();
\q
```

验证 Redis：

```bash
docker compose exec redis redis-cli ping
```

成功信号：

```text
PONG
```

## 8. 验证 API 到数据层的连接

后端可以添加健康检查：

```python
import os

from fastapi import FastAPI

app = FastAPI(title="Fullstack API")


@app.get("/health")
def health() -> dict[str, str]:
    return {
        "status": "ok",
        "database": os.getenv("DATABASE_URL", "missing"),
        "redis": os.getenv("REDIS_URL", "missing"),
    }
```

访问：

```bash
curl http://localhost:8000/health
```

注意：不要在生产环境健康检查里直接返回完整连接串。学习阶段只是帮助理解环境变量。

## 9. 常见错误与解决

### API 连不上 PostgreSQL

容器内不要用 `localhost:5432` 连接数据库。对 API 容器来说，`localhost` 是 API 容器自己，不是 PostgreSQL 容器。

应该用：

```text
postgres:5432
```

### `depends_on` 后 API 仍然启动失败

普通 `depends_on` 只保证启动顺序，不保证服务可用。本文使用 healthcheck 和 `condition: service_healthy`，这是更稳的开发方式。

### 前端访问 API CORS 报错

后端允许：

```text
http://localhost:5173
http://127.0.0.1:5173
```

并确认前端环境变量：

```text
VITE_API_BASE_URL=http://localhost:8000
```

### 修改代码没有热更新

检查 volumes：

```yaml
volumes:
  - ./api:/app
```

前端还要避免宿主机空的 `node_modules` 覆盖容器内依赖，所以示例加了：

```yaml
- /app/node_modules
```

### 数据库密码改了但不生效

Postgres 官方镜像只在初始化空数据目录时使用 `POSTGRES_PASSWORD` 等变量。已有 volume 时，改环境变量不会重置已有数据库。

学习环境如果确认要重建数据，可以先停服务，再手动删除对应 volume。但这会删数据，执行前一定确认。

## 验证方式

运行：

```bash
docker compose up --build
docker compose ps
curl http://localhost:8000/health
docker compose exec redis redis-cli ping
docker compose exec postgres psql -U fullstack -d fullstack -c "SELECT 1;"
```

浏览器打开：

```text
http://localhost:5173
http://localhost:8000/docs
```

全部通过，说明本地全栈环境已经串起来。

## 可直接交给 Codex 的 Prompt

```text
你是我的 Docker Compose 全栈本地环境助手。请基于当前项目检查并补齐 React + FastAPI + PostgreSQL + Redis 的本地编排。

目标：
用 docker compose up --build 启动 web、api、postgres、redis，并能访问前端和 FastAPI docs。

约束：
1. 不要删除已有数据库 volume，除非我明确确认。
2. 不要把真实密码写进仓库。
3. 容器内服务互联使用服务名，不要把 localhost 写成数据库地址。
4. 添加 healthcheck，避免 API 早于数据库启动。

任务：
1. 检查项目结构。
2. 检查 web 和 api 的 Dockerfile。
3. 编写或修复 compose.yml。
4. 运行 docker compose config 和 docker compose up --build。
5. 验证 /health、/docs、Redis PONG、PostgreSQL SELECT 1。
```

## 参考来源

- [Docker Docs：Docker Compose](https://docs.docker.com/compose/)
- [Docker Docs：Compose Quickstart](https://docs.docker.com/compose/gettingstarted/)
- [Docker Docs：Compose file reference](https://docs.docker.com/reference/compose-file/)
- [Docker Docs：Control startup order in Compose](https://docs.docker.com/compose/how-tos/startup-order/)
- [Docker Hub：postgres Official Image](https://hub.docker.com/_/postgres/)
- [Docker Hub：redis Official Image](https://hub.docker.com/_/redis)
- [FastAPI：First Steps](https://fastapi.tiangolo.com/tutorial/first-steps/)
- [Vite：Server Options](https://vite.dev/config/server-options)
