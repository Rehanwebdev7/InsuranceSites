import React, { forwardRef, useState } from 'react';

/**
 * Premium input with floating label + inline validation states.
 * Fully controlled OR uncontrolled; pass through to react-hook-form via `register`.
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
    ...rest
  },
  ref
) {
  const [focused, setFocused] = useState(false);
  const hasError = !!error;

  return (
    <div className={['w-full', containerClassName].join(' ')}>
      {label && (
        <label className="block text-[0.8125rem] font-semibold text-ink-700 mb-1.5 tracking-[0.01em]">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      <div
        className={[
          'relative flex items-center',
          'rounded-xl border-[1.5px] bg-white transition-all duration-200',
          hasError
            ? 'border-red-300 shadow-[0_0_0_4px_rgba(239,68,68,0.08)]'
            : focused
              ? 'border-teal-500 shadow-[0_0_0_4px_rgba(16,185,129,0.12)]'
              : 'border-ink-100 hover:border-ink-200',
        ].join(' ')}
      >
        {leftIcon && (
          <span className="pl-3.5 text-ink-400 flex items-center">{leftIcon}</span>
        )}
        {prefix && (
          <span className="pl-3.5 text-ink-400 text-sm font-medium select-none">{prefix}</span>
        )}
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
            'w-full bg-transparent outline-none',
            'px-4 py-3 text-[0.9375rem] text-ink-900 placeholder:text-ink-300',
            leftIcon ? 'pl-2' : '',
            prefix ? 'pl-2' : '',
            rightIcon ? 'pr-2' : '',
            className,
          ].join(' ')}
          {...rest}
        />
        {rightIcon && (
          <span className="pr-3.5 text-ink-400 flex items-center">{rightIcon}</span>
        )}
      </div>
      {hasError ? (
        <p className="mt-1.5 text-xs text-red-600 font-medium">{error}</p>
      ) : helperText ? (
        <p className="mt-1.5 text-xs text-ink-400">{helperText}</p>
      ) : null}
    </div>
  );
});

export default Input;
