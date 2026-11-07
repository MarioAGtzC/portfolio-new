/**
 * The only hand-maintained part of the project filters (see docs/specs/project-filters).
 * Stack names that are not listed here still work: each becomes its own tech.
 * This file only adds aliases, implications and nicer labels.
 */

/** Normalized key of the canonical name (`normalizeTech`); used in the URL. */
export type TechId = string;

export interface TechEntry {
  id: TechId;
  /** Visible name, e.g. "Node.js". */
  label: string;
  /** Other spellings; normalized like stack names. */
  aliases?: string[];
  /** Techs this one cannot run without (one way, applied transitively). */
  implies?: TechId[];
}

/** A tech that matches several others by name prefix (e.g. every AWS service). */
export interface TechGroup {
  id: TechId;
  label: string;
  aliases?: string[];
  /** Case-sensitive prefixes of the stack name or the resolved label. */
  prefixes: string[];
}

export const TECH_ENTRIES: TechEntry[] = [
  // Aliases (spec §5.3). Spellings covered by normalizeTech (node / nodejs / Node.js) need no alias.
  { id: 'node', label: 'Node.js' },
  { id: 'typescript', label: 'TypeScript', aliases: ['ts'], implies: ['javascript'] },
  { id: 'javascript', label: 'JavaScript', aliases: ['js', 'ecmascript'] },
  { id: 'postgresql', label: 'PostgreSQL', aliases: ['postgres', 'psql', 'pg'] },
  { id: 'tailwindcss', label: 'Tailwind CSS', aliases: ['tailwind'] },
  { id: 'mongodb', label: 'MongoDB', aliases: ['mongo'] },
  { id: 'awsses', label: 'Amazon SES', aliases: ['AWS SES', 'ses'] },
  {
    id: 'tanstackquery',
    label: 'TanStack Query',
    aliases: ['TanStack React Query', 'React Query'],
    implies: ['react'],
  },
  {
    id: 'testinglibrary',
    label: 'Testing Library',
    aliases: ['React Testing Library', 'RTL'],
    implies: ['react'],
  },
  { id: 'stripe', label: 'Stripe', aliases: ['Stripe.js / React Stripe.js'] },
  { id: 'swagger', label: 'Swagger (OpenAPI)', aliases: ['openapi'] },
  { id: 'latex', label: 'LaTeX', aliases: ['LaTeX (XeLaTeX)', 'xelatex'] },
  { id: 'vite', label: 'Vite', aliases: ['Vite (SWC)'] },
  { id: 'githubactions', label: 'GitHub Actions', aliases: ['gha', 'ci'] },

  // Implications (spec §5.4, plus A6). Only when the tech cannot run without the implied one.
  { id: 'nest', label: 'NestJS', implies: ['node', 'typescript', 'express'] },
  { id: 'express', label: 'Express', implies: ['node'] },
  { id: 'next', label: 'Next.js', implies: ['react', 'node'] },
  { id: 'react', label: 'React' },
  { id: 'reactnative', label: 'React Native', implies: ['react'] },
  { id: 'mongoose', label: 'Mongoose', implies: ['mongodb', 'node'] },
  { id: 'sequelize', label: 'Sequelize', implies: ['node'] },
  { id: 'prisma', label: 'Prisma', implies: ['node'] },
  { id: 'stripeconnect', label: 'Stripe Connect', implies: ['stripe'] },
  { id: 'reactrouter', label: 'React Router', implies: ['react'] },
  { id: 'reacthookform', label: 'React Hook Form', implies: ['react'] },
  { id: 'reactemail', label: 'React Email', implies: ['react'] },
  { id: 'nodejstestrunner', label: 'Node.js test runner', implies: ['node'] },
];

export const TECH_GROUPS: TechGroup[] = [
  { id: 'aws', label: 'AWS', aliases: ['amazon', 'amazon web services'], prefixes: ['AWS ', 'Amazon '] },
];
