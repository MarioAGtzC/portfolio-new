import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, test } from 'node:test';
import type { Project } from '../../../types/project.ts';
import { suggestTechs } from './suggest.ts';
import { buildTechIndex, foldText, type TechId } from './tech.ts';

const projects = JSON.parse(
  readFileSync(new URL('../../../data/projects.json', import.meta.url), 'utf8'),
) as Project[];
const index = buildTechIndex(projects);
// Stub count: how many projects (hubs and pieces) have the tech themselves.
const count = (id: TechId) => [...index.own.values()].filter((matches) => matches.has(id)).length;
const ids = (text: string, exclude: TechId[] = []) => suggestTechs(text, { index, count, exclude }).map((s) => s.id);

describe('suggestTechs', () => {
  test('react puts React first, then other React techs', () => {
    const suggestions = suggestTechs('react', { index, count });
    assert.equal(suggestions[0].id, 'react');
    assert.equal(suggestions[0].label, 'React');
    assert.equal(suggestions[0].count, count('react'));
    for (const { label } of suggestions) assert.ok(foldText(label).includes('react'), label);
    assert.ok(ids('react').includes('reactrouter'));
  });

  test('a typo matches nothing', () => {
    assert.deepEqual(ids('recat'), []);
  });

  test('an empty query suggests nothing', () => {
    assert.deepEqual(ids('  '), []);
  });

  test('selected techs are never suggested', () => {
    assert.ok(!ids('react', ['react']).includes('react'));
  });

  test('techs with no results are hidden', () => {
    const suggestions = suggestTechs('react', { index, count: (id) => (id === 'react' ? 0 : count(id)) });
    assert.ok(!suggestions.some((s) => s.id === 'react'));
    assert.ok(!ids('react native').includes('reactnative'), 'React Native is in the catalog but not in the data');
  });

  test('returns at most 8 suggestions', () => {
    assert.equal(ids('a').length, 8);
  });

  test('ignores case, accents and punctuation', () => {
    assert.equal(ids('NODE.JS')[0], 'node');
    assert.equal(ids('NÉST')[0], 'nest');
    assert.equal(ids('tailwind-css')[0], 'tailwindcss');
  });

  test('exact id or alias comes first', () => {
    assert.equal(ids('postgres')[0], 'postgresql');
    assert.equal(ids('ses')[0], 'awsses');
    assert.equal(ids('express')[0], 'express');
  });

  test('ranks prefix, then word start, then contains', () => {
    // TypeScript: label starts with it; openapi-typescript: a word starts with it.
    assert.deepEqual(ids('type'), ['typescript', 'openapitypescript']);
    assert.ok(ids('query').includes('tanstackquery'));
    const script = ids('script');
    assert.ok(script.includes('typescript') && script.includes('javascript'));
    // "express" prefix matches (express-validator…) rank after the exact match.
    assert.ok(ids('express').indexOf('expressvalidator') > 0);
  });

  test('the AWS group is labeled as any service', () => {
    const [first] = suggestTechs('aws', { index, count });
    assert.deepEqual({ id: first.id, label: first.label }, { id: 'aws', label: 'AWS (any service)' });
  });

  test('ties go by count, then alphabetically', () => {
    // After the exact match, every "react" suggestion is a prefix match: one tier.
    const suggestions = suggestTechs('react', { index, count }).slice(1);
    assert.ok(suggestions.length > 1);
    for (let i = 1; i < suggestions.length; i++) {
      const [a, b] = [suggestions[i - 1], suggestions[i]];
      assert.ok(a.count > b.count || (a.count === b.count && a.label.localeCompare(b.label) < 0), `${a.label} before ${b.label}`);
    }
  });
});
