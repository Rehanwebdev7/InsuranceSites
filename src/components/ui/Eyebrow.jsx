import React from 'react';

/**
 * Small uppercase accent label that sits above section headings.
 * Signals the section's category / intent.
 */
const toneMap = {
  brand:
    'text-[#8B6F2C] bg-[#FDFAF1] border border-[#EBDCB1]',
  light:
    'text-[#E5C770] bg-[rgba(229,199,112,0.10)] border border-[rgba(201,169,97,0.30)] backdrop-blur',
  dark:
    'text-noir-700 bg-ivory-100 border border-[#EBDCB1]',
  warm:
    'text-[#5C4A1D] bg-[#F5EBD3] border border-[#E5C770]',
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
