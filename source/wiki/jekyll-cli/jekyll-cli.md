---
title: 项目简介
categories: [开发相关]
tags: [Jekyll, CLI, Typer]
date: 2024-05-24 16:31
updated: 2025-07-21 20:25
repo: baymax104/jekyll-cli
wiki: jekyll-cli
---
## 项目背景

前段时间写了挺多博客，一直是用 [`jekyll-compose`](https://github.com/jekyll/jekyll-compose) 来完成创建、发布等功能，但使用过程中也遇到挺多不满意的地方，比如命令太长、`typora-root-url` 加上引号导致 typora 预览失效、不能在任意目录执行命令等

在此背景下，我首先开发了 `PowerJekyll` 项目，但 `PowerJekyll` 虽说是一个 `PowerShell` 模块，但却依赖于 Python 环境，并且模块的 `PowerShell` 脚本只是完成了自动补全的注册，并没有功能上的增加，显得可有可无

同时，我接触到了 [`Typer`](https://typer.tiangolo.com/) 框架，一个用于构建 CLI 应用的现代化框架，使用装饰器定义一个指令的执行函数，同时使用类型标记完成参数的类型验证，极大简化了命令行参数的解析和验证。不仅如此，相比原来的 `argparse`，`Typer` 打印的帮助文档更加美观，同时支持 `rich` 库输出美观的控制台文本。因此，我决定大刀阔斧，使用 `Typer` 重写项目，并且更名为 `jekyll-cli`，使用 `UV` 管理依赖和打包，项目已发布在 PyPi 上

PyPi: [jekyll-cli · PyPI](https://pypi.org/project/jekyll-cli/)

Github: [Baymax104/jekyll-cli: Jekyll Blog CLI Tool (github.com)](https://github.com/Baymax104/jekyll-cli)

## 主要功能

- ​**​博客服务器管理​**​：通过简单的命令启动本地博客服务器，支持预览草稿和正式文章。
- ​**​文章管理​**​：轻松创建、编辑、删除和发布文章，支持草稿和正式文章的分类管理。
- ​**​配置管理​**​：灵活配置博客根目录、编辑器、管理方式等，满足个性化需求。
- ​**​索引同步​**​：自动同步博客文章索引，确保文章列表的实时更新。

## 技术栈

- ​**​Python​**​：作为主要编程语言，提供了强大的功能和丰富的库支持。
- ​**​Typer​**​：用于构建命令行界面，简洁易用。
- ​**​Pydantic​**​：用于数据验证和设置管理，确保数据的准确性和一致性。
- ​**​InquirerPy​**​：提供交互式命令行界面，提升用户体验。

## 安装与使用

安装 Jekyll-CLI 非常简单，只需使用 pip 进行安装：

```
pip install jekyll-cli
```

安装完成后，你可以通过以下命令开始使用：

```
blog --help
```

这将显示所有可用的命令和选项，帮助你快速上手。

## 使用示例

- ​**​初始化博客配置​**​：

```
blog init
```

按照提示输入博客根目录、编辑器和管理模式等信息，完成初始配置。

- ​**​创建新文章​**​：

```
blog post "我的第一篇博客文章" --title "探索Jekyll-CLI的奥秘" --tag "技术" --class "编程"
```

- ​**​启动本地服务器​**​：

```
blog serve --draft --port 4000
```
