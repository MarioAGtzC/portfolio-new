import type { Project } from '../../../types/project.ts';
import { resolveTech, type TechId, type TechIndex } from './tech.ts';

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
