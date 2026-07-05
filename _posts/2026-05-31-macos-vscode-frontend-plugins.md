---
layout: post
title: "安装 VS Code 与前端开发插件"
subtitle: "少装、装准、能格式化、能检查、能调试，才是舒服的编辑器环境"
date: 2026-05-31 09:30:00 +0800
author: "CodeWater517"
header-img: "img/home-bg-geek.jpg"
header-mask: 0.35
tags:
  - macOS
  - VS Code
  - 前端
  - 环境配置
  - 开发工具
last_modified_at: 2026-05-31 09:30:00 +0800
revision_history:
  - time: 2026-05-31 09:30:00 +0800
    description: "新增 VS Code 与前端插件安装教程。"
---

> 编辑器不是越花越好。对全栈学习来说，VS Code 的目标很明确：打开项目、看类型提示、格式化代码、发现错误、调试前后端、管理 Git、辅助 Docker。

## 结论

推荐先装 VS Code 本体和这几个扩展：

```text
ESLint
Prettier - Code formatter
Tailwind CSS IntelliSense
Docker
GitLens
REST Client
```

后续按项目补 Python、Playwright、PostgreSQL、Dev Containers 等扩展。不要一开始装一大包来源不明的插件。

## 我找到的教程类型

| 来源 | 类型 | 时间/版本 | 优点 | 问题 | 推荐度 |
| --- | --- | --- | --- | --- | ---: |
| [VS Code macOS Setup](https://code.visualstudio.com/docs/setup/mac) | 官方文档 | 当前在线文档 | 安装、拖入 Applications、`code` 命令讲得清楚 | 不给前端插件组合建议 | 5 |
| [ESLint VS Code Extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) | 官方市场页 | 当前市场页 | 明确建议使用项目本地 ESLint | 配置细节较多 | 5 |
| [Prettier Install](https://prettier.io/docs/install.html) | 官方文档 | 当前在线文档 | 强调项目本地安装和 `.prettierrc` | 编辑器设置需另看 | 5 |
| [Prettier Editor Integration](https://prettier.io/docs/editors.html) | 官方文档 | 当前在线文档 | 解释 VS Code 扩展和编辑器集成 | 不讲 ESLint 协作 | 5 |
| [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss) | 官方市场页 | 当前市场页 | 说明激活条件和推荐设置 | Tailwind v4 项目要注意 CSS 入口 | 5 |
| [VS Code Security: Workspace Trust](https://code.visualstudio.com/docs/editing/workspaces/workspace-trust) | 官方文档 | 当前在线文档 | 适合解释为什么不要随便信任陌生项目 | 新手可能忽略 | 4 |
| [Sourabh Bajaj VS Code Setup](https://sourabhbajaj.com/mac-setup/VisualStudioCode/) | 社区教程 | 长期维护 | 命令行打开 VS Code 等经验实用 | 扩展选择需更新筛选 | 4 |

## 1. 安装 VS Code

有两种方式。

方式一：官网下载。

打开：

```text
https://code.visualstudio.com/docs/setup/mac
```

下载适合你的 Mac 的版本，解压后拖到 Applications。

方式二：Homebrew Cask。

```bash
brew install --cask visual-studio-code
```

这一步在做什么：安装 VS Code 图形应用。

成功信号：Launchpad 或 Applications 里能看到 Visual Studio Code。

## 2. 安装 `code` 命令

打开 VS Code，按：

```text
Cmd + Shift + P
```

输入：

```text
Shell Command: Install 'code' command in PATH
```

回车执行。

验证：

```bash
code --version
```

这一步在做什么：让你能在 Terminal 里用 `code .` 打开当前项目。

为什么需要：全栈项目经常在终端里创建目录、clone 仓库，然后直接打开编辑器。

## 3. 建立一个练习目录

```bash
mkdir -p ~/Developer/vscode-check
cd ~/Developer/vscode-check
code .
```

成功信号：VS Code 打开 `vscode-check` 文件夹。

如果 VS Code 弹出 Workspace Trust，自己创建的目录可以信任；从网上下载的陌生项目，先不要盲目信任，尤其不要立刻运行脚本。

## 4. 安装核心扩展

你可以在扩展面板搜索，也可以用命令：

```bash
code --install-extension dbaeumer.vscode-eslint
code --install-extension esbenp.prettier-vscode
code --install-extension bradlc.vscode-tailwindcss
code --install-extension ms-azuretools.vscode-docker
code --install-extension eamodio.gitlens
code --install-extension humao.rest-client
```

每个扩展的作用：

| 扩展 | 作用 |
| --- | --- |
| ESLint | 在 JS/TS 项目里发现潜在问题 |
| Prettier | 统一代码格式 |
| Tailwind CSS IntelliSense | Tailwind class 自动补全和提示 |
| Docker | 查看容器、镜像、Compose 服务 |
| GitLens | 更清楚地看 Git 历史 |
| REST Client | 在 VS Code 里发 HTTP 请求 |

## 5. 区分“编辑器扩展”和“项目依赖”

这是新手最容易混淆的点。

VS Code 扩展只是编辑器能力。真正决定项目怎么 lint、format、build 的，应该是项目里的依赖和配置。

例如：

```bash
pnpm add -D eslint prettier typescript
```

这些装在项目里。VS Code 的 ESLint 扩展会调用项目本地 ESLint，而不是自己凭空检查代码。

这样做的好处：

- 团队每个人使用同一套规则；
- CI 可以复现；
- 不依赖你个人编辑器状态；
- 换电脑也不怕。

## 6. 推荐 VS Code 设置

打开 Settings JSON：

```text
Cmd + Shift + P -> Preferences: Open User Settings (JSON)
```

可以先使用：

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "files.trimTrailingWhitespace": true,
  "files.insertFinalNewline": true,
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.quickSuggestions": {
    "strings": "on"
  }
}
```

这一步在做什么：保存时自动格式化，允许 ESLint 执行安全的自动修复，让 Tailwind 在字符串里也能提示。

注意：如果团队项目已经提供 `.vscode/settings.json`，以项目设置为准。

## 7. 给项目加推荐扩展

在项目里创建：

```text
.vscode/extensions.json
```

内容：

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "ms-azuretools.vscode-docker",
    "humao.rest-client"
  ]
}
```

这一步在做什么：告诉项目协作者推荐安装哪些扩展。

不要把个人偏好的主题、图标包、字体扩展强塞进项目推荐里。项目推荐只放“运行和维护项目需要”的扩展。

## 8. 检查格式化是否正常

创建 `demo.js`：

```js
const user={name:"CodeWater",tools:["VS Code","ESLint","Prettier"]}
console.log(user)
```

保存文件。

如果 Prettier 工作正常，会变成类似：

```js
const user = { name: "CodeWater", tools: ["VS Code", "ESLint", "Prettier"] };
console.log(user);
```

如果没有变化，检查：

- Prettier 扩展是否启用；
- 当前语言是否支持；
- 是否设置了默认 formatter；
- 工作区是否处于 Restricted Mode；
- 项目是否有冲突的格式化扩展。

## 9. 检查 ESLint 是否正常

在真正的前端项目里运行：

```bash
pnpm create vite eslint-check --template react-ts
cd eslint-check
pnpm install
pnpm add -D eslint
```

如果项目已有 ESLint 配置，打开文件时 VS Code 底部会显示 ESLint 状态。错误会在 Problems 面板出现。

ESLint 官方建议项目本地安装 ESLint，这样规则和版本由项目控制。

## 10. 常见错误与解决

### `code: command not found`

说明 `code` 命令没装进 PATH。

解决：

```text
VS Code -> Cmd+Shift+P -> Shell Command: Install 'code' command in PATH
```

然后重开 Terminal。

### 保存时没有自动格式化

检查：

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode"
}
```

如果项目没有安装 Prettier，也可以先装：

```bash
pnpm add -D prettier
```

### ESLint 和 Prettier 打架

原则：Prettier 管格式，ESLint 管代码质量。

如果某些格式规则冲突，优先用项目模板推荐配置，不要自己东改一点西改一点。React + Vite 项目一般先保持模板默认，再按团队需要加规则。

### Tailwind 没有提示

检查：

- 项目里是否安装 Tailwind；
- CSS 入口是否正确引入 Tailwind；
- VS Code 打开的是否是项目根目录；
- Tailwind 扩展 Output 面板有没有错误。

Tailwind IntelliSense 需要识别项目里的 Tailwind 安装和配置，不是装了扩展就对任何字符串都生效。

### 扩展太多导致卡顿

打开：

```text
Developer: Show Running Extensions
```

禁用不必要扩展。对全栈新手来说，稳定比花哨重要。

## 验证方式

最终检查：

```bash
code --version
code --list-extensions
```

确认列表里包含：

```text
dbaeumer.vscode-eslint
esbenp.prettier-vscode
bradlc.vscode-tailwindcss
ms-azuretools.vscode-docker
eamodio.gitlens
humao.rest-client
```

再确认：

- `code .` 能打开当前目录；
- 保存 JS/TS 文件能格式化；
- 前端项目里 ESLint 能显示问题；
- Tailwind class 有补全；
- Docker 扩展能看到本机 Docker 状态。

## 可直接交给 Codex 的 Prompt

```text
你是我的 VS Code 前端开发环境检查助手。请只检查和建议，不要删除配置。

目标：
确认 macOS 上 VS Code、code 命令、ESLint、Prettier、Tailwind、Docker、GitLens、REST Client 是否配置合理。

请检查：
1. `code --version` 是否可用。
2. `code --list-extensions` 是否包含核心扩展。
3. 当前项目是否有 `.vscode/extensions.json`。
4. 当前项目是否把 ESLint、Prettier 放在项目依赖里。
5. 是否存在多个 formatter 冲突。
6. 给出最小可行的 settings.json 建议。

约束：
- 不要安装来源不明的扩展。
- 不要覆盖已有项目设置，先说明差异。
- 不要改用户全局设置，除非我确认。
```

## 参考来源

- [VS Code：Setup on macOS](https://code.visualstudio.com/docs/setup/mac)
- [VS Code：Workspace Trust](https://code.visualstudio.com/docs/editing/workspaces/workspace-trust)
- [ESLint VS Code Extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Prettier：Install](https://prettier.io/docs/install.html)
- [Prettier：Editor Integration](https://prettier.io/docs/editors.html)
- [Prettier VS Code Extension](https://github.com/prettier/prettier-vscode)
- [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)
- [Sourabh Bajaj：Visual Studio Code](https://sourabhbajaj.com/mac-setup/VisualStudioCode/)
