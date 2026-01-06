---
title: 文件操作
categories: [Python]
tags: [Python]
date: 2025-08-29 13:22
updated: 2025-08-29 17:27
banner: /assets/banner/python.png
wiki: python
---
## 打开文件

使用 `open(filename, mode)` 打开文件或创建新文件

使用 `close()` 关闭文件

访问模式

- r：只读，指针在文件开头
- w：只写，会覆盖原文件
- a：追加，指针在文件尾部
- rb,wb,ab：以二进制操作
- r+,w+,a+：支持读写，特点与对应模式一致
- rb+,wb+,ab+

## 读写文件

- `write(str)`：写入文件，返回写入的字符数

- `read(n)`：读取 n 个字符，同时指针后移

- `readline()`：读取一行，同时指针移动到下一行

- `readlines()`：读取所有行，返回一个列表，每个元素为一行

- `tell()`：返回文件指针目前位置

- `seek(offset, from_what)`：移动文件指针

  offset 为移动字符数，从尾部开始移动，offset 为负数

  from_what 可选 0（文件开头），1（当前位置），2（文件末尾）

## pathlib 模块

`pathlib` 是 Python 3.4+ 标准库中引入的一个模块，提供了一种面向对象的方式来处理文件系统路径，自动处理不同操作系统中的路径，可以完全替代 `os.path` 模块

### 基本用法

使用 `Path` 对象表示一个路径

```python
# 当前目录
current_dir = Path.cwd()
print(f"当前目录: {current_dir}")

# 用户主目录
home_dir = Path.home()
print(f"用户主目录: {home_dir}")

# 指定路径（跨平台）
file_path = Path("data/sample.txt")
```

### 路径操作

`Path` 对象重载了 `/` 运算符，可以实现路径的拼接操作

```python
# 路径拼接 - 使用 / 操作符
config_path = home_dir / "config" / "settings.ini"
print(f"配置文件路径: {config_path}")

# 获取路径各部分
path = Path("/Users/username/Documents/report.pdf")
print(f"根目录: {path.root}")          # 根目录
print(f"父目录: {path.parent}")        # 父目录
print(f"文件名: {path.name}")          # 文件名（含扩展名）
print(f"stem: {path.stem}")            # 文件名（不含扩展名）
print(f"后缀: {path.suffix}")          # 文件后缀
print(f"所有后缀: {path.suffixes}")    # 所有后缀列表

# 解析路径
resolved_path = path.resolve()  # 解析为绝对路径
print(f"绝对路径: {resolved_path}")
```

判断路径是否存在以及是否是文件或目录

```python
path = Path("example.txt")

# 检查路径是否存在
if path.exists():
    print(f"{path} 存在")
else:
    print(f"{path} 不存在")

# 检查是否是文件
if path.is_file():
    print(f"{path} 是文件")

# 检查是否是目录
if path.is_dir():
    print(f"{path} 是目录")
```

### 文件操作

```python
# 写入文件
text_file = Path("example.txt")
text_file.write_text("Hello, pathlib!")  # 写入文本

# 读取文件
content = text_file.read_text()  # 读取文本
print(content)

# 二进制文件操作
binary_file = Path("data.bin")
binary_file.write_bytes(b'\x00\x01\x02\x03')  # 写入二进制数据
data = binary_file.read_bytes()  # 读取二进制数据

# 重命名/移动文件
old_file = Path("old_name.txt")
new_file = Path("new_name.txt")
if old_file.exists():
    old_file.rename(new_file) # 重命名或移动
    
# 删除文件
if new_file.exists():
    new_file.unlink() # 删除文件
```

### 目录操作

```python
# 创建目录
new_dir = Path("new_directory")
new_dir.mkdir(exist_ok=True)  # 创建目录，如果已存在则不报错

# 创建多级目录
multi_dir = Path("level1/level2/level3")
multi_dir.mkdir(parents=True, exist_ok=True)  # 创建多级目录

# 列出目录内容
current_dir = Path.cwd()
print("目录内容:")
for item in current_dir.iterdir():  # 遍历当前目录
    print(f" - {item.name}")

# 递归遍历目录
print("\n递归遍历目录:")
for item in current_dir.rglob("*"):  # 递归遍历所有子目录
    print(f" - {item.relative_to(current_dir)}")
    
# 删除空目录
empty_dir = Path("empty_directory")
if empty_dir.exists() and not any(empty_dir.iterdir()):
    empty_dir.rmdir() # 删除空目录

# 删除非空目录，需要使用shutil
import shutil
non_empty_dir = Path("non_empty_directory")
if non_empty_dir.exists():
    shutil.rmtree(non_empty_dir) # 删除非空目录及其内容
```
