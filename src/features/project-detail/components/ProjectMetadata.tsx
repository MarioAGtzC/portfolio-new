import Button from '../../../components/ui/Button';
import Icon from '../../../components/ui/Icon';
import TechChips from '../../../components/ui/TechChips';
import type { Project } from '../../../types/project';

interface ProjectMetadataProps {
  project: Project;
}

const labelStyles = 'font-geist-mono text-xs tracking-wide text-muted uppercase';

function ProjectMetadata({ project }: ProjectMetadataProps) {
  return (
    <aside className='flex flex-col gap-6'>
      <div>
        <h3 className={labelStyles}>Role</h3>
        <p className='mt-2 leading-relaxed text-ink'>{project.role}</p>
      </div>

      <div>
        <h3 className={labelStyles}>Stack</h3>
        <TechChips items={project.stack} className='mt-2' />
      </div>

      {(project.liveUrl || project.repoUrl) && (
        <div className='flex flex-col gap-2.5'>
          {project.liveUrl && (
            <Button href={project.liveUrl} target='_blank' rel='noopener noreferrer' variant='accent'>
              <Icon name='external-link' size={18} />
              View live site
            </Button>
          )}
          {project.repoUrl && (
            <Button href={project.repoUrl} target='_blank' rel='noopener noreferrer' variant='outline'>
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
