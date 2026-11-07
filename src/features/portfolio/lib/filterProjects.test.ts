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
    // Includes/excludes rather than an exact list: new projects from the SCM may also run on Node.
    const node = slugs('tech=node');
    for (const slug of ['reservadito', 'portfolio-resume', 'cashtrackr', 'devtree']) assert.ok(node.includes(slug), slug);
    for (const slug of ['maquilaexpress', 'adn-cre4cion']) assert.ok(!node.includes(slug), slug);
    assert.deepEqual(find('tech=node', 'reservadito')?.matches, [
      { kind: 'implied', tech: 'node', via: 'nest' },
    ]);
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

describe('filterProjects rules on fixed fixtures', () => {
  // Hand-made projects, so stack edits in the SCM can't break these rules.
  const fixture = (slug: string, order: number, category: Project['category'], stack: string[], parentSlug?: string) =>
    ({ slug, title: slug, order, category, stack, parentSlug }) as Project;
  const fixtures = [
    fixture('hub-b', 2, ['backend'], ['React', 'React Router', 'Node.js'], 'hub'),
    fixture('hub', 2, ['platform'], ['Express']),
    fixture('hub-a', 1, ['web app'], ['React Router', 'AWS Lambda'], 'hub'),
    fixture('solo', 1, ['landing'], ['HTML5']),
  ];
  const fixtureIndex = buildTechIndex(fixtures);
  const runFixture = (query: string) =>
    filterProjects(parseFilters(new URLSearchParams(query), fixtureIndex), fixtureIndex);
  const fixtureSlugs = (query: string) => runFixture(query).map((result) => result.project.slug);
  const hubMatches = (query: string) => runFixture(query).find((result) => result.project.slug === 'hub')!.matches;

  test('All parts lists every piece right after its hub, in order', () => {
    assert.deepEqual(fixtureSlugs(''), ['solo', 'hub']);
    assert.deepEqual(fixtureSlugs('view=all'), ['solo', 'hub', 'hub-a', 'hub-b']);
    assert.equal(runFixture('view=all')[2].partOf?.slug, 'hub');
  });

  test('a hub matches through a piece and names it in `in`', () => {
    assert.deepEqual(hubMatches('tech=reactrouter'), [{ kind: 'direct', tech: 'reactrouter', in: fixtures[2] }]);
    assert.deepEqual(hubMatches('tech=aws'), [{ kind: 'group', tech: 'aws', member: 'awslambda', in: fixtures[2] }]);
  });

  test('own matches win over piece matches, direct over implied', () => {
    // The hub implies Node.js through Express; hub-b lists it directly.
    assert.deepEqual(hubMatches('tech=node'), [{ kind: 'implied', tech: 'node', via: 'express' }]);
    // hub-a only implies React (React Router); hub-b, later in order, has it directly.
    assert.deepEqual(hubMatches('tech=react'), [{ kind: 'direct', tech: 'react', in: fixtures[0] }]);
  });

  test('a hub is judged on its pieces’ types too; a piece only on itself (A2)', () => {
    assert.deepEqual(fixtureSlugs('view=all&type=backend'), ['hub', 'hub-b']);
    assert.deepEqual(fixtureSlugs('view=all&tech=express'), ['hub']);
  });

  test('a tech no project has counts 0', () => {
    assert.equal(facetCounts({ view: 'projects', techs: [] }, fixtureIndex).techs.get('mongodb'), 0);
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
  });

  test('a selected tech counts the current results', () => {
    assert.equal(facetCounts({ ...base, techs: ['node'] }, index).techs.get('node'), run('tech=node').length);
  });
});
