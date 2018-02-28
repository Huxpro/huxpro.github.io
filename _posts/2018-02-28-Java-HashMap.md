---
layout:     post
title:      "JAVA HashMap"
subtitle:   " \"Java HashMap源码解析\""
date:       2018-02-28 15:15:00
author:     "WQ"
header-img: "img/blogImg/2018-02-28.jpg"
catalog: true
tags:
    - Java
---


# JAVA HashMap源码解读

### jdk1.7

jdk1.7中使用的是Entry数组，而Entry是一个单向链表。
数组：查询的时间复杂度为O(1),插入和删除的时间复杂度为O(n)
链表：查询的时间复杂度为O(n),插入和删除的时间复杂度为O(1)

所以在hashMap中使用的是连着结合的方式，即拉链式实现方法。

```java

/**
 * 源码阅读点到为止，不深入的太细，关键的两个入口方法为get，put
 */
class HashMap{

    /**
     * 默认的初始化容量，即buckets的大小
     */
    static final int DEFAULT_INITIAL_CAPACITY = 1 << 4; // aka 16

    /**
     * 负载系数，bucket内数据填充比例
     */
    static final float DEFAULT_LOAD_FACTOR = 0.75f;


    /**
     * buckets的扩容方法，当当前的capacity*loadFactor>当前容量时，进行扩容=容量*2
     */
    private void inflateTable(int toSize) {
        // Find a power of 2 >= toSize
        int capacity = roundUpToPowerOf2(toSize);

        threshold = (int) Math.min(capacity * loadFactor, MAXIMUM_CAPACITY + 1);
        table = new Entry[capacity];

        // 初始化hashSeed，用于计算hash值的，具体解释看源码，解释的很清楚
        initHashSeedAsNeeded(capacity);
    }

    /**
     * 使用key的hash值计算处在Entry数组的index位置
     * @param key
     * @param value
     * @return
     */
    public V put(K key, V value) {
        // table就是Entry[]，即buckets，其容量默认为16
        // 注意buckets的初始化是在第一次put的时候
        if (table == EMPTY_TABLE) {
            inflateTable(threshold);
        }
        if (key == null)
            // 当key为null时，总是放在index=0的位置
            return putForNullKey(value);
        int hash = hash(key);
        int i = indexFor(hash, table.length);
        // 链表遍历
        for (Entry<K,V> e = table[i]; e != null; e = e.next) {
            Object k;
            //找到hash且key都相同的
            if (e.hash == hash && ((k = e.key) == key || key.equals(k))) {
                V oldValue = e.value;
                e.value = value;
                e.recordAccess(this);
                return oldValue;
            }
        }

        // 如果上面的遍历没找到就添加Entry
        modCount++;
        addEntry(hash, key, value, i);
        return null;
    }

    /**
     * 添加Entry，
     * @param hash
     * @param key
     * @param value
     * @param bucketIndex
     */
    void addEntry(int hash, K key, V value, int bucketIndex) {
        // 大于阀值且部位null，进行扩容，并重新计算index
        if ((size >= threshold) && (null != table[bucketIndex])) {
            resize(2 * table.length);
            hash = (null != key) ? hash(key) : 0;
            bucketIndex = indexFor(hash, table.length);
        }
        // 将新创建的Entry放在链表的头部，类似于栈
        createEntry(hash, key, value, bucketIndex);
    }

    // ---------------------------get------------------------------
    /**
     * get方法，很简单
     * @param key
     */
    public V get(Object key) {
        if (key == null)
            return getForNullKey();
        Entry<K,V> entry = getEntry(key);

        return null == entry ? null : entry.getValue();
    }

     /**
     * Returns the entry associated with the specified key in the
     * HashMap.  Returns null if the HashMap contains no mapping
     * for the key.
     */
    final Entry<K,V> getEntry(Object key) {
        int hash = (key == null) ? 0 : hash(key);
        for (Entry<K,V> e = table[indexFor(hash, table.length)];
             e != null;
             e = e.next) {
            Object k;
            if (e.hash == hash &&
                ((k = e.key) == key || (key != null && key.equals(k))))
                return e;
        }
        return null;
    }

    /**
     * hash取模，得到hash在buckets中的位置，但是取模比较消耗性能，所以使用了下面的方式
     */
    static int indexFor(int h, int length) {
        // assert Integer.bitCount(length) == 1 : "length must be a non-zero power of 2";
        // 当length总是2的n次方时，h& (length-1)运算等价于对length取模,但是&比%具有更高的效率
        return h & (length-1);
    }
}

```

注意在HashMap使用了很多的`transient`表示不进行序列化，因为不同JVM产生的hash不一样，所以当进行序列化之后需要重建hash索引，并且节约了空间，所以下面的这些参数都没什么意义。

```java

    /**
     * The table, resized as necessary. Length MUST Always be a power of two.
     */
    transient Entry<K,V>[] table = (Entry<K,V>[]) EMPTY_TABLE;

    /**
     * The number of key-value mappings contained in this map.
     */
    transient int size;

    /**
     * 用于fail-fast机制的参数，每次结构修改都会使modCount++。但是普通的put操作对原有的值进行覆盖不会修改该值
     */
    transient int modCount;


     /**
     * 随机的hash种子
     */
    transient int hashSeed = 0;

    // Views,给iterate使用

    private transient Set<Map.Entry<K,V>> entrySet = null;

```

### jdk1.8

在jdk1.8中对HashMap进行了算法改进，引入了红黑树处理哈希碰撞，此时的查找时间复杂度为o(log n) ，即JDK8中的HashMap采用了数组+链表或树的结构来存储数据。

对于红黑树的部分暂且不讨论。

```java

class HashMap{


     // 将1.7中的Entry换成Node，实现基本类似，基本上是换个名字，为了在TreeNode中使用
     transient Node<K,V>[] table;

     // -----------------下面是新增的三个属性-------------------------

     // 链表转换成树的阀值（链表的长度）
     static final int TREEIFY_THRESHOLD = 8

     // 红黑树还原成链表的阀值
     static final int UNTREEIFY_THRESHOLD = 6;

     // 当使用红黑树时buckets扩容的最小值，也就是说避免出现key-value集中在较少的buckets中，需要进行扩容的最大阀值，当然前面的负载因子的扩容还是有效的，也就是小于该值依然使用链表存储
     static final int MIN_TREEIFY_CAPACITY = 64;


     public V put(K key, V value) {
         // hash的计算方法,参考下面的图片
        return putVal(hash(key), key, value, false, true);
    }

    /**
     * Implements Map.put and related methods
     *
     * @param hash hash for key
     * @param key the key
     * @param value the value to put
     * @param onlyIfAbsent if true, don't change existing value
     * @param evict if false, the table is in creation mode.
     * @return previous value, or null if none
     */
    final V putVal(int hash, K key, V value, boolean onlyIfAbsent,
                   boolean evict) {
        Node<K,V>[] tab; Node<K,V> p; int n, i;
        // 第一次放入，需要对buckets进行初始化
        if ((tab = table) == null || (n = tab.length) == 0)
            n = (tab = resize()).length;
        
        // 计算hash的index，如果没有碰撞之间放进去
        if ((p = tab[i = (n - 1) & hash]) == null)
            // 由于tab.lenth小于threshold所以不会出现数组越界
            tab[i] = newNode(hash, key, value, null);
        else {
            // hash碰撞之后
            Node<K,V> e; K k;
            // 能找到碰撞的hash
            if (p.hash == hash &&
                ((k = p.key) == key || (key != null && key.equals(k))))
                e = p;
            // 当前的hash节点为树结构
            else if (p instanceof TreeNode)
                // 数据放到tree当中，如果已经存在就返回旧的node
                e = ((TreeNode<K,V>)p).putTreeVal(this, tab, hash, key, value);
            // 是链表
            else {
                for (int binCount = 0; ; ++binCount) {
                    if ((e = p.next) == null) {
                        p.next = newNode(hash, key, value, null);
                        // 链表长度超过阀值，转换成树
                        if (binCount >= TREEIFY_THRESHOLD - 1) // -1 for 1st
                            treeifyBin(tab, hash);
                        break;
                    }
                    if (e.hash == hash &&
                        ((k = e.key) == key || (key != null && key.equals(k))))
                        break;
                    p = e;
                }
            }
            // 找到了hash,替换值
            if (e != null) { // existing mapping for key
                V oldValue = e.value;
                if (!onlyIfAbsent || oldValue == null)
                    e.value = value;
                afterNodeAccess(e);
                return oldValue;
            }
        }
        ++modCount;
        // 判断是否超过阀值，继续扩容
        // size为key-value的个数
        if (++size > threshold)
            resize();
        afterNodeInsertion(evict);
        return null;
    }

    /**
     * Replaces all linked nodes in bin at index for given hash unless
     * table is too small, in which case resizes instead.
     */
    final void treeifyBin(Node<K,V>[] tab, int hash) {
        int n, index; Node<K,V> e;
        // 避免出现多个key-value集中在很少的几个buckets中，所以进行扩容，重建hash
        if (tab == null || (n = tab.length) < MIN_TREEIFY_CAPACITY)
            resize();
        else if ((e = tab[index = (n - 1) & hash]) != null) {
            TreeNode<K,V> hd = null, tl = null;
            do {
                TreeNode<K,V> p = replacementTreeNode(e, null);
                if (tl == null)
                    hd = p;
                else {
                    p.prev = tl;
                    tl.next = p;
                }
                tl = p;
            } while ((e = e.next) != null);
            //上面是新建二叉树
            if ((tab[index] = hd) != null)
                // 将普通的二叉树转换成红黑树
                hd.treeify(tab);
        }
    }

    // -------------------get-----------------------

    public V get(Object key) {
        Node<K,V> e;
        return (e = getNode(hash(key), key)) == null ? null : e.value;
    }
 
    /**
     * Implements Map.get and related methods
     *
     * @param hash hash for key
     * @param key the key
     * @return the node, or null if none
     */
    final Node<K,V> getNode(int hash, Object key) {
        Node<K,V>[] tab; Node<K,V> first, e; int n; K k;
        // hash算法和上面是一样的
        if ((tab = table) != null && (n = tab.length) > 0 &&
            (first = tab[(n - 1) & hash]) != null) {
                // 总会判断头结点，有可能key=null
            if (first.hash == hash && // always check first node
                ((k = first.key) == key || (key != null && key.equals(k))))
                return first;
            if ((e = first.next) != null) {
                // 是红黑树
                if (first instanceof TreeNode)
                    return ((TreeNode<K,V>)first).getTreeNode(hash, key);

                // 是链表
                do {
                    if (e.hash == hash &&
                        ((k = e.key) == key || (key != null && key.equals(k))))
                        return e;
                } while ((e = e.next) != null);
            }
        }
        return null;
    }

}


```

在HashMap中，哈希桶数组table的长度length大小必须为2的n次方(一定是合数)，这是一种非常规的设计，常规的设计是把桶的大小设计为素数。相对来说素数导致冲突的概率要小于合数，具体证明可以[参考](http://blog.csdn.net/liuqiyao_01/article/details/14475159)，Hashtable初始化桶大小为11，就是桶大小设计为素数的应用（Hashtable扩容后不能保证还是素数）。HashMap采用这种非常规设计，主要是为了在取模和扩容时做优化，同时为了减少冲突，HashMap定位哈希桶索引位置时，也加入了高位参与运算的过程。


同时需要注意的是在jdk7和jdk8中的hash算法也有了很大的提升，在1.8中扩容（size*2）不需要重新计算hash，只需要看看原来的hash值新增的那个bit是1还是0就好了，是0的话索引没变，是1的话索引变成“原索引+oldCap”，而且同时，由于新增的1bit是0还是1可以认为是随机的，因此resize的过程，均匀的把之前的冲突的节点分散到新的bucket了,具体为什么这么设计，我是看不懂了，目前算法的能力还不够！同时代码量也从1000多变为了2000多，总的性能提升很大。

[不错的文章](https://tech.meituan.com/java-hashmap.html)

参考：

![](http://pic2.zhimg.com/v2-ebcf5d17c2707f49fa7859e88cca016d_b.jpg)