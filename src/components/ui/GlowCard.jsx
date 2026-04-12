import React from 'react';
import { motion } from 'framer-motion';

/**
 * A premium card with a subtle teal glow ring + gradient border on hover.
 * Use for featured service cards, CTA tiles, and hero mini-cards.
 */
const GlowCard = ({ children, className = '', as: Component = 'div', hover = true, ...rest }) => {
  const content = (
    <div
      className={[
        'relative rounded-3xl bg-white overflow-hidden',
        'border border-ink-100',
        'shadow-[0_2px_4px_rgba(11,18,32,0.04)]',
        'transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
        hover &&
          'group-hover:border-teal-200 group-hover:shadow-[0_24px_48px_-12px_rgba(16,185,129,0.25),0_0_0_1px_rgba(16,185,129,0.1)]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    >
      {/* Gradient glow blob, hidden until hover */}
      {hover && (
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 -right-24 w-64 h-64 rounded-full bg-gradient-to-br from-teal-200 via-teal-100 to-transparent opacity-0 group-hover:opacity-60 blur-3xl transition-opacity duration-700"
        />
      )}
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );

  if (!hover) return content;

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="group h-full"
    >
      {content}
    </motion.div>
  );
};

export default GlowCard;
