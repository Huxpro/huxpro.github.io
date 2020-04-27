---
title: "4.Binary Search Tree"
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
|  **2020.03.10-13**   | 【框架：先根中根后根遍历、BFS】【算法：用栈实现非递归、递归、双栈双树等】 | **Explore-Learn[2.二叉树]**                                  |
|    **2020.03.15**    | 【框架：先根后根遍历、BFS\DFS】【算法：用栈实现先根非递归、用双栈实现后根非递归、用队列实现非递归层次遍历BFS、递归实现DFS】 | **Explore-Learn[3.N叉树]**                                   |
|        03.16         |        【二叉搜索树】98. Validate Binary Search Tree         | **DFS+中根遍历**                                             |
|                      |        【二叉搜索树】173. Binary Search Tree Iterator        | **DFS+中根遍历**                                             |
|        03.17         |      【二叉搜索树】700. Search in a Binary Search Tree       | 二叉搜索树的查找                                             |
|                      |     【二叉搜索树】701. Insert into a Binary Search Tree      | 二叉搜索树的插入                                             |
|                      |           【二叉搜索树】450. Delete Node in a BST            | 【**秒啊**】二叉搜索树删除节点，**递归**，替换**找到的右子树的最小值** |
|                      |      【二叉搜索树】703. Kth Largest Element in a Stream      | **优先队列**返回第k大的值                                    |
|                      | 【二叉搜索树】235. Lowest Common Ancestor of a Binary Search Tree | **递归**                                                     |
|                      | **<font color=red>【不会】220.Contains Duplicate III</font>** | 跨章节了吧？？？                                             |
|                      | **<font color=red>【不会】110. Balanced Binary Tree</font>** | **递归**                                                     |
|                      | 【二叉搜索树】108. Convert Sorted Array to Binary Search Tree | 容器vector中间元素作为根节点                                 |
|                      |                                                              |                                                              |
|                      |                                                              |                                                              |


<p align="center">
  <img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/LLYYHS.jpg" style="zoom:100%" />
</p>
<p align="center">
  <img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/acjIvh.jpg" style="zoom:100%" />
</p>

## Explore-Learn[4.二叉搜索树]

### [code]-98. Validate Binary Search Tree

<p align="center">
  <img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/JqZm2G.jpg" style="zoom:60%" />
</p>

```java
//Approach 1: Recursion
class Solution {
  public boolean helper(TreeNode node, Integer lower, Integer upper) {
    if (node == null) return true;

    int val = node.val;
    if (lower != null && val <= lower) return false;
    if (upper != null && val >= upper) return false;

    if (! helper(node.right, val, upper)) return false;
    if (! helper(node.left, lower, val)) return false;
    return true;
  }

  public boolean isValidBST(TreeNode root) {
    return helper(root, null, null);
  }
}
```

```java
//Approach 2: Iteration
class Solution {
  LinkedList<TreeNode> stack = new LinkedList();
  LinkedList<Integer> uppers = new LinkedList(),
          lowers = new LinkedList();

  public void update(TreeNode root, Integer lower, Integer upper) {
    stack.add(root);
    lowers.add(lower);
    uppers.add(upper);
  }

  public boolean isValidBST(TreeNode root) {
    Integer lower = null, upper = null, val;
    update(root, lower, upper);

    while (!stack.isEmpty()) {
      root = stack.poll();
      lower = lowers.poll();
      upper = uppers.poll();

      if (root == null) continue;
      val = root.val;
      if (lower != null && val <= lower) return false;
      if (upper != null && val >= upper) return false;
      update(root.right, val, upper);
      update(root.left, lower, val);
    }
    return true;
  }
}
```

<p align="center">
  <img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/pb3Bdr.jpg" style="zoom:60%" />
</p>

<p align="center">
  <img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/VSmZpI.jpg" style="zoom:60%" />
</p>

```java
class Solution {
  public boolean isValidBST(TreeNode root) {
    Stack<TreeNode> stack = new Stack();
    double inorder = - Double.MAX_VALUE;

    while (!stack.isEmpty() || root != null) {
      while (root != null) {
        stack.push(root);
        root = root.left;
      }
      root = stack.pop();
      // If next element in inorder traversal
      // is smaller than the previous one
      // that's not BST.
      if (root.val <= inorder) return false;
      inorder = root.val;
      root = root.right;
    }
    return true;
  }
}
```

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
    bool isValidBST(TreeNode* root) {
        stack<TreeNode*> s1;
        long inorder = 0;
        bool flag=false;
        
        while(!s1.empty() || root!=NULL)
        {
            while(root!=NULL)
            {
                s1.push(root);
                root=root->left;
            }
            root=s1.top();
            s1.pop();
            if(flag==false)
            {
                flag=true;
            }
            else if(root->val <=  inorder) return false;
            inorder=root->val;
            root=root->right;
        }
        return true;
    }
};
```

### [code]-173. Binary Search Tree Iterator


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
class BSTIterator {
private:
    stack<TreeNode*> st;
public:
    BSTIterator(TreeNode *root) {
        find_left(root);
    }

    /** @return whether we have a next smallest number */
    bool hasNext() {
        if (st.empty())
            return false;
        return true;
    }

    /** @return the next smallest number */
    int next() {
        TreeNode* top = st.top();
        st.pop();
        if (top->right != NULL)
            find_left(top->right);
            
        return top->val;
    }
    
    /** put all the left child() of root */
    void find_left(TreeNode* root)
    {
        TreeNode* p = root;
        while (p != NULL)
        {
            st.push(p);
            p = p->left;
        }
    }
};

/**
 * Your BSTIterator object will be instantiated and called as such:
 * BSTIterator* obj = new BSTIterator(root);
 * int param_1 = obj->next();
 * bool param_2 = obj->hasNext();
 */
```

### [code]-700. Search in a Binary Search Tree

<p align="center">
  <img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/uhZOKQ.jpg" style="zoom:60%" />
</p>

```c++
TreeNode* searchBST(TreeNode* root, int val) {
    while (root != nullptr && root->val != val) {
      root = (root->val > val) ? root->left : root->right;
    }
    return root;
}
```

### [code]-701. Insert into a Binary Search Tree

<p align="center">
  <img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/lW71Sw.jpg" style="zoom:60%" />
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
    TreeNode* insertIntoBST(TreeNode* root, int val) {
        TreeNode *newNode = new TreeNode(val);
        if(root==NULL) 
        {
            return newNode;
        }
        
        TreeNode *p=root,*temp=root;
        
        while(p!=NULL)
        {
            temp=p;
            if(p->val < val) p=p->right;
            else if(p->val > val) p=p->left;
        }
        if(temp->val<val) temp->right=newNode;
        else temp->left=newNode;
        
        return root;
            
    }
};
```

### [code]-450. Delete Node in a BST

<p align="center">
  <img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/meMBr3.jpg" style="zoom:60%" />
</p>

```c++
/* Deleting a node from Binary search tree */
#include<iostream>
using namespace std;
struct Node {
	int data;
	struct Node *left;
	struct Node *right;
};
//Function to find minimum in a tree. 
Node* FindMin(Node* root)
{
	while(root->left != NULL) root = root->left;
	return root;
}

// Function to search a delete a value from tree.
struct Node* Delete(struct Node *root, int data) {
	if(root == NULL) return root; 
	else if(data < root->data) root->left = Delete(root->left,data);
	else if (data > root->data) root->right = Delete(root->right,data);
	// Wohoo... I found you, Get ready to be deleted	
	else {
		// Case 1:  No child
		if(root->left == NULL && root->right == NULL) { 
			delete root;
			root = NULL;
		}
		//Case 2: One child 
		else if(root->left == NULL) {
			struct Node *temp = root;
			root = root->right;
			delete temp;
		}
		else if(root->right == NULL) {
			struct Node *temp = root;
			root = root->left;
			delete temp;
		}
		// case 3: 2 children
		else { 
			struct Node *temp = FindMin(root->right);
			root->data = temp->data;
			root->right = Delete(root->right,temp->data);
		}
	}
	return root;
}
 
//Function to visit nodes in Inorder
void Inorder(Node *root) {
	if(root == NULL) return;
 
	Inorder(root->left);       //Visit left subtree
	printf("%d ",root->data);  //Print data
	Inorder(root->right);      // Visit right subtree
}
 
// Function to Insert Node in a Binary Search Tree
Node* Insert(Node *root,char data) {
	if(root == NULL) {
		root = new Node();
		root->data = data;
		root->left = root->right = NULL;
	}
	else if(data <= root->data)
		root->left = Insert(root->left,data);
	else 
		root->right = Insert(root->right,data);
	return root;
}

int main() {
	/*Code To Test the logic
	  Creating an example tree
	                    5
			   / \
			  3   10
			 / \   \
			1   4   11
    */
	Node* root = NULL;
	root = Insert(root,5); root = Insert(root,10);
	root = Insert(root,3); root = Insert(root,4); 
	root = Insert(root,1); root = Insert(root,11);

	// Deleting node with value 5, change this value to test other cases
	root = Delete(root,5);

	//Print Nodes in Inorder
	cout<<"Inorder: ";
	Inorder(root);
	cout<<"\n";
}
```

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
    TreeNode* findmin(TreeNode* root)
    {
        while(root->left!=NULL)
        {
            root=root->left;
        }
        return root;
    }
    
    TreeNode* deleteNode(TreeNode* root, int key) {
        if(root==NULL) return NULL;
        else if(key < root->val) root->left=deleteNode(root->left,key);
        else if(key > root->val) root->right=deleteNode(root->right,key);
        // Wohoo... I found you, Get ready to be deleted	
        else{
            //Case 1:  No child
            if(root->left==NULL && root->right==NULL)
            {
                delete root;
                root=NULL;
            }
            //Case 2: One child 
            else if(root->left==NULL)
            {
                TreeNode *temp=root;
                root=root->right;
                delete temp;
            }
            else if(root->right==NULL)
            {
                TreeNode *temp=root;
                root=root->left;
                delete temp;
            }
            // case 3: 2 children  将要删除的节点替换为右子树值最小的节点，递归删除替换的节点
            else{
                TreeNode *temp=findmin(root->right);
                root->val=temp->val;
                root->right=deleteNode(root->right,temp->val);
            }
        }
        return root;
    }
};
```

### 【conclusion】

The strength of a BST is that you can **perform all search, insertion and deletion operations** in `O(h)` time complexity **even in the worst case**.

Usually, if you want to **store data in order and need several operations, such as search, insertion or deletion**, **at the same time, a BST might be a good choice**.

<p align="center">
  <img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/4TSRsI.jpg" style="zoom:60%" />
</p>
### [code]-703. Kth Largest Element in a Stream

```c++
class KthLargest {
private:
    int K;
    priority_queue<int, vector<int>, greater<int>> pq;
public:
    KthLargest(int k, vector<int> nums) {
        K = k;
        for (auto n : nums)
            add(n);
    }
    
    int add(int val) {
        if (pq.size() < K || val > pq.top())
            pq.push(val);
        
        if (pq.size() > K)
            pq.pop();
        
        return pq.top();
    }
};

/**
 * Your KthLargest object will be instantiated and called as such:
 * KthLargest* obj = new KthLargest(k, nums);
 * int param_1 = obj->add(val);
 */
```

### [code]-235. Lowest Common Ancestor of a Binary Search Tree

<p align="center">
  <img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/XiR6d5.jpg" style="zoom:60%" />
</p>

```java
class Solution {
    public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {

        // Value of current node or parent node.
        int parentVal = root.val;

        // Value of p
        int pVal = p.val;

        // Value of q;
        int qVal = q.val;

        if (pVal > parentVal && qVal > parentVal) {
            // If both p and q are greater than parent
            return lowestCommonAncestor(root.right, p, q);
        } else if (pVal < parentVal && qVal < parentVal) {
            // If both p and q are lesser than parent
            return lowestCommonAncestor(root.left, p, q);
        } else {
            // We have found the split point, i.e. the LCA node.
            return root;
        }
    }
}
```

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
    TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {
        
        if(root->val > p->val && root->val > q->val)
        {
            return lowestCommonAncestor(root->left,p,q);
        }
        else if(root->val < p->val && root->val < q->val)
        {
            return lowestCommonAncestor(root->right,p,q);
        }
        else{
            return root;
        }
        
    }
};
```

### [code]-108. Convert Sorted Array to Binary Search Tree

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
    TreeNode* sortedArrayToBST(vector<int>& nums) {
        if(nums.size()==0) return NULL;
        TreeNode* head = sortedArrayToBST_helper(nums, 0, nums.size()-1);
        return head;
    }
    
    TreeNode* sortedArrayToBST_helper(vector<int>& nums, int start, int end)
    {
        if(start > end) return NULL;
        
        int mid = start + (end-start)/2; 
        TreeNode* root = new TreeNode(nums[mid]);
        root->left=sortedArrayToBST_helper(nums, start, mid-1);
        root->right=sortedArrayToBST_helper(nums, mid+1, end);
        return root;
    }
    
};
```

### 【cheatsheet】

<p align="center">
  <img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/RMw3TX.jpg" style="zoom:60%" />
</p>

<p align="center">
  <img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/4a4ApG.jpg" style="zoom:60%" />
</p>

<p align="center">
  <img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/LXwOP3.jpg" style="zoom:60%" />
</p>

