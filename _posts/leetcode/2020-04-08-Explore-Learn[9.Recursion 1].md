---
title: "9.Recursion 1"
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
|                                       |                                                              |                                                         |

![dQMFt2](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/dQMFt2.png)

### Explore-Learn[9.Recursion 1]

`Recursion` is an important concept in computer science. It is a foundation for many other algorithms and data structures. *However, the concept of recursion can be tricky to grasp for many beginners.*

In this Explore card, we answer the following questions:

1. What is `recursion`? How does it work?
2. How to solve a problem recursively?
3. How to analyze the `time `and `space` complexity of a recursive algorithm?
4. How can we apply `recursion` in a better way?

After completing this card, you will feel more confident in solving problems recursively and analyzing the complexity on your own.

---

### {Principle of Recursion}

> Recursion is an approach to solving problems using a function that calls itself as a subroutine.

You might wonder how we can implement a function that calls itself. **The trick is that each time a recursive function calls itself, it reduces the given problem into subproblems**. The recursion call continues **until it reaches a point where the subproblem can be solved without further recursion.**

A recursive function should have **the following properties** so that it does not result in an infinite loop:

1. A simple `base case` (or cases) — **a terminating scenario** that does not use recursion to produce an answer.
2. A set of rules, also known as `recurrence relation` that **reduces all other cases towards the base case.**

#### [code]-Print a string in reverse order

First, we can define the desired function as `printReverse(str[0...n-1])`, where `str[0]` represents the first character in the string. Then we can accomplish the given task in two steps:

1. `printReverse(str[1...n-1])`: print the substring `str[1...n-1]` in reverse order.
2. `print(str[0])`: print the first character in the string.

Notice that we call the function itself in the first step, which by definition makes the function recursive.

```java
private static void printReverse(char [] str) {
  helper(0, str);
}

private static void helper(int index, char [] str) {
  if (str == null || index >= str.length) {
    return;
  }
  helper(index + 1, str);
  System.out.print(str[index]);
}
```

### [code]-344. Reverse String

Write a function that reverses a string. The input string is given as an array of characters `char[]`.

Do not allocate extra space for another array, you must do this by **modifying the input array [in-place](https://en.wikipedia.org/wiki/In-place_algorithm)** with O(1) extra memory.

```python
class Solution:
    def reverseString(self,s):
        """
        Do not return anything, modify s in-place instead.
        """
        
        # solution1: python list
        # for idx,val in enumerate(s):
        #     if idx>=len(s)/2:
        #         break
        #     s[idx],s[-(idx+1)] = s[-(idx+1)],s[idx]
        # return s
        
        ## solution2: recursion
        if len(s) == 0:
            return s
        else:
            s[:] = [s[-1]] + self.reverseString(s[:-1])
            return s
        ## s[:-1] python list get slice 的时间复杂度是o(k) 因此此方法比较耗时
        
        # solution3: recursion
        # Base case: if left >= right, do nothing.
		# Otherwise, swap s[left] and s[right] and call helper(left + 1, right - 1).
        def helper(left, right):
            if left < right:
                s[left], s[right] = s[right], s[left]
                helper(left + 1, right - 1)

        helper(0, len(s) - 1)
```

### {Recursion Function Guideline}

For a problem, if there exists a recursive solution, we can follow the guidelines below to implement it. 

For instance, we define the problem as the function ${F(X)}$ to implement, where ${X}$ is the input of the function which also defines the scope of the problem.

Then, in the function ${F(X)}$, we will:

1. **Break the problem down into smaller scopes**, such as ${x_0} \in X, {x_1} \in X, ..., {x_n} \in X$ ;
2. Call function ${F(x_0)}, F(x_1), ..., F(x_n)$ ***recursively*** to solve the **subproblems** of ${X}$;
3. Finally, process the results from the **recursive function calls** to solve the problem corresponding to ${X}$.

> Given a linked list, swap every two adjacent nodes and return its head.
>
> *e.g.* for a list 1-> 2 -> 3 -> 4, one should return the head of list as 2 -> 1 -> 4 -> 3.

We define the function to implement as `swap(head)`, where the input parameter `head` refers to the head of a linked list. The function should return the `head` of the new linked list that has any adjacent nodes swapped.

Following the guidelines we lay out above, we can implement the function as follows:

1. First, we **swap the first two nodes** in the list, *i.e.* `head` and `head.next`;
2. Then, we call the function self as `swap(head.next.next)` to **swap the rest** of the list following the first two nodes.
3. Finally, we attach the returned head of the sub-list in step (2) with the two nodes swapped in step (1) to **form a new linked list**.

```python
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, x):
#         self.val = x
#         self.next = None

class Solution:
    def swapPairs(self, head: ListNode) -> ListNode:
        if head and head.next:
            tmp = head.next
            head.next = self.swapPairs(tmp.next)
            tmp.next = head
            return tmp
        else:
            return head
```

### {Recurrence Relation}

There are two important things that one needs to figure out before implementing a recursive function:

- `recurrence relation`: the relationship between the result of a problem and the result of its subproblems.
- `base case`: the case where one can compute the answer directly without any further recursion calls. Sometimes, the base cases are also called *bottom cases*, since they are often the cases where the problem has been reduced to the minimal scale, *i.e.* the bottom, if we consider that dividing the problem into subproblems is in a top-down manner.

> Once we figure out the above two elements, to implement a recursive function we simply call the function itself according to the `recurrence relation` until we reach the `base case`.

To explain the above points, let's look at a classic problem, `Pascal's Triangle`:

![M9EOlM](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/M9EOlM.png)

### Recurrence Relation

------

Let's start with the recurrence relation within the Pascal's Triangle.



First of all, we define a function $f(i, j)$ which returns the number in the Pascal's Triangle in the `i-th` row and `j-th` column.

We then can represent the recurrence relation with the following formula:


$$
f(i, j) = f(i - 1, j - 1) + f(i - 1, j)
$$

### Base Case

------

As one can see, the leftmost and rightmost numbers of each row are the `base cases` in this problem, which are always equal to 1.



As a result, we can define the base case as follows:

$$
f(i, j) = 1 \quad where \quad j = 1 \enspace or \enspace j = i
$$

### [code]-Reverse Linked List

The recursive version is slightly trickier and the key is to work backwards. **Assume that the rest of the list had already been reversed**, now how do I reverse the front part? Let's assume the list is: $ n_1 → … → n_{k-1} → n_k → n_{k+1} → … → n_m → Ø$

Assume from node $n_{k+1}$ to $n_m$  had been reversed and **you are at node n_k.**

$n_1 → … → n_{k-1} → n_k → n_{k+1} ← … ← n_m$

We want $n_{k+1}$'s next point to $n_k$.

So,

nk.next.next = nk;

Be very careful that n1's next must point to Ø. If you forget about this, your linked list has a cycle in it. This bug could be caught if you test your code with a linked list of size 2.

```python
>>> Input: 1->2->3->4->5->NULL
	Output: 5->4->3->2->1->NULL

# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, x):
#         self.val = x
#         self.next = None

class Solution:
    def reverseList(self, head: ListNode) -> ListNode:
        if not head or not head.next:
            return head
        p = self.reverseList(head.next)
        head.next.next = head
        head.next=None
        return p
    
reverseList(1)
| reverseList(2)
| | reverseList(3)
| | | reverseList(4)
| | | | reverseList(5)
| | | | | return 5 to reverseList(4)
| | | | head=4,p=5, return 5->4->NULL to reverseList(3)
| | | head=3,p=5->4->NULL, return 5->4->3->NULL to reverseList(2)
| | head=2,p=5->4->3->NULL, return 5->4->3->2->NULL to reverseList(1)
| head=1,p=5->4->3->2->NULL, return 5->4->3->2->1->NULL

note: head.next.next = head 根据Input: 1->2->3->4->5->NULL（永远不变）来找
      对应 return 生成Output新链
```

> 新建一个对象去接变化的值比较好,另外，python是没有null的，只有None

### [code]-Search in a Binary Search Tree

```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None

class Solution:
    def searchBST(self, root: TreeNode, val: int) -> TreeNode:
        if root==None:
            return root
        if root.val==val:
            return root
        if root.val>val:
            return self.searchBST(root.left,val)
        elif root.val<val:
            return self.searchBST(root.right,val)
```

> 每一个recursion都要有return，即将结果传递回初始的函数的return。
>
> 一定要写成 return self.searchBST(root.left,val)

```py
>>> [4,2,7,1,3]
	2

self.searchBST(root.left,val)
test(4):
| test(2):
| | return root(2) to test(4)
| return None 

return self.searchBST(root.left,val)
test(4):
| test(2):
| | return root(2) to test(4)
| return root(2)
```

### {Duplicate Calculation in Recursion}

Recursion is often an intuitive and powerful way to implement an algorithm. However, it might bring some undesired penalty to the performance, *e.g.* **duplicate calculations**, if we do not use it wisely. For instance, at the end of the previous chapter, we have encountered the duplicate calculations problem in Pascal's Triangle, where **some intermediate results are calculated multiple times.**

In this article we will look closer into the duplicate calculations problem that could happen with recursion. We will then propose a common technique called `memoization` that can be used to avoid this problem.

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/yfnvSv.png" alt="yfnvSv" style="zoom: 67%;" />

```python
def fibonacci(n):
    """
    :type n: int
    :rtype: int
    """
    if n < 2:
        return n
    else:
        return fibonacci(n-1) + fibonacci(n-2)
```

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/NE6ixk.jpg" alt="NE6ixk" style="zoom: 25%;" />

### {Memoization}

To eliminate the duplicate calculation in the above case, as many of you would have figured out, one of the ideas would be to **store** the intermediate results in the cache so that we could reuse them later without re-calculation.

> [Memoization](https://en.wikipedia.org/wiki/Memoization) is an optimization technique used primarily to **speed up** computer programs by **storing** the results of expensive function calls and returning the cached result when the same inputs occur again. (Source: wikipedia)

Back to our Fibonacci function `F(n)`. We could **use a hash table to keep track of the result** of each `F(n)` with `n` as the key. **The hash table serves as a cache** that saves us from duplicate calculations. The memoization technique is a good example that demonstrates how one can **reduce compute time in exchange for some additional space.**

```python
def fib(self, N):
    """
    :type N: int
    :rtype: int
    """
    cache = {}
    def recur_fib(N):
        if N in cache:
            return cache[N]

        if N < 2:
            result = N
        else:
            result = recur_fib(N-1) + recur_fib(N-2)

        # put result in cache for later reference.
        cache[N] = result
        return result

    return recur_fib(N)
```

### [code]-Climbing Stairs

You are climbing a stair case. It takes *n* steps to reach to the top.

Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?

```python
class Solution:
    def climbStairs(self, n: int) -> int:
        res = {}
        
        def helper(n):
            if n in res:
                return res[n]
            
            if n < 3:
                result = n
            else:
                result = helper(n-1) + helper(n-2)
            res[n] = result
            return result
        
        return helper(n)
```

### {Time Complexity - Recursion}

![F34SM3](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/F34SM3.png)

![KK7bva](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/KK7bva.png)

![LRHIxG](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/LRHIxG.png)

![87qopk](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/87qopk.png)

### {Tail Recursion}

```python
def sum_non_tail_recursion(ls):
    """
    :type ls: List[int]
    :rtype: int, the sum of the input list.
    """
    if len(ls) == 0:
        return 0
    
    # not a tail recursion because it does some computation after the recursive call returned.
    return ls[0] + sum_non_tail_recursion(ls[1:])


def sum_tail_recursion(ls):
    """
    :type ls: List[int]
    :rtype: int, the sum of the input list.
    """
    def helper(ls, acc):
        if len(ls) == 0:
            return acc
        # this is a tail recursion because the final instruction is a recursive call.
        return helper(ls[1:], ls[0] + acc)
    
    return helper(ls, 0)
```

### [code]-Maximum Depth of Binary Tree

Given a binary tree, find its maximum depth.

The maximum depth is the number of nodes along the longest path from the root node down to the farthest leaf node.

![ydPkti](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/ydPkti.png)

```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None

class Solution:
    def maxDepth(self, root: TreeNode) -> int:
        
        def helper(root,deepth):
            if root==None:
                return 0
            elif root.left==None and root.right==None:
                return deepth
            elif root.left==None:
                result = helper(root.right,deepth+1)
            elif root.right==None:
                result = helper(root.left,deepth+1)
            else:
                result = max(helper(root.right,deepth+1),helper(root.left,deepth+1))
            return result
        
        return helper(root,1)    
```

> 似乎发现了模版

### {tips}

![1Gm0db](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/1Gm0db.png)

### [code]-Merge Two Sorted Lists

```python
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, x):
#         self.val = x
#         self.next = None

class Solution:
    def mergeTwoLists(self, l1: ListNode, l2: ListNode) -> ListNode:
        if l1 is None: return l2
        if l2 is None: return l1
        if l1 is None and l2 is None: return None 

        head = ListNode(0)
        cur = head

        while l1 and l2:

            if l1.val > l2.val:
                cur.next = l2
                l2 = l2.next

            else:
                cur.next = l1
                l1 = l1.next

            cur = cur.next

        cur.next = l1 or l2

        return head.next
```

> 比recursive好用

### [code]-K-th Symbol in Grammar

On the first row, we write a `0`. Now in every subsequent row, we look at the previous row and replace each occurrence of `0` with `01`, and each occurrence of `1` with `10`.

Given row `N` and index `K`, return the `K`-th indexed symbol in row `N`. (The values of `K` are 1-indexed.) (1 indexed).

```python
Examples:
Input: N = 1, K = 1
Output: 0

Input: N = 2, K = 1
Output: 0

Input: N = 2, K = 2
Output: 1

Input: N = 4, K = 5
Output: 1

Explanation:
row 1: 0
row 2: 01
row 3: 0110
row 4: 01101001
```

```python
# class Solution:
#     def kthGrammar(self, N: int, K: int) -> int:
    	  
          # 性能不够
#         row = N if K > N else K
#         res = {}
#         for i in range(row):
#             if i == 0:
#                 res[i] = [0]
#             else:
#                 tmp = []
#                 for w in res[i - 1]:
#                     if w==0:
#                         tmp.extend([0,1])
#                     else:
#                         tmp.extend([1,0])
#                 res[i]=tmp
#         return res[row-1][K-1]

class Solution:
    def kthGrammar(self, N: int, K: int) -> int:
        if N==1 and K==1: 
            return 0
        
        if K%2:
            return self.kthGrammar(N-1, K//2+1)
        if self.kthGrammar(N-1, K//2)==0: 
            return 1
        if self.kthGrammar(N-1, K//2)==1: 
            return 0
```

> recursive 优化性能

### [problem]

![dYMfOL](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/dYMfOL.png)

