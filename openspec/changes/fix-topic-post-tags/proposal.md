# 提案：修复首页专栏文章 tag 显示为 undefined

## 背景

`inject-topic-to-posts` 变更将专栏（topic）页面作为虚拟 post 注入首页 Post 列表后，专栏文章可以正常参与首页混排与分页。

但生成后的首页文章卡片中，专栏文章的 tag 显示为 `#undefined`。

复现示例：

```text
《机器学习》-强化学习 -> #undefined
LLM学习笔记-LangChain -> #undefined
```

## 根因

首页文章卡片模板 `themes/stellar/layout/_partial/main/post_list/post_card.ejs` 渲染 tag 时假设 `post.tags` 的每一项都是对象，并读取 `tag.name`：

```js
post.tags.map(tag => `#${tag.name}`)
```

普通 Post 的 `tags` 来自 Hexo Post model，元素形如：

```js
{ name: 'Python' }
```

但专栏 Page 的 front matter `tags` 在 Page 数据中是字符串数组：

```js
['LLM', '大模型', '大模型开发']
```

因此虚拟 post 直接浅拷贝 Page 后，`post_card.ejs` 读取字符串 tag 的 `tag.name`，结果为 `undefined`。

## 目标

1. 首页 Post 列表中的专栏文章 tag 显示真实 tag 名称，不再显示 `undefined`
2. 普通 Post 的 tag 渲染不受影响
3. 专栏独立页面不受影响
4. 保持当前“虚拟 post 注入首页生成器 posts 副本”的实现边界

## 方案

只在虚拟 post 构造处规范化 `tags` 字段，不修改通用文章卡片模板。

修改文件：

```text
themes/stellar/scripts/events/lib/topic_tree.js
```

修改点：`injectTopicPosts()` 中创建 `postEntry` 时，将 `sourcePage.tags` 规范化为文章卡片模板期望的对象数组。

```js
const postEntry = Object.assign({}, sourcePage, {
  title: `${topicObject.title}-${sourcePage.title}`,
  link: sourcePage.path,
  tags: normalizePostTags(sourcePage.tags)
})
```

新增小函数：

```js
function normalizePostTags(tags) {
  if (!tags) {
    return tags
  }
  return tags.map(tag => {
    if (typeof tag === 'string') {
      return { name: tag }
    }
    return tag
  })
}
```

## 为什么不改 `post_card.ejs`

`post_card.ejs` 是普通 Post、虚拟 topic post 等列表卡片的通用模板。当前问题不是模板渲染能力不足，而是虚拟 post 伪装成普通 post 时字段形状不完整。

在虚拟 post 构造处补齐字段形状，影响面最小，也更符合“虚拟 post 应尽量像 Post model”的边界。

## 边界情况

| 场景 | 处理方式 |
|------|----------|
| `sourcePage.tags` 为字符串数组 | 转换为 `{ name: tag }` 对象数组 |
| `sourcePage.tags` 已是对象数组 | 原样保留 |
| `sourcePage.tags` 缺失 | 保持缺失，不额外生成空 tag |
| 普通 Post tag | 不经过该逻辑，不受影响 |
| 专栏独立页面 tag | 不修改原 Page，只修改首页虚拟 post 副本 |

## 验证

1. 运行 `yarn clean && yarn build`
2. 检查首页和分页中不再存在专栏文章卡片的 `#undefined`
3. 检查专栏文章卡片显示真实 tag，例如 `#LLM`、`#大模型`、`#Hexo`
4. 检查普通 Post 的 tag 仍正常显示
5. 检查专栏独立页面标题与内容不受影响
