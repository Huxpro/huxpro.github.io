---
layout: post
title: "Codex App 使用指南：把 AI 编程助手变成可控工作台"
subtitle: "从项目、线程、Worktree、审查面板到浏览器、自动化和 AGENTS.md"
date: 2026-06-09 17:14:00 +0800
author: "CodeWater517"
header-img: "img/home-bg-geek.jpg"
header-mask: 0.35
tags:
  - AI
  - Codex
  - 开发
  - 工具
  - Vibe Coding
  - 工作流
last_modified_at: 2026-06-09 17:14:00 +0800
revision_history:
  - time: 2026-06-09 17:14:00 +0800
    description: "新增 Codex App 使用指南。"
---

> 这篇教程主要参考 OpenAI Codex 官方文档和 Jason Liu 的 X 长文 [Getting the most out of Codex](https://x.com/jxnlco/status/2057153744630890620)。官方文档负责确认功能边界，经验帖负责补充使用心法。核心思路不是“让 Codex 替你随便改项目”，而是把 Codex App 当成一个可以读项目、拆任务、运行工具、审查变更、沉淀流程的 AI 工作台。

## 结论

如果你第一次认真使用 Codex App，推荐路线是：

```text
安装并登录 Codex App
-> 打开一个真实项目
-> 先让 Codex 探索项目，不要立刻改文件
-> 为任务选择 Local / Worktree / Cloud 模式
-> 小步实现并持续 steering
-> 用 Review 面板审查 diff
-> 用 AGENTS.md 沉淀项目规则
-> 对重复流程再引入 Skills、MCP 和 Automations
```

Codex App 的价值不只是“生成代码”。它更像一个桌面指挥台：你可以同时开多个线程，让不同任务在不同工作区里跑；可以把浏览器、Git、终端、文件系统、外部 MCP 工具和自动化放进同一个工作流；也可以在最后用审查面板把 AI 的输出变成你能理解、能验证、能提交的改动。

但越强的工具越需要边界。真正好用的 Codex 工作流不是一次性大 Prompt，而是：

```text
Explore -> Plan -> Implement -> Verify -> Review -> Commit
```

这也和本站之前的 [从 Prompt 到可提交代码：Vibe Coding 的工程闭环](/2026/05/11/vibe-coding-workflow/) 是同一条主线。

## 我找到的教程类型

| 来源 | 类型 | 时间/版本 | 优点 | 问题 | 推荐度 |
| --- | --- | --- | --- | --- | ---: |
| [Codex - OpenAI Developers](https://developers.openai.com/codex/) | 官方文档入口 | 2026-06-09 检索 | 汇总 Quickstart、App、CLI、IDE、Cloud、配置和远程连接 | 产品更新快，细节要以当前页面为准 | 5 |
| [Codex Quickstart](https://developers.openai.com/codex/quickstart) | 官方入门 | 2026-06-09 检索 | 覆盖 Codex App、CLI、IDE extension、cloud tasks 和安装入口 | 更偏入口索引，实战流程需要自己组织 | 5 |
| [Codex App](https://developers.openai.com/codex/app/) | 官方 App 文档 | 2026-06-09 检索 | 说明 Codex App 是本地桌面工作台，覆盖项目、线程、任务和审查 | 页面很多，需要按场景消化 | 5 |
| [Codex App Features](https://developers.openai.com/codex/app/features/) | 官方功能页 | 2026-06-09 检索 | 覆盖 Local / Worktree / Cloud、review、browser、Chrome、Computer Use、automations、MCP 等 | 功能密度高，新手容易一次性开太多 | 5 |
| [Codex Worktrees](https://developers.openai.com/codex/app/worktrees/) | 官方功能页 | 2026-06-09 检索 | 解释并行任务和隔离工作区 | 对 Git 基础薄弱的人不够友好 | 5 |
| [Codex Customization](https://developers.openai.com/codex/concepts/customization) | 官方概念页 | 2026-06-09 检索 | 解释 AGENTS.md、memories、skills、MCP、subagents 的分工 | 偏概念，需要转成项目模板 | 5 |
| [Custom instructions with AGENTS.md](https://developers.openai.com/codex/guides/agents-md) | 官方指南 | 2026-06-09 检索 | 说明如何写项目级持久规则 | 不替你决定具体项目规则 | 5 |
| [Remote connections](https://developers.openai.com/codex/remote-connections/) | 官方远程连接 | 2026-06-09 检索 | 说明 Codex App 通过 SSH 使用远程项目 | SSH、PATH、远端环境对新手有门槛 | 5 |
| [Getting the most out of Codex](https://x.com/jxnlco/status/2057153744630890620) | 社区/个人经验帖 | 2026-05-20 左右发布 | 强调 steering、durable threads、queuing、tool reach、automations、memory 等用法 | X 页面可访问性不稳定；功能事实仍以官方文档为准 | 4 |

综合后，我建议把官方文档当成“功能地图”，把经验帖当成“使用姿势”。前者告诉你 Codex App 能做什么，后者提醒你不要把 Codex 当成一次性代码生成器，而要把它用成一个可持续协作的系统。

## 和本站其他 Codex 文章怎么接上

这篇文章专门讲 **Codex App 本身怎么用**。如果你还没建立 AI 编程的整体框架，可以先看：

1. [Cursor、Codex、Claude Code 怎么选：AI 编程工具链入门](/2026/05/11/vibe-coding-tools/)：帮你判断 Codex 适合什么任务，和 IDE 工具、聊天助手有什么区别。
2. [从 Prompt 到可提交代码：Vibe Coding 的工程闭环](/2026/05/11/vibe-coding-workflow/)：讲 Explore、Plan、Implement、Verify、Review、Commit 这条主线。
3. [上下文工程：AGENTS.md、项目规则和可复用 Skills](/2026/05/11/vibe-coding-context-rules/)：讲怎么把长期规则写进项目。
4. [VS Code + Codex + SSH：macOS 和 Windows 远程开发完整教程](/2026/05/27/vscode-codex-ssh-guide/)：如果你要在服务器、实验室机器或 devbox 上用 Codex，可以接着看远程环境。
5. [Zotero + Codex：打造智能学术工作流完整教程](/2026/06/09/zotero-codex-academic-workflow/)：如果你想把 Codex 用到文献整理、科研复现和论文写作，可以看这个场景版。

本文可以理解为它们之间的“Codex App 操作层”。

## 先理解 Codex App 是什么

Codex 有多个入口：App、CLI、IDE extension、cloud tasks。它们不是互相替代，而是适合不同工作姿势。

Codex App 更适合桌面上的完整工作流：

- 打开本地或远程项目；
- 在一个项目里开多个线程；
- 让 Codex 读文件、改文件、运行命令；
- 通过 Worktree 并行处理不同任务；
- 用 Review 面板看 diff、评论、暂存或撤回改动；
- 使用内置浏览器、Chrome 扩展或 Computer Use 做网页和桌面验证；
- 把重复任务保存成 Automation；
- 通过 AGENTS.md、Skills、MCP 等方式沉淀上下文和工具。

你可以把它理解成三层。

第一层是 **项目工作区**。Codex 需要知道在哪个目录工作、能读哪些文件、能运行什么命令、当前 Git 状态是什么。

第二层是 **任务线程**。每个线程是一段可持续对话和执行记录。经验帖里很强调 durable threads：不要把每个小问题都当成一次性聊天，而是让一个线程围绕一个具体目标持续推进。

第三层是 **工具和审查层**。Codex 可以调用 shell、读写文件、看网页、接 MCP、生成文档或图片，但这些能力最终都应该回到审查：它到底改了什么、跑了什么、验证了什么、还有什么风险。

## 适合谁

Codex App 很适合这些人：

- 已经有一个真实项目，需要 AI 读代码、改文件、跑测试；
- 经常需要跨多个文件实现功能或修 bug；
- 做课程项目、科研复现、全栈项目、博客、文档和脚本自动化；
- 需要同时处理几个相对独立任务；
- 想把 Git review、浏览器验证、项目规则和 AI 对话放在一个工作台里；
- 希望把重复流程沉淀成 Automation、Skill 或 MCP 工作流。

如果你只是问概念、写一小段函数、翻译一段报错，普通聊天助手或 IDE 补全可能就够了。Codex App 的优势来自项目上下文和执行能力，任务太小反而会显得重。

## 1. 安装并登录 Codex App

这一步在做什么：把 Codex App 安装到本机，并确认你能创建本地任务。

为什么需要：Codex App 是桌面工作台。只有先让它连到你的账号、项目目录和本机工具链，后面才能做项目级协作。

在哪里操作：macOS 或 Windows 桌面环境。

具体做法：

1. 打开 [Codex Quickstart](https://developers.openai.com/codex/quickstart)。
2. 按你的系统下载 Codex App。
3. 启动 App，并用支持 Codex 的 ChatGPT 账号登录。
4. 第一次不要直接打开重要生产仓库，先选一个个人项目或练习项目。
5. 确认 Codex 能看到项目文件，并能在必要时请求运行命令的权限。

成功后应该看到什么：

- Codex App 可以正常打开；
- 你能添加或打开一个本地项目；
- 新建线程后，Codex 能列出项目结构或读取 README；
- 如果需要运行命令，App 会按当前权限策略提示你确认。

如果你看到登录、授权或模型不可用的问题，先回到官方 Quickstart 确认当前账号、计划、地区和 App 版本。不要把 ChatGPT 网页能用直接等同于 Codex App 的所有能力都可用。

## 2. 先打开一个“低风险真实项目”

这一步在做什么：给 Codex 一个真实但不危险的工作区。

为什么需要：空项目无法体现 Codex 的优势，生产项目又不适合新手第一天就放开权限。最好的练习材料是个人博客、课程 demo、工具脚本、已经用 Git 管理的小项目。

在哪里操作：Codex App 的项目选择入口。

推荐项目要满足：

- 已经是 Git 仓库；
- 有 README 或至少有清楚目录结构；
- 能本地运行或构建；
- 不包含真实密钥、生产数据库、客户数据；
- 出错后可以用 Git diff 看清楚改动。

打开项目后，第一句话不要说“帮我优化整个项目”。推荐先让它探索：

```text
请先阅读这个项目，不要修改文件。

请重点说明：
1. 项目使用什么技术栈；
2. 主要目录结构是什么；
3. 常用启动、构建、测试命令可能是什么；
4. 当前你建议我先补哪些项目说明文件；
5. 如果后续要新增一个小功能，应该从哪里开始。
```

成功后应该看到什么：

- Codex 提到真实文件名，而不是泛泛而谈；
- 它知道项目是 Jekyll、React、FastAPI、Spring Boot 还是别的技术栈；
- 它能给出可验证的下一步，而不是直接写一大堆代码。

如果它没有读文件就开始发挥，直接打断：

```text
请停止泛化回答。先列出你实际读取过的文件路径，再基于这些文件重新总结项目结构。
```

## 3. 选择 Local、Worktree 还是 Cloud

这一步在做什么：为任务选择合适的运行位置和隔离方式。

为什么需要：Codex App 的不同模式会影响文件改在哪里、命令跑在哪里、任务是否能并行、是否会影响你当前工作区。

可以简单这样理解：

| 模式 | 适合场景 | 优点 | 注意点 |
| --- | --- | --- | --- |
| Local | 小改动、读项目、写文档、你希望直接在当前目录工作 | 最直观，和当前工作区一致 | 容易和你手动编辑互相影响 |
| Worktree | 并行任务、较大改动、需要隔离尝试 | 每个任务有独立 Git worktree，适合同时跑多个线程 | 需要理解 Git branch / worktree，依赖安装可能要重复 |
| Cloud | 长任务、可以离开本机等待结果、适合 offload 的任务 | 不占本机，适合后台跑 | 环境、权限、网络和依赖要按官方说明配置 |

新手建议：

- 第一天用 Local 读项目和做小文档；
- 第二天开始用 Worktree 做功能实现；
- 等你知道项目怎么构建、怎么测试、怎么恢复，再尝试更长的 cloud task。

一个很实用的规则是：**只读探索用 Local，动代码优先 Worktree，长任务再考虑 Cloud。**

## 4. 第一个任务只做健康检查

这一步在做什么：让 Codex 找出项目当前能不能跑，而不是立刻创造新功能。

为什么需要：很多 AI 改动失败，不是模型不会写，而是项目本身启动命令、依赖版本、环境变量、测试命令都不清楚。先健康检查能让后续任务少走弯路。

在哪里运行：Codex App 当前项目线程。

可以直接粘贴：

```text
请对当前项目做一次只读健康检查，不要修改文件。

请完成：
1. 阅读 README、package/Gemfile/pyproject/requirements 等关键配置；
2. 判断项目如何安装依赖、如何启动、如何构建、如何测试；
3. 检查是否有 AGENTS.md 或项目规则文件；
4. 列出你建议我接下来补充的最小说明；
5. 给出一个低风险验证命令。

如果你需要运行命令，请先说明命令作用和可能写入哪些目录。
```

成功后应该看到什么：

- Codex 先解释，再请求运行命令；
- 给出的命令和项目技术栈一致；
- 没有直接安装一堆全局依赖；
- 没有删除或重置文件。

如果它建议 `rm -rf`、`git reset --hard`、全局升级语言环境，先停下来。这些不是健康检查该做的事。

## 5. 用 steering 控制方向

这一步在做什么：在 Codex 工作过程中持续纠偏。

为什么需要：Codex 不是你发出 Prompt 后就该完全放手的黑箱。经验帖里提到的一个重点是 steering：你要像和开发搭档合作一样，在它理解偏了、范围变大了、验证不足时及时转向。

常见 steering 句式：

```text
范围太大了。请只完成第一步，不要修改前端。
```

```text
先不要实现。请列出会修改哪些文件，以及每个文件的目的。
```

```text
这个方案引入了新依赖。请改成不新增依赖的方案，除非你能说明现有代码无法满足。
```

```text
请先运行现有测试。如果测试失败，先解释失败是否由本次改动引起。
```

```text
你刚才没有提到验证方式。请补充自动验证和手动验证步骤。
```

Codex 用得越多，你越会发现：高质量协作不是写一个神奇 Prompt，而是在任务过程中不断提供事实、约束和反馈。

## 6. 把任务排队，而不是一次塞满

这一步在做什么：把多个需求拆成队列，让 Codex 一个一个处理。

为什么需要：一次性要求“重构后端、改前端、补测试、更新文档、优化样式、顺便部署”很容易失控。Codex App 适合多线程和排队，但每个线程仍然应该有一个清楚目标。

不推荐：

```text
帮我把这个项目全面优化一下，顺便修 bug、加测试、改 UI、写文档。
```

推荐：

```text
请先只做第一项：找出当前构建失败的原因。
不要修改文件，除非你确认失败来自一个非常小的配置错误。
```

然后开第二个任务：

```text
基于刚才的诊断，请在新的 Worktree 中修复构建失败。
限制：只修改构建相关配置和必要代码，不做格式化和重构。
修改后运行构建命令，并说明结果。
```

任务越清楚，Codex 越像工程助手；任务越模糊，Codex 越像随机扩写器。

## 7. 用 Review 面板审查改动

这一步在做什么：把 Codex 的输出变成可审查的 Git diff。

为什么需要：只看 Codex 的总结很危险。真正要合并的是文件改动，不是它的自然语言解释。Codex App 的 Review 能帮助你看文件级 diff、评论、暂存或撤回改动。

审查时重点看：

- 是否改了不相关文件；
- 是否引入了新依赖；
- 是否更改了锁文件；
- 是否删除了已有逻辑；
- 是否把测试改得更宽松；
- 是否写入了密钥、账号、路径、个人信息；
- 是否只跑了“看起来会过”的命令，没有跑真正验证命令。

一个好习惯是让 Codex 先自查：

```text
请基于当前 diff 做一次自我审查：
1. 每个文件为什么需要修改；
2. 是否有无关格式化；
3. 是否有可能破坏现有行为；
4. 已经运行了哪些验证；
5. 还有哪些风险需要人工确认。
```

然后你再看 Review 面板。不要因为 Codex 说“已完成”就省略 review。

## 8. 用 Worktree 并行，但不要让分支打架

这一步在做什么：用独立工作区同时推进多个任务。

为什么需要：Codex App 的一个强项是 multitasking。你可以让一个线程修测试，另一个线程写文档，第三个线程做 UI 调整。Worktree 能把这些任务隔离开，避免直接互相覆盖。

适合开独立 Worktree 的任务：

- 修一个独立 bug；
- 写一篇文档；
- 给某个模块补测试；
- 尝试一种替代实现；
- 做一个不会依赖其他改动的小功能。

不适合并行的任务：

- 两个线程同时改同一个核心文件；
- 一个线程重构目录，另一个线程基于旧目录写功能；
- 一个线程升级依赖，另一个线程调试旧依赖问题；
- 任务之间存在明确先后关系。

使用 Worktree 前，最好让 Codex 说明：

```text
这个任务是否适合单独 Worktree？请说明它可能和哪些文件冲突。
```

如果它判断会和另一个线程改同一批文件，就先串行。并行不是为了显得高级，而是为了减少等待。

## 9. 把浏览器能力用于验证

这一步在做什么：让 Codex 在网页里验证真实交互。

为什么需要：很多前端问题只看代码看不出来。按钮是否可点击、页面是否空白、移动端是否挤压、表单是否提交成功，都需要浏览器验证。

Codex App 相关浏览器能力可以分三类：

| 能力 | 适合场景 | 风险边界 |
| --- | --- | --- |
| In-app browser | 打开本地开发页面、截图、点击、检查页面状态 | 适合开发验证，优先使用 |
| Chrome extension | 需要访问你真实 Chrome 登录态的网站 | 权限更敏感，先确认站点和操作范围 |
| Computer Use | 控制桌面应用或系统 UI | 只在确实需要时使用，必须小步确认 |

前端任务可以这样要求：

```text
实现后请启动本地开发服务，并用浏览器验证：
1. 首页能正常渲染；
2. 主要按钮可点击；
3. 表单错误状态能显示；
4. 桌面和移动宽度下没有文字重叠。

如果需要打开外部网站或使用我的登录态，请先停下来说明原因。
```

这里的关键是“先本地、再外部”。能用本地页面验证，就不要一上来让 AI 操作真实账号网站。

## 10. 用 AGENTS.md 固定项目规则

这一步在做什么：把重复出现的项目规则写进仓库。

为什么需要：每次都在 Prompt 里重复“不要乱改、先跑测试、不要新增依赖”很累，也容易漏。OpenAI 官方文档把 `AGENTS.md` 作为给 Codex 的项目级自定义指令。它适合存放长期稳定的约束。

一个适合新手项目的 `AGENTS.md`：

```text
# AGENTS.md

## 工作方式
- 修改前先阅读相关文件并说明计划。
- 每次只完成一个明确任务，不做顺手重构。
- 不要修改无关格式，不要批量重排文件。

## 代码规则
- 沿用现有目录结构和命名风格。
- 不新增依赖，除非先说明原因并获得确认。
- 优先使用项目已有工具和 helper。

## 安全边界
- 不删除文件，除非用户明确要求。
- 不提交密钥、token、账号、真实数据。
- 不运行破坏性命令。

## 验证
- 修改后优先运行现有测试或构建命令。
- 如果无法运行，说明原因，并提供手动验证步骤。
```

如果你已经看过本站的 [上下文工程：AGENTS.md、项目规则和可复用 Skills](/2026/05/11/vibe-coding-context-rules/)，可以把那篇里的 README、SPEC、progress.md 一起加上。AGENTS.md 负责“AI 怎么工作”，README 负责“项目是什么”，SPEC 负责“需求边界”，progress.md 负责“现在做到哪”。

## 11. Skills、MCP 和 Subagents 先别急着全开

这一步在做什么：理解 Codex 的进阶定制能力，但不一上来过度配置。

为什么需要：官方文档里有 AGENTS.md、memories、skills、MCP、subagents 等概念。它们都很有用，但新手第一天全部配置，通常会把问题复杂化。

可以这样分工：

- **AGENTS.md**：项目长期规则，例如测试命令、目录约束、安全边界；
- **Memory**：个人偏好和跨项目习惯；
- **Skill**：某类任务的固定流程，例如写博客、修 bug、做文档、处理表格；
- **MCP**：连接外部工具和数据源，例如 GitHub、Linear、Zotero、Figma；
- **Subagent**：把复杂任务拆给更专门的代理处理。

推荐顺序：

1. 先写 README 和 AGENTS.md。
2. 某个流程重复三次以后，再做 Skill。
3. 确实需要外部系统数据时，再接 MCP。
4. 大任务能拆成独立工作块时，再考虑 Subagent。

不要为了“高级”而高级。工具越多，排错面越大。

## 12. Automations 适合重复任务，不适合高风险决策

这一步在做什么：把稳定、低风险、可验证的任务交给 Codex 定时或持续执行。

为什么需要：Codex App 支持自动化任务。它适合重复检查、定期整理、持续监控，而不是替你做不可逆决策。

适合 Automation 的任务：

- 每天早上检查博客是否能构建；
- 每周整理一次项目 TODO；
- 监控某个 issue 或 PR 状态；
- 定期生成学习日报或复盘草稿；
- 检查依赖是否有安全提醒，并生成报告。

不适合 Automation 的任务：

- 自动合并 PR；
- 自动删除数据；
- 自动提交生产配置；
- 自动操作付费、账号、考试、论文投稿、合同审批；
- 自动修改大量文件并直接推送。

创建自动化前，先在普通线程里跑通一次：

```text
请先模拟执行这个自动化任务，但不要创建 automation。
任务：每天检查 Jekyll 博客能否构建，并输出失败原因。
请说明需要的命令、权限、输出格式和可能风险。
```

确认输出稳定后，再保存为 Automation。自动化的边界应该比手动任务更保守，因为你不一定每次都盯着它。

## 13. 远程连接适合服务器和 devbox

这一步在做什么：让 Codex App 通过 SSH 在远程机器上工作。

为什么需要：很多课程项目、科研复现和后端服务不在本机，而在云服务器、实验室服务器或公司 devbox 上。官方 Remote connections 文档说明，Codex App 可以添加 SSH host，让任务针对远程文件系统和 shell 运行。

远程连接前要确认：

- 本机 `~/.ssh/config` 有明确 host alias；
- 能手动 `ssh devbox` 登录；
- 远端能运行 `codex`；
- 远端登录 shell 的 `PATH` 正确；
- 项目目录权限正确；
- 不要把 Codex app server、数据库或开发端口直接暴露公网。

如果你要完整配置远程环境，可以看本站这篇：[VS Code + Codex + SSH：macOS 和 Windows 远程开发完整教程](/2026/05/27/vscode-codex-ssh-guide/)。

对新手来说，建议先用 VS Code Remote-SSH 或普通 SSH 把远端环境跑通，再让 Codex App 接进去。SSH 没通时，不要先怀疑 Codex。

## 14. 常见错误与解决

### Codex 一上来就要改很多文件

通常是任务太大或边界太模糊。把需求改成：

```text
请先不要修改文件。请只输出计划，列出会涉及哪些文件和验证方式。
```

如果计划仍然太大，让它只做第一步。

### Codex 没有读项目就开始泛泛回答

要求它列出已读取文件：

```text
请列出你实际读取过的文件路径。没有读取的内容不要假设。
```

然后让它重新总结。

### 它要求 Full Access 或高权限命令

先问三个问题：

1. 这个命令是否必须？
2. 是否有更小权限的替代命令？
3. 它会写入哪些文件或目录？

依赖安装、数据库迁移、删除文件、重置 Git、推送远端，都应该单独确认。

### Worktree 里跑不起来

常见原因是依赖没有安装、环境变量没复制、端口被占用、脚本依赖当前目录。让 Codex 先比较主工作区和 Worktree：

```text
请检查当前 Worktree 和主工作区的差异：
1. 是否缺少依赖安装；
2. 是否缺少 .env.example 对应配置；
3. 是否端口被占用；
4. 是否有脚本写死了绝对路径。
```

不要直接把主工作区里的真实 `.env` 复制给 Codex。

### 代码能跑，但你看不懂 diff

让 Codex 生成审查说明：

```text
请按文件解释当前 diff：
1. 这个文件为什么改；
2. 改动前后行为差异；
3. 如何验证；
4. 是否有回滚方式。
```

如果解释不清楚，说明改动可能过大，应该拆小。

### 浏览器自动化卡住

先确认是本地页面、外部网站、登录态还是桌面权限问题。优先让 Codex 使用 in-app browser 验证本地开发页面。需要 Chrome 扩展或 Computer Use 时，让它先说明要访问哪个网站、做哪些动作、是否涉及账号或隐私。

## 15. 推荐学习路线

第一天：只读探索。

- 安装 Codex App；
- 打开一个个人项目；
- 让 Codex 总结项目结构；
- 让它找出启动、构建、测试命令；
- 不做任何代码修改。

第二天：小步修改。

- 用 Local 做一处文档更新；
- 用 Worktree 做一个很小的 bugfix；
- 用 Review 面板看 diff；
- 跑构建或测试。

第三天：写 AGENTS.md。

- 把项目规则写下来；
- 要求 Codex 后续遵守；
- 看它是否少犯同类错误；
- 把常用 Prompt 保存到项目文档。

第一周：形成闭环。

- 每个任务都走 Explore、Plan、Implement、Verify、Review；
- 学会用 steering 中途纠偏；
- 学会拒绝过大的改动；
- 至少完整审查并提交一次 AI 辅助改动。

第二周以后：引入进阶能力。

- 重复流程做成 Skill；
- 外部数据源接 MCP；
- 低风险重复任务做 Automation；
- 服务器项目配置 Remote connections；
- 前端项目用浏览器能力做真实验证。

## 16. 可直接交给 Codex 的 Prompt

### 项目首次体检

```text
请对当前项目做一次只读体检，不要修改文件。

目标：
1. 总结项目技术栈和目录结构；
2. 找出安装、启动、构建、测试命令；
3. 检查是否有 README、SPEC、AGENTS.md、progress.md；
4. 说明后续让你改代码时最需要的上下文；
5. 给出一个低风险验证命令。

要求：
- 只基于你实际读取的文件回答；
- 列出读取过的关键文件路径；
- 不要运行会写入大量文件的命令；
- 如果需要运行命令，先说明命令作用和风险。
```

### 小功能实现

```text
请在当前项目中实现这个小功能：[写清楚功能]

约束：
1. 先阅读相关文件，不要立刻修改；
2. 先给出计划，说明会改哪些文件；
3. 不新增第三方依赖，除非先说明理由并获得确认；
4. 每次只完成最小可交付版本；
5. 修改后运行现有测试或构建命令；
6. 最后按文件总结 diff，并说明风险。
```

### 代码审查

```text
请审查当前 diff，不要修改文件。

重点关注：
1. 是否有明显 bug；
2. 是否有无关修改；
3. 是否破坏已有接口或数据结构；
4. 是否缺少测试或验证；
5. 是否引入安全、隐私或权限风险；
6. 如果要继续修改，建议最小修复是什么。
```

### 前端浏览器验证

```text
请启动本地开发服务，并使用浏览器验证当前页面。

请检查：
1. 页面是否正常渲染；
2. 主要交互是否可点击；
3. 表单错误状态是否能显示；
4. 桌面和移动宽度下是否有文字重叠；
5. 控制台是否有明显错误。

如果需要访问外部网站、登录态、Chrome 扩展或 Computer Use，请先停下来说明原因。
```

### 写 AGENTS.md

```text
请基于当前项目为我草拟一个 AGENTS.md。

要求：
1. 先阅读 README、配置文件和现有目录结构；
2. 规则要短，适合长期维护；
3. 包含工作方式、代码风格、安全边界、验证方式；
4. 不要写一次性任务需求；
5. 输出前说明每条规则为什么适合这个项目。
```

## 17. 最后提醒

Codex App 最容易被低估的能力，不是“模型更会写代码”，而是它能把项目上下文、工具执行、审查、浏览器验证、长期规则和自动化放在一个持续工作流里。

用得好的关键也很朴素：

- 任务要小；
- 上下文要真；
- 权限要窄；
- 验证要跑；
- diff 要看；
- 规则要沉淀；
- 重复流程再自动化。

把 Codex 当成一个会犯错但很能干的开发搭档，你会自然地给它目标、边界和反馈。把它当成魔法按钮，它就很容易给你一堆看起来热闹、实际上很难维护的改动。

## 参考资料

- [Codex - OpenAI Developers](https://developers.openai.com/codex/)
- [Codex Quickstart - OpenAI Developers](https://developers.openai.com/codex/quickstart)
- [Codex App - OpenAI Developers](https://developers.openai.com/codex/app/)
- [Codex App Features - OpenAI Developers](https://developers.openai.com/codex/app/features/)
- [Worktrees - Codex App](https://developers.openai.com/codex/app/worktrees/)
- [Codex Customization - OpenAI Developers](https://developers.openai.com/codex/concepts/customization)
- [Custom instructions with AGENTS.md - OpenAI Developers](https://developers.openai.com/codex/guides/agents-md)
- [Remote connections - Codex](https://developers.openai.com/codex/remote-connections/)
- [Getting the most out of Codex - Jason Liu](https://x.com/jxnlco/status/2057153744630890620)
