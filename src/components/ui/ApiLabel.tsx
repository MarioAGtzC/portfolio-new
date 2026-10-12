export type HttpMethod = 'GET' | 'POST';

export interface ApiLabelProps {
  method?: HttpMethod;
  path: string;
  /** e.g. "200 OK · 3 items" */
  status?: string;
  /** "inline": small muted label above a section title (resume). "bar": panel header (portfolio). */
  variant?: 'inline' | 'bar';
  className?: string;
}

function ApiLabel({ method = 'GET', path, status, variant = 'inline', className }: ApiLabelProps) {
  const methodColor = method === 'POST' ? 'bg-warn' : 'bg-accent';

  return (
    <span
      className={[
        'inline-flex flex-wrap items-center gap-x-2 gap-y-1 font-geist-mono',
        variant === 'bar' ? 'text-[13px] text-ink' : 'text-xs text-muted',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <span className={`rounded px-1.5 py-px text-[10.5px] font-medium text-on-accent ${methodColor}`}>
        {method}
      </span>
      <span>{path}</span>
      {status && <span className='text-accent'>{status}</span>}
    </span>
  );
}

export default ApiLabel;
