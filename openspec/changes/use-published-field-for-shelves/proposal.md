## Why

Wiki and topic publication currently depend on central `wikis.yml` and `topics.yml` lists, which splits each project's lifecycle state away from its own configuration file. Moving the publication flag into `wiki/<id>.yml` and `topic/<id>.yml` makes each project self-contained and removes duplicate listing files.

## What Changes

- Add `published` as the per-project publication flag for wiki and topic data files.
- Derive `theme.wiki.shelf` and `theme.topic.publish_list` from project data files instead of `wikis.yml` and `topics.yml`.
- Preserve current display ordering by adding or using per-project `sort` values.
- Delete `source/_data/wikis.yml` and `source/_data/topics.yml`.
- Update project documentation that describes wiki/topic data entry points.

## Capabilities

### New Capabilities

- `project-publication-config`: Wiki and topic project listing is controlled by each project's own data file.

### Modified Capabilities

None.

## Impact

- Affected theme code: `themes/stellar/scripts/events/lib/wiki_tree.js`, `themes/stellar/scripts/events/lib/topic_tree.js`.
- Affected data files: `source/_data/wiki/*.yml`, `source/_data/topic/*.yml`, removal of `source/_data/wikis.yml` and `source/_data/topics.yml`.
- Affected documentation: project docs and agent guidance that mention the central list files.
