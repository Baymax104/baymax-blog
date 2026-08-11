## 1. Theme Implementation

- [x] 1.1 Add hydration logic that maps rendered topic pages from generator locals to existing virtual topic posts.
- [x] 1.2 Update merged locals generation to use hydrated virtual topic posts and refresh `theme.topic.virtual_posts`.

## 2. Verification

- [x] 2.1 Run OpenSpec validation for `hydrate-topic-post-excerpts`.
- [x] 2.2 Run the Hexo build and verify topic post cards render non-empty excerpts on the generated home page.
