---
title: 组件
categories: [前端, React]
tags: [前端, React]
date: 2025-09-06 01:09
updated: 2025-09-06 01:09
wiki: react
---
## 函数式组件

React 使用一个 JavaScript 函数来表示一个组件，函数返回一个类似 HTML 的模板，组件的名称必须以大写字母开头

```jsx
// 使用export导出公共组件
export default function Profile() {
  return (
    <img
      src="https://i.imgur.com/MK3eW3Am.jpg"
      alt="Katherine Johnson"
    />
  )
}
```

函数返回的类似 HTML 的模板，称为 JSX，实际上是一个 JavaScript 的语法扩展，能够在 JavaScript 中嵌入标签，**但它并不是 HTML**，在底层会被转化为 JavaScript 对象

JSX 中几乎可使用所有目前浏览器支持的标签，完整列表参考 [DOM组件](https://zh-hans.react.dev/reference/react-dom/components)

返回的 JSX 必须满足以下要求

- 必须将需要编写多行的组件，放在 `()` 中
- 所有标签必须闭合
- 标签中的属性使用小驼峰命名
- JSX 中只能有一个根标签

    可使用空标签 `<>` 来包裹多个根组件，转换为只有一个根标签，空标签表示一个 Fragment，不添加额外的 DOM 元素

    ```jsx
    export default function Profile() {
      return (
        <>
          <h1>title</h1>
          <h2>title</h2>
        </>   
      )
    }
    ```

> JSX 的 Typescript 版本为 TSX，规则与 JSX 相同，后续示例将使用 TSX

## Props 传递

React 中通过函数参数来传递 props

```tsx
function Title({title, info}: { title: string, info: { name: string } }) {
  return (
    <>
      <h1>{title}</h1>
      <h2>{info.name}</h2>
    </>
  )
}

export default function App() {
  return (
    <Title title={"Hello"} info={{name: "Hello"}}/>
  )
}
```

子组件中，传入的参数被包装为一个 js 对象，称为 Props，通过解构直接获取其中的字段，或通过 `.` 调用字段，然后在 `{}` 中使用属性

父组件中，在 `{}` 中传入字面量或其他变量

props 是不可变的，是一个只读的参数快照，每次重新渲染时都会获得一个新的 props

**设置默认值**

直接在解构的 `{}` 中设置字段的默认值

```tsx
function Title({title = "Hello", info}: { title: string, info: { name: string } }) {
  return (
    <>
      <h1>{title}</h1>
      <h2>{info.name}</h2>
    </>
  )
}
```

**传递 tsx**

通过标签嵌套可以向外层组件传入 tsx，传入的 tsx 会赋值给 props 的 `children` 字段，通过该字段获取 tsx，tsx 的类型为 `ReactNode`

```tsx
import type { ReactNode } from 'react'  // 引入ReactNode类型

function Title({title, children}: { title: string, children: ReactNode }) {
  return (
    <>
      <h1>{title}</h1>
      {children}
    </>
  )
}

export default function App() {
  return (
    <Title title={"Hello"}>
      <h1>World1</h1>
      <h1>World2</h1>
    </Title>
  )
}
```

## 条件渲染

使用 `if` 语句选择性地返回 tsx，返回 `null` 或 `undefined` 表示不渲染

```tsx
function Item({name, isPacked}: { name: string, isPacked: boolean }) {
  if (isPacked) {
    return <li className="item">{name} ✅</li>;
  }
  return <li className="item">{name}</li>;
}
```

通过条件表达式在 tsx 中选择渲染内容

- 三目运算符 `?:`

    ```tsx
    function Item({name, isPacked}: { name: string, isPacked: boolean }) {
      return (
        <li className="item">
          {isPacked ? (
            <del>{name + ' ✅'}</del>
          ) : (
            name
          )}
        </li>
      );
    }
    ```

- 逻辑与运算符 `&&`：`condition && tsx`，仅当 `condition` 为 true 时渲染

    ```tsx
    function Item({name, isPacked}: { name: string, isPacked: boolean }) {
      return (
        <li className="item">
          {name} {isPacked && '✅'}
        </li>
      );
    }
    ```

可混合以上方式，灵活地进行条件渲染

```tsx
function Item({name, isPacked}: { name: string, isPacked: boolean }) {
  let itemContent = name;
  if (isPacked) {
    itemContent = (
      <del>{name + " ✅"}</del>
    );
  }
  return (
    <li className="item">
      {itemContent}
    </li>
  );
}
```

## 列表渲染

在 tsx 中**使用数组类型的数据**时，会触发 react 的列表渲染，对于每个列表项，则需要将列表元素数据映射到列表项的 tsx，主要使用 `map` 方法

```tsx
const persons = [
  {id: 0, name: 'John'},
  {id: 1, name: 'John1'}
]

function PersonList({persons}: { persons: { id: number, name: string }[] }) {
  // 将元素数据映射为tsx
  const itemContents = persons.map(person => (
    <li key={person.id}>{person.name}</li>
  ))

  return (
    <ul>{itemContents}</ul>
  )
}

export default function App() {
  return (
    <PersonList persons={persons}/>
  )
}
```

在每个列表项 tsx 的根标签中，需要指定 `key` 属性

> `key` 属性是一个列表项的唯一 id，通过 key 可以在多次渲染更新中跟踪列表项的变化，使得 react 可以正确地比较 DOM 元素差异并更新
>
> 数组元素在数组中的位置是动态变化的，若直接使用上一次渲染时元素所在的位置来定位元素，则可能导致定位错误

当列表项 tsx 中包含多个标签时，同样使用 Fragment 包裹，但不能使用空标签 `<>`，因为空标签不能指定属性

```tsx
const listItems = people.map(person => (
  <Fragment key={person.id}>
    <h1>{person.name}</h1>  
    <p>{person.bio}</p>  
  </Fragment> 
));
```

## 事件处理

react 中执行事件处理通过事件处理函数来实现，事件处理函数通常以 `handle` 开头，后跟事件名

通过 props，将事件处理函数作为参数传入 `<button>` 等标签的事件属性中，如 `onClick`

```tsx
function Info({handleClick}: { handleClick: () => void }) {
  return (
    <button onClick={handleClick}>info</button>
  )
}

export default function App() {

  return (
    <Info handleClick={() => alert("info")}/>
  )
}
```

### 事件传播

DOM 中的事件传播分为以下阶段

1. 捕获阶段：事件从 window 对象开始，沿 DOM 树向下传播
2. 目标阶段：事件到达目标元素，执行事件处理逻辑
3. 冒泡阶段：事件沿 DOM 树向上传播，直到 window 对象

react 中的事件传播也经历了以上过程，在不同阶段执行以下事件处理函数

- 捕获阶段：调用向下传播路径中元素的 `onClickCapture` 函数
- 目标阶段：调用目标元素的 `onClick` 函数
- 冒泡阶段：调用向上传播路径中元素的 `onClick` 函数

**阻止传播**

事件处理函数可以接收一个 `event` 事件对象，使用该对象来控制事件的行为

通过调用事件对象的 `stopPropagation` 函数，可以阻止事件向上冒泡

```tsx
function Button({onClick}: { onClick: () => void }) {
  return (
    <button onClick={e => {
      e.stopPropagation();
      onClick();
    }}>
      Click
    </button>
  );
}
```

**阻止默认行为**

调用事件对象的 `preventDefault` 函数，阻止元素的默认行为

```tsx
export default function Signup() {
  return (
    <form onSubmit={e => {
      e.preventDefault();
      alert('提交表单！');
    }}>
      <input />
      <button>发送</button>
    </form>
  );
}
```
