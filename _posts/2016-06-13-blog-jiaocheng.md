---
layout:     post
title:      "搭建自己的博客----教程"
subtitle:   "自己的博客，含泪也要写下去"
date:       2016-06-16
author:     "Teng"
header-img: "img/post-bg-blog.jpg"
catalog: true
tags:
    - 编程
    - Thinking
    - Learning
---

## 一小时搭建个人博客网站

> 简单粗暴，先上链接
> [马腾的博客](tengblog.com)

>本教程只为自己记录和纯小白设计，欢迎技术大神指点。

#### 前言
一直在网络上的写作空间周转，断断续续的换了好多平台，从新浪博客到lofter到点点到微信公众平台，但是心中还是有着**自己搭个网站**的想法。

在五月份开始开始着手这件事，最终还算有个不错的成品出现，将文章替换，替换图片，这个也算是打上了自己的印记。

本来这是很简单的事情，但是碍于我纯技术小白的背景，结果在一些地方浪费了好多时间，好在折腾的劲头还是有的，记录一下过程，有同样想法的同学可以参考。

### 建站选择

个人博客现在有很多方法可是实现，对于没什么编程经历的来说，这几种简直是最适合的：
- FarBox
	简单粗暴的方式，用钱来解决。只要不多的钱，你就能得到一个简洁易用的博客，这绝对是最好的方式，别忘了	
	> **可以用钱解决的问题就不要浪费其他资源**
	要是要我重新开始，我选这个。

- Hexo - Node.js blog framework
用 Node.js 搭建的博客平台，速度快，免费，同样搭建在 Github 上。操作比 Jekyll 简单，命令少，易于记忆。 安装好像也简单一点。这个选择也比我的优秀，细心的同学也许会发现，[李笑来](xiaolai.li)就是用hexo搭建的。
	**这种也比我的方式简单。**

- gitpage+jekyll 搭建
	好了，我们主要讲这种，也是我选用的方式。
	借用那么多优秀工程师的开源资源，我们可以和简单地搭建出自己的博客，感谢他们的无私分享。
	
### 建站过程
#### 申请账号
因为这些都是借用了git提供的gitpage服务，所以我们要先申请个git账号。

[点击github申请账号](github.com)

> github 真实个好东西。

这个过程很简单，不做多说。

#### 挑选模版
jekyll的模版很多，简洁，适合单纯地写作，同时因为是静态博客容易被谷歌爬取，很容易被检索到。

[你可挑选这些模版](http://jekyllthemes.org/)同时，也有网友替我们做了初步的筛选，[Jekyll 博客主题精选](http://azeril.me/blog/Selected-Collection-of-Jekyll-Themes.html)，我们要做的就是选一个自己喜欢的。

#### fork源码
找好了博客，进入作者的github页面，我们点一下fork就可以得到别人精心制作的源码。
！[](http://7xtgob.com2.z0.glb.clouddn.com/blogjiaocheng%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_20160615111416.png)

这样以后你就建立了一个项目，如下图
![Alt text](http://7xtgob.com2.z0.glb.clouddn.com/blogjiaocheng%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_20160615160314.png)

**这里有个注意点：**
> 你在github的昵称要和项目一样，这是个容易出现问题的地方。
> 
> 点击项目下册的“setting”修改项目的名称为**“xxxx.github.io”**。
> 
> **xxxx是你的昵称**
> 

必须这样：
![Alt text](http://7xtgob.com2.z0.glb.clouddn.com/blogjiaocheng.1465979176007.png)


然后你访问**xxxx.github.io**便可以了，这就是你的博客了。

如果没有成功，请稍等一会，解析可能在路上。**或者将文档中的“CNAME”修改为空白或删除。**

不过你还需要下一步，不断的修改完善。

#### 完善修改

我们fork的博客目录主要有这些，这就需要我们慢慢修改了。

> 目录文档详细说明。如下：

> _config.yml 博客配置文档（包括博客标题、favicon、博主 ID、头像、描述、联系方式等基本信息都在这个文档添加或修改）；
> index.html 博客架构文档；
> 
> _includes 博客调用的网页模块（比如导航栏、底栏、博文内容显示、评论模块等），一般不需要管；

> _layouts 存放博客调用的页面模板文件（比如博客主页、具体博文页）的文件夹；

> css 存放博客系统的页面渲染文档文件夹，主要用于调节诸如标题字体、博文字体大小颜色之类；

> js 存放博客调用的 JS 文档文件夹

> _posts 博客正文存放的文件夹。命名有规定，必须为「日期 + 标题」的模式，即「2015-04-27-Like-Kissing.md」，才能发布到博客里；

> images 图片文件夹，存放博客相关素材，包括博客 favicon、博主头像等图片及博文贴图素材；

> CNAME 用于绑定个人域名的文档；

> 404.html 「404 Not Found.」站点链接无法访问时的提示页面。

> About.html 博客中的个人说明文档（About Me），以 html、md 格式为主；

> feed.xml 博客的 RSS 订阅；

> README.md 项目说明文档。用于 Github 个人项目主页的说明（描述）。


**修改要点：**
- 保持尺寸的维持原状
- 保证文件名的修改统一

程序出现一点差错就会失败。

#### 撰写博文

ok，修改完了这些，让我们一起写下第一篇文章。
按照上面说的，我们的博客在
> **_posts **文件夹

打开观察，里面的文件是md格式，也就是我们需要的Markdown样式的。

其命名也要遵循标准：
> 2015-04-27-my-blog.md

每篇文章前都有博文代码：
> layout 一般不用改；
> Title 一项是必须添加的；
> Categories 目录可以换，但如果不是要多重分类，一般也不用管，这篇归档在 Blog 目录下；
> Tags 可以自己按照文章主题添加，也可以不加，不同的 Tags 直接用英文逗号加半角空格间隔开；
> description 博文概述，一句话概述，一般添加会好些。

然后保存起来就可以啦!

#### 同步到网络

因为我一直没有在本地安转jekyll环境，采用直接在github更新的方式，如下
![Alt text](http://7xtgob.com2.z0.glb.clouddn.com/blogjiaocheng%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_20160615160314.png)

就像在后台更新。

当然，你也可以通过github桌面端的方式同步进行版本管理。[桌面端下载链接](https://desktop.github.com/)

### 绑定域名+坚持写下去

倘若为了追求个人品牌的最大化，我们可以去购买域名，然后绑定到刚刚建立的博客上。

我在阿里云购入域名，使用的也是免费的解析，这些其实并不太重要。

最重要的是：
> **坚持书写，坚持更新**

在寻找模版的过程中，见过太多只有几篇的博客，也许是主人在建好以后没有了书写的兴趣。

这违背了我们建站的初衷，**坚持不断地更新**，这才是最有用的。

### 致谢

感谢在建站过程中的优秀教程，主要参考如下：
[打造你的 GitHub Pages 专属博客（小白教程）](http://azeril.me/blog/Build-Your-First-GitHub-Pages-Blog.html)
[Jekyll 博客主题精选](http://azeril.me/blog/Selected-Collection-of-Jekyll-Themes.html)
[使用Github Pages建独立博客](http://beiyuu.com/github-pages)

感谢黄玄[博客](http://huangxuan.me/)我fork的他的博客，简洁优雅，很漂亮。

也感谢给我提供帮助的[geno1024](http://geno1024.com/)，一个计算机专业的姑娘，她以后绝对是笑来说的“女神”！