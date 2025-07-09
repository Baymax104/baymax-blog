---
title: Rust基础——错误处理
categories: [Rust]
tags: [Rust]
date: 2024-11-04 16:50
updated: 2025-07-07 01:47
---
## 开始

rust 中的错误处理并不像其他语言一样使用异常处理错误，rust 将错误分为**不可恢复错误**和**可恢复错误**

- 对于可恢复错误，使用 `Result<T, E>` 类型进行处理
- 对于不可恢复错误，使用 panic 进行处理

## 不可恢复错误

使用 panic 来处理不可恢复的错误，有两种行为会产生 panic

- 代码执行错误，如越界访问
- 显式调用 `panic!` 宏

    ```rust
    panic!("Error Message");
    ```

产生 panic 后，panic 会打印一个错误信息，之后执行**栈展开**或**终止**

- 栈展开：默认行为，rust 会回溯每一个栈帧，清理每个栈帧中的数据，最后退出程序
- 终止：rust 不清理数据，直接退出程序，数据交由操作系统进行清理

打印错误信息时，设置环境变量 `RUST_BACKTRACE=1`，可打印出回溯栈

## 可恢复错误

rust 使用 `Result<T, E>` 类型来处理可恢复错误，`Result` 类型是一个枚举

```rust
enum Result<T, E> {
    Ok(T),  // 成功时，包含成功的返回值
    Err(E),  // 错误时，包含错误对象
}
```

以打开文件为例，打开文件时会返回一个 `Result` 对象，通过模式匹配进行解构

```rust
use std::fs::File;

fn main() {
    let greeting_file_result = File::open("hello.txt");

    let greeting_file = match greeting_file_result {
        Ok(file) => file,
        Err(error) => panic!("Problem opening the file: {error:?}"),
    };
}
```

> 若需要判断错误的类型，通常可以调用 `error.kind()` 获取一个错误类型的枚举，继续进行模式匹配解构
{: .prompt-info}

**Err 分支简写**

在匹配到 `Err` 并且显式调用 `panic!` 宏的情况下，有两个函数可以简化匹配判断

- `unwrap()`：抛出的 panic 包含默认错误信息
- `expect()`：抛出的 panic 包含自定义错误信息

```rust
let file1 = File::open("hello.txt").unwrap();
let file2 = File::open("hello.txt").expect("My message");
```

### 传播错误

当函数需要向外部抛出 `Err` 时，函数的返回值应该使用 `Result<T, E>` 类型

以打开文件并读取文件内容为例，打开文件和读取文件都可能发生错误，以函数返回值的形式将错误抛出到外部

```rust
use std::fs::File;
use std::io::{self, Read};

fn read_username_from_file() -> Result<String, io::Error> {
    let username_file_result = File::open("hello.txt");

    let mut username_file = match username_file_result {
        Ok(file) => file,
        Err(e) => return Err(e),  // 抛出错误
    };

    let mut username = String::new();

    match username_file.read_to_string(&mut username) {
        Ok(_) => Ok(username),
        Err(e) => Err(e),  // 抛出错误
    }
}
```

**`?` 运算符**

使用 `?` 运算符简化抛出错误的分支

```rust
use std::fs::File;
use std::io::{self, Read};

fn read_username_from_file() -> Result<String, io::Error> {
    let mut username_file = File::open("hello.txt")?;  // 若发生错误，返回Err
    let mut username = String::new();
    username_file.read_to_string(&mut username)?;  // 若发生错误，返回Err
    Ok(username)  // 返回成功值
}
```

进一步简化为链式调用

```rust
use std::fs::File;
use std::io::{self, Read};

fn read_username_from_file() -> Result<String, io::Error> {
    let mut username = String::new();
    File::open("hello.txt")?.read_to_string(&mut username)?;  // 任何一步发生错误，直接返回Err
    Ok(username)
}
```

`?` 运算符被定义为提前返回一个“不合法”的值，使用 `?` 运算符需要函数返回值类型与 `?` 运算符的性质兼容

最常用的两种可以使用 `?` 的类型

- `Result<T, E>`：提前返回 `Err` 值
- `Option<T>`：提前返回 `None` 值

在 `Option<T>` 上使用 `?` 运算符的例子

```rust
// lines()返回一个迭代器，调用next()获取第一个元素，若迭代器中没有元素，则提前返回None
fn last_char_of_first_line(text: &str) -> Option<char> {
    text.lines().next()?.chars().last()
}
```

> rust 中提供了一个 `Try` trait，对于实现了 `Try` trait 的类型，都可以使用 `?` 运算符简化
