# JavaScript HTML DOM

> 通过 HTML DOM，可访问 JavaScript HTML 文档的所有元素。

## HTML DOM (文档对象模型)

当网页被加载时，浏览器会创建页面的文档对象模型（Document Object Model）。

**HTML DOM** 模型被构造为**对象**的树：

![DOM HTML tree](https://www.runoob.com/images/pic_htmltree.gif)

## 查找 HTML 元素

#### 通过 id 查找 HTML 元素

```js
var x=document.getElementById("intro");
```

#### 通过标签名查找 HTML 元素

```js
var x=document.getElementById("main");
var y=x.getElementsByTagName("p");
```

#### 通过类名找到 HTML 元素

```js
var x=document.getElementsByClassName("intro");
```

#### 通过名称找到 HTML 元素

```js
var x=document.getElementsByName("intro");
```

## HTML DOM 事件

#### 鼠标事件

|                             属性                             |                  描述                  | DOM  |
| :----------------------------------------------------------: | :------------------------------------: | :--: |
|  [onclick](https://www.runoob.com/jsref/event-onclick.html)  |  当用户点击某个对象时调用的事件句柄。  |  2   |
| [oncontextmenu](https://www.runoob.com/jsref/event-oncontextmenu.html) | 在用户点击鼠标右键打开上下文菜单时触发 |      |
| [ondblclick](https://www.runoob.com/jsref/event-ondblclick.html) |  当用户双击某个对象时调用的事件句柄。  |  2   |
| [onmousedown](https://www.runoob.com/jsref/event-onmousedown.html) |            鼠标按钮被按下。            |  2   |
| [onmouseenter](https://www.runoob.com/jsref/event-onmouseenter.html) |     当鼠标指针移动到元素上时触发。     |  2   |
| [onmouseleave](https://www.runoob.com/jsref/event-onmouseleave.html) |        当鼠标指针移出元素时触发        |  2   |
| [onmousemove](https://www.runoob.com/jsref/event-onmousemove.html) |              鼠标被移动。              |  2   |
| [onmouseover](https://www.runoob.com/jsref/event-onmouseover.html) |          鼠标移到某元素之上。          |  2   |
| [onmouseout](https://www.runoob.com/jsref/event-onmouseout.html) |           鼠标从某元素移开。           |  2   |
| [onmouseup](https://www.runoob.com/jsref/event-onmouseup.html) |            鼠标按键被松开。            |  2   |

#### 键盘事件

|                             属性                             |            描述            | DOM  |
| :----------------------------------------------------------: | :------------------------: | :--: |
| [onkeydown](https://www.runoob.com/jsref/event-onkeydown.html) |    某个键盘按键被按下。    |  2   |
| [onkeypress](https://www.runoob.com/jsref/event-onkeypress.html) | 某个键盘按键被按下并松开。 |  2   |
|  [onkeyup](https://www.runoob.com/jsref/event-onkeyup.html)  |    某个键盘按键被松开。    |  2   |

#### 框架/对象（Frame/Object）事件

|                             属性                             |                             描述                             | DOM  |
| :----------------------------------------------------------: | :----------------------------------------------------------: | :--: |
|  [onabort](https://www.runoob.com/jsref/event-onabort.html)  |                图像的加载被中断。 ( <object>)                |  2   |
| [onbeforeunload](https://www.runoob.com/jsref/event-onbeforeunload.html) |           该事件在即将离开页面（刷新或关闭）时触发           |  2   |
|  [onerror](https://www.runoob.com/jsref/event-onerror.html)  | 在加载文档或图像时发生错误。 ( <object>, <body>和 <frameset>) |      |
| [onhashchange](https://www.runoob.com/jsref/event-onhashchange.html) |          该事件在当前 URL 的锚部分发生修改时触发。           |      |
|   [onload](https://www.runoob.com/jsref/event-onload.html)   |                 一张页面或一幅图像完成加载。                 |  2   |
| [onpageshow](https://www.runoob.com/jsref/event-onpageshow.html) |                  该事件在用户访问页面时触发                  |      |
| [onpagehide](https://www.runoob.com/jsref/event-onpagehide.html) |       该事件在用户离开当前网页跳转到另外一个页面时触发       |      |
| [onresize](https://www.runoob.com/jsref/event-onresize.html) |                  窗口或框架被重新调整大小。                  |  2   |
| [onscroll](https://www.runoob.com/jsref/event-onscroll.html) |                  当文档被滚动时发生的事件。                  |  2   |
| [onunload](https://www.runoob.com/jsref/event-onunload.html) |            用户退出页面。 ( <body> 和 <frameset>)            |  2   |

#### 表单事件

|                             属性                             |                             描述                             | DOM  |
| :----------------------------------------------------------: | :----------------------------------------------------------: | :--: |
|   [onblur](https://www.runoob.com/jsref/event-onblur.html)   |                      元素失去焦点时触发                      |  2   |
| [onchange](https://www.runoob.com/jsref/event-onchange.html) | 该事件在表单元素的内容改变时触发( <input>, <keygen>, <select>, 和 <textarea>) |  2   |
|  [onfocus](https://www.runoob.com/jsref/event-onfocus.html)  |                      元素获取焦点时触发                      |  2   |
| [onfocusin](https://www.runoob.com/jsref/event-onfocusin.html) |                    元素即将获取焦点时触发                    |  2   |
| [onfocusout](https://www.runoob.com/jsref/event-onfocusout.html) |                    元素即将失去焦点时触发                    |  2   |
|  [oninput](https://www.runoob.com/jsref/event-oninput.html)  |                    元素获取用户输入时触发                    |  3   |
|  [onreset](https://www.runoob.com/jsref/event-onreset.html)  |                        表单重置时触发                        |  2   |
| [onsearch](https://www.runoob.com/jsref/event-onsearch.html) |        用户向搜索域输入文本时触发 ( <input="search">)        |      |
| [onselect](https://www.runoob.com/jsref/event-onselect.html) |         用户选取文本时触发 ( <input> 和 <textarea>)          |  2   |
| [onsubmit](https://www.runoob.com/jsref/event-onsubmit.html) |                        表单提交时触发                        |  2   |

#### 剪贴板事件

|                            属性                            |              描述              | DOM  |
| :--------------------------------------------------------: | :----------------------------: | :--: |
|  [oncopy](https://www.runoob.com/jsref/event-oncopy.html)  | 该事件在用户拷贝元素内容时触发 |      |
|   [oncut](https://www.runoob.com/jsref/event-oncut.html)   | 该事件在用户剪切元素内容时触发 |      |
| [onpaste](https://www.runoob.com/jsref/event-onpaste.html) | 该事件在用户粘贴元素内容时触发 |      |

#### 打印事件

| 属性                                                         |                         描述                         | DOM  |
| :----------------------------------------------------------- | :--------------------------------------------------: | ---- |
| [onafterprint](https://www.runoob.com/jsref/event-onafterprint.html) | 该事件在页面已经开始打印，或者打印窗口已经关闭时触发 |      |
| [onbeforeprint](https://www.runoob.com/jsref/event-onbeforeprint.html) |            该事件在页面即将开始打印时触发            |      |

#### 拖动事件

| 事件                                                         |                 描述                 | DOM  |
| :----------------------------------------------------------- | :----------------------------------: | ---- |
| [ondrag](https://www.runoob.com/jsref/event-ondrag.html)     |      该事件在元素正在拖动时触发      |      |
| [ondragend](https://www.runoob.com/jsref/event-ondragend.html) |   该事件在用户完成元素的拖动时触发   |      |
| [ondragenter](https://www.runoob.com/jsref/event-ondragenter.html) | 该事件在拖动的元素进入放置目标时触发 |      |
| [ondragleave](https://www.runoob.com/jsref/event-ondragleave.html) |  该事件在拖动元素离开放置目标时触发  |      |
| [ondragover](https://www.runoob.com/jsref/event-ondragover.html) |  该事件在拖动元素在放置目标上时触发  |      |
| [ondragstart](https://www.runoob.com/jsref/event-ondragstart.html) |    该事件在用户开始拖动元素时触发    |      |
| [ondrop](https://www.runoob.com/jsref/event-ondrop.html)     | 该事件在拖动元素放置在目标区域时触发 |      |

#### 多媒体（Media）事件

| 事件                                                         |                             描述                             | DOM  |
| :----------------------------------------------------------- | :----------------------------------------------------------: | :--: |
| [onabort](https://www.runoob.com/jsref/event-onabort-media.html) |        事件在视频/音频（audio/video）终止加载时触发。        |      |
| [oncanplay](https://www.runoob.com/jsref/event-oncanplay.html) |    事件在用户可以开始播放视频/音频（audio/video）时触发。    |      |
| [oncanplaythrough](https://www.runoob.com/jsref/event-oncanplaythrough.html) | 事件在视频/音频（audio/video）可以正常播放且无需停顿和缓冲时触发。 |      |
| [ondurationchange](https://www.runoob.com/jsref/event-ondurationchange.html) |     事件在视频/音频（audio/video）的时长发生变化时触发。     |      |
| onemptied                                                    |                    当期播放列表为空时触发                    |      |
| [onended](https://www.runoob.com/jsref/event-onended.html)   |        事件在视频/音频（audio/video）播放结束时触发。        |      |
| [onerror](https://www.runoob.com/jsref/event-onerror-media.html) |  事件在视频/音频（audio/video）数据加载期间发生错误时触发。  |      |
| [onloadeddata](https://www.runoob.com/jsref/event-onloadeddata.html) |  事件在浏览器加载视频/音频（audio/video）当前帧时触发触发。  |      |
| [onloadedmetadata](https://www.runoob.com/jsref/event-onloadedmetadata.html) |    事件在指定视频/音频（audio/video）的元数据加载后触发。    |      |
| [onloadstart](https://www.runoob.com/jsref/event-onloadstart.html) |    事件在浏览器开始寻找指定视频/音频（audio/video）触发。    |      |
| [onpause](https://www.runoob.com/jsref/event-onpause.html)   |          事件在视频/音频（audio/video）暂停时触发。          |      |
| [onplay](https://www.runoob.com/jsref/event-onplay.html)     |        事件在视频/音频（audio/video）开始播放时触发。        |      |
| [onplaying](https://www.runoob.com/jsref/event-onplaying.html) | 事件在视频/音频（audio/video）暂停或者在缓冲后准备重新开始播放时触发。 |      |
| [onprogress](https://www.runoob.com/jsref/event-onprogress.html) |    事件在浏览器下载指定的视频/音频（audio/video）时触发。    |      |
| [onratechange](https://www.runoob.com/jsref/event-onratechange.html) |   事件在视频/音频（audio/video）的播放速度发送改变时触发。   |      |
| [onseeked](https://www.runoob.com/jsref/event-onseeked.html) | 事件在用户重新定位视频/音频（audio/video）的播放位置后触发。 |      |
| [onseeking](https://www.runoob.com/jsref/event-onseeking.html) |    事件在用户开始重新定位视频/音频（audio/video）时触发。    |      |
| [onstalled](https://www.runoob.com/jsref/event-onstalled.html) |      事件在浏览器获取媒体数据，但媒体数据不可用时触发。      |      |
| [onsuspend](https://www.runoob.com/jsref/event-onsuspend.html) |             事件在浏览器读取媒体数据中止时触发。             |      |
| [ontimeupdate](https://www.runoob.com/jsref/event-ontimeupdate.html) |             事件在当前的播放位置发送改变时触发。             |      |
| [onvolumechange](https://www.runoob.com/jsref/event-onvolumechange.html) |                  事件在音量发生改变时触发。                  |      |
| [onwaiting](https://www.runoob.com/jsref/event-onwaiting.html) |         事件在视频由于要播放下一帧而需要缓冲时触发。         |      |

#### 动画事件

|                             事件                             |              描述               | DOM  |
| :----------------------------------------------------------: | :-----------------------------: | :--: |
| [animationend](https://www.runoob.com/jsref/event-animationend.html) | 该事件在 CSS 动画结束播放时触发 |      |
| [animationiteration](https://www.runoob.com/jsref/event-animationiteration.html) | 该事件在 CSS 动画重复播放时触发 |      |
| [animationstart](https://www.runoob.com/jsref/event-animationstart.html) | 该事件在 CSS 动画开始播放时触发 |      |

#### 过渡事件

|                             事件                             |             描述              | DOM  |
| :----------------------------------------------------------: | :---------------------------: | :--: |
| [transitionend](https://www.runoob.com/jsref/event-transitionend.html) | 该事件在 CSS 完成过渡后触发。 |      |

#### 其他事件

| 事件                                                         |                             描述                             | DOM  |
| :----------------------------------------------------------- | :----------------------------------------------------------: | :--: |
| onmessage                                                    | 该事件通过或者从对象(WebSocket, Web Worker, Event Source 或者子 frame 或父窗口)接收到消息时触发 |      |
| onmousewheel                                                 | 已废弃。 使用 [onwheel](https://www.runoob.com/jsref/event-onwheel.html) 事件替代 |      |
| [ononline](https://www.runoob.com/jsref/event-ononline.html) |              该事件在浏览器开始在线工作时触发。              |      |
| [onoffline](https://www.runoob.com/jsref/event-onoffline.html) |              该事件在浏览器开始离线工作时触发。              |      |
| onpopstate                                                   |    该事件在窗口的浏览历史（history 对象）发生改变时触发。    |      |
| [onshow](https://www.runoob.com/jsref/event-onshow.html)     |          该事件当 <menu> 元素在上下文菜单显示时触发          |      |
| onstorage                                                    |       该事件在 Web Storage(HTML 5 Web 存储)更新时触发        |      |
| [ontoggle](https://www.runoob.com/jsref/event-ontoggle.html) |         该事件在用户打开或关闭 <details> 元素时触发          |      |
| [onwheel](https://www.runoob.com/jsref/event-onwheel.html)   |             该事件在鼠标滚轮在元素上下滚动时触发             |      |

