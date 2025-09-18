---
title: 其他Hook
categories: [前端, React]
tags: [前端, React]
date: 2025-09-13 19:04
updated: 2025-09-19 01:27
wiki: react
---
## useNavigation

通过 `useNavigation` 函数获取全局导航状态，根据导航状态实现加载页面、导航时禁用表单和提交按钮等

```tsx
import { useNavigation } from 'react-router';

const navigation = useNavigation()
```

`navigation` 对象中包含以下属性

- `state`：导航响应式状态，有以下值
    - `idle`：初始状态
    - `loading`：下一页加载中
    - `submitting`：表单提交执行 `action` 中

    对于一般导航和表格 GET 提交，状态变化过程为 `idle->loading->idle`，对于 POST、DELETE 等表单提交导航（由表单提交导致的导航），状态变化过程为 `idle->submitting->loading->idle`

- `location`：导航目标页面的 `location` 对象
- `formData`：表单提交导航的提交数据
- `json`：`useSubmit` 提交的按 `application/json` 编码的 json 数据
- `text`：`useSubmit` 提交的按 `text/plain` 编码的纯文本数据
- `formAction`：表单提交导航的 `action` 属性
- `formMethod`：表单提交导航的 `method` 属性
- `formEncType`：表单提交导航的编码格式

## useFetcher

在某些情况下，需要模拟 Form 组件的行为而不进行导航时，可以使用 `useFetcher` 来实现，`useFetcher` 返回一个 `fetcher` 对象，使用该对象模拟 Form 组件的行为

```tsx
import { useFetcher } from 'react-router';

const fetcher = useFetcher()
// 指定key参数
const fetcher = useFetcher({ key: "add-to-bag" })
```

`useFetcher` 默认创建一个作用域为当前组件的 `fetcher` 对象，当 `fetcher` 需要跨组件使用时，可传入一个带有 `key` 属性的对象参数，在不同组件中根据 `key` 属性值来获取 `fetcher`

### Form 组件

`fetcher` 对象中提供了一个不具有导航行为的 `<fetcher.Form>` 组件，使用方法与 `<Form>` 组件相同

```tsx
function SomeComponent() {
  const fetcher = useFetcher();
  return (
    <fetcher.Form method="post" action="/some/route">
      <input type="text" />
    </fetcher.Form>
  )
}
```

### 调用 loader 与 action

可通过 `fetcher` 在不导航的情况下调用路由的 loader 和 action，主要使用 `load` 和 `submit` 方法

**load 方法**

load 方法接收一个路由 path，调用该路由的 loader

```tsx
import { useFetcher } from "react-router";

function SomeComponent() {
  const fetcher = useFetcher();

  useEffect(() => {
    if (fetcher.state === "idle" && !fetcher.data) {
      fetcher.load("/some/route")
    }
  }, [fetcher])

  // 通过data属性获取loader返回的数据
  return <div>{fetcher.data || "Loading..."}</div>;
}
```

**submit 方法**

`submit` 方法实现程序式的 `<fetcher.Form>` 组件提交，类似 `<Form>` 与 `useSubmit`，用法与 `useSubmit` 相同

```tsx
import { useFetcher } from "react-router";
import { useFakeUserIsIdle } from "./fake/hooks";

export function useIdleLogout() {
  const fetcher = useFetcher()
  const userIsIdle = useFakeUserIsIdle()

  useEffect(() => {
    if (userIsIdle) {
      fetcher.submit(
        { idle: true },
        { method: "post", action: "/logout" }
      )
    }
  }, [userIsIdle])
}
```

**data 属性**

通过 `fetcher.data` 属性获取 loader 或 action 返回的数据，未调用 loader 或 action 时，`data` 属性为 `null`，该属性同时也是一个响应式状态

```tsx
function ProductDetails({ product }) {
  const fetcher = useFetcher();

  return (
    <details
      onToggle={(event) => {
        if (
          event.currentTarget.open &&
          fetcher.state === "idle" &&
          !fetcher.data
        ) {
          fetcher.load(`/product/${product.id}/details`);
        }
      }}
    >
      <summary>{product.name}</summary>
      <!-- 根据data属性判断loader或action是否返回 -->
      {fetcher.data ? (
        <div>{fetcher.data}</div>
      ) : (
        <div>Loading product details...</div>
      )}
    </details>
  );
}
```

### 其他属性

- `state`：`fetcher` 状态值
    - `idle`：初始状态
    - `submitting`：`fetcher` 提交且 action 函数正在执行
    - `loading`：loader 正在执行
- `formData`：表单提交数据
- `json`：表单提交的使用 `application/json` 编码的数据
- `text`：表单提交的使用 `text/plain` 编码的数据
- `formAction`：表单 `action` 属性值
