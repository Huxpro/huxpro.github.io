---
layout: post
title: "Vibe Coding 系列导读：给计算机学生的 AI 协作开发路线"
subtitle: "从工具热闹回到工程能力：如何系统学习 AI 辅助开发"
date: 2026-05-11
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
  - time: 2026-05-11 19:57:52 +0800
    description: "新增“Vibe Coding 全流程指南”初稿。"
  - time: 2026-05-26 22:00:00 +0800
    description: "重写为 Vibe Coding 系列导读，并拆分后续专题文章。"
---

> 这组文章写给已经有一定计算机基础的人：计算机专业学生、能熟练使用电脑的大学生、初级开发者、科研或课程项目开发者。它不是“零基础用 AI 逃避编程”的教程，而是讨论如何把已有的编程能力升级成 AI 协作开发能力。

## 系列导航

1. **导读**：[Vibe Coding 系列导读：给计算机学生的 AI 协作开发路线](/2026/05/11/vibe-coding-full-guide/)
2. **学习路线**：[Vibe Coding 学习路线：计算机学生如何从 0 到 1 上手 AI 辅助开发](/2026/05/11/vibe-coding-learning-roadmap/)
3. **工具链**：[Cursor、Codex、Claude Code 怎么选：AI 编程工具链入门](/2026/05/11/vibe-coding-tools/)
4. **工程闭环**：[从 Prompt 到可提交代码：Vibe Coding 的工程闭环](/2026/05/11/vibe-coding-workflow/)
5. **上下文工程**：[上下文工程：AGENTS.md、项目规则和可复用 Skills](/2026/05/11/vibe-coding-context-rules/)
6. **实战篇**：[实战篇：用 Vibe Coding 做课程项目、个人工具和科研复现](/2026/05/11/vibe-coding-practice/)

## 为什么要把原来的长文拆开

我原来写过一篇《Vibe Coding 全流程指南》，它试图一次讲完概念、工具、Prompt、项目规则、Git、测试、AGENTS.md、Skills、全栈开发、科研复现和常见风险。写的时候很顺手，读起来却有一个明显问题：它更像一本小册子，而不是一篇博客。

Vibe Coding 这个话题天然容易膨胀。你刚开始只想问“AI 能不能帮我写代码”，很快就会遇到一串更具体的问题：

- 怎么描述需求，AI 才不会乱猜？
- 什么时候应该让 AI 先读代码，什么时候可以直接改？
- Cursor、Codex、Claude Code、Copilot 到底怎么分工？
- AI 写出来的代码能不能直接合并？
- 课程项目、个人工具、科研复现各自适合什么流程？
- 如何把一次成功的 Prompt 变成可复用的项目规则？

这些问题放在一篇文章里，会把读者压得很累。尤其是对计算机学生来说，最重要的不是一次收集所有名词，而是知道自己下一步应该练什么。因此我把原文拆成一个系列：这篇只做导读，后面每篇解决一个明确问题。

## 什么是 Vibe Coding

我更愿意给它一个面向程序员的定义：

> **Vibe Coding 是一种以自然语言为主要交互方式，由人负责目标、约束、判断和验收，由 AI 编程代理负责大量代码生成、修改、调试和文档工作的开发方式。**

它不是简单的“让 AI 写代码”。早期的 AI 代码补全更像一个聪明的输入法：你写到一半，它预测下一行。Vibe Coding 更接近项目级协作：你描述需求，让 AI 阅读代码库、提出方案、修改多个文件、运行命令、根据报错继续迭代，最后你审查 diff、跑测试、决定是否提交。

这意味着人的角色发生了变化。过去我们的大部分时间花在手写实现上；现在越来越多时间会花在需求澄清、任务拆解、上下文整理、方案评估、代码审查和验收上。AI 可以写 Controller、Service、Vue 组件、SQL、测试用例、README 和实验脚本，但你仍然要判断它写在哪里、为什么这么写、是否破坏已有模块、是否满足业务规则、是否值得合并。

所以 Vibe Coding 的核心不是“放弃代码”，而是把代码生产过程从手写为主，升级成“指挥、审查、迭代、验收”为主。

## 两种 Vibe Coding

网上讨论 Vibe Coding 时，经常混在一起讲两种完全不同的方式。

第一种可以叫“玩具式 Vibe Coding”：直接告诉 AI 想要什么，AI 生成代码，人基本不看实现，只看页面或运行结果，不行就继续让 AI 改。这种方式很适合周末 demo、一次性脚本、临时网页、小型个人工具。它的优势是快，缺点也清楚：质量不可控，维护困难，安全边界模糊，项目复杂后很容易失控。

第二种可以叫“工程式 Vibe Coding”：AI 负责编码和执行，人负责目标、架构、约束、测试、审查和最终责任。这种方式适合长期维护的项目、课程设计、科研复现、全栈应用、团队协作和需要部署的系统。本文系列主要讨论的是第二种。

Google Cloud 等资料会把类似区别表述为 pure vibe coding 和 responsible AI-assisted development。这个区分很重要：前者追求速度和体验，后者追求可控、可维护、可交付。对于计算机学生和初级开发者，真正值得学习的是后者。

## 这组文章重点面向谁

这组文章的核心读者不是完全没接触过代码的人，而是已经具备一些基础的人。

如果你是计算机专业学生，至少写过 C、Java、Python、JavaScript 中的一两门语言，知道函数、模块、类、接口、数据库、命令行和 Git 的基本概念，那么你非常适合系统学习 Vibe Coding。AI 可以帮你把“会写小程序”推进到“能独立做项目”，也能帮助你读懂陌生代码库、补测试、写文档、排查环境问题。

如果你是熟练使用电脑的大学生，虽然不是计算机专业，但愿意学习代码，也可以从小工具和课程项目开始。你不一定要一开始理解所有框架细节，但至少要愿意看报错、运行命令、分辨文件结构，并逐步补齐基础知识。

如果你是初级开发者，Vibe Coding 的价值不是替你写几个函数，而是帮你更快完成跨文件任务：理解旧项目、补齐接口、重构重复逻辑、写测试、生成迁移说明、整理 PR 描述。它可以放大你的工程能力，但不会替你承担工程责任。

如果你是科研或课程项目开发者，Vibe Coding 特别适合处理实验脚本、数据预处理、仓库复现、结果整理和工程包装。不过论文理解、实验设计、结论判断仍然必须由研究者自己负责。

非技术人员也可以用 AI 做原型，但这不是本系列主线。对他们来说，更适合的目标是验证想法、制作简单页面、整理自动化流程；一旦涉及数据安全、上线系统、付费业务或长期维护，就需要有技术判断的人参与。

## 学 Vibe Coding 到底是在学什么

学习 Vibe Coding 不是背 Prompt 模板，也不是追逐某一个工具。工具会变化，但下面几种能力会长期有用。

第一是需求表达能力。你要能把模糊想法写成目标、范围、输入、输出、限制和验收标准。AI 不怕你啰嗦，怕你既不给上下文，又希望它猜中你的真实意图。

第二是任务拆分能力。不要一上来就说“帮我写一个完整项目”。更稳的做法是先让 AI 读项目、复述理解、提出计划，然后按模块小步实现。任务越小，反馈越快，失控概率越低。

第三是上下文管理能力。AI 不是永远记得你的项目背景。重要规则应该写进 README、SPEC、AGENTS.md、progress.md 等文件里，而不是散落在聊天记录中。上下文越清楚，输出越稳定。

第四是工程审查能力。AI 生成的代码必须被运行、测试、审查。你要看 diff，理解它改了什么，确认是否引入安全问题、性能问题、依赖问题或隐藏的行为变化。

第五是流程沉淀能力。一条好 Prompt 只是一次成功；一套可复用规则才会让后续项目持续受益。把常用步骤沉淀成项目说明、检查清单、脚本或 Skill，才算真正建立了自己的 AI 开发工作流。

## 六篇文章分别解决什么问题

第一篇就是这篇导读，回答“Vibe Coding 是什么、适合谁、为什么不能只讲零基础造应用”。读完你应该能建立一个基本判断：AI 编程不是让人不用学工程，而是让工程能力的重心发生变化。

第二篇讲学习路线。它会按照脚本、小页面、接口、课程项目、MVP、科研实验的顺序，给计算机学生一条从 0 到 1 的练习路径。重点不是列工具，而是告诉你每一阶段应该练什么能力、做什么项目、如何验收。

第三篇讲工具链。Cursor、Codex、Claude Code、Copilot 等工具各有适用场景。文章不会做“谁最强”的排行榜，而是按任务类型解释：什么时候用 IDE 补全，什么时候用项目级 agent，什么时候用命令行，什么时候让 AI 只做代码审查。

第四篇讲工程闭环。它把一次 Vibe Coding 任务拆成 Explore、Plan、Implement、Verify、Review、Commit 六步。这个流程适合课程项目，也适合真实工作：先探索，再计划，再实现，再验证，再审查，最后提交。

第五篇讲上下文工程。它会解释 AGENTS.md、CLAUDE.md、Cursor Rules、README、SPEC、progress.md、Skills 这些东西分别解决什么问题，以及学生项目里最小可用的规则文件应该怎么写。

第六篇讲实战。它会把前面的方法落到课程项目、个人工具和科研复现中，用麻将计分小程序、全栈项目和模型复现作为例子，展示如何拆任务、写 Prompt、跑测试、记录结果。

## 一个最小可用的学习顺序

如果你现在就想开始，不需要先读完所有资料。可以按下面这个顺序实践：

1. 选一个小项目，比如文件整理脚本、课程表网页、记账页面、实验结果汇总工具。
2. 写一份 1 页以内的需求说明，包括目标、功能、输入输出、限制和验收标准。
3. 让 AI 先复述需求并提计划，不要立刻写完整代码。
4. 每次只让 AI 做一个小改动，并要求说明改了哪些文件。
5. 你自己运行项目、复制报错、让 AI 根据真实反馈修复。
6. 每完成一个功能就看一次 diff，确认没有多余改动。
7. 把踩坑记录写进 `progress.md`，把长期规则写进 `AGENTS.md`。

这个顺序看起来慢，但它会让你建立控制感。Vibe Coding 最危险的地方不是 AI 写错，而是人不知道 AI 写了什么。

## 本篇 Checklist

- 我是否理解 Vibe Coding 不是简单的代码补全？
- 我是否区分了玩具式 demo 和工程式 AI 辅助开发？
- 我是否知道本系列重点服务有一定计算机基础的读者？
- 我是否接受“AI 可以写代码，但人必须验收代码”这个前提？
- 我是否能为自己的第一个练习项目写出目标、范围和验收标准？

## 参考资料

- [tukuaiai/vibe-coding-cn](https://github.com/tukuaiai/vibe-coding-cn)
- [别再说 AI 编程就是 Vibe Coding 了！6 种主流模式一次讲清](https://www.cnblogs.com/qiniushanghai/p/20064357)
- [Vibe Coding AI 工作流指南 2026](https://ofox.ai/zh/blog/vibe-coding-ai-workflow-guide-2026/)
- [What is vibe coding? - Google Cloud](https://cloud.google.com/discover/what-is-vibe-coding)
- [What is vibe coding? - IBM Think](https://www.ibm.com/think/topics/vibe-coding)
- [Vibe Coding Best Practices - roadmap.sh](https://roadmap.sh/vibe-coding/best-practices)
- [Claude Code: Best practices for agentic coding](https://www.anthropic.com/engineering/claude-code-best-practices)
- [Custom instructions with AGENTS.md - OpenAI Developers](https://developers.openai.com/codex/guides/agents-md)
