---
title: "开篇&1.Linked List"
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

# leetcode刷题

## 【进度汇总】

|      时间      |                             题号                             | 总结                                                         |
| :------------: | :----------------------------------------------------------: | :----------------------------------------------------------- |
| **2020.03.06** |                                                              | **制定刷题计划，开始刷题啦**                                 |
|     03.07      |                  **Explore-Learn[1.链表]**                   | 707. Design Linked List 熟悉链表结构体、指针操作             |
|     03.08      |                [单链表]141.linked list cycle                 | 两个思路：hash table与**two pointer**[return wheather it has a cycle] |
|                |                [单链表]142. Linked List Cycle                | **Floyd's cycle detection algorithm**[return the node where the cycle begins] |
|                |        [单链表]160. Intersection of Two Linked Lists         | **two pointer**[A\*LB\*A] [B\*LA\*B]第二个*号即为交点位置    |
|                |         [单链表]19. Remove Nth Node From End of List         | **two pointer**[快指针比慢指针**先走n步**，**引入头节点**]   |
|                |               [单链表]206.Reverse Linked List                | Iterative[**三步断链法**] & Recursive[**可视化解释递归**]    |
|     03.09      |           [单链表]203. Remove Linked List Elements           | **two pointer[哨兵节点真]心好用**，避免了很多空指针的问题，自己ac出来，赞 |
|                |              [单链表]328. Odd Even Linked List               | **two pointer**[**拆分奇偶两条链，三步断链法**，超牛逼的想法，卧槽] |
|                |             [单链表]234. Palindrome Linked List              | **two pointer**[判断是否为**回文链表**，只需将中间节点后的链表**reverse**，然后判断前半部分与reverse链表是否相等] |
|                |               [双链表]707. Design Linked List                | 设计双链表的基本功能函数，对比了单链表的设计                 |
|                |              [双链表]21. Merge Two Sorted Lists              | **[三元表达式]的妙用：确定头链**，然后就是比大小拆链合并     |
|                |                  [单链表]2. Add Two Numbers                  | **[三元表达式]的妙用：(l1 ? l1->next : l1)** 遍历到空指针时**返回最后一个节点本身而不是空指针** |
|                | **<font color=red>[双链表]430. Flatten a Multilevel Doubly Linked List</font>** | **把child节点 转为 next节点-》flatten的思想核心**            |
|     03.10      |          [双链表]138. Copy List with Random Pointer          | 链的拷贝与拆分，最不受人喜欢的题目之一。。                   |
|                |                   [单链表]61. Rotate List                    | **[三步断链法]、rotate对链长取模减小rotate次数**             |
|                |                                                              |                                                              |
|                |                                                              |                                                              |

<p align="center">
  <img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/PhIfzr.jpg" style="zoom:100%" />
</p>


## **Explore-Learn[1.链表]**

### 【Singly Linked List】

- **目标**
  
  - Understand **the structure of** singly linked list and doubly linked list;
  - **Implement traversal, insertion, deletion** in a singly or doubly linked list;
  - Analyze the **complexity of different operations** in a singly or doubly linked list;
  - Use **two-pointer technique** (fast-pointer-slow-pointer technique) in the linked list;
  - Solve **classic problems** such as reverse a linked list;
  - Analyze the complexity of the algorithms you designed;
- Accumulate experience in designing and debugging.
  
- **单链表**

  ```c++
  // Definition for singly-linked list.
  struct SinglyListNode {
      int val; //the value of the current node
      SinglyListNode *next; //a pointer/reference to the next node
      SinglyListNode(int x) : val(x), next(NULL) {} 
    	//it's a constructor, for example if u call ListNode(5) it will set the parameters 	val to 5, and next to NULL
  };
  ```

  - In most cases, we will use the `head` node (the first node) to **represent the whole list**.

  <p align="center">
    <img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/ftllTD.jpg" style="zoom:40%" />
  </p>

<p align="center">
  <img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/UZj6wu.jpg" style="zoom:40%" />
</p>

<p align="center">
  <img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/hG7ExU.jpg" style="zoom:40%" />
</p>

### [code]-707. Design Linked List

```c++
struct Node
{
    int val;
    Node *next;
    Node(int x):val(x),next(NULL){};
};
class MyLinkedList {
public:
    /** Initialize your data structure here. */
    Node *head;
    Node *tail;
    int size; // 记录链表的大小（节点数？）
  	// 类的构造函数是类的一种特殊的成员函数，它会在每次创建类的新de对象时执行。构造函数的名称与类的名称是完全相同的，并且不会返回任何类型，也不会返回 void。构造函数可用于为某些成员变量设置初始值。
    MyLinkedList() {
        this->head=NULL;
        this->tail=NULL;
        this->size=0;
      	//这里的this即MyLinkedList对象自己r
     		//在 C++ 中，每一个对象都能通过 this 指针来访问自己的地址。this 指针是所有成员函数的隐含参数。因此，在成员函数内部，它可以用来指向调用对象。
      	//当我们调用成员函数时，实际上是替某个对象调用它。成员函数通过一个名为 this 的额外隐式参数来访问调用它的那个对象，当我们调用一个成员函数时，用请求该函数的对象地址初始化 this。
    }
    
    /** Get the value of the index-th node in the linked list. If the index is invalid, return -1. */
    int get(int index) {
        if(index>=this->size)
            return -1;
        Node *temp=this->head;
        int counter=0;
        while(temp)
        {
            if(counter++==index) //从0开始比，即先0==index，比完后执行++操作
            {
                return temp->val;
            }
            temp=temp->next;
        }
        return -1;
    }
    
    /** Add a node of value val before the first element of the linked list. After the insertion, the new node will be the first node of the linked list. */
    void addAtHead(int val) {
        Node *temp=new Node(val);
        if(this->head==NULL)
        {
            this->head=temp;
            this->tail=temp;
        }
        else
        {
            temp->next=this->head;
            this->head=temp;
        }
        this->size++;
    }
    
    /** Append a node of value val to the last element of the linked list. */
    void addAtTail(int val) {
        Node *temp=new Node(val);
        if(this->tail==NULL)
        {
            this->head=temp;
            this->tail=temp;
        }
        else
        {
            this->tail->next=temp;
            this->tail=temp;
        }
        this->size++;
    }
    
    /** Add a node of value val before the index-th node in the linked list. If index equals to the length of linked list, the node will be appended to the end of linked list. If index is greater than the length, the node will not be inserted. */
    void addAtIndex(int index, int val) {
        if(index>this->size)
            return;
        if(this->size==index)
        {
            this->addAtTail(val);
            return;
        }
        if(index==0)
        {
            this->addAtHead(val);
            return;
        }
        int count=0;
        Node* temp=this->head;
        while(temp)
        {
            if(count++==index-1)
            {
                Node * mid=new Node(val);
                mid->next=temp->next;
                temp->next=mid;
                break;
            }
            temp=temp->next;
        }
        this->size++;
    }
    
    /** Delete the index-th node in the linked list, if the index is valid. */
    void deleteAtIndex(int index) {
        if(index>=this->size)
        {
            return;
        }
        if(index==0)
        {
            if(this->size==1)
            {
                this->head=NULL;
                this->tail=NULL;
            }
            else{
                this->head=this->head->next;
            }
            this->size--;
            return;
        }
        int count=0;
        Node *temp=this->head;
        while(++count!=index)
        {
            temp=temp->next;
        }
        if(count==this->size-1)
        {
            this->tail=temp;
        }
        else
        {
            temp->next=temp->next->next;
        }
        this->size--;
    }
};

		// Your MyLinkedList object will be instantiated and called as such:
    MyLinkedList *linkedList = new MyLinkedList(); // Initialize empty LinkedList
		// case1:
    linkedList->addAtHead(1);
    linkedList->deleteAtIndex(0); 

		//case2:
    // linkedList->addAtTail(3);
    // linkedList->addAtIndex(1, 2);  // linked list becomes 1->2->3
    // linkedList->get(1);            // returns 2
    // linkedList->deleteAtIndex(1);  // now the linked list is 1->3
    // linkedList->get(1);            // returns 3
```

### 【Two Pointer Technique】

We mentioned **two scenarios to use the two-pointer technique**:

1. Two pointers `starts at different position`: one starts at the beginning while another starts at the end;
2. Two pointers are `moved at different speed`: one is faster while another one might be slower.

For a singly linked list, since we can only traverse the linked list in one direction, the first scenario might not work. **However, the second scenario, which is also called slow-pointer and fast-pointer technique, is really useful.**

In this chapter, we will focus on `slow-pointer and fast-pointer problem` in the linked list and show you how to solve this problem.

### [code]-141. Linked List Cycle

That's exactly what we will come across using two pointers with different speed in a linked list:

1. `If there is no cycle, the fast pointer will stop at the end of the linked list.`
2. `If there is a cycle, the fast pointer will eventually meet with the slow pointer.`

What should be **the proper speed for the two pointers**?

- It is a safe choice to move the slow pointer `one step` at a time while moving the fast pointer `two steps` at a time. **For each iteration, the fast pointer will move one extra step**. If the length of the cycle is M, after M iterations, the fast pointer will definitely move one more cycle and catch up with the slow pointer.

<p align="center">
  <img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/1BP2W6.jpg" style="zoom:40%" />
</p>

- **Solution1: hash table**   

<p align="center">
  <img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/ogHwP3.jpg" style="zoom:40%" />
</p>

- **Solution2: two-pointer technique** 

```java
//Given a linked list, determine if it has a cycle in it.
public boolean hasCycle(ListNode head) {
    if (head == null || head.next == null) {
        return false;
    }
    ListNode slow = head;
    ListNode fast = head.next;
    while (slow != fast) {
        if (fast == null || fast.next == null) {
            return false;
        }
        slow = slow.next;
        fast = fast.next.next;
    }
    return true;
}
```

<p align="center">
  <img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/ySLTq7.jpg" style="zoom:40%" />
</p>

```c++
/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     ListNode *next;
 *     ListNode(int x) : val(x), next(NULL) {}
 * };
 */

//Given a linked list, determine if it has a cycle in it.
class Solution {
public:
  	// 函数返回为bool型
    bool hasCycle(ListNode *head) {
        if (head == NULL || head->next == NULL) return false;
        
        ListNode *fast = head->next, *slow = head;
        
        while (fast != NULL && fast->next != NULL)
        {
            fast = fast->next->next;
            slow = slow->next;
            
            if (fast == slow)
                return true;
        }
        
        return false;
    }
};
```

### [code]-142. Linked List Cycle

<p align="center">
  <img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/aN5dpO.jpg" style="zoom:40%" />
</p>

```c++
//Given a linked list, return the node where the cycle begins. If there is no cycle, return null.
//函数返回值为 ListNode * 类型（返回一个链表节点）
ListNode *detectCycle(ListNode *head) {
    if (head == NULL || head->next == NULL)
        return NULL;
    
    ListNode *slow  = head;
    ListNode *fast  = head;
    ListNode *entry = head;
    
    while (fast->next && fast->next->next) {
        slow = slow->next;
        fast = fast->next->next;
        if (slow == fast) {                      // there is a cycle
            while(slow != entry) {               // found the entry location
                slow  = slow->next;
                entry = entry->next;
            }
            return entry;
        }
    }
    return NULL;                                 // there has no cycle
}
```

### [code]-160. Intersection of Two Linked Lists

<p align="center">
  <img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/igJMJ7.jpg" style="zoom:40%" />
</p>

<p align="center">
  <img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/X6YvPj.jpg" style="zoom:40%" />
</p>

<p align="center">
  <img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/ztVgXR.jpg" style="zoom:40%" />
</p>

```c++
ListNode *getIntersectionNode(ListNode *headA, ListNode *headB) 
{
    ListNode *p1 = headA;
    ListNode *p2 = headB;
        
    if (p1 == NULL || p2 == NULL) return NULL;

    while (p1 != NULL && p2 != NULL && p1 != p2) {
        p1 = p1->next;
        p2 = p2->next;

        //
        // Any time they collide or reach end together without colliding 
        // then return any one of the pointers.
        //
        if (p1 == p2) return p1; //无需判断两条链最后一个元素是否相等（如果不相等代表两条链无交点），因为如果无交点，则当 p1 == p2 条件成立时，均遍历到了对方链的链尾，此时返回 NULL，O(M+N)的复杂度。

        //
        // If one of them reaches the end earlier then reuse it 
        // by moving it to the beginning of other list.
        // Once both of them go through reassigning, 
        // they will be equidistant from the collision point.
        //
        if (p1 == NULL) p1 = headB;
        if (p2 == NULL) p2 = headA;
    }
        
    return p1;
}
```

### [code]-19. Remove Nth Node From End of List

<p align="center">
  <img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/6GxAFk.jpg" style="zoom:40%" />
</p>

```c++
/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     ListNode *next;
 *     ListNode(int x) : val(x), next(NULL) {}
 * };
 */
class Solution {
public:
    ListNode* removeNthFromEnd(ListNode* head, int n) {
        ListNode *dummy=new ListNode(0);//引入头节点，最精彩的思想
        dummy->next=head;
        ListNode *fast=dummy,*slow=dummy;

        // Advances first pointer so that the gap between first and second is n nodes apart
        //fast node比slow node先走n+1步，相隔n个节点，这样方便删除倒数第n个节点，第二精彩的思想
      	for (int i = 1; i <= n + 1; i++) { 
            fast=fast->next;
        }
        while(fast!=NULL)
        {
            fast=fast->next;
            slow=slow->next;
        }
        slow->next=slow->next->next;
        return dummy->next;
    }
};
```

### 【Summary-双指针】

- **Attention**: remember to **avoid null-pointer error** `while(fast->next!=NULL)` **Always examine if the node is null before you call the next field.**
- 快慢指针可以用于：
  - **链表是否存在环**：快指针比慢指针每次多走一步
  - **找出链表中环的起始位置**：Floyd's cycle detection algorithm
  - **找出两个链表的交点位置**：遍历对方链表，[A\*LB\*A] [B\*LA\*B]第二个*号即为交点位置
  - **删除链表的倒数第**n个节点：快指针比慢指针先走n+1步，确保间隔n
- **trick**：链头引入**哨兵节点** 

### 【Classic Problems】 

- Assume that we have linked list `1 → 2 → 3 → Ø`, we would like to change it to `3 → 2 → 1 → Ø`.

### [code]-206.Reverse Linked List

```c++
// Iterative
class Solution {
public:
    ListNode* reverseList(ListNode* head) {
        ListNode *pre = new ListNode(0), *cur = head;//0节点为哨兵节点
        pre -> next = head;
        while (cur && cur -> next) {
        //三步断链法：pre永远指向0，cur永远指向初始head节点指向的节点，temp永远指向pre->next的指向的节点
            ListNode* temp = pre -> next;//temp永远指向pre->next的指向的节点，每次更新
            pre -> next = cur -> next;//第一步断链连结
            cur -> next = cur -> next -> next;//第二步断链连结
            pre -> next -> next = temp;//第三步断链连接
        }
        return pre -> next;//0节点的下一个节点是新链的head节点
    }
};
```

<p align="center">
  <img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/4wHb7C.jpg" style="zoom:40%" />
</p>

<p align="center">
  <img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/ksMfbD.jpg" style="zoom:40%" />
</p>

```c++
// Recursive
#include <iostream>

using namespace std;

struct ListNode {
    int val;
    ListNode *next;
    ListNode(int x) : val(x), next(NULL) {}
};

class Solution {
public:
    ListNode* reverseList(ListNode* head) {
        if (head == NULL || head->next == NULL) return head; 
          //递归退出条件：找到最后一个节点，令其为head节点

        ListNode* node = reverseList(head -> next); 
          //每递归入栈一次，head节点均指向head -> next，直到指向最后一个节点，return
        head -> next -> next = head; 
        head -> next = NULL;
        return node;
    }
};


int main() {
    ListNode *head_link = new ListNode(1);
    head_link->next=new ListNode(2);
    head_link->next->next=new ListNode(3);
    head_link->next->next->next=new ListNode(4);
    head_link->next->next->next->next=NULL;
    Solution solu;
    solu.reverseList(head_link);
    // ListNode* reverseList(head_link);
    return 0;
}
```

<p align="center">
  <img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/FswkZg.jpg" style="zoom:40%" />
</p>

`ListNode* node = reverseList(head -> next); `接收上一步`return head`的返回值4

<p align="center">
  <img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/TufVOR.jpg" style="zoom:40%" />
</p>
`head -> next -> next = head; `
`head -> next = NULL;` 

<p align="center">
  <img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/y0OdWN.jpg" style="zoom:40%" />
</p>
`ListNode* node = reverseList(head -> next); `接收上一步`return node`的返回值 4->3

<p align="center">
  <img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/DStsII.jpg" style="zoom:40%" />
</p>
`ListNode* node = reverseList(head -> next); `接收上一步`return node`的返回值4->3->2

<p align="center">
  <img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/bU6K5F.jpg" style="zoom:40%" />
</p>
`ListNode* node = reverseList(head -> next); `接收上一步`return node`的返回值4->3->2->1

<p align="center">
  <img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/2btFgo.jpg" style="zoom:40%" />
</p>

### [code]-203. Remove Linked List Elements

```C++
/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     ListNode *next;
 *     ListNode(int x) : val(x), next(NULL) {}
 * };
 */
class Solution {
public:
    ListNode* removeElements(ListNode* head, int val) {
        ListNode *dummy=new ListNode(0);
        dummy->next=head;
        ListNode *fast=head,*slow=dummy;
        while(fast!=NULL)
        {
            if(fast->val==val)
            {
                slow->next=fast->next;
                fast=fast->next;
            }
            else{
                fast=fast->next;
                slow=slow->next;
            }
        }
        return dummy->next;
    }
};
```

### [code]-328. Odd Even Linked List

<p align="center">
  <img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/2rBgHF.jpg" style="zoom:40%" />
</p>

```C++
/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     ListNode *next;
 *     ListNode(int x) : val(x), next(NULL) {}
 * };
 */
class Solution {
public:
    ListNode* oddEvenList(ListNode* head) {
        if(head==NULL||head->next==NULL) return head;
        
        ListNode *odd=head,*even=head->next;
        ListNode *evenlist=head->next;
        
        while(even->next!=NULL)
        {
            odd->next=even->next;
            even->next=even->next->next;
            odd=odd->next;
            even=even->next;
            if(even==NULL) break;
        }
        odd->next=evenlist;
        return head;
    }
};
```

### [code]-234. Palindrome Linked List

```c++
/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     ListNode *next;
 *     ListNode(int x) : val(x), next(NULL) {}
 * };
 */
//考虑O(1)的复杂度，如果放开限制，可以直接对原链表直接reverse，无需找到中间节点后reverse。
class Solution {
public:
    bool isPalindrome(ListNode* head) {
        if(head==NULL) return true;
        
        ListNode *fast=head,*slow=head;
        
        while(fast->next!=NULL)
        {
            fast=fast->next->next;
            slow=slow->next;
            if(fast==NULL) break;
        }
        ListNode *reverse=reverseList(slow);
        
        ListNode *check=head;
        while(reverse!=NULL)
        {
            if(check->val==reverse->val)
            {
                check=check->next;
                reverse=reverse->next;  
            }
            else{
                return false;
            }
        }
        if(reverse==NULL) return true;
        else{
            return false;
        }
    }
    
    ListNode* reverseList(ListNode* head) {
        ListNode *pre = new ListNode(0), *cur = head;//0节点为哨兵节点
        pre -> next = head;
        while (cur && cur -> next) {
        //三步断链法：pre永远指向0，cur永远指向初始head节点指向的节点，temp永远指向pre->next的指向的节点
            ListNode* temp = pre -> next;//temp永远指向pre->next的指向的节点，每次更新
            pre -> next = cur -> next;//第一步断链连结
            cur -> next = cur -> next -> next;//第二步断链连结
            pre -> next -> next = temp;//第三步断链连接
        }
        return pre -> next;//0节点的下一个节点是新链的head节点
    }
};
```

### 【Summary-经典问题】

We have provided several exercises for you. You might have noticed the similarities between them. Here we provide some tips for you:



**2. Feel free to use several pointers at the same time.**

Sometimes when you design an algorithm for a linked-list problem, there might be several nodes you want to track at the same time. **You should keep in mind which nodes you need to track and feel free to use several different pointers to track these nodes at the same time（均为双指针的思想）**.

If you use several pointers, it will be better to give them suitable names in case you have to debug or review your code in the future.

 

**3. In many cases, you need to track the previous node of the current node.**

You are not able to trace back the previous node in a singly linked list. So you have to **store not only the current node but also the previous node（单链表中要么多用一个指针记录前一个位置，要么用cur->next进行预判断）**. This is different in a doubly linked list which we will cover in the later chapter.

### 【Doubly Linked List】

- Similar to the singly linked list, we will use the `head` node to represent the whole list.

<p align="center">
  <img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/7tJslY.jpg" style="zoom:40%" />
</p>

```c++
// Definition for doubly-linked list.
struct DoublyListNode {
    int val;
    DoublyListNode *next, *prev;
    DoublyListNode(int x) : val(x), next(NULL), prev(NULL) {}
};
```

<p align="center">
  <img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/Fy0CpB.jpg" style="zoom:40%" />
</p>

<p align="center">
  <img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/jFNBLp.jpg" style="zoom:40%" />
</p>
### [code]-707. Design Linked List

```c++
struct Node
{
    int val;
    Node * pre;
    Node * next;
    Node(int x):val(x),pre(NULL),next(NULL){};
};

class MyLinkedList {
public:
    /** Initialize your data structure here. */
    Node *head;
    Node *tail;
    int size;
    MyLinkedList() {
        this->head=NULL;
        this->tail=NULL;
        this->size=0;
    }
    
    /** Get the value of the index-th node in the linked list. If the index is invalid, return -1. */
//     int get(int index) {
//         if(index >= this->size)
//             return -1;
//         Node *temp=this->head;
//         int counter=0;
//         while(temp)
//         {
//             if(counter++==index)
//             {
//                 return temp->val;
//             }
//             temp = temp->next;
//         }
//         return -1;
        
//     }
    int get(int index) {
        if(index >= this->size)
            return -1;
        Node *temp=this->head;
        int counter=0;
        while(temp)
        {
            if(counter++==index)
            {
                return temp->val;
            }
            temp = temp->next;
        }
        return -1;
        
    }
    
    /** Add a node of value val before the first element of the linked list. After the insertion, the new node will be the first node of the linked list. */
    // void addAtHead(int val) {
    //     Node *temp = new Node(val);
    //     if(this->head==NULL)
    //     {
    //         this->head = temp;
    //         this->tail = temp;
    //     }
    //     else
    //     {
    //         temp->next = this->head;
    //         this->head = temp;
    //     }
    //     this->size++;            
    // }
    void addAtHead(int val) {
        Node *temp = new Node(val);
        if(this->head==NULL)
        {
            this->head = temp;
            this->tail = temp;
        }
        else
        {
            temp->next = this->head;
            this->head->pre=temp;
            this->head = temp;
        }
        this->size++;            
    }
    
    /** Append a node of value val to the last element of the linked list. */
    // void addAtTail(int val) {
    //     Node *temp = new Node(val);
    //     if(this->tail==NULL)
    //     {
    //         this->head=temp;
    //         this->tail=temp;
    //     }
    //     else
    //     {
    //         this->tail->next=temp;
    //         this->tail=temp;
    //     }
    //     this->size++;
    // }
    void addAtTail(int val) {
        Node *temp = new Node(val);
        if(this->tail==NULL)
        {
            this->head=temp;
            this->tail=temp;
        }
        else
        {
            this->tail->next=temp;
            temp->pre=this->tail;
            this->tail=temp;
        }
        this->size++;
    }
    
    /** Add a node of value val before the index-th node in the linked list. If index equals to the length of linked list, the node will be appended to the end of linked list. If index is greater than the length, the node will not be inserted. */
    // void addAtIndex(int index, int val) {
    //     if(index>this->size)
    //     {
    //         return;
    //     }
    //     if(index==this->size)
    //     {
    //         this->addAtTail(val);
    //         return;
    //     }
    //     if(index==0)
    //     {
    //         this->addAtHead(val);
    //         return;
    //     }
    //     int count=0;
    //     Node *temp=this->head;
    //     while(temp)
    //     {
    //         if(++count==index)
    //         {
    //             Node *mid=new Node(val);
    //             mid->next=temp->next;
    //             temp->next=mid;
    //             break;
    //         }
    //         temp=temp->next;
    //     }
    //     this->size++;
    // }
    void addAtIndex(int index, int val) {
        if(index>this->size)
        {
            return;
        }
        if(index==this->size)
        {
            this->addAtTail(val);
            return;
        }
        if(index==0)
        {
            this->addAtHead(val);
            return;
        }
        int count=0;
        Node *temp=this->head;
        while(temp)
        {
            if(++count==index)
            {
                Node *mid=new Node(val);
                mid->next=temp->next;
                mid->pre=temp;
                temp->next->pre=mid;
                temp->next=mid;
                break;
            }
            temp=temp->next;
        }
        this->size++;
    }
    
    /** Delete the index-th node in the linked list, if the index is valid. */
    // void deleteAtIndex(int index) {
    //     if(index>=this->size)
    //     {
    //         return;
    //     }
    //     if(index==0)
    //     {
    //         if(this->size==1)
    //         {
    //             this->head=NULL;
    //             this->tail=NULL;
    //         }
    //         else{
    //             this->head=this->head->next;
    //         }
    //         this->size--;
    //         return;
    //     }
    //     int count=0;
    //     Node *temp=this->head;
    //     while(++count!=index)
    //     {
    //         temp=temp->next;
    //     }
    //     if(count==this->size-1)
    //     {
    //         this->tail=temp;
    //     }
    //     else
    //     {
    //         temp->next=temp->next->next;
    //     }
    //     this->size--;
    // }
    void deleteAtIndex(int index) {
        if(index>=this->size)
        {
            return;
        }
        if(index==0)
        {
            if(this->size==1)
            {
                this->head=NULL;
                this->tail=NULL;
            }
            else{
                this->head=this->head->next;
            }
            this->size--;
            return;
        }
        int count=0;
        Node *temp=this->head;
        while(++count!=index)
        {
            temp=temp->next;
        }
        if(count==this->size-1)
        {
            this->tail=temp;
        }
        else
        {
            temp->next=temp->next->next;
            temp->next->pre=temp;
        }
        this->size--;
    }
};
```

### 【Summary-整章总结】

<p align="center">
  <img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/KpusRR.jpg" style="zoom:40%" />
</p>

### [code]-21. Merge Two Sorted Lists

```C++
/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     ListNode *next;
 *     ListNode(int x) : val(x), next(NULL) {}
 * };
 */
class Solution {
public:
    ListNode* mergeTwoLists(ListNode* l1, ListNode* l2) {
        if(l1==NULL || l2==NULL)
        {
            return (l1==NULL)?l2:l1;
        }
        ListNode *headnode = (l1->val <= l2->val)?l1:l2;
        ListNode *other = (l1->val > l2->val)?l1:l2;
        while(other!=NULL && headnode->next!=NULL)
        {
            if(other->val<=headnode->next->val)
            {
                ListNode *temp=other->next;
                other->next=headnode->next;
                headnode->next=other;
                headnode=headnode->next;
                other=temp;
            }
            else{
                headnode=headnode->next;
            }
        }
        if(other!=NULL)
        {
            headnode->next=other;
        }
        return (l1->val <= l2->val)?l1:l2;
    }
};
```

### [code]-2. Add Two Numbers

```c++
>>> Input: (2 -> 4 -> 3) + (5 -> 6 -> 4)
>>> Output: 7 -> 0 -> 8
  
  
ListNode *addTwoNumbers(ListNode *l1, ListNode *l2) {
    ListNode preHead(0), *p = &preHead;
    int extra = 0;
    while (l1 || l2 || extra) {
        int sum = (l1 ? l1->val : 0) + (l2 ? l2->val : 0) + extra;
        extra = sum / 10;
        p->next = new ListNode(sum % 10); //除了取模的作用，还抵消了两条链最后一次节点的重复计算
        p = p->next;
      	// l1 = l1->next;
      	// l2 = l2->next;
      	// 区别在于当遍历到空节点时 (l1 ? l1->next : l1) 返回的是最后一个节点而不是空节点
        l1 = l1 ? l1->next : l1;
        l2 = l2 ? l2->next : l2;
    }
    return preHead.next;
}
```

### [code]-430. Flatten a Multilevel Doubly Linked List

```c++
lets say we start out with :

    h  temp
1 - 2 - 3 - 4 - 5 - null
    |
    6 - 7 - 8 - null
    p       |
            9 - 10 - null

h points to the head of the structure
horizontal links are bidirectional
vertical links indicate child relationship

after the first child is encountered:
               (h)
    h           p  temp
1 - 2 - 6 - 7 - 8 - 3 - 4 - 5 - null
                |
                9 - 10 - null

after the second child is encountered:

                    h
1 - 2 - 6 - 7 - 8 - 9 - 10 - 3 - 4 - 5 - null



Node* flatten(Node* head) {
	for (Node* h = head; h; h = h->next)
	{
		if (h->child)
		{
			Node* temp = h->next;
			h->next = h->child; //把child节点 转为 next节点-》flatten的思想核心
			h->next->prev = h;
			h->child = NULL; //消除child节点
			Node* p = h->next;
			while (p->next) p = p->next;
			p->next = temp;
			if (temp) temp->prev = p;
		}
	}
	return head;
}
```

### [code]-138. Copy List with Random Pointer

- This method modifies the original list, which isn't acceptable.

<p align="center">
  <img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/woHpFL.jpg" style="zoom:40%" />
</p>

<p align="center">
  <img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/yBYGdi.jpg" style="zoom:40%" />
</p>


<p align="center">
  <img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/Y5pGJm.jpg" style="zoom:100%" />
</p>


```c++
class Node {
public:
    int val;
    Node* next;
    Node* random;
    
    Node(int _val) {
        val = _val;
        next = NULL;
        random = NULL;
    }
};

class Solution {
public:
    Node* copyRandomList(Node* head) {
        Node * head_cp = nullptr, * cur = head, * cur_cp = nullptr;
        if (head == nullptr)
            return nullptr;
        // 第一步：对原链进行拷贝，cur->val, cur->next这两个条件保证了直接插入原链
        while (cur != nullptr)
        {
            cur_cp = new Node(cur->val, cur->next, nullptr);
            cur->next = cur_cp;
            cur = cur_cp->next;
        }
        // 第二步：拷贝random指针
        cur = head;
        while (cur != nullptr)
        {
            cur_cp = cur->next;
            if (cur->random)
                cur_cp->random = cur->random->next;
            cur = cur_cp ->next;
        }
      	// 第三步：拆分链，并用head_cp指向新链头节点
        cur = head;
        head_cp = head->next;
        while (cur != nullptr)
        {
            cur_cp = cur->next;
            cur->next = cur_cp->next;
            cur = cur->next;
            if (cur)
                cur_cp->next = cur->next;
        }
        return head_cp;
    }
};
```

### [code]-61. Rotate List

```c++
>>> Input: 0->1->2->NULL, k = 4
>>> Output: 2->0->1->NULL
>>> Explanation:
rotate 1 steps to the right: 2->0->1->NULL
rotate 2 steps to the right: 1->2->0->NULL
rotate 3 steps to the right: 0->1->2->NULL
rotate 4 steps to the right: 2->0->1->NULL


class Solution {
public:
    ListNode* rotateRight(ListNode* head, int k) {
        if(head==NULL) return NULL;
        ListNode *dummy=new ListNode(0);
        dummy->next=head;
      	// rotate对链表长度取模，可以显著缩短时间
        int mod=false; 
        int count=1;
        while(k--!=0)
        {
            ListNode *fast=dummy->next;
            ListNode *slow=dummy;
            while(fast->next!=NULL)
            {
                count++;
                fast=fast->next;
                slow=slow->next;
            }
            if(mod==false)
            {
                k=k%count;
                mod=true;
            }
          	//三步断链法
            slow->next=fast->next;
            fast->next=dummy->next;
            dummy->next=fast;
        }
        return dummy->next;
            
    }
};
```

