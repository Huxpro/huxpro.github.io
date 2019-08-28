# Bootstrap框架

## 栅格系统

### 栅格参数

通过下表可以详细查看 Bootstrap 的栅格系统是如何在多种屏幕设备上工作的。

|                       | 超小屏幕 手机 (<768px)     | 小屏幕 平板 (≥768px)                                | 中等屏幕 桌面显示器 (≥992px) | 大屏幕 大桌面显示器 (≥1200px) |
| :-------------------- | :------------------------- | :-------------------------------------------------- | :--------------------------- | :---------------------------- |
| 栅格系统行为          | 总是水平排列               | 开始是堆叠在一起的，当大于这些阈值时将变为水平排列C |                              |                               |
| `.container` 最大宽度 | None （自动）              | 750px                                               | 970px                        | 1170px                        |
| 类前缀                | `.col-xs-`                 | `.col-sm-`                                          | `.col-md-`                   | `.col-lg-`                    |
| 列（column）数        | 12                         |                                                     |                              |                               |
| 最大列（column）宽    | 自动                       | ~62px                                               | ~81px                        | ~97px                         |
| 槽（gutter）宽        | 30px （每列左右均有 15px） |                                                     |                              |                               |
| 可嵌套                | 是                         |                                                     |                              |                               |
| 偏移（Offsets）       | 是                         |                                                     |                              |                               |
| 列排序                | 是                         |                                                     |                              |                               |

***`.container`***	固定宽度的栅格布局

***`.container-fluid`***	流式布局

***`.row`***	行

***`.col-md-`****	列

***`.col-md-offset-`****	列偏移

***`.col-md-push-`****	右推

***`.col-md-pull-`****	左拉

## 排版

***`ul.list-unstyled`***	无样式列表

***`ul.list-inline`***	内联列表

***`p.lead`***	段落突出显示

***`.text-left`***

***`text-center`***

***`text-center`***

***`dl.dl-horizontal`***	水平排列的描述

## 表格

***`table.table`***	表格基本样式

***`table.table-striped`***	每一行增加斑马条纹样式

***`table.table-bordered`***	表格和其中的每个单元格增加边框

***`table.table-hover`***	每一行对鼠标悬停状态作出响应

***`table.table-condensed`***	表格更加紧凑，单元格中的（padding）均会减半

### 状态类

通过这些状态类可以为行或单元格设置颜色。

|   Class    |                 描述                 |
| :--------: | :----------------------------------: |
| `.active`  | 鼠标悬停在行或单元格上时所设置的颜色 |
| `.success` |         标识成功或积极的动作         |
|  `.info`   |       标识普通的提示信息或动作       |
| `.warning` |        标识警告或需要用户注意        |
| `.danger`  |  标识危险或潜在的带来负面影响的动作  |

***`div.table-responsive`***	响应式表格

## 表单

***`.form-control`***	所有设置了 `.form-control` 类的 `<input>`、`<textarea>` 和 `<select>`元素都将被默认设置宽度属性为 `width: 100%;`

***`form.form-inline`***	内联表单

***`form.form-horizontal`***	水平排列的表单