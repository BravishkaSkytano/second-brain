---
weight: 9
aliases:
  - unsorted notes
view-count: 3
created: 2025-08-07 16:05
modified: 2025-08-07 22:35
---

[[Fleeting Notes/index|Fleeting Notes]] | [[Literature Notes/index|Literature Notes]] | [[Permanent Notes/index|Permanent Notes]] | [[Project Notes/index|Project Notes]] | [[Structure Notes/index|Structure Notes]]

> [!info] Definition
> `= this.lead`

> [!warning] Simple rules
> - Capture ideas that op into mind.

%%

```dataview
TABLE WITHOUT ID 
	file.link as "Unsorted Notes", 
	(date(today) - created).day as "Days alive" 
FROM "Unsorted"
WHERE file.name != "index"
SORT created asc 
```

%%
