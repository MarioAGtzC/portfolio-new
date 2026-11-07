import { Link } from 'react-router-dom';
import OriginLabel from '../../../components/ui/OriginLabel';
import StatusBadge from '../../../components/ui/StatusBadge';
import TechChips from '../../../components/ui/TechChips';
import { getProjectPieces } from '../../../data/projects';
import type { Project } from '../../../types/project';
import { shortHubName } from '../lib/matches';

export interface ProjectCardProps {
  project: Project;
  /** Wide layout (cover beside the text), used for the first project on /portfolio. */
  wide?: boolean;
  /** Hide the origin line, e.g. inside a hub where every piece shares it. */
  showOrigin?: boolean;
  /** The hub, for a piece listed on its own (All parts view). */
  partOf?: Project;
  /** Why the project matches the selected techs, already formatted. */
  matches?: string;
  className?: string;
}

const STACK_LIMIT = 5;

function ProjectCard({ project, wide = false, showOrigin = true, partOf, matches, className }: ProjectCardProps) {
  const pieces = getProjectPieces(project.slug);
  const meta = [String(project.year), pieces.length > 0 ? `${pieces.length} pieces` : null]
    .filter(Boolean)
    .join(' · ');

  return (
    <Link
      to={`/portfolio/${project.slug}`}
      className={[
        'group flex h-full overflow-hidden rounded-[10px] border border-line bg-surface transition-colors hover:border-line-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
        wide ? 'flex-col md:flex-row' : 'flex-col',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div
        className={[
          'overflow-hidden border-line bg-surface-2',
          wide ? 'aspect-1200/630 border-b md:aspect-auto md:w-1/2 md:border-r md:border-b-0' : 'aspect-1200/630 border-b',
        ].join(' ')}
      >
        {project.coverImage ? (
          <img
            src={project.coverImage.src}
            alt={project.coverImage.alt}
            width={project.coverImage.width}
            height={project.coverImage.height}
            loading='lazy'
            decoding='async'
            className={[
              'h-full w-full transition-transform duration-300 ease-in-out group-hover:scale-[1.03]',
              // Covers are 1200 × 630 graphics with text: never crop them in the wide layout.
              wide ? 'object-contain' : 'object-cover',
            ].join(' ')}
          />
        ) : (
          <div className='flex h-full w-full items-center justify-center p-4 text-center font-geist-mono text-xs text-muted'>
            {project.title}
          </div>
        )}
      </div>

      <div className={['flex flex-1 flex-col gap-2.5 p-4', wide ? 'md:p-6' : ''].join(' ')}>
        <div className='flex items-center justify-between gap-2'>
          <StatusBadge status={project.status} />
          <span className='font-geist-mono text-xs text-muted'>{meta}</span>
        </div>
        {partOf && <p className='font-geist-mono text-xs text-muted'>Part of {shortHubName(partOf)}</p>}
        <h3 className={['font-semibold text-ink', wide ? 'text-xl' : 'text-lg'].join(' ')}>
          {project.title}
        </h3>
        <p className='text-sm leading-relaxed text-ink-2'>{project.summary}</p>
        {matches && <p className='font-geist-mono text-xs text-ink-2'>{matches}</p>}
        {showOrigin && <OriginLabel origin={project.origin} team={project.team} />}
        <TechChips items={project.stack} limit={STACK_LIMIT} className='mt-auto pt-1' />
      </div>
    </Link>
  );
}

export default ProjectCard;
