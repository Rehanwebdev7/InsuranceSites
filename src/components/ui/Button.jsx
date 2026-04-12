import React from 'react';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

/**
 * Premium Button primitive — Emerald + Slate design system.
 * Pure presentation. No Firebase, no data.
 *
 * Variants: primary | secondary | ghost | outline | dark | white | link
 * Sizes:    sm | md | lg | xl
 */
const variantClasses = {
  primary:
    'bg-teal-700 text-white hover:bg-teal-800 shadow-[0_8px_16px_-8px_rgba(16,185,129,0.35)] hover:shadow-[0_16px_32px_-12px_rgba(16,185,129,0.45)]',
  secondary:
    'bg-white text-teal-700 border border-ink-100 hover:border-teal-500 hover:bg-teal-50',
  ghost:
    'bg-transparent text-ink-700 hover:bg-ink-50',
  outline:
    'bg-transparent text-teal-700 border-[1.5px] border-teal-700 hover:bg-teal-700 hover:text-white',
  dark:
    'bg-ink-900 text-white hover:bg-ink-800 shadow-lg',
  white:
    'bg-white text-ink-900 hover:bg-ink-50 shadow-lg',
  link:
    'bg-transparent text-teal-700 hover:text-teal-800 underline-offset-4 hover:underline p-0 shadow-none',
};

const sizeClasses = {
  sm: 'px-3.5 py-2 text-xs rounded-lg gap-1.5',
  md: 'px-5 py-2.5 text-sm rounded-xl gap-2',
  lg: 'px-6 py-3.5 text-[0.9375rem] rounded-xl gap-2',
  xl: 'px-8 py-4 text-base rounded-2xl gap-2.5',
};

const Button = React.forwardRef(function Button(
  {
    as: Component = 'button',
    variant = 'primary',
    size = 'md',
    leftIcon,
    rightIcon,
    loading = false,
    disabled = false,
    fullWidth = false,
    className = '',
    children,
    ...rest
  },
  ref
) {
  const isDisabled = disabled || loading;

  return (
    <Component
      ref={ref}
      disabled={isDisabled}
      className={[
        'group relative inline-flex items-center justify-center font-semibold',
        'transition-all duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2',
        'active:scale-[0.98]',
        'disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100',
        variantClasses[variant] || variantClasses.primary,
        variant === 'link' ? 'text-sm font-semibold' : sizeClasses[size],
        fullWidth ? 'w-full' : '',
        className,
      ].join(' ')}
      {...rest}
    >
      {loading ? (
        <>
          <AiOutlineLoading3Quarters className="animate-spin" />
          <span>{typeof children === 'string' ? 'Please wait…' : children}</span>
        </>
      ) : (
        <>
          {leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
          <span>{children}</span>
          {rightIcon && (
            <span className="inline-flex shrink-0 transition-transform duration-200 group-hover:translate-x-0.5">
              {rightIcon}
            </span>
          )}
        </>
      )}
    </Component>
  );
});

export default Button;
