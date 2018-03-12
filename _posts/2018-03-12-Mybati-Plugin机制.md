---
layout:     post
title:      "Mybatis Plugin"
subtitle:   " \" Mybatis Plugin \""
date:       2018-03-12 15:19:00
author:     "WQ"
header-img: "img/blogImg/2018-03-12.jpg"
catalog: true
tags:
    - Mybatis
---

# Mybatis中拦截器

拦截器的初始化配置使用xml的方式，xml解析是在类`XMLConfigBuilder`中完成,然后将生产的`InterceptorChain`放到`Configuration`类当中。

在mybatis中共有四处定义了可以使用拦截器的地方：<br>
* ParameterHandler
* ResultSetHandler
* StatementHandler
* Executor

上面的4个类是非常重要的类，对于其执行流程不熟悉的同学可以参考下这位同学的流程图。![参考](http://img.blog.csdn.net/20141028140852531?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvbHVhbmxvdWlz/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)



首先几个辅助类：
* Interceptor：由于使用的是JDK的代理机制，所以自定义的拦截器必须实现该接口。
* InterceptorChain：用于存放xml解析出来的拦截器实例，从名字就可以看出来这也是调用类。上面的4个类就是使用该方法进行拦截器链的调用。同时需要注意这个链的构造形式。
* PluginException：自定义异常没啥说的。
* Invocation：自定义插件时获取的外部参数，该类包含了三个参数target,method，args也不需要解释
* Intercepts：注解，凡是自定义的拦截器必须有这个注解，参数Signature注解
* Signature：注解：三个参数，看下面的类描述。


```java
public class InterceptorChain {

  private final List<Interceptor> interceptors = new ArrayList<Interceptor>();

  /**
   * 最后添加的拦截器，最先执行，进行包装之后的类,虽然在插件的配置中有指定类和方法的位置，但是因为是层层包装，所以造成了生成多层动态代理，会影响一定的性能
   * @param target
   * @return
   */
  public Object pluginAll(Object target) {
    for (Interceptor interceptor : interceptors) {
      target = interceptor.plugin(target);
    }
    return target;
  }

  public void addInterceptor(Interceptor interceptor) {
    interceptors.add(interceptor);
  }
  
  public List<Interceptor> getInterceptors() {
    return Collections.unmodifiableList(interceptors);
  }

}
```

拦截器链的构造使用的是for，也就是说这方法调用时和我们在xml中配置的顺序是相反的。同时要注意到代理对象的生成是在插件中实现的，由此可见类的调用过程在构造的时候已经确定了。

```java
@Documented
@Retention(RetentionPolicy.RUNTIME)
@Target({})
public @interface Signature {
  Class<?> type();//指定拦截器拦截的接口

  String method();//指定方法

  Class<?>[] args();//方法的参数类型参数类型
}
```

核心类Plugin：

```java

/**
 * 使用的是jdk代理，所以只能代理接口
 * @author Clinton Begin
 */
public class Plugin implements InvocationHandler {

  private final Object target;
  private final Interceptor interceptor;
  private final Map<Class<?>, Set<Method>> signatureMap;

  private Plugin(Object target, Interceptor interceptor, Map<Class<?>, Set<Method>> signatureMap) {
    this.target = target;
    this.interceptor = interceptor;
    this.signatureMap = signatureMap;
  }

  /**
   * 代理方法
   * @param target
   * @param interceptor
   * @return
   */
  public static Object wrap(Object target, Interceptor interceptor) {
    //获取类（接口）+方法
    Map<Class<?>, Set<Method>> signatureMap = getSignatureMap(interceptor);
    Class<?> type = target.getClass();
    //target中包的signatureMap的类
    Class<?>[] interfaces = getAllInterfaces(type, signatureMap);
    //如果存在需要拦截的接口，则构造jdk代理
    if (interfaces.length > 0) {
        // 此处代理的是Plugin
      return Proxy.newProxyInstance(
          type.getClassLoader(),
          interfaces,
          new Plugin(target, interceptor, signatureMap));
    }
    return target;
  }

  @Override
  public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
    try {
      Set<Method> methods = signatureMap.get(method.getDeclaringClass());
      
      // 下面的是重点
      if (methods != null && methods.contains(method)) {
        //调用插件的方法
        return interceptor.intercept(new Invocation(target, method, args));
      }
      return method.invoke(target, args);
    } catch (Exception e) {
      throw ExceptionUtil.unwrapThrowable(e);
    }
  }

  /**
   * 获取方法标签
   * @param interceptor
   * @return
   */
  private static Map<Class<?>, Set<Method>> getSignatureMap(Interceptor interceptor) {
    Intercepts interceptsAnnotation = interceptor.getClass().getAnnotation(Intercepts.class);
    // issue #251
    if (interceptsAnnotation == null) {
      throw new PluginException("No @Intercepts annotation was found in interceptor " + interceptor.getClass().getName());      
    }
    Signature[] sigs = interceptsAnnotation.value();
    Map<Class<?>, Set<Method>> signatureMap = new HashMap<Class<?>, Set<Method>>();
    for (Signature sig : sigs) {
      Set<Method> methods = signatureMap.get(sig.type());
      if (methods == null) {
        methods = new HashSet<Method>();
        signatureMap.put(sig.type(), methods);
      }
      try {
        Method method = sig.type().getMethod(sig.method(), sig.args());
        methods.add(method);
      } catch (NoSuchMethodException e) {
        throw new PluginException("Could not find method on " + sig.type() + " named " + sig.method() + ". Cause: " + e, e);
      }
    }
    return signatureMap;
  }

  /**
   * 获取type类的接口中包含在signatureMap中的接口
   * @param type
   * @param signatureMap
   * @return
   */
  private static Class<?>[] getAllInterfaces(Class<?> type, Map<Class<?>, Set<Method>> signatureMap) {
    Set<Class<?>> interfaces = new HashSet<Class<?>>();
    while (type != null) {
      for (Class<?> c : type.getInterfaces()) {
        if (signatureMap.containsKey(c)) {
          interfaces.add(c);
        }
      }
      type = type.getSuperclass();
    }
    return interfaces.toArray(new Class<?>[interfaces.size()]);
  }

}
```

在mybatis插件机制中，最需要注意的是，*代理所代理的类是Plugin而不是自定插件*，这也是最让人迷糊的地方。

该类实现InvocationHandler接口，在invoke方法中判断被调用的方法是否是拦截器中指定的方法，如果是就调用插件中的intercept方法，否则就直接调用类方法（类有可能还是代理类）。
同时注意到该类的构造器是私有的，所以这个类真正所暴露出的方法只有`wrap()`，该方法是生成代理对象的默认实现，当然自己也是可以自定义的。




