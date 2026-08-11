## Why

当前 topic 文章源码位于 `source/topic/`，在 Hexo 数据模型中属于 Page，不会天然进入 Post 的分类、标签、归档和侧栏 recent 数据流。已有变更只将 topic 注入首页文章列表，导致首页与分类/标签/侧栏 recent 的文章可见性不一致。

本次变更要把 topic 文章在展示层定位为普通 post：保留源码位置和 `/topic/.../` 访问路径，但让它参与近期发布、分类、标签等普通文章入口。

## What Changes

- topic 文章继续从 `source/topic/` 读取，详情页 URL 继续保持 `/topic/<slug>/<page>/`。
- topic 文章在首页近期发布列表中继续与普通 post 混排。
- 侧栏 `recent` widget 在普通博客上下文中显示 topic 文章。
- 分类总页和分类详情页应包含 topic 文章及其计数。
- 标签总页和标签详情页应包含 topic 文章及其计数。
- topic 文章在普通文章列表中继续使用 `{专栏标题}-{文章标题}` 作为列表标题，专栏详情页标题保持原样。
- 普通 `_posts` 文章、wiki、notebook、topic 独立页的既有行为保持兼容。
- 不引入新依赖，不移动文章文件，不修改文章或图片内容。

## Capabilities

### New Capabilities

- `topic-post-integration`: 定义 topic 文章作为普通 post 参与首页近期发布、侧栏 recent、分类和标签入口的展示行为。

### Modified Capabilities

无。当前仓库没有已归档 living specs。

## Impact

- 主要影响 `themes/stellar/scripts/events/lib/topic_tree.js` 中 topic 数据构造与注入边界。
- 可能影响分类、标签相关 generator 或其输入 locals 的构造方式。
- 可能影响 `themes/stellar/layout/_partial/widgets/recent.ejs` 的普通博客 recent 数据来源。
- 需要验证 `yarn build`，并检查首页、侧栏 recent、分类总页、分类详情页、标签总页、标签详情页和 topic 详情页。
