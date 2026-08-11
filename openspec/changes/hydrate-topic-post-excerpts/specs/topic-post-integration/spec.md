## ADDED Requirements

### Requirement: Topic article post cards render excerpts

The system SHALL provide rendered excerpt source data for topic articles when they appear as ordinary post entries on discovery surfaces.

#### Scenario: Home post card auto-generates topic excerpt

- **WHEN** a published topic article has rendered content and no explicit `excerpt` or `description`
- **THEN** its home page post card MUST render an auto-generated excerpt using the same theme rule as ordinary posts

#### Scenario: Explicit topic excerpt metadata remains preferred

- **WHEN** a topic article provides `excerpt` or `description`
- **THEN** its post card MUST prefer that explicit metadata before falling back to rendered content

#### Scenario: Sidebar recent uses the hydrated topic post collection

- **WHEN** the sidebar recent widget combines ordinary posts and topic virtual posts
- **THEN** the topic virtual post entries MUST be the same hydrated entries used by post list generation
