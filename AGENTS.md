# AGENTS.md

## 仓库定位

- 这是一个 **Hexo 7** 博客仓库；优先使用 `package.json` 里的脚本作为入口，尤其是 `build`。当前根脚本只围绕 `hexo` CLI：`yarn build` = `hexo generate`，`yarn server` = 本地预览。
- 主题不是普通目录拷贝：`themes/stellar` 由 `.gitmodules` 声明为 **git submodule**，远端是 `Baymax104/hexo-theme-stellar`。主题定制直接改 submodule 内的代码与配置，**不要**把主题配置堆进主仓库根 `_config.yml`；submodule 改动单独提交推送后，再在主仓库更新指针。主题代码结构见 `docs/theme-structure.md`。

## 最有用的命令

- 安装依赖：`yarn`
- 生成静态站点：`yarn build`
- 本地预览：`yarn server`
- 清理生成物：`yarn clean`
- 不要把 `yarn test` 当验证命令：它会执行 `hexo clean && hexo generate && hexo server`，最后启动服务并常驻，不适合作为一次性检查。

## 验证约定

- 这个仓库没有 lint / typecheck / CI workflow 可依赖；做完改动后，默认验证方式是运行 `package.json` 中的 **`build`** 脚本（当前即 `yarn build`）。
- `public/`、`node_modules/`、`db.json` 都在 `.gitignore` 中；`public/` 是构建产物，不应作为源码修改目标。

## 内容与信息架构

- 站点主配置在根目录 `_config.yml`，当前启用主题为 `stellar`，部署备注明确写着 **已使用 Vercel**，不要把 `hexo deploy` 当常规发布流程。
- `source/_posts/` 放普通博客文章；wiki 与 topic 不是随意命名出来的，它们依赖 front matter + `_data` 清单联动：
  - `wiki: <slug>` 对应 `source/_data/wiki/<slug>.yml`，总入口在 `source/_data/wikis.yml`
  - `topic: <slug>` 对应 `source/_data/topic/<slug>.yml`，总入口在 `source/_data/topics.yml`
- 如果新增或重命名 wiki/topic 页面，只改 Markdown 不够，通常还要同步更新对应 `_data` 文件里的 `tree` / 列表入口。

## 写作与 Hexo 约束

- 根 `_config.yml` 开启了 `post_asset_folder: true`；若任务涉及文章配套资源，按 Hexo 文章资源目录约定处理，不要假设所有图片都应直接散放到 `source/`。
- `render_drafts: false`，`source/_drafts/` 默认不会进入构建结果；验证发布内容时不要误以为草稿缺失是构建问题。
- 站点语言是 `zh-CN`，现有内容与主题配置也以中文为主；新增仓库说明或内容时优先保持中文。

## 改动边界

- **严禁修改文章与图片**：git 提交时即使它们有变动也不得 stage/commit，文章/图片完全由用户手动控制。范围包括 `source/_posts/`、`source/_drafts/`、`source/topic/`、`source/wiki/`、`source/about/` 等 Markdown 内容，以及所有图片资源（`source/assets/`、文章资源目录等）。提交时只能用精确的 `git add <file>` 暂存指定文件，禁止 `git add .` / `git add -A`。注意 `source/_data/` 属于配置清单，不在此禁令内。
- 主题定制优先直接改 `themes/stellar/`（submodule 内的 `_config.yml`、`layout/`、`scripts/`、`source/` 等），接受 submodule 单独提交；不要为图省事把主题配置塞进主仓库根 `_config.yml`。
- 仓库根 `README` 目前为空；不要指望它提供项目说明，优先以 `package.json`、`_config.yml`、`source/_data/` 和主题配置作为事实来源。
