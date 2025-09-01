---
title: 生命周期
categories: [Rust]
tags: [Rust]
date: 2025-07-05 22:16
updated: 2025-07-06 03:40
banner: /assets/banner/rust.png
wiki: rust
---
## 开始

生命周期就是引用的有效作用域，用于避免悬垂引用问题

例如以下代码中，变量 r 引用了 x，但退出代码块后，x 被销毁，此时 r 引用了被销毁的值，产生了悬垂引用

```rust
{
    let r;                // ---------+-- 'a
                          //          |
    {                     //          |
        let x = 5;        // -+-- 'b  |
        r = &x;           //  |       |
    }                     // -+       |
                          //          |
    println!("r: {}", r); //          |
}                         // ---------+
```

从生命周期的角度，当一个生命周期较大的变量引用了一个生命周期比它小的变量，就产生了悬垂引用，因此，避免悬垂引用问题的目标就是使引用变量的生命周期尽可能小

一般情况下，rust 会自动推导生命周期，但在一些特殊情况下，需要手动标注生命周期

**生命周期标注不改变任何引用的实际作用域**

生命周期标注仅仅是声明一个约束，它不会改变任何引用的实际作用域，当使用声明了生命周期的引用或函数，若不满足约束，编译期会抛出错误

## 标注语法

使用 `'` 加一个小写字母表示一个生命周期，通常使用 `'a`

```rust
&i32         // 一个引用
&'a i32      // 具有显式生命周期的引用
&'a mut i32  // 具有显式生命周期的可变引用
```

在函数签名中，需要在泛型的尖括号中声明生命周期标注

```rust
fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() > y.len() {
        x
    } else {
        y
    }
}
```

在结构体中使用引用作为字段，需要显式标注生命周期

```rust
struct ImportantExcerpt<'a> {
    part: &'a str,
}

impl<'a> ImportantExcerpt<'a> {
    fn level(&self) -> i32 {
        3
    }
}
```

## 理解生命周期标注

在 rust 中，每个引用的生命周期需要一个限制来源来限制引用的最大作用域，要么受变量限制，要么受另一个引用限制

例如以下代码，引用的生命周期受变量限制

```rust
fn main() {
    let x = 5;
    let r = &x;  // r的生命周期受x限制
    println!("r: {r}");
}
```

在以下代码中，引用的生命周期受另一个引用限制

```rust
fn first_word(s: &str) -> &str {
    &s[0..2]  // 返回的引用的生命周期受参数s的限制
}
```

以上情况都不需要显式标注生命周期，而在某些情况，编译器无法在编译期确定引用的限制来源，因此需要生命周期标注来“关联”生命周期，例如以下代码

```rust
fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() > y.len() {
        x
    } else {
        y
    }
}
```

若不使用生命周期标注，则返回值引用的生命周期可能受 x 限制，也可能受 y 限制，无法在编译期确定返回值的生命周期限制来源

使用生命周期标注后，在 x、y 和返回值上标注相同的生命周期 `'a`，表示返回值的生命周期受 x 和 y 共同限制，返回值引用仅在 x 和 y 都有效时有效

在以下代码中，x 和 y 标注了不同的生命周期

```rust
fn split<'a, 'b>(x: &'a str, y: &'b str) -> &'a str {
    &x[0..2]
}
```

返回值的生命周期标注与 x 相同，表示它的生命周期受 x 限制，函数的实际返回值也来源于 x，因此可以编译成功

若将返回值的生命周期标注修改为与 y 相同，则与实际返回值不相符，编译失败

```rust
// 编译失败
fn split<'a, 'b>(x: &'a str, y: &'b str) -> &'b str {
    &x[0..2]
}
```

> 结构体的生命周期标注与函数同理，表示结构体的生命周期受其中的引用类型字段限制
>
> ```rust
> struct ImportantExcerpt<'a> { 
>     part: &'a str,  // 字段的生命周期必须大于等于结构体的生命周期
> }
> ```

## 生命周期省略规则

编译器根据以下规则为函数的参数和返回值标注生命周期，若参数和返回值都被合理地标注了生命周期，则不需要在代码中显式地标注生命周期

1. 为每一个参数标注不同的生命周期
2. 若函数只有一个参数，则所有返回值的生命周期标注与该参数相同
3. 若函数中包含 `&self` 或 `&mut self`，则所有返回值的生命周期标注与 `&self` 相同

> 参数的生命周期被称为输入生命周期，返回值的生命周期被称为输出生命周期

下面用两个例子来理解这三条规则

```rust
fn fun1(s: &str) -> &str
```

编译期依次执行三条规则

1. 为每一个参数标注不同的生命周期

    ```rust
    fn fun1<'a>(s: &'a str) -> &str
    ```

2. 若函数只有一个参数，则所有返回值的生命周期标注与该参数相同

    ```rust
    fn fun1<'a>(s: &'a str) -> &'a str
    ```

此时，所有的参数和返回值都被合理地标注了生命周期，不需要在代码中显式地标注生命周期

再看下面的代码

```rust
impl<'a> Structure<'a> {
    fn method(&self, x: &str) -> &str {
        // ...
    }
}
```

1. 为每一个参数标注不同的生命周期

    ```rust
    impl<'a> Structure<'a> {
        fn method<'b>(&'a self, x: &'b str) -> &str {
            // ...
        }
    }
    ```

2. 若函数只有一个参数，则所有返回值的生命周期标注与该参数相同

    不符合，跳过

3. 若函数中包含 `&self` 或 `&mut self`，则所有返回值的生命周期标注与 `&self` 相同

    ```rust
    impl<'a> Structure<'a> {
        fn method<'b>(&'a self, x: &'b str) -> &'a str {
            // ...
        }
    }
    ```

此时，所有参数和返回值都被合理地标注了生命周期，不需要在代码中显式地标注生命周期

## 生命周期绑定

在某些情况下，我们需要函数返回值与参数具有不同的生命周期标注，并且在逻辑上合理的，此时就需要生命周期绑定来进行额外的声明

对于以下编译失败的代码

```rust
fn split<'a, 'b>(x: &'a str, y: &'b str) -> &'b str {
    &x[0..2]
}
```

返回值是 x 的引用，且生命周期标注为 `'b`，而 x 的标注为 `'a`，若此时我们能够规定生命周期 `'b` 比 `'a` 小，那么在函数调用处，返回值的作用域就比参数 x 的作用域小，不会出现悬垂引用

可以使用生命周期绑定来规定这种关系

```rust
// 使用类似泛型约束的语法来规定生命周期标注之前的关系
fn split<'a: 'b, 'b>(x: &'a str, y: &'b str) -> &'b str {
    &x[0..2]
}
```

生命周期绑定可以写在 `where` 约束中

```rust
fn split<'a, 'b>(x: &'a str, y: &'b str) -> &'b str
where 'a: 'b
{
    &x[0..2]
}
```

## 静态生命周期

程序中的某些数据在整个程序内都有效，对于它们的引用在整个程序内也是有效的，这些引用就具有 `'static` 生命周期

**具体是指可以在程序内的任何地方引用这些数据，而引用变量本身依然遵循作用域规则**

rust 中的字符串字面量被硬编码进二进制可执行文件中，因此所有对字符串字面量的引用都具有 `'static` 生命周期

```rust
let s: &'static str = "Hello World";
```

## 泛型的生命周期约束

可以在泛型约束中添加生命周期约束

```rust
fn takes_static<T: 'static>(item: T) { 
    println!("Got something that lives forever!"); 
}
```

这表示当 T 是一个引用类型时，它必须具有 `'static` 生命周期，否则，约束不生效

```rust
fn takes_static<T: 'static>(item: T) {
    println!("Got something that lives forever!");
}

fn main() {
    takes_static(42);  // 传入类型T为i32，约束不生效
    takes_static(String::from("hi"));  // 传入类型T为String，约束不生效
    
    // 传入类型T为&i32，约束生效，数值字面量引用具有'static生命周期
    takes_static(&42);
    // 传入类型T为&str，约束生效，字符串字面量引用具有'static生命周期
    takes_static(&"Hello World");
    // 传入类型T为&String，约束生效，String类型引用不具有'static生命周期
    takes_static(&String::from("hi"));
}
```

当参数类型为 `&T` 时，生命周期约束失效

```rust
// 参数必须是一个引用类型
fn takes_static<T: 'static>(item: &T) {
    println!("Got something that lives forever!");
}

fn main() {
    takes_static(&42);  // 传入类型T为i32，约束不生效
    takes_static(&"Hello World");  // 传入类型T为str，约束不生效
    takes_static(&String::from("hi"));  // 传入类型T为String，约束不生效
}
```
