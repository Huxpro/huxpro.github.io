---
title: "11.Binary Search"
subtitle: "LeetCode「Explore-Learn」"
layout: post
author: "echisenyang"
header-style: text
hidden: true
catalog: true
published: false
tags:
  - 笔记
  - 刷题
  - leetcode
---



## 【进度汇总】

|                 时间                  |                             题号                             | 总结                                                    |
| :-----------------------------------: | :----------------------------------------------------------: | :------------------------------------------------------ |
| **<font color=red>2020.03.06</font>** |                 **制定刷题计划，开始刷题啦**                 |                                                         |
|         **2020.03.07-03.09**          | 【框架：双指针、哨兵节点】【算法：三步断链法、Floyd's cycle detection、链表拆并等】 | **Explore-Learn[1.链表]**                               |
|           **2020.03.10-13**           | 【框架：先根中根后根遍历、BFS】【算法：用栈实现非递归、递归、双栈双树等】 | **Explore-Learn[2.二叉树]**                             |
|            **2020.03.15**             | 【框架：先根后根遍历、BFS\DFS】【算法：用栈实现先根非递归、用双栈实现后根非递归、用队列实现非递归层次遍历BFS、递归实现DFS】 | **Explore-Learn[3.N叉树]**                              |
|         **2020.03.16-03.17**          | 【框架：二叉搜索树】【算法：插入、查找、删除、DFS+中根遍历、递归】 | **Explore-Learn[4.二叉搜索树]**                         |
| **<font color=red>2020.03.18</font>** | **整理1-3月份working list｜2020plan list｜程序员面试计划路线** |                                                         |
|                  =.=                  |          03.18-03.24休息了一周，忙别的，赶紧刷起来           | =.=                                                     |
|         **2020.03.25-03.26**          | 【框架：Prefix Tree】【children[26]+isEnd，**<font color=red>too hard</font>**】 | **<font color=red>Explore-Learn[5.Prefix Tree]</font>** |
|                 03.27                 | 「std::vector vs std::array」「std::queue」「std::set vs std::unordered_set」「std::stack」 | cpp reference                                           |
|         **2020.03.28-03.31**          | 【框架：Queue & Stack】【算法：Queue+BFS/BFS、Stack+DFS/DFS/vector+DFS】 |                                                         |
|         **2020.04.01-04.02**          | 【Hash Table】【**python**+set与dict的妙用+zip/collections.Counter/tuple(sorted(s))】 | python set                                              |
|         **2020.04.03-04.07**          | 【Array & String】【python list/set/zip/[::step]/nums[:]/enumerate高效操作】 | python list                                             |
|         **2020.04.08-04.12**          |               【recursion 1】【recursion模版】               | python class                                            |
|         **2020.04.13-04.20**          |          【recursion 2】【还有两个重要内容没看完】           |                                                         |
|         **2020.04.23-04.26**          |               【Binary Search】【模版真好用】                |                                                         |

![ZqXFxu](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/ZqXFxu.png)

![Sa8W74](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/Sa8W74.png)

### Explore-Learn[11.Binary Search]

### Introduction

- What is Binary Search?

Binary Search is one of the most fundamental and useful algorithms in Computer Science. It describes the process of searching for a specific value in an ordered collection.

- Terminology used in Binary Search:
  - **Target** - the value that you are searching for
  - **Index** - the current location that you are searching
  - **Left, Right** - the indicies from which we use to maintain our search Space
  - **Mid** - the index that we use to apply a condition to determine if we should search left or right

### Background

![gif](https://miro.medium.com/max/600/1*EYkSkQaoduFBhpCVx7nyEA.gif)

#### [code]-Binary Search

Given a **sorted** (in ascending order) integer array `nums` of `n` elements and a `target` value, write a function to search `target` in `nums`. If `target` exists, then return its index, otherwise return `-1`.

```
Input: nums = [-1,0,3,5,9,12], target = 9
Output: 4
Explanation: 9 exists in nums and its index is 4
```

```python
class Solution:
    def search(self, nums, target):
        # 248ms
        l, r = 0, len(nums) - 1
        while l <= r:
            mid = (l + r) // 2
            if nums[mid] < target:
                l = mid + 1
            elif nums[mid] > target:
                r = mid - 1
            else:
                return mid
        return -1
    
# python oneline for fun
class Solution:
    def search(self, nums, target):
        # 264ms
        return nums.index(target) if target in nums else -1
```

### Identification and Template Introduction

- **How do we identify Binary Search?**

As mentioned in earlier, Binary Search is an algorithm that *divides the search space in 2* after every comparison. Binary Search should be considered every time you need to search for an index or element in a collection. **If the collection is unordered, we can always sort it first before applying Binary Search.**

- **3 Parts of a Successful Binary Search**

1. ***Pre-processing*** - Sort if collection is unsorted.
2. ***Binary Search*** - Using a loop or recursion to divide search space in half after each comparison.
3. ***Post-processing*** - Determine viable candidates in the remaining space.

- **3 Templates for Binary Search**

In later chapter

### Binary Search Template I

```python
def binarySearch(nums, target):
    """
    :type nums: List[int]
    :type target: int
    :rtype: int
    """
    if len(nums) == 0:
        return -1

    left, right = 0, len(nums) - 1
    while left <= right:
        mid = (left + right) // 2
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            left = mid + 1
        else:
            right = mid - 1

    # End Condition: left > right
    return -1
```

#### [code]-Sqrt(x)

Implement `int sqrt(int x)`.

Compute and return the square root of *x*, where *x* is guaranteed to be a non-negative integer. Since the return type is an integer, the decimal digits are truncated and only the integer part of the result is returned.

```
Input: 8
Output: 2
Explanation: The square root of 8 is 2.82842..., and since 
             the decimal part is truncated, 2 is returned.
```

```python
class Solution:
    def mySqrt(self, x):
        l, r = 0, x
        while l <= r:
            mid = (r+l)//2
            # 套用模版1，只修改了退出条件
            if mid*mid <= x < (mid+1)*(mid+1):
                return mid
            elif mid*mid > x:
                r = mid - 1
            else:
                l = mid + 1
```

#### [code]-Guess Number Higher or Lower

We are playing the Guess Game. The game is as follows:
I pick a number from **1** to ***n\***. You have to guess which number I picked.
Every time you guess wrong, I'll tell you whether the number is higher or lower.
You call a pre-defined API `guess(int num)` which returns 3 possible results (`-1`, `1`, or `0`):

```
-1 : My number is lower
 1 : My number is higher
 0 : Congrats! You got it!
 
Input: n = 10, pick = 6
Output: 6
二分查找标准模版套用啊
```

```python
# The guess API is already defined for you.
# @param num, your guess
# @return -1 if my number is lower, 1 if my number is higher, otherwise return 0
# def guess(num: int) -> int:

class Solution:
    def guessNumber(self, n: int) -> int:
        left, right = 1, n
        while left <= right:
            mid = (left + right) // 2
            if guess(mid) == 0:
                return mid
            elif guess(mid) < 0:
                right = mid - 1
            else:
                left = mid + 1
```

#### [code]-Search in Rotated Sorted Array

Suppose an array sorted in ascending order is rotated at some pivot unknown to you beforehand.
(i.e., `[0,1,2,4,5,6,7]` might become `[4,5,6,7,0,1,2]`).
You are given a target value to search. If found in the array return its index, otherwise return `-1`.
You may assume no duplicate exists in the array.
Your algorithm's runtime complexity must be in the order of *O*(log *n*).

```
Input: nums = [4,5,6,7,0,1,2], target = 0
Output: 4
```

```python
class Solution:
    # @param {integer[]} numss
    # @param {integer} target
    # @return {integer}
    def search(self, nums, target):
        if not nums:
            return -1

        low, high = 0, len(nums) - 1

        while low <= high:
            mid = (low + high) // 2
            if target == nums[mid]:
                return mid

            # 因为不是一个sorted的序列，所以没办法一个if就完事
            if nums[low] <= nums[mid]:
                if nums[low] <= target < nums[mid]:
                    high = mid - 1
                else:
                    low = mid + 1
            else:
                if nums[mid] < target <= nums[high]:
                    low = mid + 1
                else:
                    high = mid - 1

        return -1
```

### Binary Search Template II

```python
def binarySearch(nums, target):
    """
    :type nums: List[int]
    :type target: int
    :rtype: int
    """
    if len(nums) == 0:
        return -1

    left, right = 0, len(nums)
    while left < right:
        mid = (left + right) // 2
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            left = mid + 1
        else:
            right = mid

    # Post-processing:
    # End Condition: left == right
    # Template #2 is an advanced form of Binary Search. It is used to search for an element or condition which requires accessing the current index and its immediate right neighbor's index in the array.
    if left != len(nums) and nums[left] == target:
        return left
    return -1
```

#### [code]-First Bad Version

You are a product manager and currently leading a team to develop a new product. Unfortunately, the latest version of your product fails the quality check. Since each version is developed based on the previous version, all the versions after a bad version are also bad.

Suppose you have `n` versions `[1, 2, ..., n]` and you want to find out the first bad one, which causes all the following ones to be bad.

You are given an API `bool isBadVersion(version)` which will return whether `version` is bad. Implement a function to find the first bad version. You should minimize the number of calls to the API.

```
Given n = 5, and version = 4 is the first bad version.

call isBadVersion(3) -> false
call isBadVersion(5) -> true
call isBadVersion(4) -> true

Then 4 is the first bad version.
```

```python
# The isBadVersion API is already defined for you.
# @param version, an integer
# @return a bool
# def isBadVersion(version):

class Solution:
    def firstBadVersion(self, n):
        """
        :type n: int
        :rtype: int
        """
        if n==0:
            return -1
        
        left,right = 0,n
        res=-1
        while left<=right:
            mid = (left+right)//2
            if isBadVersion(mid):
                res=mid
                right=mid-1
            else:
                left=mid+1
                
        # End Condition 不加也没啥问题啊
        # if left==n and isBadVersion(left):
        #     return left
        return res
```

#### [code]-find peak element

A peak element is an element that is greater than its neighbors.

Given an input array `nums`, where `nums[i] ≠ nums[i+1]`, find a peak element and return its index.

The array may contain multiple peaks, in that case return the index to any one of the peaks is fine.

```
Input: nums = [1,2,1,3,5,6,4]
Output: 1 or 5 
Explanation: Your function can return either index number 1 where the peak element is 2, or index number 5 where the peak element is 6.

| 1 | 2 | 3 | 4 | 5 | 4 | 3 | 2 | 1 |
|---|---|---|---|---|---|---|---|---|
| l | _ | _ | _ | m | _ | _ | _ | r |
a[m] > a[m+1] -> r=m (Not m-1 since m is larger and it itself can be the answer)

| 1 | 2 | 3 | 4 | 5 | 4 | 3 | 2 | 1 |
|---|---|---|---|---|---|---|---|---|
| l | m | _ | _ | r | X | X | X | X |
a[m] < a[m+1] -> l = m+1 (Since m is smaller than m+1, m will for sure be not the answer)

| 1 | 2 | 3 | 4 | 5 | 4 | 3 | 2 | 1 |
|---|---|---|---|---|---|---|---|---|
| X | X | l | m | r | X | X | X | X |
a[m] < a[m+1] -> l = m+1 (Since m is smaller than m+1, m will for sure be not the answer)

| 1 | 2 | 3 | 4 | 5   | 4 | 3 | 2 | 1 |
|---|---|---|---|-----|---|---|---|---|
| X | X | X | X | l,r | X | X | X | X |
l is the answer
```

```python
class Solution:
    def findPeakElement(self, nums: List[int]) -> int:
        if len(nums)==0:
            return -1
        
        left,right = 0,len(nums)-1
        while(left<right):
            mid=(left+right)//2
            if nums[mid]>nums[mid+1]:
                right=mid
            else:
                left=mid+1
        return right
```

#### [code]-Find Minimum in Rotated Sorted Array

Suppose an array sorted in ascending order is rotated at some pivot unknown to you beforehand.
(i.e.,  `[0,1,2,4,5,6,7]` might become  `[4,5,6,7,0,1,2]`). Find the minimum element. 

You may assume no duplicate exists in the array.

```
Input: [3,4,5,1,2] 
Output: 1
```

```python
class Solution:
    def findMin(self, nums: List[int]) -> int:
        # if len(nums)==0:
        #     return None
        left,right=0,len(nums)-1
        while(left<right):
            mid=(left+right)//2
            if nums[mid]>nums[right]:
                left=mid+1
            else:
                right=mid
        return nums[right]
```

### Binary Search Template III

```python
def binarySearch(nums, target):
    """
    :type nums: List[int]
    :type target: int
    :rtype: int
    """
    if len(nums) == 0:
        return -1

    left, right = 0, len(nums) - 1
    while left + 1 < right:
        mid = (left + right) // 2
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            left = mid
        else:
            right = mid

    # Post-processing:
    # End Condition: left + 1 == right
    # Template #3 is another unique form of Binary Search. It is used to search for an element or condition which requires accessing the current index and its immediate left and right neighbor's index in the array.
    if nums[left] == target: return left
    if nums[right] == target: return right
    return -1
```

#### [好题]-Search for a Range

Given an array of integers `nums` sorted in ascending order, find the starting and ending position of a given `target` value.

Your algorithm's runtime complexity must be in the order of *O*(log *n*).

If the target is not found in the array, return `[-1, -1]`.

```
Input: nums = [5,7,7,8,8,10], target = 8
Output: [3,4]
秒啊：通过两次二分查找，确定左右端点
```

```python
class Solution:
    def searchRange(self, nums, target):
        def binarySearchLeft(A, x):
            left, right = 0, len(A) - 1
            while left <= right:
                mid = (left + right) // 2
                if x > A[mid]: left = mid + 1
                else: right = mid - 1
            return left

        def binarySearchRight(A, x):
            left, right = 0, len(A) - 1
            while left <= right:
                mid = (left + right) // 2
                if x >= A[mid]: left = mid + 1
                else: right = mid - 1
            return right

        left, right = binarySearchLeft(nums, target), binarySearchRight(nums, target)
        return [left, right] if left <= right else [-1, -1]
```

#### [好题]-Find K Closest Elements

```
Input: [1,2,3,4,5], k=4, x=3
Output: [1,2,3,4]
秒啊：right的取值
```

```python
class Solution:
    def findClosestElements(self, A, k, x):
        left, right = 0, len(A) - k
        while left < right:
            mid = (left + right) // 2
            # If x - A[mid] > A[mid + k] - x,
			# means A[mid + 1] ~ A[mid + k] is better than A[mid] ~ A[mid + k - 1],
            if x - A[mid] > A[mid + k] - x:
                left = mid + 1
            else:
                right = mid
        return A[left:left + k]
```

#### [code]-Valid Perfect Square

Given a positive integer *num*, write a function which returns True if *num* is a perfect square else False.

**Note:** **Do not** use any built-in library function such as `sqrt`.

```
Input: 16
Output: true
```

```python
class Solution:
    def isPerfectSquare(self, num: int) -> bool:
        if num==1:
            return True
        
        left,right=0,num
        while(left<right):
            mid=(left+right)//2
            if mid*mid==num:
                return True
            elif mid*mid>num:
                right=mid
            else:
                left=mid+1
        return False
```

#### [code]-Find Smallest Letter Greater Than Target

Given a list of sorted characters `letters` containing only lowercase letters, and given a target letter `target`, find the smallest element in the list that is larger than the given target.

Letters also wrap around. For example, if the target is `target = 'z'` and `letters = ['a', 'b']`, the answer is `'a'`.

```
letters = ["c", "f", "j"]
target = "a"
Output: "c"

letters = ["c", "f", "j"]
target = "k"
Output: "c"
```

```python
class Solution:
    def nextGreatestLetter(self, letters: List[str], target: str) -> str:
        index = bisect.bisect(letters, target)
        # 返回的插入点是 a 中已存在元素 x 的右侧
        return letters[index % len(letters)]
```

#### [好题]-Find Minimum in Rotated Sorted Array II

Suppose an array sorted in ascending order is rotated at some pivot unknown to you beforehand.

(i.e.,  `[0,1,2,4,5,6,7]` might become  `[4,5,6,7,0,1,2]`).

Find the minimum element.

The array may contain duplicates.

```
Input: [2,2,2,0,1]
Output: 0
二分查找，如果相同则right-1
```

```python
class Solution:
    def findMin(self, nums: List[int]) -> int:
        left,right=0,len(nums)-1
        while(left<right):
            mid=(left+right)//2
            if nums[mid]>nums[right]:
                left=mid+1
            elif nums[mid]<nums[right]:
                right=mid
            else:
                right -=1
        return nums[right]
```

