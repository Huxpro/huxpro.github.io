---
title: "2.Binary Tree"
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

|         时间         |                             题号                             | 总结                                                         |
| :------------------: | :----------------------------------------------------------: | :----------------------------------------------------------- |
|    **2020.03.06**    |                                                              | **制定刷题计划，开始刷题啦**                                 |
| **2020.03.07-03.09** | 【框架：双指针、哨兵节点】【算法：三步断链法、Floyd's cycle detection、链表拆并等】 | **Explore-Learn[1.链表]**                                    |
|        03.10         |         [二叉树]144. Binary Tree Preorder Traversal          | 用**栈**来实现**非递归**的**pre-order遍历**                  |
|        03.11         |          [二叉树]94. Binary Tree Inorder Traversal           | 用**栈**来实现**非递归**的**in-order遍历**                   |
|                      |         [二叉树]145. Binary Tree Postorder Traversal         | 用**双栈**来实现**非递归**的**post-order遍历** 【双100%】    |
|                      |        [二叉树]102. Binary Tree Level Order Traversal        | 用**队列**来实现**非递归**的**BFS遍历**                      |
|        03.12         |                       植树节·回家种树                        |                                                              |
|                      |          [二叉树]104. Maximum Depth of Binary Tree           | **[递归]**Top-down&Bottom-up                                 |
|                      |                 [二叉树]101. Symmetric Tree                  | 树是否关于中心对称？**[双树或者双队列]** **[递归]**          |
|                      |                    [二叉树]112. Path Sum                     | **把sum理解为remaining path sum**，太强了，把求和问题转为当前路径的最后一个节点是否与remaining path sum相等。**[递归]** |
|        03.13         | [二叉树]106. Construct Binary Tree from Inorder and Postorder Traversal | Postorder确定根节点，Inorder划分左右子树，**递归**           |
|                      | [二叉树]105. Construct Binary Tree from Preorder and Inorder Traversal | preorder确定根节点，Inorder划分左右子树，**递归**            |
|                      | [二叉树]116. Populating Next Right Pointers in Each Node/117. Populating Next Right Pointers in Each Node II | **[BFS]**+每层额外**添加NULL节点**+对二叉树是否是完全二叉树不作要求 |
|                      |     [二叉树]236. Lowest Common Ancestor of a Binary Tree     | (mid + left + right >= 2) 每找到一个点就对应标记为1，三个标记中达到2即可，**[绝妙的想法]** |
|                      | [二叉树]297. Serialize and Deserialize Binary Tree[**unsolved**] | 跨界题，涉及streamstring时再看                               |
|                      |                                                              |                                                              |
|                      |                                                              |                                                              |
|                      |                                                              |                                                              |

<p align="center">
  <img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/fwazdP.jpg" style="zoom:100%" />
</p>
<p align="center">
  <img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/8yoHi7.jpg" style="zoom:100%" />
</p>


## Explore-Learn[2.二叉树]

### [Iterative Traverse A Tree]-先根遍历、中根遍历、后跟遍历

<p align="center">
  <img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/pRkhRn.jpg" style="zoom:100%" />
</p>

<p align="center">
  <img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/AIaKxT.jpg" style="zoom:70%" />
</p>

<p align="center">
  <img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/r5REDK.jpg" style="zoom:100%" />
</p>

- Also, **post-order** is widely use in **mathematical expression**. It is easier to write a program to parse a post-order expression. Here is an example:

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/Vd203J.jpg" alt="img" style="zoom:25%;" />

- If you handle this tree in **postorder**, you can easily handle the expression using a **stack**. Each time when you meet a operator, you can just pop 2 elements from the stack, calculate the result and push the result back into the stack.

### [code]-144. Binary Tree Preorder Traversal

<p align="center">
  <img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/XegHum.jpg" style="zoom:100%" />
</p>

```c++
#include <iostream>
#include <stack>
#include <vector>

using namespace std;


struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode(int x) : val(x), left(NULL), right(NULL) {}
};
class Solution {
    public:
        vector<int> preorderTraversal(TreeNode* root) {
            vector<int> retVal;
            if (root==NULL) {
              // Nothing returns nothing.
            return retVal;
            }

            TreeNode* p=root;
            stack<TreeNode*> nodeStack;
            while(1)
            {
                while(p!=NULL)
                {
                    retVal.push_back(p->val); //从根节点开始存入vector

                    nodeStack.push(p);//pre-order先根遍历，栈顶存放根节点
                    p=p->left;//根节点遍历好后，遍历左子树
                }
                if(nodeStack.empty()) break;
                p = nodeStack.top();
                nodeStack.pop();
                p=p->right;//如果左子树为空，通过上一个根节点遍历右子树
            }

            return retVal;
    }
};


int main() {
    TreeNode *head_link = new TreeNode(1);
    head_link->left=NULL;
    head_link->right= new TreeNode(2);
    head_link->right->left=new TreeNode(3);
    head_link->right->right=NULL;
    Solution solu;
    solu.preorderTraversal(head_link);
  
    return 0;
}
```

### [code]-94. Binary Tree Inorder Traversal

<p align="center">
  <img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/w0Rv3Z.jpg" style="zoom:100%" />
</p>

```c++
/**
 * Definition for a binary tree node.
 * struct TreeNode {
 *     int val;
 *     TreeNode *left;
 *     TreeNode *right;
 *     TreeNode(int x) : val(x), left(NULL), right(NULL) {}
 * };
 */
class Solution {
    public:
        vector<int> inorderTraversal(TreeNode* root) {
        vector<int> retVal;
        if (root==NULL) {
          // Nothing returns nothing.
        return retVal;
        }
        
        TreeNode* p=root;
        stack<TreeNode*> nodeStack;
        while(1)
        {
            while(p!=NULL)
            {
                nodeStack.push(p);//in-order中根遍历，栈顶存放根节点
                p=p->left;
                // retVal.push_back(p->val); 
            }
            if(nodeStack.empty()) break;
            p = nodeStack.top();
            nodeStack.pop();
            retVal.push_back(p->val); //从左子树开始存入vector
            p=p->right;
        }
    
        return retVal;
    }
};
```

### [code]-145. Binary Tree Postorder Traversal

<p align="center">
  <img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/eOzBoD.jpg" style="zoom:100%" />
</p>

<p align="center">
  <img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/8RsTAn.jpg" style="zoom:100%" />
</p>

```c++
/**
 * Definition for a binary tree node.
 * struct TreeNode {
 *     int val;
 *     TreeNode *left;
 *     TreeNode *right;
 *     TreeNode(int x) : val(x), left(NULL), right(NULL) {}
 * };
 */
class Solution {
public:
    vector<int> postorderTraversal(TreeNode* root) {
        vector<int> retVal;
        if (root==NULL) {
          // Nothing returns nothing.
        return retVal;
        }
        
        stack<TreeNode*> s1;
        stack<TreeNode*> s2;
        TreeNode* p=root;
        s1.push(p);
        
        while(!s1.empty())
        {
            p = s1.top();
          	//s1每出一次栈，把出栈元素放入s2，然后遍历当前p是否存在左右子树，若存在，依次存入s1
            s1.pop();
            s2.push(p);
            if(p->left!=NULL) s1.push(p->left);
            if(p->right!=NULL) s1.push(p->right);
        }
        while(!s2.empty()) //s2中元素的出栈顺序即为后根遍历的顺序
        {
            p = s2.top();
            s2.pop();
            retVal.push_back(p->val);
        }
        return retVal;
    }
};
```

### [Recursive Traverse A Tree]-先根遍历、中根遍历、后跟遍历

```c++
//preeorder
class Solution {
public:
    vector<int> preorderTraversal(TreeNode* root) {
        vector<int> nodes;
        preorder(root, nodes);
        return nodes;
    }
private:
    void preorder(TreeNode* root, vector<int>& nodes) {
        if (!root) {
            return;
        }
        nodes.push_back(root -> val);
        preorder(root -> left, nodes);
        preorder(root -> right, nodes);
    }
};
```

```c++
// inorder
class Solution {
public:
    vector<int> inorderTraversal(TreeNode* root) {
        vector<int> nodes;
        inorder(root, nodes);
        return nodes;
    }
private:
    void inorder(TreeNode* root, vector<int>& nodes) {
        if (!root) {
            return;
        }
        inorder(root -> left, nodes);
        nodes.push_back(root -> val);
        inorder(root -> right, nodes);
    }
};
```

```c++
//postorder
class Solution {
public:
    vector<int> postorderTraversal(TreeNode* root) {
        vector<int> nodes;
        postorder(root, nodes);
        return nodes;
    }
private:
    void postorder(TreeNode* root, vector<int>& nodes) {
        if (!root) {
            return;
        }
        postorder(root -> left, nodes);
        postorder(root -> right, nodes);
        nodes.push_back(root -> val);
    }
};
```

### [Iterative Traverse A Tree]-层级遍历Level-order(BFS)

<p align="center">
  <img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/jOzEgn.jpg" style="zoom:100%" />
</p>



### [code]-102. Binary Tree Level Order Traversal

<p align="center">
  <img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/R0nsxL.jpg" style="zoom:100%" />
</p>

```c++
class Solution {
public:
    vector<vector<int>> levelOrder(TreeNode* root) {
        if (!root) { return {}; } //return an object of the function's return type
        vector<int> row; 
        vector<vector<int> > result; 
        queue<TreeNode*> q;
        q.push(root);
        int count = 1;
						// 队列q非空，依次遍历左右子树
            while (!q.empty()) {
            if (q.front()->left) { q.push(q.front()->left); }
            if (q.front()->right) { q.push(q.front()->right); }
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

### [Recursively Traverse A Tree]-循环递归Top-down&Bottom-up

```c++
>>> "Top-down" Solution

int answer; // don't forget to initialize answer before call maximum_depth
void maximum_depth(TreeNode* root, int depth) {
    if (!root) {
        return;
    }
    if (!root->left && !root->right) {
        answer = max(answer, depth);
    }
    maximum_depth(root->left, depth + 1);
    maximum_depth(root->right, depth + 1);
}
```

```c++
>>> "Bottom-up" Solution

int maximum_depth(TreeNode* root) {
	if (!root) {
    return 0;   // return 0 for null node
	}
	int left_depth = maximum_depth(root->left);
	int right_depth = maximum_depth(root->right);
	return max(left_depth, right_depth) + 1;	  // return depth of the subtree rooted at root
}
```

**It is not easy to understand recursion and find out a recursive solution for the problem. It needs practice.**

When you meet a tree problem, ask yourself two questions: **Can you determine some parameters to help the node know its answer**? **Can you use these parameters and the value of the node itself to determine what should be the parameters passed to its children**? If the answers are both yes, try to solve this problem using a "`top-down`" recursive solution.

Or, you can think of the problem in this way: for a node in a tree, **if you know the answer of its children, can you calculate the answer of that node**? If the answer is yes, solving the problem recursively using a `bottom up` approach might be a good idea.

### [code]-104. Maximum Depth of Binary Tree

```c++
/**
 * Definition for a binary tree node.
 * struct TreeNode {
 *     int val;
 *     TreeNode *left;
 *     TreeNode *right;
 *     TreeNode(int x) : val(x), left(NULL), right(NULL) {}
 * };
 */
class Solution {
public:
    int maxDepth(TreeNode* root) { //bottom up
        if(root==NULL)  return 0;
        
        int left_deep=maxDepth(root->left);
        int right_deep=maxDepth(root->right);
        return max(left_deep,right_deep)+1;
    }
};
```

### [code]-101. Symmetric Tree


<p align="center">
  <img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/OSUmdT.jpg" style="zoom:100%" />
</p>

<p align="center">
  <img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/WLsW13.jpg" style="zoom:100%" />
</p>
```c++
/**
 * Definition for a binary tree node.
 * struct TreeNode {
 *     int val;
 *     TreeNode *left;
 *     TreeNode *right;
 *     TreeNode(int x) : val(x), left(NULL), right(NULL) {}
 * };
 */

class Solution {
public:
    bool isMirror(TreeNode *r1, TreeNode *r2)
    {
        if(r1==NULL && r2==NULL) return true;
        if(r1==NULL || r2==NULL) return false;
        
        return (r1->val==r2->val) && 
                isMirror(r1->left,r2->right) &&
                isMirror(r1->right,r2->left);
    }
    
    bool isSymmetric(TreeNode* root) {
        return isMirror(root, root);
    }
};
```



### [code]-112. Path Sum

It is important to clarify the logic meaning of `sum` such that we can keep our mind clear:
`sum`: represents the **remaining path sum** from current node to leaf node before the current node is taken into consideration. That's why for the leaf node, we need to do `sum - root.val == 0`

```c++
bool hasPathSum(TreeNode *root, int sum) {
		if (root == NULL) return false;
  	if (root->val == sum && root->left ==  NULL && root->right == NULL) return true;
  	return hasPathSum(root->left, sum-root->val) || hasPathSum(root->right, sum-root->val);
    }
```

### [code]-106. Construct Binary Tree from Inorder and Postorder Traversal

```c++
// From the post-order array, we know that last element is the root. We can find the root in in-order array. Then we can identify the left and right sub-trees of the root from in-order array.
// Using the length of left sub-tree, we can identify left and right sub-trees in post-order array. Recursively, we can build up the tree.

// Use a HashMap to record the index of root in the inorder array.
      
      

/**
 * Definition for a binary tree node.
 * struct TreeNode {
 *     int val;
 *     TreeNode *left;
 *     TreeNode *right;
 *     TreeNode(int x) : val(x), left(NULL), right(NULL) {}
 * };
 */
class Solution {
public:
    TreeNode* buildTree(vector<int>& inorder, vector<int>& postorder) {
        int inStart=0;
        int inEnd=inorder.size()-1;
        int postStart=0;
        int postEnd=postorder.size()-1;

        return buildTree(inorder, inStart, inEnd, postorder, postStart, postEnd);
    }
    
    TreeNode* buildTree(vector<int>& inorder, int inStart, int inEnd,
		vector<int>& postorder, int postStart, int postEnd)
    {
        if (inStart > inEnd || postStart > postEnd) return NULL;
        
        int rootValue = postorder[postEnd]; //postorder确定节点，inorder划分左右子树
	    	TreeNode *root = new TreeNode(rootValue);
        
        int k = 0;
        for (int i = 0; i < inorder.size(); i++) {
            if (inorder[i] == rootValue) {
                k = i;   //找到左右子树的划分位置，k
                break;
            }
        }
      
      	>>> 每次取postorder的最后一个值mid，将其作为树的根节点
        >>> 然后从inroder中找到mid，将其分割成为两部分，左边作为mid的左子树，右边作为mid的右子树
            >>> tree:     8 4 10 3 6 9 11
            >>> Inorder   [3 4 6] 8 [9 10 11]
            >>> postorder [3 6 4]   [9 11 10] 8
        
        root->left = buildTree(inorder, inStart, k - 1, 
                               postorder, postStart, postStart + (k-inStart) - 1); 
      													//(k-inStart) mid左边有几个数
	    	root->right = buildTree(inorder, k + 1, inEnd, 
                                postorder, postStart + (k-inStart), postEnd - 1);
        
        return root;
    }
};
```

### [code]-105. Construct Binary Tree from Preorder and Inorder Traversal

```c++
/**
 * Definition for a binary tree node.
 * struct TreeNode {
 *     int val;
 *     TreeNode *left;
 *     TreeNode *right;
 *     TreeNode(int x) : val(x), left(NULL), right(NULL) {}
 * };
 */
class Solution {
public:
    TreeNode* buildTree(vector<int>& preorder, vector<int>& inorder) {
        int preStart=0;
        int preEnd=preorder.size()-1;
        int inStart=0;
        int inEnd=inorder.size()-1;

        return buildTree(preorder, preStart, preEnd, inorder, inStart, inEnd);
    }
    
    TreeNode* buildTree(vector<int>& preorder, int preStart, int preEnd,
		vector<int>& inorder, int inStart, int inEnd)
    {
        if (preStart > preEnd || inStart > inEnd) return NULL;
        
        int rootValue = preorder[preStart]; //postorder确定节点，inorder划分左右子树
        TreeNode *root = new TreeNode(rootValue);
        
        int k = 0;
        for (int i = 0; i < inorder.size(); i++) {
            if (inorder[i] == rootValue) {
                k = i;   //找到左右子树的划分位置，k
                break;
            }
        }
        root->left = buildTree(preorder, preStart+1, preStart+(k-inStart), 
                               inorder, inStart, k - 1);
      												//(k-inStart) mid左边有几个数
        root->right = buildTree(preorder, preEnd-(inEnd-k)+1, preEnd, 
                                inorder, k+1, inEnd);
      												//(inEnd-k) mid右边有几个数
        
        return root;
    }
};
```

### [code]-116. Populating Next Right Pointers in Each Node/117. Populating Next Right Pointers in Each Node II

```c++
/*
// Definition for a Node.
class Node {
public:
    int val;
    Node* left;
    Node* right;
    Node* next;

    Node() : val(0), left(NULL), right(NULL), next(NULL) {}

    Node(int _val) : val(_val), left(NULL), right(NULL), next(NULL) {}

    Node(int _val, Node* _left, Node* _right, Node* _next)
        : val(_val), left(_left), right(_right), next(_next) {}
};
*/
class Solution {
public:
    Node* connect(Node* root) {
        if(!root) return NULL;
        
        queue<Node*> q;
        q.push(root);
        q.push(NULL);
        
        while(!q.empty())
        {
            Node *cur=q.front();
            q.pop();
            
            if(cur==NULL)
            {
                if(q.size()>0) q.push(NULL); //当前这层遍历完，开始遍历下一层，加上NULL
            }
            else
            {
                cur->next=q.front();
                if(cur->left!=NULL) q.push(cur->left);
                if(cur->right!=NULL) q.push(cur->right);
            }
        }
        return root;
    }
};
```

### [code]-236. Lowest Common Ancestor of a Binary Tree

<p align="center">
  <img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/6GkFHr.jpg" style="zoom:40%" />
</p>

```c++
1 --> 2 --> 4 --> 8
BACKTRACK 8 --> 4
4 --> 9 (ONE NODE FOUND, return True)
BACKTRACK 9 --> 4 --> 2
2 --> 5 --> 10
BACKTRACK 10 --> 5
5 --> 11 (ANOTHER NODE FOUND, return True)
BACKTRACK 11 --> 5 --> 2

2 is the node where we have left = True and right = True and hence it is the lowest common ancestor.
```

```c++
class Solution {

    private TreeNode ans;

    public Solution() {
        // Variable to store LCA node.
        this.ans = null;
    }

    private boolean recurseTree(TreeNode currentNode, TreeNode p, TreeNode q) {

        // If reached the end of a branch, return false.
        if (currentNode == null) {
            return false;
        }

        // Left Recursion. If left recursion returns true, set left = 1 else 0
        int left = this.recurseTree(currentNode.left, p, q) ? 1 : 0;

        // Right Recursion
        int right = this.recurseTree(currentNode.right, p, q) ? 1 : 0;

        // If the current node is one of p or q
        int mid = (currentNode == p || currentNode == q) ? 1 : 0;


        // If any two of the flags left, right or mid become True
        if (mid + left + right >= 2) {
            this.ans = currentNode;
        }

        // Return true if any one of the three bool values is True.
        return (mid + left + right > 0);
    }

    public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
        // Traverse the tree
        this.recurseTree(root, p, q);
        return this.ans;
    }
}
```

### [code]-297. Serialize and Deserialize Binary Tree

```c++
/**
 * Definition for a binary tree node.
 * struct TreeNode {
 *     int val;
 *     TreeNode *left;
 *     TreeNode *right;
 *     TreeNode(int x) : val(x), left(NULL), right(NULL) {}
 * };
 */

// Note: Do not use class member/global/static variables to store states. Your serialize and deserialize algorithms should be stateless.

class Codec {
public:

    // Encodes a tree to a single string.
    string serialize(TreeNode* root) {
        if (root == NULL) return "#";
        return to_string(root->val) + "," + serialize(root->left) + "," + serialize(root->right);
    }

    TreeNode* deserialize(string data) {
        if (data == "#") return NULL;
        stringstream s(data);
        return makeDeserialize(s);
    }
    
    TreeNode* makeDeserialize(stringstream& s) {
        string str;
        getline(s, str, ',');
        if (str == "#") {
            return NULL;
        } else {
            TreeNode* root = new TreeNode(stoi(str));
            root->left = makeDeserialize(s);
            root->right = makeDeserialize(s);
            return root;
        }
    }
};

// Your Codec object will be instantiated and called as such:
// Codec codec;
// codec.deserialize(codec.serialize(root));
```

