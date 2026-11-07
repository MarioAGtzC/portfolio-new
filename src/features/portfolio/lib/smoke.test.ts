import assert from 'node:assert/strict';
import { test } from 'node:test';

// Proves TypeScript tests run under node --test; replaced by real tests in T2.
test('runs TypeScript tests', () => {
  const value: number = 1 + 1;
  assert.equal(value, 2);
});
