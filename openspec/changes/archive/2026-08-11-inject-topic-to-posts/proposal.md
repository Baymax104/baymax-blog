# 提案：专栏文章同时显示到普通 Post 列表

## 背景

当前专栏（topic）文章与普通 Post 是两套完全独立的子系统：

- **Post**：`source/_posts/` → `locals.posts` → `hexo-generator-index` → 首页列表
- **Topic**：`source/topic/<slug>/` → `locals.pages` → `topic_tree.js` → 专栏独立页面

专栏文章不在首页文章列表中显示，用户需要进入专栏页面才能看到。

## 目标

1. 专栏中的文章**同时出现**在首页普通 Post 列表中（与 Post 混排，按日期排序）
2. 在文章列表中，专栏文章标题显示为 `{专栏名}-{文章名}`
3. 专栏文章在专栏页面中的标题**保持原样**（不受影响）
4. 分页、置顶、排序等现有逻辑**全部复用**，不重复实现

## 方案

采用**方案 A（脚本注入）**：在 `topic_tree.js` 构建完专栏树后，包装首页 `index` 生成器，并在该生成器运行时将专栏文章作为虚拟 post 注入首页使用的 `locals.posts` 副本。

### 为什么选方案 A

- **最小改动面**：只改 `topic_tree.js` 一个文件，不改模板
- **复用全部现有逻辑**：分页、排序、置顶、「indexing」过滤、文章卡片渲染全部继承
- **不影响专栏系统**：原 `topic_tree.js` 使用 `RelatedPage` 封装保留原始 title，专栏页面渲染不受影响
- **不修改文章文件**：front matter 完全不动
- **避免影响其他生成器**：只修改首页生成器收到的 posts 副本，不污染 `feed`、`archive` 等生成器共用的 `locals.posts`

### 核心思路

```
topic_tree.js (generateBefore)
  ↓
  构建 topic.tree（现有逻辑，不变）
  ↓
  注入 ctx.theme.config.topic（现有逻辑，不变）
  ↓
  【新增】包装 hexo-generator-index 的 index 生成器
  ↓
  index 生成器运行时，复制 locals.posts 并遍历已进入 topicObject.pages 的 topic 文章，注入 posts 副本
    - title = "{topicObject.title}-{page.title}"
    - 其余字段继承原始 page 对象
    - link = page.path，确保首页卡片链接回专栏文章页面
    - 按 path 去重，避免热更新或重复执行时重复注入
    - 单次排序：先 sticky 降序，再 date 降序
    - 补齐 `hexo-related-popular-posts` 缓存字段，避免相关文章插件读取 posts 缓存时报错
  ↓
  hexo-generator-index 正常消费注入后的 posts 副本
    → index.ejs → post_card.ejs（title 正常显示）
```

## 修改文件

| 文件 | 改动 |
|------|------|
| `themes/stellar/scripts/events/lib/topic_tree.js` | 新增虚拟 post 构造逻辑，并包装首页 `index` 生成器以注入 posts 副本 |

**不改动**：模板（`index.ejs`、`post_card.ejs`）、配置文件、文章内容。

## 边界情况

| 场景 | 处理方式 |
|------|---------|
| 专栏文章设置 `indexing: false` | 注入的 title 仍会被修改，但 `index.ejs` 中的 `post.indexing != false` 检查会过滤掉 |
| 专栏文章有 `sticky` 属性 | 注入后 re-sort 会正确处理置顶 |
| 专栏名缺失（`topic.yml` 无 title） | 不做 `name` 或 slug fallback，严格只使用 `topicObject.title` |
| 文章名缺失（page 无 title） | 不做 `name` 或 slug fallback，严格只使用 `page.title` |
| 未登记在 `topicObject.pages` 的 topic 页面 | 不注入首页，避免孤立页面进入普通 Post 列表 |
| 专栏文章已存在于 `locals.posts` | 按 path 去重跳过，避免重复注入 |
| 分页边界 | 专栏文章与普通 Post 同等参与分页，不引入额外分页逻辑 |
| build / server 重复运行 | 按 path 去重，重复执行时不会重复插入同一篇文章 |
| `hexo-related-popular-posts` 读取 posts 缓存 | 虚拟 post 补齐 `popularPost_tmp_gaData`，避免插件假定字段存在导致构建错误 |
| `feed` 等其他生成器读取 `locals.posts` | 只注入首页生成器的 posts 副本，避免 page 对象缺少 post-only 字段导致其他生成器报错 |

## 实现示意

```js
function injectTopicPosts(posts, sourcePages, topic, topicList) {
  const existingPostPaths = new Set(posts.data.map(post => post.link || post.path));

  for (const topicSlug of topicList) {
    const topicObj = topic.tree[topicSlug];
    if (!topicObj) continue;

    for (const relatedPage of topicObj.pages) {
      const sourcePage = sourcePages.find(page => page._id === relatedPage.id || page.path === relatedPage.path);
      if (!sourcePage || existingPostPaths.has(sourcePage.path)) continue;

      const postEntry = Object.assign({}, sourcePage, {
        title: `${topicObj.title}-${sourcePage.title}`,
        link: sourcePage.path
      });
      postEntry.popularPost_tmp_gaData = postEntry.popularPost_tmp_gaData || {
        title: postEntry.title,
        path: sourcePage.path,
        date: sourcePage.date || '',
        categories: '',
        tags: []
      };
      posts.data.push(postEntry);
      existingPostPaths.add(sourcePage.path);
    }
  }

  posts.data.sort((a, b) => {
    const stickyDiff = (b.sticky || 0) - (a.sticky || 0);
    if (stickyDiff !== 0) return stickyDiff;
    return (b.date || 0) - (a.date || 0);
  });
}

// 包装 index 生成器时只注入副本，避免污染其他生成器共享的 locals.posts
const indexLocals = Object.assign({}, locals, {
  posts: Reflect.construct(locals.posts.constructor, [locals.posts.data.slice()])
});
injectTopicPosts(indexLocals.posts, sourcePages, topic, topicList);
return indexGenerator.call(this, indexLocals);
```
