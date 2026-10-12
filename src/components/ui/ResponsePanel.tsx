import { useId, useState, type ReactNode } from 'react';
import ApiLabel, { type HttpMethod } from './ApiLabel';

export interface ResponsePanelProps {
  method?: HttpMethod;
  path: string;
  status?: string;
  /** Data shown in the JSON tab. Omit to hide the tabs. */
  json?: unknown;
  /** Extra content on the right of the header (e.g. a note). */
  aside?: ReactNode;
  padded?: boolean;
  children: ReactNode;
  className?: string;
}

const tabStyles =
  'rounded-md px-2.5 py-1 font-geist-mono text-xs transition-colors focus-visible:outline-2 focus-visible:outline-accent';

/** Portfolio "documentation" panel: API bar as header, Preview / JSON tabs. */
function ResponsePanel({
  method = 'GET',
  path,
  status,
  json,
  aside,
  padded = true,
  children,
  className,
}: ResponsePanelProps) {
  const [tab, setTab] = useState<'preview' | 'json'>('preview');
  const id = useId();
  const hasJson = json !== undefined;

  return (
    <section
      className={['overflow-hidden rounded-[10px] border border-line bg-surface', className]
        .filter(Boolean)
        .join(' ')}
    >
      <div className='flex flex-wrap items-center justify-between gap-x-3.5 gap-y-2 border-b border-line px-[18px] py-3'>
        <ApiLabel variant='bar' method={method} path={path} status={status} />
        <div className='flex items-center gap-3'>
          {aside}
          {hasJson && (
            <div role='tablist' aria-label='Response view' className='flex gap-1'>
              {(['preview', 'json'] as const).map((value) => (
                <button
                  key={value}
                  type='button'
                  role='tab'
                  id={`${id}-${value}-tab`}
                  aria-selected={tab === value}
                  aria-controls={`${id}-panel`}
                  onClick={() => setTab(value)}
                  className={`${tabStyles} ${
                    tab === value
                      ? 'border border-line bg-surface-2 text-ink'
                      : 'border border-transparent text-muted hover:text-ink'
                  }`}
                >
                  {value === 'preview' ? 'Preview' : 'JSON'}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      <div
        id={`${id}-panel`}
        role={hasJson ? 'tabpanel' : undefined}
        aria-labelledby={hasJson ? `${id}-${tab}-tab` : undefined}
        className={padded || tab === 'json' ? 'p-[18px]' : undefined}
      >
        {tab === 'json' && hasJson ? (
          <pre className='max-h-[560px] overflow-auto font-geist-mono text-[12.5px] leading-relaxed whitespace-pre-wrap break-words text-ink-2'>
            {JSON.stringify(json, null, 2)}
          </pre>
        ) : (
          children
        )}
      </div>
    </section>
  );
}

export default ResponsePanel;
