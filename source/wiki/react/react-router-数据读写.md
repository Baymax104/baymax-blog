---
title: 数据加载与写入
categories: [前端, React]
tags: [前端, React]
date: 2025-09-13 19:04
updated: 2025-09-18 00:59
wiki: react
---

react router 在 v6 版本中提供了一个基于路由的数据加载与写入机制，可以实现路由级别的数据操作，主要通过路由对象的 `loader` 和 `action` 字段实现

## loader

loader 字段接收一个函数（支持 async 函数），可以在其中实现路由组件渲染前的数据加载逻辑，在其中抛出异常可终止加载并跳转到错误页面

```tsx
{
  path: "teams",
  element: <Teams/>,
  loader: async () => {
    // 直接返回加载的数据
    return fakeDb.from("teams").select("*")
  }
}
```

loader 回调函数可以获取到 URL 路径参数 `params` 以及导航请求 `request`

- `params`：一个包含路径参数的对象
- `request`：一次导航可以视为对 URL 的一次请求，该请求对象是 Fetch API 中的 [Request](https://developer.mozilla.org/zh-CN/docs/Web/API/Request) 类型，通过该对象可以获取当前访问的 URL 以及相应的查询参数等

    > 相当于拦截了 `<a>` 的默认行为（让浏览器请求 URL），将请求传递到 loader 中

```tsx
{
  path: "teams",
  element: <Teams/>,
  loader: async ({ params, request }) => {
    // ...
  }
}
```

在组件中使用 `useLoaderData` 函数获取 loader 返回的数据，该 hook 不会触发 loader 调用，因此在组件的重渲染中，loader 返回的数据是稳定的

```tsx
import { useLoaderData } from 'react-router';

function Teams() {
  const data = useLoaderData()
}
```

## action

action 字段处理路由中的数据写入，它接收一个函数，其中同样可以使用 `params`、`request` 等参数，主要与 `<Form>` 组件配合使用，在其中抛出异常可终止写入并跳转到错误页面

> 在 action 执行完成后，会自动验证页面中使用 loader 加载的数据是否有更新，若有更新，则自动执行 loader 重新加载页面

Form 组件的提交可以看做一次导航请求，目标地址就是 `action` 属性指定的 URL 地址，因此可以在 `action` 属性中传入路径参数

```tsx
<Form method="post" action="/projects/123">
  <input name="username" type="text"/>
  <button type="submit">Submit</button>
</Form>


const router = createBrowserRouter([
  {
    path: "/projects/:projectId",
    action: async ({ params }) => {
      const projectId = params.projectId  // 123
    }
  }
)]
```

通过 `request` 对象可以获取表单数据

```tsx
<Form method="post" action="/projects">
  <input name="username" type="text"/>
  <button type="submit">Submit</button>
</Form>


const router = createBrowserRouter([
  {
    path: "/projects",
    action: async ({ request }) => {
      const formData = await request.formData()
      const username = formData.get("username")
    }
  }
])
```

在组件中可以使用 `useActionData` 获取 action 返回的数据，通常是数据更新的操作信息，可以用于更新页面元素

通常 `useActionData` 在 Form 表单相同路由的组件中使用

```tsx
async function action({ request }) {
  const data = await request.formData()
  const name = data.get('name')
  return { msg: `${name} Done` }
}

function Page() {
  const actionData = useActionData()
  return (
    <>
      <!-- 更新当前页面元素 -->
      {actionData && <p>{actionData.msg}</p>}
      <Form method="post">
        <input name="name" required />
        <button type="submit">Submit</button>
      </Form>
    </>
  )
}
```

**在 action 回调中处理多个表单提交**

可以在 `<button>` 等提交元素上设置 `name` 属性和 `value` 属性，通过判断提交元素来区分不同的表单

```tsx
function Component() {
  let song = useLoaderData();

  // When the song exists, show an edit form
  if (song) {
    return (
      <Form method="post">
        <p>Edit song lyrics:</p>
        {/* Edit song inputs */}
        <button type="submit" name="intent" value="edit">
          Edit
        </button>
      </Form>
    );
  }

  // Otherwise show a form to add a new song
  return (
    <Form method="post">
      <p>Add new lyrics:</p>
      {/* Add song inputs */}
      <button type="submit" name="intent" value="add">
        Add
      </button>
    </Form>
  );
}


async function action({ request }) {
  let formData = await request.formData();
  let intent = formData.get("intent");

  if (intent === "edit") {
    await editSong(formData);
    return { ok: true };
  }

  if (intent === "add") {
    await addSong(formData);
    return { ok: true };
  }

  throw json(
    { message: "Invalid intent" },
    { status: 400 }
  );
}
```

## 重定向

可以在 loader 和 action 中使用 `redirect` 函数实现重定向

该函数返回一个 Fetch API 中的 [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response/Response) 对象，接收两个参数

- `url`：重定向的 URL 地址
- `init`：`Response` 中的 options 选项对象

```tsx
import { redirect } from "react-router";

const loader = async () => {
  const user = await getUser()
  if (!user) {
    return redirect("/login")
  }
  return user
}
```
