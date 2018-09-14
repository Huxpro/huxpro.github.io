# Java Cache

## JSR-107

Maven snippet

```xml
<dependency>
  <groupId>javax.cache</groupId>
  <artifactId>cache-api</artifactId>
  <version>1.0.0</version>
</dependency>
```

这个规范还没有正式的被纳入J2EE体现，现处于active状态（估计会出现在J2EE 8中）。

缓存框架：

1. caffeine
2. guava cache
3. spring cache
4. ehcache

## [Spring Cache](https://docs.spring.io/spring/docs/5.0.9.RELEASE/spring-framework-reference/integration.html#cache)

在spring-context中有单独对cache的支持，在4.1版本之后兼容JSR-107，默认提供了对caffeine，jcache，ehcache的支持（spring-context-support），在之前的版本中是直接支持guava-cache的，但是现在的版本已经删除了，因为添加了对caffeine的支持，而caffeine本身就是基于guava-cache的，因此建议直接使用caffeine替代guava-cache。

在spring中默认提供使用的concurrentHashMap作为缓存容器。对spring缓存框架拓展只需提供两个类，Cache和CacheManager ， 具体的实现细节不展开叙述！

## [Guava Cache](https://github.com/google/guava/wiki/CachesExplained)

其和java的ConcurrentHashMap最大的不同是java的版本缓存的数据必须手动删除，而guava的cache可以指定过期策略，还可以在没有数据时指定加载策略。官方的文档很值得学习。

## [Caffeine](https://github.com/ben-manes/caffeine)

Maven snippet

```xml
<dependency>
  <groupId>com.github.ben-manes.caffeine</groupId>
  <artifactId>caffeine</artifactId>
  <version>2.6.2</version>
</dependency>
```

该框架基于guava-cache所以其使用的api基本和guava的一致

## [Ehcache](https://github.com/ehcache/ehcache3)

Maven snippet

```xml
<dependency>
  <groupId>org.ehcache</groupId>
  <artifactId>ehcache</artifactId>
  <version>3.5.2</version>
</dependency>
```

使用方式有两种，一种是通过代码的方式进行配置，另外是通过xml的方法（很显然xml的方式更加的简介方便），具体使用可以参考[官方demo](https://github.com/ehcache/ehcache3-samples)。

## 结论

参考caffeine的[基准测试](https://github.com/ben-manes/caffeine/wiki/Ehcache),本地缓存还是推荐使用caffeine。