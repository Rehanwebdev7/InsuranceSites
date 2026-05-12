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
    'bg-gradient-to-br from-[#C9A961] to-[#D4AF37] text-noir-950 border border-[#B8923A] hover:from-[#D4AF37] hover:to-[#E5C770] shadow-[0_8px_16px_-8px_rgba(201,169,97,0.45)] hover:shadow-[0_16px_32px_-12px_rgba(201,169,97,0.55)]',
  secondary:
    'bg-white text-noir-950 border border-[#EBDCB1] hover:border-[#C9A961] hover:bg-[#FDFAF1]',
  ghost:
    'bg-transparent text-noir-700 hover:bg-[#FDFAF1]',
  outline:
    'bg-transparent text-noir-950 border-[1.5px] border-[#C9A961] hover:bg-[#C9A961] hover:text-noir-950',
  dark:
    'bg-noir-950 text-[#E5C770] border border-[#C9A961] hover:bg-noir-800 hover:text-white shadow-lg',
  white:
    'bg-white text-noir-950 border border-[#EBDCB1] hover:bg-[#FDFAF1] shadow-lg',
  link:
    'bg-transparent text-noir-950 hover:text-[#8B6F2C] underline-offset-4 hover:underline p-0 shadow-none',
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
        'group relative inline-flex items-center justify-center font-semibold whitespace-nowrap',
        'transition-all duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A961] focus-visible:ring-offset-2',
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
