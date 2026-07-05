---
layout: post
title: "VS Code + Codex + SSH：macOS 和 Windows 远程开发完整教程"
subtitle: "从 SSH 密钥、Remote-SSH 到 Codex CLI、IDE 扩展和 Codex App 远程连接"
description: "一篇面向 macOS 和 Windows 的 VS Code + Codex + SSH 远程开发教程，覆盖 SSH 密钥、Remote-SSH、Codex CLI、IDE 扩展和 Codex App 连接流程。"
keywords:
  - VS Code
  - Codex
  - SSH
  - Remote-SSH
  - 远程开发
  - Codex CLI
  - Codex App
date: 2026-05-27 20:00:00 +0800
author: "CodeWater517"
header-img: "img/home-bg-geek.jpg"
header-mask: 0.35
tags:
  - AI
  - 开发
  - 工具
  - VS Code
  - Codex
  - SSH
last_modified_at: 2026-07-05 00:00:00 +0800
revision_history:
  - time: 2026-05-27 20:00:00 +0800
    description: "新增 VS Code、Codex 与 SSH 远程开发教程。"
  - time: 2026-07-05 00:00:00 +0800
    description: "补充搜索摘要、关键词和站点收录相关元数据。"
---

> 这篇教程把网上的官方文档和社区经验清洗成一条可执行路线：先把 SSH 打通，再用 VS Code Remote-SSH 进入远程项目，最后把 Codex 放到同一个远程环境里工作。macOS 和 Windows 的本机步骤会分开写，远程主机可以是 Linux、macOS、Windows Server、云服务器、实验室服务器或公司 devbox。

## 资料清洗说明

我优先采用官方资料：VS Code Remote-SSH 文档、OpenAI Codex 文档、Microsoft OpenSSH 文档、Apple macOS Remote Login 文档。社区文章和 GitHub Issue 只用于补充实战坑，比如 `codex` 不在远端登录 shell 的 `PATH` 里、VS Code Server 卡住、远程连接入口灰度或版本差异。

检索时有两个页面返回错误，未作为正文依据：

- `https://developers.openai.com/codex/authentication`：打开时返回 `Internal Error`，正文改用 Codex CLI、IDE、Remote connections 页面里的认证说明。
- `https://developers.openai.com/codex/administration-windows`：打开时返回 `Internal Error`，正文改用当前可打开的 `https://developers.openai.com/codex/windows`。

## 先搞清楚三层关系

这套环境里有三层：

1. **SSH**：负责让本机安全登录远程机器。
2. **VS Code Remote-SSH**：负责把远程目录变成 VS Code 工作区，编辑、终端、调试、扩展都贴着远程环境跑。
3. **Codex**：负责在当前项目里读代码、改文件、运行命令、解释报错、生成测试。它可以通过 VS Code IDE 扩展、Codex CLI，或者 Codex App 的 SSH remote connection 使用。

最稳的入门路线是：

```text
本机配置 SSH -> VS Code Remote-SSH 打开远程项目 -> 远程终端安装/登录 Codex -> 在同一个远程项目里让 Codex 工作
```

如果你已经在用 Codex App，也可以把远程主机加到 Codex App 的 Connections 里，让 Codex App 直接针对远程文件系统和 shell 启动线程。这个路线适合长期在线的 devbox，但对 `~/.ssh/config`、远端 `codex` 命令和登录 shell 要求更严格。

## 准备清单

本机需要：

- VS Code；
- VS Code 的 **Remote - SSH** 扩展；
- OpenSSH 客户端；
- 一个能使用 Codex 的 ChatGPT 账号或 API key；
- 一把专门用于开发主机的 SSH key。

远程主机需要：

- 正在运行的 SSH Server；
- 你的账号能登录；
- 能访问项目目录；
- 能安装 VS Code Server、语言运行时和 Codex；
- 至少 1 GB RAM，建议 2 GB RAM 和 2 核 CPU 起步。

VS Code 官方文档明确说明：Remote-SSH 可以连接运行 SSH server 的远程机器、虚拟机或容器；连接后可以在远程文件系统中编辑文件，VS Code Server 会安装在远程 OS 上，本地不需要保存源码。

## macOS 本机配置 SSH

打开 Terminal，先看本机有没有 SSH：

```bash
ssh -V
```

创建一把专门给远程开发用的 key：

```bash
mkdir -p ~/.ssh
chmod 700 ~/.ssh
ssh-keygen -t ed25519 -f ~/.ssh/id_ed25519_codex -C "vscode-codex-ssh"
chmod 400 ~/.ssh/id_ed25519_codex
```

如果远程主机是 Linux 或 macOS，并且允许密码第一次登录，可以用：

```bash
ssh-copy-id -i ~/.ssh/id_ed25519_codex.pub your-user@your-host
```

如果没有 `ssh-copy-id`，手动复制也可以：

```bash
cat ~/.ssh/id_ed25519_codex.pub
```

把输出追加到远程主机对应用户的：

```text
~/.ssh/authorized_keys
```

然后在 `~/.ssh/config` 写一个固定别名：

```sshconfig
Host devbox
  HostName 203.0.113.10
  User your-user
  Port 22
  IdentityFile ~/.ssh/id_ed25519_codex
  IdentitiesOnly yes
  ServerAliveInterval 30
```

测试：

```bash
ssh devbox
```

如果远程主机也是 Mac，需要在远程 Mac 上打开 **System Settings > General > Sharing > Remote Login**。Apple 官方文档也提醒，Remote Login 会让别人可以通过 SSH 或 SFTP 访问这台 Mac，所以建议只允许指定用户登录。

## Windows 本机配置 SSH

在 PowerShell 里检查 OpenSSH：

```powershell
ssh -V
```

如果提示找不到命令，打开 **Settings > System > Optional features**，安装 **OpenSSH Client**。如果这台 Windows 还要作为远程主机被别人连，还需要安装 **OpenSSH Server**，并启动 `sshd` 服务。

创建专用 key：

```powershell
New-Item -ItemType Directory -Force "$HOME\.ssh"
ssh-keygen -t ed25519 -f "$HOME\.ssh\id_ed25519_codex" -C "vscode-codex-ssh"
```

可选：启用 Windows 的 `ssh-agent`，这样不用每次输入 key passphrase：

```powershell
Get-Service ssh-agent | Set-Service -StartupType Automatic
Start-Service ssh-agent
ssh-add "$HOME\.ssh\id_ed25519_codex"
```

如果远程主机是 Linux 或 macOS，可以用 PowerShell 把公钥追加到远端：

```powershell
$USER_AT_HOST="your-user@your-host"
$PUBKEYPATH="$HOME\.ssh\id_ed25519_codex.pub"
$pubKey=(Get-Content "$PUBKEYPATH" | Out-String)
ssh "$USER_AT_HOST" "mkdir -p ~/.ssh && chmod 700 ~/.ssh && echo '${pubKey}' >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys"
```

Windows 的 SSH config 文件一般是：

```text
C:\Users\<你的用户名>\.ssh\config
```

内容可以这样写：

```sshconfig
Host devbox
  HostName 203.0.113.10
  User your-user
  Port 22
  IdentityFile C:/Users/your-user/.ssh/id_ed25519_codex
  IdentitiesOnly yes
  ServerAliveInterval 30
```

Windows 路径建议在 SSH config 里使用 `/`。如果使用反斜杠，需要写成双反斜杠，比如 `C:\\Users\\...`。

测试：

```powershell
ssh devbox
```

## 如果远程主机是 Windows

如果你要从 macOS 或 Windows 连接到一台 Windows 远程主机，需要在那台 Windows 上安装并启动 OpenSSH Server。管理员 PowerShell 可用：

```powershell
Get-WindowsCapability -Online | Where-Object Name -like 'OpenSSH*'
Add-WindowsCapability -Online -Name OpenSSH.Server~~~~0.0.1.0
Start-Service sshd
Set-Service -Name sshd -StartupType Automatic
```

安装 OpenSSH Server 后，Windows 会创建名为 `OpenSSH-Server-In-TCP` 的防火墙规则，允许 22 端口入站。如果连接被拒绝或重置，先检查这条规则是否启用。

Windows 远程主机的公钥位置要注意：

- 标准用户：`C:\Users\username\.ssh\authorized_keys`
- 管理员用户：`C:\ProgramData\ssh\administrators_authorized_keys`

管理员用户不要把 key 放错到普通用户目录里。Microsoft 文档明确区分了这两种位置。

## 用 VS Code Remote-SSH 打开远程项目

本机安装 VS Code 和 **Remote - SSH** 扩展后：

1. 按 `Cmd+Shift+P`（macOS）或 `Ctrl+Shift+P`（Windows）。
2. 运行 `Remote-SSH: Connect to Host...`。
3. 选择刚才写好的 `devbox`，或输入 `your-user@your-host`。
4. 第一次连接时选择远程平台，比如 Linux、macOS 或 Windows。
5. 连接成功后，执行 **File > Open Folder...**，打开远程项目目录。

连接成功后，VS Code 左下角会显示类似：

```text
SSH: devbox
```

打开 integrated terminal，确认终端确实在远程环境里：

```bash
pwd
hostname
uname -a
```

在 Windows 远程主机上可以执行：

```powershell
$PWD
hostname
```

这里有个关键点：你在 Remote-SSH 窗口里安装的项目扩展，会运行在远程上下文里。Python、Node、Go、Rust、Java 等语言工具也应该装在远程主机，避免“本地能跑，远程不能跑”的错位。

## 在远程环境安装 Codex CLI

打开 VS Code 的远程终端，也就是已经连到 `SSH: devbox` 的终端。

Linux 或 macOS 远程主机优先使用 OpenAI 文档里的独立安装器：

```bash
curl -fsSL https://chatgpt.com/codex/install.sh | sh
codex
```

第一次运行 `codex` 会要求登录。优先用 ChatGPT 账号登录；如果你的场景需要 API key，再按官方认证说明配置。

确认远程 shell 找得到 Codex：

```bash
command -v codex
codex --version
```

如果 `codex` 能在你手动打开的终端里运行，但 Codex App 的 SSH remote connection 启动失败，大概率是登录 shell 的 `PATH` 不一致。把 Codex 安装目录加入远端用户的 `~/.bashrc`、`~/.zshrc` 或对应登录 shell 配置里，再重新 `ssh devbox` 测试：

```bash
echo $PATH
command -v codex
```

OpenAI 的 Remote connections 文档说明：Codex App 会通过 SSH 使用远程用户的登录 shell 启动远端 Codex app server，所以远程登录 shell 中必须能直接执行 `codex`。

## 在 VS Code 里使用 Codex IDE 扩展

打开远程项目窗口后，安装 **Codex** IDE 扩展。OpenAI 文档说明，Codex IDE extension 支持 VS Code，以及 Cursor、Windsurf 等 VS Code forks；安装后会出现在编辑器侧边栏，并提示使用 ChatGPT 账号或 API key 登录。

推荐第一次使用时这样做：

1. 在 Remote-SSH 窗口打开项目根目录。
2. 打开 Codex 侧边栏。
3. 先用 Chat 或低权限 Agent 模式让它读项目，不要立刻大改。
4. 让它说明会改哪些文件、怎么验证。
5. 再允许它小步修改。
6. 修改后在远程终端运行测试或启动命令。

一个适合远程项目的起手 prompt：

```text
请先阅读当前远程项目，不要修改文件。
重点了解：
1. 项目技术栈和启动方式；
2. 主要目录结构；
3. 测试、构建、格式化命令；
4. 可能的安全或部署注意事项。

最后请给我一个最小可验证的修改计划。
```

如果你希望 Codex 修改远程文件，要确认当前 VS Code 窗口左下角仍然是 `SSH: devbox`。这能避免你以为在改服务器，实际在改本地副本。

## 用 Codex App 直连 SSH 主机

如果你装了 Codex App，可以让 Codex App 通过 SSH 添加远程项目。这个模式不依赖 VS Code 窗口，但依赖你的 SSH config 和远端 `codex`。

步骤：

1. 在运行 Codex App 的本机写好 `~/.ssh/config`，必须是具体 host alias，不能只写通配符。
2. 在同一台机器上确认能登录：

   ```bash
   ssh devbox
   ```

3. 在远程主机安装并登录 Codex。
4. 确认远程登录 shell 能找到 `codex`：

   ```bash
   ssh devbox 'command -v codex && codex --version'
   ```

5. 打开 Codex App，进入 **Settings > Connections**，添加或启用 SSH host，选择远程项目目录。

OpenAI 文档对这个模式的描述很直接：Codex App 可以从 SSH host 添加远程项目，并让线程针对远程文件系统和 shell 运行。也就是说，Codex 读文件、写文件、执行命令的位置都是远端。

注意：移动端远程控制目前对主机有额外限制。OpenAI Remote connections 文档写明，Codex mobile setup 当前需要 macOS 的 Codex App，Windows 版 Codex App 还不支持 mobile setup。Windows 用户仍然可以走 VS Code Remote-SSH、Codex CLI、Codex IDE extension，或按官方 Windows 页面选择原生/WSL2 路线。

## Windows 用户：原生还是 WSL2

Windows 有两条路：

第一条是原生 Windows：

- 用 Windows PowerShell；
- 用 Windows OpenSSH；
- 用 Windows 版 VS Code；
- 远程连接 Linux/macOS/Windows 主机；
- 按 OpenAI 的 Windows 页面选择 Codex CLI、IDE extension 或原生 app。

第二条是 WSL2：

- 项目放在 WSL 的 `/home/...` 下；
- 从 WSL 终端运行 `code .`；
- VS Code 左下角显示 `WSL: <distro>`；
- 在 WSL 里安装 Linux 版 Codex 和开发依赖。

如果你的项目依赖 Linux 工具链、shell 脚本、Docker、Makefile，WSL2 通常更省心。如果只是从 Windows 电脑 SSH 到 Linux 服务器，原生 Windows + Remote-SSH 就够用。

## 端口转发和本地预览

远程项目启动 Web 服务后，比如：

```bash
npm run dev
```

如果服务监听远程 `localhost:3000`，VS Code 通常会提示转发端口。也可以手动打开 **Ports** 面板，Forward Port `3000`。

常见规则：

- Web 服务绑定 `127.0.0.1`：只能远程主机本机访问，需要 VS Code 端口转发。
- Web 服务绑定 `0.0.0.0`：局域网或公网可能能访问，但要注意安全组和防火墙。
- 不要为了方便把开发服务、Codex app server 或调试端口直接暴露到公网。

OpenAI 文档也提醒：Remote connections 使用 SSH 启动和管理远程 Codex app server，不要把 app-server transport 直接暴露在共享网络或公网；跨网络访问远程机器时，优先用 VPN 或 mesh networking。

## 推荐工作流

每次开始远程开发，按这个顺序来：

```bash
ssh devbox
cd /path/to/project
git status
```

然后在 VS Code Remote-SSH 打开同一个目录，让 Codex 先读项目：

```text
请先探索当前仓库，不要修改。输出项目结构、启动方式、测试方式、你认为本次任务会涉及的文件。
```

确认计划后再让它实现：

```text
只实现计划中的第一步。不要改无关文件。改完后运行最小验证命令，并总结 diff。
```

建议养成三件事：

- 每次让 Codex 改代码前先看计划；
- 每次改完先看 `git diff`；
- 每次交付前至少跑一个验证命令。

## 常见问题排查

### `ssh devbox` 都连不上

先别看 VS Code 和 Codex，SSH 没通就是底层没通。

检查：

```bash
ssh -v devbox
```

重点看：

- HostName 是否正确；
- Port 是否正确；
- `IdentityFile` 是否指向正确私钥；
- 公钥是否已经放进远端 `authorized_keys`；
- 私钥权限是否过宽；
- 云服务器安全组是否放行 22；
- Windows 远程主机的 `sshd` 服务和防火墙规则是否启用。

### VS Code 一直卡在 Installing VS Code Server

可以在命令面板运行：

```text
Remote-SSH: Kill VS Code Server on Host...
```

然后重连。

还要检查远程主机是否能访问 VS Code Server 下载地址、磁盘是否满、`/tmp` 是否 `noexec`、公司代理是否需要配置 `HTTP_PROXY` / `HTTPS_PROXY`。

### Remote-SSH 反复要密码

通常是 key 没生效。

检查：

```bash
ssh -v devbox
```

看调试输出里有没有使用你的 `IdentityFile`。Windows 本机还要确认 PowerShell 里的 `ssh` 是 OpenSSH，不是 PuTTY。

### Windows 远程主机识别错误

如果 VS Code 无法正确识别 Windows OpenSSH Server，可以在 VS Code settings.json 加：

```json
{
  "remote.SSH.useLocalServer": false,
  "remote.SSH.remotePlatform": {
    "devbox": "windows"
  }
}
```

### 提示 TCP forwarding 被禁用

VS Code Remote-SSH 需要 SSH tunnel。如果日志里有：

```text
open failed: administratively prohibited: open failed
```

在远程主机的 `sshd_config` 开启：

```text
AllowTcpForwarding yes
```

Linux 重启：

```bash
sudo systemctl restart sshd
```

Windows 管理员 PowerShell 重启：

```powershell
Restart-Service sshd
```

### Codex App 找不到 SSH host

检查：

- host alias 是否写在运行 Codex App 的那台机器的 `~/.ssh/config`；
- 是否是具体 alias，而不是 `Host *` 这种 pattern-only 配置；
- `ssh devbox` 是否能从同一台机器登录；
- 远端是否能执行 `codex`；
- Codex App 是否为最新版本；
- ChatGPT 账号和 workspace 是否一致；
- 企业或学校 workspace 是否启用了 Remote Control。

### Codex 远程启动失败，但手动 SSH 正常

常见原因是远端 shell 初始化太复杂。比如 `.bashrc` 里无条件 `exec zsh -l`，可能会打断 Codex 通过 SSH 启动 app server。社区文章里提到过类似 `ECONNRESET`、websocket `1006` 问题。

处理方式：

- 保证 `ssh devbox 'command -v codex'` 有输出；
- 保证登录 shell 不会输出奇怪 banner、交互菜单或强制切 shell；
- 把 shell 切换逻辑加条件；
- 更新远端 Codex CLI；
- 重新从 Codex App 的 Connections 添加主机。

## 安全建议

不要把远程开发账号设成 root。给自己建一个普通用户，只授予项目所需权限。

不要复用你所有服务器的同一把 SSH key。VS Code 官方 tips 也建议为开发主机创建专用 key，因为一把 key 泄漏会影响所有使用它的主机。

不要把 Codex 的远程 app server、开发服务、数据库、调试端口直接暴露公网。需要跨网络访问时，用 SSH、VPN、Tailscale/ZeroTier 这类 mesh 网络，或云厂商安全组限制来源 IP。

不要让 Codex 一上来 Full Access。先从只读、计划、小步修改开始。远程机器上通常有真实凭据、真实数据或更接近生产的环境，权限越大越要慢一点。

## 最终检查表

- `ssh devbox` 可以直接登录；
- `~/.ssh/config` 有具体 host alias；
- VS Code 左下角显示 `SSH: devbox`；
- 远程终端能运行项目构建或测试命令；
- 远程终端能运行 `codex --version`；
- Codex IDE 扩展已经登录；
- 如果用 Codex App，Settings > Connections 能看到 SSH host；
- 端口转发只暴露必要端口；
- `git status` 干净或你知道每个改动来自哪里。

## 参考资料

- [Remote Development using SSH - Visual Studio Code](https://code.visualstudio.com/docs/remote/ssh)
- [Remote development over SSH - Visual Studio Code Tutorial](https://code.visualstudio.com/docs/remote/ssh-tutorial)
- [Remote Development Tips and Tricks - Visual Studio Code](https://code.visualstudio.com/docs/remote/troubleshooting)
- [Codex CLI - OpenAI Developers](https://developers.openai.com/codex/cli)
- [Codex IDE extension - OpenAI Developers](https://developers.openai.com/codex/ide)
- [Remote connections - Codex - OpenAI Developers](https://developers.openai.com/codex/remote-connections)
- [Windows - Codex - OpenAI Developers](https://developers.openai.com/codex/windows)
- [Codex for (almost) everything - OpenAI](https://openai.com/index/codex-for-almost-everything/)
- [Introducing upgrades to Codex - OpenAI](https://openai.com/index/introducing-upgrades-to-codex/)
- [Get started with OpenSSH Server for Windows - Microsoft Learn](https://learn.microsoft.com/en-us/windows-server/administration/openssh/openssh_install_firstuse)
- [Key-based authentication in OpenSSH for Windows - Microsoft Learn](https://learn.microsoft.com/en-us/windows-server/administration/openssh/openssh_keymanagement)
- [Allow a remote computer to access your Mac - Apple Support](https://support.apple.com/guide/mac-help/allow-a-remote-computer-to-access-your-mac-mchlp1066/mac)
- [Generating a new SSH key and adding it to the ssh-agent - GitHub Docs](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent)
- [using remote SSH with Codex app - Yigit Konur](https://yigitkonur.com/using-remote-ssh-with-codex-app)
- [Remote Development in Codex Desktop App - openai/codex issue #10450](https://github.com/openai/codex/issues/10450)
