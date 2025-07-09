---
title: Kotlin基础——基础语法
categories: [Kotlin, 基础篇]
tags: [Kotlin, Android]
date: 2024-03-08 23:10
updated: 2025-07-07 01:34
---
## 开始

kotlin 的主程序代码结构如下所示

``` kotlin
package com.example.kotlin

import ...

fun main(args: Array<String>) {
}
```

kotlin 代码文件后缀为 `.kt`，kotlin 文件不需要声明所处的包，没有指定包时，默认位于 default 包中

kotlin 已经默认导入了一些包，可以直接使用其中的静态函数

kotlin 支持多种注释

``` kotlin
// 单行注释
/*
多行注释
*/
```

### 变量

可以使用 `var` 和 `val` 声明一个变量，变量类型接在冒号后面

``` kotlin
var a: Int = 3
val b: Int = 5
```

var 用于声明可变变量，val 声明不可变变量

kotlin 支持类型推断

``` kotlin
var a = 3 // a: Int
```

### 数据类型

kotlin 中没有基本数据类型 (primitive type)，所有类型都是对象

- 整数类型：Byte、Short、Int、Long，kotlin 不支持八进制

- 浮点类型：Float、Double，小数字面量默认推断为 Double

    kotlin 不支持小类型隐式转换为大类型 (Float to Double)

    kotlin 中的数值数据类型不支持隐式类型转换，需要调用 `toXXX()` 方法显式转换

- 字符：Char，Kotlin 中的 Char 与 Int 同样不能隐式类型转换

- 布尔：Boolean

- 字符串：String，String 不可变，重载了 [] 获取其中的字符

    - 多行字符串：使用三引号 `'''` 可以创建多行字符串
    - 字符串模板：在字符串中可以使用 `$value`，在字符串中填充 value 值，长的表达式用大括号括起来 `${}`

---

JVM 平台的基本类型

对于基本类型，jvm 平台类型为 primitive-type(int,float,double,char,boolean)

- 当创建数值类型的可空引用或使用泛型时，kotlin 会使用 java 的包装类来实现这些基本类型的可空类型 (自动装箱为包装类)
- 当创建不可空引用时，kotlin 会使用 primitive-type

### 数组

kotlin 中的数组都是 Array 类型，通过泛型指定类型，对于 primitive-type，kotlin 提供了相应的 Array(IntArray、FloatArray 等)，可以省去装箱开销。**Array 类型不支持协变**

kotlin 中的数组自带一个 size 属性，以及重载了 [] 为 getter 和 setter

创建数组方法

- arrayOf 方法：传入可变参数
- Array 构造函数：传入数组大小和一个初始化函数闭包

### 区间

操作符和函数

- `in` 判断某个值是否在指定区间内，`!in` 为非逻辑

- `..` 操作符：定义一个正向区间，`a..b` 表示 [a,b]

- until 中缀函数：定义一个正向半开区间，`a util b` 表示 [a,b)

- downTo 中缀函数：定义一个反向区间，`a downTo b` 表示 [a,b] 逆序

- step 中缀函数：由区间对象调用，设置区间对象的步进大小，返回一个 XXXProgression 对象

    区间对象不存储步进信息，只表示范围，所以调用后会使用区间创建一个 XXXProgression 对象并设置步进

区间本质是一个 `ClosedRange<T>` 对象 (对于原始类型，对应 IntRange 等类型，避免装箱)，其中包含一些操作方法

区间操作符支持所有可比较类型，内部使用了比较运算符进行比较，比较运算符会转换为 compareTo 方法，因此对于自定义类型，需要实现 Comparable 接口。对于自定义类型，**只支持..操作符**

当区间对象用于遍历时，使用的是区间对象的 iterator 方法获取一个迭代器，自定义类型区间对象没有 iterator 方法，因此需要自己实现自定义类型的迭代器

### 比较运算符

与 java 比较运算符类似，由于 kotlin 的类型都是对象，因此比较都是基于 compareTo 方法，当使用比较运算符时会自动转换为 compareTo 方法，对于自定义类型，可以实现 Comparable 接口

相等运算符

- `==`：比较对象的值
- `===`：比较对象的地址

## NULL 安全检查

kotlin 中的对象总体分为可空对象和不可空对象，默认为不可空对象，若要使用可空对象，需要在类型后添加?

``` kotlin
val a: Int = 20
val b: Int? = null
```

可空调用：对可空对象调用其方法和属性时需要显式声明

``` kotlin
var str: String?
var length: Int? = str?.length // 当str为空时不调用返回null，length为可空对象
```

强制为不可空

``` kotlin
var len: Int = str!!.length // 当str为空时会抛出NPE
```

空判断赋值

``` kotlin
var len: Int = str?.length ?: -1 // 当?:前不为null时取前面的值，否则取后面的值
```

在与 Java 互操作的实践中，私以为还是把从 Java 传到 kotlin 的对象全部看做可空类型比较好，因为无法保证 Java 传入的对象一定是非空的。要注意 Java 传入对象时，IDE 可能会提示类型是非空的，这时还是需要按可空来处理（好一点的时候会提示为平台类型）

### 类型转换与类型检查

#### is 运算符与空判断

使用 is 运算符可以检查某个对象是否为某个类型

在进行空判断后，对象会自动转换为不可空类型和可空类型

``` kotlin
var obj: Any
if (obj is String) {
    // 使用is运算符后，在该块中，obj会自动转换为String
}
// 在块外部，obj依然是Any类型
var obj1: String?
if (obj1 == null) {
    // 进行空判断后，obj1在该块中为可空类型
}
// 在块外会自动转换为不可空类型
```

#### 转换操作符 as

若两个类型具有继承关系时，子类对象可以直接赋值给父类引用，父类引用通过 as 关键字转换为子类引用

``` kotlin
val person: Person = Student()
val student: Student = person as Student
```

直接使用 as 操作符是不安全的，当 person 为可空类型并且值为 null 时，转换会失败，并且抛出 NPE

``` kotlin
val person: Person? = Student()
val student: Student? = person as Student?  // 转换为可空类型
val student1: Student? = person as? Student  // 使用安全的转换操作符
```

as 操作符可以在导入同名类时，将其中一个类进行重命名，这个用到的地方不多

### 可空与不可空原理

kotlin 的可空与不可空检查发生在编译时和运行时

kotlin 允许不可空对象赋值给可空引用，不允许可空对象赋值为不可空引用

``` kotlin
var a: Int = 10
var b: Int? = a  // 编译通过

var a: Int? = 10
var b: Int = a  // 编译错误
var b: Int = a ?: -1  // 空判断赋值
```

当将一个不可空对象赋值给一个可空引用时，会将不可空对象的引用**浅拷贝**到可空引用，不会创建新的对象，这两个引用指向同一个对象 (`a === b = true`)

## 流程控制

kotlin 中几乎所有语句都可以作为表达式

### if 语句

if 语句支持表达式，在每个分支中的最后一个表达式作为该分支的返回值

当 if 作为表达式时，else 分支必须存在

``` kotlin
val x = if (condition) value1 else value2
val y = if (condition) {
    println(...)
    value1
} else {
    println(...)
    value2
}
```

### when 语句

``` kotlin
// 与switch类似
when(variable) {
    value1 -> {
        // statement
    }
}

// when语句可以作为表达式
val x = when(variable) {
    value1 -> {
        // statement
        // expression
    }
    value2 -> {
        // statement
        // expression
    }
    // 当when作为表达式，variable没有全部枚举时，必须添加else
    else -> {
        // statement
        // expression
    }
}

// 多值匹配、表达式匹配、区间匹配、类型匹配
when(variable) {
    value1, value2 -> {
        // statement
    }
    // 表达式的返回值必须与variable类型相同
    expression -> {
        // statement
    }
    in start..end -> {
        // statement
    }
    // 在该块中variable被自动转换为String
    is String -> {
        // statement
    }
}

// if-else形式
// 此时when语句没有参数
when {
    // condition为布尔表达式
    condition -> {
        // statement
    }
    else -> {
        // 必须有else语句
    }
}

// 引入临时变量
when (val v = expression) {
    // 变量v只用于when块中
    // ...
}
```

### for 语句

kotlin 的 for 循环为 for-in，支持所有提供了 Iterator 的对象的遍历

``` kotlin
for (item in collection) {
    // use item
}
// 数字区间遍历，i为隐式名称
for (i in start..end) {
    // statement
}
```

通过数组索引遍历集合

``` kotlin
for (i in arr.indices) {
   	// statement
}
for ((index, item) in arr.withIndex())
```

### 控制关键字

break 和 continue 与 java 中的作用相同

kotlin 的任何表达式都可以设置一个标签，格式为 `label@`，可以引用标签进行流程控制，引用格式为 `@label`

每个函数拥有一个同名的隐式标签，通常使用隐式标签，任何表达式都可以设置一个标签，但不一定能够引用它，没有设置标签时，通过隐式标签引用

标签通常用于 return、continue、break，但不是所有表达式都具有作用域并且能够返回，因此不是所有表达式的标签都能用于 return、continue、break

#### break 标签、continue 标签

``` kotlin
loop@ for (i in 1..100) {
    for (j in 1..100) {
        break@loop
        // continue@loop
    }
}
```

#### return 标签

return 默认从最内层的函数作用域和匿名函数中返回，使用标签可以返回到外部的作用域

- 普通函数/匿名函数：任何函数都可以使用标签进行返回 `return@label value`，但不是所有函数都能设置自定义标签，只有能够作为表达式的函数才能设置标签，通常直接使用 return

    ``` kotlin
    // 顶层函数，不是表达式
    fun f() {
        return@f
    }
    // 成员函数，不是表达式
    class Person {
        fun say() {
            return@say
        }
    }
    // 局部函数，可以设置标签
    fun outer() {
        inter@ fun inter() {
            return@inter
        }
    }
    // 匿名函数，可以设置标签
    val f: () -> Unit = unnamed@ fun () {
        return@unnamed
    }
    ```

- lambda 表达式：lambda 表达式不支持使用 return 从 lambda 中返回，因此要实现从 lambda 中返回需要使用标签

    ``` kotlin
    val f: () -> Unit = f@ {
        return@f  // 不使用标签直接return结束f所在的作用域无法实现，已经不允许直接使用return
    }
    ```

## 异常

kotlin 的所有异常类都是 Throwable 的子类，kotlin 中同样有 try-catch-finally，作用与 java 相同，**kotlin 的所有异常都是运行时异常**

try 可作为表达式，表达式的类型为 Nothing

``` kotlin
val x = try {
    // statement
    // expression
} catch(Throwable e) {
    // statement
    // expression
} finally {
    // finally中不支持表达式返回值
}
```

Nothing 类型通常表示一个函数永远不会返回或者一个集合为空

``` kotlin
// 直接抛出异常，函数永远没有返回值
fun method(): Nothing {
    throw ...
}
var list: List<Nothing> = listOf()
```
