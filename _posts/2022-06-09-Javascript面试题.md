---
layout:     post
title:      "JavaScript面试题"
subtitle:   "JavaScript"
date:       2022-06-09
author:     "YorkWong"
header-img: "img/post-bg-js-version.jpg"
tags:
- Job Interview
---
---

# ES6

## 重要特性

- 块级作用域:ES5 只有全局作用域和函数作用域，块级作用域的好处是不再需要立即执行的函数表达式，循环体中的闭包不再有问题
- rest 参数:用于获取函数的多余参数，这样就不需要使用 arguments 对象
- Promise:一种异步编程的解决方案，比传统的解决方案回调函数和事件更合理强大
- 模块化:其模块功能主要有两个命令构成，export 和 import，export 命令用于规定模块的 对外接口，import 命令用于输入其他模块提供的功能

## 箭头函数

### 特性

1. 箭头函数没有 this，所以需要通过查找作用域链来确定 this 的值，这就意味着如果箭头函数被非箭头函数包含，this 绑定的就是最近一层非箭头函数的 this
2. 箭头函数没有自己的 arguments 对象，但是可以访问外围函数的 arguments 对象
3. 不能通过 new 关键字调用，同样也没有 new.target 值和原型

[ES6 入门教程](https://es6.ruanyifeng.com/)

## Promise

[ES6 入门教程](https://es6.ruanyifeng.com/#docs/promise)

# let,const,var两大区别

- let/const是使用区块作用域；var是使用函数作用域
- 在let/const声明之前就访问对应的变量与常量，会抛出ReferenceError错误；但在var声明之前就访问对应的变量，则会得到undefined

# 暂时性死区

## （temporal dead zone，简称 TDZ）

> 在代码块内，使用 let、const 命令声明变量之前，该变量（或常量）都是不可用的。
>

# 原型

[https://github.com/mqyqingfeng/Blog/issues/2](https://github.com/mqyqingfeng/Blog/issues/2)

## 什么是原型？

> 每一个JavaScript实例对象(null除外)在创建的时候就会与之关联另一个对象，这个对象就是我们所说的实例原型，每一个实例对象都会从原型"继承"属性。
>

![由相互关联的原型组成的链状结构就是原型链，也就是蓝色的这条线。](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/bbef548e-10f0-4bb4-96f7-15cf8de70da9/Untitled.png)

由相互关联的原型组成的链状结构就是原型链，也就是蓝色的这条线。

# 继承

[https://github.com/mqyqingfeng/Blog/issues/16](https://github.com/mqyqingfeng/Blog/issues/16)

# 作用域

[Scope（作用域） - 术语表 | MDN](https://developer.mozilla.org/zh-CN/docs/Glossary/Scope)

## 作用域链原理

[https://github.com/mqyqingfeng/Blog/issues/6](https://github.com/mqyqingfeng/Blog/issues/6)

# 闭包

[闭包 - JavaScript | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Closures)

[https://github.com/mqyqingfeng/Blog/issues/9](https://github.com/mqyqingfeng/Blog/issues/9)

经典面试题：

```jsx
var data = [];

for (var i = 0; i < 3; i++) {
  data[i] = function () {
    console.log(i);
  }; //闭包
}

data[0]();
data[1]();
data[2]();
问题：分别输出什么？
```

```flow
答案： 输出的都是3
原因：赋值给data[i]的是闭包。
这三个闭包在循环中被创建，但他们同享同一个词法作用域。
在这个作用域中存在一个变量i，并且这个i是由var声明，由于变量提升，所以具有函数作用域。
由于循环在事件触发之前早已执行完毕，变量对象i（被三个闭包所共享）已经=3。
```

# 变量对象(不作为面试重点)

[https://github.com/mqyqingfeng/Blog/issues/5](https://github.com/mqyqingfeng/Blog/issues/5)

## VO 和 AO 到底是什么关系？

> 未进入执行阶段之前，变量对象(VO)中的属性都不能访问！但是进入执行阶段之后，变量对象(VO)转变为了活动对象(AO)，里面的属性都能被访问了，然后开始进行执行阶段的操作。
>

它们其实都是同一个对象，只是处于执行上下文的不同生命周期。

**一个执行上下文的生命周期可以分为两个阶段。**

1. 创建阶段

> 在这个阶段中，执行上下文会分别创建变量对象，建立作用域链，以及确定this的指向。
>
1. 代码执行阶段

> 创建完成之后，就会开始执行代码，这个时候，会完成变量赋值，函数引用，以及执行其他代码。
>

# 如何解决异步回调地狱

promise、generator、async/await



# 防抖和节流

### 防抖原理

你尽管触发事件，但是我一定在事件触发 n 秒后才执行，如果你在一个事件触发的 n 秒内又触发了这个事件，那我就以新的事件的时间为准，n 秒后才执行，总之，就是要等你触发完事件 n 秒内不再触发事件，我才执行；

> **虽然事件持续触发，但只有等事件停止触发n秒后才执行一次**。
>

```jsx
/**
	 *@alias 防抖
	 *@param {function} func 防抖被执行函数 
	 *@param {Number}  wait 时间单位内
	 */
function debounce(func, wait){
	var timeout;

	return function() {
		var context = this; //this指向
		var args = arguments; //event对象
		clearTimeout(timeout);
		timeout = setTimeout(function(){
				func.apply(context,args); //apply第二个参数是参数数组，call第二个参数是参数列表
			},wait)
	}
}
```

### 节流原理

> 节流是**事件持续触发的时候，每n秒执行一次函数**。
>

```jsx
/**
  *@alias 节流
  *@param {function} fn 节流被执行函数 
  *@param {Number}  delay 时间单位内
*/
throttle(fn, delay){
	let flag = true,
			timer = null;

	return function(...args){
		let context = this;
		if(!flag) return; 
		flag = false;
		clearTimeout(timer);
		timer = setTimeout(()=>{
			fn.apply(context,args);
			flag = true;		
		},delay)
	}
}
```

### 深入防抖

[https://github.com/mqyqingfeng/Blog/issues/22](https://github.com/mqyqingfeng/Blog/issues/22)

### 深入节流

[https://github.com/mqyqingfeng/Blog/issues/26](https://github.com/mqyqingfeng/Blog/issues/26)

# 数据类型

## Js基本数据类型

```
**undefined、null、number、boolean、string、symbol**
```

## 判断数据类型

## 1.typeof

> 判断`number`, `string`, `object`, `boolean`, `function`, `undefined`, `symbol` 这七种类型；但不能细致的具体到是哪一种 object。
>

## 2.instanceof

> 检测右边构造函数的 `prototype` 属性是否出现在左边某个实例对象的原型链上。[instanceof - JavaScript | MDN (mozilla.org)](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/instanceof)
>

```jsx
let arr = [1,2,3];
arr instanceof Array; //true
arr instanceof String; //false
```

[浅谈 instanceof 和 typeof 的实现原理 - 掘金](https://juejin.cn/post/6844903613584654344)

## 3.Object.prototype.toString.call(xx)

```jsx
let arr = [1,2,3];
Object.prototype.toString.call(arr) // "[object Array]"
```

## 相关面试题：

### 1）typeof null返回什么？

```
'**object**'
原因：null的机器码都为000；
			000在js底层中代表object；
```

### 2）如何判断arr是不是一个数组对象(讲到 typeof 差点掉坑里)？

```jsx
Object.prototype.toString.call(arr) '[object Array]'

or

arr instanceof Array //true

注意：typeof 只能判断是 object,可以判断一下是否拥有数组的方法
```

### 3）null == undefined 为什么？

```jsx

因为存在**类型转换

扩展：
typeof null        // "object" (因为一些以前的原因而不是'null')
typeof undefined   // "undefined"
null === undefined // false
null  == undefined // true  ==> [==会执行类型转换]
!null //true
isNaN(1 + null) // false
isNaN(1 + undefined) // true**
```

# this的指向

[](https://javascript.ruanyifeng.com/dom/event.html#toc9)

# 事件

## 1.事件传播

[](https://javascript.ruanyifeng.com/dom/event.html#toc10)

### 什么是事件流？

描述的是从页面中接收事件的顺序;
包括事件**捕获阶段**（上→下），处于**目标阶段**，事件**冒泡阶段**

### 如何让事件先冒泡后捕获？

在 DOM 标准事件模型中，是先捕获后冒泡。但要实现先冒泡后捕获的效果，对于同一个事件，监听捕获和冒泡，分别对应相应的处理函数，监听到捕获事件，先暂缓执行，直到冒泡事件被捕获后再执行捕获事件。

## 2.事件代理（aka：事件委托）

[](https://javascript.ruanyifeng.com/dom/event.html#toc11)

> 不在事件的发生地(直接dom)上设置监听函数，而是**在其父元素上设置监听函数**，**通过事件冒泡**，**父元素可以监听到子元素上事件的触发**，通过判断事件发生元素 DOM 的类型，来做出不同的响应。
>

### 优点

适合动态元素的绑定，新添加的子元素也会有监听函数，也可以有事件触发机制。

### 例子

最经典的就是 ul 和 li 标签的事件监听，比如我们在添加事件时候，采用事件委托机制，不会在 li 标签上直接添加，而是在 ul 父元素上添加。

## 3.@click|@click.stop,@click.prevent|@keyup.enter

[Vue之@click、事件修饰符@click.stop与@click.prevent、按键修饰符@keyup.enter](https://www.cnblogs.com/ning123/p/11324583.html)

# 图片的预加载和懒加载

- 预加载:提前加载图片，当用户需要查看时可直接从本地缓存中渲染。
- 懒加载:主要目的是作为服务器前端的优化，减少请求数或延迟请求数。

## 本质

两者的行为是相反的，一个是提前加载，一个是迟缓甚至不加载。

懒加载缓解服务器端压力，预加载增加服务器端压力。

# mouseover,mouseenter

[mouseenter - Web API 接口参考 | MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/mouseenter_event)

# js 的 new 操作符做了哪些事情？

new 操作符新建了一个空对象，这个对象的原型指向构造函数的 prototype，执行构造函数后，返回这个对象。

[new 运算符 - JavaScript | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/new)

# bind，apply，call 的区别

### **`apply()`，`call()`**方法马上调用一个具有给定`this`值的函数，以及第二个参数提供的参数。

`call()`方法接受的是**参数列表**，而`apply()`方法接受的是**一个参数数组**。

[Function.prototype.apply() - JavaScript | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/apply)

### **`bind()`**创建一个新的函数，在 `bind()`被调用时，这个新函数的 `this`被指定为 `bind()`的第一个参数，其余参数将作为新函数的参数，供调用时使用。

[Function.prototype.bind() - JavaScript | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/bind)

### 区别

1. apply(),call()马上执行，bind返回一个新的函数，不会马上执行。

# js的各种位置，比如clientHeight,scrollHeight,offsetHeight ,以及scrollTop, offsetTop,clientTop 的区别?

- clientHeight:表示的是可视区域的高度，不包含 border 和滚动条；
- offsetHeight:表示可视区域的高度，包含了 border 和滚动条 ；
- scrollHeight:表示了所有区域的高度，包含了因为滚动被隐藏的部分。
- clientTop:表示边框 border 的厚度，在未指定的情况下一般为 0
- scrollTop:滚动后被隐藏的高度，获取对象相对于由offsetParent属性指定的父坐标(css 定位的元素或 body 元素)距离顶端的高度。

# js 拖拽功能的实现

通过 html5 的拖放(Drag 和 drop)来实现

[HTML5 拖放](https://www.w3school.com.cn/html/html5_draganddrop.asp)

# 异步加载 js 的方法

常用方法：<async>属性是HTML5中新增的异步支持。此方法被称为Script DOM Element 方法。

[JS异步加载的三种方式](https://www.cnblogs.com/xkloveme/articles/7569426.html)

# Ajax 解决浏览器缓存问题

```
在 ajax 发送请求前加上 anyAjaxObj.setRequestHeader("If-Modified-Since","0")。
在 ajax 发送请求前加上 anyAjaxObj.setRequestHeader("Cache-Control","no-cache")。
在 URL 后面加上一个随机数: "fresh=" + Math.random()。
在 URL 后面加上时间搓:"nowtime=" + new Date().getTime()。
如果是使用 jQuery，直接这样就可以了 $.ajaxSetup({cache:false})。这样页面的所有
ajax 都会执行这条语句就是不需要保存缓存记录。
```

# 垃圾回收机制

## 为什么系统需要垃圾回收？

> 必要性:由于字符串、对象和数组没有固定大小，所有当他们的大小已知时，才能对他们进 行动态的存储分配。JavaScript程序每次创建字符串、数组或对象时，解释器都必须分配内存来存储那个实体。只要像这样动态地分配了内存，最终都要释放这些内存以便他们能够被再用， 否则，JavaScript 的解释器将会消耗完系统中所有可用的内存，造成系统崩溃。
>

JS 不像 C/C++，他有自己的一套垃圾回收机制 (Garbage Collection)。JavaScript的解释器可以检测到何时程序不再使用一个对象了，当他确定了一个对象是无用的时候，他就知道不再需要这个对象，可以把它所占用的内存释放掉了。

## 垃圾回收的方法

标记清除、计数引用。

# eval()是做什么的？

**`eval()`** 函数会将传入的**字符串**当做 JavaScript 代码进行执行。

[eval() - JavaScript | MDN (mozilla.org)](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/eval)

特点：非常消耗性能(一次解析成js，一次执行js)；

# 如何理解前端模块化？

前端模块化就是复杂的文件，分成独立的模块。

有利于代码重用和维护，这样会引来模块之间相互依赖的问题，所以有了 commonJS 规范，AMD，CMD 规范等等，以及用于 js 打包(编译等处理)的工具 webpack。

# 实现一个 once 函数，传入函数参数只执行一次。

```jsx
function once(func) {
		var tag = true;
		return function(...args) {
			if (tag == true) {
				func.apply(null, args);
				tag = false;
			}
			return undefined
		}
	}
```

# 将原生的 ajax 封装成 promise。

```jsx
var myNewAjax=function(url) {
		return new Promise(function(resolve, reject) {
			var xhr = new XMLHttpRequest();
			xhr.open('get', url);
			xhr.send(data);
			xhr.onreadystatechange = function() {
				if (xhr.status == 200 && readyState != 4) {
					var json = JSON.parse(xhr.responseText);
					resolve(json)
				} else if (xhr.readyState == 4 && xhr.status != 200) {
					reject('error');
				}
			}
		})
	},
```

# js 监听对象属性的改变。

**在ES6 中可以通过 Proxy 来实现**

```jsx
//定义被侦听的目标对象
var engineer = { name: 'Lily', age: 20 };
//定义处理程序
var interceptor = {
    set: function (target, property, value) {
        console.log(property, 'is changed to', value);
        target[property] = value;
        return Reflect.set(target, property, value);   
    }
};
//创建代理以进行侦听
var myProxy = new Proxy(engineer, interceptor);
//做一些改动来触发代理
myProxy.age = 30;//age is changed to 60

```

# 跨域的原理

> 跨域，是指浏览器不能执行其他网站的脚本。它是**由浏览器的同源策略造成的**，是浏览器对 JavaScript实施的安全限制。**只要协议、域名、端口有任何一个不同，都被当作是不同的域**。
>

# virtual dom是什么？

> 用JavaScript对象结构表示DOM树的结构;然后用这个对象树构建一个真正的DOM树，插到文档当中。**当状态变更的时候，重新构造一棵新的对象树。然后用新的树和旧的树进行比较，记录两棵树差异把所记录的差异应用到所构建的真正的DOM树上，视图就更新了**。Virtual DOM 本质上就是在 JS 和 DOM 之间做了一个缓存。
>

# ⭐️深拷贝和浅拷贝

### 1）数组深拷贝？

```
1) arr.**slice**()
2) [].**concat**()
3) [**...**arr]
4) **Array.from**(arr)
```

### 2）对象深拷贝

```
**JSON.parse(JSON.stringify**(obj))
```

### 3）如何实现一个对象深拷贝的函数？

```jsx
//使用递归
var clone = function (obj) { 
    if(obj === null) return null 
    if(typeof obj !== 'object') return obj;
    if(obj.constructor===Date) return new Date(obj); 
    if(obj.constructor === RegExp) return new RegExp(obj);
    var newObj = new obj.**constructor** ();  //保持继承链
    for (var key in obj) {
        if (obj.**hasOwnProperty**(key)) {   //不遍历其原型链上的属性
            var val = obj[key];
            newObj[key] = typeof val === 'object' ? **arguments.callee**(val) : val; // 使用arguments.callee解除与函数名的耦合
        }
    }  
    return newObj;  
};
```

[JavaScript深拷贝和浅拷贝看这篇就够了 - 掘金](https://juejin.cn/post/6994453856063062053#heading-3)

[Shallow Vs Deep Copy In Javascript](https://anuradha.hashnode.dev/shallow-vs-deep-copy-in-javascript)

# webpack 用来干什么？

webpack 是一个现代 JavaScript 应用程序的静态模块打包器(module bundler)。当 webpack 处理应用程序时，它会递归地构建一个依赖关系图(dependency graph)，其中包含应用程序需要的每个模块，然后将所有这些模块打包成一个或多个 bundle。

# Event Loop【JS事件循环机制】

参考链接：

[JavaScript 运行机制详解：再谈Event Loop](http://www.ruanyifeng.com/blog/2014/10/event-loop.html)

[译文：JS事件循环机制（event loop）之宏任务、微任务](https://segmentfault.com/a/1190000014940904?utm_source=tag-newest)

## **微任务宏任务的执行顺序**

[js单线程，微任务宏任务的执行顺序_文雅的的博客-CSDN博客](https://blog.csdn.net/weixin_47485418/article/details/110826201?utm_medium=distribute.pc_relevant.none-task-blog-2~default~baidujs_baidulandingword~default-0.highlightwordscore&spm=1001.2101.3001.4242.1)

> js是单线程，但js是可以执行同步和异步任务的；同步的任务按照顺序去执行的；
而异步任务的执行，是有一个优先级的顺序的，包括了宏任务（macrotasks）和微任务（microtasks）
>

## 异步任务

### 1.**宏任务**

包括 整体代码 script，setTimeout，setInterval ，setImmediate，I/O，UI renderingnew ，Promise

### 2.**微任务**

包括Promises.(then catch finally)，process.nextTick， MutationObserver。

注意：new Promise在实例化的过程中所执行的代码是同步的，而在then中注册的回调函数才是异步，且属于微任务；

### 区别

执行完所有的同步任务后，会在任务队列中取出异步任务，微任务会在宏任务之前执行；

工作常用到的宏任务是 setTimeout，而微任务是 Promise.then；

```
In summary:

- Tasks execute in order, and the browser may render between them
- Microtasks execute in order, and are executed:
    - after every callback, as long as no other JavaScript is mid-execution
    - at the end of each task

总结一下：

- 宏任务按顺序执行，且浏览器在每个宏任务之间渲染页面
- 所有微任务也按顺序执行，且在以下场景会立即执行所有微任务；
    - 每个回调之后且js执行栈中为空。
    - 每个宏任务结束后。
```

# NAN是什么？

> JS 中的特殊值，表示非数字，NaN 不是数字，但是他的数据类型是数字，它不等于任何值，包括自身，在布尔运算时被当做 false，NaN 与任何数运算得到的结果都是 NaN
>

失败或者运算无法返回正确的数值的就会返回 NaN

# JavaScript 中的轮播实现原理?假如一个页面上有两个轮播，你会怎么实现?

`图片轮播的原理就是图片排成一行，然后准备一个只有一张图片大小的容器，对这个容器设置超出部
分隐藏，在控制定时器来让这些图片整体左移或右移，这样呈现出来的效果就是图片在轮播了。`

`如果有两个轮播，可封装一个轮播组件，供两处调用`

# 计算一年中有多少周?

1. 首先你得知道是不是闰年，也就是一年是 365 还是 366；
2. 其次你得知道当年 1 月 1 号是周几。假如是周五，一年 365 天把 1 号 2 号 3 号减去，也就是把第一个不到一周的天数减去等于 362
3. 还得知道最后一天是周几，假如是周五，需要把周一到周五减去，也就是 362-5=357；
4. 正常情况 357 这个数计算出来是 7 的倍数。357/7=51 。即为周数。

# 引用类型常见的对象

> Object、Array、RegExp、Date、Function、特殊的基本包装类型(String、Number、Boolean)以及单 体内置对象(Global、Math)等
>

# 数组去重的方法

1. indexOf 循环去重。
2. ES6 Set 去重;Array.from(new Set(array))。
3. Object 键值对去重;把数组的值存成 Object 的 key 值，比如 Object[value1] = true，再判断另一个值的时候，如果 Object[value2]存在的话，就说明该值是重复的。

# arguments

> arguments 是类数组对象，有 length 属性，不能调用数组方法;可用 Array.from()转换
>

# this

## 从ECMAScript规范解读this

（慢慢理解）

[https://github.com/mqyqingfeng/Blog/issues/7](https://github.com/mqyqingfeng/Blog/issues/7)

# 0.1+0.2为什么不等于0.3

> js使用的双精度浮点，所以在计算机内部存储数据的编码会出现误差；两次存储时的精度丢失加上一次运算时的精度丢失，最终导致了 0.1 + 0.2 !== 0.3
>

## 如何解决0.1 + 0.2 !== 0.3

- 使用number对象的toFixed方法
- 将其先转换成整数，再相加之后转回小数

# **decodeURI()与decodeURIComponent()**

[js编码解码decodeURI()与decodeURIComponent()的区别_技术之路-CSDN博客_decodeuricomponent](https://blog.csdn.net/qq_39712029/article/details/81003518)

## 区别：

**encodeURIComponent**和**decodeURIComponent**可以编码和解码URI特殊字符（如#，/，￥等），而**decodeURI**则不能。

# E****harts****

### 常见****面试题****

[Echarts面试题 - 掘金](https://juejin.cn/post/6844904174669299726)

### echart在切换标签页重新进入后，导致图表无法展示怎么解决？

思路： 在容器节点被销毁时，总是应调用 `[echartsInstance.dispose](https://echarts.apache.org/api.html#echartsInstance.dispose)` ,以销毁实例释放资源，避免内存泄漏。

官网说明：[Handbook - Apache ECharts](https://echarts.apache.org/handbook/zh/concepts/chart-size/#%E5%AE%B9%E5%99%A8%E8%8A%82%E7%82%B9%E8%A2%AB%E9%94%80%E6%AF%81%E4%BB%A5%E5%8F%8A%E8%A2%AB%E9%87%8D%E5%BB%BA%E6%97%B6)

```jsx
onMounted(() => {
     //init图表
		...code...
  });

//在卸载组件实例之前调用。在这个阶段，实例仍然是完全正常的。该钩子在服务器端渲染期间不被调用。
onBeforeUnmount(() => {
   if(myChart){
     myChart.dispose();
     myChart = null;
   }
 });
```

### **echartsInstance.dispose**和echartsInstance.clear的区别

官网：[Documentation - Apache ECharts](https://echarts.apache.org/zh/api.html#echartsInstance.dispose)

民间：[echarts的初始化和销毁dispose - 南风晚来晚相识 - 博客园 (cnblogs.com)](https://www.cnblogs.com/IwishIcould/p/15383269.html)

# webpack配置

[webpack打包工具不会用，那是因为你没看过这篇_程序猿小离的博客-CSDN博客](https://blog.csdn.net/weixin_45641191/article/details/120754195)

# 数组 字符串 对象之间的转换

[JS中数组、对象、字符串之间的转换_LEVsunshine的博客-CSDN博客_js 字符串转数组](https://blog.csdn.net/LEVsunshine/article/details/102966888)

## 快速新建一个数组

```jsx
const item = {
  date: '2016-05-02',
  name: 'Tom',
  address: 'No. 189, Grove St, Los Angeles',
}
const tableData = ref(Array.from({ length: 20 }).fill(item))
```

```json
这时候的tableData等于：
[
	{
		date: '2016-05-02',
	  name: 'Tom',
	  address: 'No. 189, Grove St, Los Angeles',
	},{
		date: '2016-05-02',
	  name: 'Tom',
	  address: 'No. 189, Grove St, Los Angeles',
	},{
		date: '2016-05-02',
	  name: 'Tom',
	  address: 'No. 189, Grove St, Los Angeles',
	}
	 .....该数组长度等于20
]
```