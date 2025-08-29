---
title: 自定义样式
categories: [博客开发]
tags: [Hexo, Stellar主题]
date: 2025-08-30 00:01
updated: 2025-08-30 01:13
topic: site-build
---
主题的自定义逻辑全部放在主题目录中，博客目录只存放文章

## 底部文字居中

底部文字默认左对齐，修改为居中，样式定义在主题目录下 `source/css/_components/partial/footer.styl` 文件中

```stylus
.page-footer .text
  margin-top: .5rem
  p
    margin: 4px 0
    line-height: 1.5
```

修改为

```stylus
.page-footer .text
  margin-top: .5rem
  p
    margin: 4px 0
    line-height: 1.5
    text-align: center
```

## 面包屑显示更新时间

`source/css/_components/partial/bread-nav.styl` 文件中

```stylus
div#post-meta
    span.sep:before
      content: '|'
    span.updated
      visibility: hidden
```

修改为

```stylus
div#post-meta
    span.sep:before
      content: '|'
    span.updated
      visibility: visible
```

## Post 卡片添加标签

在 `layout/_partial/main/post_list/post_card.ejs` 中添加代码

```js
if (post.sticky) {
    el += `<span class="pin">${icon('default:pin')}</span>`
}
el += '</div>';
// ======== 添加 ========
// tags
if (post.tags && post.tags.length > 0) {
    el += '<span class="meta tags">';
    el += post.tags.map(tag => `<span class="tag breadcrumb" ${category_color(tag.name)}>#${tag.name}</span>`).join("");
    el += '</span>';
}
// =====================
el += '</article>';
```

在 `source/css/_components/list.styl` 中添加样式

```stylus
// card
.post-list .post-card
  // ...

  span.meta.tags
    display: block
    line-height: 1
    margin: 0.5rem 0

    .tag
      --theme-block: var(--block)
      background: var(--theme-block)
      padding: 2px 4px
      border-radius: 5px

      &, span
        font-size: $fs-13

    .tag + .tag
      margin-left: 4px
```

## 自定义样式目录

主题中自定义样式定义在 `source/css/_custom.styl` 中，为了扩展不同的自定义样式，用 `_custom` 目录存放自定义样式

在 `css` 目录下创建一个 `_custom` 目录，将原先的 `_custom.styl` 移动到该目录中，并重命名为 `custom.styl`，同时修改 `main.styl`

```stylus
@import '_custom'
```

修改为

```stylus
@import '_custom/custom'
```

## 添加加载条

使用 [pace](https://github.com/CodeByZach/pace) 库实现加载条，将样式文件放在 `_custom` 目录中，在 `main.styl` 中引入

```stylus
@import '_custom/pace-theme-flash'
```
