---
title: 监视
categories: [前端, Vue3]
tags: [前端, Vue3]
date: 2024-05-01 10:32
updated: 2025-07-06 15:44
banner: /images/vue3.jpeg
wiki: vue3
---
## 开始

监视用于监视数据的变化从而执行某些流程

Vue3 只能监视四种数据

- ref 响应式数据
- reactive 响应式数据
- 返回一个值的 getter 函数
- 一个包含上述值的数组

## 监视 ref 数据

watch 函数传入 ref 变量和一个回调函数，返回一个停止函数，调用可停止监视

```vue
<script setup lang="ts">
import { ref, watch } from 'vue'
let age = ref(20)

// 回调函数接收一个参数时，参数为newValue
let stop = watch(age, (newValue, oldValue) => {
  console.log(`newValue: ${newValue}, oldValue: ${oldValue}`)
  if (newValue >= 40) {
    stop()
  }
})
function changeAge() {
  age.value += 10
}
</script>

<template>
  <div>{{age}}</div>
  <button @click="changeAge">改变年龄</button>
</template>
```

监视对象时，监视的是对象的地址，若需要监视对象属性，需要开启深度监视

开启深度监视后，对象的地址或属性发生变化，都会触发回调

> 属性变化触发回调时，oldValue 不是变化前的属性值，oldValue 与 newValue 相等

watch 配置对象

- deep：是否开启深度监视
- immediate：是否首次监视时执行回调，首次监视时 oldValue 为 undefined

```ts
import { ref, watch } from 'vue'
let obj = ref({
  name: "Hello",
  age: 20
})

watch(obj, (newVal, oldVal) => {
  console.log(`oldVal: ${oldVal}, newVal: ${newVal}`)
}, {
  deep: true
})
```

## 监视 reactive 数据

监视 reactive 数据时，默认开启深度监视

```vue
<script setup lang="ts">
import { reactive, watch } from 'vue'
let obj = reactive({
  name: "Hello",
  age: 20
})

watch(obj, (newVal, oldVal) => {
  console.log(`oldVal: ${oldVal}, newVal: ${newVal}`)
})

function change() {
  obj.name = "My"
  obj.age = 30
}
</script>

<template>
  <div>{{obj.name}}</div>
  <div>{{obj.age}}</div>
  <button @click="change">改变</button>
</template>
```

## 监视 getter 函数

watch 函数接收一个函数参数，函数返回一个值，可用于对象属性监视或计算值监视

```vue
<script setup lang="ts">
import { reactive, watch } from 'vue'
let obj = reactive({
  name: "Hello",
  age: 20
})

watch(() => obj.name, (newVal, oldVal) => {
  console.log(`oldVal: ${oldVal}, newVal: ${newVal}`)
})

function changeName() {
  obj.name = "My"
}
function changeAge() {
  obj.age = 30
}
</script>

<template>
  <div>{{obj.name}}</div>
  <div>{{obj.age}}</div>
  <button @click="changeName">改变名称</button>
  <button @click="changeAge">改变年龄</button>
</template>
```

当对象属性也是一个对象时，可以直接监视对象中的对象属性，此时该对象属性中的属性发生变化会触发回调，**但重新赋值该对象属性不会触发回调**

使用 getter 函数监视对象属性，会监视对象地址的变化，若需要监视属性，需要开启深度监视

> 为了行为统一，无论对象属性是什么类型，推荐使用 getter 函数监视对象属性

```ts
let obj = reactive({
  name: "Hello",
  age: 20,
  school: {
      name: "Hello"
  }
})

// 直接监视对象属性
// 若对obj.school重新赋值对象，则会失去监视
watch(obj.school, (value) => {
  // ...
})

// getter函数监视对象属性
watch(() => obj.school, (value) => {
  console.log(`value: ${value}`)
}, {
  deep: true
})
```

## watchEffect

watchEffect 函数接收一个回调函数，自动监视回调函数中使用的响应式数据

watchEffect 函数会在首次监视时执行一次回调

```ts
watchEffect(() => {
    // ...
})
```
