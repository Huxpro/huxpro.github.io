---
layout:     post
title:      vscode配置c++debug
subtitle:   vscode mac
date:       2020-03-29
author:     Young
header-img: img/bg-post/1*Rqcd5jAPzRSg5gPuRf5T1g.png
catalog: true
tags:
    - tools
---



### 步骤

> In this tutorial, you configure Visual Studio Code on macOS to use the Clang/LLVM compiler and debugger.

> As you go through the tutorial, you will create three files in a `.vscode` folder in the workspace:
>
> - `tasks.json` (compiler build settings)
> - `launch.json` (debugger settings)
> - `c_cpp_properties.json` (compiler path and IntelliSense settings

> Next, you'll create a `tasks.json` file to tell VS Code how to build (compile) the program. This task will invoke the Clang C++ compiler to create an executable file from the source code.

From the main menu, choose **Terminal** > **Configure Default Build Task**. A dropdown will appear listing various predefined build tasks for the compilers that VS Code found on your machine. Choose **C/C++ clang++ build active file** to build the file that is currently displayed (active) in the editor.

![](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/ViTi11.png)

- tasks.json

```json
{
    "version": "2.0.0",
    "tasks": [
        {
            "label": "clang++ build active file",
            "type": "shell",
            "command": "clang++",
            "args": [
                "-std=c++17",
                "-stdlib=libc++",
                "${fileBasename}",
                "-o",
                "${fileBasenameNoExtension}.out",
                "-g"
            ],
            "group": {
                "kind": "build",
                "isDefault": true
            }
        }
    ]
}
```

Next, you'll create a `launch.json` file to configure VS Code to launch the LLDB debugger when you press F5 to debug the program.

From the main menu, choose **Run** > **Add Configuration...** and then choose **C++ (GDB/LLDB)**.

You'll then see a dropdown for predefined debugging configurations. Choose **clang++ build and debug active file**.

![](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/xUy5Pj.png)

- launch.json

```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "name": "clang++ build and debug active file",
            "type": "lldb",
            "request": "launch",
            "program": "${fileDirname}/${fileBasenameNoExtension}.out",
            "args": [],
            "cwd": "${workspaceFolder}",
            "preLaunchTask": "clang++ build active file"
        }
    ]
}
```

For more control over the C/C++ extension, create a `c_cpp_properties.json` file, which allows you to change settings such as the path to the compiler, include paths, which C++ standard to compile against (such as C++17), and more.

View the C/C++ configuration UI by running the command **C/C++: Edit Configurations (UI)** from the Command Palette (⇧⌘P).

![](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/M2NLVr.png)

- c_cpp_properties.json

```json
{
    "configurations": [
        {
            "name": "Mac",
            "includePath": [
                "${workspaceFolder}/**"
            ],
            "defines": [],
            "macFrameworkPath": [
                "/Applications/Xcode.app/Contents/Developer/Platforms/MacOSX.platform/Developer/SDKs/MacOSX.sdk/System/Library/Frameworks"
            ],
            "compilerPath": "/usr/bin/clang",
            "cStandard": "c11",
            "cppStandard": "c++11",
            "intelliSenseMode": "clang-x64"
        }
    ],
    "version": 4
}
```

![](/Users/yangjiale/Library/Application Support/typora-user-images/image-20200330211758194.png)

> ps：然后就可以愉快的debug了，要吐槽的是，vscode配置c++debug真心没有windows下的visual studio好用，差远了，但是无奈没有mac版的visual studio，唯一的 visual studio for mac 也只支持 c# 这种语言。。。。。。一言难尽

