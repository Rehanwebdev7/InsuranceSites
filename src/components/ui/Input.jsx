import React, { forwardRef, useState } from 'react';

/**
 * Premium input with floating label + inline validation states.
 * Fully controlled OR uncontrolled; pass through to react-hook-form via `register`.
 *
 * `tone="light"` (default) — white surface, used in modal/quote form contexts.
 * `tone="dark"` — noir surface with gold accents, used inside dark cabinet forms.
 */
const Input = forwardRef(function Input(
  {
    label,
    type = 'text',
    error,
    helperText,
    leftIcon,
    rightIcon,
    className = '',
    containerClassName = '',
    prefix,
    required = false,
    tone = 'light',
    ...rest
  },
  ref
) {
  const [focused, setFocused] = useState(false);
  const hasError = !!error;
  const isDark = tone === 'dark';

  const wrapperClasses = isDark
    ? hasError
      ? 'rounded-xl border-[1.5px] bg-noir-900 border-red-500/60 shadow-[0_0_0_4px_rgba(239,68,68,0.12)]'
      : focused
        ? 'rounded-xl border-[1.5px] bg-noir-900 border-[#C9A961] shadow-[0_0_0_4px_rgba(201,169,97,0.18)]'
        : 'rounded-xl border-[1.5px] bg-noir-900 border-[rgba(201,169,97,0.30)] hover:border-[rgba(201,169,97,0.50)]'
    : hasError
      ? 'rounded-xl border-[1.5px] bg-white border-red-300 shadow-[0_0_0_4px_rgba(239,68,68,0.08)]'
      : focused
        ? 'rounded-xl border-[1.5px] bg-white border-[#C9A961] shadow-[0_0_0_4px_rgba(201,169,97,0.15)]'
        : 'rounded-xl border-[1.5px] bg-white border-[#E8DEC4] hover:border-[#EBDCB1]';

  const labelClass = isDark
    ? 'block text-[0.8125rem] font-semibold text-ink-200 mb-1.5 tracking-[0.01em]'
    : 'block text-[0.8125rem] font-semibold text-noir-700 mb-1.5 tracking-[0.01em]';

  const inputClass = isDark
    ? 'w-full bg-transparent outline-none px-4 py-3 text-[0.9375rem] text-white placeholder:text-ink-400'
    : 'w-full bg-transparent outline-none px-4 py-3 text-[0.9375rem] text-noir-950 placeholder:text-ink-500';

  const iconClass = isDark ? 'text-[#E5C770] flex items-center' : 'text-ink-400 flex items-center';
  const prefixClass = isDark
    ? 'pl-3.5 text-[#E5C770] text-sm font-medium select-none'
    : 'pl-3.5 text-ink-400 text-sm font-medium select-none';

  return (
    <div className={['w-full', containerClassName].join(' ')}>
      {label && (
        <label className={labelClass}>
          {label}
          {required && <span className={isDark ? 'text-red-400 ml-0.5' : 'text-red-500 ml-0.5'}>*</span>}
        </label>
      )}
      <div className={['relative flex items-center transition-all duration-200', wrapperClasses].join(' ')}>
        {leftIcon && <span className={`pl-3.5 ${iconClass}`}>{leftIcon}</span>}
        {prefix && <span className={prefixClass}>{prefix}</span>}
        <input
          ref={ref}
          type={type}
          onFocus={(e) => {
            setFocused(true);
            rest.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            rest.onBlur?.(e);
          }}
          className={[
            inputClass,
            leftIcon ? 'pl-2' : '',
            prefix ? 'pl-2' : '',
            rightIcon ? 'pr-2' : '',
            className,
          ].join(' ')}
          {...rest}
        />
        {rightIcon && <span className={`pr-3.5 ${iconClass}`}>{rightIcon}</span>}
      </div>
      {hasError ? (
        <p className={isDark ? 'mt-1.5 text-xs text-red-400 font-medium' : 'mt-1.5 text-xs text-red-600 font-medium'}>
          {error}
        </p>
      ) : helperText ? (
        <p className={isDark ? 'mt-1.5 text-xs text-ink-400' : 'mt-1.5 text-xs text-ink-500'}>{helperText}</p>
      ) : null}
    </div>
  );
});

export default Input;
