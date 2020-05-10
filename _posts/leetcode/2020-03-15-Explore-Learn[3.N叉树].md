---
title: "3.N-ary Tree"
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

|         时间         |                             题号                             | 总结                                |
| :------------------: | :----------------------------------------------------------: | :---------------------------------- |
|    **2020.03.06**    |                                                              | **制定刷题计划，开始刷题啦**        |
| **2020.03.07-03.09** | 【框架：双指针、哨兵节点】【算法：三步断链法、Floyd's cycle detection、链表拆并等】 | **Explore-Learn[1.链表]**           |
|  **2020.03.10-13**   | 【框架：先根中根后根遍历、BFS】【算法：用栈实现非递归、递归、双栈双树等】 | **Explore-Learn[2.二叉树]**         |
|        03.15         |          [N叉树]589. N-ary Tree Preorder Traversal           | **递归**先根遍历、**非递归+stack ** |
|                      |          [N叉树]590. N-ary Tree Postorder Traversal          | **非递归后根遍历+双栈**、           |
|                      |         [N叉树]429. N-ary Tree Level Order Traversal         | **非递归**层次遍历**BFS+队列**      |
|                      |           [N叉树]559. Maximum Depth of N-ary Tree            | **递归DFS**                         |
|                      |                                                              |                                     |
|                      |                                                              |                                     |
|                      |                                                              |                                     |


<p align="center">
  <img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/E8ymJA.jpg" style="zoom:100%" />
</p>
<p align="center">
  <img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/OUd7qs.jpg" style="zoom:100%" />
</p>

## Explore-Learn[3.N叉树]

### [N-ary Tree Traversal Examples]

<p align="center">
  <img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/Vvi767.jpg" style="zoom:100%" />
</p>
### [code]-589. N-ary Tree Preorder Traversal

```c++
//recursive
class Solution {
private:
    void travel(Node* root, vector<int>& result) {
        if (root == nullptr) {
            return;
        }
        
        result.push_back(root -> val);
        for (i=0; i < root->children.size(); i++) {
            travel(root->children[i], result);
        }
    }
public:
    vector<int> preorder(Node* root) {
        vector<int> result;
        travel(root, result);
        return result;
    }
};
```

```c++
        1
     /     \
   2         3
 /   \     /   \
4     5   6     7

>>> The right preorder sequence will be: 1  2  4  5  3  6  7

//iterative
class Solution {
public:
    vector<int> preorder(Node* root) {
        vector<int> result;
        if (root == nullptr) {
            return result;
        }
        
        stack<Node*> stk;
        stk.push(root);
        while (!stk.empty()) {
            Node* cur = stk.top();
            stk.pop();
            result.push_back(cur -> val);
            for (int i = cur -> children.size() - 1; i >= 0; i--) {
                if (cur -> children[i] != nullptr) {
                    stk.push(cur -> children[i]);
                }
            }
        }
        return result;
    }
};
```

### [code]-590. N-ary Tree Postorder Traversal

```c++
/*
// Definition for a Node.
class Node {
public:
    int val;
    vector<Node*> children;

    Node() {}

    Node(int _val) {
        val = _val;
    }

    Node(int _val, vector<Node*> _children) {
        val = _val;
        children = _children;
    }
};
*/
class Solution {
public:
    vector<int> postorder(Node* root) {
        vector<int> result;
        if (root == nullptr) {
            return result;
        }
        
        stack<Node*> s1;
        stack<Node*> s2;
        s1.push(root);
        while (!s1.empty()) {
            Node* cur = s1.top();
            s1.pop();
            s2.push(cur);
            for (int i = 0; i < cur->children.size(); i++) {
                if (cur -> children[i] != nullptr) {
                    s1.push(cur -> children[i]);
                }
            }
        }
        while(!s2.empty())
        {
            Node* cur = s2.top();
            s2.pop();
            result.push_back(cur->val);
        }
        return result;
    }
};
```

### [code]-429. N-ary Tree Level Order Traversal

```c++
/*
// Definition for a Node.
class Node {
public:
    int val;
    vector<Node*> children;

    Node() {}

    Node(int _val) {
        val = _val;
    }

    Node(int _val, vector<Node*> _children) {
        val = _val;
        children = _children;
    }
};
*/
class Solution {
public:
    vector<vector<int>> levelOrder(Node* root) {
        if (!root) { return {}; } //return an object of the function's return type
        vector<int> row; 
        vector<vector<int> > result; 
        queue<Node*> q;
        q.push(root);
        int count = 1;
      	// 队列q非空，依次遍历左右子树
        while (!q.empty()) {
            for(int i=0; i<q.front()->children.size(); i++)
            {
                q.push(q.front()->children[i]);
            }
            // 队列的第一个元素出队，入vector
            row.push_back(q.front()->val), q.pop();
            if (--count == 0) {
                result.emplace_back(row), row.clear();
                count = q.size(); //count用来对每层的元素个数进行计数，计数满，则把row返回给result
            }
        }
        return result;
    }
};
```

### [code]-559. Maximum Depth of N-ary Tree

```c++
// Definition for a Node.
class Node {
public:
    int val;
    vector<Node*> children;

    Node() {}

    Node(int _val) {
        val = _val;
    }

    Node(int _val, vector<Node*> _children) {
        val = _val;
        children = _children;
    }
};

class Solution {
public:
    int maxDepth(Node* root) {
        if(root==NULL)  return 0;
        int depth=0;
        for(int i=0; i<root->children.size(); i++)
        {
            depth=max(depth,maxDepth(root->children[i]));
        }
        
        return depth+1;
    }
};
```

