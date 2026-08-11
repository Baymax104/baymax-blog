## 1. Theme Logic

- [x] 1.1 Derive `theme.topic.publish_list` from published topic project data sorted by descending `sort`.
- [x] 1.2 Derive `theme.wiki.shelf` from published wiki project data sorted by descending `sort`.
- [x] 1.3 Ensure missing `published` values are treated as unpublished.

## 2. Data Migration

- [x] 2.1 Add `published` and `sort` fields to existing topic project data files.
- [x] 2.2 Add `published` and `sort` fields to existing wiki project data files.
- [x] 2.3 Delete `source/_data/topics.yml` and `source/_data/wikis.yml`.

## 3. Documentation

- [x] 3.1 Update project guidance that describes wiki/topic data entry points.

## 4. Verification

- [x] 4.1 Run OpenSpec validation for `use-published-field-for-shelves`.
- [x] 4.2 Run the Hexo build and verify topic/wiki indexes still render from per-project data.
