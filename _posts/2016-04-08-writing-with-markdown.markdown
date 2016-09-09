---
layout:     post
title:      "Markdown写作"
subtitle:   "Write with markdown"
date:       2016-04-07 8:00:00
author:     "XuXinkun"
header-img: "img/post-bg-write-with-markdown.jpg"
tags:
    - markdown
---


# What is markdown?

> Markdown 是一种轻量级的「标记语言」，它的优点很多，目前也被越来越多的写作爱好者，撰稿者广泛使用。看到这里请不要被「标记」、「语言」所迷惑，Markdown 的语法十分简单。常用的标记符号也不超过十个，这种相对于更为复杂的HTML 标记语言来说，Markdown 可谓是十分轻量的，学习成本也不需要太多，且一旦熟悉这种语法规则，会有一劳永逸的效果。

> ----[认识与入门 Markdown](http://sspai.com/25137)

# Why use markdown?

- 格式简单，语法简洁应该算是markdown的最大优势。markdown把用户从排版的烦恼中解脱出来，而专注于写作。写成的文档更为易读。
- 标准化。这里说的标准化是相对而言。虽然markdown有一些衍生的标准，比如github markdown等。但是常用的标准是比较统一的。这样就为其进行更多的格式转换提供了可能。
- 用途丰富。markdown文档借助于工具，可以轻松的转化为html，pdf，word等等。可以用来写书，写PPT，写日常的文档，博客等等。

# How to use markdown?

markdown的语法十分简洁。在网上已经有很多文章进行了描述。本文就不再重复了。这里主要推荐两篇：

- [认识与入门 Markdown](http://sspai.com/25137)
- [轻量级标记语言](http://www.worldhello.net/gotgithub/appendix/markups.html)

markdown常用的语法就那么多，而且并不复杂，全部看完也花不了很多时间。易于上手。本文将着重介绍一下markdown的一些写作用途。

# Markdown Editor

工欲善其事必先利其器。拥有好的编辑器在撰写markdown文档时有事半功倍的效果。当然，如果你足够熟练，用nodepad也没问题。以下是我推荐的一些编辑器。

- IDEA plugin: MultiMarkdown
- 在线编辑器: [马克飞象](https://maxiang.io/)
- Eclipse plugin
- Vim/Emacs

# HTML

写成HTML，也就是网页形式是最普遍的。有很多工具可以直接生成HTML。常用的工具比如[python-Markdown](https://pythonhosted.org/Markdown/),[pandoc](http://pandoc.org/)。

这里比较推荐的是pandoc。其支持众多的格式转化，如下图：

![pandoc](http://pandoc.org/diagram.jpg)

使用pandoc可以轻松的生成HTML，pdf等等诸多格式，还可以制作ppt(下文将详述)。pandoc支持多个平台，包括windows。下载安装即可，环境搭建极其简单。

## 制作HTML

下面，我们可以使用一条命令就能够生成HTML。

    pandoc.exe -t html -s .\xxx.markdown -o .\xxx.html

该命令含义为将`xxx.markdown`文件转化为html，并输出到`xxx.html`中。

打开`xxx.html`可以看到markdown已经被对应转化为了HTML。比如一级标题被转为`<h1></h1>`，代码被转为`<code></code>`。

但是这样的HTML虽然可读性很强，但是不够美观。因此我们需要给他加上一些样式。pandoc提供了一个[样例样式](http://pandoc.org/demo/pandoc.css)。在生成html时将CSS样式引入，即可。这里看一个[样例](http://pandoc.org/demos.html)。

    pandoc -s -S --toc -c pandoc.css -A footer.html README -o example3.html
    
这里说明一下`--toc`是让pandoc为该文档自动生成目录索引。`-c`即引入pandoc.css作为生成页面的css。最后生成出来的[页面](http://pandoc.org/demo/example3.html)效果就会美观很多。当然也可以使用自己定义CSS样式。

## 制作PPT

使用[reveal.js](https://github.com/hakimel/reveal.js)做ppt，炫酷的3D切换效果绝对惊艳。不信可以看看[在线demo](http://lab.hakim.se/reveal-js/)。reveal.js本身支持使用markdown编写ppt内容。但是你需要修改在一个HTML中嵌入markdown语句，无论是易读和维护性上，都不如直接使用markdown的纯文本来的直观。如果使用pandoc，则可以将markdown的纯文本转换为reveal.js的PPT页面。你只需要执行下面的语句：

    git clone https://github.com/hakimel/reveal.js.git
    pandoc.exe -t revealjs -s xxx.md -V theme=sky -V transition=convex -o .\xxx.html
    
`-V theme=sky`可以指定使用reveal.js的样式，`-V transition=convex`可以指定其切换效果。最后生成的效果可以参看[这里](http://pandoc.org/demo/example16d.html)。

# gitbook

使用markdown写书也逐渐成为开源届的一种时尚。通过github，很多人可以一起参与进来写书，而通过gitbook可以快速的生成一本书。比如这本[openstack understand neutron](https://yeasy.gitbooks.io/openstack_understand_neutron/content/)。就是使用gitbook生成了[电子书](https://github.com/yeasy/openstack_understand_Neutron)。

## 搭建环境

gitbook需要依赖nodejs。因此需要首先安装nodejs(centos上可以使用`yum -y install nodejs`)。windows上也可以通过下载nodejs对应的安装包进行安装。
    
    npm install -g gitbook-cli
    gitbook -V

## 初始化

使用命令`gitbook init`就可以对当前目录进行初始化。

可以看到生成了`SUMMARY.md`和`README.md`两个文件。

`README.md`文件就是电子书的主页。最终`README.md`内容会被转化为`index.html`。

`SUMMARY.md`文件是正本电子书的目录。最终`SUMMARY.md`会被转化为左侧的导航。
       
## 编译

使用`gitbook build .`命令即可对当前目录进行编译。生成的HTML页面可以在`_book`文件夹中。打开`index.html`中即可看到电子书。    

# BLOG

既然markdown都可以用来写网页，那么用来写博客也是理所当然的事了。现在无论是[CSDN](http://blog.csdn.net/)还是[cnblogs](http://cnblogs.com)，都支持markdown的编辑器。

作为程序员的家园，github当然也支持。github每个项目的默认页README.md就是markdown的文档(当然，github也支持rest等其他格式)。如果使用github-pages来撰写博客，也可以使用markdown。github-pages将会使用jekyll将其转换为HTML。可以参看这个[StrayBirds](https://github.com/minixalpha/StrayBirds)。直接fork该项目，然后在[目录_posts](https://github.com/minixalpha/StrayBirds/tree/gh-pages/_posts)下直接添加markdown文件，github将会直接为你生成对应的html页面。