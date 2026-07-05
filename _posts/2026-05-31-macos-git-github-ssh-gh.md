---
layout: post
title: "配置 Git、GitHub SSH、GitHub CLI"
subtitle: "让本机能够安全拉代码、提交代码、推送到 GitHub，并用 gh 管理仓库"
date: 2026-05-31 09:20:00 +0800
author: "CodeWater517"
header-img: "img/home-bg-geek.jpg"
header-mask: 0.35
tags:
  - macOS
  - Git
  - GitHub
  - 环境配置
  - 开发工具
last_modified_at: 2026-05-31 09:20:00 +0800
revision_history:
  - time: 2026-05-31 09:20:00 +0800
    description: "新增 Git、GitHub SSH 与 GitHub CLI 配置教程。"
---

> 会安装环境只是第一步。真正做项目时，你需要从 GitHub 拉代码、提交改动、推送分支、开 PR。这篇把 Git、本机 SSH key 和 GitHub CLI 串起来。

## 结论

推荐流程：

```text
安装 Git 和 gh
-> 设置 Git 用户名和邮箱
-> 生成一把专门给 GitHub 的 SSH key
-> 把公钥加到 GitHub
-> 测试 SSH
-> 登录 GitHub CLI
-> clone 一个仓库验证
```

不要把私钥发给任何人，也不要把 token 粘到公开文档里。

## 我找到的教程类型

| 来源 | 类型 | 时间/版本 | 优点 | 问题 | 推荐度 |
| --- | --- | --- | --- | --- | ---: |
| [Git 官方文档](https://git-scm.com/book/en/v2) | 官方书籍 | 持续维护 | Git 概念最权威 | 初学者读完成本高 | 5 |
| [GitHub SSH key 文档](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent) | 官方文档 | 当前在线文档 | SSH key 生成、agent、添加步骤完整 | 对 Git 基础解释较少 | 5 |
| [GitHub CLI 文档](https://docs.github.com/en/github-cli/github-cli) | 官方文档 | 当前在线文档 | `gh auth login`、repo、PR 工作流清楚 | 命令很多，新手需要主线 | 5 |
| [GitHub SSH 测试文档](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/testing-your-ssh-connection) | 官方排错 | 当前在线文档 | 适合定位认证是否成功 | 不讲本机 Git 配置 | 5 |
| [阮一峰：Git 远程操作详解](https://www.ruanyifeng.com/blog/2014/06/git_remote.html) | 中文教程 | 2014 | 解释 remote、fetch、pull、push 很清楚 | 部分年代较早，以官方命令为准 | 4 |
| [阮一峰：SSH 入门教程](https://www.ruanyifeng.com/blog/2020/12/ssh-tutorial.html) | 中文教程 | 2020 | 适合理解 SSH 基本概念 | 不是 GitHub 专用教程 | 4 |
| [MIT Missing Semester：Version Control](https://missing.csail.mit.edu/2020/version-control/) | 课程 | 长期可用 | 对 Git 思维模型有帮助 | 不针对 GitHub CLI | 4 |

## 1. 安装 Git 和 GitHub CLI

如果你已经安装 Homebrew：

```bash
brew install git gh
```

这一步在做什么：安装较新的 Git 和 GitHub 官方命令行工具。

为什么需要：macOS 可能自带 Git，但版本和路径会受 Xcode Command Line Tools 影响。用 Homebrew 安装更可控。

验证：

```bash
git --version
which git
gh --version
```

成功信号：

```text
git version 2.x.x
gh version 2.x.x
```

## 2. 设置 Git 用户名和邮箱

在哪里运行：Terminal，任意目录都可以。

```bash
git config --global user.name "你的 GitHub 用户名或真实姓名"
git config --global user.email "你的邮箱"
```

这一步在做什么：设置提交记录里的作者信息。

为什么需要：每次 commit 都会记录作者。邮箱建议使用 GitHub 账号绑定邮箱，或者 GitHub 提供的 noreply 邮箱。

验证：

```bash
git config --global --list
```

你应该能看到：

```text
user.name=...
user.email=...
```

## 3. 设置默认分支名

新仓库建议使用 `main`：

```bash
git config --global init.defaultBranch main
```

如果你维护的旧仓库默认分支是 `master`，不用强行改旧仓库。本命令只影响以后 `git init` 新建的仓库。

## 4. 生成 GitHub SSH key

先确认有没有已有 key：

```bash
ls -la ~/.ssh
```

如果你不确定已有 key 用途，建议新建一把专门给 GitHub 的 key：

```bash
ssh-keygen -t ed25519 -f ~/.ssh/id_ed25519_github -C "github-macos-dev"
```

这一步在做什么：生成一对密钥。

- 私钥：`~/.ssh/id_ed25519_github`
- 公钥：`~/.ssh/id_ed25519_github.pub`

为什么需要：SSH key 让你的电脑能向 GitHub 证明“我是这个账号允许的机器”，不用每次推送都输入密码。

重要提醒：只上传 `.pub` 公钥，不要上传没有 `.pub` 的私钥。

## 5. 启动 ssh-agent 并加载密钥

运行：

```bash
eval "$(ssh-agent -s)"
ssh-add --apple-use-keychain ~/.ssh/id_ed25519_github
```

如果你的 macOS 或 OpenSSH 版本不支持 `--apple-use-keychain`，可以先用：

```bash
ssh-add ~/.ssh/id_ed25519_github
```

验证：

```bash
ssh-add -l
```

成功信号：能看到一条 `ED25519` key。

## 6. 配置 SSH config

编辑或创建 `~/.ssh/config`：

```sshconfig
Host github.com
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_ed25519_github
  AddKeysToAgent yes
  UseKeychain yes
```

如果 `UseKeychain yes` 报错，说明你的 OpenSSH 不支持这个配置，删掉这一行再试。

设置权限：

```bash
chmod 700 ~/.ssh
chmod 600 ~/.ssh/config
chmod 600 ~/.ssh/id_ed25519_github
chmod 644 ~/.ssh/id_ed25519_github.pub
```

## 7. 把公钥加到 GitHub

显示公钥：

```bash
cat ~/.ssh/id_ed25519_github.pub
```

复制输出内容，打开 GitHub：

```text
GitHub -> Settings -> SSH and GPG keys -> New SSH key
```

Title 可以写：

```text
MacBook macOS dev key
```

Key type 选择 Authentication Key，然后粘贴公钥。

## 8. 测试 SSH 连接

运行：

```bash
ssh -T git@github.com
```

第一次连接会提示是否信任 GitHub 主机指纹。确认是 `github.com` 后输入 `yes`。

成功信号类似：

```text
Hi your-username! You've successfully authenticated, but GitHub does not provide shell access.
```

这不是错误。GitHub 不提供普通 shell 登录，只提供 Git over SSH。

## 9. 登录 GitHub CLI

运行：

```bash
gh auth login
```

推荐选择：

```text
GitHub.com
SSH
Login with a web browser
```

验证：

```bash
gh auth status
```

成功信号：显示你已经登录 GitHub.com，并且 Git operations 使用 SSH。

## 10. clone 仓库并验证

找一个自己的仓库，使用 SSH 地址：

```bash
cd ~/Developer
git clone git@github.com:你的用户名/你的仓库.git
cd 你的仓库
git remote -v
```

成功信号：

```text
origin  git@github.com:你的用户名/你的仓库.git (fetch)
origin  git@github.com:你的用户名/你的仓库.git (push)
```

如果 remote 是 `https://github.com/...`，也能用，但本系列推荐 SSH。

## 11. 最小 Git 工作流

进入项目目录：

```bash
git status
```

改一个文件后：

```bash
git status
git add 文件名
git commit -m "docs: update setup notes"
git push
```

如果是新分支：

```bash
git switch -c feature/macos-setup
git push -u origin feature/macos-setup
```

用 GitHub CLI 开 PR：

```bash
gh pr create --draft --title "docs: add macOS setup" --body "Add macOS full-stack setup notes."
```

## 12. 常见错误与解决

### `Permission denied (publickey)`

含义：GitHub 没认出你的 SSH key。

排查：

```bash
ssh-add -l
ssh -vT git@github.com
git remote -v
```

常见原因：

- 公钥没加到 GitHub；
- 加错了 key；
- `ssh-agent` 没加载私钥；
- remote 用的是另一个 host；
- 权限太宽，SSH 拒绝读取 key。

### `Repository not found`

可能不是 SSH 问题，而是仓库名、组织名、权限不对。

检查：

```bash
gh repo view owner/repo
```

如果 GitHub 网页也看不到该仓库，你的账号可能没有权限。

### commit 作者邮箱不对

查看：

```bash
git log --format='%an <%ae>' -1
git config user.email
git config --global user.email
```

如果只想改当前项目：

```bash
git config user.email "你的项目邮箱"
```

不要随便重写已经推送的公开提交历史，尤其是多人协作仓库。

### `gh auth status` 失败

重新登录：

```bash
gh auth login
```

如果你在公司或学校网络，浏览器授权可能被拦截。换网络或使用设备码登录。

## 验证方式

最终确认：

```bash
git --version
git config --global user.name
git config --global user.email
ssh-add -l
ssh -T git@github.com
gh auth status
```

能通过这些检查，你的 GitHub 协作基础就可以用了。

## 可直接交给 Codex 的 Prompt

```text
你是我的 Git 和 GitHub SSH 排查助手。请只检查，不要修改远程仓库。

目标：
确认我的 macOS 本机能通过 SSH 使用 GitHub，并能使用 GitHub CLI。

请检查：
1. Git 和 gh 版本。
2. Git 全局用户名和邮箱。
3. `~/.ssh` 下是否存在 GitHub key。
4. `ssh-add -l` 是否加载 key。
5. `ssh -T git@github.com` 是否认证成功。
6. 当前仓库 remote 是否使用 SSH。
7. `gh auth status` 是否正常。

约束：
- 不要打印私钥内容。
- 不要要求我粘贴 token。
- 如果要查看公钥，只能查看 `.pub` 文件。
- 输出每个失败项的原因和修复建议。
```

## 参考来源

- [Git Book：Pro Git](https://git-scm.com/book/en/v2)
- [GitHub Docs：Generating a new SSH key and adding it to the ssh-agent](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent)
- [GitHub Docs：Adding a new SSH key to your GitHub account](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account)
- [GitHub Docs：Testing your SSH connection](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/testing-your-ssh-connection)
- [GitHub Docs：GitHub CLI](https://docs.github.com/en/github-cli/github-cli)
- [MIT Missing Semester：Version Control](https://missing.csail.mit.edu/2020/version-control/)
- [阮一峰：Git 远程操作详解](https://www.ruanyifeng.com/blog/2014/06/git_remote.html)
- [阮一峰：SSH 入门教程](https://www.ruanyifeng.com/blog/2020/12/ssh-tutorial.html)
