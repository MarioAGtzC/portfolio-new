import Button from '../../../components/ui/Button';
import type { Facets, ProjectFilters as Filters, ProjectType, ProjectView } from '../lib/filters';

export interface ProjectFiltersProps {
  filters: Filters;
  facets: Facets;
  setView: (view: ProjectView) => void;
  setType: (type?: ProjectType) => void;
  clear: () => void;
}

const VIEWS: [ProjectView, string][] = [
  ['projects', 'Projects'],
  ['all', 'All parts'],
];

const segmentStyles =
  'flex-1 rounded-md px-3 py-1.5 font-geist-mono text-xs transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:flex-none';

function ProjectFilters({ filters, facets, setView, setType, clear }: ProjectFiltersProps) {
  // A4: hide types with no results, but never the selected one.
  const types = [...facets.types]
    .filter(([type, count]) => count > 0 || type === filters.type)
    .sort(([left], [right]) => left.localeCompare(right));

  return (
    <div className='flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center'>
      <div role='group' aria-label='View' className='flex gap-1 rounded-lg border border-line bg-surface p-1'>
        {VIEWS.map(([view, label]) => (
          <button
            key={view}
            type='button'
            aria-pressed={filters.view === view}
            onClick={() => setView(view)}
            className={`${segmentStyles} ${
              filters.view === view ? 'bg-surface-2 text-ink' : 'text-muted hover:text-ink'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <label className='flex items-center gap-2 text-sm text-ink-2'>
        Type:
        <select
          value={filters.type ?? ''}
          onChange={(event) => setType((event.target.value || undefined) as ProjectType | undefined)}
          className='min-w-0 flex-1 rounded-lg border border-line bg-surface px-3 py-2 text-sm text-ink outline-none focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-glow sm:flex-none'
        >
          <option value=''>Any type</option>
          {types.map(([type, count]) => (
            <option key={type} value={type}>
              {type} ({count})
            </option>
          ))}
        </select>
      </label>

      {(filters.type || filters.techs.length > 0) && (
        <Button variant='outline' size='sm' onClick={clear} className='sm:ml-auto'>
          Clear filters
        </Button>
      )}
    </div>
  );
}

export default ProjectFilters;
