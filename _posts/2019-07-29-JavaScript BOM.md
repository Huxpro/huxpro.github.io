# BOM

## Window 对象

> Window 对象表示浏览器中打开的窗口。
>
> 如果文档包含框架（<frame> 或 <iframe> 标签），浏览器会为 HTML 文档创建一个 window 对象，并为每个框架创建一个额外的 window 对象。

#### Window 对象属性

|                             属性                             |                             描述                             |
| :----------------------------------------------------------: | :----------------------------------------------------------: |
| [closed](https://www.runoob.com/jsref/prop-win-closed.html)  |                    返回窗口是否已被关闭。                    |
| [defaultStatus](https://www.runoob.com/jsref/prop-win-defaultstatus.html) |              设置或返回窗口状态栏中的默认文本。              |
| [document](https://www.runoob.com/jsref/dom-obj-document.html) | 对 Document 对象的只读引用。(请参阅[对象](https://www.runoob.com/jsref/dom-obj-document.html)) |
| [frames](https://www.runoob.com/jsref/prop-win-frames.html)  | 返回窗口中所有命名的框架。该集合是 Window 对象的数组，每个 Window 对象在窗口中含有一个框架。 |
|   [history](https://www.runoob.com/jsref/obj-history.html)   | 对 History 对象的只读引用。请参数 [History 对象](https://www.runoob.com/jsref/obj-history.html)。 |
| [innerHeight](https://www.runoob.com/jsref/prop-win-innerheight.html) |                 返回窗口的文档显示区的高度。                 |
| [innerWidth](https://www.runoob.com/jsref/prop-win-innerheight.html) |                 返回窗口的文档显示区的宽度。                 |
| [localStorage](https://www.runoob.com/jsref/prop-win-localstorage.html) |         在浏览器中存储 key/value 对。没有过期时间。          |
| [length](https://www.runoob.com/jsref/prop-win-length.html)  |                 设置或返回窗口中的框架数量。                 |
|  [location](https://www.runoob.com/jsref/obj-location.html)  | 用于窗口或框架的 Location 对象。请参阅 [Location 对象](https://www.runoob.com/jsref/obj-location.html)。 |
|   [name](https://www.runoob.com/jsref/prop-win-name.html)    |                    设置或返回窗口的名称。                    |
| [navigator](https://www.runoob.com/jsref/obj-navigator.html) | 对 Navigator 对象的只读引用。请参数 [Navigator 对象](https://www.runoob.com/jsref/obj-navigator.html)。 |
| [opener](https://www.runoob.com/jsref/prop-win-opener.html)  |                返回对创建此窗口的窗口的引用。                |
| [outerHeight](https://www.runoob.com/jsref/prop-win-outerheight.html) |           返回窗口的外部高度，包含工具条与滚动条。           |
| [outerWidth](https://www.runoob.com/jsref/prop-win-outerheight.html) |           返回窗口的外部宽度，包含工具条与滚动条。           |
| [pageXOffset](https://www.runoob.com/jsref/prop-win-pagexoffset.html) |     设置或返回当前页面相对于窗口显示区左上角的 X 位置。      |
| [pageYOffset](https://www.runoob.com/jsref/prop-win-pagexoffset.html) |     设置或返回当前页面相对于窗口显示区左上角的 Y 位置。      |
| [parent](https://www.runoob.com/jsref/prop-win-parent.html)  |                         返回父窗口。                         |
|    [screen](https://www.runoob.com/jsref/obj-screen.html)    | 对 Screen 对象的只读引用。请参数 [Screen 对象](https://www.runoob.com/jsref/obj-screen.html)。 |
| [screenLeft](https://www.runoob.com/jsref/prop-win-screenleft.html) |                  返回相对于屏幕窗口的x坐标                   |
| [screenTop](https://www.runoob.com/jsref/prop-win-screenleft.html) |                  返回相对于屏幕窗口的y坐标                   |
| [screenX](https://www.runoob.com/jsref/prop-win-screenx.html) |                  返回相对于屏幕窗口的x坐标                   |
| [sessionStorage](https://www.runoob.com/jsref/prop-win-sessionstorage.html) | 在浏览器中存储 key/value 对。 在关闭窗口或标签页之后将会删除这些数据。 |
| [screenY](https://www.runoob.com/jsref/prop-win-screenx.html) |                  返回相对于屏幕窗口的y坐标                   |
|   [self](https://www.runoob.com/jsref/prop-win-self.html)    |          返回对当前窗口的引用。等价于 Window 属性。          |
| [status](https://www.runoob.com/jsref/prop-win-status.html)  |                    设置窗口状态栏的文本。                    |
|    [top](https://www.runoob.com/jsref/prop-win-top.html)     |                     返回最顶层的父窗口。                     |

#### Window 对象方法 

|                             方法                             |                             描述                             |
| :----------------------------------------------------------: | :----------------------------------------------------------: |
|  [alert()](https://www.runoob.com/jsref/met-win-alert.html)  |           显示带有一段消息和一个确认按钮的警告框。           |
|   [atob()](https://www.runoob.com/jsref/met-win-atob.html)   |               解码一个 base-64 编码的字符串。                |
|   [btoa()](https://www.runoob.com/jsref/met-win-btoa.html)   |               创建一个 base-64 编码的字符串。                |
|   [blur()](https://www.runoob.com/jsref/met-win-blur.html)   |                  把键盘焦点从顶层窗口移开。                  |
| [clearInterval()](https://www.runoob.com/jsref/met-win-clearinterval.html) |            取消由 setInterval() 设置的 timeout。             |
| [clearTimeout()](https://www.runoob.com/jsref/met-win-cleartimeout.html) |           取消由 setTimeout() 方法设置的 timeout。           |
|  [close()](https://www.runoob.com/jsref/met-win-close.html)  |                       关闭浏览器窗口。                       |
| [confirm()](https://www.runoob.com/jsref/met-win-confirm.html) |       显示带有一段消息以及确认按钮和取消按钮的对话框。       |
| [createPopup()](https://www.runoob.com/jsref/met-win-createpopup.html) |                    创建一个 pop-up 窗口。                    |
|  [focus()](https://www.runoob.com/jsref/met-win-focus.html)  |                   把键盘焦点给予一个窗口。                   |
|                        getSelection()                        | 返回一个 Selection 对象，表示用户选择的文本范围或光标的当前位置。 |
| [getComputedStyle()](https://www.runoob.com/jsref/jsref-getcomputedstyle.html) |                  获取指定元素的 CSS 样式。                   |
| [matchMedia()](https://www.runoob.com/jsref/met-win-matchmedia.html) | 该方法用来检查 media query 语句，它返回一个 MediaQueryList对象。 |
| [moveBy()](https://www.runoob.com/jsref/met-win-moveby.html) |           可相对窗口的当前坐标把它移动指定的像素。           |
| [moveTo()](https://www.runoob.com/jsref/met-win-moveto.html) |             把窗口的左上角移动到一个指定的坐标。             |
|   [open()](https://www.runoob.com/jsref/met-win-open.html)   |        打开一个新的浏览器窗口或查找一个已命名的窗口。        |
|  [print()](https://www.runoob.com/jsref/met-win-print.html)  |                     打印当前窗口的内容。                     |
| [prompt()](https://www.runoob.com/jsref/met-win-prompt.html) |                 显示可提示用户输入的对话框。                 |
| [resizeBy()](https://www.runoob.com/jsref/met-win-resizeby.html) |                按照指定的像素调整窗口的大小。                |
| [resizeTo()](https://www.runoob.com/jsref/met-win-resizeto.html) |             把窗口的大小调整到指定的宽度和高度。             |
|                           scroll()                           | 已废弃。 该方法已经使用了 [scrollTo()](https://www.runoob.com/jsref/met-win-scrollto.html) 方法来替代。 |
| [scrollBy()](https://www.runoob.com/jsref/met-win-scrollby.html) |                 按照指定的像素值来滚动内容。                 |
| [scrollTo()](https://www.runoob.com/jsref/met-win-scrollto.html) |                   把内容滚动到指定的坐标。                   |
| [setInterval()](https://www.runoob.com/jsref/met-win-setinterval.html) |      按照指定的周期（以毫秒计）来调用函数或计算表达式。      |
| [setTimeout()](https://www.runoob.com/jsref/met-win-settimeout.html) |            在指定的毫秒数后调用函数或计算表达式。            |
|   [stop()](https://www.runoob.com/jsref/met-win-stop.html)   |                        停止页面载入。                        |

## Location 对象

> Location 对象包含有关当前 URL 的信息。
>
> Location 对象是 window 对象的一部分，可通过 window.Location 属性对其进行访问。

#### Location 对象属性

|                             属性                             |             描述              |
| :----------------------------------------------------------: | :---------------------------: |
|   [hash](https://www.runoob.com/jsref/prop-loc-hash.html)    |      返回一个URL的锚部分      |
|   [host](https://www.runoob.com/jsref/prop-loc-host.html)    |   返回一个URL的主机名和端口   |
| [hostname](https://www.runoob.com/jsref/prop-loc-hostname.html) |        返回URL的主机名        |
|   [href](https://www.runoob.com/jsref/prop-loc-href.html)    |         返回完整的URL         |
| [pathname](https://www.runoob.com/jsref/prop-loc-pathname.html) |       返回的URL路径名。       |
|   [port](https://www.runoob.com/jsref/prop-loc-port.html)    | 返回一个URL服务器使用的端口号 |
| [protocol](https://www.runoob.com/jsref/prop-loc-protocol.html) |        返回一个URL协议        |
| [search](https://www.runoob.com/jsref/prop-loc-search.html)  |     返回一个URL的查询部分     |

#### Location 对象方法

|                             方法                             |          说明          |
| :----------------------------------------------------------: | :--------------------: |
| [assign()](https://www.runoob.com/jsref/met-loc-assign.html) |    载入一个新的文档    |
| [reload()](https://www.runoob.com/jsref/met-loc-reload.html) |    重新载入当前文档    |
| [replace()](https://www.runoob.com/jsref/met-loc-replace.html) | 用新的文档替换当前文档 |

