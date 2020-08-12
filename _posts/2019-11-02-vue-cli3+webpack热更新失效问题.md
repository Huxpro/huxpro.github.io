# vue-cli3+webpack热更新失效问题

## 1、起因

A项目中遇到问题，热更新失效，百思不得其解，查询搜索vuecli3热更新失效、vue histroy 模式热更新失效，网上看到不少方法，npm重新安装，不要用淘宝镜像cnpm安装；npm安装yarn,再用yarn重新install,yarn serve启动，在npm run serve 启动等方法都不好用。github有类似问题https://github.com/vuejs/vue-cli/issues/1559，有次得到启发可能版本不同导致。

对比热更新正常的项目B的几个配置文件，重点查看package.json文件，发现有webpack版本不同。

## 2、解决方案

初步断定是webpack版本原因，搜索关键词就变成了webpack4.0热更新失效，webpack4.0热更新开启，由此查询查询尝试。原因大概是webpack4.0需要手动配置开启热更新，默认没有开启

### 2.1、局部安装依赖webpack-dev-server

`npm install --save-dev webpack-dev-server`

### 2.2、在webpack.config.js配置相关参数

增加devServer的配置

```js
const path = require('path');

module.exports = {
    entry: './index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'youname.js'
    },
    plugins: [
    ],
    devServer: {
        contentBase: path.join(__dirname, 'page'),
        compress: true,
        port: 8080
    }
};
```

### 2.3、在package.json中的scripts对象添加命令，开启本地服务

"serve": "webpack-dev-server --open"
 如果server有其他命令执行，在后面增加这一句命令就可以了

`"serve": "vue-cli-service serve && webpack-dev-server --open",`

### 2.4、vue.config.js配置，开启热更新

```js
 devServer: {
        disableHostCheck: true, // webpack4.0 开启热更新
 }
```

### 2.5、最后执行npm run server即可，热更新失效问题解决