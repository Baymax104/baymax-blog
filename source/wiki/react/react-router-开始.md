---
title: 开始
categories: [前端, React]
tags: [前端, React]
date: 2025-09-13 19:04
updated: 2025-09-18 01:15
wiki: react
---

react 中的路由通过 [React Router](https://baimingxuan.github.io/react-router6-doc/start/overview) 来实现，直接安装 `react-router` 即可

```bash
npm install react-router
```

react router 提供了三种模式来支持不同规模的应用，分别是框架模式、数据模式、声明式模式，目前主流使用的依然是数据模式，因此本文仅介绍数据模式（文档参考 v6 版本）

## 基本使用

创建 `routes.tsx` 文件，使用 `createBrowserRouter` 来创建一个 router

```tsx
import { createBrowserRouter } from 'react-router';
import App from '@/App.tsx'

export const router = createBrowserRouter([
  {
    path: "/",  // 必须设置一个路由映射到根路径"/"
    element: <App/>  // 设置组件
  }
])
```

> 在旧版本中使用 `Component` 属性设置组件，在 v6 及以上版本推荐使用 `element` 属性设置组件

在 tsx 使用 `RouterProvider` 作为路由容器

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { router } from '@/router/routes'  // 导入自定义的router
import { RouterProvider } from "react-router";
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
```
