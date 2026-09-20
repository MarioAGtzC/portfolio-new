import Button from '../../../components/ui/Button';
import Icon from '../../../components/ui/Icon';
import type { Project } from '../../../types/project';

interface ProjectMetadataProps {
  project: Project;
}

function ProjectMetadata({ project }: ProjectMetadataProps) {
  return (
    <aside className='flex flex-col gap-6'>
      <div>
        <h3 className='text-sm font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400'>
          Role
        </h3>
        <p className='mt-2 text-neutral-900 dark:text-white'>{project.role}</p>
      </div>

      <div>
        <h3 className='text-sm font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400'>
          Stack
        </h3>
        <div className='mt-2 flex flex-wrap gap-2'>
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

      {(project.liveUrl || project.repoUrl) && (
        <div className='flex flex-col gap-3'>
          {project.liveUrl && (
            <Button
              href={project.liveUrl}
              target='_blank'
              rel='noopener noreferrer'
              variant='primary'
              size='md'
            >
              <Icon name='external-link' size={18} />
              View live site
            </Button>
          )}
          {project.repoUrl && (
            <Button
              href={project.repoUrl}
              target='_blank'
              rel='noopener noreferrer'
              variant='secondary'
              size='md'
            >
              <Icon name='github' size={18} />
              View repository
            </Button>
          )}
        </div>
      )}
    </aside>
  );
}

export default ProjectMetadata;
