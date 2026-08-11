## Context

Topic articles are merged into ordinary category collections by `themes/stellar/scripts/events/lib/topic_tree.js`. The current normalizer expands `categories: [人工智能, 机器学习]` into hierarchical paths, but topic-only category objects do not include Hexo's `parent` metadata.

The Stellar category index template renders child categories by checking `category.parent`. Ordinary `_posts` categories get this field from Hexo's Category model, while topic-only virtual categories currently have only `name`, `slug`, `path`, `posts`, and `length`.

## Goals / Non-Goals

**Goals:**

- Preserve category parent relationships for topic article categories.
- Make topic-only child categories render as child entries on `/categories/`.
- Keep category detail pages, category counts, and post-card category breadcrumbs compatible with existing behavior.
- Avoid modifying article Markdown files.

**Non-Goals:**

- Redesign the category index template.
- Change how ordinary `_posts` categories are modeled by Hexo.
- Change topic article taxonomy front matter conventions.
- Add dependencies.

## Decisions

- Add stable virtual category IDs based on category paths.
  - Rationale: topic-only categories are not backed by Hexo Category documents, so they need a stable identifier that other virtual category entries can reference as `parent`.
  - Alternative considered: insert virtual categories into Hexo's Category model. That would be more invasive and would require synchronizing PostCategory references.

- Infer missing `parent` metadata from category path ancestry after merging category groups.
  - Rationale: existing normalized paths already encode the hierarchy and match Hexo category URLs. A post-processing pass can preserve ordinary category objects and only fill missing metadata.
  - Alternative considered: make `expandCategoryHierarchies()` assign parent IDs immediately. That function only sees one post's front matter and does not know whether a parent category already exists in `locals.categories`.

- Preserve existing ordinary category metadata when available.
  - Rationale: Hexo-backed categories already expose correct `_id`, `parent`, virtual path, post references, and sorting behavior. The implementation should only complete missing fields for virtual topic categories.

## Risks / Trade-offs

- Path-derived IDs are not Hexo CUIDs. Mitigation: they are only used inside merged virtual collections for rendering and parent lookup, not persisted into Hexo models.
- A category path could be generated without its parent category in the merged collection. Mitigation: `expandCategoryHierarchies()` already emits every ancestor for topic categories, and ordinary categories include ancestors through Hexo.
- Category names may repeat under different parents. Mitigation: parent inference uses category paths instead of names.
