---
layout: post
title: "js学习记录"
subtitle:   "几个教程一起看"
date: 2016-08-09
author: "Teng"
catalog: ture
header-img: "img/post-bg-blog.jpg"
tags:
- 编程
- 笔记
- Thinking
---



# JS进展记录


> 京东真是酷，早上下单了几本书，下午就到了。
> 
> 参考书籍《jsdom编程艺术》

## 好习惯

- 注意花括号{...}内的语句具有缩进，通常是4个空格。缩进不是JavaScript语法要求必须的，但缩进有助于我们理解代码的层次，所以编写代码时要遵守缩进规则。很多文本编辑器具有“自动缩进”的功能，可以帮助整理代码。
- JavaScript本身对嵌套的层级没有限制，但是过多的嵌套无疑会大大增加看懂代码的难度。遇到这种情况，需要把部分代码抽出来，作为函数来调用，这样可以减少代码的复杂度。

- **请注意，JavaScript严格区分大小写，如果弄错了大小写，程序将报错或者运行不正常。**

## 基础概念

- 声明变量：

```
 var mynum = 8;
```

- 判断语句（if...else）

```
<script type="text/javascript">
	   var myage = 18;
	   if(myage>=18)  //myage>=18是判断条件
	   { document.write("你是成年人。");}
	   else  //否则年龄小于18
	   { document.write("未满18岁，你不是成年人。");}
	</script>
```

- 函数

```
function add2(){
var sum = 3 + 2;
alert(sum);}
```

- 输出内容

```
  <script type="text/javascript">
    var mystr="我是";
    var mychar="JavaScript";
	 document.write(myst0r+"<br>");
	document.write(mystr+mychar+"的忠实粉丝"); </script>
```

- 警告（alert 消息对话框）

```
<!DOCTYPE HTML>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>alert</title>
  <script type="text/javascript">
  function rec(){
    var mychar="I love JavaScript";
alert(mynum);
  }
  </script>
</head>
<body>
    <input name="button" type="button" onClick="rec()" value="点击我，弹出对话框" />
</body>
</html>
```

- 确认（confirm 消息对话框）

```
<!DOCTYPE HTML>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>confirm</title>
  <script type="text/javascript">
 function rec(){

    var mymessage=confirm("你是妹纸吗？")         ;

    if(mymessage==true)

    {

        document.write("留下你的手机!");

    }

    else

    {

        document.write("叔叔，叔叔，我们不约!");

    }

  }
  </script>
</head>
<body>
    <input name="button" type="button" onClick="rec()" value="点击我，弹出确认对话框" />
</body>
</html>
```

- 提问

```
<script type="text/javascript">
		  function rec(){
			var score; //score变量，用来存储用户输入的成绩值。
			score =prompt("输入你的成绩","0-100的数字");
			if(score>=90)
			{
			   document.write("你很棒!");
			}
			else if(score>=75)
		    {
			   document.write("不错吆!");
			}
			else if(score>=60)
		    {
			   document.write("要加油!");
		    }
		    else
			{
		       document.write("要努力了!");
			}
		  }
		  </script>
```

- 打开新窗口

```
	<script type="text/javascript">
  function Wopen(){
      window.open('http://www.imooc.com','_blank','width=600,height=400,top=100,left=0,menubar=no,toolbar=no,scrollbars=no,status=no') 

  } 
</script>
```

## 认识DOM




