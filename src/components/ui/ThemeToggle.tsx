import { useTheme } from '../../hooks/useTheme';

const LABELS = {
  system: 'System',
  dark: 'Dark',
  light: 'Light',
} as const;

function ThemeToggle({ className }: { className?: string }) {
  const { theme, cycleTheme } = useTheme();

  return (
    <button
      type='button'
      onClick={cycleTheme}
      aria-label={`Theme: ${LABELS[theme]}. Change theme`}
      className={[
        'inline-flex items-center gap-1.5 rounded-md border border-line px-2.5 py-1.5 font-geist-mono text-xs text-muted transition-colors hover:border-line-strong hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <span aria-hidden='true'>◐</span>
      {LABELS[theme]}
    </button>
  );
}

export default ThemeToggle;
