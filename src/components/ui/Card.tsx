import type { HTMLAttributes, KeyboardEvent, ReactNode } from 'react';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

function Card({ children, className, onClick, onKeyDown, ...props }: CardProps) {
  const isInteractive = typeof onClick === 'function';

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!isInteractive) {
      onKeyDown?.(event);
      return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onClick(event as unknown as React.MouseEvent<HTMLDivElement>);
      return;
    }

    onKeyDown?.(event);
  };

  const classes = [
    'rounded-xl bg-white shadow-sm transition-shadow duration-200 ease-in-out hover:shadow-lg dark:bg-neutral-900 dark:shadow-none dark:ring-1 dark:ring-neutral-800',
    isInteractive ? 'cursor-pointer' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={classes}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role={isInteractive ? 'button' : props.role}
      tabIndex={isInteractive ? 0 : props.tabIndex}
      {...props}
    >
      {children}
    </div>
  );
}

export default Card;
