import { useMemo } from 'react';
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
import ProjectPieces from '../../features/project-detail/components/ProjectPieces';
import { getProjectSeo, NOT_FOUND_SEO } from '../../seo/routes';
import { useSeo } from '../../seo/useSeo';

function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();

  const project = projects.find((item) => item.slug === slug);

  const seo = useMemo(
    () => (project ? getProjectSeo(project) : NOT_FOUND_SEO),
    [project],
  );
  useSeo(seo);

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
    <div className='mx-auto max-w-[1160px] px-5 pt-10 pb-20 md:px-8'>
      <ProjectHeader project={project} parentProject={parentProject} />

      <ProjectGallery project={project} />

      <div className='mt-10 grid gap-12 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]'>
        <ProjectOverview project={project} />
        <ProjectMetadata project={project} />
      </div>

      <ProjectPieces projects={childPieces} />

      {hasMultipleSiblings && (
        <ProjectNavigation
          previousProject={prevProject}
          nextProject={nextProject}
        />
      )}
    </div>
  );
}

export default ProjectDetail;
