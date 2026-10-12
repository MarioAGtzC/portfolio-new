import { Link } from 'react-router-dom';
import Icon from '../../../components/ui/Icon';
import type { Project } from '../../../types/project';

interface ProjectNavigationProps {
  previousProject: Project;
  nextProject: Project;
}

const linkStyles =
  'inline-flex min-w-0 flex-col gap-1 rounded-md p-2 text-sm transition-colors hover:text-accent';

function ProjectNavigation({ previousProject, nextProject }: ProjectNavigationProps) {
  return (
    <nav
      className='mt-16 flex items-start justify-between gap-4 border-t border-line pt-8'
      aria-label='Project navigation'
    >
      <Link to={`/portfolio/${previousProject.slug}`} className={linkStyles}>
        <span className='inline-flex items-center gap-1.5 font-geist-mono text-xs text-muted'>
          <Icon name='arrow-left' size={14} />
          Previous
        </span>
        <span className='font-semibold'>{previousProject.title}</span>
      </Link>
      <Link to={`/portfolio/${nextProject.slug}`} className={`${linkStyles} items-end text-right`}>
        <span className='inline-flex items-center gap-1.5 font-geist-mono text-xs text-muted'>
          Next
          <Icon name='arrow-right' size={14} />
        </span>
        <span className='font-semibold'>{nextProject.title}</span>
      </Link>
    </nav>
  );
}

export default ProjectNavigation;
