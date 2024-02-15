---
layout:       post
title:        "Difference between Hive SQL and Presto SQL"
author:       "Jake"
header-style: text
catalog:      true
tags:
    - Tech
    - SQL
    - Hive
    - Presto
---

# Hive 和 Presto 的 SQL 方言差异汇总
可以粗略分成 3 种：
1. 细节语法不同（特点是关键字和符号一样）
2. 同样功能函数名不同
3. 计算返回结果不同


## 1. 细节语法不同
1.1 关键字一样，语法不同
* **DISTINCT**

```sql
/* Deduplicate one row */
-- Hive, no need of brackets
SELECT count(distinct uuid) as uv;

-- Presto, must be with brackets
SELECT count(distinct(uuid)) as uv;
```

1.2 符号一样
* 数组下标的0/1之争

```sql
/* Get the first element of one array */
-- Hive, array starts from 0
SELECT ARRAY[1, 2, 3][0];

-- Presto, array starts from 1
SELECT ARRAY[1, 2, 3][1];
```

## 2. 同样功能函数名不同

|           函数作用            |               Presto SQL 函数名称                |              Hive SQL 函数名称               |
| :---------------------------: | :----------------------------------------------: | :------------------------------------------: |
|           null 转换           |                    coalesce()                    |              nvl() / coalesce()              |
|     获取数组或者字典长度      |                  cardinality()                   |                    size()                    |
| 提取 Json 串中指定 key 对应值 | json_extract_scalar('{"key": "value"}', '$.key') | json_get_object('{"key": "value"}', '$.key') |

ToDo：
count(distinct one_arg) 只有一个输入参数的情况下，hive 和 presto 的结果是一样的！


## 3. 计算返回结果不同
由于 Hive 对整数做了“隐式处理”，整数之间除法计算得到的是浮点数，而 Presto 还是很传统地**按照 C 语言去约束整数除法计算，计算结果是整数**。两个整数相除如果想获得浮点数结果，就必须让其中一个数（我个人习惯于拿被除数，比较容易写）转型成浮点数。
```sql
/* Presto */
SELECT 1 / 2;  -- 0
SELECT 1.0 * 1 / 2;  -- 0.5
```
加餐：如果想要精确到小数点第 n 位，比如第 3 位怎么处理呢？解决办法很简单粗暴，就是让前面的浮点数 1 跟上 n 个 0，举例小数点后三位
```sql
/* Presto */
SELECT 1.000 * 1 / 2;  -- 0.500
```