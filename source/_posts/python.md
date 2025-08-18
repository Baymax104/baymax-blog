---
title: Python基础
categories: [Python]
tags: [Python]
date: 2024-10-30 01:09
updated: 2025-07-07 01:53
banner: /assets/banner/python.png
---
## 开始

**导入**

- 导入模块：`import module`
- 从模块导入函数：`from module import function`

  全部导入：`from module import *`

**注释**

- 单行注释：#
- 多行注释：三个单引号或三个双引号包围

**格式化输出**

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

**输入**

```python
age = input("tip")  # input函数返回一个字符串
print(age)
```

**强制类型转换**

```python
a = int("123")
b = int(number_str)
```

**运算符**

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

**条件语句**

```python
if condition:
    statements
elif condition:
    statements
else:
    statements
```

**循环**

- for

  ```python
  for iterator in sequnce:
      statements
  ```

  sequence 为一个序列，数组遍历每个元素，字符串遍历每个字符

  - range：返回一个数字序列的迭代器
    - `range(a, b)`：返回一个 [a,b) 的数字序列，默认步进 1
    - `range(a)`：返回 [0,a) 的数字序列
    - `range(a, b, c)`：步进为 c，a、b 为负数时，步进也为负数
  - `len()`：返回字符串大小

- while

  ```python
  while condition:
      statements
      iterator += 1
  ```

- `enumerate(iterator)`

  将一个可遍历的数据对象（字典，元组等）组合为一个索引序列，同时给出下标和数据，在 for 循环中可同时使用下标和数据

  ```python
  for i, item in enumerate(b, start=10): # start参数设置第一个元素的下标
      print(i, item)
  ```

- 列表推导式

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

- `zip()`：该函数可传入多个值或多个序列，将多个序列对应位置的元素组成一个元组（两个序列的元素位置的交集），返回所有这些元组的列表

  ```python
  names = ['Alice', 'Bob', 'Charlie']
  ages = [25, 30, 35]
  paired = zip(names, ages)  # 返回的是一个zip迭代器
  
  paired_list = list(paired)
  print(paired_list)  # [('Alice', 25), ('Bob', 30), ('Charlie', 35)]
  ```

**字符串**

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

## 集合

Python 中的基本集合类型有列表 list、元组 tuple、字典 dict、集合 set

### 列表

列表是类似数组的一个数据结构，可以同时存储字符串、数字，支持从尾部遍历

```python
list = [obj1, obj2, obj3, ...]
```

常用操作

- 下标 0 为开始值，-1 为从末尾的开始值 (-1,-2,...)
- 使用 `+` 拼接，使用 `*` 重复
- 切片：`list[0:5:2]`，同字符串切片
- `append(obj)`：在列表尾部添加元素
- `extend(list)`：在列表尾部添加另一个列表
- `insert(index, value)`：插入元素
- `remove(value)`：删除列表中指定值的第一个匹配
- `del obj`：Python 内置关键字，释放指定位置元素的内存
- `pop()`：弹出尾部元素
- `sort()`：同一类型排序，降序设置 `reverse=True`
- `reverse()`：列表反转
- `index(value, startIndex, endIndex)`：返回指定元素下标，若包含多个，返回第一个匹配下标
- `count(value)`：返回指定元素的数目

### 元组

元组使用小括号括起来，元素不能修改，可以添加可变对象，对象中的元素可变，如 list

只有一个元素时，必须加逗号

```python
tup = (obj1, obj2, obj3, ...)
tup = (obj1,)
```

操作类似列表

- `len()`：获取元组长度
- `max()`：获取元组元素最大值
- `min()`：获取元组元素最小值
- `tuple()`：将其他类型转换为元组

### 字典

字典是无序的对象集合，使用键值对存储，键必须为不可变类型且唯一

```python
dic = {key1: value1, key2: value2, ...}
```

- 访问
  - 直接访问：`dic[key]`，不存在值会报错
  - get 访问：`dic.get(key, default)`，不存在值返回 None 或者指定默认值
- 添加
  - `update(dic)`：合并字典
  - `dict()`：将其他类型转换为字典
- 删除
  - `del dic[key]`：删除整个键值对
  - `clear()`：清空字典
  - `pop(key)`：弹出键值对
- 查找
  - `keys()`：获取所有的键
  - `values()`：获取所有的值
  - `items()`：获取所有的键值对

### 集合

特性与其他语言类似，值唯一且无序，使用大括号包围

```python
s = {1, 2, 3, "Hello"}
```

## 函数

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

### 作用域

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

### 闭包

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

### 参数传递

Python 中一切皆对象，对象分为可变对象和不可变对象

- 不可变对象：string,tuple,number 为不可变对象，传递时按值传递
- 可变对象：list,dict 为可变对象，传递时按引用传递

### 参数列表

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

### lambda 函数

使用 lambda 表达式返回一个函数对象，lambda 表达式限定只能包含一行代码

```python
f = lambda arg1, arg2, ...:expression
f(arg...)
```

### 迭代器

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

### 生成器

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

## 面向对象

### 成员命名规范

python 中使用一些命名规范来表示访问级别

- 类中受保护的实例属性和方法：protected，应该以一个下划线开头，不是强制的
- 类中私有的实例属性和方法：private，应该以两个下划线开头
- 类和异常的命名：应该每个单词首字母大写
- 模块级别的常量：应该采用全大写字母，如果有多个单词就用下划线进行连接
- 类的实例方法：method，应该把第一个参数命名为 self 以表示对象自身
- 类的类方法：class method，应该把第一个参数命名为 cls 以表示该类自身

```python
class People:
    name = ''
    age = 0
    __weight = 0 # 私有属性

    def __init__(self, n, a, w):
        self.name = n
        self.age = a
        self.__weight = w
        
    def speak(self): # 实例方法
        print("instance method")
    
    @classmethod
    def talk(cls): # 类方法
        print("class method")
    
    @staticmethod
    def study(): # 静态方法
        print("static method")
 
p = People('runoob', 10, 30)

# 绑定方法调用
p.speak() # 实例方法
p.talk() # 类方法

# 通过类调用实例方法，非绑定方法调用
People.speak(self=p) # 实例方法
People.speak(self=People) # 方法内的self看做类名，可以调用静态方法
People.talk() # 类方法
People.study() # 静态方法
```

### 字段

在类中声明的字段分为类字段和实例字段

- 类变量

  类变量在类外通过类名调用，类内方法体同样通过类名调用，由所有对象实例共享，对象实例不可获取到类变量

- 实例变量

  实例变量在类外通过对象实例调用，类内方法体内通过 self 调用，由对象实例独有，通过类名不可获取到实例变量

在方法内外都可以给类添加动态属性并赋值，通过对象实例定义则为实例变量，通过类名定义则为类变量

### 方法

Python 类内方法分为实例方法，类方法，静态方法

- 实例方法

  参数列表必须包含一个 self 参数，self 表示该类的对象实例，通过对象实例调用

  通过类名调用需要传入 self 参数，若传入的是对象实例，则在方法中可以调用实例方法和类方法，若传入的是类名，则在方法中可以调用类方法和静态方法

- 类方法

  参数列表中包含一个 cls 参数，使用 `@classmethod` 修饰，类方法可以通过类名和对象实例调用，传入的 cls 看做一个类名，可以调用类的构造器或其他方法

- 静态方法

  静态方法参数列表中没有 self 或 cls，只能通过类名调用，使用 `@staticmethod` 修饰

  通过对象调用静态方法会自动传入一个 self 参数，而静态方法不需要 self 参数，所以对象无法调用静态方法

### 构造函数和析构函数

```python
class Person:
    age = 0
    name = ""
    def __init__(self, age, name):
        self.age = age
        self.name = name
    def __del__(self):
        pass
```

- 析构函数在 Python 中不是很需要，Python 有垃圾回收机制，在 del(obj) 时调用\__del__
- 当含有多个构造函数时，只有最后一个构造函数生效（局部函数对象覆盖）

### 运算符重载

Python 运算符重载通过一些特殊函数实现

- `__call__(self)`：重载 `()`，对象可作为函数对象
- `__str__(self)`：`print(obj)` 时调用，返回一个字符串
- `__add__(self, rhs)`：重载 `+`
- `__sub__(self, rhs)`：重载 `-`
- `__mul__(self, rhs)`：重载 `*`
- `__truediv__(self, rhs)`：重载 `/`
- `__setitem__` ：按照索引赋值
- `__getitem__`：按照索引获取值
- `__len__`：获得长度
- `__cmp__`：比较运算
- `__mod__`：求余运算
- `__pow__`：乘方
- `__str__`：转换为字符串

### 继承

**单继承**

```python
#类定义
class people:
    name = ''
    age = 0
    __weight = 0
    
    #定义构造方法
    def __init__(self, n, a, w):
        self.name = n
        self.age = a
        self.__weight = w
        
    def speak(self):
        print("%s 说: 我 %d 岁。"  % (self.name, self.age))
 
#单继承示例
class student(people):
    grade = ''
    
    def __init__(self, n, a, w, g):
        #调用父类的构造函数
        #当子类不重写构造器时，会自动调用父类构造，重写后需要显式调用
        people.__init__(self, n, a, w)
        '''
        其他写法
        super().__init__(self, n, a, w)
        super(people, self).__init__(self, n, a, w)
        '''
        self.grade = g
        
    #覆盖父类的方法
    def speak(self):
        print("%s 说: 我 %d 岁了，我在读 %d 年级" % (self.name, self.age, self.grade)
             )
s = student('ken',10,60,3)
s.speak()
super(Child, c).myMethod() #用子类对象调用父类已被覆盖的方法
```

**多继承**

在子类括号中加入多个父类，当多个父类中有同名方法时，子类调用父类方法根据父类列表顺序来查找，也可指定调用某个父类的方法，当子类重写父类方法时，只会关注子类的方法

### 内置类属性

- `__dict__` ：类的属性（包含一个字典，由类的数据属性组成）
- `__doc__` ：类的文档字符串
- `__name__`：类名
- `__module__`：类定义所在的模块
- \__bases__ ：类的所有父类构成元素（包含了一个由所有父类组成的元组）
- `__doc__`：类的文档字符串
- `__class__`：获取对象的类对象，获取类名：`__class__.__name__`

### 垃圾回收

Python 使用引用计数来跟踪和回收垃圾，当一个变量或一个对象被创建时，引用计数器 (一个内部跟踪变量) 增加该对象的引用，当对象的引用计数为 0 时，解释器在适当的时机回收该对象的内存

循环引用是指两个对象相互引用，但没有其他对象引用他们，在循环引用的情况下，循环垃圾收集器会留意未被引用计数销毁的对象，试图回收未被清理的循环引用

## 文件操作

Python 中的文件操作通常配合上下文管理器一起使用

### 打开文件

使用 `open(filename, mode)` 打开文件或创建新文件

使用 `close()` 关闭文件

访问模式

- r：只读，指针在文件开头
- w：只写，会覆盖原文件
- a：追加，指针在文件尾部
- rb,wb,ab：以二进制操作
- r+,w+,a+：；支持读写，特点与对应模式一致
- rb+,wb+,ab+

### 读写文件

- `write(str)`：写入文件，返回写入的字符数

- `read(n)`：读取 n 个字符，同时指针后移

- `readline()`：读取一行，同时；指针移动到下一行

- `readlines()`：读取所有行，返回一个列表，每个元素为一行

- `tell()`：返回文件指针目前位置

- `seek(offset, from_what)`：移动文件指针

  offset 为移动字符数，从尾部开始移动，offset 为负数

  from_what 可选 0（文件开头），1（当前位置），2（文件末尾）

### 上下文管理器

上下文管理器可以简化资源的打开和关闭操作，一个实现了 `__enter__` 和 `__exit__` 方法的类成为上下文管理器

```python
with open(filename, "w") as f
	#利用f来操作文件
    pass
```

1. 表达式执行完后调用 `__enter__` 方法，将返回值命名为 f
2. 执行接下来对 f 的操作
3. 最后调用 `__exit__` 方法

as 主要用于起别名，通常有两个使用场景

- 给表达式起别名
- 给捕获的异常对象起别名
- 给导入的模块起别名

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

### 捕获异常

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

### 抛出异常

使用 raise 关键字手动抛出异常，常见有三种用法

1. `raise`：单独一个 raise。该语句引发当前上下文中捕获的异常（比如在 except 块中继续抛出异常）或默认引发 RuntimeError 异常
2. `raise Exception`：raise 后带一个异常类名称，表示引发执行类型的异常
3. `raise Exception(message)`：在引发指定类型的异常的同时，附带异常的描述信息

### 自定义异常

自定义异常类需要重写构造函数

```python
class Networkerror(Exception):
    def __init__(self, arg):
        self.args = arg
```
