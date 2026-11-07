import { TECH_GROUPS } from './techCatalog.ts';
import { foldText, resolveTech, stripVersion, type TechId, type TechIndex } from './tech.ts';

export interface TechSuggestion {
  id: TechId;
  label: string;
  count: number;
}

export interface SuggestOptions {
  index: TechIndex;
  /** Results the tech would give if added; techs with 0 are not suggested. */
  count: (id: TechId) => number;
  /** Techs already selected. */
  exclude?: TechId[];
  limit?: number;
}

const groupIds = new Set(TECH_GROUPS.map((group) => group.id));

/**
 * Techs matching what the user typed, best first: exact id or alias, then label starts with it,
 * then a word starts with it, then label contains it. Ties by count, then alphabetically.
 */
export function suggestTechs(text: string, { index, count, exclude = [], limit = 8 }: SuggestOptions): TechSuggestion[] {
  const query = foldText(stripVersion(text));
  if (!query) return [];
  const exact = resolveTech(text, index);

  const ranked: (TechSuggestion & { rank: number })[] = [];
  for (const [id, { label }] of index.entries) {
    if (exclude.includes(id)) continue;
    const folded = foldText(label);
    const rank =
      id === exact ? 0
      : folded.startsWith(query) ? 1
      : label.split(/[^\p{L}\p{N}]+/u).some((word) => foldText(word).startsWith(query)) ? 2
      : folded.includes(query) ? 3
      : -1;
    if (rank < 0) continue;
    const results = count(id);
    if (results === 0) continue;
    ranked.push({ id, label: groupIds.has(id) ? `${label} (any service)` : label, count: results, rank });
  }

  return ranked
    .sort((a, b) => a.rank - b.rank || b.count - a.count || a.label.localeCompare(b.label))
    .slice(0, limit)
    .map(({ id, label, count }) => ({ id, label, count }));
}
