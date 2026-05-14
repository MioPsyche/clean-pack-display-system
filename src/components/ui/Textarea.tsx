import type { TextareaHTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  error?: string;
};

export function Textarea({ label, error, id, className, ...props }: TextareaProps) {
  const textareaId = id ?? props.name;

  return (
    <label className="block space-y-2" htmlFor={textareaId}>
      <span className="text-sm font-semibold text-carbon">{label}</span>
      <textarea
        id={textareaId}
        className={cn(
          'min-h-28 w-full resize-y rounded-2xl border border-carbon/10 bg-white px-4 py-3 text-sm text-carbon outline-none transition placeholder:text-steel/70 focus:border-aqua focus:ring-4 focus:ring-aqua/10',
          error && 'border-red-400 focus:border-red-400 focus:ring-red-100',
          className,
        )}
        {...props}
      />
      {error ? <span className="text-xs font-medium text-red-600">{error}</span> : null}
    </label>
  );
}
