---
layout: default
title: Golang Assertion
parent: Golang
---

*2021-04-29*
# Golang Assertion
{: .no_toc }

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## 术语解释

- Assertion
 > noun: a confident and forceful statement of fact or belief.

- 断言
 > ①十分肯定地说：可以～，这种办法行不通。 ②断定的话；结论：作出这样的～未免过早。

无论是引文还是对应的中文翻译，都是表达对事物做出明确的结论。在编程语言中，_assertion_ 表示对表达式做出判断。

## Go中的断言

### 类型断言(Type Assertion)
类型断言是一个使用在接口值上的操作。语法上它看起来像x.(T)被称为断言类型，一个类型断言检查它操作对象的动态类型是否和断言的类型匹配。

在Go语言中类型断言的语法格式如下：
```go
t:= x.(T) //不匹配会导致panic
t, ok := x.(T) //不会panic，通过ok判断
```
其中，x 表示一个接口的类型，T 表示一个具体的类型（也可为接口类型）。

[官方解释](https://tour.golang.org/methods/15)
 >This statement asserts that the interface value x holds the concrete type T and assigns the underlying T value to the variable t.

 获取接口类型的原始类型以及数据，并赋值给t。

该断言表达式会返回 x 的值（也就是 value）和一个布尔值（也就是 ok），可根据该布尔值判断 x 是否为 T 类型：
- 如果 T 是具体某个类型，类型断言会检查 x 的动态类型是否等于具体类型 T。
    + 如果检查成功，类型断言返回的结果是 x 的动态值，其类型是 T。
    ```go
    var x interface{}
    value, ok := x.(int) // x是nil，不是int.value是int，值是0
    x = 10
    value, ok := x.(int) // value 的类型是int，值是10
    value, ok := x.(string) // value 的类型是string，值是""，因为x不是string，所以断言失败。    
    ```
- 如果 T 是接口类型，类型断言会检查 x 的动态类型是否满足 T。
    + 如果检查成功，返回值是一个类型为 T 的接口值。
    ```go
    var x interface{}
    value, ok := x.(interface{}) // x是nil,不是interface{}. value是nil，
    x = 10
    value, ok := x.(interface{}) // x是int，隐式实现了interface{}接口，因此断言成功。value是interface{}类型，值与x一样
    ```

- 无论 T 是什么类型，如果 x 是 nil 接口值，类型断言都会失败。
