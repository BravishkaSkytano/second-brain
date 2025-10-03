---
title: Permanent Notes
created: 2025-08-07 00:00
modified: 2025-08-09 21:21
weight: 3
view-count: 5
---

[[Fleeting Notes/index|Fleeting Notes]] | [[Literature Notes/index|Literature Notes]] | [[Permanent Notes/index|Permanent Notes]] | [[Project Notes/index|Project Notes]] | [[Structure Notes/index|Structure Notes]]

> [!info] Definition

> [!warning] Simple rules
> - 

%%

```dataview
TABLE WITHOUT ID 
	file.link as "Permanent Notes", 
	(date(today) - created).day as "Days alive" 
FROM "Permanent Notes"
WHERE file.name != "index"
SORT created asc 
```

%%
