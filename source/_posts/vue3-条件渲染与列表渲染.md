---
title: Vue3基础——条件渲染与列表渲染
categories: [前端, Vue3]
tags: [前端, Vue3]
date: 2024-04-25 16:32
updated: 2025-07-06 15:42
---
## 条件渲染

条件渲染用于根据条件结果来选择性的渲染 HTML 中的元素

- `v-if`：当条件为 true 时，渲染元素

    ```html
    <h1 v-if="awesome">Vue is awesome!</h1>
    ```

- `v-else-if`：与 `else if` 效果相同，必须跟在 `v-if` 或 `v-else-if` 后面

- `v-else`：与 `else` 作用相同，必须跟在 `v-if` 或 `v-else-if` 后面

### v-show

`v-show` 同 `v-if` 一样根据条件显示一个元素，但 `v-show` 依然保留元素的 DOM 节点，只是改变了 CSS 的 `display` 属性

与 `v-if` 的优劣

- `v-if` 会根据条件完全渲染组件，包括相关的监听器和子组件等，因此它是惰性的，状态切换开销较大
- `v-show` 在首次渲染就会渲染出元素，即使 value 为 false，它只修改了 `display` 属性，因此状态切换开销小

## 列表渲染

使用 `v-for` 指令遍历一个数组或对象

- 遍历数组：第二个参数 index 可选，key 属性绑定列表项的标识

    ```html
    <li v-for="(item, index) in items" :key="item.id">
      {{ item.message }}
    </li>
    ```

- 遍历对象：第二和第三个参数可选

    ```html
    <!--
    const myObject = {
      title: 'How to do lists in Vue',
      author: 'Jane Doe',
      publishedAt: '2016-04-10'
    }
    -->
    
    <ul>
      <li v-for="(value, key, index) in myObject">
        {{ value }}
      </li>
    </ul>
    ```

- 字面量范围

    ```html
    <span v-for="n in 10">
        {{ n }}
    </span>
    ```

### v-for 与 v-if 配合

`v-if` 比 `v-for` 的优先级高，因此 `v-if` 中无法使用 `v-for` 的遍历变量，通过使用 template 标签包装可解决

```html
<!--
 这会抛出一个错误，因为属性 todo 此时
 没有在该实例上定义
-->
<li v-for="todo in todos" v-if="!todo.isComplete">
  {{ todo.name }}
</li>

<!--template标签包装-->
<template v-for="todo in todos">
  <li v-if="!todo.isComplete">
    {{ todo.name }}
  </li>
</template>
```

### 数组状态检测

通过以下方法修改数组可以触发更新

- `push()`
- `pop()`
- `shift()`
- `unshift()`
- `splice()`
- `sort()`
- `reverse()`
