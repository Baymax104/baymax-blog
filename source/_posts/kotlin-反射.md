---
title: Kotlin高级——反射
categories: [Kotlin]
tags: [Kotlin, Android]
date: 2024-03-10 22:57
updated: 2025-07-09 17:24
banner: /images/kotlin.jpg
topic: kotlin
---
## 开始

Kotlin 反射依赖反射库实现

``` groovy
implementation "org.jetbrains.kotlin:kotlin-reflect:1.8.10"
```

Kotlin 中可以直接使用 java 的反射，目前 java 反射的性能还是高于 Kotlin，因此实际使用大多使用 java 反射

有两种方式获取 java 的 Class 对象

- javaClass 字段
- KClass 的 java 字段

kotlin 反射与 java 反射的类结构组成

![](kotlin-反射-1751822808903.png)

## 类引用

kotlin 中的 KClass 类对应 java 的 Class 类

获取 KClass 类

``` kotlin
class Person
val kClass: KClass<Person> = Person::class  // 使用类名引用
val p = Person()
// p可能是Person的子类，使用协变类型接收
val objClass: KClass<out Person> = p::class  // 对象引用，获取到的是实际类型
```

## 函数引用

函数使用 `::` 引用，引用的类型为 KFunction

``` kotlin
fun say(a: String): Int {
    return 0
}
val f0: KFunction<Int> = ::say
// 成员函数引用
class Person {
    fun say(): Int = 0
}
val pf1: KFunction<Int> = Person::say
```

## 属性引用

属性使用 `::` 引用，引用类型为 KProperty

``` kotlin
val x = 20
val x0: KProperty<Int> = ::x
// 可变属性引用
var y = 20
val y0: KMutableProperty<Int> = ::y
// 成员属性引用
class Person {
    val x = 20
    var y = 20
}
val px1: KProperty<Int> = Person::x
val py1: KMutableProperty<Int> = Person::y
```
