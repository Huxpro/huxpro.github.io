# Java-Module

[详细参考](https://www.oracle.com/corporate/features/understanding-java-9-modules.html)

`java --list-modules `，列出jdk所有的module

## 语法

1. module-info.java文件必须位于module的source root，这个文件在编译的时候同样会变成`.class`文件

2. 关键字`module`+模块名称+`{}`，其中模块名称默认是表名，自己可以随意命名（符合java命名规范）

3. module body可以包含的关键字有requires、exports、provides..with、uses、opens

4. | 关键字               | 描述                                                         | 例子                                                         |
   | -------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
   | requires             | 指定依赖的module，称为module dependency                      | requires *<modulename>*;                                     |
   | requires static      | 表示compiler时依赖这个module，但是runtime时是可选的（可选依赖） | requires static *<modulename>*;                              |
   | requires transitive  | 表示读取当前模块时读取隐含模块（[这个解释更加合理](https://stackoverflow.com/questions/46502453/whats-the-difference-between-requires-and-requires-transitive-statements-in-jav)），transitive和static可以同时使用 | requires transitive *<modulename>*                           |
   | exports              | 表示将这个module的public，protected方法暴露给其他module      | exports *<modulename>*                                       |
   | exports ...to        | 指定那些模块或者模块的代码可以访问这个module，使用`,`进行分割 | exports *<modulename>* to *<other modulename>*               |
   | uses                 | 指定module使用的 service ,service的消费者， service 的定义是一个object继承abstract或实现interface，如果使用spi进行加载，那么必须使用uses |                                                              |
   | provides...with      | 指定该module提供的service实现，service的提供者               | provides 接口或抽象类 with 实现类                            |
   | open,opens,open...to | 对反射进行限制，只有open的package才能被反射；open的代码能被任意module访问 | opens package to comma-separated-list-of-modules ；<br /> opens *package* ；<br /> open module *modulename* {    // module directives } |


