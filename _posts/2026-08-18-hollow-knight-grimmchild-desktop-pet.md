---
layout:     post
title:      "把空洞骑士里的格林之子做成桌宠"
subtitle:   "用 Python + PyQt5 在桌面养一只会成长、休眠、瞬移、繁育与对战的小生物"
date:       2026-08-18 12:00:00
author:     "FangTangWei"
header-img: "img/post-bg-dreamer.jpg"
catalog:    true
tags:
    - Python
    - PyQt5
    - 桌面宠物
    - 空洞骑士
    - Hollow Knight
---

## 缘起：把格林之子从圣巢搬到桌面

《空洞骑士》（Hollow Knight）里那只忽闪忽闪、跟随骑士飞行的「格林之子」（Grimmchild）大概是我玩过最让人念念不忘的小生物之一。它本是一团被仪式召唤出的火焰化身，收集梦之火焰、不断进化，最后在格林剧团仪式中走向自己的归宿。

我一直在想，能不能把这只小家伙从圣巢里「带出来」，让它在我的 Windows 桌面上飞来飞去？——于是我做了 [hollow_knight_Grimmchild](https://github.com/FangTangWei/hollow_knight_Grimmchild)：一款用 Python + PyQt5 实现的桌面智能宠物，它不只是被动展示，而会**自己成长、自己睡觉、自己瞬移、自己繁育、自己打架**。

> 项目地址：<https://github.com/FangTangWei/hollow_knight_Grimmchild>

---

## 它到底是个什么东西

一句话概括：**一款基于 Python 制作的 Windows 桌面智能宠物，拥有完整计时逻辑、自主行为与桌面生态互动，可自主成长、休眠、瞬移、繁育、对战。**

不是单纯的「桌面上贴一只动图」，而是一套带状态机、带计时模型、带种群生态的小系统。具体来说：

- **技术栈**：Python 3.14+ / PyQt5
- **平台**：Windows
- **运行方式**：直接 `python Grimmchild.py` 运行，或用 PyInstaller 打包成单个 `Grimmchild.exe`
- **素材来源**：从《空洞骑士》游戏文件中提取的原版精灵帧动画（PNG 序列）与原声音效（MP3）

![项目徽章](https://img.shields.io/github/stars/FangTangWei/hollow_knight_Grimmchild?style=social)
![项目徽章](https://img.shields.io/github/forks/FangTangWei/hollow_knight_Grimmchild?style=social)
![项目徽章](https://img.shields.io/github/license/FangTangWei/hollow_knight_Grimmchild)

---

## 核心机制：60 FPS 的帧驱动世界

桌宠的整个行为系统建立在一个朴素但严谨的模型上：**固定 60 帧/秒，1 帧 = 1/60 秒，所有倒计时逐帧递减计算**。

也就是说，成长、睡眠、瞬移、攻击冷却这些「时间感」并不是用 `time.sleep()` 或 `QTimer` 一次大间隔触发，而是把每个状态的剩余时间拆成「每帧减 1」的计数器。这样做的好处是：

- 计时和渲染共用同一节拍，**视觉与逻辑不会错位**
- 暂停/卡顿时的恢复逻辑清晰：只要帧循环还在跑，时间就在走
- 各种随机区间（如 1–5 分钟成长周期、10–30 秒瞬移冷却）都可以归一化为「帧数区间」，便于调试

整个桌宠本质上是一台小小的实时仿真器。

---

## 单只宠物的独立行为

每只桌宠都是一个独立的状态机，它自己决定什么时候飞、什么时候睡、什么时候瞬移、什么时候打人。

### 1. 进阶成长

只有飞行、待机状态会累计成长时间。成长周期 **1–5 分钟**随机，最高可自动成长至 **4 阶**——对应原作里格林之子通过梦之火焰不断进化的设定。

另外有一个「越级」通道：**击杀同类可即时升级 1 级**，不受计时限制。这就把成长从纯时间驱动变成了「时间 + 战斗」双轨。

### 2. 作息休眠

闲逛结束后，经过 **10–30 秒**冷却自动进入睡眠。单次睡眠时长 **10–60 秒**，结束后自动苏醒、恢复活动。

桌面宠物的「真实感」很大程度来自这种「不一直在动」的节奏——它会累、会休息、会自己醒过来。

### 3. 瞬移机动

每 **10–30 秒**冷却完成一次自主瞬移，宠物可在桌面自由穿梭。瞬移入/出都配有原版动画序列（Tele In / Tele Out），所以看起来不是「闪现」，而是真的「化焰而去、化焰而至」。

### 4. 攻击限制

每次攻击结束后固定 **3 秒攻击冷却**，冷却期间无法再次发起攻击。这条规则看似简单，但它和「全局对战」联动后，就构成了桌面生态里的战斗节拍。

---

## 全局桌面生态：单机变成生态

真正让这个项目从「桌宠」升级为「桌面生态」的，是这两条全局规则。

### 1. 繁育新增

系统每 **10 分 25 秒**自动尝试分裂生成新宠物。自动生成条件：**桌面宠物数量 < 4 只**。

也就是说，你启动一只，过十几分钟它会自己分裂出第二只，再过十几分钟第三只……桌面会慢慢长出一群。如果嫌等得久，可以右键**手动分裂**，无冷却、直接生成新宠物。

### 2. 全局对战

系统每 **3 分 7.5 秒**触发一轮全场随机对战。触发条件：

- 桌面宠物数量 ≥ 2 只
- 参与的宠物当前无攻击冷却

条件不满足时自动跳过本轮攻击。这意味着：桌上越多宠物，对战触发越频繁，成长也越快（因为击杀同类可即时升级），桌面生态就形成了「**繁育 → 对战 → 击杀升级 → 进一步繁育**」的闭环。

把它放在那里不管，桌面会自己演化出一个微型社会。

---

## 动画与音效：原汁原味的圣巢质感

桌宠的「不像玩具、像生物」很大程度上来自素材质量。

- **37 套动画序列**：包含 4 种空闲（Idle）、4 种飞行（Fly）、射击（Shoot）、前摇（Antic）、瞬移出入（Tele In/Out）、睡眠与唤醒（Sleep/Wake）、火焰球（Flameball）与火焰球爆裂（Flameball Impact）、爆发（Burst）、回待机（TurnToIdle）等
- **11 种游戏原声音效**：飞行循环、攻击、瞬移、火焰球射击、背景音乐……每只小家伙飞过桌面时真的会带「扑扑扑」的扇翅声

这些素材不是凭空画的，而是用 [AssetStudioModGUI](https://github.com/aelurum/AssetStudio) 从《空洞骑士》游戏文件中**提取的原版精灵帧动画和音效**，再用 Game Object Dump 导出的动画数据辅助分类与命名。所以每一帧都是原作里那一帧。

---

## 安装与运行

```bash
# 1. 克隆仓库
git clone https://github.com/FangTangWei/hollow_knight_Grimmchild.git
cd hollow_knight_Grimmchild

# 2. 安装依赖
pip install PyQt5

# 3. 运行
python Grimmchild.py
```

环境要求：

- Windows 操作系统
- Python 3.14+
- PyQt5

---

## 打包为 EXE

如果不想每次都跑 Python，可以用 PyInstaller 把项目打包成单个可执行文件：

```bash
pip install pyinstaller

python -m PyInstaller Grimmchild.spec \
    --workpath "%TEMP%\gc_work" \
    --distpath ".\dist" \
    --clean --noconfirm
```

打包完成后，在 `dist/` 目录下找到 `Grimmchild.exe` 即可运行。

`Grimmchild.spec` 中只需修改第十行 `ROOT = r'需要打包的文件所在路径'` 为你自己的路径，其余配置已经写好。

---

## 项目结构速览

```
Grimmchild
├─ AudioClip/              # 11 种游戏原声音效
│  ├─ Grimm Epic Layer.mp3
│  ├─ grimm_teleport_out.mp3
│  ├─ Grimmbat_idle_*.mp3
│  ├─ grimmchild_fireball_shoot.mp3
│  └─ grimmchild_fly_loop.mp3
├─ Grimmchild Anim/        # 37 套精灵帧动画（PNG 序列）
│  ├─ 001-037 各动作文件夹
│  └─ ...
├─ FlameConsumed.ico       # 桌宠图标
└─ Grimmchild.py           # 主程序
```

完整目录树见仓库 README，里面列出了每一帧动画的来源编号。

---

## 用到的库

| 库 | 用途 |
|---|---|
| `sys` / `os` | 系统路径与文件操作 |
| `random` / `math` | 随机行为与数学计算 |
| `PyQt5.QtWidgets` | 窗口、系统托盘、菜单 |
| `PyQt5.QtCore` | 定时器、坐标、矩形区域 |
| `PyQt5.QtGui` | 图像渲染、变换、图标 |
| `PyQt5.QtMultimedia` | 音效与背景音乐播放 |

整体依赖很轻——一个 PyQt5 就把窗口、绘图、动画、音效、定时器全包了，非常适合做这种「桌面级」的小应用。

---

## 写在最后

做这个项目的初衷其实很简单：**想让那只原作里短暂相伴的小生物，能在我的桌面上多陪我飞一会儿**。

过程中遇到的一些有意思的小问题：

- 怎么让一只桌宠「不烦人」——靠的是休眠机制和合理的行为冷却区间
- 怎么让一群桌宠「不打架看着像乱码」——靠的是固定攻击冷却 + 全局对战触发节拍
- 怎么让动画看起来不卡——靠的是 60 FPS 帧驱动 + 与计时共用同一节拍

如果你也喜欢《空洞骑士》，或者只是想在自己的桌面上养一只能自己成长的小生物，欢迎去仓库点个 Star：

> 项目地址：<https://github.com/FangTangWei/hollow_knight_Grimmchild>

也欢迎提 Issue / PR 一起把它做得更好——比如新的行为状态、新的生态规则、或者更多的原作角色桌宠。

---

## 致谢与版权

本项目仅供学习与交流使用。游戏素材版权归 **Team Cherry**（《空洞骑士》开发商）所有。

- [Team Cherry](https://www.teamcherry.com.au/) — 《空洞骑士》开发商
- 格林之子原作角色设计 & 音效素材来源
- [AssetStudioModGUI](https://github.com/aelurum/AssetStudio) — Unity 资源提取工具
- Game Object Dump — 动画数据导出工具

如果你还没玩过《空洞骑士》，强烈推荐——它不仅是一款游戏，也是一只小生物的故乡。
