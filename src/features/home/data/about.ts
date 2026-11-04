import aboutJson from '../../../data/about.json';
import type { About } from '../../../data/schemas';

export type AboutCategory = About['categories'][number];

// about.json is published by the Site Content Manager and checked against its schema at build time.
export const ABOUT: About = aboutJson;

export const ABOUT_CATEGORIES: AboutCategory[] = ABOUT.categories;
