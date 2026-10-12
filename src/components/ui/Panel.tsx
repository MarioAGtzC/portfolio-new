import type { HTMLAttributes, ReactNode } from 'react';

export interface PanelProps extends HTMLAttributes<HTMLElement> {
  /** Optional header row, e.g. an ApiLabel with tabs. Rendered above a divider. */
  header?: ReactNode;
  /** Pass false to let children control their own padding. */
  padded?: boolean;
  children: ReactNode;
}

function Panel({ header, padded = true, children, className, ...props }: PanelProps) {
  return (
    <section
      className={['overflow-hidden rounded-[10px] border border-line bg-surface', className]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {header && (
        <div className='flex flex-wrap items-center justify-between gap-x-3.5 gap-y-2 border-b border-line px-[18px] py-3'>
          {header}
        </div>
      )}
      <div className={padded ? 'p-[18px]' : undefined}>{children}</div>
    </section>
  );
}

export default Panel;
