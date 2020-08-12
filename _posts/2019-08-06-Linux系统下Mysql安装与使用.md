# **Linux系统下Mysql安装与使用**

## Mysql安装

```
sudo apt-get install mysql-server mysql-client    安装

sudo mysql_secure_installation    安全设置（包括设置密码）

sudo mysql    或者  mysql -u root -p    打开MySQL

SELECT user,authentication_string,plugin,host FROM mysql.user;检查MySQL系统每个用户的认证方式

ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';    重新设置密码

FLUSH PRIVILEGES;    刷新权限

SELECT user,authentication_string,plugin,host FROM mysql.user;
再次检查每个用户的授权方法

CREATE USER 'sammy'@'localhost' IDENTIFIED BY 'password';
创建新用户

GRANT ALL PRIVILEGES ON *.* TO 'sammy'@'localhost' WITH GRANT OPTION;
授予新用户合适的权限
```

## Mysql命令行

sudo apt-get install phpmyadmin;    phpmyadmin管理

systemctl status mysql.service;    查看运行状态

sudo systemctl start mysql; 如果没有启动服务，通过该命令启动服务

sudo mysqladmin -p -u root version;    检查版本信息

## ALTER命令使用

### 修改表信息

1.修改表名

```sql
alter table 原表名 rename to 新表名;
```

 2.修改表注释

```sql
alter table 表名 comment '系统信息表';
```

### 修改字段信息

1.修改字段类型和注释

```sql
alter table 表名  modify 字段名 varchar(20) COMMENT '应用的名称';
```

2.修改字段类型

```sql
alter table 表名  modify 字段名 类型;
```

3.单独修改字段注释

```text
目前没发现有单独修改字段注释的命令语句。
```

4.设置字段允许为空

```sql
alter table 表名  modify 字段名 varchar(255) null COMMENT '描述';
```

 5.增加一个字段

```sql
alert table 表名 add 字段名 varchar(255) not null COMMENT '注释';
```

 6.增加主键

```sql
alter table 表名 add 字段名 int(5) not null ,add primary key (字段名);
```

7.增加自增主键

```sql
alter table 表名 add 字段名 int(5) not null auto_increment ,add primary key (字段名);
```

8.修改为自增主键

```sql
alter table 表名  modify 字段名 int(5) auto_increment ;
```

9.修改字段名字(要重新指定该字段的类型)

```sql
alter table 表名 change 原字段名 新字段名 varchar(20) not null;
```

10.删除字段

```sql
alter table 表名 drop 字段名;
```

11.在某个字段后增加字段

```sql
alter table 表名 add 字段名1 int  not null default 0 AFTER 字段名2； #(在哪个字段后面添加)
```

12.调整字段顺序

```sql
alter table 表名  change 字段名1 字段名1 int not null after 字段名2 ; #(注意字段名1出现了2次)
```

## Nodejs与Mysql

### Nodejs连接Mysql

```js
var mysql = require('mysql');
var connection = mysql.createConnection({
      host : 'localhost',
      user : 'root',
      password : '000000',
      database : 'test'
});
connection.connect();
```

### 查询数据

```js
var  sql = 'SELECT * FROM `test`';
connection.query(sql,function (err, result) {
       console.log(result);
});
[ RowDataPacket {
    id: 1,
    name: 'Google',
    url: 'https://www.google.cm/',
    alexa: 1,
    country: 'USA' },
  RowDataPacket {
    id: 2,
    name: '淘宝',
    url: 'https://www.taobao.com/',
    alexa: 13,
    country: 'CN' },
  RowDataPacket {
    id: 3,
    name: 'Facebook',
    url: 'https://www.facebook.com/',
    alexa: 3,
    country: 'USA' } ]
```

### 插入数据

```js
var  sql = 'INSERT INTO `test`(Id,name,url,alexa,country) VALUES(0,?,?,?,?)';
var  params = ['菜鸟工具', 'https://c.runoob.com','23453', 'CN'];
connection.query(sql,params,function (err, result) {
})
```

### 更新数据

```js
var sql = 'UPDATE `test` SET `name` = ?,`url` = ? WHERE `Id` = ?';
var params = ['菜鸟移动站', 'https://m.runoob.com',6];
connection.query(sql,params,function (err, result) {
})
```

### 删除数据

```js
var sql = 'DELETE FROM `test` where `id`=6';
connection.query(sql,function (err, result) {
})
```

