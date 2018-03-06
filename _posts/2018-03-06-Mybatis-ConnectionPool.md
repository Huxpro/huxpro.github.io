---
layout:     post
title:      "Mybatis ConnectionPool"
subtitle:   " \"Mybatis ConnectionPool源码解析\""
date:       2018-03-06 13:13:00
author:     "WQ"
header-img: "img/blogImg/2018-03-06.jpg"
catalog: true
tags:
    - Mybatis
---

# Mybatis数据源与连接池

在mybatis中默认的数据库连接池DataSource有三种，jndi,pooled,unpooled。

![数据库连接池目录](https://raw.githubusercontent.com/ted-wq-x/picture/master/src/%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_20180306090730.png)


接口

```java

public interface DataSourceFactory {

  void setProperties(Properties props);

  DataSource getDataSource();

}

```


## JNDI连接池

使用JNDI的方式进行数据源配置，然后从JndiDataSourceFactory中获取数据库对象，对于什么是JNDI自行百度。

## UnPooledDataSource

使用UnpooledDataSourceFactory获取UnPooledDataSource对象,在setProperties中使用反射添加参数。UnpooledDataSourceFactory类不是重点，那我们来看UnpooledDataSource：

```java

public class UnpooledDataSource implements DataSource {
  
  private ClassLoader driverClassLoader;
  private Properties driverProperties;
  private static Map<String, Driver> registeredDrivers = new ConcurrentHashMap<String, Driver>();

  private String driver;
  private String url;
  private String username;
  private String password;

  private Boolean autoCommit;
  private Integer defaultTransactionIsolationLevel;

  static {
      // 获取已经注册的数据库驱动
    Enumeration<Driver> drivers = DriverManager.getDrivers();
    while (drivers.hasMoreElements()) {
      Driver driver = drivers.nextElement();
      registeredDrivers.put(driver.getClass().getName(), driver);
    }
  }

   // 各种构造器省略，get/set也省略


  private Connection doGetConnection(String username, String password) throws SQLException {
    Properties props = new Properties();
    if (driverProperties != null) {
      props.putAll(driverProperties);
    }
    if (username != null) {
      props.setProperty("user", username);
    }
    if (password != null) {
      props.setProperty("password", password);
    }
    return doGetConnection(props);
  }

  // 注意每次调用getConnection方法都会重新创建连接
  private Connection doGetConnection(Properties properties) throws SQLException {
    initializeDriver();
    //使用驱动进行连接，这有很大部分都是jdk的东西
    Connection connection = DriverManager.getConnection(url, properties);
    // 设置默认属性
    configureConnection(connection);
    return connection;
  }

  /**
   * 注册驱动
   * @throws SQLException
   */
  private synchronized void initializeDriver() throws SQLException {
    if (!registeredDrivers.containsKey(driver)) {
      Class<?> driverType;
      try {
        if (driverClassLoader != null) {
          driverType = Class.forName(driver, true, driverClassLoader);
        } else {
          driverType = Resources.classForName(driver);
        }
        // DriverManager requires the driver to be loaded via the system ClassLoader.
        // http://www.kfu.com/~nsayer/Java/dyn-jdbc.html
        Driver driverInstance = (Driver)driverType.newInstance();
        DriverManager.registerDriver(new DriverProxy(driverInstance));
        registeredDrivers.put(driver, driverInstance);
      } catch (Exception e) {
        throw new SQLException("Error setting driver on UnpooledDataSource. Cause: " + e);
      }
    }
  }

  /**
   * 进行连接后的一些属性设置
   * @param conn
   * @throws SQLException
   */
  private void configureConnection(Connection conn) throws SQLException {
    if (autoCommit != null && autoCommit != conn.getAutoCommit()) {
      conn.setAutoCommit(autoCommit);
    }
    if (defaultTransactionIsolationLevel != null) {
      conn.setTransactionIsolation(defaultTransactionIsolationLevel);
    }
  }

  /**
   * 驱动代理，主要用于添加日志
   */
  private static class DriverProxy implements Driver {
   // 具体内容省略
  }

}

```

总结：从上述的代码中可以看到，我们每调用一次getConnection()方法，都会通过DriverManager.getConnection()返回新的java.sql.Connection实例。


## PooledDataSource

在PooledDataSourceFactory中是继承的UnpooledDataSourceFactory，但是DataSource是PooledDataSource，其他相同这也不是重点


```java

/**
 * mybatis内部的简单数据库连接池，额外的两个对象PoolState（存放连接状态及连接数据），PooledConnection（对jdkconnection得包装）
 * This is a simple, synchronous, thread-safe database connection pool.
 *
 * @author Clinton Begin
 */
public class PooledDataSource implements DataSource {

  private static final Log log = LogFactory.getLog(PooledDataSource.class);

  //存放池的状态，并且存放数据库连接，并使用该对象作为lock
  private final PoolState state = new PoolState(this);

  private final UnpooledDataSource dataSource;

  // OPTIONAL CONFIGURATION FIELDS
  //正在使用连接的数量
  protected int poolMaximumActiveConnections = 10;
  //空闲连接数
  protected int poolMaximumIdleConnections = 5;
  //在被强制返回之前,池中连接被检查的时间
  protected int poolMaximumCheckoutTime = 20000;

  protected int poolTimeToWait = 20000;
  //允许连接失败的次数
  protected int poolMaximumLocalBadConnectionTolerance = 3;
  protected String poolPingQuery = "NO PING QUERY SET";
  protected boolean poolPingEnabled;
  protected int poolPingConnectionsNotUsedFor;

  //通过hashcode，判断是哪个链接,assembleConnectionTypeCode方法
  private int expectedConnectionTypeCode;


    // 省略不重要的代码

  /*
   * 关闭所有的连接
   */
  public void forceCloseAll() {
    synchronized (state) {
      expectedConnectionTypeCode = assembleConnectionTypeCode(dataSource.getUrl(), dataSource.getUsername(), dataSource.getPassword());
      // 活动的连接
      for (int i = state.activeConnections.size(); i > 0; i--) {
        try {
          PooledConnection conn = state.activeConnections.remove(i - 1);
          // 设置连接状态
          conn.invalidate();

            // 去掉包装
          Connection realConn = conn.getRealConnection();
          if (!realConn.getAutoCommit()) {
              // 如果没有提交就回滚
            realConn.rollback();
          }
          realConn.close();
        } catch (Exception e) {
          // ignore
        }
      }

      // 空闲的连接
      for (int i = state.idleConnections.size(); i > 0; i--) {
        try {
          PooledConnection conn = state.idleConnections.remove(i - 1);
          conn.invalidate();

          Connection realConn = conn.getRealConnection();
          if (!realConn.getAutoCommit()) {
            realConn.rollback();
          }
          realConn.close();
        } catch (Exception e) {
          // ignore
        }
      }
    }
    if (log.isDebugEnabled()) {
      log.debug("PooledDataSource forcefully closed/removed all connections.");
    }
  }

 
  private int assembleConnectionTypeCode(String url, String username, String password) {
      // hashcode生成
    return ("" + url + username + password).hashCode();
  }


   /**
   * 删除连接，使用的是connection的close方法，通过反射进行调用该的
   */
  protected void pushConnection(PooledConnection conn) throws SQLException {

    synchronized (state) {
      state.activeConnections.remove(conn);
      //判断连接是否合法
      if (conn.isValid()) {
        if (state.idleConnections.size() < poolMaximumIdleConnections && conn.getConnectionTypeCode() == expectedConnectionTypeCode) {
          state.accumulatedCheckoutTime += conn.getCheckoutTime();
          if (!conn.getRealConnection().getAutoCommit()) {
            conn.getRealConnection().rollback();
          }
          //将连接放到池中，返回包装对象
          PooledConnection newConn = new PooledConnection(conn.getRealConnection(), this);
          state.idleConnections.add(newConn);
          newConn.setCreatedTimestamp(conn.getCreatedTimestamp());
          newConn.setLastUsedTimestamp(conn.getLastUsedTimestamp());
          //废除传入的连接
          conn.invalidate();
          if (log.isDebugEnabled()) {
            log.debug("Returned connection " + newConn.getRealHashCode() + " to pool.");
          }
          // 需要唤醒所有等待的线程
          state.notifyAll();
        } else {
          state.accumulatedCheckoutTime += conn.getCheckoutTime();
          if (!conn.getRealConnection().getAutoCommit()) {
            conn.getRealConnection().rollback();
          }
          conn.getRealConnection().close();
          if (log.isDebugEnabled()) {
            log.debug("Closed connection " + conn.getRealHashCode() + ".");
          }
          conn.invalidate();
        }
      } else {
        if (log.isDebugEnabled()) {
          log.debug("A bad connection (" + conn.getRealHashCode() + ") attempted to return to the pool, discarding connection.");
        }
        state.badConnectionCount++;
      }
    }
  }

   /**
   * 获取连接
   */
  private PooledConnection popConnection(String username, String password) throws SQLException {
    boolean countedWait = false;
    PooledConnection conn = null;
    long t = System.currentTimeMillis();
    int localBadConnectionCount = 0;

   // 最外面是while死循环，如果一直拿不到connection，则不断尝试,异常除外
    while (conn == null) {

      synchronized (state) {
        // 如果存在空闲连接直接获取
        if (!state.idleConnections.isEmpty()) {
          // Pool has available connection
          conn = state.idleConnections.remove(0);
          if (log.isDebugEnabled()) {
            log.debug("Checked out connection " + conn.getRealHashCode() + " from pool.");
          }
        } else {
          // 没有可用的连接并且正在使用的连接数小于最大连接数
          if (state.activeConnections.size() < poolMaximumActiveConnections) {
            // Can create new connection
            conn = new PooledConnection(dataSource.getConnection(), this);
            if (log.isDebugEnabled()) {
              log.debug("Created connection " + conn.getRealHashCode() + ".");
            }
          } else {
            // 无法创建新的连接
            // 取得activeConnections列表的第一个（最老的）
            PooledConnection oldestActiveConnection = state.activeConnections.get(0);
            long longestCheckoutTime = oldestActiveConnection.getCheckoutTime();
            //如果checkout时间过长，则这个connection标记为overdue（过期）
            if (longestCheckoutTime > poolMaximumCheckoutTime) {
              // Can claim overdue connection
              state.claimedOverdueConnectionCount++;
              state.accumulatedCheckoutTimeOfOverdueConnections += longestCheckoutTime;
              state.accumulatedCheckoutTime += longestCheckoutTime;
              state.activeConnections.remove(oldestActiveConnection);
              if (!oldestActiveConnection.getRealConnection().getAutoCommit()) {
                try {
                  oldestActiveConnection.getRealConnection().rollback();
                } catch (SQLException e) {
                
                  log.debug("Bad connection. Could not roll back");
                }  
              }
              //删掉最老的连接，然后再new一个新连接
              conn = new PooledConnection(oldestActiveConnection.getRealConnection(), this);
              conn.setCreatedTimestamp(oldestActiveConnection.getCreatedTimestamp());
              conn.setLastUsedTimestamp(oldestActiveConnection.getLastUsedTimestamp());
              oldestActiveConnection.invalidate();
              if (log.isDebugEnabled()) {
                log.debug("Claimed overdue connection " + conn.getRealHashCode() + ".");
              }
            } else {
              // 最老的也没有过期，那就得等了哦
              try {
                if (!countedWait) {
                  //统计信息：等待+1,只加一次
                  state.hadToWaitCount++;
                  countedWait = true;
                }
                if (log.isDebugEnabled()) {
                  log.debug("Waiting as long as " + poolTimeToWait + " milliseconds for connection.");
                }
                long wt = System.currentTimeMillis();
                //睡一会儿吧
                state.wait(poolTimeToWait);
                state.accumulatedWaitTime += System.currentTimeMillis() - wt;
              } catch (InterruptedException e) {
                break;
              }
            }
          }
        }


        if (conn != null) {
          // ping to server and check the connection is valid or not
          if (conn.isValid()) {
            if (!conn.getRealConnection().getAutoCommit()) {
              conn.getRealConnection().rollback();
            }
            conn.setConnectionTypeCode(assembleConnectionTypeCode(dataSource.getUrl(), username, password));
            conn.setCheckoutTimestamp(System.currentTimeMillis());
            conn.setLastUsedTimestamp(System.currentTimeMillis());
            // 将连接添加到正在使用的list当中
            state.activeConnections.add(conn);
            state.requestCount++;
            state.accumulatedRequestTime += System.currentTimeMillis() - t;
          } else {
            if (log.isDebugEnabled()) {
              log.debug("A bad connection (" + conn.getRealHashCode() + ") was returned from the pool, getting another connection.");
            }
            state.badConnectionCount++;
            localBadConnectionCount++;
            conn = null;
            if (localBadConnectionCount > (poolMaximumIdleConnections + poolMaximumLocalBadConnectionTolerance)) {
              if (log.isDebugEnabled()) {
                log.debug("PooledDataSource: Could not get a good connection to the database.");
              }
              throw new SQLException("PooledDataSource: Could not get a good connection to the database.");
            }
          }
        }


      }

    }

    if (conn == null) {
      //出异常
      if (log.isDebugEnabled()) {
        log.debug("PooledDataSource: Unknown severe error condition.  The connection pool returned a null connection.");
      }
      throw new SQLException("PooledDataSource: Unknown severe error condition.  The connection pool returned a null connection.");
    }

    return conn;
  }

  public boolean isValid() {
    // 校验的时机
    return valid && realConnection != null && dataSource.pingConnection(this);
  }


  /*
   * Method to check to see if a connection is still usable
   * 检查连接是否可用
   * @param conn - the connection to check
   * @return True if the connection is still usable
   */
  protected boolean pingConnection(PooledConnection conn) {
    boolean result = true;

    // 判断连接是够关闭
    try {
      result = !conn.getRealConnection().isClosed();
    } catch (SQLException e) {
      if (log.isDebugEnabled()) {
        log.debug("Connection " + conn.getRealHashCode() + " is BAD: " + e.getMessage());
      }
      result = false;
    }

    // 为true
    if (result) {
      if (poolPingEnabled) {
        if (poolPingConnectionsNotUsedFor >= 0 && conn.getTimeElapsedSinceLastUse() > poolPingConnectionsNotUsedFor) {
          try {
            if (log.isDebugEnabled()) {
              log.debug("Testing connection " + conn.getRealHashCode() + " ...");
            }
            // 执行请求
            Connection realConn = conn.getRealConnection();
            Statement statement = realConn.createStatement();
            ResultSet rs = statement.executeQuery(poolPingQuery);
            rs.close();
            statement.close();
            if (!realConn.getAutoCommit()) {
              realConn.rollback();
            }
            result = true;
            if (log.isDebugEnabled()) {
              log.debug("Connection " + conn.getRealHashCode() + " is GOOD!");
            }
          } catch (Exception e) {
            log.warn("Execution of ping query '" + poolPingQuery + "' failed: " + e.getMessage());
            try {
              conn.getRealConnection().close();
            } catch (Exception e2) {
              //ignore
            }
            result = false;
            if (log.isDebugEnabled()) {
              log.debug("Connection " + conn.getRealHashCode() + " is BAD: " + e.getMessage());
            }
          }
        }
      }
    }
    return result;
  }

  /*
   * Unwraps a pooled connection to get to the 'real' connection
   * 还原被包装的connection
   *
   * @param conn - the pooled connection to unwrap
   * @return The 'real' connection
   */
  public static Connection unwrapConnection(Connection conn) {
    if (Proxy.isProxyClass(conn.getClass())) {
      InvocationHandler handler = Proxy.getInvocationHandler(conn);
      if (handler instanceof PooledConnection) {
        return ((PooledConnection) handler).getRealConnection();
      }
    }
    return conn;
  }

  /**
   * 垃圾回收钱的清理
   * @throws Throwable
   */
  protected void finalize() throws Throwable {
      // 该类卸载的时候，需要主动关闭所有的连接
    forceCloseAll();
    super.finalize();
  }



}
```

通过上面的代码，可以看到主要的几个方法为pingConnection,popConnection,pushConnection,forceCloseAll,对于pingConnection方法，其调用时机在pushConnection和popConnection时进行状态校验。但是请注意这里返回的connection是代理之后的connection也就是PooledConnection。连接池是存放在PoolState当中，使用的数据结构为两个ArrayList。

下面是PooledConnection的主要方法

```java

 @Override
  public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
    String methodName = method.getName();
    // 当调用connection的close方法时，调用poolledDataSource的pushConnection方法
    if (CLOSE.hashCode() == methodName.hashCode() && CLOSE.equals(methodName)) {
      dataSource.pushConnection(this);
      return null;
    } else {
      try {
        if (!Object.class.equals(method.getDeclaringClass())) {
          // issue #579 toString() should never fail
          // throw an SQLException instead of a Runtime
          checkConnection();
        }
        return method.invoke(realConnection, args);
      } catch (Throwable t) {
        throw ExceptionUtil.unwrapThrowable(t);
      }
    }
  }
```

![popConnection方法流程图](https://raw.githubusercontent.com/ted-wq-x/picture/master/src/%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_20180306132352.png)

虽然是一个简单的连接池设计，但是依然是值得学习的！