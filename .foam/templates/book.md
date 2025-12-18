<%"---"%>
date: <% tp.date.now("YYYY-MM-DD") %>
created: <% tp.date.now("YYYY-MM-DD HH:mm") %>
modified:
book_title: "{{title}}"
authors: [<%=book.authors.map(author => `"[[${author}]]"`).join(', ')%>]
publisher: {{publisher}}
published: <%= book.publishDate.substring(0, 4) %>
pages: {{totalPage}}
isbn10: {{isbn10}}
isbn13: {{isbn13}}
cover: {{coverUrl}}
status: unread
tags:
  - book
categories: [<%=book.categories.map(category => `"[[${category}]]"`).join(', ')%>]
aliases:
  - {{title}}
  - {{title}} by {{author}}
<%"---"%>

![cover|150]({{coverUrl}})

{{description}}

## Notes

## Quotes

