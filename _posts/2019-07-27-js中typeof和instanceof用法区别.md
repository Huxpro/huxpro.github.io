# typeof和instanceof的区别

JavaScript 中 typeof 和 instanceof 常用来判断一个变量是否为空，或者是什么类型的。但它们之间还是有区别的：

## 一.JavaScript的数据类型

JavaScript 变量能够保存多种*数据类型*，包括number、string、boolean、undefined、object、function。



## 二.typeof和instanceof

### 1.typeof

typeof 是一个一元运算，放在一个运算数之前，运算数可以是原始数据类型，也可以是引用复杂类型。

它返回值是一个用来表示表达式的数据类型的字符串。

```
typeof 的格式
typeof   expression ;
expression 参数是需要查找类型信息的任意表达式。
```

 typeof一般测试基本类型（Undefined、Boolean、null、Number、String)，对引用类型返回object（Function引用类型返回Function）

```javascript
	//原始数据类型(string,number,boolean,undefined)
	//原始数据值是一种没有额外属性和方法的单一简单数据值。
	var a="abc";
	var b=10;
	var c=true;
	var d;
	var e=null;
	alert("a 	"+typeof a);//string
	alert("b 	"+typeof b);//number
	alert("c 	"+typeof c);//boolean
	alert("d 	"+typeof d);//undefined
	alert("e 	"+typeof e);//object

	//复杂类型（object，function）
	var obj1=new Array();
	var obj2=new Date(); 
 	var obj3=new Number();
	var obj4=new String(); 
	var obj5=new Function();
	var obj6=new Boolean();
	alert("obj1  "+typeof(obj1));//object
	alert("obj2  "+typeof(obj2));//object
	alert("obj3  "+typeof(obj3));//object
	alert("obj4  "+typeof(obj4));//object
	alert("obj5  "+typeof(obj5));//function
	alert("obj6  "+typeof(obj6));//object
```

### 2.instanceof

因为typeof遇到null,数组,对象时都会返回object类型，所以当我们要判断一个对象具体是否为一个数组时或者判断某个变量是否为某个对象的实例则要选择使用另一个语法instanceof，instanceof返回的是一个布尔值。

```
instanceof的格式
expression instanceof class
expression  必选项。任意对象表达式。
class　　必选项。任意已定义的对象类。
```

instanceof 运算符与 typeof 运算符相似，用于识别正在处理的对象的类型。与 typeof 方法不同的是，instanceof 方法要求开发者明确地确认对象为某特定类型。

```javascript
var a = {};
alert(a instanceof Object);  //true
var b = [];
alert(b instanceof Array);  //true
```

需要注意的是，instanceof只能用来判断对象和函数，不能用来判断字符串和数字等，如：

```javascript
var b = '123';
alert(b instanceof String);  //false
alert(typeof b);  //string
var c = new String("123");
alert(c instanceof String);  //true
alert(typeof c);  //object
```

另外，用instanceof可以判断变量是否为数组：

```javascript
var arr = [1,2,3]; 
alert(arr instanceof Array);   // true
```