---
title: 副作用
categories: [前端, React]
tags: [前端, React]
date: 2025-09-09 14:28
updated: 2025-09-13 19:04
wiki: react
---
## Ref

ref 能够在重渲染时保留数据，但更新 ref 不会触发重渲染，简单用法如下

```tsx
import { useRef } from 'react';

const countRef = useRef(0)  // 传入初始值
countRef.current = 1
console.log(countRef.current)  // 读取值
```

ref 是一种副作用，若在渲染过程中使用 ref，会导致组件渲染的结果难以预测，破坏组件的纯函数性质，因此最好不要在渲染过程中使用 ref，即不要在组件函数体的最顶层使用 ref，而应该在事件处理函数中使用 ref

### 操作 DOM 元素

ref 中的数据可以在重渲染中保留，因此可以用来保存 DOM 元素的引用，通过 ref 来直接操作 DOM 元素，此时 ref 就相当于组件 DOM 的句柄

```tsx
import { useRef } from 'react';

export default function App() {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <>
      <input ref={inputRef}/>
      <button onClick={() => inputRef.current?.focus()}>聚焦</button>
    </>
  )
}
```

**操作自定义子组件**

对于自定义的组件，可以使用 hook 函数 `useImperativeHandle` 来定义子组件向外暴露的数据，通过 props 传递 ref 来实现自定义子组件的 ref 句柄

> 在 React 19 版本中，不再使用 `forwardRef` 来允许子组件暴露 ref，可以直接在 props 中指定 ref 参数

`useImperativeHandle` 需要传入两个参数

- `ref`：子组件的 ref 句柄
- `createHandle`：一个返回句柄对象的函数，句柄对象是一个自定义对象，其中包含子组件向外暴露的数据和方法

> 句柄对象中尽量不要提供改变 DOM 结构的操作，DOM 结构应当由 state 来控制

```tsx
import { type Ref, useImperativeHandle, useRef } from "react";

// 定义子组件句柄类型
type MyInputHandle = { focus: () => void }

function MyInput({ref}: { ref: Ref<MyInputHandle> }) {
  const realInputRef = useRef<HTMLInputElement>(null);
  // 设置句柄
  useImperativeHandle(ref, () => ({
    focus() {
      realInputRef.current?.focus();
    },
  }));
  return <input ref={realInputRef}/>;
}

export default function App() {
  const inputRef = useRef<MyInputHandle>(null);

  return (
    <>
      <MyInput ref={inputRef}/>
      <button onClick={() => inputRef.current?.focus()}>聚焦输入框</button>
    </>
  );
}
```

**同步更新状态**

有些情况下，需要同步进行状态更新与 DOM 元素的操作

例如更新列表后，滚动到最后一项，简单示例如下

```tsx
setItems([...items, newItem])  // 添加到最后一项
listRef.current.lastChild.scrollIntoView()
```

由于状态的实际更新并不在调用 `setItems` 的执行流中，因此 `listRef` 中的 `lastChild` 是未更新的列表的最后一项，到 DOM 更新完成后，实际滚动到的是新列表的倒数第二项

使用 `react-dom` 包中的 `flushSync`，可以同步更新状态，使得状态与 DOM 操作是同步的

```tsx
import { flushSync } from 'react-dom';

flushSync(() => {
    setItems([...items, newItem])
})
listRef.current.lastChild.scrollIntoView()
```

## Effect

react 中的副作用主要由两个来源引起

- 事件处理函数：受用户行为驱动来改变组件的状态
- 渲染过程本身：由渲染过程引起的，在渲染和 DOM 更新完成后进行的与外部系统的同步

基本用法如下

```tsx
import { useEffect, useState } from 'react';

function Counter({count}: { count: number }) {
  useEffect(() => {
    // 每次渲染后会执行这里的代码
    if (count == 5) {
      alert(count)
    }
  })
  
  return <div>{count}</div>
}

export default function App() {
  const [count, setCount] = useState(0)
  
  return (
    <>
      <Counter count={count} />
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </>
  )
}
```

### 依赖状态

通常情况下，只需要 `useEffect` 在某些情况下执行，而不是每次渲染后都执行，通过设置 `useEffect` 的依赖状态数组来实现条件执行

只有当依赖状态数组中的状态更新，才会执行 `useEffect` 中的代码

```tsx
import { useEffect, useState } from "react";


function Counter({count, count1}: { count: number, count1: number }) {
  useEffect(() => {
    // 每次渲染后会执行这里的代码
    if (count == 5) {
      alert(count)
    }
    console.log(count)
  }, [count1])  // 传入deps参数，指定依赖状态数组

  return <div>{count}</div>
}

export default function App() {
  const [count, setCount] = useState(0)
  const [count1, setCount1] = useState(0)

  return (
    <>
      <Counter count={count} count1={count1}/>
      <button onClick={() => setCount(count + 1)}>Add count</button>
      <button onClick={() => setCount1(count1 + 1)}>Add count1</button>
    </>
  )
}
```

以上代码中，`useEffect` 依赖了 `count1` 状态，因此只有 `count1` 状态更新，才会执行 `useEffect` 中的代码，即使代码中使用了其他状态

若依赖数组为空，则 `useEffect` 只在初次渲染时执行一次

```tsx
// 只在初次渲染时执行
useEffect(() => {
    if (count == 5) {
      alert(count)
    }
    console.log(count)
}, [])
```

> 若在 `useEffect` 依赖 `count1` 的状态下，在 `useEffect` 中更新 `count1`，会导致**无限循环**，因此只允许在 `useEffect` 中读取状态和更新非依赖状态

实际上，`useEffect` 通过判断依赖数组中存储的**引用是否变化**来决定是否执行，而组件内的 `ref` 的引用是不可变的，因此在依赖数组中设置 `ref` 不会触发 `useEffect`

```tsx
const ref = useRef(null)
useEffect(() => {  
  if (isPlaying) {  
    ref.current.play();  
  } else {  
    ref.current.pause();  
  }  
}, [isPlaying, ref])
```

### 清理函数

`useEffect` 通常被用于与外部系统进行同步，其中会操作一些与外部系统有关的资源，如数据库连接等。通常在 `useEffect` 中实现创建资源的逻辑，为避免重复创建资源的问题，需要有一个地方来定义清理资源的逻辑

可以在 `useEffect` 中返回一个函数，该函数称为清理函数，在其中定义清理资源的逻辑，react 会在每次 `useEffect` 重新执行之前调用清理函数，并且在组件被移除时最后调用一次清理函数

```tsx
useEffect(() => {
  const connection = createConnection()
  connection.connect()
  
  // 返回清理函数
  return () => {
    connection.disconnect();  
  }
}, [])
```

### 数据请求

在 `useEffect` 中请求服务端数据是一种常见的做法，通常将请求封装为以下 hook 函数

```ts
function useData(url: string) {
  const [data, setData] = useState(null);  
  useEffect(() => {  
    let ignore = false
    fetch(url)
      .then(response => response.json())
      .then(json => {
        if (!ignore) {
          setData(json)
        }
      })
  
    return () => ignore = true
  }, [url])

  return data
}
```

以上代码可以保证获取的数据与组件状态是同步的且是最新的，即解决竞态条件问题

使用一个 `ignore` 标志表示组件是否处于当前渲染中，当 `ignore` 为 false 时，说明组件正在进行当前渲染，发送数据请求。当数据请求响应时，若组件没有进行重渲染，则 `ignore` 仍为 false，调用 `setData` 设置 data。若组件进行了重渲染，则清理函数被调用，`ignore` 为 true，此时忽略上一次渲染时服务端响应的数据

但直接在 `useEffect` 中使用 `fetch` 请求服务端数据，在 react 中通常是不建议的，有以下弊端

- Effect 不会在服务端运行：这意味着最初由服务器渲染的 HTML 只会包含加载状态，而没有实际数据。客户端必须先下载所有的 JavaScript 并渲染应用，才会发现它需要加载数据——这并不高效
- 容易产生“网络瀑布”：首先父组件渲染时请求一些数据，随后渲染子组件，接着子组件开始请求它们的数据。如果网络速度不快，这种方式会比并行获取所有数据慢得多
- 无法预加载或缓存数据：若组件卸载后重新挂载，它必须重新获取数据
- 不够简洁：编写 fetch 请求时为了避免竞态条件等问题，会需要很多样板代码

在 react 生态中有更好的替代方案，如 [React Query](https://tanstack.com/query/v4/docs/framework/react/overview)

**订阅外部数据**

有时需要在外部数据改变时，触发组件状态的改变，可以通过 `useSyncExternalStore` 函数实现

该 hook 传入三个参数

- `subscribe`：订阅函数，该函数接收一个 `callback` 函数，返回一个订阅的清理函数，在初始化订阅时将 `callback` 设置到外部数据源，当外部数据改变时，会调用 `callback` 函数
- `getSnapshot`：一个返回外部数据的函数
- `getServerSnapshot`：用于服务端渲染

订阅浏览器的 `onLine` 数据，示例如下

```ts
import { useSyncExternalStore } from 'react';

function subscribe(callback) {  
  window.addEventListener('online', callback)
  window.addEventListener('offline', callback)
  return () => {
    window.removeEventListener('online', callback)
    window.removeEventListener('offline', callback)
  }
}

function useOnlineStatus() {
  return useSyncExternalStore(  
    subscribe, // 只要传递的是同一个函数，React 不会重新订阅  
    () => navigator.onLine,
    () => true
  )
}
```
