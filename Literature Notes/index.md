---
title: Literature Notes
created: 2025-08-07 00:00
modified: 2025-08-10 22:32
weight: 2
view-count: 5
---

[[Fleeting Notes/index|Fleeting Notes]] | [[Literature Notes/index|Literature Notes]] | [[Permanent Notes/index|Permanent Notes]] | [[Project Notes/index|Project Notes]] | [[Structure Notes/index|Structure Notes]]

> [!info] Definition
> Literature, or reference, notes contain your thoughts on the various kinds of media and references that you consume, e.g. books, YouTube videos, podcasts, news articles, etc.

> [!warning] Simple rules
> - 

%%

```dataview
TABLE WITHOUT ID 
	file.link as "Literature Notes", 
	(date(today) - dateformat(date(created),"yyyy-MM-dd")).day as "Days alive",
	(dateformat(date(created),"yyyy-MM-dd") - date(now)) as "Days"
FROM "Literature Notes"
WHERE file.name != "index"
SORT created asc 
```

%%
