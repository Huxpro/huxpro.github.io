---
layout:       post
title:        "Typescript Hands-on"
author:       "Jake"
header-style: text
catalog:      true
tags:
    - Tech
    - Typescript
    - Fundamental
    - Hands-on
---

# Typescript 立马上手

## 前言
TS 不能直接在浏览器或者 node 中运行，除非使用 Deno ，因为它是同时支持 TS 和 JS 的运行时。

> 大多数情况下，如果要执行 TS 代码，必须先转成 JS 代码，这里就需要赫赫有名的转义器 TSC  

---
目前 TSC 已经被废弃了（depreciated），必须要下载 typescript。但是用 npm 命令 `npm i -g typescript` 下载会发现进度条到一般不走，尝试了以下方法：
1. 修改镜像为淘宝镜像 `npm config set registry https://registry.npm.taobao.org --location=global`
2. 参考 GitHub 中的方法，即更新 node 和 npm 版本

【结果】均不起作用

【灵机一动】使用 cnpm 命令 `cnpm install -g typescript`，提示下载成功，可以正常使用 `tsc code.ts` 编译出 code.js 文件。 

---

***TS to JS***

code.ts 文件每次改动都要 tsc 编译一次，显然人工操作太过繁琐，怎么改进？这里可以在同个目录下新建一个 tsconfig.json 文件，文件拥有多种实用的选项，比如
1.  `"watch" : true` 会自动监测源文件的修改并编译代码
2. `"removeComments" : true` 会自动删除源文件的注释，减少 JS 文件的体积
3. `"target" : "ES6"` 指定编译的目标 JS 版本
> 针对 **1.** 仍然需要在改动代码后在键入 `tsc` 进行编译，就是不用指定文件了，对于包含多个文件的大型项目而言是一个提升效率的改进。

## 类型系统
JS 是动态类型语言，变量甚至函数类型都是动态决定的，函数中没有传递的参数也会被直接赋值成 undefined
### 常见类型
number、string、boolean、any（任意类型）
> Note：不指定变量类型的话，默认是 any，表示不进行类型检查

### 练习
0. 编写一个乘法函数，强制输入的参数类型与数量

```ts
function multiply(a: number, b:number) {
    return a * b;
}

multiply(1, 2);  // 2

multiply(1);     // Expected 2 arguments, but got 1.ts(2554)
```

1. 进一步，如果参数 b 可有可无呢，那么就需要把参数 b 设置成**可选参数(Optional Parameter)**

```ts
function multiply(a: number, b?: number) {
    return a * b;
}

multiply(1, 2);  // 2

multiply(1);     // 1
```

2. 类型标注也可以用在返回值上

```ts
// return number
function multiply(a: number, b?: number): number {
    return a * b;
}

// no return
function sayHi(): void {
    alert("嗨！");
}
```

### 类型推导（Type Inference）
Trick 1. 对于带初值的普通变量，我们不需要指定类型
```ts
// reduncdant type annotation 
let i: number = 1;
let str: string = "你好";

// presice style
let i = 1;
let str = "你好";
```

Trick 2. 对于确定返回值类型的函数，其签名可以不加返回值类型标注

```ts
// returning number type is already decided, so we can neglect it 
function multiply(a: number, b?: number) {
    return a * b;
}
```

### 数组
1. 新建数组（1D）
```ts
let arr: number[];
arr = [1, 2, 3];
```

2. 新建二维数组
```ts
let arrOfArray: number[][];
arrOfArray = [
    [1, 2, 3],
    [4, 5, 6]
];
```

3. 访问元素

4. 遍历元素

### 元组（Tuple）
与数组相似，只不过元中的个数和类型是确定的！
```ts
// point can represent 3D and 2D coordinary
let point: [number, number, number?];  // third element is arbitary

point = [1, 2, 3];

point = [1, 2];
```

### 联合类型（Union Type）
如过我们希望某个变量可以是多种类型中的任意一种，就需要用**联合类型**
```ts
let color: number | string;
color = "red";     // string
color = 0xff0000;  // hex

color = true;      // Illegal: Type 'boolean' is not assignable
```

进一步，限制变量取值只能是列举的字面量，该技巧（technique）类似于 Java 中的枚举类型
```ts
let gender: "male" | "female";
let dice: 1 | 2 | 3 | 4 | 5 | 6;
```

## 接口（Interface）
限制对象的类型，可以用 interface 来定义一个接口，接口中定义了属性极其类型。
> 对象必须严格遵守接口定义，如果接口对象缺少了属性或者多了属性，将会报错。 

```ts
interface User {
    name: string;
    id: number;
}

// interface do not involve age member, and object lacks of id member
const user: User = {
    name: "jake",
    age: 12
}

// right
const user: User = {
    name: "jake",
    id: 123
}
```

## 函数类型（Function Type）
在 TS 中，我们同样可以指定一个函数的签名，也就是说可以限定函数必须具有特定的参数和返回值。
> 对于回调函数（call-back）极其好用  

```ts
function getUserName(callback: (data: string) => void) {
    // ...
}

getUserName((data) => {
    alert(data)
});

getUserName((data) => {
    alert(data * 2)
});                    // data is string type, can not use arthmatic operator            
```

## 类型别名（Type Alias）
给类型起别名，避免代码重复
```ts
type UserID = number | string;

function getUserID(userID: UserID) {
    // ...
}
```

## 加餐：开发小技巧
### noImplicitAny
在 tsconfig 中配置一个额外的选项：noImplicitAny，让编译器更加严格地审核代码。
> 可以提醒我们写出 not any api  
```ts
let s: string;
s = null;       // Type 'null' is not assignable to type
s = undefined;  // Type 'undefined' is not 
```

### strictNullChecks
默认情况下，编译器是孕允许给任意类型的变量赋予空值 null 或者 undefined，开启这个选项后，如果不明确该变量可谓空，则会报错。
> 可以提醒我们写出 no null api  
```ts
let s: string;
s = null;       // Type 'null' is not assignable to type
s = undefined;  // Type 'undefined' is not assignable to type
```
除非你明确类型可以为空
```ts
let s: string | null | undefined;
s = "你好兄弟";
s = null;       // Type 'null' is not assignable to type
s = undefined;  // Type 'undefined' is not assignable to type
```
### 第三方库非TS开发
例如 npm 下载 three 时，`npm install three --save`，但我们又想用到 TS 提供的更加完善的类型支持，那么采用由社区维护的类型定义包 **`DefinitelyTyped`**

只需要把下载命令修改成如下
`npm install --save-dev @types/{package_name}`

提问：cnpm 也能直接使用吗？
`cnpm install --save-dev @types/three`

答案：没问题！

### 总结
在 TS 中 `?` 问号是由特殊作用的，表示**可有可无**
1. [在参数表中的输入变量后附上，表示该变量为可选参数（Optional Parameter），可有可无](#练习)
2. [在元组的类型标准中的最后一个类型后附上，表示该元素是可选的，可有可无](#元组tuple)

### 高级特性（待补充）
* 装饰器
* 泛型

## 进阶资源
[重新介绍 JavaScript（JS 教程）](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Language_Overview)