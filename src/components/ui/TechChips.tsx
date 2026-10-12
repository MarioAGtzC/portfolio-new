export interface TechChipsProps {
  items: string[];
  /** How many chips to show before collapsing the rest into "+N". Omit to show all. */
  limit?: number;
  className?: string;
}

const chipStyles =
  'rounded-md border border-line bg-surface-2 px-2 py-0.5 font-geist-mono text-xs text-chip';

function TechChips({ items, limit, className }: TechChipsProps) {
  const visible = limit === undefined ? items : items.slice(0, limit);
  const hidden = items.slice(visible.length);

  return (
    <ul className={['flex flex-wrap gap-1.5', className].filter(Boolean).join(' ')}>
      {visible.map((item) => (
        <li key={item} className={chipStyles}>
          {item}
        </li>
      ))}
      {hidden.length > 0 && (
        <li
          className='rounded-md border border-dashed border-line-strong px-2 py-0.5 font-geist-mono text-xs text-muted'
          title={hidden.join(', ')}
        >
          <span aria-hidden='true'>+{hidden.length}</span>
          <span className='sr-only'>and {hidden.length} more: {hidden.join(', ')}</span>
        </li>
      )}
    </ul>
  );
}

export default TechChips;
