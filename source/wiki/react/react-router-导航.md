---
title: 导航
categories: [前端, React]
tags: [前端, React]
date: 2025-09-13 19:04
updated: 2025-09-18 00:51
wiki: react
---

react router 提供了 `<Link>`、`<NavLink>` 等组件进行声明式导航，以及 `useNavigate` 等 hook 函数进行程序式导航

## NavLink 与 Link

NavLink 与 Link 用法几乎相同，区别在于 NavLink 提供了不同状态的回调，以供 CSS 设置不同状态的 NavLink 组件，而 Link 不提供状态回调，仅表示一个普通的链接

设置 `to` 属性指定路由的目标地址，可以包含路径参数和查询参数，基本用法如下

```tsx
import { NavLink } from "react-router";

export function MyAppNav() {
  return (
    <nav>
      <NavLink to="/">Home</NavLink>
      <NavLink to="/trending">Trending Concerts</NavLink>
      <!-- 路径参数 -->
      <NavLink to="/concerts/123">All Concerts</NavLink>
      <!-- 查询参数 -->
      <NavLink to="/account?q=abc">Account</NavLink>
    </nav>
  )
}
```

**通过状态回调来改变样式**

NavLink 组件提供了状态回调，通过状态来动态设置 CSS 样式

当 NavLink 处于活动状态时，会为组件默认添加一个 `active` 类

```tsx
<nav id="sidebar">
  <NavLink to="/messages" />
</nav>
```

CSS 样式如下

```css
/* a标签选择NavLink */
#sidebar a.active {
  color: red;
}
```

当需要复杂样式时，可以设置 NavLink 的 `className` 属性和 `style` 属性，NavLink 组件的 `className` 和 `style` 属性支持传入一个函数，其中根据状态来设置不同的样式

`className` 属性的回调函数接收一个对象，可解构为 `isActive`、`isPending` 和 `isTransitioning` 三个字段，回调函数需要返回一个符合 class 属性格式的字符串

```tsx
<NavLink
  to="/messages"
  className={({ isActive, isPending, isTransitioning }) =>
    [
      isPending ? "pending" : "",
      isActive ? "active" : "",
      isTransitioning ? "transitioning" : "",
    ].join(" ")  // 类之间用空格分隔
  }
>
  Messages
</NavLink>
```

`style` 属性的回调函数需返回一个对象，其中设置组件的内联样式

```tsx
<NavLink
  to="/messages"
  style={({ isActive, isPending, isTransitioning }) => {
    return {
      fontWeight: isActive ? "bold" : "",
      color: isPending ? "red" : "black",
      viewTransitionName: isTransitioning ? "slide" : "",
    };
  }}
>
  Messages
</NavLink>
```

可以向 NavLink 的 `children` 属性传入一个回调函数，使得子组件也能获取状态

```tsx
<NavLink to="/tasks">
  {({ isActive, isPending }) => (
    <span className={isActive ? "active" : ""}>Tasks</span>
  )}
</NavLink>
```

使用 `isPending` 状态可以实现加载过程页面

```tsx
<NavLink to="/tasks">
  {({ isActive, isPending }) => (
    isPending
      ? <span className={isActive ? "active" : ""}>Tasks</span>
      : <LoadingComponent/>
  )}
</NavLink>
```

**控制 `to` 属性的匹配**

通过 `end` 和 `caseSensitive` 属性可以控制 `to` 属性与 URL 的匹配逻辑

NavLink 的 `to` 属性默认为前缀匹配，例如 `to="/home"`，则以下 URL 都会匹配到 NavLink

- `/home`：完全匹配
- `/home/123`：前缀匹配
- `/home?q=abc`：路径参数不影响 URL 匹配

前缀匹配的意义在于可以使 URL 路径上的所有路由都处于活动状态，例如 URL 为 `/home/contact`，可以使 `/home` 的路由和它的子路由 `/contact` 都处于活动状态

使用 `end` 属性可以限制匹配逻辑必须是完全匹配

```tsx
<NavLink to="/home" end />
<!-- 或者显式赋值 -->
<NavLink to="/contact" end={true} />
```

| to 属性   | URL          | `end={true}` | `end={false}` |
| ------ | ------------ | ------------ | ------------- |
| /home  | /home        | ✅            | ✅<br>         |
| /home  | /home/       | ✅            | ✅             |
| /home  | /home/123    | ❌            | ✅             |
| /home  | /home?q=abc  | ✅            | ✅             |
| /home  | /home/?q=abc | ✅            | ✅             |
| /home/ | /home        | ✅            | ✅             |
| /home/ | /home/       | ✅            | ✅             |
| /home/ | /home/123    | ❌            | ✅             |
| /home/ | /home?q=abc  | ✅            | ✅             |
| /home/ | /home/?q=abc | ✅            | ✅             |

> `<NavLink to="/">` 是一个特殊情况，若按照前缀匹配规则，任何 URL 都可以匹配到路由，为了避免这种情况，实际上省略了 `end` 属性，`<NavLink to="/">` 的实际效果与 `<NavLink to="/" end>` 相同，只允许 URL 根路径匹配到该路由

`caseSensitive` 属性设置匹配是否区分大小写

| to 属性        | URL         | `caseSensitive={true}` | `caseSensitive={false}` |
| ----------- | ----------- | ---------------------- | ----------------------- |
| /SpOnGe-bOB | /sponge-bob | ✅                      | ✅                       |
| /SpOnGe-bOB | /sponge-bob | ❌                      | ✅                       |

## useNavigate

使用 `useNavigate` 函数实现程序式导航

`useNavigate` 返回一个函数，可直接使用该函数进行导航

```tsx
import { useNavigate } from 'react-router';

const navigate = useNavigate()
navigate("/home")
```

`navigate` 函数接收两个参数

- `to`：与 NavLink 中的 `to` 属性相同，接收一个路径字符串，此外还可以接收一个数字，表示在历史栈中跳转 n 页，例如 `navigate(-1)` 表示退回到上一页
- `options`：导航选项对象
    - `replace`：设为 true 时表示替换历史栈的当前页，而不是添加一页
    - `relative`：指定相对导航模式，默认为 `route`，表示按照路由层次结构导航，设置为 `path` 表示按照 URL 层次结构导航

        ```tsx
        // contacts/:id和contacts/:id/edit在路由层次上为兄弟关系，但在URL层次上为父子关系
        <Route path="/" element={<Layout />}>
          <Route path="contacts/:id" element={<Contact />} />
          <Route
            path="contacts/:id/edit"
            element={<EditContact />}
          />
        </Route>

        function EditContact() {
          navigate("..", { relative: "path" });
        }
        ```
