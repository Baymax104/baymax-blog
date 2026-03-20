---
title: 数组与切片
categories: [Go, GoLang]
tags: [Go, GoLang]
date: 2026-03-20 16:13
updated: 2026-03-20 18:19
wiki: go
---
## 数组

数组的声明格式如下

```go
var array [len]type

// e.g.
var intArray [10]int
var stringArray [10]string

// 多维数组
var multiArray [10][5]int
```

### 遍历

```go
for i := 0; i < len(arr1); i++ {
	arr1[i] = i * 2
}

for i := 0; i < len(arr1); i++ {
	fmt.Printf("Array at index %d is %d\n", i, arr1[i])
}

for i, value := range arr1 {
    // ...
}
```

### 初始化

go 中有多种形式的数组初始化方法

```go
// 基本形式
var arr1 = [5]int{1, 2, 3, 4, 5}

// 省略长度
var arr2 = [...]int{1, 2, 3, 4, 5}

// 指定索引赋值，默认为零值
var arr3 = [3]string{
    0: "a",
    1: "b",
    2: "c",  // 最后必须有一个尾随逗号
}
```

### 参数传递

go 数组是值类型，传递时默认进行拷贝，但这会占用大量内存，通常使用以下两种方式传递数组

1. 传递数组指针
2. 传递数组切片

```go
func Sum(a *[3]float64) (sum float64) {
	for _, v := range a {
		sum += v
	}
	return
}

func main() {
    array := [3]float64{7.0, 8.5, 9.1}
    // 传递数组指针
	x := Sum(&array)
	fmt.Printf("The sum of the array is: %f", x)
}
```

## 切片

切片是数组的一个动态窗口，可以看做一个大小可变的数组，切片是一个引用类型

对于同一个数组的多个切片，他们之间是共享数据的

声明格式如下，默认零值为 `nil`

```go
var slice []type
```

### 创建切片

有两种形式来创建切片

- 从已有数组创建切片
- 同时声明并初始化

```go
var arr = [5]int{1, 2, 3, 4, 5}

// 创建已有数组的切片
var s1 = arr[start:end]  // 切片表达式，左闭右开

// 同时声明并初始化
var s2 = []int{1, 2, 3}
var s3 = []string{
    0: "a",
    1: "b",
    2: "c",
}
```

切片的大小永远小于等于原始数组的大小，因此 `0 <= len(slice) <= cap(slice)` 总是成立

### 参数传递

通常向函数传递数组时，都是传递数组的切片

```go
func sum(a []int) int {
	s := 0
	for i := 0; i < len(a); i++ {
		s += a[i]
	}
	return s
}

func main() {
	var arr = [5]int{0, 1, 2, 3, 4}
	sum(arr[:])
}
```

### 切片操作

**扩展或收缩**

在原始数组的范围内，切片可以重新指定范围进行扩展或收缩

```go
var nums = make([]int, 5, 10)
fmt.Printf("%d %d\n", len(nums), cap(nums))  // 5 10
nums = nums[:7]
fmt.Printf("%d %d\n", len(nums), cap(nums))  // 7 10
```

**复制**

使用 `copy` 函数实现切片复制（浅拷贝），只能复制源切片和目标切片相同长度的部分

```go
func main() {
    src := []int{10, 20, 30, 40} // 源切片 len=4, cap=4
    dst := make([]int, 4) // 目标切片 len=4, cap=4（初始零值 [0,0,0,0]）

    copyCount := copy(dst, src)

    fmt.Println("源切片:", src)  // 输出：源切片: [10 20 30 40]
    fmt.Println("目标切片:", dst)  // 输出：目标切片: [10 20 30 40]
    fmt.Println("实际复制个数:", copyCount) // 输出：实际复制个数: 4
}
```

**追加**

使用 `append` 函数可以将多个元素追加到切片中，若超出了切片的容量，则会分配一个新的切片并扩容

```go
sl := []int{1, 2, 3}
sl = append(sl, 4, 5, 6)

sl1 := []int{7, 8, 9}
sl = append(sl, sl1...)  // 将切片扩展为多个参数，追加到sl后
```

### 字符串切片

字符串本质是一个字节数组，可以通过切片表达式获取子串

```go
var s = "Hello"
var s1 = s[1:3]
```
