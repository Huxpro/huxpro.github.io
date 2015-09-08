#Hux Blog

###[View Live Hux Blog &rarr;](http://huxpro.github.io)

![](http://pic3.zhimg.com/4b3c678f7c23067a1975bbc20f6711ea_b.jpg)


## Feature

- Full-feature **tag** support
- UX optimize for mobile used (bunch of `webkit-vender-something`)
- Typographic optimize for Chinese (font-family, size, weight..)
- Network optimze for China network environment (drop google webfont, use local CDN)
- Using Github Flavored Markdown
- Use duoshuo as the Disqus-like third party discussion system
- Use Baidu, Tencent analyze (TODO: support GA)


## Support

- **Feel free to fork. Appreciated if you keep the copyright link in the footer**
- Expect Star if you like/fork this theme
- Any problem or request, just open an issue here, I will help U.
- 如果有需要，可以更新一篇中文文档 ;)


## Document

#### Environment

If you have jekyll installed, simply run `jekyll serve` in Command Line
and preview the themes in your browser. You can use `jekyll serve --watch` to watch for changes in the source files as well.


#### Get Started

You can easily get started by modifying `_config.yml`:

```
# Site settings
title: Hux Blog             # title of your website..
description: .....          # ...

# SNS settings      
github_username: huxpro     # modify this account to yours
weibo_username: huxpro      # and the links in footer will auto-updated.

# Build settings
# paginate: 10              # nums of posts in one page

# Duoshuo settings          # Please set your own DuoShuo account.
useDuoshuo: true            # Comment and Share
useShare: true              # use Comment only. seeing the Share component is depend on Comment so we can NOT use share only.

```

You can check more options in the jekyll official site, or directly dive into code.


#### Write Posts

Free free to checkout markdown files in `_posts`, and you will quickly realized how to post article with markdown and this theme:

```
---
layout:     post
title:      "Hello 2015"
subtitle:   "Hello World, Hello Blog"
date:       2015-01-29 12:00:00
author:     "Hux"
header-img: "img/post-bg-2015.jpg"
tags:
    - Life
---

```

#### Advanced

If you wanna change code yourself, a Grunt environment is also included. (Thanks to Clean Blog.)

There are a number of tasks it performs like minification of the JavaScript, compiling of the LESS files, adding banners to keep the Apache 2.0 license intact, and watching for changes. Run the grunt default task by entering grunt into your command line which will build the files. You can use grunt watch if you are working on the JavaScript or the LESS.

**Try to understand code in `_include`, `_layouts`, then you can modify jekyll template to do more creative customization.**



## Thanks

Forked from [IronSummitMedia/startbootstrap-clean-blog-jekyll](https://github.com/IronSummitMedia/startbootstrap-clean-blog-jekyll)
