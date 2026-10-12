import type { Project } from '../../../types/project';
import ProjectArchitecture from './ProjectArchitecture';

interface ProjectOverviewProps {
  project: Project;
}

const paragraphSections = [
  { title: 'The problem', key: 'problem' },
  { title: 'The process', key: 'process' },
] as const;

function ProjectOverview({ project }: ProjectOverviewProps) {
  const results = project.results ?? [];

  return (
    <div className='flex min-w-0 flex-col gap-8'>
      {paragraphSections.map(({ title, key }) => (
        <section key={key}>
          <h2 className='text-xl font-semibold'>{title}</h2>
          <p className='mt-2 leading-relaxed text-ink-2'>{project[key]}</p>
        </section>
      ))}

      {project.architecture && project.architecture.length > 0 && (
        <ProjectArchitecture layers={project.architecture} />
      )}

      {results.length > 0 && (
        <section>
          <h2 className='text-xl font-semibold'>Results</h2>
          <ul className='mt-2 list-disc space-y-2 pl-5 leading-relaxed text-ink-2 marker:text-line-strong'>
            {results.map((result) => (
              <li key={result}>{result}</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

export default ProjectOverview;
