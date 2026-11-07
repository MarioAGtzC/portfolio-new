import type { Project } from '../../../types/project.ts';
import { resolveTech, type Match, type TechId, type TechIndex } from './tech.ts';

export type ProjectView = 'projects' | 'all';
export type ProjectType = Project['category'][number];

/** The /portfolio filter state; the URL is its only source of truth. */
export interface ProjectFilters {
  /** `projects`: top-level projects only. `all`: hubs followed by their matching pieces. */
  view: ProjectView;
  type?: ProjectType;
  /** Tech ids, in the order they were added; combined with AND. */
  techs: TechId[];
}

/** Reads the filters from the URL, dropping unknown values and repeated techs. */
export function parseFilters(params: URLSearchParams, index: TechIndex): ProjectFilters {
  const filters: ProjectFilters = { view: params.get('view') === 'all' ? 'all' : 'projects', techs: [] };

  // D6: only types some project has, so a stale link never shows an empty page.
  const type = params.get('type');
  if (type && index.projects.some((project) => (project.category as string[]).includes(type))) {
    filters.type = type as ProjectType;
  }

  for (const text of params.getAll('tech')) {
    const id = resolveTech(text, index);
    if (id !== undefined && !filters.techs.includes(id)) filters.techs.push(id);
  }
  return filters;
}

/** Query string without `?`, in the fixed order view → type → tech…; empty for the default filters. */
export function serializeFilters(filters: ProjectFilters): string {
  const params = new URLSearchParams();
  if (filters.view === 'all') params.set('view', 'all');
  if (filters.type) params.set('type', filters.type);
  for (const tech of filters.techs) params.append('tech', tech);
  // URLSearchParams writes spaces as "+"; the spec's URLs use %20 (a literal "+" is already %2B).
  return params.toString().replaceAll('+', '%20');
}

export function isDefault(filters: ProjectFilters): boolean {
  return filters.view === 'projects' && !filters.type && filters.techs.length === 0;
}

/** A match for one selected tech; `in` is the piece it comes from when the hub itself lacks it. */
export type ResultMatch = Match & { in?: Project };

export interface Result {
  project: Project;
  /** The hub, for a piece listed in the All parts view. */
  partOf?: Project;
  /** One per selected tech, in the order of `filters.techs`. */
  matches: ResultMatch[];
}

export interface Facets {
  /** Results per type if it were the selected one, given the other filters. */
  types: Map<ProjectType, number>;
  /** Results per tech if it were added (or the current results, if already selected). */
  techs: Map<TechId, number>;
}

const KIND_RANK: Record<Match['kind'], number> = { direct: 0, implied: 1, group: 2 };
const byOrder = (left: Project, right: Project) => left.order - right.order;

/**
 * Projects that pass the filters. A hub is judged on the union of its own and its pieces' types
 * and techs; a piece only on itself (A2). In All parts, matching pieces follow their hub.
 */
export function filterProjects(filters: ProjectFilters, index: TechIndex): Result[] {
  const results: Result[] = [];
  for (const hub of index.projects.filter((project) => !project.parentSlug).sort(byOrder)) {
    const pieces = index.projects.filter((project) => project.parentSlug === hub.slug).sort(byOrder);
    const result = evaluate(hub, pieces, filters, index);
    if (!result) continue;
    results.push(result);
    if (filters.view !== 'all') continue;
    for (const piece of pieces) {
      const pieceResult = evaluate(piece, [], filters, index);
      if (pieceResult) results.push({ ...pieceResult, partOf: hub });
    }
  }
  return results;
}

function evaluate(project: Project, pieces: Project[], filters: ProjectFilters, index: TechIndex): Result | undefined {
  const { type } = filters;
  if (type && ![project, ...pieces].some((item) => item.category.includes(type))) return undefined;

  const matches: ResultMatch[] = [];
  for (const tech of filters.techs) {
    const own = index.own.get(project.slug)?.get(tech);
    if (own) {
      matches.push(own);
      continue;
    }
    // Own before piece; among pieces, the most direct kind, then the first piece in order.
    let best: ResultMatch | undefined;
    for (const piece of pieces) {
      const match = index.own.get(piece.slug)?.get(tech);
      if (match && (!best || KIND_RANK[match.kind] < KIND_RANK[best.kind])) best = { ...match, in: piece };
    }
    if (!best) return undefined;
    matches.push(best);
  }
  return { project, matches };
}

/** Faceted counts for the type select and the tech suggestions (A4, D7: one run per option). */
export function facetCounts(filters: ProjectFilters, index: TechIndex): Facets {
  const count = (next: ProjectFilters) => filterProjects(next, index).length;
  const types = new Map<ProjectType, number>();
  for (const type of new Set(index.projects.flatMap((project) => project.category))) {
    types.set(type, count({ ...filters, type }));
  }
  const techs = new Map<TechId, number>();
  for (const tech of index.entries.keys()) {
    techs.set(tech, count(filters.techs.includes(tech) ? filters : { ...filters, techs: [...filters.techs, tech] }));
  }
  return { types, techs };
}
