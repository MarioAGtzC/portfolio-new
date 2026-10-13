import { SITE } from '../constants/site';

export type JsonLd = Record<string, unknown>;

export interface SeoMeta {
  title: string;
  description: string;
  path: string;
  image?: string;
  imageAlt?: string;
  imageSize?: { width: number; height: number };
  noindex?: boolean;
  jsonLd?: JsonLd;
}

export interface HeadTag {
  key: string;
  tag: 'meta' | 'link';
  attrs: Record<string, string>;
}

export const DEFAULT_OG_IMAGE = '/og-image.jpg';
export const DEFAULT_OG_IMAGE_ALT = `${SITE.name}: ${SITE.role}`;
const DEFAULT_OG_SIZE = { width: 1200, height: 630 };

export const KNOWS_ABOUT = [
  'TypeScript',
  'Node.js',
  'NestJS',
  'React',
  'Next.js',
  'AWS Lambda',
  'Amazon Connect and Lex',
  'Serverless architecture',
  'PostgreSQL',
  'Terraform',
  'Stripe Connect',
  'REST API design',
];

export function normalizePath(path: string): string {
  const clean = path.split(/[?#]/)[0] || '/';
  const withLeadingSlash = clean.startsWith('/') ? clean : `/${clean}`;
  return withLeadingSlash === '/'
    ? '/'
    : `${withLeadingSlash.replace(/\/+$/, '')}/`;
}

export function absoluteUrl(pathOrUrl: string): string {
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  const origin = SITE.siteUrl.replace(/\/+$/, '');
  return `${origin}${pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`}`;
}

export function pageUrl(path: string): string {
  return absoluteUrl(normalizePath(path));
}

export function withSiteName(title: string): string {
  return title.includes(SITE.name) ? title : `${title} | ${SITE.name}`;
}

export function truncate(text: string, max = 155): string {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;

  const cut = clean.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(' ');
  const base = lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut;
  return `${base.replace(/[\s,;:.\-–]+$/, '')}…`;
}

export function getHeadTags(meta: SeoMeta): HeadTag[] {
  const robots: HeadTag = {
    key: 'robots',
    tag: 'meta',
    attrs: {
      name: 'robots',
      content: meta.noindex
        ? 'noindex, nofollow'
        : 'index, follow, max-image-preview:large',
    },
  };
  const description: HeadTag = {
    key: 'description',
    tag: 'meta',
    attrs: { name: 'description', content: meta.description },
  };

  if (meta.noindex) return [description, robots];

  const url = pageUrl(meta.path);
  const image = absoluteUrl(meta.image ?? DEFAULT_OG_IMAGE);
  const imageAlt = meta.imageAlt ?? DEFAULT_OG_IMAGE_ALT;
  const size = meta.imageSize ?? (meta.image ? undefined : DEFAULT_OG_SIZE);

  const og = (property: string, content: string): HeadTag => ({
    key: property,
    tag: 'meta',
    attrs: { property, content },
  });
  const twitter = (name: string, content: string): HeadTag => ({
    key: name,
    tag: 'meta',
    attrs: { name, content },
  });

  const tags: HeadTag[] = [
    description,
    robots,
    { key: 'canonical', tag: 'link', attrs: { rel: 'canonical', href: url } },

    og('og:type', 'website'),
    og('og:site_name', SITE.name),
    og('og:locale', SITE.locale),
    og('og:title', meta.title),
    og('og:description', meta.description),
    og('og:url', url),
    og('og:image', image),
    og('og:image:alt', imageAlt),

    twitter('twitter:card', 'summary_large_image'),
    twitter('twitter:title', meta.title),
    twitter('twitter:description', meta.description),
    twitter('twitter:image', image),
    twitter('twitter:image:alt', imageAlt),
  ];

  if (size) {
    tags.push(
      og('og:image:width', String(size.width)),
      og('og:image:height', String(size.height)),
    );
  }

  return tags;
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export function serializeJsonLd(data: JsonLd): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

export function renderHeadHtml(meta: SeoMeta): string {
  const lines = getHeadTags(meta).map(({ key, tag, attrs }) => {
    const attributes = Object.entries(attrs)
      .map(([name, value]) => `${name}="${escapeHtml(value)}"`)
      .join(' ');
    return `<${tag} data-seo="${key}" ${attributes} />`;
  });

  if (meta.jsonLd && !meta.noindex) {
    lines.push(
      `<script type="application/ld+json" data-seo="jsonld">${serializeJsonLd(meta.jsonLd)}</script>`,
    );
  }

  return lines.join('\n    ');
}

export const personId = () => `${pageUrl('/')}#person`;
export const websiteId = () => `${pageUrl('/')}#website`;

export function webSiteNode(): JsonLd {
  return {
    '@type': 'WebSite',
    '@id': websiteId(),
    url: pageUrl('/'),
    name: `${SITE.name}: Portfolio`,
    inLanguage: 'en',
    publisher: { '@id': personId() },
  };
}

export function personNode(): JsonLd {
  const sameAs = Array.from(
    new Set(
      [
        SITE.social.github,
        SITE.social.linkedin,
        SITE.social.instagram,
        SITE.social.resume,
      ].filter((url) => url.replace(/\/+$/, '') !== SITE.siteUrl),
    ),
  );

  return {
    '@type': 'Person',
    '@id': personId(),
    name: SITE.name,
    jobTitle: 'Backend Software Engineer',
    url: pageUrl('/'),
    email: `mailto:${SITE.email}`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: SITE.location.city,
      addressRegion: SITE.location.region,
      addressCountry: SITE.location.country,
    },
    knowsAbout: KNOWS_ABOUT,
    sameAs,
  };
}

export function breadcrumbNode(items: { name: string; path: string }[]): JsonLd {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: pageUrl(item.path),
    })),
  };
}

export function graph(...nodes: JsonLd[]): JsonLd {
  return { '@context': 'https://schema.org', '@graph': nodes };
}