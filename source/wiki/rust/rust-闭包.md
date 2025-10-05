---
title: 闭包
categories: [Rust]
tags: [Rust]
date: 2025-10-04 00:57
updated: 2025-10-04 21:35
banner: /assets/banner/rust.png
wiki: rust
---
## 闭包定义

rust 中闭包的基本定义如下

```rust
let sum = |x: i32, y: i32| -> i32 {
    x + y  // 尾表达式作为返回值
}
```

闭包支持类型推导，在定义时可以不指定类型，根据**第一次调用**时参数的类型来确定闭包的类型

```rust
let example_closure = |x| x;  // 闭包中只有单个表达式时可以去掉花括号

let s = example_closure(String::from("hello"));  // 闭包参数类型确定为String
let n = example_closure(5);  // 报错
```

## 闭包特征

在 rust 中，闭包不是一个具体的类型，而是实现了一系列特征的匿名类型，即每个闭包实例都有自身独一无二的类型，且该类型无法在代码中显式写出，闭包类型在代码中通过闭包特征来表现，闭包特征就是标准库提供的 `Fn` 系列特征

在闭包中可以捕获当前上下文中的变量，其捕获模式正好是三种参数传入方式：所有权移动、可变引用、不可变引用，也对应了三种不同的闭包特征

### `FnOnce`

以所有权移动的方式捕获上下文中的变量，闭包在调用时，捕获变量的所有权被移动到闭包中，外部无法再使用，因此 `FnOnce` 闭包只能调用一次

```rust
fn fn_once<F>(func: F) 
where 
    F: FnOnce(usize) -> bool,
{ 
    println!("{}", func(3));
    println!("{}", func(4));
}
```

若给闭包函数加上 `Copy` 特征，则调用时捕获变量进行拷贝，不会发生所有权移动，闭包函数可以使用两次

```rust
fn fn_once<F>(func: F)
where
    F: FnOnce(usize) -> bool + Copy,
{ 
    println!("{}", func(3));
    println!("{}", func(4));
}
```

在闭包定义时使用 `move` 关键字，可以强制将捕获变量的所有权移动，此时特征约束中不能添加 `Copy` 特征

```rust
let once = move |z: usize| {z == x.len()};
```

### `FnMut`

以可变引用的方式捕获上下文中的变量，使用 `mut` 关键字修饰，只能调用一次，且不能添加 `Copy` 特征约束

```rust
let mut update_string = |str| s.push_str(str);

fn fn_mut<F>(mut func: F)
where F: FnMut(&str)  // 闭包无返回值
{
    func("Hello")
}
```

### `Fn`

以不可变引用的方式捕获上下文中的变量，可以调用多次

```rust
fn exec<'a, F: Fn(&'a str)>(f: F) {
    f("hello")
}

fn main() {
    let s = String::from("hello world");
    let update_string = |str| println!("{},{}", s, str);
    exec(update_string);
    println!("{:?}", s);
}
```

### 三个特征的关系

一个闭包实例可以实现多种 Fn 特征，**取决于闭包中捕获变量的使用方式，与捕获方式无关**，因此即使一个闭包使用 `Fn` 特征作为约束，它依然可以使用 `move` 关键字强制移动捕获变量的所有权

闭包实例 Fn 特征的实现规则如下

1. 所有闭包实例默认实现 `FnOnce`
2. 若闭包中没有移动捕获变量的所有权，则闭包实例实现了 `FnMut`
3. 若闭包中没有对捕获变量进行修改，则闭包实例实现了 `Fn`

例如以下代码

```rust
// 没有修改捕获变量，实现了Fn特征
let s = String::new();
let update_string = || println!("{}",s);

// 修改捕获变量，但没有移动捕获变量所有权，实现了FnMut特征
let mut s1 = String::new();
let update_string = |str: &str| -> () { s1.push_str(str) };

// 移动了捕获变量的所有权，实现了FnOnce特征
let s2 = String::new();
let update_string = |str: &str| -> String { s2 };
println!("{:?}", s2);  // 值已经被移动，不能再使用
```

## 闭包返回值

当函数返回闭包时，在声明返回值类型时使用 Fn 特征进行声明

```rust
fn factory() -> impl Fn(i32) -> i32 { 
    let num = 5;
    |x| x + num  // 只返回这一种闭包实例
}
```

由于每个闭包实例都具有不同的类型，当需要返回不同的闭包实例时，可以使用特征对象作为返回值类型

```rust
fn factory(x:i32) -> Box<dyn Fn(i32) -> i32> {
    let num = 5;

    if x > 1{
        Box::new(move |x| x + num)
    } else {
        Box::new(move |x| x - num)
    }
}
```
