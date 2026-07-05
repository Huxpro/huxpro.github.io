---
layout: post
title: "安装 Python uv 与 FastAPI 后端环境"
subtitle: "用 uv 管理 Python 项目，用 FastAPI 做可验证的本地 API 服务"
date: 2026-05-31 10:00:00 +0800
author: "CodeWater517"
header-img: "img/home-bg-geek.jpg"
header-mask: 0.35
tags:
  - macOS
  - Python
  - FastAPI
  - 后端
  - 环境配置
last_modified_at: 2026-05-31 10:00:00 +0800
revision_history:
  - time: 2026-05-31 10:00:00 +0800
    description: "新增 uv 与 FastAPI 后端环境安装教程。"
---

> Python 后端最容易乱在“到底用系统 Python、pip、venv、conda、poetry 还是 uv”。本系列主线选 uv：用它创建项目、管理 Python 版本、安装依赖、运行 FastAPI。

## 结论

推荐路线：

```text
安装 uv
-> 创建 FastAPI 项目
-> 安装 fastapi、uvicorn
-> 写 /health 接口
-> 启动开发服务器
-> 打开 /docs 验证
```

不要依赖 macOS 系统 Python。每个项目都应该有自己的虚拟环境和依赖锁定。

## 我找到的教程类型

| 来源 | 类型 | 时间/版本 | 优点 | 问题 | 推荐度 |
| --- | --- | --- | --- | --- | ---: |
| [uv Installation](https://docs.astral.sh/uv/getting-started/installation/) | 官方文档 | 当前在线文档 | 安装方式、shell 配置、验证清楚 | 新手要理解 uv 与 pip 的关系 | 5 |
| [uv FastAPI Integration](https://docs.astral.sh/uv/guides/integration/fastapi/) | 官方文档 | 当前在线文档 | 直接给 FastAPI 项目路径 | 需要自己补排错 | 5 |
| [FastAPI First Steps](https://fastapi.tiangolo.com/tutorial/first-steps/) | 官方文档 | 当前在线文档 | `/docs`、Uvicorn 输出、最小 app 清楚 | 不讲 uv 项目管理 | 5 |
| [Uvicorn Deployment](https://www.uvicorn.org/deployment/) | 官方文档 | 当前在线文档 | 区分本地 `--reload` 与生产部署 | 对初学者偏深入 | 4 |
| [Pydantic Settings](https://docs.pydantic.dev/usage/settings/) | 官方文档 | 当前在线文档 | 适合后续环境变量配置 | 本篇只做入门 | 4 |
| [SQLModel Learn](https://sqlmodel.tiangolo.com/learn/) | 官方文档 | 当前在线文档 | 后续接数据库自然 | 不适合第一步全展开 | 4 |
| [pytest Get Started](https://pytest.org/en/8.0.x/getting-started.html) | 官方文档 | 当前在线文档 | 后端测试基础 | 本篇只做健康检查 | 4 |

## 1. 安装 uv

官方安装脚本：

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

如果你偏好 Homebrew：

```bash
brew install uv
```

这一步在做什么：安装 Python 项目管理工具 uv。

为什么需要：uv 可以创建虚拟环境、安装依赖、运行命令、锁定依赖，也可以管理 Python 版本。它比传统 `pip + venv` 更统一。

验证：

```bash
uv --version
which uv
```

如果安装后找不到 `uv`，重开终端，或者检查安装脚本提示你写入的 PATH。

## 2. 创建后端项目

在哪里运行：`~/Developer`。

```bash
cd ~/Developer
uv init fullstack-api
cd fullstack-api
```

这一步会生成一个 Python 项目骨架。

查看目录：

```bash
tree -a -L 2
```

常见文件：

```text
fullstack-api/
  pyproject.toml
  README.md
  main.py
```

## 3. 添加 FastAPI 和 Uvicorn

```bash
uv add fastapi uvicorn
```

这一步在做什么：把 FastAPI 和 ASGI 服务器加入项目依赖。

为什么需要：

- FastAPI：写 API 路由；
- Uvicorn：本地运行 FastAPI app。

验证依赖：

```bash
uv pip list
```

你应该能看到 `fastapi`、`uvicorn`、`pydantic`、`starlette` 等依赖。

## 4. 写最小 API

修改 `main.py`：

```python
from fastapi import FastAPI

app = FastAPI(title="Fullstack API")


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/")
def read_root() -> dict[str, str]:
    return {"message": "Hello from FastAPI"}
```

这一步在做什么：创建 FastAPI 应用，并暴露两个接口。

为什么需要 `/health`：后面 Docker Compose、前端请求、部署检查都会用健康检查判断后端是否活着。

## 5. 启动开发服务器

```bash
uv run uvicorn main:app --reload
```

解释：

- `uv run`：在项目环境里运行命令；
- `uvicorn`：启动 ASGI 服务器；
- `main:app`：从 `main.py` 里找到变量 `app`；
- `--reload`：代码变化后自动重启，适合开发。

成功信号：

```text
Uvicorn running on http://127.0.0.1:8000
```

打开：

```text
http://127.0.0.1:8000/health
http://127.0.0.1:8000/docs
```

`/docs` 是 FastAPI 自动生成的交互式 API 文档。

## 6. 添加开发脚本

在 `pyproject.toml` 里，uv 项目可以通过命令运行，不一定需要脚本。为了新手方便，可以在 README 记录：

```bash
uv run uvicorn main:app --reload
```

如果项目变复杂，再引入任务工具。不要为了一个命令过早加很多抽象。

## 7. 添加 CORS

当前端运行在 `http://localhost:5173`，后端运行在 `http://127.0.0.1:8000`，浏览器会涉及跨域。

安装不需要额外包，FastAPI 依赖里已有 Starlette 中间件：

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Fullstack API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

学习阶段可以明确列出前端地址。不要在生产环境里随便使用 `allow_origins=["*"]` 加凭证。

## 8. 添加环境变量配置

后续连接数据库时，可以先创建 `.env`：

```text
DATABASE_URL=postgresql://fullstack:fullstack@localhost:5432/fullstack
REDIS_URL=redis://localhost:6379/0
```

不要提交真实密码。可以提交 `.env.example`：

```text
DATABASE_URL=postgresql://user:password@localhost:5432/app
REDIS_URL=redis://localhost:6379/0
```

`.env` 应该加入 `.gitignore`。

如果要用 Pydantic Settings，后续再安装：

```bash
uv add pydantic-settings
```

## 9. 添加最小测试

安装 pytest：

```bash
uv add --dev pytest
```

创建 `test_main.py`：

```python
from fastapi.testclient import TestClient

from main import app


client = TestClient(app)


def test_health() -> None:
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}
```

运行：

```bash
uv run pytest
```

成功信号：

```text
1 passed
```

## 10. 常见错误与解决

### `uv: command not found`

重开终端。仍然不行就检查：

```bash
echo $PATH
which uv
```

如果用 Homebrew 安装，确认：

```bash
brew list uv
```

### `Address already in use`

8000 端口被占用。

检查：

```bash
lsof -i :8000
```

换端口：

```bash
uv run uvicorn main:app --reload --port 8001
```

### `/docs` 打不开

先看终端有没有 Uvicorn 正在运行。再确认访问的是：

```text
http://127.0.0.1:8000/docs
```

不是 `https`，也不是 5173。

### `ModuleNotFoundError`

说明依赖没装到当前项目环境，或者你没有用 `uv run`。

先运行：

```bash
uv sync
uv run python -c "import fastapi; print(fastapi.__version__)"
```

### 前端请求被 CORS 拦截

浏览器控制台会出现 CORS 错误。确认后端添加了 `CORSMiddleware`，并且 `allow_origins` 包含前端实际地址。

## 验证方式

最终运行：

```bash
uv --version
uv run python --version
uv run uvicorn main:app --reload
```

另开一个 Terminal：

```bash
curl http://127.0.0.1:8000/health
```

成功输出：

```json
{"status":"ok"}
```

然后运行：

```bash
uv run pytest
```

测试通过，就可以进入数据库和 Docker Compose 阶段。

## 可直接交给 Codex 的 Prompt

```text
你是我的 Python FastAPI 后端环境助手。请基于当前 macOS 项目检查并补齐 uv + FastAPI 最小后端。

目标：
让项目能够通过 uv 安装依赖，启动 FastAPI，访问 /health 和 /docs，并运行最小测试。

约束：
1. 不要使用系统 Python 安装全局依赖。
2. 所有依赖写入 pyproject.toml。
3. 不要提交真实 .env 密钥。
4. 先读当前项目结构，再做最小改动。

任务：
1. 检查 uv 和 Python 版本。
2. 检查 pyproject.toml。
3. 添加 FastAPI app 和 /health。
4. 添加 pytest 健康检查测试。
5. 运行 uv run pytest，并说明如何启动服务。
```

## 参考来源

- [uv：Installation](https://docs.astral.sh/uv/getting-started/installation/)
- [uv：FastAPI integration](https://docs.astral.sh/uv/guides/integration/fastapi/)
- [FastAPI：First Steps](https://fastapi.tiangolo.com/tutorial/first-steps/)
- [Uvicorn：Deployment](https://www.uvicorn.org/deployment/)
- [Pydantic：Settings Management](https://docs.pydantic.dev/usage/settings/)
- [SQLModel：Learn](https://sqlmodel.tiangolo.com/learn/)
- [pytest：Get Started](https://pytest.org/en/8.0.x/getting-started.html)
