---
title: "5.Prefix Tree"
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

|                 时间                  |                             题号                             | 总结                                            |
| :-----------------------------------: | :----------------------------------------------------------: | :---------------------------------------------- |
| **<font color=red>2020.03.06</font>** |                 **制定刷题计划，开始刷题啦**                 |                                                 |
|         **2020.03.07-03.09**          | 【框架：双指针、哨兵节点】【算法：三步断链法、Floyd's cycle detection、链表拆并等】 | **Explore-Learn[1.链表]**                       |
|           **2020.03.10-13**           | 【框架：先根中根后根遍历、BFS】【算法：用栈实现非递归、递归、双栈双树等】 | **Explore-Learn[2.二叉树]**                     |
|            **2020.03.15**             | 【框架：先根后根遍历、BFS\DFS】【算法：用栈实现先根非递归、用双栈实现后根非递归、用队列实现非递归层次遍历BFS、递归实现DFS】 | **Explore-Learn[3.N叉树]**                      |
|         **2020.03.16-03.17**          | 【框架：二叉搜索树】【算法：插入、查找、删除、DFS+中根遍历、递归】 | **Explore-Learn[4.二叉搜索树]**                 |
| **<font color=red>2020.03.18</font>** | **整理1-3月份working list｜2020plan list｜程序员面试计划路线** |                                                 |
|                                       |          03.18-03.24休息了一周，忙别的，赶紧刷起来           |                                                 |
|                 03.25                 |       【Prefix Tree】208. Implement Trie (Prefix Tree)       | 插入、查找与查找前缀（无删除操作）              |
|                 03.26                 |                      677. Map Sum Pairs                      | unordered_map                                   |
|                                       |                      648. Replace Words                      | **<font color=red>这题用python+map函数</font>** |
|                                       | 【Prefix Tree】211. Add and Search Word - Data structure design | children[26]+isEnd                              |
|                                       |  【Prefix Tree】421. Maximum XOR of Two Numbers in an Array  | **<font color=red>位操作，绝了</font>**         |
|                                       |              【Prefix Tree】212. Word Search II              | **<font color=red>too hard</font>**             |
|                                       |             【Prefix Tree】336. Palindrome Pairs             | **<font color=red>too hard</font>**             |
|                                       |                                                              |                                                 |
|                                       |                                                              |                                                 |

<p align="center">
  <img src="https://github.com/Julian-young/Julian-young.github.io/raw/master/uPic/T65qxd.png" style="zoom:100%" />
</p>

<p align="center">
  <img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/iHArqQ.jpg" style="zoom:100%" />
</p>



## Explore-Learn[5.前缀树]

### 【How to represent a Trie?】

> ### First Solution - Array

```c++
// change this value to adapt to different cases
#define N 26

struct TrieNode {
    TrieNode* children[N];
    
    // you might need some extra values according to different cases
};

/** Usage:
 *  Initialization: TrieNode root = new TrieNode();
 *  Return a specific child node with char c: (root->children)[c - 'a']
 */
```

It is really `fast` to visit a child node. It is comparatively `easy` to visit a specific child since we can easily transfer a character to an index in most cases. But not all children nodes are needed. So there might be some `waste of space`.

> ### Second Solution - Map

```c++
struct TrieNode {
    unordered_map<char, TrieNode*> children;
    
    // you might need some extra values according to different cases
};

/** Usage:
 *  Initialization: TrieNode root = new TrieNode();
 *  Return a specific child node with char c: (root->children)[c]
 */
```

It is even `easier` to visit a specific child directly by the corresponding character. But it might be a little `slower` than using an array. However, it `saves some space` since we only store the children nodes we need. It is also more `flexible` because we are not limited by a fixed length and fixed range.

>  ### Insertion in Trie

![](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/qlwiLq.png)

> ### Search in Trie

![](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/uyWT6Q.png)

### [code]-208. Implement Trie (Prefix Tree)

![](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/d9pUZl.png)

![](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/TjrPEy.png)

There are several other data structures, like balanced trees and hash tables, which give us the possibility to search for a word in a dataset of strings. Then why do we need trie? Although hash table has $O(1)$ time complexity for looking for a key, it is not efficient in the following operations :

- Finding all keys with a common prefix.
- Enumerating a dataset of strings in lexicographical order.

Another reason **why trie outperforms hash table**, is that as hash table increases in size, there are lots of hash collisions and the search time complexity could deteriorate to $O(n)$, where n*n* is the number of keys inserted. Trie could use less space compared to Hash Table when storing many keys with the same prefix. In this case using trie has only $O(m)$ time complexity, where m*m* is the key length. Searching for a key in a balanced tree costs $O(m \log n)$ time complexity.

![](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/CNjQeo.png)


```c++
class Trie {
public:
    Trie() 
    {
      isword = false;
      for (int i = 0; i < 26; i++)
          next[i] = NULL;  
    }

    void insert(string word) {
        Trie* node = this;
        for (char ch : word) {
            ch -= 'a';
            if (!node->next[ch]) { node->next[ch] = new Trie(); }
            node = node->next[ch];
        }
        node->isword = true;
    }

    bool search(string word) {
        Trie* node = this;
        for (char ch : word) {
            ch -= 'a';
            if (!node->next[ch]) { return false; }
            node = node->next[ch];
        }
        return node->isword;
    }

    bool startsWith(string prefix) {
        Trie* node = this;
        for (char ch : prefix) {
            ch -= 'a';
            if (!node->next[ch]) { return false; }
            node = node->next[ch];
        }
        return true;
    }

private:
    Trie* next[26];
    bool isword;
};
```

![what does !NULL mean?](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/qqr59C.png)

### [code]-677. Map Sum Pairs

```c++
class MapSum {
public:
    map<string, int> count;
    MapSum() {
        
    }
    
    void insert(string key, int val) {
        count[key] = val;
    }
    
    int sum(string prefix) {
        int answer = 0;
        for(map<string, int>::iterator i = count.begin(); i != count.end(); i++)
        {
            if(i->first.find(prefix) == 0)
                answer += i->second;
        }
        return answer;
    }
};
```

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/b6n8T7.png" style="zoom: 40%;" />

### [code]-648. Replace Words

```python
>>> Input: dict = ["cat", "bat", "rat"]
    sentence = "the cattle was rattled by the battery"
    Output: "the cat was rat by the bat"

class Solution:
  	"""
  	200 ms	17.1 MB
  	"""
    def replaceWords(self, roots, sentence):
        rootset = set(roots)

        def replace(word):
            for i in range(1, len(word)):
                if word[:i] in rootset:
                    return word[:i]
            return word
				# 第一个参数 function 以参数序列中的每一个元素调用 function 函数，返回包含每次 function 函数返回值的新列表。map(function, iterable, ...)
        return " ".join(map(replace, sentence.split())) 
```

### [code]-211. Add and Search Word - Data structure design

```c++
// search(word) can search a literal word or a regular expression string containing only letters a-z or .. A . means it can represent any one letter.
>>> addWord("bad")
    addWord("dad")
    addWord("mad")
    search("pad") -> false
    search("bad") -> true
    search(".ad") -> true
    search("b..") -> true


class TrieNode {
public:
    bool word;
    TrieNode* children[26];
    TrieNode() {
        word = false;
        memset(children, NULL, sizeof(children));
    }
};

class WordDictionary {
public:
    /** Initialize your data structure here. */
    WordDictionary() {
        
    }
    
    /** Adds a word into the data structure. */
    void addWord(string word) {
        TrieNode* node = root;
        for (char c : word) {
            if (!node -> children[c - 'a']) {
                node -> children[c - 'a'] = new TrieNode();
            }
            node = node -> children[c - 'a'];
        }
        node -> word = true;
    }
    
    /** Returns if the word is in the data structure. A word could contain the dot character '.' to represent any one letter. */
    bool search(string word) {
        return search(word.c_str(), root);
    }
private:
    TrieNode* root = new TrieNode();
    
    bool search(const char* word, TrieNode* node) {
        for (int i = 0; word[i] && node; i++) {
            if (word[i] != '.') {
                node = node -> children[word[i] - 'a'];
            } else {
                TrieNode* tmp = node;
                for (int j = 0; j < 26; j++) {
                    node = tmp -> children[j];
                    // word + i + 1 <=> word[i+1],如果“.后面char”匹配成功，则说明匹配
                    if (search(word + i + 1, node)) {
                        return true;
                    }
                }
            }
        }
        return node && node -> word;
    }
};

/**
 * Your WordDictionary object will be instantiated and called as such:
 * WordDictionary* obj = new WordDictionary();
 * obj->addWord(word);
 * bool param_2 = obj->search(word);
 */
```

### [code]-421. Maximum XOR of Two Numbers in an Array

```c++
//Given a non-empty array of numbers, a0, a1, a2, … , an-1, where 0 ≤ ai < 231. Find the maximum result of ai XOR aj, where 0 ≤ i, j < n.

>>> Input: [3, 10, 5, 25, 2, 8]
    Output: 28
    Explanation: The maximum result is 5 ^ 25 = 28.


class Solution {
public:
    class TreeNode {
    public:
        TreeNode* next[2];
        TreeNode () {next[0] = NULL; next[1] = NULL;};
    };
    TreeNode* buildTree(vector<int>& nums) {
        TreeNode* root = new TreeNode(), *cur;
        int n = nums.size();
        for (int i = 0; i < n; i++) {
            int num = nums[i];
            cur = root;
            for (int j = 31; j >= 0; j--) {
                int index = ((num >> j) & 1);
                if (cur->next[index] ==  NULL)
                    cur->next[index] = new TreeNode();
                cur = cur->next[index];
            }
        }
        return root;
    }
    
    int helper(TreeNode* cur, int num) {
        int res = 0;
        for (int i = 31; i >= 0; i--) {
            int index = ((num >> i) & 1) ? 0 : 1;
            if (cur->next[index]) {
                res <<= 1;
                res |= 1;
                cur = cur->next[index];
            } else {
                res <<= 1;
                res |= 0;
                cur = cur->next[index ? 0 : 1];
            }
        }
        return res;
    }
    
    int findMaximumXOR(vector<int>& nums) {
        int res = 0;
        TreeNode* root = buildTree(nums);
        
        for (auto i : nums) {
            res = max(res, helper(root, i));
        }
        
        return res;
    }
};
```

