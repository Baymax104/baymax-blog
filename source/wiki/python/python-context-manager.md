---
title: 上下文管理器
categories: [Python]
tags: [Python]
date: 2025-08-29 13:28
updated: 2025-08-29 18:01
banner: /assets/banner/python.png
wiki: python
---
上下文管理器（Context Manager）是 Python 中管理资源的优雅方式，通过 `with` 语句自动处理资源的获取和释放

## 类上下文管理器

一个实现了 `__enter__` 和 `__exit__` 方法的类成为上下文管理器

```python
class MyContext:
    def __enter__(self):
        print("进入上下文")
        return self  # 返回值会被as接收
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        print("退出上下文")
        if exc_type:  # 如果有异常
            print(f"发生异常: {exc_val}")
        return True  # 返回True表示已处理异常

# 使用示例
with MyContext() as ctx:
    print("在上下文中执行操作")
    raise ValueError("测试异常")
```

执行流程如下

1. 表达式执行完后调用 `__enter__` 方法，将返回值命名为 f
2. 执行接下来对 f 的操作
3. 最后调用 `__exit__` 方法

> as 主要用于起别名，通常有以下使用场景
> - 给表达式起别名
> - 给捕获的异常对象起别名
> - 给导入的模块起别名

## contextlib 上下文管理器

通过 `contextlib` 模块和 `yield` 关键字实现上下文管理器

```python
from contextlib import contextmanager

@contextmanager
def file_manager(filename, mode):
    print("打开文件")  # 相当于__enter__
    f = open(filename, mode)
    try:
        yield f  # yield前的代码相当于__enter__，yield值给as
    finally:
        print("关闭文件")  # 相当于__exit__
        f.close()

# 使用示例
with file_manager("test.txt", "w") as f:
    f.write("Hello Context!")
```

contextlib 中的其他工具

```python
from contextlib import closing, suppress

# 自动调用close()方法
with closing(urlopen('http://example.com')) as page:
    content = page.read()

# 忽略特定异常
with suppress(FileNotFoundError):
    os.remove("nonexistent.txt")
```

## 异步上下文管理器

两种方式都有对应的 async 异步支持

**异步类上下文管理器**

```python
class AsyncDatabase:
    async def __aenter__(self):
        self.conn = await async_create_connection()  # 异步建立连接
        print("异步数据库连接已建立")
        return self.conn
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        await self.conn.close()  # 异步关闭
        print("异步数据库连接已关闭")

# 使用示例（需在async函数内）
async def fetch_data():
    async with AsyncDatabase() as conn:
        result = await conn.fetch("SELECT * FROM async_users")
        print(result)
```

**contextlib 异步装饰器**

```python
from contextlib import asynccontextmanager

@asynccontextmanager
async def async_timer():
    start = time.time()
    try:
        yield
    finally:
        print(f"异步操作耗时: {time.time()-start:.2f}s")

# 使用示例
async def main():
    async with async_timer():
        await asyncio.sleep(1)  # 模拟异步操作
```

## 管理多个上下文

通过 `ExitStack` 或 `AsyncExitStack` 可以同时管理多个上下文，调用 `enter_context()` 和 `exit_context()` 来进入或退出上下文

**同步示例**

```python
from contextlib import ExitStack

def process_files(filenames):
    with ExitStack() as stack:
        # 动态添加多个文件上下文
        files = [stack.enter_context(open(fname, 'r')) for fname in filenames]
        
        # 也可以添加非上下文对象（需手动清理）
        temp_data = stack.enter_context(tempfile.NamedTemporaryFile())
        
        # 处理所有文件
        for f in files:
            print(f.read(100))  # 读取每个文件前100字符
        # 所有资源会在退出with块时自动释放
```

**异步示例**

```python
from contextlib import AsyncExitStack
import aiofiles

async def process_async_files(urls):
    async with AsyncExitStack() as stack:
        # 动态管理多个异步资源
        files = []
        for url in urls:
            # 异步打开文件（模拟）
            f = await stack.enter_async_context(aiofiles.open(url, 'r'))
            files.append(f)
        
        # 异步处理所有文件
        contents = []
        for f in files:
            contents.append(await f.read())
        return contents
```
