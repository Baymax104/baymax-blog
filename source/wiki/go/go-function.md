---
title: 函数
categories: [Go, Golang]
tags: [Go, Golang]
date: 2026-01-16 02:34
updated: 2026-03-20 18:18
wiki: go
---
## 开始

go 中有三种类型的函数

- 顶层函数
- 匿名函数（lambda 函数）
- 方法

基本函数定义

```go
func fun(param1 type1, param2 type2) (ret1 type1, ret2 type2) {
    // ...
}
```

其函数类型表示为 `fun (type1, type2) (type1, type2)`

对于多个相同类型的参数，可以只保留最后一个参数的类型声明

```go
func myFunc(x, y int) (ok bool, a, b int, err error) {
    // ...
}
```

函数是“一等公民”，可以将其赋值或传递

```go
type MyAdd func (int, int) int

func test(a string) string {
    return a
}

var testFunction func (string) string = test
```

> go 函数不支持函数重载，不支持泛型

## 参数传递

go 函数传递参数有按值传递和按引用传递两种形式

```go
func change(a int, b *int) {
    a = 5  // 不会修改原始值
    *b = 5  // 通过指针修改原始值
}
```

对于基本类型，go 默认使用的是按值传递，但对于切片、字典、接口、通道等引用类型，默认使用的是按引用传递

## 命名返回值

go 函数支持对返回值进行提前命名，同时将返回值初始化为相应类型的零值

```go
func add(a int, b int) (c int) {
    // c初始化为零值
    c = a + b  // 赋值为a + b
    return  // 必须有return语句，但不需要显式返回c
    // return 5  // 可以无视命名返回值，返回相同类型的值
}
```

## 多返回值

go 函数支持返回多个值

```go
func add1(a int, b int) (int, int) {
    return a, b
}

func add2(a int, b int) (c int, d int) {
    c = a
    d = b
    return
}
```

在接收函数返回值时可以使用 `_` 丢弃不需要的值

```go
func test() (int, int, int) {
    return 1, 2, 3
}

var a, _, b = test()
```

## 变长参数

go 函数可以指定**最后一个参数**为变长参数，在函数中表现为数组类型

```go
func sum(i ...int) int {
	var s int
	// i可以看做int数组
	for number := range i {
		s += number
	}
	return s
}

var s = sum(1, 2, 3)
```

## defer

`defer` 关键字可以将函数中的语句推迟到函数返回后执行

```go
func main() {
    num := 10
    defer fmt.Println("defer 执行 num: ", num)
    num = 20
    fmt.Println("main 执行 num: ", num)
    // 输出
    // main 执行 num: 20
    // defer 执行 num: 10
}
```

每次执行 defer 语句时，会将该语句用到的状态保存起来作为栈帧，添加到 defer 栈中，在函数返回后，按栈弹出的顺序执行 defer 语句

```go
func main() {
    // 输出4 3 2 1 0
    for i := 0; i < 5; i++ {
		defer fmt.Printf("%d ", i)
	}
}
```

当 defer 语句中包含嵌套函数调用时，为了得到外层函数调用使用的参数，内部函数会被执行

```go
func function(index int, value int) int {
    fmt.Println(index)
    return index
}
func main() { 
    defer function(1, function(3, 0))
    defer function(2, function(4, 0))
    // 输出 3 4 2 1
}
```

function1 被压栈时，为了得到传入的参数，function3 被执行，打印 3，function1 压栈，function2 被压栈时，为了得到传入的促使，function4 被执行，打印 4，function2 压栈，最后按栈弹出顺序依次执行 function2、function1，分别打印 2 和 1

## 内置函数

| 名称                             | 说明                                                                                                                                                                                                                                                                                        |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `close()`                      | 用于管道通信                                                                                                                                                                                                                                                                                    |
| `len()`、`cap()`                | `len()` 用于返回某个类型的长度或数量（字符串、数组、切片、`map` 和管道）；`cap()` 是容量的意思，用于返回某个类型的最大容量（只能用于数组、切片和管道，不能用于 `map`）                                                                                                                                                                                         |
| `new()`、`make()`               | `new()` 和 `make()` 均是用于分配内存：`new()` 用于值类型和用户定义的类型，如自定义结构，`make` 用于内置引用类型（切片、`map` 和管道）。它们的用法就像是函数，但是将类型作为参数：`new(type)`、`make(type)`。`new(T)` 分配类型 `T` 的零值并返回其地址，也就是指向类型 `T` 的指针。它也可以被用于基本类型：`v := new(int)`。`make(T)` 返回类型 `T` 的初始化之后的值，因此它比 `new()` 进行更多的工作。**`new()` 是一个函数，不要忘记它的括号**。 |
| `copy()`、`append()`            | 用于复制和连接切片                                                                                                                                                                                                                                                                                 |
| `panic()`、`recover()`          | 两者均用于错误处理机制                                                                                                                                                                                                                                                                               |
| `print()`、`println()`          | 底层打印函数，在部署环境中建议使用 `fmt` 包                                                                                                                                                                                                                                                                 |
| `complex()`、`real ()`、`imag()` | 用于创建和操作复数                                                                                                                                                                                                                                                                                 |

## 闭包

go 支持匿名函数

```go
var myFunc = func(i int) int {
    fmt.Printf("%d ", i)
    return i
}

var i = myFunc(2)

func(i int) {
    fmt.Printf("立即执行的匿名函数")
} (2)

// 将函数作为参数传递
func callback(y int, f func(int, int)) {
	f(y, 2)
}
```

闭包会捕获匿名函数声明时所在作用域中的变量的**引用**，结合 defer，可以实现返回值延迟修改

```go
func f() (ret int) {
	defer func() {
		ret++
	}()
	return 1
}
func main() {
	fmt.Println(f())  // 打印2
}
```

以上示例中，f 函数返回时，ret 赋值为 1，返回后 defer 语句执行，执行 `ret++`，ret 修改为 2

## new 和 make

new 和 make 函数是用于内存分配的内置函数

**new**

可以为任意类型分配堆内存，并初始化为零值，返回指向该内存地址的指针

```go
var num *int = new(int)
fmt.Println(*num) // 输出：0（int 的零值）
*num = 100 // 通过指针修改值
fmt.Println(*num) // 输出：100
```

> 使用 `new` 初始化切片、map 和 chan 时，不会产生编译错误，但是进行赋值或读取时会抛出运行时错误（panic）

**make**

仅能为引用类型分配堆内存，同时初始化为零值，返回该类型的实例，只适用于切片、map 和 chan

```go
var nums []int = make([]int, 5)  // 创建数组切片，容量为5，初始化为0
var nums2 = make([]int, 5, 10)  // 创建数组切片，长度为5，容量为10，初始化为0
```
