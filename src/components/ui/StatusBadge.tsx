import type { Project } from '../../types/project';

const STATUS: Record<Project['status'], { label: string; text: string; dot: string }> = {
  live: { label: 'Live', text: 'text-accent', dot: 'bg-accent shadow-[0_0_0_3px_var(--color-glow)]' },
  'in progress': { label: 'In progress', text: 'text-warn', dot: 'bg-warn' },
  archived: { label: 'Archived', text: 'text-muted', dot: 'bg-muted' },
};

function StatusBadge({ status, className }: { status: Project['status']; className?: string }) {
  const style = STATUS[status];

  return (
    <span
      className={['inline-flex items-center gap-1.5 font-geist-mono text-xs', style.text, className]
        .filter(Boolean)
        .join(' ')}
    >
      <span aria-hidden='true' className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
      {style.label}
    </span>
  );
}

export default StatusBadge;
