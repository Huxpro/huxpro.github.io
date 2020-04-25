---
title: "session和cookie、代理、selenium自动化"
subtitle: "爬虫「03」"
layout: post
author: "echisenyang"
header-style: text
hidden: true
catalog: true
tags:
  - 爬虫
---



## session和cookie

- **静态网页**
  - 静态网页就是我们上一篇写的那种 html 页面，后缀为 `.html` 的这种文件，直接部署到或者是放到某个 web 容器上，就可以在浏览器通过链接直接访问到了。比如个人通过github pages搭建blog，就是静态网页的代表，这种网页的内容是通过纯粹的 HTML 代码来书写，包括一些资源文件：图片、视频等内容的引入都是使用 HTML 标签来完成的。
  - 它的好处当然是加载速度快，编写简单，访问的时候对 web 容器基本上不会产生什么压力。但是缺点也很明显，可维护性比较差，不能根据参数动态的显示内容等等。有需求就会有发展么，这时动态网页就应运而生了
- **动态网页**
  - 大家常用的某宝、某东、拼夕夕等网站都是由动态网页组成的。
  - 动态网页可以解析 URL 中的参数，或者是关联数据库中的数据，显示不同的网页内容。现在各位同学访问的网站大多数都是动态网站，它们不再简简单单是由 HTML 堆砌而成，可能是由 JSP 、 PHP 等语言编写的，当然，现在很多由前端框架编写而成的网页小编这里也归属为动态网页。
  - 说到动态网页，可能使用频率最高的一个功能是登录，像各种电商类网站，肯定是登录了以后才能下单买东西。那么，问题来了，后面的服务端是如何知道当前这个人已经登录了呢？
- **HTTP1.0**的特点是无状态无链接的
  - 无状态就是指 HTTP 协议对于请求的发送处理是没有记忆功能的，也就是说每次 HTTP 请求到达服务端，服务端都不知道当前的客户端（浏览器）到底是一个什么状态。**客户端向服务端发送请求后，服务端处理这个请求，然后将内容响应回客户端，完成一次交互，这个过程是完全相互独立的，服务端不会记录前后的状态变化，也就是缺少状态记录**。这就产生了上面的问题，服务端如何知道当前在浏览器面前操作的这个人是谁？其实，在用户做登录操作的时候，服务端会下发一个类似于 token 凭证的东西返回至客户端（浏览器），有了这个凭证，才能保持登录状态。那么这个凭证是什么？
- **session和cookies**
  -  Session 是会话的意思，**会话是产生在服务端的，用来保存当前用户的会话信息**，而 **Cookies 是保存在客户端（浏览器）**，有了 Cookie 以后，客户端（浏览器）再次访问服务端的时候，会将这个 Cookie 带上，这时，服务端可以通过 Cookie 来识别本次请求到底是谁在访问。可以简单理解为 Cookies 中保存了登录凭证，我们只要持有这个凭证，就可以在服务端保持一个登录状态。
  - 在爬虫中，有时候遇到需要登录才能访问的网页，只需要在登录后获取了 Cookies ，在下次访问的时候将登录后获取到的 Cookies 放在请求头中，这时，服务端就会认为我们的爬虫是一个正常登录用户。

### 模拟登录163

```python
import time
from selenium import webdriver
from selenium.webdriver.common.by import By


"""
使用selenium进行模拟登陆
1.初始化ChromDriver
2.打开163登陆页面
3.找到用户名的输入框，输入用户名
4.找到密码框，输入密码
5.提交用户信息
"""
name = '*'
passwd = '*'
driver = webdriver.Chrome('../chromedriver')
driver.get('https://mail.163.com/')
# 将窗口调整最大
driver.maximize_window()
# 休息5s
time.sleep(5)
current_window_1 = driver.current_window_handle
print(current_window_1)

button = driver.find_element_by_id('lbNormal')
button.click()
driver.switch_to.frame(driver.find_element_by_xpath("//iframe[starts-with(@id, 'x-URS-iframe')]"))

email = driver.find_element_by_name('email')
#email = driver.find_element_by_xpath('//input[@name="email"]')
email.send_keys(name)
password = driver.find_element_by_name('password')
#password = driver.find_element_by_xpath("//input[@name='password']")
password.send_keys(passwd)
submit = driver.find_element_by_id("dologin")
time.sleep(15)
submit.click()
time.sleep(10)
print(driver.page_source)
driver.quit()
```

![J0b6pa](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/J0b6pa.png)

![TikkVY](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/TikkVY.png)

![bCmz7O](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/bCmz7O.png)

## IP代理

- 为什么会出现IP被封

  网站为了防止被爬取，会有反爬机制，对于同一个IP地址的大量同类型的访问，会封锁IP，过一段时间后，才能继续访问

- 如何应对IP被封的问题

  1. 修改请求头，模拟浏览器（而不是代码去直接访问）去访问
  2. 采用代理IP并轮换
  3. 设置访问时间间隔

- 确认代理IP地址有效性

  - 无论是免费还是收费的代理网站，提供的代理IP都未必有效，我们应该验证一下，有效后，再放入我们的代理IP池中，以下通过几种方式：访问网站，得到的返回码是200真正的访问某些网站，获取title等，验证title与预计的相同访问某些可以提供被访问IP的网站，类似于“查询我的IP”的网站，查看返回的IP地址是什么验证返回码

![VREuAO](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/VREuAO.png)

```python
from bs4 import BeautifulSoup
import requests
import re
import json


def open_proxy_url(url):
    user_agent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.119 Safari/537.36'
    headers = {'User-Agent': user_agent}
    try:
        r = requests.get(url, headers = headers, timeout = 10)
        r.raise_for_status()
        r.encoding = r.apparent_encoding
        return r.text
    except:
        print('无法访问网页' + url)


def get_proxy_ip(response):
    proxy_ip_list = []
    soup = BeautifulSoup(response, 'html.parser')
    proxy_ips = soup.find(id = 'ip_list').find_all('tr')
    for proxy_ip in proxy_ips:
        if len(proxy_ip.select('td')) >=8:
            ip = proxy_ip.select('td')[1].text
            port = proxy_ip.select('td')[2].text
            protocol = proxy_ip.select('td')[5].text
            if protocol in ('HTTP','HTTPS','http','https'):
                proxy_ip_list.append(f'{protocol}://{ip}:{port}')
    return proxy_ip_list


def open_url_using_proxy(url, proxy):
    user_agent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.119 Safari/537.36'
    headers = {'User-Agent': user_agent}
    proxies = {}
    if proxy.startswith(('HTTPS','https')):
        proxies['https'] = proxy
    else:
        proxies['http'] = proxy

    try:
        r = requests.get(url, headers = headers, proxies = proxies, timeout = 10)
        r.raise_for_status()
        r.encoding = r.apparent_encoding
        return (r.text, r.status_code)
    except:
        print('无法访问网页' + url)
        print('无效代理IP: ' + proxy)
        return False


def check_proxy_avaliability(proxy):
    url = 'http://www.baidu.com'
    result = open_url_using_proxy(url, proxy)
    VALID_PROXY = False
    if result:
        text, status_code = result
        if status_code == 200:
            r_title = re.findall('<title>.*</title>', text)
            if r_title:
                if r_title[0] == '<title>百度一下，你就知道</title>':
                    VALID_PROXY = True
        if VALID_PROXY:
            check_ip_url = 'https://jsonip.com/'
            try:
                text, status_code = open_url_using_proxy(check_ip_url, proxy)
            except:
                return

            print('有效代理IP: ' + proxy)
            with open('valid_proxy_ip.txt','a') as f:
                f.writelines(proxy)
            try:
                source_ip = json.loads(text).get('ip')
                print(f'源IP地址为：{source_ip}')
                print('='*40)
            except:
                print('返回的非json,无法解析')
                print(text)
    else:
        print('无效代理IP: ' + proxy)


if __name__ == '__main__':
    proxy_url = 'https://www.xicidaili.com/'
    proxy_ip_filename = 'proxy_ip.txt'
    text = open(proxy_ip_filename, 'r').read()
    proxy_ip_list = get_proxy_ip(text)
    for proxy in proxy_ip_list:
        check_proxy_avaliability(proxy)
        
>>> 有效代理IP: HTTP://114.223.208.165:8118
源IP地址为：38.121.22.17
========================================
无法访问网页http://www.baidu.com
无效代理IP: HTTPS://171.35.86.72:8118
无效代理IP: HTTPS://171.35.86.72:8118
无法访问网页http://www.baidu.com
无效代理IP: HTTP://49.235.246.24:8118
无效代理IP: HTTP://49.235.246.24:8118
无法访问网页http://www.baidu.com
无效代理IP: HTTPS://114.223.103.47:8118
无效代理IP: HTTPS://114.223.103.47:8118
有效代理IP: HTTP://58.215.201.98:35728
源IP地址为：38.121.22.17
========================================
无法访问网页http://www.baidu.com
无效代理IP: HTTP://60.188.65.73:3000
无效代理IP: HTTP://60.188.65.73:3000
```

## selenium

selenium是什么：一个自动化测试工具（大家都是这么说的）

selenium应用场景：用代码的方式去模拟浏览器操作过程（如：打开浏览器、在输入框里输入文字、回车等），在爬虫方面很有必要

```python
from selenium import webdriver  # 启动浏览器需要用到
from selenium.webdriver.common.keys import Keys  # 提供键盘按键支持（最后一个K要大写）

driver = webdriver.Chrome("../chromedriver")
driver.get("http://www.python.org")  # 这个时候chromedriver会打开一个Chrome浏览器窗口，显示的是网址所对应的页面

driver.close()  # 关闭浏览器一个Tab
driver.quit()  # 关闭浏览器窗口
```





