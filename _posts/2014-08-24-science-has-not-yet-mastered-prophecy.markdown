---
layout:     post
title:      "JavaScript Function && This "
subtitle:   ""
date:       2014-08-24 12:00:00
author:     "Start Bootstrap"
header-img: "img/post-bg-04.jpg"
---

> 这篇文，将总结自己有关 「JavaScript函数与This关键字」 的所有**见解**，包括
* 基础 —— This的行为与理解（函数的行为并没有什么Confusing，就不在这赘述了）
* ECMAScript规范 —— V3 & V5
* 语言对比 —— 来自 C# 和 Swift 的启发
* 总结 —— 来自自己的最佳实践

## The behavior of "This"

在JS中，this的值一直很让人很困惑。
这里，我们先不考虑this的底层实现，而仅总结一下它的**行为**。

> **this对象在「运行时」基于函数的「执行上下文」绑定。**
一个更好理解的说法是：**this的值取决于「调用函数的方式」** *(the way of calling the function)*

#### 1. The Function Invoation Pattern 
> 当一个函数并不是某一个对象的属性时，它被以函数方式调用

此时，``this``将被绑定到**全局对象**（ECMA-3）

另一种理解方法是：
**「在默认情况下，永远假设this引用全局对象，直到有有原因让执行上下文发生了改变。」**

#### 2. The Method Invoation Pattern 
> 当一个函数作为某个对象的属性时，我们称它为**「方法」**

当我们通过「属性存取表达式」 (```Object.someFunc()``` 或 ```Object[someFunc]()```) 调用它时，
this很自然得指向了**该方法所属的对象**。

#### 3. The Constructor Invoation Pattern 
> 构造函数调用模式，这里略过不提

#### 4. The Apply, Call and Bind Invoation Pattern
> 使用神奇的```apply()```, ```call()```, ```bind()```， 可以改变函数this的值。

其中，```apply()```和```call()```都是**「直接以传入的this调用函数」**，
而ECMA-5引入的 ```bind()```并不调用函数，只是**「返回一个绑定好this的函数」**

## Understanding  "This"

总结完this的行为，让我们再来看看怎么理解它。（By Hux）

#### This 的来源

> #### *this (computer programming)*
> ---
> **this**, **self**, and **Me** are keywords used in some computer programming languages to refer to the object, class, or other entity that the currently-running code is part of.

> *来自 Wikipedia*

**this**被用于指向「对象」，「类」或其他「包含了正在执行的代码」的实体。
可以说，**「this是随着OOP一起诞生的概念」**

> In many *object-oriented programming* languages, **this** (also called self or Me) is a keyword that is used in **instance methods** to refer to the object on which they are working.   
> *来自 Wikipedia *

可以看到，在OOP中，this用于在「实例方法」中指向其工作的「对象」
OK，再次确定，**「this是一个purely『面向对象』的概念」**，
在 *C* 这种「**非**为面向对象设计」的语言（不代表C不能OOP）中，是**没有this这个关键字**的。 
#### 回到 JavaScript

仍然是历史问题：*JavaScript* 的设计者*Brendan Eich*是一个*C，Lisp* 爱好者。可是网景（Netscape）却希望这门语言必须与当时最热门的*Java* 语言 *「足够相似」*。

> 总的来说，他的设计思路是这样的：
> 1. 借鉴C语言的基本语法；
2. 借鉴Java语言的数据类型和内存管理；
3. 借鉴Scheme*(Lisp的一种实现)*语言，将函数提升到"第一等公民"（first class）的地位；
4. 借鉴Self语言，使用基于原型（prototype）的继承机制。

所以，Javascript语言实际上是**两种语言风格的混合产物----（简化的）函数式编程+（简化的）面向对象编程**。这是由Brendan Eich（函数式编程）与网景公司（面向对象编程）共同决定的。


> **「函数作为值（可以分配给变量、作为参数传递、作为返回值）」，「匿名函数」，「闭包」**，这些都是 *函数式编程*  的思想
> 
> ---
> 函数式和面向对象的本质都是“道法自然”。如果说，面向对象是一种真实世界的模拟的话，那么函数式就是**数学世界的模拟**，从某种意义上说，它的抽象程度比面向对象更高，因为数学系统本来就具有自然界所无法比拟的抽象性

#### 我的理解

与*Java/C#* 等主流OOP语言**「只能在类中声明函数（方法）」**不同，
*JavaScript* 的函数十分freedom，**即可以在全局Scope下声明，也可以作为对象的方法声明，甚至可以在函数中嵌套声明（Hosted Function）**

这里暂且不讨论「面向过程」与「函数式编程」的异同。但很明显，「在类之外的地方声明函数」绝对不是主流OOP的做法，或者说：
$$在类之外的地方声明的函数 不是 「方法」。$$

所以，我们姑且可以把 JavaScript 的 Function 分为两类：
1. ##### Method 方法
    就像所有主流OOP一样，它们的```this```指向**「该方法所属的对象」**
2. ##### Function 函数 / Lambda 
    这里的 function，就像C语言中的函数一样，只是**「单纯的数学意义上的函数」**。
它在Lisp中叫做「Lambda」，在C#中称为「Lambda表达式」，用以实现一些函数式编程。
  $$ 而这类函数本该「没有this」。$$ 

这样就很好理解：
> 为什么 *ECMAScript第五版* 规定 **「这类函数的```this``` 返回 ```null```」**了。
>
>*（禁止 this 指向 window, 无论是在全局下声明的函数，还是嵌套（匿名）函数 ）*

那么，为什么在 *ECMAScript第三版* 及之前的设计中，规定这类函数的```this```都返回```global```呢？

> Web是一个常常考虑**「向前兼容」**(*Forward Compability*, 也作向上，向未来兼容) 的环境，所以**「容错率」**一直是JavaScript设计初期很在意的东西。

就像忘记用```var```声明的变量会自动被**“容错声明”**成全局变量一样，
**「在JS底层实现中，这类函数的```this```实际上是从```null``` 被“容错转型”成```global/window```)的。」**

> 以至于在 *ECMA-V3* 时代，有这么一个奇闻：**「this永远不会为假值（falsy）」**：
> 如果你尝试给```this```赋值```null```或```undefined```，比如这样：*(this当然不能被显式赋值 )*
```javascript
var f = function () {
  return this;
};
f.call (null);    //真的会返回null么？
```
> 它事实上会指向全局，在浏览器环境中也就是window.

  
另外，在JS的底层实现中：**「全局Scope下定义的函数会被挂在window对象上」**。
那么，让*Hosted Anonymous function* 也「看上去」挂在window上，也的确是「还算合理」的设计了

---
基础篇完结，接下来两篇，将会从 Spec, Low-level 的角度来解释 this的行为

## Activation Object (ECMA-262-3)

## Lexical Environment (ECMA-262-5)

---
如果我还写得到这里的话，接下来两篇，将对比C#和Swift中的 function 与 this 的设计。

## C# Lambda

## Swift Func

--- 
如果我这么屌，这篇将总结一下在JavaScript中使用 this 与 function 的一些最佳实践
## Summary