import { useCallback, useSyncExternalStore } from 'react';
import Icon from '../../../components/ui/Icon';
import ProjectCard from './ProjectCard';
import { useLoopCarousel } from '../hooks/useLoopCarousel';
import type { Project } from '../../../types/project';

export interface FeaturedCarouselProps {
  projects: Project[];
}

const EMPTY_SCROLL_SNAPS: number[] = [];

function FeaturedCarousel({ projects }: FeaturedCarouselProps) {
  const { emblaRef, emblaApi, isCarousel, repeatCount } = useLoopCarousel(
    projects.length,
  );

  const subscribe = useCallback(
    (callback: () => void) => {
      if (!emblaApi) return () => {};
      emblaApi.on('select', callback);
      emblaApi.on('reInit', callback);
      return () => {
        emblaApi.off('select', callback);
        emblaApi.off('reInit', callback);
      };
    },
    [emblaApi],
  );

  const selectedSnap = useSyncExternalStore(
    subscribe,
    () => emblaApi?.selectedScrollSnap() ?? 0,
  );
  const scrollSnaps = useSyncExternalStore(
    subscribe,
    () => emblaApi?.scrollSnapList() ?? EMPTY_SCROLL_SNAPS,
  );

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const scrollToProject = useCallback(
    (realIndex: number) => {
      if (!emblaApi) return;
      const current = emblaApi.selectedScrollSnap();
      const total = emblaApi.scrollSnapList().length;
      let nearest = realIndex;
      let nearestDistance = Infinity;
      for (let i = realIndex; i < total; i += projects.length) {
        const distance = Math.abs(i - current);
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearest = i;
        }
      }
      emblaApi.scrollTo(nearest);
    },
    [emblaApi, projects.length],
  );

  if (!isCarousel) {
    return (
      <div className='mx-auto flex max-w-7xl flex-wrap justify-center gap-4 px-5 md:px-16'>
        {projects.map((project) => (
          <div key={project.slug} className='w-75 md:w-112.5 lg:w-162.5'>
            <ProjectCard project={project} />
          </div>
        ))}
      </div>
    );
  }

  const slides = Array.from({ length: repeatCount }, (_, copyIndex) =>
    projects.map((project) => ({ project, key: `${project.slug}-${copyIndex}` })),
  ).flat();

  const selectedIndex = selectedSnap % projects.length;

  return (
    <div className='relative'>
      <div className='overflow-hidden' ref={emblaRef}>
        <div className='-ml-4 flex'>
          {slides.map(({ project, key }) => (
            <div
              key={key}
              className='w-75 shrink-0 grow-0 pl-4 md:w-112.5 lg:w-162.5'
            >
              <ProjectCard project={project} />
            </div>
          ))}
        </div>
      </div>

      {scrollSnaps.length > 1 && (
        <div className='relative mx-auto mt-4 flex max-w-7xl items-center px-5 md:px-16'>
          <div className='absolute left-1/2 flex -translate-x-1/2 items-center gap-1'>
            {projects.map((project, index) => (
              <button
                key={project.slug}
                type='button'
                onClick={() => scrollToProject(index)}
                aria-label={`Go to project ${index + 1}`}
                className='p-1.5'
              >
                <span
                  className={`block h-2 w-2 rounded-full transition-colors duration-200 ${
                    index === selectedIndex
                      ? 'bg-primary'
                      : 'bg-neutral-300 dark:bg-neutral-700'
                  }`}
                />
              </button>
            ))}
          </div>

          <div className='ml-auto flex gap-2'>
            <button
              type='button'
              onClick={scrollPrev}
              aria-label='Previous'
              className='inline-flex items-center justify-center rounded-full border border-neutral-200 p-2 text-neutral-900 transition-colors duration-200 hover:bg-neutral-100 dark:border-neutral-800 dark:text-white dark:hover:bg-neutral-800'
            >
              <Icon name='arrow-left' size={20} />
            </button>
            <button
              type='button'
              onClick={scrollNext}
              aria-label='Next'
              className='inline-flex items-center justify-center rounded-full border border-neutral-200 p-2 text-neutral-900 transition-colors duration-200 hover:bg-neutral-100 dark:border-neutral-800 dark:text-white dark:hover:bg-neutral-800'
            >
              <Icon name='arrow-right' size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default FeaturedCarousel;
