---
layout: post
title: "安装 Xcode Command Line Tools、Homebrew 和基础命令行工具"
subtitle: "把 macOS 从普通电脑变成可安装、可编译、可排查的开发机器"
date: 2026-05-31 09:10:00 +0800
author: "CodeWater517"
header-img: "img/home-bg-geek.jpg"
header-mask: 0.35
tags:
  - macOS
  - 环境配置
  - Homebrew
  - 命令行
  - 开发工具
last_modified_at: 2026-05-31 09:10:00 +0800
revision_history:
  - time: 2026-05-31 09:10:00 +0800
    description: "新增 Xcode Command Line Tools、Homebrew 与 CLI 工具安装教程。"
---

> 这一步是整个 macOS 开发环境的地基。先把 Command Line Tools、Homebrew 和常用命令行工具装好，后面装 Node.js、Python、PostgreSQL、Redis、Docker 辅助工具才会顺。

## 结论

推荐路径：

```text
检查 Mac 架构
-> 安装 Xcode Command Line Tools
-> 安装 Homebrew
-> 配置 Homebrew PATH
-> 安装常用 CLI 工具
-> 跑验证命令
```

不要一开始就复制一长串“装机脚本”。先知道每一步在改什么，这样以后换电脑、升级系统、报错时不会慌。

## 我找到的教程类型

| 来源 | 类型 | 时间/版本 | 优点 | 问题 | 推荐度 |
| --- | --- | --- | --- | --- | ---: |
| [Apple Command Line Tools](https://developer.apple.com/documentation/xcode/installing-the-command-line-tools/) | 官方文档 | 当前在线文档 | `xcode-select --install`、安装路径、版本检查都讲清楚 | 偏 Apple 开发语境 | 5 |
| [Homebrew Installation](https://docs.brew.sh/Installation.html) | 官方文档 | 当前在线文档 | Apple Silicon `/opt/homebrew` 与 Intel `/usr/local` 说明准确 | 新手容易跳过 shellenv | 5 |
| [Homebrew Manpage](https://docs.brew.sh/Manpage) | 官方文档 | 当前在线文档 | `brew doctor`、`brew update`、formula/cask 概念完整 | 篇幅长，不适合第一次通读 | 5 |
| [Homebrew Troubleshooting](https://docs.brew.sh/Troubleshooting) | 官方排错 | 当前在线文档 | 适合处理安装和更新异常 | 不负责解释全栈背景 | 5 |
| [MIT Missing Semester - Shell](https://missing.csail.mit.edu/2020/course-shell/) | 课程 | 长期可用 | 非常适合补 Shell 基础 | 不是 macOS 安装教程 | 4 |
| [Sourabh Bajaj - Homebrew](https://sourabhbajaj.com/mac-setup/Homebrew/) | 社区教程 | 长期维护 | 对 macOS 开发新手友好 | 具体命令需以官方为准 | 4 |

## 1. 先确认你的 Mac 架构

打开 Terminal，运行：

```bash
uname -m
sw_vers
```

这一步在做什么：确认你的 CPU 架构和 macOS 版本。

为什么需要：Apple Silicon 和 Intel Mac 的 Homebrew 默认路径不同。

成功后你会看到类似：

```text
arm64
ProductName:            macOS
ProductVersion:         15.x
```

如果 `uname -m` 是 `arm64`，后面大概率使用 `/opt/homebrew`。如果是 `x86_64`，后面大概率使用 `/usr/local`。

## 2. 安装 Xcode Command Line Tools

在哪里运行：Terminal。

具体命令：

```bash
xcode-select --install
```

这一步在做什么：安装 Apple 的命令行开发工具，包括编译器、SDK、`git` 触发安装能力、`make` 等基础组件。

为什么需要：很多 Homebrew 包和语言依赖会编译原生模块，没有 CLT 会遇到 `xcrun`、`clang`、`make` 相关错误。

安装结束后验证：

```bash
xcode-select -p
pkgutil --pkg-info=com.apple.pkg.CLTools_Executables
```

成功信号：

```text
/Library/Developer/CommandLineTools
```

如果系统提示已经安装，不是坏事。可以继续验证版本。

## 3. 安装 Homebrew

在哪里运行：Terminal。

具体命令：

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

这一步在做什么：从 Homebrew 官方安装脚本安装包管理器。

为什么需要：macOS 自带工具太少，开发环境需要持续安装、升级和卸载命令行工具。Homebrew 是 macOS 上最常用的包管理器。

安装完成后，终端通常会提示你运行一段 `eval` 命令。不要跳过。

Apple Silicon 通常是：

```bash
eval "$(/opt/homebrew/bin/brew shellenv)"
```

Intel Mac 通常是：

```bash
eval "$(/usr/local/bin/brew shellenv)"
```

验证：

```bash
brew --version
which brew
brew doctor
```

成功信号：

```text
Homebrew 5.x.x
/opt/homebrew/bin/brew
```

或者 Intel Mac 上是：

```text
/usr/local/bin/brew
```

## 4. 让 Homebrew 在新终端里也生效

如果你只运行了 `eval`，它可能只对当前 Terminal 窗口生效。建议写进 `~/.zprofile`。

Apple Silicon：

```bash
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
source ~/.zprofile
```

Intel Mac：

```bash
echo 'eval "$(/usr/local/bin/brew shellenv)"' >> ~/.zprofile
source ~/.zprofile
```

这一步在做什么：把 Homebrew 的路径加入每次登录 Shell 的初始化过程。

成功后验证：

```bash
echo $PATH
which brew
```

如果 `which brew` 能输出 Homebrew 路径，说明配置生效。

## 5. 认识 formula 和 cask

Homebrew 里常见两类安装对象：

| 类型 | 例子 | 适合安装什么 |
| --- | --- | --- |
| formula | `git`、`node`、`ripgrep` | 命令行工具、运行时、库 |
| cask | `visual-studio-code`、`docker` | macOS 图形应用、字体、插件 |

例子：

```bash
brew install git
brew install --cask visual-studio-code
```

不要混淆：`brew install node` 是命令行运行时，`brew install --cask docker` 是 GUI 应用 Docker Desktop。

## 6. 安装基础命令行工具

建议先装这些：

```bash
brew install git gh curl wget jq tree ripgrep fd fzf
```

每个工具的用途：

| 工具 | 用途 |
| --- | --- |
| `git` | 版本控制 |
| `gh` | GitHub 命令行 |
| `curl` | 请求 URL、下载脚本、调接口 |
| `wget` | 下载文件 |
| `jq` | 处理 JSON |
| `tree` | 查看目录结构 |
| `ripgrep` / `rg` | 快速搜索代码和文本 |
| `fd` | 更友好的文件查找 |
| `fzf` | 交互式模糊搜索 |

验证：

```bash
git --version
gh --version
curl --version
wget --version
jq --version
tree --version
rg --version
fd --version
fzf --version
```

如果某个命令不存在，先运行：

```bash
brew list
brew info 工具名
```

## 7. 建议建立开发目录

不要把项目乱放在桌面或下载目录。建议：

```bash
mkdir -p ~/Developer
cd ~/Developer
```

这一步在做什么：创建一个专门放代码的目录。

为什么需要：路径稳定，备份和搜索都更清楚。后面你可以把 GitHub 项目都 clone 到这里。

## 8. 常用检查命令

以后每次怀疑环境不对，可以先跑：

```bash
pwd
whoami
echo $SHELL
echo $PATH
which brew
brew doctor
brew list
```

这些命令分别回答：

- 我在哪个目录？
- 当前用户是谁？
- 当前 Shell 是什么？
- 命令搜索路径是什么？
- `brew` 从哪里来？
- Homebrew 有没有明显问题？
- 我已经装了哪些包？

## 9. 常见错误与解决

### `xcrun: error: invalid active developer path`

常见于 macOS 升级后。先重新安装或更新 CLT：

```bash
xcode-select --install
```

然后验证：

```bash
xcode-select -p
```

### `command not found: brew`

可能是 PATH 没写入 Shell 配置。

Apple Silicon 先试：

```bash
/opt/homebrew/bin/brew --version
```

如果能输出版本，补上：

```bash
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
source ~/.zprofile
```

### `brew doctor` 有 warning

不是所有 warning 都必须立刻处理。先看它是否影响你正在安装的工具。官方也说明 `brew doctor` 的提示主要用于排查问题，不代表所有 warning 都是致命错误。

### 国内网络下载慢

不要随便使用来源不明的一键脚本。优先考虑：

- 换网络；
- 复用官方安装包；
- 使用可信镜像源时明确知道自己改了什么；
- 保留原始官方源的恢复方式。

## 10. 安全和回滚

安全原则：

- 不要把网上脚本下载后直接 `sudo bash`。
- 不要在不理解路径时运行 `rm -rf`。
- 不要把 `/usr/bin`、`/System` 作为开发工具安装目录。
- 不要把 token、私钥、密码写进公开仓库。

如果只是卸载某个 Homebrew 包：

```bash
brew uninstall 包名
```

查看包信息：

```bash
brew info 包名
```

清理旧版本缓存可以等你熟悉后再做，不要在第一次安装时急着清。

## 验证方式

最终运行：

```bash
xcode-select -p
brew --version
brew doctor
git --version
gh --version
rg --version
jq --version
tree --version
```

如果这些命令都能输出版本或状态，你就完成了本系列的地基。

## 可直接交给 Codex 的 Prompt

```text
你是我的 macOS 开发环境检查助手。请只检查，不要修改系统。

目标：
确认 Xcode Command Line Tools、Homebrew 和常用 CLI 工具是否安装正确。

请执行：
1. 检查 `uname -m`、`sw_vers`、`echo $SHELL`。
2. 检查 `xcode-select -p` 和 CLT pkg 信息。
3. 检查 `brew --version`、`which brew`、`brew doctor`。
4. 检查 git、gh、curl、wget、jq、tree、rg、fd、fzf。
5. 如果发现 PATH 问题，给出适合 Apple Silicon 或 Intel Mac 的修复命令。

约束：
- 不要卸载任何东西。
- 不要执行破坏性命令。
- 不要要求我提供密码、私钥或 token。
```

## 参考来源

- [Apple：Installing the command-line tools](https://developer.apple.com/documentation/xcode/installing-the-command-line-tools/)
- [Homebrew：Installation](https://docs.brew.sh/Installation.html)
- [Homebrew：Manpage](https://docs.brew.sh/Manpage)
- [Homebrew：Troubleshooting](https://docs.brew.sh/Troubleshooting)
- [MIT Missing Semester：The Shell](https://missing.csail.mit.edu/2020/course-shell/)
- [Sourabh Bajaj：Homebrew](https://sourabhbajaj.com/mac-setup/Homebrew/)
