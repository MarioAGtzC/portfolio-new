import ProjectCard from '../../features/portfolio/components/ProjectCard';
import { getTopLevelProjects } from '../../data/projects';
import { PORTFOLIO_SEO } from '../../seo/routes';
import { useSeo } from '../../seo/useSeo';

function Portfolio() {
  useSeo(PORTFOLIO_SEO);

  const topLevelProjects = getTopLevelProjects();

  return (
    <div className='mx-auto max-w-7xl px-4 py-20'>
      <h1 className='text-3xl font-bold text-neutral-900 sm:text-4xl dark:text-white'>
        Projects
      </h1>
      <p className='mt-2 max-w-2xl text-neutral-500 dark:text-neutral-400'>
        Every project below is a real case study: the problem it solves, how it was built, and the result. Some are solo platforms built from scratch, others are client work delivered start to finish.
      </p>

      {topLevelProjects.length > 0 ? (
        <div className='mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
          {topLevelProjects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      ) : (
        <div className='mt-8 rounded-xl border border-neutral-200 p-12 text-center text-neutral-500 dark:border-neutral-800 dark:text-neutral-400'>
          No projects published yet.
        </div>
      )}
    </div>
  );
}

export default Portfolio;
