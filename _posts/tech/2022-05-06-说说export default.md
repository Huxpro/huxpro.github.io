---
layout:     post
title:      "说说export default"
subtitle:   ""
date:       2022-05-06
author:     "YorkWong"
tags:
    - JS
---
# export default 暴露常量的用法

```jsx
var nationData = [
		{id:1 ,value:'汉族'},
		{id:2 ,value:'蒙古族'},
		{id:3 ,value:'回族'},
		{id:4 ,value:'藏族'},
 
];

export default nationData;
```

### export 和 export default的作用和区别

export和export default实现的功能相同

**作用**：用于导出（暴露）常量、函数、文件、模块等，以便其他文件调用。

**区别**：

1. export导出多个对象，export default只能导出一个对象
2. export导出对象需要用{ }, export default 不需要 
    1. export { A, B, C }
    2. export default A
3. 其他文件引用export default导出的对象时可自定义导出时的名字，见下面的nationList。

```jsx
import nationList  from '@/common/enum/nation.js'
export default {

    data() {
        return {
            nationList //（注意一定要在data里面定义后才能用！！）
        }
    }
}
```