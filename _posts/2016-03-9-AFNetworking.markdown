## AFNetworking

[AFNetworking 3.0 Migration Guide](https://github.com/AFNetworking/AFNetworking/wiki/AFNetworking-3.0-Migration-Guide#new-requirements-ios-7-mac-os-x-109-watchos-2-tvos-9--xcode-7)

### 3.0

#### NSURLConnection的api已废弃
* 使用NSURLSession的api

#### 弃用的类
* AFURLConnectionOperation
* AFHTTPRequestOperation
* AFHTTPRequestOperationManager

#### 修改的类
* UIImageView+AFNetworking
* UIWebView+AFNetworking
* UIButton+AFNetworking

#### 迁移
AFHTTPRequestOperationManager->AFHTTPSessionManager
* securityPolicy
* requestSerializer
* responseSerializer

HTTP网络请求返回的不再是AFHTTPRequestOperation, 修改成为了NSURLSessionTask，并且成功和失败的Block块中的参数也变更为了NSURLSessionTask，而不再是AFHTTPRequestOperation。

-
##### AFNetworking 2.x
```
AFHTTPRequestOperationManager *manager = [AFHTTPRequestOperationManager manager];
[manager GET:@"请求的url" parameters:nil success:^(AFHTTPRequestOperation *operation, id responseObject) {
        NSLog(@"成功");
} failure:^(AFHTTPRequestOperation *operation, NSError*error) {
        NSLog(@"失败");
}];
```

##### AFNetworking 3.0
```
AFHTTPSessionManager *session = [AFHTTPSessionManager manager];
[session GET:@"请求的url" parameters:nil success:^(NSURLSessionDataTask *task, id responseObject) {
        NSLog(@"成功");
} failure:^(NSURLSessionDataTask *task, NSError *error) {
        NSLog(@"失败");        
}];
```

#### 核心代码

#####  2.x
```
NSURL *URL = [NSURL URLWithString:@""];
NSURLRequest *request = [NSURLRequest requestWithURL:URL];
AFHTTPRequestOperation *op = [[AFHTTPRequestOperation alloc] initWithRequest:request];
op.responseSerializer = [AFJSONResponseSerializer serializer];
[op setCompletionBlockWithSuccess:^(AFHTTPRequestOperation *operation, id responseObject) {
        NSLog(@"JSON: %@", responseObject);
} failure:^(AFHTTPRequestOperation *operation, NSError *error) {
        NSLog(@"Error: %@", error);
}];
[[NSOperationQueue mainQueue] addOperation:op];
```

##### 3
```
NSURL *URL = [NSURL URLWithString:@""];
AFHTTPSessionManager *manager = [AFHTTPSessionManager manager];
[manager GET:URL.absoluteString parameters:nil success:^(NSURLSessionTask *task, id responseObject) {
        NSLog(@"JSON: %@", responseObject);
} failure:^(NSURLSessionTask *operation, NSError *error) {
        NSLog(@"Error: %@", error);
}];
```


#### UIKit 的迁移
图片下载已经被重构，以遵循AlamofireImage架构与新的AFImageDownloader类。这个类的图片下载职责的代理人是UIButton与UIImageView的类目，并且提供了一些方法，在必要时可以自定义。类别中，下载远程图片的实际方法没有改变。
UIWebView的类目被重构为使用AFHTTPSessionManager作为其网络请求。
