---
title: "10.Recursion 2"
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
|                                       |                                                              |                                                         |
|                                       |                                                              |                                                         |

![Rw9OIk](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/Rw9OIk.png)

### Explore-Learn[10.Recursion 2]

Here are list of topics that we will cover in this card:

1. `Divide and Conquer`
2. `Backtracking`
3. `master theorem`

### {paradigm: Divide and Conquer}

After going through the chapter, you should be able to:

- know some classical examples of divide-and-conquer algorithms, *e.g.* merge sort and quick sort .
- know how to apply a [pseudocode template](https://leetcode.com/explore/learn/card/recursion-ii/470/divide-and-conquer/2869/) to implement the divide-and-conquer algorithms.
- know a theoretical tool called [master theorem](https://leetcode.com/explore/learn/card/recursion-ii/470/divide-and-conquer/2871/) to calculate the time complexity for certain types of divide-and-conquer algorithms.

![glWYbt](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/glWYbt.png)

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/Dr3NBR.jpg" alt="Dr3NBR" style="zoom: 33%;" />

### {algorithm: Merge Sort}

![BQnkkC](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/BQnkkC.png)

![1vcihn](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/1vcihn.png)

![VaHGZc](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/VaHGZc.png)

```python
def merge_sort(nums):
    # bottom cases: empty or list of a single element.
    if len(nums) <= 1:
        return nums

    pivot = int(len(nums) / 2)
    left_list = merge_sort(nums[0:pivot])
    right_list = merge_sort(nums[pivot:])
    return merge(left_list, right_list)


def merge(left_list, right_list):
    left_cursor = right_cursor = 0
    ret = []
    while left_cursor < len(left_list) and right_cursor < len(right_list):
        if left_list[left_cursor] < right_list[right_cursor]:
            ret.append(left_list[left_cursor])
            left_cursor += 1
        else:
            ret.append(right_list[right_cursor])
            right_cursor += 1
    
    # append what is remained in either of the lists
    ret.extend(left_list[left_cursor:])
    ret.extend(right_list[right_cursor:])
    
    return ret
```


### {Template: D&C}

- **Validate Binary Search Tree**

  *Sometimes, tree related problems can be solved using divide-and-conquer algorithms.* 

  **1.** In the first step, we divide the tree into two subtrees -- its left child and right child. (**Divide**)

  **2.** Then in the next step, we ***recursively*** validate each subtree is indeed a binary search tree. (**Conquer**)

  **3.** Upon the results of the subproblems from Step 2, we return true if and only if both subtrees are both valid BST. (**Combine**)

- **Search a 2D Matrix II**

  ***1***. We divide the matrix into 4 sub-matrices by choosing a pivot point based on a row and a column. (**Divide**)

  ***2***. Then we ***recursively*** look into each sub-matrix to search for the desired target. (**Conquer**)

  ***3***. If we find the target in either of the sub-matrices, we stop the search and return the result immediately. (**Combine**)

### [code]-Validate Binary Search Tree

Given a binary tree, determine if it is a valid binary search tree (BST).

Assume a BST is defined as follows:

- The left subtree of a node contains only nodes with keys **less than** the node's key.
- The right subtree of a node contains only nodes with keys **greater than** the node's key.
- Both the left and right subtrees must also be binary search trees.

```python
# recursively & divide and conquer

class Solution:
    def isValidBST(self, root):
        """
        :type root: TreeNode
        :rtype: bool
        """
        def helper(node, lower = float('-inf'), upper = float('inf')):
            if not node:
                return True
            
            val = node.val
            if val <= lower or val >= upper:
                return False

            if not helper(node.right, val, upper):
                return False
            if not helper(node.left, lower, val):
                return False
            return True

        return helper(root)
```

### [code]-Search a 2D Matrix II

Write an efficient algorithm that searches for a value in an *m* x *n* matrix. This matrix has the following properties:

- Integers in each row are sorted in ascending from left to right.
- Integers in each column are sorted in ascending from top to bottom.

```python
[
  [1,   4,  7, 11, 15],
  [2,   5,  8, 12, 19],
  [3,   6,  9, 16, 22],
  [10, 13, 14, 17, 24],
  [18, 21, 23, 26, 30]
]

>>> Given target = 5, return true.
	Given target = 20, return false.

思路：从右上角开始, 比较target 和 matrix[i][j]的值。如果小于target, 则该行不可能有此数, 所以i++; 如果大于target, 则该列不可能有此数, 所以j--。遇到边界则表明该矩阵不含target.
```

```python
class Solution:
    def searchMatrix(self, matrix, target):
        if len(matrix)==0:
            return False
        
        m, n = len(matrix), len(matrix[0])
        r, c = 0, n-1
        while r < m and c >= 0:
            if target > matrix[r][c]:
                r += 1
            elif target < matrix[r][c]:
                c -= 1
            else: 
                return True
	    
        return False
```

### {algorithm: Quick Sort}

![RRkA1u](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/RRkA1u.png)

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/7CdG6J.jpg" alt="7CdG6J" style="zoom:25%;" />

```python
def quicksort(lst):
    """
    Sorts an array in the ascending order in O(n log n) time
    :param nums: a list of numbers
    :return: the sorted list
    """
    n = len(lst)
    qsort(lst, 0, n - 1)

def qsort(lst, lo, hi):
    """
    Helper
    :param lst: the list to sort
    :param lo:  the index of the first element in the list
    :param hi:  the index of the last element in the list
    :return: the sorted list
    """
    if lo < hi:
        p = partition(lst, lo, hi)
        qsort(lst, lo, p - 1)
        qsort(lst, p + 1, hi)

def partition(lst, lo, hi):
    """
    Picks the last element hi as a pivot
     and returns the index of pivot value in the sorted array
    """
    pivot = lst[hi]
    i = lo
    for j in range(lo, hi):
        if lst[j] < pivot:
            lst[i], lst[j] = lst[j], lst[i]
            i += 1
    lst[i], lst[hi] = lst[hi], lst[i]
    return i
```

#### {interviews: 7-line quicksort to write in Python}

```python
def quicksort(self, nums):
    if len(nums) <= 1:
        return nums

    pivot = random.choice(nums)
    lt = [v for v in nums if v < pivot]
    eq = [v for v in nums if v == pivot]
    gt = [v for v in nums if v > pivot]

    return self.quicksort(lt) + eq + self.quicksort(gt)
```

**7 Sorting Algorithms**

1. quick sort
2. top-down merge sort
3. bottom-up merge sort
4. heap sort
5. selection sort
6. insertion sort
7. bubble sort (TLE)

### {Backtracking回溯法未看完}

![U7whpl](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/U7whpl.png)

![EI25Z5](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/EI25Z5.png)

### [not solved]-N-Queens II

The *n*-queens puzzle is the problem of placing *n* queens on an *n*×*n* chessboard such that no two queens attack each other. Given an integer *n*, return the number of distinct solutions to the *n*-queens puzzle.

![lDrVEy](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/lDrVEy.jpg)

As a reminder, a queen can attack any piece that is situated at the same row, column or diagonal of the queue. As shown in the board below, if we place a queen at the row `1` and column `1` of the board, we then cross out all the cells that could be attached by this queen. 

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/jET9Ny.jpg" alt="jET9Ny" style="zoom:25%;" />

```python
def backtrack_nqueen(row = 0, count = 0):
    for col in range(n):
        # iterate through columns at the curent row.
        if is_not_under_attack(row, col):
            # explore this partial candidate solution, and mark the attacking zone
            place_queen(row, col)
            if row + 1 == n:
                # we reach the bottom, i.e. we find a solution!
                count += 1
            else:
                # we move on to the next row
                count = backtrack(row + 1, count)
            # backtrack, i.e. remove the queen and remove the attacking zone.
            remove_queen(row, col)
    return count
```

### {Unfold Recursion}

To convert a recursion approach to an iteration one, we could perform the following two steps:

1. We use a **stack or queue** data structure within the function, to replace the role of the system call stack. At each occurrence of recursion, we **simply push the parameters as a new element into the data structure** that we created, instead of invoking a recursion.
2. In addition, we **create a loop over the data structure** that we created before. The chain invocation of recursion would then be replaced with the iteration within the loop.

```python
# 判断两棵树是否相同，类似题目 [code]-Binary Tree Level Order Traversal

from collections import deque
class Solution:
    def isSameTree(self, p, q):
        """
        :type p: TreeNode
        :type q: TreeNode
        :rtype: bool
        """    
        def check(p, q):
            # if both are None
            if not p and not q:
                return True
            # one of p and q is None
            if not q or not p:
                return False
            if p.val != q.val:
                return False
            return True
        
        deq = deque([(p, q),])
        while deq:
            p, q = deq.popleft()
            if not check(p, q):
                return False         
            if p:
                deq.append((p.left, q.left))
                deq.append((p.right, q.right))
        return True
```

### [code]-Generate Parentheses

Given *n* pairs of parentheses, write a function to generate all combinations of well-formed parentheses.

```
For example, given n = 3, a solution set is:
[
  "((()))",
  "(()())",
  "(())()",
  "()(())",
  "()()()"
]
递归生成所有序列
```

```python
class Solution(object):
    def generateParenthesis(self, N):
        ans = []
        def backtrack(S = '', left = 0, right = 0):
            if len(S) == 2 * N:
                ans.append(S)
                return
            if left < N:
                backtrack(S+'(', left+1, right)
            if right < left:
                backtrack(S+')', left, right+1)

        backtrack()
        return ans
```

### [code]-Binary Tree Inorder Traversal

Given a binary tree, return the *inorder* traversal of its nodes' values.

```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None

class Solution:
    def inorderTraversal(self, root: TreeNode) -> List[int]:
        res = []
        self.helper(root, res)
        return res

    def helper(self, root, res):
        if root:
            self.helper(root.left, res)
            res.append(root.val)
            self.helper(root.right, res)
```

### [code]-Binary Tree Level Order Traversal

Given a binary tree, return the *level order* traversal of its nodes' values. (ie, from left to right, level by level).

```
    3
   / \
  9  20
    /  \
   15   7
   
>>> 
[
  [3],
  [9,20],
  [15,7]
]

层次遍历，体现了unfold recursive的思想，这个和比较两棵树是否相同思路接近
```

```
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None

from collections import deque
class Solution:
    def levelOrder(self, root):
        if not root: return []
        queue, res = deque([root]), []
        
        while queue:
            cur_level, size = [], len(queue)
            for i in range(size):
                node = queue.popleft()
                if node.left:
                    queue.append(node.left)
                if node.right:
                    queue.append(node.right)
                cur_level.append(node.val)
            res.append(cur_level)
        return res
        
```

### {Recursion未看}

