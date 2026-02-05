# The Living Index

## To-Do

- [ ] Add site search
- [ ] Add 'people' taxomony
- [ ] Add 'books' taxomony
- [ ] Add 'movies' taxomony
- [ ] Add 'shows' taxomony

## Colors

### Dark mode (default garden at dusk)

| Role      | Color     | Purpose         |
| --------- | --------- | --------------- |
| bg        | `#1f2d24` | page background |
| surface   | `#f4f1ec` | note cards      |
| fg        | `#2a2a2a` | main text       |
| muted     | `#6b6b5f` | metadata        |
| primary   | `#4f7c5b` | links, headings |
| secondary | `#b08a4f` | hover, UI       |
| accent    | `#8b3f2f` | rare emphasis   |

### Light mode (overcast afternoon)

| Role      | New Mapping |
| --------- | ----------- |
| bg        | `#f4f1ec`   |
| surface   | `#ffffff`   |
| fg        | `#2a2a2a`   |
| muted     | `#6b6b5f`   |
| primary   | `#4f7c5b`   |
| secondary | `#8b3f2f`   |
| accent    | `#b08a4f`   |

## Seasons

### 🌸 Spring – emergence

**Feeling:** fresh, hopeful, sketchbook

- Background: light parchment or soft green wash
- Accent: fresh leaf green
- Effect: none or tiny floating pollen dots
- Copy tone: “notes sprouting”

Use when you’re actively adding new ideas.

```css
.season-spring {
  --bg: #f2f7f1;        /* pale green parchment */
  --surface: #ffffff;  /* clean paper */
  --fg: #2a2a2a;
  --muted: #6f7f73;

  --primary: #5a8f6b;   /* young leaf */
  --secondary: #d4a373; /* soft sunlight */
  --accent: #c97c5d;    /* budding warmth */
}
```

### 🍃 Summer – growth

**Feeling:** lush, steady, confident

- Background: warm cream or pale moss
- Accent: deep green
- Effect: disabled
- Highest readability

This is your “default working season.”

```css
.season-summer {
  --bg: #eef3ea;        /* warm cream-green */
  --surface: #ffffff;
  --fg: #2a2a2a;
  --muted: #5f6f64;

  --primary: #3f6f55;   /* deep healthy green */
  --secondary: #8fb996; /* soft foliage */
  --accent: #b08968;    /* warm earth */
}
```

### 🍂 Autumn – reflection (your favorite)

**Feeling:** calm, nostalgic, thoughtful

- Background: forest dusk
- Accent: gold + rust
- Effect: falling leaves (very subtle)
- Best for essays, synthesis, long notes

This becomes the soul of your site.

```css
.season-autumn {
  --bg: #1f2d24;        /* forest dusk */
  --surface: #f4f1ec;   /* parchment */
  --fg: #2a2a2a;
  --muted: #6b6b5f;

  --primary: #4f7c5b;   /* moss */
  --secondary: #b08a4f; /* gold */
  --accent: #8b3f2f;    /* fallen leaf */
}
```

### ❄️ Winter – dormancy

**Feeling:** quiet, minimal, archival

- Background: cool gray or blue dusk
- Accent: muted silver
- Effect: none
- Fewer UI elements visible

Perfect for “I’m not adding much, just maintaining.”

```css
.season-winter {
  --bg: #1b1f26;        /* cold dusk */
  --surface: #e9ecef;   /* pale frost paper */
  --fg: #23262b;
  --muted: #7a8088;

  --primary: #5c6f82;   /* steel blue */
  --secondary: #9aa3ad; /* silver */
  --accent: #6b7280;    /* ash */
}
```
