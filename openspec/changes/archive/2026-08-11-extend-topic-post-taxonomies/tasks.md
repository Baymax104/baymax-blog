## 1. Topic Virtual Post Data

- [x] 1.1 Audit the current `topic_tree.js` virtual post construction and identify every field required by post cards, taxonomy pages, recent widget, and related-post helpers.
- [x] 1.2 Extract a reusable topic virtual post builder that returns stable post-like entries with normalized `tags`, normalized `categories`, prefixed list title, original topic path link, and related-post cache metadata.
- [x] 1.3 Store or expose the built topic virtual posts in a single theme-local location so homepage, taxonomy generators, and recent widget can consume the same entries.

## 2. Homepage And Recent Widget

- [x] 2.1 Keep the existing homepage index generator behavior, but update it to use the shared topic virtual post builder.
- [x] 2.2 Update the ordinary blog-context `recent` widget to merge ordinary posts with shared topic virtual posts and sort by `updated` descending.
- [x] 2.3 Verify wiki and notebook recent widget branches still use their existing page collections and are not polluted by topic posts.

## 3. Category Integration

- [x] 3.1 Implement category grouping for topic virtual posts from their `categories` front matter, including hierarchical category arrays when present.
- [x] 3.2 Ensure `/categories/` index counts include topic virtual posts.
- [x] 3.3 Ensure category detail pages paginate and render matching topic virtual posts together with ordinary posts.
- [x] 3.4 Verify topic article links in category pages remain `/topic/<topic>/<article>/`.

## 4. Tag Integration

- [x] 4.1 Implement tag grouping for topic virtual posts from their normalized `tags` front matter.
- [x] 4.2 Ensure `/tags/` index includes tags used only by topic articles.
- [x] 4.3 Ensure tag detail pages paginate and render matching topic virtual posts together with ordinary posts.
- [x] 4.4 Verify topic article links in tag pages remain `/topic/<topic>/<article>/`.

## 5. Validation

- [x] 5.1 Run `yarn build`.
- [x] 5.2 Inspect generated home pages for expected topic article ordering and prefixed list titles.
- [x] 5.3 Inspect generated sidebar recent HTML to confirm topic articles appear in ordinary blog context.
- [x] 5.4 Inspect generated category index/detail pages for topic counts and topic article entries.
- [x] 5.5 Inspect generated tag index/detail pages for topic-only tags and topic article entries.
- [x] 5.6 Inspect at least one topic detail page to confirm its heading, topic sidebar, and URL remain unchanged.
