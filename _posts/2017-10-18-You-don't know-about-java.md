---
layout:     post
title:      "You don't know abot java"
subtitle:   " \"Java你可能不知道的10件事\""
date:       2017-10-18 3:10:00
author:     "WQ"
header-img: "img/blogImg/2017-10-18.jpg"
catalog: true
tags:
    - Java
---

原文链接： [10 Things You Didn’t Know About Java](http://blog.jooq.org/2014/11/03/10-things-you-didnt-know-about-java/)  
译文发在[ImportNew](http://www.importnew.com/)： <http://www.importnew.com/13859.html>，2014-12-21

关于`Java`你可能不知道的10件事
===============================================

<img src="java-mystery.jpg" width="400" hspace="10px" align="right" >

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [1. 其实没有受检异常（`checked exception`）](#1-%E5%85%B6%E5%AE%9E%E6%B2%A1%E6%9C%89%E5%8F%97%E6%A3%80%E5%BC%82%E5%B8%B8%EF%BC%88checked-exception%EF%BC%89)
- [2. 可以有只是返回类型不同的重载方法](#2-%E5%8F%AF%E4%BB%A5%E6%9C%89%E5%8F%AA%E6%98%AF%E8%BF%94%E5%9B%9E%E7%B1%BB%E5%9E%8B%E4%B8%8D%E5%90%8C%E7%9A%84%E9%87%8D%E8%BD%BD%E6%96%B9%E6%B3%95)
- [3. 所有这些写法都是二维数组！](#3-%E6%89%80%E6%9C%89%E8%BF%99%E4%BA%9B%E5%86%99%E6%B3%95%E9%83%BD%E6%98%AF%E4%BA%8C%E7%BB%B4%E6%95%B0%E7%BB%84%EF%BC%81)
- [4. 你没有掌握条件表达式](#4-%E4%BD%A0%E6%B2%A1%E6%9C%89%E6%8E%8C%E6%8F%A1%E6%9D%A1%E4%BB%B6%E8%A1%A8%E8%BE%BE%E5%BC%8F)
- [5. 你没有掌握复合赋值运算符](#5-%E4%BD%A0%E6%B2%A1%E6%9C%89%E6%8E%8C%E6%8F%A1%E5%A4%8D%E5%90%88%E8%B5%8B%E5%80%BC%E8%BF%90%E7%AE%97%E7%AC%A6)
- [6. 随机`Integer`](#6-%E9%9A%8F%E6%9C%BAinteger)
- [7. `GOTO`](#7-goto)
- [8. `Java`是有类型别名的](#8-java%E6%98%AF%E6%9C%89%E7%B1%BB%E5%9E%8B%E5%88%AB%E5%90%8D%E7%9A%84)
- [9. 有些类型的关系是不确定的](#9-%E6%9C%89%E4%BA%9B%E7%B1%BB%E5%9E%8B%E7%9A%84%E5%85%B3%E7%B3%BB%E6%98%AF%E4%B8%8D%E7%A1%AE%E5%AE%9A%E7%9A%84)
- [10. 类型交集（`Type intersections`）](#10-%E7%B1%BB%E5%9E%8B%E4%BA%A4%E9%9B%86%EF%BC%88type-intersections%EF%BC%89)
- [结论](#%E7%BB%93%E8%AE%BA)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

呃，你是不是写`Java`已经有些年头了？还依稀记得这些吧：
那些年，它还叫做`Oak`；那些年，`OO`还是个热门话题；那些年，`C++`同学们觉得`Java`是没有出路的；那些年，`Applet`还风头正劲……

但我打赌下面的这些事中至少有一半你还不知道。这周我们来聊聊这些会让你有些惊讶的`Java`内部的那些事儿吧。

## 1. 其实没有受检异常（`checked exception`）

是的！`JVM`才不知道这事儿，只有`Java`语言才会知道。

今天，大家都赞同受检异常是个设计失误，一个`Java`语言中的设计失误。正如 *Bruce Eckel* [在布拉格的`GeeCON`会议上演示的总结](http://www.geecon.cz/speakers/?id=2)中说的，
`Java`之后的其它语言都没有再涉及受检异常了，甚至`Java` 8的新式流`API`（`Streams API`）都不再拥抱受检异常
（[以`lambda`的方式使用`IO`和`JDBC`，这个`API`用起来还是有些痛苦的](http://blog.jooq.org/2014/05/23/java-8-friday-better-exceptions/)。）

想证明`JVM`不理会受检异常？试试下面的这段代码：

```java
public class Test {

    // 方法没有声明throws
    public static void main(String[] args) {
        doThrow(new SQLException());
    }
  
    static void doThrow(Exception e) {
        Test.<RuntimeException> doThrow0(e);
    }
  
    @SuppressWarnings("unchecked")
    static <E extends Exception>
    void doThrow0(Exception e) throws E {
        throw (E) e;
    }
}
```

不仅可以编译通过，并且也抛出了`SQLException`，你甚至都不需要用上`Lombok`的[`@SneakyThrows`](http://projectlombok.org/features/SneakyThrows.html)。

更多细节，可以再看看[这篇文章](http://blog.jooq.org/2012/09/14/throw-checked-exceptions-like-runtime-exceptions-in-java/)，或`Stack Overflow`上的[这个问题](http://stackoverflow.com/q/12580598/521799)。

## 2. 可以有只是返回类型不同的重载方法

下面的代码不能编译，是吧？

```java
class Test {
    Object x() { return "abc"; }
    String x() { return "123"; }
}
```

是的！`Java`语言不允许一个类里有2个方法是『**_重载一致_**』的，而不会关心这2个方法的`throws`子句或返回类型实际上是不同的。

但是等一下！来看看[`Class.getMethod(String, Class...)`](http://docs.oracle.com/javase/8/docs/api/java/lang/Class.html#getMethod-java.lang.String-java.lang.Class...-)方法的`Javadoc`：

> 注意，可能在一个类中会有多个匹配的方法，因为尽管`Java`语言禁止在一个类中多个方法签名相同只是返回类型不同，但是`JVM`并不禁止。
这让`JVM`可以更灵活地去实现各种语言特性。比如，可以用桥方法（`bridge method`）来实现方法的协变返回类型；桥方法和被重载的方法可以有相同的方法签名，但返回类型不同。

嗯，这个说的通。实际上，当写了下面的代码时，就发生了这样的情况：

```java
abstract class Parent<T> {
    abstract T x();
}
 
class Child extends Parent<String> {
    @Override
    String x() { return "abc"; }
}
```

查看一下`Child`类所生成的字节码：

```java
// Method descriptor #15 ()Ljava/lang/String;
// Stack: 1, Locals: 1
java.lang.String x();
  0  ldc <String "abc"> [16]
  2  areturn
    Line numbers:
      [pc: 0, line: 7]
    Local variable table:
      [pc: 0, pc: 3] local: this index: 0 type: Child
 
// Method descriptor #18 ()Ljava/lang/Object;
// Stack: 1, Locals: 1
bridge synthetic java.lang.Object x();
  0  aload_0 [this]
  1  invokevirtual Child.x() : java.lang.String [19]
  4  areturn
    Line numbers:
      [pc: 0, line: 1]
```

在字节码中，`T`实际上就是`Object`类型。这很好理解。

合成的桥方法实际上是由编译器生成的，因为在一些调用场景下，`Parent.x()`方法签名的返回类型期望是`Object`。
添加泛型而不生成这个桥方法，不可能做到二进制兼容。
所以，让`JVM`允许这个特性，可以愉快解决这个问题（实际上可以允许协变重载的方法包含有副作用的逻辑）。
聪明不？呵呵～

你是不是想要扎入语言规范和内核看看？可以在[这里](http://stackoverflow.com/q/442026/521799)找到更多有意思的细节。

## 3. 所有这些写法都是二维数组！

```java
class Test {
    int[][] a()  { return new int[0][]; }
    int[] b() [] { return new int[0][]; }
    int c() [][] { return new int[0][]; }
}
```

是的，这是真的。尽管你的人肉解析器不能马上理解上面这些方法的返回类型，但都是一样的！下面的代码也类似：

```java
class Test {
    int[][] a = {{}};
    int[] b[] = {{}};
    int c[][] = {{}};
}
```

是不是觉得这个很2B？想象一下在上面的代码中使用[`JSR-308`/`Java` 8的类型注解](https://jcp.org/en/jsr/detail?id=308)。
语法糖的数目要爆炸了吧！

```java
@Target(ElementType.TYPE_USE)
@interface Crazy {}

class Test {
    @Crazy int[][]  a1 = {{}};
    int @Crazy [][] a2 = {{}};
    int[] @Crazy [] a3 = {{}};
 
    @Crazy int[] b1[]  = {{}};
    int @Crazy [] b2[] = {{}};
    int[] b3 @Crazy [] = {{}};
 
    @Crazy int c1[][]  = {{}};
    int c2 @Crazy [][] = {{}};
    int c3[] @Crazy [] = {{}};
}
```

> 类型注解。这个设计带来的诡异程度仅次于它带来的解决问题的能力。

或换句话说：

> 在我4周休假前的最后一个提交里，我写了这样的代码，然后。。。  
![for-you-my-dear-coworkers](img/blogImg/for-you-my-dear-coworkers.jpg)  
【**_译注_**：然后，亲爱的同事你，就有得火救啦，哼，哼哼，哦哈哈哈哈～】

请找出上面用法的合适的使用场景，这个还是留给你作为一个练习吧。

## 4. 你没有掌握条件表达式

呃，你认为自己知道什么时候该使用条件表达式？面对现实吧，你还不知道。大部分人会认为下面的2段代码是等价的：

```java
Object o1 = true ? new Integer(1) : new Double(2.0);
```

等同于：

```java
Object o2;
 
if (true)
    o2 = new Integer(1);
else
    o2 = new Double(2.0);
```

让你失望了。来做个简单的测试吧：

```java
System.out.println(o1);
System.out.println(o2);
```

打印结果是：

```java
1.0
1
```

哦！如果『需要』，条件运算符会做数值类型的类型提升，这个『需要』有非常非常非常强的引号。因为……
你觉得下面的程序会抛出`NullPointerException`吗？

```java
Integer i = new Integer(1);
if (i.equals(1))
    i = null;
Double d = new Double(2.0);
Object o = true ? i : d; // NullPointerException!
System.out.println(o);
```

关于这一条的更多的信息可以在[这里](http://blog.jooq.org/2013/10/08/java-auto-unboxing-gotcha-beware/)找到。

## 5. 你没有掌握复合赋值运算符

是不是觉得不服？来看看下面的2行代码：

```java
i += j;
i = i + j;
```

直觉上认为，2行代码是等价的，对吧？但结果不是！`JLS`（`Java`语言规范）指出：

> 复合赋值运算符表达式 `E1 op= E2` 等价于 `E1 = (T)((E1) op (E2))`
> 其中`T`是`E1`的类型，但`E1`只会被求值一次。

这个做法太漂亮了，请允许我引用[*Peter Lawrey*](https://twitter.com/PeterLawrey)在`Stack Overflow`上的[回答](http://stackoverflow.com/a/8710747/521799)：

使用`*=`或`/=`作为例子可以方便说明其中的转型问题：

```java
byte b = 10;
b *= 5.7;
System.out.println(b); // prints 57

byte b = 100;
b /= 2.5;
System.out.println(b); // prints 40

char ch = '0';
ch *= 1.1;
System.out.println(ch); // prints '4'

char ch = 'A';
ch *= 1.5;
System.out.println(ch); // prints 'a'
```

为什么这个真是太有用了？如果我要在代码中，就地对字符做转型和乘法。然后，你懂的……

## 6. 随机`Integer`

这条其实是一个迷题，先不要看解答。看看你能不能自己找出解法。

运行下面的代码：

```java
for (int i = 0; i < 10; i++) {
  System.out.println((Integer) i);
}
```

…… 然后要得到类似下面的输出（每次输出是随机结果）：

```java
92
221
45
48
236
183
39
193
33
84
```

这怎么可能？！

. 

. 

. 

. 

. 

. 

. 我要剧透了…… 解答走起……

. 

. 

. 

. 

. 

. 

好吧，解答在这里(<http://blog.jooq.org/2013/10/17/add-some-entropy-to-your-jvm/>)，
和用反射覆盖`JDK`的`Integer`缓存，然后使用自动打包解包（`auto-boxing`/`auto-unboxing`）有关。
同学们请勿模仿！或换句话说，想想会有这样的状况，再说一次：

> 在我4周休假前的最后一个提交里，我写了这样的代码，然后。。。  
![for-you-my-dear-coworkers](img/blogImg/for-you-my-dear-coworkers.jpg)  
【**_译注_**：然后，亲爱的同事你，就有得火救啦，哼，哼哼，哦哈哈哈哈～】

## 7. `GOTO`

这条是我的最爱。`Java`是有`GOTO`的！打上这行代码：

```java
int goto = 1;
```

结果是：

```java
Test.java:44: error: <identifier> expected
    int goto = 1;
        ^
```

这是因为`goto`是个[还未使用的关键字](http://docs.oracle.com/javase/tutorial/java/nutsandbolts/_keywords.html)，保留了为以后可以用……

但这不是我要说的让你兴奋的内容。让你兴奋的是，你是可以用`break`、`continue`和有标签的代码块来实现`goto`的：

向前跳：

```java
label: {
  // do stuff
  if (check) break label;
  // do more stuff
}
```

对应的字节码是：

```java
2  iload_1 [check]
3  ifeq 6          // 向前跳
6  ..
```

向后跳：

```java
label: do {
  // do stuff
  if (check) continue label;
  // do more stuff
  break label;
} while(true);
```

对应的字节码是：

```java
2  iload_1 [check]
3  ifeq 9
6  goto 2          // 向后跳
9  ..
```

## 8. `Java`是有类型别名的

在别的语言中（比如，[`Ceylon`](http://blog.jooq.org/2013/12/03/top-10-ceylon-language-features-i-wish-we-had-in-java/)），
可以方便地定义类型别名：

```java
interface People => Set<Person>;
```

这样定义的`People`可以和`Set<Person>`互换地使用：

```java
People?      p1 = null;
Set<Person>? p2 = p1;
People?      p3 = p2;
```

在`Java`中不能在顶级（`top level`）定义类型别名。但可以在类级别、或方法级别定义。
如果对`Integer`、`Long`这样名字不满意，想更短的名字：`I`和`L`。很简单：

```java
class Test<I extends Integer> {
    <L extends Long> void x(I i, L l) {
        System.out.println(
            i.intValue() + ", " + 
            l.longValue()
        );
    }
}
```

上面的代码中，在`Test`类级别中`I`是`Integer`的『别名』，在`x`方法级别，`L`是`Long`的『别名』。可以这样来调用这个方法：

```java
new Test().x(1, 2L);
```

当然这个用法不严谨。在例子中，`Integer`、`Long`都是`final`类型，结果`I`和`L` *效果上*是个别名
（大部分情况下是。赋值兼容性只是单向的）。如果用非`final`类型（比如，`Object`），还是要使用原来的泛型参数类型。

玩够了这些恶心的小把戏。现在要上干货了！

## 9. 有些类型的关系是不确定的

好，这条会很稀奇古怪，你先来杯咖啡，再集中精神来看。看看下面的2个类型：

```java
// 一个辅助类。也可以直接使用List
interface Type<T> {}
 
class C implements Type<Type<? super C>> {}
class D<P> implements Type<Type<? super D<D<P>>>> {}
```

类型`C`和`D`是啥意思呢？

这2个类型声明中包含了递归，和[`java.lang.Enum`](http://docs.oracle.com/javase/8/docs/api/java/lang/Enum.html)的声明类似
（但有微妙的不同）：

```java
public abstract class Enum<E extends Enum<E>> { ... }
```

有了上面的类型声明，一个实际的`enum`实现只是语法糖：

```java
// 这样的声明
enum MyEnum {}
 
// 实际只是下面写法的语法糖：
class MyEnum extends Enum<MyEnum> { ... }
```

记住上面的这点后，回到我们的2个类型声明上。下面的代码可以编译通过吗？

```java
class Test {
    Type<? super C> c = new C();
    Type<? super D<Byte>> d = new D<Byte>();
}
```

一个很难的问题，[`Ross Tate `](http://www.cs.cornell.edu/~ross/)回答过。答案实际上是不确定的：

**_`C`是`Type<? super C>`的子类吗？_**

```java
步骤 0) C <?: Type<? super C>
步骤 1) Type<Type<? super C>> <?: Type （继承）
步骤 2) C （检查通配符 ? super C）
步骤 . . . （进入死循环）
```

然后：

**_`D`是`Type<? super D<Byte>>`的子类吗？_**

```java
步骤 0) D<Byte> <?: Type<? super C<Byte>>
步骤 1) Type<Type<? super D<D<Byte>>>> <?: Type<? super D<Byte>>
步骤 2) D<Byte> <?: Type<? super D<D<Byte>>>
步骤 3) List<List<? super C<C>>> <?: List<? super C<C>>
步骤 4) D<D<Byte>> <?: Type<? super D<D<Byte>>>
步骤 . . . （进入永远的展开中）
```

试着在你的`Eclipse`中编译上面的代码，会Crash！（别担心，我已经提交了一个Bug。）

我们继续深挖下去……

> 在`Java`中有些类型的关系是不确定的！

如果你有兴趣知道更多古怪`Java`行为的细节，可以读一下*Ross Tate*的论文[『驯服`Java`类型系统的通配符』](http://www.cs.cornell.edu/~ross/publications/tamewild/tamewild-tate-pldi11.pdf)
（由*Ross Tate*、*Alan Leung*和*Sorin Lerner*合著），或者也可以看看我们在[子类型多态和泛型多态的关联](http://blog.jooq.org/2013/06/28/the-dangers-of-correlating-subtype-polymorphism-with-generic-polymorphism/)方面的思索。

## 10. 类型交集（`Type intersections`）

`Java`有个很古怪的特性叫类型交集。你可以声明一个（泛型）类型，这个类型是2个类型的交集。比如：

```java
class Test<T extends Serializable & Cloneable> {
}
```

绑定到类`Test`的实例上的泛型类型参数`T`必须同时实现`Serializable`和`Cloneable`。比如，`String`不能做绑定，但`Date`可以：

```java
// 编译不通过！
Test<String> s = null;
 
// 编译通过
Test<Date> d = null;
```

`Java` 8保留了这个特性，你可以转型成临时的类型交集。这有什么用？
几乎没有一点用，但如果你想强转一个`lambda`表达式成这样的一个类型，就没有其它的方法了。
假定你在方法上有了这个蛋疼的类型限制：

```java
<T extends Runnable & Serializable> void execute(T t) {}
```

你想一个`Runnable`同时也是个`Serializable`，这样你可能在另外的地方执行它并通过网络发送它。`lambda`和序列化都有点古怪。

`lambda`是可以序列化的：

> 如果`lambda`表达式的目标类型和它捕获的参数（`captured arguments`）是可以序列化的，则这个`lambda`表达式是可序列化的。

但即使满足这个条件，`lambda`表达式并没有自动实现`Serializable`这个标记接口（`marker interface`）。
为了强制成为这个类型，就必须使用转型。但如果只转型成`Serializable` …

```java
execute((Serializable) (() -> {}));
```

… 则这个`lambda`表达式不再是一个`Runnable`。

呃……

So……

同时转型成2个类型：

```java
execute((Runnable & Serializable) (() -> {}));
```

## 结论

一般我只对`SQL`会说这样的话，但是时候用下面的话来结束这篇文章了：

> `Java`中包含的诡异之多仅次于它解决问题的能力之大。
