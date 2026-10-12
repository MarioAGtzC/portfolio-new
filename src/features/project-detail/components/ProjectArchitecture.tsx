import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import type { ArchitectureLayer, ArchitectureNode } from '../../../types/project';

const nodeStyles =
  'flex min-w-0 flex-col items-center justify-center gap-0.5 rounded-lg border bg-surface px-3 py-2.5 text-center';

function Node({ node }: { node: ArchitectureNode }) {
  const content = (
    <>
      <span className='text-sm font-semibold text-ink'>{node.label}</span>
      {node.detail && <span className='font-geist-mono text-[11px] text-muted'>{node.detail}</span>}
    </>
  );

  if (node.pieceSlug) {
    return (
      <Link
        to={`/portfolio/${node.pieceSlug}`}
        className={`${nodeStyles} border-line-strong transition-colors hover:border-accent focus-visible:outline-2 focus-visible:outline-accent`}
      >
        {content}
      </Link>
    );
  }

  return <div className={`${nodeStyles} border-line`}>{content}</div>;
}

/** Top-to-bottom system diagram built from project data. Nodes with a pieceSlug link to that piece. */
function ProjectArchitecture({ layers }: { layers: ArchitectureLayer[] }) {
  return (
    <section>
      <h2 className='text-xl font-semibold'>Architecture</h2>
      <div className='mt-3 flex flex-col gap-2 rounded-[10px] border border-line bg-inset p-4'>
        {layers.map((layer, index) => (
          <div key={layer.label ?? index} className='flex flex-col gap-2'>
            {index > 0 && (
              <span aria-hidden='true' className='text-center font-geist-mono text-sm text-muted'>
                ↓
              </span>
            )}
            {layer.label && <span className='font-geist-mono text-xs text-muted'>{layer.label}</span>}
            <div
              className='grid grid-cols-1 gap-2 sm:grid-cols-[repeat(var(--cols),minmax(0,1fr))]'
              style={{ '--cols': layer.nodes.length } as CSSProperties}
            >
              {layer.nodes.map((node) => (
                <Node key={node.label} node={node} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ProjectArchitecture;
