## Context

Topic articles under `source/topic/` are copied into `theme.topic.virtual_posts` during the theme's `generateBefore` event so they can be merged into ordinary post discovery surfaces. Hexo renders Page `content` later in the `before_generate` filter pipeline, so the early virtual post copies may not contain rendered `content`, `excerpt`, or related fields.

The post card template already has the desired excerpt behavior: it prefers explicit `excerpt`, then `description`, then auto-generates an excerpt from `content`. The missing piece is making rendered page content available on the virtual topic post entries before generators and widgets consume them.

## Goals / Non-Goals

**Goals:**

- Ensure topic virtual posts expose rendered content metadata for normal post-card excerpt rendering.
- Keep topic articles in home lists, sidebar recent, categories, and tags using the same virtual post objects.
- Avoid changes to topic Markdown files and avoid Markdown parsing in the theme script.
- Preserve existing topic article links, prefixed list titles, taxonomy normalization, and ordering.

**Non-Goals:**

- Redesign post card excerpt rules.
- Add manual excerpts to existing topic articles.
- Change ordinary post, wiki, or notebook behavior.
- Introduce new dependencies.

## Decisions

- Hydrate virtual posts from rendered `locals.pages` inside `getMergedLocals`.
  - Rationale: Hexo generator locals are available after the render filters, so they contain the rendered page fields needed by the existing card template.
  - Alternative considered: parse `_content` manually when creating virtual posts. This would duplicate Markdown/front-matter behavior and risk inconsistent excerpts.

- Update `ctx.theme.config.topic.virtual_posts` with the hydrated entries.
  - Rationale: sidebar recent reads `theme.topic.virtual_posts` directly, while index/category/tag generators receive merged locals. Updating the shared array keeps all discovery surfaces aligned.
  - Alternative considered: hydrate only the temporary `topicPosts` passed into merged locals. That would fix post cards in generator output but leave widgets dependent on stale data.

- Preserve existing virtual post identity fields while copying rendered content fields.
  - Rationale: the existing code already owns title prefixing, canonical topic links, normalized taxonomies, and popular-post cache shape. Hydration should only fill rendering metadata.

## Risks / Trade-offs

- Hydration depends on matching rendered pages to virtual posts by `_id` or path. Mitigation: use both `_id` and path keys, matching the existing source lookup strategy.
- `getMergedLocals` may be called more than once. Mitigation: hydration is idempotent and returns new post objects before replacing `theme.topic.virtual_posts`.
- If a topic page has no rendered content and no explicit excerpt/description, the card will still be empty. Mitigation: this matches ordinary post fallback behavior when no content is available.
