import type { Project } from '../types/project';
import { getProjectImages } from './projectImages';
import projectsJson from './projects.json';
import type { ProjectData } from './schemas';

// projects.json is published by the Site Content Manager and checked against its schema at build time.
export const projects: Project[] = (projectsJson as ProjectData[]).map((project) => ({
  ...project,
  ...getProjectImages(project.slug, project.title),
}));

const byOrder = (left: Project, right: Project) => left.order - right.order;

export function getTopLevelProjects(): Project[] {
  return projects.filter((project) => !project.parentSlug).sort(byOrder);
}

export function getFeaturedProjects(): Project[] {
  return getTopLevelProjects().filter((project) => project.featured);
}

export function getProjectPieces(hubSlug: string): Project[] {
  return projects
    .filter((project) => project.parentSlug === hubSlug)
    .sort(byOrder);
}

export function getParentProject(project: Project): Project | undefined {
  return project.parentSlug
    ? projects.find((item) => item.slug === project.parentSlug)
    : undefined;
}
