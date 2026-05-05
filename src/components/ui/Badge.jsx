import React from 'react';

const toneMap = {
  brand:    'bg-[#FDFAF1] text-[#8B6F2C] border-[#EBDCB1]',
  success:  'bg-emerald-50 text-emerald-700 border-emerald-100',
  warning:  'bg-[#F5EBD3] text-[#5C4A1D] border-[#E5C770]',
  danger:   'bg-red-50 text-red-700 border-red-100',
  info:     'bg-sky-50 text-sky-700 border-sky-100',
  neutral:  'bg-ink-50 text-ink-700 border-ink-100',
  dark:     'bg-noir-950 text-[#E5C770] border-[#C9A961]',
  light:    'bg-white/10 text-white border-[#C9A961]/30 backdrop-blur',
};

const sizeMap = {
  sm: 'text-[0.625rem] px-2 py-0.5',
  md: 'text-[0.6875rem] px-2.5 py-1',
  lg: 'text-xs px-3 py-1.5',
};

const Badge = ({
  tone = 'brand',
  size = 'md',
  icon,
  className = '',
  children,
  dot = false,
}) => {
  return (
    <span
      className={[
        'inline-flex items-center gap-1.5 rounded-full font-semibold border',
        'tracking-[0.02em]',
        toneMap[tone] || toneMap.brand,
        sizeMap[size] || sizeMap.md,
        className,
      ].join(' ')}
    >
      {dot && (
        <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse-slow" />
      )}
      {icon && <span>{icon}</span>}
      {children}
    </span>
  );
};

export default Badge;
