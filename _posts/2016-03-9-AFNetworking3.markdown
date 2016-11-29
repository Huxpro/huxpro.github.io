## 别说你会AFNetworking3.0

### 1. 为什么要使用NSURLSession而不是NSURLConnection
### 2. 为什么要用共享的SessionManager/Session，而不是每次都启动一个新的

---
### 为什么要选择NSURLSession
根据2015的WWDC Session711，我们知道iOS9+，NSURLSession开始正式支持HTTP /2，也就意味着你的网络连接速度也可以有如上图那样的提升。

更人性化更优秀的API设计，HTTP /2的支持，这是否能成为你使用NSURLSession的理由？至少它们成为了说服我的理由。

### 为什么要尽量共享Session，而不是每次新建Session
* 共享的Session将会复用TCP的连接，而每次都新建Session的操作将导致每次的网络请求都开启一个TCP的三次握手。
* 同样都是两次HTTP请求，共享Session的代码在第二次网络请求时少了TCP的三次握手的过程。即加速了整个网络的请求时间。
* 默认配置下，iOS对于同一个IP服务器的并发最大为4，OS X为6。而如果你没有使用共享的Session，则可能会超过这个数。
