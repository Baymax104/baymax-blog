---
title: 组件通信
categories: [前端, Vue3]
tags: [前端, Vue3]
date: 2024-05-19 10:32
updated: 2025-07-06 15:41
banner: /images/vue3.jpeg
wiki: vue3
---
## props 传参

通常用于父组件和子组件的通信

- 在子组件中定义 props，使用 props
- 在父组件中传递参数
- 子组件向父组件传递需要使用回调的方式

子组件中定义 props

```vue
<script setup lang="ts">
import {ref} from "vue";

// 定义props
defineProps(['value1', 'value2', 'getValue3']);
    
// 使用ts语法
/*
defineProps<{
  value1: string, 
  value2: string,
  getValue3: (value: string) => void
}>()
*/

let value3 = ref('value3');
</script>

<template>
  <div>{{value1}}</div>
  <div>{{value2}}</div>
  <!--调用回调，传递value3-->
  <button @click="getValue3(value3)">向父组件传递value3</button>
</template>
```

在父组件中传递参数

```vue
<script setup lang="ts">
import {ref} from 'vue';
import Inner from "@/components/Inner.vue";

let value1 = ref('value1');
let value2 = ref('value2');

let value3 = ref('');

// 回调函数
function getValue3(value: string) {
  value3.value = value;
}

</script>

<template>
  <div>
    <div>{{value3}}</div>
    <!--传参-->
    <Inner :value1="value1" :value2="value2" :getValue3="getValue3"></Inner>
  </div>
</template>
```

## 自定义事件

主要用于父组件向子组件通信

- 在子组件中定义自定义事件，触发事件
- 在父组件中传递事件回调

> 与定义回调函数类型的 props 属性不同，自定义事件的函数返回值无法接收

在子组件中定义自定义事件，触发事件

```vue
<script setup lang="ts">
import {ref} from "vue";

let value = ref('value');

// 通过emit对象触发事件
const emit = defineEmits(['get-value']);
    
// 使用ts语法
/*
const emit = defineEmits<{
  (e: "get-value", value: string): void
}>()
*/
// 更简洁的语法
/*
const emit = defineEmits<{
  getValue: [value: string]
}>()
*/

</script>

<template>
  <!--传入触发的事件名和参数-->
  <button @click="emit('get-value', value)">向父组件传递value</button>
</template>
```

在父组件中传递事件回调

```vue
<script setup lang="ts">
import {ref} from 'vue';
import Inner from "@/components/Inner.vue";

let value1 = ref('');

function getValue(value: string) {
  value1.value = value;
}

</script>

<template>
  <div>
    <div>{{value1}}</div>
    <!--自定义事件传入回调-->
    <Inner @get-value="getValue"></Inner>
  </div>
</template>
```

## mitt 消息总线

使用前安装 mitt：`npm i mitt`

初始化消息总线 emitter

```ts
import mitt from "mitt";
const emitter = mitt();
export default emitter;
```

{: file='src/utils/emitter.ts'}

emitter 对象主要使用四个成员

- `all`：获取所有事件，返回事件和对应回调的 map
- `on()`：绑定事件
- `emit()`：触发事件
- `off()`：注销事件

子组件接收 value1，传递 value2

```vue
<script setup lang="ts">
import {ref} from "vue";
import emitter from "@/utils/emitter";

let value1 = ref('');

emitter.on('get-value1', (value) => {
  if (typeof value === 'string') {
    value1.value = value;
  }
})

</script>

<template>
  <div>{{value1}}</div>
  <button @click="emitter.emit('get-value2', 'value2')">触发get-value2</button>
</template>
```

父组件接收 value2，传递 value1

```vue
<script setup lang="ts">
import {ref} from 'vue';
import Inner from "@/components/Inner.vue";
import emitter from "@/utils/emitter";

let value2 = ref('');

emitter.on('get-value2', (value) => {
  if (typeof value === 'string') {
    value2.value = value;
  }
})

</script>

<template>
  <div>
    <div>{{value2}}</div>
    <button @click="emitter.emit('get-value1', 'value1')">触发get-value1</button>
    <Inner></Inner>
  </div>
</template>
```

在组件取消挂载时注销事件

```ts
onUnmounted(() => {
  emitter.off('get-value1')
})
```

## $attrs

用于父组件向子组件通信，在父组件传递参数时，若子组件未定义对应的 props，则参数保存在 `$attrs` 对象中

父组件传递参数

```vue
<script setup lang="ts">
import {ref} from 'vue';
import Inner from "@/components/Inner.vue";

let value1 = ref('value1')
let value2 = ref('value2');

</script>

<template>
  <div>
    <Inner :value1="value1" :value2="value2"></Inner>
  </div>
</template>
```

子组件中未定义为 props 的参数会以键值对的形式保存到 `$attrs` 对象中

```vue
<script setup lang="ts">
// value1定义为props，value2未定义，value2保存在$attrs对象中
defineProps(['value1']);
</script>

<template>
  <!--
  value1
  { "value2": "value2" }
  -->
  <div>{{value1}}</div>
  <div>{{$attrs}}</div>
</template>
```

## ref 标签属性

ref 标签属性可以获取组件的实例对象或 HTML 元素的 DOM 对象

- 子组件定义暴露的数据
- 父组件通过 ref 属性获取对象，获取暴露的数据

`$refs` 和 `$parent`

- `$refs`：以键值对的形式存储所有使用 ref 属性的元素对象
- `$parent`：当前组件的父组件对象

子组件中定义暴露的数据

```vue
<script setup lang="ts">
import { ref } from 'vue'

const name = ref("张三")

const sayName = ()=>{
  console.log("我叫 " + name.value)
}

// 使用defineExpose函数定义暴露的数据
defineExpose({name, sayName});
</script>

<template>
  <div>{{name}}</div>
</template>
```

父组件通过 ref 属性获取子组件对象

```vue
<script setup lang="ts">
import {onMounted, ref} from 'vue';
import Inner from "@/components/Inner.vue";

let inner = ref();

// 在父组件挂载完成后使用子组件对象
onMounted(() => {
  console.log(inner.value.name);
  inner.value.sayName();
});

</script>

<template>
  <div>
    <Inner ref="inner"></Inner>
  </div>
</template>
```

## provide 与 inject

用于祖先组件向子组件提供数据

- 在祖先组件中使用 provide 提供数据
- 在子组件中使用 inject 获取数据

在祖先组件中提供数据

```vue
<script setup lang="ts">
import {provide, ref} from 'vue';
import Inner from "@/components/Inner.vue";

let value1 = ref('value1');

// 传入key和value
provide('key1', value1);

</script>

<template>
  <div>
    <Inner></Inner>
  </div>
</template>
```

在子组件中获取数据

```vue
<script setup lang="ts">
import {inject} from 'vue';

// 第二个参数为默认值，可辅助ts类型推断
let value1 = inject('key1', 'defaultValue');

</script>

<template>
  <div>{{value1}}</div>
</template>
```
