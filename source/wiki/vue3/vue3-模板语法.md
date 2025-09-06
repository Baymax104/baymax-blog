---
title: 模板语法
categories: [前端, Vue3]
tags: [前端, Vue3]
date: 2024-04-25 12:32
updated: 2025-07-06 15:44
banner: /assets/banner/vue3.jpeg
wiki: vue3
---
## 插值语法

适用于元素的文本内容，使用双大括号

```html
<div>
    {{message}}
</div>
```

若需要仅插值一次，加上 `v-once` 指令

```html
<div v-once>
    {{message}}
</div>
```

## 指令语法

vue 中的指令以 `v-` 开头，支持 HTML 元素属性的绑定，使用指令时，引号的部分作为 JavaScript 表达式处理

### 指令的结构

Vue 指令的完整结构由名称、参数、修饰符和值组成

![](https://cos.baymaxam.top/blog/vue3-%E6%A8%A1%E6%9D%BF%E8%AF%AD%E6%B3%95/vue3-%E6%A8%A1%E6%9D%BF%E8%AF%AD%E6%B3%95-1751769709111.png)

- Name：Vue 指令以 `v-` 开头

- Modifier：修饰符，表示该指令通过特殊方式绑定

- Argument：指令参数，如 `v-bind:id` 的参数为 id，`v-on:click` 的参数为 click

    支持动态参数，即使用表达式指定参数，表达式的结果必须为一个字符串，当结果为 null 时，该属性不生效

    ```html
    <div v-bind:[attr]="value"></div>
    <a v-on:[eventName]="doSomething"></a>
    
    <!--可简写-->
    <div :[attr]="value"></div>
    <a @[eventName]="doSomething"></a>
    ```

### 属性绑定

- 使用 `v-bind` 绑定属性

    ```html
    <div v-bind:id="id"></div>
    ```

- `v-bind` 指令可以简写，使用冒号 `:` 开头

    ```html
    <div :id="id"></div>
    ```

- 同名简写：当属性名与变量名相同可简写

    ```html
    <div v-bind:id></div>
    ```

- 可绑定一个对象，同时绑定多个属性

    ```ts
    let obj = {
        id: "myid",
        class: "my-class"
    }
    
    // html
    // <div v-bind="obj"></div>
    ```

- 对 class 和 style 属性的绑定增强

    value 可以传入对象或数组以支持多个值的需求

    ```html
    <!--传入对象-->
    <!--通过isClass1Active和isClass2Active两个状态，可以控制是否添加class1或class2-->
    <div :class="{class1: isClass1Active, class2: isClass2Active}"></div>
    <!--通过fontSize状态来修改样式-->
    <div :style="{ 'font-size': fontSize + 'px' }"></div>
    
    <!--传入数组-->
    <div :class="[activeClass, errorClass]"></div>
    <div :style="[baseStyles, overridingStyles]"></div>
    ```

    传入对象时可以不使用字面量

    ```ts
    const classObject = reactive({
      active: true,
      'text-danger': false
    })
    // <div :class="classObject"></div>
    
    const styleObject = reactive({
      color: 'red',
      fontSize: '13px'
    })
    // <div :style="styleObject"></div>
    ```

### 双向绑定

使用 `v-model` 指令实现双向绑定

```html
<input type="text" v-model="value1">
<!--实际实现-->
<input type="text" 
       :value="value1" 
       @input="value1 = ($event.target as HTMLInputElement).value">
```

从用户输入获取的值默认为字符串，通过修饰符可对字符串进行处理

- lazy：当输入框失去焦点或按下回车时，才触发数据更新
- number：将字符串转换为数字
- trim：去除首尾空格

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
