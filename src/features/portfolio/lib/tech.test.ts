import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, test } from 'node:test';
import type { Project } from '../../../types/project.ts';
import { buildTechIndex, normalizeTech, resolveTech, stripVersion } from './tech.ts';

const projects = JSON.parse(
  readFileSync(new URL('../../../data/projects.json', import.meta.url), 'utf8'),
) as Project[];
const index = buildTechIndex(projects);
const own = (slug: string) => {
  const matches = index.own.get(slug);
  assert.ok(matches, `unknown project ${slug}`);
  return matches;
};

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

describe('resolveTech', () => {
  const cases: [string, string | undefined][] = [
    ['Node.js', 'node'],
    ['nodejs', 'node'],
    ['NODEJS', 'node'],
    ['Node.js 24', 'node'],
    ['Amazon SES', 'awsses'],
    ['AWS SES', 'awsses'],
    ['ses', 'awsses'],
    ['Stripe.js', 'stripe'],
    ['Stripe', 'stripe'],
    ['Stripe.js / React Stripe.js', 'stripe'],
    ['postgres', 'postgresql'],
    ['TanStack React Query', 'tanstackquery'],
    ['amazon web services', 'aws'],
    ['Express 5', 'express'],
    ['recat', undefined],
    ['', undefined],
  ];
  for (const [input, expected] of cases) {
    test(`${JSON.stringify(input)} → ${expected}`, () => assert.equal(resolveTech(input, index), expected));
  }

  test('a stack name outside the catalog becomes its own tech', () => {
    assert.equal(resolveTech('Cloudflare R2', index), 'cloudflarer2');
    assert.equal(index.entries.get('cloudflarer2')?.label, 'Cloudflare R2');
    assert.equal(index.entries.get('bootstrap')?.label, 'Bootstrap');
  });
});

describe('buildTechIndex: implications', () => {
  test('NestJS counts as Node.js, TypeScript, JavaScript and Express', () => {
    const matches = own('reservadito-backend');
    for (const tech of ['node', 'typescript', 'javascript', 'express']) {
      assert.deepEqual(matches.get(tech), { kind: 'implied', tech, via: 'nest' });
    }
  });

  test('a direct tech wins over an implied one', () => {
    assert.deepEqual(own('devtree-backend').get('node'), { kind: 'direct', tech: 'node' });
  });

  test('the shortest chain wins: TypeScript → JavaScript', () => {
    assert.deepEqual(own('contact-api').get('javascript'), { kind: 'implied', tech: 'javascript', via: 'typescript' });
  });

  test('JavaScript does not count as TypeScript', () => {
    assert.deepEqual(own('adn-cre4cion').get('javascript'), { kind: 'direct', tech: 'javascript' });
    assert.equal(own('adn-cre4cion').has('typescript'), false);
  });

  test('AWS Lambda does not count as Node.js', () => {
    assert.equal(own('contact-api').has('node'), false);
  });

  test('Stripe.js and Stripe are the same tech', () => {
    assert.deepEqual(own('reservadito-business').get('stripe'), { kind: 'direct', tech: 'stripe' });
    assert.deepEqual(own('maquilaexpress').get('stripe'), { kind: 'direct', tech: 'stripe' });
  });

  test('Next.js counts as React (transitive from the hub stack)', () => {
    assert.deepEqual(own('cashtrackr').get('react'), { kind: 'implied', tech: 'react', via: 'next' });
  });
});

describe('buildTechIndex: groups', () => {
  test('AWS includes AWS Lambda', () => {
    assert.deepEqual(own('contact-api').get('aws'), { kind: 'group', tech: 'aws', member: 'awslambda' });
  });

  test('AWS includes Amazon SES', () => {
    const matches = buildTechIndex([{ ...projects[0], slug: 'x', stack: ['Amazon SES'] }]).own.get('x');
    assert.deepEqual(matches?.get('aws'), { kind: 'group', tech: 'aws', member: 'awsses' });
  });

  test('projects without AWS services are not in the group', () => {
    assert.equal(own('devtree').has('aws'), false);
  });
});
