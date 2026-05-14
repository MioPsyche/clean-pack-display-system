import type { InputHTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

export function Input({ label, error, id, className, ...props }: InputProps) {
  const inputId = id ?? props.name;

  return (
    <label className="block space-y-2" htmlFor={inputId}>
      <span className="text-sm font-semibold text-carbon">{label}</span>
      <input
        id={inputId}
        className={cn(
          'w-full rounded-2xl border border-carbon/10 bg-white px-4 py-3 text-sm text-carbon outline-none transition-[border-color,box-shadow,background-color] duration-200 placeholder:text-steel/70 focus:border-aqua focus:ring-4 focus:ring-aqua/10',
          error && 'border-red-400 focus:border-red-400 focus:ring-red-100',
          className,
        )}
        {...props}
      />
      {error ? <span className="text-xs font-medium text-red-600">{error}</span> : null}
    </label>
  );
}
