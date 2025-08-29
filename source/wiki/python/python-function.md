---
title: 函数
categories: [Python]
tags: [Python]
date: 2025-08-28 13:40
updated: 2025-08-29 17:27
banner: /assets/banner/python.png
wiki: python
---
## 基本用法

```python
def func(parameters) -> None:  # -> returnType指定返回值类型，不是强制的
    pass  # pass关键字为占位语句，没有作用
```

Python 可以返回多个值

```python
def func(a, b):
    return a, b
x, y = func(1, 2)  # x = 1,y = 2
```

**拆包**：对于函数中返回多个返回值，利用拆包可以去掉列表、元组、字典 (返回多个值时，在传递过程中被封装成了元组)，直接查看里面的数据（字典拆包返回的是 key）

**忽略不需要的返回值**：利用拆包，将接收不需要的返回值的变量命名为 `_`，或者在调用后用下标获取需要的返回值，同时也可以使用切片

## 作用域

**命名空间**

- 内置名称：Python 语言内置的名称，比如函数名 abs、char 和异常名称 BaseException、Exception 等等
- 全局名称：模块中定义的名称，记录了模块的变量，包括函数、类、其它导入的模块、模块级的变量和常量
- 局部名称：函数中定义的名称，记录了函数的变量，包括函数的参数和局部定义的变量（类中定义的也是）

变量查找顺序为局部命名空间 ->全局命名空间 ->内置命名空间

**变量作用域**

变量查找顺序为 L-E-G-B

- 局部变量 L
- 闭包函数之外的函数中的变量 E
- 全局变量 G
- 内置变量 B

Python 中只有模块（module），类（class）以及函数（def、lambda）才会引入新的作用域，其它的代码块（如 if/elif/else/、try/except、for/while 等）是不会引入新的作用域的，也就是说这些语句内定义的变量，外部也可以访问

**global 和 nonlocal 关键字**

- 局部作用域内需要修改全局作用域的变量，在局部作用域中使用 global 关键字修饰声明该变量
- 局部作用域内需要修改闭包函数之外的函数中的变量，在局部作用域中使用 nonlocal 修饰声明该变量

## 闭包

闭包是函数式编程的基本结构，Python 中将函数作为一个函数对象，可将函数对象作为参数传递

函数对象的作用域与 def 所在的层级相同

闭包是将函数对象在函数中传递

```python
def hello(greet):

    def setName(name):
        print(greet,name)
    return setName

Hello = hello("Good Morning")
Hello('Yang') #Good Morning Yang
```

闭包的条件

- 函数中必须有内嵌函数
- 内嵌函数必须引用上一级函数的变量
- 函数必须返回该内嵌函数

## 参数传递

Python 中一切皆对象，对象分为可变对象和不可变对象

- 不可变对象：string,tuple,number 为不可变对象，传递时按值传递
- 可变对象：list,dict 为可变对象，传递时按引用传递

## 参数列表

- 关键字参数

  Python 传递参数时，可以指定参数列表中的某个参数进行传递

  ```python
  def func(a, b):
      return a + b
  func(b = 20, a = 10)
  ```

- 默认参数

  在声明函数时，可以指定参数的默认值，参数列表中默认参数之后的参数都需要设置默认值

  ```python
  def func(a, b = 10):
      return a + b
  func(10)  # 20
  ```

- 不定长参数

  在参数列表中使用 `*` 表示一个不定长的元组，表示不定长参数

  ```python
  def func(arg_normal, *args):
      print(arg_normal)
      print(args)
  func(10, 20, 30)  # arg_normal = 10, varstuple = (20, 30)
  ```

  单独使用 `*` 占位，表示后面的参数必须使用关键字参数

  ```python
  def f(a, b, *, c):
  	return a + b + c
  f(1, 2, 3)  # 报错
  f(1, 2 , c=3)  # 6
  ```

  使用两个星号 `**` 表示以字典传入

  ```python
  def printinfo(arg, **kwargs):
     print(arg)
     print(kwargs)
  printinfo(1, a=2, b=3)  # arg = 1, vardict = {"a": 2, "b": 3}
  ```

- 强制位置参数

  使用 `/` 占位，表示前面的参数必须使用位置形参

  ```python
  def f(a, b, /, c, d, *, e, f):
      print(a, b, c, d, e, f)
  f(10, b=20, c=30, d=40, e=50, f=60)   # b 不能使用关键字参数的形式
  f(10, 20, 30, 40, 50, f=60)           # e 必须使用关键字参数的形式
  ```

## lambda 函数

使用 lambda 表达式返回一个函数对象，lambda 表达式限定只能包含一行代码

```python
f = lambda arg1, arg2, ...:expression
f(arg...)
```

## 迭代器

迭代器是遍历集合元素的方式，只能前进不能后退

调用 `iter()` 构造一个迭代器对象，可使用 for 遍历该对象

调用 `next()` 返回下一个元素，循环中通过捕获 `StopIteration` 异常来结束读取

```python
import sys
 
list = [1, 2, 3, 4]
it = iter(list)  # 创建迭代器对象
 
while True:
    try:
        print(next(it))
    except StopIteration:
        sys.exit()
```

**自定义迭代器**

自定义的迭代器类需要实现 `__iter__()` 和 `__next__()`

```python
class MyNumbers:
  def __iter__(self):
    self.a = 1
    return self
 
  def __next__(self):
    x = self.a
    self.a += 1
    return x
 
myclass = MyNumbers()
myiter = iter(myclass)
```

## 生成器

使用了 `yield` 关键字的函数称为生成器，生成器是一个函数简化版迭代器

所有的生成器都是迭代器，生成器由函数实现，迭代器由类实现

每次执行 `next()` 时，生成器才执行，在生成器执行过程中，函数遇到 yield 时，返回 `yield` 之后的值并保存该位置，下一次执行 `next()` 时，函数从该位置执行

```python
def fibonacci(n):  # 生成斐波那契数列
    a, b, counter = 0, 1, 0
    while True:
        if (counter > n): 
            return
        yield a
        a, b = b, a + b
        counter += 1
f = fibonacci(10) # f是一个迭代器，由生成器返回生成
next(f)
```

`yield from`：使用其他生成器，简化生成器的嵌套调用

```python
# 未使用yield from
def generate1(n):
    for i in range(n):
        yield i
        
# 使用yield from
def generate2(n):
    yield from range(n)
```
