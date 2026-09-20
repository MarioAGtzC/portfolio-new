import Button from '../../../components/ui/Button';
import Icon from '../../../components/ui/Icon';
import type { Project } from '../../../types/project';

interface ProjectNavigationProps {
  previousProject: Project;
  nextProject: Project;
}

function ProjectNavigation({
  previousProject,
  nextProject,
}: ProjectNavigationProps) {
  return (
    <nav className='mt-16 flex items-center justify-between border-t border-neutral-200 pt-8 dark:border-neutral-800' aria-label='Project navigation'>
      <Button href={`/portfolio/${previousProject.slug}`} variant='ghost' size='md'>
        <Icon name='arrow-left' size={18} />
        Previous project
      </Button>
      <Button href={`/portfolio/${nextProject.slug}`} variant='ghost' size='md'>
        Next project
        <Icon name='arrow-right' size={18} />
      </Button>
    </nav>
  );
}

export default ProjectNavigation;
