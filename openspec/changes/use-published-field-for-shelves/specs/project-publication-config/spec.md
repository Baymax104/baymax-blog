## ADDED Requirements

### Requirement: Project publication is configured per project

The system SHALL use each wiki or topic project's own data file as the source of truth for whether that project is listed on public index pages.

#### Scenario: Published topic appears on topic index

- **WHEN** a topic data file under `source/_data/topic/` declares `published: true`
- **THEN** the topic index MUST include that topic if it has matching topic pages

#### Scenario: Unpublished topic is omitted from topic index

- **WHEN** a topic data file omits `published` or declares `published: false`
- **THEN** the topic index MUST NOT include that topic

#### Scenario: Published wiki appears on wiki index

- **WHEN** a wiki data file under `source/_data/wiki/` declares `published: true`
- **THEN** the wiki index MUST include that wiki if it has matching wiki pages

#### Scenario: Unpublished wiki is omitted from wiki index and filters

- **WHEN** a wiki data file omits `published` or declares `published: false`
- **THEN** the wiki index and wiki tag filters MUST NOT include that wiki

### Requirement: Project publication order is local to project data

The system SHALL order published wiki and topic projects by their per-project `sort` values in descending order.

#### Scenario: Topic index preserves migrated order

- **WHEN** multiple published topics declare `sort`
- **THEN** the topic index MUST list them from highest `sort` to lowest `sort`

#### Scenario: Wiki index preserves migrated order

- **WHEN** multiple published wikis declare `sort`
- **THEN** the wiki index MUST list them from highest `sort` to lowest `sort`

### Requirement: Central publication list files are not required

The system SHALL render wiki and topic index pages without reading `source/_data/wikis.yml` or `source/_data/topics.yml`.

#### Scenario: Central list files are absent

- **WHEN** `source/_data/wikis.yml` and `source/_data/topics.yml` do not exist
- **THEN** the build MUST still render wiki and topic indexes from per-project data files
