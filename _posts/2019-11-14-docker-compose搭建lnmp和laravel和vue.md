# Docker-Compose搭建lnmp

[toc]

### 下载Docker-Compose

```
sudo curl -L "https://github.com/docker/compose/releases/download/1.24.1/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
```

### 修改权限

```
sudo chmod +x /usr/local/bin/docker-compose
```

### LNMP环境

+ nginx
+ php-fpm (7.3 - 7.2 - 7.1 - 5.6)
+ mysql (8.0 - 5.7 - 5.6)
+ mongo
+ redis (5.0 - 4.0)
+ memcached (1.5.16 - 1.5 - 1)

其中:

```
php-fpm 默认是 7.2 版本，如需使用其它版本，配置 `.env` 文件中 `PHP_VERSION` 即可；
mysql 默认是 5.7 版本，如需使用其它版本，配置 `.env` 文件中 `MYSQL_VERSION` 即可；
```

### 下载镜像

```
$ git clone https://github.com/yanlongma/docker-lnmp.git
```

### 进入docker-lnmp目录

```
cd docker-lnmp
cp env-template .env 复制.env文件
```

### 运行nginx

```
docker-compose up -d nginx
```

```
nginx 默认会启动 php-fpm 和 mysql 服务，如需启动其它服务请手动添加，
可选服务有 mongo、redis、memcached。
启动成功后，在 docker-lnmp 同级目录新建 phpinfo.php 文件，
浏览器访问 http://localhost/phpinfo.php，则可看到 phpinfo() 相关信息。
```

### 关闭服务

```
docker-compose down
```

### 构建服务

```
docker-compose build php-fpm
```

### 配置laravel项目

1. 修改.env 文件 

   ```
   修改path路径到自己想要的位置,也可以不修改
   ```

2. 修改后重启容器

3. 修改laravel.conf

   ```
   cp laravel.conf  shopapi.conf  新的名字和虚拟域名一致
   ```

   ```
   server_name    shopapi.com;							  //虚拟域名
   root            /var/www/api/public/;      				//这里的/var/www/对应的是 .env的path路径
   ```

4. 添加虚拟域名

   ```
   vim /etc/hosts 
   
   127.0.0.1       shopapi.com
   ```

5. 修改laravel项目中的.env文件

   ```
   DB_CONNECTION=mysql
   DB_HOST=mysql      //把地址改成mysql
   DB_PORT=3306
   DB_DATABASE=shop
   DB_USERNAME=root
   DB_PASSWORD=123456
   ```

6. php  artisan 命令只能在容器内有效

7. 进入php-fpm容器

   ```
   docker exec -it 容器id  /bin/bash
   ```

8. 进入laravel项目

   ```
   cd api 
   ```

9. 使用php artisan 命令

   ```
   php artisan migrate ;
   ```

### 配置vue



1. 编译已经写好的vue文件

   ```
   npm run build
   ```

2. 修改laravel.conf

   ```
   cp laravel.conf  shopvue.conf  新的名字和虚拟域名一致
   vim shopvue.conf 
   ```

   ```
   server_name    shopapi.com;							  //虚拟域名
   root            /var/www/api/public/;      				//这里的/var/www/对应的是 .env的path路径
   ```

3. 添加虚拟域名

   ```
   vim /etc/hosts 
   
   127.0.0.1       shopvue.com
   ```

