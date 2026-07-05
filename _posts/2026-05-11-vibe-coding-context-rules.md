---
layout: post
title: "上下文工程：AGENTS.md、项目规则和可复用 Skills"
subtitle: "让 AI 不只会聊天，而是稳定理解你的项目"
date: 2026-05-11 10:30:00 +0800
author: "CodeWater517"
header-img: "img/home-bg-geek.jpg"
header-mask: 0.35
tags:
  - AI
  - 开发
  - 工具
  - Vibe Coding
  - 工程实践
last_modified_at: 2026-05-26 22:00:00 +0800
revision_history:
  - time: 2026-05-26 22:00:00 +0800
    description: "新增上下文工程文章。"
---

> 这篇文章是 Vibe Coding 系列的第五篇。前面几篇讲了学习路线、工具和工程闭环，这篇聚焦一个更容易被低估的问题：如何让 AI 长期、稳定、低成本地理解你的项目。

## 系列导航

1. [Vibe Coding 系列导读：给计算机学生的 AI 协作开发路线](/2026/05/11/vibe-coding-full-guide/)
2. [Vibe Coding 学习路线：计算机学生如何从 0 到 1 上手 AI 辅助开发](/2026/05/11/vibe-coding-learning-roadmap/)
3. [Cursor、Codex、Claude Code 怎么选：AI 编程工具链入门](/2026/05/11/vibe-coding-tools/)
4. [从 Prompt 到可提交代码：Vibe Coding 的工程闭环](/2026/05/11/vibe-coding-workflow/)
5. **上下文工程**：[上下文工程：AGENTS.md、项目规则和可复用 Skills](/2026/05/11/vibe-coding-context-rules/)
6. [实战篇：用 Vibe Coding 做课程项目、个人工具和科研复现](/2026/05/11/vibe-coding-practice/)

## 为什么上下文这么重要

同一个 AI 工具，有的人用起来像高级搜索引擎，有的人用起来像可靠的开发搭档，差别往往不在模型本身，而在上下文。

AI 不知道你的项目目标、命名习惯、目录结构、测试命令、部署方式和禁忌操作，除非你告诉它。你可以在聊天里一遍遍解释，也可以把这些规则写进项目文件里。前者适合一次性任务，后者才适合长期开发。

上下文工程不是把所有东西塞给 AI。它的目标是：把稳定、重要、可复用的信息沉淀下来，让每次协作都从更高起点开始。

对于学生项目，最小可用的上下文文件可以只有四个：

```text
README.md
SPEC.md
AGENTS.md
progress.md
```

这四个文件分别回答：项目是什么、要做什么、AI 应该遵守什么规则、现在做到哪里。

## README.md：项目入口

`README.md` 面向所有人，也包括 AI。它应该回答最基本的问题：

- 项目是做什么的；
- 使用什么技术栈；
- 如何安装依赖；
- 如何启动；
- 如何运行测试；
- 主要目录结构是什么。

一个学生项目的 README 不需要复杂，但不能空。可以这样写：

```text
# Mahjong Score Mini Program

这是一个用于线下麻将局计分的小程序项目。

## 技术栈
- uni-app
- Vue 3
- Vite
- 本地存储

## 常用命令
- npm install
- npm run dev:mp-weixin

## 目录说明
- src/pages: 页面
- src/utils: 计分和存储逻辑
- src/components: 通用组件
```

当 AI 第一次进入项目时，README 是它理解项目的入口。README 写得越清楚，AI 越少凭空猜测。

## SPEC.md：需求边界

`SPEC.md` 面向产品和实现。它告诉 AI：这个项目到底要解决什么问题，第一版必须做什么，不做什么。

最容易导致 AI 失控的就是需求边界不清。你说“做一个计分小程序”，它可能会加登录、云同步、排行榜、复杂规则、皮肤、分享和后台管理。听起来很丰富，但第一版可能根本不需要。

一个可用的 SPEC：

```text
# 项目目标
帮助线下麻将局记录每一局分数，并自动汇总总分。

# 第一版功能
1. 创建牌局；
2. 添加 4 名玩家；
3. 记录每局分数变化；
4. 查看历史记录；
5. 汇总当前总分。

# 非目标
1. 不做联网同步；
2. 不做用户登录；
3. 不内置复杂麻将番型；
4. 不处理支付结算。

# 验收标准
1. 关闭页面后再打开，牌局数据仍然存在；
2. 修改某一局记录后，总分能重新计算；
3. 删除一局记录后，总分保持一致。
```

`SPEC.md` 的重点是“第一版”和“非目标”。非目标不是偷懒，而是保护范围。

## AGENTS.md：给 AI 的项目规则

OpenAI Codex 官方文档把 `AGENTS.md` 用作给 coding agent 的自定义指令。你可以把它理解成“给 AI 开发者看的项目说明书”。它不替代 README，也不替代 SPEC，而是告诉 AI 在这个项目里应该如何工作。

一个简洁的 `AGENTS.md` 可以这样写：

```text
# AGENTS.md

## 工作方式
- 修改前先阅读相关文件并给出计划。
- 每次只完成一个明确任务，不做顺手重构。
- 修改后说明改了哪些文件，以及如何验证。

## 代码风格
- 沿用现有目录结构和命名风格。
- 优先修改业务逻辑层，不把复杂逻辑堆进页面组件。
- 不新增依赖，除非先说明理由并获得确认。

## 安全边界
- 不删除文件。
- 不提交密钥、token、账号、真实数据。
- 不运行破坏性命令。

## 验证
- 优先运行现有测试。
- 没有测试时，提供手动验证步骤。
```

AGENTS.md 不宜太长。它应该写稳定规则，而不是写某一次任务的临时需求。临时需求放在 Prompt 或 issue 里，长期规则才放进 AGENTS.md。

## progress.md：项目记忆

很多 AI 协作混乱来自一个问题：聊天上下文越来越长，项目状态却没人记录。`progress.md` 可以解决这个问题。

它不需要正式，关键是持续更新：

```text
# Progress

## 当前目标
完成牌局记录和总分汇总。

## 已完成
- 创建牌局页面
- 玩家添加逻辑
- 本地存储封装

## 进行中
- 单局分数录入

## 问题记录
- 录入负数时需要校验总和是否为 0
- 删除历史记录后要重新计算总分

## 下一步
- 补充总分计算测试
- 增加历史记录编辑入口
```

每次开始新会话时，可以让 AI 先读 `README.md`、`SPEC.md`、`AGENTS.md`、`progress.md`。这样它不用靠聊天记录猜项目进度。

## Rules、CLAUDE.md 和其他项目记忆

不同工具有不同的项目规则机制。Cursor 有 Rules，Claude Code 常用 `CLAUDE.md`，Codex 可以读取 `AGENTS.md`。名字不同，本质相似：把稳定约束写成文件，让 AI 在项目中自动或半自动引用。

学生项目不需要一开始同时维护很多规则文件。更实用的做法是：

- 如果主要用 Codex，就优先写 `AGENTS.md`；
- 如果主要用 Claude Code，就维护 `CLAUDE.md`，并让它和 `AGENTS.md` 内容保持一致；
- 如果主要用 Cursor，就把关键规则同步到 Cursor Rules；
- 只有多人协作或多工具并行时，再考虑抽象出一份统一规则。

不要让规则文件互相矛盾。比如一个文件说“可以自动格式化”，另一个文件说“不要格式化无关文件”，AI 会更难判断。

## Skills：把重复流程封装起来

如果说 AGENTS.md 是“规则”，那么 Skill 更像“流程”。规则告诉 AI 什么能做、什么不能做；Skill 告诉 AI 遇到某类任务时应该按什么步骤做。

适合封装成 Skill 的事情：

- 每次写博客都要检查 frontmatter、标题、导航和构建；
- 每次做实验都要记录命令、参数、数据集和结果；
- 每次修 bug 都要先复现、再定位、再补测试；
- 每次做前端页面都要检查响应式、空状态、错误状态。

不适合写成 Skill 的事情：

- 一次性的临时需求；
- 还没稳定下来的流程；
- 只是一句普通偏好；
- 需要大量人工判断的产品决策。

对学生来说，可以先不急着写复杂 Skill。等你发现某个流程重复做了三次，再考虑沉淀。

## 上下文不是越多越好

一个常见误区是：把所有资料都塞给 AI。这样不一定更好。上下文太长会增加噪音，也会让重点变模糊。

更好的做法是分层：

- README 放项目入口；
- SPEC 放当前产品边界；
- AGENTS 放长期开发规则；
- progress 放当前状态；
- issue 或 Prompt 放本次任务。

每层信息只负责一件事。这样 AI 需要什么就读什么，人也更容易维护。

## 本篇 Checklist

- 我的项目是否有能运行起来的 README？
- 我是否写清楚第一版功能和非目标？
- 我是否有 AGENTS.md 或等价的项目规则？
- 我是否记录了当前进度和已知问题？
- 我是否避免把所有信息都堆进一个超长 Prompt？
- 我是否把重复流程沉淀成规则或 Skill？

## 参考资料

- [Custom instructions with AGENTS.md - OpenAI Developers](https://developers.openai.com/codex/guides/agents-md)
- [Cursor Rules 文档](https://cursor.com/docs/context/rules)
- [Claude Code: Best practices for agentic coding](https://www.anthropic.com/engineering/claude-code-best-practices)
- [tukuaiai/vibe-coding-cn](https://github.com/tukuaiai/vibe-coding-cn)
- [Vibe Coding Best Practices - roadmap.sh](https://roadmap.sh/vibe-coding/best-practices)
