---
layout: post
title: "安装 Node.js、pnpm、TypeScript、Vite"
subtitle: "把前端项目的运行时、包管理器、类型系统和开发服务器一次理顺"
date: 2026-05-31 09:40:00 +0800
author: "CodeWater517"
header-img: "img/home-bg-geek.jpg"
header-mask: 0.35
tags:
  - macOS
  - Node.js
  - 前端
  - TypeScript
  - 环境配置
last_modified_at: 2026-05-31 09:40:00 +0800
revision_history:
  - time: 2026-05-31 09:40:00 +0800
    description: "新增 Node.js、pnpm、TypeScript、Vite 安装教程。"
---

> 前端环境的核心不是“装一个 Node 就完事”。你需要知道 Node.js 是运行时，pnpm 是包管理器，TypeScript 是类型系统，Vite 是项目脚手架和开发服务器。

## 结论

推荐主线：

```text
安装 Node.js LTS
-> 启用或安装 pnpm
-> 创建 Vite + TypeScript 项目
-> 本地安装 TypeScript、ESLint、Prettier
-> 跑 dev / build / preview
```

不要在同一个项目里混用 `npm install`、`yarn install`、`pnpm install`。选一个包管理器，并提交对应 lockfile。

## 我找到的教程类型

| 来源 | 类型 | 时间/版本 | 优点 | 问题 | 推荐度 |
| --- | --- | --- | --- | --- | ---: |
| [Node.js Downloads](https://nodejs.org/en/download/) | 官方入口 | 当前在线页面 | 提供 LTS 与不同安装方式 | 对包管理器取舍讲得少 | 5 |
| [pnpm Installation](https://pnpm.io/installation) | 官方文档 | 当前在线文档 | 安装方式完整 | Corepack 与 standalone 对新手略绕 | 5 |
| [Vite Guide](https://vite.dev/guide/) | 官方文档 | 当前在线文档 | 创建项目和 dev/build 命令清楚 | 不负责 macOS 全局环境解释 | 5 |
| [TypeScript npm package](https://www.npmjs.com/package/typescript) | 官方包页 | 当前包信息 | 安装命令和版本信息明确 | 不适合作为学习教程 | 4 |
| [ESLint Getting Started](https://eslint.org/docs/latest/use/getting-started) | 官方文档 | 当前在线文档 | Node 版本要求、flat config 说明清楚 | 与 Vite 模板结合需要筛选 | 5 |
| [Prettier Install](https://prettier.io/docs/install.html) | 官方文档 | 当前在线文档 | 强调本地依赖和精确版本 | 不讲 Vite 项目组织 | 5 |
| [npm install docs](https://docs.npmjs.com/cli-documentation/install) | 官方文档 | 当前在线文档 | 解释 lockfile 和依赖安装 | npm 不是本文主线 | 4 |

## 1. 安装 Node.js

有三种常见方式：

| 方式 | 适合谁 | 本系列建议 |
| --- | --- | --- |
| 官网 pkg | 只需要稳定 Node.js 的新手 | 可以 |
| Homebrew `brew install node` | 已经使用 Homebrew 的用户 | 可以 |
| nvm/fnm/mise | 需要多版本切换的用户 | 以后再学 |

本系列为了保持简单，优先 Homebrew：

```bash
brew install node
```

验证：

```bash
node -v
npm -v
which node
```

成功信号：

```text
v24.x.x
```

或者你安装的是 LTS 版本，也可能看到 `v22.x.x`。关键是不要使用特别旧的 Node 版本。ESLint 当前文档要求 Node.js 至少满足较新的版本范围，Vite 也会随着版本提高要求。

## 2. 安装 pnpm

推荐方式一：使用 Corepack。

```bash
corepack enable pnpm
corepack prepare pnpm@latest --activate
pnpm -v
```

推荐方式二：如果 Corepack 不可用，用 Homebrew。

```bash
brew install pnpm
pnpm -v
```

这一步在做什么：安装 pnpm 包管理器。

为什么需要：pnpm 安装依赖快，磁盘复用好，也适合以后 monorepo 项目。更重要的是，本系列后续前端命令统一用 pnpm，减少认知负担。

## 3. npm、pnpm、yarn、bun 怎么选

新手建议：

| 工具 | 建议 |
| --- | --- |
| npm | 认识它，因为 Node.js 自带 |
| pnpm | 本系列主线使用 |
| yarn | 遇到旧项目再学 |
| bun | 以后再试，不作为第一条主线 |

一个项目里只保留一个 lockfile：

| 包管理器 | lockfile |
| --- | --- |
| npm | `package-lock.json` |
| pnpm | `pnpm-lock.yaml` |
| yarn | `yarn.lock` |

如果你看到一个项目已经有 `pnpm-lock.yaml`，就运行 `pnpm install`，不要再运行 `npm install`。

## 4. 创建 Vite + TypeScript 项目

在哪里运行：建议在 `~/Developer`。

```bash
cd ~/Developer
pnpm create vite macos-vite-demo --template react-ts
cd macos-vite-demo
pnpm install
pnpm dev
```

这一步在做什么：

- `pnpm create vite` 创建项目模板；
- `--template react-ts` 使用 React + TypeScript；
- `pnpm install` 安装依赖；
- `pnpm dev` 启动开发服务器。

成功信号：

```text
Local:   http://localhost:5173/
```

打开浏览器访问这个地址，能看到 Vite 页面。

## 5. 理解项目目录

Vite React TypeScript 项目常见结构：

```text
macos-vite-demo/
  index.html
  package.json
  tsconfig.json
  vite.config.ts
  src/
    App.tsx
    main.tsx
```

解释：

- `package.json`：项目脚本和依赖清单。
- `pnpm-lock.yaml`：精确依赖版本锁定文件。
- `vite.config.ts`：Vite 配置。
- `tsconfig.json`：TypeScript 配置。
- `src/main.tsx`：前端入口。
- `src/App.tsx`：默认页面组件。

## 6. 本地安装 TypeScript

Vite 模板通常已经带 TypeScript。你可以验证：

```bash
pnpm exec tsc --version
```

如果需要手动安装：

```bash
pnpm add -D typescript
```

这一步在做什么：把 TypeScript 编译器作为项目开发依赖安装。

为什么不是全局安装？因为项目应该自己声明需要哪个 TypeScript 版本。不同项目可能依赖不同版本，全局安装会造成“我电脑能跑，你电脑不行”。

## 7. 添加 Prettier

```bash
pnpm add -D prettier
printf "{}\n" > .prettierrc
printf "dist\ncoverage\nnode_modules\n" > .prettierignore
pnpm exec prettier . --check
```

这一步在做什么：安装格式化工具，并添加最小配置。

成功信号：

```text
All matched files use Prettier code style!
```

如果检查失败，可以运行：

```bash
pnpm exec prettier . --write
```

注意：这会修改文件。团队项目里先看 diff 再提交。

## 8. 添加 ESLint

Vite React 模板通常已经带 ESLint 配置。检查：

```bash
pnpm lint
```

如果项目没有 ESLint，可以用官方初始化：

```bash
pnpm create @eslint/config@latest
```

ESLint 负责发现问题，不是负责“把代码排得好看”。格式交给 Prettier，代码质量交给 ESLint。

## 9. 常用脚本

查看 `package.json`：

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  }
}
```

你应该熟悉这些命令：

```bash
pnpm dev
pnpm build
pnpm lint
pnpm preview
```

含义：

- `pnpm dev`：开发时启动热更新服务器。
- `pnpm build`：生成生产构建。
- `pnpm lint`：检查代码。
- `pnpm preview`：本地预览生产构建结果。

## 10. 常见错误与解决

### `node: command not found`

Node.js 没安装或 PATH 没生效。

检查：

```bash
which node
brew list node
```

如果 Homebrew 安装成功但找不到命令，回到 Homebrew PATH 配置那篇检查 `brew shellenv`。

### `pnpm: command not found`

先试：

```bash
corepack enable pnpm
pnpm -v
```

如果失败：

```bash
brew install pnpm
```

### `Cannot find module`

通常是依赖没安装：

```bash
pnpm install
```

如果你刚从 GitHub clone 项目，第一步永远先看 README，然后安装依赖。

### 端口 5173 被占用

Vite 会自动尝试下一个端口。也可以指定：

```bash
pnpm dev -- --port 5174
```

### `Unsupported engine`

说明当前 Node.js 版本不符合项目要求。查看：

```bash
node -v
cat package.json
```

如果项目明确写了 `engines.node`，以项目为准。

## 验证方式

最终检查：

```bash
node -v
npm -v
pnpm -v
pnpm create vite --help
pnpm exec tsc --version
```

在 demo 项目中：

```bash
pnpm install
pnpm lint
pnpm build
pnpm preview
```

浏览器能打开 Vite 页面，终端没有报错，就完成了前端基础环境。

## 可直接交给 Codex 的 Prompt

```text
你是我的前端环境检查助手。请在当前 macOS 项目中检查 Node.js、pnpm、TypeScript 和 Vite。

目标：
确认项目能安装依赖、启动开发服务器、通过 lint、完成生产构建。

请执行：
1. 检查 node、npm、pnpm 版本。
2. 读取 package.json，说明 scripts 和依赖。
3. 判断项目使用 npm 还是 pnpm，不要混用。
4. 运行安装、lint、build 的最小验证命令。
5. 如果失败，解释错误原因并给出最小修复建议。

约束：
- 不要删除 lockfile，除非我明确确认。
- 不要升级全部依赖。
- 不要自动改格式，除非我确认。
```

## 参考来源

- [Node.js：Downloads](https://nodejs.org/en/download/)
- [pnpm：Installation](https://pnpm.io/installation)
- [Vite：Getting Started](https://vite.dev/guide/)
- [React：Installation](https://react.dev/learn/installation)
- [TypeScript npm package](https://www.npmjs.com/package/typescript)
- [ESLint：Getting Started](https://eslint.org/docs/latest/use/getting-started)
- [Prettier：Install](https://prettier.io/docs/install.html)
- [npm Docs：install](https://docs.npmjs.com/cli-documentation/install)
