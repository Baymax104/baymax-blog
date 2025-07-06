---
title: Vue3基础——生命周期
categories: [前端, Vue3]
tags: [前端, Vue3]
date: 2024-05-02 10:32
updated: 2025-07-06 15:43
---
## Vue2 生命周期

Vue2 组件的生命周期有 4 个，每个周期对应两个生命周期回调

- 创建：`beforeCreate`、`created`，只调用一次
- 挂载：`beforeMount`、`mounted`，只调用一次
- 更新：`beforeUpdate`、`updated`，每次修改数据都会调用
- 销毁：`beforeDestroy`、`destroyed`，只调用一次

## Vue3 生命周期

- 创建：使用 setup 替代了 beforeCreated 和 created，setup 函数的执行在 beforeCreated 函数之前
- 挂载：`onBeforeMount`、`onMounted`
- 更新：`onBeforeUpdate`、`onUpdated`
- 销毁：`onBeforeUnmount`、`onUnmounted`

父组件与子组件的生命周期顺序

1. 父组件创建
2. 父组件挂载前
3. 子组件创建
4. 子组件挂载
5. 父组件挂载

## 自定义 Hooks

将一些可复用的代码封装成一个函数（hook 函数），作为模块使用，hook 文件用 `useXXX.ts` 命名，存放在 hooks 目录

```ts
import { ref } from 'vue'
export default function () {
    let sum = ref(0)
    
    function add(value: number) {
        sum.value += value
    }
    
    return {
        sum,
        add
    }
}
```

在其他模块导入使用

```ts
import useSum from '@/hooks/useSum'
const {sum, add} = useSum()
```
