# CodeWater Blog

[English README](README.md)

这是 [CodeWater517](https://github.com/CodeWater517) 的个人博客源码仓库，站点地址为 <https://codewater517.github.io>。博客基于 Jekyll 构建，并在 Hux Blog 主题基础上改造，用于记录项目、学习与生活。

## 精选教程

- [VS Code + Codex + SSH 远程开发完整教程](https://codewater517.github.io/2026/05/27/vscode-codex-ssh-guide/)

## 技术栈

- Jekyll 4、Ruby、Bundler
- Liquid 模板：`_layouts/`、`_includes/`
- Markdown 写作，Kramdown 渲染，Rouge 代码高亮
- Less/CSS 主题样式，Grunt 负责样式与脚本相关任务
- PWA manifest 与 Service Worker
- GitHub Pages 部署

## macOS 环境安装

不要使用 macOS 自带的系统 Ruby。用 Homebrew 安装独立 Ruby，再让 Bundler 按本仓库的 `Gemfile` 安装 Jekyll。

安装 Xcode Command Line Tools：

```sh
xcode-select --install
```

如果没有 Homebrew，先安装 Homebrew：

```sh
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

让当前 shell 识别 Homebrew。

Apple Silicon：

```sh
eval "$(/opt/homebrew/bin/brew shellenv)"
```

Intel Mac：

```sh
eval "$(/usr/local/bin/brew shellenv)"
```

安装 Ruby，并把 Homebrew Ruby 放到默认 PATH 前面：

```sh
brew update
brew install ruby
echo 'export PATH="$(brew --prefix ruby)/bin:$PATH"' >> ~/.zprofile
source ~/.zprofile
ruby -v
which ruby
```

`which ruby` 应该指向 Homebrew 路径，例如 `/opt/homebrew/opt/ruby/bin/ruby` 或 `/usr/local/opt/ruby/bin/ruby`。如果还是 `/usr/bin/ruby`，说明 PATH 没生效，重新打开终端或检查 `~/.zprofile`。

安装 Bundler，并按当前仓库的 `Gemfile` 安装 Jekyll：

```sh
gem install bundler
bundle -v
bundle install
bundle exec jekyll -v
```

本项目不要求全局安装 Jekyll。以 `bundle exec jekyll ...` 运行，确保使用的是 `Gemfile` 锁定的项目依赖。

## 快速开始

安装 Ruby 依赖：

```sh
bundle install
```

本地启动站点，默认访问 `http://localhost:4000`：

```sh
bundle exec jekyll serve
```

也可以使用 npm 快捷命令：

```sh
npm start
```

如果需要修改主题样式或运行 Grunt 监听任务，先安装 Node 依赖：

```sh
npm install
npm run dev
```

## 目录说明

| 路径 | 说明 |
| --- | --- |
| `_posts/` | 博客文章，使用 Markdown 编写。 |
| `_layouts/` | Jekyll 页面与文章布局。 |
| `_includes/` | 可复用的 Liquid 片段，例如导航、页脚、搜索、侧边栏模块。 |
| `_config.yml` | 站点标题、描述、分页、侧边栏、标签、PWA、社交链接等配置。 |
| `less/` | 主题样式源文件。 |
| `css/` | 生成并提交到仓库的 CSS 文件。 |
| `img/` | 头图、头像、文章图片和图标资源。 |
| `pwa/` | Web App manifest 和 PWA 图标。 |

## 写作流程

文章统一放在 `_posts/` 目录下，文件名使用下面的格式：

```text
YYYY-MM-DD-english-or-pinyin-slug.md
```

正文使用 Markdown，文件开头必须包含 Jekyll front matter。推荐模板如下：

```yml
---
layout: post
title: "文章标题"
subtitle: "文章副标题"
date: 2026-05-27
author: "CodeWater517"
header-img: "img/home-bg-geek.jpg"
header-mask: 0.35
tags:
  - 标签
last_modified_at: 2026-05-27 12:00:00 +0800
revision_history:
  - time: 2026-05-27 12:00:00 +0800
    description: "发布文章初稿。"
---
```

新增文章时，`last_modified_at` 和 `revision_history` 可以按文章维护需要添加；修改旧文章时，如果原文已经使用修订记录，应同步更新这两个字段。

仓库里也提供了 `rake post` 命令来生成文章草稿：

```sh
rake post title="hello-world" subtitle="Hello World"
```

注意：`Rakefile` 中保留了上游模板的默认值，生成后需要手动把 `author: "Hux"` 改为 `author: "CodeWater517"`，并检查头图、标签和标题是否符合当前博客规范。

## 给 Codex 等智能体的维护说明

当 Codex 或其它智能体在本仓库新增帖子时，请遵守下面的规则：

- 默认只在 `_posts/` 新建或修改文章文件。除非用户明确要求，不要改动 `_layouts/`、`_includes/`、`less/`、`css/`、`_config.yml`、`package.json`、`Gemfile` 等站点结构和配置文件。
- 新文章文件名使用 `YYYY-MM-DD-english-or-pinyin-slug.md`，不要使用空格，也尽量避免中文文件名。
- 默认作者为 `author: "CodeWater517"`。
- 默认头图为 `header-img: "img/home-bg-geek.jpg"`，默认遮罩为 `header-mask: 0.35`。只有在用户指定图片或文章确实需要其它图片时才更换。
- front matter 至少包含 `layout`、`title`、`subtitle`、`date`、`author`、`header-img`、`header-mask`、`tags`。
- 标签使用简短、稳定的中文或英文词组，优先复用已有文章标签，不要为了单篇文章制造过多近义标签。
- 如果修改旧文章，保留原有写作风格；若文章已有 `last_modified_at` 和 `revision_history`，需要更新修改时间并追加一条简短说明。
- 如果使用 `rake post` 生成草稿，必须修正上游模板默认的 `author: "Hux"`，并重新检查 front matter。
- 不要随意新增依赖、重写主题结构、批量格式化旧文章或修改部署配置。
- 完成后优先运行 `bundle exec jekyll build` 检查站点能否正常构建；如果本地环境缺少依赖，需要在交付说明里明确写出没有完成构建验证。

智能体新增文章时可直接使用下面的最小模板：

```md
---
layout: post
title: "文章标题"
subtitle: "文章副标题"
date: 2026-05-27
author: "CodeWater517"
header-img: "img/home-bg-geek.jpg"
header-mask: 0.35
tags:
  - 标签
---

这里开始写正文。
```

## 部署说明

该仓库面向 GitHub Pages 使用。通常情况下，文章或站点源码推送到对应分支后，由 GitHub Pages / GitHub Actions 完成构建与发布。

本地交付前建议执行：

```sh
bundle exec jekyll build
```

## License 与来源

本项目保留 Hux Blog 的 Apache License 2.0 授权说明。

Hux Blog 来源于 [Clean Blog Jekyll Theme](https://github.com/BlackrockDigital/startbootstrap-clean-blog-jekyll)，原主题使用 MIT License。
