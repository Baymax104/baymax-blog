## Context

Hexo 只把 `source/_posts/` 和 `source/_drafts/` 下的文件建模为 Post；`source/topic/` 下的 Markdown 会进入 Page。Stellar 主题当前在 `topic_tree.js` 中构建 `theme.topic.tree`，并通过包裹首页 `index` generator，将 topic 页面作为虚拟 post 注入首页使用的 `locals.posts` 副本。

该实现刻意只影响首页，因此分类、标签、归档和普通博客上下文的侧栏 recent 仍读取原生 `site.posts`、`locals.categories`、`locals.tags` 或 `category.posts` / `tag.posts`，不会包含 topic 文章。用户已明确：topic 文章在展示层应作为普通 post，源码仍不放在 `_posts`。

## Goals / Non-Goals

**Goals:**

- topic 文章在首页近期发布、侧栏 recent、分类总页、分类详情页、标签总页、标签详情页中与普通 post 一致显示。
- topic 详情页仍使用 `/topic/<topic>/<page>/` 路径，并保留专栏上下文、侧栏和标题。
- 普通文章列表中 topic 标题继续显示为 `{专栏标题}-{文章标题}`。
- 保持普通 `_posts`、wiki、notebook 行为兼容。
- 不移动或修改文章内容文件，不引入新依赖。

**Non-Goals:**

- 不把 `source/topic/` 文件物理迁移到 `_posts/`。
- 不改变 topic 独立索引页和 topic 树的组织方式。
- 不要求 feed、sitemap、搜索索引同步纳入 topic，除非现有代码自然继承该数据源。
- 不重构整个 Stellar 数据模型或替换 Hexo 原生 generator。

## Decisions

1. **保留虚拟 post 方案，但扩展为统一数据构造**

   继续在主题侧从 topic Page 构造 post-like entry，避免移动源码或改 Hexo 核心 processor。该 entry 必须保留 `link: sourcePage.path`，确保列表点击仍进入 topic 详情页。

   备选方案是注册自定义 processor，把 `source/topic/` 直接写入 Post model。该方案更接近 Hexo 原生分类/标签行为，但会让同一文件同时可能由 Page 与 Post processor 处理，带来详情页重复生成、layout 变化、asset 归属和关系清理风险，改动面更大。

2. **补齐分类/标签视图所需的关系，而不是只改模板**

   分类/标签详情页依赖 `category.posts` / `tag.posts`，它们通过 `PostCategory` / `PostTag` 关系反查 `locals.posts`。仅在 `categories.ejs` 或 `tags.ejs` 模板里显示 topic 名称，无法让 `/categories/<name>/` 和 `/tags/<name>/` 列表页包含 topic。

   实现时应在生成阶段为 topic virtual posts 建立可被分类/标签 generator 消费的数据结构，或包裹分类/标签 generator 并提供包含 topic 的 category/tag posts 集合。目标是让总页计数与详情页列表保持一致。

3. **recent widget 使用同一批 topic virtual posts**

   普通博客上下文下的 `recent.ejs` 当前读取 `site.posts`。实现时应避免在模板里重新解析 topic 树，而是复用主题生成阶段准备好的 topic virtual posts，合并后按 `updated` 降序截断。

4. **避免污染不在本次范围内的生成器**

   旧实现只注入首页 posts 副本，是为了不影响 feed 等其他生成器。本次应继续有边界：只让明确要求的首页、分类、标签、侧栏 recent 消费扩展后的集合。除非验证确认兼容，不应全局替换 `locals.posts`。

## Risks / Trade-offs

- **分类/标签计数与详情列表不一致** -> 使用同一套 topic virtual posts 和 taxonomy 构造逻辑驱动总页与详情页，验证两类页面。
- **topic 详情页变成普通 post 后丢失专栏侧栏** -> 不改变 topic Page 的生成方式；列表中只使用 post-like 副本。
- **虚拟 post 字段形状不完整导致模板读取异常** -> 构造时补齐 `title`、`link`、`path`、`date`、`updated`、`layout`、`categories`、`tags`、`content/excerpt/description` 等列表所需字段，并延续已有 tag 规范化。
- **构建性能下降** -> topic 数量较小，构造结果可在 `theme.config.topic` 或局部 locals 副本中复用，避免模板多次遍历 pages。
- **影响用户未提交内容变更** -> 实现只修改主题脚本和必要模板，不 stage/commit 文章或图片。
