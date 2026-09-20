import type { Project } from '../../../types/project';

interface ProjectOverviewProps {
  project: Project;
}

const descriptionSections = [
  { title: 'The problem', key: 'problem' },
  { title: 'The process', key: 'process' },
  { title: 'Results', key: 'results' },
] as const;

function ProjectOverview({ project }: ProjectOverviewProps) {
  return (
    <div className='flex flex-col gap-8'>
      {descriptionSections.map(({ title, key }) => (
        <section key={key}>
          <h2 className='text-xl font-semibold text-neutral-900 dark:text-white'>
            {title}
          </h2>
          <p className='mt-2 text-neutral-500 dark:text-neutral-400'>
            {project[key]}
          </p>
        </section>
      ))}
    </div>
  );
}

export default ProjectOverview;
