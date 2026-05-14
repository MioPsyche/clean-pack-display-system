import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '../../utils/cn';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-[linear-gradient(135deg,#071516_0%,#123432_52%,#0FA3A1_130%)] text-white shadow-glow hover:-translate-y-0.5 hover:shadow-panel focus-visible:outline-carbon active:translate-y-0',
  secondary:
    'border border-aqua/25 bg-white/82 text-carbon shadow-panel-soft backdrop-blur hover:-translate-y-0.5 hover:border-aqua hover:bg-white focus-visible:outline-aqua active:translate-y-0',
  ghost:
    'text-carbon hover:bg-white/72 hover:text-aqua focus-visible:outline-aqua active:bg-white/90',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-4 py-2.5 text-sm',
  md: 'px-5 py-3 text-sm',
  lg: 'px-7 py-4 text-base',
};

export function buttonStyles({
  variant = 'primary',
  size = 'md',
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
} = {}) {
  return cn(
    'inline-flex min-h-11 items-center justify-center rounded-full font-semibold tracking-[-0.01em] transition-[transform,background-color,border-color,box-shadow,color] duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
    variantClasses[variant],
    sizeClasses[size],
    className,
  );
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export function Button({
  children,
  className,
  variant = 'primary',
  size = 'md',
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button type={type} className={buttonStyles({ variant, size, className })} {...props}>
      {children}
    </button>
  );
}
