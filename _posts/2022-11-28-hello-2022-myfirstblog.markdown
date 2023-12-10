---
layout:     post
title:      "Hello 2022"
subtitle:   " \"Hello World, Hello Blog\""
date:       2022-11-28 20:00:00
author:     "Jiasheng"
header-img: "img/post-bg-2015.jpg"
catalog: true
tags:
    - Meta
---

> “Yeah It's on. ”


JIASHENG 的 Blog 就这么开通了。

[跳过废话，直接看技术实现 ](#build) 

2022 年，JIASHENG 总算有个地方可以好好写点东西了。


作为一个小白，这是我搭建的第一博客，接下来会讲诉一下我遇到的问题和搭建博客的过程


<p id = "build"></p>

## 正文

### 我为什么要搭建这个博客
听室友说他搭了个博客，然后最近找了个阿里机器学习的实习，月薪1万，他说有问到他后端的，那人对他自己搭建的网站挺感兴趣的....其实我早就想搭博客了，之前搞过几次，半途而废没搭起来，
这次折腾了一个下午要搞出来了

### 我搭建这个博客主要经历了什么
GitHub我不会用...今日之前的水平仅限于download zip（每错，我之前把GitHub当成Google用来搜索代码，有用的就下载下来...从未用GitHub来管理过我的代码或者用GitHub搭建一个界面）
#### 1.看bilibili上的教程（实际上没帮到我）
为了搭建这个博客，我先是上bilibili搜了一下：“如何搭建一个博客”，主要看了两个视频，一个是关于[搭建个人博客的理论](https://www.bilibili.com/video/BV1qD4y1z783)
主要是将理论，和我这里搭建的博客没啥关系...
然后看了另外一个[搭建个人网站的视频](https://www.bilibili.com/video/BV1rU4y1J785)，讲可以租一个云服务器然后把网页利用云服务器发布，并且还推荐了一个模块化跟搭积木一样做博客的网页，实际上和我这里搭建的博客也没啥关系，我这个博客完全在
GitHub上不需要云服务器。所以我大概思路就有了，我要用github来搭建我自己的网站

#### 2.在必应上搜索如何github搭建个人博客
我主要找的教程是和GitHub相关的，其他技术路线有很多

我先学了怎么在本地使用github（我先注册了github账号、在windows电脑上安装了Git、Node.js、Hexo）
然后学了一下怎么将本地的代码和github上的代码进行同步等基本操作（和我这里搭建的博客也没有关系）...
主要内容都在csdn，csdn的很多文章非常乱...非常难以复现...
基本上照着上面某个教程弄，弄到一半发现莫名其妙的问题，然后就弄不下去了，大概是说要在setting里面下拉找到**Github Pages**这里找到一个链接
![image](https://user-images.githubusercontent.com/119298299/204282276-ef685bc3-5431-4a9c-98e4-5f47928cfa9f.png)
我发现我跟着这些教程走，完全没有这个选项，我的github代码进入setting后，连**option**都没有
我的是**general**，也没有直接找到**Github Pages**
![image](https://user-images.githubusercontent.com/119298299/204282568-86bafcf9-0388-4d80-82a1-396f6d971beb.png)
然后我到油管上找了找教程，就发现了，压根就不是在setting里面下拉找到**Github Pages**
![image](https://user-images.githubusercontent.com/119298299/204283426-a920f7cc-48d1-4c12-bcb3-6691c4a9a6b9.png)
....主要原因是：国内的教程大多数翻译过来的、并且更新不及时、人家github网页的操作都更新了，csdn上很多教程还是很旧的。
#### 3.在油管上搜索如何用github搭建个人博客
然后我跟着[油管教程搭建了一个博客](https://www.youtube.com/watch?v=AIEJP-igDro)
跟着他搭发现可以用，fork了一个别人的博客到我自己仓库
![image](https://user-images.githubusercontent.com/119298299/204284170-c0872022-36d1-411c-8508-43ff4417d403.png)
然后我要把这个模板替换为自己的，我发现我直接在github网站上改，但是的博客网站上没有同步（大致原因是我fork了别人的代码
我改动代码，然后提交，需要原来的那个主人同意....然后折腾了好久，我去查了一下关于github版本管理的，大多数教程是在本地
电脑上，用命令行实现与云端代码同步的，最后我想到branch...原来如此，我把branch从原来主人的master，新建了一个我自己的，
每次我在我自己的分支修改完代码，我都要提交给自己，然后点同意，然后我就可以用这个模板了...也就是本博客的来源）
![image](https://user-images.githubusercontent.com/119298299/204285072-28dd427b-b1e8-4bcd-81ca-1e5c5f07c664.png)
![image](https://user-images.githubusercontent.com/119298299/204285342-0f3db8bb-9906-46e9-96bb-8795ef8c068f.png)
![image](https://user-images.githubusercontent.com/119298299/204285561-dc5fb1a5-f461-4389-a3ca-8a156bbade49.png)
然后到自己的分支下去同意修改，同意之后会自动跳回原始主人的master分支，记得手动回到自己分支；
![screenshots](https://user-images.githubusercontent.com/119298299/204285997-08e81fd4-acde-4a8a-a91d-4f7e4e4dad03.gif)

成功提交后还需要等一段时间，好像是github自己在检测之类的，最后刷新自己的网站，就成功了
![image](https://user-images.githubusercontent.com/119298299/204286261-725ac31d-5198-4027-a907-6ccee6b50bb6.png)

接下来说说搭建这个博客的技术细节。  

## 反思
折腾了一天，如果在csdn发现问题，那我是不是应该用谷歌呢、与其在无法修改模板的时候自己在猜想如何在github网页修改代码，试了一小时
不如拿一小时的时间来系统看一下github的官方文档？或者相关的教程呢？


## 0理论
## 1安装Git 
安装git
**Windows 平台**： 
msysGit 项目提供了安装包，可以到 GitHub 的页面上下载 exe 安装文件并运行，[安装包下载地址](https://gitforwindows.org/)。
官网慢，可以在国内的[镜像处](https://registry.npmmirror.com/binary.html?path=git-for-windows/)下载。
下载适合自己电脑配置的，例如我下载的这个，[在这里下载](https://registry.npmmirror.com/binary.html?path=git-for-windows/v2.39.0-rc0.windows.1/)
![在这里插入图片描述](https://img-blog.csdnimg.cn/815ffdfafe2e4d128c2ab7d4bfadb584.png)

**Mac 平台**安装 Git 可以使用Mac的图形化 Git 安装工具，下载地址为：
http://sourceforge.net/projects/git-osx-installer/

完成安装之后，就可以使用命令行的 git 工具（已经自带了 ssh 客户端）了，另外还有一个图形界面的 Git 项目管理工具。

在开始菜单里找到"Git"->"Git Bash"，会弹出 Git 命令窗口，你可以在该窗口进行 Git 操作。
或者在某个文件夹下，右键就可以找到`Git Bash Here`
![在这里插入图片描述](https://img-blog.csdnimg.cn/6f0e1d1eafa6462eafff6d67297861d3.png)


## 2使用
**设置用户名与邮箱（用户标识）**
当你安装Git后首先要做的事情是设置你的用户名称和e-mail地址。这是非常重要的，因为每次Git提交都会使用该信息。它被永远的嵌入到了你的提交中：

```bash
git config --global user.name  "name"  // 名字
git config --global user.email "123@126.com"  // 邮箱
```
![在这里插入图片描述](https://img-blog.csdnimg.cn/84ab9da559b247cdb5e626ca67054b00.png)
如果你传递了--global 选项，Git将总是会使用该信息来处理你在系统中所做的一切操作。如果你希望在一个特定的项目中使用不同的名称或e-mail地址，你可以在该项目中运行该命令而不要--global选项。
**查看配置**
要检查已有的配置信息，可以使用 `git config --list` 命令
![在这里插入图片描述](https://img-blog.csdnimg.cn/ad961ec8255b4bb686f5019fea5f4af7.png)
查看系统`config git config --system --list`
![在这里插入图片描述](https://img-blog.csdnimg.cn/10fe84664ce949959780f5323abb8953.png)

查看当前用户（global）配置  `git config --global  --list`
![在这里插入图片描述](https://img-blog.csdnimg.cn/b9c1fe16290c4bceacecc9b5e790bdf6.png)
直接查阅某个环境变量的设定，只要把特定的名字跟在后面即可

```bash
$ git config user.name
$ git config -e    # 针对当前仓库 
$ git config -e --global   # 针对系统上所有仓库
```
## 3Git工作流程：

```bash
1、克隆文件和新建文件为工作目录；
2、在原有文件上添加或修改文件
3、将需要进行版本管理的文件放入暂存区域；
4、将暂存区域的文件提交到git仓库。
```
![在这里插入图片描述](https://img-blog.csdnimg.cn/5ec0ec628a174317847ce7a1841edbb9.png)
**创建工作目录与常用指令**
工作区（WorkSpace)一般就是你希望Git帮助你管理的文件夹，可以是你项目的目录，也可以是一个空目录，建议不要有中文。日常使用只要记住下图6个命令：![在这里插入图片描述](https://img-blog.csdnimg.cn/bcab4640725743b88899b617e65d0271.png)
**6个常用命令的使用**
### 1Git 创建仓库
#### 1.初始化Git仓库


```bash
 git init
```
会在文件夹下新建一个`.git`文件夹
.git 默认是隐藏的，可以用 ls -a 命令查看，或者打开你文件查看的隐藏
![在这里插入图片描述](https://img-blog.csdnimg.cn/7df05273f4c745b68d07f3131754ddc0.png)
![在这里插入图片描述](https://img-blog.csdnimg.cn/dcf0d9dd2cb94637a992ef2b9afd9741.png)

`.git`文件夹下有很多文件
![在这里插入图片描述](https://img-blog.csdnimg.cn/79f62c9f4b924e4cba98630e767f5cb0.png)
使用我们指定目录作为Git仓库。git init 目录名
#### 2**克隆仓库 git clone**

```bash
git clone <仓库> <本地目录>
```
例如：从GitHub上克隆这个代码
![在这里插入图片描述](https://img-blog.csdnimg.cn/d90f7ef9cee649b6b5223dc9e5d76de9.png)

克隆以下项目命令为

```bash
git clone https://github.com/mithi/robotics-coursework.git
```

执行该命令后，会在当前目录下创建一个名为`robotics-coursework`的目录，其中包含一个 `.git` 的目录，用于保存下载下来的所有版本记录。
![在这里插入图片描述](https://img-blog.csdnimg.cn/9335d2cc21b84bee98732b6ea0123771.gif)
#### 3**提交与修改**
| 命令 | 说明 |
|--|--|
| git add |添加文件到仓库  |
| git status |参看仓库当前状态，显示变更的文件  |
|  git diff|比较文件的不同（比较的是暂存区和工作区中的文件）  |
| git commit |提交暂缓区到本地仓库 |
|   git commit -m "消息内容"  |提交暂存区中的内容到本地仓库 -m 提交信息 |
|  git reset| 退回版本 |
| git rm |  删除工作区文件|
| git mv |移动或重命名工作区文件  |

提交日志
| 命令 | 说明 |
|--|--|
| git log |查看历史提交记录  |
| git blame \<file> |以列表形式查看制定文件的历史修改记录 |

#### 4**远程操作**
| 命令 | 说明 |
|--|--|
| git remote |远程仓库操作  |
| git fetch |从远程获取代码库  |
|  git pull|下载远程代码并合并 |
| git push |上传远程代码并合并  |

测试案例 

```bash
smile@DESKTOP-VLG0H58 MINGW64 /f/Code/GitHub/repository (master)
$ cd robotics-coursework/

smile@DESKTOP-VLG0H58 MINGW64 /f/Code/GitHub/repository/robotics-coursework (master)
$ touch readme

smile@DESKTOP-VLG0H58 MINGW64 /f/Code/GitHub/repository/robotics-coursework (master)
$ git add readme

smile@DESKTOP-VLG0H58 MINGW64 /f/Code/GitHub/repository/robotics-coursework (master)
$ git commit -m '第一次提交'
[master 55d6d34] 第一次提交
 1 file changed, 0 insertions(+), 0 deletions(-)
 create mode 100644 readme
```
![在这里插入图片描述](https://img-blog.csdnimg.cn/6bc8b2e19bcb4304b0a0b0855756eba6.png)
#### 5Git 分支管理

```bash
# 列出所有本地分支
git branch
# 列出所有远程分支
git branch -r
# 新建一个分支，但依然停留在当前分支
git branch [branch-name]
# 新建一个分支，并切换到该分支
git checkout -b [branch]
# 合并指定分支到当前分支
$ git merge [branch]
# 删除分支
$ git branch -d [branch-name]
# 删除远程分支
$ git push origin --delete [branch-name]
$ git branch -dr [remote/branch]
```
![在这里插入图片描述](https://img-blog.csdnimg.cn/e2adaf4fb307464bad0a54665ca92b3f.png)
#### 6Git 查看提交历史

```bash
git log #查看历史提交记录。
git blame <file> #以列表形式查看指定文件的历史修改记录。
git log --oneline #来查看历史记录的简洁的版本。
```
![在这里插入图片描述](https://img-blog.csdnimg.cn/e3e5121614514eb2acfd2cc6f716c096.png)
![在这里插入图片描述](https://img-blog.csdnimg.cn/38305fb9e4d9489e903cf36bde26c4ea.png)
### 2.Git 远程仓库(Github) 
![在这里插入图片描述](https://img-blog.csdnimg.cn/a154bcf3aed541cc9d0ad476d34afa9b.png)

#### 1添加远程库
要添加一个新的远程仓库，`<shortname>`是你给这个远程分支起的名字，这个名字只会在本地起作用、本例以 Github 为例作为远程仓库，如果你没有 Github 可以在官网 `https://github.com/`注册。：
```bash
git remote add [shortname] [url]
```
配置Git验证信息：使用以下命令生成 SSH Key：
```bash
 ssh-keygen -t rsa -C "your_email@youremail.com"
```
后面的`"your_email@youremail.com"`改为你在github上注册的邮箱，之后会要求确认路径和输入密码，我们这使用默认的一路回车就行。成功的话会在生成.ssh文件夹，进去，打开id_rsa.pub，复制里面的key。

我在`repository`文件夹下创建了一个`remote`文件夹，然后在文件夹中右键`git bash here`

```bash
git remote add remote1 https://github.com/10179013
ssh-keygen -t rsa -C 10179013@mail.ecust.edu.cn


```
![在这里插入图片描述](https://img-blog.csdnimg.cn/40d54d4d78f94a399592b60925ea558c.gif)

```bash
/c/Users/52595/.ssh/id_rsa
```
![在这里插入图片描述](https://img-blog.csdnimg.cn/971461c5ee804d1ba9bbcd6e84a076e6.png)

![在这里插入图片描述](https://img-blog.csdnimg.cn/80af04d13ebc4d5b8e9bfb6d4259e6f2.png)
注意，这里双击可能打不开，报错`pub格式的文件打开报错：Publisher无法打开文件 解决办法`
![在这里插入图片描述](https://img-blog.csdnimg.cn/c5d9985bda2a4d5286f6932d42ab17cf.png)
解决方法
1、打开powershell窗口
![在这里插入图片描述](https://img-blog.csdnimg.cn/e4d22200c41547578adcada7f86d3516.png)
输入`type id_rsa.pub`
就可以获得了，复制内容就可以去粘贴使用
![在这里插入图片描述](https://img-blog.csdnimg.cn/c0c827bbc1824c1ea796db5baa0d0fb3.png)
![在这里插入图片描述](https://img-blog.csdnimg.cn/66c176dc8cac40e0a21c2b146d8deee7.png)

![在这里插入图片描述](https://img-blog.csdnimg.cn/94d96a6757fa4b748581f2f768a76d62.png)
把刚刚在powershell里面的添加进去，就有了
![在这里插入图片描述](https://img-blog.csdnimg.cn/74d81430dc1d4ea2b646bc404bb64ba0.png)
![在这里插入图片描述](https://img-blog.csdnimg.cn/fa692bed38d447ccae16851ecc04121a.png)
为了验证是否成功，输入以下命令：

```bash
ssh -T git@github.com
```
以下命令说明我们已成功连上 Github
![在这里插入图片描述](https://img-blog.csdnimg.cn/1abeb8f97f7c4421ba179b7593948c4d.png)


之后登录GitHub后点击" New repository " 如下图所示：
![在这里插入图片描述](https://img-blog.csdnimg.cn/38831b84ef404601bcd6e58c681f07db.png)
之后在Repository name 填入 remote-git-test(远程仓库名) ，其他保持默认设置，点击"Create repository"按钮，就成功地创建了一个新的Git仓库：
![在这里插入图片描述](https://img-blog.csdnimg.cn/6ccd7c27cf274ffca3a8a9cf8d1dfa13.png)
创建成功后，显示如下信息：
![在这里插入图片描述](https://img-blog.csdnimg.cn/ee1ec0cdb9eb47c29a58a605918c9c6a.png)

```bash
Quick setup — if you’ve done this kind of thing before
Get started by creating a new file or uploading an existing file. We recommend every repository include a README, LICENSE, and .gitignore.
```
…or create a new repository on the command line

```bash
echo "# remote-git-test" >> README.md
git init
git add README.md
git commit -m "first commit"
git branch -M main
git remote add origin git@github.com:10179013/remote-git-test.git
git push -u origin main
```
…or push an existing repository from the command line

```bash
git remote add origin git@github.com:10179013/remote-git-test.git
git branch -M main
git push -u origin main
```
…or import code from another repository
You can initialize this repository with code from a Subversion, Mercurial, or TFS project.
以上信息告诉我们可以从这个仓库克隆出新的仓库，也可以把本地仓库的内容推送到GitHub仓库。
现在，我们根据 GitHub 的提示，在本地的仓库下运行命令：


#### 2创建README.md文件并写入内容
```bash
echo "# remote-git-test" >> README.md
git init 					 #初始化
git add README.md  			 #添加'README.md'文件
git commit -m "first commit" #提交并备注信息
git branch -M main
git remote add origin git@github.com:10179013/remote-git-test.git #提交到GitHub
git push -u origin main
```
过程如下：
![在这里插入图片描述](https://img-blog.csdnimg.cn/946facebeb124591a09d4df439544b38.gif)
在本地电脑目录中多了这些
![在这里插入图片描述](https://img-blog.csdnimg.cn/2a71abdaf7b24a5db4cce610a3e5839e.png)
刷新网页，在云端的GitHub也有了`README.md`
#### 3在云端修改`README.md`文件
![在这里插入图片描述](https://img-blog.csdnimg.cn/43076b4509ee409c968212671fd9e5cd.png)
![在这里插入图片描述](https://img-blog.csdnimg.cn/bd985bca4b364e789333d4b50be4bc5a.gif)

#### 4将云端上的内容同步到本地电脑上

```bash
git fetch origin
```
![在这里插入图片描述](https://img-blog.csdnimg.cn/6667f2052693425288372e495b92f5df.png)
以上信息"76f87d9..5130c04  main       -> origin/main" 说明 main分支已被更新（有的时候终端是在master的情况下，将本部分的`main`替换为`master`），我们可以使用以下命令将更新同步到本地：

```bash
git merge origin/main
```
![在这里插入图片描述](https://img-blog.csdnimg.cn/e8e3a3595923438b8b0544b89ef51051.png)
我们查看本地电脑上的 README.md 文件内容：
![在这里插入图片描述](https://img-blog.csdnimg.cn/950b35fccc604a4b875eabaeb0ec2b4e.png)
也可以用命令行查看

```bash
cat README.md 
```
![在这里插入图片描述](https://img-blog.csdnimg.cn/b2626ec32aca4cd8a5005d6a994de15d.png)
#### 5推送到远程仓库
推送你的新分支与数据到某个远端仓库命令:

```bash
git push [alias] [branch]
```
以上命令将你的 [branch] 分支推送成为 [alias] 远程仓库上的 [branch] 分支，实例如下：

```bash
touch runoob-test.txt      # 添加文件
git add runoob-test.txt 
git commit -m "添加到远程"
git push origin main    # 推送到 Github，执行完这一步，本地文件才真的传到云端上了
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/4b92a263c0f648ae8220cdc7f1d3e10a.png)
过程如下：
![在这里插入图片描述](https://img-blog.csdnimg.cn/250b53dfc21a4dd49deb3393a75cbac9.gif)
#### 6删除远程仓库
删除远程仓库你可以使用命令：

```bash
git remote rm [别名]
```
实例：
![在这里插入图片描述](https://img-blog.csdnimg.cn/3f4e1afc03cd4a498007a596f7e79a94.png)
我的是`git@github.com:10179013/remote-git-test.git`

```bash
git remote -v
# 添加仓库 origin2
git remote add origin2 git@github.com:10179013/remote-git-test.git
git remote -v
# 删除仓库 origin2
$ git remote rm origin2
$ git remote -v
```
![在这里插入图片描述](https://img-blog.csdnimg.cn/69ce92b21eb3448ab8b01f79490372f3.png)
过程如下
![在这里插入图片描述](https://img-blog.csdnimg.cn/124d4261121e429a86563f7c1dae5f44.gif)

