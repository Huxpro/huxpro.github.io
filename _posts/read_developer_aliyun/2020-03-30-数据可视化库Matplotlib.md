---
title: "「人工智能学习路线」7"
subtitle: "数据可视化库Matplotlib"
layout: post
author: "echisenyang"
header-style: text
hidden: true
catalog: true
tags:
  - 笔记
  - 人工智能学习路线
---



### 支持库

> matplotlib==2.2.2
> numpy==1.14.2
> pandas==0.20.3
> TA-Lib==0.4.16  #金融分析库
> tables==3.4.2
> jupyter==1.0.0

### Jupyter notebook

> Jupyter项目是一个非盈利的开源项目，源于2014年的ipython项目，因为它逐渐发展为支持跨所有编程语言的交互式数据科学和科学计算
>
> - Jupyter Notebook，原名IPython Notbook，是IPython的加强网页版，一个开源Web应用程序
> - 名字源自Julia、Python 和 R（数据科学的三种开源语言）
> - 是一款程序员和科学工作者的**编程/文档/笔记/展示**软件
> - **.ipynb**文件格式是用于计算型叙述的**JSON文档格式**的正式规范

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/X96uFk.jpg" style="zoom:50%;" />

> 传统软件开发：工程／目标明确
>
> - **需求分析，设计架构，开发模块，测试**
>
> 数据挖掘：艺术／目标不明确
>
> - **目的是具体的洞察目标**，而不是机械的完成任务
> - 通过执行代码来理解问题
> - **迭代式地改进代码来改进解决方法**
>
> ‼️ 实时运行的代码，方便画图展示和代码的可视化分析

#### 快捷键操作cell

- 命令模式：按ESC进入
  - `Y`，cell切换到Code模式
  - `M`，cell切换到Markdown模式
  - `A`，在当前cell的上面添加cell
  - `B`，在当前cell的下面添加cell
  - `双击D`：删除当前cell
  - `Z`，回退
  - `L`，为当前cell加上行号 <!--
  - `Ctrl+Shift+P`，对话框输入命令直接运行
  - 快速跳转到首个cell，`Crtl+Home`
  - 快速跳转到最后一个cell，`Crtl+End` -->
- 编辑模式：按Enter进入
  - 多光标操作：`Ctrl键点击鼠标`（Mac:CMD+点击鼠标）
  - 回退：`Ctrl+Z`（Mac:CMD+Z）
  - 重做：`Ctrl+Y`（Mac:CMD+Y)
  - 补全代码：变量、方法后跟`Tab键`
  - 为一行或多行代码添加/取消注释：`Ctrl+/`（Mac:CMD+/）
  - 屏蔽自动输出信息：可在最后一条语句之后加一个分号

### Matplotlib绘图架构

![](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/MmyRyV.jpg)

- 什么是Matplotlib「matrix-plot-lib」

  - 是专门用于开发2D图表(包括3D图表)
- 使用起来及其简单
  - 以渐进、交互式方式实现数据可视化


> 更酷炫的可视化一般由js库实现，比如D3(国外)、echarts(百度)

-  Matplotlib框架构成(三层结构)

> 1) 容器层
>
> > 画板层（Canvas）
> >
> > 画布层（Figure：`plt.figure()`）
> >
> > 绘图区/坐标系（Axes：`plt.subplots()`）
>
> 2) 辅助显示层
>
> > 图例、刻度、网格等
>
> 3) 图像层
>
> > 画什么样的图表📈

> ⚠️ 坐标轴、刻度、图例等辅助显示层以及图像层都是建立在 Axes 之上

![](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/WkwLiT.jpg)

### 折线图与基础绘图功能(辅助显示层)

- 修改图形大小与图片保存

```python
# 1.创建画布
plt.figure(figsize=(20, 8), dpi=80)
# 2.绘制图像
plt.plot([1, 2, 3, 4, 5, 6 ,7], [17,17,18,15,11,11,13])
    # 保存图片需要在plt.show()之前
plt.savefig(path="test.png")
# 3.显示图像
plt.show()
```

> `plt.show()` 会释放figure资源，如果在显示图像之后保存图片将只能保存空白图片

- 自定义x,y刻度以及中文显示

> ❗️ 坐标轴、刻度、图例等辅助显示层以及图像层都是建立在 Axes 之上，即在Figure层之后进行修改

> ⭕️ **中文显示问题解决**
>
> > 1.download SimHei.ttf  [http://www.fontpalace.com/font-details/SimHei/](https://link.jianshu.com/?t=http%3A%2F%2Fwww.fontpalace.com%2Ffont-details%2FSimHei%2F)
> >
> > 2.`matplotlib.get_cachedir()` 得到字体缓存路径 '/Users/yangjiale/.matplotlib' 
> >
> > 3.删除缓存文件 `rm -rf *`
> >
> > ![](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/UwRlIf.png)
> >
> > 4. 创建配置文件 matplotlibrc
> >
> > ```vim
> > backend:TkAgg
> > font.family         : sans-serif
> > font.sans-serif     : SimHei
> > axes.unicode_minus  : False
> > ```

```python
# 画出温度变化图

    # 准备x, y坐标的数据
x = range(60)
y_shanghai = [random.uniform(15, 18) for i in x]

# 1.创建画布
plt.figure(figsize=(20, 8), dpi=80)

# 2.绘制图像
plt.plot(x, y_shanghai, label="上海")

    # 增加以下两行代码
    # 构造中文列表的字符串
x_ch = ["11点{}分".format(i) for i in x]
y_ticks = range(40)

    # 修改x,y坐标的刻度
plt.xticks(x[::5], x_ch[::5])
plt.yticks(y_ticks[::5])

# 3.显示图像
plt.show()
```

- 增加网格显示

`plt.grid(True,linestyle="--",alpha=0.5)`

- 增加标题、x轴y轴描述信息

```python
plt.xlabel("时间")
plt.ylabel("温度")
plt.title("中午11点0分到12点之间的温度变化图示")
```

> 完整代码及效果

```python
# 画出温度变化图

    # 准备x, y坐标的数据
x = range(60)
y_shanghai = [random.uniform(15, 18) for i in x]

# 1.创建画布
plt.figure(figsize=(20, 8), dpi=80)

# 2.绘制图像
plt.plot(x, y_shanghai, label="上海")

## 辅助显示层 
    # 增加以下两行代码
    # 构造中文列表的字符串
x_ch = ["11点{}分".format(i) for i in x]
y_ticks = range(40)

    # 修改x,y坐标的刻度
plt.xticks(x[::5], x_ch[::5])
plt.yticks(y_ticks[::5])

    # 增加网格
plt.grid(True,linestyle="--",alpha=0.5)

    # 增加标题、x轴y轴描述信息
plt.xlabel("时间")
plt.ylabel("温度")
plt.title("中午11点0分到12点之间的温度变化图示")


# 3.显示图像
plt.show()
```

![](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/Ot9dsg.jpg)

### 完善原始折线图(图像层)

```python
# 生成北京的温度
y_beijing = [random.uniform(1, 3) for i in x]

# 画折线图
plt.plot(x, y_shanghai, label="上海")
# 使用plot可以多次画多个折线
plt.plot(x, y_beijing, color='r', linestyle='--', label="北京")

# 添加图形注释
plt.legend(loc="best")
```

```python
# 画出温度变化图

    # 准备x, y坐标的数据
x = range(60)
y_shanghai = [random.uniform(15, 18) for i in x]
    # 生成北京的温度
y_beijing = [random.uniform(1, 3) for i in x]


# 1.创建画布
plt.figure(figsize=(20, 8), dpi=300)

# 2.绘制图像
plt.plot(x, y_shanghai, label="上海")
		# 新增图像
plt.plot(x, y_beijing, color='r', linestyle='--', label="北京")

    # 增加以下两行代码
    # 构造中文列表的字符串
x_ch = ["11点{}分".format(i) for i in x]
y_ticks = range(40)

    # 修改x,y坐标的刻度
plt.xticks(x[::5], x_ch[::5])
plt.yticks(y_ticks[::5])

    # 增加网格
plt.grid(True,linestyle="--",alpha=0.5)

    # 增加标题、x轴y轴描述信息、图例
plt.legend(loc="best")
plt.xlabel("时间")
plt.ylabel("温度")
plt.title("中午11点0分到12点之间的温度变化图示")
# 3.显示图像
plt.show()
```

> 添加另一个在同一坐标系当中的不同图形，**其实很简单只需要再次plot即可**

![](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/xMgdfK.jpg)

- 自定一个图形风格

| 颜色字符 |    风格字符    |
| :------: | :------------: |
|  r 红色  |     - 实线     |
|  g 绿色  |    - - 虚线    |
|  b 蓝色  |   -. 点划线    |
|  w 白色  |    : 点虚线    |
|  c 青色  | ' ' 留空、空格 |
|  m 洋红  |                |
|  y 黄色  |                |
|  k 黑色  |                |

- 显示图例

```python
plt.legend(loc="best")
```

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/7UvEOH.jpg" style="zoom:40%;" />

### 多个坐标系显示-plt.subplots

`fig, axes = matplotlib.pyplot.subplots(nrows=1, ncols=1, **fig_kw)`

> plt.subplots返回的是 fig(画布) 与 axes(绘图区)
>
> axes[0]代表操作第一个绘图区，axes[1]代表操作第二个绘图区

```python
# 画出温度变化图

    # 准备x, y坐标的数据
x = range(60)
y_shanghai = [random.uniform(15, 18) for i in x]
    # 生成北京的温度
y_beijing = [random.uniform(1, 3) for i in x]


# 1.创建画布
# plt.figure(figsize=(20, 8), dpi=300)
fig, axes = plt.subplots(nrows=1, ncols=2, figsize=(20, 8), dpi=300)

# 2.绘制图像
# plt.plot(x, y_shanghai, label="上海")
# plt.plot(x, y_beijing, color='r', linestyle='--', label="北京")
axes[0].plot(x, y_shanghai, label="上海")
axes[1].plot(x, y_beijing, color='r', linestyle='--', label="北京")
# plt.legend(loc="best")
axes[0].legend(loc="best")
axes[1].legend(loc="best")

    # 增加以下两行代码
    # 构造中文列表的字符串
x_ch = ["11点{}分".format(i) for i in x]
y_ticks = range(40)

    # 修改x,y坐标的刻度
# plt.xticks(x[::5], x_ch[::5])
# plt.yticks(y_ticks[::5])
axes[0].set_xticks(x[::5])
axes[0].set_xticklabels(x_ch[::5])
axes[0].set_yticks(y_ticks[::5])

axes[1].set_xticks(x[::5])
axes[1].set_xticklabels(x_ch[::5])
axes[1].set_yticks(y_ticks[::5])

    # 增加网格
# plt.grid(True,linestyle="--",alpha=0.5)
axes[0].grid(True,linestyle="--",alpha=0.5)
axes[1].grid(True,linestyle="--",alpha=0.5)

    # 增加标题、x轴y轴描述信息、图例
# plt.xlabel("时间")
# plt.ylabel("温度")
# plt.title("中午11点0分到12点之间的温度变化图示")
axes[0].set_xlabel("时间")
axes[0].set_ylabel("温度")
axes[0].set_title("中午11点0分到12点之间的温度变化图示")

axes[1].set_xlabel("时间")
axes[1].set_ylabel("温度")
axes[1].set_title("中午11点0分到12点之间的温度变化图示")

# 3.显示图像
plt.show()
```

![](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/OiDgjz.jpg)

> ⭕️ 关于axes子坐标系的更多方法：参考https://matplotlib.org/api/axes_api.html#matplotlib.axes.Axes

### 常见图表📈

> 折线图plot：观察事物或者指标的变化趋势
>
> 散点图scatter：判断变量之间是否存在关联趋势，展示分布规律（最简单，不需要花里胡哨的设置）
>
> 柱状图bar：统计/对比数量的关系
>
> 直方图hist：表示数据的分布状况
>
> 饼图pie：反应不同类别数据占比

- 柱状图bar

```python
# 三部电影的首日和首周票房对比
plt.figure(figsize=(20, 8), dpi=80)

movie_name = ['雷神3：诸神黄昏','正义联盟','寻梦环游记']

first_day = [10587.6,10062.5,1275.7]
first_weekend=[36224.9,34479.6,11830]

x = range(len(movie_name))

# 画出柱状图
plt.bar(x, first_day, width=0.2, label="首日票房")
# 首周柱状图显示的位置在首日的位置右边，避免直接覆盖
plt.bar([i+0.2 for i in x], first_weekend, width=0.2, label="首周票房")

# 显示X轴中文，固定在首日和首周的中间位置，刻度平移 （0+0.2）/2=0.1
plt.xticks([i+0.1 for i in x], movie_name)
plt.legend(loc='best')

plt.show()
```

![](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/wuwN5S.jpg)

- 直方图hist

> 设置组距
>
> 设置组数（通常对于数据较少的情况，分为5~12组，数据较多，更换图形显示方式）
>
> - 通常设置组数会有相应公式：组数 = 极差/组距= (max-min)/bins

> 直方图📊描述的是一组连续数据的频次分布，其中长度代表频数，宽度代表组距
>
> 柱状图只比较数据的大小，长度表示频数，但是宽度无意义

```python
# 展现不同电影的时长分布状态
plt.figure(figsize=(20, 8), dpi=100)

# 准备时长数据
time =[131,  98, ...]
# 定义一个间隔大小
a = 2

# 得出组数
bins = int((max(time) - min(time)) / a)

# 画出直方图
plt.hist(time, bins, density= True)

# 指定刻度的范围，以及步长
plt.xticks(list(range(min(time), max(time)))[::2])

plt.xlabel("电影时长大小")
plt.ylabel("电影的数据量")

plt.grid(True,linestyle="--",alpha=0.5)

plt.show()
```

![](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/LG0fEO.jpg)

-  饼图

```python
# 展现每部电影的排片的占比
plt.figure(figsize=(20, 8), dpi=100)

# 准备每部电影的名字，电影的排片场次
movie_name = ['雷神3：诸神黄昏','正义联盟','东方快车谋杀案','寻梦环游记','全球风暴','降魔传','追捕','七十七天','密战','狂兽','其它']

place_count = [60605,54546,45819,28243,13270,9945,7679,6799,6101,4621,20105]

# 通过pie
plt.pie(place_count, labels=movie_name, autopct='%1.2f%%', colors=['b','r','g','y','c','m','y','k','c','g','g'])

# 指定显示的pie是正圆
plt.axis('equal')

plt.legend(loc='best')

plt.title("排片占比示意图")
plt.show()
```

![](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/LmIjCt.jpg)



