---
layout: post
title: "计算机、AI 与数据处理中常见后缀名速查"
subtitle: "从代码、配置、数据文件到模型权重和实验产物，一次分清常见后缀的用途与坑"
date: 2026-06-09 20:30:00 +0800
author: "CodeWater517"
header-img: "img/home-bg-geek.jpg"
header-mask: 0.35
tags:
  - 计算机
  - AI
  - 数据
  - 工程实践
  - 工具
last_modified_at: 2026-06-09 20:30:00 +0800
revision_history:
  - time: 2026-06-09 20:30:00 +0800
    description: "新增计算机、AI 与数据处理中常见后缀名速查。"
---

> 后缀名不是装饰。它通常告诉你：这个文件应该被什么工具打开、里面大概是什么结构、能不能直接提交到 Git、能不能用文本编辑器查看、能不能被模型或数据处理程序加载。

## 结论

看一个陌生文件时，先不要急着双击。比较稳的判断顺序是：

```text
先看文件名和后缀
-> 再看所在目录和 README
-> 再看加载它的代码
-> 必要时用 file、head、less、du 等命令检查
-> 最后再决定用什么工具打开或处理
```

在计算机、AI 和数据处理领域，后缀大致分成两类。

第一类是 **文件扩展名**，例如 `.py`、`.json`、`.csv`、`.parquet`、`.pt`、`.gguf`。它通常标记文件格式。

第二类是 **命名后缀**，例如 `train_clean.jsonl` 里的 `_clean`，`model-instruct` 里的 `-instruct`，`llama-q4.gguf` 里的 `q4`。它不一定是正式格式，但经常表达版本、用途、阶段、精度、数据切分或模型训练方式。

这篇文章把它们放在一起讲，因为真实项目里你看到的往往是这样的文件名：

```text
dataset_train_clean_v2.jsonl
embeddings_20260609.parquet
qwen-instruct-lora-merged-fp16.safetensors
llama-7b-q4_k_m.gguf
experiment_003_metrics.csv
```

只认识 `.jsonl`、`.parquet`、`.safetensors` 还不够，还要读懂 `train`、`clean`、`merged`、`fp16`、`q4_k_m` 这些后缀信息。

## 1. 代码与脚本后缀

这类文件通常可以用文本编辑器打开，主要区别在于解释器、编译器、运行环境不同。

| 后缀 | 常见含义 | 常见场景 |
| --- | --- | --- |
| `.py` | Python 源代码 | 数据处理、机器学习、后端脚本、自动化 |
| `.ipynb` | Jupyter Notebook | 交互式分析、教学、实验探索 |
| `.js` | JavaScript | 前端、Node.js 脚本 |
| `.ts` | TypeScript | 类型更严格的 JavaScript 项目 |
| `.jsx` | React JavaScript 组件 | 前端界面 |
| `.tsx` | React TypeScript 组件 | 前端工程项目 |
| `.java` | Java 源代码 | 后端服务、Android、课程项目 |
| `.go` | Go 源代码 | 后端服务、命令行工具、云原生 |
| `.rs` | Rust 源代码 | 系统工具、高性能服务 |
| `.c` | C 源代码 | 系统编程、嵌入式、课程实验 |
| `.cpp` / `.cc` | C++ 源代码 | 算法、推理引擎、性能敏感模块 |
| `.h` / `.hpp` | C/C++ 头文件 | 声明函数、类型、接口 |
| `.cu` | CUDA 源代码 | GPU 编程、深度学习算子 |
| `.sh` | Shell 脚本 | Linux/macOS 自动化、训练启动脚本 |
| `.ps1` | PowerShell 脚本 | Windows 自动化 |
| `.sql` | SQL 脚本 | 数据库建表、查询、数据修复 |
| `.r` | R 脚本 | 统计分析、科研绘图 |

新手最容易混淆的是 `.py` 和 `.ipynb`。`.py` 更适合工程化、版本管理和自动运行；`.ipynb` 更适合探索、展示和交互式分析。如果一个实验要长期复现，建议把核心逻辑从 Notebook 抽到 `.py` 里。

## 2. Web 与前端项目后缀

| 后缀 | 常见含义 | 常见场景 |
| --- | --- | --- |
| `.html` | 网页结构 | 静态页面、模板 |
| `.css` | 样式表 | 页面样式 |
| `.scss` / `.sass` | CSS 预处理格式 | 较复杂的样式工程 |
| `.vue` | Vue 单文件组件 | Vue 项目 |
| `.svelte` | Svelte 组件 | Svelte 项目 |
| `.wasm` | WebAssembly 二进制 | 浏览器中的高性能模块 |
| `.map` | Source map | 调试压缩后的前端代码 |

前端构建后经常会出现带哈希的文件名：

```text
app.8f3a2c1.js
style.4b91d0e.css
```

中间那段看似随机的字符一般是内容哈希，用来做浏览器缓存控制。它不是业务版本号，不需要手动修改。

## 3. 配置、文档与元数据后缀

这类文件大多是文本格式，但语法差异很大。复制粘贴时最容易出问题的是缩进、引号、冒号和换行。

| 后缀 | 常见含义 | 常见场景 |
| --- | --- | --- |
| `.md` | Markdown 文档 | README、博客、笔记、文档 |
| `.txt` | 普通文本 | 说明、日志片段、列表 |
| `.json` | JSON 数据 | 配置、接口数据、标注文件 |
| `.json5` | 更宽松的 JSON | 允许注释的配置 |
| `.yaml` / `.yml` | YAML 配置 | Docker Compose、CI、Kubernetes、模型配置 |
| `.toml` | TOML 配置 | Python 项目、Rust 项目 |
| `.ini` / `.cfg` / `.conf` | 配置文件 | 系统服务、工具配置 |
| `.env` | 环境变量文件 | 本地密钥、端口、数据库地址 |
| `.xml` | XML 数据 | 老系统、Android、配置交换 |
| `.lock` | 依赖锁文件 | 固定依赖版本 |

`.env` 文件尤其要小心。它常常包含数据库密码、API key、访问令牌，不应该随便提交到公开仓库。通常会提交 `.env.example`，但不提交真正的 `.env`。

`.lock` 文件不要因为“看不懂”就删。它的作用是锁定依赖版本，让别人安装到尽量一致的环境。常见例子有 `package-lock.json`、`pnpm-lock.yaml`、`yarn.lock`、`poetry.lock`、`Cargo.lock`。

## 4. 数据处理常见后缀

数据文件后缀不仅影响打开方式，也影响读取速度、存储体积、类型保真和跨语言兼容性。

| 后缀 | 常见含义 | 适合场景 | 注意点 |
| --- | --- | --- | --- |
| `.csv` | 逗号分隔表格 | 小到中等规模表格数据 | 编码、逗号转义、日期类型容易出问题 |
| `.tsv` | Tab 分隔表格 | 文本中逗号很多的数据 | 仍然是纯文本，类型信息弱 |
| `.json` | JSON 对象或数组 | 配置、接口、嵌套结构 | 大文件一次性加载会占内存 |
| `.jsonl` / `.ndjson` | 一行一个 JSON | 训练数据、日志、流式处理 | 每行必须是独立合法 JSON |
| `.xlsx` | Excel 工作簿 | 人工查看和编辑表格 | 不适合大规模自动流水线 |
| `.parquet` | 列式存储格式 | 大规模分析、特征表、数据湖 | 适合 Spark、DuckDB、Pandas、Polars |
| `.arrow` | Apache Arrow 数据 | 跨语言列式内存格式 | 偏工程化数据交换 |
| `.orc` | 列式存储格式 | Hive、Spark 生态 | 大数据平台常见 |
| `.avro` | 行式序列化格式 | 消息、数据管道 | 常和 schema 一起用 |
| `.db` / `.sqlite` / `.sqlite3` | SQLite 数据库 | 本地数据库、轻量应用 | 不是普通文本，别直接手改 |
| `.pkl` / `.pickle` | Python pickle | Python 对象缓存 | 不要加载来源不明的 pickle |
| `.npy` | NumPy 单个数组 | 矩阵、向量、特征 | Python/NumPy 生态常见 |
| `.npz` | 多个 NumPy 数组压缩包 | 多数组打包 | 本质上是数组集合 |
| `.h5` / `.hdf5` | HDF5 文件 | 科学计算、大数组、老模型 | 层级结构，需专门工具查看 |

如果只是给人看，`.csv` 很方便。如果要处理上千万行数据，`.parquet` 往往更合适。如果是一行一条训练样本，`.jsonl` 比一个巨大 `.json` 数组更容易流式读取。

数据处理中还常见这些命名后缀：

| 命名后缀 | 常见含义 |
| --- | --- |
| `_raw` | 原始数据，通常不应直接改 |
| `_clean` | 清洗后的数据 |
| `_processed` | 已处理成模型或分析可用格式 |
| `_train` | 训练集 |
| `_val` / `_valid` | 验证集 |
| `_test` | 测试集 |
| `_sample` | 抽样数据 |
| `_dedup` | 去重后的数据 |
| `_normalized` | 归一化或标准化后的数据 |
| `_features` | 特征表 |
| `_labels` | 标签文件 |
| `_shard_00001` | 分片数据 |
| `_v1` / `_v2` | 数据版本 |

比较推荐的命名方式是：

```text
orders_raw_20260609.csv
orders_clean_v1.parquet
reviews_train_dedup_v2.jsonl
embeddings_modelA_20260609.parquet
```

让文件名同时表达：数据主题、处理阶段、版本或日期、格式。

## 5. 大模型与机器学习后缀

机器学习项目里，最常见的文件可以分成四类：权重、配置、分词器、训练输出。

| 后缀 | 常见含义 | 常见场景 |
| --- | --- | --- |
| `.pt` | PyTorch 模型或张量文件 | 权重、checkpoint、张量缓存 |
| `.pth` | PyTorch 权重文件 | 训练权重、模型参数 |
| `.ckpt` | checkpoint | 训练中断点、模型快照 |
| `.safetensors` | 安全张量格式 | Hugging Face 模型权重 |
| `.bin` | 二进制文件 | 老版模型权重、通用二进制 |
| `.onnx` | ONNX 模型 | 跨框架推理、部署 |
| `.pb` | TensorFlow protobuf 模型 | TensorFlow 生态 |
| `.tflite` | TensorFlow Lite 模型 | 移动端、边缘设备 |
| `.mlmodel` | Core ML 模型 | Apple 生态部署 |
| `.gguf` | llama.cpp 常见模型格式 | 本地大模型推理 |
| `.model` | 模型或分词器文件 | SentencePiece、传统模型 |
| `.vocab` | 词表 | 分词器、NLP 模型 |
| `.merges` | BPE 合并规则 | GPT 类 tokenizer |

大模型目录里还经常看到这些文件：

```text
config.json
generation_config.json
tokenizer.json
tokenizer.model
tokenizer_config.json
special_tokens_map.json
model.safetensors
model-00001-of-00004.safetensors
```

`model-00001-of-00004.safetensors` 表示模型权重被切成了多个分片。不要只复制其中一个文件，否则模型加载时会缺权重。

大模型名字里的后缀也很重要：

| 命名后缀 | 常见含义 |
| --- | --- |
| `base` | 基座模型，通常没有专门对话对齐 |
| `chat` | 面向对话的模型 |
| `instruct` | 指令微调模型 |
| `sft` | 监督微调版本 |
| `rlhf` | 使用人类反馈强化学习对齐 |
| `dpo` | 使用 DPO 等偏好优化方法 |
| `distill` | 蒸馏模型 |
| `lora` | LoRA 适配器或相关产物 |
| `merged` | 已把 LoRA 等适配器合并进主模型 |
| `fp32` | 32 位浮点精度 |
| `fp16` / `bf16` | 16 位浮点精度 |
| `int8` / `int4` | 整数量化版本 |
| `q4` / `q5` / `q8` | 常见量化等级 |
| `Q4_K_M` | GGUF 生态中的具体量化方案 |

这里要注意：`7b`、`13b`、`70b` 这类片段通常表示参数规模约为 70 亿、130 亿、700 亿，不是文件大小。模型文件实际占用空间还会受到精度、量化方式和分片方式影响。

## 6. 日志、缓存与实验产物后缀

这些文件看起来杂，但在排查实验和复现实验时很关键。

| 后缀或命名 | 常见含义 | 常见场景 |
| --- | --- | --- |
| `.log` | 日志文件 | 训练日志、服务日志、错误记录 |
| `.out` | 标准输出结果 | 服务器任务、批处理任务 |
| `.err` | 错误输出结果 | 集群任务、后台任务 |
| `.tmp` | 临时文件 | 程序运行中间状态 |
| `.cache` | 缓存文件或目录 | 依赖、模型、数据缓存 |
| `.bak` | 备份文件 | 手动或工具自动备份 |
| `.pid` | 进程 ID 文件 | 后台服务 |
| `.seed` | 随机种子记录 | 实验复现 |
| `.metrics` | 指标记录 | 训练、评估 |
| `.events` | TensorBoard 事件文件 | 训练可视化 |

训练项目里常见目录名也有固定含义：

```text
checkpoints/
logs/
runs/
outputs/
artifacts/
wandb/
tensorboard/
```

这些目录通常会很大，不一定适合提交到 Git。更好的做法是：代码和配置进 Git，大文件进对象存储、数据盘、模型仓库或实验管理平台。

## 7. 压缩包、镜像与归档后缀

| 后缀 | 常见含义 | 常见场景 |
| --- | --- | --- |
| `.zip` | 通用压缩包 | Windows/macOS 常见 |
| `.tar` | 打包但不压缩 | Linux 归档 |
| `.tar.gz` / `.tgz` | tar + gzip 压缩 | 源码包、数据集 |
| `.tar.bz2` | tar + bzip2 压缩 | 体积更小但较慢 |
| `.tar.xz` | tar + xz 压缩 | Linux 发行包 |
| `.7z` | 7-Zip 压缩包 | 高压缩率归档 |
| `.gz` | gzip 单文件压缩 | 日志、文本数据 |
| `.zst` | Zstandard 压缩 | 高速压缩和解压 |
| `.iso` | 光盘镜像 | 系统镜像 |
| `.img` | 磁盘镜像 | 系统、嵌入式 |

`.tar.gz` 不是两个文件后缀随便叠加，而是先 `tar` 打包，再用 `gzip` 压缩。解压后可能得到一个目录，也可能得到一个很大的单文件。

## 8. Git、容器与工程项目里的特殊文件

有些重要文件没有传统后缀，但它们在工程里很常见。

| 文件名 | 常见含义 |
| --- | --- |
| `README.md` | 项目入口说明 |
| `LICENSE` | 开源许可证 |
| `.gitignore` | 告诉 Git 忽略哪些文件 |
| `.gitattributes` | Git 属性配置 |
| `.dockerignore` | Docker 构建时忽略哪些文件 |
| `Dockerfile` | Docker 镜像构建文件 |
| `docker-compose.yml` | 多容器服务编排 |
| `Makefile` | 常用命令集合 |
| `requirements.txt` | Python pip 依赖 |
| `pyproject.toml` | Python 项目配置 |
| `package.json` | Node.js 项目配置 |
| `tsconfig.json` | TypeScript 配置 |
| `vite.config.ts` | Vite 配置 |
| `.prettierrc` | Prettier 格式化配置 |
| `.eslintrc` | ESLint 配置 |

判断一个项目怎么启动时，优先看 `README.md`、`package.json`、`pyproject.toml`、`docker-compose.yml`、`Makefile`。这些文件比单个源码文件更能说明项目的真实入口。

## 9. 容易误判的后缀

有些后缀太泛化，不能只靠后缀判断内容。

| 后缀 | 为什么容易误判 |
| --- | --- |
| `.bin` | 只表示二进制，可能是模型、固件、缓存或任意数据 |
| `.dat` | 只表示 data，具体格式要看生成程序 |
| `.model` | 可能是分词器、传统 ML 模型或其他模型文件 |
| `.ckpt` | 不同框架的 checkpoint 结构可能完全不同 |
| `.db` | 可能是 SQLite，也可能是其他数据库文件 |
| `.log` | 可能是纯文本，也可能混有结构化 JSON |
| `.json` | 可能是配置，也可能是百万行级大数据 |
| `.pkl` | Python pickle，来源不明时有安全风险 |

如果后缀看不出来，可以先用这些命令做温和检查：

```bash
file unknown.bin
du -h unknown.bin
head -n 5 data.jsonl
less train.log
```

如果是二进制模型或数据库文件，不要用文本编辑器强行保存。打开看一眼通常没问题，手动改里面的字节就很容易破坏文件。

## 10. 哪些文件适合提交到 Git

一个粗略原则是：

| 适合提交 | 不适合直接提交 |
| --- | --- |
| 源代码 | 大模型权重 |
| 小型配置文件 | 原始大数据集 |
| README 和文档 | 训练 checkpoint |
| 依赖锁文件 | 缓存目录 |
| 小型示例数据 | 日志海量输出 |
| `.env.example` | 真正的 `.env` |
| 测试用小 fixture | 私密数据、密钥、token |

如果你不确定某个大文件该不该进 Git，先问自己三个问题：

1. 别人 clone 项目时真的需要它吗？
2. 它能不能从脚本、下载链接或数据平台重新生成？
3. 它里面有没有隐私、密钥、版权受限内容？

多数情况下，仓库里应该保存“如何得到数据和模型”的说明，而不是把所有大文件都塞进去。

## 11. 推荐命名习惯

文件名最好让人一眼看出：主题、阶段、版本、格式。

比较清楚的命名：

```text
papers_raw_20260609.csv
papers_clean_v1.parquet
qa_train_sft_v2.jsonl
bert_embeddings_fp16.parquet
qwen_instruct_lora_merged_fp16.safetensors
llama_7b_instruct_q4_k_m.gguf
experiment_005_metrics.csv
experiment_005_config.yaml
experiment_005_train.log
```

不太推荐的命名：

```text
new.csv
final.csv
final2.csv
data_latest.json
model_good.pt
test_new_new.py
```

`final2` 通常不会是 final。更稳的是使用日期、版本号、实验编号或 Git commit：

```text
dataset_clean_v3.parquet
run_20260609_2030_metrics.csv
exp_012_config.yaml
model_epoch10_step20000.safetensors
```

## 12. 一张新手速查表

如果你只想快速判断，先记这张表。

| 你看到的后缀 | 先怎么理解 |
| --- | --- |
| `.py` | Python 代码 |
| `.ipynb` | Jupyter Notebook |
| `.md` | Markdown 文档 |
| `.json` | 结构化文本数据或配置 |
| `.yaml` / `.yml` | 配置文件 |
| `.env` | 环境变量，可能有敏感信息 |
| `.csv` / `.tsv` | 表格文本数据 |
| `.jsonl` | 一行一条 JSON，常见于训练数据 |
| `.parquet` | 高效列式数据，常见于数据分析 |
| `.db` / `.sqlite` | 本地数据库 |
| `.pkl` | Python 序列化对象，谨慎加载 |
| `.npy` / `.npz` | NumPy 数组 |
| `.pt` / `.pth` | PyTorch 权重或张量 |
| `.ckpt` | 模型 checkpoint |
| `.safetensors` | 模型权重，常见于大模型 |
| `.onnx` | 跨框架模型格式 |
| `.gguf` | 本地大模型推理格式 |
| `.log` | 日志 |
| `.zip` / `.tar.gz` | 压缩包或归档 |
| `.lock` | 依赖锁定文件 |

## 最后：后缀是线索，不是证据

后缀名能帮你快速判断，但不能替代上下文。一个文件叫 `data.json`，它可能是几十行配置，也可能是几十 GB 的训练数据。一个文件叫 `model.bin`，它可能是模型权重，也可能是完全无关的二进制缓存。

比较可靠的习惯是：

- 先看 README 和目录结构；
- 再看代码里怎么读取这个文件；
- 对大文件先看大小，不要贸然打开；
- 对 `.env`、`.pkl`、未知 `.bin` 保持谨慎；
- 对数据和模型保留版本、日期和处理阶段；
- 对真正重要的产物，写清楚它从哪里来、怎么生成、怎么验证。

能读懂后缀，不只是为了“知道这是什么文件”。更重要的是，你会慢慢形成一种工程直觉：哪些东西是源头，哪些是中间产物，哪些能复现，哪些该备份，哪些绝不能随便传到公开仓库。
