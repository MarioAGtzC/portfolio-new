/**
 * Lookup key for a technology name: lowercase, no accents, letters and digits only,
 * and no trailing "js" (`Node.js`, `nodejs` and `node` all give `node`).
 */
export function normalizeTech(text: string): string {
  const key = text
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
  // Keep short keys like "js" itself; only strip the suffix when 3+ characters remain.
  return key.endsWith('js') && key.length - 2 >= 3 ? key.slice(0, -2) : key;
}

/** Drops a trailing version from a stack name: `React 19`, `Tailwind CSS v4`, `OAuth 2.0`. */
export function stripVersion(name: string): string {
  return name.replace(/\s+v?\d+(\.\d+)*$/i, '').trim();
}
