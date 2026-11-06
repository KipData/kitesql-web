# KiteSQL Website

Static blog for [KiteSQL](https://github.com/KipData/KiteSQL). Plain HTML and CSS, no build step to deploy: every push to `main` uploads the repository as-is to GitHub Pages.

```
index.html          Blogs
blog/<slug>.html    one page per post (and per translation)
posts/*.md          Markdown sources
assets/             stylesheet, syntax highlighting, logo
tools/build.py      renders posts/*.md into blog/ and index.html
```

## Writing a post

1. Add `posts/<slug>.md` with a front matter block:

   ```
   ---
   title: Post title
   date: 2026-11-06
   slug: post-slug
   lang: en
   summary: one line shown on the index
   ---
   ```

   A translation uses its own `slug` and `lang`, plus `translation_of: <primary slug>`. The index lists the primary post and links the translations beside it.

2. Render:

   ```bash
   python3 -m venv .venv && .venv/bin/pip install markdown pygments
   .venv/bin/python tools/build.py
   ```

3. Commit the generated `index.html`, `blog/*.html` and `assets/highlight.css` together with the Markdown.
