---
title: Organizing Notes Simply, According to ChatGPT
date: 2026-01-06
categories:
  - Organization
tags:
  - ChatGPT
  - folders-vs-categories-vs-tags
---
## A simple mental model (sticky and calm)

Think in **layers of permanence**:

### 1. **Folders = what a note *is***

These change rarely.
They should feel obvious even if someone else browses your repo.

Examples:

* `people`
* `places`
* `organizations`
* `concepts`
* `projects`
* `sources` (books, papers, articles)

If you ask “*What kind of thing is this note?*” and the answer is stable,
it belongs in a **folder**.

👉 Your instinct here is solid. This already replaces Johnny Decimal cleanly.

---

### 2. **Categories = what subtype it belongs to**

Categories are **one level down in meaning**, but still fairly stable.

Good category traits:

* Usually **1 per note**
* Mutually exclusive *most of the time*
* Useful for navigation pages in Hugo

Examples:

* `places` → category: `country`, `city`, `region`, `landmark`
* `people` → category: `historical`, `fictional`, `biblical`, `contemporary`
* `concepts` → category: `theology`, `ecology`, `writing`, `education`

Your New Zealand example fits perfectly:

```yaml
folder: places
category: country
```

---

### 3. **Tags = descriptive seasoning**

Tags answer: *“What qualities, themes, or associations does this have?”*

They are:

* Many per note
* Non-exclusive
* Allowed to be a little messy

Examples:

* `Polynesian`
* `scenic`
* `movie-set`
* `colonial-history`
* `island-nation`

Tags are for discovery, not structure.
Think butterfly nets, not filing cabinets 🦋

---

## So… folders or subfolders?

Here’s the key rule that usually settles it:

### ❌ Avoid subfolders if they duplicate categories

If you’re tempted to do this:

```bash
places/
  countries/
  cities/
  landmarks/
```

…and you already have Hugo categories, **don’t**. That’s double bookkeeping.

Instead:

```bash
places/
  new-zealand.md   # category: country
  paris.md         # category: city
  machu-picchu.md  # category: landmark
```

Let Hugo handle the slicing.

---

## When subfolders *do* make sense

Use subfolders only when they represent **authoring or lifecycle differences**,
not conceptual ones.

Good uses:

* `sources/books/`
* `sources/papers/`
* `projects/active/` vs `projects/archive/`
* `journal/2026/`

Bad uses:

* Taxonomy you already express with categories or tags

If a subfolder wouldn’t meaningfully change *how you work* in VS Code,
it probably doesn’t belong.

---

## A clean, future-proof setup (example)

```bash
content/
  people/
  places/
  concepts/
  organizations/
  projects/
  sources/
```

Front matter example:

```yaml
title: "New Zealand"
categories: ["country"]
tags: ["polynesian", "scenic", "movie-set"]
```

This:

* Publishes beautifully in Hugo
* Stays readable in raw Markdown
* Doesn’t fight VS Code
* Won’t collapse under scale

---

## Final gut check

Ask this for every organizational decision:

* **Folder:** Would I argue with myself about this in a year?
* **Category:** Would I ever want a page listing all of these?
* **Tag:** Would I enjoy stumbling across this later?

If the answer lines up, you’re golden. ✨
