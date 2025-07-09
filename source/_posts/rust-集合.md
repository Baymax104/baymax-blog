---
title: Rust基础——常用集合
categories: [Rust]
tags: [Rust]
date: 2024-11-07 01:31
updated: 2025-07-07 01:46
banner: /images/rust.png
---
## 开始

本章节介绍 rust 中的三个常用集合

- vector
- String
- HashMap

三种集合在内存分配上遵循相同的模式，即在栈上保存一个固定大小的结构体，其中包含一个指向存储元素的堆内存的指针，**直接赋值时发生所有权移动**

## vector

Vector 表示一个长度可变的数组，是一个类型为 `Vec<T>` 的结构体

**创建 vector**

使用 `new()` 关联函数创建一个空的 vector

```rust
let v: Vec<i32> = Vec::new();
```

使用初始值创建 vector 时，使用 `vec!` 宏，支持类型推断

```rust
let v = vec![1, 2, 3];
```

**访问 vector**

有两种方式可以访问 vector 元素

- 索引访问：索引越界时会抛出 panic

  ```rust
  let v = vec![1, 2, 3];
  let a: i32 = v[0];  // 发生数据移动或拷贝
  let b: &i32 = &v[0];  // 获取元素的不可变引用，遵循借用期规则
  let s: &[i32] = &v[0..2];  // slice引用
  
  let mut v1 = vec![1, 2, 3];
  let c: &mut i32 = &mut v1[0];  // 获取元素的可变引用，遵循借用期规则
  ```

  注意，访问时应该使用引用，**直接访问会发生数据的移动或拷贝**
- `get` 方法：返回 `Option<T>`，数组越界时返回 `None`

  ```rust
  let v = vec![1, 2, 3];
  let a = v.get(0);
  match a {
      Some(n) => {}
      None => {}
  }
  ```

**更新 vector**

使用更新 vector 的方法时，会隐式传入 vector 的可变引用，因此需要声明变量为可变的

- 添加元素

  ```rust
  let mut v = vec![1, 2, 3];
  v.push(1);  // 添加元素
  ```

- 修改元素

  ```rust
  let mut v = vec![1, 2, 3];
  v[0] = 1;
  
  // 通过引用修改
  let a: &mut i32 = &mut v[0];  // 获取可变引用
  *a = 2;  // 解引用后获取引用的值，可访问或修改
  ```

- 删除元素

  ```rust
  let mut v = vec![1, 2, 3];
  let removed = v.remove(0); // 移除第一个元素并返回它
  ```

**遍历 vector**

不可变引用遍历

```rust
let v = vec![100, 32, 57];
for i in &v {
    println!("{i}");
}
```

可变引用遍历

```rust
let mut v = vec![100, 32, 57];
for i in &mut v {
    *i += 50;
}
```

## String

**创建字符串**

```rust
let empty = String::new();  // 创建一个空字符串
let from = String::from("hello");  // 使用字面量创建字符串对象
```

**添加字符串**

```rust
let s = String::new();
let s1 = String::from("world");

// push_str接收一个&str类型参数
s.push_str("hello");  // 添加字符串字面量
s.push_str(&s1);  // 附加其他字符串，不移动所有权

// push接受一个char类型参数
s.push('a');
```

**拼接字符串**

```rust
// 使用+运算符拼接两个字符串
let s1 = String::from("Hello, ");
let s2 = String::from("world!");
let s3 = s1 + &s2; // 注意s1被移动了，不能继续使用

// 使用format!宏拼接字符串
let s1 = String::from("tic");
let s2 = String::from("tac");
let s3 = String::from("toe");
let s = format!("{s1}-{s2}-{s3}");  // 传入引用，不移动所有权
```

> 注意，使用 `+` 运算符实际是调用了 `add` 方法，它的函数签名为 `fn add(self, s: &str) -> String`，左操作数传入值，会**发生所有权移动**，右操作数传入 `&str` 引用，可以接收 String 引用和字符串字面量
{: .prompt-info}

**遍历字符串**

由于 rust 内对于存储的字符串字节支持多种方式来解释（字节、Unicode 标量值等），因此字符串**不支持索引访问**

遍历字符串需要使用字符数组或字节数组的迭代器访问

```rust
// 字符数组迭代器
for c in "hello".chars() {
    println!("{c}");
}

// 字节数组迭代器
for c in "hello".chars() {
    println!("{c}");
}
```

## HashMap

使用 HashMap 需要从模块中引入

```rust
use std::collections::HashMap;
```

**创建 HashMap**

```rust
use std::collections::HashMap;
let map: HashMap<String, i32> = HashMap::new();  // 创建空的HashMap
```

**插入键值对**

```rust
let mut map = HashMap::new();  // 可根据插入数据推断类型
map.insert(10, String::from("hello"));
```

注意，若在插入时传入变量，则会发生数据的移动或拷贝

```rust
let mut map = HashMap::new();
let key = 10;
let value = String::from("hello");
map.insert(key, value);  // key发生拷贝，value发生移动
```

**访问 HashMap**

```rust
let mut map = HashMap::new();
map.insert(String::from("hello"), 20);
let key = String::from("hello");
let value: Option<&i32> = map.get(&key);  // 传入引用，返回Option<&V>
```

**遍历 HashMap**

```rust
// 通过不可变引用遍历
for (key, value) in &map {
    println!("{key}: {value}");
}

// 通过可变引用遍历，value为可变引用
for (key, value) in &mut map {
    println!("{key}: {value}");
}
```

**更新 HashMap**

- 覆盖旧值

    当多次对同一个键调用 `insert` 方法时，新值会覆盖旧值

- 缺失值插入

    使用 `entry` 方法获取键值对，返回 `Entry<K, V>` 枚举，其中包含 `Occupied` 和 `Vacant` 两种状态

    `Entry` 中包含许多原地操作方法，如 `and_modify` 和 `or_insert` 等

    ```rust
    let mut map = HashMap::new();
    map.insert(String::from("a"), 1);
    // 获取键值对后，若为Occupied，返回value可变引用，若为Vacant，则插入指定值，返回value可变引用
    let value: &mut i32 = map.entry(String::from("b")).or_insert(1);
    ```
