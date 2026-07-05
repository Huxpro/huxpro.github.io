# CodeWater Blog

[Chinese README](README_CN.md)

This repository contains the source code for [CodeWater Blog](https://codewater517.github.io), the personal blog of CodeWater517. It is built with Jekyll and adapted from the Hux Blog theme, with content focused on projects, learning notes, and everyday writing.

## Featured Guides

- [VS Code + Codex + SSH remote development guide](https://codewater517.github.io/2026/05/27/vscode-codex-ssh-guide/)

## Tech Stack

- Jekyll 4 with Ruby and Bundler
- Liquid templates in `_layouts/` and `_includes/`
- Markdown posts rendered by Kramdown and Rouge
- Less/CSS theme assets managed with Grunt
- PWA assets and service worker support
- GitHub Pages deployment

## macOS Setup

Do not use the system Ruby shipped with macOS. Install a Homebrew-managed Ruby and let Bundler install this repo's Jekyll version from `Gemfile`.

Install Xcode Command Line Tools:

```sh
xcode-select --install
```

Install Homebrew if `brew` is not available:

```sh
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

Load Homebrew in the current shell.

Apple Silicon:

```sh
eval "$(/opt/homebrew/bin/brew shellenv)"
```

Intel Mac:

```sh
eval "$(/usr/local/bin/brew shellenv)"
```

Install Ruby and make it the default Ruby for new shells:

```sh
brew update
brew install ruby
echo 'export PATH="$(brew --prefix ruby)/bin:$PATH"' >> ~/.zprofile
source ~/.zprofile
ruby -v
which ruby
```

Install Bundler, then install this repo's Jekyll dependencies:

```sh
gem install bundler
bundle -v
bundle install
bundle exec jekyll -v
```

## Getting Started

Install the Ruby dependencies:

```sh
bundle install
```

Serve the site locally at `http://localhost:4000`:

```sh
bundle exec jekyll serve
```

You can also use the npm shortcut:

```sh
npm start
```

If you need to work on theme assets, install Node dependencies and run the development watcher:

```sh
npm install
npm run dev
```

## Project Structure

| Path | Purpose |
| --- | --- |
| `_posts/` | Blog posts in Markdown. |
| `_layouts/` | Jekyll page and post layouts. |
| `_includes/` | Shared Liquid partials such as navigation, footer, search, and sidebar pieces. |
| `_config.yml` | Site metadata, pagination, sidebar, tags, PWA, and social settings. |
| `less/` | Source Less files for theme styles. |
| `css/` | Generated and committed CSS files. |
| `img/` | Header images, avatars, post images, and icons. |
| `pwa/` | Web app manifest and PWA icons. |

## Writing Posts

Create new posts in `_posts/` with this filename format:

```text
YYYY-MM-DD-english-or-pinyin-slug.md
```

Use Markdown content with Jekyll front matter. A typical post starts like this:

```yml
---
layout: post
title: "Post Title"
subtitle: "Short subtitle"
date: 2026-05-27
author: "CodeWater517"
header-img: "img/home-bg-geek.jpg"
header-mask: 0.35
tags:
  - Tag
---
```

If an existing post is revised, update `last_modified_at` and append a short entry to `revision_history` when the post already uses that history format.

## For AI Agents

When Codex or another AI agent adds content to this repository:

- Only create or edit files under `_posts/` unless the user explicitly asks for site, layout, style, or config changes.
- Use `YYYY-MM-DD-english-or-pinyin-slug.md` for post filenames. Avoid spaces and Chinese characters in filenames.
- Use `author: "CodeWater517"` for posts.
- Use `header-img: "img/home-bg-geek.jpg"` and `header-mask: 0.35` by default unless the user provides another image.
- Include at least `layout`, `title`, `subtitle`, `date`, `author`, `header-img`, `header-mask`, and `tags` in front matter.
- If `rake post` is used, replace the generated `author: "Hux"` value and review the generated header image and tags.
- Do not add dependencies, rewrite the theme, change `_config.yml`, or bulk-format old posts without explicit user approval.
- Run `bundle exec jekyll build` when possible before handing off changes.

## License and Credits

This project keeps the original Apache License 2.0 licensing from Hux Blog.

Hux Blog is derived from [Clean Blog Jekyll Theme](https://github.com/BlackrockDigital/startbootstrap-clean-blog-jekyll), originally released under the MIT License.
