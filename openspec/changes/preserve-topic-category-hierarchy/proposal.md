## Why

Topic articles with multi-part `categories` front matter are included in category pages, but virtual category entries created only from topic articles do not carry Hexo-compatible parent metadata. As a result, the category index can display second-level categories as top-level categories even though their paths are hierarchical.

## What Changes

- Preserve category hierarchy metadata when topic articles are merged into category collections.
- Ensure virtual topic-only child categories expose a stable `_id` and `parent` relationship compatible with the existing category index template.
- Keep category paths, counts, category detail pages, and ordinary post category behavior unchanged.
- Do not modify article Markdown or front matter.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `topic-post-integration`: Topic article categories must preserve hierarchy metadata when rendered in category indexes and detail pages.

## Impact

- Affected code: `themes/stellar/scripts/events/lib/topic_tree.js`.
- Affected output: `/categories/` index and topic-only category entries.
- No new dependencies and no content-file changes.
