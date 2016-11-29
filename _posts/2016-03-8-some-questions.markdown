#### 1.不要在dealloc init 中使用accessor
[为什么不要在init和dealloc函数中使用accessor](http://blog.smilexiaofeng.com/blog/2015/08/11/why-do-not-use-accessor-in-init-and-dealloc/)

[不要在init和dealloc函数中使用accessor](http://blog.devtang.com/2011/08/10/do-not-use-accessor-in-init-and-dealloc-method/)

彭笑风的技术博客：
> 在init和dealloc中使用accessor是存在风险的。即使现在代码没有问题，难保将来维护或扩展时会出现问题。只有将苹果所说的Don’t Use Accessor Methods in Initializer Methods and dealloc当作一条编程规范，才能从根本上规避这个问题。规矩立好了，代码欠的债就少，将来的生活就会更加美好。<br><br>

唐巧：
> 在 init 和 dealloc 中，对象的存在与否还不确定，所以给对象发消息可能不会成功。

#### 2.ARC注意事项
* 循环保留
* block 和 ARC
	* __block
	* __weak


1. ARC 设置：Building Setting<br>关闭某个文件设置：-fno-objc-arc<br>你可以使用编译标记-fobjc-arc来让你的工程支持ARC.
2. delegate、outlet应该使用weak属性来声明
3. ARC机制下，彻底忘掉retain、release、retainCount和autorelease。<br>在@property声明中，用strong和weak代替相应的retain, copy,和assign。
4. __weak 定义的变量一致，该属性所声明的变量将没有对象的所有权，并且当对象被破弃之后，对象将被自动赋值nil
5. 使用ARC的一些强制规定：
	* 不能直接调用dealloc方法，不能调用retain，release，autorelease，retainCount方法，包括@selector(retain)的方式也不行
	* 可以用dealloc方法来管理一些资源，但不能用来释放实例变量，也不能在dealloc方法里面去掉［super dealloc］方法，在ARC下父类的dealloc同样由编译器来自动完成
	* Core Foundation类型的对象仍然可以用CFRetain，CFRelease这些方法
	* 不能再使用NSAllocateObject和NSDeallocateObject对象
	* 不能在C结构体中使用对象指针，如果由类似功能可以创建一个Objective－C类来管理这些对象
	* 在id和void＊之间没有简便的转换方法，同样在Objective－C和core Foundation类型之间的转换都需要使用编译器制定的转换函数
	* 不能再使用NSAutoreleasePool对象，ARC提供了@autoreleasepool块来代替它，这样更有效率
	* 不能使用内存存储区（不能再使用NSZone）
	* 不能以new为开头给一个属性命名
	* 声明outlet时一般应当使用weak，除了对StoryBoard这样nib中间的顶层对象要用strong
	* <del>weak相当于老版本的assign</del> weak(当对象被废弃之后自动赋值nil) > assign，strong相当于retain
6. dealloc方法的使用：
	* 已经开启了arc，dealloc还可以使用，只是在代码中中不能显示调用，在dealloc方法中不可以包含[super dealloc]。
	* 在dealloc中一般用来解除delegate，例如_webView.delegate = nil;
	* 开始的时候注册了notification等，那么是需要在dealloc中把这些notification移除掉
	* 如果某个类没有调用dealloc方法，会导致内存泄露，这时要检查在该类内部是否有其他对象调用了该对象导致无法成功释放。
7. 通过(Edit > Refactor > Convert to Objective-C ARC)把已有的代码转换成ARC
	


[ARC内存使用注意事项](http://www.cnblogs.com/javawebsoa/archive/2013/07/17/3196509.html)<br>
[Memory Usage Performance Guidelines](https://developer.apple.com/library/mac/documentation/Performance/Conceptual/ManagingMemory/ManagingMemory.html#//apple_ref/doc/uid/10000160-SW1)