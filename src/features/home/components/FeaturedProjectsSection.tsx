import { Link } from 'react-router-dom';
import ResponsePanel from '../../../components/ui/ResponsePanel';
import { getTopLevelProjects } from '../../../data/projects';
import ProjectCard from '../../portfolio/components/ProjectCard';
import type { Project } from '../../../types/project';

interface FeaturedProjectsSectionProps {
  projects: Project[];
}

function FeaturedProjectsSection({ projects }: FeaturedProjectsSectionProps) {
  if (projects.length === 0) {
    return null;
  }

  const total = getTopLevelProjects().length;
  const json = projects.map(({ slug, title, year, status, origin, team, stack }) => ({
    slug,
    title,
    year,
    status,
    origin,
    ...(team ? { team } : {}),
    stack,
  }));

  return (
    <section className='flex flex-col gap-[18px]'>
      <h2 className='text-[30px] font-semibold'>Featured projects</h2>
      <ResponsePanel
        path='/projects?featured=true'
        status={`200 OK · ${projects.length} items`}
        json={json}
      >
        <div className='flex flex-col gap-4'>
          <div className='grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3'>
            {projects.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
          <Link
            to='/portfolio'
            className='self-end font-geist-mono text-[13px] text-accent hover:underline'
          >
            GET /projects → all {total}
          </Link>
        </div>
      </ResponsePanel>
    </section>
  );
}

export default FeaturedProjectsSection;
