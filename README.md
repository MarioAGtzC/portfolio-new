# Mario Gutiérrez: Portfolio

A personal portfolio site where each project is a structured case study covering the problem, the process and the results, not just a link to a repo. It also has a spam-protected contact form that sends messages to my own serverless API.

**Live:** https://portfolio.mario-gutierrez.com

## The problem it solves

Recruiters and clients usually judge an engineer from a resume PDF, a GitHub profile full of repos without context, or a LinkedIn summary. None of these quickly shows what the person built, what their role was, or why it mattered.

This site answers those questions. Each project page explains what was broken, which decisions were made and what shipped. Platforms with several codebases appear as one story with their pieces linked underneath, not as separate repos. Visitors can then get in touch from the same site through a contact form, without opening their email client.

## My role and process

**Solo project.** I did the design, implementation and deployment.

- **Content as data.** All projects live in one typed data file. A project can be a *hub* with linked *pieces* (for example, a booking platform with its customer app, business panel, admin panel and backend). The site currently models 14 entries: 5 top-level projects, and 9 pieces under 3 of them. Pieces can include an optional layered architecture diagram.
- **Feature-based structure.** Code is grouped by feature (`home`, `portfolio`, `project-detail`, `contact`), not by file type, so each area keeps its components, hooks and data together.
- **SEO for a client-side app.** After the build, a prerender script creates a static HTML page for every route. Each page gets its own title, description, Open Graph/Twitter tags, JSON-LD structured data and a `<noscript>` fallback. The script also writes `sitemap.xml`, `robots.txt`, a `404.html` and per-project Open Graph images, and it warns at build time when a title or description is too long or too short.
- **Layered form protection.** The contact form uses a CAPTCHA, a hidden honeypot field, client-side validation and a 30-second cooldown between submissions. The server-side checks live in the separate Contact API.
- **Custom design system.** Colors are CSS design tokens with light and dark values. Visitors can switch between system, dark and light themes, and their choice is saved in the browser. Fonts are self-hosted.
- **Automated deploys.** Every push to `main` is linted, type-checked, built, prerendered and published.

## Technologies and tools

| Function | What it does in this project |
| --- | --- |
| **Language & UI** | React 19 with TypeScript (strict, type-checked on every build) |
| **Routing** | Client-side routing with React Router: home, portfolio index, project detail pages, contact and a not-found page |
| **Build** | Vite for development and production bundles, plus a custom Node prerender script for static HTML, sitemap and robots.txt |
| **Styling & theming** | Tailwind CSS v4 on top of CSS custom-property design tokens, with system, dark and light themes |
| **Data** | Typed, in-repo project data (no database or CMS), with images found automatically per project folder |
| **Contact & integrations** | The form posts JSON to a separate serverless [Contact API](https://github.com/MarioAGtzC/contact-api); the endpoint is set through an environment variable |
| **Bot protection** | Cloudflare Turnstile on the contact form, plus a honeypot field and a client-side submit cooldown |
| **SEO** | Per-route meta tags, canonical URLs and schema.org JSON-LD, generated at build time and updated on client-side navigation |
| **CI/CD & hosting** | GitHub Actions lints, builds and deploys to GitHub Pages on every push to `main`, with a custom domain |
| **Testing** | No automated test suite yet. Quality checks are linting and TypeScript type-checking, both of which must pass in CI before a deploy |

## Results and impact

There are no traffic or conversion metrics to report. What the project delivers today:

- **Projects explained as case studies.** Each entry follows a problem → process → results format. Larger systems appear as one hub with linked pieces, so the work is readable for non-technical reviewers as well as engineers.
- **Search- and share-ready pages from a single-page app.** Every project has its own prerendered HTML, metadata, structured data and preview image, so search engines and link previews see real content without running JavaScript.
- **A contact channel I own.** Messages go through my own serverless backend, not a third-party form service, and bots are filtered on both the client and the API.
- **Zero-touch releases.** A push to `main` is the only step needed to publish. CI stops any release that fails linting or type-checking.

## Screenshots and live demo

- **Live demo:** https://portfolio.mario-gutierrez.com

No screenshots of the current UI are in the repository yet. They should be added under `docs/screenshots/` (suggested: home, portfolio index, a project detail page with an architecture diagram, and the contact page) and embedded in this section.

## Links

- **Live site:** https://portfolio.mario-gutierrez.com
- **Resume site (related repo):** [resume-new](https://github.com/MarioAGtzC/resume-new): a resume page and PDF CV generated from the same source data
- **Contact API (related repo):** [contact-api](https://github.com/MarioAGtzC/contact-api): the serverless backend behind this site's contact form
- **Author:** [GitHub](https://github.com/MarioAGtzC) · [LinkedIn](https://www.linkedin.com/in/marioagtz/)

## Running locally

```bash
npm install
cp .env.example .env   # set the contact API endpoint and the Turnstile site key
npm run dev
```

Other scripts: `npm run build` (type-check, bundle and prerender), `npm run lint`, `npm run preview`.
