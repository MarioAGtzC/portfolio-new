import { z } from 'zod';

// Shapes of the JSON files the Site Content Manager publishes, kept in line with src/types/project.ts.
// Checked by vite.config.ts, so an invalid file fails the build.
// Changes together with site-content-manager-api/src/export/schemas/portfolio.ts: a rule only here
// lets a publish pass the API and then fail this build.

const text = z.string().trim().min(1);
const slug = z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'Lowercase letters, numbers and single dashes');
const httpUrl = z.url({ protocol: /^https?$/ });

const projectSchema = z.strictObject({
  slug,
  title: text,
  summary: text,
  stack: z.array(text),
  role: text,
  team: z.int().positive().optional(),
  problem: text,
  process: text,
  results: z.array(text).min(1).optional(),
  architecture: z
    .array(
      z.strictObject({
        label: text.optional(),
        nodes: z.array(z.strictObject({ label: text, detail: text.optional(), pieceSlug: slug.optional() })).min(1),
      }),
    )
    .min(1)
    .optional(),
  liveUrl: httpUrl.optional(),
  repoUrl: httpUrl.optional(),
  year: z.int().min(2000).max(2100),
  featured: z.boolean(),
  order: z.int(),
  origin: z.enum(['product', 'personal', 'course', 'client', 'challenge']),
  category: z
    .array(z.enum(['web app', 'mobile app', 'backend', 'api', 'serverless', 'microservice', 'platform', 'landing', 'template']))
    .min(1),
  status: z.enum(['live', 'in progress', 'archived']),
  parentSlug: slug.optional(),
});

/** Unique slugs, one level of pieces, and architecture nodes that link to the project's own pieces. */
export const projectsSchema = z.array(projectSchema).superRefine((projects, ctx) => {
  const bySlug = new Map<string, z.infer<typeof projectSchema>>();
  projects.forEach((project, index) => {
    if (bySlug.has(project.slug)) ctx.addIssue({ code: 'custom', path: [index, 'slug'], message: 'Duplicate slug' });
    bySlug.set(project.slug, project);
  });

  projects.forEach((project, index) => {
    if (project.parentSlug !== undefined) {
      const parent = bySlug.get(project.parentSlug);
      if (!parent || parent.parentSlug !== undefined) {
        ctx.addIssue({ code: 'custom', path: [index, 'parentSlug'], message: 'Must be an existing top-level project' });
      }
    }
    project.architecture?.forEach((layer, layerIndex) =>
      layer.nodes.forEach((node, nodeIndex) => {
        if (node.pieceSlug !== undefined && bySlug.get(node.pieceSlug)?.parentSlug !== project.slug) {
          ctx.addIssue({
            code: 'custom',
            path: [index, 'architecture', layerIndex, 'nodes', nodeIndex, 'pieceSlug'],
            message: 'Must be a piece of this project',
          });
        }
      }),
    );
  });
});

/** About category titles that SkillsTable shows as rows; renaming one would empty its row. */
export const SKILLS_TABLE_CATEGORIES = [
  'APIs & Integrations',
  'Cloud & Serverless (AWS)',
  'DevOps & Delivery',
  'Back-end Developer',
  'Databases',
  'Front-end Developer',
] as const;

export const aboutSchema = z
  .strictObject({
    subtitle: text,
    paragraphs: z.array(text).min(1),
    categories: z.array(z.strictObject({ title: text, skills: z.array(text).min(1) })),
  })
  .superRefine((about, ctx) => {
    for (const title of SKILLS_TABLE_CATEGORIES) {
      if (!about.categories.some((category) => category.title === title)) {
        ctx.addIssue({ code: 'custom', path: ['categories'], message: `Missing category "${title}" (shown by SkillsTable)` });
      }
    }
  });

export const careerSchema = z.strictObject({
  start: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'Expected YYYY-MM'),
});

const seoPage = z.strictObject({ title: text, description: text });

/** Texts of the fixed pages; project pages use their own title and summary. */
export const seoSchema = z.strictObject({ home: seoPage, portfolio: seoPage, contact: seoPage });

export type ProjectData = z.infer<typeof projectSchema>;
export type About = z.infer<typeof aboutSchema>;
export type Career = z.infer<typeof careerSchema>;
export type Seo = z.infer<typeof seoSchema>;

/** Every published JSON file and its schema, by path from the project root. */
export const DATA_FILES = {
  'src/data/projects.json': projectsSchema,
  'src/data/about.json': aboutSchema,
  'src/data/career.json': careerSchema,
  'src/data/seo.json': seoSchema,
};
