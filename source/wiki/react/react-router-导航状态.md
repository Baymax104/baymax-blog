---
title: 导航状态
categories: [前端, React]
tags: [前端, React]
date: 2025-09-13 19:04
updated: 2025-09-18 00:57
wiki: react
---

通过 `useNavigation` 函数获取全局导航状态，根据导航状态实现加载页面、导航时禁用表单和提交按钮等

```tsx
import { useNavigation } from 'react-router';

const navigation = useNavigation()
```

`navigation` 对象中包含以下属性

- `state`：导航响应式状态，有以下值
    - `idle`：初始状态
    - `loading`：下一页加载中
    - `submitting`：表单提交执行 `action` 中

    对于一般导航和表格 GET 提交，状态变化过程为 `idle->loading->idle`，对于 POST、DELETE 等表单提交导航（由表单提交导致的导航），状态变化过程为 `idle->submitting->loading->idle`

- `location`：导航目标页面的 `location` 对象
- `formData`：表单提交导航的提交数据
- `json`：`useSubmit` 提交的按 `application/json` 编码的 json 数据
- `text`：`useSubmit` 提交的按 `text/plain` 编码的纯文本数据
- `formAction`：表单提交导航的 `action` 属性
- `formMethod`：表单提交导航的 `method` 属性
- `formEncType`：表单提交导航的编码格式
