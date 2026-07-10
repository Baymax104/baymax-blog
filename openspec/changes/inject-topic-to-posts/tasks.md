# 任务清单

## 实现

- [x] 在 `themes/stellar/scripts/events/lib/topic_tree.js` 中添加注入逻辑
  - 包装首页 `index` 生成器，在生成器运行时注入 posts 副本
  - 只遍历已进入 `topicObject.pages` 的文章
  - 专栏名严格使用 `topicObject.title`，文章名严格使用 `page.title`
  - 创建浅拷贝，将 `title` 改为 `${topicObject.title}-${page.title}`
  - 设置 `link: page.path`，确保首页卡片链接回专栏文章页面
  - 推入首页生成器使用的 `locals.posts` 副本，避免污染 feed/archive 等其他生成器
  - 按 `path` 去重，避免重复注入
  - 补齐 `popularPost_tmp_gaData`，兼容 `hexo-related-popular-posts` 的 posts 缓存读取
  - Re-sort：单次 comparator，先 sticky 降序，再 date 降序

## 验证

- [x] `yarn build` 构建成功
- [x] 检查 `public/index.html`：专栏文章出现在首页文章列表
- [x] 检查专栏文章标题格式：`{专栏名}-{文章名}`
- [x] 检查专栏文章链接：指向正确的专栏文章页面（`/topic/<slug>/...`）
- [x] 检查专栏独立页面（`/topic/<slug>/`）：文章标题为原始标题，未受影响
- [x] 检查分页：专栏文章参与首页分页，分页正常
- [x] 检查普通 Post：标题、链接均不受影响
