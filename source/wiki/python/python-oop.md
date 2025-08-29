---
title: 面向对象
categories: [Python]
tags: [Python]
date: 2025-08-28 13:43
updated: 2025-08-29 17:30
banner: /assets/banner/python.png
wiki: python
---
## 面向对象

使用 `class` 关键字定义一个类

```python
class People:
    name = ''
    age = 0
```

## 成员访问控制

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

## 字段

在类中声明的字段分为类字段和实例字段

- 类变量

  类变量在类外通过类名调用，类内方法体同样通过类名调用，由所有对象实例共享，对象实例不可获取到类变量

- 实例变量

  实例变量在类外通过对象实例调用，类内方法体内通过 self 调用，由对象实例独有，通过类名不可获取到实例变量

在方法内外都可以给类添加动态属性并赋值，通过对象实例定义则为实例变量，通过类名定义则为类变量

## 方法

Python 类内方法分为实例方法，类方法，静态方法

- 实例方法

  参数列表必须包含一个 self 参数，self 表示该类的对象实例，通过对象实例调用

  通过类名调用需要传入 self 参数，若传入的是对象实例，则在方法中可以调用实例方法和类方法，若传入的是类名，则在方法中可以调用类方法和静态方法

- 类方法

  参数列表中包含一个 cls 参数，使用 `@classmethod` 修饰，类方法可以通过类名和对象实例调用，传入的 cls 看做一个类名，可以调用类的构造器或其他方法

- 静态方法

  静态方法参数列表中没有 self 或 cls，只能通过类名调用，使用 `@staticmethod` 修饰

  通过对象调用静态方法会自动传入一个 self 参数，而静态方法不需要 self 参数，所以对象无法调用静态方法

## 构造函数和析构函数

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

## 运算符重载

Python 运算符重载通过一些特殊函数（也称为魔法函数）实现

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

## 继承

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

## 内置类属性

- `__dict__` ：类的属性（包含一个字典，由类的数据属性组成）
- `__doc__` ：类的文档字符串
- `__name__`：类名
- `__module__`：类定义所在的模块
- `__bases__` ：类的所有父类构成元素（包含了一个由所有父类组成的元组）
- `__doc__`：类的文档字符串
- `__class__`：获取对象的类对象，获取类名：`__class__.__name__`

## 垃圾回收

Python 使用引用计数来跟踪和回收垃圾，当一个变量或一个对象被创建时，引用计数器 (一个内部跟踪变量) 增加该对象的引用，当对象的引用计数为 0 时，解释器在适当的时机回收该对象的内存

循环引用是指两个对象相互引用，但没有其他对象引用他们，在循环引用的情况下，循环垃圾收集器会留意未被引用计数销毁的对象，试图回收未被清理的循环引用
