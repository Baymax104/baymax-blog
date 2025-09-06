---
title: 状态管理
categories: [前端, React]
tags: [前端, React]
date: 2025-09-06 18:38
updated: 2025-09-06 18:38
wiki: react
---
## State 状态

react 中的组件会经历多次反复的渲染，普通变量无法在多次渲染中保存状态，每次渲染，普通变量都会重新进行初始化，使用 State 状态可以在多次渲染中保存状态，使得下一次渲染时可以恢复上一次渲染的状态

在 react 中使用一个 hook 函数 `useState` 实现状态保存，该函数返回一个数组，其中第一个元素是状态的只读值，第二个元素是修改状态的函数

```tsx
import { useState } from 'react';

export default function App() {
  const [count, setCount] = useState(0)  // 传入状态的初始值

  return (
    <>
      <div>{count}</div>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </>
  )
}
```

> react 中有一类特殊的函数，称为 Hook 函数，通常以 `use` 开头，在函数体中可以使用 react 的执行上下文，如 State 等，hook 之间可以相互调用，且只能在组件函数体的最顶层调用

react 中状态的记录依赖于 `useState` 的调用顺序，相当于以 `useState` 的调用次数作为状态的索引，并顺序存储状态，在下一次渲染时，按照顺序依次恢复状态，因此 react 要求 `useState` 等 hook 函数必须在组件函数体的最顶层调用

## 组件渲染

从组件到 DOM 节点需要经历以下阶段

1. 触发：触发一次渲染
2. 渲染：执行组件函数
3. 提交：将执行结果转化为 DOM 节点

**触发**

通常只在以下情况会触发渲染

- 应用启动：触发组件初次渲染
- 组件状态更新：触发组件的重渲染

**渲染**

在应用启动时，会执行 `render` 函数进行初次渲染，从根组件开始，递归地进行渲染

```tsx
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

当组件状态更新时，触发组件的重渲染

重渲染时，react 会从状态发生变化的组件开始，检查它的子树，计算有哪些组件需要重新渲染，最后生成新的虚拟 DOM 树

**提交**

通过 Diff 算法比较新的虚拟 DOM 与旧的真实 DOM 之间的差异，最小化地更新节点

## 状态更新与渲染

当调用状态的 `set` 函数后，会向 react 请求一次重新渲染，每次请求都是**基于当前的状态**，该请求会被放入队列中，当 react 执行重渲染并调用 `useState` 时，react 会遍历队列，执行所有的状态更新逻辑，将最终结果作为 `useState` 的返回值

例如以下代码

```tsx
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(number + 1);
        setNumber(number + 1);
        setNumber(number + 1);
      }}>+3</button>
    </>
  )
}
```

在 `<button>` 的事件处理函数中调用了三次 `setNumber`，且三次 `setNumber` 都位于同一个执行流。若 `number` 的当前状态值为 0，那么事件处理函数当前执行流中的 `number` 状态值就也为 0，调用三次 `setNumber` 时，传入的值实际上都是 `0 + 1`，即向 react 提出了三次“将 `number` 状态值更新为 1”的请求，因此在执行重渲染后，`number` 的状态值被更新为 1，而不是 3

**实现状态连续更新**

状态的 `set` 函数支持传入一个更新函数，当 react 依次执行队列中的更新逻辑时，会将上一个更新逻辑的结果传入该函数进行更新，该函数的返回值会传入下一个更新逻辑中

```tsx
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(number + 5);
        setNumber(n => n + 1);
      }}>增加数字</button>
    </>
  )
}
```

`number` 的初始状态为 0，第一次调用 `setNumber` 时传入的值为 `0 + 5`，即在重渲染时，将 `number` 状态值更新为 5，该请求被放入队列中。第二次调用 `setNumber` 时传入了一个更新函数，该函数作为更新逻辑放入到队列中。当 react 遍历队列时，首先将 `number` 状态值更新为 5，之后将该结果传入到更新函数 `n => n + 1` 中并执行，返回值为 6，该结果作为重渲染时 `useState` 的返回值，即重渲染后，`number` 状态值更新为 6

## 对象状态更新

当 state 中存储的是一个对象时，在代码上可以对对象中的字段进行修改，但这不会触发状态更新，应该使用 `set` 函数直接赋值一个新的对象（引用与之前不同）

```tsx
const [person, setPerson] = useState({  
  name: 'Niki de Saint Phalle',  
  artwork: {  
    title: 'Blue Nana',  
    city: 'Hamburg',  
    image: 'https://i.imgur.com/Sd1AgUOm.jpg',
  }  
});

setPerson({  
  ...person, // 复制其它字段的数据
  artwork: { // 替换 artwork 字段
    ...person.artwork, // 复制之前 person.artwork 中的数据
    city: 'New Delhi' // 将 city 的值替换为 New Delhi
  }
});
```

## 数组状态更新

与对象状态更新相同，需要使用 `set` 函数赋值一个新的数组

数组中有些方法是原地修改的，不能返回新的数组

|      | 原地修改                       | 返回新数组                    |
| ---- | -------------------------- | ------------------------ |
| 添加元素 | `push`，`unshift`           | `concat`，`[...arr]` 展开语法 |
| 删除元素 | `pop`，`shift`，`splice`     | `filter`，`slice`         |
| 替换元素 | `splice`，`arr[i] = ...` 赋值 | `map`                    |
| 排序   | `reverse`，`sort`           | 先将数组复制一份                 |
