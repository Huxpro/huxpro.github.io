# php-Mongodb

#### php连接Mongodb

```
//无密码
$manager = new MongoDB\Driver\Manager("mongodb://localhost:27017");  
//有密码
$manager = new MongoDB\Driver\Manager("mongodb://phpadmin:123456@localhost:27017/php");  
```

#### 超过响应时间,返回失败

```
$writeConcern = new MongoDB\Driver\WriteConcern(MongoDB\Driver\WriteConcern::MAJORITY, 1000);
```

#### 插入操作

```
连接数据库
$manager = new MongoDB\Driver\Manager("mongodb://phpadmin:123456@localhost:27017/php"); 

创建一个插入对象
$bulk = new MongoDB\Driver\BulkWrite;
$bulk->insert(['name'=>'刘备','age'=>12,'email'=>'liubei@sohu.com']);
$bulk->insert(['name'=>'关羽','age'=>22,'email'=>'guanyu@sohu.com']);
$bulk->insert(['name'=>'张飞','age'=>18,'email'=>'zhangfei@sohu.com']);

执行插入操作
$manager->executeBulkWrite('php.stu',$bulk);
```

#### 查询数据

```
//查询大于16岁的
$filter = ['age'=>['$gt'=>16]];

//不显示_id,按照age正序排列
$options = [
			'projection'=>['_id'=>0],
			'sort'=>['age'=>1],
];

//创建一个查询对象
$query = new MongoDB\Driver\Query($filter,$options);

//执行查询
$data = $manager->executeQuery('php.stu',$query);

//循环才能打印值
echo '<pre>';
foreach($data as $v){
  print_r($v);
}
echo '</pre>';
```

#### 更新数据

```
创建写入对象
$bulk = new MongoDB\Driver\BulkWrite;

更新数据
$bulk->update(
  ['age'=>12],
  ['$set'=>['name'=>'刘贝贝','email'=> 'liubeibei@sohu.com']],
  ['multi'=>false,'upsert'=>false]
);

响应超时返回失败
$writeConcern =new 
MongoDB\Driver\WriteConcern(MongoDB\Driver\WriteConcern::MAJORITY,1000);

执行更新
$result = $manager->executeBulkWrite('php.stu',$bulk,$writeConcern);
```

#### 删除数据

```
创建写入对象
$bulk = new MongoDB\Driver\BulkWrite;

删除数据(限制一条)
$bulk->delete(['age'=>22],['limit'=>1]);

响应超时返回失败
$writeConcern =new MongoDB\Driver\WriteConcern(MongoDB\Driver\WriteConcern::MAJORITY,1000);

执行删除
$result = $manager->executeBulkWrite('php.stu',$bulk,$writeConcern);
```

