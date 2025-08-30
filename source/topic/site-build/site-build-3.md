---
title: 自定义配置
categories: [博客开发]
tags: [Hexo, Stellar主题]
date: 2025-08-30 12:22
updated: 2025-08-30 12:22
topic: site-build
---

自定义配置可在 `_config.stellar.yml` 或主题目录中的 `_config.yml` 设置，本博客统一在主题目录中的 `_config.yml` 设置

## 注入外部脚本

可在 `_config.yml` 中添加 `inject` 属性，注入外部脚本或 meta 信息

- head: 注入到 head 标签之后
- script: 注入到 body 标签之后

```yaml
inject:
  head:
    - <meta name="msapplication-TileColor" content="#2d89ef">
    - <meta name="msapplication-config" content="https://gcore.jsdelivr.net/gh/cdn-x/xaoxuu@main/favicon/browserconfig.xml">
    - <meta name="theme-color" content="#ffffff">
  script:
    - <script async src="https://gcore.jsdelivr.net/npm/jquery@3.5/dist/jquery.min.js"></script>
```

## 添加 Vercel 服务

添加 Vercel 提供的 Web Analytics 和 Speed Insights，参考 [Getting started with Vercel Web Analytics](https://vercel.com/docs/analytics/quickstart?framework=html)，在 `_config.yml` 中的 `inject` 属性中添加以下代码

```yaml
inject:
  head:
    - ...
  script:
    - |
      <script>
      window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };
      window.si = window.si || function () { (window.siq = window.siq || []).push(arguments); };
      </script>
    - <script defer src="/_vercel/insights/script.js"></script>
    - <script defer src="/_vercel/speed-insights/script.js"></script>
```

## 添加 Google 收录

首先在 Google Search Console 中注册账号，并将博客的域名添加到账号资源中，最后将 HTML 标记注入到博客中

在 `inject` 属性的 `head` 中添加以下代码

```yaml
inject:
  head:
    - <meta name="google-site-verification" content="<key>" />
```

## 添加 Bing 收录

与 Google 同理，在 Bing Webmaster Tools 中注册账号，在博客中注入 HTML 标记

```yaml
inject:
  head:
    - <meta name="google-site-verification" content="<key>" />
    - <meta name="msvalidate.01" content="<key>" />
```

## 添加 FontAwesome 支持

Stellar 主题默认不支持 Font Awesome 图标，可以在配置文件的 `plugins` 属性中添加

```yaml
fontawesome:
  enable: true
  inject: <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">
```

## 自定义组件

本博客的自定义组件定义在主题目录中的 `_data/widgets.yml` 文件中，自定义组件的使用参考 [侧边栏组件的配置与使用](https://xaoxuu.com/wiki/stellar/widgets/)

### 欢迎卡片

用 markdown 组件实现欢迎卡片

```yaml
welcome:
  layout: markdown
  title: 🎉欢迎🎉
  content: |
    <div style="margin-bottom: 5px;">Hi，欢迎来到我的博客👋</div>
    <!-- IP签名档 -->
    <img src="https://api.szfx.top/info-card/">
```

### 访问统计卡片

通过 [不蒜子](https://www.busuanzi.cc/) 实现访问量统计

```yaml
info-card:
  layout: markdown
  content: |
    <!-- 访问量统计 -->
    <script src="//api.busuanzi.cc/static/3.6.9/busuanzi.min.js" defer></script>
    <div style="text-align: center;">
    <span style="display: block;margin: 5px 0 3px;">
    📈总访问 <span id="busuanzi_site_pv" style="font-weight: bold;">0</span> 次📈
    </span>
    <span style="display: block;margin: 3px 0;">
    📊总访客 <span id="busuanzi_site_uv" style="font-weight: bold;">0</span> 人📊
    </span>
    <span id="runtime_span" style="display: block;margin: 3px 0;"></span>

    <!-- 计算上线时间 -->
    <script type="text/javascript">
    document.addEventListener('DOMContentLoaded', function() {
      const runtime_span = document.getElementById('runtime_span');
    
      const days = 24 * 60 * 60 * 1000;
      const years = days * 365;
    
      const t1 = new Date(2025, 7, 12, 0, 0, 0);
      const t2 = new Date();
      const diff = t2 - t1;
    
      const diffYears = Math.floor(diff / years);
      const diffDays = Math.floor((diff % years) / days);
    
      runtime_span.innerText = "🕘已营业 " + diffYears + " 年 " + diffDays + " 天🕘";
    });
    </script>
    
    </div>
    <hr style="border: 1px solid black; background-color: black;">
    <div style="margin-bottom: 5px;">
    本博客所有文章除特别声明外，均采用 <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/">CC BY-NC-SA 4.0</a> 许可协议，转载请注明出处。
    </div>

```

### Memos 组件

本博客的 Memos 部署在 [ClawCloud](https://run.claw.cloud/) 上，配置好自定义域名后，通过 Memos API 实时获取推文

```yaml
memos:
  layout: timeline
  title: 💬近期说说💬
  api: https://memos.baymaxam.top/api/v1/memos?limit=10&visibility=public
  type: memos
  hide: user
```

> 调用 Memos 的获取推文 API 不需要访问令牌授权，添加、删除、更新推文的 API 需要访问令牌授权
