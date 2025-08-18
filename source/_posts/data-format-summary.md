---
title: 常见数据文本格式总结
categories: [开发相关]
tags: [XML, JSON, YAML, TOML]
date: 2024-10-24 16:00
updated: 2025-07-07 00:16
---
## XML

XML 是一种可扩展的数据标记语言，被用于传输数据，文件后缀为.xml

XML 的标签为自定义标签，标签必须成对，使用 `<!---->` 表示注释

XML 结构为树结构，需要有一个根标签，通常具有头声明

```xml
<?xml version="1.0" encoding="utf-8"?>
<root>
	<name></name>
    <author></author>
    <msg>
        <price></price>
    </msg>
</root>
```

xml 属性必须用引号包围，单引号或双引号都可以，若属性值包含双引号，则可以用单引号包围属性值，或者使用实体引用

**实体引用**

| 实体     | 符号 | 描述   |
| -------- | ---- | ------ |
| `&lt;`   | <    | 小于   |
| `&gt;`   | >    | 大于   |
| `&amp;`  | &    | 和号   |
| `&apos;` | '    | 单引号 |
| `&quot;` | "    | 引号   |

xml 的样式表语言为 XSLT，也可使用 css 设置样式

样式链接声明：`<?xml-stylesheet type="text/xsl" href="simple.xsl"?>`

**命名空间**

用于解决不同 xml 文档中相同标签的冲突

1. 使用前缀解决冲突：`<h:table></h:table>`

2. 使用默认命名空间

    在冲突标签中加入 xmlns 属性，`<table xmlns="namespaceURL"></table>`

3. 使用前缀 + 命名空间

    在冲突标签中加入前缀和 xmlns 属性，`<h:table xmlns:h="namespaceURL"></h:table>`

**CDATA 标签**

当标签内使用大量不需要解析的字符，如使用大量实体引用或代码，可以使用 CDATA 标签

```xml
<![CDATA[
content
]]>
```

## JSON

JSON 使用 js 对象的表示方法来表示数据，比 xml 更容易解析，通常用于数据传输，文件后缀为.json

json 中使用键值对 `“key”: value` 来表示数据，key 使用引号包括，不同的 key-value 之间使用逗号分隔

value 类型

- number
- string
- bool
- array
- object
- null

json 使用大括号{}表示一个 object，一个 object 内包含多个 key-value

json 使用中括号 [] 表示一个 array，一个 array 内包含多个 value

一个 json 文件最外层是一层大括号，表示当前文件的 json 对象

json 不支持注释

```json
{
    "key1": 100,
    "key2": true,
    "array": ["e1", "e2"]
}
```

## YAML

yaml 常用于表示配置文件，逻辑结构，文件后缀为.yml

yaml 使用缩进来表示层级关系，不能使用 tab，只能使用空格，使用 `#` 表示注释

分号后必须加空格

数据类型

- 对象：key-value 的集合
- 数组：value 的有序序列
- 字面量：单个的，不可再分的值

**字面量**

- null：~

- 单行字符串

    ```yaml
    string: >
      single string
      second string
    # single string second string\n
    string: >-
      single string
      second string
    # single string second string
    ```

- 多行字符串

    ```yaml
    string: |
      first
      second
    # first\nsecond\n
    ```

字符串通常不需要使用双引号和单引号

单引号中的 `\` 不会转义，双引号会转义 `\`

**数组**

以 - 开头表示数组的一个元素

```yaml
array:
  - item1
  - item2
array: [item1, item2]
```

**对象**

属性以键值对表示

```yaml
object:
  name: xxx
  age: xxx
```

## TOML

TOML 是一种用于配置文件的简单标记语言

TOML 的基本单位是键值对，每一行为一个键值对，键名中使用 `.` 表示层次结构

```toml
# 一个键值对
key = "value"

key.key1 = "value"
# 等价于
# {
#   "key": {
#     "key1": "value"
#   }
# }
```

可以支持以下基本类型

- 数值
- 布尔值
- 字符串
- 日期和时间
- 数组

**表**

toml 中使用 `[tablename]` 声明一个表，它是键值对的集合，表名也支持使用 `.` 表示层次结构

```toml
[table-1]
key1 = "some string"
key2 = 123

[table-2]
key1 = "another string"
key2 = 456
```

**内联表**

内联表可以将一个表中的内容写在同一行

```toml
name = { first = "Tom", last = "Preston-Werner" }
point = { x = 1, y = 2 }
animal = { type.name = "pug" }
# 等价于
[name]
first = "Tom"
last = "Preston-Werner"
[point]
x = 1
y = 2
[animal]
type.name = "pug"
```

**表数组**

```toml
[[products]]
name = "Hammer"
sku = 738594937

[[products]]
name = "Nail"
sku = 284758393
color = "gray"
# 等价于
# {
#   "products": [
#     { "name": "Hammer", "sku": 738594937 },
#     { "name": "Nail", "sku": 284758393, "color": "gray" }
#   ]
# }
```
