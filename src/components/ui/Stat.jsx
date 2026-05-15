import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion';

/**
 * Animated stat tile. Counts up from 0 to value when scrolled into view.
 * Accepts optional `prefix`, `suffix` for e.g. "₹", "+", "Cr", "K".
 */
const Stat = ({
  value,
  prefix = '',
  suffix = '',
  label,
  description,
  icon,
  tone = 'default',
  className = '',
}) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const numeric = typeof value === 'number' ? value : parseFloat(String(value).replace(/[^\d.]/g, ''));
  const isNumeric = !Number.isNaN(numeric);
  const [displayValue, setDisplayValue] = useState(isNumeric ? 0 : value);

  useEffect(() => {
    if (!inView || !isNumeric) return;
    let start = 0;
    const duration = 1400;
    const startTime = performance.now();
    let raf;
    const step = (now) => {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - t, 4); // easeOutQuart
      const current = start + (numeric - start) * eased;
      setDisplayValue(current);
      if (t < 1) raf = requestAnimationFrame(step);
      else setDisplayValue(numeric);
    };
    raf = requestAnimationFrame(step);
    return () => raf && cancelAnimationFrame(raf);
  }, [inView, numeric, isNumeric]);

  const format = (n) => {
    if (!isNumeric) return value;
    const rounded = numeric >= 100 ? Math.round(n) : n.toFixed(numeric % 1 === 0 ? 0 : 1);
    return rounded.toLocaleString();
  };

  const isBrand = tone === 'brand';
  const isLight = tone === 'dark' || isBrand;

  return (
    <div ref={ref} className={['group', className].join(' ')}>
      {icon && (
        <div
          className={[
            'w-11 h-11 rounded-xl mb-3 flex items-center justify-center',
            !isBrand && (isLight ? 'bg-[rgba(229,199,112,0.15)] text-[#E5C770] border border-[rgba(201,169,97,0.30)]' : 'bg-[#FDFAF1] text-[#8B6F2C] border border-[#EBDCB1]'),
          ].join(' ')}
          style={isBrand ? {
            backgroundColor: 'color-mix(in srgb, var(--site-accent, #C9A961) 15%, transparent)',
            color: 'var(--site-accent, #E5C770)',
            border: '1px solid color-mix(in srgb, var(--site-accent, #C9A961) 30%, transparent)',
          } : undefined}
        >
          {icon}
        </div>
      )}
      <div
        className={[
          'font-display font-semibold leading-none tracking-tight',
          'text-4xl md:text-5xl',
          !isBrand && (isLight ? 'text-[#E5C770]' : 'text-noir-950'),
        ].join(' ')}
        style={isBrand ? { color: 'var(--site-accent, #E5C770)' } : undefined}
      >
        {prefix}
        {format(displayValue)}
        {suffix}
      </div>
      {label && (
        <div
          className={[
            'mt-2 text-sm font-medium',
            !isBrand && (isLight ? 'text-ink-300' : 'text-ink-500'),
          ].join(' ')}
          style={isBrand ? { color: 'var(--site-text-muted, #CBD5E1)' } : undefined}
        >
          {label}
        </div>
      )}
      {description && (
        <div
          className={[
            'mt-1 text-xs',
            !isBrand && 'text-ink-400',
          ].join(' ')}
          style={isBrand ? { color: 'var(--site-text-muted, #CBD5E1)' } : undefined}
        >
          {description}
        </div>
      )}
    </div>
  );
};

export default Stat;
