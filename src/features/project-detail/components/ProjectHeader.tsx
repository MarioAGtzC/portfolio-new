import { Link } from 'react-router-dom';
import Icon from '../../../components/ui/Icon';
import OriginLabel from '../../../components/ui/OriginLabel';
import StatusBadge from '../../../components/ui/StatusBadge';
import type { Project } from '../../../types/project';

interface ProjectHeaderProps {
  project: Project;
  parentProject?: Project;
}

function ProjectHeader({ project, parentProject }: ProjectHeaderProps) {
  const back = parentProject
    ? { to: `/portfolio/${parentProject.slug}`, label: `Part of: ${parentProject.title}` }
    : { to: '/portfolio', label: 'All projects' };

  return (
    <header className='flex flex-col gap-3'>
      <Link
        to={back.to}
        className='inline-flex w-fit items-center gap-1.5 text-sm text-ink-2 transition-colors hover:text-accent'
      >
        <Icon name='arrow-left' size={16} />
        {back.label}
      </Link>
      <div className='flex flex-wrap items-center gap-x-3 gap-y-2'>
        {project.category.map((category) => (
          <span
            key={category}
            className='rounded-full border border-line bg-surface-2 px-2.5 py-0.5 font-geist-mono text-xs text-chip capitalize'
          >
            {category}
          </span>
        ))}
        <StatusBadge status={project.status} />
        <OriginLabel origin={project.origin} team={project.team} />
      </div>
      <h1 className='text-4xl leading-tight font-bold tracking-tight text-balance sm:text-5xl'>
        {project.title}
      </h1>
      <p className='font-geist-mono text-sm text-muted'>{project.year}</p>
    </header>
  );
}

export default ProjectHeader;
