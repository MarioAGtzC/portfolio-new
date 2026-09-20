import FeaturedCarousel from '../../portfolio/components/FeaturedCarousel';
import type { Project } from '../../../types/project';

interface RelatedProjectsCarouselProps {
  projects: Project[];
}

function RelatedProjectsCarousel({ projects }: RelatedProjectsCarouselProps) {
  if (projects.length === 0) {
    return null;
  }

  return (
    <section className='mt-16'>
      <div className='mx-auto max-w-5xl border-t border-neutral-200 px-4 pt-12 dark:border-neutral-800'>
        <h2 className='text-2xl font-bold text-neutral-900 dark:text-white'>
          Pieces of this project
        </h2>
      </div>
      <div className='mt-6'>
        <FeaturedCarousel projects={projects} />
      </div>
    </section>
  );
}

export default RelatedProjectsCarousel;
