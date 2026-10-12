import ResponsePanel from '../../components/ui/ResponsePanel';
import ProjectCard from '../../features/portfolio/components/ProjectCard';
import { getTopLevelProjects } from '../../data/projects';
import { PORTFOLIO_SEO } from '../../seo/routes';
import { useSeo } from '../../seo/useSeo';

function Portfolio() {
  useSeo(PORTFOLIO_SEO);

  const topLevelProjects = getTopLevelProjects();
  const json = topLevelProjects.map(({ slug, title, year, status, origin, team }) => ({
    slug,
    title,
    year,
    status,
    origin,
    ...(team ? { team } : {}),
  }));

  return (
    <div className='mx-auto flex max-w-[1160px] flex-col gap-[18px] px-5 pt-14 pb-16 md:px-8'>
      <h1 className='text-4xl font-bold tracking-tight sm:text-5xl'>Projects</h1>
      <p className='max-w-2xl text-lg text-ink-2'>
        Every project below is a real case study: the problem it solves, how it was built, and the result.
      </p>

      {topLevelProjects.length > 0 ? (
        <ResponsePanel
          path='/projects'
          status={`200 OK · ${topLevelProjects.length} items`}
          json={json}
          className='mt-2'
        >
          <div className='grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3'>
            {topLevelProjects.map((project, index) => (
              <ProjectCard
                key={project.slug}
                project={project}
                wide={index === 0}
                className={index === 0 ? 'sm:col-span-2' : undefined}
              />
            ))}
          </div>
        </ResponsePanel>
      ) : (
        <div className='rounded-[10px] border border-line p-12 text-center text-muted'>
          No projects published yet.
        </div>
      )}
    </div>
  );
}

export default Portfolio;
