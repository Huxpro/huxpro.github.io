---
layout: post
title: "配置接口调试、测试工具与本地 HTTPS"
subtitle: "用 Bruno/Postman、curl、Vitest、Playwright、pytest 和 mkcert 建立开发验证习惯"
date: 2026-05-31 10:40:00 +0800
author: "CodeWater517"
header-img: "img/home-bg-geek.jpg"
header-mask: 0.35
tags:
  - macOS
  - 测试
  - HTTPS
  - 全栈
  - 工程实践
last_modified_at: 2026-05-31 10:40:00 +0800
revision_history:
  - time: 2026-05-31 10:40:00 +0800
    description: "新增接口调试、测试工具与本地 HTTPS 教程。"
---

> 环境能启动不等于项目可靠。你还需要会调接口、写最小测试、看错误、必要时启用本地 HTTPS。这篇把验证工具补齐。

## 结论

推荐组合：

```text
curl / HTTPie：快速命令行检查
Bruno 或 Postman：保存接口集合
pytest：后端测试
Vitest：前端单元测试
Playwright：端到端测试
mkcert：本地 HTTPS 证书
ngrok 或 cloudflared：临时外网回调
```

工具不用一次全上。先保证每个项目至少有 `/health`、接口集合、一个后端测试、一个前端构建验证。

## 我找到的教程类型

| 来源 | 类型 | 时间/版本 | 优点 | 问题 | 推荐度 |
| --- | --- | --- | --- | --- | ---: |
| [Postman Install](https://learning.postman.com/docs/getting-started/installation/install-overview/) | 官方文档 | 当前在线文档 | 安装和账号体系完整 | 项目文件版本化不如 Bruno 直观 | 4 |
| [Bruno Download](https://docs.usebruno.com/get-started/bruno-basics/download) | 官方文档 | 当前在线文档 | 本地优先，集合适合进 Git | 生态比 Postman 小 | 5 |
| [Playwright Installation](https://playwright.dev/docs/intro) | 官方文档 | 当前在线文档 | 跨浏览器 E2E 测试完整 | 初学要控制范围 | 5 |
| [Vitest Getting Started](https://vitest.dev/guide/) | 官方文档 | 当前在线文档 | 与 Vite 项目贴合 | 需要补 React Testing Library | 5 |
| [pytest Get Started](https://pytest.org/en/8.0.x/getting-started.html) | 官方文档 | 当前在线文档 | Python 测试入门清楚 | FastAPI TestClient 需另配 | 5 |
| [mkcert GitHub](https://github.com/FiloSottile/mkcert) | 官方仓库 | 当前仓库 | 本地可信证书事实标准 | rootCA-key 风险必须说明 | 5 |
| [ngrok Download](https://ngrok.com/download) / [cloudflared Downloads](https://developers.cloudflare.com/tunnel/downloads/) | 官方文档 | 当前在线文档 | 本地服务临时暴露给外网 | 涉及账号和安全边界 | 4 |

## 1. 命令行接口检查

先用 `curl`：

```bash
curl http://127.0.0.1:8000/health
```

成功信号：

```json
{"status":"ok"}
```

看响应头：

```bash
curl -i http://127.0.0.1:8000/health
```

发送 JSON：

```bash
curl -X POST http://127.0.0.1:8000/items \
  -H "Content-Type: application/json" \
  -d '{"title":"Learn fullstack"}'
```

这一步在做什么：用最小工具确认 API 是否真的可用。GUI 工具很好，但命令行检查更适合复制到 README、CI 和排错记录里。

## 2. 选择 Bruno 或 Postman

Bruno：

```bash
brew install --cask bruno
```

Postman：

```bash
brew install --cask postman
```

建议：

| 工具 | 适合 |
| --- | --- |
| Bruno | 本地优先、接口集合想放进 Git、轻量项目 |
| Postman | 团队已经在用、需要云同步和更完整平台能力 |

学习项目我更推荐 Bruno，因为集合文件可以和项目一起版本管理。

## 3. 建立接口集合

至少保存这些请求：

```text
GET http://127.0.0.1:8000/health
GET http://127.0.0.1:8000/docs
POST http://127.0.0.1:8000/items
GET http://127.0.0.1:8000/items
```

每个请求都写清：

- URL；
- 方法；
- headers；
- body；
- 预期状态码；
- 示例响应。

接口集合不是为了好看，是为了以后排错时能快速复现。

## 4. 后端测试：pytest

在 FastAPI 项目中：

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
    assert response.json()["status"] == "ok"
```

运行：

```bash
uv run pytest
```

成功信号：

```text
1 passed
```

先从健康检查开始。不要第一天就追求复杂测试体系。

## 5. 前端测试：Vitest

在 Vite React 项目中：

```bash
pnpm add -D vitest jsdom @testing-library/react @testing-library/jest-dom
```

在 `package.json` 加：

```json
{
  "scripts": {
    "test": "vitest",
    "test:run": "vitest run"
  }
}
```

创建 `src/App.test.tsx`：

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("App", () => {
  it("renders the main heading", () => {
    render(<App />);
    expect(screen.getByRole("heading")).toBeTruthy();
  });
});
```

运行：

```bash
pnpm test:run
```

## 6. 端到端测试：Playwright

安装：

```bash
pnpm create playwright
```

按提示选择 TypeScript。

运行：

```bash
pnpm exec playwright test
pnpm exec playwright show-report
```

最小测试目标：

- 打开首页；
- 点击一个按钮；
- 确认页面显示 API 数据；
- 表单提交后看到成功状态。

Playwright 很强，但不要把所有测试都写成 E2E。E2E 慢，适合覆盖关键用户路径。

## 7. 本地 HTTPS：mkcert

安装：

```bash
brew install mkcert
brew install nss
mkcert -install
```

生成 localhost 证书：

```bash
mkdir -p certs
mkcert -key-file certs/localhost-key.pem -cert-file certs/localhost.pem localhost 127.0.0.1 ::1
```

这一步在做什么：创建被本机信任的本地证书。

为什么需要：有些浏览器 API、OAuth 回调、第三方 webhook、本地 cookie 策略需要 HTTPS 才能真实模拟。

重要安全提醒：mkcert 会生成本地 CA，`rootCA-key.pem` 权限很高。不要分享，不要提交到 Git。

## 8. Vite 使用 HTTPS

安装插件或直接配置证书。简单示例：

```ts
import fs from "node:fs";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    https: {
      key: fs.readFileSync("certs/localhost-key.pem"),
      cert: fs.readFileSync("certs/localhost.pem"),
    },
  },
});
```

然后：

```bash
pnpm dev
```

访问：

```text
https://localhost:5173
```

如果只是普通学习项目，不一定要开启 HTTPS。需要时再加。

## 9. 临时外网访问：ngrok 或 cloudflared

ngrok：

```bash
brew install ngrok
ngrok http 8000
```

cloudflared：

```bash
brew install cloudflared
cloudflared tunnel --url http://localhost:8000
```

用途：

- 测试第三方 webhook；
- 给手机或别人临时访问；
- 测试 OAuth 回调。

安全提醒：

- 不要暴露后台管理接口；
- 不要暴露无密码数据库；
- 不要把临时公网 URL 发到公开群；
- 用完就关。

## 10. 常见错误与解决

### API 工具能请求，浏览器前端不行

多半是 CORS。API 工具不受浏览器同源策略限制，浏览器受限制。

检查后端 CORS 配置是否允许前端地址。

### pytest 找不到模块

确认你在项目根目录运行：

```bash
uv run pytest
```

不要用系统 Python 直接跑。

### Vitest 报 DOM 不存在

React 组件测试通常需要 `jsdom` 环境。检查 Vitest 配置是否设置：

```ts
test: {
  environment: "jsdom"
}
```

### Playwright 第一次运行很慢

Playwright 会安装浏览器。第一次慢是正常的。失败时根据提示运行：

```bash
pnpm exec playwright install
```

### HTTPS 证书仍然不被信任

确认运行过：

```bash
mkcert -install
mkcert -CAROOT
```

如果用 Firefox，安装 `nss` 后重新执行 `mkcert -install`。

## 验证方式

最终检查：

```bash
curl http://127.0.0.1:8000/health
uv run pytest
pnpm test:run
pnpm exec playwright test
mkcert -CAROOT
```

至少做到：

- API 健康检查可请求；
- 后端测试通过；
- 前端测试通过；
- E2E 测试能打开页面；
- HTTPS 证书文件不提交到 Git。

## 可直接交给 Codex 的 Prompt

```text
你是我的全栈项目验证助手。请为当前项目补齐接口调试、自动化测试和本地 HTTPS 检查方案。

目标：
让项目至少具备 curl 健康检查、Bruno/Postman 请求说明、pytest 后端测试、Vitest 前端测试、Playwright E2E 测试建议，以及 mkcert 本地 HTTPS 方案。

约束：
1. 不要提交证书私钥。
2. 不要暴露真实 token、数据库密码或 webhook secret。
3. 测试先覆盖健康检查和关键路径，不要过度复杂。
4. 如果需要修改配置，先说明原因。

最终输出：
- 新增或建议的测试命令
- 如何运行
- 成功信号
- 常见失败原因
```

## 参考来源

- [Postman：Install Postman](https://learning.postman.com/docs/getting-started/installation/install-overview/)
- [Bruno：Download](https://docs.usebruno.com/get-started/bruno-basics/download)
- [pytest：Get Started](https://pytest.org/en/8.0.x/getting-started.html)
- [Vitest：Getting Started](https://vitest.dev/guide/)
- [Playwright：Installation](https://playwright.dev/docs/intro)
- [Playwright：Running and debugging tests](https://playwright.dev/docs/running-tests)
- [mkcert：GitHub repository](https://github.com/FiloSottile/mkcert)
- [ngrok：Download](https://ngrok.com/download)
- [Cloudflare：cloudflared downloads](https://developers.cloudflare.com/tunnel/downloads/)
