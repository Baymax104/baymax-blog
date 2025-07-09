---
title: Kotlin高级——集合
categories: [Kotlin, 高级篇]
tags: [Kotlin, Android]
date: 2024-03-10 23:13
updated: 2025-07-07 01:25
banner: /images/kotlin.jpg
---
## 开始

kotlin 将 Map、Set 和 List 都分为只读和可变两种类型，只读类型使用原始名称，可变类型带有 Mutable 前缀，可变类型在只读类型的基础上扩展了读写接口

容器类图如下

![](kotlin高级-集合-1751822581376.png)

容器默认实现

- MutableList：ArrayList
- MutableSet：LinkedHashSet
- MutableMap：LinkedHashMap

自定义集合：kotlin 提供了每种集合的抽象类，用于自定义集合实现

- AbstractCollection
- AbstractList
- AbstractSet
- AbstractMap

## 元组容器

Pair 和 Triple 是 kotlin 内置的元组对象，Pair 是二元组，Triple 是三元组

Pair 和 Triple 都包含 toXXX 方法，将元组转换为其他数据类型

Pair 对于任意类型扩展了 to 方法，`A.to(B)` 返回一个 `Pair<A, B>` 对象，to 方法使用 infix 修饰，**可以使用中缀表示**

## 集合创建

集合创建方法

- 调用 XXXOf 函数：传入元素序列，不传入时创建空集合

    ``` kotlin
    val l = listOf(1, 2, 3, 4)
    val s = setOf(1, 2, 3, 4)
    val m = mapOf(1 to 2, 3 to 4) // map接收pair类型
    ```

    - `listOf`：使用默认实现，自动类型推断，当存在 null 时，返回可空类型，不存在时，返回非空类型
    - `mutableListOf`：listOf 的可变类型
    - `listOfNotNull`：使用默认实现，自动类型推断，可接收可空类型，自动过滤 null，返回非空类型
    - `arrayListOf`：使用具体实现，其余特性与 listOf 一致

- 调用 buildXXX 函数：传入一个闭包，可初始化容量

    闭包接收者为**集合的可变类型**，通过可变类型修改容器，修改越界时会抛出异常

- 调用 emptyXXX：创建空集合

- 调用具体实现的构造函数

## 集合转换、复制

集合转换、复制方法

- List 和 Set 转换

    List 和 Set 调用 toXXX 可以任意地相互转换到它们的只读类型或可变类型，当 list 转换为 set 时会去除重复元素

- map 转换

    List 和 Set 无法直接转换为 Map，Map 只能转换为 List，其中的元素为 Pair 对象

    调用 `map.keys` 可以获取由 key 组成的 set 集合，调用 `map.values` 可以获取由 value 组成的 Collection 集合

- 转换拷贝

    在调用 toXXX 进行转换时实际是创建了一个新对象且对元素进行**浅拷贝**，调用 toXXX 方法时可以调用同类型的 toXXX 方法，因此可以通过该方法实现拷贝

引用可变限制：由于可变类型是只读类型的子类，当可变类型集合被赋值给只读类型引用时，集合变为只读，通过可变类型引用也不能修改集合，此时只能将对象强转为可变类型

## 迭代器

可迭代对象接口为 `Iterable<T>`，包含一个 iterator 方法返回一个 Iterator 对象

迭代器接口为 `Iterator<T>`，拥有两个方法

- hasNext：判断是否有下一个元素
- next：访问下一个元素

对于 List 还实现了一个 Iterator 的子接口 ListIterator，添加了方法实现反向迭代

- hasPrevious：判断是否有上一个元素
- previous：访问上一个元素
- nextIndex：返回当前元素的下一个索引
- previousIndex：返回当前元素的前一个索引

### 可变迭代器

对于可变类型，实现了一个 MutableIterator 子接口，包含一个 remove 方法，可以在迭代时删除元素

对于 List 还实现了 MutableListIterator 子接口，添加了 List 的修改和添加方法

``` kotlin
val s = mutableSetOf(2, 3, 4)
val iterator = s.iterator()
iterator.next()  // 到达第一个元素
iterator.remove()  // 删除2，[3, 4]
iterator.next()  // 保持相对位置，next返回3
```

## 序列

序列是 kotlin 提供的另一种容器，用于集合**流处理**，类似 java 的 Stream

序列与集合的不同

- 集合是立即计算，在调用操作函数后立即计算返回结果，序列是惰性计算，调用操作后将操作记录下来，在调用终止操作时才进行计算
- 集合每一步计算都会创建新的对象，序列将所有步骤一次性执行，不会创建集合的副本中间对象
- 序列不支持集合的随机访问，序列是只读的，不支持元素修改和添加删除
- 集合的执行流是将一个操作对所有元素执行一次，序列的执行流是对一个元素执行一次所有操作

### 序列创建

- 调用 sequenceOf 函数，传入元素序列

- 调用集合的 asSequence 函数，类似 java 中的 stream 方法

- 调用 generateSequence 函数，传入一个闭包作为元素生成函数，当生成函数返回 null 时，生成结束

- 调用 sequence 函数，传入一个闭包，闭包中只能调用 yield 和 yieldAll 函数，用于生成元素

    与 generateSequence 的不同：generateSequence 是将序列创建好后进入流操作，sequence 函数是从生成元素就进入流操作，当操作下一个元素时 generateSequence 不会被调用，而 sequence 会被调用，由 yield 产生下一个操作的值，产生后 sequence 会被暂停

    元素生成方法
    
    - yield：生成一个值
    - yieldAll：生成一个序列，传入集合或序列

## 集合操作

集合的操作函数以成员函数或扩展函数存在，集合操作分为两类，公共操作和写操作，公共操作可用于只读集合和可变集合，写操作只能用于可变集合

集合与序列在操作时的不同

- 对于集合，会创建集合的副本对象，因此当集合操作分步执行时，需要对**返回的新对象**进行操作
- 对于序列，会创建只记录操作信息的对象，可对原来操作的对象继续操作

``` kotlin
val list = listOf(1, 2, 3, 4)
val filter = list.filter { it > 2 }  // 操作返回一个新的对象
fileter.forEach { println(it) }  // 对新对象继续操作
// 错误写法
val l = listOf(1, 2, 3, 4)
l.fileter { it > 2 }  // 操作返回的对象被丢弃
l.forEach { println(it) }  // 对原来的list进行操作，filter没有执行
```

集合操作详情见官方文档：[集合操作概述 · Kotlin 官方文档 中文版 (kotlincn.net)](https://book.kotlincn.net/text/collection-operations.html)
