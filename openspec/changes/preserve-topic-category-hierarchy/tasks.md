## 1. Theme Implementation

- [x] 1.1 Add helper logic to ensure merged category entries have stable `_id` values.
- [x] 1.2 Add helper logic to infer missing `parent` relationships from hierarchical category paths.
- [x] 1.3 Apply category hierarchy hydration in the topic category merge path without changing ordinary category metadata.

## 2. Verification

- [x] 2.1 Run OpenSpec validation for `preserve-topic-category-hierarchy`.
- [x] 2.2 Run the Hexo build and verify topic-only child categories render with child category markup on `/categories/`.
