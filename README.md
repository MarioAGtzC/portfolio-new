# Mario Gutiérrez — Portfolio

A personal portfolio site for Mario Gutiérrez, a full-stack developer, built to showcase real projects as in-depth case studies and give visitors a direct, working way to get in touch. It is a single-page-app-style React site with dedicated pages for an overview, a project index, individual project detail pages, and a contact form.

## The Problem It Solves

Developers are often evaluated on scattered evidence of their work: a resume PDF, a GitHub profile full of repos with no context, or a LinkedIn summary. None of these let a recruiter, hiring manager, or potential client quickly answer the questions that actually matter — *what did this person build, what was their specific role, what problem did it solve, and can I reach them easily?*

This site addresses that gap by presenting each project as a structured case study (problem → process → results) rather than a bare link, and by grouping related work together — for example, a multi-part platform is shown as one project with its individual pieces (client app, business app, admin panel, backend API) linked underneath it instead of as four unrelated, context-free repos. It also removes friction for outreach by offering a working contact form backed by a real API, instead of only a mailto link.

## My Role and Process

This was designed, built, and is maintained solo, end-to-end — from information architecture to UI design to the backend integration the contact form relies on.

The approach:
- **Structured the app by feature, not by file type** — `contact`, `home`, `portfolio`, and `project-detail` each own their components, hooks, and local data, keeping related logic together as the site grows.
- **Modeled project data to reflect how real work is actually organized.** Rather than a flat list, projects support a "hub and pieces" relationship, so a larger platform (e.g., a multi-app product with separate client, business, admin, and backend codebases) can be documented as one cohesive case study with linked sub-projects, instead of four disconnected entries.
- **Built a reusable carousel component** shared between the homepage's featured projects and a project detail page's related-projects section, with a graceful fallback to a static layout when there's only one item to show.
- **Wired up a real contact flow**, including client-side validation and pending/success/error feedback, connected to a separate serverless API built for this purpose (documented as its own project within the site).
- **Designed a custom visual identity** — a self-hosted display typeface, a green-based color system, and full dark mode support — rather than relying on a default framework theme.

## Technologies and Tools Used

- **UI framework**: React 19 with TypeScript, for a type-safe, component-based interface.
- **Build tooling**: Vite, for fast local development and production bundling.
- **Routing**: React Router (v7, `createBrowserRouter`) for client-side navigation across the home, portfolio index, individual project, and contact pages, with a shared layout and a catch-all not-found route.
- **Styling and theming**: Tailwind CSS v4, using its CSS-first configuration to define a custom design system (brand colors, a self-hosted "Recoleta" font family, and dark-mode support applied consistently across the site).
- **Carousel/slider**: Embla Carousel, powering the looping "featured projects" and "related projects" carousels, including custom logic to keep looping smooth regardless of how many items exist.
- **Contact form backend**: A custom-built serverless API (a separate project, deployed on AWS via API Gateway and Lambda) that the contact form submits to over `fetch`, rather than a third-party form service — giving full control over validation, email delivery, and future anti-spam protection.
- **Form handling**: Hand-rolled client-side validation (required fields, email format checking) and submit-state management, keeping the dependency footprint minimal for a form this size.
- **User feedback**: React Toastify, for success/error notifications after a contact form submission.

## Results / Impact

This project is under active, ongoing development. What it currently delivers:

- A **case-study-driven presentation** of real projects, replacing a flat list of repo links with problem/process/results narratives — designed to make technical work legible to non-technical reviewers (recruiters, clients) as well as other engineers.
- A **data model that scales to multi-part systems**: a single platform-level project (currently modeling a four-piece system — client app, business app, admin panel, and backend) is represented as one coherent story instead of fragmented, context-free entries.
- A **fully functioning, self-hosted contact pipeline** (form → validation → serverless API → email), removing the dependency on third-party form services and giving full ownership of the data and delivery path.
- A **consistent, custom-branded UI** with dark mode support across every page, built on a maintainable design-token system rather than ad hoc styling.

Several project entries and page copy sections are still being written out as the site content is finished, and integrating the shared anti-spam protection already built into the contact API backend is a planned next step.

## Images, Screenshots, or Live Demos

No screenshots are checked into the repository yet — project cover/gallery images are loaded dynamically from `src/assets/images/projects/<project-slug>/`, which is currently empty aside from a placeholder, and the UI falls back to a text-only card when no image is present. Screenshots of the live site (homepage, portfolio grid, a project detail page, and the contact page) should be added here once available, for example under a `docs/screenshots/` folder referenced from this section.

## Links

- **Author**: [github.com/MarioAGtzC](https://github.com/MarioAGtzC) · [LinkedIn](https://www.linkedin.com/in/marioagtz/)
- **Live site**: not yet deployed — this project does not have its own domain/URL assigned yet.
- **Repository**: to be linked here once pushed to a remote.

## Getting Started

```bash
npm install
npm run dev
```

Create a `.env` file based on `.env.example` and set `VITE_CONTACT_API_URL` to a running instance of the contact API, and `VITE_SITE_KEY` to a Cloudflare Turnstile site key for the contact form to work locally.

Other scripts: `npm run build` (type-check + production build), `npm run lint`, `npm run preview`.
