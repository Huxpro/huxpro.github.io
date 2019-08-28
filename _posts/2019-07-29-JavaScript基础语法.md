# **JavaScript基础语法**

## **对代码行进行折行**

> 在文本字符串中使用反斜杠对代码行进行换行：

```js
document.write("你好 \
世界!");
```

## **JavaScript 注释**

- 单行注释

  ```js
  // 输出标题：
  document.getElementById("myH1").innerHTML="欢迎来到我的主页";
  // 输出段落：
  document.getElementById("myP").innerHTML="这是我的第一个段落。";
  ```

- 多行注释

  ```js
  /*
  下面的这些代码会输出
  一个标题和一个段落
  并将代表主页的开始
  */
  document.getElementById("myH1").innerHTML="欢迎来到我的主页";
  document.getElementById("myP").innerHTML="这是我的第一个段落。";
  ```

## **JavaScript 操作符**

|          类型          |          实例          |          描述          |
| :--------------------: | :--------------------: | :--------------------: |
|  赋值，算术和位运算符  | =  +  -  *  /  +=  /=  |   在 JS 运算符中描述   |
| 条件，比较及逻辑运算符 | ==  !=  <  >  \|\|  && | 在 JS 比较运算符中描述 |

## **JavaScript 关键字**

> JavaScript 关键字用于标识要执行的操作。
> 和其他任何编程语言一样，JavaScript 保留了一些关键字为自己所用。

| abstract |    else    | instanceof |    super     |
| :------: | :--------: | :--------: | :----------: |
|          |            |            |              |
| boolean  |    enum    |    int     |    switch    |
|          |            |            |              |
|  break   |   export   | interface  | synchronized |
|          |            |            |              |
|   byte   |  extends   |    let     |     this     |
|          |            |            |              |
|   case   |   false    |    long    |    throw     |
|          |            |            |              |
|  catch   |   final    |   native   |    throws    |
|          |            |            |              |
|   char   |  finally   |    new     |  transient   |
|          |            |            |              |
|  class   |   float    |    null    |     true     |
|          |            |            |              |
|  const   |    for     |  package   |     try      |
|          |            |            |              |
| continue |  function  |  private   |    typeof    |
|          |            |            |              |
| debugger |    goto    | protected  |     var      |
|          |            |            |              |
| default  |     if     |   public   |     void     |
|          |            |            |              |
|  delete  | implements |   return   |   volatile   |
|          |            |            |              |
|    do    |   import   |   short    |    while     |
|          |            |            |              |
|  double  |     in     |   static   |     with     |
|          |            |            |              |

## **JavaScript 变量**

- 使用 var 关键词来声明变量：`var carname;`    `var carname="Volvo";`

- 一条语句，多个变量:`var lastname="Doe", age=30, job="carpenter";`
- 变量名
  - 变量必须以字母开头
  - 变量也能以 $ 和 _ 符号开头（不过我们不推荐这么做）
  - 变量名称对大小写敏感（y 和 Y 是不同的变量）

## JavaScript 数据类型

- **值类型(基本类型)**：字符串（String）、数字(Number)、布尔(Boolean)、对空（Null）、未定义（Undefined）、Symbol。

- **引用数据类型**：对象(Object)、数组(Array)、函数(Function)。

#### JavaScript 字符串

> 字符串是存储字符的变量。

字符串可以是引号中的任意文本。可以使用单引号或双引号：

```js
var carname="Volvo XC60";
var carname='Volvo XC60';
```

#### JavaScript 数字

- JavaScript 只有一种数字类型。数字可以带小数点，也可以不带：


```js
var x1=34.00;      //使用小数点来写
var x2=34;         //不使用小数点来写
```

- 极大或极小的数字可以通过科学（指数）计数法来书写：


```js
var y=123e5;      // 12300000
var z=123e-5;     // 0.00123
```

#### JavaScript 布尔

布尔（逻辑）只能有两个值：true 或 false。

```js
var x=true;
var y=false;
```

#### JavaScript 数组

下面的代码创建名为 cars 的数组：

```js
var cars=new Array();
cars[0]="Saab";
cars[1]="Volvo";
cars[2]="BMW";
```

或者 (condensed array):

`var cars=new Array("Saab","Volvo","BMW");`

或者 (literal array):

`var cars=["Saab","Volvo","BMW"];`

#### JavaScript 对象

对象由花括号分隔。在括号内部，对象的属性以名称和值对的形式 (name : value) 来定义。属性由逗号分隔：

```js
var person={firstname:"John", lastname:"Doe", id:5566};
```

上面例子中的对象 (person) 有三个属性：firstname、lastname 以及 id。

空格和折行无关紧要。声明可横跨多行：

```js
var person={
        firstname : "John",
        lastname  : "Doe",
        id        :  5566
};
```

对象属性有两种寻址方式：

```js
name=person.lastname;
name=person["lastname"];
```

#### Undefined 和 Null

Undefined 这个值表示变量不含有值。

可以通过将变量的值设置为 null 来清空变量。

```js
cars=null;
person=null;
```

#### JavaScript 函数

```js
function functionname(var1,var2)
{
    // 执行代码
}
```

## JavaScript变量

#### JavaScript 作用域

- 作用域是可访问变量的集合。
- 在 JavaScript 中, 对象和函数同样也是变量。
- **在 JavaScript 中, 作用域为可访问变量，对象，函数的集合。**
- JavaScript 函数作用域: 作用域在函数内修改。

#### JavaScript 变量的生存期

- JavaScript 变量的生命期从它们被声明的时间开始。
- 局部变量会在函数运行以后被删除。
- 全局变量会在页面关闭后被删除。

#### 向未声明的 JavaScript 变量分配值

> 如果把值赋给尚未声明的变量，该变量将被自动作为 window 的一个属性。
> 这条语句：`carname="Volvo";`将声明 window 的一个属性 carname。

非严格模式下给未声明变量赋值创建的全局变量，是全局对象的可配置属性，可以删除。

```js
var var1 = 1; // 不可配置全局属性
var2 = 2; // 没有使用 var 声明，可配置全局属性

console.log(this.var1); // 1
console.log(window.var1); // 1

delete var1; // false 无法删除
console.log(var1); //1

delete var2; 
console.log(delete var2); // true
console.log(var2); // 已经删除 报错变量未定义
```

