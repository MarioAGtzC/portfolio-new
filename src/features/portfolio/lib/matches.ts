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

/**
 * Why a result showed up, one entry per selected tech, with "Matches" written once (A15):
 * `Matches: React · in Backend: NestJS → Node.js`. Empty when no tech is selected.
 */
export function formatMatches(result: Result, index: TechIndex): string {
  if (result.matches.length === 0) return '';
  const label = (id: TechId) => index.entries.get(id)?.label ?? id;
  const entry = (match: ResultMatch) => {
    const what =
      match.kind === 'implied'
        ? `${label(match.via)} → ${label(match.tech)}`
        : match.kind === 'group'
          ? `${label(match.member)} (${label(match.tech)})`
          : label(match.tech);
    return match.in ? `in ${shortPieceName(match.in)}: ${what}` : what;
  };
  const line = result.matches.map(entry).join(' · ');
  // "in Backend: …" first reads as "Matches in Backend: …"; anything else needs the colon.
  return result.matches[0].in ? `Matches ${line}` : `Matches: ${line}`;
}
