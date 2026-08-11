## ADDED Requirements

### Requirement: Topic articles appear in recent post lists

The system SHALL treat published topic articles as ordinary post entries when rendering recent post lists, while preserving their source location and topic detail URL.

#### Scenario: Home recent list includes topic article

- **WHEN** a topic article under `source/topic/` has title, date, and `topic` front matter
- **THEN** the home page recent post list MUST include that topic article according to the same date/sticky ordering used for ordinary posts

#### Scenario: Sidebar recent widget includes topic article

- **WHEN** the sidebar recent widget renders in a normal blog context
- **THEN** the widget MUST include eligible topic articles together with ordinary posts ordered by recent update

### Requirement: Topic article list entries preserve topic navigation

The system SHALL render topic articles in ordinary post lists as post-like entries without changing their canonical topic page URL.

#### Scenario: Topic article link remains in topic path

- **WHEN** a topic article appears in a home, category, tag, or recent widget list
- **THEN** its link MUST point to `/topic/<topic>/<article>/` rather than a `/posts/` permalink

#### Scenario: Topic article list title uses topic prefix

- **WHEN** a topic article appears in an ordinary post card list
- **THEN** its list title MUST be formatted as `{topic title}-{article title}`

#### Scenario: Topic detail page title remains unchanged

- **WHEN** the topic article detail page is rendered
- **THEN** the article heading MUST continue to use the original article title without the topic prefix

### Requirement: Topic articles participate in categories

The system SHALL include topic articles in category indexes and category detail pages based on their `categories` front matter.

#### Scenario: Category index counts topic articles

- **WHEN** a topic article declares one or more categories
- **THEN** the `/categories/` index MUST include those categories and count the topic article in the displayed category counts

#### Scenario: Category detail page lists topic articles

- **WHEN** a user opens a category detail page matching a category declared by a topic article
- **THEN** the page MUST list that topic article together with ordinary posts for the same category

### Requirement: Topic articles participate in tags

The system SHALL include topic articles in tag indexes and tag detail pages based on their `tags` front matter.

#### Scenario: Tag index includes topic article tags

- **WHEN** a topic article declares one or more tags
- **THEN** the `/tags/` index MUST include those tags even if no ordinary post uses them

#### Scenario: Tag detail page lists topic articles

- **WHEN** a user opens a tag detail page matching a tag declared by a topic article
- **THEN** the page MUST list that topic article together with ordinary posts for the same tag

### Requirement: Existing non-topic content behavior remains compatible

The system SHALL preserve existing ordinary post, wiki, notebook, and topic detail rendering behavior while adding topic articles to ordinary post discovery surfaces.

#### Scenario: Ordinary posts are unchanged

- **WHEN** ordinary `_posts` articles render in home, category, tag, archive, or recent lists
- **THEN** their paths, titles, categories, tags, ordering, and pagination MUST remain compatible with the previous behavior

#### Scenario: Wiki and notebook pages are unchanged

- **WHEN** wiki or notebook pages render their own lists or sidebars
- **THEN** topic article injection MUST NOT change their existing page collections or navigation behavior
