---
title: 开始
categories: [CSharp, WPF]
tags: [CSharp, WPF]
date: 2024-04-13 21:52
updated: 2025-07-06 22:04
wiki: wpf
---
## 开始

WPF 是 Windows 平台的 UI 框架，使用 C#和 xaml 语言编写，xaml 语言是 xml 语言的扩展

使用 Visual Studio 创建 WPF 应用程序，生成如下文件

![](https://baymaxam-1309988842.cos.ap-beijing.myqcloud.com/blog/wpf-%E5%BC%80%E5%A7%8B%2Fwpf-%E5%BC%80%E5%A7%8B-1751810565740.png)

- 依赖项中 `NETCore.App` 是.NET 平台应用程序的依赖，`WindowDeskTop.App.WPF` 是 WPF 框架的依赖

- `App.xaml`：描述整个应用程序

    - `StartupUri`：指明主页面
    - `xmlns:local`：将项目代码的命名空间引入到 xaml 中
    - `Application.Resources`：声明当前应用中使用的资源（自定义类等）

    ```xml
    <Application x:Class="frontend.App"
                 xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
                 xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
                 xmlns:local="clr-namespace:frontend"
                 StartupUri="MainWindow.xaml">
        <Application.Resources> 
        </Application.Resources>
    </Application>
    ```

- `MainWindow.xaml`：描述主页面布局

    - `x:Class`：指明该布局编译生成的类

        一个界面后台类通常使用 `partial` 关键字声明，表示将该类的定义拆分，如后台 C#类是 `MainWindow`，使用 `partial` 声明，xaml 中 `x:Class="MainWindow"`，表示该 xaml 编译生成一个界面类，在编译时会合并到 `MainWindow` 类中

    - `xmlns:local`：将项目代码的命名空间引入到 xaml 中

    - `Window.Resources`：声明当前窗口中的资源

    ``` xml
    <Window x:Class="frontend.MainWindow"
            xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
            xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
            xmlns:d="http://schemas.microsoft.com/expression/blend/2008"
            xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
            xmlns:local="clr-namespace:frontend"
            mc:Ignorable="d"
            Title="MainWindow" Height="450" Width="800">
        <Window.Resources>
        </Window.Resources>
        <Grid>
        </Grid>
    </Window>
    ```
