---
layout:     post
title:      "const参数,const返回值与const函数"
subtitle:   "const in C/C++"
date:       2018-02-04 14:00:00
author:     "Alex"
header-img: "img/post-bg-re-vs-ng2.jpg"
header-mask: 0.3
catalog:    true
tags:
    - const return value
    - const function
    - const parameter
---


> 一直以来，对const参数的用法不是很熟悉。  
> 经常用const 来限制对一个对象的操作，例如，将一个变量定义为const 类型的：

>const  int  n=3;

>则这个变量的值不能被修改，即不能对变量赋值。。  

看到const关键字，可能首先想到的是const常量，const不仅可以修饰常量，还可以修饰函数的参数函数的返回值，以及成员函数。

**1. const修饰函数参数**
        1.如果输入的参数采用“指针传递”，那么加上const可以防止意外的改动该指针，起到保护作用。防止传入的参数代表的内容在函数体内被改变，但仅对指针和引用有意义。
        例如：void func(char *dest_str, const char *src_str)
        
        2.如果输入参数采用“值传递”，由于函数将自动产生临时变量用于复制该参数，该输入参数本来就不需要保护所以
        不用加const也可以。因为如果是按值传递，传给参数的仅仅是实参的副本，即使在函数体内改变了形参，实参也不会得到影响。
        例如：void func(int x)不用写成void func(const int x）
       
        3.但是对于非内部的数据类型的参数而言，例如void func( A a)这样声明的函数注定效率低，因为函数体内
        将自动产生临时对象，用于复制该参数a，而临时变量的构造，拷贝构造，析构都将耗费时间。所以为了提高效率
        可以写成这样void func(A &a)用“引用传递”就不用产生临时对象，如果不想改变参数a就写成
        void func(const A &a)。

 **2. const修饰函数返回值**
        1.以“指针传递”方式的函数返回值加上const修饰，那么该函数的返回值的内容不能被修改，归根究底就是使得函数调用表达式不能作为左值。
         例如：const char *get_string(void)
         
        2.如果函数返回值采用“值传递方式”，由于函数会把返回值复制到外部的临时存储单元中，所以加上const修饰
         没有意义，
         例如：int get_number(void)不用写成const int get_number(void)
        
        3.但是返回值不是内部数据类型，例如：A get_string(void),这样会产生一个临时的对象用来存放返回的数据，
         会调用拷贝构造函数，这样效率会低，所以采用“引用传递”A &get_string(void),如果加上const那么返回值的
         内容就不会被改变const A &get_string(void)

**3. const修饰成员函数**


        1.任何不会修改成员的函数都应该声明为const类型。
         例如计数函数不会对成员进行修改所以int get_count(void)const;注意const成员函数的声明将const放到
         函数的尾部。
         
        2.const成员函数不可以修改对象的数据。
            const对象只能访问const成员函数，非const对象可以任意访问任意的成员函数。
        3.

 ```C++
         class A{
            public:
                int get_count(int)const;
            }
```

        int get_count(int)const准确的说这个const修饰的是this指向的对象，其实get_count(int)这个函数在
        调用方法时会被编译器改写成get_count(A *const this, int)const;为了不允许get_count()这个函数改变
        this指向的对象，则用const修饰这个函数，因此this指针的类型变为const A *const this.