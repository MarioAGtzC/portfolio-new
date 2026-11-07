import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, test } from 'node:test';
import type { Project } from '../../../types/project.ts';
import { filterProjects, parseFilters, type Result } from './filters.ts';
import { formatMatches, shortHubName, shortPieceName } from './matches.ts';
import { buildTechIndex } from './tech.ts';

const projects = JSON.parse(
  readFileSync(new URL('../../../data/projects.json', import.meta.url), 'utf8'),
) as Project[];
const index = buildTechIndex(projects);
const project = (slug: string) => projects.find((item) => item.slug === slug)!;
const result = (query: string, slug: string) =>
  filterProjects(parseFilters(new URLSearchParams(query), index), index).find((item) => item.project.slug === slug)!;

describe('short names (D9)', () => {
  test('split the title on the first ": "', () => {
    const title = (text: string) => ({ ...project('reservadito-backend'), title: text });
    assert.equal(shortHubName(title('Reservadito: Backend')), 'Reservadito');
    assert.equal(shortPieceName(title('Reservadito: Backend')), 'Backend');
    assert.equal(shortPieceName(title('A: B: C')), 'B: C');
  });

  test('a title without a colon is used whole', () => {
    const title = { ...project('contact-api'), title: 'Contact API' };
    assert.equal(shortHubName(title), 'Contact API');
    assert.equal(shortPieceName(title), 'Contact API');
  });
});

describe('formatMatches', () => {
  test('direct', () => {
    assert.equal(formatMatches(result('view=all&tech=node', 'devtree-backend'), index), 'Matches: Node.js');
  });

  test('implied', () => {
    assert.equal(formatMatches(result('tech=node', 'reservadito'), index), 'Matches: NestJS → Node.js');
  });

  test('through a piece', () => {
    const fromPiece: Result = {
      project: project('reservadito'),
      matches: [{ kind: 'implied', tech: 'node', via: 'nest', in: project('reservadito-backend') }],
    };
    assert.equal(formatMatches(fromPiece, index), 'Matches in Backend: NestJS → Node.js');
  });

  test('group', () => {
    assert.equal(formatMatches(result('view=all&tech=aws', 'contact-api'), index), 'Matches: AWS Lambda (AWS)');
  });

  test('two techs are joined by " · "', () => {
    assert.equal(
      formatMatches(result('tech=react&tech=node', 'reservadito'), index),
      'Matches: React · Matches: NestJS → Node.js',
    );
  });

  test('no selected techs give an empty string', () => {
    assert.equal(formatMatches(result('', 'reservadito'), index), '');
  });
});
