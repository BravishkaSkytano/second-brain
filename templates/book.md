
<%"---"%>
title: {{title}} by {{author}}
date: <% tp.file.creation_date("YYYY-MM-DDTHH:mm:ss") %>
lastmod: 
banner:
categories:
  - seedling
  - book
tags: 
<%"---"%>

![cover|150]({{coverUrl}})

## Synopsis

{{description}}

---

title:: {{title}}
author:: {{author}}
series:: 
seriesnumber:: 
rating:: 
publisher:: {{publisher}}
publish:: {{publishDate}}
pages:: {{totalPage}}
isbn:: {{isbn13}}
cover:: <%=book.coverUrl ? `https://books.google.com/books/publisher/content/images/frontcover/${[...book.coverUrl.split("&")[0].matchAll(/id.?(.*)/g)][0][1]}?fife=w600-h900&source=gbs_api` : ''%>
readdates::
- started:: 
  finished:: 
