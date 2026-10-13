# Project covers

Source files for the project cover images. Each cover is a plain HTML page rendered to an image by a script, so it can be edited and regenerated at any time.

## Files

```
design/covers/
  _base.css          shared styles: canvas, grid, glow, tag, headline, panels, code window
  fonts/             Geist and Geist Mono (OFL), loaded by _base.css
  assets/            logos used by the covers (only the ones in use)
  <slug>.html        one cover per project; the file name is the project slug in src/data/projects.ts
```

## Rules

- **Size:** every cover is a 1200 × 630 canvas (the standard Open Graph ratio, 1.91 : 1).
- **Structure:** logo or brand row, an uppercase tag, a headline with one accented part, a short description, and one visual on the right (UI mock, code window, diagram or brand shape). Hubs are centered with one card per piece.
- **Colors:** each cover sets its palette with CSS variables on `.canvas` (`--bg`, `--accent`, `--accent-ink`, `--muted`, `--line`, `--surface`). Products keep their own brand colors; Mario's own sites (resume, portfolio, portfolio-resume) use the same dark tokens as the websites.
- **Font:** Geist and Geist Mono only, from `fonts/`, so renders look the same on any machine.
- **Text:** describe what the project does today. Avoid numbers that go stale; when a cover needs live data, load it at render time (see below).
- **Images:** put logos in `assets/` as files (no base64), sized close to how they are displayed. Prefer SVG when available.

## Live data

A cover can load data before it is captured by assigning a promise to `window.coverReady`. The renderer waits for it, and for the fonts, before taking the screenshot. A cover can also set `window.coverNote`; the script prints it next to the cover's name.

`resume.html` uses this to build the career timeline from the resume site's own data (`MarioAGtzC/resume-new` → `src/data/experience.json`). It falls back to an inline copy when the file can't be fetched. After a job change, update the resume repo and regenerate the cover; no edits are needed here.

## Previewing

Open any `.html` file in a browser. The page is exactly what the renderer captures.

## Generating

```bash
npm run covers               # all covers
npm run covers -- resume     # one or more covers by slug
```

The script renders each cover with Chromium (Playwright), converts it with sharp and writes:

- `src/assets/images/projects/<slug>/cover.webp`: shown on the site, rendered at 2× for sharp displays.
- `public/og/<slug>.jpg`: 1200 × 630 social preview for the project page.
- `portfolio.html` also writes `public/og-image.jpg`, the preview for the whole site.
- `resume.html` also writes `design/covers/out/og-resume.jpg` (ignored by git). Copy it into the resume repo as `public/og-image.jpg`.

First-time setup: `npm i -D playwright sharp` and `npx playwright install chromium`.

## Adding a cover

1. Create `<slug>.html` next to the others, link `_base.css` and set the palette variables on `.canvas`.
2. Add any logo to `assets/`.
3. Run `npm run covers -- <slug>`.
