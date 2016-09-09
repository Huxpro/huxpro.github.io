---
layout:     post
title:      "记一次解决curl https证书问题"
subtitle:   "A solution to solve curl https web site problem"
date:       2016-04-21 8:00:00
author:     "XuXinkun"
header-img: "img/post-bg-curl-ca.jpg"
tags:
    - curl
    - https
---

# 问题起因

在访问https的网站时，报出`Peer's Certificate has expired`的错误。如下：

	[root@localhost ~]# curl https://www.baidu.com
	curl: (60) Peer's Certificate has expired.
	More details here: http://curl.haxx.se/docs/sslcerts.html

搜索了很久，没有有用的信息。没能找到已有的解决方法。只能靠自己来分析了。

# 尝试分析

首先根据提示，我判断是CA证书过期。于是对证书进行了更新

	update-ca-trust

但是依然没有解决问题。之后，尝试了很多方法后，重新回来想想，为什么不适用curl -v来获取更多信息呢？于是使用该命令进行再次尝试。

	[root@localhost ~]# curl https://www.baidu.com -v
	* About to connect() to www.baidu.com port 443 (#0)
	*   Trying 180.97.33.107...
	* Connected to www.baidu.com (180.97.33.107) port 443 (#0)
	* Initializing NSS with certpath: sql:/etc/pki/nssdb
	*   CAfile: /etc/pki/tls/certs/ca-bundle.crt
	  CApath: none
	* Server certificate:
	* 	subject: CN=baidu.com,OU=service operation department,O="Beijing Baidu Netcom Science Technology Co., Ltd.",L=Beijing,ST=Beijing,C=CN
	* 	start date: Sep 17 00:00:00 2015 GMT
	* 	expire date: Aug 31 23:59:59 2016 GMT
	* 	common name: baidu.com
	* 	issuer: CN=VeriSign Class 3 International Server CA - G3,OU=Terms of use at https://www.verisign.com/rpa (c)10,OU=VeriSign Trust Network,O="VeriSign, Inc.",C=US
	* NSS error -8181 (SEC_ERROR_EXPIRED_CERTIFICATE)
	* Peer's Certificate has expired.
	* Closing connection 0
	curl: (60) Peer's Certificate has expired.
	More details here: http://curl.haxx.se/docs/sslcerts.html

然后根据`SEC_ERROR_EXPIRED_CERTIFICATE`的错误说明，进行搜索，发现该命令是由于本地的时间不正确造成的。进行一次ntp时间同步，问题解决。

	ntpdate pool.ntp.org

# 结果分析

https的证书是有开始时间和失效时间的。因此本地时间要在这个证书的有效时间内。不过最好的方式，还是能够把时间进行同步。





