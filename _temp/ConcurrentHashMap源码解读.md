# ConcurrentHashMap源码解析

对于ConcurrentHashMap和HashMap其数据结构基本相似，只是在原有的HashMap的基础上添加了Segment数组，也就是Segment数组中包含HashEntry数组，而HashEntry数组中包含链表（jdk1.8中是链表或者红黑树）。

对于该类的很多方法都需要获取读取Segment且是多线程的，所以需要保证内存可见性，但是使用volatile会是得当每次进行写操作的时候都是得CPU内缓存无效，使用锁机制开销很大，所以这里使用了UNSAFE直接操作内存的方式保证可见性。

## jdk1.7

```java

class ConcurrentHashMap{

     static final int DEFAULT_INITIAL_CAPACITY = 16;

     static final float DEFAULT_LOAD_FACTOR = 0.75f;

     static final int DEFAULT_CONCURRENCY_LEVEL = 16;

     /**
     *  默认的构造器，前两个参数和HashMap一直，第三个参数为Segment数组的初始化大小
     */
     public ConcurrentHashMap(int initialCapacity,
                             float loadFactor, int concurrencyLevel) {
        if (!(loadFactor > 0) || initialCapacity < 0 || concurrencyLevel <= 0)
            throw new IllegalArgumentException();
        if (concurrencyLevel > MAX_SEGMENTS)
            concurrencyLevel = MAX_SEGMENTS;
        // 初始化计算hash的segment索引的参数
        // Find power-of-two sizes best matching arguments
        int sshift = 0;
        int ssize = 1;
        while (ssize < concurrencyLevel) {
            ++sshift;
            ssize <<= 1;
        }
        // 在段中进行索引的移位值
        this.segmentShift = 32 - sshift;

        // 用于索引分段的掩码值。 密钥散列码的高位用于选择段
        this.segmentMask = ssize - 1;
        if (initialCapacity > MAXIMUM_CAPACITY)
            initialCapacity = MAXIMUM_CAPACITY;
        int c = initialCapacity / ssize;
        if (c * ssize < initialCapacity)
            ++c;
        int cap = MIN_SEGMENT_TABLE_CAPACITY;
        while (cap < c)
            cap <<= 1;

        // 注意此处是在初始化时就初始化segments数组
        // create segments and segments[0]
        Segment<K,V> s0 =
            new Segment<K,V>(loadFactor, (int)(cap * loadFactor),
                             (HashEntry<K,V>[])new HashEntry[cap]);
        Segment<K,V>[] ss = (Segment<K,V>[])new Segment[ssize];
        UNSAFE.putOrderedObject(ss, SBASE, s0); // ordered write of segments[0]
        this.segments = ss;
    }

     /**
      * put方法
      */
     public V put(K key, V value) {
        Segment<K,V> s;
        // 注意此处key(jdk1.7中没有检查是否为null，1.8中有检查),value不能为null，但hashMap的key,value可以为null
        if (value == null)
            throw new NullPointerException();
        // 计算key的hash值
        int hash = hash(key);
        // 计算segment的index
        int j = (hash >>> segmentShift) & segmentMask;

        if ((s = (Segment<K,V>)UNSAFE.getObject          // nonvolatile; recheck
             (segments, (j << SSHIFT) + SBASE)) == null) //  in ensureSegment
            // 通过index获取segment，如果不存在则创建，通过CAS
            s = ensureSegment(j);
        return s.put(key, hash, value, false);
    }

    // 这个方法是Segment类中的，该类继承ReentrantLock类，可以方便的使用锁
    final V put(K key, int hash, V value, boolean onlyIfAbsent) {
                // 获取Segement的锁，当获取之后就和操作普通的HashMap没啥区别了
                // 理论并发数=Segment大小
                HashEntry<K,V> node = tryLock() ? null :
                    scanAndLockForPut(key, hash, value);
                V oldValue;
                try {
                    // 获取HashEntry中头个节点
                    HashEntry<K,V>[] tab = table;
                    int index = (tab.length - 1) & hash;
                    HashEntry<K,V> first = entryAt(tab, index);
                    for (HashEntry<K,V> e = first;;) {
                        if (e != null) {
                            K k;
                            if ((k = e.key) == key ||
                                (e.hash == hash && key.equals(k))) {
                                oldValue = e.value;
                                if (!onlyIfAbsent) {
                                    e.value = value;
                                    ++modCount;
                                }
                                break;
                            }
                            e = e.next;
                        }
                        else {
                            if (node != null)
                                node.setNext(first);
                            else
                                node = new HashEntry<K,V>(hash, key, value, first);
                            int c = count + 1;
                            if (c > threshold && tab.length < MAXIMUM_CAPACITY)
                                rehash(node);
                            else
                                setEntryAt(tab, index, node);
                            ++modCount;
                            count = c;
                            oldValue = null;
                            break;
                        }
                    }
                } finally {
                    unlock();
                }
                return oldValue;
            }



        /**
         * 使用了自旋锁，当超过最大重试次数后，就使用lock申请锁
         *
         * @return a new node if key not found, else null
         */
        private HashEntry<K,V> scanAndLockForPut(K key, int hash, V value) {
            // 在当前Segment中定位到HashEntry
            HashEntry<K,V> first = entryForHash(this, hash);
            HashEntry<K,V> e = first;
            HashEntry<K,V> node = null;
            int retries = -1; // negative while locating node
            // 尝试获取锁
            while (!tryLock()) {
                HashEntry<K,V> f; // to recheck first below
                if (retries < 0) {
                    if (e == null) {
                        if (node == null) // speculatively create node
                            node = new HashEntry<K,V>(hash, key, value, null);
                        retries = 0;
                    }
                    else if (key.equals(e.key))
                        retries = 0;
                    else
                        e = e.next;
                }
                else if (++retries > MAX_SCAN_RETRIES) {
                    // 申请锁
                    lock();
                    break;
                }
                else if ((retries & 1) == 0 &&
                         (f = entryForHash(this, hash)) != first) {
                    e = first = f; // re-traverse if entry changed
                    retries = -1;
                }
            }
            return node;
        }


    /**
     * 如果想要获取Map的size，最简单的方式是锁住所有的segment然后计算大小，但是此时不能对map进行读写操作
     * 此处的策略是：先不上锁，进行segment遍历，如果两次之间的size相同则认为这两次之间没有更新操作，以此作为返回值，最多计算3次
     * 如果3次都不满足上面的条件，那么就对所有segment加锁
     * @return the number of key-value mappings in this map
     */
    public int size() {
        // Try a few times to get accurate count. On failure due to
        // continuous async changes in table, resort to locking.
        final Segment<K,V>[] segments = this.segments;
        int size;
        boolean overflow; // true if size overflows 32 bits
        long sum;         // sum of modCounts
        long last = 0L;   // previous sum
        int retries = -1; // first iteration isn't retry
        try {
            for (;;) {
                
                if (retries++ == RETRIES_BEFORE_LOCK) {
                    for (int j = 0; j < segments.length; ++j)
                        ensureSegment(j).lock(); // force creation
                }
                sum = 0L;
                size = 0;
                overflow = false;
                for (int j = 0; j < segments.length; ++j) {
                    Segment<K,V> seg = segmentAt(segments, j);
                    if (seg != null) {
                        sum += seg.modCount;
                        int c = seg.count;
                        if (c < 0 || (size += c) < 0)
                            overflow = true;
                    }
                }
                if (sum == last)
                    break;
                last = sum;
            }
        } finally {
            if (retries > RETRIES_BEFORE_LOCK) {
                for (int j = 0; j < segments.length; ++j)
                    segmentAt(segments, j).unlock();
            }
        }
        return overflow ? Integer.MAX_VALUE : size;
    }
}


```

## jdk1.8

TODO:

使用的数据结构和jdk8中的HashMap很像1，但是在Node中有个很大的不同是，没有了setValue()取而代之的是find()，同时属性value和next，添加了volatile修饰。

在Node中存储的不是

```java

class Node<K,V>{

    /**
     * Virtualized support for map.get();
     */
    Node<K,V> find(int h, Object k) {
        Node<K,V> e = this;
        if (k != null) {
            do {
                K ek;
                if (e.hash == h &&
                    ((ek = e.key) == k || (ek != null && k.equals(ek))))
                    return e;
            } while ((e = e.next) != null);
        }
        return null;
    }
}

class ConcurrentHashMap{

    /**
     * hash表初始化或扩容时的一个控制位标识量。 
     * 负数代表正在进行初始化或扩容操作 
     * -1代表正在初始化 
     * -N 表示有N-1个线程正在进行扩容操作 
     * 正数或0代表hash表还没有被初始化，这个数值表示初始化或下一次进行扩容的大小
     */
    private transient volatile int sizeCtl;
    
    public V put(K key, V value) {
        return putVal(key, value, false);
    }


    /** Implementation for put and putIfAbsent */
    final V putVal(K key, V value, boolean onlyIfAbsent) {
        // 1.7缺少key的判断
        if (key == null || value == null) throw new NullPointerException();
        int hash = spread(key.hashCode());
        int binCount = 0;
        for (Node<K,V>[] tab = table;;) {
            Node<K,V> f; int n, i, fh;
            // 初始化table
            if (tab == null || (n = tab.length) == 0)
                tab = initTable();
            else if ((f = tabAt(tab, i = (n - 1) & hash)) == null) {
                if (casTabAt(tab, i, null,
                             new Node<K,V>(hash, key, value, null)))
                    break;                   // no lock when adding to empty bin
            }
            else if ((fh = f.hash) == MOVED)
                tab = helpTransfer(tab, f);
            else {
                V oldVal = null;
                synchronized (f) {
                    if (tabAt(tab, i) == f) {
                        if (fh >= 0) {
                            binCount = 1;
                            for (Node<K,V> e = f;; ++binCount) {
                                K ek;
                                if (e.hash == hash &&
                                    ((ek = e.key) == key ||
                                     (ek != null && key.equals(ek)))) {
                                    oldVal = e.val;
                                    if (!onlyIfAbsent)
                                        e.val = value;
                                    break;
                                }
                                Node<K,V> pred = e;
                                if ((e = e.next) == null) {
                                    pred.next = new Node<K,V>(hash, key,
                                                              value, null);
                                    break;
                                }
                            }
                        }
                        else if (f instanceof TreeBin) {
                            Node<K,V> p;
                            binCount = 2;
                            if ((p = ((TreeBin<K,V>)f).putTreeVal(hash, key,
                                                           value)) != null) {
                                oldVal = p.val;
                                if (!onlyIfAbsent)
                                    p.val = value;
                            }
                        }
                    }
                }
                if (binCount != 0) {
                    if (binCount >= TREEIFY_THRESHOLD)
                        treeifyBin(tab, i);
                    if (oldVal != null)
                        return oldVal;
                    break;
                }
            }
        }
        addCount(1L, binCount);
        return null;
    }

    /**
     * Initializes table, using the size recorded in sizeCtl.
     * 使用sizeCtl作为并发控制，表示当前table所处的状态，使用USAFE的方式实现CAS，避免使用锁
     */
    private final Node<K,V>[] initTable() {
        Node<K,V>[] tab; int sc;
        while ((tab = table) == null || tab.length == 0) {
            if ((sc = sizeCtl) < 0)
                Thread.yield(); // lost initialization race; just spin
            else if (U.compareAndSwapInt(this, SIZECTL, sc, -1)) {
                try {
                    if ((tab = table) == null || tab.length == 0) {
                        int n = (sc > 0) ? sc : DEFAULT_CAPACITY;
                        @SuppressWarnings("unchecked")
                        Node<K,V>[] nt = (Node<K,V>[])new Node<?,?>[n];
                        table = tab = nt;
                        // 相当于0.75*n
                        sc = n - (n >>> 2);
                    }
                } finally {
                    sizeCtl = sc;
                }
                break;
            }
        }
        return tab;
    }


}


```

## 不同之处

ConcurrentHashMap与HashMap相比，有以下不同点

* ConcurrentHashMap线程安全，而HashMap非线程安全
* HashMap允许Key和Value为null，而ConcurrentHashMap不允许（jdk1.7没有检查key是否为null，1.8有检查）
* HashMap不允许通过Iterator遍历的同时通过HashMap修改，可以通过迭代器修改，而ConcurrentHashMap允许该行为，并且该更新对后续的遍历可见
* ConcurrentHashMap是弱一致性，而Hashtable为强一致性

> 什么是弱一致性，我举个简单的例子，例如题主说的clear方法！因为没有全局的锁，在清除完一个segments之后，正在清理下一个segments的时候，已经清理segments可能又被加入了数据，因此clear返回的时候，ConcurrentHashMap中是可能存在数据的。因此，clear方法是弱一致的。


## 总结

对比1.7和1.8版本的ConcurrentHashMap，代码翻了5陪多，佩服！


参考：

[ConcurrentHashMap源码分析（JDK8版本）](http://blog.csdn.net/u010723709/article/details/48007881)