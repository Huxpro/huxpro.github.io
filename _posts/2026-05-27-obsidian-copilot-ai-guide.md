---
layout: post
title: "Obsidian + Copilot：把 AI 接进你的第二大脑完整教程"
subtitle: "从社区插件安装、云端 API、本地 Ollama 到 Vault QA 和常见排错"
date: 2026-05-27 22:00:00 +0800
author: "CodeWater517"
header-img: "img/home-bg-geek.jpg"
header-mask: 0.35
tags:
  - AI
  - Obsidian
  - Copilot
  - 工具
  - 知识管理
last_modified_at: 2026-05-27 22:00:00 +0800
revision_history:
  - time: 2026-05-27 22:00:00 +0800
    description: "新增 Obsidian Copilot AI 完整教程。"
---

> 这篇教程把 Obsidian Copilot 官方文档、插件页、GitHub README、Ollama/DeepSeek/OpenAI 文档和中文社区实战文章清洗成一条可执行路线：先装插件，再接模型，最后把聊天、笔记引用、Vault QA、自定义 Prompt 和排错流程串起来。

## 资料清洗说明

我优先采用官方资料：Obsidian 社区插件文档、Copilot 官方文档、Copilot GitHub README、Ollama 官方文档、DeepSeek API 文档、OpenAI API 文档。中文社区文章只用于补充本地 Ollama 和中文用户常见配置路径。

检索时有几个页面没有作为正文依据：

- `https://developers.openai.com/api/docs/models/overviewGPT`：搜索结果中出现，但打开时是 OpenAI API 文档的无效页面，不作为依据。
- `https://www.obsidiancopilot.com/en/privacy?utm_source=openai`：带参数的链接不稳定，正文改用可打开的 `https://www.obsidiancopilot.com/en/privacy`。
- GitHub 页面有时会显示 `There was an error while loading` 的动态区域错误；正文只采用 README 中可读取的安装和功能说明。

## 先说清楚：这里的 Copilot 是什么

这里讲的 **Copilot** 是 Obsidian 的社区插件 **Copilot for Obsidian**，不是 GitHub Copilot。

它的目标也不是帮你在编辑器里补代码，而是把大模型接进 Obsidian 知识库：

- 你可以在侧边栏和 AI 聊天；
- 可以让 AI 读取当前笔记或指定笔记；
- 可以把聊天记录保存成 Markdown；
- 可以对选中的文本执行摘要、续写、翻译、润色等命令；
- 可以通过 Vault QA 在整个知识库里检索和回答问题；
- 可以接 OpenAI、Anthropic、Google、Cohere 等云端模型，也可以接 DeepSeek、OpenRouter、ZenMux 这类 OpenAI-compatible 服务；
- 如果你更在意隐私，还可以接 Ollama 或 LM Studio 跑本地模型。

最稳的入门路线是：

```text
安装 Obsidian -> 安装 Copilot 插件 -> 配置一个 Chat Model -> 测试聊天
-> 配置 Embedding Model -> 建立 Vault QA 索引 -> 调整 Prompt 和排除规则
```

不要一开始就追求“全自动知识库助手”。先让聊天稳定工作，再让它读单篇笔记，最后再上 Vault QA。这样排错会轻很多。

## 你需要准备什么

基础准备：

- Obsidian 桌面版；
- 一个 Obsidian vault；
- 能访问插件市场的网络环境；
- 至少一个可用模型来源。

模型来源可以选三类：

1. **云端 API**：OpenAI、Anthropic、Google Gemini、Cohere 等。配置最省心，效果通常最好，但笔记内容会发送到对应服务商。
2. **OpenAI-compatible API**：DeepSeek、OpenRouter、ZenMux 或其他兼容 `/chat/completions` 的服务。价格和可用模型更灵活，但要认真填 base URL、model name 和 API key。
3. **本地模型**：Ollama 或 LM Studio。隐私更好，没有按 token 计费，但依赖电脑性能，速度和效果取决于本地模型。

如果你只是第一次尝试，建议先用云端 API 跑通。等你理解 Copilot 的工作方式后，再把敏感笔记迁到本地模型路线。

## 安装 Copilot 插件

Obsidian 的社区插件会运行第三方代码。官方文档提醒过，使用社区插件前需要关闭 Restricted Mode，并且要自行判断插件是否可信。我的建议是：只装维护活跃、下载量高、文档清楚的插件；不要把所有插件都当成系统内置功能。

安装步骤：

1. 打开 Obsidian。
2. 进入 `Settings`。
3. 找到 `Community plugins`。
4. 关闭 `Restricted mode`。
5. 点击 `Browse`，搜索 `Copilot`。
6. 选择 **Copilot**，作者是 Logan Yang。
7. 点击 `Install`，安装后再点击 `Enable`。

启用后，左侧 ribbon 或命令面板里会出现 Copilot 相关入口。第一次打开时，不要急着问复杂问题，先进入设置页把模型配好。

## 路线一：云端 API，最适合新手

云端 API 的优点是简单：拿到 API key，填进 Copilot，选择模型，测试即可。

在 Copilot 设置里通常要做三件事：

1. 在 provider 对应区域填入 API key。
2. 在 Chat Model 里选择聊天模型。
3. 如果要用 Vault QA，再选择 Embedding Model。

以 OpenAI 为例：

1. 去 OpenAI API 平台创建或选择一个 project。
2. 在 project 里创建 API key。
3. 确认账号有 billing 或可用额度。
4. 回到 Obsidian 的 Copilot 设置，把 API key 填进去。
5. 选择一个 chat model。
6. 点击测试或直接打开 Copilot Chat 发一句简单问题。

这里有一个非常常见的误区：**ChatGPT Plus/Pro 订阅不等于 OpenAI API 余额**。Copilot 调用的是 API，不是网页端 ChatGPT。如果你填了 OpenAI key 但一直报 quota、billing 或 401/429，先去 API 平台检查项目、权限、余额、预算和 rate limit。

如果你用 Anthropic、Google Gemini 或 Cohere，思路相同：在对应服务商后台创建 API key，然后在 Copilot 的设置页填入。不同服务商的模型名称、上下文长度、价格和速率限制不同，遇到失败时优先检查这四项。

## 路线二：DeepSeek、OpenRouter、ZenMux 等兼容接口

Copilot 支持自定义模型。只要服务商提供 OpenAI-compatible API，你通常可以把它当成“自定义 OpenAI 接口”来配。

通用配置项是：

- provider：选择自定义模型或 OpenAI-compatible；
- base URL：服务商给的 API 根地址；
- API key：服务商后台生成的 key；
- model name：必须和服务商文档里的模型名完全一致；
- streaming：如果服务商支持流式输出，可以打开；
- embedding model：Vault QA 需要单独配置，不要把聊天模型误填成 embedding。

以 DeepSeek 为例，DeepSeek 文档说明它兼容 OpenAI/Anthropic API 格式。2026-05-27 检索时，OpenAI-compatible base URL 是：

```text
https://api.deepseek.com
```

模型名以 DeepSeek 当前文档为准。检索时文档列出了 `deepseek-v4-flash`、`deepseek-v4-pro`，并说明旧的 `deepseek-chat`、`deepseek-reasoner` 将在 2026-07-24 废弃。也就是说，如果你在网上看到旧教程让你填 `deepseek-chat`，它可能还能兼容一段时间，但新配置更应该优先看官方文档。

这类兼容接口最容易出错的地方是 base URL。不要把聊天接口完整路径和根地址混在一起。例如服务商文档如果写：

```text
https://api.example.com/v1/chat/completions
```

Copilot 设置里可能需要填的是：

```text
https://api.example.com/v1
```

具体要看插件当前字段说明和服务商兼容方式。遇到 404，先检查 model name 和 base URL；遇到 401，先检查 key；遇到 429，检查余额、限速和并发。

## 路线三：Ollama 本地模型，隐私优先

如果你希望笔记尽量不离开本机，可以用 Ollama 跑本地模型。这个路线更适合有一定折腾能力的用户，因为你要同时处理模型下载、显存/内存、端口、模型名称和 embedding。

安装 Ollama 后，先拉一个聊天模型。中文知识库可以从 Qwen 系列开始，例如：

```bash
ollama pull qwen3:8b
```

再拉一个 embedding 模型。Copilot 的 Vault QA 需要 embedding model，不能只配聊天模型：

```bash
ollama pull nomic-embed-text
```

确认 Ollama 服务在本机运行：

```bash
ollama list
```

Ollama 默认服务地址通常是：

```text
http://localhost:11434
```

在 Copilot 里配置本地模型时，关键是模型名要和 `ollama list` 里显示的一致。例如你拉的是 `qwen3:8b`，就不要填成 `qwen3` 或 `Qwen3-8B`。如果你拉的是 `nomic-embed-text`，embedding model 也要原样填写。

Ollama 还提供 OpenAI-compatible API。某些工具会用类似下面的地址：

```text
http://localhost:11434/v1
```

但 Copilot 的 Ollama 内置配置和自定义 OpenAI-compatible 配置可能需要的 base URL 不同。优先按 Copilot 设置页当前提示填写；不通时再切换到 OpenAI-compatible 方式测试。

本地模型路线的建议：

- 8B 级别模型适合普通笔记总结、改写、问答；
- 14B、30B 以上模型效果更好，但更吃内存和显存；
- 笔记很长时，本地小模型容易漏信息；
- Vault QA 检索本身靠 embedding，回答质量还要看 chat model；
- 电脑性能一般时，先小规模索引，不要一上来索引整个 vault。

## 三套推荐配置

如果你不知道怎么选，可以直接照下面三套思路走。

**新手稳定版**

- Chat Model：OpenAI、Anthropic 或 Gemini 的主流聊天模型；
- Embedding Model：同一服务商的 embedding；
- 适合：第一次搭建、希望少排错、愿意为效果和稳定性付费；
- 注意：敏感笔记会进入第三方 API 请求，先排除隐私文件夹。

**隐私优先版**

- Chat Model：Ollama 本地模型，例如 Qwen 系列；
- Embedding Model：`nomic-embed-text` 或其他本地 embedding；
- 适合：日记、个人资料、研究笔记、公司内部资料；
- 注意：效果和速度取决于本机，首次索引可能较慢。

**混合实用版**

- 日常聊天和敏感笔记：本地模型；
- 复杂推理、长文总结、英文资料：云端强模型；
- Vault QA：根据笔记敏感程度选择本地或云端 embedding；
- 适合：既要隐私，又希望关键任务效果稳定。

我更推荐第三种。真正长期使用时，你会发现“所有问题都用同一个模型”并不划算。轻任务用本地，重任务用云端，敏感内容不出本机，这个组合更耐用。

## Copilot Chat：先从单篇笔记开始

模型配好后，打开 Copilot Chat，先问一个和当前笔记无关的问题，比如：

```text
用三句话解释什么是间隔重复。
```

如果能正常回复，再测试当前笔记上下文。

在 Copilot Chat 里，你可以用类似 `[[Note Title]]` 的方式引用某篇笔记。这个能力非常适合让 AI 基于指定笔记回答，而不是泛泛聊天。

例子：

```text
请阅读 [[机器学习课程笔记]]，帮我整理成一份考试复习提纲。
```

也可以让它比较多篇笔记：

```text
比较 [[Transformer]] 和 [[RNN]] 这两篇笔记，列出它们在序列建模上的核心差异。
```

建议一开始多用明确引用。不要直接问“我的知识库里关于深度学习有哪些内容”，那属于 Vault QA/RAG 的工作，需要先建索引。

Copilot Chat 还有一个很实用的习惯：把有价值的对话保存为 Markdown。这样 AI 的回答不会只停留在侧边栏，而是进入你的知识库，后续还能继续链接、改写和复盘。

## 右键命令、Slash 命令和日常写作

Copilot 不只是聊天窗口。它还提供命令能力，适合在编辑笔记时直接处理选中文本。

常见用法：

- 选中一段文字，让 Copilot 总结；
- 选中英文资料，让 Copilot 翻译成中文；
- 选中粗糙笔记，让 Copilot 改成结构化提纲；
- 选中会议记录，让 Copilot 提取行动项；
- 选中草稿段落，让 Copilot 改写成更清晰的表达。

如果你经常做同一种操作，不要每次都手写长 prompt。可以把它做成自定义 Prompt。

例如给课程笔记准备一个 Prompt：

```text
请把选中的课程笔记整理成：
1. 核心概念
2. 易错点
3. 公式或定义
4. 可能考试题
5. 我需要回看原文的位置

保留专有名词，不要编造笔记中没有的信息。
```

给读书笔记准备一个 Prompt：

```text
请基于选中文本生成读书卡片：
- 一句话摘要
- 三个关键观点
- 一个可以和我已有经验连接的问题
- 值得摘录的短句

如果原文信息不足，请明确说“不足”，不要补写不存在的内容。
```

自定义 Prompt 的价值不是“节省几个字”，而是把你对笔记质量的要求固定下来。长期看，这比每次临时聊天稳定得多。

## Vault QA：让 AI 问整个知识库

Vault QA 是 Copilot 最像“第二大脑助手”的部分。它的原理大致是 RAG：先把你的笔记切分、向量化、建索引；你提问时，插件先从 vault 中检索相关片段，再把这些片段交给聊天模型回答。

因此 Vault QA 至少需要两类模型：

1. **Chat Model**：负责最终回答。
2. **Embedding Model**：负责把笔记和问题转成可检索的向量。

只配 chat model，Vault QA 不会完整工作。只配 embedding，也不能生成最终答案。

首次使用建议这样做：

1. 在 Copilot 设置里配置 embedding model。
2. 进入 Vault QA 或相关设置区域。
3. 先索引一个小文件夹，而不是整个 vault。
4. 用一个你知道答案的问题测试。
5. 检查回答是否带有来源或引用。
6. 没问题后再扩大索引范围。

适合 Vault QA 的问题：

```text
我关于“毕业设计选题”的笔记里，反复出现了哪些方向？
```

```text
根据我的课程笔记，操作系统里的进程、线程、协程有什么区别？
```

```text
找出我所有和“英语口语练习”相关的计划，帮我合并成一周安排。
```

不适合 Vault QA 的问题：

```text
帮我预测明年哪个行业最赚钱。
```

```text
我的全部笔记说明我是一个什么样的人？
```

前者需要实时外部信息，后者太宽泛也容易变成心理画像。Vault QA 最适合回答“我的笔记里已经写过什么，以及这些内容如何重新组织”。

## 索引策略：大 vault 不要一把梭

如果你的 vault 已经有几千篇笔记，第一次索引要谨慎。Vault QA 的成本和速度主要受这些因素影响：

- 笔记数量；
- 单篇笔记长度；
- embedding 模型价格或本地速度；
- API rate limit；
- Copilot 的 partition 和 batch 设置；
- 是否排除了附件、模板、归档和私密文件夹。

建议先排除这些内容：

- 日记、账单、身份证件、合同、密码片段；
- `.obsidian` 配置目录；
- templates；
- clippings 里质量很低的网页剪藏；
- 已归档但不再检索的旧资料；
- 大量自动生成的日志。

如果你用云端 embedding，先给 API 项目设置预算提醒，再小范围索引。OpenAI API 平台支持 project、key 权限、预算和 usage 统计；这些东西不是形式主义，是真的能帮你避免“索引一次知识库花了意料之外的钱”。

如果索引失败或结果很怪，可以按这个顺序排查：

1. 确认 embedding model 可用。
2. 确认 API key 有权限和余额。
3. 降低每分钟请求数或 batch。
4. 先索引一个小文件夹。
5. 使用 refresh index。
6. 必要时 force reindex。
7. 查看 list indexed files，确认文件真的被索引。
8. 调整 partition，让长文切分更适合检索。

不要把“模型答得不好”都归因于模型。很多时候是索引范围太乱、笔记命名太模糊、切分不合适，或者问题问得太宽。

## Copilot Plus：可选增强，不是入门必需

Copilot Plus 是 Copilot 的增强服务，不是使用 Copilot 的必要条件。普通 BYOK/API key 路线已经能完成大多数聊天、笔记处理和 Vault QA。

如果你订阅 Copilot Plus，可以使用更多上下文能力，例如：

- `@vault`：面向 vault 的上下文入口；
- `@websearch`：结合网页搜索；
- `@youtube`：处理 YouTube 内容；
- PDF、图片、URL 等上下文；
- Projects：为不同任务组织上下文和设置；
- Composer：面向更复杂写作和编辑任务的工作区。

我的建议是：先把免费插件和自己的模型 key 用熟，再决定是否需要 Plus。只有当你频繁需要 web、YouTube、PDF、多项目上下文时，Plus 才会明显省事。

隐私上也要分清楚：本地插件、第三方模型 API、Copilot Plus 服务是不同链路。你用哪个功能，内容就可能发到对应服务。敏感笔记不要只靠“我觉得它应该不会上传”来判断，应该明确看插件说明、服务商政策，并用排除规则和本地模型控制边界。

## 一个可长期使用的工作流

我会把 Obsidian + Copilot 分成四种日常动作。

第一种是**输入后整理**。课堂、会议、阅读时先快速记，不追求完美。结束后选中文本，让 Copilot 整理成标题、要点、行动项和待确认问题。

第二种是**单篇笔记深挖**。对一篇重要笔记，用 `[[Note Title]]` 引用后让 Copilot 提取论点、反例、关联概念和复习题。

第三种是**跨笔记回收**。每周用 Vault QA 问：

```text
这周我的笔记里反复出现了哪些主题？请按学习、项目、生活三类整理，并给出来源。
```

第四种是**沉淀 Prompt**。凡是你连续三次手写过的提示词，都做成自定义 Prompt。比如课程复习、论文阅读、会议纪要、项目周报、错题复盘。

这样用下来，Copilot 不会变成“旁边一个聊天机器人”，而是会嵌进你的知识生产流程。

## 常见问题排查

**填了 OpenAI key 但不能用**

先确认这是不是 API key，不是 ChatGPT 网页端账号；再检查 project、billing、key 权限、预算、rate limit。401 多半是 key 或权限，429 多半是限速或额度，quota/billing 报错就去 API 平台看余额和项目设置。

**DeepSeek 或其他兼容接口 404**

优先检查 base URL 和 model name。模型名要按服务商文档原样填写。DeepSeek 旧模型名有废弃时间，新的配置应优先看当前文档。

**Ollama 报 model not found**

先运行：

```bash
ollama list
```

看模型是否真的下载过。Copilot 里填的模型名必须和列表一致。没有就先：

```bash
ollama pull qwen3:8b
```

或拉你要用的其他模型。

**Ollama 连接失败**

确认 Ollama 正在运行，默认端口是 `11434`。如果你改过监听地址，Copilot 里也要同步修改。浏览器或命令行访问本机服务不通时，先别怀疑 Copilot，先把 Ollama 服务跑起来。

**Vault QA 没有引用来源**

先确认已经完成索引，再问一个明确会命中的问题。如果问题太宽，模型可能泛答。也要检查排除规则，别把目标文件夹排除了。

**Vault QA 答案明显遗漏**

刷新索引，必要时 force reindex。然后查看 indexed files，确认文件确实在索引里。长文太多时调整 partition；网页剪藏噪声太大时先清洗笔记。

**索引速度慢或费用高**

缩小索引范围，降低 RPM 或 batch，排除低价值文件夹。云端 embedding 要先设置预算提醒；本地 embedding 要接受速度较慢这个现实。

**担心隐私**

敏感笔记优先使用本地模型和本地 embedding；不要把日记、证件、合同、密码片段放进云端索引；用文件夹和标签排除规则控制范围。最重要的是：每换一个 provider，都重新想一遍“这段内容会发给谁”。

## 我的建议配置

如果你是计算机学生或普通知识管理用户，可以这样开始：

1. 先用一个云端 chat model 跑通 Copilot Chat。
2. 用 `[[Note Title]]` 练习引用单篇笔记。
3. 做 3 个自定义 Prompt：课程笔记整理、论文/文章摘要、周复盘。
4. 用一个小文件夹测试 Vault QA。
5. 再决定 embedding 用云端还是 Ollama。
6. 最后把敏感文件夹排除掉，再扩大索引范围。

如果你已经有大量笔记，不要第一天就索引全部 vault。AI 知识库真正的质量，来自“好笔记 + 好索引 + 好问题”，不是来自“把所有东西都塞进去”。

## 资料来源

- Obsidian 社区插件说明：[Community plugins](https://obsidian.md/help/community-plugins)
- Obsidian 插件市场：[Copilot](https://community.obsidian.md/plugins/copilot)
- Copilot 官方入门文档：[Getting Started](https://www.obsidiancopilot.com/en/docs/getting-started)
- Copilot 设置与模型配置：[Settings](https://www.obsidiancopilot.com/docs/settings)
- Copilot Chat：[Chat Mode](https://www.obsidiancopilot.com/en/docs/chat-mode)
- Copilot Vault QA：[Vault QA](https://www.obsidiancopilot.com/en/docs/vault-qa)
- Copilot 命令：[Copilot Commands](https://www.obsidiancopilot.com/docs/copilot-commands)
- Copilot 自定义提示词：[Custom Prompts](https://www.obsidiancopilot.com/en/docs/custom-prompts)
- Copilot Plus：[Copilot Plus](https://www.obsidiancopilot.com/docs/copilot-plus)
- Copilot Projects：[Projects](https://www.obsidiancopilot.com/docs/projects)
- Copilot Composer：[Composer](https://www.obsidiancopilot.com/en/docs/composer)
- Copilot FAQ 和索引排错：[FAQ](https://www.obsidiancopilot.com/en/docs/faq)
- Copilot GitHub README：[logancyang/obsidian-copilot](https://github.com/logancyang/obsidian-copilot)
- Copilot Plus 隐私说明：[Privacy Policy](https://www.obsidiancopilot.com/en/privacy)
- Ollama FAQ：[FAQ](https://docs.ollama.com/faq)
- Ollama OpenAI-compatible API：[OpenAI compatibility](https://docs.ollama.com/api/openai-compatibility)
- Ollama embedding 模型：[nomic-embed-text](https://ollama.com/library/nomic-embed-text)
- Ollama Qwen3 模型页：[qwen3](https://ollama.com/library/qwen3)
- DeepSeek API 文档：[Your First API Call](https://api-docs.deepseek.com/)
- OpenAI API 价格：[Pricing](https://platform.openai.com/docs/pricing)
- OpenAI API 项目、key、预算与权限：[Managing projects in the API platform](https://help.openai.com/en/articles/9186755-managing-projects-in-the-api-platform?t=1)
- 中文 Ollama + Copilot 实战参考：[Obsidian Copilot 结合 Ollama，零成本打造个人 AI 知识库](https://eryinote.com/post/1898)
- 本地 LLM + Obsidian Copilot 参考：[How to Use Obsidian with Local LLMs](https://insiderllm.com/guides/obsidian-local-llm-guide/)

## 本文没有采用的异常页面

- `https://developers.openai.com/api/docs/models/overviewGPT`：打开时不是有效模型文档。
- `https://www.obsidiancopilot.com/en/privacy?utm_source=openai`：带参数版本不稳定，改用无参数隐私政策页面。
- GitHub 页面动态区偶发加载错误，未采用无法加载区域的信息。
