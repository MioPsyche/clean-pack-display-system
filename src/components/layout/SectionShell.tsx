import type { ReactNode } from 'react';
import { cn } from '../../utils/cn';
import { SectionTitle } from './SectionTitle';

type SectionShellProps = {
  id?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  dark?: boolean;
  children: ReactNode;
  className?: string;
};

export function SectionShell({
  id,
  eyebrow,
  title,
  description,
  dark = false,
  children,
  className,
}: SectionShellProps) {
  return (
    <section
      id={id}
      className={cn(
        'relative overflow-hidden px-5 py-24 sm:px-8 sm:py-28 lg:px-10 lg:py-32',
        dark ? 'bg-carbon text-white' : 'bg-transparent text-carbon',
        className,
      )}
    >
      <div className="mx-auto max-w-[1400px]">
        {title ? (
          <SectionTitle eyebrow={eyebrow} title={title} description={description} dark={dark} />
        ) : null}
        {children}
      </div>
    </section>
  );
}
