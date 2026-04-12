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

  const isLight = tone === 'dark' || tone === 'brand';

  return (
    <div ref={ref} className={['group', className].join(' ')}>
      {icon && (
        <div
          className={[
            'w-11 h-11 rounded-xl mb-3 flex items-center justify-center',
            isLight ? 'bg-white/10 text-teal-200' : 'bg-teal-50 text-teal-700',
          ].join(' ')}
        >
          {icon}
        </div>
      )}
      <div
        className={[
          'font-display font-semibold leading-none',
          'text-4xl md:text-5xl',
          isLight ? 'text-white' : 'text-ink-900',
        ].join(' ')}
      >
        {prefix}
        {format(displayValue)}
        {suffix}
      </div>
      {label && (
        <div
          className={[
            'mt-2 text-sm font-medium',
            isLight ? 'text-teal-100/80' : 'text-ink-500',
          ].join(' ')}
        >
          {label}
        </div>
      )}
      {description && (
        <div
          className={[
            'mt-1 text-xs',
            isLight ? 'text-teal-100/60' : 'text-ink-400',
          ].join(' ')}
        >
          {description}
        </div>
      )}
    </div>
  );
};

export default Stat;
