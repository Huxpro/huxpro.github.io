---
layout:       post
title:        "LeetCode 1253: reconstruct a 2-row binary matrix"
author:       "Jake"
header-style: text
catalog:      true
tags:
    - Tech
    - LeetCode
    - Interview
    - Greedy Algorithm
    - 贪心算法
---

# LeetCode 1253: 重构 2 行二进制矩阵

## 题目分析
这道题要抓住不变量，就是每行每列的和。因为行数为 2 是固定的，任意一列的排布只有 4 种可能：
```python
# case 1: colSum = 0
ret_2d_lst[0][j] = 0
ret_2d_lst[1][j] = 0

# case 2: colSum = 1
ret_2d_lst[0][j] = 0
ret_2d_lst[1][j] = 1

# case 3: colSum = 1
ret_2d_lst[0][j] = 1
ret_2d_lst[1][j] = 0

# case 4: colSum = 2
ret_2d_lst[0][j] = 1
ret_2d_lst[1][j] = 1
```

##### 对 4 种情况比后得出结论：
colSum = 0 和 colSum = 2 的时候，列的排布是固定的，那么**只要专注于 1 的排布即可**。
##### 小技巧
目的是**只要专注于 1 的排布即可**，从遍历 colSum 很容易看到元素的值，而 upper 和 lower 的和包括了元素值为 2 的情况，如何得出只含有元素值为 1 集合的累加和呢？
1. 计算出列和为 2 的数量 twoNum
2. 用 upper 行和 lower 行的“和”减去 twoNum 后得到**元素为 1 的集合的和**。

## 如何贪心
按照便利顺序，肯定是从第 0 行到第 1 行，那么能放在第 0 行就不要放在第 1 行。

## Corner Case
1. `(upper + lower) != sum(colSum)`
2. `twoNum <= min(upper_1, lower_1)`
注：第二点比较难想

## Python 技巧：列表表达式
1. 如何快速初始化一个元素全为 0 的？
```python
ret_2d_lst = [[0] * column_len for i in range(row_len)]
```

2. 如何筛选出元素等于 2 的子列表？
```python
son_lst = [i for i in lst if i == 2]
```

## Java 技巧：Stream
1. 如何计算 `int[]` 数组中元素值为 2 的个数
```java
int[] arr = new int[]{1, 2, 1, 2};
// must sure that twoNum <= Integer.MIN_VALUE
int twoNum = (int)Arrays.stream(arr).filter(x -> x == 2).count()  
```

2. 把 Array 转成 List 的函数
```java
// initialization
int[] arr1 = new[]{1, 2, 3};
int[] arr2 = new[]{1, 2, 3};

// convert one
List lst1 = Arrays.asList(arr1);
// also can convert two
List lst12 = Arrays.asList(arr1, arr2);
```

