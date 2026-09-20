import type { ProjectImage } from '../types/project';

const imageModules = import.meta.glob(
  '../assets/images/projects/*/*.{png,jpg,jpeg,webp,avif}',
  {
    eager: true,
    import: 'default',
    query: '?url',
  },
) as Record<string, string>;

const DEFAULT_WIDTH = 1600;
const DEFAULT_HEIGHT = 900;

function getFileName(path: string) {
  return path.split('/').pop() ?? '';
}

export function getProjectImages(slug: string, title: string) {
  const folder = `../assets/images/projects/${slug}/`;
  const paths = Object.keys(imageModules)
    .filter((path) => path.startsWith(folder))
    .sort((left, right) => {
      const leftIsCover = /^cover\.[^.]+$/i.test(getFileName(left));
      const rightIsCover = /^cover\.[^.]+$/i.test(getFileName(right));
      return (
        Number(rightIsCover) - Number(leftIsCover) ||
        getFileName(left).localeCompare(getFileName(right), undefined, {
          numeric: true,
          sensitivity: 'base',
        })
      );
    });

  const images: ProjectImage[] = paths.map((path, index) => ({
    src: imageModules[path],
    alt: `${title} - imagen ${index + 1}`,
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT,
  }));

  return {
    coverImage: images[0] ?? null,
    images,
  };
}