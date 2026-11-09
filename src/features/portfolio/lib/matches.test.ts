import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, test } from 'node:test';
import type { Project } from '../../../types/project.ts';
import { filterProjects, parseFilters, type Result, type ResultMatch } from './filters.ts';
import { formatMatches, shortHubName, shortPieceName } from './matches.ts';
import { buildTechIndex } from './tech.ts';

// Hand-made results, so stack edits in the SCM can't break the format; labels come from the catalog.
const titled = (title: string) => ({ slug: 'x', title }) as Project;
const catalog = buildTechIndex([]);
const format = (...matches: ResultMatch[]) => formatMatches({ project: titled('Hub'), matches }, catalog);

describe('short names (D9)', () => {
  test('split the title on the first ": "', () => {
    assert.equal(shortHubName(titled('Reservadito: Backend')), 'Reservadito');
    assert.equal(shortPieceName(titled('Reservadito: Backend')), 'Backend');
    assert.equal(shortPieceName(titled('A: B: C')), 'B: C');
  });

  test('a title without a colon is used whole', () => {
    assert.equal(shortHubName(titled('Contact API')), 'Contact API');
    assert.equal(shortPieceName(titled('Contact API')), 'Contact API');
  });
});

describe('formatMatches', () => {
  test('direct', () => {
    assert.equal(format({ kind: 'direct', tech: 'node' }), 'Matches: Node.js');
  });

  test('implied', () => {
    assert.equal(format({ kind: 'implied', tech: 'node', via: 'nest' }), 'Matches: NestJS → Node.js');
  });

  test('through a piece', () => {
    assert.equal(
      format({ kind: 'implied', tech: 'node', via: 'nest', in: titled('Reservadito: Backend') }),
      'Matches in Backend: NestJS → Node.js',
    );
  });

  test('group', () => {
    const index = buildTechIndex([{ slug: 'x', title: 'X', stack: ['AWS Lambda'] } as Project]);
    const result: Result = { project: titled('X'), matches: [{ kind: 'group', tech: 'aws', member: 'awslambda' }] };
    assert.equal(formatMatches(result, index), 'Matches: AWS Lambda (AWS)');
  });

  test('two techs are joined by " · ", with "Matches" written once (A15)', () => {
    assert.equal(
      format({ kind: 'direct', tech: 'react' }, { kind: 'implied', tech: 'node', via: 'nest' }),
      'Matches: React · NestJS → Node.js',
    );
    const backend = titled('Reservadito: Backend');
    assert.equal(
      format({ kind: 'direct', tech: 'react' }, { kind: 'implied', tech: 'node', via: 'nest', in: backend }),
      'Matches: React · in Backend: NestJS → Node.js',
    );
    assert.equal(
      format({ kind: 'implied', tech: 'node', via: 'nest', in: backend }, { kind: 'direct', tech: 'react' }),
      'Matches in Backend: NestJS → Node.js · React',
    );
  });

  test('no selected techs give an empty string', () => {
    assert.equal(format(), '');
  });

  test('Reservadito with tech=node reads "NestJS → Node.js" (spec criterion 3)', () => {
    const projects = JSON.parse(
      readFileSync(new URL('./fixtures/projects.json', import.meta.url), 'utf8'),
    ) as Project[];
    const index = buildTechIndex(projects);
    const reservadito = filterProjects(parseFilters(new URLSearchParams('tech=node'), index), index).find(
      (result) => result.project.slug === 'reservadito',
    )!;
    assert.equal(formatMatches(reservadito, index), 'Matches: NestJS → Node.js');
  });
});
