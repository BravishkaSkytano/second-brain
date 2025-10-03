---
title: Fleeting Notes
created: 2024-07-26 00:00
modified: 2025-08-09 21:20
tags:
  - type/structure
  - structure/about
  - target/starterkit
view-count: 4
weight: 1
---

[[Fleeting Notes/index|Fleeting Notes]] | [[Literature Notes/index|Literature Notes]] | [[Permanent Notes/index|Permanent Notes]] | [[Project Notes/index|Project Notes]] | [[Structure Notes/index|Structure Notes]]

> [!info] Definition
> **Fleeting Notes** are quick thoughts or ideas, temporary and unstructured. They capture raw ideas before they are lost. Use them for jotting down spontaneous insights, brainstorming, or initial reflections.

> [!warning] Simple rules
> - Capture ideas that op into mind.

%%

```dataview
TABLE WITHOUT ID 
	file.link as "Fleeting Notes", 
	(date(today) - created).day as "Days alive" 
FROM "Fleeting Notes"
WHERE file.name != "index"
SORT created asc 
```

%%
