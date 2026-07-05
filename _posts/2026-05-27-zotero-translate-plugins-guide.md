---
layout: post
title: "Zotero + 划词翻译 + 常用插件完整教程"
subtitle: "从安装、抓取文献、PDF 划词翻译到 Better Notes、Better BibTeX、茉莉花和附件同步"
date: 2026-05-27 23:00:00 +0800
author: "CodeWater517"
header-img: "img/home-bg-geek.jpg"
header-mask: 0.35
tags:
  - Zotero
  - 文献管理
  - 工具
  - 插件
  - 翻译
  - 学术
last_modified_at: 2026-05-27 23:00:00 +0800
revision_history:
  - time: 2026-05-27 23:00:00 +0800
    description: "新增 Zotero、划词翻译与常用插件完整教程。"
---

> 这篇教程把 Zotero 官方文档、Zotero 中文社区、插件 GitHub 项目页和社区教程清洗成一条可执行路线：先搭好 Zotero 的基础文献管理，再配置 PDF 划词翻译，最后按使用场景选择常用插件。你不需要一口气装满插件，最稳的方式是先让“抓取-阅读-翻译-引用-同步”跑通，再逐步增强。

## 资料清洗说明

我优先采用官方资料：Zotero 下载页、快速入门、Word 插件、同步、附件、插件安全说明、Zotero 9 版本历史。插件部分优先采用 Zotero 中文社区和插件项目页，再用 GitHub README 补充功能边界。

检索时有几个页面没有作为正文依据：

- `https://zotero-chinese.github.io/user-guide/plugins/magic-for-zotero`：打开时返回 `Internal Error`，因此没有把 Magic 全文翻译写成可执行教程。
- GitHub 仓库页面偶尔显示 `There was an error while loading` 的动态区域错误；正文只采用能读取到的 README、Release 或项目说明。
- `https://www.zotero.org/support/kb/storage_and_syncing`：浏览工具因安全限制未直接打开该 URL，正文改用可打开的 Zotero 官方同步文档和“不要把数据目录放进云盘”的知识库页面。

## 先说版本：现在不是所有教程都还停在 Zotero 7

截至 2026-05-27 检索，Zotero 官方下载页主推的是 **Zotero 9**，并且仍然在 “Other versions” 下提供 Zotero 7 下载。Zotero 9 在 2026-04-10 发布，9.0.4 在 2026-05-22 更新；它增加了朗读、最近阅读、把注释插入文字处理器、Citation Key 列和 citation key 搜索等功能。

这意味着一个现实问题：网上很多中文插件教程仍然围绕 Zotero 7 写，部分插件也会在 7、8、9 之间有兼容差异。我的建议是：

- 新用户优先安装 Zotero 官网当前正式版，也就是 Zotero 9。
- 如果你依赖某个旧插件，先去插件 Release 页面看是否支持你的 Zotero 版本。
- 如果你的论文正在截稿，不要在最后一周大版本升级 Zotero 和插件。
- 插件装得越多，越要保持备份和版本记录。

Zotero 插件不是浏览器普通扩展。官方文档提醒，插件可以完整访问你的 Zotero 数据和电脑环境，所以只安装你信任、维护活跃、来源清楚的插件。

## 最小可用工作流

最稳的 Zotero 入门路线是：

```text
安装 Zotero -> 安装浏览器 Connector -> 抓取一篇文献 -> 补全元数据
-> 打开 PDF 阅读和批注 -> 配置 Translate for Zotero 划词翻译
-> 在 Word/WPS/LibreOffice/Google Docs 里插入引用 -> 配置同步和备份
```

插件路线不要反过来。很多人第一次用 Zotero 就装十几个插件，最后插件冲突、翻译失败、附件丢失、Word 插件找不到，反而不知道问题出在哪里。先让原生 Zotero 跑顺，再把插件当作增强层。

## 安装 Zotero 和 Connector

进入 Zotero 官网下载页，安装当前正式版。Windows 用户一般选择 64-bit Installer；macOS 用户直接下载 dmg；Linux 用户按官网包安装。

安装完 Zotero 后，再安装浏览器扩展 **Zotero Connector**。Chrome、Firefox、Edge 都有对应 Connector；Safari 的 Connector 随 Zotero 桌面端一起提供，需要在 Safari 扩展设置里启用。

安装完成后做一个测试：

1. 打开 Zotero 桌面端。
2. 在浏览器里打开一篇论文页面，例如出版社页面、PubMed、Google Scholar、CNKI、图书馆数据库页面。
3. 点击浏览器工具栏里的 Zotero Connector 图标。
4. 选择保存到哪个 collection。
5. 回到 Zotero，检查标题、作者、期刊、年份、DOI、PDF 附件是否完整。

如果 Connector 能识别网页，Zotero 会尽量自动创建条目、填入元数据、下载可获取的 PDF 和补充链接。如果页面不能识别，它也可以保存为网页快照，但这种条目通常需要手动补元数据。

## 抓取文献：先追求元数据干净

Zotero 的核心不是“存 PDF”，而是“存可引用的文献条目”。一篇文献至少要保证这些字段准确：

- 标题；
- 作者；
- 年份；
- 期刊、会议、出版社或学位授予单位；
- 卷、期、页码；
- DOI、ISBN、PMID 等标识符；
- 语言；
- 附件是否挂在正确条目下面。

常用添加方式有四种。

第一种是用浏览器 Connector 抓取。这适合出版社官网、数据库、Google Scholar、PubMed、CNKI、万方等页面。一个页面有多条结果时，Connector 图标可能显示成文件夹，点击后可以多选保存。

第二种是用 DOI、ISBN、PMID 添加。点击 Zotero 顶部工具栏的魔杖图标，输入 DOI、ISBN 或 PMID，Zotero 会尝试自动拉取条目。这个方式特别适合你手里已经有 DOI 的论文。

第三种是拖 PDF 到 Zotero。Zotero 会尝试从 PDF 中识别元数据并创建父条目。识别失败时，不要让 PDF 长期作为独立附件存在，右键它选择 `Create Parent Item`，用 DOI 或手动录入来创建父条目。官方文档也明确建议，文件最好作为文献条目的 child item 存在，独立 PDF 无法充分参与引用、搜索和很多管理功能。

第四种是手动新建条目。这适合古籍、档案、内部资料、网页资料、没有 DOI 的报告。手动条目的质量取决于你自己填得是否规范。

## 中文文献：安装茉莉花并更新中文转换器

中文文献最常见的问题是：CNKI、万方、维普、读秀等页面能抓到一些信息，但字段不够干净，或者 PDF/CAJ 附件不能自动匹配。

这时可以安装 **Jasminum / 茉莉花**。它的作用不是替代 Zotero，而是增强中文文献支持：

- 自动更新中文 translators；
- 为中文 PDF/CAJ 检索元数据；
- 添加中文 PDF/CAJ 时自动尝试检索元数据；
- 拆分或合并中文作者姓名；
- 拉取引用次数、核心期刊等辅助信息。

推荐配置：

1. 安装茉莉花。
2. 在插件设置里更新中文转换器。
3. 用 Connector 抓一篇 CNKI 文献测试字段。
4. 手动下载的 PDF/CAJ，先放在下载目录，再用茉莉花的附件匹配功能挂到条目下。
5. 抓取失败时，用 DOI、题名搜索或手动条目兜底。

中文文献不要盲信自动抓取。论文题名、作者顺序、期刊名、年卷期页码和学位论文学校信息，提交论文前都应该逐条核对。

## 阅读和批注：Zotero 原生已经够用

Zotero 7 之后内置阅读器已经很强，Zotero 9 继续增强了阅读体验。PDF、EPUB、网页快照都可以在 Zotero 内打开，常用动作包括：

- 高亮；
- 下划线；
- 注释；
- 图片区域标注；
- 给批注添加评论；
- 从批注生成笔记；
- 在多个设备间同步阅读位置和部分阅读状态。

建议建立一个简单阅读状态标签体系，而不是一开始就做复杂看板：

```text
/todo     待读
/reading  在读
/done     已读
/cite     可能引用
/drop     放弃
```

这些状态可以用 Zotero 标签实现，也可以用 Ethereal Style 这类插件做得更好看。但请记住：状态系统越复杂，维护成本越高。读文献最重要的不是标签精致，而是你能在写作时找回关键证据。

## 划词翻译：安装 Translate for Zotero

Zotero 里最常用的翻译插件是 **Translate for Zotero**，项目名也常见为 Zotero PDF Translate。它深度适配 Zotero 阅读器，主要功能包括：

- PDF、EPUB、网页、元数据、批注和笔记翻译；
- 划词翻译，支持自动或手动触发；
- 标题和摘要翻译；
- 批注翻译；
- 多种翻译服务和字典服务；
- 翻译侧栏；
- 同时使用多个翻译引擎。

安装方式：

1. 打开 Translate for Zotero 项目页或 Zotero 中文社区插件商店。
2. 下载与你 Zotero 版本兼容的 `.xpi` 文件。
3. 在 Zotero 菜单中进入 `Tools` -> `Plugins`。
4. 点击右上角齿轮，选择 `Install Add-on From File...`。
5. 选择刚下载的 `.xpi`。
6. 重启 Zotero 或按提示启用插件。

如果你用 Firefox 下载 `.xpi`，不要直接点开安装到 Firefox，也不要解压。右键链接，选择另存为，保存完整 `.xpi` 文件。

## 翻译引擎怎么选

Translate for Zotero 支持很多翻译服务。选择时看四件事：

- 是否能稳定访问；
- 是否需要 API key；
- 免费额度是否够用；
- 学科术语翻译是否靠谱。

可以按下面思路选。

**先测试免费或免密服务**

如果你只是偶尔查一个词、看一段摘要，可以先用 Google、CNKI、海词、Youdao 这类可用服务测试。优点是省事，缺点是稳定性和速度不一定可靠，且大批量翻译容易失败。

**长期阅读用带密钥的服务**

如果你每天都读英文论文，建议配置带密钥的服务，例如 DeepL、百度、腾讯、火山、阿里、小牛、微软等。Zotero 中文社区整理过各家的免费额度和 QPS 限制。带密钥服务通常更稳定，出错时也更容易判断是额度、速率、密钥还是网络问题。

**术语密集学科优先试 DeepL 或垂直领域服务**

医学、生物、材料、法学、社科理论等学科，机器翻译容易把术语翻得很怪。可以用 DeepL、百度垂直领域或自己更熟悉的专业引擎做对比。不要只看一句话是否通顺，要看术语是否一致。

**大模型翻译要注意隐私和成本**

有些翻译插件或 AI 插件可以接 GPT、Gemini、Claude、DeepSeek 等模型。效果可能很好，但原文、批注和笔记会发送给模型服务商或中转服务。涉及未发表论文、课题组内部资料、受版权限制材料或隐私内容时，先确认你是否有权限把内容发出去。

## 划词翻译的推荐设置

入门时可以这样设置：

1. 打开 Zotero 设置里的 Translate 插件设置。
2. 选择一个主翻译服务。
3. 如果服务需要密钥，填入 API key、Secret、Region 或 Endpoint。
4. 设置源语言为 `auto`，目标语言为 `zh-CN`。
5. 开启阅读器侧栏。
6. 先关闭“选中文本后自动翻译”，改用手动触发。
7. 用一篇短 PDF 测试标题、摘要、选中文本、批注翻译。

我不建议一开始就开启所有自动翻译。自动翻译很爽，但它会消耗额度，也可能在你频繁选中文本时连续触发请求。先手动触发，确认稳定后再开启自动。

日常使用可以分三层：

- 单词不懂：用字典服务或短句翻译；
- 段落不懂：选中一段，手动翻译；
- 论文主线不懂：先翻摘要、引言末段、方法概述和结论，不要一上来全文翻译。

真正做文献阅读时，翻译只是辅助。最值得精读的部分仍然要回到原文，尤其是方法、实验设置、变量定义、统计结果和作者对局限性的表述。

## 批注翻译和笔记翻译

划词翻译适合“读到哪翻到哪”。批注翻译适合“读完一遍后整理证据”。

推荐流程：

1. 第一遍阅读时只高亮关键句，不急着翻译所有内容。
2. 对真正可能引用的高亮句执行批注翻译。
3. 在批注评论里写自己的理解，而不是只粘贴机器翻译。
4. 最后把批注导出到 Zotero 笔记或 Better Notes 笔记中。

这样做的好处是：机器翻译帮助你理解，但你的笔记保留自己的判断。写论文时，引用原文、转述和翻译之间的边界也更清楚。

## 引用写作：Word 插件、Quick Copy 和 Better BibTeX

Zotero 的 Word、LibreOffice 和 Google Docs 插件是内置能力，不属于你手动下载的 Zotero 插件。安装 Zotero 后，Word 里通常会出现 Zotero 标签页。

写论文时最常用按钮是：

- `Add/Edit Citation`：插入或修改正文引用；
- `Add/Edit Bibliography`：生成或更新参考文献表；
- `Document Preferences`：切换引用样式和语言；
- `Refresh`：刷新全文引用；
- `Unlink Citations`：最终提交前把动态引用转为普通文本。

一个重要原则：如果参考文献显示错了，先改 Zotero 条目的元数据，再点 `Refresh`。不要直接在 Word 参考文献表里手改，因为下一次刷新会覆盖手动改动。只有最终提交前才考虑 `Unlink Citations`，并且先另存备份。

如果你只想把几条参考文献复制到作业、邮件或博客里，用 Quick Copy 更快。选中文献后按 `Ctrl/Cmd + Shift + C` 复制参考文献，按 `Ctrl/Cmd + Shift + A` 复制正文引用。

如果你写 LaTeX、Markdown、Quarto、R Markdown、Obsidian，通常需要 **Better BibTeX**。它可以稳定生成 citation key，导出 BibTeX/BibLaTeX，并配合自动导出让 `.bib` 文件持续更新。

注意：Zotero 9 已经加入 Citation Key 列和 citation key 搜索，Better BibTeX 也随着 Zotero 8/9 做了迁移。Better BibTeX 项目页提醒，旧 Zotero 7 不再接收 BBT 新更新，虽然 BBT 8.0.25 仍可在 Zotero 7.0.32 工作。也就是说：

- 新用户用 Zotero 9：安装最新 Better BibTeX，并看当前 Release 的兼容说明。
- 旧项目锁在 Zotero 7：不要盲目升级 BBT；保留可工作的安装包。
- Obsidian/LaTeX 项目：固定 citation key 后再大规模写作，避免文内引用失联。

## 同步和附件：别把 Zotero 数据目录扔进云盘

Zotero 同步分两部分：

- **数据同步**：条目、笔记、标签、链接等，不含附件文件，免费且不限量。
- **文件同步**：PDF、图片、音视频等附件，可以用 Zotero Storage 或 WebDAV。

官方最推荐的是 Zotero Storage。免费空间是 300 MB，空间不够可以买更大容量。WebDAV 也可用，但只支持个人库附件，不支持群组库附件。

最重要的一条：不要把 Zotero 数据目录直接放进 Dropbox、OneDrive、Google Drive、iCloud 等云盘目录。官方知识库说这种做法极容易损坏数据库。Zotero 是数据库型软件，云盘同步无法可靠处理数据库锁和并发写入，一旦多设备同时同步，可能出现冲突副本、数据库损坏甚至数据丢失。

如果你想用第三方云盘同步 PDF，有两条更稳的路：

1. 用 Zotero 自带数据同步 + WebDAV 或 Zotero Storage 同步附件。
2. 使用 linked files，把附件目录放到云盘，但 Zotero 数据目录仍保留在默认位置。

第二条路会引入很多限制：官方 iOS/Android 客户端不支持 linked files，群组库也不适合使用 linked files。如果你只是自己在电脑间同步，可以考虑；如果你要平板阅读、移动端同步、团队协作，优先 Zotero Storage 或 WebDAV。

## 常用插件清单：按场景选择

下面是我整理后的推荐顺序。不要全装，按你的场景挑。

| 插件 | 适合谁 | 主要作用 | 注意点 |
| --- | --- | --- | --- |
| Zotero Addons / 插件市场 | 所有人 | 在 Zotero 内浏览、安装、更新插件 | 国内用户可切换中文社区数据源 |
| Translate for Zotero | 阅读英文文献的人 | 划词翻译、标题摘要翻译、批注翻译 | 注意 API 额度、隐私和翻译质量 |
| Jasminum / 茉莉花 | 中文文献用户 | 中文转换器、CNKI 等元数据增强、PDF/CAJ 元数据检索 | 抓取后仍需人工核对 |
| Linter for Zotero | 论文写作者 | 清洗字段、重复检查、标题大小写、上下标/斜体标签 | 会修改库中字段，批量操作前备份 |
| Better Notes | 深度阅读和做笔记的人 | 双链笔记、模板、Markdown/Docx/PDF/思维导图导出 | 功能多，先学最小流程 |
| Better BibTeX | LaTeX/Markdown/Obsidian 用户 | citation key、BibTeX/BibLaTeX、自动导出 | 注意 Zotero 8/9 citation key 变化和兼容版本 |
| Attanger | 需要外部附件目录的人 | 匹配附件、重命名、移动/链接附件、多设备附件目录 | 配错可能找不到附件；不支持官方移动端 linked files |
| ZotMoov | 从 ZotFile 迁移的人 | 移动/复制附件、聚合附件目录、辅助云盘同步 | 同样要小心 linked files 和备份 |
| Ethereal Style | 想增强界面和状态的人 | 阅读状态、信息面板、期刊/引用标签、全文翻译入口 | 功能多，可能带来卡顿 |
| Awesome GPT for Zotero | 想在 Zotero 内接 AI 的人 | 对 PDF/选中文本/摘要提问、命令标签 | API 隐私、成本和模型兼容要自己负责 |

我不建议把 Sci-Hub 类插件写进基础安装清单。它可能涉及版权、机构政策和地区法律风险。更稳妥的顺序是：学校图书馆访问、出版社开放访问、作者预印本、Unpaywall/OpenAlex/Google Scholar，再考虑合法获取路径。

## 插件安装通用步骤

几乎所有 Zotero 插件都按这个流程安装：

1. 确认你的 Zotero 版本。
2. 去插件 GitHub Release 或 Zotero 中文社区插件商店下载兼容版本。
3. 下载 `.xpi` 文件，不要解压。
4. 打开 Zotero。
5. 进入 `Tools` -> `Plugins`。
6. 点击右上角齿轮。
7. 选择 `Install Add-on From File...`。
8. 选择 `.xpi` 文件。
9. 启用插件，必要时重启 Zotero。

更新插件：

1. `Tools` -> `Plugins`。
2. 齿轮 -> `Check for Updates`。
3. 如果更新失败，到插件商店或 GitHub Release 下载新版 `.xpi`。
4. 直接覆盖安装即可，通常不需要先卸载。

如果插件页面加载不出来，可以安装 Zotero Addons 插件市场，并切换数据源。Zotero 中文社区文档建议国内用户优先尝试 `zotero中文社区` 数据源。

## 推荐组合一：本科/课程论文

目标是少折腾，能抓文献、读英文、插引用。

推荐：

- Zotero 9；
- Zotero Connector；
- Translate for Zotero；
- Jasminum；
- Linter for Zotero；
- Zotero 官方同步或 WebDAV。

不急着装：

- Better BibTeX；
- Better Notes；
- Attanger/ZotMoov；
- AI 插件。

这个组合已经足够完成大部分课程论文和本科毕业论文。关键是把字段核对干净，尤其是中文参考文献。

## 推荐组合二：研究生文献阅读

目标是长期读文献、积累批注、整理综述。

推荐：

- Translate for Zotero；
- Better Notes；
- Jasminum；
- Linter；
- Ethereal Style 可选；
- Zotero Storage 或 WebDAV。

建议流程：

1. 用 collection 按课题、方法、数据集分类。
2. 用 `/todo`、`/reading`、`/done` 标记阅读状态。
3. 只翻译重要段落和批注，不全文机翻所有论文。
4. 用 Better Notes 模板整理“研究问题-方法-数据-结论-局限-可引用句”。
5. 每周导出或备份一次关键笔记。

研究生最容易掉进“插件越多越专业”的陷阱。真正有价值的是稳定阅读和可回收笔记。

## 推荐组合三：LaTeX、Markdown、Obsidian 写作

目标是让 Zotero 变成写作工具链的一部分。

推荐：

- Better BibTeX；
- Better Notes；
- Translate for Zotero；
- Linter；
- Obsidian 侧安装 Zotero Integration 或其他你已经验证过的插件。

建议：

1. 在 Better BibTeX 里设置 citation key 规则。
2. 为项目 collection 导出 `.bib`。
3. 勾选自动更新或按项目手动导出。
4. 写作时只引用固定 citation key。
5. citation key 一旦进入论文草稿，就不要随便批量重生成。

Zotero 9 已经提供 citation key 列和搜索，但 Better BibTeX 对 LaTeX/Markdown 的导出、兼容和自动化仍然很有价值。只是要认真看版本兼容说明。

## 推荐组合四：大附件库和多设备

目标是处理大量 PDF，不想把 Zotero 官方存储买到很大。

推荐先评估：

- Zotero Storage；
- WebDAV；
- 学校或机构存储；
- 是否真的需要 linked files。

如果确定使用外部附件目录，可以选择 Attanger 或 ZotMoov。配置时注意：

1. 先完整备份 Zotero 数据目录和附件目录。
2. 不要把 Zotero 数据目录放入云盘。
3. 只把附件目录放入同步盘。
4. 设置 linked attachment base directory。
5. 在第二台电脑上设置对应的本地根目录。
6. 少量文献测试成功后，再批量迁移。

这种方案不适合所有人。尤其是你还想用 Zotero iOS/Android 阅读附件，或者要在群组库里协作，linked files 会带来很多限制。

## 常见问题排查

**插件安装失败**

先看 `.xpi` 是否完整下载，是否解压过，是否下错 Zotero 版本。Zotero 6、7、8、9 的插件兼容关系不能想当然。下载源不稳定时，用 Zotero 中文社区插件商店或 GitHub Release 重新下载。

**插件页面打不开**

完全退出 Zotero 再打开。Windows 用户注意窗口关闭后进程可能还在，需要任务管理器结束；macOS 用户用 `Command + Q`。如果仍然异常，再重启电脑。

**Zotero Connector 抓取错误**

先更新 Zotero、Connector 和 translators。中文站点优先安装茉莉花并更新中文转换器。仍然不行时，用 DOI/ISBN/PMID 或手动条目兜底。提交论文前不要只信自动抓取。

**划词翻译没有反应**

检查翻译服务是否可访问、API key 是否填错、目标语言是否正确、是否超出免费额度或 QPS。扫描版 PDF 不能直接翻译图片文字，需要先 OCR。

**翻译结果很怪**

换引擎；缩短选中文本；把术语加入自己的笔记；不要把机器翻译直接当论文译文。机器翻译尤其容易误译缩写、统计术语和学科专名。

**Word 参考文献刷新后又变错**

不要手改 Word 里的参考文献表。回 Zotero 修条目字段，再点 Word 插件里的 `Refresh`。最终提交前另存备份，再 `Unlink Citations`。

**同步后 PDF 找不到**

先判断附件是 stored file 还是 linked file。stored file 走 Zotero Storage/WebDAV；linked file 只保存路径，不会由 Zotero 官方移动端同步。不要在系统文件管理器里随意移动 linked files。

**Zotero 变卡**

先禁用最近安装的插件测试。Style、AI、全文翻译、笔记增强、附件管理类插件都可能增加负担。大库用户可以减少自动翻译、自动抓取、自动移动附件和过度复杂的列显示。

## 一条稳妥的从零搭建路线

如果你现在从零开始，可以按这个顺序做：

1. 安装 Zotero 9 和浏览器 Connector。
2. 注册 Zotero 账号，打开数据同步。
3. 抓取 5 篇英文论文、5 篇中文论文，练习修元数据。
4. 安装 Translate for Zotero，先手动划词翻译。
5. 安装 Jasminum，更新中文转换器。
6. 在 Word 中插入 3 条引用并生成参考文献。
7. 根据写作方式决定是否安装 Better BibTeX。
8. 根据阅读方式决定是否安装 Better Notes。
9. 根据附件同步需求决定是否安装 Attanger/ZotMoov。
10. 做一次完整备份，然后再批量导入旧文献。

这条路线不炫，但很稳。Zotero 是长期工具，不是一次性软件；第一周少装插件，后面会少还很多债。

## 来源与延伸阅读

官方资料：

- [Zotero 下载页](https://www.zotero.org/downloads)
- [Zotero 9 版本历史](https://www.zotero.org/support/changelog)
- [Zotero 9 官方发布博客](https://www.zotero.org/blog/)
- [Zotero Quick Start Guide](https://www.zotero.org/support/quick_start_guide)
- [Using the Zotero Word Plugin](https://www.zotero.org/support/word_processor_plugin_usage/)
- [Plugins for Zotero](https://www.zotero.org/support/plugins)
- [Zotero Syncing](https://www.zotero.org/support/sync)
- [Adding Files to your Zotero Library](https://www.zotero.org/support/attaching_files)
- [Creating Bibliographies](https://www.zotero.org/support/creating_bibliographies)
- [Export / Quick Copy Preferences](https://www.zotero.org/support/preferences/export)
- [Can I store my Zotero data directory in a cloud storage folder?](https://www.zotero.org/support/kb/data_directory_in_cloud_storage_folder)

中文社区与插件资料：

- [Zotero 中文社区：关于 Zotero 插件](https://zotero-chinese.github.io/user-guide/plugins/about-plugin)
- [Zotero 中文社区：Translate for Zotero](https://zotero-chinese.github.io/user-guide/plugins/translate/)
- [Translate for Zotero GitHub 项目](https://github.com/windingwind/zotero-pdf-translate)
- [Zotero 中文社区：插件市场插件](https://zotero-chinese.github.io/user-guide/plugins/zotero-addons)
- [Zotero 中文社区：茉莉花](https://zotero-chinese.github.io/user-guide/plugins/jasminum)
- [Jasminum GitHub 项目](https://github.com/l0o0/jasminum)
- [Zotero 中文社区：Better Notes](https://zotero-chinese.github.io/user-guide/plugins/better-notes)
- [Better Notes GitHub 项目](https://github.com/windingwind/zotero-better-notes)
- [Zotero 中文社区：Better BibTeX](https://zotero-chinese.github.io/user-guide/plugins/better-bibtex)
- [Better BibTeX GitHub 项目](https://github.com/retorquere/zotero-better-bibtex)
- [Better BibTeX 文档](https://retorque.re/zotero-better-bibtex/index.print.html)
- [Zotero 中文社区：Linter for Zotero](https://zotero-chinese.github.io/user-guide/plugins/linter)
- [Zotero 中文社区：Zotero Attanger](https://zotero-chinese.github.io/user-guide/plugins/zotero-attanger)
- [Zotero 中文社区：ZotMoov](https://zotero-chinese.github.io/user-guide/plugins/zotmoov)
- [Zotero 中文社区：Ethereal Style](https://zotero-chinese.github.io/user-guide/plugins/style)
- [Zotero 中文社区：Awesome GPT for Zotero](https://zotero-chinese.github.io/user-guide/plugins/zotero-gpt.html)
- [OpenMindClub awesome-zotero](https://github.com/OpenMindClub/awesome-zotero)
