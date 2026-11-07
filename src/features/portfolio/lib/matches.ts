import type { Project } from '../../../types/project.ts';
import type { Result, ResultMatch } from './filters.ts';
import type { TechId, TechIndex } from './tech.ts';

/** `Reservadito: Backend` → `Reservadito`; a title without ": " is used whole (D9). */
export function shortHubName(project: Project): string {
  return project.title.split(': ')[0];
}

/** `Reservadito: Backend` → `Backend`; a title without ": " is used whole (D9). */
export function shortPieceName(project: Project): string {
  const colon = project.title.indexOf(': ');
  return colon === -1 ? project.title : project.title.slice(colon + 2);
}

/** Why a result showed up, one entry per selected tech: `Matches in Backend: NestJS → Node.js · …`. */
export function formatMatches(result: Result, index: TechIndex): string {
  const label = (id: TechId) => index.entries.get(id)?.label ?? id;
  const entry = (match: ResultMatch) => {
    const where = match.in ? `Matches in ${shortPieceName(match.in)}` : 'Matches';
    const what =
      match.kind === 'implied'
        ? `${label(match.via)} → ${label(match.tech)}`
        : match.kind === 'group'
          ? `${label(match.member)} (${label(match.tech)})`
          : label(match.tech);
    return `${where}: ${what}`;
  };
  return result.matches.map(entry).join(' · ');
}
