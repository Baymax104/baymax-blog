---
title: 开始
categories: [前端, Vue3]
tags: [前端, Vue3]
date: 2024-04-25 10:32
updated: 2025-07-06 15:44
banner: /assets/banner/vue3.jpeg
wiki: vue3
---
## 开始

通过 Vite 创建 Vue 项目，命令为 `npm create vue@latest`，再运行 `npm i` 安装依赖

项目目录结构

![](https://baymaxam-1309988842.cos.ap-beijing.myqcloud.com/blog/vue3-%E5%BC%80%E5%A7%8B%2Fvue3-%E5%BC%80%E5%A7%8B-1751769659145.png)

- public：存放项目公共资源
- src：源代码目录
- `env.d.ts`：ts 环境文件，识别项目中的文件
- `index.html`：项目入口
- `package.json`：依赖管理文件
- `tsconfig.app.json`、`tsconfig.json`、`tsconfig.node.json`：ts 配置文件
- `vite.config.ts`：项目配置文件

## App 组件

`App.vue` 是项目的根组件，在 `main.ts` 中实现将组件挂载到 `index.html` 的元素

`index.html` 中包含一个 id 为 app 的 div 元素

```html
<body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
</body>
```

在 `main.ts` 中将 App 组件挂载到 app 元素上

```ts
import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')
```

## 单文件组件

Vue 的单文件组件是指在一个文件中编写一个组件，文件后缀为 `.vue`，该文件中封装了组件的 HTML、CSS 和 JavaScript 代码

单文件组件的基本结构

```vue
<template>
<!--编写HTML-->
</template>

<script>
// 编写JavaScript
</script>

<style scoped>
/* 编写CSS */
</style>
```

## 选项式 API 与组合式 API

选项式 API 使用一个对象来描述组件，通过定义对象中的特定名称的方法来配置组件的逻辑

```vue
<script>
// 默认导出一个对象，代表组件实例
export default {
  // 配置状态
  data() {
    return {
      count: 0
    }
  },

  // 配置方法修改状态
  methods: {
    increment() {
      this.count++
    }
  },

  // 生命周期回调
  mounted() {
    console.log(`The initial count is ${this.count}.`)
  }
}
</script>

<template>
  <button @click="increment">Count is: {{ count }}</button>
</template>
```

组合式 API 使用导入的 API 函数来描述组件逻辑，将相关的逻辑放在一起，更易于维护

```vue
<script setup>
import { ref, onMounted } from 'vue'

// 定义状态
const count = ref(0)

// 用来修改状态、触发更新的函数
function increment() {
  count.value++
}

// 生命周期钩子
onMounted(() => {
  console.log(`The initial count is ${count.value}.`)
})
</script>

<template>
  <button @click="increment">Count is: {{ count }}</button>
</template>
```
