import type { ProjectOrigin } from '../../types/project';

const ORIGIN_LABELS: Record<ProjectOrigin, string> = {
  product: 'Product · real clients',
  personal: 'Personal',
  course: 'Course',
  client: 'Client',
};

export interface OriginLabelProps {
  origin: ProjectOrigin;
  team?: number;
  className?: string;
}

function OriginLabel({ origin, team, className }: OriginLabelProps) {
  const parts = [ORIGIN_LABELS[origin], team ? `Team of ${team}` : null].filter(Boolean);

  return (
    <span className={['text-xs font-medium text-warn', className].filter(Boolean).join(' ')}>
      {parts.join(' · ')}
    </span>
  );
}

export default OriginLabel;
