---
title: 状态管理
categories: [前端, React]
tags: [前端, React]
date: 2025-09-06 18:38
updated: 2025-09-09 00:48
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

> react 中有一类以 use 开头的函数，称为 Hook 函数，在 hook 函数的函数体中可以使用 react 的执行上下文，如 State 等，hook 之间可以相互调用，且只能在组件函数体的最顶层调用

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

### 状态更新与渲染

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

## 复杂状态更新

### 对象状态更新

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

### 数组状态更新

与对象状态更新相同，需要使用 `set` 函数赋值一个新的数组

数组中有些方法是原地修改的，不能返回新的数组

|      | 原地修改                       | 返回新数组                    |
| ---- | -------------------------- | ------------------------ |
| 添加元素 | `push`，`unshift`           | `concat`，`[...arr]` 展开语法 |
| 删除元素 | `pop`，`shift`，`splice`     | `filter`，`slice`         |
| 替换元素 | `splice`，`arr[i] = ...` 赋值 | `map`                    |
| 排序   | `reverse`，`sort`           | 先将数组复制一份                 |

## 状态管理

### 共享状态

通过状态提升的方法实现在组件之间共享状态

- 只读状态：将多个组件中需要共享的状态定义在 props 中，在它们的公共父组件中初始化状态，通过 props 向子组件传递状态
- 状态更新：子组件中将更新状态的事件处理函数定义在 props 中，在公共父组件中设置事件处理函数，其中调用 `set` 方法更新状态

```tsx
import { useState } from 'react';

export default function Accordion() {
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <>
      <Panel
        title="关于"
        isActive={activeIndex === 0}  // 向子组件传递只读状态
        onShow={() => setActiveIndex(0)}  // 在事件处理函数中更新状态
      >
      </Panel>
      <Panel
        title="词源"
        isActive={activeIndex === 1}
        onShow={() => setActiveIndex(1)}
      >
      </Panel>
    </>
  );
}

function Panel({
  title,
  isActive,
  onShow
}: {
  title: string,
  isActive: boolean,
  onShow: () => void
}) {
  return (
    <section className="panel">
      <h3>{title}</h3>
      {isActive ? (
        <p>测试文本</p>
      ) : (
        <button onClick={onShow}>显示</button>
      )}
    </section>
  );
}
```

### 状态保留

每个组件内定义的状态是组件私有的，但状态并不实际存储在组件中，状态由 react 保存，react 在渲染时会将组件与对应的状态关联起来，具体来说，react 默认将组件在其父组件中的**渲染位置**和**组件的类型**作为组件的“标识符”，根据该“标识符”获取组件对应的状态

根据该性质，相同渲染位置且相同类型的组件会关联到相同的状态，即使这些组件是不同的实例，例如以下代码

```tsx
import { useState } from 'react';

export default function App() {
  const [isFancy, setIsFancy] = useState(false);
  return (
    <div>
      {isFancy ? (
        <Counter isFancy={true} /> 
      ) : (
        <Counter isFancy={false} /> 
      )}
      <label>
        <input
          type="checkbox"
          checked={isFancy}
          onChange={e => {
            setIsFancy(e.target.checked)
          }}
        />
        使用好看的样式
      </label>
    </div>
  );
}
```

以上代码中，两个 `<Counter>` 在每次渲染时只有其中一个被渲染，因此它们都是 `<div>` 组件内的第一个组件，渲染位置相同，且它们的类型都是 `Counter`，因此在重渲染时，无论渲染的是哪一个 `<Counter>`，`<Counter>` 组件中的状态都会被关联到当前渲染的 `<Counter>` 中

需要注意的是使用条件渲染组件时，若条件为假，不渲染组件，则组件的状态会被丢弃，例如以下代码，`showB` 为假时，第二个 `<Counter>` 组件被销毁，此时该组件的状态也会被丢弃

```tsx
import { useState } from 'react';

export default function App() {
  const [showB, setShowB] = useState(true);
  return (
    <div>
      <Counter />
      {showB && <Counter />}
      <label>
        <input
          type="checkbox"
          checked={showB}
          onChange={e => {
            setShowB(e.target.checked)
          }}
        />
        渲染第二个计数器
      </label>
    </div>
  );
}
```

**使用 key 属性关联状态**

当需要一个实体数据对应到一个组件时，组件内的状态也应该随着实体数据的改变而改变，因此需要将组件与实体数据进行关联，使得实体数据与组件状态能够一一对应

可以设置组件的 `key` 属性为实体数据的标识符来关联组件对应的状态

```tsx
import { useState } from 'react';

export default function Scoreboard() {
  const [isPlayerA, setIsPlayerA] = useState(true);
  return (
    <div>
      {isPlayerA ? (
        <Counter key="Taylor" person="Taylor" />
      ) : (
        <Counter key="Sarah" person="Sarah" />
      )}
      <button onClick={() => {
        setIsPlayerA(!isPlayerA);
      }}>
        下一位玩家！
      </button>
    </div>
  );
}
```

以上代码中，两个 `<Counter>` 组件的渲染位置和组件类型都相同，关联到的组件状态也应当相同，但实际上，对两个组件设置了不同的 `key` 属性，它们关联到的组件状态就是**不同的**，同时，设置的 `key` 属性值也可以对应到不同的实体数据，因此就实现了实体数据与组件状态的一一对应

## Reducer

当更新复杂的对象状态时，更新逻辑可能会很复杂，使用 reducer 可以将状态的更新逻辑集中起来，在 tsx 中通过“任务分派”的方式来更新状态

例如以下的数组状态，更新逻辑通常包含增删改

```tsx
import { useState } from 'react';

const initialItems = [
  {id: 0, name: "hello1"},
  {id: 1, name: "hello2"},
  {id: 2, name: "hello3"},
]
const [items, setItems] = useState(initialItems)

// 定义事件处理函数
function handleAddItem(name) {
  setItems([
    ...items,
    {id: items.length, name: name}
  ])
}

function handleDeleteItem(id) {
  setItems(items.filter(item => item.id !== id)
}

function handleUpdateItem(item) {
  setItems(items.map(i => i.id === item.id ? item : i))
}
```

若在多个事件处理函数中都需要进行类似的状态更新，则更新逻辑会非常分散，不便于维护。此时可以使用 reducer 将状态更新逻辑集中起来统一维护

**定义 action**

将每个更新逻辑看做一个行为（action），对于以上的增删改逻辑，可以定义如下 action

```tsx
addAction = {
  type: "add",
  name: ""  // 更新逻辑需要的参数
}

deleteAction = {
  type: "delete",
  id: 0
}

updateAction = {
  type: "update",
  item: item
}
```

> 使用 Typescript 时，可使用联合类型来定义 action 的类型
>
> ```tsx
> type Action = 
>   | {type: "add", name: string} 
>   | {type: "delete", id: number} 
>   | {type: "update", item: Item}
> ``` 

**定义 reducer**

reducer 是一个函数，一般接收两个参数

- `state`: 当前输入的状态
- `action`: 当前执行的 action

定义 reducer 如下

```tsx
// state就是当前要更新的items
function itemReducer(state, action) {
  switch (action.type) {
    case "add": {
      return [...state, {id: state.length, name: action.name}]
    }
    case "delete": {
      return state.filter(item => item.id !== action.id)
    }
    case "update": {
      const item = action.item
      return state.map(i => i.id === item.id ? item : i)
    }
    default: {
      throw Error("Unsupported action")
    }
  }
}
```

**在组件中使用 reducer**

使用 hook 函数 `useReducer`，它接收一个 reducer 函数和一个状态初始值，返回当前只读状态和 `dispatch` 函数，通过 `dispatch` 函数将不同的 action 分发给 reducer 函数

```tsx
import { useReducer } from 'react';

const [items, dispatch] = useReducer(itemReducer, initialItems)

function handleAddItem(name) {
  dispatch({type: "add", name: name})
}

function handleDeleteItem(id) {
  dispatch({type: "delete", id: id})
}

function handleUpdateItem(item) {
  dispatch({type: "update", item: item})
}
```

使用 reducer，可以隐藏状态更新的复杂逻辑，增强代码的可维护性

## Context

context 用于在子树内共享数据，使用到 `createContext` 和 `useContext` 两个 hook 函数

例如以下 tsx，我们希望在所有 `<Heading>` 组件中获取到 `<Section>` 中的 `level` 值

```tsx
<Section level={4}>  
  <Heading>子子标题</Heading>
  <Heading>子子标题</Heading>
  <Heading>子子标题</Heading>  
</Section>
```

**定义 context**

使用 `createContext` 函数创建一个 context

```tsx
import { createContext } from 'react';

const LevelContext = createContext(1)  // 默认值，可以是任何类型的数据或State
```

**提供 context**

在 `<Section>` 组件中向它的子组件提供 context，通过 `value` 属性传入数据

```tsx
// import LevelContext

export default function Section({ level, children }) {  
  return (  
    <section className="section">
      <LevelContext value={level}>
        {children}
      </LevelContext>  
    </section>  
  );  
}
```

**使用 context**

在 `<Heading>` 组件中通过 `useContext` 函数使用 context，获取其中的数据

```tsx
import { useContext } from 'react';
// import LevelContext

export default function Heading({ children }) {  
  const level = useContext(LevelContext);
  // ...
}
```
