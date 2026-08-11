## Why

Topic articles now participate in home, category, tag, and recent post lists, but their cards can render without excerpts. They are intended to behave like ordinary posts on discovery surfaces, so their rendered content must also be available to the existing excerpt pipeline.

## What Changes

- Hydrate virtual topic post entries with rendered page content before they are used by post lists and sidebar recent widgets.
- Preserve the existing excerpt priority used by the theme: `excerpt` → `description` → auto excerpt from `content`.
- Do not require topic Markdown files to add manual `excerpt` or `description` front matter.
- Preserve topic article canonical links, prefixed list titles, categories, tags, and ordering behavior.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `topic-post-integration`: Topic articles shown as ordinary post entries must have enough rendered content metadata for normal excerpt rendering.

## Impact

- Affected code: `themes/stellar/scripts/events/lib/topic_tree.js`.
- Affected rendering surfaces: home post list, sidebar recent widget, category/tag lists that reuse post card rendering.
- No new dependencies and no article Markdown changes.
