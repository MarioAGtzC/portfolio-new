import { Navigate, useParams } from 'react-router-dom';
import {
  getParentProject,
  getProjectPieces,
  getTopLevelProjects,
  projects,
} from '../../data/projects';
import ProjectGallery from '../../features/project-detail/components/ProjectGallery';
import ProjectHeader from '../../features/project-detail/components/ProjectHeader';
import ProjectMetadata from '../../features/project-detail/components/ProjectMetadata';
import ProjectNavigation from '../../features/project-detail/components/ProjectNavigation';
import ProjectOverview from '../../features/project-detail/components/ProjectOverview';
import RelatedProjectsCarousel from '../../features/project-detail/components/RelatedProjectsCarousel';

function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();

  const project = projects.find((item) => item.slug === slug);

  if (!project) {
    return <Navigate to='/404' replace />;
  }

  const parentProject = getParentProject(project);
  const childPieces = getProjectPieces(project.slug);
  const siblingProjects = project.parentSlug
    ? getProjectPieces(project.parentSlug)
    : getTopLevelProjects();

  const currentIndex = siblingProjects.findIndex(
    (item) => item.slug === project.slug,
  );
  const hasMultipleSiblings = siblingProjects.length > 1;
  const prevProject =
    siblingProjects[
      (currentIndex - 1 + siblingProjects.length) % siblingProjects.length
    ];
  const nextProject =
    siblingProjects[(currentIndex + 1) % siblingProjects.length];

  return (
    <div className='pt-8'>
      <div className='mx-auto max-w-5xl px-4'>
        <ProjectHeader project={project} parentProject={parentProject} />
      </div>

      <ProjectGallery project={project} />

      <div className='mx-auto max-w-5xl px-4'>
        <div className='mt-8 grid gap-12 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]'>
          <ProjectOverview project={project} />
          <ProjectMetadata project={project} />
        </div>
      </div>

      <RelatedProjectsCarousel projects={childPieces} />

      <div className='mx-auto max-w-5xl px-4 pb-20'>
        {hasMultipleSiblings && (
          <ProjectNavigation
            previousProject={prevProject}
            nextProject={nextProject}
          />
        )}
      </div>
    </div>
  );
}

export default ProjectDetail;
