import type { CSSProperties } from 'react';
import ProjectCard from '../../portfolio/components/ProjectCard';
import type { Project } from '../../../types/project';

/**
 * Columns on large screens, chosen so no card is left alone in the last row:
 * 2 → 2, 3 → 3, 4 → 4, 5–6 → 3, 7+ → 4.
 */
function columnsFor(count: number) {
  if (count <= 4) return count;
  if (count <= 6) return 3;
  return 4;
}

/** "Pieces of this project": all pieces visible at once in a grid. */
function ProjectPieces({ projects }: { projects: Project[] }) {
  if (projects.length === 0) {
    return null;
  }

  return (
    <section className='mt-16 border-t border-line pt-10'>
      <h2 className='text-2xl font-semibold'>Pieces of this project</h2>
      <div
        className='mt-5 grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-[repeat(var(--cols),minmax(0,1fr))]'
        style={{ '--cols': columnsFor(projects.length) } as CSSProperties}
      >
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} showOrigin={false} />
        ))}
      </div>
    </section>
  );
}

export default ProjectPieces;
