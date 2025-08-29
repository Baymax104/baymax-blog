---
title: 容器集合
categories: [Python]
tags: [Python]
date: 2025-08-28 12:32
updated: 2025-08-29 13:40
banner: /assets/banner/python.png
wiki: python
---
Python 中的基本集合类型有列表 list、元组 tuple、字典 dict、集合 set

## 列表

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

## 元组

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

## 字典

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

## 集合

特性与其他语言类似，值唯一且无序，使用大括号包围

```python
s = {1, 2, 3, "Hello"}
```
