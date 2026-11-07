import type { Project } from '../../../types/project.ts';
import { TECH_ENTRIES, TECH_GROUPS, type TechId } from './techCatalog.ts';

export type { TechId };

/** Why a project counts for one tech, from most to least direct. */
export type Match =
  | { kind: 'direct'; tech: TechId }
  /** `via` is the project's own tech that implies this one (NestJS → Node.js). */
  | { kind: 'implied'; tech: TechId; via: TechId }
  /** `member` is the project's own tech that belongs to the group (AWS Lambda → AWS). */
  | { kind: 'group'; tech: TechId; member: TechId };

export interface TechIndex {
  /** Normalized key (id, label or alias) → tech id. */
  byKey: Map<string, TechId>;
  /** Every known tech: the catalog plus one entry per stack name outside it. */
  entries: Map<TechId, { label: string }>;
  /** Each project's own techs (its stack only, not its pieces'), with implications and groups. */
  own: Map<string, Map<TechId, Match>>;
  projects: Project[];
}

/**
 * Lookup key for a technology name: lowercase, no accents, letters and digits only,
 * and no trailing "js" (`Node.js`, `nodejs` and `node` all give `node`).
 */
export function normalizeTech(text: string): string {
  const key = foldText(text);
  // Keep short keys like "js" itself; only strip the suffix when 3+ characters remain.
  return key.endsWith('js') && key.length - 2 >= 3 ? key.slice(0, -2) : key;
}

/** Lowercase, no accents, letters and digits only (`Node.js` → `nodejs`). */
export function foldText(text: string): string {
  return text
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

/** Drops a trailing version from a stack name: `React 19`, `Tailwind CSS v4`, `OAuth 2.0`. */
export function stripVersion(name: string): string {
  return name.replace(/\s+v?\d+(\.\d+)*$/i, '').trim();
}

/** Every [normalized key, id] pair the catalog defines: ids, labels and aliases. */
export function catalogKeys(): [string, TechId][] {
  return [...TECH_ENTRIES, ...TECH_GROUPS].flatMap((tech) =>
    [tech.id, tech.label, ...(tech.aliases ?? [])].map((name): [string, TechId] => [normalizeTech(name), tech.id]),
  );
}

/** Builds the tech lookup and each project's techs. Pure: call it once per project list. */
export function buildTechIndex(projects: Project[]): TechIndex {
  const byKey = new Map<string, TechId>();
  const entries = new Map<TechId, { label: string }>();
  for (const [key, id] of catalogKeys()) if (!byKey.has(key)) byKey.set(key, id);
  for (const tech of [...TECH_ENTRIES, ...TECH_GROUPS]) entries.set(tech.id, { label: tech.label });
  const implies = new Map(TECH_ENTRIES.map((entry) => [entry.id, entry.implies ?? []]));

  const own = new Map<string, Map<TechId, Match>>();
  for (const project of projects) {
    const matches = new Map<TechId, Match>();
    const direct: { id: TechId; name: string }[] = [];

    for (const raw of project.stack) {
      const name = stripVersion(raw);
      const key = normalizeTech(name);
      if (!key) continue;
      let id = byKey.get(key);
      if (id === undefined) {
        id = key;
        byKey.set(key, id);
        entries.set(id, { label: name });
      }
      if (!matches.has(id)) {
        matches.set(id, { kind: 'direct', tech: id });
        direct.push({ id, name });
      }
    }

    // Breadth-first from all direct techs at once, so the shortest chain names the `via`.
    const queue = direct.flatMap(({ id }) => (implies.get(id) ?? []).map((tech) => ({ tech, via: id })));
    for (let i = 0; i < queue.length; i++) {
      const { tech, via } = queue[i];
      if (matches.has(tech)) continue;
      matches.set(tech, { kind: 'implied', tech, via });
      for (const next of implies.get(tech) ?? []) queue.push({ tech: next, via });
    }

    for (const group of TECH_GROUPS) {
      if (matches.has(group.id)) continue;
      const member = direct.find(({ id, name }) =>
        group.prefixes.some((prefix) => name.startsWith(prefix) || entries.get(id)?.label.startsWith(prefix)),
      );
      if (member) matches.set(group.id, { kind: 'group', tech: group.id, member: member.id });
    }

    own.set(project.slug, matches);
  }

  return { byKey, entries, own, projects };
}

/** Resolves any spelling (`Node.js`, `NODEJS`, `node 24`) to a known tech id. */
export function resolveTech(text: string, index: TechIndex): TechId | undefined {
  const key = normalizeTech(stripVersion(text));
  return key ? index.byKey.get(key) : undefined;
}
