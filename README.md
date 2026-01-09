# Second Brain – Content Organization Guide

This repository is a Second Brain managed in VS Code and published with Hugo.
Its structure is intentionally simple, stable, and resistant to over-tinkering.

## Core Principle

Folders define what a note *is*.  
Categories define its primary type.  
Tags describe qualities, themes, and connections.

If a note feels hard to place, the note is complex, not the system.

---

## Canonical Folder List

These top-level folders are considered canonical and should rarely change.

- `people/` – Individual beings with identity (real, biblical, or fictional)
- `places/` – Physical or imagined locations
- `concepts/` – Abstract ideas, frameworks, and theories
- `organizations/` – Structured groups and institutions
- `projects/` – Time-bound or outcome-oriented work
- `sources/` – Books, articles, papers, and other reference material

Do not create new top-level folders without sustained pressure from real usage.

---

## Categories

Categories represent a note’s primary subtype.
They are usually singular and relatively stable.

Examples:
- `places` → country, city, region, landmark, fictional-world
- `people` → biblical, historical, fictional, author
- `concepts` → theology, education, ecology, writing
- `sources` → book, paper, article, video

Categories are used for Hugo list pages and navigation.

---

## Tags

Tags are descriptive, non-exclusive, and flexible.
They capture themes, associations, and secondary attributes.

Examples:
- polynesian
- scenic
- theology
- worldbuilding
- leadership

Tags are for discovery and cross-linking, not structure.

---

## Subfolders

Subfolders are avoided unless they reflect workflow or lifecycle differences.
Approved uses include:

- `projects/active/` and `projects/archive/`
- `journal/YYYY/`

Do not duplicate category logic with subfolders.

---

## Decision Rule

When creating a new note (`hugo new --kind TYPE notes/TYPE/note`):
1. Choose the folder by asking “What kind of thing is this?”
2. Assign one category that best fits
3. Add tags only if they help future discovery

This system favors clarity, longevity, and ease of use over perfect classification.

## To-Do

- [ ] Add 'people' taxomony
- [ ] Add 'books' taxomony
- [ ] Add 'movies' taxomony
- [ ] Add 'shows' taxomony
