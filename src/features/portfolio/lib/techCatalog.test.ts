import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import type { Project } from '../../../types/project.ts';
import { filterProjects, parseFilters } from './filters.ts';
import { buildTechIndex, catalogKeys, normalizeTech, resolveTech, stripVersion } from './tech.ts';
import { TECH_ENTRIES, TECH_GROUPS } from './techCatalog.ts';

// The live projects.json, which the SCM publishes: only structural checks here, so editing a stack,
// category or slug never fails the deploy. Expectations about specific projects use fixtures/projects.json.
const projects = JSON.parse(
  readFileSync(new URL('../../../data/projects.json', import.meta.url), 'utf8'),
) as Project[];
const ids = new Set([...TECH_ENTRIES, ...TECH_GROUPS].map((tech) => tech.id));

test('ids are unique and already normalized', () => {
  assert.equal(ids.size, TECH_ENTRIES.length + TECH_GROUPS.length);
  for (const id of ids) assert.equal(normalizeTech(id), id, `id "${id}" is not a normalized key`);
});

test('every implied id exists', () => {
  for (const entry of TECH_ENTRIES) {
    for (const target of entry.implies ?? []) assert.ok(ids.has(target), `${entry.id} implies unknown "${target}"`);
  }
});

test('implications have no cycles', () => {
  const implies = new Map(TECH_ENTRIES.map((entry) => [entry.id, entry.implies ?? []]));
  const visit = (id: string, path: string[]) => {
    assert.ok(!path.includes(id), `cycle: ${[...path, id].join(' → ')}`);
    for (const next of implies.get(id) ?? []) visit(next, [...path, id]);
  };
  for (const id of implies.keys()) visit(id, []);
});

test('no key or alias points to two different techs', () => {
  const owner = new Map<string, string>();
  for (const [key, id] of catalogKeys()) {
    assert.ok(key, `${id} has an empty key`);
    const previous = owner.get(key);
    assert.ok(previous === undefined || previous === id, `key "${key}" points to ${previous} and ${id}`);
    owner.set(key, id);
  }
});

test('every stack name in projects.json resolves to a labeled tech', () => {
  const index = buildTechIndex(projects);
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
  const index = buildTechIndex(projects);
  const topLevel = projects
    .filter((project) => !project.parentSlug)
    .sort((a, b) => a.order - b.order)
    .map((project) => project.slug);
  const results = filterProjects(parseFilters(new URLSearchParams(''), index), index);
  assert.deepEqual(
    results.map((result) => result.project.slug),
    topLevel,
  );
});
