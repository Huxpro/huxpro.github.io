---
title: "6.Queue & Stack"
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
|                 03.27                 | 「std::vector vs std::array」「std::queue」「std::set vs std::unordered_set」 | cpp reference                                                |
|                                       |         【Queue & Stack】622. Design Circular Queue          | 用vector实现Circular Queue                                   |
|                                       |           【Queue & Stack】200. Number of Islands            | Queue+BFS                                                    |
|                                       |             【Queue & Stack】752. Open the Lock              | Queue+BFS,**<font color=red>too hard to understand</font>**  |
|                                       |            【Queue & Stack】279. Perfect Squares             | **<font color=red>BFS too hard to understand</font>**        |
|                 03.30                 |               【Queue & Stack】155. Min Stack                | std::stack 双栈                                              |
|                                       |            【Queue & Stack】20. Valid Parentheses            | std::stack char v.s string                                   |
|                                       |           【Queue & Stack】739. Daily Temperatures           | vector逆序将索引入栈                                         |
|                                       |    【Queue & Stack】150. Evaluate Reverse Polish Notation    | 用栈进行算术运算  switch auto                                |
|                 03.31                 |           【Queue & Stack】200. Number of Islands            | DFS，貌似这个比BFS简单好多（逻辑上）                         |
|                                       |                       【DP】Target Sum                       | **<font color=red>「DP IS EASY! 5 Steps to Think Through DP Questions.」</font>** |
|                                       |             【String & 递归】394. Decode String              |                                                              |
|                                       |                    【DFS】733. Flood Fill                    |                                                              |
|                                       |                     【DP】542. 01 Matrix                     | 也可以用dfs                                                  |
|                                       |                  【DFS】841. Keys and Rooms                  |                                                              |
|                                       |                                                              |                                                              |
|                                       |                                                              |                                                              |

<p align="center">
  <img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/iHArqQ.jpg" style="zoom:100%" />
</p>

![NmjqTN](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/NmjqTN.png)

## Explore-Learn[6.Queue & Stack]

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/tN8ocU.png" style="zoom: 40%;" />

### 「c++ vector」

![](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/4wj2G9.png)

### 「[std::vector versus std::array in C++](https://stackoverflow.com/questions/4424579/stdvector-versus-stdarray-in-c)」

> ### std::array

![](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/F8cDdq.png)

> I'll add that arrays are very low-level constructs in C++ and you should try to stay away from them as much as possible when "learning the ropes" -- even Bjarne Stroustrup recommends this (he's the designer of C++).
>
> Vectors come very close to the same performance as arrays, but with a great many conveniences and safety features. You'll probably start using arrays when interfacing with API's that deal with raw arrays, or when building your own collections.

> **Advantages of Vector over arrays** :
>
> 1. Vector is ***template class*** and is ***C++ only construct*** whereas arrays are ***built-in language construct*** and present in both C and C++.
> 2. Vector are implemented as ***dynamic arrays* with *list interface*** whereas arrays can be implemented as ***statically or dynamically*** with ***primitive data type*** interface.
> 3. **Size of arrays are *fixed*** whereas the **vectors are *resizable*** i.e they can grow and shrink as vectors are allocated on heap memory.
> 4. Arrays **have to be *deallocated explicitly*** if defined dynamically whereas vectors are ***automatically de-allocated*** from heap memory.
> 5. Size of array **cannot be determined** if **dynamically allocated** whereas Size of the vector can be determined in **O(1) time**.
> 6. When arrays are passed to a function, a **separate parameter for size is also passed** whereas in case of passing a vector to a function, there is no such need as **vector maintains variables which keeps track of size of container at all times**.
> 7. When array becomes full and new elements are inserted; **no reallocation is done implicitly** whereas When vector becomes larger than its capacity, reallocation is done implicitly.
> 9. Arrays cannot be copied or assigned directly whereas Vectors can be copied or assigned directly.

### 「std::queue 内置实现，不必重复造轮子」

> Most popular languages provide **built-in Queue library so you don't have to reinvent the wheel**.
>
> As mentioned before, the queue has two important operations, `enqueue` and `dequeue`. Besides, we should be able to `get the first element` in a queue since the first element should be processed first.

![](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/rW3FwX.png)

```c++
// Below are some examples of using the built-in Queue library and its common operations:
#include <iostream>

int main() {
    // 1. Initialize a queue.
    queue<int> q;
    // 2. Push new element.
    q.push(5);
    q.push(13);
    q.push(8);
    q.push(6);
    // 3. Check if queue is empty.
    if (q.empty()) {
        cout << "Queue is empty!" << endl;
        return 0;
    }
    // 4. Pop an element.
    q.pop();
    // 5. Get the first element.
    cout << "The first element is: " << q.front() << endl;
    // 6. Get the last element.
    cout << "The last element is: " << q.back() << endl;
    // 7. Get the size of the queue.
    cout << "The size is: " << q.size() << endl;
}
```

### 「std::set vs std::unordered_set」

![](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/5V2BNc.png)

> ### std::set

![](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/BktuKD.png)

> ### std::unordered_set

![](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/21a1Ub.png)

### 【Queue: First-in-first-out Data Structure】

> ### Drawback
>
> The implementation above is straightforward but is inefficient in some cases. **With the movement of the start pointer, more and more space is wasted**. And it will be unacceptable when we only have a space limitation.

```c++
/*
To implement a queue, we may use a dynamic array and an index pointing to the head of the queue.

As mentioned, a queue should support two operations: enqueue and dequeue. Enqueue appends a new element to the queue while dequeue removes the first element. So we need an index to indicate the starting point.

Here is an implementation for your reference:
*/

#include <iostream>

class MyQueue {
    private:
        // store elements
        vector<int> data;       
        // a pointer to indicate the start position
        int p_start;            
    public:
        MyQueue() {p_start = 0;}
        /** Insert an element into the queue. Return true if the operation is successful. */
        bool enQueue(int x) {
            data.push_back(x);
            return true;
        }
        /** Delete an element from the queue. Return true if the operation is successful. */
        bool deQueue() {
            if (isEmpty()) {
                return false;
            }
            p_start++;
            return true;
        };
        /** Get the front item from the queue. */
        int Front() {
            return data[p_start];
        };
        /** Checks whether the queue is empty or not. */
        bool isEmpty()  {
            return p_start >= data.size();
        }
};

int main() {
    MyQueue q;
    q.enQueue(5);
    q.enQueue(3);
    if (!q.isEmpty()) {
        cout << q.Front() << endl;
    }
    q.deQueue();
    if (!q.isEmpty()) {
        cout << q.Front() << endl;
    }
    q.deQueue();
    if (!q.isEmpty()) {
        cout << q.Front() << endl;
    }
}
```

> ### Circular Queue
>
> Previously, we have provided a straightforward but inefficient implementation of queue.
>
> **A more efficient way is to use a circular queue**. Specifically, we may use `a fixed-size array` and `two pointers` to indicate the starting position and the ending position. And the goal is to `reuse the wasted storage` we mentioned previously.
>
> Let's take a look at an example to see how a circular queue works. You should pay attention to the strategy we use to `enqueue` or `dequeue` an element.

### [code]-622. Design Circular Queue

```c++
/*
Design your implementation of the circular queue. The circular queue is a linear data structure in which the operations are performed based on FIFO (First In First Out) principle and the last position is connected back to the first position to make a circle. It is also called "Ring Buffer".

One of the benefits of the circular queue is that we can make use of the spaces in front of the queue. In a normal queue, once the queue becomes full, we cannot insert the next element even if there is a space in front of the queue. But using the circular queue, we can use the space to store new values.
*/

>>> MyCircularQueue circularQueue = new MyCircularQueue(3); // set the size to be 3
    circularQueue.enQueue(1);  // return true
    circularQueue.enQueue(2);  // return true
    circularQueue.enQueue(3);  // return true
    circularQueue.enQueue(4);  // return false, the queue is full
    circularQueue.Rear();  // return 3
    circularQueue.isFull();  // return true
    circularQueue.deQueue();  // return true
    circularQueue.enQueue(4);  // return true
    circularQueue.Rear();  // return 4


class MyCircularQueue {
public:
    /** Initialize your data structure here. Set the size of the queue to be k. */
    MyCircularQueue(int k) {
        data.resize(k);
        head = 0;
        tail = 0;
        reset = true;
    }
    
    /** Insert an element into the circular queue. Return true if the operation is successful. */
    bool enQueue(int value) {
        if (isFull()) return false;
        // update the reset value when first enqueue happens
        if (head == tail && reset) reset = false;
        data[tail] = value;
        // tail指向队尾的下一个元素
        tail = (tail + 1) % data.size();
        return true;
    }
    
    /** Delete an element from the circular queue. Return true if the operation is successful. */
    bool deQueue() {
        if (isEmpty()) return false;
        // head指向队头元素
        head = (head + 1) % data.size();
        // update the reset value when last dequeue happens
        if (head == tail && !reset) reset = true; 
        return true;
    }
    
    /** Get the front item from the queue. */
    int Front() {
        if (isEmpty()) return -1;
        return data[head];
    }
    
    /** Get the last item from the queue. */
    int Rear() {
        if (isEmpty()) return -1;
        return data[(tail + data.size() - 1) % data.size()];
    }
    
    /** Checks whether the circular queue is empty or not. */
    bool isEmpty() {
        if (tail == head && reset) return true;
        return false;
    }
    
    /** Checks whether the circular queue is full or not. */
    bool isFull() {
        if (tail == head && !reset) return true;
        return false;
    }

private:
    vector<int> data;
    int head;
    int tail;
    // reset is the mark when the queue is empty
    // to differentiate from queue is full
    // because in both conditions (tail == head) stands
    bool reset;
};
```

> ### 官方 Circular Queue - Implementation
>
> 区别：tail指向队尾元素，而不是队尾元素的下一个

```c++
class MyCircularQueue {
private:
    vector<int> data;
    int head;
    int tail;
    int size;
public:
    /** Initialize your data structure here. Set the size of the queue to be k. */
    MyCircularQueue(int k) {
        data.resize(k);
        head = -1;
        tail = -1;
        size = k;
    }
    
    /** Insert an element into the circular queue. Return true if the operation is successful. */
    bool enQueue(int value) {
        if (isFull()) {
            return false;
        }
        if (isEmpty()) {
            head = 0;
        }
        tail = (tail + 1) % size;
        data[tail] = value;
        return true;
    }
    
    /** Delete an element from the circular queue. Return true if the operation is successful. */
    bool deQueue() {
        if (isEmpty()) {
            return false;
        }
        if (head == tail) {
            head = -1;
            tail = -1;
            return true;
        }
        head = (head + 1) % size;
        return true;
    }
    
    /** Get the front item from the queue. */
    int Front() {
        if (isEmpty()) {
            return -1;
        }
        return data[head];
    }
    
    /** Get the last item from the queue. */
    int Rear() {
        if (isEmpty()) {
            return -1;
        }
        return data[tail];
    }
    
    /** Checks whether the circular queue is empty or not. */
    bool isEmpty() {
        return head == -1;
    }
    
    /** Checks whether the circular queue is full or not. */
    bool isFull() {
        return ((tail + 1) % size) == head;
    }
};

/**
 * Your MyCircularQueue object will be instantiated and called as such:
 * MyCircularQueue obj = new MyCircularQueue(k);
 * bool param_1 = obj.enQueue(value);
 * bool param_2 = obj.deQueue();
 * int param_3 = obj.Front();
 * int param_4 = obj.Rear();
 * bool param_5 = obj.isEmpty();
 * bool param_6 = obj.isFull();
 */
```

### 【Queue and BFS】

> In this chapter, we will briefly review how BFS works and **focus more on how a queue helps us implement the BFS algorithm**. We will also provide some exercise for you to design and implement BFS by yourself.

> ### Insights
>
> After watching the animation above, let's answer the following questions:
>
> **1. What is the processing order of the nodes?**
>
> In the first round, we process the root node. In the second round, we process the nodes next to the root node; in the third round, we process the nodes which are two steps from the root node; so on and so forth.
>
> Similar to tree's level-order traversal, `the nodes closer to the root node will be traversed earlier`.
>
> **2. What is the enqueue and dequeue order of the queue?**
>
> As shown in the animation above, we first enqueue the root node. **Then in each round, we process the nodes which are already in the queue one by one and add all their neighbors to the queue**. It is worth noting that the newly-added nodes `will not` be traversed immediately but will be processed in the next round.
>
> The processing order of the nodes is `the exact same order` as how they were `added` to the queue, which is First-in-First-out (FIFO). That's why we use a queue in BFS.

> ## BFS - Template
>
> Previously, we have already introduced two main scenarios of using BFS: `do traversal` or `find the shortest path`. Typically, it happens in a tree or a graph. As we mentioned in the chapter description, BFS can also be used in more abstract scenarios.
>
> **It will be important to determine the nodes and the edges before doing BFS in a specific question**. Typically, **the node will be an actual node or a status while the edge will be an actual edge or a possible transition.**

1. As shown in the pseudocode, in each round, the nodes in the queue are the nodes which are `waiting to be processed`.
2. After each outer `while` loop, we are `one step farther from the root node`. The variable `step` indicates the distance from the root node and the current node we are visiting.

```java
/**
 * Return the length of the shortest path between root and target node.
 */
int BFS(Node root, Node target) {
    Queue<Node> queue;  // store all nodes which are waiting to be processed
    int step = 0;       // number of steps neeeded from root to current node
    // initialize
    add root to queue;
    // BFS
    while (queue is not empty) {
        step = step + 1;
        // iterate the nodes which are already in the queue
        int size = queue.size();
        for (int i = 0; i < size; ++i) {
            Node cur = the first node in queue;
            return step if cur is target;
            for (Node next : the neighbors of cur) {
                add next to queue;
            }
            remove the first node from queue;
        }
    }
    return -1;          // there is no path from root to target
}
```

**Sometimes, it is important to make sure that** we `never visit a node twice`. Otherwise, we might get stuck in an infinite loop, *e.g.* in graph with cycle. If so, we can add a hash set to the code above to solve this problem. Here is the pseudocode after modification:

```java
/**
 * Return the length of the shortest path between root and target node.
 */
int BFS(Node root, Node target) {
    Queue<Node> queue;  // store all nodes which are waiting to be processed
    Set<Node> visited;  // store all the nodes that we've visited
    int step = 0;       // number of steps neeeded from root to current node
    // initialize
    add root to queue;
    add root to visited;
    // BFS
    while (queue is not empty) {
        step = step + 1;
        // iterate the nodes which are already in the queue
        int size = queue.size();
        for (int i = 0; i < size; ++i) {
            Node cur = the first node in queue;
            return step if cur is target;
            for (Node next : the neighbors of cur) {
                if (next is not in visited) {
                    add next to queue;
                    add next to visited;
                }
                remove the first node from queue;   
            }
        }
    }
    return -1;          // there is no path from root to target
}
```

### [code]-200. Number of Islands

```c++
/*
Given a 2d grid map of '1's (land) and '0's (water), count the number of islands. An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are all surrounded by water.
*/

>>> Input:
    11110    ->   *0000
    11010         00000
    11000         00000
    00000         00000

    Output: 1     *
>>> Input:
    11000    ->   *0000
    11000         00000
    00100         00*00
    00011         000*0

    Output: 3     ***

class Solution {
public:
    int numIslands(vector<vector<char>>& grid) {
        // {0, 1, 0, -1, 0} 0->1 1->0 0->-1 -1->0
        int m = grid.size(), n = m ? grid[0].size() : 0, islands = 0, offsets[] = {0, 1, 0, -1, 0};
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (grid[i][j] == '1') {
                    // 第一个独立的“1”，islands++，然后赋值为“0”
                    islands++;
                    grid[i][j] = '0';
                    queue<pair<int, int>> todo;
                    todo.push({i, j});
                    while (!todo.empty()) {
                        pair<int, int> p = todo.front();
                        todo.pop();
                        for (int k = 0; k < 4; k++) {
                            int r = p.first + offsets[k], c = p.second + offsets[k + 1];
                            if (r >= 0 && r < m && c >= 0 && c < n && grid[r][c] == '1') {
                                //找到周围的“1”，直接赋值为“0”，因为与“1”临近
                                grid[r][c] = '0';
                                todo.push({r, c});
                            }
                        }
                    }
                }
            }
        }
        return islands;
    }
};
```

### [code]-752. Open the Lock

```c++
class Solution {
public:
    int openLock(vector<string>& deadends, string target) {
        set<string> dead(deadends.begin(), deadends.end());
        if (dead.count("0000")) return -1;
        if (target == "0000") return 0;
        set<string> v;
        queue<string> q;
        q.push("0000");
        for (int d = 1; !q.empty(); d++) {
            for (int n = q.size(); n > 0; n--) {
                string cur = q.front(); q.pop();
                for (int i = 0; i < 4; i++) {
                    for (int dif = 1; dif <= 9; dif += 8) {
                        string s = cur;
                        s[i] = (s[i] - '0' + dif) % 10 + '0';
                        if (s == target) return d;
                        if (!dead.count(s) && !v.count(s)) q.push(s);
                        v.insert(s);
                    }
                }
            }
        }
        return -1;
    }
};
```

### [code]-279. Perfect Squares

### 【Stack: Last-in-first-out Data Structure】

```c++
// Implementation - Stack

#include <iostream>

class MyStack {
    private:
        vector<int> data;               // store elements
    public:
        /** Insert an element into the stack. */
        void push(int x) {
            data.push_back(x);
        }
        /** Checks whether the queue is empty or not. */
        bool isEmpty() {
            return data.empty();
        }
        /** Get the top item from the queue. */
        int top() {
            return data.back();
        }
        /** Delete an element from the queue. Return true if the operation is successful. */
        bool pop() {
            if (isEmpty()) {
                return false;
            }
            data.pop_back();
            return true;
        }
};

int main() {
    MyStack s;
    s.push(1);
    s.push(2);
    s.push(3);
    for (int i = 0; i < 4; ++i) {
        if (!s.isEmpty()) {
            cout << s.top() << endl;
        }
        cout << (s.pop() ? "true" : "false") << endl;
    }
}
```

> Most popular languages provide built-in stack library so you don't have to reinvent the wheel.

### 「std::stack 内置实现，不必重复造轮子」

![](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/rM49BI.png)

```c++
#include <iostream>

int main() {
    // 1. Initialize a stack.
    stack<int> s;
    // 2. Push new element.
    s.push(5);
    s.push(13);
    s.push(8);
    s.push(6);
    // 3. Check if stack is empty.
    if (s.empty()) {
        cout << "Stack is empty!" << endl;
        return 0;
    }
    // 4. Pop an element.
    s.pop();
    // 5. Get the top element.
    cout << "The top element is: " << s.top() << endl;
    // 6. Get the size of the stack.
    cout << "The size is: " << s.size() << endl;
}
```

### [code]-155. Min Stack

```c++
/*
Design a stack that supports push, pop, top, and retrieving the minimum element in constant time.
*/

class MinStack {
private:
    stack<int> s1;
    stack<int> s2;
public:
    void push(int x) {
	    s1.push(x);
	    if (s2.empty() || x <= getMin())  s2.push(x);	    
    }
    void pop() {
	    if (s1.top() == getMin())  s2.pop();
	    s1.pop();
    }
    int top() {
	    return s1.top();
    }
    int getMin() {
	    return s2.top();
    }
};
```

### [code]-20. Valid Parentheses

```c++
/*
Given a string containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.
*/
bool isValid(string s) {
    stack<char> st;
    for(char c : s){
        if(c == '('|| c == '{' || c == '['){
            st.push(c);
        }else{
            if(st.empty()) return false;
            if(c == ')' && st.top() != '(') return false;
            if(c == '}' && st.top() != '{') return false;
            if(c == ']' && st.top() != '[') return false;
            st.pop();
        }
    }
    return st.empty();
}
```

### [code]-739. Daily Temperatures

> Here is a worked example of the contents of the `stack` as we work through `T = [73, 74, 75, 71, 69, 72, 76, 73]` in reverse order, at the end of the loop (after we add `T[i]`). For clarity, `stack` only contains indices `i`, but we will write the value of `T[i]` beside it in brackets, such as `0 (73)`.
>
> - When `i = 7`, `stack = [7 (73)]`. `ans[i] = 0`.
> - When `i = 6`, `stack = [6 (76)]`. `ans[i] = 0`.
> - When `i = 5`, `stack = [5 (72), 6 (76)]`. `ans[i] = 1`.
> - When `i = 4`, `stack = [4 (69), 5 (72), 6 (76)]`. `ans[i] = 1`.
> - When `i = 3`, `stack = [3 (71), 5 (72), 6 (76)]`. `ans[i] = 2`.
> - When `i = 2`, `stack = [2 (75), 6 (76)]`. `ans[i] = 4`.
> - When `i = 1`, `stack = [1 (74), 2 (75), 6 (76)]`. `ans[i] = 1`.
> - When `i = 0`, `stack = [0 (73), 1 (74), 2 (75), 6 (76)]`. `ans[i] = 1`

```c++
/*
Given a list of daily temperatures T, return a list such that, for each day in the input, tells you how many days you would have to wait until a warmer temperature. If there is no future day for which this is possible, put 0 instead.

For example, given the list of temperatures T = [73, 74, 75, 71, 69, 72, 76, 73], your output should be [1, 1, 4, 2, 1, 1, 0, 0].
*/

class Solution {
public:
    vector<int> dailyTemperatures(vector<int>& T) {
        stack<int> st;
        vector<int> ans(T.size());
        for(int i=T.size()-1; i>=0; --i)
        {
            while(!st.empty() && T[i] >= T[st.top()])
            {
                st.pop();
            }
            ans[i] = st.empty() ? 0 : st.top() - i;
            st.push(i);
        }
        return ans;
    }
};
```

### [code]-150. Evaluate Reverse Polish Notation

```c++
>>> Input: ["2", "1", "+", "3", "*"]
    Output: 9
    Explanation: ((2 + 1) * 3) = 9

class Solution {
public:
    int evalRPN(vector<string>& tokens) {
    stack<int> stn;
    for(auto s:tokens) {
        if(s.size()>1 || isdigit(s[0])) stn.push(stoi(s));
        else {
            auto x2=stn.top(); stn.pop();
            auto x1=stn.top(); stn.pop();
            switch(s[0]) { // switch condition must be char or int 
                case '+': x1+=x2; break;
                case '-': x1-=x2; break;
                case '*': x1*=x2; break;
                case '/': x1/=x2; break;
            }
            stn.push(x1);
        }
    }
    return stn.top();
}
};
```

### 【Stack and DFS】

> As mentioned in tree traversal, we can use DFS to do `pre-order`, `in-order` and `post-order` traversal. There is a common feature among these three traversal orders: `we never trace back unless we reach the deepest node`.
>
> That is also the largest difference between DFS and BFS, `BFS never go deeper unless it has already visited all nodes at the current level`.
>
> Typically, we implement DFS using `recursion`. Stack plays an important role in recursion. We will explain the role of the stack when doing recursion in this chapter. We will also show you what's the drawback of recursion and provide another implementation of DFS `without recursion`.
>
> DFS is an important topic when preparing for the interview. The actual design of DFS varies from problem to problem. This chapter focuses on how stack is applied in DFS and helps you to understand the principle of DFS better. To be a master of DFS algorithm, you still need lots of practice.

![](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/1DCQS3.png)

![](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/wANUuC.png)

### [DFS - Template I Recursion]

```java
/*
 * Return true if there is a path from cur to target.
 */

// 用visited记录已访问的节点

boolean DFS(Node cur, Node target, Set<Node> visited) {
    return true if cur is target;
    for (next : each neighbor of cur) {
        if (next is not in visited) {
            add next to visted;
            return true if DFS(next, target, visited) == true;
        }
    }
    return false;
}
```

### [code]-200. Number of Islands

```c++
/*
Given a 2d grid map of '1's (land) and '0's (water), count the number of islands. An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are all surrounded by water.
*/

>>> Input:
    11000
    11000
    00100
    00011

    Output: 3

/* 
DFS 思路：除非边界溢出（i < 0 || i == m || j < 0 || j == n）
      	或者遇到0（grid[i][j] == '0'）直接退出
      	否则，将遍历到的下一个“1”置为”0“，继续DFS
注意：对每一个点都采用DFS
			for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
*/
      
      
class Solution {
public:
    int numIslands(vector<vector<char>>& grid) {
        int m = grid.size(), n = m ? grid[0].size() : 0, islands = 0;
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (grid[i][j] == '1') {
                    islands++;
                    eraseIslands(grid, i, j);
                }
            }
        }
        return islands;
    }
private:
    void eraseIslands(vector<vector<char>>& grid, int i, int j) {
        int m = grid.size(), n = grid[0].size();
        if (i < 0 || i == m || j < 0 || j == n || grid[i][j] == '0') {
            return;
        }
        grid[i][j] = '0';
        eraseIslands(grid, i - 1, j);
        eraseIslands(grid, i + 1, j);
        eraseIslands(grid, i, j - 1);
        eraseIslands(grid, i, j + 1);
    }
};
```

> DFS比BFS 逻辑上简单好多

### 「DP IS EASY! 5 Steps to Think Through DP Questions.」

> **WARNING:** This will not be a tabulated, perfectly optimized DP solution. We have enough of those.
>
> This post will walk you through the THINKING process behind Dynamic Programming so that you can solve these questions on your own.
>
> 1. Category
>    Most dynamic programming questions can be boiled down to a few categories. It's important to recognize the category because it allows us to FRAME a new question into something we already know. Frame means use the framework, not copy an approach from another problem into the current problem. You must understand that every DP problem is different.
>
>    
>
>    **Question:** Identify this problem as one of the categories below before continuing.
>
>    - 0/1 Knapsack
>    - Unbounded Knapsack
>    - Shortest Path (eg: Unique Paths I/II)
>    - Fibonacci Sequence (eg: House Thief, Jump Game)
>    - Longest Common Substring/Subsequeunce
>
>    
>
>    **Answer:** 0/1 Knapsack
>
>    
>
>    *Why 0/1 Knapsack?* Our 'Capacity' is the target we want to reach 'S'. Our 'Items' are the numbers in the input subset and the 'Weights' of the items are the values of the numbers itself. This question follows 0/1 and not unbounded knapsack because we can use each number ONCE.
>
>    
>
>    *What is the variation?* The twist on this problem from standard knapsack is that we must add ALL items in the subset to our knapsack. We can reframe the question into adding the positive or negative value of the current number to our knapsack in order to reach the target capacity 'S'.
>
>    
>
> 2. States
>    What variables we need to keep track of in order to reach our optimal result? This Quora post explains state beautifully, so please refer to this link if you are confused: [www.quora.com/What-does-a-state-represent-in-terms-of-Dynamic-Programming](http://www.quora.com/What-does-a-state-represent-in-terms-of-Dynamic-Programming)
>
>    
>
>    **Question:** Determine State variables.
>    *Hint:* As a general rule, Knapsack problems will require 2 states at minimum.
>
>    
>
>    **Answer:** Index and Current Sum
>    *Why Index?* Index represents the index of the input subset we are considering. This tells us what values we have considered, what values we haven't considered, and what value we are currently considering. As a general rule, index is a required state in nearly all dynamic programming problems, except for shortest paths which is row and column instead of a single index but we'll get into that in a seperate post.
>
>    
>
>    *Why Current Sum?* The question asks us if we can sum every item (either the positive or negative value of that item) in the subset to reach the target value. Current Sum gives us the sum of all the values we have processed so far. Our answer revolves around Current Sum being equal to Target.
>
>    
>
> 3. Decisions
>    Dynamic Programming is all about making the optimal decision. In order to make the optimal decision, we will have to try all decisions first. The MIT lecture on DP (highly recommended) refers to this as the guessing step. My brain works better calling this a decision instead of a guess. Decisions will have to bring us closer to the base case and lead us towards the question we want to answer. Base case is covered in Step 4 but really work in tandem with the decision step.
>
>    
>
>    **Question:** What decisions do we have to make at each recursive call?
>    *Hint:* As a general rule, Knapsack problems will require 2 decisions.
>
>    
>
>    **Answer:** This problem requires we take ALL items in our input subset, so at every step we will be adding an item to our knapsack. Remember, we stated in Step 2 that *"The question asks us if we can sum every item (either the positive or negative value of that item) in the subset to reach the target value."* The decision is:
>
>    
>
>    1. Should we add the current numbers positive value
>    2. Should we add the current numbers negative value
>
>    
>
>    As a note, knapsack problems usually don't require us to take all items, thus a usual knapsack decision is to take the item or leave the item.
>
>    
>
> 4. Base Case
>    Base cases need to relate directly to the conditions required by the answer we are seeking. This is why it is important for our decisions to work towards our base cases, as it means our decisions are working towards our answer.
>
>    
>
>    Let's revisit the conditions for our answers.
>
>    
>
>    1. We use all numbers in our input subset.
>    2. The sum of all numbers is equal to our target 'S'.
>
>    
>
>    **Question:** Identify the base cases.
>    *Hint:* There are 2 base cases.
>
>    
>
>    **Answer:** We need 2 base cases. One for when the current state is valid and one for when the current state is invalid.
>
>    
>
>    1. Valid: Index is out of bounds AND current sum is equal to target 'S'
>    2. Invalid: Index is out of bounds
>
>    
>
>    *Why Index is out of bounds?* A condition for our answer is that we use EVERY item in our input subset. When the index is out of bounds, we know we have considered every item in our input subset.
>
>    
>
>    *Why current sum is equal to target?* A condition for our answer is that the sum of using either the positive or negative values of items in our input subet equal to the target sum 'S'.
>
>    
>
>    If we have considered all the items in our input subset and our current sum is equal to our target, we have successfully met both conditions required by our answer.
>
>    
>
>    On the other hand, if we have considered all the items in our input subset and our current sum is NOT equal to our target, we have only met condition required by our answer. No bueno.
>
>    
>
> 5. Code it
>    If you've thought through all the steps and understand the problem, it's trivial to code the actual solution.
>
>    
>
>    ```
>     def findTargetSumWays(self, nums, S):
>         index = len(nums) - 1
>         curr_sum = 0
>         return self.dp(nums, S, index, curr_sum)
>         
>     def dp(self, nums, target, index, curr_sum):
>     	# Base Cases
>         if index < 0 and curr_sum == target:
>             return 1
>         if index < 0:
>             return 0 
>         
>     	# Decisions
>         positive = self.dp(nums, target, index-1, curr_sum + nums[index])
>         negative = self.dp(nums, target, index-1, curr_sum + -nums[index])
>         
>         return positive + negative
>    ```
>
> 6. Optimize
>    Once we introduce memoization, we will only solve each subproblem ONCE. We can remove recursion altogether and avoid the overhead and potential of a stack overflow by introducing tabulation. It's important to note that the top down recursive and bottom up tabulation methods perform the EXACT same amount of work. The only different is memory. If they peform the exact same amount of work, the conversion just requires us to specify the order in which problems should be solved. This post is really long now so I won't cover these steps here, possibly in a future post.
>
>    
>
> Memoization Solution for Reference
>
> ```
> class Solution:
>     def findTargetSumWays(self, nums, S):
>         index = len(nums) - 1
>         curr_sum = 0
>         self.memo = {}
>         return self.dp(nums, S, index, curr_sum)
>         
>     def dp(self, nums, target, index, curr_sum):
>         if (index, curr_sum) in self.memo:
>             return self.memo[(index, curr_sum)]
>         
>         if index < 0 and curr_sum == target:
>             return 1
>         if index < 0:
>             return 0 
>         
>         positive = self.dp(nums, target, index-1, curr_sum + nums[index])
>         negative = self.dp(nums, target, index-1, curr_sum + -nums[index])
>         
>         self.memo[(index, curr_sum)] = positive + negative
>         return self.memo[(index, curr_sum)]
> ```
>
> 
>
> Leave a comment on what DP problems you would like this type of post for next and upvote this solution if you found it helpful. I'd like to get this to the top because I'm honestly tired of seeing straight optimized tabulated solutions with no THINKING process behind it.
>
> 
>
> DP IS EASY!
>
> Thanks.



### [DFS - Template II]

> The advantage of the recursion solution is that it is easier to implement. However, there is a huge disadvantage: if the depth of recursion is too high, you will suffer from `stack overflow`. In that case, you might want to use BFS instead or implement DFS using an explicit stack.

```java
/*
 * Return true if there is a path from cur to target.
 */
boolean DFS(int root, int target) {
    Set<Node> visited;
    Stack<Node> stack;
    add root to stack;
    while (stack is not empty) {
        Node cur = the top element in stack;
        remove the cur from the stack;
        return true if cur is target;
        for (Node next : the neighbors of cur) {
            if (next is not in visited) {
                add next to visited;
                add next to stack;
            }
        }
    }
    return false;
}
```

### [code]-Implement Queue using Stacks

> 双栈实现单队列

### [code]-Implement Stack using Queues

> 双队列实现栈

### [code]-394. Decode String

```c++
>>> s = "3[a]2[bc]", return "aaabcbc".
    s = "3[a2[c]]", return "accaccacc".
    s = "2[abc]3[cd]ef", return "abcabccdcdcdef".

class Solution {
public:
    string decodeString(const string& s, int& i) {
        string res;
        
        while (i < s.length() && s[i] != ']') {
            if (!isdigit(s[i]))
                res += s[i++];
            else {
                int n = 0;
                while (i < s.length() && isdigit(s[i]))
                    n = n * 10 + s[i++] - '0';
                    
                i++; // '['
                string t = decodeString(s, i);
                i++; // ']'
                
                while (n-- > 0)
                    res += t;
            }
        }
        
        return res;
    }

    string decodeString(string s) {
        int i = 0;
        return decodeString(s, i);
    }
};
```

### [code]-733. Flood Fill

```c++
class Solution {
public:
    vector<vector<int>> floodFill(vector<vector<int>>& image, int sr, int sc, int newColor) {
        if (image[sr][sc] != newColor)
            dfs(image, sr, sc, image[sr][sc], newColor);
        return image;
    }

private:
    void dfs(vector<vector<int>>& image, int i, int j, int c0, int c1) {
        if (i < 0 || j < 0 || i >= image.size() || j >= image[0].size() || image[i][j] != c0) return;
        image[i][j] = c1;
        dfs(image, i, j - 1, c0, c1);
        dfs(image, i, j + 1, c0, c1);
        dfs(image, i - 1, j, c0, c1);
        dfs(image, i + 1, j, c0, c1);
    }
};
```

### [code]-542. 01 Matrix

```c++
class Solution {
    const int MAX_MATRIX_SIZE = 10000; // as in problem statement
    public:
        vector<vector<int>> updateMatrix(vector<vector<int>>& matrix) 
        {
            for(int r = 0; r < matrix.size(); ++r)
                for(int c = 0; c < matrix[0].size(); ++c)
                    if(matrix[r][c] == 1) matrix[r][c] = MAX_MATRIX_SIZE;

            for(int r = 0; r < matrix.size(); ++r)
                for(int c = 0; c < matrix[0].size(); ++c)
                    get_distance(r, c, matrix);
            return matrix;
        }

    protected:
        int get_distance(int r, int c,  vector<vector<int>>& matrix)
        {
            if(r >= matrix.size() || r < 0 || c >= matrix[0].size() || c < 0 || matrix[r][c] == -2) return MAX_MATRIX_SIZE;
            
            if(matrix[r][c] == 0 || matrix[r][c] == 1) return matrix[r][c]; // 1 is min distance - no need to compute further

            int dist =  matrix[r][c];
            matrix[r][c] = -2; // -2 = do not go here again.
            
            dist = min(dist, get_distance(r+1, c, matrix)+1);
            dist = min(dist, get_distance(r-1, c, matrix)+1);
            dist = min(dist, get_distance(r, c+1, matrix)+1);
            dist = min(dist, get_distance(r, c-1, matrix)+1);
            
            matrix[r][c] = dist;
            return dist;
        }
};
```

### [code]-841. Keys and Rooms

```c++
>>> Input: [[1],[2],[3],[]]
    Output: true
    Explanation:  
    We start in room 0, and pick up key 1.
    We then go to room 1, and pick up key 2.
    We then go to room 2, and pick up key 3.
    We then go to room 3.  Since we were able to go to every room, we return true.

class Solution {
    void dfs(vector<vector<int>>& rooms, unordered_set<int> & keys, unordered_set<int> & visited, int curr) {
        visited.insert(curr);
        for (int k : rooms[curr]) keys.insert(k);
        for (int k : keys) if (visited.find(k) == visited.end()) dfs(rooms, keys, visited, k);
    }
    // set.find(x) != set.end() while finding an element
    
public:
    bool canVisitAllRooms(vector<vector<int>>& rooms) {
        unordered_set<int> keys;
        unordered_set<int> visited;
        dfs(rooms, keys, visited, 0);
        return visited.size() == rooms.size();
    }
};
```



