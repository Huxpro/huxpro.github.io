---
title: "7.Hash Table"
subtitle: "LeetCode「Explore-Learn」"
layout: post
author: "echisenyang"
header-style: text
hidden: true
catalog: true
tags:
  - 笔记
  - 刷题
  - leetcode
---

## 【进度汇总】

|                 时间                  |                             题号                             | 总结                                                         |
| :-----------------------------------: | :----------------------------------------------------------: | :----------------------------------------------------------- |
| **<font color=red>2020.03.06</font>** |                 **制定刷题计划，开始刷题啦**                 |                                                              |
|         **2020.03.07-03.09**          | 【框架：双指针、哨兵节点】【算法：三步断链法、Floyd's cycle detection、链表拆并等】 | **Explore-Learn[1.链表]**                                    |
|           **2020.03.10-13**           | 【框架：先根中根后根遍历、BFS】【算法：用栈实现非递归、递归、双栈双树等】 | **Explore-Learn[2.二叉树]**                                  |
|            **2020.03.15**             | 【框架：先根后根遍历、BFS\DFS】【算法：用栈实现先根非递归、用双栈实现后根非递归、用队列实现非递归层次遍历BFS、递归实现DFS】 | **Explore-Learn[3.N叉树]**                                   |
|         **2020.03.16-03.17**          | 【框架：二叉搜索树】【算法：插入、查找、删除、DFS+中根遍历、递归】 | **Explore-Learn[4.二叉搜索树]**                              |
| **<font color=red>2020.03.18</font>** | **整理1-3月份working list｜2020plan list｜程序员面试计划路线** |                                                              |
|                  =.=                  |          03.18-03.24休息了一周，忙别的，赶紧刷起来           | =.=                                                          |
|         **2020.03.25-03.26**          | 【框架：Prefix Tree】【children[26]+isEnd，**<font color=red>too hard</font>**】 | **<font color=red>Explore-Learn[5.Prefix Tree]</font>**      |
|                 03.27                 | 「std::vector vs std::array」「std::queue」「std::set vs std::unordered_set」「std::stack」 | cpp reference                                                |
|         **2020.03.28-03.31**          | 【框架：Queue & Stack】【算法：Queue+BFS/BFS、Stack+DFS/DFS/vector+DFS】 |                                                              |
|              2020.04.01               |            【Hash Table】217. Contains Duplicate             | python set                                                   |
|                                       |        【Hash Table】349. Intersection of Two Arrays         | **python set a.intersection(b) 妙用**                        |
|                                       |               【Hash Table】202. Happy Number                | **python 妙用set作为while循环终止的条件**                    |
|                                       |                   【Hash Table】1. Two Sum                   | **python dict记录第二个元素位置的妙用**                      |
|                                       |            【Hash Table】205. Isomorphic Strings             | **python zip的妙用**                                         |
|                                       |      【Hash Table】599. Minimum Index Sum of Two Lists       | **python dict 登峰造极**                                     |
|                                       |    【Hash Table】387. First Unique Character in a String     | **python collections.Counter与dict的妙用**                   |
|                                       |       【Hash Table】350. Intersection of Two Arrays II       | **python collections.Counter与list的妙用**                   |
|                                       |           【Hash Table】219. Contains Duplicate II           | **python dict记录第二个元素位置的妙用**                      |
|                                       |               【Hash Table】49. Group Anagrams               | **python tuple(sorted(s))作为key**                           |
|                                       |                【Hash Table】36. Valid Sudoku                | **python interview封装风格+set的妙用**                       |
|                                       |          【didnt work out】Find Duplicate Subtrees           | **<font color=red>python+dfs?</font>**                       |
|                                       |                    771. Jewels and Stones                    | .count()                                                     |
|                                       | 【didnt work out】Longest Substring Without Repeating Characters | It is all patterns... this is called "**sliding window**". Get into the habit of recognizing sliding window problems whenever you see "substring". |
|                                       |                         454. 4Sum II                         | 天才想法                                                     |
|                                       |                 347. Top K Frequent Elements                 | **count.most_common(k)**                                     |
|                                       |              380. Insert Delete GetRandom O(1)               | **interview风格题目，妙用dict查询o(1)的特性**                |
|                                       |                                                              |                                                              |
|                                       |                                                              |                                                              |


![NmjqTN](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/NmjqTN.png)

![ZRYxRe](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/ZRYxRe.png)

### Explore-Learn[7.Hash Table]

`Hash Table` is a data structure which organizes data using `hash functions` in order to support quick insertion and search.

There are two different kinds of hash tables: **hash set and hash map**.

- The `hash set` is one of the implementations of a `set` data structure to store `no repeated values`.
- The `hash map` is one of the implementations of a `map` data structure to store `(key, value)` pairs.

It is `easy to use` a hash table with the help of `standard template libraries`. Most common languages such as Java, C++ and Python support both hash set and hash map.

|          |           C++           | Python |
| :------: | :---------------------: | :----: |
| hash set |   unordered_set\<int\>   |  set   |
| hash map | unordered_map\<int, int\> |  dict  |

### scenario

- typically, a hash **set** is used to `check if a value has ever appeared or not`.
- The first scenario to use a **hash map** is that we `need more information` rather than only the key. Then we can `build a mapping relationship between key and information` by hash map.

### 「python dict」

| Method                                                       | Description                                                  |
| :----------------------------------------------------------- | :----------------------------------------------------------- |
| [clear()](https://www.w3schools.com/python/ref_dictionary_clear.asp) | Removes all the elements from the dictionary                 |
| [copy()](https://www.w3schools.com/python/ref_dictionary_copy.asp) | Returns a copy of the dictionary                             |
| [fromkeys()](https://www.w3schools.com/python/ref_dictionary_fromkeys.asp) | Returns a dictionary with the specified keys and value       |
| [get()](https://www.w3schools.com/python/ref_dictionary_get.asp) | Returns the value of the specified key                       |
| **[items()](https://www.w3schools.com/python/ref_dictionary_items.asp)** | Returns a list containing a tuple for each key value pair    |
| **[keys()](https://www.w3schools.com/python/ref_dictionary_keys.asp)** | Returns a list containing the dictionary's keys              |
| [pop()](https://www.w3schools.com/python/ref_dictionary_pop.asp) | Removes the element with the specified key                   |
| [popitem()](https://www.w3schools.com/python/ref_dictionary_popitem.asp) | Removes the last inserted key-value pair                     |
| [setdefault()](https://www.w3schools.com/python/ref_dictionary_setdefault.asp) | Returns the value of the specified key. If the key does not exist: insert the key, with the specified value |
| [update()](https://www.w3schools.com/python/ref_dictionary_update.asp) | Updates the dictionary with the specified key-value pairs    |
| **[values()](https://www.w3schools.com/python/ref_dictionary_values.asp)** | Returns a list of all the values in the dictionary           |

####  The Principle of Hash Table

The key idea of Hash Table is to use a hash function to `map keys to buckets`. To be more specific,

1. When we **insert** a new key, the hash function will decide which bucket the key should be assigned and the key will be stored in the corresponding bucket;

2. When we want to **search** for a key, the hash table will use the `same` hash function to find the corresponding bucket and search only in the specific bucket.

> 相当于不论hash table中有多少元素，插入与查找都是 $O(1)$ 级别的效率。

- There are **two essential factors** that you should pay attention to when you are going to design a hash table.

![8ge9Ui](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/8ge9Ui.png)

![PRky9n](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/PRky9n.png)

### [code]-217. Contains Duplicate

```python
/*
Given an array of integers, find if the array contains any duplicates.

Your function should return true if any value appears at least twice in the array, and it should return false if every element is distinct.
*/

class Solution:
    def containsDuplicate(self, nums: List[int]) -> bool:
        hashset=set()
        for i in nums:
            if i in hashset:
                return True
            else:
                hashset.add(i)
        return False
```

### [code]-349. Intersection of Two Arrays

```python
class Solution:
    def intersection(self, nums1: List[int], nums2: List[int]) -> List[int]:
        return list(set(nums1).intersection(set(nums2)))
```

### [code]-202. Happy Number

```python
/*
A happy number is a number defined by the following process: Starting with any positive integer, replace the number by the sum of the squares of its digits, and repeat the process until the number equals 1 (where it will stay), or it loops endlessly in a cycle which does not include 1. Those numbers for which this process ends in 1 are happy numbers.
*/

>>> Input: 19
    Output: true
    Explanation: 
    12 + 92 = 82
    82 + 22 = 68
    62 + 82 = 100
    12 + 02 + 02 = 1
    
class Solution:
    def isHappy(self, n: int) -> bool:
        hashset=set()
        while n!=1:
            n = sum([int(i)*int(i) for i in str(n)])
            if n in hashset:
                return False
            hashset.add(n)
        return True
```

### [code]-1. Two Sum

```python
/*
Given an array of integers, return indices of the two numbers such that they add up to a specific target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.
*/

>>> Given nums = [2, 7, 11, 15], target = 9,
    Because nums[0] + nums[1] = 2 + 7 = 9,
    return [0, 1].
    
class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        hashmap={}
        for idx,val in enumerate(nums):
            if (target-val in hashmap.keys()):
                return [hashmap[target-val],idx]
            else:
                hashmap[val] = idx
        return []
```

> 直接用 `.index()` 的方式会出现问题，比如[3,3]这种情况，第二个3的index还是0
>
> 转用hashmap后，记录第二个元素的index，第一个元素的index从hashmap中取【秒啊】

### [code]-205. Isomorphic Strings

```python
/*
Given two strings s and t, determine if they are isomorphic.

Two strings are isomorphic if the characters in s can be replaced to get t.

All occurrences of a character must be replaced with another character while preserving the order of characters. No two characters may map to the same character but a character may map to itself.
*/

>>> Input: s = "paper", t = "title"
	Output: true
        
zip(s,t)= "paper"  
          "title" 
		  
class Solution:
    def isIsomorphic(self, s: str, t: str) -> bool:
        return len(set(zip(s,t)))==len(set(s))==len(set(t))
```

> 太强了叭，zip的妙用

### [code]-599. Minimum Index Sum of Two Lists

```python
/*
找到共有元素的最小index和对应的那个元素
*/

>>> Input:
    ["Shogun", "Tapioca Express", "Burger King", "KFC"]
    ["KFC", "Shogun", "Burger King"]
    Output: ["Shogun"]
    Explanation: The restaurant they both like and have the least index sum is "Shogun" with index sum 1 (0+1).

class Solution:
    def findRestaurant(self, list1: List[str], list2: List[str]) -> List[str]:
        res_dict={}
        for idx,val in enumerate(list1):
            if val in list2:
                res_dict[val]=idx+list2.index(val)
        minv = min([val for key,val in res_dict.items()])
        return [key for key,val in res_dict.items() if val==minv]
```

> dict的妙用，登峰造极

### [code]-387. First Unique Character in a String

```python
/*
Given a string, find the first non-repeating character in it and return it's index. If it doesn't exist, return -1.
*/

>>> s = "leetcode"
    return 0.

    s = "loveleetcode",
    return 2.
```

- **Time Limit Exceeded**

```python
class Solution:
    def firstUniqChar(self, s: str) -> int:
        res_list = [s.count(w) for w in s]
        return res_list.index(1) if 1 in res_list else -1
```

- **妙用collections.Counter**

```python
class Solution:
    def firstUniqChar(self, s: str) -> int:
        """
        :type s: str
        :rtype: int
        """
        # build hash map : character and how often it appears
        count = collections.Counter(s)
        
        # find the index
        for idx, ch in enumerate(s):
            if count[ch] == 1:
                return idx     
        return -1
```

### 「python list」

| Method                                                       | Description                                                  |
| :----------------------------------------------------------- | :----------------------------------------------------------- |
| [**append()**](https://www.w3schools.com/python/ref_list_append.asp) | Adds an element at the end of the list                       |
| [clear()](https://www.w3schools.com/python/ref_list_clear.asp) | Removes all the elements from the list                       |
| [copy()](https://www.w3schools.com/python/ref_list_copy.asp) | Returns a copy of the list                                   |
| [**count()**](https://www.w3schools.com/python/ref_list_count.asp) | Returns the number of elements with the specified value      |
| [extend()](https://www.w3schools.com/python/ref_list_extend.asp) | Add the elements of a list (or any iterable), to the end of the current list |
| **[index()](https://www.w3schools.com/python/ref_list_index.asp)** | Returns the index of the first element with the specified value |
| [insert()](https://www.w3schools.com/python/ref_list_insert.asp) | Adds an element at the specified position                    |
| [pop()](https://www.w3schools.com/python/ref_list_pop.asp)   | Removes the element at the specified position                |
| [remove()](https://www.w3schools.com/python/ref_list_remove.asp) | Removes the first item with the specified value              |
| [**reverse()**](https://www.w3schools.com/python/ref_list_reverse.asp) | Reverses the order of the list                               |
| **[sort()](https://www.w3schools.com/python/ref_list_sort.asp)** | Sorts the list                                               |

> enumerate()

### [code]-350. Intersection of Two Arrays II

```python
//Given two arrays, write a function to compute their intersection.

>>> Input: nums1 = [1,2,2,1], nums2 = [2,2]
	Output: [2,2]
        
class Solution(object):
    def intersect(self, nums1, nums2):

        counts = collections.Counter(nums1)
        res = []

        for num in nums2:
            if counts[num] > 0:
                res.append(num)
                counts[num] -= 1

        return res
```

### [code]-219. Contains Duplicate II

```python
/*
Given an array of integers and an integer k, find out whether there are two distinct indices i and j in the array such that nums[i] = nums[j] and the absolute difference between i and j is at most k.
*/

>>> Input: nums = [1,0,1,1], k = 1
	Output: true
        
class Solution:
    def containsNearbyDuplicate(self, nums, k):
        dic = {}
        for i, v in enumerate(nums):
            if v in dic and i - dic[v] <= k:
                return True
            dic[v] = i
        return False
```

> 与1. Two Sum有异曲同工之妙，都是利用dict对第二个元素的index进行记录，而不是记录第一个

### 【Design the Key】

### [code]-49. Group Anagrams

```python
>>> Input: ["eat", "tea", "tan", "ate", "nat", "bat"],
    Output:
    [
        ["ate","eat","tea"],
        ["nat","tan"],
        ["bat"]
    ]
    
class Solution(object):
    def groupAnagrams(self, strs):
        ans = collections.defaultdict(list)
        for s in strs:
            ans[tuple(sorted(s))].append(s)
        return ans.values()
```

![ioJjNo](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/ioJjNo.png)



### [code]-36. Valid Sudoku

```python
class Solution:
    def isValidSudoku(self, board):
        return (self.is_row_valid(board) and
                self.is_col_valid(board) and
                self.is_square_valid(board))

    def is_row_valid(self, board):
        for row in board:
            if not self.is_unit_valid(row):
                return False
        return True

    def is_col_valid(self, board):
        for col in zip(*board):
            if not self.is_unit_valid(col):
                return False
        return True

    def is_square_valid(self, board):
        for i in (0, 3, 6):
            for j in (0, 3, 6):
                square = [board[x][y] for x in range(i, i + 3) for y in range(j, j + 3)]
                if not self.is_unit_valid(square):
                    return False
        return True

    def is_unit_valid(self, unit):
        unit = [i for i in unit if i != '.']
        return len(set(unit)) == len(unit)
```

### 【Design the Key - Summary】

![O6I7bk](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/O6I7bk.png)

![dXyp16](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/dXyp16.png)

### [code]-771. Jewels and Stones

```python
>>> Input: J = "aA", S = "aAAbbbb"
	Output: 3
        
class Solution:
    def numJewelsInStones(self, J: str, S: str) -> int:
        res = 0
        for j in J:
            res += S.count(j)
        return res
```

### [code]-454. 4Sum II

```python
>>> Input:
    A = [ 1, 2]
    B = [-2,-1]
    C = [-1, 2]
    D = [ 0, 2]

    Output:
    2

    Explanation:
    The two tuples are:
    1. (0, 0, 0, 1) -> A[0] + B[0] + C[0] + D[1] = 1 + (-2) + (-1) + 2 = 0
    2. (1, 1, 0, 0) -> A[1] + B[1] + C[0] + D[0] = 2 + (-1) + (-1) + 0 = 0


class Solution:
    def fourSumCount(self, A, B, C, D):
        ab = {}
        for i in A:
            for j in B:
                ab[i+j] = ab.get(i+j, 0) + 1
        
        ans = 0
        for i in C:
            for j in D:
                ans += ab.get(-i-j, 0)       
        return ans
```

### [code]-347. Top K Frequent Elements

```python
import collections

class Solution(object):
    def topKFrequent(self, nums, k):
        """
        :type nums: List[int]
        :type k: int
        :rtype: List[int]
        """
        count = collections.Counter(nums)   
        return [w[0] for w in count.most_common(k)]
```

### [code]-380. Insert Delete GetRandom O(1)

Quite a number of people have posted their C++ code based on the same idea, which is:

1. A plain list does most of the job. It makes sure `insert` and `getRandom` is O(1).
2. The dictionary comes in handy when you need to make `remove` O(1). The dictionary maps the values to their indices in the list, so when you want to quickly remove something from the list, you always know where to start.

```python
import random
class RandomizedSet(object):
    def __init__(self):
        self.l = []
        self.d = {}

    def insert(self, val):
        if val in self.d:
            return False
        self.d[val] = len(self.l)
        self.l.append(val)
        return True        

    def remove(self, val):
        if val not in self.d:
            return False
        i, newVal = self.d[val], self.l[-1]
        self.l[i], self.d[newVal] = newVal, i
        del self.d[val]
        self.l.pop()
        return True

    def getRandom(self):
        return random.choice(self.l)
        


# Your RandomizedSet object will be instantiated and called as such:
# obj = RandomizedSet()
# param_1 = obj.insert(val)
# param_2 = obj.remove(val)
# param_3 = obj.getRandom()
```

