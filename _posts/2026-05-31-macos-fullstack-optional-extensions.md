---
layout: post
title: "可选扩展：Java、Go、MongoDB、云平台 CLI"
subtitle: "主线环境跑通后，再按项目需要补 Spring Boot、Go 服务、文档数据库和部署工具"
date: 2026-05-31 10:50:00 +0800
author: "CodeWater517"
header-img: "img/home-bg-geek.jpg"
header-mask: 0.35
tags:
  - macOS
  - Java
  - Go
  - MongoDB
  - 云服务
last_modified_at: 2026-05-31 10:50:00 +0800
revision_history:
  - time: 2026-05-31 10:50:00 +0800
    description: "新增 Java、Go、MongoDB 与云平台 CLI 可选扩展教程。"
---

> 这一篇是扩展包，不是主线必装。只有当课程、实验室、公司项目或部署目标需要时，再安装 Java、Go、MongoDB、AWS/Vercel/Railway/Fly.io 等工具。

## 结论

先问自己一句：

```text
我现在的项目真的需要它吗？
```

如果只是学习全栈入门，前 11 篇已经够用。如果你要做 Spring Boot、Go 微服务、MongoDB 项目或云部署，再按本文补。

## 我找到的教程类型

| 来源 | 类型 | 时间/版本 | 优点 | 问题 | 推荐度 |
| --- | --- | --- | --- | --- | ---: |
| [Adoptium Docs](https://adoptium.net/docs/) | 官方文档 | 当前在线文档 | Temurin JDK 安装入口权威 | 版本选择需自己判断 | 5 |
| [Microsoft OpenJDK macOS install](https://learn.microsoft.com/en-us/java/openjdk/install) | 官方文档 | 当前在线文档 | Homebrew cask 安装说明清楚 | 本系列不强制使用 Microsoft build | 4 |
| [SDKMAN Installation](https://sdkman.io/install/) | 官方文档 | 当前在线文档 | 适合管理多 JDK、Maven、Gradle | 又引入一个版本管理器 | 4 |
| [Maven Installation](https://maven.apache.org/install.html) | 官方文档 | 当前在线文档 | macOS Homebrew 和 SDKMAN 都覆盖 | 需要先有 JDK | 5 |
| [Go Install](https://go.dev/doc/install/) | 官方文档 | 当前在线文档 | `go version` 验证明确 | Homebrew 路线需看 formula | 5 |
| [MongoDB macOS Install](https://www.mongodb.com/docs/v8.0/tutorial/install-mongodb-on-os-x/) | 官方文档 | MongoDB 8.0 | Homebrew tap、服务启动、平台要求完整 | MongoDB 不是主线数据库 | 5 |
| [AWS CLI Install](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) | 官方文档 | 当前在线文档 | macOS 支持矩阵和 pkg 安装说明清楚 | 凭证配置需谨慎 | 5 |
| [Vercel CLI](https://vercel.com/docs/cli) / [Railway CLI](https://docs.railway.com/cli) | 官方文档 | 当前在线文档 | 适合部署前端和全栈服务 | 免费额度和平台策略会变化 | 4 |

## 1. Java JDK

什么时候需要：

- 学 Spring Boot；
- 跑 Java 后端；
- 做 Android 或某些大数据工具；
- 课程要求 Maven/Gradle。

推荐选择 LTS JDK，例如 21 或当前项目要求版本。JDK 发行版很多，Temurin、Microsoft Build of OpenJDK、Amazon Corretto、Azul Zulu 都是常见选择。

Homebrew 示例：

```bash
brew install --cask temurin
```

如果你选择 Microsoft Build of OpenJDK：

```bash
brew install --cask microsoft-openjdk
```

验证：

```bash
java --version
/usr/libexec/java_home -V
```

成功信号：能看到 JDK 版本和安装路径。

## 2. Maven 和 Gradle

Maven：

```bash
brew install maven
mvn -v
```

Gradle：

```bash
brew install gradle
gradle -v
```

什么时候用：

- Maven：传统 Java/Spring 项目很常见；
- Gradle：Android、Kotlin、现代 JVM 项目常见。

不要为了“完整”两个都装。如果项目有 `pom.xml`，通常用 Maven。如果项目有 `build.gradle` 或 `build.gradle.kts`，通常用 Gradle。

## 3. SDKMAN

如果你经常在多个 Java 版本之间切换，可以考虑 SDKMAN：

```bash
curl -s "https://get.sdkman.io" | bash
source "$HOME/.sdkman/bin/sdkman-init.sh"
sdk version
```

安装 Java：

```bash
sdk list java
sdk install java 21.0.0-tem
```

优点：切换多版本方便。

缺点：又多一个工具链。新手如果只需要一个 JDK，用 Homebrew cask 更简单。

## 4. Go

什么时候需要：

- 写 CLI；
- 写高并发后端服务；
- 学云原生工具；
- 读 Kubernetes、Docker、Terraform 生态项目。

官方安装包或 Homebrew 都可以。

Homebrew：

```bash
brew install go
```

验证：

```bash
go version
go env GOPATH
```

创建最小项目：

```bash
mkdir -p ~/Developer/go-hello
cd ~/Developer/go-hello
go mod init example.com/go-hello
```

创建 `main.go`：

```go
package main

import "fmt"

func main() {
    fmt.Println("hello go")
}
```

运行：

```bash
go run .
```

成功信号：

```text
hello go
```

## 5. MongoDB

什么时候需要：

- 项目明确使用 MongoDB；
- 学文档数据库；
- 跑某些依赖 MongoDB 的开源项目。

如果你的目标是通用全栈开发，PostgreSQL 更适合作为主线。MongoDB 是补充，不是替代所有数据库。

官方 Homebrew 安装：

```bash
brew tap mongodb/brew
brew update
brew install mongodb-community@8.0
```

启动：

```bash
brew services start mongodb-community@8.0
```

验证：

```bash
mongosh
```

停止：

```bash
brew services stop mongodb-community@8.0
```

常见坑：老教程会提到 `/data/db`。新版本 macOS 和官方 Homebrew 安装方式已经不推荐你手动在根目录创建这个路径。

## 6. AWS CLI

什么时候需要：

- 部署到 AWS；
- 使用 S3、EC2、ECR、Lambda；
- 跑课程或实验室云资源。

AWS 官方 macOS 文档推荐官方 pkg 安装器，并提醒第三方仓库不一定保证最新版本。

安装后验证：

```bash
aws --version
```

配置：

```bash
aws configure
```

安全提醒：

- 不要把 Access Key 写进代码；
- 不要提交 `~/.aws/credentials`；
- 优先使用最小权限 IAM 用户或临时凭证；
- 不懂权限时不要给 AdministratorAccess。

## 7. Vercel CLI

适合：

- 部署前端；
- 部署 Next.js；
- 快速预览静态站点。

安装：

```bash
pnpm add -g vercel
vercel --version
```

也可以用：

```bash
npx vercel
```

如果你不想全局安装，就优先用项目内命令或 `pnpm dlx`。

## 8. Railway CLI

适合：

- 快速部署小型全栈项目；
- 托管 PostgreSQL、Redis 等服务；
- 原型项目上线。

安装方式以官方文档为准。验证：

```bash
railway --version
```

使用云平台前先确认费用、额度、地区和数据删除策略。

## 9. Fly.io CLI

适合：

- 部署 Docker 化应用；
- 多区域边缘部署；
- 练习容器部署。

验证：

```bash
fly version
```

部署前要理解：

- app 名称；
- region；
- volume；
- secrets；
- scale；
- billing。

## 10. 可选工具安装顺序

如果你没有明确项目要求，建议顺序：

1. Go：轻量，适合写 CLI 和读云原生项目。
2. Java JDK：如果课程或工作需要 Spring Boot。
3. MongoDB：只有项目明确需要再装。
4. 云平台 CLI：只有要部署到对应平台再装。

不要把“装了很多工具”当成学习成果。真正的成果是你能用这些工具完成项目。

## 11. 常见错误与解决

### `java --version` 提示没有 Java runtime

说明 JDK 没装好，或当前 shell 没找到。

检查：

```bash
/usr/libexec/java_home -V
```

如果没有结果，重新安装 JDK。

### Maven 找不到 JAVA_HOME

查看：

```bash
echo $JAVA_HOME
/usr/libexec/java_home
```

临时设置：

```bash
export JAVA_HOME=$(/usr/libexec/java_home)
```

长期设置再写入 `~/.zprofile`。

### Go module 路径不会写

学习项目可以使用：

```bash
go mod init example.com/project-name
```

真实开源项目通常使用仓库路径，例如：

```bash
go mod init github.com/yourname/project
```

### MongoDB 安装失败

先确认：

```bash
brew tap
brew info mongodb/brew/mongodb-community@8.0
```

再看 macOS 版本是否满足 MongoDB 官方平台要求。

### 云 CLI 登录后不知道凭证放哪

不要把凭证复制到项目里。大多数 CLI 会写入用户目录下的配置文件或系统钥匙串。项目仓库只放 `.env.example`，不放真实密钥。

## 验证方式

按你安装的扩展工具验证：

```bash
java --version
mvn -v
gradle -v
go version
mongosh --version
aws --version
vercel --version
railway --version
fly version
```

没有安装的工具不需要验证。扩展工具是按需选择，不是考试清单。

## 可直接交给 Codex 的 Prompt

```text
你是我的 macOS 全栈扩展环境顾问。请根据当前项目判断是否需要 Java、Go、MongoDB 或云平台 CLI。

目标：
避免盲目安装，只安装当前项目真正需要的扩展工具。

请检查：
1. 项目是否有 pom.xml、build.gradle、go.mod、MongoDB 连接配置、Dockerfile、部署配置。
2. 如果需要 Java，建议 JDK 版本和 Maven/Gradle。
3. 如果需要 Go，检查 go.mod 和 go version。
4. 如果需要 MongoDB，给出本机或 Docker Compose 方案。
5. 如果需要云 CLI，说明对应平台、登录方式和凭证安全注意事项。

约束：
- 不要安装不需要的工具。
- 不要读取或输出云平台密钥。
- 不要把真实 .env 提交到仓库。
```

## 参考来源

- [Adoptium：Documentation](https://adoptium.net/docs/)
- [Microsoft Learn：Install the Microsoft Build of OpenJDK](https://learn.microsoft.com/en-us/java/openjdk/install)
- [SDKMAN：Installation](https://sdkman.io/install/)
- [Apache Maven：Installation](https://maven.apache.org/install.html)
- [Go：Download and install](https://go.dev/doc/install/)
- [Homebrew Formula：go](https://formulae.brew.sh/formula/go)
- [MongoDB Docs：Install MongoDB Community Edition on macOS](https://www.mongodb.com/docs/v8.0/tutorial/install-mongodb-on-os-x/)
- [MongoDB Homebrew Tap](https://github.com/mongodb/homebrew-brew)
- [AWS CLI：Install or update to the latest version](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)
- [Vercel CLI](https://vercel.com/docs/cli)
- [Railway CLI](https://docs.railway.com/cli)
- [Fly.io Docs](https://fly.io/docs/flyctl/)
