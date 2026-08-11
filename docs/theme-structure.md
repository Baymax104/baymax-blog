# Stellar 主题代码结构

> 本文档是 `themes/stellar`（hexo-theme-stellar v1.33.1，git submodule）的代码地图，用于快速定位「要改某个功能该去哪找」。主题本身是 submodule，本文档维护在主仓库。

## 目录结构总览

> 本文提到的 `_config.yml` 默认指主题配置 `themes/stellar/_config.yml`；主仓库根 `_config.yml` 仅承载站点级配置（URL、部署、插件等），不应堆积主题配置。

```
themes/stellar/
├── _config.yml            # 主题配置（746 行，模块化，详见下文「配置↔代码映射」）
├── _data/                 # 主题自带数据
│   ├── icons.yml          # 图标库（menu:post 等 svg 图标的定义）
│   ├── widgets.yml        # 侧边栏组件定义
│   └── chat_users.yml     # chat 标签的用户头像
├── languages/             # i18n 资源
├── layout/                # EJS 模板（服务端渲染）
│   ├── layout.ejs         # 总骨架：三栏布局 + 页面/文章类型判定
│   ├── index.ejs          # 博客首页（文章列表）
│   ├── index_wiki.ejs     # 知识库列表页
│   ├── index_topic.ejs    # 专栏列表页
│   ├── page.ejs           # 自定义页面
│   ├── post（由 hexo 默认）# 文章内页走 layout.ejs + body
│   ├── archive/categories/tags/notes/notebooks.ejs
│   ├── 404.ejs
│   ├── _partial/          # 局部模板
│   │   ├── head.ejs       # <head>：meta、CSS、inject.head
│   │   ├── scripts.ejs    # 前端脚本注入总入口
│   │   ├── cover/         # 文章横幅/封面
│   │   ├── sidebar/       # 侧边栏：logo、menu、leftbar/rightbar 装配
│   │   ├── widgets/       # 侧边栏组件：tree、toc、related、recent、timeline、ghuser、ghrepo…
│   │   ├── comments/      # 评论系统（giscus/twikoo/waline/artalk/utterances/beaudar）
│   │   ├── main/          # 主内容区：navbar（面包屑/nav_tabs）、article、post_list、notebook、footer
│   │   └── scripts/       # 前端脚本分块：defines/utils/sidebar/tagtree/lazyload/theme/services
│   └── _plugins/          # 插件加载模板（fancybox/swiper/mermaid/katex/copycode/search…）
├── scripts/               # Hexo 扩展（Node.js，构建期执行）
│   ├── generators/        # 生成器：注册额外路由
│   ├── filters/           # 过滤器：处理渲染产物
│   ├── tags/              # 标签插件：自定义 {% tag %}
│   ├── helpers/           # 辅助函数：EJS 中可调用
│   ├── events/            # 事件：构建生命周期钩子
│   └── commands/          # 命令：扩展 hexo CLI
├── source/                # 静态资源（直接输出到 public/）
│   ├── css/               # Stylus 样式源码
│   └── js/                # 前端 JS
├── giscus.json            # giscus 评论映射配置
├── package.json
└── README.md
```

## 渲染流程

### 1. 页面骨架（`layout/layout.ejs`）

总入口，对所有页面生效，按顺序：

1. **判定页面类型** `page_type`：有 `nav_tabs` → `index`（列表页），否则 → `content`（内容页）
2. **判定文章类型** `article_type`：`tech` / `story`，优先级：`page.type` > `topic 配置` > `wiki 配置` > `theme.article.type`
3. **判定缩进** `indent`：同上优先级链，`story` 类型默认缩进
4. **组装 HTML**：`head` → `cover` → `l_body`（三栏：`l_left` 左侧栏 / `l_main` 主区 / `l_right` 右侧栏）→ `scripts`

三栏组件由 `site_tree` 配置驱动：每种页面类型（home/index_blog/index_wiki/post/wiki/topic/note…）在 `_config.yml` 的 `site_tree` 里声明 `leftbar` 和 `rightbar` 用哪些 widget。

### 2. 脚本注入（`layout/_partial/scripts.ejs`）

前端脚本装配顺序：

```
defines → utils → sidebar → tagtree → lazyload
→ main.js（必需）
→ theme → comments → services → plugins
→ inject.script（用户自定义注入）
```

`inject` 支持 `config.inject`（站点级）、`theme.inject`（主题级）、`page.inject`（页面级 front matter）三层叠加。

## Hexo 扩展点（`scripts/`）

构建期执行的 Node.js 代码，按 Hexo 扩展 API 分六类：

### generators/（`hexo.extend.generator`）—— 生成额外路由

读取 `site_tree` + 对应配置，输出 `{path, layout, data}` 列表：

| 文件 | 作用 |
|------|------|
| `wiki.js` | 知识库列表页 + 各 tag 筛选页 |
| `topic.js` | 专栏列表页 |
| `tags.js` / `categories.js` | 标签 / 分类归档页 |
| `search.js` | 本地搜索索引（`search.json`） |
| `notebooks.js` | 笔记本列表页 |
| `author.js` | 作者主页 |
| `404.js` | 404 页 |

### filters/（`hexo.extend.filter`）—— 处理渲染产物

- `after_render:html`：`img_lazyload`（图片懒加载占位，固定宽高比防跳变）、`img_onerror`（图片加载失败兜底图）
- `before_post_render`（优先级 9）：把 Markdown `![]()` 语法转成 `{% image %}` 标签，受 `tag_plugins.image.parse_markdown` 控制；会跳过代码块和 gallery 内容
- `pretty_urls.js`：URL 美化（受 `system.override_pretty_urls` 控制）

### tags/（`hexo.extend.tag`）—— 自定义标签插件

`tags/index.js` 是注册入口，按职责分四组，每个标签对应 `lib/` 下一个文件，返回 HTML 字符串：

- **容器类**：`tabs` `box` `about` `folding` `folders` `grid` `swiper` `gallery` `banner`
- **数据类**：`users`/`friends` `albums` `posters` `sites` `ghcard` `toc` `timeline` `md` `chat`
- **表达类**：`checkbox`/`radio` `copy` `emoji` `icon` `frame` `image` `link` `button` `mark` `navbar` `note` `poetry` `quot` `blockquote` `hashtag` `okr` `audio` `video` `rating` `vote`
- **阅读类**：`reel` `paper`（`lib/read/`）

Markdown 中用 `{% tagname 参数 %}...{% endtagname %}` 调用。`inline-labels.js` 处理行内标签。

### helpers/（`hexo.extend.helper`）—— EJS 可调用函数

在模板里用 `<%- helper_name(args) %>` 调用：

`utils`（`get_page` 等）、`icon`（渲染图标）、`json_ld`（结构化数据）、`related_posts`（相关文章）、`pretty_url`、`parse_config`、`dynamic_color`、`category_color`、`scrollreveal`、`stellar_info`（主题版本/信息）

### events/（`hexo.on` / `hexo.extend.filter`）—— 构建生命周期

- `generateBefore`：构建前合并配置、解析 links/authors、构建 **wiki 树**和 **topic 树**（`wiki_tree.js`/`topic_tree.js` 读 `_data` 清单生成导航树）、notebooks、utils
- `ready`：打印欢迎信息 + 版本检查（`version-check.js`，带缓存）
- `before_generate`（**仅 dev/server**）：若开启 `lazyload.fix_ratio`，生成图片宽高比缓存并回写 Markdown 图片标签

### commands/（`hexo.extend.console`）—— CLI 扩展

- `new-note.js`：`hexo new note <title>` 创建笔记

## 样式组织（`source/css/`）

`main.styl` 是总入口，按顺序 `@import`：

```
_defines/const          # 不可变常量
_custom/custom          # 用户自定义参数（覆盖层）
_defines/theme_base     # 含自定义参数的基础变量
_defines/theme_colorful # 多彩主题变量
_defines/func           # Stylus 函数
_common/*               # 通用元素（base/html/layout/button/image/pre/highlight/...）
_components/*           # 组件（sidebar/widgets/partial/pages/tag-plugins/main/md/layout/list）
_plugins/index          # 可选插件样式
```

- **改主题色/字体/圆角**：`_config.yml` 的 `style` 段（运行期变量，无需改 styl）
- **深度改样式**：`_custom/custom.styl`（用户自定义层，优先级最高）
- **改某组件样式**：`_components/<分组>/<组件>.styl`

## 前端脚本（`source/js/`）

- `main.js`：主脚本（必需，全站加载）
- `services/`：**动态数据服务**，按需加载（页面用到对应标签才请求），与 `_config.yml` 的 `data_services` 一一对应：`siteinfo` `ghinfo` `friends` `friends_and_posts` `timeline` `memos` `weibo` `sites` `rating` `vote` `fcircle` `mdrender` + 各评论系统的 `*_latest_comment`
- `plugins/`：插件 JS：`voice` `video` `download-file` `copycode`
- `search/`：搜索前端：`local-search` `algolia-search`

## 配置 ↔ 代码模块映射

改 `_config.yml` 某段时，影响的代码位置：

| `_config.yml` 段 | 影响的代码 |
|------------------|-----------|
| `site_tree` | `layout.ejs` 三栏装配 + `generators/*` 路由 + `layout/_partial/sidebar/` |
| `article` | `layout.ejs` 文章类型/缩进判定 + `css/_components/pages/article-*.styl` |
| `notebook` | `generators/notebooks.js` + `layout/notebooks.ejs`/`notes.ejs` + `events/lib/notebooks.js` |
| `comments` | `layout/_partial/comments/<service>/` + `css/_plugins/comments/` + `js/services/*_latest_comment` |
| `search` | `generators/search.js` + `js/search/` + `layout/_partial/sidebar/search.ejs` |
| `tag_plugins` | `scripts/tags/lib/*` + `css/_components/tag-plugins/*` |
| `plugins`（fancybox/swiper/mermaid/katex/…） | `layout/_plugins/*.ejs` + `css/_plugins/*` + 部分 `scripts/filters` |
| `data_services` | `js/services/*` + `layout/_partial/scripts/services.ejs` |
| `inject`（head/script） | `layout/_partial/head.ejs` / `scripts.ejs` 的 `custom_inject()` |
| `style` | `css/_defines/theme_base.styl`（运行期 CSS 变量） |
| `default`（占位图） | `scripts/helpers/` + 各标签 lib 的兜底逻辑 |
| `api_host` | `js/services/ghinfo.js` 等 |
| `system` | `scripts/filters/pretty_urls.js` 等 |

## 关键设计模式

1. **配置驱动**：`_config.yml` 的模块划分与代码模块一一对应，绝大多数定制只需改配置，不动代码。
2. **三栏布局 + site_tree 路由**：每类页面在 `site_tree` 声明 `leftbar`/`rightbar` 用哪些 widget，`layout.ejs` 据此装配，无需为每种页面写独立布局。
3. **生成器 + 项目数据联动**：wiki/topic 靠 `generators/*` 读取 `source/_data/wiki/<slug>.yml` 和 `source/_data/topic/<slug>.yml` 生成路由；项目是否在索引页上架由各自数据文件中的 `published` 字段控制，`sort` 控制展示顺序，`events/lib/wiki_tree.js`/`topic_tree.js` 据此构建导航树。
4. **标签插件自成体系**：每个标签一个 `lib/*.js`，在 `tags/index.js` 注册；配套 `css/_components/tag-plugins/<name>.styl`。
5. **按需加载**：前端 `data_services` 仅在页面渲染出对应标签/组件时才加载 JS，避免全站加载冗余脚本。
6. **三层注入**：`inject` 支持 `config`（站点）→ `theme`（主题）→ `page`（front matter）叠加，用于注入统计、验证、第三方脚本。

## 常见定位速查

| 想做的事 | 去哪改 |
|---------|--------|
| 加一个 wiki | 主仓库 `source/_data/wiki/<slug>.yml`（含 `published` / `sort` / `tree`）+ `source/wiki/<slug>/*.md` |
| 改主题色/字体/圆角 | `_config.yml` 的 `style` 段 |
| 深度自定义样式 | `source/css/_custom/custom.styl` |
| 新增/修改评论系统 | `_config.yml` 的 `comments` + `layout/_partial/comments/` |
| 加统计/验证脚本 | `_config.yml` 的 `inject.head` / `inject.script` |
| 新增侧边栏组件 | `layout/_partial/widgets/` + `css/_components/widgets/` + `site_tree` 引用 |
| 改文章列表卡片样式 | `layout/_partial/main/post_list/` + `css/_components/list.styl` |
| 加自定义标签 | `scripts/tags/lib/<name>.js` + `scripts/tags/index.js` 注册 + `css/_components/tag-plugins/` |
| 改生成的页面路由 | `scripts/generators/<name>.js` |

> 注意：`themes/stellar` 是 git submodule（远端 `Baymax104/hexo-theme-stellar`）。主题定制直接改 submodule 内代码与配置，主仓库根 `_config.yml` 不应过多包含主题配置；submodule 改动单独提交推送后，主仓库再更新指针。
