import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../../utils/cn';

type CardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  elevated?: boolean;
};

export function Card({ children, className, elevated = false, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-[2.25rem] border border-white/70 bg-[linear-gradient(145deg,rgba(255,255,255,0.94),rgba(239,248,245,0.78))] p-6 shadow-panel-soft backdrop-blur-xl ring-1 ring-carbon/5',
        elevated && 'shadow-panel',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
