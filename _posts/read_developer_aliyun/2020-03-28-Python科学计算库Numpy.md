---
title: "「人工智能学习路线」5"
subtitle: "Python科学计算库Numpy"
layout: post
author: "echisenyang"
header-style: text
hidden: true
catalog: true
tags:
  - 笔记
  - 人工智能学习路线
---

### 一、Numpy的优势

#### 1.Numpy介绍

> Numpy是一个科学计算库，可以快速处理任意纬度的数组「num-numerical」「py-python」

- 一个强大的**N维数组**对象
- 支持**大量的数据运算**
- 集成C / C++和Fortran代码的工具
- **众多机器学习框架的基础库**(Scipy/Pandas/scikit-learn/Tensorflow)

>  Numpy提供了一个n维数组类型ndarray，它描述了形同类型的"items"的集合
>
>  NumPy provides an N-dimensional array type, the ndarray, which describes a collection of “items” of the same type.

#### 2.Numpy的特点

>  ndarray与python原生list运算效率对比

- numpy的计算速度要快很多，节约了时间。

- **机器学习的最大特点就是大量的数据运算**，那么如果没有一个快速的解决方案，那可能现在python也在机器学习领域达不到好的效果。

>为什么Numpy会快？

1）Numpy的数组内存块风格

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/FI8uYp.jpg" style="zoom:50%;" />

从图中我们看出来**numpy其实在存储数据的时候，数据与数据的地址都是连续的，这样就给我们操作带来了好处，查找与存储效率高，处理速度快**。而python是通过内存地址引用的方式去查值，这样速度会慢很多。另外，numpy array的存储风格是**相同类型的数据**，这虽然带来了通用型不强的问题，但也正是这一特性使得numpy在数值计算方面尤其快。而python list可以**存储不同类型的数据**，通用型很强，但是计算能力不及numpy array。

2）Numpy支持并行化运算（向量话运算）

3）numpy底层使用c语言编写，内部解除了GIL（全局解释器锁），其对数组的操作速度不受python解释器锁的限制，效率高于纯python代码。

### 二、ndarray属性

|     属性名字     |          属性解释          |
| :--------------: | :------------------------: |
|  ndarray.shape   |       数组维度的元组       |
|  ndarray.flags   |   有关阵列内存布局的信息   |
|   ndarray.ndim   |          数组维数          |
|   ndarray.size   |      数组中的元素数量      |
| ndarray.itemsize | 一个数组元素的长度（字节） |
|  ndarray.nbytes  |   数组元素消耗的总字节数   |

|     名称      |                       描述                        | 简写  |
| :-----------: | :-----------------------------------------------: | :---: |
|    np.bool    |      用一个字节存储的布尔类型（True或False）      |  'b'  |
|    np.int8    |             一个字节大小，-128 至 127             |  'i'  |
|   np.int16    |               整数，-32768 至 32767               | 'i2'  |
|   np.int32    |            整数，-2 **31 至 2** 32 -1             | 'i4'  |
|   np.int64    |            整数，-2 **63 至 2** 63 - 1            | 'i8'  |
|   np.uint8    |               无符号整数，0 至 255                |  'u'  |
|   np.uint16   |              无符号整数，0 至 65535               | 'u2'  |
|   np.uint32   |           无符号整数，0 至 2 ** 32 - 1            | 'u4'  |
|   np.uint64   |           无符号整数，0 至 2 ** 64 - 1            | 'u8'  |
|  np.float16   | 半精度浮点数：16位，正负号1位，指数5位，精度10位  | 'f2'  |
|  np.float32   | 单精度浮点数：32位，正负号1位，指数8位，精度23位  | 'f4'  |
|  np.float64   | 双精度浮点数：64位，正负号1位，指数11位，精度52位 | 'f8'  |
| np.complex64  |     复数，分别用两个32位浮点数表示实部和虚部      | 'c8'  |
| np.complex128 |     复数，分别用两个64位浮点数表示实部和虚部      | 'c16' |
|  np.object_   |                    python对象                     |  'O'  |
|  np.string_   |                      字符串                       |  'S'  |
|  np.unicode_  |                    unicode类型                    |  'U'  |

- 创建数组的时候指定类型

```python
>>> a = np.array([[1,2,3],[4,5,6]], dtype=np.float32)
>>> a.dtype
dtype('float32')

>>> arr = np.array(['python','tensorflow','scikit-learn','numpy'],dtype = np.string_)
>>> arr.dtype
array([b'python', b'tensorflow', b'scikit-learn', b'numpy'], dtype='|S12')
```

### 三、基本操作

#### 1.四种生成数组的方法

> 1）生成0和1的数组  np.函数名() -> np.zeros([3, 4])
>
> - empty(shape[, dtype, order])
> - empty_like(a[, dtype, order, subok])
> - eye(N[, M, k, dtype, order])
> - identity(n[, dtype])
> - **ones(shape[, dtype, order])**
> - ones_like(a[, dtype, order, subok])
> - **zeros(shape[, dtype, order])**   
> - zeros_like(a[, dtype, order, subok])
> - full(shape, fill_value[, dtype, order])
> - full_like(a, fill_value[, dtype, order, subok])
>
> 2）从现有的数据中创建
>
> - **array(object[, dtype, copy, order, subok, ndmin])**
> - **asarray(a[, dtype, order])**  -》 np.asarray()是**浅拷贝**
> - asanyarray(a[, dtype, order])
> - ascontiguousarray(a[, dtype])
> - asmatrix(data[, dtype])
> - **copy(a[, order])**   -》np.array()与np.copy()是**深拷贝**
>
> ```python
> a = np.array([[1,2,3],[4,5,6]])
> # 从现有的数组当中创建
> a1 = np.array(a)  # np.array()与np.copy()是深拷贝
> # 相当于索引的形式，并没有真正的创建一个新的
> a2 = np.asarray(a)  # np.asarray()是浅拷贝
> ```
>
> 3）创建固定范围的数组
>
> **左闭右闭** `np.linspace (start, stop, num, endpoint, retstep, dtype)`
>
> ​     start 序列的起始值
> ​    stop 序列的终止值， 如果endpoint为true，该值包含于序列中
> ​    num 要生成的等间隔样例数量，默认为50
> ​    endpoint 序列中是否包含stop值，默认为ture
> ​    retstep 如果为true，返回样例，以及连续数字之间的步长
> ​    dtype 输出ndarray的数据类型
>
> **左闭右开** `numpy.arange(start,stop, step, dtype)`
>
> 4）生成随机数组
>
> - 均匀分布
>   - np.random.rand(10)
>   - np.random.uniform(0,100)
>   - np.random.randint(100)
> - 正态分布？
>   - 给定均值／标准差／维度的正态分布
>   - np.random.normal(1.75, 0.2, (3,4))
>   - np.random.standard_normal(size=(3,4))

#### 2.数组的索引与切片

```python
# 二维的数组，两个维度 
stock_day_rise[0:5, 0:10]

# 三维，一维
a1 = np.array([ [[1,2,3],[4,5,6]], [[12,3,34],[5,6,7]]])
a1[0, 0, 1]
>>> 2
```

#### 3.形状修改&类型修改&数组去重

- 形状修改

```python
import numpy as np
a1 = np.array([[1,2,3],[4,5,6]])
>>> array([[1, 2, 3],
       		[4, 5, 6]])

a1.reshape(3,2) # np.reshape() 不改变原a1
>>> array([[1, 2],
           [3, 4],
           [5, 6]])

a1.resize(3,2) # np.resize() 改变原a1
a1
>>> array([[1, 2],
           [3, 4],
           [5, 6]])
           
a1.T #数组的转置，实现行列转换
>>> array([[1, 3, 5],
       		[2, 4, 6]])

a1.flatten() # 拍平
>>> array([1, 2, 3, 4, 5, 6])
```

- 类型修改

```python
# 修改类型
stock_day_rise.astype(np.int32)

# 序列化到本地，转成bytes
arr = np.array([ [[1,2,3],[4,5,6]], [[12,3,34],[5,6,7]]])
arr.tostring()
```

- 数组去重

```python
# set只对一维有效
set(a1)
>>> TypeError: unhashable type: 'numpy.ndarray'

# np.unique()可以对高维去重
np.unique(a1)
>>> array([1, 2, 3, 4, 5, 6])
```

### 四、ndarray运算

#### 1.逻辑运算

- 逻辑判断与布尔索引

```python
# 逻辑判断
a1 > 3
>>> array([False, False, False,  True,  True,  True])
# 布尔索引，赋值
a1[a1 > 3] = 1
>>> array([ 1,  2,  3, 10, 10, 10])
```

- 通用判断函数

`np.all()` 只要有一个False就返回False，只有全是True才返回True

`np.any()` 只要有一个True就返回True，只有全是False才返回False

```python
temp = array([False, False, False,  True,  True,  True])
temp.all()
>>> False
temp.any()
>>> True
```

- np.where（三元运算符）

`np.where(布尔值,True的位置的值,False的位置的值)`

```python
temp = array([ 1,  2,  3, 10, 10, 10])
np.where(temp>5,0,temp)
>>> array([1, 2, 3, 0, 0, 0])
```

#### 2.统计运算

在数据挖掘/机器学习领域，统计指标的值也是我们分析问题的一种方式。常用的指标如下：

- min(a[, axis, out, keepdims]) 
- max(a[, axis, out, keepdims]) 
- median(a[, axis, out, overwrite_input, keepdims]) 
- mean(a[, axis, dtype, out, keepdims]) 
- std(a[, axis, dtype, out, ddof, keepdims]) 
- var(a[, axis, dtype, out, ddof, keepdims]) 

进行统计的时候，**axis 轴的取值并不一定，Numpy中不同的API轴的值都不一样，在这里，axis 0代表列, axis 1代表行去进行统计**

返回最大最小值所在的位置

- np.argmax(temp, axis=)
- np.argmin(temp, axis=)

#### 3.数组间运算

- 数组与数的运算

  > numpy中的array支持广播机制，python中的list不支持

```python
arr = np.array([[1,2,3,2,1,4], [5,6,1,2,3,1]])
arr + 1
>>> array([[2, 3, 4, 3, 2, 5],
      		 [6, 7, 2, 3, 4, 2]])
arr / 2
>>> array([[0.5, 1. , 1.5, 1. , 0.5, 2. ],
       			[2.5, 3. , 0.5, 1. , 1.5, 0.5]])

# 可以对比python列表的运算，看出区别
a = [1,2,3,4,5]
a * 3
>>> [1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5]
```

- 数组与数组的运算

```python
arr1 = np.array([[1,2,3,2,1,4], [5,6,1,2,3,1]])
arr2 = np.array([[1, 2, 3, 4], [3, 4, 5, 6]])
arr1 + arr2
>>> ValueError: operands could not be broadcast together with shapes (2,6) (2,4) 
```

> 数组与数组要满足**广播机制**才能运算
>
> **执行 broadcast 的前提在于，两个 ndarray 执行的是 element-wise的运算，而不是矩阵乘法的运算，矩阵乘法运算时需要维度之间严格匹配。Broadcast机制的功能是为了方便不同形状的array（numpy库的核心数据结构）进行数学运算**
>
> 当操作两个数组时，numpy会逐个比较它们的shape（构成的元组tuple），只有在下述情况下，两个数组才能够进行数组与数组
>
> - 维度相等
> - shape（其中相对应的一个地方为1）
>
> ```python
> arr1 = np.array([[1,2,3,2,1,4], [5,6,1,2,3,1]])
> arr2 = np.array([[1], [3]])
> arr1 + arr2
> >>> array([[2, 3, 4, 3, 2, 5],
>       		 [8, 9, 4, 5, 6, 4]])
> ```

- 矩阵运算

矩阵，英文matrix，**和array的区别矩阵必须是2维的,但是array可以是多维的。**

`np.mat()` ：将数组转换成矩阵类型

> #### 对于 np.array 对象
>
> ```python
> a = np.array([[1, 2],
>     					[3, 4]])
> # 元素乘法element-wise product 用 a*b 或 np.multiply(a,b) 
> a*a
> >>> array([[ 1,  4],
>     		[ 9, 16]])
> np.multiply(a,a)
> >>> array([[ 1,  4],
>    		 [ 9, 16]])
> 
> # 矩阵乘法 用 np.dot(a,b) 或 np.matmul(a,b) 或 a.dot(b)
> np.dot(a,a)
> >>> array([[ 7, 10],
>     		[15, 22]])
> np.matmul(a,a)
> >>> array([[ 7, 10],
>     		[15, 22]])
> a.dot(a)
> >>> array([[ 7, 10],
>     		[15, 22]])
> ```
>
> #### 对于 np.matrix 对象
>
> ```python
> A = np.mat([[1, 2],
>     			 [3, 4]])
> # 元素乘法 用 np.multiply(a,b)
> np.multiply(A,A)
> >>> array([[ 1,  4],
>    		 		[ 9, 16]])
> # 矩阵乘法 用 a*b 或 np.dot(a,b) 或 np.matmul(a,b) 或 a.dot(b)
> A*A
> >>> matrix([[ 7, 10],
>        		 [15, 22]])
> np.dot(A,A)
> >>> matrix([[ 7, 10],
>        		 [15, 22]])
> np.matmul(A,A)
> >>> matrix([[ 7, 10],
>        		 [15, 22]])
> A.dot(A)
> >>> matrix([[ 7, 10],
>        		 [15, 22]])
> ```

- `Ndarray – numpy.dot`

Vector-Vector, Matrix-Vector and Matrix-Matrix products are calculated using np.dot()

> **Dot product of two arrays**. Specifically,
>
> - If both *a* and *b* are 1-D arrays, it is **inner product** of vectors (without complex conjugation).
>
> - If both *a* and *b* are 2-D arrays, it is **matrix multiplication**, but using [`matmul`](https://docs.scipy.org/doc/numpy/reference/generated/numpy.matmul.html#numpy.matmul) or `a @ b` is preferred.
>
> - If either *a* or *b* is 0-D (**scalar**), it is equivalent to [`multiply`](https://docs.scipy.org/doc/numpy/reference/generated/numpy.multiply.html#numpy.multiply) and using `numpy.multiply(a, b)` or `a * b` is preferred.
>
> - If *a* is an N-D array and *b* is a 1-D array, it is a **sum product over the last axis of *a* and *b***.
>
>   ```python
>   a = np.array([[[1,2,3],[4,5,6]], 
>   						  [[12,3,34],[5,6,7]]])
>   b = np.array([1,2,3])
>   np.dot(a1,b)
>   >>> array([[ 14,  32],
>         		 [120,  38]])
>   ```
>
> - If *a* is an N-D array and *b* is an M-D array (where `M>=2`), it is a **sum product over the last axis of *a* and the second-to-last axis of *b*:**
>
>   `dot(a, b)[i,j,k,m] = sum(a[i,j,:] * b[k,:,m])`

- `Ndarray – numpy.matmul`

> **Matrix product of two arrays.**
>
> The behavior depends on the arguments in the following way.
>
> - If both arguments are 2-D they are **multiplied like conventional matrices**.
> - If either argument is N-D, N > 2, it is treated as **a stack of matrices residing in the last two indexes and broadcast accordingly.**
> - If the first argument is 1-D, it is promoted to a matrix by prepending a 1 to its dimensions. After matrix multiplication the prepended 1 is removed.
> - If the second argument is 1-D, it is promoted to a matrix by appending a 1 to its dimensions. After matrix multiplication the appended 1 is removed.
>
> **Multiplication by a scalar is not allowed**, use `*` instead. Note that multiplying a stack of matrices with a vector will result in a stack of vectors, but matmul will not recognize it as such.
>
> `matmul` differs from `dot` in two important ways.
>
> - Multiplication by scalars is not allowed.
> - Stacks of matrices are broadcast together as if the matrices were elements.

### 五、合并、分割

- 合并
  - numpy.concatenate((a1, a2, ...), axis=0)
  - numpy.hstack(tup) Stack arrays in sequence horizontally **(column wise).**
  - numpy.vstack(tup) Stack arrays in sequence vertically **(row wise).**

```python
a = np.array([[1,2,3]])
np.vstack([a,a])
>>> array([[1, 2, 3],
       		[1, 2, 3]])
np.hstack([a,a])
>>> array([1, 2, 3, 1, 2, 3])
np.concatenate([a,a],axis=0)
>>> array([1, 2, 3, 1, 2, 3])
```

- 分割
  - **numpy.split(ary, indices_or_sections, axis=0) Split an array into multiple sub-arrays.**

### 六、IO操作与数据处理

- numpy也可以做，但是pandas更强大

