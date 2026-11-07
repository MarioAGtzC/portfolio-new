import Button from '../../components/ui/Button';
import ResponsePanel from '../../components/ui/ResponsePanel';
import ProjectCard from '../../features/portfolio/components/ProjectCard';
import ProjectFilters from '../../features/portfolio/components/ProjectFilters';
import { useProjectFilters } from '../../features/portfolio/hooks/useProjectFilters';
import { isDefault, serializeFilters } from '../../features/portfolio/lib/filters';
import { formatMatches } from '../../features/portfolio/lib/matches';
import { PORTFOLIO_SEO } from '../../seo/routes';
import { useSeo } from '../../seo/useSeo';

function Portfolio() {
  useSeo(PORTFOLIO_SEO);

  const filterState = useProjectFilters();
  const { filters, index, results, clear } = filterState;
  const unfiltered = isDefault(filters);
  const query = serializeFilters(filters);
  const json = results.map(({ project: { slug, title, year, status, origin, team }, partOf }) => ({
    slug,
    title,
    year,
    status,
    origin,
    ...(team ? { team } : {}),
    ...(partOf ? { partOf: partOf.slug } : {}),
  }));

  return (
    <div className='mx-auto flex max-w-[1160px] flex-col gap-[18px] px-5 pt-14 pb-16 md:px-8'>
      <h1 className='text-4xl font-bold tracking-tight sm:text-5xl'>Projects</h1>
      <p className='max-w-2xl text-lg text-ink-2'>
        Every project below is a real case study: the problem it solves, how it was built, and the result.
      </p>
      <ProjectFilters {...filterState} />
      {/* Empty without filters, so the default page reads exactly as before. */}
      <p className='sr-only' aria-live='polite'>
        {unfiltered ? '' : `${results.length} ${results.length === 1 ? 'project' : 'projects'} found`}
      </p>

      {results.length > 0 || !unfiltered ? (
        <ResponsePanel
          path={query ? `/projects?${query}` : '/projects'}
          status={`200 OK · ${results.length} items`}
          json={json}
          className='mt-2'
        >
          {results.length > 0 ? (
            <div className='grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3'>
              {results.map((result, position) => {
                const wide = unfiltered && position === 0;
                return (
                  <ProjectCard
                    key={result.project.slug}
                    project={result.project}
                    partOf={result.partOf}
                    matches={formatMatches(result, index)}
                    wide={wide}
                    className={wide ? 'sm:col-span-2' : undefined}
                  />
                );
              })}
            </div>
          ) : (
            <div className='flex flex-col items-center gap-4 p-12 text-center text-muted'>
              <p>No projects match these filters.</p>
              <Button variant='outline' size='sm' onClick={clear}>
                Clear filters
              </Button>
            </div>
          )}
        </ResponsePanel>
      ) : (
        <div className='rounded-[10px] border border-line p-12 text-center text-muted'>
          No projects published yet.
        </div>
      )}
    </div>
  );
}

export default Portfolio;
