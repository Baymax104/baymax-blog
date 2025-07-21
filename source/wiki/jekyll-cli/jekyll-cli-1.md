---
title: 改造Jekyll博客
categories: [开发相关]
tags: [Jekyll, CLI, Typer]
date: 2025-07-21 19:31
updated: 2025-07-21 19:34
repo: baymax104/jekyll-cli
wiki: jekyll-cli
---
`jekyll-cli` 的 item 模式使用一个目录来管理文章，这个目录作为一个 item，目录结构如下

```
/_posts/xxx
├──assets
└──xxx.md
```

直接在 `_posts` 目录或 `_drafts` 目录中创建 item 目录，在 Jekyll 生成博客时会出现两个问题

1. `_site` 目录中不存在 item 目录中的 assets 目录

    Jekyll 对每一篇文章生成一个同名的目录，其中包含一个 `index.html`，这个 `index.html` 就是生成的文章，但该目录中没有包含 assets 目录，导致文章中的引用的图片资源不存在

2. 生成的文章中的 `img` 标签链接错误

    Jekyll 生成文章时，文章中的图片链接是以生成的目标目录（一般为 `_site`）为根路径，而使用 item 目录管理时，文章中使用的图片链接一般是相对于当前 item 目录的相对路径，因此生成的文章中的图片链接错误

为了解决这两个问题，我使用 Jekyll 的 hook 函数在站点生成时进行调整，将 hook 函数作为插件添加到 Jekyll 博客中

- `assets-include-hook.rb`：将 assets 目录复制到 `_site` 中

    ```ruby
    # 在整个站点写入完成后调用
    Jekyll::Hooks.register :site, :post_write do |site|
    
        site.posts.docs.each do |post|
            
            # post.path为文章在_posts下的绝对路径
            # e.g. my-blog/_posts/my-post/2024-10-09-my-post.md
            src_dir = File.join(File.dirname(post.path), 'assets')
            
            # site.dest为站点目标目录的绝对路径，e.g. my-blog/_site
            # post.id为文章的标识符，e.g. /posts/my-post
            dest_dir = File.join(site.dest, post.id, 'assets')
            
            if Dir.exist?(src_dir)
                # 创建dest_dir目录
	            FileUtils.mkdir_p(dest_dir)
	            
	            # 将src_dir下的所有文件复制到dest_dir中
	            Dir.glob(File.join(src_dir, '*')).each do |img|
	                next unless File.file?(img)
	                FileUtils.cp(img, dest_dir)
	            end
	        end
	    end
	end
	```

- `relative-path-hook.rb`：调整文章中的图片链接为目标目录的相对路径

    ```ruby
    # 在渲染post之前调用
    Jekyll::Hooks.register :posts, :pre_render do |post|
    
        # 处理相对路径
        # 将doc_path与relative_path拼接，若relative_path以'./'开头，则去除后拼接
        def resolve_relative_path(doc_path, relative_path)
            if relative_path.start_with?('./')
                File.join(doc_path, relative_path[2..-1])
            else
                File.join(doc_path, relative_path)
            end
        end
    
        # 调整文章中markdown格式的图片链接
        post.content = post.content.gsub(/!\[([^\]]*)\]\(([^)]+)\)/) do |match|
            alt_text = $1
            # path是对于item的相对路径
            path = $2
    
            # 跳过绝对路径
            # path可能为'./assets/...'或'assets/...'
            next match if path.start_with?('http', '/')
    
            # 将对于item的相对路径调整为对于_site的相对路径
            # e.g. './assets/...' -> '/posts/my-post/assets/...'
            doc_path = post.id
            new_path = resolve_relative_path(doc_path, path)
            "![#{alt_text}](#{new_path})"
        end
    
        # 调整文章中的img标签的图片链接
        post.content = post.content.gsub(/<img\s+[^>]*src=["']([^"']+)["']/) do |match|
            src = $1
    
            # skip absolute path
            next match if src.start_with?('http', '/')
    
            doc_path = post.id
            new_src = resolve_relative_path(doc_path, src)
            match.gsub(src, new_src)
        end
    end
    ```

将以上两个 `.rb` 文件放在 `_plugins` 目录下，就可以使用 `jekyll-cli` 的 item 模式管理博客了
