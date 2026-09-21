import { getParentProject, getTopLevelProjects, projects } from '../data/projects';
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
  title: `${SITE.name} | Full-Stack Developer (Backend & AWS)`,
  description: 'Full-stack developer building backend APIs, serverless AWS architectures and web products with TypeScript, Node.js, NestJS and React. Based in Mexico.',
  path: '/',
  jsonLd: graph(webSiteNode(), personNode()),
};

export const PORTFOLIO_SEO: SeoMeta = {
  title: withSiteName('Portfolio: Full-Stack & Backend Projects'),
  description: 'Case studies of the platforms, APIs and web apps I\'ve built end to end, each with the problem it solves, the process behind it and the results.',
  path: '/portfolio',
  jsonLd: graph(
    {
      '@type': 'CollectionPage',
      '@id': `${pageUrl('/portfolio')}#page`,
      url: pageUrl('/portfolio'),
      name: 'Portfolio: Full-Stack & Backend Projects',
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
  title: withSiteName('Contact & Hire Me'),
  description: 'Need a full-stack developer for your website, app or backend? Send me a message and let\'s talk about your project. Open to remote work worldwide.',
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
  return project.coverImage ? `/og/${project.slug}.png` : undefined;
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