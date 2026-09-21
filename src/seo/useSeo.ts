import { useEffect } from 'react';
import { getHeadTags, serializeJsonLd, type SeoMeta } from './meta';

const SEO_ATTR = 'data-seo';

function upsert(
  key: string,
  tagName: string,
  attrs: Record<string, string>,
  text?: string,
) {
  let element = document.head.querySelector<HTMLElement>(
    `[${SEO_ATTR}="${key}"]`,
  );

  if (!element) {
    element = document.createElement(tagName);
    element.setAttribute(SEO_ATTR, key);
    document.head.appendChild(element);
  }

  for (const [name, value] of Object.entries(attrs)) {
    element.setAttribute(name, value);
  }

  if (text !== undefined) {
    element.textContent = text;
  }
}

export function applySeo(meta: SeoMeta) {
  document.title = meta.title;

  const tags = getHeadTags(meta);
  const activeKeys = new Set(tags.map((tag) => tag.key));

  for (const tag of tags) {
    upsert(tag.key, tag.tag, tag.attrs);
  }

  if (meta.jsonLd && !meta.noindex) {
    upsert('jsonld', 'script', { type: 'application/ld+json' }, serializeJsonLd(meta.jsonLd));
    activeKeys.add('jsonld');
  }

  document.head.querySelectorAll(`[${SEO_ATTR}]`).forEach((element) => {
    if (!activeKeys.has(element.getAttribute(SEO_ATTR) ?? '')) {
      element.remove();
    }
  });
}

export function useSeo(meta: SeoMeta) {
  useEffect(() => {
    applySeo(meta);
  }, [meta]);
}