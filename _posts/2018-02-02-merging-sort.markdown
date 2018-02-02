---
layout:     post
title:      "排序算法之归并排序"
subtitle:   ""
date:       2018-02-02 00:00:00
author:     "Alex"
header-img: ""
---

> “归并”一词的中文含义可就是合并、并入的意思，而在数据结构中的定义是将两个或两个以上的有序表组合成一个新的有序表。  
  
> <br/>

  归并排序（MERGE-SORT）是利用归并的思想实现的排序方法，该算法采用经典的分治（divide-and-conquer）策略（分治法将问题分(divide)成一些小的问题然后递归求解，而治(conquer)的阶段则将分的阶段得到的各答案"修补"在一起，即分而治之)。。
/*骂狗官、骂体制、骂 D，骂的人已经够多了。我故是可以再骂，却也深知自己甚至连让他们听到这份声音的能力都没有。*/

**它的原理是假设初始序列含有n个记录，则可以看成是n个有序的子序列，每个子序列的长度是1，然后两两归并，得到[n/2]（[x]表示不小于x的最小整数）个长度为2或1的有序子序列；在两两归并，......，如此重复，直至得到一个长度为n的有序序列为止，这种排序方法称为2路归并排序。** 

![](/img/in-post/FEN_ZHI.png)

可以看到这种结构很像一棵完全二叉树，本文的归并排序我们采用递归去实现（也可采用迭代的方式去实现）。分阶段可以理解为就是递归拆分子序列的过程，递归深度为log2n.

***合并相邻有序子序列***
再来看看分治阶段，我们需要将两个已经有序的子序列合并成一个有序序列，比如上图中的最后一次合并，要将[4,5,7,8]和[1,2,3,6]两个已经有序的子序列，合并为最终序列[1,2,3,4,5,6,7,8]，来看下实现步骤。

![](/img/in-post/MERGE.png)


C++实现代码如下：

 ```C++
#include <iostream>  

using namespace std;
int a[10000];
int temp[10000];

void MergeArray(int a[], int first, int mid, int last, int temp[])
{
	int i = first;  //迭代遍历左有序  
	int j = mid + 1;  //迭代遍历右有序  
	int m = mid, n = last;
	int k = 0;      //迭代临时数组  

					//左边或者右边遍历完毕  
	while (i <= m && j <= n)
	{
		if (a[i] <= a[j])
			temp[k++] = a[i++];
		else
			temp[k++] = a[j++];
	}
	//若是右边遍历完毕  
	while (i <= m)
		temp[k++] = a[i++];
	//若是左边遍历完毕  
	while (j <= n)
		temp[k++] = a[j++];

	for (i = 0; i < k; i++)
		a[first + i] = temp[i];
}
//first,last为归并数组的下标  
void MergeSort(int a[], int first, int last, int temp[])
{
	if (first < last)        //递归边界  
	{
		int mid = (first + last) / 2;       //divide  
		MergeSort(a, first, mid, temp); //conqure左边，左边有序  
		MergeSort(a, mid + 1, last, temp);//conqure右边，右边有序  
		MergeArray(a, first, mid, last, temp);//归并两个有序表  
	}
}
int main()
{

	int n;
	cin >> n;
	for (int i = 0; i < n; i++)
		cin >> a[i];
	MergeSort(a, 0, n - 1, temp);
	for (int i = 0; i < n; i++)
		cout << a[i] << endl;
	getchar();
	getchar();
	return 0;
}
```

**归并排序是稳定排序，它也是一种十分高效的排序，能利用完全二叉树特性的排序一般性能都不会太差。java中Arrays.sort()采用了一种名为TimSort的排序算法，就是归并排序的优化版本。从上文的图中可看出，每次合并操作的平均时间复杂度为O(n)，而完全二叉树的深度为|log2n|。总的平均时间复杂度为O(nlogn)。而且，归并排序的最好，最坏，平均时间复杂度均为O(nlogn)。**
