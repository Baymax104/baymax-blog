---
title: Kotlin高级——委托
categories: [Kotlin]
tags: [Kotlin, Android]
date: 2024-03-10 20:25
updated: 2025-07-09 17:33
banner: /images/kotlin.jpg
topic: kotlin
---
## 开始

委托模式是将一个对象的职责委托给其他对象完成，kotlin 委托通过 by 关键字实现

## 类委托

将类中的方法委托到被委托对象实现

``` kotlin
interface Method {
    fun method()
}

class MethodImpl : Method {
    override fun method() {
        // statement
    }
}
// 委托类与被委托类实现同一接口
class Person(method: Method) : Method by method {
    // 委托类中自动生成了接口中的方法，并将调用转发给被委托对象
    
    // 当委托类重写了接口方法时，调用委托类重写的方法
    override fun method() {
        // statement
    }
}
```

## 属性委托

在属性后使用 by 关键字加一个表达式，表达式返回被委托对象，将属性的定义委托给该对象管理

属性的 getter 和 setter 被委托给这个对象的 getValue 和 setValue 方法 (val 属性只需提供 getValue 方法)

``` kotlin
class Person {
    var name: String by Delegate()
}

class Delegate : ReadWriteProperty<Person, String> {
    override operator fun getValue(thisRef: Any?, property: KProperty<*>): String {
        return "$thisRef, 这里委托了 ${property.name} 属性"
    }

    override operator fun setValue(thisRef: Any?, property: KProperty<*>, value: String) {
        println("$thisRef 的 ${property.name} 属性赋值为 $value")
    }
}
```

by-lazy 延迟初始化是调用了 lazy 函数，lazy 函数传入一个闭包，返回一个 Lazy 对象，属性定义由 Lazy 对象管理

Lazy 对象只实现了 getValue 方法，因此通常用于 val 属性的延迟初始化

将属性委托到映射

``` kotlin
// Map为只读map
class Person(val map: Map<String, Any?>) {
    val name: String by map
    val age: Int by map
}
// MutableMap为可变map
class Student(val map: MutableMap<String, Any?>) {
    var name: String by map
    var age: Int by map
}
```

### 可观察属性

kotlin 的 Delegates 类的 observable 方法可以实现属性的观察者，observable 方法传入一个初始值和一个观察者处理器闭包

``` kotlin
import kotlin.properties.Delegates

class Person {
    var name: String by Delegates.observable("initValue") {
        property, oldValue, newValue -> 
        // statement
    }
}
```

### Delegates.notNull

用于对一个非空 var 属性进行延迟初始化

lateinit 不支持原始类型，Delegates.notNull 支持所有非空类型

当属性委托给 notNull 后，若未进行初始化直接访问会抛出异常

``` kotlin
import kotlin.properties.Delegates

class Person {
   	var age: Int by Delegates.notNull<Int>()
}
```

### 自定义委托

创建一个类作为被委托类，对于 val 属性，需要实现 getValue 操作符，对于 var 属性，需要实现 setValue 和 getValue 操作符

- 当属性为 var 时，被委托对象继承 ReadWriteProperty，重写 setValue 和 getValue
- 当属性为 val 时，被委托对象继承 ReadOnlyProperty，重写 getValue

``` kotlin
class Delegate : ReadWriteProperty<Person, String> {
    // thisRef：委托对象的引用，类型可以是委托对象类型或其父类型
    // property：KProperty类型，存储属性的元数据
    // 返回值：返回属性对应类型或其子类型
    override operator fun getValue(thisRef: Person, property: KProperty<*>): String {
        return "$thisRef, 这里委托了 ${property.name} 属性"
    }
	// value：新值，必须是属性对应类型或其父类型
    override operator fun setValue(thisRef: Person, property: KProperty<*>, value: String) {
        println("$thisRef 的 ${property.name} 属性赋值为 $value")
    }
}
```

### provideDelegate

用于定义创建被委托对象时的逻辑

通过 provider 委托时，优先调用 provideDelegate，再调用 getValue/setValue

``` kotlin
class Person {
    var name: String by DelegateProvider()
}

class Delegate : ReadWriteProperty<Person, String> {
    override operator fun getValue(thisRef: Person, property: KProperty<*>): String {
        return ""
    }

    override operator fun setValue(thisRef: Person, property: KProperty<*>, value: String) {
        // statement
    }
}
// 委托提供者
class DelegateProvider {
    operator fun provideDelegate(person: Person, property: KProperty<*>) : ReadWriteProperty<Person, String> {
        // statement
        return Delegate() // 返回一个委托对象
    }
}
```
