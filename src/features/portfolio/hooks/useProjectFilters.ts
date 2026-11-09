import { useCallback, useEffect, useMemo } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { projects } from '../../../data/projects';
import techs from '../../../data/techs.json';
import { facetCounts, filterProjects, parseFilters, serializeFilters } from '../lib/filters';
import type { ProjectFilters, ProjectType, ProjectView } from '../lib/filters';
import { buildTechIndex, type TechId } from '../lib/tech';

// techs.json is published by the Site Content Manager and checked against its schema at build time.
const index = buildTechIndex(projects, techs);

/** /portfolio filters backed by the URL (D4): every change replaces the history entry. */
export function useProjectFilters() {
  const [searchParams] = useSearchParams();
  const { search } = useLocation();
  const navigate = useNavigate();

  const filters = useMemo(() => parseFilters(searchParams, index), [searchParams]);
  const query = serializeFilters(filters);

  // navigate, not setSearchParams: the latter re-encodes spaces as "+", which would never equal our "%20".
  const write = useCallback(
    (next: ProjectFilters) => {
      const nextQuery = serializeFilters(next);
      navigate({ search: nextQuery ? `?${nextQuery}` : '' }, { replace: true, preventScrollReset: true });
    },
    [navigate],
  );

  // Normalize aliases, unknown params and bad values in the URL (e.g. ?tech=Node.js&foo=1 → ?tech=node).
  useEffect(() => {
    if (search !== (query ? `?${query}` : '')) write(filters);
  }, [search, query, filters, write]);

  const results = useMemo(() => filterProjects(filters, index), [filters]);
  const facets = useMemo(() => facetCounts(filters, index), [filters]);

  return {
    filters,
    index,
    results,
    facets,
    setView: (view: ProjectView) => write({ ...filters, view }),
    setType: (type?: ProjectType) => write({ ...filters, type }),
    addTech: (tech: TechId) => {
      if (!filters.techs.includes(tech)) write({ ...filters, techs: [...filters.techs, tech] });
    },
    removeTech: (tech: TechId) => write({ ...filters, techs: filters.techs.filter((id) => id !== tech) }),
    // Keeps the view: Clear filters only removes the type and the techs.
    clear: () => write({ view: filters.view, techs: [] }),
  };
}
