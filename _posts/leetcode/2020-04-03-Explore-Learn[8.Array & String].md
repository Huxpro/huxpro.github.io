---
title: "8.Array & String"
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

|                 时间                  |                             题号                             | 总结                                                     |
| :-----------------------------------: | :----------------------------------------------------------: | :------------------------------------------------------- |
| **<font color=red>2020.03.06</font>** |                 **制定刷题计划，开始刷题啦**                 |                                                          |
|         **2020.03.07-03.09**          | 【框架：双指针、哨兵节点】【算法：三步断链法、Floyd's cycle detection、链表拆并等】 | **Explore-Learn[1.链表]**                                |
|           **2020.03.10-13**           | 【框架：先根中根后根遍历、BFS】【算法：用栈实现非递归、递归、双栈双树等】 | **Explore-Learn[2.二叉树]**                              |
|            **2020.03.15**             | 【框架：先根后根遍历、BFS\DFS】【算法：用栈实现先根非递归、用双栈实现后根非递归、用队列实现非递归层次遍历BFS、递归实现DFS】 | **Explore-Learn[3.N叉树]**                               |
|         **2020.03.16-03.17**          | 【框架：二叉搜索树】【算法：插入、查找、删除、DFS+中根遍历、递归】 | **Explore-Learn[4.二叉搜索树]**                          |
| **<font color=red>2020.03.18</font>** | **整理1-3月份working list｜2020plan list｜程序员面试计划路线** |                                                          |
|                  =.=                  |          03.18-03.24休息了一周，忙别的，赶紧刷起来           | =.=                                                      |
|         **2020.03.25-03.26**          | 【框架：Prefix Tree】【children[26]+isEnd，**<font color=red>too hard</font>**】 | **<font color=red>Explore-Learn[5.Prefix Tree]</font>**  |
|                 03.27                 | 「std::vector vs std::array」「std::queue」「std::set vs std::unordered_set」「std::stack」 | cpp reference                                            |
|         **2020.03.28-03.31**          | 【框架：Queue & Stack】【算法：Queue+BFS/BFS、Stack+DFS/DFS/vector+DFS】 |                                                          |
|           2020.04.01-04.02            | 【Hash Table】【**python**+set与dict的妙用+zip/collections.Counter/tuple(sorted(s))】 | python set                                               |
|              2020.04.03               |           【Array & String】724. Find Pivot Index            | python list                                              |
|                                       |    【Array】747. Largest Number At Least Twice of Others     | python **all(list)**                                     |
|                                       |                    【Array】66. Plus One                     | python list->str->int->str->list                         |
|                                       |               【Array】498. Diagonal Traverse                | python dict的妙用与list[::-1]的遍历方式                  |
|                                       |                  【Array】54. Spiral Matrix                  | python 数组的新循环遍历方式                              |
|                                       |               【Array】118. Pascal's Triangle                | python [[]]                                              |
|                                       |                   【string】67. Add Binary                   | 满满的细节                                               |
|                                       |               【string】28. Implement strStr()               |                                                          |
|                                       |             【string】14. Longest Common Prefix              | zip与set的妙用                                           |
|                                       |                【string】344. Reverse String                 | python对于交换两个元素非常友好                           |
|                                       |               【string】561. Array Partition I               | [::step]遍历方式                                         |
|                                       |                **Minimum Size Subarray Sum**                 | how to do?                                               |
|                                       |                         Rotate Array                         | nums[:] = nums[n-k:] + nums[:n-k]                        |
|                                       |                     Pascal's Triangle II                     | [x + y for x, y in zip([0]+row, row+[0])]                |
|                                       |                  Reverse Words in a String                   | " ".join(s.strip().split()[::-1])                        |
|                                       |                Reverse Words in a String III                 | " ".join(["".join(list(w)[::-1]) for w in s.split(" ")]) |
|                                       | Using nums[:] will not allocate new memory, instead will change the values already used by nums. |                                                          |
|                                       |             Remove Duplicates from Sorted Array              | OrderedDict.fromkeys(nums).keys()                        |
|                                       |                                                              |                                                          |
|                                       |                                                              |                                                          |

![ZRYxRe](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/ZRYxRe.png)

### Explore-Learn[8.Array & String]

In this card, we will introduce array and string. After finishing this card, you should:

1. Understand the differences between `array` and `dynamic array`;
2. Be familiar with `basic operations` in the array and dynamic array;
3. Understand `multidimensional arrays` and be able to use a `two-dimensional array`;
4. Understand the concept of `string` and the different features string has;
5. Be able to apply the `two-pointer technique` to practical problems.



**Note:** 

**Python does not have built-in support for Arrays**, but [Python Lists](https://www.w3schools.com/python/python_lists.asp) can be used instead.

In Python, a `list` is a **dynamic array**. 

### [code]-724. Find Pivot Index

Given an array of integers `nums`, write a method that returns the "pivot" index of this array.

We define the pivot index as the index where the sum of the numbers to the left of the index is equal to the sum of the numbers to the right of the index.

If no such index exists, we should return -1. If there are multiple pivot indexes, you should return the left-most pivot index.

```python
>>> Input: 
    nums = [1, 7, 3, 6, 5, 6]
    Output: 3

class Solution:
    def pivotIndex(self, nums: List[int]) -> int:
        leftsum=0
        total=sum(nums)
        for idx,val in enumerate(nums):
            leftsum +=val
            rightsum = total - leftsum
            print(idx,"-",leftsum,rightsum)
            if leftsum-val==rightsum:
                return idx
            # if sum(nums[:idx])==sum(nums[idx+1:]):
            #     return idx
        return -1
```

> 采用 sum(nums[:idx])==sum(nums[idx+1:]) 的方式导致每次遍历都要重新计算左右子序列的和，开销巨大，要9000ms，优化后只需 200ms

### [code]-747. Largest Number At Least Twice of Others

Find whether the largest element in the array is at least twice as much as every other number in the array.

If it is, return the **index** of the largest element, otherwise return -1.

```python
>>> Input: nums = [3, 6, 1, 0]
	Output: 1
	
class Solution:
    def dominantIndex(self, nums: List[int]) -> int:
        maxitem=max(nums)
        res = nums.index(maxitem)
        nums.remove(maxitem)
        remainlist = nums
        if len(nums)==0:
            return 0
        elif maxitem>=max([2*w for w in remainlist]):
            return res
        else:
            return -1
```

> 自实现版本，有些繁琐，看solution，思路一样，但是很高级

```python
class Solution(object):
    def dominantIndex(self, nums):
        m = max(nums)
        if all(m >= 2*x for x in nums if x != m):
            return nums.index(m)
        return -1
```

### [code]-66. Plus One

Given a **non-empty** array of digits representing a non-negative integer, plus one to the integer.

```python
>>> Input: [1,2,3]
	Output: [1,2,4]

class Solution:
    def plusOne(self, digits: List[int]) -> List[int]:
        num = int("".join([str(w) for w in digits])) + 1
        return [int(w) for w in str(num)]
```

### [code]-498. Diagonal Traverse

Given a matrix of M x N elements (M rows, N columns), return all elements of the matrix in diagonal order as shown in the below image.

```
Input:
[
 [ 1, 2, 3 ],
 [ 4, 5, 6 ],
 [ 7, 8, 9 ]
]

Output:  [1,2,4,7,5,3,6,8,9]
```

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/fh70lk.jpg" alt="fh70lk" style="zoom:50%;" />

```python
class Solution:
    def findDiagonalOrder(self, matrix: List[List[int]]) -> List[int]:
        if(len(matrix))==0:
            return matrix
        
        res = []
        lines = defaultdict(list)

        for i in range(len(matrix)):
            for j in range(len(matrix[0])):
                lines[i+j].append(matrix[i][j])

        for k in range(len(matrix) + len(matrix[0]) - 1):
            if k % 2 == 0:
                res += lines[k][::-1]
            else:
                res += lines[k]
                
        return res
```

### [code]-54. Spiral Matrix

Given a matrix of *m* x *n* elements (*m* rows, *n* columns), return all elements of the matrix in spiral order.

```
Input:
[
  [1, 2, 3, 4],
  [5, 6, 7, 8],
  [9,10,11,12]
]
Output: [1,2,3,4,8,12,11,10,9,5,6,7]
```

```python
class Solution(object):
    def spiralOrder(self, matrix):
        if not matrix: return []
        R, C = len(matrix), len(matrix[0])
        seen = [[False] * C for _ in matrix]
        ans = []
        dr = [0, 1, 0, -1]
        dc = [1, 0, -1, 0]
        r = c = di = 0
        for _ in range(R * C):
            ans.append(matrix[r][c])
            seen[r][c] = True
            cr, cc = r + dr[di], c + dc[di]
            if 0 <= cr < R and 0 <= cc < C and not seen[cr][cc]:
                r, c = cr, cc
            else:
                di = (di + 1) % 4
                r, c = r + dr[di], c + dc[di]
        return ans
```

### [code]-118. Pascal's Triangle

Given a non-negative integer *numRows*, generate the first *numRows* of Pascal's triangle.

```
Input: 5
Output:
[
     [1],
    [1,1],
   [1,2,1],
  [1,3,3,1],
 [1,4,6,4,1]
]
```

```python
class Solution:
    def generate(self, num_rows):
        triangle = []

        for row_num in range(num_rows):
            # The first and last row elements are always 1.
            row = [None for _ in range(row_num+1)]
            row[0], row[-1] = 1, 1

            # Each triangle element is equal to the sum of the elements
            # above-and-to-the-left and above-and-to-the-right.
            for j in range(1, len(row)-1):
                row[j] = triangle[row_num-1][j-1] + triangle[row_num-1][j]

            triangle.append(row)

        return triangle
```

### [code]-67. Add Binary

```python
class Solution:
    def addBinary(self, a: str, b: str) -> str:
        carry = 0
        result = ''

        a = list(a)
        b = list(b)

        while a or b or carry:
            if a:
                carry += int(a.pop())
            if b:
                carry += int(b.pop())

            result += str(carry %2) # 模 0%2=0 1%2=1 2%2=0
            carry //= 2 # 商 0//2=0 1//2=0 2//2=1

        return result[::-1]
```

> pop操作保证都从最后一个数取，result存加法结果，carry存进位，while操作当两个数均为空且进位为0时终止，result[::-1]将str逆序。满满的细节！

### [code]-28. Implement strStr()

Return the index of the first occurrence of needle in haystack, or **-1** if needle is not part of haystack.

```python
>>> Input: haystack = "hello", needle = "ll"
	Output: 2
	
class Solution:
    def strStr(self, haystack: str, needle: str) -> int:
        if len(haystack)==len(needle)==0:
            return 0
        needlelen = len(needle)
        for idx,val in enumerate(haystack):
            if idx+needlelen<=len(haystack):
                if needle == haystack[idx:idx+needlelen]:
                    return idx
        return -1
```

### [code]-14. Longest Common Prefix

Write a function to find the longest common prefix string amongst an array of strings.

If there is no common prefix, return an empty string `""`.

```python
>>> Input: ["flower","flow","flight"]
	Output: "fl"
	
class Solution:
    def longestCommonPrefix(self, strs):
        letter_groups, longest_pre = zip(*strs), ""
        # print(letter_groups)
        # [('f', 'f', 'f'), ('l', 'l', 'l'), ('o', 'o', 'i'), ('w', 'w', 'g')] 
        for letter_group in letter_groups:
            if len(set(letter_group)) > 1: break
            longest_pre += letter_group[0]
        return longest_pre
```

> zip相当于同时遍历多个元素

### [code]-344. Reverse String

Write a function that reverses a string. The input string is given as an array of characters `char[]`.

```python
class Solution:
    def reverseString(self, s: List[str]) -> None:
        """
        Do not return anything, modify s in-place instead.
        """
        
        for idx,val in enumerate(s):
            if idx>=len(s)/2:
                break
            s[idx],s[-(idx+1)] = s[-(idx+1)],s[idx]
        return s
```

### [code]-561. Array Partition I

Given an array of **2n** integers, your task is to group these integers into **n** pairs of integer, say (a1, b1), (a2, b2), ..., (an, bn) which makes sum of min(ai, bi) for all i from 1 to n as large as possible.

```python
>>> Input: [1,4,3,2]

    Output: 4
    Explanation: n is 2, and the maximum sum of pairs is 4 = min(1, 2) + min(3, 4).
        
class Solution(object):

    def arrayPairSum(self, nums):
        """
        :type nums: List[int]
        :rtype: int
        """
        return sum(sorted(nums)[::2]) 
    
    # [1,2,3,4] 对 [1,3]求和
```

### [code]-167. Two Sum II - Input array is sorted

```python
class Solution(object):
    def twoSum(self, numbers, target):
        """
        :type numbers: List[int]
        :type target: int
        :rtype: List[int]
        """
        i = 0
        j = len(numbers)-1
        while i<j:
            if numbers[i] + numbers[j] == target:
                return [i+1,j+1]
            elif numbers[i] + numbers[j] > target:
                j-= 1
            else:
                i += 1
        return []
```

### [code]-Rotate Array

```python
class Solution:
    # @param nums, a list of integer
    # @param k, num of steps
    # @return nothing, please modify the nums list in-place.
    def rotate(self, nums, k):
        n = len(nums)
        k = k % n
        nums[:] = nums[n-k:] + nums[:n-k]
```

### [code]- Pascal's Triangle II

```python
class Solution(object):
    def getRow(self, rowIndex):
        """
        :type rowIndex: int
        :rtype: List[int]
        """
        row = [1]
        for _ in range(rowIndex):
            row = [x + y for x, y in zip([0]+row, row+[0])]
        return row
```

### [code]-Reverse Words in a String

```python
class Solution:
    def reverseWords(self, s: str) -> str:
         return " ".join(s.strip().split()[::-1])
        
```

### [code]-Reverse Words in a String III

```python
class Solution:
    def reverseWords(self, s: str) -> str:
        
        return " ".join(["".join(list(w)[::-1]) for w in s.split(" ")])
```

### [code]-Remove Duplicates from Sorted Array

```python
from collections import OrderedDict
class Solution(object):
    def removeDuplicates(self, nums):

        nums[:] =  OrderedDict.fromkeys(nums).keys()
        return len(nums)
```

