## Context

The theme currently builds wiki and topic index lists from central data files:

- `source/_data/wikis.yml` becomes `theme.wiki.shelf`.
- `source/_data/topics.yml` becomes `theme.topic.publish_list`.

Each wiki or topic also has its own configuration file under `source/_data/wiki/` or `source/_data/topic/`. The central list files duplicate publication state and ordering outside those project files. `source/_data/wiki/linux.yml` is a concrete existing unpublished project: it has project config but is absent from `wikis.yml`.

## Goals / Non-Goals

**Goals:**

- Use `published: true` in each project data file as the only source of truth for whether a wiki or topic is listed.
- Treat missing `published` as not listed.
- Preserve current index order through per-project `sort` values.
- Delete `wikis.yml` and `topics.yml`.
- Keep existing internal `theme.wiki.shelf` and `theme.topic.publish_list` arrays so templates need minimal changes.

**Non-Goals:**

- Change wiki or topic page URLs.
- Change the `wiki` or `topic` front matter used by Markdown pages.
- Change how wiki/topic trees are built from project data.
- Change article content or image assets.

## Decisions

- Use `published: true` instead of a negative or ambiguous flag.
  - Rationale: the requested field is explicit, and missing fields should not accidentally publish existing draft projects.

- Derive shelf arrays from project objects after sorting.
  - Rationale: project objects already carry all configuration. Computing `wiki.shelf` and `topic.publish_list` from `tree` keeps downstream templates stable.

- Preserve ordering with descending `sort`.
  - Rationale: wiki data already defaults `sort` to `0` and sorts descending internally. Applying the same model to topic keeps behavior consistent.

- Remove fallback reads of `data.wikis` and `data.topics`.
  - Rationale: the change intentionally deletes those files; leaving fallback logic would keep an obsolete source of truth alive.

## Risks / Trade-offs

- Missing `published` means a project will not appear on the index page. Mitigation: migration adds explicit `published` values to all existing project data files.
- Existing documentation mentions the central list files. Mitigation: update project docs and agent guidance in this change.
- Sort values are now distributed across files. Mitigation: use clear numeric spacing so future insertions do not require renumbering every project.
