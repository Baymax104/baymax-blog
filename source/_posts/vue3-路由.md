---
title: Vue3基础——路由
categories: [前端, Vue3]
tags: [前端, Vue3]
date: 2024-05-02 10:32
updated: 2025-07-06 15:39
banner: /images/vue3.jpeg
---
## 基本使用

使用路由需要安装依赖，使用 `npm i vue-router` 安装，在 src 目录下创建 router 目录，存放路由的.ts 文件

使用路由的基本步骤

1. 定义并导出路由，设置路由和工作模式
2. 设置 app 的路由
3. 设置 host 和 link

### 定义路由

定义一个基本的路由文件 (src/router/index.ts)

```ts
import {createRouter, createWebHistory} from 'vue-router'

// 子组件
import Home from '@/components/Home.vue'
import News from '@/components/News.vue'
import About from '@/components/About.vue'

// 调用createRouter创建路由并导出
export const router = createRouter({
  // 设置路由的工作模式
  history: createWebHistory(),
  // 设置路由，每个对象包含path和component两个属性
  routes: [
    {
      path: '/home',
      component: Home,
    },
    {
      path: '/news',
      component: News,
    },
    {
      path: '/about',
      component: About,
    }
  ]
})
```

### 设置 app 路由

调用 use 函数设置 app 路由

```ts
import { createApp } from 'vue'
import App from './App.vue'
import { router } from './router'

const app = createApp(App)
app.use(router)
app.mount('#app')
```

### 设置 host 和 link

- `RouterView` 标签设置 host
- `RouterLink` 标签设置 link
    - `to` 属性：指定路径
    - `active-class` 属性：设置选中样式类名
    - `replace` 属性：导航时替换栈顶页面

``` html
<div class="navigate">
    <RouterLink to="/home" active-class="active">首页</RouterLink>
    <RouterLink to="/news" active-class="active">新闻</RouterLink>
<!--to属性的对象写法-->
    <RouterLink :to="{path: '/about'}" active-class="active">关于</RouterLink>
</div>
<div class="display">
    <RouterView></RouterView>
</div>
```

## 路由工作模式

路由有两种工作模式

- history：在 URL 上以传统路径显示，需要后端处理路径问题
- hash：在 URL 中存在一个 `#`，hash 值出现在 URL 中但不会包含在请求中，对后端无影响

两种模式对应两个函数

- history：`createWebHistory()`
- hash：`createdWebHashHistory()`

## 命名路由

对 routes 属性中的路由对象设置 name 属性，在 link 时通过 name 属性绑定路由对象

```ts
export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      name: 'home'
      path: '/home',
      component: Home,
    },
  ]
})
```

在 link 时使用 to 属性对象，通过设置 name 属性设置映射对象

```html
<RouterLink :to="{name: 'home'}" active-class="active">首页</RouterLink>
```

## 嵌套路由

在定义映射时设置映射对象的 children 属性，传入子映射

```ts
export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/news',
      component: News,
      children: [
        {
          path: 'detail'
          component: Detail
        }
      ]
    },
  ]
})
```

link 时设置 URL 路径

```html
<RouterLink to="/news/detail">新闻</RouterLink>
```

## 路由传参

路由参数有两种形式

- query：直接显示在 URL 中的参数
- params：RESTful 风格的路径参数

参数在传递时有两种形式

- 字符串
- to 属性对象

### query 参数

query 参数直接写在 link 路径中

```html
<RouterLink to="/news/detail?key1=value1&key2=value2">新闻1</RouterLink>
```

子组件接收参数时，需要先获取到 route 对象，通过 route 对象获取参数

```vue
<script setup lang="ts">
import {toRefs} from "vue";
import {useRoute} from "vue-router";
const route = useRoute();
const {query} = toRefs(route)
</script>

<template>
<div>{{query.key1}}</div>
<div>{{query.key2}}</div>
</template>
```

当传入列表项数据时，使用模板字符串或 to 属性对象

```html
<!--模板字符串写法-->
<li v-for="item in news" :key="item.id">
    <RouterLink :to="`/news/detail?id=${item.id}&title=${item.title}&content=${item.content}`">
        {{item.title}}
    </RouterLink>
</li>

<!--对象写法-->
<li v-for="item in news" :key="item.id">
    <RouterLink :to="{
        path: '/news/detail',
        query: {
            id: item.id,
            title: item.title,
            content: item.content,
        },
    }">
        {{item.title}}
    </RouterLink>
</li>
```

### params 参数

定义路由时，在路径中规定参数的占位

```ts
export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/news',
      component: News,
      children: [
        {
          // 使用:param占位，后加?表示可选参数
          path: 'detail/:id/:title/:content?',
          component: Detail
        }
      ]
    },
  ]
})
```

在 link 中以路径形式传递参数

```html
<li v-for="item in news" :key="item.id">
    <RouterLink :to="`/news/detail/${item.id}/${item.title}/${item.content}`">
        {{item.title}}
    </RouterLink>
</li>
```

> params 参数传递使用 to 属性对象时，只能使用命名路由，因此使用 params 参数时**最好同时设置 name 属性**

通过 route 对象的 params 属性获取参数

```vue
<script setup lang="ts">
import {useRoute} from "vue-router";
import {toRefs} from "vue";
const route = useRoute();
const {params} = toRefs(route);
</script>

<template>
<div>{{params.id}}</div>
<div>{{params.title}}</div>
<div>{{params.content}}</div>
</template>
```

### props 配置

在路由对象中设置 `props: true`，则将**params 参数**以组件元素的属性形式传入

子组件接收时使用 `defineProps` 函数

```vue
<script setup lang="ts">
defineProps(['id', 'title', 'content'])
</script>

<template>
<div>{{id}}</div>
<div>{{title}}</div>
<div>{{content}}</div>
</template>
```

传递 query 参数时，使用 props 函数

```ts
export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/news',
      component: News,
      children: [
        {
          path: 'detail',
          component: Detail,
          props(route) {
            // 此处也可返回route.params
            return route.query
          }
        }
      ]
    },
  ]
})
```

## 命令式导航

通过 router 对象导航

```ts
import {useRouter} from "vue-router";
const router = useRouter();

function navigate() {
  // 调用replace方法替换栈顶
  router.push("/news");
}
```

push 方法接收两种传参形式，都同时支持 query 参数和 params 参数

- path 字符串（**不能接收 name 字符串**）
- to 属性对象

## 重定向

设置重定向路由对象，将路径重定向到已有路径

```ts
export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/home',
      component: Home,
    },
    {
      path: '/',
      redirect: '/home',
    }
  ]
})
```
