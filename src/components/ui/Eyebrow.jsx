import React from 'react';

/**
 * Small uppercase accent label that sits above section headings.
 * Signals the section's category / intent.
 */
const toneMap = {
  brand:
    'text-teal-700 bg-teal-50 border border-teal-100',
  light:
    'text-teal-100 bg-white/10 border border-white/15 backdrop-blur',
  dark:
    'text-ink-700 bg-ink-50 border border-ink-100',
  warm:
    'text-amber-700 bg-amber-50 border border-amber-100',
};

const Eyebrow = ({ tone = 'brand', icon, children, className = '' }) => {
  return (
    <span
      className={[
        'inline-flex items-center gap-2',
        'px-3.5 py-1.5 rounded-full',
        'text-[0.6875rem] font-semibold uppercase tracking-[0.14em]',
        toneMap[tone] || toneMap.brand,
        className,
      ].join(' ')}
    >
      {icon && <span className="text-sm">{icon}</span>}
      {children}
    </span>
  );
};

export default Eyebrow;
