# CLAUDE.md

Notes for Claude Code when working in this repository.

- Project data lives in `src/data/projects.ts`; each project's images live in `src/assets/images/projects/<slug>/`.
- Covers are generated, not hand-made: edit `design/covers/<slug>.html` and run `npm run covers -- <slug>`. Read `design/covers/README.md` first (size, palette variables, live data, outputs).
- Gallery screenshots are `1.webp`, `2.webp`, … in the project's image folder, 1200 × 630 or 2× that. If a project has screenshots, the gallery shows only them; otherwise it shows the cover.
- Social previews: `public/og/<slug>.jpg` per project and `public/og-image.jpg` for the site, both written by `npm run covers`. The resume site's preview is written to `design/covers/out/og-resume.jpg` and copied by hand into the resume repo.
- Checks: `npm run lint` and `npm run build` (type-check, bundle and prerender).
