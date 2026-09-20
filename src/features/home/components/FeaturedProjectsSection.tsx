import Button from '../../../components/ui/Button';
import FeaturedCarousel from '../../portfolio/components/FeaturedCarousel';
import type { Project } from '../../../types/project';

interface FeaturedProjectsSectionProps {
  projects: Project[];
}

function FeaturedProjectsSection({ projects }: FeaturedProjectsSectionProps) {
  if (projects.length === 0) {
    return null;
  }

  return (
    <section className='relative overflow-hidden pt-16 pb-10'>
      <h2
        aria-hidden='true'
        className='pointer-events-none absolute -top-6 left-0 hidden w-full translate-y-0 leading-none font-black whitespace-nowrap text-neutral-100 select-none sm:block sm:text-[140px] lg:text-[200px] dark:text-neutral-900/60 text-center'
      >
        Portfolio
      </h2>

      <div className='relative mx-auto max-w-7xl px-5 md:px-16'>
        <h2 className='font-recoleta text-4xl font-black text-primary sm:text-5xl'>
          Featured projects
        </h2>
        <p className='mt-4 max-w-2xl text-lg font-light text-neutral-700 dark:text-neutral-300'>
          A selection of projects I've designed and built from start to finish, from multi-tenant platforms to developer tools and client sites. I like getting the architecture right from the beginning, so each one is built to handle real growth, not just work for today.
        </p>
      </div>

      <div className='relative mt-8'>
        <FeaturedCarousel projects={projects} />
      </div>

      <div className='relative mx-auto mt-8 flex max-w-7xl justify-center px-5 md:px-16'>
        <Button href='/portfolio' variant='secondary' size='md'>
          View all projects
        </Button>
      </div>
    </section>
  );
}

export default FeaturedProjectsSection;
