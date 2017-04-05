
# Markdown 扩展语法功能

markdown使用差不多一年时间，在效率提高的同时，也发现一些功能的缺失，所幸由于它支持HTML，所以有一些解决方法。

###<a href= "#p1">1.1文内标记</a>
##<p id="p1"> 1.1文内标记</p>

使用锚点的方法

	先定义锚点id：<a href="#auchor_id">bookmark_text</a>
    再定义一个id为auchor_id的对象：<p id="auchor_id">auchor_text</p>
比如
 
  用`<a href="#end">go to end</a>`写出目录文字，然后在需要跳转的地方用
         `<p id="end">the end </p>` 效果点击如下。

        
   <a href="#end">go to end</a>



## 注释

  
  
  
  
  
 
 
 
 
 
 
 
 
 
 
 
 
  <p id="end">the end </p>
