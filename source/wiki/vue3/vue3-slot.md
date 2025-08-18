---
title: 插槽Slots
categories: [前端, Vue3]
tags: [前端, Vue3]
date: 2024-05-19 10:32
updated: 2025-07-06 15:40
banner: /assets/banner/vue3.jpeg
wiki: vue3
---
## 开始

使用插槽可以实现动态的模板内容

父模板中的插槽内容可以访问到父组件的数据作用域，但不能访问到子组件的数据作用域

![](https://baymaxam-1309988842.cos.ap-beijing.myqcloud.com/blog/vue3-slot%2Fvue3-slot-1751769743326.png)

## 默认插槽

不具有 name 属性的插槽为默认插槽

父组件基本使用

```vue
<script setup lang="ts">
import {ref} from 'vue';
import Inner from "@/components/Inner.vue";
let value1 = ref('value1');
</script>

<template>
  <div>
    <Inner>
      <!--该部分内容会填充到插槽中-->
      <span>{{value1}}</span>
    </Inner>
  </div>
</template>
```

子组件基本使用

```vue
<script setup lang="ts">
</script>

<template>
  <div>
    <!--slot标签定义默认插槽-->
    <slot></slot>
  </div>
</template>
```

slot 标签中的模板内容为默认填充内容，当父组件未定义插槽内容时，使用默认内容填充

```html
<!--子组件-->
<template>
  <div>
    <slot>默认内容</slot>
  </div>
</template>

<!--父组件-->
<Inner></Inner>
```

## 具名插槽

可以为 slot 设置名称，指明插槽内容填充的 slot

- slot 标签使用 name 属性设置名称
- 使用 `v-slot` 指令指明填充的 slot，该指令可用于组件标签或 template 标签上，可简写为 `#`

> 当同时使用具名插槽和默认插槽时，可使用显式默认插槽或隐式默认插槽
>
> - 显式默认插槽：使用 `v-slot:default` 指明填充到默认插槽
> - 隐式默认插槽：组件标签中所有的**直接非 template 标签**将作为默认插槽内容

基本使用

```html
<!--子组件-->
<template>
  <div>
    <slot name="header"></slot>
    <slot name="content"></slot>
  </div>
</template>

<!--父组件-->
<template>
  <div>
    <Inner>
      <template v-slot:header>
        <span>这是header</span>
      </template>
      <template #content>
        <div>这是content</div>
      </template>
    </Inner>
  </div>
</template>
```

## 作用域插槽

使用作用域插槽可向插槽内容提供子组件的数据

- 在子组件的 slot 标签中传递参数
- 在父组件中接收参数

基本使用

```html
<!--子组件-->
<div>
  <!--通过v-bind传递参数-->
  <slot :text="greetingMessage" :count="1"></slot>
</div>

<!--父组件-->
<!--使用一个对象接收参数-->
<MyComponent v-slot="slotProps">
  {{ slotProps.text }} {{ slotProps.count }}
</MyComponent>

<!--
接收参数时可以使用解构
<MyComponent v-slot="{ text, count }">
  {{ text }} {{ count }}
</MyComponent>
-->
```

在同时使用默认插槽和具名插槽时，作用域插槽必须显式指明默认插槽

```html
<template>
  <MyComponent>
    <!-- 使用显式的默认插槽 -->
    <template #default="{ message }">
      <p>{{ message }}</p>
    </template>

    <template #footer>
      <p>Here's some contact info</p>
    </template>
  </MyComponent>
</template>
```

## 其他特性

### 条件插槽

`$slots` 对象用于获取父组件传入所有插槽填充内容，配合 `v-if` 可实现条件渲染 slot 标签

```html
<template>
  <div class="card">
    <div v-if="$slots.header" class="card-header">
      <slot name="header" />
    </div>
    
    <div v-if="$slots.default" class="card-content">
      <slot />
    </div>
    
    <div v-if="$slots.footer" class="card-footer">
      <slot name="footer" />
    </div>
  </div>
</template>
```

### 动态插槽名

在 `v-slot` 指令上可使用动态插槽名

```html
<base-layout>
  <template v-slot:[dynamicSlotName]>
    ...
  </template>

  <!-- 缩写为 -->
  <template #[dynamicSlotName]>
    ...
  </template>
</base-layout>
```
