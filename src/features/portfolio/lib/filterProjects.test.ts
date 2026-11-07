import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, test } from 'node:test';
import type { Project } from '../../../types/project.ts';
import { facetCounts, filterProjects, parseFilters, type ProjectFilters } from './filters.ts';
import { buildTechIndex } from './tech.ts';

const projects = JSON.parse(
  readFileSync(new URL('../../../data/projects.json', import.meta.url), 'utf8'),
) as Project[];
const index = buildTechIndex(projects);
const run = (query: string) => filterProjects(parseFilters(new URLSearchParams(query), index), index);
const slugs = (query: string) => run(query).map((result) => result.project.slug);
const find = (query: string, slug: string) => run(query).find((result) => result.project.slug === slug);

// Same as getTopLevelProjects(), which can't be imported here (it loads images through Vite).
const topLevel = projects
  .filter((project) => !project.parentSlug)
  .sort((a, b) => a.order - b.order)
  .map((project) => project.slug);

describe('filterProjects', () => {
  test('default filters give the top-level projects in order (criterion 1)', () => {
    assert.deepEqual(slugs(''), topLevel);
    for (const result of run('')) assert.deepEqual(result.matches, []);
  });

  test('any spelling of node gives the same result (criterion 2)', () => {
    assert.deepEqual(slugs('tech=nodejs'), slugs('tech=node'));
    assert.deepEqual(slugs('tech=Node.js'), slugs('tech=node'));
  });

  test('tech=node matches the projects that run on Node (criterion 3, A3)', () => {
    assert.deepEqual(slugs('tech=node'), ['reservadito', 'portfolio-resume', 'cashtrackr', 'devtree']);
    assert.deepEqual(find('tech=node', 'reservadito')?.matches, [
      { kind: 'implied', tech: 'node', via: 'nest' },
    ]);
  });

  test('a hub matches through a piece and names it in `in`', () => {
    const [match] = find('tech=reactrouter', 'portfolio-resume')?.matches ?? [];
    assert.equal(match.kind, 'direct');
    assert.equal(match.in?.slug, 'portfolio');
  });

  test('own matches win over piece matches, direct over implied', () => {
    // DevTree lists Node.js test runner itself; its backend piece lists Node.js directly.
    assert.deepEqual(find('tech=node', 'devtree')?.matches, [
      { kind: 'implied', tech: 'node', via: 'express' },
    ]);
    // Reservadito has no TanStack Query itself; its first piece does.
    const [match] = find('tech=tanstackquery', 'reservadito')?.matches ?? [];
    assert.equal(match.kind, 'direct');
    assert.equal(match.in?.slug, 'reservadito-client');
  });

  test('type=backend includes the Reservadito hub in Projects (criterion 4)', () => {
    const results = run('type=backend');
    assert.ok(slugs('type=backend').includes('reservadito'));
    assert.ok(results.every((result) => !result.partOf));
  });

  test('type=backend in All parts puts the matching piece right after its hub (criterion 4)', () => {
    const results = run('view=all&type=backend');
    const hub = results.findIndex((result) => result.project.slug === 'reservadito');
    assert.equal(results[hub + 1].project.slug, 'reservadito-backend');
    assert.equal(results[hub + 1].partOf?.slug, 'reservadito');
    assert.ok(!results.some((result) => result.project.slug === 'reservadito-client'));
  });

  test('All parts lists every piece after its hub, in order, when there are no filters', () => {
    const order = run('view=all').map((result) => result.project.slug);
    assert.deepEqual(order.slice(0, 5), [
      'reservadito',
      'reservadito-client',
      'reservadito-business',
      'reservadito-admin',
      'reservadito-backend',
    ]);
    assert.equal(order.length, projects.length);
  });

  test('a piece is evaluated only on itself (A2)', () => {
    // Contact API has no Node.js, even though its hub has NestJS.
    assert.ok(!slugs('view=all&tech=node').includes('contact-api'));
    assert.ok(slugs('view=all&tech=node').includes('site-content-manager-api'));
  });

  test('javascript includes TypeScript projects and ADN; typescript excludes ADN (criterion 5)', () => {
    const javascript = slugs('tech=javascript');
    for (const slug of slugs('tech=typescript')) assert.ok(javascript.includes(slug), slug);
    assert.ok(javascript.includes('adn-cre4cion'));
    assert.ok(!slugs('tech=typescript').includes('adn-cre4cion'));
  });

  test('techs combine with AND (criterion 7)', () => {
    const both = slugs('tech=react&tech=node');
    const react = slugs('tech=react');
    const node = slugs('tech=node');
    assert.deepEqual(both, react.filter((slug) => node.includes(slug)));
    assert.ok(both.length > 0);
    assert.equal(find('tech=react&tech=node', both[0])?.matches.length, 2);
  });

  test('an impossible combination gives []', () => {
    assert.deepEqual(run('type=landing&tech=nest'), []);
  });
});

describe('facetCounts', () => {
  const base: ProjectFilters = { view: 'projects', techs: [] };

  test('the backend count in Projects equals the type=backend results', () => {
    assert.equal(facetCounts(base, index).types.get('backend'), run('type=backend').length);
  });

  test('type counts follow the view and the selected techs', () => {
    const filters: ProjectFilters = { view: 'all', techs: ['node'] };
    assert.equal(facetCounts(filters, index).types.get('backend'), run('view=all&type=backend&tech=node').length);
  });

  test('tech counts are the results if that tech were added', () => {
    const filters: ProjectFilters = { ...base, type: 'backend' };
    const { techs } = facetCounts(filters, index);
    assert.equal(techs.get('react'), run('type=backend&tech=react').length);
    assert.equal(techs.get('php'), 0);
  });

  test('a selected tech counts the current results', () => {
    assert.equal(facetCounts({ ...base, techs: ['node'] }, index).techs.get('node'), run('tech=node').length);
  });
});
