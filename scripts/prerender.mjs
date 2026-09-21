import { access, copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');

const exists = (file) =>
  access(file).then(
    () => true,
    () => false,
  );

const vite = await createServer({
  root,
  configFile: false,
  appType: 'custom',
  logLevel: 'error',
  server: { middlewareMode: true, hmr: false, watch: null },
  optimizeDeps: { noDiscovery: true },
});

try {
  const { SITE } = await vite.ssrLoadModule('/src/constants/site.ts');
  const meta = await vite.ssrLoadModule('/src/seo/meta.ts');
  const seoRoutes = await vite.ssrLoadModule('/src/seo/routes.ts');
  const data = await vite.ssrLoadModule('/src/data/projects.ts');

  const { escapeHtml, renderHeadHtml, pageUrl, absoluteUrl, normalizePath } = meta;

  const templatePath = path.join(dist, 'index.html');
  if (!(await exists(templatePath))) {
    throw new Error('dist/index.html not found. Run `vite build` first.');
  }
  const template = await readFile(templatePath, 'utf8');
  if (!template.includes('</head>') || !template.includes('<div id="root"></div>')) {
    throw new Error('dist/index.html does not have the expected </head> and #root markup.');
  }

  const NAV = [
    { href: '/', label: 'Home' },
    { href: '/portfolio/', label: 'Portfolio' },
    { href: '/contact/', label: 'Contact' },
  ];

  function relatedProjects(seo) {
    if (seo.path === '/' || seo.path === '/portfolio') return data.getTopLevelProjects();
    const slug = seo.path.replace('/portfolio/', '');
    return data.getProjectPieces(slug);
  }

  function noscriptHtml(seo) {
    const heading = seo.path === '/' ? SITE.name : seo.title.replace(` | ${SITE.name}`, '');
    const links = [
      ...NAV,
      ...(seo.noindex
        ? []
        : relatedProjects(seo).map((project) => ({
            href: `/portfolio/${project.slug}/`,
            label: project.title,
          }))),
    ];
    const items = links
      .map((link) => `<li><a href="${link.href}">${escapeHtml(link.label)}</a></li>`)
      .join('');
    return `<noscript><h1>${escapeHtml(heading)}</h1><p>${escapeHtml(seo.description)}</p><nav><ul>${items}</ul></nav></noscript>`;
  }

  function render(seo) {
    return template
      .replace(/<title>[^<]*<\/title>/, () => `<title>${escapeHtml(seo.title)}</title>`)
      .replace('</head>', () => `  ${renderHeadHtml(seo)}\n  </head>`)
      .replace('<div id="root"></div>', (match) => `${match}\n    ${noscriptHtml(seo)}`);
  }

  function outputFile(routePath) {
    const segments = normalizePath(routePath).split('/').filter(Boolean);
    return path.join(dist, ...segments, 'index.html');
  }

  const indexable = seoRoutes.getIndexableSeo();
  const report = [];

  for (const seo of indexable) {
    const file = outputFile(seo.path);
    await mkdir(path.dirname(file), { recursive: true });
    await writeFile(file, render(seo));

    const warnings = [];
    if (seo.title.length > 65) warnings.push(`title ${seo.title.length} chars`);
    if (seo.description.length > 160) warnings.push(`description ${seo.description.length} chars`);
    if (seo.description.length < 70) warnings.push(`description only ${seo.description.length} chars`);
    report.push({ path: normalizePath(seo.path), title: seo.title.length, description: seo.description.length, warnings: warnings.join('; ') });
  }

  await writeFile(path.join(dist, '404.html'), render(seoRoutes.NOT_FOUND_SEO));

  const sitemap = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...indexable.map((seo) => `  <url><loc>${escapeHtml(pageUrl(seo.path))}</loc></url>`),
    '</urlset>',
    '',
  ].join('\n');
  await writeFile(path.join(dist, 'sitemap.xml'), sitemap);

  const robots = ['User-agent: *', 'Allow: /', '', `Sitemap: ${absoluteUrl('/sitemap.xml')}`, ''].join('\n');
  await writeFile(path.join(dist, 'robots.txt'), robots);

  await mkdir(path.join(dist, 'og'), { recursive: true });
  for (const project of data.projects) {
    if (!project.coverImage) continue;
    const source = path.join(root, 'src/assets/images/projects', project.slug, 'cover.png');
    if (await exists(source)) {
      await copyFile(source, path.join(dist, 'og', `${project.slug}.png`));
    } else {
      console.warn(`[seo] ${project.slug}: cover.png not found (expected a PNG). og:image will 404.`);
    }
  }

  console.log(`[seo] Prerendered ${indexable.length} routes + 404.html for ${SITE.siteUrl}`);
  console.table(report);
} finally {
  await vite.close();
}
