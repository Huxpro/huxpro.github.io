# JavaScript 流程控制

## JavaScript if...Else 语句

- **if 语句** - 只有当指定条件为 true 时，使用该语句来执行代码
- **if...else 语句** - 当条件为 true 时执行代码，当条件为 false 时执行其他代码
- **if...else if....else 语句**- 使用该语句来选择多个代码块之一来执行

## JavaScript switch 语句

#### 语法

```js
switch(n)
{
    case 1:
        执行代码块 1
        break;
    case 2:
        执行代码块 2
        break;
    default:
        与 case 1 和 case 2 不同时执行的代码
}
```

#### default 关键词

> 使用 default 关键词来规定匹配不存在时做的事情

## JavaScript for 循环

#### For 循环

语法：

```js
for (*语句 1*; *语句 2*; *语句 3*)
{
    *被执行的代码块*
}
```

- **语句 1** （代码块）开始前执行
- **语句 2** 定义运行循环（代码块）的条件
- **语句 3** 在循环（代码块）已被执行之后执行

#### For/In 循环

JavaScript for/in 语句循环遍历对象的属性：

```js
var person={fname:"John",lname:"Doe",age:25}; 
for (x in person)  // x 为属性名
{
    txt=txt + person[x];
}
```

## JavaScript while 循环

#### while 循环

> while 循环会在指定条件为真时循环执行代码块。

语法

```js
while (条件)
{
    *需要执行的代码
}
```

## do/while 循环

> do/while 循环是 while 循环的变体。该循环会在检查条件是否为真之前执行一次代码块，然后如果条件为真的话，就会重复这个循环。

```js
do
{
    *需要执行的代码*
}
while (*条件*);
```

## JavaScript Break 和 Continue 语句

- break 语句用于跳出循环。
- continue 用于跳过循环中的一个迭代。
- continue 语句（带有或不带标签引用）只能用在循环中。
- break 语句（不带标签引用），只能用在循环或 switch 中。