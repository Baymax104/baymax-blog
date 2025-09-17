---
title: 数据传递
categories: [前端, React]
tags: [前端, React]
date: 2025-09-13 19:04
updated: 2025-09-18 00:55
wiki: react
---

react router 中主要通过三种方式实现路由间的数据传递

- 路径参数：从 URL 中提取
- 查询参数：URL 中跟在 `?` 后的键值对
- 状态参数：可传递复杂的临时对象

## 路径参数

在 URL 路径片段前加上 `:`，表示该片段为路径参数

```tsx
{
  path: "/teams/:teamId",  // 路径参数teamId
  element: <Team/>
}
```

在 NavLink 或 `navigate` 函数的 `to` 字符串中传入参数值

```tsx
const teamId = 123;

// NavLink
<NavLink to={`/team/${teamId}`}>Team</NavLink>

// navigate
const navigate = useNavigate()
navigate(`/team/${teamId}`)
```

在组件中通过 `useParams` 函数获取参数

```tsx
import { useParams } from 'react-router';

function Team() {
    const { teamId } = useParams()
}
```

## 查询参数

在 NavLink 或 `navigate` 函数的 `to` 字符串中传入查询参数值

```tsx
const teamId = 123;

// NavLink
<NavLink to={`/team?teamId=${teamId}`}>Team</NavLink>

// navigate
const navigate = useNavigate()
navigate(`/team?teamId=${teamId}`)
```

使用 `useSearchParams` 函数来管理当前页面 URL 的查询参数

```tsx
import { useSearchParams } from 'react-router';

const [searchParams, setSearchParams] = useSearchParams()
```

`searchParams` 是一个 `URLSearchParams` 类型的响应式对象，其中提供了 `get`、`set` 等方法来操作查询参数

`setSearchParams` 函数与状态的 `set` 函数类似，会触发组件重渲染，同时 URL 中的查询参数也会改变

## 状态参数

状态参数可用于传递复杂的临时对象，在 NavLink 或 `navigate` 函数中传入参数值

```tsx
const state = {name: "Hello"}

<NavLink to="/home" state={state}>Home</NavLink>

const navigate = useNavigate()
navigate("/home", { state: state })  // 在options参数的state字段传入
```

通过 `useLocation` 函数获取当前页的 location 对象，从中解构出 state 字段

```tsx
import { useLocation } from 'react-router';

function Home() {
  const { state } = useLocation()
}
```
