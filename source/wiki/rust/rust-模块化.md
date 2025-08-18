---
title: 模块化
categories: [Rust]
tags: [Rust]
date: 2024-11-03 17:31
updated: 2025-07-07 01:49
banner: /assets/banner/rust.png
wiki: rust
---
## 开始

rust 的模块化包含以下概念

- 包：一个包包含多个 crates，每个包都有一个 `Cargo.toml` 文件，一个包可以看做一个项目
- crates：一个 crates 是一个编译单元，可以是一个可执行文件或一个库
- 模块：一个模块表示一个命名空间，一个 crates 中包含多个模块，可以控制模块的可访问性
- 路径：访问一个模块或模块成员的方式，使用 `::` 作为分隔符

## 包和 crate

crate 有两种形式

- 二进制项：二进制项可以被编译为一个可执行文件，必须包含一个 `main` 函数
- 库：库没有 `main` 函数，其中定义一些类型或函数，可供其他 crate 使用

一个包可以看做一个项目，使用 `cargo new` 命令创建，其中包含一个 `Cargo.toml` 文件，用于管理依赖

一个包中至少包含一个 crate，最多包含一个库 crate，可以包含任意多个二进制 crate

每个 crate 都至少有一个根模块 `crate`，也称为 crate 根，cargo 有以下默认约定

- `src/main.rs`：与包同名的二进制 crate 根
- `src/lib.rs`：与包同名的库 crate 根
- `src/bin`：存放其他的二进制 crate

## 模块

一个模块可以看做一个命名空间

- 使用 `mod` 关键字声明一个**子模块**
- 使用 `pub` 关键字控制模块的可访问性
- 使用 `use` 关键字引入模块

### 模块组织形式

一个 crate 中的模块被组织成一个树形结构，支持**内联**和**多文件**两种形式

- 内联：使用 `mod` 关键字声明一个模块后，紧跟一个代码块，在代码块中编写模块的代码

  ```rust
  // 通过crate::module访问module模块
  // 通过crate::module::submodule访问子模块
  mod module {
      struct Tuple(i32, i32);
      fn foo(x: i32, y: i32) {}
      
      mod submodule {
          fn foo(x: i32, y: i32) {}
      }
  }
  ```

- 多文件：利用文件树的形式，在父模块中使用 `mod` 关键字声明一个子模块，cargo 会在子目录中查找子模块

  ```
  src
  ├──module  // 与module.rs同名
  │  └──submodule.rs
  ├──main.rs
  └──module.rs
  ```

  - `main.rs` 中使用 `mod module;` 声明 module 子模块，cargo 会查找 `module.rs`
  - `module.rs` 中使用 `mod submodule;` 声明 submodule 子模块，cargo 会查找 `module/submodule.rs`
  - 使用 `crate::module` 访问 module 模块，使用 `crate::module::submodule` 访问 submodule 模块

**内联**和**多文件**两种形式可以混合使用

将 `submodule.rs` 中的模块代码以内联形式移动到 `module.rs` 中

```rust
// 依然使用crate::module::submodule访问submodule
mod submodule {
    fn foo(x: i32, y: i32) {}
}

struct Tuple(i32, i32);
fn foo(x: i32, y: i32) {}
```

### 模块可访问性

在默认情况下，模块内的成员是私有的,一个模块可以直接访问模块内的成员，子模块可以访问父模块中的成员

```rust
// src/module.rs
mod submodule {
    fn foo(x: i32) {
        super::foo(3);  // 使用super关键字引用父模块
    }
}
struct Structure;
fn foo(x: i32) {
    let s = Structure;  // 可直接访问模块内的成员
    submodule::foo(2);  // 不合法，可以直接访问submodule，但无法访问submodule的成员foo
}
```

使用 `pub` 关键字将其变为公有

```rust
// src/module.rs
pub mod submodule {
    fn foo(x: i32) {}
}
pub struct Structure;
pub fn foo(x: i32) {}
```

此时，`submodule` 子模块、`Structure` 结构体和 `foo` 函数作为模块内的成员，对外部是可见的，但 `submodule` 子模块内的成员依然对 `submodule` 是私有的，若需要外部访问 `submodule` 子模块内的成员，依然使用 `pub` 关键字修饰

```rust
// src/module.rs
pub mod submodule {
    pub fn foo(x: i32) {}
}
pub struct Structure;
pub fn foo(x: i32) {}
```

`pub` 关键字还可以控制结构体成员和枚举成员的可访问性

- 结构体成员默认为私有的，可以用 `pub` 修饰变为公有

  ```rust
  pub struct Breakfast {
      pub toast: String,
      seasonal_fruit: String,  // seasonal_fruit为私有字段
  }
  
  impl Breakfast {
      // 公有关联函数
      pub fn summer(toast: &str) -> Breakfast {
          Breakfast {
              toast: String::from(toast),
              seasonal_fruit: String::from("peaches"),
          }
      }
  }
  ```

- 枚举成员默认为私有的，一旦枚举类型用 `pub` 修饰变为公有，则所有成员变为公有

  ```rust
  pub enum Appetizer {
      Soup,
      Salad,
  }
  ```

### 引入模块

**绝对路径与相对路径**

使用 `use` 关键字引入一个模块或模块成员，在引入时的路径格式为 `A::B::C`，有两种形式

- 绝对路径：以根模块 `crate` 开始

  ```rust
  use crate::module::submodule;
  ```

- 相对路径：默认以当前模块开始，`self` 关键字表示当前模块，`super` 关键字表示父模块

  ```rust
  // 当前模块为src/module.rs
  use submodule::foo;  // 对应绝对路径为crate::module::submodule::foo
  use self::submodule;  // 对应绝对路径为crate::module::submodule
  use super::other_module;  // 对应绝对路径为crate::other_module
  ```

**`use` 关键字**

使用 `use` 引入的惯用做法

- 对于模块中的函数，引入到模块级别

  ```rust
  mod front_house {
      pub mod hosting {
          pub fn add_waitlist() {}
      }
  }
  
  use front_house::hosting;  // 调用hosting::add_waitlist();
  ```

- 对于模块中的类型，引入到成员级别

  ```rust
  mod front_house {
      pub mod hosting {
          pub struct House;
      }
  }
  
  use front_house::hosting::House;  // 直接使用House类型
  ```

`use` 引入的模块或模块成员**只在当前模块中可见**

```rust
mod front_house {
    pub mod hosting {
        pub fn add_waitlist() {}
    }
}

use front_house::hosting;

// 只作用在当前模块中
fn foo() {
    hosting::add_waitlist();
}

mod customer {
    pub fn eat() {
        hosting::add_waitlist();  // 不合法，在customer模块中不能直接访问引入的hosting
    }
}
```

若需要外部访问当前模块中引入的模块或模块成员，可以使用 `pub use` 重导出

```rust
pub use front_of_house::hosting;
```

当引入发生名称冲突时，使用 `as` 关键字为某个名称起别名

```rust
use std::fmt::Result;
use std::io::Result as IoResult;
```

`use` 引入支持**嵌套路径**和**通配符**

```rust
mod front_house {
    
    pub mod hosting {
        pub struct House;
        
        pub mod serving {
            pub fn serve() {}
        }
    }
    
    pub fn foo() {}
    
    pub mod eating {
        pub fn eat() {}
    }
}

use front_house::{
    foo,  // 引入foo函数
    eating::*,  // 使用通配符引入eating模块中的所有公有成员，不包含eating本身
    // 嵌套路径
    hosting::{
        self,  // 使用self关键字引入hosting模块本身
        House,  // 引入House结构体
        serving,  // 引入子模块
    }
};
```

> 注意，在直接路径中，`self` 和 `super` 只能用于路径开头，而在嵌套路径中，`self` 多了一个引入某一级模块本身的功能
