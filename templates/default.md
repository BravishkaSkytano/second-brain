<%*
let title = tp.file.title
if (title.startsWith("Untitled")) {
title = await tp.system.prompt("Title");
}
await tp.file.rename(title)
-%>
<%"---"%>
title: <% title %>
description: 
date: <% tp.file.creation_date("YYYY-MM-DDTHH:mm:ss") %>
lastmod: 
banner: 
tags:
categories:
  - seedling
<%"---"%>
