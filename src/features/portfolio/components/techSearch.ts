export const TECH_SEARCH_ID = 'tech-search';

/** Puts focus back on the tech search after the element that had it (a chip or Clear filters) is removed. */
export function focusTechSearch() {
  document.getElementById(TECH_SEARCH_ID)?.focus();
}
