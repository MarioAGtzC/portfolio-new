import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { normalizeTech, stripVersion } from './tech.ts';

describe('normalizeTech', () => {
  const cases: [string, string][] = [
    ['Node.js', 'node'],
    ['node js', 'node'],
    ['NODEJS', 'node'],
    ['node', 'node'],
    ['js', 'js'],
    ['JavaScript', 'javascript'],
    ['Tailwind CSS', 'tailwindcss'],
    ['bcryptjs', 'bcrypt'],
    ['NestJS', 'nest'],
    ['Next.js', 'next'],
    ['Three.js', 'three'],
    ['ADN Cre4ción', 'adncre4cion'],
    ['Swagger (OpenAPI)', 'swaggeropenapi'],
  ];
  for (const [input, expected] of cases) {
    test(`${input} → ${expected}`, () => assert.equal(normalizeTech(input), expected));
  }
});

describe('stripVersion', () => {
  const cases: [string, string][] = [
    ['React 19', 'React'],
    ['Tailwind CSS v4', 'Tailwind CSS'],
    ['Next.js 14', 'Next.js'],
    ['Express 5', 'Express'],
    ['Node.js 24', 'Node.js'],
    ['OAuth 2.0', 'OAuth'],
    ['CSS3', 'CSS3'],
    ['HTML5', 'HTML5'],
    ['Three.js', 'Three.js'],
    ['React', 'React'],
  ];
  for (const [input, expected] of cases) {
    test(`${input} → ${expected}`, () => assert.equal(stripVersion(input), expected));
  }
});
