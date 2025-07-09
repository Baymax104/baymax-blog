---
title: Rust基础——开始
categories: [Rust]
tags: [Rust]
date: 2024-10-31 00:58
updated: 2025-07-07 01:52
---
## 开始

Rust 是一种系统级编程语言，旨在提供内存安全、并发性和高性能。它通过严格的所有权模型来避免常见的内存错误，如空指针解引用和数据竞争，使得开发者能够编写安全可靠的代码

**注释**

- `//`：单行注释
- `/**/`：块注释

## 变量

变量使用 `let` 关键字声明，分为可变变量和不可变变量，常量使用 `const` 关键字声明

声明变量时，rust 支持自动推断变量类型

```rust
let a = 10;  // 可变变量
let mut b = 20;  // 不可变变量
const C: i32 = 30;  // 常量
```

**变量覆盖**

在同一作用域内，使用 `let` 声明一个同名变量时，会覆盖之前的变量

在再次声明同名变量时，可以使用已存在的同名变量进行赋值

```rust
let a: i32 = 10;
let a: String = a.to_string();
println!("{a}");
```

## 数据类型

rust 的数据类型分为两类，分别是标量类型（基本数据类型）和复合类型（集合类型）

### 标量类型

rust 的标量类型包含整数、浮点数、字符和布尔值

**整数**

分为有符号数和无符号数，对于不同的长度有指定的类型

整数的默认类型为 `i32`

| 长度       | 有符号  | 无符号  |
| ---------- | ------- | ------- |
| 8-bit      | `i8`    | `u8`    |
| 16-bit     | `i16`   | `u16`   |
| 32-bit     | `i32`   | `u32`   |
| 64-bit     | `i64`   | `u64`   |
| 128-bit    | `i128`  | `u128`  |
| 由架构决定 | `isize` | `usize` |

**浮点数**

浮点数有 `f32` 和 `f64`，浮点数默认类型为 `f64`，所有浮点数都是有符号数

**进制表示**

| 数字字面值                    | 例子          |
| ----------------------------- | ------------- |
| Decimal (十进制)              | `98_222`      |
| Hex (十六进制)                | `0xff`        |
| Octal (八进制)                | `0o77`        |
| Binary (二进制)               | `0b1111_0000` |
| Byte (单字节字符)(仅限于 `u8`) | `b'A'`        |

**布尔值**

布尔值有 `true` 和 `false`

**字符**

使用 `''` 声明字符字面量，rust 的字符大小为 4 个字节，支持 Unicode 字符

### 复合类型

rust 中原生包含元组（tuple）和数组（array）两种复合类型

- 元组：长度固定，元素固定，可以包含多种不同类型的值

    ```rust
    // 元组的类型为(type1, type2, type3)
    let x: (i32, f64, u8) = (500, 6.4, 1);
    
    // 使用.访问元素
    let five_hundred = x.0;
    let six_point_four = x.1;
    let one = x.2;
    
    // 元组支持解构赋值
    let (y1, y2, y3) = x;
    ```

    不含元素的元组的类型为 `()`，表示空值和空返回值，若表达式不返回任何值，默认返回 `()`

- 数组：长度固定，元素不固定，元素的类型必须相同

    ```rust
    // 数组的类型为[type; length]
    let a: [i32; 5] = [1, 2, 3, 4, 5];
    
    // 使用[]访问元素
    let first = a[0];
    let second = a[1];
    ```

    创建相同值的数组

    ```rust
    let a: [i32; 5] = [3; 5]  // 等价于let a = [3, 3, 3, 3, 3]
    ```

## 函数

使用 `fn` 关键字声明一个函数，必须声明参数列表类型和返回值类型

```rust
fn add(a: i32, b: i32) -> i32 {
    return a + b;
}
```

### 语句和表达式

- 语句：执行一些操作并不返回值，需要以 `;` 结尾

    ```rust
    let a = (let b = 10);  // 语法错误，let是一个语句
    ```

- 表达式：执行操作并返回值

    ```rust
    // 一个代码块是一个表达式，可以赋值给a
    let a = {
        let b = 10;
        b + 1
    }
    ```

### 尾表达式

一个代码块的最后一行可以使用一个表达式作为返回值，在函数中可以省略 return，尾表达式不以 `;` 结尾

```rust
let a = {
    let b = 10;
    b + 1  // 尾表达式的结果作为代码块的返回值
}

fn add(a: i32, b: i32) -> i32 {
    a + b  // 尾表达式作为函数的返回值
}
```

## 控制流

rust 支持 if 条件判断以及 loop、while、for 三种循环

### if 条件判断

if 后的条件不带括号，条件必须是 `bool` 值，整数不会进行隐式转换

```rust
if condition {
    statements;
} else if condition1 {
    statements;
} else {
    statements;
}
```

**if 表达式**

if 可以作为一个表达式赋值给变量，必须包含 else 分支，每个分支的表达式结果必须是相同类型

```rust
let b = if a > 10 { 3 } else if a < 0 { 3 } else { 2 };
```

### loop 循环

loop 循环是一个无限循环，等价于 `while (1)`，可使用 `break` 和 `continue` 来控制循环

```rust
loop {
    println!("again!");
    if a == 10 {
        break;
    }
};
```

**loop 表达式**

loop 块可作为一个表达式，通过 `break` 来返回值

```rust
let mut counter = 0;
let result = loop {
    counter += 1;
    if counter == 10 {
        break counter * 2;
    }
};  // 作为表达式时，必须以;结尾
```

**循环标签**

在嵌套循环时，break 和 continue 默认控制最内层的循环，循环标签可用于控制外层循环

```rust
fn main() {
    let mut count = 0;
    // 循环标签以'开头，:结尾，放在循环块之前
    'counting_up: loop {
        println!("count = {count}");
        let mut remaining = 10;

        loop {
            println!("remaining = {remaining}");
            if remaining == 9 {
                break;  // 该break语句会跳出最内层循环
            }
            if count == 2 {
                break 'counting_up;  // 该break语句会跳出指定标签的循环
            }
            remaining -= 1;
        }

        count += 1;
    }
    println!("End count = {count}");
}
```

### while 循环

与其他语言类似

```rust
while condition {
    statements;
}
```

### for 循环

rust 使用 `for-in` 循环

```rust
let a = [10, 20, 30, 40, 50];
for element in a {
    println!("the value is: {element}");
}
```

当需要数字序列时，可使用 `Range` 类型，使用 `start..end` 创建一个 `Range` 字面量，范围为左闭右开

```rust
for number in 1..4 {
    println!("{number}");
}
```
