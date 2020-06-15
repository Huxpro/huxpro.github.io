---
layout:     post
title:      虚拟环境、jupyter服务
subtitle:   linux
date:       2020-03-29
author:     Young
hidden: true
catalog: true
tags:
    - tools
---



极简版重新安装虚拟环境，并开启jupyter服务

```python
pip config set global.index-url https://pypi.tuna.tsinghua.edu.cn/simple
virtualenv -p python3 python3-tf-gpu
source python3-tf-gpu/bin/activate
pip install tensorflow-gpu==1.12.0
python -m ipykernel install --name python3-tf-gpu --user
```

