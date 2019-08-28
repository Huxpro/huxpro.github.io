# JavaScript基础

## **JavaScript 是脚本语言**

- JavaScript 是一种轻量级的编程语言。
- JavaScript 是可插入 HTML 页面的编程代码。
- JavaScript 插入 HTML 页面后，可由所有的现代浏览器执行。

## **JavaScript 引入**

- 外链式：`<script src="myScript.js"></script>
- 内嵌式：<button type="button" onclick="myFunction()">尝试一下</button>

- 内联式：

  <script>
  alert("我的第一个 JavaScript");
  </script>

## **JavaScript 字面量**

在编程语言中，一般固定值称为字面量，如 3.14。

- **数字（Number）字面量** 可以是整数或者是小数，或者是科学计数(e)。
- **字符串（String）字面量** 可以使用单引号或双引号："John Doe"	'John Doe'
- **表达式字面量** 用于计算：5 + 6    5 * 10

- **数组（Array）字面量** 定义一个数组：[40, 100, 1, 5, 25, 10]

- **对象（Object）字面量** 定义一个对象：`{firstName:"John", lastName:"Doe", age:50, eyeColor:"blue"}`

- **函数（Function）字面量** 定义一个函数：`function myFunction(a, b) { return a * b;}`

## **JavaScript 变量**

在编程语言中，变量用于存储数据值。

JavaScript 使用关键字 **var** 来定义变量， 使用等号来为变量赋值：

```js
var x, length
x = 5
length = 6
```