import type { ReactNode } from 'react';
import { cn } from '../../utils/cn';

type BadgeProps = {
  children: ReactNode;
  tone?: 'aqua' | 'leaf' | 'dark';
  className?: string;
};

const toneClasses = {
  aqua: 'border-aqua/20 bg-aqua/10 text-aqua shadow-[inset_0_1px_0_rgba(255,255,255,0.55)]',
  leaf: 'border-leaf/30 bg-leaf/15 text-carbon shadow-[inset_0_1px_0_rgba(255,255,255,0.55)]',
  dark: 'border-white/15 bg-white/10 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]',
};

export function Badge({ children, tone = 'aqua', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex w-fit items-center rounded-full border px-3.5 py-1.5 text-[0.68rem] font-bold uppercase tracking-[0.22em] backdrop-blur',
        toneClasses[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
