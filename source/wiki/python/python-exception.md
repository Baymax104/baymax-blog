---
title: 异常处理
categories: [Python]
tags: [Python]
date: 2025-08-28 14:07
updated: 2025-08-29 13:41
banner: /assets/banner/python.png
wiki: python
---
## 异常处理

常见的异常类

| Exception           | 描述                                               |
| ------------------- | -------------------------------------------------- |
| StopIteration       | 迭代器没有更多的值                                 |
| GeneratorExit       | 生成器 (generator) 发生异常来通知退出                |
| StandardError       | 所有的内建标准异常的基类                           |
| ArithmeticError     | 所有数值计算错误的基类                             |
| FloatingPointError  | 浮点计算错误                                       |
| OverflowError       | 数值运算超出最大限制                               |
| ZeroDivisionError   | 除 (或取模) 零 (所有数据类型)                        |
| AssertionError      | 断言语句失败                                       |
| AttributeError      | 对象没有这个属性                                   |
| EOFError            | 没有内建输入,到达 EOF 标记                           |
| EnvironmentError    | 操作系统错误的基类                                 |
| IOError             | 输入/输出操作失败                                  |
| OSError             | 操作系统错误                                       |
| MemoryError         | 内存溢出错误 (对于 Python 解释器不是致命的)          |
| NameError           | 未声明/初始化对象 (没有属性)                       |
| UnboundLocalError   | 访问未初始化的本地变量                             |
| ReferenceError      | 弱引用 (Weak reference) 试图访问已经垃圾回收了的对象 |
| RuntimeError        | 一般的运行时错误                                   |
| NotImplementedError | 尚未实现的方法                                     |

## 捕获异常

使用 `try-except-finally` 捕获异常

```python
try:
	statements        # 运行别的代码
except exception1：
	statements        # 如果在try部分抛出了exception1异常
except exception2 as e:
	statements        # 如果抛出了exception1异常，获得该异常对象
finally:
    statements		  # 无论是否抛出异常，一定会执行
```

- 若未发生异常，则将 try 中的代码执行完，执行之后的代码
- 若捕获到了异常，except 子句中有匹配的异常，则处理异常，处理后继续执行之后的语句
- 若异常发生，没有匹配的 except 子句，则异常被抛到上层 try 块中，直到程序最上层，结束程序

## 抛出异常

使用 raise 关键字手动抛出异常，常见有三种用法

1. `raise`：单独一个 raise。该语句引发当前上下文中捕获的异常（比如在 except 块中继续抛出异常）或默认引发 RuntimeError 异常
2. `raise Exception`：raise 后带一个异常类名称，表示引发执行类型的异常
3. `raise Exception(message)`：在引发指定类型的异常的同时，附带异常的描述信息

## 自定义异常

自定义异常类需要重写构造函数

```python
class Networkerror(Exception):
    def __init__(self, arg):
        self.args = arg
```
