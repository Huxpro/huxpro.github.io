#Hux Blog

###[View Live Hux Blog &rarr;](http://huxpro.github.io)

![](http://huangxuan.me/img/blog-desktop.jpg)


## New Feature (V1.2）

- Brand new **[Keynote Layout](#keynote-layout)** is provided for easily posting beautiful HTML presentations you have created with this blog


## New Feature (V1.1）

- We now support a clean and gorgeous **[SideBar](#sidebar)** for displaying more info
- **[Friends](#friends)** is also added as a common feature of blog help you do SEO

## Feature

- Full-feature **Tag** support
- UX optimization for mobile used (bunch of `webkit-vender-something`)
- Typographic optimization for Chinese (font-family, size, weight..)
- Network optimizaition for China network environment (drop google webfont, use local CDN)
- Using [Github Flavored Markdown](https://help.github.com/articles/github-flavored-markdown/)
- Use [DuoShuo](http://duoshuo.com/) as the Disqus-like third party discussion system
- Use Baidu, Tencent/QQ analysis *(TODO: support GA)*

## Support

- **Feel free to fork. Appreciated if you keep the author & fork link in the footer**
- Give it a **Star** if you like or fork this theme ;)
- Any problem or requirement, just open an issue here and I will help you.
- 如果有需要，可以更新一篇中文文档 ;)


## Document

* [Environment](#environment)
* [Get Started](#get-started)
* [Write Posts](#write-posts)
* [Header Image](#header-image)
* [Advanced](#advanced)
* [SideBar](#sidebar)
* [Friends](#friends)
* [Keynote Layout](#keynote-layout)

### Environment

If you have jekyll installed, simply run `jekyll serve` in Command Line
and preview the themes in your browser. You can use `jekyll serve --watch` to watch for changes in the source files as well.


### Get Started

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

There are more options you can check out in the [Jekyll - Official Site](http://jekyllrb.com/), or you can directly dive into code to find more.


### Write Posts

Feel free to checkout Markdown files in the `_posts/`, you will quickly realized how to post your articles with magic Markdown plus this theme:

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

### Header Image

Change header images of any pages or any posts is pretty easy as mentioned above. But, thanks to [issue #6 (in Chinese)](https://github.com/Huxpro/huxpro.github.io/issues/6) asked, **how to make it looks great?**

**Well...it is actually a design issue**, not a coding stuff. It is better that you have basic design knowledge, but not is ok, let me told you how to make it well-designed:

Seeing the title text above image is **white**, the image should be **dark** to emphasize the contract. so we can easily add a **black overlay with fews of opacity**, which is depends on the brightness of the original images you used. you can process it in Photoshop, Sketch etc.

In technical views, it can be done with CSS. However, the opacity of the black overlay is really hard to assigned, **every image has different brightness so the  degree it should be adjusted is different so it is impossible to hard code it.**


### Advanced

If you wanna change code yourself, a [Grunt](gruntjs.com) environment is also included. (Thanks to Clean Blog.)

There are a number of tasks it performs like minification of the JavaScript, compiling of the LESS files, adding banners to keep the Apache 2.0 license intact, and watching for changes. Run the grunt default task by entering grunt into your command line which will build the files. You can use grunt watch if you are working on the JavaScript or the LESS.

**Try to understand code in `_include/`, `_layouts/`, then you can modify Jekyll [Liquid](https://github.com/Shopify/liquid/wiki) template directly to do more creative customization.**

### SideBar

![](http://huangxuan.me/img/blog-sidebar.jpg)

Seeing more information may be necessary for you to display, from V1.1, a clean, gorgeous **SideBar** is added for you, which provide more area for displaying possible modules including *Featured Tags*, *Short About Me*, *Friends* etc. You can enable *(it is default enable)* this feature by simply config:

```
# Sidebar settings
sidebar: true
sidebar-feature-tags: true
sidebar-about-description: "your description here"
sidebar-avatar: /img/avatar-hux.jpg     # use absolute URL.
```

We default support *Featured Tags*, *Short About Me*, *Friends* these three modules and you can add your own. The Sidebar is naturally responsive and would be push to bottom in a small screen (<768px), the *Short About Me* would be also hidden in small screen.

you can disable *Featured Tags* by removing `sidebar-featured-tags` and disable *Short About Me* by removing `sidebar-about-description` plus `sidebar-avatar`. More details of *Friends* are talking below.


### Friends

Friends is a very common feature of blog seeing the SEO, so I add it in V1.1 release to help that. One of the awesome point of *Friends* is that it can live without enable sidebar. The *Friends* would display in the bottom auto when `sidebar` set to false.


You can just add your friends information in `_config.yml` with a familiar JSON syntax and everything is done, very easy:

```
# Friends
friends: [
    {
        title: "Foo Blog",
        href: "http://foo.github.io/"
    },
    {
        title: "Bar Blog",
        href: "http://bar.github.io"
    }
]
```


### Keynote Layout

![](http://huangxuan.me/img/blog-keynote.jpg)

There is a increasing tendency to use Open Web technology to create keynotes, presentations, like Reveal.js, Impress.js, Slides, Prezi etc. I consider a modern blog should have abilities to post these HTML based presentation easily also abilities to play it directly.

Under the hood, a `iframe` is used to include webpage from outer source, so the only things left is to give a url in the **front-matter**:

```
---
layout:     keynote
iframe:     "http://huangxuan.me/js-module-7day/"
---

```

The iframe will be automatically resized to adapt different form factor and the device orientation. A Padding is left to imply user there has more content below, also ensure there is a area user can scrolled in mobile device seeing most of the keynote framework prevent the browser default scroll behavior.

## Thanks

This theme is forked from [IronSummitMedia/startbootstrap-clean-blog-jekyll](https://github.com/IronSummitMedia/startbootstrap-clean-blog-jekyll)  
Thanks Jekyll and Github Pages!
