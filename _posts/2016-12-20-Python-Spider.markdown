---
layout:     post
title:      "Python爬虫入门"
subtitle:   "爬虫笔记(一)"
date:       2016-12-20
author:     "Alex"
header-img: "img/post-bg-xi.JPG"
catalog: true
tags:
    - 爬虫
    - Python
---



## 准备工作

> I am comming!

刚接触Python的时候，看到有「Python2」和「Python3」两个版本，而且语法上有出入，但是区别不算很大。抱着选新不选旧的想法，装上了Python 3.5.2。在这里作为新手我能吐槽一下吗，为什么语法都会变，后面的版本对前面的都不能兼容吗，`C++`都能兼容`C`呢。

在[廖雪峰的网站](http://www.liaoxuefeng.com/)上可以学到关于Python的一些基础知识，包括爬虫用到的dic,set等

IDE刚开始我用的Python自带的`IDLE`，还用过`Visual Stdio code`,后来在知乎上看到大家推荐[Pycharm](http://www.jetbrains.com/pycharm/download/),可耻的找了了Prefessional版本的注册码，注册码在[这里](http://blog.csdn.net/xx1710/article/details/52354745)。

> Let's start! 


按照知乎上大神给的爬虫进阶之路：

* 1.首先得学习Python的**list(队列),dict(字典)**
* 2.还需要了解**Numpy,Pandas**
* 3.学习Python的数据架构，推荐[利用Python进行数据分析](http://vdisk.weibo.com/s/q7eYLapcdw5fi)这本书
* 4.还需要了解**Http**的基本知识,可以以后慢慢在实战中学习
* 5.了解爬虫相关的包，such as **Urllib,urllib2,requests,BS4,scrapy,pyspider**,强烈建议用***requests,BS4***这两个包。requests负责连接网站，处理http协议；bs4负责将网页编程结构化数据，方便爬取    
* 6.偶尔会遇到一些用bs4也很难爬取的内容，这时就需要学一学**re（正则表达式）**
* 7.掌握了以上，就可以爬取一些静态网站啦，比如嗅事百科，天涯社区的帖子；然后可以学习爬取**js**加载的动态网站
* 8.学习爬取**js**加载的动态网站时，可以学习**selenium**或者**ghost**这种包来控制浏览器，或者借助**chrome开发者工具**来查看网页加载时的交互，然后用request进行表单的提交并爬取js
* 9.学习到以上

  ***你已经可以轻松爬取mtime时光网、豆瓣的电影评分数据，以及知乎***

* 10.接下来是进阶了。。需要学习python数据库连接知识，需要恶补**django**,**flask**等web开发框架,还有多线程爬虫提高爬取效率！代理IP池与网站斗智斗勇！scrapy,pyspider框架部署！


## 从最简单的一段代码开始

#### 1. **用Python抓取制定界面**

```js
    #encoding:UTF-8 
    import urllib.request         //The urllib.request module defines functions and classes which help in opening URLs (mostly HTTP) in a complex world — basic and digest authentication, redirections, cookies and more.
    url = "http://www.baidu.com"
    data = urllib.request.urlopen(url).read()  //urllib.request.urlopen(url, data=None, [timeout, ]*, cafile=None, capath=None, cadefault=False)
    data = data.decode('UTF-8')
    print(data)
```


## Python爬虫爬取知乎某一个问题下的图片

<!--<h2 id="history"> History </h2>-->

> 代码请看这里 [这里](https://achan.xyz/zhihupicdownload.py/)

















09-10 年间，CommonJS（那时还叫 ServerJS） 社区推出 [Modules/1.0](http://wiki.commonjs.org/wiki/Modules) 规范，并且在 Node.js 等环境下取得了很不错的实践。

09年下半年这帮充满干劲的小伙子们想把 ServerJS 的成功经验进一步推广到浏览器端，于是将社区改名叫 CommonJS，同时激烈争论 Modules 的下一版规范。分歧和冲突由此诞生，逐步形成了三大流派：


1. **Modules/1.x** 流派。这个观点觉得 1.x 规范已经够用，只要移植到浏览器端就好。要做的是新增 [Modules/Transport](http://wiki.commonjs.org/wiki/Modules/Transport) 规范，即在浏览器上运行前，先通过转换工具将模块转换为符合 Transport 规范的代码。主流代表是服务端的开发人员。现在值得关注的有两个实现：越来越火的 component 和走在前沿的 es6 module transpiler。
2. **Modules/Async** 流派。这个观点觉得浏览器有自身的特征，不应该直接用 Modules/1.x 规范。这个观点下的典型代表是 [AMD](http://wiki.commonjs.org/wiki/Modules/AsynchronousDefinition) 规范及其实现 [RequireJS](http://requirejs.org/)。这个稍后再细说。
3. **Modules/2.0** 流派。这个观点觉得浏览器有自身的特征，不应该直接用 Modules/1.x 规范，但应该尽可能与 Modules/1.x 规范保持一致。这个观点下的典型代表是 BravoJS 和 FlyScript 的作者。BravoJS 作者对 CommonJS 的社区的贡献很大，这份 Modules/2.0-draft 规范花了很多心思。FlyScript 的作者提出了 Modules/Wrappings 规范，这规范是 CMD 规范的前身。可惜的是 BravoJS 太学院派，FlyScript 后来做了自我阉割，将整个网站（flyscript.org）下线了。这个观点在本文中的典型代表就是 SeaJS 和 CMD 了


补一嘴：阿里 KISSY 的 KMD 其实跟 AMD 非常类似，只是用 `add`和`use` 两个源自于 YUI Modules 的函数名替换了 `define` 和 `require` ，但其原理更接近 RequireJS ，与 YUI Modules 的 `Y` 沙箱 Attach 机制并不相同


## RequireJS & AMD

[AMD (Async Module Definition)](http://wiki.commonjs.org/wiki/Modules/AsynchronousDefinition) 是 RequireJS 在推广过程中对模块定义的规范化产出。

> RequireJS is a JavaScript file and module loader. It is optimized for in-browser use, but it can be used in other JavaScript environments

RequireJS 主要解决的还是 CommonJS 同步加载脚本不适合浏览器 这个问题：

```js
//CommonJS

var Employee = require("types/Employee");

function Programmer (){
    //do something
}  

Programmer.prototype = new Employee();

//如果 require call 是异步的，那么肯定 error
//因为在执行这句前 Employee 模块肯定来不及加载进来
```
> As the comment indicates above, if require() is async, this code will not work. However, loading scripts synchronously in the browser kills performance. So, what to do?

所以我们需要 **Function Wrapping** 来获取依赖并且提前通过 script tag 提前加载进来


```js
//AMD Wrapper

define(
    [types/Employee],    //依赖
    function(Employee){  //这个回调会在所有依赖都被加载后才执行

        function Programmer(){
            //do something
        };

        Programmer.prototype = new Employee();
        return Programmer;  //return Constructor
    }
)
```

当依赖模块非常多时，这种**依赖前置**的写法会显得有点奇怪，所以 AMD 给了一个语法糖， **simplified CommonJS wrapping**，借鉴了 CommonJS 的 require 就近风格，也更方便对 CommonJS 模块的兼容：

```js
define(function (require) {
    var dependency1 = require('dependency1'),
        dependency2 = require('dependency2');

    return function () {};
});
```
The AMD loader will parse out the `require('')` calls by using `Function.prototype.toString()`, then internally convert the above define call into this:

```js
define(['require', 'dependency1', 'dependency2'], function (require) {
    var dependency1 = require('dependency1'),
        dependency2 = require('dependency2');

    return function () {};
});
```

出于`Function.prototype.toString()`兼容性和性能的考虑，最好的做法还是做一次 **optimized build**



AMD 和 CommonJS 的核心争议如下：

### 1. **执行时机**

Modules/1.0:

```js
var a = require("./a") // 执行到此时，a.js 才同步下载并执行
```

AMD: （使用 require 的语法糖时）

```js
define(["require"],function(require)){
    // 在这里，a.js 已经下载并且执行好了
    // 使用 require() 并不是 AMD 的推荐写法
    var a = require("./a") // 此处仅仅是取模块 a 的 exports
})
```

AMD 里提前下载 a.js 是出于对浏览器环境的考虑，只能采取异步下载，这个社区都认可（Sea.js 也是这么做的）

但是 AMD 的执行是 Early Executing，而 Modules/1.0 是第一次 require 时才执行。这个差异很多人不能接受，包括持 Modules/2.0 观点的人也不能接受。

### 2. **书写风格**

AMD 推荐的风格并不使用`require`，而是通过参数传入，破坏了**依赖就近**：

```js
define(["a", "b", "c"],function(a, b, c){
    // 提前申明了并初始化了所有模块

    true || b.foo(); //即便根本没用到模块 b，但 b 还是提前执行了。
})
```

不过，在笔者看来，风格喜好因人而异，主要还是**预执行**和**懒执行**的差异。

另外，require 2.0 也开始思考异步处理**软依赖**（区别于一定需要的**硬依赖**）的问题，提出了这样的方案：

```js
// 函数体内：
if(status){
    async(['a'],function(a){
        a.doSomething()
    })
}
```

## SeaJS & CMD

CMD (Common Module Definition) 是 [SeaJS](http://seajs.org/docs/) 在推广过程中对模块定义的规范化产出，是 Modules/2.0 流派的支持者，因此 SeaJS 的模块写法尽可能与 Modules/1.x 规范保持一致。

不过目前国外的该流派都死得差不多了，RequireJS 目前成为浏览器端模块的事实标准，国内最有名气的就是玉伯的 Sea.js ，不过对国际的推广力度不够。

* CMD Specification
    * [English (CMDJS-repo)](https://github.com/cmdjs/specification/blob/master/draft/module.md)
    * [Chinese (SeaJS-repo)](https://github.com/seajs/seajs/issues/242)


CMD 主要有 define, factory, require, export 这么几个东西

 * define `define(id?, deps?, factory)`
 * factory `factory(require, exports, module)`
 * require `require(id)`
 * exports `Object`


CMD 推荐的 Code Style 是使用 CommonJS 风格的 `require`：

* 这个 require 实际上是一个全局函数，用于加载模块，这里实际就是传入而已

```js
define(function(require, exports) {

    // 获取模块 a 的接口
    var a = require('./a');
    // 调用模块 a 的方法
    a.doSomething();

    // 对外提供 foo 属性
    exports.foo = 'bar';
    // 对外提供 doSomething 方法
    exports.doSomething = function() {};

});
```

但是你也可以使用 AMD 风格，或者使用 return 来进行模块暴露

```js
define('hello', ['jquery'], function(require, exports, module) {

    // 模块代码...

    // 直接通过 return 暴露接口
    return {
        foo: 'bar',
        doSomething: function() {}
    };

});
```



Sea.js 借鉴了 RequireJS 的不少东西，比如将 FlyScript 中的 module.declare 改名为 define 等。Sea.js 更多地来自 Modules/2.0 的观点，但尽可能去掉了学院派的东西，加入了不少实战派的理念。



## AMD vs CMD

**虽然两者目前都兼容各种风格，但其底层原理并不相同，从其分别推荐的写法就可以看出两者背后原理的不同：**

1. 对于依赖的模块，AMD 是**提前执行**，CMD 是**懒执行**。（都是先加载）
*  CMD 推崇**依赖就近**，AMD 推崇**依赖前置**。   

看代码：

```js
// AMD 默认推荐

define(['./a', './b'], function(a, b) {  // 依赖前置，提前执行

    a.doSomething()
    b.doSomething()

})

```

```js
// CMD

define(function(require, exports, module) {

    var a = require('./a')
    a.doSomething()

    var b = require('./b') // 依赖就近，延迟执行
    b.doSomething()
})
```






## WebPack

> working...
