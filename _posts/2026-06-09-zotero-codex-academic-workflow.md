---
layout: post
title: "Zotero + Codex：打造智能学术工作流完整教程"
subtitle: "从文献库、BibTeX、Markdown 笔记到 Codex 辅助综述、复现和论文写作"
date: 2026-06-09 15:30:00 +0800
author: "CodeWater517"
header-img: "img/home-bg-geek.jpg"
header-mask: 0.35
tags:
  - Zotero
  - Codex
  - AI
  - 学术
  - 文献管理
  - 工作流
last_modified_at: 2026-06-09 15:30:00 +0800
revision_history:
  - time: 2026-06-09 15:30:00 +0800
    description: "新增 Zotero 结合 Codex 打造智能学术工作流教程。"
---

> 这篇教程把 Zotero 官方文档、OpenAI Codex 官方文档、Better BibTeX 项目文档和几个 Zotero MCP 社区项目清洗成一条可执行路线。核心思路不是让 AI 替你读论文、替你做学术判断，而是让 Zotero 管好“可追溯的文献事实”，让 Codex 处理“可审查的工程和文本工作”。

## 结论

最稳的路线是：**Zotero 做唯一文献库，Better BibTeX 导出稳定 citation key，Markdown/CSV 承接笔记和综述矩阵，Codex 在项目文件夹里辅助整理、对比、写脚本、生成检查清单。**

如果你已经熟悉 MCP，可以再把 Zotero 接成 Codex 的外部上下文源。但对大多数人来说，第一版不需要直接打通数据库。先把“文献条目干净、引用键稳定、笔记可读、项目文件可版本管理”跑通，收益最大，也最不容易翻车。

## 资料清洗说明

| 来源 | 类型 | 时间/版本 | 优点 | 问题 | 推荐度 |
|---|---|---|---|---|---:|
| [Zotero Web API v3](https://www.zotero.org/support/dev/web_api/v3/) | 官方文档 | 2026-06-07 更新 | 说明 API v3、Local API、客户端库和同步能力 | 偏开发者，普通用户不一定需要 | 5 |
| [Zotero Web API Basics](https://www.zotero.org/support/dev/web_api/v3/basics) | 官方文档 | 近期维护 | 明确 API 版本、搜索、导出格式、BibTeX/BibLaTeX/CSL JSON 等 | 直接写 API 脚本需要基础 | 5 |
| [Zotero Creating Bibliographies](https://www.zotero.org/support/creating_bibliographies) | 官方文档 | 2025-12-12 更新 | 解释 Quick Copy、复制引用、生成参考文献 | 不覆盖 AI 工作流 | 5 |
| [Zotero 数据目录不要放云盘](https://www.zotero.org/support/kb/data_directory_in_cloud_storage_folder) | 官方知识库 | 2025-03-31 更新 | 明确说明云盘同步数据目录容易损坏数据库 | 语气很强，但这是必须遵守的安全线 | 5 |
| [Codex Quickstart](https://developers.openai.com/codex/quickstart) | OpenAI 官方文档 | 2026-06-09 检索 | 覆盖 App、IDE 扩展、CLI、云端入口和安装方式 | 产品能力变化快，需要以官方页为准 | 5 |
| [Codex Customization](https://developers.openai.com/codex/concepts/customization) | OpenAI 官方文档 | 2026-06-09 检索 | 解释 AGENTS.md、Skills、MCP、Subagents 的分工 | 偏概念，需要转成科研场景 | 5 |
| [Codex MCP](https://developers.openai.com/codex/mcp) | OpenAI 官方文档 | 2026-06-09 检索 | 说明 Codex 支持 STDIO 和 Streamable HTTP MCP server、CLI 和 config.toml 配置 | 只说明 Codex 侧接法，不保证第三方 Zotero MCP 质量 | 5 |
| [Better BibTeX Installation](https://retorque.re/zotero-better-bibtex/installation/) | 项目文档 | 2026-06-09 检索 | 安装步骤清楚，提醒 XPI 要装进 Zotero 而不是 Firefox | 第三方插件，需确认 Zotero 版本兼容 | 4 |
| [Better BibTeX Citation Keys](https://retorque.re/zotero-better-bibtex/citing/) | 项目文档 | 2026-06-09 检索 | 说明稳定 citation key、Quick Copy、Markdown/LaTeX 引用 | 配置项较多，新手容易过度折腾 | 4 |
| [kujenga/zotero-mcp](https://github.com/kujenga/zotero-mcp) | GitHub 社区项目 | latest release: 2025-04-19 | 支持通过 Local API 或 Web API 搜索 Zotero、取 metadata 和 full text | 非官方集成，适合进阶用户先小库测试 | 3 |
| [swairshah/zotero-mcp-server](https://github.com/swairshah/zotero-mcp-server) | GitHub 社区项目 | 无正式 release | 提供本地 Zotero MCP 思路，展示 API 与 SQLite 路线差异 | SQLite 直连需要关闭 Zotero，风险更高 | 2 |

我没有把“AI 直接替你写完整论文”作为推荐路线。原因很简单：论文写作的风险不在能不能生成文字，而在证据是否准确、引用是否可追溯、方法是否可复现、结论是否由你负责。

## 先分清三层

这套工作流里有三层。

第一层是 **Zotero**。它负责保存文献条目、PDF、批注、标签、集合、引用格式和参考文献。Zotero 里的条目是事实来源，不要让多个工具各自维护一份“差不多”的文献表。

第二层是 **项目文件夹**。它负责承接可以被版本管理、可以被 Codex 阅读、可以被你审查的材料，例如 `library.bib`、`literature-matrix.csv`、论文笔记、实验日志、草稿和复现代码。

第三层是 **Codex**。它负责帮你读项目文件、整理矩阵、生成脚本、检查引用、拆解复现任务、写摘要草稿、发现逻辑缺口。Codex 不是文献库本身，也不应该成为唯一事实来源。

推荐路线可以写成：

```text
Zotero 收集和校正文献
-> Better BibTeX 导出稳定 citation key
-> 项目文件夹保存 bib、笔记、矩阵、草稿、代码
-> Codex 在项目中做整理、复现、检查和写作辅助
-> 最终引用回到 Zotero / BibTeX / Word 插件 / Pandoc 链路验证
```

## 适合谁

这套流程适合：

- 研究生、科研训练学生、课程论文作者；
- 需要长期积累英文论文和中文文献的人；
- 想做综述、开题、复现、实验对比、论文草稿的人；
- 已经会基本使用 Zotero，但笔记、引用和 AI 协作比较混乱的人；
- 用 Codex 做科研工程整理、代码复现、数据处理脚本和写作检查的人。

如果你只是偶尔写一篇课程论文，不写 LaTeX、不写 Markdown、不做复现，最低配只需要 Zotero + Word 插件 + 少量人工笔记。不要为了“智能工作流”给自己增加一堆维护负担。

## 最小可用工作流

第一版只做五件事：

1. Zotero 中每篇文献的元数据要干净。
2. 每篇重要文献有一个稳定 citation key。
3. 每个论文项目有一个独立文件夹。
4. 项目文件夹里有文献矩阵、笔记、草稿和引用库。
5. Codex 每次工作都基于这些可审查文件，而不是凭空聊天。

推荐目录：

```text
my-paper-project/
  README.md
  AGENTS.md
  references/
    library.bib
    selected-papers.md
  literature/
    matrix.csv
    notes/
      2024-smith-rag-evaluation.md
      2025-chen-agent-memory.md
  drafts/
    outline.md
    related-work.md
  experiments/
    README.md
  prompts/
    codex-literature-review.md
```

`README.md` 写这个项目研究什么，当前阶段是什么。`AGENTS.md` 写 Codex 在这个项目里必须遵守的规则。`library.bib` 来自 Zotero 或 Better BibTeX。`matrix.csv` 是文献矩阵。`notes/` 是每篇论文的读书卡片。`drafts/` 是你和 Codex 协作生成但必须人工审查的草稿。

## 1. 准备 Zotero 文献库

这一步在做什么：把 Zotero 变成你的唯一文献事实源。

为什么需要：Codex 可以整理文本，但它不能替你保证文献条目一定准确。标题、作者、年份、期刊、DOI、页码、会议名、中文作者顺序，这些必须先在 Zotero 里校正。

在哪里操作：Zotero 桌面端。

具体操作：

1. 用 Zotero Connector 抓取论文。
2. 对重要论文手动检查标题、作者、年份、DOI、期刊/会议。
3. 把 PDF 作为条目的附件，不要让 PDF 长期作为独立文件漂在库里。
4. 建立项目集合，例如 `Thesis / Related Work / RAG Evaluation`。
5. 建立简单标签，例如 `todo`、`reading`、`read`、`core`、`method`、`baseline`、`dataset`。

成功后应该看到什么：

- 每篇重要论文在 Zotero 中都有父条目；
- PDF 挂在正确父条目下；
- 条目字段不是乱码；
- 你能用集合和标签快速找回论文。

如果你看到同一篇论文出现两个条目，先用 Zotero 的重复检测合并或手动保留字段更完整的一条。不要让重复条目同时进入后续 BibTeX 导出，否则 citation key 和参考文献都会变乱。

## 2. 安装 Better BibTeX

这一步在做什么：给 Zotero 增加更稳定的 BibTeX/BibLaTeX 导出和 citation key 管理。

为什么需要：Zotero 原生也能导出 BibTeX，但 Better BibTeX 更适合 LaTeX、Markdown、Pandoc、Quarto、Obsidian 和代码项目里的纯文本写作。它能生成更稳定的 citation key，并支持自动导出。

在哪里操作：Zotero 桌面端和浏览器。

具体操作：

1. 打开 [Better BibTeX Installation](https://retorque.re/zotero-better-bibtex/installation/)。
2. 下载 latest release 的 `.xpi` 文件。
3. 如果用 Firefox 下载，右键另存为，不要直接点开安装到 Firefox。
4. 打开 Zotero。
5. 进入 `Tools` -> `Plugins`。
6. 点击齿轮，选择 `Install Plugin From File...`。
7. 选择 `.xpi`，安装并重启 Zotero。

成功后应该看到什么：

- Zotero 插件列表里出现 Better BibTeX；
- Zotero 设置中出现 Better BibTeX 面板；
- 条目列表可以显示 citation key；
- 右键导出时能看到 Better BibTeX 或 Better BibLaTeX 格式。

如果你看到 `.xpi` 安装失败，先确认它没有被浏览器改名、解压或下载不完整。Better BibTeX 是 Zotero 插件，不是 Firefox 插件。

## 3. 设置 citation key

这一步在做什么：让每篇文献有一个稳定、可读、可引用的 ID。

为什么需要：在 Markdown、LaTeX、Pandoc 或 Codex 生成的草稿中，你会看到 `[@smithRetrievalAugmentedGeneration2024]` 这种引用。这个 key 必须稳定，否则草稿和文献库会对不上。

在哪里操作：Zotero 设置里的 Better BibTeX。

推荐原则：

- citation key 不要太短，否则容易冲突；
- 不要频繁改变 key 生成规则；
- 已经写进草稿的 key，不要随便刷新；
- 对核心文献可以手动 pin key；
- 中文文献可以手动设一个清楚的英文 key。

一个适合新手的命名思路：

```text
作者姓氏 + 标题关键词 + 年份
```

例如：

```text
smithRagEvaluationSurvey2024
chenAgentMemoryBenchmark2025
wangChineseAcademicWriting2023
```

成功后应该看到什么：

- 每篇核心文献在 Zotero 里能看到 citation key；
- 把条目拖到 Markdown 编辑器时，可以得到类似 `[@citekey]` 的引用；
- 同一项目中没有重复 key。

如果你看到 Codex 在草稿里编了一个不存在的 `[@fake2024]`，不要手工猜。回到 `library.bib` 搜索 key 是否存在。不存在就让 Codex 修正为真实 key，或者把这句话改成不带引用的待核查陈述。

## 4. 导出项目级 library.bib

这一步在做什么：把 Zotero 中与当前项目相关的文献导出到项目文件夹。

为什么需要：Codex 擅长读取本地项目文件。让它直接读 `references/library.bib`，比让它在聊天里记住几十篇论文可靠得多。

在哪里操作：Zotero 和你的论文项目文件夹。

推荐做法：

1. 在 Zotero 中选中当前项目集合。
2. 右键集合，选择导出。
3. 格式选择 `Better BibLaTeX` 或 `Better BibTeX`。
4. 如果你写 LaTeX 或 Quarto，优先 `Better BibLaTeX`。
5. 如果你的工具只认 BibTeX，就用 `Better BibTeX`。
6. 保存到项目的 `references/library.bib`。
7. 如果 Better BibTeX 提供 `Keep updated` 或自动导出选项，可以打开。

成功后应该看到什么：

```text
my-paper-project/references/library.bib
```

文件里有类似：

```bibtex
@article{smithRagEvaluationSurvey2024,
  title = {Retrieval-Augmented Generation Evaluation Survey},
  author = {Smith, Jane and Lee, Kai},
  year = {2024}
}
```

如果你看到 `library.bib` 为空，检查导出的集合是否真的包含条目。很多人导错到空集合，或者只选中了一个附件而不是父条目。

## 5. 建立文献矩阵

这一步在做什么：把“读过很多论文”变成“可以比较和写综述的结构化表格”。

为什么需要：综述不是论文摘要的堆叠，而是问题、方法、数据、指标、结论和局限的比较。Codex 可以帮你整理矩阵，但矩阵字段要你先定义。

在哪里操作：项目文件夹，建议用 CSV 或 Markdown 表格。

新建 `literature/matrix.csv`：

```csv
citekey,title,year,problem,method,data,metric,key_finding,limitation,use_in_my_work,status
smithRagEvaluationSurvey2024,Retrieval-Augmented Generation Evaluation Survey,2024,RAG evaluation,survey,multiple,N/A,Groups metrics by retrieval and generation stages,Lacks unified benchmark,Background and taxonomy,read
```

字段解释：

- `citekey`：和 Zotero / Better BibTeX 对齐；
- `problem`：论文解决什么问题；
- `method`：方法是什么；
- `data`：用什么数据；
- `metric`：怎么评价；
- `key_finding`：最重要结论；
- `limitation`：作者承认或你发现的限制；
- `use_in_my_work`：你准备在自己的论文里怎么用；
- `status`：待读、在读、已读、核心引用、暂不引用。

成功后应该看到什么：

- 每一行对应一篇真实文献；
- 每一行都有真实 citation key；
- Codex 可以根据这个表生成主题聚类、差异对比和综述段落草稿。

如果矩阵字段太多，先删掉。初期字段越少，越容易坚持。矩阵不是为了好看，而是为了写作时能快速回答“哪篇论文支持这句话”。

## 6. 建立单篇论文笔记模板

这一步在做什么：给每篇核心论文建立一张可以被 Codex 阅读的读书卡片。

为什么需要：Zotero 批注适合阅读现场，项目里的 Markdown 笔记适合写作和复现。两者不是替代关系。

在哪里操作：项目文件夹的 `literature/notes/`。

模板：

```markdown
# @smithRagEvaluationSurvey2024

## 基本信息

- 标题：
- 年份：
- 类型：survey / method / benchmark / dataset / theory / application
- Zotero citation key：
- PDF 位置：Zotero

## 这篇论文解决什么问题

用自己的话写 3-5 句话。

## 方法或框架

- 核心假设：
- 关键步骤：
- 和已有方法的区别：

## 实验或证据

- 数据集：
- 指标：
- 主要结果：
- 作者承认的局限：

## 我准备怎么用

- 背景引用：
- 方法对比：
- 实验设置参考：
- 反例或局限讨论：

## 待核查

- [ ] 需要回原文确认的页码或表格
- [ ] 需要补充的相关工作
```

成功后应该看到什么：

- 你能不用打开 PDF，就知道这篇论文在你项目中的作用；
- Codex 能根据笔记生成综述矩阵、对比表和待办清单；
- 每个判断都能回到原文或 Zotero 条目。

不要把 PDF 全文直接粘进笔记。长文本会让项目混乱，也会增加隐私和版权风险。笔记应该是你读过后的结构化摘录和判断。

## 7. 写一个科研项目 AGENTS.md

这一步在做什么：告诉 Codex 在这个学术项目中必须如何工作。

为什么需要：OpenAI 的 Codex 文档把 `AGENTS.md` 定位为持久项目指导。科研项目尤其需要约束，因为 AI 很容易把不确定的内容写成确定结论，把不存在的引用写进草稿。

在哪里操作：项目根目录。

示例：

```markdown
# AGENTS.md

## 项目规则

- 所有文献引用必须来自 `references/library.bib` 或 `literature/matrix.csv`。
- 不要编造 citation key、DOI、作者、年份、实验结果或页码。
- 如果证据不足，用“待核查”标记，不要写成确定结论。
- 修改草稿前先说明会改哪些文件。
- 综述段落必须保留 citation key，例如 `[@smithRagEvaluationSurvey2024]`。
- 复现代码和实验脚本要放在 `experiments/`，不要混进 `literature/`。
- 任何涉及 API key、未发表论文、课题组内部数据的内容，都不要写进公开文件。

## 常用验证

- 检查引用是否存在：搜索 `references/library.bib`。
- 检查矩阵字段是否完整：查看 `literature/matrix.csv`。
- 检查草稿中的待核查内容：搜索 `待核查`。
```

成功后应该看到什么：

- 每次在这个项目中启动 Codex，它都能看到你的工作规则；
- Codex 输出会更少凭空发挥；
- 你不需要在每次聊天里重复“不要编引用”。

## 8. 让 Codex 做文献整理

这一步在做什么：让 Codex 基于真实文件整理文献，而不是让它凭记忆回答。

为什么需要：学术工作流里，最重要的是可追溯。Codex 读项目文件后可以帮你处理大量重复整理工作，但你仍然要审查结论。

在哪里运行：项目根目录。可以用 Codex App、IDE 扩展或 CLI。

如果用 CLI，先确认安装：

```bash
codex --version
```

如果没有安装，OpenAI 官方 Quickstart 给出的安装方式包括独立安装器、npm 和 Homebrew。安装后在项目根目录运行：

```bash
codex
```

给 Codex 的第一个任务不要太大：

```text
请先阅读 README.md、AGENTS.md、references/library.bib 和 literature/matrix.csv，不要修改文件。

请输出：
1. 这个项目的研究主题；
2. 目前文献矩阵覆盖了哪些问题；
3. 哪些字段缺失最多；
4. 哪些 citation key 可能没有在 library.bib 中出现；
5. 下一步最小整理任务。
```

成功后应该看到什么：

- Codex 能指出真实文件里的内容；
- 它不会直接生成一整篇综述；
- 它会先给你文献矩阵和引用库的健康状况。

如果 Codex 没有读文件就开始泛泛而谈，直接打断，让它列出它实际读取过的文件名和关键字段。

## 9. 让 Codex 生成综述草稿

这一步在做什么：基于矩阵和笔记生成“可审查”的综述段落。

为什么需要：AI 可以帮你把表格转成自然语言，但它不能替你决定哪些结论成立。草稿要保留 citation key，方便回查。

在哪里运行：项目根目录。

推荐 Prompt：

```text
请基于 `literature/matrix.csv` 和 `literature/notes/` 写一个 related work 初稿。

要求：
1. 只使用已有 citation key，不要创造新引用。
2. 每个实质性判断后保留 citation key。
3. 按主题组织，不要按论文逐篇罗列。
4. 对证据不足的地方写“待核查：...”。
5. 输出到 `drafts/related-work.md`。
6. 写完后列出你认为需要我回原文确认的 5 个点。
```

成功后应该看到什么：

- `drafts/related-work.md` 被创建或更新；
- 段落里有 `[@citekey]`；
- 没有凭空出现的作者、年份、DOI；
- 文末有待核查清单。

审查时看三件事：

1. 引用是否真实存在；
2. 论文之间的关系是否被正确表述；
3. 是否把“作者声称”“实验显示”“本文推测”混成了一种确定语气。

## 10. 让 Codex 辅助科研复现

这一步在做什么：把论文复现从“看 README 硬猜”变成“结构化探索、环境准备、脚本验证”。

为什么需要：科研复现常常卡在依赖、数据路径、运行命令、随机种子、指标复算和日志整理。Codex 很适合处理这些工程问题。

在哪里运行：复现代码仓库或当前项目的 `experiments/`。

推荐 Prompt：

```text
请先阅读 `experiments/`、论文笔记和 README，不要修改文件。

目标：复现 @smithRagEvaluationSurvey2024 中与 RAG evaluation 相关的实验设置。

请输出：
1. 当前目录里有哪些代码、数据和配置；
2. 还缺哪些数据或依赖；
3. 最小可运行实验是什么；
4. 需要我确认的学术问题是什么；
5. 验证成功应该看到什么日志、文件或指标。

限制：
- 不要下载大文件，除非我确认。
- 不要删除已有实验结果。
- 不要把 API key 写进仓库。
- 不要把论文结论改写成复现结论，除非实验真的跑通。
```

成功后应该看到什么：

- Codex 先给计划，而不是直接改一堆文件；
- 实验命令、依赖、数据路径被列清楚；
- 验证方式明确；
- 学术判断和工程判断分开。

## 11. 可选：用 Zotero MCP 连接 Codex

这一步在做什么：让 Codex 通过 MCP server 访问 Zotero 中的文献元数据、全文或笔记。

为什么需要：当你的文献库很大，且不想频繁导出文件时，MCP 可以把 Zotero 变成一个外部上下文源。OpenAI Codex 文档说明，MCP 是把 Codex 连接到外部工具和上下文提供者的标准方式；Codex 支持本地 STDIO server 和 Streamable HTTP server。

适合谁：

- 已经会配置 Codex `~/.codex/config.toml`；
- 知道 API key、环境变量和本地服务的风险；
- 能判断第三方 GitHub 项目是否可信；
- 愿意先用小集合测试，不把未发表材料直接交给不熟悉的服务。

不适合谁：

- 刚开始用 Zotero；
- 不熟悉命令行；
- 文献库里有大量未公开论文、内部资料或敏感数据；
- 只是想写一篇课程论文。

### 方案 A：先用 Local API

优点：不需要 Zotero Web API key，响应通常更快，资料留在本机。

限制：Zotero 桌面端需要打开，并且要启用本地 API；具体能力取决于你选的 MCP server。

以 [kujenga/zotero-mcp](https://github.com/kujenga/zotero-mcp) 为例，它的 README 说明可以通过 Zotero Local API 或 Web API 工作，并提供搜索条目、获取元数据、获取全文等工具。你可以把它理解成“一个第三方 Zotero 适配器”，不是 Zotero 官方功能。

Local API 的开关在 Zotero 里：打开 `Zotero Settings`，进入 `Advanced`，勾选允许本机其他应用与 Zotero 通信。该项目 README 还提醒，某些全文读取端点可能依赖 Zotero 的版本状态；如果你不想处理这些兼容细节，就先用导出文件路线，或者改走 Web API。

Codex 侧 MCP 配置形态大致是：

```bash
codex mcp add zotero --env ZOTERO_LOCAL=true -- uvx --upgrade zotero-mcp
```

或者写进 `~/.codex/config.toml`：

```toml
[mcp_servers.zotero]
command = "uvx"
args = ["--upgrade", "zotero-mcp"]
env = { ZOTERO_LOCAL = "true" }
```

成功后应该看到什么：

- 在 Codex TUI 中运行 `/mcp` 能看到 `zotero`；
- 让 Codex 搜索 Zotero 条目时能返回真实条目；
- 关闭 Zotero 后，本地 API 路线可能不可用。

### 方案 B：用 Zotero Web API

优点：不一定依赖本机 Zotero 打开，适合远程环境或服务器。

限制：需要 Zotero API key 和 library ID。不要把 key 写进仓库、博客、截图或聊天记录。

配置形态大致是：

```toml
[mcp_servers.zotero]
command = "uvx"
args = ["--upgrade", "zotero-mcp"]
env_vars = ["ZOTERO_API_KEY", "ZOTERO_LIBRARY_ID"]
```

然后在本机 shell 环境里设置环境变量。不要把真实值提交到 Git。

### 不推荐新手直连 SQLite

有些社区项目支持绕过 API，直接读取 Zotero 的 SQLite 数据库。这个思路很强，但风险也更高。Zotero 官方 JavaScript API 文档也提到，直接访问本地 SQLite 数据库更脆弱。社区项目通常也会提醒，SQLite 路线可能需要完全关闭 Zotero，因为数据库会被锁定。

除非你知道自己在做什么，否则不要把“直连 Zotero 数据库”当作第一选择。

## 12. Word、Markdown、LaTeX 怎么选

如果你写 Word：

- 正式引用和参考文献优先用 Zotero Word 插件；
- Codex 可以帮你写段落草稿，但最后在 Word 里插引用；
- 不要手改 Word 自动生成的参考文献表；
- 条目错误回 Zotero 修，再刷新文档。

如果你写 Markdown：

- 用 Better BibTeX citation key；
- 草稿中保留 `[@citekey]`；
- 后续用 Pandoc、Quarto 或其他工具生成文档；
- Codex 可以检查草稿里哪些 key 不在 `library.bib` 中。

如果你写 LaTeX：

- 用 Better BibLaTeX 或 Better BibTeX；
- 引用用 `\cite{citekey}` 或你的模板要求；
- Codex 可以帮你整理 `.tex` 结构、修编译错误、检查未引用文献；
- 但不要让它自动改 citation key，除非你明确同意。

如果你还没决定，建议先用 Markdown + `library.bib`。它比 Word 更适合 Codex 读写，也比 LaTeX 更轻。最终投稿需要 Word 或 LaTeX 时，再迁移格式。

## 13. 常见错误与解决

### Codex 编造了不存在的引用

先搜索 `references/library.bib`。如果 key 不存在，就让 Codex 只从真实 key 中选择。可以把要求写进 `AGENTS.md`：

```text
不要编造 citation key。所有引用必须能在 references/library.bib 中找到。
```

### 综述变成逐篇摘要堆叠

说明矩阵缺少“主题”和“差异”字段。让 Codex 先按问题、方法、数据集、指标分组，再写段落。不要直接要求“写 related work”。

### Better BibTeX 自动导出没有更新

先手动导出一次，确认路径正确。再检查是否勾选了自动更新。还不行就重启 Zotero，并确认导出的是项目集合，不是空集合。

### citation key 改了，草稿全乱了

不要频繁改 key 规则。核心文献可以 pin key。已经写进草稿的 key，改之前先全局搜索影响范围。

### Zotero 数据库损坏或同步异常

检查你是否把 Zotero 数据目录放进了 Dropbox、Google Drive、OneDrive、iCloud Drive 等云盘文件夹。Zotero 官方知识库明确不建议这么做。正确做法是数据目录留在默认位置，用 Zotero Sync、Zotero Storage、WebDAV 或经过验证的附件同步方案。

### MCP 配好后 Codex 看不到 Zotero

先分层排查：

1. `codex mcp list` 或 `/mcp` 是否能看到 server；
2. server 启动命令是否在当前机器可执行；
3. `uvx`、`docker` 或 Python 环境是否存在；
4. Local API 路线下 Zotero 是否正在运行；
5. Web API 路线下环境变量是否设置；
6. API key 是否有足够权限；
7. MCP server 日志里是否有启动失败信息。

不要一上来怀疑 Codex。MCP 问题通常是命令路径、环境变量、权限或服务启动失败。

### Codex 读了太多不相关文件

在 `AGENTS.md` 里写清楚优先读哪些文件：

```text
做文献任务时优先读取：
1. literature/matrix.csv
2. literature/notes/
3. references/library.bib
4. drafts/
```

同时把 PDF、大数据、旧草稿、临时导出放到 Codex 不需要频繁读取的目录里。

## 14. 每周维护流程

每周花 30 分钟维护，比月底崩溃式整理更轻松。

```text
周一：导入新论文，校正 Zotero 元数据
周二：读 2-3 篇核心论文，写 Markdown 卡片
周三：更新 literature/matrix.csv
周四：让 Codex 生成差异对比和待核查清单
周五：人工回原文核查，更新 drafts/related-work.md
周末：备份 Zotero，提交项目文件夹 Git commit
```

提交 Git 时不要提交：

- API key；
- 未授权传播的 PDF；
- 课题组内部数据；
- 含个人隐私的原始访谈或实验数据；
- Zotero 数据库文件。

可以提交：

- `library.bib`；
- 自己写的文献矩阵；
- 自己写的读书笔记；
- 草稿；
- 复现脚本；
- `AGENTS.md` 和项目说明。

## 15. 可直接交给 Codex 的 Prompt

### 文献库健康检查

```text
请基于当前项目完成一次文献库健康检查。

请读取：
- references/library.bib
- literature/matrix.csv
- literature/notes/
- drafts/

任务：
1. 找出 matrix.csv 中存在但 library.bib 中不存在的 citekey。
2. 找出 drafts/ 中出现但 library.bib 中不存在的 citekey。
3. 找出 matrix.csv 中字段缺失最多的 10 篇文献。
4. 按主题把现有文献分成 3-6 组。
5. 输出一个最小修复清单，不要修改文件。

限制：
- 不要编造文献。
- 不要根据常识补 DOI、作者、年份。
- 不确定的地方标记为“待核查”。
```

### 单篇论文卡片生成

```text
请根据我提供的论文笔记和 Zotero 条目，生成一张 Markdown 读书卡片。

输入：
- citation key: [填入真实 key]
- Zotero 元数据或 bib 条目: [粘贴]
- 我摘录的要点: [粘贴]

输出到：
literature/notes/[year-author-keyword].md

要求：
1. 不要添加输入中没有的实验结果。
2. 区分“作者声称”“实验显示”“我的理解”。
3. 保留待核查清单。
4. 最后给出这篇论文可能放进综述的哪个主题。
```

### 主题综述草稿

```text
请基于 literature/matrix.csv 和 literature/notes/ 写一段主题综述草稿。

主题：[填入主题，例如 RAG evaluation metrics]

要求：
1. 按问题和方法组织，不要逐篇摘要。
2. 每个关键判断后保留 citation key。
3. 只使用 library.bib 中存在的引用。
4. 对结论不充分的地方写“待核查”。
5. 输出到 drafts/related-work.md 的对应小节。
6. 写完后列出 5 个需要我回原文确认的问题。
```

### 复现计划

```text
请为当前项目制定最小科研复现计划。

目标论文：
- citation key: [填入]
- 论文主题: [填入]

请读取：
- literature/notes/
- references/library.bib
- experiments/
- README.md

请输出：
1. 论文中哪些部分可复现，哪些只是理论或综述。
2. 最小可运行实验需要哪些数据、依赖和命令。
3. 当前项目已经具备什么，还缺什么。
4. 风险点：版本、数据、GPU、随机种子、指标、版权。
5. 第一阶段只做什么，不做什么。

限制：
- 不要下载数据。
- 不要删除已有结果。
- 不要把 API key 写入文件。
- 不要把未跑通的结果写成结论。
```

### 引用审查

```text
请审查 drafts/related-work.md 中的引用。

要求：
1. 列出所有 citation key。
2. 检查每个 key 是否存在于 references/library.bib。
3. 找出连续 2 段以上没有引用的论述。
4. 找出看起来像强结论但证据不足的句子。
5. 不要直接改正文，先给审查报告。
```

## 推荐学习路线

第一周只学 Zotero 基础：抓取、校正元数据、集合、标签、PDF 批注、Word 插件或 Quick Copy。

第二周加入 Better BibTeX：citation key、项目级 `library.bib`、Markdown 引用、自动导出。

第三周建立项目文件夹：`README.md`、`AGENTS.md`、`matrix.csv`、`notes/`、`drafts/`。

第四周开始用 Codex：先健康检查，再生成读书卡片，再写主题综述草稿，最后辅助复现。

第五周以后再考虑 MCP。只有当你确认导出文件路线已经稳定、且确实需要动态查询 Zotero 库时，再接 Zotero MCP。

## 最后提醒

智能学术工作流的关键不是“AI 生成更多文字”，而是“每一句话都能追溯到可靠来源，每一个实验步骤都能复现，每一次自动化都能被你审查”。

Zotero 负责让文献事实稳定，Codex 负责让整理和工程动作更快。把两者边界分清楚，你会得到一个很顺手的科研助手；边界混在一起，就会得到一堆看似高级、实则难以信任的草稿。

## 参考来源

- [Zotero Web API v3](https://www.zotero.org/support/dev/web_api/v3/)
- [Zotero Web API Basics](https://www.zotero.org/support/dev/web_api/v3/basics)
- [Zotero JavaScript API](https://www.zotero.org/support/dev/client_coding/javascript_api)
- [Zotero Creating Bibliographies](https://www.zotero.org/support/creating_bibliographies)
- [Can I store my Zotero data directory in a cloud storage folder?](https://www.zotero.org/support/kb/data_directory_in_cloud_storage_folder)
- [Codex Quickstart - OpenAI Developers](https://developers.openai.com/codex/quickstart)
- [Codex Customization - OpenAI Developers](https://developers.openai.com/codex/concepts/customization)
- [Custom instructions with AGENTS.md - OpenAI Developers](https://developers.openai.com/codex/guides/agents-md)
- [Model Context Protocol - Codex](https://developers.openai.com/codex/mcp)
- [Better BibTeX Installation](https://retorque.re/zotero-better-bibtex/installation/)
- [Better BibTeX Citation Keys](https://retorque.re/zotero-better-bibtex/citing/)
- [Better BibTeX Exporting](https://retorque.re/zotero-better-bibtex/exporting/)
- [kujenga/zotero-mcp](https://github.com/kujenga/zotero-mcp)
- [swairshah/zotero-mcp-server](https://github.com/swairshah/zotero-mcp-server)
