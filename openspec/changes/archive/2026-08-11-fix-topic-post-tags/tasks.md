# 任务清单

## 实现

- [x] 在 `themes/stellar/scripts/events/lib/topic_tree.js` 中新增 tag 规范化逻辑
  - 新增 `normalizePostTags(tags)` 小函数
  - 字符串 tag 转换为 `{ name: tag }`
  - 对象 tag 原样保留
  - `tags` 缺失时保持缺失
- [x] 在 `injectTopicPosts()` 构造虚拟 `postEntry` 时设置规范化后的 `tags`
  - 保持 `title: ${topicObject.title}-${sourcePage.title}` 不变
  - 保持 `link: sourcePage.path` 不变
  - 不修改原始 `sourcePage`
  - 不修改 `post_card.ejs`

## 验证

- [x] `yarn clean && yarn build` 构建成功
- [x] 检查 `public/index.html` 与分页页面：专栏文章 tag 不再显示 `#undefined`
- [x] 检查专栏文章 tag 显示真实名称
- [x] 检查普通 Post 标题、链接、tag 不受影响
- [x] 检查专栏独立页面不受影响
