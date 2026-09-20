import Button from '../../../components/ui/Button';
import Icon from '../../../components/ui/Icon';
import type { Project } from '../../../types/project';

interface ProjectHeaderProps {
  project: Project;
  parentProject?: Project;
}

const statusStyles: Record<Project['status'], { badge: string; dot: string }> = {
  live: {
    badge: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400',
    dot: 'bg-green-500',
  },
  'in progress': {
    badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
    dot: 'bg-amber-500',
  },
  archived: {
    badge: 'bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400',
    dot: 'bg-neutral-400',
  },
};

function ProjectHeader({ project, parentProject }: ProjectHeaderProps) {
  return (
    <header>
      {parentProject && (
        <Button
          href={`/portfolio/${parentProject.slug}`}
          variant='ghost'
          size='sm'
          className='-ml-3'
        >
          <Icon name='arrow-left' size={16} />
          Part of: {parentProject.title}
        </Button>
      )}
      <div className='mt-2 flex flex-wrap items-center gap-2'>
        {project.category.map((category) => (
          <span
            key={category}
            className='rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium capitalize text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300'
          >
            {category}
          </span>
        ))}
      <span
        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium capitalize ${statusStyles[project.status].badge}`}
      >
        <span className={`h-1.5 w-1.5 rounded-full ${statusStyles[project.status].dot}`} />
        {project.status}
      </span>
      </div>
      <h1 className='mt-4 text-3xl font-bold text-neutral-900 sm:text-4xl dark:text-white'>
        {project.title}
      </h1>
      <p className='mt-2 text-neutral-500 dark:text-neutral-400'>
        {project.year}
      </p>
    </header>
  );
}

export default ProjectHeader;
