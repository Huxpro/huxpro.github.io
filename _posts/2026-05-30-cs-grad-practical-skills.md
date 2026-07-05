---
layout: post
title: "计算机准研究生入学前应该掌握的 21 项实用技能"
subtitle: "不讲课程表，先把服务器、Git、环境、复现和科研协作这些每天会用的东西补齐"
date: 2026-05-30 20:00:00 +0800
author: "CodeWater517"
header-img: "img/home-bg-geek.jpg"
header-mask: 0.35
tags:
  - 计算机
  - 研究生
  - 工具
  - 科研
  - 开发
last_modified_at: 2026-05-30 20:00:00 +0800
revision_history:
  - time: 2026-05-30 20:00:00 +0800
    description: "新增计算机准研究生实用技能清单初稿。"
---

> 这篇文章不讨论“计算机组成原理、操作系统、算法、数据库”这些专业基础课应该怎么学。它讨论的是另一类东西：你进实验室、上服务器、跑代码、复现实验、写论文、和同学协作时，每天都会碰到，却很少有人专门教你的实用技能。

## 写在前面：为什么先学这些

很多计算机学生在本科阶段学过不少课程，但一到真实科研或工程环境里，反而会被一些看起来很“小”的问题卡住：

- 导师发了服务器账号，但不知道怎么登录。
- 论文代码在 GitHub 上，但不知道怎么 clone、怎么切分支、怎么处理依赖。
- 跑实验时终端一关，任务就没了。
- 明明照着 README 做了，还是因为 Python、CUDA、包版本不一致跑不起来。
- 结果图出来了，但三个月后忘了当时用的参数、数据和代码版本。
- 写论文时参考文献乱成一团，公式、图表、引用反复出错。
- 问别人问题时只丢一句“代码报错了”，别人也不知道从哪里帮起。

这些问题不是智商问题，也不是“适不适合读研”的问题。它们更像是进入计算机科研环境前需要补的一套工具素养。

MIT 的 [Missing Semester](https://missing.csail.mit.edu/) 说得很直接：计算机课程会教操作系统、机器学习等高级主题，但很多学校很少系统教学生如何熟练使用命令行、编辑器、版本控制和调试工具。Software Carpentry 的核心课程也把 [Unix Shell、Git、Python/R](https://software-carpentry.org/lessons/) 放在科研计算入门的核心位置。国内的 [CS 自学指南](https://csdiy.wiki/) 也专门列出了 Git、GitHub、LaTeX、Docker、工作流等“必学工具”。另外，阮一峰的网络日志里有几篇面向初学者的 SSH、Git、Docker 文章，也很适合作为中文补充材料。

所以这篇文章的目标很朴素：

> 如果你是计算机准研究生，或者准备从本科进入实验室，希望这篇清单能帮你先把“能干活”的基础补起来。

## 怎么看这份清单

我把技能分成三层：

- **P0：入学前必须掌握**。不会这些，很多后续操作都很难展开。
- **P1：进实验室后高频使用**。这些技能会直接影响你跑实验、复现代码和使用服务器的效率。
- **P2：科研与协作效率**。这些技能不一定每天都用，但会决定你能不能长期稳定地产出、协作和交接。

不用一口气全学完。比较现实的路线是：先用两周把 P0 跑通，再用一个月围绕自己的方向补 P1，最后在做项目和读论文的过程中慢慢补 P2。

## P0：入学前必须掌握

### 1. 计算机与互联网实用常识

这一项不是让你去背计算机组成原理，而是先弄懂日常操作里的基本词。

你至少要知道：

- 文件和文件夹是什么；
- 绝对路径、相对路径、当前目录是什么；
- `.zip`、`.tar.gz`、`.csv`、`.json`、`.md`、`.py`、`.sh` 这些扩展名大概代表什么；
- 本地电脑和远程服务器有什么区别；
- 进程、端口、内存、磁盘、权限大概是什么意思；
- 上传、下载、同步、备份不是一回事；
- 环境变量、配置文件、缓存目录为什么会影响程序运行。

为什么它重要？因为计算机研究生的很多问题，表面上是“代码不会跑”，实际上是路径错了、权限不够、文件没传上去、端口被占用、压缩包没解对位置、环境变量没生效。

掌握到什么程度算够？别人说“把数据集传到服务器的 `/data/yourname/project`，解压以后改一下配置里的路径，再开一个端口转发看可视化页面”，你不需要每一步都熟，但至少知道这些词在指什么。

最小练习：

1. 在本机新建一个 `research-practice` 文件夹。
2. 在里面建立 `code`、`data`、`logs`、`outputs` 四个子文件夹。
3. 下载一个 `.zip` 文件，解压到 `data`。
4. 把一个文本文件从 `data` 复制到 `outputs`。
5. 用文本编辑器写一个 `README.md`，记录你做了什么。

这个练习很小，但它会让你开始把“电脑里的东西”看成可组织、可追踪、可复现的结构。

### 2. Linux/Unix 命令行基础

服务器大多没有图形界面。你登录上去以后，看到的不是桌面、文件夹图标和鼠标右键，而是一行命令提示符。

最开始要会这些命令：

```bash
pwd        # 我现在在哪里
ls         # 这里有什么
cd         # 切换目录
mkdir      # 新建目录
cp         # 复制
mv         # 移动或重命名
rm         # 删除
cat        # 查看小文件
less       # 翻看大文件
head       # 看文件开头
tail       # 看文件结尾
grep       # 搜索文本
find       # 找文件
du         # 看目录大小
df         # 看磁盘空间
ps         # 看进程
top        # 看系统资源
tar        # 打包和解压
wget       # 下载文件
curl       # 请求网页或接口
chmod      # 修改权限
```

不用一开始背完整参数。命令行最重要的是形成三个感觉：

第一，任何操作都发生在某个目录里。<br>
第二，命令通常是“命令 + 参数 + 对象”。<br>
第三，看不懂就先 `--help`、查文档、搜报错，不要乱删。

入门时最危险的命令是 `rm`，尤其是 `rm -rf`。你可以先养成一个习惯：删除前先 `pwd` 看当前目录，再 `ls` 看目标文件，确认无误后再删。

最小练习：

```bash
mkdir cli-practice
cd cli-practice
echo "hello research" > note.txt
cat note.txt
cp note.txt note-copy.txt
grep "research" note-copy.txt
mkdir logs
mv note-copy.txt logs/
find . -name "*.txt"
```

做到这里，你已经迈过“服务器恐惧”的第一道门了。

### 3. SSH 与远程服务器使用

SSH 可以理解成“安全地登录另一台电脑”。UChicago CS Student Resource Guide 也把 SSH 描述为从个人电脑连接 CS Linux 环境的常见方式。你在实验室拿到服务器账号后，第一件事通常就是：

```bash
ssh username@server-address
```

阮一峰的 [SSH 原理与运用：远程登录](https://www.ruanyifeng.com/blog/2011/12/ssh_remote_login.html) 和 [SSH 原理与运用：远程操作与端口转发](https://www.ruanyifeng.com/blog/2011/12/ssh_port_forwarding.html) 对远程登录、远程操作和端口转发讲得比较直观。你需要掌握：

- 用密码登录服务器；
- 用 SSH key 免密码登录；
- 配置 `~/.ssh/config`，给服务器起别名；
- 用 `scp` 或 `rsync` 在本机和服务器之间传文件；
- 用端口转发访问远程的 Jupyter、TensorBoard、Web demo；
- 知道 VPN、校园网、跳板机、防火墙可能影响连接；
- 知道第一次登录时 host key 提示不是“报错”，但也不能完全无脑接受。

一个典型的 SSH 配置长这样：

```sshconfig
Host lab-server
  HostName 192.0.2.10
  User yourname
  Port 22
  IdentityFile ~/.ssh/id_ed25519_lab
  ServerAliveInterval 30
```

以后你就可以直接：

```bash
ssh lab-server
```

如果你准备系统配置 VS Code、Codex 和 SSH，可以看我之前写的：[VS Code + Codex + SSH：macOS 和 Windows 远程开发完整教程](/2026/05/27/vscode-codex-ssh-guide/)。

最小练习：

1. 生成一把 SSH key。
2. 把公钥加入 GitHub 或实验室服务器。
3. 配置一个 `Host` 别名。
4. 用 `scp` 从本机传一个 `hello.txt` 到服务器。
5. 再从服务器把它传回来。

### 4. Git 与 GitHub/GitLab 操作

Git 是版本控制工具。不要把它理解成“上传代码的工具”，它真正解决的是：我改了什么、什么时候改的、为什么改、能不能回到过去、能不能和别人一起改。

UChicago 的 Git 教程把 Git 解释为管理代码、保存到远程服务器、和他人协作的系统。这个说法非常适合学生理解：Git 不只是工作后才用，本科课程、课程项目、科研代码和论文 LaTeX 项目都可以用。中文材料可以配合看阮一峰的 [Git 工作流程](https://www.ruanyifeng.com/blog/2015/12/git-workflow.html)，先建立“为什么要有分支和流程”的直觉。

最小必会命令：

```bash
git clone
git status
git add
git commit
git diff
git log
git branch
git switch
git pull
git push
git merge
```

还要理解几个概念：

- repository：仓库；
- commit：一次可解释的改动快照；
- branch：一条独立修改线；
- remote：远程仓库；
- conflict：多人或多分支改到同一处时产生的冲突；
- `.gitignore`：告诉 Git 哪些文件不要追踪。

新手最常见的错误是把所有东西都提交上去，包括数据集、虚拟环境、模型权重、日志、密钥。一般来说，代码、配置模板、文档可以提交；大数据、临时结果、`.env`、`.venv`、`__pycache__`、模型文件要谨慎。

最小练习：

1. 新建一个 GitHub 私有仓库。
2. 本地 `git clone` 下来。
3. 写一个 `README.md`。
4. `git add README.md`。
5. `git commit -m "Add README"`。
6. `git push`。
7. 在 GitHub 页面确认文件出现。
8. 新建一个分支，改一行，再开一个 Pull Request。

如果你未来要和导师、同学或 AI 编程工具协作，Git 是绕不过去的基础设施。

### 5. 编辑器与远程开发环境

编辑器不是信仰问题，而是工作效率问题。你可以用 VS Code、JetBrains、Vim、Neovim、Emacs，甚至临时用 Nano。关键不是用哪个，而是你能不能稳定完成这些事：

- 打开一个项目目录；
- 搜索文件名和全文内容；
- 快速跳转函数和变量；
- 格式化代码；
- 在终端运行命令；
- 远程连接服务器；
- 看 Git diff；
- 设置断点或至少会用打印调试；
- 装必要插件，但不被插件配置拖死。

对大多数准研究生，我建议先用 VS Code。它的 Remote SSH 文档明确说明，可以通过 SSH 连接远程机器，在远程文件系统上直接编辑、调试和运行命令。也就是说，你可以在本机用熟悉的界面，实际代码和环境却都在实验室服务器上。

最小练习：

1. 用 VS Code 打开一个本地项目。
2. 在内置终端里运行一段 Python。
3. 安装 Remote SSH 扩展。
4. 连接一台远程服务器。
5. 在远程目录里创建并运行一个脚本。

### 6. 技术文档阅读与提问能力

这个技能很容易被低估。很多人不是不会学，而是不会读文档、不会描述问题。

你需要学会读这些东西：

- README；
- installation guide；
- quick start；
- API reference；
- issue；
- release notes；
- traceback；
- log；
- error message。

读文档时不要从头硬啃。先找四件事：

1. 这个项目是干什么的？
2. 它要求什么系统、语言版本和依赖？
3. 最小运行命令是什么？
4. 如果失败，常见错误在哪里？

提问时也不要只说“跑不起来”。一个好的问题至少包括：

```text
我想做什么：
我按照哪些步骤做了：
我期望看到什么：
实际发生了什么：
完整报错：
我的系统、Python/CUDA/包版本：
我已经尝试过什么：
```

这不是形式主义。你写清楚这些，别人才能帮你；更重要的是，你自己写到一半，往往就能发现问题。

## P1：进实验室后高频使用

### 7. Python 与项目环境管理

很多计算机科研代码默认用 Python，尤其是机器学习、数据处理、自然语言处理、计算机视觉和科研脚本。

你不一定要一开始掌握 Python 的所有高级特性，但至少要能：

- 运行 `.py` 文件；
- 看懂 `import`、函数、类、参数、异常；
- 用 Jupyter Notebook 做探索；
- 用 `pip` 安装包；
- 用 `venv` 或 Conda 创建隔离环境；
- 根据 `requirements.txt` 安装依赖；
- 看懂包版本冲突；
- 知道不要把 `.venv` 目录提交到 Git。

Python Packaging User Guide 建议在使用第三方包时使用虚拟环境，因为虚拟环境可以为不同项目创建隔离的 Python 安装，避免包互相干扰。

最小练习：

```bash
mkdir python-env-practice
cd python-env-practice
python3 -m venv .venv
source .venv/bin/activate
python -m pip install requests
python -m pip freeze > requirements.txt
```

然后写一个 `main.py`：

```python
import requests

response = requests.get("https://example.com")
print(response.status_code)
```

最后运行：

```bash
python main.py
```

你不只是学 Python，而是在学“一个项目如何声明和恢复自己的运行环境”。

### 8. 服务器任务管理

很多实验不是几秒钟跑完，而是几小时、几天，甚至更久。新手最常见的崩溃是：SSH 连接断了，任务也断了。

你需要掌握：

- `tmux` 或 `screen`；
- `nohup`；
- 后台运行；
- 日志重定向；
- 查看进程；
- 杀掉进程；
- 查看 CPU、内存、磁盘、GPU；
- 估算任务会占多少资源。

常见命令：

```bash
tmux new -s exp1
python train.py > logs/train.log 2>&1
tail -f logs/train.log
ps aux | grep train.py
kill PID
```

`tmux` 可以理解成服务器上的“可恢复终端”。你断网、关电脑、退出 SSH，它还在那里。下次登录后：

```bash
tmux attach -t exp1
```

就能回到原来的窗口。

最小练习：

1. 开一个 tmux 会话。
2. 运行一个每秒打印一次数字的脚本。
3. 断开 SSH。
4. 重新登录服务器。
5. 恢复 tmux 会话，看任务是否还在。

### 9. GPU/CUDA 基础使用

如果你做 AI、视觉、NLP、推荐系统或任何深度学习相关方向，GPU 基础几乎是必备。

你至少要懂：

- GPU 和 CPU 不是一回事；
- 显存不是内存；
- `nvidia-smi` 可以看 GPU 占用；
- CUDA 版本、驱动版本、PyTorch/TensorFlow 版本需要匹配；
- 显存不够会 OOM；
- 不是所有报错都是代码错，也可能是环境、驱动或资源问题；
- 多人共用 GPU 时，要遵守实验室规则。

常见命令：

```bash
nvidia-smi
watch -n 1 nvidia-smi
```

看到 GPU 被别人占满，不要直接杀进程。先确认是不是自己的任务。如果是公共服务器，通常要看实验室规范、联系任务 owner，或者按队列系统提交任务。

最小练习：

1. 在服务器运行 `nvidia-smi`。
2. 找到 GPU 型号、显存大小、当前占用。
3. 在 Python 里检查 PyTorch 是否能看到 GPU。
4. 记录 CUDA、驱动、PyTorch 版本。

### 10. HPC/集群/Slurm 基础

学校或实验室的高性能计算集群通常不是让你随便登录一台机器就开跑大任务。它一般有登录节点和计算节点。

你可以这样理解：

- 登录节点：用来登录、编辑文件、提交任务，不适合跑大计算。
- 计算节点：真正跑 CPU/GPU 任务的地方。
- 调度系统：负责排队、分配资源、启动任务。

很多集群用 Slurm。Princeton Research Computing 的 Slurm 入门页把任务流程解释得很清楚：你提交一个 job，通常包括你的程序和一个 Slurm 脚本；脚本会声明需要多少内存、CPU 核、节点和运行时间；调度器找到资源后，在计算节点上运行任务。

常见命令：

```bash
sbatch job.slurm
squeue
scancel JOBID
srun
```

一个极简 Slurm 脚本可能长这样：

```bash
#!/bin/bash
#SBATCH --job-name=test
#SBATCH --nodes=1
#SBATCH --ntasks=1
#SBATCH --cpus-per-task=1
#SBATCH --mem=4G
#SBATCH --time=00:10:00
#SBATCH --output=logs/%j.out

python main.py
```

最小练习：

1. 写一个只打印当前时间和主机名的 Python 脚本。
2. 写一个 Slurm 脚本提交它。
3. 用 `squeue` 看队列。
4. 找到输出日志。
5. 故意把时间或内存写小，观察失败信息。

### 11. 调试与排错能力

准研究生最需要建立的心态是：报错不是灾难，报错是程序给你的线索。

常见错误类型：

- 路径错误：`No such file or directory`；
- 权限错误：`Permission denied`；
- 依赖错误：`ModuleNotFoundError`；
- 版本错误：某个函数不存在或参数不兼容；
- 内存错误：CPU 内存不够；
- 显存错误：CUDA out of memory；
- 端口错误：port already in use；
- 网络错误：DNS、代理、证书、超时；
- 编码错误：中文路径或文件编码问题。

排错时不要一上来重装系统、重装环境。比较稳的顺序是：

1. 复制完整报错。
2. 找到最上面和最下面的关键信息。
3. 判断是路径、权限、依赖、资源还是代码逻辑。
4. 做一个最小可复现例子。
5. 只改一个变量，再运行一次。
6. 把解决过程写进笔记。

最小练习：

找一个小 Python 项目，故意制造三个错误：

- 改错文件路径；
- 删掉一个依赖包；
- 把端口改成一个已经占用的端口。

然后分别记录：报错长什么样、怎么定位、怎么修复。

### 12. 实验复现流程

科研里最重要的不是“我这次跑出来了”，而是“我下次还能跑出来，别人也能知道我是怎么跑出来的”。

一次可复现的实验至少要记录：

- 代码仓库地址；
- commit hash；
- 数据集版本和路径；
- 环境创建方式；
- Python/CUDA/关键包版本；
- 配置文件；
- 启动命令；
- 随机种子；
- 日志；
- 输出文件；
- 指标结果；
- 任何手动改动。

The Turing Way 在可复现环境章节里强调，研究项目换到另一台电脑后，如果依赖具体操作系统、软件版本和包版本，就不能保证还能得到同样结果。因此，捕获计算环境本身就是科研复现的一部分。

最小实验记录模板：

````markdown
## 实验名称

## 日期

## 目的

## 代码版本
- repo:
- commit:

## 数据
- dataset:
- path:
- preprocessing:

## 环境
- OS:
- Python:
- CUDA:
- key packages:

## 命令

```bash
python train.py --config configs/base.yaml --seed 42
```

## 结果

## 备注
````

这个模板看起来麻烦，但等你连续跑十几个实验，就会感谢自己。

### 13. Docker / Apptainer 容器基础

容器解决的是“环境打包”问题。你可以粗略理解为：把程序需要的软件环境装进一个盒子里，换一台机器也尽量按同样方式运行。

Docker 里常见概念：

- image：镜像，像环境模板；
- container：容器，像从模板启动出来的运行实例；
- Dockerfile：描述镜像怎么构建；
- volume：把宿主机目录挂进容器；
- port mapping：把容器里的端口映射到外面；
- Docker Compose：同时管理多个服务。

HPC 环境里常见的是 Apptainer 或 Singularity，因为它们更适合集群的安全模型。你不需要一开始精通容器，但至少要看懂别人项目里的 Dockerfile，知道怎么用容器跑 demo，知道数据和输出不要只留在容器内部。Docker 入门时可以看阮一峰的 [Docker 入门教程](https://www.ruanyifeng.com/blog/2018/02/docker-tutorial.html)，先理解 image、container 和最小运行流程。

最小练习：

1. 安装 Docker。
2. 跑一个官方 `hello-world` 容器。
3. 跑一个 Python 容器并挂载当前目录。
4. 看懂一个简单 Dockerfile。
5. 知道实验室集群是否允许 Docker，还是要求 Apptainer。

## P2：科研与协作效率

### 14. Markdown、LaTeX、BibTeX 与文献管理

Markdown 用来写 README、实验记录、博客和项目说明。LaTeX 用来写论文、公式、课程报告和学位论文。BibTeX 或 BibLaTeX 用来管理参考文献。

你至少要会：

- Markdown 标题、列表、代码块、链接、图片、表格；
- LaTeX 章节、公式、图、表、引用；
- BibTeX 条目的导入、修改和引用；
- Overleaf 的基本协作；
- Zotero 或其他文献管理工具；
- 不要手动维护一堆混乱的参考文献。

如果你还没配文献管理，可以看我之前写的：[Zotero + 划词翻译 + 常用插件完整教程](/2026/05/27/zotero-translate-plugins-guide/)。

最小练习：

1. 用 Markdown 写一篇实验记录。
2. 用 Overleaf 建一个 LaTeX 小文档。
3. 插入一个公式、一张图、一个表格。
4. 用 Zotero 导出一条 BibTeX。
5. 在 LaTeX 中引用它。

### 15. 论文阅读与文献调研工作流

读论文不是从标题开始逐字读到参考文献结束。那样很容易读到一半忘了前面在说什么。

一个更稳的顺序是：

1. 先看标题、摘要、图表和结论。
2. 判断这篇论文解决什么问题。
3. 看它和已有方法相比有什么不同。
4. 看实验是否支持它的结论。
5. 决定要不要精读方法细节。
6. 记录一句话总结和三个关键词。

Keshav 的经典文章 [How to Read a Paper](https://web.stanford.edu/class/cs114/reading-keshav.pdf) 提出了“三遍读论文”的方法，很适合作为入门框架：第一遍掌握大意，第二遍抓住内容，第三遍深入理解和重建论文。

常用工具：

- Google Scholar；
- arXiv；
- Semantic Scholar；
- DBLP；
- Papers With Code；
- Zotero；
- Connected Papers；
- 课题组共享文献库。

最小练习：

选一篇你方向相关的论文，写下：

- 这篇论文想解决什么问题；
- 之前方法有什么不足；
- 它的核心方法是什么；
- 用了哪些数据集；
- 主要指标是什么；
- 你觉得最值得复现的是哪一部分。

### 16. 数据与文件管理

很多科研混乱不是从代码开始的，而是从文件命名开始的。

不要这样放：

```text
new/
new2/
final/
final_final/
result/
result_good/
tmp/
```

更推荐从一开始就分层：

```text
project/
  README.md
  code/
  configs/
  data/
    raw/
    processed/
  logs/
  outputs/
  checkpoints/
  figures/
  notes/
```

数据管理要记住几个原则：

- 原始数据不要随便改；
- 中间数据要知道怎么生成；
- 大文件不要直接塞进 Git；
- 重要结果要备份；
- 文件名要包含关键信息，但不要长到无法阅读；
- 删除前先确认有没有备份；
- 如果数据涉及隐私或授权，先问清楚规则。

最小练习：

把你最近的一个课程项目或实验项目，重新整理成上面的目录结构，并写一个 README 说明每个目录放什么。

### 17. 测试与代码质量

测试不是公司工程师才需要。科研代码也需要测试，尤其是数据预处理、指标计算、格式转换、实验脚本。

你至少要懂：

- 什么是最小可复现例子；
- 什么是单元测试；
- 为什么格式化很重要；
- linter 能帮你提前发现什么；
- 为什么改代码前后要有验证方式；
- 不要只靠“看起来能跑”判断正确。

Python 项目里可以从这些工具开始：

- `pytest`：测试；
- `black` 或 `ruff format`：格式化；
- `ruff`：lint；
- `pre-commit`：提交前检查。

最小练习：

写一个函数：

```python
def average(values):
    return sum(values) / len(values)
```

然后写测试：

```python
def test_average():
    assert average([1, 2, 3]) == 2
```

再思考：如果传入空列表怎么办？如果传入字符串怎么办？测试会逼你把这些边界想清楚。

### 18. 网络/API/代理基础

你不需要一开始成为网络工程师，但要懂一些基本概念：

- URL 是什么；
- HTTP 请求和响应是什么；
- GET、POST 大概有什么区别；
- JSON 是什么；
- DNS 是什么；
- 端口是什么；
- 本机的 `localhost` 和服务器的 `localhost` 不是一回事；
- 代理、VPN、防火墙会影响下载、API 调用和 SSH；
- `curl` 可以用来测试接口。

常见场景：

- Jupyter 在服务器 8888 端口启动，但你本机打不开；
- TensorBoard 跑在远程服务器，需要端口转发；
- 下载模型时网络超时；
- API key 配好了但请求失败；
- 代理只在浏览器生效，终端里不生效。

最小练习：

```bash
curl -I https://example.com
curl https://api.github.com
```

然后试着解释：

- 状态码是多少；
- 响应头里有什么；
- 为什么有些请求需要 token；
- 为什么服务器上的 `localhost:8888` 不能直接在你本机打开。

### 19. 科研协作习惯

科研不是一个人闷头写代码。你需要和导师、师兄师姐、同学、合作者、甚至未来的自己协作。

好的协作习惯包括：

- 开会前准备简短进展；
- 开会后写会议纪要；
- 每次实验记录目标、命令、结果；
- 代码改动写清楚 commit message；
- PR 描述写清楚改了什么、怎么测试；
- 遇到阻塞时明确说“卡在哪里”；
- 交接项目时写 README；
- 不把关键知识只留在聊天记录里。

一个比较好的周报结构：

```markdown
## 本周完成

## 实验结果

## 遇到的问题

## 下周计划

## 需要讨论
```

如果你开始使用 AI 辅助开发，也要把 AI 生成的内容纳入同样的工程闭环。我之前的 Vibe Coding 系列里写过一篇：[从 Prompt 到可提交代码：Vibe Coding 的工程闭环](/2026/05/11/vibe-coding-workflow/)，可以作为延伸阅读。

### 20. 账号、安全与密钥管理

这项很重要，而且犯错成本很高。

你需要知道：

- 开启 MFA；
- SSH 私钥不能发给别人；
- API key 不能写进代码提交；
- GitHub token 泄露后要立刻 revoke；
- `.env` 应该加入 `.gitignore`；
- 公共服务器上不要乱改权限；
- 不要用弱密码；
- 不要把数据集、账号、服务器地址随便公开；
- 离开实验室或换项目时要交接和清理权限。

常见危险操作：

```bash
git add .
git commit -m "update"
git push
```

这三行本身没有错，但如果你没看 `git status` 和 `git diff`，就可能把 `.env`、密钥、数据、模型权重一起推上去。

最小练习：

1. 检查自己的 GitHub 是否开启 MFA。
2. 检查本机 `~/.ssh` 权限。
3. 新建一个 `.env` 文件。
4. 把 `.env` 写进 `.gitignore`。
5. 用 `git status` 确认它没有被追踪。

### 21. 云服务器与简单部署

不是所有准研究生都要做部署，但会一点云服务器和 Linux 服务管理，会让你在做 demo、跑实验、展示系统时轻松很多。

你至少要理解：

- 云服务器是一台远程 Linux 机器；
- CPU、内存、磁盘、带宽、GPU 都会影响价格；
- 安全组或防火墙会控制端口；
- Nginx 常用来做反向代理；
- `systemd` 可以让服务后台常驻；
- 日志是排查服务问题的第一入口；
- 对象存储适合放大文件；
- GPU 云实例忘记关机会持续扣费。

最小练习：

1. 在云平台创建一台最低配置 Linux VM。
2. 用 SSH 登录。
3. 安装 Python 或 Node.js。
4. 启动一个最简单的 Web 服务。
5. 打开安全组端口。
6. 在浏览器访问。
7. 练习查看日志并关闭实例。

这一步不是为了让你立刻成为后端工程师，而是让你知道“代码如何从我的电脑变成别人能访问的服务”。

## 推荐学习顺序

如果你现在什么都不会，建议按这个顺序来：

第一周：

1. 计算机与互联网常识；
2. Linux 命令行；
3. Markdown；
4. Git 最小流程。

第二周：

1. SSH 登录服务器；
2. VS Code Remote SSH；
3. Python 虚拟环境；
4. `tmux` 跑长任务。

第三到第四周：

1. 复现一个 GitHub 小项目；
2. 写实验记录；
3. 学会看日志和排错；
4. 整理数据目录；
5. 用 Zotero 管 5 篇论文。

第五周以后：

1. 学 Slurm 或实验室队列系统；
2. 学 Docker 或 Apptainer；
3. 补测试、代码质量和协作流程；
4. 了解云服务器和简单部署。

学的时候不要追求“看完教程”。每个技能都要配一个小任务。工具类知识不靠收藏夹变强，靠你真的用它解决一次问题。

## 一份入学前自测清单

你可以用下面这份清单检查自己：

- 我能在终端里创建、移动、搜索、压缩和删除文件。
- 我能用 SSH 登录服务器。
- 我能用 `scp` 或 `rsync` 传文件。
- 我能配置 VS Code Remote SSH。
- 我能 clone 一个 GitHub 项目。
- 我能做一次 commit 并 push 到远程仓库。
- 我知道 `.gitignore` 应该写什么。
- 我能创建 Python 虚拟环境并安装依赖。
- 我能看懂 README 里的安装和运行步骤。
- 我能用 `tmux` 让任务断线后继续运行。
- 我能用 `nvidia-smi` 看 GPU 状态。
- 我知道登录节点和计算节点的区别。
- 我能提交一个最简单的 Slurm 任务。
- 我能读 traceback 并判断错误大类。
- 我能记录一次实验的代码版本、环境、参数和结果。
- 我能写 Markdown 实验记录。
- 我能用 Zotero 管文献，用 BibTeX 插入引用。
- 我能给别人描述一个可复现的问题。
- 我知道 API key 和 SSH 私钥不能提交到 Git。
- 我能整理一个项目目录，让别人看懂入口在哪里。
- 我能把一个简单 demo 跑在远程机器上。

如果这些你能做到大半，进入实验室后的摩擦会小很多。

## 本站延伸阅读

- [VS Code + Codex + SSH：macOS 和 Windows 远程开发完整教程](/2026/05/27/vscode-codex-ssh-guide/)：适合继续配置远程开发环境。
- [Zotero + 划词翻译 + 常用插件完整教程](/2026/05/27/zotero-translate-plugins-guide/)：适合继续搭建文献管理工作流。
- [Vibe Coding 学习路线：计算机学生如何从 0 到 1 上手 AI 辅助开发](/2026/05/11/vibe-coding-learning-roadmap/)：适合把 AI 编程工具放进学习路线里。
- [Cursor、Codex、Claude Code 怎么选：AI 编程工具链入门](/2026/05/11/vibe-coding-tools/)：适合选择日常开发和科研复现中的 AI 工具。
- [从 Prompt 到可提交代码：Vibe Coding 的工程闭环](/2026/05/11/vibe-coding-workflow/)：适合把 AI 生成代码纳入 Git、测试和交付流程。

## 外部参考

- [The Missing Semester of Your CS Education](https://missing.csail.mit.edu/)：MIT 的工具课，覆盖 shell、编辑器、Git、调试、代码质量等主题。
- [Software Carpentry Lessons](https://software-carpentry.org/lessons/)：面向科研计算的 Unix Shell、Git、Python/R 核心课程。
- [UChicago CS Student Resource Guide: Remote SSH Access](https://uchicago-cs.github.io/student-resource-guide/environment/ssh.html)：面向学生的 SSH 入门说明。
- [UChicago CS Student Resource Guide: Git Tutorial](https://uchicago-cs.github.io/student-resource-guide/tutorials/git-intro.html)：面向学生的 Git 概念和练习。
- [CS 自学指南](https://csdiy.wiki/)：中文 CS 自学资源，其中“必学工具”部分覆盖 Git、GitHub、LaTeX、Docker、工作流等。
- [VS Code Remote Development using SSH](https://code.visualstudio.com/docs/remote/ssh)：VS Code 官方 Remote SSH 文档。
- [Python Packaging User Guide: venv and pip](https://packaging.python.org/en/latest/guides/installing-using-pip-and-virtual-environments/)：Python 虚拟环境和依赖安装官方指南。
- [The Turing Way: Reproducible Environments](https://book.the-turing-way.org/reproducible-research/renv/)：关于可复现计算环境的研究实践指南。
- [Princeton Research Computing: First Slurm Job](https://researchcomputing.princeton.edu/get-started/guide-princeton-clusters/3-first-slurm-job)：Slurm 集群任务入门。
- [How to Read a Paper](https://web.stanford.edu/class/cs114/reading-keshav.pdf)：经典论文阅读方法文章。
- [阮一峰：SSH 原理与运用（一）远程登录](https://www.ruanyifeng.com/blog/2011/12/ssh_remote_login.html)：中文 SSH 入门博客。
- [阮一峰：SSH 原理与运用（二）远程操作与端口转发](https://www.ruanyifeng.com/blog/2011/12/ssh_port_forwarding.html)：中文 SSH 端口转发博客。
- [阮一峰：Git 工作流程](https://www.ruanyifeng.com/blog/2015/12/git-workflow.html)：中文 Git 协作流程博客。
- [阮一峰：Docker 入门教程](https://www.ruanyifeng.com/blog/2018/02/docker-tutorial.html)：中文 Docker 入门博客。

## 最后

准研究生不需要在入学前把自己训练成全能工程师。真正重要的是：你遇到问题时，知道它大概属于哪一类；你能把问题拆小；你能查资料；你能留下记录；你能让别人复现你的操作。

工具学到最后，不是为了显得专业，而是为了让你把精力留给真正的研究问题。
