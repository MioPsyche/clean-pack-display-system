import { cn } from '../../utils/cn';
import { Badge } from '../ui/Badge';

type SectionTitleProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  dark?: boolean;
  align?: 'left' | 'center';
};

export function SectionTitle({
  eyebrow,
  title,
  description,
  dark = false,
  align = 'left',
}: SectionTitleProps) {
  const isCentered = align === 'center';

  return (
    <div className={cn('mb-12 max-w-4xl', isCentered && 'mx-auto text-center')}>
      {eyebrow ? (
        <Badge tone={dark ? 'dark' : 'aqua'} className="mb-5">
          {eyebrow}
        </Badge>
      ) : null}
      <div className={cn('flex items-end gap-5', isCentered && 'justify-center')}>
        <span
          className={cn(
            'hidden h-12 w-1 rounded-full sm:block',
            dark ? 'bg-mint' : 'bg-aqua',
          )}
        />
        <h2
          className={cn(
            'max-w-3xl font-display text-3xl font-semibold leading-tight tracking-[-0.04em] text-balance sm:text-4xl lg:text-5xl',
            dark ? 'text-white' : 'text-carbon',
          )}
        >
          {title}
        </h2>
      </div>
      {description ? (
        <p
          className={cn(
            'mt-5 max-w-3xl text-base leading-8 text-pretty sm:text-lg',
            isCentered && 'mx-auto',
            dark ? 'text-white/68' : 'text-steel',
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
