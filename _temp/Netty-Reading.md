# netty笔记

## 核心组件

1. channel：表示一个连接，如Socket，有多种不同的io，如nio，oio，epoll，kqueue

1. channelHandler：channel的处理器

1. channelFuture：异步通知

1. EventLoop：事件循环器，相当于一个thread，一个EventLoop可以被分配多个channel

1. EventLoopGroup：事件循环器组，类似于线程池，包含多个EventLoop

1. channelPipeline：是ChannelHandler链的容器，包含双向链表

1. channelHandlerContext：用于channelPipeline和channelHandler交互，类似于一个中间代理，表示一种关系

1. ByteBuf的三种类型：heapBuffer（堆缓冲区），directBuffer（直接缓冲区），compositeBuffer（复合缓冲区）

1. Promise和Future：

   这里的Future是继承于JDK的Future，由于JDK版本的IsDone()在正常终止、抛出异常、用户取消都会返回true，而netty需要分开处理，所以自己实现了一个Future。

   Future只有get所以是一个不可变类，如果想要变化，要使用Promise（DefaultPromise是netty提供的默认实现）

## 问题

###  1. handler执行顺序

channelPipeline中handler链的调用方式是手动调用，即ctx.fireChannelXX方法

正常情况下（先执行方法中的代码，后执行ctx.fireChannelXX方法）

* inHandler按照注册时的先后顺序执行
* outHandler按照注册时的先后顺序逆序执行

但是如果先执行ctx.fireChannelXX方法后执行代码的话，那么顺序就相反了。netty提供的很多handler都是按照默认顺序执行的。

###  2. write时的flush问题

由于Netty在socket和channel之间添加了一个channelOutboundBuffer（参考AbstractChannel的write方法），所以在调用 channel.flush时才会真正的向socket写出(AbstractChannel.flush()==>doWrite())。如果控制不好write和flush速率，很容易造成数据堆积。并且由于这个buffer是无界队列，例如AbstractNioByteChannel 在写入的数据时，如果是ByteBuf类型，则将其转换为DirectByteBuf的实现 ，使用gc之外的堆内存，很容易造成内存泄漏。

对于同步的write，如果buffer满了则会阻塞直到超时或者有空间，异步write则立即返回。

### 3. channelOutboundBuffer中的数据何时减少

缓存数据的方式是使用单向Entry链表，当需要将数据写入到socket 的时候，将其放到unflushEntry当中，当写入成功之后清除。当然不会立即删除，因为tcp有重传机制，所以必须受到tcp的ack报文才能删除，如果迟迟没有受到这个报文，那么久有可能造成buffer的堆积，此时也就不能写数据了。netty使用isWritedable属性控制。ChunkedWriteHandler实现了复杂的状态控制，在其代码中使用isWritable判断的，所以当我们需要传输大文件时就可以使用这个handler。

### 4. ByteBuf

主要分类：

> PooledHeapByteBuf：池化的基于堆内存的缓冲区。
>
> PooledDirectByteBuf：池化的基于直接内存的缓冲区。
>
> PooledUnsafeDirectByteBuf：池化的基于Unsafe和直接内存实现的缓冲区。
>
> UnPooledHeapByteBuf：非池化的基于堆内存的缓冲区。
>
> UnPooledDirectByteBuf：非池化的基于直接内存的缓冲区。

Pooled方式使用 Recycler类进行对象管理，内部使用thread-local和stack（netty自己的实现，用的是queue）来实现，使用池化避免了对象的创建，重复利用池中的资源，如同线程池一样。

ByteBuf.discardReadBytes() 用来回收已经读取过的数据，但是这会导致内存复制，时间换空间的做法。

ByteBuf.clear()会重置读/写索引，这和上面的方法有本质的区别。

mark和reset方法，可以通过reset返回上次标记的索引位置。

创建ByteBuf的方式：

1. ByteBufAllocator接口创建
2. Unpooled 类的静态方法

和JDK的ByteBuffer对比：

NIO的ByteBuffer的缺点

1. 存储字节是使用的数据，在创建的时候必须指定大小，用起来很不灵活，存在数组越界的风险，如果大小不够，需要进行复制，效率较低。
2. 使用一个指针标记位置，读写模式的切换需要使用flip()和rewind()，使用很不方便也很容易出错。

Netty中的ByteBuf优点

1. 使用动态数组，和list类似的自动扩容
2. 读写索引分离

### 5. 在handler中读取

在使用ByteBuf.readBytes()时，readIndex会移动，所以如果想在下一个handler也读取数据的话，就不行了，如果想是实现这个效果，需要在第一个handler读取数据之前markReaderIndex()，读取之后再resetReaderIndex()一下就保留了原先数据的位置。

### 6. ServerBootStrap.init(channel)

该方法有个地方很是奇特：

```java
p.addLast(new ChannelInitializer<Channel>() {
            @Override
            public void initChannel(final Channel ch) throws Exception {
                final ChannelPipeline pipeline = ch.pipeline();
                ChannelHandler handler = config.handler();
                if (handler != null) {
                    pipeline.addLast(handler);
                }
			   // 不明白为什么不直接在pipeline中添加ServerBootStrapAcceptor
                // 当用户使用ChannelInitializer进行初始化时，有可能用户添加的handler会别添加到ServerBootstrapAcceptor之后
                // 通过跟踪代码，在DefaultChannelPipeline.addLast(...)中使用异步调用callHandlerAdded0(ctx),而这个方法中  ctx.handler().handlerAdded(ctx);这个handlerAdded()可以在ChannelInitializer中找到，所以如果这个add方法被延迟执行的话，那么就存在ServerBootstrapAcceptor先被添加。 目前不知道为什么在addLast中使用异步（延迟），但是最起码知道ServerBootstrapAcceptor不能直接添加到pipeline中,在https://github.com/netty/netty/commit/4638df20628a8987c8709f0f8e5f3679a914ce1a 这个例子里就是很好的解释
                //那么使用execute一定能保证只会被添加到最后吗？
                // 上面提到addLast方法是异步的，是用的是queue存放task，因此用户的task在queue的前面，因此保证了执行顺序
                ch.eventLoop().execute(new Runnable() {
                    @Override
                    public void run() {
                        //该handler主要作用是设置socket的属性
                        pipeline.addLast(new ServerBootstrapAcceptor(
                                ch, currentChildGroup, currentChildHandler, currentChildOptions, currentChildAttrs));
                    }
                });
            }
        });
```

### 7. bossGroup和workGroup交换任务

当bossGroup读取到io数据时，需要将其交给workgroup执行，而这个工作是在serverBootstrapAcceptor中完成的。该类是一个inHandler，在channelRead方法中，将childHandler

```java
public void channelRead(ChannelHandlerContext ctx, Object msg) {
            final Channel child = (Channel) msg;
		   // 向channel中添加自定义的handler
            child.pipeline().addLast(childHandler);
		   // 设置参数
            setChannelOptions(child, childOptions, logger);

            for (Entry<AttributeKey<?>, Object> e: childAttrs) {
                child.attr((AttributeKey<Object>) e.getKey()).set(e.getValue());
            }

            try {
                // 这里的register方法很重要，追踪代码可以再AbstractChannel.register0()方法中看到doRegister()，该方法主要是绑定selector和channel。
                // 在bossGroup使用异步方式绑定端口的时候，就会执行startThread()，该方法会只执行EventLoop的run(),该run是使用selector选择事件
                // 所以当selector和channel绑定完成之后，遇到读的时间就会触发Unsafe.read方法，最终触发pipeline.fireChannelRead()
                childGroup.register(child).addListener(new ChannelFutureListener() {
                    @Override
                    public void operationComplete(ChannelFuture future) throws Exception {
                        if (!future.isSuccess()) {
                            forceClose(child, future.cause());
                        }
                    }
                });
            } catch (Throwable t) {
                forceClose(child, t);
            }
        }
```

### 8. JDK 1.6版本中NIO selector CPU 100% bug

出现原因：在while(true)循环中调用selector.select();该方法在事件为空的情况下也返回，从而导致一直的while循环，select()应该是阻塞的才对。在netty中是通过计数器，连续循环的次数，默认阀值为512，然后重建selector来避免的。

### 9. FastThreadLocal

首先JDK的ThreadLocal，每个Thread都有一个属性`ThreadLocal.ThreadLocalMap`，当创建ThreadLocal并调用set()，不存在则会创建一个ThreadLocalMap，并设置到Thread当中（也就是ThreadLocalMap设置到Thread当中，所以threadLocal和线程绑定的），存在的第一个疑问是，为什么要用map存，明明一个ThreadLocal只能存放一个值？

原因是，一个线程中可以new多个ThreadLocal，所以ThreadLocalMap的key是ThreadLocal。

在Threadlocal中使用的ThreadLocalMap存放的Entry实现了WeakReference，这是为了解决map中key的内存泄漏（ThreadLocal没有提供remove）。 key是ThreadLocal，令ThreadLocal=null并不能被gc回收，因为该ThreadLocal还在Map中做为key，但是设为null，解除了对象的强引用，只有弱引用了，在下次gc时会被清除，防止了内存泄漏。 

FastThreadLocal相比ThreadLocal快的原因，使用InternalThreadLocalMap ，而该类使用数组作为数据结构，这个数组用来存储跟同一个线程关联的多个FastThreadLocal的值 ，在创建FastThreadLocal时就确定了index，因此在读取的时候发生随机存取，速度很快。但是这也造成了一定的空间浪费，因为是数组，其初始化容量为32，每次增加都是*2。

## socks协议

`shadowsocks`的数据传输是建立在`SOCKS5`协议之上的,`SOCKS5 `是 TCP/IP 层面的网络代理协议 ,只是其在这协议之上进行了加密。

详细的可以参考[SOCKS5 协议规范 rfc1928](http://www.ietf.org/rfc/rfc1928.txt)

### 建立连接

#### 客户端到服务端

| VER  | NMETHODS | METHODS |
| ---- | -------- | ------- |
| 1    | 1        | 1       |

其中各个字段的含义如下：

- `VER`：代表 SOCKS 的版本，SOCKS5 默认为`0x05`，其固定长度为1个字节；
- `NMETHODS`：表示第三个字段METHODS的长度，它的长度也是1个字节；
- `METHODS`：表示客户端支持的验证方式，可以有多种，他的长度是1-255个字节。 

目前支持的验证方式共有(`Socks5AuthMethod`支持的，默认有6种)：

- `0x00`：NO AUTHENTICATION REQUIRED（不需要验证）
- `0x01`：GSSAPI
- `0x02`：USERNAME/PASSWORD（用户名密码）
- `0xFF`：NO ACCEPTABLE METHODS（都不支持，没法连接了）

#### 服务端响应连接

服务端收到客户端的验证信息之后，就要回应客户端，服务端需要客户端提供哪种验证方式的信息。服务端回应的包格式如下： 

| VER  | METHOD |
| ---- | ------ |
| 1    | 1      |

其中各个字段的含义如下：

- `VER`：代表 SOCKS 的版本，SOCKS5 默认为`0x05`，其固定长度为1个字节；
- `METHOD`：代表服务端需要客户端按此验证方式提供的验证信息，其值长度为1个字节，可为上面六种验证方式之一。

### 和目标服务建立连接

也就是当和代理服务器建立连接之后，就可以请求目标主机了，例如google：

| VER  | CMD  | RSV  | ATYP | DST.ADDR | DST.PORT |
| ---- | ---- | ---- | ---- | -------- | -------- |
| 1    | 1    | 1    | 1    | Variable | 2        |

各个字段的含义如下：

- `VER`：代表 SOCKS 协议的版本，SOCKS 默认为0x05，其值长度为1个字节；
- `CMD`：代表客户端请求的类型，值长度也是1个字节，有三种类型；
  - `CONNECT`： `0x01`；
  - `BIND`： `0x02`；
  - `UDP`： ASSOCIATE `0x03`；
- `RSV`：保留字`0x00`，值长度为1个字节；
- `ATYP`：代表请求的远程服务器地址类型，值长度1个字节，有三种类型；
  - `IPV4`： address: `0x01`；
  - `DOMAINNAME`: `0x03`；
  - `IPV6`： address: `0x04`；
- `DST.ADDR`：代表远程服务器的地址，根据 `ATYP` 进行解析，值长度不定；
- `DST.PORT`：代表远程服务器的端口，要访问哪个端口的意思，值长度2个字节。