// Renders design/covers/<slug>.html into the images the site uses.
//
//   npm run covers              all covers
//   npm run covers -- resume    only the given slugs
//
// Outputs per cover:
//   src/assets/images/projects/<slug>/cover.webp   shown on the site (2× for sharp displays)
//   public/og/<slug>.jpg                            1200 × 630 social preview for the project page
// Site-wide previews (see SITE_OG below) are written in addition.
//
// Requires: npm i -D playwright sharp && npx playwright install chromium

import { mkdir, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { chromium } from 'playwright';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const coversDir = path.join(root, 'design/covers');
const projectsDir = path.join(root, 'src/assets/images/projects');
const ogDir = path.join(root, 'public/og');

const WIDTH = 1200;
const HEIGHT = 630;
const SCALE = 2;
const WEBP_QUALITY = 85;
const JPEG_QUALITY = 85;
const READY_TIMEOUT_MS = 15_000;

// Covers that also produce a site-wide preview image.
const SITE_OG = {
  portfolio: path.join(root, 'public/og-image.jpg'),
  // Copy this one into the resume repo as public/og-image.jpg.
  resume: path.join(coversDir, 'out/og-resume.jpg'),
};

const kb = async (file) => `${Math.round((await stat(file)).size / 1024)} KB`;
const rel = (file) => path.relative(root, file).replaceAll(path.sep, '/');

async function listCovers() {
  const files = await readdir(coversDir);
  return files
    .filter((file) => file.endsWith('.html') && !file.startsWith('_'))
    .map((file) => file.replace(/\.html$/, ''))
    .sort();
}

async function capture(page, slug) {
  const url = pathToFileURL(path.join(coversDir, `${slug}.html`)).href;
  await page.goto(url, { waitUntil: 'load' });

  // Wait for the fonts, and for any data the cover loads itself (window.coverReady).
  await page.evaluate(async (timeout) => {
    await document.fonts.ready;
    if (window.coverReady) {
      await Promise.race([window.coverReady, new Promise((resolve) => setTimeout(resolve, timeout))]);
    }
  }, READY_TIMEOUT_MS);

  const note = await page.evaluate(() => window.coverNote);
  const png = await page.screenshot({ type: 'png', clip: { x: 0, y: 0, width: WIDTH, height: HEIGHT } });
  return { png, note };
}

async function writeOutputs(slug, png) {
  const coverFile = path.join(projectsDir, slug, 'cover.webp');
  const ogFile = path.join(ogDir, `${slug}.jpg`);
  const ogBuffer = await sharp(png)
    .resize(WIDTH, HEIGHT)
    .flatten({ background: '#000000' })
    .jpeg({ quality: JPEG_QUALITY, mozjpeg: true })
    .toBuffer();

  await mkdir(path.dirname(coverFile), { recursive: true });
  await mkdir(ogDir, { recursive: true });
  await sharp(png).webp({ quality: WEBP_QUALITY }).toFile(coverFile);
  await sharp(ogBuffer).toFile(ogFile);

  const written = [coverFile, ogFile];

  if (SITE_OG[slug]) {
    await mkdir(path.dirname(SITE_OG[slug]), { recursive: true });
    await sharp(ogBuffer).toFile(SITE_OG[slug]);
    written.push(SITE_OG[slug]);
  }

  return written;
}

const available = await listCovers();
const requested = process.argv.slice(2);
const unknown = requested.filter((slug) => !available.includes(slug));

if (unknown.length > 0) {
  console.error(`[covers] Unknown cover(s): ${unknown.join(', ')}`);
  console.error(`[covers] Available: ${available.join(', ')}`);
  process.exit(1);
}

const slugs = requested.length > 0 ? requested : available;
const browser = await chromium.launch();

try {
  const page = await browser.newPage({
    viewport: { width: WIDTH, height: HEIGHT },
    deviceScaleFactor: SCALE,
  });

  for (const slug of slugs) {
    const { png, note } = await capture(page, slug);
    const files = await writeOutputs(slug, png);
    const sizes = await Promise.all(files.map(async (file) => `${rel(file)} (${await kb(file)})`));
    console.log(`[covers] ${slug}${note ? ` — ${note}` : ''}\n  ${sizes.join('\n  ')}`);
  }

  console.log(`[covers] Rendered ${slugs.length} cover(s).`);
} finally {
  await browser.close();
}
