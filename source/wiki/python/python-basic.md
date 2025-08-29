---
title: 基本语法
categories: [Python]
tags: [Python]
date: 2024-10-30 01:09
updated: 2025-08-29 13:40
banner: /assets/banner/python.png
wiki: python
---
## 开始

**导入**

- 导入模块：`import module`
- 从模块导入函数：`from module import function`

  全部导入：`from module import *`

**注释**

- 单行注释：#
- 多行注释：三个单引号或三个双引号包围

## 控制台操作

### 格式化输出

占位符：`%d`，`%s`

```python
age = 18;
print("name:%s" % ("Jake"))
print("age:%d" % age)
print("www","baidu", "com" , sep=".") # 默认为换行
print("Hello", end="") # 不换行
print("Hello", end="\t") # 相隔一个换行符
```

- `str()`：返回一个用户易读的表达形式

- `repr()`：返回一个解释器易读的表达形式

- `str.format()`：前面的字符串称为格式化字段，被 format 中的参数替换

  ```python
  "{}.{}.{}".format("www", "baidu", "com")  # www.baidu.com
  # 指定位置
  "{0}{1}".format("Hello", "World")  # HelloWorld
  "{1}{0}".format("Hello", "World")  # WorldHello
  # 使用关键字参数
  "{first}{second}".format(second="Hello", first="World")  # WorldHello
  # 特定转化,!a:ascii(),!s:str(),!r:repr()
  "{!s}".format(str)
  # 在:后接转义字符
  "{0:.2f}".format(float)  # 保留两位小数
  "{0:10}".format(name)  # 空出10个单位宽度
  ```

使用 f 字符串进行插值

```python
a = 10
print(f"{a}")  # 10
print(f"{a=}")  # 输出a = 10，通常可用于调试
```

### 输入

```python
age = input("tip")  # input函数返回一个字符串
print(age)
```

## 数值

### 强制类型转换

```python
a = int("123")
b = int(number_str)
```

## 运算符

- 除法
  - 传统除法：`/`，向下取整，含有浮点数时进行精确除法
  - 整除：`//`，强制向下取整

- 逻辑运算符
  - `a and b`：若 a 为非零 (True)，则返回 b 的值，返回类型与 b 一致
  - `a or b`：若 a 为零 (False)，则返回 b 的值，返回类型与 b 一致
  - `not(a)`：当值为非零，返回 True
  - Python 指定非零、非 None 或集合非空表示 True，0、None 或集合为空表示 False
- 成员运算符
  - `x in y`：若 x 在序列 y 中，返回 True
  - `x not in y`：若 x 不在序列 y 中，返回 True
- 类型运算符
  - `x is y`：判断两个引用是否引用同一个对象，等价于 `id(x) == id(y)`，`id()` 用于获取对象地址
  - `x is not y`：判断两个引用是否引用不同的对象

## 控制语句

### 条件语句

```python
if condition:
    statements
elif condition:
    statements
else:
    statements
```

### 循环

**for**

  ```python
  for iterator in sequnce:
      statements
  ```

  sequence 为一个序列，数组遍历每个元素，字符串遍历每个字符

- range：返回一个数字序列的迭代器
    - `range(a, b)`：返回一个 \[a,b) 的数字序列，默认步进 1
    - `range(a)`：返回 [0,a) 的数字序列
    - `range(a, b, c)`：步进为 c，a、b 为负数时，步进也为负数
- `len()`：返回字符串大小

**while**

```python
while condition:
    statements
    iterator += 1
```

**enumerate**

将一个可遍历的数据对象（字典，元组等）组合为一个索引序列，同时给出下标和数据，在 for 循环中可同时使用下标和数据

```python
for i, item in enumerate(b, start=10): # start参数设置第一个元素的下标
    print(i, item)
```

**列表推导式**

使用列表推导式可以更方便的创建列表

```python
list = []
for x in range(10):
    list.append(x * 2)  # x的表达式
# 列表推导式
list = [x * 2 for x in range(10)]
```

for 之后可以继续写子句

```python
combs = []
for x in [1, 2, 3]:
     for y in [3, 1, 4]:
         if x != y:
             combs.append((x, y))
# 列表推导式
combs = [(x, y) for x in [1,2,3] for y in [3,1,4] if x != y]
```

**zip**

该函数可传入多个值或多个序列，将多个序列对应位置的元素组成一个元组（两个序列的元素位置的交集），返回所有这些元组的列表，以最短的序列为准

  ```python
  names = ['Alice', 'Bob', 'Charlie']
  ages = [25, 30, 35]
  paired = zip(names, ages)  # 返回的是一个zip迭代器
  
  paired_list = list(paired)
  print(paired_list)  # [('Alice', 25), ('Bob', 30), ('Charlie', 35)]
  ```

若要以最长的序列为准，则使用 `zip_longest()`

```python
from itertools import zip_longest
```

## 字符串

字符串使用双引号，单引号，三个引号包围

- 字符串拼接

  ```python
  a = "Hello"
  b = "Python"
  c = a + b  # HelloPython
  d = a * 3  # HelloPython重复三次
  ```

- 字符串截取

  ```python
  a = "HelloPython"
  b = a[0:5]  # Hello，左闭右开
  c = a[0:5:2]  # Hlo，同range(a, b, c)
  d = a[:5]  # [0:5]
  e = a[5:]  # [5:11]
  ```

- 逐字字符串：不对字符串中的特殊字符进行转义

  ```python
  a = r"HelloWorld!\n"  # HelloWorld!\n
  ```

- 格式字符串：format 字符串的简化

  ```python
  a = 10
  s = f"This is a number {a}"  # 大括号需要转义，使用{{}}
  ```
