---
title: 格式化输出
categories: [Rust]
tags: [Rust]
date: 2025-09-01 11:09
updated: 2025-09-01 11:09
banner: /assets/banner/rust.png
wiki: rust
---
## 格式化输出宏

rust 中主要使用三个宏进行格式化

- `print!`：将格式化字符串输出到控制台，不换行
- `println!`：将格式化字符串输出到控制台，换行
- `format!`：返回格式化字符串

简单用例如下

```rust
fn main() {
    let name = "Rust";
    print!("Hello, {}", name);
    
    let age = 20;
    println!("Age is {}", age);
    
    let s = format!("Hello, {}!", name);
}
```

> 此外，还有 `eprint!` 和 `eprintln!` 输出到标准错误输出

## 格式化占位符

rust 中只有 `{}` 和 `{:?}` 两种格式化占位符

- `{}`：用于实现了 `std::fmt::Display` 特征的类型
- `{:?}`：用于实现了 `std::fmt::Debug` 特征的类型

    `{:#?}` 与 `{:?}` 几乎相同，但是具有更优美的输出格式

## 实现 `Display` 特征

rust 中大部分类型没有实现 `Display` 特征，要获得格式化输出需要实现 `Display` 特征

### 自定义类型实现 `Display` 特征

实现 `Display` 特征中的 `fmt` 函数，调用 `write!` 将格式化文本写入缓冲区

```rust
struct Person { name: String, age: u8, }

use std::fmt;
impl fmt::Display for Person {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "Person(name={}, age={})", self.name, self.age)
    }
}

fn main() {
    let p = Person { name: "sun".to_string(), age: 18, };
    println!("{}", p);
}
```

### 外部类型实现 `Display` 特征

为外部类型实现 `Display` 特征，需要使用 newtype 模式

```rust
struct Array(Vec<i32>);

use std::fmt;
impl fmt::Display for Array {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "数组是：{:?}", self.0)
    }
}
fn main() {
    let arr = Array(vec![1, 2, 3]);
    println!("{}", arr);
}
```

## 占位符参数

可以通过位置参数和具名参数指定占位符替换的值

**位置参数**

`{}` 按照顺序替换占位符，使用索引时，索引从 0 开始

```rust
fn main() {
    println!("{}{}", 1, 2); // =>"12"
    println!("{1}{0}", 1, 2); // =>"21"
    // => Alice, this is Bob. Bob, this is Alice
    println!("{0}, this is {1}. {1}, this is {0}", "Alice", "Bob");
    println!("{1}{}{0}{}", 1, 2); // => 2112
}
```

**具名参数**

直接通过参数名指定

```rust
fn main() {
    println!("{argument}", argument = "test"); // => "test"
    println!("{name} {}", 1, name = 2); // => "2 1"
    println!("{a} {c} {b}", a = "a", b = 'b', c = 3); // => "a 3 b"
}
```

## 格式化参数

详见 [格式化输出](https://course.rs/basic/formatted-output.html#%E6%A0%BC%E5%BC%8F%E5%8C%96%E5%8F%82%E6%95%B0)
