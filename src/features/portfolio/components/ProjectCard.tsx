import { Link } from 'react-router-dom';
import Card from '../../../components/ui/Card';
import type { Project } from '../../../types/project';

export interface ProjectCardProps {
  project: Project;
}

function ProjectCard({ project }: ProjectCardProps) {
  const hasCoverImage = Boolean(project.coverImage);
  const hasSummary = Boolean(project.summary);

  return (
    <Link
      to={`/portfolio/${project.slug}`}
      className='group block h-full rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 dark:focus-visible:ring-neutral-100'
    >
      <Card className='flex h-full flex-col overflow-hidden'>
        <div className='aspect-video overflow-hidden bg-neutral-100 dark:bg-neutral-800'>
          {hasCoverImage ? (
            <img
              src={project.coverImage!.src}
              alt={project.coverImage!.alt}
              width={project.coverImage!.width}
              height={project.coverImage!.height}
              loading='lazy'
              decoding='async'
              className='h-full w-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105'
            />
          ) : (
            <div className='flex h-full w-full items-center justify-center p-4 text-center text-sm font-medium text-neutral-500 dark:text-neutral-400'>
              {project.title}
            </div>
          )}
        </div>

        <div className='flex flex-1 flex-col gap-3 p-4'>
          <div className='flex items-start justify-between gap-2'>
            <h3 className='text-base font-semibold text-neutral-900 dark:text-white'>
              {project.title}
            </h3>
            <span className='shrink-0 text-sm text-neutral-500 dark:text-neutral-400'>
              {project.year}
            </span>
          </div>

          <p className='text-sm text-neutral-500 dark:text-neutral-400'>
            {hasSummary ? project.summary : 'Project details coming soon.'}
          </p>

          <div className='mt-auto flex flex-wrap gap-2'>
            {project.stack.map((tech) => (
              <span
                key={tech}
                className='rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300'
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </Card>
    </Link>
  );
}

export default ProjectCard;
