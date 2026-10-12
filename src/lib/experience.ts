/** First professional role (Feb 2020). Used to compute experience on the fly. */
export const CAREER_START = { year: 2020, month: 2 };

export function monthsSince({ year, month }: { year: number; month: number }, now = new Date()) {
  return (now.getFullYear() - year) * 12 + (now.getMonth() + 1 - month);
}

/** 80 → "6y 8m" */
export function formatShortDuration(totalMonths: number) {
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  return months ? `${years}y ${months}m` : `${years}y`;
}
