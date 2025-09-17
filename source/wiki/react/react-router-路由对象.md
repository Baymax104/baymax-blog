---
title: 路由对象
categories: [前端, React]
tags: [前端, React]
date: 2025-09-13 19:04
updated: 2025-09-18 01:15
wiki: react
---

传入 `createBrowserRouter` 的对象称为路由对象，通过设置路由对象的属性来实现多种类型的路由

设置 `path` 和 `element` 属性定义基本的路由对象

```tsx
export const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>
  }
])
```

## 嵌套路由

设置 `children` 属性定义路由对象的子路由

> 子路由的 `path` 属性以 `/` 开头，会被视为绝对路径，因此不需要添加 `/`

```tsx
{ 
  path: "/dashboard", 
  element: <Dashboard/>, 
  children: [ 
    { path: "home", element: <Home/> }, 
    { path: "settings", element: <Settings/> }
  ]
}
```

在父路由中使用 `<Outlet>` 作为子路由容器

```tsx
import { Outlet } from "react-router"; 

export default function Dashboard() { 
  return ( 
    <div> 
      <h1>Dashboard</h1> 
      <!-- 子路由容器 -->
      <Outlet /> 
    </div> 
  ) 
}
```

## 布局路由

对于仅作为布局容器的组件，如公共导航栏等，它们不应该占用 URL 片段，此时可以将该组件定义为布局路由，不设置 `path` 属性

```tsx
{
  path: "/dashboard",
  element: <Dashboard/>,
  children: [
    {
      element: <MarketingLayout/>, 
      children: [
        { path: "home", element: <Home/> },  // 路径为/dashboard/home
        { path: "contact", element: <Contact/> }  // 路径为/dashboard/contact
      ]
    }
  ]
}
```

## 索引路由

索引路由匹配到父路由的路径，作为父路由的默认子路由

索引路由设置 `index` 属性为 true，且不设置 `path` 属性

```tsx
{
  path: "/dashboard",
  element: <Dashboard/>,
  children: [
    {
      element: <MarketingLayout/>, 
      children: [
        { index: true, element: <Home/> },  // 路径为/dashboard
        { path: "contact", element: <Contact/> }  // 路径为/dashboard/contact
      ]
    }
  ]
}
```

## 前缀路由

为子路由指定一个 URL 前缀

```tsx
{
  path: "/dashboard",  // 前缀路由不具有布局
  children: [
    {
      element: <MarketingLayout/>, 
      children: [
        { index: true, element: <Home/> },  // 路径为/dashboard
        { path: "contact", element: <Contact/> }  // 路径为/dashboard/contact
      ]
    }
  ]
}
```

## 通配符路由

在 URL 结尾可以使用 `*` 通配符，可以匹配到任意长度的任意字符

```tsx
{
  path: "/files/*",
  element: <Files/>
}
```

## 可选路由

在 URL 片段后加上 `?`，表示该片段是可选的

```tsx
{
  path: "/files/content?",  // 匹配/files和/files/content
  element: <Files/>
}
```

## 错误页面

设置 `errorElement` 属性来指定错误页面，当导航过程或页面加载发生错误时，会自动跳转到错误页面

```tsx
{
  path: "/home",
  element: <Home/>,
  errorElement: <ErrorPage/>
}
```
