import type { ProjectImage } from '../types/project';

const imageModules = import.meta.glob(
  '../assets/images/projects/*/*.{png,jpg,jpeg,webp,avif}',
  {
    eager: true,
    import: 'default',
    query: '?url',
  },
) as Record<string, string>;

/**
 * Covers and screenshots share the 1200 × 630 ratio (covers are rendered at 2×
 * by `npm run covers`). Declaring it lets the browser reserve the right space.
 */
const IMAGE_WIDTH = 1200;
const IMAGE_HEIGHT = 630;

const COVER_FILE = /^cover\.[^.]+$/i;

function getFileName(path: string) {
  return path.split('/').pop() ?? '';
}

function toImage(src: string, alt: string): ProjectImage {
  return { src, alt, width: IMAGE_WIDTH, height: IMAGE_HEIGHT };
}

/**
 * `coverImage` is used on cards and as the social preview.
 * `images` is the gallery: the screenshots when there are any, otherwise the cover alone.
 */
export function getProjectImages(slug: string, title: string) {
  const folder = `../assets/images/projects/${slug}/`;
  const paths = Object.keys(imageModules).filter((path) => path.startsWith(folder));

  const coverPath = paths.find((path) => COVER_FILE.test(getFileName(path)));
  const screenshotPaths = paths
    .filter((path) => path !== coverPath)
    .sort((left, right) =>
      getFileName(left).localeCompare(getFileName(right), undefined, {
        numeric: true,
        sensitivity: 'base',
      }),
    );

  const coverImage = coverPath ? toImage(imageModules[coverPath], `${title}: cover`) : null;
  const screenshots = screenshotPaths.map((path, index) =>
    toImage(imageModules[path], `${title}: screenshot ${index + 1}`),
  );

  return {
    coverImage,
    images: screenshots.length > 0 ? screenshots : coverImage ? [coverImage] : [],
  };
}
