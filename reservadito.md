# Reservadito

Reservadito is a multi-tenant booking platform for service businesses — barbershops, restaurants, spas, clinics, therapists, and any business that operates by appointment. It brings discovery, scheduling, payments, staff management, and reviews into a single system that serves both independent locations and multi-branch franchises.

## The problem it solves

Service businesses that run on appointments — a barbershop, a clinic, a spa — typically stitch together a messy combination of WhatsApp, paper agendas, phone calls, and generic calendar apps to manage bookings. That makes it hard to avoid double-bookings, collect payment up front, enforce a fair cancellation policy, or prove that a client actually showed up. It's worse for franchises with multiple branches, who have no consolidated view of how each location is performing.

On the client side, people want a single place to find a trustworthy business nearby, see real availability and pricing, book in a few taps, pay online when required, and leave a review — instead of calling around or hoping a WhatsApp message gets answered.

Reservadito addresses both sides at once:

- **For businesses:** a single dashboard to manage branches, staff, services, schedules, exceptions, cancellation policies, and online payments — with QR check-in to prove attendance and automated no-show/cancellation resolution so disputes don't rely on someone's word.
- **For franchises:** organizations that group several branches under one account, with consolidated analytics and a shared or per-branch payment setup.
- **For clients:** search by location, transparent pricing and availability, one-off or recurring appointments (useful for therapists, nutritionists, and other ongoing care), online payment, rescheduling within clear rules, and reviews.
- **For the platform operator:** a subscription + commission revenue model (no ads, no data selling) with an internal admin team that can support businesses, investigate payment issues, and audit every action taken on the system.

## My role and process

We designed and built Reservadito end-to-end as a team of three, in a single monorepo: domain modeling, backend API, three frontends (business panel, customer app, internal admin), the shared type/validation contract between them, and the AWS deployment pipeline.

Approach:

1. **Modeled the domain first** (`docs/BUSINESS.md`) — organizations → businesses (branches) → staff → services → bookings — before writing code, so that franchise support, recurring appointments, and multi-branch payments didn't require a later rewrite.
2. **Established Prisma as the single source of truth** for data models, with a generated client shared across the backend and seed scripts, so schema drift between services isn't possible.
3. **Built a shared SDK** (`@reservadito/sdk`) with Zod schemas, TypeScript types, and an HTTP client consumed by all three frontends and validated on the backend — the API contract is defined once, not duplicated per app.
4. **Wrote the backend on NestJS with a modular structure** (auth, bookings, availability, discounts, memberships, wallet, stripe, analytics, audit, etc.), each domain isolated behind its own module, guarded by role-based access control and rate limiting.
5. **Shipped the two customer-facing web apps as installable mobile apps too**, wrapping the Vite/React frontends with Capacitor for native iOS/Android builds (native Google/Apple sign-in, push notifications, camera/QR, haptics) rather than maintaining a separate mobile codebase.
6. **Treated payments as a first-class, audited subsystem**: Stripe Connect with per-business or per-organization account modes, webhook-driven reconciliation, an internal wallet/ledger for business earnings, payouts, and chargeback handling — documented in detail in `docs/STRIPE.md` because of how easy this class of system is to get subtly wrong.
7. **Deliberately scoped v1 to one service per booking**, with a written, gated migration plan (`docs/MULTI-SERVICE.md`) for multi-service bookings — avoiding speculative complexity until real business demand justifies it.
8. **Automated deployment to AWS** for both staging (Fargate + Caddy/Let's Encrypt, provisioned by scripts) and production (Fargate behind an ALB, provisioned with Terraform, rolling deploys, Multi-AZ RDS and ElastiCache), gated by CI (typecheck, tests, lint) on every PR.

## Technologies and tools used

**Backend**
- **NestJS 10 (TypeScript)** — modular REST API: auth, organizations, businesses, bookings, availability, discounts, memberships, wallet, analytics, audit, and more, each as an isolated domain module.
- **PostgreSQL + Prisma ORM** — relational data store and schema-as-code, with the generated client shared across the backend and seed/migration tooling.
- **Redis (ioredis)** — session/token revocation store, auth brute-force lockout counters, and rate-limiter backing store.
- **BullMQ** — background job queue for scheduled/async work (payment reconciliation, notifications, booking state transitions).
- **JWT + Passport, with Google OAuth and native Sign in with Apple** — authentication, including brute-force lockout with a configurable fail-open/fail-closed behavior if Redis becomes unavailable.
- **Role-based access control (`@Roles` + guards)** — authorization for business staff, organization admins, and internal super-admins.
- **Stripe Connect** — payment processing, with support for businesses either sharing their franchise's Stripe account or holding their own, a webhook-driven state machine keeping charge/payout status in sync, and an internal ledger for earnings and payouts.
- **Application-level field encryption** for clinical/health record data (allergies, conditions, medication, emergency contacts), required in production to comply with Mexican data-protection law (LFPDPPP) — separate from at-rest disk encryption.
- **Resend / AWS SES (pluggable email providers)** with React Email templates — transactional email (booking confirmations, receipts, alerts), with an environment-aware delivery guard that previews locally, whitelists in staging, and sends live only in production.
- **Firebase Cloud Messaging** — push notifications to the mobile apps.
- **Cloudflare R2** — object storage for business/service images.
- **`@nestjs/throttler` with Redis storage** — tiered rate limiting (default, auth, heavy) with per-user/IP keys and `Retry-After` headers.
- **nestjs-i18n** — Spanish/English API responses resolved by request header.
- **Vitest** — backend and SDK unit tests, instantiating services by hand with stubs rather than a full DI container, kept fast and dependency-free in CI.

**Frontends**
- **React 18 + Vite** — the business panel (`business-web`) and customer app (`customer-web`).
- **Next.js 14** — the internal admin/super-admin panel.
- **Capacitor** — wraps both Vite apps into native iOS and Android builds from the same codebase (native Google Sign-In, Apple Sign-In, push notifications, geolocation, haptics), shipped through dedicated TestFlight/App Store and Android CI pipelines.
- **TanStack Query** — server-state fetching/caching against the shared SDK client.
- **Tailwind CSS** — styling across all three frontends.
- **React Hook patterns + Zod (via the shared SDK)** — form handling and validation kept in sync with backend validation, defined once.
- **Stripe.js / React Stripe.js / Stripe Connect embedded components** — in-app checkout and the embedded Stripe Connect onboarding/management flows for business owners.
- **Google Maps / Mapbox (`react-map-gl`, `supercluster`)** — location-based business search and map clustering on the customer app.
- **react-i18next** — Spanish/English UI localization.
- **`@reservadito/sdk`** — the shared TypeScript contract (types, Zod schemas, HTTP client) consumed identically by all three frontends and the backend, built as dual ESM/CJS packages so each environment gets the right module format.

**Infrastructure & delivery**
- **pnpm workspaces + Turborepo** — monorepo tooling for shared builds, caching, and task orchestration across four apps and two shared packages.
- **Docker Compose** — local Postgres and Redis for development.
- **AWS Fargate** — containerized backend hosting; staging runs a single task with Caddy for automatic TLS, production runs multiple tasks behind an Application Load Balancer with Multi-AZ RDS and ElastiCache.
- **Terraform** — infrastructure-as-code for the production environment (network, ECS service, ALB/ACM, RDS, ElastiCache, monitoring/alarms via SNS).
- **GitHub Actions (OIDC, no long-lived AWS keys)** — CI (typecheck, test, lint) on every PR, and automated staging/production deploy pipelines including one-off database migration tasks and post-deploy smoke tests.
- **CloudFront + S3** — static hosting for the customer-facing web builds.

## Results or impact

- Replaced what would otherwise be manual, per-business scheduling (phone calls, WhatsApp, paper) with a system that enforces availability rules, cancellation policies, and payment collection automatically — removing the need for staff to manually track no-shows or chase payments.
- QR check-in plus a two-sided confirmation flow (client and business both asked to confirm attendance) removes disputes over whether an appointment happened, without any manual admin intervention in the common case.
- The Stripe Connect integration supports two account topologies (shared organization account vs. independent per-branch account) with automatic reconciliation against Stripe's webhook events and a daily reconciliation job that self-heals drift between Stripe and the internal ledger — designed to survive missed webhooks, partial failures, and disputes without losing money or double-charging clients.
- One shared SDK and Prisma schema eliminated an entire class of bugs (type drift between frontend and backend) across four applications.
- The same customer and business codebases ship as native iOS/Android apps via Capacitor, avoiding a separate mobile engineering effort while still supporting native capabilities (push notifications, native sign-in, camera/QR).
- Infrastructure is fully reproducible: staging via scripted AWS provisioning, production via Terraform, both deployed through CI with migrations and smoke tests gating rollout — not manual, one-off server setup.

## Images, screenshots, or live demos

No product screenshots are currently included in the repository. App icon and splash assets exist under each app's `public/`/`android/` folders, but end-to-end UI screenshots or a hosted demo link should be added here once available (e.g. a `docs/screenshots/` folder referenced from this section).

## Repository

<https://github.com/Tecno-Solutions/reservadito>
