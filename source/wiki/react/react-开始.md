---
title: 开始
categories: [前端, React]
tags: [前端, React]
date: 2025-09-01 15:12
updated: 2025-09-01 15:12
wiki: react
---

React 是由 Facebook 开发并维护的一个用于构建用户界面的 JavaScript 库。它以其组件化、声明式和高效的特点，成为了现代前端开发的主流技术之一

## 创建项目

React 支持 Vite 构建工具，可以使用 Vite 创建项目，开箱即提供合理的默认配置

```bash
npm create vite@latest my-app -- --template react
```

创建项目后进入目录，安装依赖

{% tabs active:1 %}

<!-- tab npm -->

```bash
cd my-app
npm install
```

<!-- tab yarn -->

```bash
cd my-app
yarn install
```

{% endtabs %}

## 运行项目

{% tabs active:1 %}

<!-- tab npm -->

```bash
npm run dev
```

<!-- tab yarn -->

```bash
yarn run dev
```

{% endtabs %}

## 项目结构

项目的默认目录结构如下

```
my-app/
├── node_modules/
├── public/                    # 静态资源（不经过构建处理）
│   └── vite.svg
├── src/                       # 源代码目录
│   ├── assets/                # 静态资源（经过构建处理）
│   │   └── react.svg
│   ├── components/            # 公共组件
│   ├── App.tsx                # 根组件
│   ├── App.css                # 根组件样式
│   ├── main.tsx               # 项目入口文件
│   └── vite-env.d.ts          # 类型声明文件（TS项目）
├── .gitignore
├── eslint.config.js           # ESLint配置
├── index.html                 # 入口HTML
├── package.json               # 项目配置
├── vite.config.js             # Vite配置
├── tsconfig.json              # TypeScript配置文件
├── tsconfig.app.json          # 应用代码的TypeScript配置（针对浏览器环境）
├── tsconfig.node.json         # Node环境的TypeScript配置（针对Vite配置）
└── README.md
```

项目中有两个目录可以存放静态资源，分别是 `public` 和 `src/assets`

- `public`：不经过构建工具的构建，其中的内容会被原样复制到 `dist` 目录中，以 `public` 作为根目录来引用，例如 `/image.jpg` 引用 `public/image.jpg`
- `src/assets`：经过构建工具的构建，存放与组件相关的资源，可以通过 `@/assets/` 引用
