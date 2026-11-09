import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, test } from 'node:test';
import { techsSchema, type Techs } from '../../../data/schemas.ts';
import type { Project } from '../../../types/project.ts';
import { filterProjects, parseFilters } from './filters.ts';
import { buildTechIndex, resolveTech, stripVersion } from './tech.ts';

const read = <T>(path: string) => JSON.parse(readFileSync(new URL(path, import.meta.url), 'utf8')) as T;

describe('techs.json schema (the catalog rules the API also enforces)', () => {
  const techs = read<Techs>('./fixtures/techs.json');
  const [node, typescript] = techs.entries;
  const paths = (catalog: unknown) => {
    const result = techsSchema.safeParse(catalog);
    return result.success ? [] : result.error.issues.map((issue) => issue.path.join('.'));
  };
  const withEntries = (...entries: unknown[]) => ({ ...techs, entries: [...entries, ...techs.entries.slice(2)] });

  test('the catalog is valid', () => {
    assert.deepEqual(paths(techs), []);
  });

  test('ids are normalized and unique across entries and groups', () => {
    assert.ok(paths(withEntries({ ...node, id: 'Node.js' }, typescript)).includes('entries.0.id'));
    assert.ok(paths({ ...techs, groups: [{ ...techs.groups[0], id: 'node' }] }).includes('groups.0.id'));
  });

  test('implies names existing entries, without cycles', () => {
    assert.ok(paths(withEntries({ ...node, implies: ['deno'] }, typescript)).includes('entries.0.implies.0'));
    assert.ok(paths(withEntries({ ...node, implies: ['aws'] }, typescript)).includes('entries.0.implies.0'));
    assert.ok(paths(withEntries({ ...node, implies: ['typescript'] }, { ...typescript, implies: ['node'] })).includes('entries.0.implies'));
  });

  test('no id, label or alias names two techs', () => {
    assert.ok(paths(withEntries(node, { ...typescript, aliases: ['Node.js'] })).includes('entries.1.aliases.0'));
  });

  test('a name without letters or digits is rejected on its own', () => {
    const result = techsSchema.safeParse(withEntries(node, { ...typescript, aliases: ['++'] }));
    assert.deepEqual(
      result.success ? [] : result.error.issues.map(({ path, message }) => [path.join('.'), message]),
      [['entries.1.aliases.0', 'Needs letters or digits']],
    );
  });

  test('a group needs a prefix', () => {
    assert.ok(paths({ ...techs, groups: [{ ...techs.groups[0], prefixes: [] }] }).includes('groups.0.prefixes'));
  });
});

// The live projects.json and techs.json, which the SCM publishes: only structural checks here, so editing
// content never fails the deploy. Expectations about specific projects use the fixtures.
describe('live content', () => {
  const projects = read<Project[]>('../../../data/projects.json');
  const index = buildTechIndex(projects, read<Techs>('../../../data/techs.json'));

  test('every stack name in projects.json resolves to a labeled tech', () => {
    for (const project of projects) {
      for (const name of project.stack) {
        const id = resolveTech(name, index);
        assert.ok(id, `${project.slug}: "${name}" does not resolve`);
        assert.ok(index.entries.get(id)?.label, `${project.slug}: "${name}" → ${id} has no label`);
        assert.ok(index.own.get(project.slug)?.has(id), `${project.slug}: ${id} missing from its techs`);
      }
    }
    // Sanity: version stripping groups React 18 and React 19 under one tech.
    assert.equal(resolveTech(stripVersion('React 18'), index), resolveTech('React 19', index));
  });

  test('default filters give the top-level projects in order', () => {
    const topLevel = projects
      .filter((project) => !project.parentSlug)
      .sort((a, b) => a.order - b.order)
      .map((project) => project.slug);
    const results = filterProjects(parseFilters(new URLSearchParams(''), index), index);
    assert.deepEqual(results.map((result) => result.project.slug), topLevel);
  });
});
