# SublimeText自定义snippet

[TOC]

> [Sublime Text](https://link.jianshu.com?t=https://www.sublimetext.com/)号称最性感的编辑器, 并且越来越多人使用, 美观, 高效
>  [Sublime Text 2使用心得](https://www.jianshu.com/p/25cdc7d608bb)

> 现在介绍一下Snippet, `Snippets are smart templates that will insert text for you and adapt it to their context`. Snippet 是插入到文本中的智能模板并使这段文本适当当前代码环境. 程序员总是会不断的重写一些简单的代码片段, 这种工作乏味/无聊, 而Snippet的出现会让Code更加高效.

## 1. Snippe创建,存储和格式

------

> **(这里snippet称作代码片段)**

`Snippet`可以存储在任何的文件夹中, 并且以`.sublime-snippet`为文件扩展名, 默认是存储在`.sublime-snippet`文件夹下.

> Snippet文件是以`.sublime-snippet`为扩展的XML文件, 可以命名为`XXX.sublime-snippet`, 创建自己的snippet的方式为菜单栏`Tools | New Snippet..`

下面看一下新建的文件格式:



```xml
<snippet>
    <content><![CDATA[
Hello, ${1:this} is a ${2:snippet}.
]]></content>
    <!-- Optional: Set a tabTrigger to define how to trigger the snippet -->
    <!-- <tabTrigger>hello</tabTrigger> -->
    <!-- Optional: Set a scope to limit where the snippet will trigger -->
    <!-- <scope>source.python</scope> -->
</snippet>
```

为了方便理解简化以上代码:



```xml
<snippet>
    <content><![CDATA[Type your snippet here]]></content>
    <!-- Optional: Tab trigger to activate the snippet -->
    <tabTrigger>hello</tabTrigger>
    <!-- Optional: Scope the tab trigger will be active in -->
    <scope>source.python</scope>
    <!-- Optional: Description to show in the menu -->
    <description>My Fancy Snippet</description>
</snippet>
```

简要介绍一下snippet四个组成部分:

- `content`:其中必须包含`<![CDATA[…]]>`,否则无法工作, `Type your snippet here`用来写你自己的代码片段
- `tabTrigger`:用来引发代码片段的字符或者字符串, 比如在以上例子上, 在编辑窗口输入`hello`然后按下tab就会在编辑器输出`Type your snippet here`这段代码片段
- `scope`: 表示你的代码片段会在那种语言环境下激活, 比如上面代码定义了`source.python`, 意思是这段代码片段会在python语言环境下激活.
- `description` :展示代码片段的描述, 如果不写的话, 默认使用代码片段的文件名作为描述

## 2. snippet环境变量

------

列举一下可能用到的环境变量, 这些环境变量是在Sublime中已经预定义的.

| 环境变量名      | 描述                                            |
| --------------- | ----------------------------------------------- |
| $TM_FILENAME    | 用户文件名                                      |
| $TM_FILEPATH    | 用户文件全路径                                  |
| $TM_FULLNAME    | 用户的用户名                                    |
| $TM_LINE_INDEX  | 插入多少列, 默认为0                             |
| $TM_LINE_NUMBER | 一个snippet插入多少行                           |
| $TM_SOFT_TABS   | 如果设置translate_tabs_to_spaces : true 则为Yes |
| $TM_TAB_SIZE    | 每个Tab包含几个空格                             |

同一通过下面的代码片段进行验证:



```xml
<snippet>
   <content><![CDATA[
=================================
$TM_FILENAME   用户文件名
$TM_FILEPATH   用户文件全路径
$TM_FULLNAME    用户的用户名
$TM_LINE_INDEX   插入多少列, 默认为0
$TM_LINE_NUMBER   一个snippet插入多少行
$TM_SOFT_TABS  如果设置translate_tabs_to_spaces : true 则为Yes
$TM_TAB_SIZE   每个Tab包含几个空格
=================================
]]></content>
    <!-- Optional: Set a tabTrigger to define how to trigger the snippet -->
    <tabTrigger>hello</tabTrigger>
    <!-- Optional: Set a scope to limit where the snippet will trigger -->
    <scope>source.python</scope>
</snippet>
```

> 验证方式 : 保存自定义snippet,在python文件夹下输入hello按下tab

## 3. snippet Fields

------

设置`Fields`, 可以通过tab键循环的改变代码片段的一些值



```xml
<snippet>
   <content><![CDATA[
=================================
First Name: $1
Second Name: $2
Address: $3
=================================
]]></content>
    <!-- Optional: Set a tabTrigger to define how to trigger the snippet -->
    <tabTrigger>hello</tabTrigger>
    <!-- Optional: Set a scope to limit where the snippet will trigger -->
    <scope>source.python</scope>
</snippet>
```

> 验证方式, 在python文件夹下, 输入hello按下tab, 会出现已经定义的代码片段, 不停的按下tab会发现输入光标在$1, $2, $3的位置跳转, 跳转顺序由数字由小到大决定, `Shift+Tab`可以进行向上跳转, 可以通过`Esc`结束跳转

## 4. snippet Mirrored Fields

------

设置snippet镜像区域,会使相同编号的位置同时进行编辑



```xml
<snippet>
   <content><![CDATA[
=================================
First Name: $1
Second Name: $1
Address: $1
=================================
]]></content>
    <!-- Optional: Set a tabTrigger to define how to trigger the snippet -->
    <tabTrigger>hello</tabTrigger>
    <!-- Optional: Set a scope to limit where the snippet will trigger -->
    <scope>source.python</scope>
</snippet>
```

> 验证方法: 在python文件中, 输入hello按下tab,出现代码片段,会出现三行同行编辑的光标, 这时进行编辑可以同时进行三行相同的编辑

## 5. snippet Placeholders

------

snippet 占位符含义类似于python的默认参数, 通过对Field做出一点修改, 可以定义Field的默认值, 并且可以通过tab键可以对不同的默认值进行修改



```xml
<snippet>
   <content><![CDATA[
=================================
First Name: ${1:Guillermo}
Second Name: ${2:López}
Address: ${3:Main Street 1234}
User name: $1
Environment Variable : ${4:$TM_FILEPATH }  #可以设置默认占位符为环境变量
Test: ${5:Nested ${6:Placeholder}}
=================================
]]></content>
    <!-- Optional: Set a tabTrigger to define how to trigger the snippet -->
    <tabTrigger>hello</tabTrigger>
    <!-- Optional: Set a scope to limit where the snippet will trigger -->
    <scope>source.python</scope>
</snippet>
```

> 验证方式: 在pyton文件中输入hello,然后按下tab, 输入代码片段后, 两个$1的field可以同时修改默认值, 然后继续按下tab键可以修改$2的默认值..., 还可以占位符设置嵌套

写到这里基本上大家都应该可以根据需求编写简单的snippet了, 恭喜你..

## 6. snippet Substitutions

------

高级应用可以使用[Perl的正则表达式](https://link.jianshu.com?t=http://docs.sublimetext.info/en/latest/extensibility/snippets.html#substitutions)

最后送上简单的python的snippet



```xml
<snippet>
    <content><![CDATA[
"""

文档注释

Args : 
    ${1}:

Returns : 
    ${2}:

Raises : 
    ${3}:

"""
]]></content>
    <tabTrigger>"""</tabTrigger>
    <scope>source.python</scope>
    <description>Documentation Comments</description>
</snippet>

###
<snippet>
    <content><![CDATA[def ${1:foo}():
    doc = "${2:The $1 property.}"
    def fget(self):
        ${3:return self._$1}
    def fset(self, value):
        ${4:self._$1 = value}
    def fdel(self):
        ${5:del self._$1}
    return locals()
$1 = property(**$1())$0]]></content>
    <tabTrigger>property</tabTrigger>
    <scope>source.python</scope>
    <description>New Property</description>
</snippet>
```

## 7. 拓展阅读和参考链接

------

[Snippets](https://link.jianshu.com?t=http://docs.sublimetext.info/en/latest/extensibility/snippets.html)
 [Syntax Definitions](https://link.jianshu.com?t=http://docs.sublimetext.info/en/latest/extensibility/syntaxdefs.html#scopes-and-scope-selectors)
 [Perl Regular Expression Syntax](https://link.jianshu.com?t=http://www.boost.org/doc/libs/1_56_0/libs/regex/doc/html/boost_regex/syntax/perl_syntax.html)
 [Boost-Extended Format String Syntax