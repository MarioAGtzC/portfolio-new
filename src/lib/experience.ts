import career from '../data/career.json';

const [startYear, startMonth] = career.start.split('-').map(Number);

/** First professional role, derived from the oldest experience on publish. Used to compute experience on the fly. */
export const CAREER_START = { year: startYear, month: startMonth };

export function monthsSince({ year, month }: { year: number; month: number }, now = new Date()) {
  return (now.getFullYear() - year) * 12 + (now.getMonth() + 1 - month);
}

/** 80 → "6y 8m" */
export function formatShortDuration(totalMonths: number) {
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  return months ? `${years}y ${months}m` : `${years}y`;
}
