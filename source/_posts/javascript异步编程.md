---
title: JavaScript异步编程
categories: [前端]
tags: [JavaScript, 前端]
date: 2024-04-13 19:19
updated: 2025-07-07 01:16
banner: /images/javascript.jpg
---
## Promise

Promise 是 ES6 引入的异步解决方案，一个 Promise 对象表示一个异步操作，链式调用相关方法处理成功或失败结果

Promise 有三个状态，完成和拒绝状态有相应的回调函数，指定多个回调时，所有回调都执行

- 等待（pending）：可以转换到完成和拒绝
- 完成（fulfilled）：到达该状态后不可修改
- 拒绝（rejected）：到达该状态后不可修改

### 创建和使用

- `Promise()`：构造函数，传入一个回调函数表示异步操作
- `then()`：包含两个回调函数参数，表示 OnResolved 和 OnRejected，可以只传 OnResolved

```js
const p = new Promise((resolve, reject) => {
    // async operation
    // 在成功时调用resolve(value)
    // 在失败时调用reject(err)
}).then(
    value => {
        // on fulfilled
        // then可以仅传入成功回调
    },
    reason => {
        // on rejected
    }
)
```

### then 的返回值

在 then 方法的回调上可以返回一个值，then 方法的返回值为 Promise

- 返回非 Promise 值：then 返回的 Promise 状态为 resolved 状态
- 返回 Promise 值：返回的 Promise 的状态就是 then 方法的状态
- 抛出异常：then 返回的 Promise 状态为 rejected 状态

```js
const result = p.then(
    value => {
        // ...
    },
    reason => {
        // ...
    }
)
```

### 其他方法

- catch 方法：用于处理 Promise 的 rejected 状态
- `Promise.all`：组合多个 Promise，全部执行，当所有 Promise 执行成功时，返回成功状态，value 是一个数组，包含各个 Promise 的 value
- `Promise.allSettled`：组合多个 Promise，全部执行，只返回成功状态的 Promise，value 包含各个 Promise 的状态的 value
- `Promise.race`：传入多个 Promise，取第一个改变状态的 Promise 作为返回的 Promise

## async 和 await

async 和 await 在 ES8 中引入，用于简化 Promise 编写

### async 函数

使用 async 关键字声明，返回的任何值都包装为 Promise 对象

- 返回非 Promise 对象：返回一个成功的 Promise
- 抛出异常：返回一个失败的 Promise
- 返回 Promise：返回的 Promise 的状态就是 async 返回的 Promise 的状态

```js
async function method() {
    // ...
}
```

### await 语句

必须写在 async 函数中，后接一个表达式，表达式的结果一般为 Promise 对象

await 的返回值为 Promise 成功的值，若失败则抛出异常，通过 try-catch 处理
