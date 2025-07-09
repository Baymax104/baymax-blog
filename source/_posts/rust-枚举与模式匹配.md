---
title: Rust基础——枚举与模式匹配
categories: [Rust]
tags: [Rust]
date: 2024-11-03 02:39
updated: 2025-07-07 01:49
---
## 枚举

使用 `enum` 关键字声明一个枚举类型

```rust
enum IpAddress {
    V4,
    V6
}

let ipv4 = IpAddress::V4;
let ipv6 = IpAddress::V6;
```

枚举类型中的每个成员可以封装不同的数据

```rust
enum Message {
    Quit,
    Move { x: i64, y: i64 },
    Write(String),
    ChangeColor(i32, i32, i32),
}

let quit = Message::Quit;  // 类单元结构体模式
let move1 = Message::Move { x: 1, y: 1 };  // 结构体模式
let write = Message::Write(String::from("hello"));  // 元组结构体模式
let change_color = Message::ChangeColor(1, 2, 3);  // 元组结构体模式
```

枚举类型可以使用 `impl` 块定义关联函数

```rust
impl Message {
    fn show(&self) {
        // ...
    }
}
```

### Option 枚举

rust 使用 `Option` 枚举来实现 null 值的功能，rust 中的非 `Option` 类型一定不为空，`Option` 定义如下

```rust
enum Option<T> {
    None,  // rust中的null值对应到Option::None
    Some(T),
}
```

`Option` 已经包含在 preclude 中，不需要显式引入作用域

```rust
let some_number = Some(5);
let some_string = Some(String::from("hello"));
let empty_number: Option<i32> = None;  // 赋值为None需要声明类型
```

`Option::Some(T)` 类型与非 `Option` 类型不兼容，需要使用模式匹配来获取 `Some` 中的值

## match 匹配

match 可以用于匹配模式，匹配必须是穷尽的

match 匹配用于获取 `Option::Some(T)` 中的值

```rust
let some_number = Some(5);
match some_number {
    Some(n) => {
        // use 'n' variable
    }
    None => {
        // null action
    }
}
```

### 复杂模式匹配

match 匹配可以匹配更加复杂的模式，主要可以匹配字面量、命名变量、数组、元组、结构体、元组结构体、类单元结构体、枚举，以及它们的嵌套

```rust
enum Message {
    Quit,
    Move { x: i64, y: i64, z: i64 },
    Write(String),
    ChangeColor(i32, i32, i32),
    Numbers([i32; 3]),
}

let message = Message::Quit;
match quit {
    Message::Quit => {}  // 类单元结构体
    Message::Move { x: x1, y: 20, z } => {}  // 结构体+命名变量+字面量，使用结构体简化语法
    Message::Write(string) => {}  // 元组结构体+命名变量
    Message::ChangeColor(r, 10, b) => {}  // 元组结构体+命名变量+字面量
    Message::Numbers([a, b, c]) => {}  // 元组结构体+数组+命名变量
}
```

对于不需要匹配的分支，可以使用 `other` 分支进行默认行为

```rust
let n = 10;
match n {
    10 => {}
    other => {}  // 参数命名为other表示默认分支并获取值，可使用'_'占位符忽略值
}
```

match 还支持序列匹配、单分支多模式和卫语句

```rust
let n = 10;
match n {
    10 | 20 => {}  // 对于单个分支匹配多个模式
    30..=50 => {}  // 匹配一个闭区间内的任何一个值，只能用于数值字面量和字符字面量
    other => {}
}

let num = Some(4);
match num {
    Some(x) if x < 5 => println!("less than five: {}", x),  // 注意卫语句匹配和一般匹配的顺序
    Some(x) => println!("{}", x),
    None => (),  // 无返回值
}
```

### if let 表达式

`if let` 表达式可以用于简化 `Option` 匹配，实现只匹配 `Some` 分支而忽略 `None` 分支

```rust
let some_number = Some(5);
if let Some(n) = some_number {
    // use 'n' variable
}

// 也可以添加else if分支和else分支
if let Some(n) = some_number {
    // ...
} else if other_condition_or_matching {
    // ...
} else {
    // ...
}
```

## 模式匹配

rust 中的模式匹配主要实现**判断**和**解构**两个功能

许多类型都可以使用模式匹配进行解构，主要有以下类型

- 命名变量：直接使用一个变量名进行匹配
- 元组：使用 `(variable1, variable2)` 匹配
- 数组：使用 `[variable1, variable2]` 匹配
- 结构体：使用 `Structure { variable1, variable2 }` 匹配
- 元组结构体：使用 `Tuple(variable1, variable2)` 匹配
- 枚举：使用 `Enum::Member` 匹配

> 以上模式可以相互嵌套

### 模式匹配的六种情况

rust 中以下六种情况可以使用模式匹配

- match 分支：实现**判断**和**解构**功能

  ```rust
  match x {
      None => ()
      Some(n) => println!("{n}");
  }
  ```

- `if let` 表达式：实现**判断**和**解构**功能

  ```rust
  if let Some(n) => x {
      println!("{n}");
  }
  ```

- `while let` 条件循环：在匹配成功时执行循环，实现**判断**和**解构**功能

  ```rust
  while let Some(n) = x {
      println!("{n}");
  }
  ```

- for 循环：对遍历的元素使用模式匹配进行解构，实现**解构**功能

  ```rust
  let v = vec!['a', 'b', 'c'];
  for (index, value) in v.iter().enumerate() {
      println!("{value} is at index {index}");
  }
  ```

- let 语句：let 声明变量可以看做一个模式匹配，实现**解构**功能

  ```rust
  // let PATTERN = EXPRESSION;
  let a = 5;
  let (b, c) = (1, 2);
  let Point(x, y, z) = Point(1, 2, 3);
  let Rectangle { width, height } = Rectangle { width: 30, height: 50 };
  ```

- 函数参数：在接收参数时可对参数进行模式匹配，实现**解构**功能

  ```rust
  fn print_coordinates(&(x, y): &(i32, i32)) {
      println!("Current location: ({x}, {y})");
  }
  ```

**模式匹配的忽略变量**

模式匹配中的命名变量可以使用 `_` 占位符忽略一个变量，使用 `..` 忽略多个变量

```rust
let arr = [1, 2, 3];
let [a, b, c] = arr;
let [a, b, _] = arr;  // 忽略一个变量
let [a, ..] = arr;  // 忽略剩余变量
```

### 模式的可反驳性（Refutability）

在 rust 中，模式有两种形式，分别是 refutable（可反驳的）和 irrefutable（不可反驳的）

- irrefutable：模式可以匹配到任何可能值，永远不会失配，则模式称为不可反驳的
- refutable：模式可能会失配，则称为可反驳的

在模式匹配的六种情况可以接受的模式不同

- 函数参数、`let` 语句和 for 循环只能使用不可反驳模式
- `if let` 表达式和 `while let` 循环可以使用两种模式
- match 一般分支必须使用可反驳模式，默认分支使用不可反驳模式，若 match 只有一个分支，则使用不可反驳模式

## @绑定

`@` 运算符可以在匹配字面量模式的同时获取字面量的值

```rust
enum Message {
    Hello { id: i32 },
}

let msg = Message::Hello { id: 5 };

match msg {
    // 匹配结构体字面量，同时创建一个变量接收字面量
    Message::Hello { id: id_variable @ 3..=7 } => {},
    // 匹配结构体字面量，但无法获取字面量
    Message::Hello { id: 10..=12 } => {}
    Message::Hello { id } => {},
}
```
