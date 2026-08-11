## MODIFIED Requirements

### Requirement: Topic articles participate in categories

The system SHALL include topic articles in category indexes and category detail pages based on their `categories` front matter, while preserving Hexo-compatible category hierarchy metadata.

#### Scenario: Category index counts topic articles

- **WHEN** a topic article declares one or more categories
- **THEN** the `/categories/` index MUST include those categories and count the topic article in the displayed category counts

#### Scenario: Category detail page lists topic articles

- **WHEN** a user opens a category detail page matching a category declared by a topic article
- **THEN** the page MUST list that topic article together with ordinary posts for the same category

#### Scenario: Topic child category renders as child entry

- **WHEN** a topic article declares hierarchical categories such as `[一级分类, 二级分类]`
- **THEN** the `/categories/` index MUST render the second-level category with child category metadata rather than as a top-level category

#### Scenario: Topic-only child category links remain hierarchical

- **WHEN** a child category is created only by topic articles
- **THEN** its category index link MUST keep the hierarchical category path for the declared category chain
