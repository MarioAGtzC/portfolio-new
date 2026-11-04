import { getParentProject, getTopLevelProjects, projects } from '../data/projects';
import type { Seo } from '../data/schemas';
import seoJson from '../data/seo.json';
import type { Project } from '../types/project';
import {
  absoluteUrl,
  breadcrumbNode,
  graph,
  pageUrl,
  personNode,
  truncate,
  webSiteNode,
  websiteId,
  withSiteName,
  personId,
  type SeoMeta,
} from './meta';
import { SITE } from '../constants/site';

// seo.json is published by the Site Content Manager and checked against its schema at build time.
const SEO: Seo = seoJson;

const personRef = () => ({
  '@type': 'Person',
  '@id': personId(),
  name: SITE.name,
  url: pageUrl('/'),
});
const websiteRef = () => ({
  '@type': 'WebSite',
  '@id': websiteId(),
  name: `${SITE.name}: Portfolio`,
  url: pageUrl('/'),
});

export const HOME_SEO: SeoMeta = {
  title: withSiteName(SEO.home.title),
  description: SEO.home.description,
  path: '/',
  jsonLd: graph(webSiteNode(), personNode()),
};

export const PORTFOLIO_SEO: SeoMeta = {
  title: withSiteName(SEO.portfolio.title),
  description: SEO.portfolio.description,
  path: '/portfolio',
  jsonLd: graph(
    {
      '@type': 'CollectionPage',
      '@id': `${pageUrl('/portfolio')}#page`,
      url: pageUrl('/portfolio'),
      name: SEO.portfolio.title,
      isPartOf: websiteRef(),
      about: personRef(),
      mainEntity: {
        '@type': 'ItemList',
        itemListElement: getTopLevelProjects().map((project, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: project.title,
          url: pageUrl(`/portfolio/${project.slug}`),
        })),
      },
    },
    breadcrumbNode([
      { name: 'Home', path: '/' },
      { name: 'Portfolio', path: '/portfolio' },
    ]),
  ),
};

export const CONTACT_SEO: SeoMeta = {
  title: withSiteName(SEO.contact.title),
  description: SEO.contact.description,
  path: '/contact',
  jsonLd: graph(
    {
      '@type': 'ContactPage',
      '@id': `${pageUrl('/contact')}#page`,
      url: pageUrl('/contact'),
      name: 'Contact Mario Gutiérrez',
      isPartOf: websiteRef(),
      about: personRef(),
    },
    breadcrumbNode([
      { name: 'Home', path: '/' },
      { name: 'Contact', path: '/contact' },
    ]),
  ),
};

export const NOT_FOUND_SEO: SeoMeta = {
  title: withSiteName('Page not found'),
  description: 'The page you\'re looking for doesn\'t exist.',
  path: '/404',
  noindex: true,
};

export function getProjectOgImage(project: Project): string | undefined {
  return project.coverImage ? `/og/${project.slug}.jpg` : undefined;
}

export function getProjectSeo(project: Project): SeoMeta {
  const parent = getParentProject(project);
  const path = `/portfolio/${project.slug}`;
  const url = pageUrl(path);
  const image = getProjectOgImage(project);

  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Portfolio', path: '/portfolio' },
    ...(parent
      ? [{ name: parent.title, path: `/portfolio/${parent.slug}` }]
      : []),
    { name: project.title, path },
  ];

  return {
    title: withSiteName(project.title),
    description: truncate(project.summary),
    path,
    image,
    imageAlt: image ? `${project.title}: project preview` : undefined,
    jsonLd: graph(
      {
        '@type': 'CreativeWork',
        '@id': `${url}#project`,
        url,
        name: project.title,
        description: project.summary,
        inLanguage: 'en',
        dateCreated: String(project.year),
        creativeWorkStatus: project.status,
        keywords: project.stack.join(', '),
        genre: project.category.join(', '),
        author: personRef(),
        ...(image ? { image: absoluteUrl(image) } : {}),
        ...(project.liveUrl ? { sameAs: project.liveUrl } : {}),
        ...(parent
          ? {
              isPartOf: {
                '@type': 'CreativeWork',
                '@id': `${pageUrl(`/portfolio/${parent.slug}`)}#project`,
                name: parent.title,
                url: pageUrl(`/portfolio/${parent.slug}`),
              },
            }
          : {}),
      },
      breadcrumbNode(crumbs),
    ),
  };
}

export function getIndexableSeo(): SeoMeta[] {
  return [
    HOME_SEO,
    PORTFOLIO_SEO,
    ...projects.map(getProjectSeo),
    CONTACT_SEO,
  ];
}