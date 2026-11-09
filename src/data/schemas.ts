import { z } from 'zod';
import { normalizeTech } from '../features/portfolio/lib/tech.ts';

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

const techEntrySchema = z.strictObject({
  /** Normalized key (`normalizeTech`), used in `?tech=` URLs. */
  id: text,
  label: text,
  aliases: z.array(text).optional(),
  /** Entry ids this tech cannot run without (applied transitively). */
  implies: z.array(text).optional(),
});

const techGroupSchema = z.strictObject({
  id: text,
  label: text,
  aliases: z.array(text).optional(),
  /** A stack name is in the group when it equals a prefix or starts with it plus a space. */
  prefixes: z.array(text).min(1),
});

/**
 * The project filters' tech catalog (techs.json). Same rules as the API's techsSchema: ids normalized
 * and unique, `implies` naming existing entries without cycles, no key naming two techs.
 */
export const techsSchema = z
  .strictObject({ entries: z.array(techEntrySchema), groups: z.array(techGroupSchema) })
  .superRefine(({ entries, groups }, ctx) => {
    const techs = [
      ...entries.map((tech, index) => ({ tech, path: ['entries', index] })),
      ...groups.map((tech, index) => ({ tech, path: ['groups', index] })),
    ];
    const issue = (path: (string | number)[], message: string) => ctx.addIssue({ code: 'custom', path, message });

    const seenIds = new Set<string>();
    for (const { tech, path } of techs) {
      if (normalizeTech(tech.id) !== tech.id) issue([...path, 'id'], `Must be a normalized key ("${normalizeTech(tech.id)}")`);
      if (seenIds.has(tech.id)) issue([...path, 'id'], 'Duplicate id');
      seenIds.add(tech.id);
    }

    const entryIds = new Set(entries.map(({ id }) => id));
    entries.forEach(({ implies = [] }, index) =>
      implies.forEach((target, i) => {
        if (!entryIds.has(target)) issue(['entries', index, 'implies', i], `Unknown tech "${target}"`);
      }),
    );
    const implies = new Map(entries.map(({ id, implies = [] }) => [id, implies]));
    const cycleFrom = (id: string, path: string[]): string[] | undefined => {
      if (path.includes(id)) return [...path, id];
      for (const next of implies.get(id) ?? []) {
        const cycle = cycleFrom(next, [...path, id]);
        if (cycle) return cycle;
      }
      return undefined;
    };
    entries.forEach(({ id }, index) => {
      const cycle = cycleFrom(id, []);
      if (cycle && cycle[0] === id) issue(['entries', index, 'implies'], `Cycle: ${cycle.join(' → ')}`);
    });

    const owner = new Map<string, string>();
    for (const { tech, path } of techs) {
      const names: [string, (string | number)[]][] = [
        [tech.id, [...path, 'id']],
        [tech.label, [...path, 'label']],
        ...(tech.aliases ?? []).map((alias, i): [string, (string | number)[]] => [alias, [...path, 'aliases', i]]),
      ];
      for (const [name, namePath] of names) {
        const key = normalizeTech(name);
        // Such a name could never be typed into the filters, and would collide with every other one.
        if (!key) {
          issue(namePath, 'Needs letters or digits');
          continue;
        }
        const previous = owner.get(key);
        if (previous !== undefined && previous !== tech.id) issue(namePath, `"${name}" already names ${previous}`);
        if (previous === undefined) owner.set(key, tech.id);
      }
    }
  });

export type ProjectData = z.infer<typeof projectSchema>;
export type About = z.infer<typeof aboutSchema>;
export type Career = z.infer<typeof careerSchema>;
export type Seo = z.infer<typeof seoSchema>;
export type Techs = z.infer<typeof techsSchema>;

/** Every published JSON file and its schema, by path from the project root. */
export const DATA_FILES = {
  'src/data/projects.json': projectsSchema,
  'src/data/about.json': aboutSchema,
  'src/data/career.json': careerSchema,
  'src/data/seo.json': seoSchema,
  'src/data/techs.json': techsSchema,
};
