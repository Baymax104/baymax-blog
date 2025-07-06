---
title: WPF基础——依赖属性
categories: [CSharp, WPF]
tags: [CSharp, WPF]
date: 2024-04-25 15:27
updated: 2025-07-06 22:08
---
## 开始

依赖属性是 WPF 中的新概念，相对地，普通的属性被称为 CLR 属性（Common Language Runtime）

依赖属性与 CLR 属性最大的不同就是依赖属性的属性值可以通过 Binding 对象绑定到其他对象上，同时节省了 UI 元素实例的属性内存开销

依赖对象：拥有依赖属性的类称为依赖对象，在初始化时并不分配依赖属性的内存空间，只提供获取默认值、借用其他对象数据或实时分配空间的能力，WPF 中的所有自带 UI 控件都是依赖对象

## 使用依赖属性

依赖属性的基本使用

```c#
public class Student : DependencyObject {
    public static readonly DependencyProperty NameProperty =
        DependencyProperty.Register(nameof(Name), typeof(string), typeof(Student));
    
    // 依赖属性的包装器，便于外界访问依赖属性
    // DependencyObject类提供了GetValue方法和SetValue方法，用于访问依赖属性
    public string Name {
        get => (string)GetValue(NameProperty);
        set => SetValue(NameProperty, value);
    }
}
```

Register 方法用于注册一个依赖属性

- `name`：指定哪个 CLR 属性作为依赖属性的包装器
- `propertyType`：依赖属性的值类型
- `ownerType`：依赖对象的类型
- `typeMetadata`：`DefaultMetadata` 类型，表示依赖属性的默认值

## 依赖属性作为数据源

单纯的依赖属性通常作为 Binding 的目标，设置了包装器后，依赖属性可作为 Binding 的数据源

```c#
var student = new Student();

// 将Text1的Text属性绑定到student的NameProperty上，student作为目标
var bindingText1Student = new Binding() {
    Source = Text1,
    Path = new("Text")
};
BindingOperations.SetBinding(student, Student.NameProperty, bindingText1Student);

// 将student的Name绑定到Text2的TextProperty上，student作为数据源
var bindingStudentText2 = new Binding() {
    Source = student,
    Path = new("Name")
};
BindingOperations.SetBinding(Text2, TextBlock.TextProperty, bindingStudentText2);
```

## 依赖属性的存取原理

在 `DependencyObject` 类中存在一个静态属性 `PropertyFromName`

```c#
private static Hashtable PropertyFromName = new Hashtable();
```

该哈希表保存了通过 Register 方法注册的依赖属性

- 键：传入的 CLR 属性名和 `ownerType` 的 hashcode 异或运算得到
- 值：DependencyProperty 对象

依赖对象中调用 GetValue 方法获取依赖属性的值，实际上是获取 `EffectiveValueEntry` 实例中的值

```c#
public object GetValue(DependencyProperty dp) {
    // ...
    
    // 获取EffectiveValueEntry实例，再获取Value属性
    return GetValueEntry(LookupEntry(dp.GlobalIndex), dp, null, RequestFlags.FullyResolved).Value;
}
```

## 附加属性

附加属性是指一个对象处于某个环境下，被附加的属性，本质依然是依赖属性

附加属性的声明

```c#
public class Student : DependencyObject {
    public static readonly DependencyProperty NameProperty =
        DependencyProperty.RegisterAttached("Name", typeof(string), typeof(Student), new UIPropertyMetadata(""));
    
    public static string GetName(DependencyObject obj) {
        return (string)obj.GetValue(NameProperty);
    }
    
    public static void SetName(DependencyObject obj, string value) {
        obj.SetValue(NameProperty, value);
    }
}
```

与一般依赖属性的不同

- 使用 `RegisterAttached` 方法进行注册
- 通过方法而不是 CLR 属性包装依赖属性

使用附加属性

```c#
// Human作为被附加类，继承DependencyObject
public class Human : DependencyObject {
}

var human = new Human();
Student.SetName(human, "hello");  // 将NameProperty附加到Human
string name = Student.GetName(human);
```

## 自定义组件

通过 `UserControl` 组件可以自定义组件，使用依赖属性为组件添加自定义属性

C#类实现

- 自定义依赖属性和 CLR 包装属性
- 在构造器中设置 Root 组件的 DataContext 为当前类 this

```c#
using System.Windows;
using System.Windows.Controls;

namespace WpfDemo;

public partial class UserControl1 : UserControl {

    public static readonly DependencyProperty AgeProPerty = 
        DependencyProperty.Register(nameof(Age), typeof(int), typeof(UserControl1), new UIPropertyMetadata());

    public int Age {
        get => (int)GetValue(AgeProPerty);
        set => SetValue(AgeProPerty, value);
    }
    
    
    public UserControl1() {
        InitializeComponent();
        Root.DataContext = this;
    }
}
```

xaml 基本实现

- 使用 `UserControl` 组件作为根组件
- 定义布局组件的 id 为 Root
- `d:DataContext` 用于在预览调试时定义 DataContext
- 通过 Binding 绑定到自定义的 CLR 包装属性

```xml
<UserControl x:Class="WpfDemo.UserControl1"
             xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
             xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
             xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
             xmlns:d="http://schemas.microsoft.com/expression/blend/2008"
             xmlns:local="clr-namespace:WpfDemo"
             mc:Ignorable="d"
             d:DesignHeight="300" d:DesignWidth="300">
    <Grid x:Name="Root" d:DataContext="{d:DesignInstance local:UserControl1}">
        <TextBlock Text="{Binding Age}"/>
    </Grid>
</UserControl>
```

外部使用：传入字面量或 Binding

```xml
<local:UserControl1 Age="30"/>
```
