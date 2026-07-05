---
layout: post
title: "搭建 React + Tailwind 前端项目"
subtitle: "从 Vite 模板到页面组件、样式、构建和本地预览，做一个能继续扩展的前端骨架"
date: 2026-05-31 09:50:00 +0800
author: "CodeWater517"
header-img: "img/home-bg-geek.jpg"
header-mask: 0.35
tags:
  - macOS
  - React
  - Tailwind
  - 前端
  - 环境配置
last_modified_at: 2026-05-31 09:50:00 +0800
revision_history:
  - time: 2026-05-31 09:50:00 +0800
    description: "新增 React + Tailwind 前端项目搭建教程。"
---

> 这一篇不只是“让页面跑起来”。目标是搭出一个可以继续做全栈项目的前端骨架：Vite、React、TypeScript、Tailwind、格式化、lint、构建和预览都要通。

## 结论

推荐命令：

```bash
cd ~/Developer
pnpm create vite fullstack-web --template react-ts
cd fullstack-web
pnpm install
pnpm add tailwindcss @tailwindcss/vite
```

然后在 `vite.config.ts` 启用 Tailwind 插件，在 CSS 入口引入 Tailwind，最后运行：

```bash
pnpm dev
pnpm build
pnpm preview
```

## 我找到的教程类型

| 来源 | 类型 | 时间/版本 | 优点 | 问题 | 推荐度 |
| --- | --- | --- | --- | --- | ---: |
| [React Installation](https://react.dev/learn/installation) | 官方文档 | 当前在线文档 | 明确推荐框架或构建工具，不鼓励手写复杂配置 | 对 Vite 细节较少 | 5 |
| [Vite Guide](https://vite.dev/guide/) | 官方文档 | 当前在线文档 | Vite 创建和脚本说明清楚 | 不负责 Tailwind 细节 | 5 |
| [Tailwind CSS with Vite](https://tailwindcss.com/docs/installation/using-vite) | 官方文档 | 当前在线文档 | Tailwind v4 + Vite 插件路径清楚 | 老教程很多仍是 v3 写法 | 5 |
| [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss) | 官方市场页 | 当前市场页 | 解释 VS Code 补全激活条件 | 新手要先理解 CSS 入口 | 5 |
| [Vitest Getting Started](https://vitest.dev/guide/) | 官方文档 | 当前在线文档 | 与 Vite 生态贴合 | 本篇只做基础验证 | 4 |
| [Testing Library React](https://testing-library.com/docs/react-testing-library/intro/) | 官方文档 | 当前在线文档 | 适合后续写组件测试 | 初始项目可暂缓 | 4 |

## 1. 创建项目

在哪里运行：Terminal。

```bash
cd ~/Developer
pnpm create vite fullstack-web --template react-ts
cd fullstack-web
pnpm install
```

这一步在做什么：创建一个 React + TypeScript 的 Vite 项目，并安装依赖。

成功后目录大致是：

```text
fullstack-web/
  index.html
  package.json
  src/
    App.tsx
    main.tsx
```

## 2. 启动开发服务器

```bash
pnpm dev
```

成功信号：

```text
Local:   http://localhost:5173/
```

打开浏览器。如果你看到 Vite + React 默认页面，说明 React 项目跑起来了。

停止服务器：在 Terminal 里按 `Ctrl+C`。

## 3. 安装 Tailwind

Tailwind v4 在 Vite 项目里的推荐方式是安装 Tailwind 和 Vite 插件：

```bash
pnpm add tailwindcss @tailwindcss/vite
```

然后修改 `vite.config.ts`：

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
```

再修改 CSS 入口，通常是 `src/index.css`：

```css
@import "tailwindcss";
```

这一步在做什么：让 Vite 在开发和构建时处理 Tailwind。

为什么需要：Tailwind class 不是浏览器天然认识的东西，需要构建工具把它转换成 CSS。

## 4. 写一个最小页面

修改 `src/App.tsx`：

```tsx
function App() {
  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-10 text-zinc-50">
      <section className="mx-auto max-w-3xl">
        <p className="text-sm font-medium text-cyan-300">macOS Full Stack</p>
        <h1 className="mt-3 text-4xl font-bold tracking-normal">
          React + Tailwind 项目已经跑起来了
        </h1>
        <p className="mt-4 text-lg leading-8 text-zinc-300">
          接下来可以继续连接 FastAPI 后端、PostgreSQL 数据库和 Redis 缓存。
        </p>
        <button className="mt-8 rounded-md bg-cyan-400 px-4 py-2 font-semibold text-zinc-950 hover:bg-cyan-300">
          开始开发
        </button>
      </section>
    </main>
  );
}

export default App;
```

保存后浏览器应自动刷新。

## 5. 清理默认样式

Vite 模板可能自带 `App.css` 和 logo。学习阶段可以删除不用的样式和图片引用，但不要乱删入口文件。

保留最小结构：

```text
src/
  App.tsx
  index.css
  main.tsx
```

`main.tsx` 通常保持：

```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

## 6. 添加环境变量

前端连接后端时不要把 API 地址写死在组件里。创建 `.env.local`：

```bash
printf "VITE_API_BASE_URL=http://127.0.0.1:8000\n" > .env.local
```

在代码里读取：

```ts
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
```

Vite 只会把 `VITE_` 开头的环境变量暴露给前端。不要把密钥、数据库密码、私有 token 放进前端环境变量。

## 7. 添加一个 API 请求函数

创建 `src/api.ts`：

```ts
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8000";

export async function getHealth() {
  const response = await fetch(`${apiBaseUrl}/health`);

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return response.json() as Promise<{ status: string }>;
}
```

这一步在做什么：把请求逻辑从 UI 组件里分离出来。

为什么需要：后面项目变大时，组件只负责展示，API 模块负责请求。

## 8. 构建和预览

运行：

```bash
pnpm build
pnpm preview
```

`pnpm build` 会生成 `dist/`。

`pnpm preview` 会用本地服务器预览构建结果。

成功信号：

```text
Local: http://localhost:4173/
```

开发服务器能跑，不代表生产构建一定能过。所以每次准备提交前都应该跑 `pnpm build`。

## 9. 加上最小测试准备

如果你要写组件测试，可以加：

```bash
pnpm add -D vitest jsdom @testing-library/react @testing-library/jest-dom
```

再在 `package.json` 加脚本：

```json
{
  "scripts": {
    "test": "vitest"
  }
}
```

本篇先不展开测试，后面的测试篇会讲。现在至少要知道：前端测试也应该是项目依赖，不应该依赖全局安装。

## 10. 常见错误与解决

### Tailwind class 没效果

检查三件事：

1. 是否安装了 `tailwindcss` 和 `@tailwindcss/vite`；
2. `vite.config.ts` 是否加入 `tailwindcss()`；
3. CSS 入口是否有 `@import "tailwindcss";`；
4. `main.tsx` 是否引入了这个 CSS 文件。

### VS Code 没有 Tailwind 提示

检查：

- 是否安装官方 Tailwind CSS IntelliSense；
- 是否打开的是项目根目录；
- Tailwind 是否已经安装在项目里；
- CSS 入口是否能被扩展识别。

### `fetch` 后端失败

常见原因：

- 后端没启动；
- API 地址写错；
- CORS 没配置；
- 浏览器访问的是 HTTPS，但后端是 HTTP；
- Docker 里访问 host 和本机访问 host 地址不同。

先用浏览器或接口工具访问：

```text
http://127.0.0.1:8000/health
```

确认后端真的可用。

### `pnpm build` 报 TypeScript 错

不要只看 `pnpm dev`。开发服务器有时能显示页面，但类型检查在 build 才失败。

先读错误文件和行号，再修类型。不要用 `any` 把错误盖过去，除非你知道边界。

## 验证方式

在项目根目录运行：

```bash
pnpm dev
pnpm build
pnpm preview
```

检查：

- `http://localhost:5173` 能看到开发页面；
- `dist/` 被生成；
- `http://localhost:4173` 能看到预览页面；
- Tailwind 样式生效；
- VS Code 有 Tailwind 补全。

## 可直接交给 Codex 的 Prompt

```text
你是我的 React + Tailwind 项目搭建助手。请基于当前 macOS 项目检查并补齐最小前端骨架。

目标：
让 Vite + React + TypeScript + Tailwind 项目能够 dev、build、preview。

约束：
1. 不要删除业务文件，除非我确认。
2. 优先使用 Tailwind 官方 Vite 插件方案。
3. 不要把 API 密钥或数据库密码写进前端环境变量。
4. 所有依赖安装到项目本地。

任务：
1. 检查 package.json、vite.config.ts、src/main.tsx、src/index.css。
2. 判断 Tailwind 是否正确接入。
3. 添加或修复最小页面。
4. 运行 pnpm build 验证。
5. 输出如何启动和如何排错。
```

## 参考来源

- [React：Installation](https://react.dev/learn/installation)
- [Vite：Getting Started](https://vite.dev/guide/)
- [Tailwind CSS：Install Tailwind CSS with Vite](https://tailwindcss.com/docs/installation/using-vite)
- [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)
- [Vitest：Getting Started](https://vitest.dev/guide/)
- [Testing Library：React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
