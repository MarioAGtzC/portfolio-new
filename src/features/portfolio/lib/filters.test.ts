import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, test } from 'node:test';
import type { Project } from '../../../types/project.ts';
import { isDefault, parseFilters, serializeFilters, type ProjectFilters } from './filters.ts';
import { buildTechIndex } from './tech.ts';

const projects = JSON.parse(
  readFileSync(new URL('./fixtures/projects.json', import.meta.url), 'utf8'),
) as Project[];
const index = buildTechIndex(projects);
const parse = (query: string) => parseFilters(new URLSearchParams(query), index);
const roundTrip = (query: string) => serializeFilters(parse(query));

describe('parseFilters', () => {
  test('no params give the default filters', () => {
    assert.deepEqual(parse(''), { view: 'projects', techs: [] });
  });

  test('any spelling of a tech resolves to its id', () => {
    for (const query of ['tech=Node.js', 'tech=NODEJS', 'tech=nodejs', 'tech=node']) {
      assert.deepEqual(parse(query).techs, ['node'], query);
      assert.equal(roundTrip(query), 'tech=node', query);
    }
  });

  test('unknown view, type and tech values are dropped', () => {
    assert.deepEqual(parse('view=bad&type=nope&tech=recat&foo=1'), { view: 'projects', techs: [] });
  });

  test('a type that no project has is dropped (D6)', () => {
    assert.equal(parse('type=template').type, undefined);
  });

  test('view=all is kept', () => {
    assert.equal(parse('view=all').view, 'all');
  });

  test('repeated techs are deduplicated, keeping the first order', () => {
    assert.deepEqual(parse('tech=react&tech=Node.js&tech=React&tech=node').techs, ['react', 'node']);
  });

  test('a repeated view or type uses the first value', () => {
    assert.deepEqual(parse('type=backend&type=api').type, 'backend');
  });
});

describe('serializeFilters', () => {
  test('empty filters serialize to an empty string', () => {
    assert.equal(serializeFilters({ view: 'projects', techs: [] }), '');
  });

  test('type=web%20app round-trips', () => {
    assert.equal(parse('type=web%20app').type, 'web app');
    assert.equal(roundTrip('type=web%20app'), 'type=web%20app');
    assert.equal(roundTrip('type=web+app'), 'type=web%20app');
  });

  test('writes the fixed order view → type → tech…', () => {
    assert.equal(
      roundTrip('tech=react&tech=node&type=backend&view=all'),
      'view=all&type=backend&tech=react&tech=node',
    );
  });
});

describe('isDefault', () => {
  test('only the Projects view with no type and no techs is default', () => {
    const base: ProjectFilters = { view: 'projects', techs: [] };
    assert.equal(isDefault(base), true);
    assert.equal(isDefault({ ...base, view: 'all' }), false);
    assert.equal(isDefault({ ...base, type: 'backend' }), false);
    assert.equal(isDefault({ ...base, techs: ['node'] }), false);
  });
});
