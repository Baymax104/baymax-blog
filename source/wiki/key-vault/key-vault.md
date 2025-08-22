---
title: 项目简介
categories: [开发相关]
tags: [Android, Jetpack Compose]
date: 2024-05-24 16:31
updated: 2025-08-18 16:36
repo: baymax104/KeyVault
wiki: key-vault
---
KeyVault 是一款安全的密钥管理应用，帮助用户存储和管理各类敏感信息，如账号密码、授权令牌等，并支持标签分类、过期时间设置等功能。

## 功能特点

- 安全存储各类密钥信息（账号密码、授权信息等）
- 支持标签分类管理，便于快速检索
- 可设置密钥过期时间，自动验证
- 简洁直观的用户界面，基于 Material3 设计
- 支持深色 / 浅色模式切换
- 本地加密存储，保障信息安全

## 技术栈

- 开发框架：Android Jetpack Compose
- 语言：Kotlin
- 依赖注入：Koin
- 导航管理：Compose Destinations
- 状态管理：ViewModel + StateFlow
- 本地状态存储：MMKV
- 加密算法：jBCrypt
- 构建工具：Gradle

## 使用说明

1. 首次打开应用，设置初始密钥
2. 进入主页后，可添加、查看、编辑密钥信息
3. 可对密钥添加标签，便于分类管理
4. 在设置中可修改密钥、调整主题等

## 预览

{% swiper effect:cards %}
![](https://cos.baymaxam.top/blog/key-vault/key-vault-1755504834715.jpg)
![](https://cos.baymaxam.top/blog/key-vault/key-vault-1755504912196.jpg)
![](https://cos.baymaxam.top/blog/key-vault/key-vault-1755504915849.jpg)
![](https://cos.baymaxam.top/blog/key-vault/key-vault-1755504942112.jpg)
![](https://cos.baymaxam.top/blog/key-vault/key-vault-1755504961358.jpg)
![](https://cos.baymaxam.top/blog/key-vault/key-vault-1755504980495.jpg)
![](https://cos.baymaxam.top/blog/key-vault/key-vault-1755504985138.jpg)
![](https://cos.baymaxam.top/blog/key-vault/key-vault-1755504988357.jpg)
![](https://cos.baymaxam.top/blog/key-vault/key-vault-1755504991254.jpg)
![](https://cos.baymaxam.top/blog/key-vault/key-vault-1755504995949.jpg)
![](https://cos.baymaxam.top/blog/key-vault/key-vault-1755505000263.jpg)
{% endswiper %}
