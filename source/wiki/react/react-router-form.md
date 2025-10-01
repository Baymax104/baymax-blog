---
title: Form组件
categories: [前端, React]
tags: [前端, React]
date: 2025-09-13 19:04
updated: 2025-10-02 00:28
wiki: react
---

react router 在 v6 版本提供了一个基于 [form表单元素](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Reference/Elements/form) 的增强组件 Form，可以与 react router 的数据操作配合使用

{% folding 简单了解 form 表单 open:false %}

`<form>` 是 HTML 中收集用户输入数据并提交到服务器的容器标签，主要使用两个核心属性

- `action`：表单数据提交的 URL，默认提交到当前的 URL
- `method`：提交数据使用的 HTTP 方法，默认为 `get`

form 标签中通常使用 `<input>` 和 `<button>` 作为输入标签，简单示例如下

```html
<form action="/submit" method="post">
  <input type="text" name="username" placeholder="请输入用户名" />
  <button type="submit">提交</button>
</form>
```

对于以上示例，浏览器对 form 表单的默认提交流程如下

1. 浏览器收集 form 表单中带有 `name` 属性的输入标签，将 `name` 和输入值组成键值对
2. 对数据进行编码，默认编码为 `application/x-www-form-urlencoded`
3. 向 `/submit` 地址发送一个 `post` 请求
4. 页面刷新或跳转

{% note color:red 按钮在表单中的默认行为 位于 `<form>` 标签中的 `<button>` 按钮，其默认行为会被修改为 `submit`，即使没有显式指定 `type="submit"`，因此在表单中使用 `<button>` 作为普通按钮，应该设置 `type="button"` %}

{% endfolding %}

## `action` 属性

在 HTML 的 form 标签中，`action` 属性要求指定一个绝对路径，Form 组件默认使用的是**当前路由的路径**

```tsx
function ProjectsLayout() {
  return (
    <>
      <Form method="post" />
      <Outlet />
    </>
  );
}

function ProjectsPage() {
  return <Form method="post" />;
}

const router = createBrowserRouter([
  {
    path: "/projects",
    element: <ProjectsLayout/>,
    children: [
      {path: ":projectId", element: <ProjectsPage/>}
    ]
  }
])
```

以上示例中，`<ProjectsLayout>` 的 URL 为 `/projects`，因此 `<Form>` 中的 `action` 默认为 `/projects`

## `method` 属性

`method` 属性默认为 `get`，此时 Form 组件与 HTML 的 form 标签行为一致，提交时会将表单数据编码为查询参数，添加到 URL 中并进行导航

```tsx
<Form method="get" action="/products">
  <input type="text" name="q"/>
  <button type="submit">Search</button>
</Form>
```

若用户输入 `food`，则查询参数为 `q=food`，点击按钮提交后会导航到 `/products?q=food`

对于其他 `method` 值，如 `post`、`delete` 等，react router 会将 `action` 地址与路由的路径匹配，调用该路由的 `action` 回调，实现数据写入与导航逻辑

> 对于 `post`、`delete` 之类的方法，导航逻辑需要在路由的 `action` 回调中手动实现，因此 react router 中的 Form 默认不会进行导航

## 导航

Form 组件在提交后可能进行导航，可以使用 `navigate={false}` 来禁止导航

Form 导航也支持 `replace`、`relative`、`state` 等参数

## useSubmit

`useSubmit` 函数用于程序式地实现 Form 表单提交，简单示例如下

```tsx
import { useSubmit } from 'react-router';

const submit = useSubmit()
submit(target, options)
```

`submit` 函数接收两个参数

- `target`：提交数据，`SubmitTarget` 类型
- `options`：表单属性及导航选项

### `target` 参数

`target` 参数为 `SubmitTarget` 类型，可以传入提交元素的 DOM、FormData、URL 查询参数以及 JSON 数据，定义如下

```ts
type SubmitTarget = HTMLFormElement | HTMLButtonElement | HTMLInputElement | FormData | URLSearchParams | JsonValue | null;
```

示例如下

```tsx
import { useSubmit } from 'react-router';

function MyForm() {
  const submit = useSubmit();

  // 提交一个 input 元素
  const handleInputChange = (event) => {
    submit(event.currentTarget); // 提交表单输入元素
  };

  // 提交 FormData（比如文件上传或传统表单）
  const handleFormDataSubmit = () => {
    const formData = new FormData();
    formData.append("cheese", "gouda");
    submit(formData); // 默认会以 FormData 方式提交，通常用于 POST
  };

  // 提交 JSON 对象（使用 application/json 编码）
  const handleJsonSubmit = () => {
    submit(
      { key: "value" },
      { method: "post", encType: "application/json" }
    );
  };

  // 直接提交 URLSearchParams 字符串形式
  const handleSearchParamsSubmit = () => {
    // 直接传入查询字符串或构造URLSearchParams对象
    submit("cheese=gouda&toasted=yes");
  };

  return (
    <div>
      <input type="text" onChange={handleInputChange}/>
      <button onClick={handleFormDataSubmit}>Submit FormData</button>
      <button onClick={handleJsonSubmit}>Submit JSON</button>
      <button onClick={handleSearchParamsSubmit}>Submit Query String</button>
    </div>
  );
}
```

### `options` 参数

`options` 参数接收一个对象，其中的可设置项与 Form 组件属性基本相同

- `action`
- `method`
- `navigate`
- `relative`
- `replace`
- `state`
