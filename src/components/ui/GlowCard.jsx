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
        'border border-[#E8DEC4]',
        'shadow-[0_2px_4px_rgba(46,37,16,0.04)]',
        'transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
        hover &&
          'group-hover:border-[#C9A961] group-hover:shadow-[0_24px_48px_-12px_rgba(201,169,97,0.30),0_0_0_1px_rgba(201,169,97,0.12)]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    >
      {/* Warm gold halo, hidden until hover */}
      {hover && (
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 -right-24 w-64 h-64 rounded-full bg-gradient-to-br from-[#F5EBD3] via-[#FDFAF1] to-transparent opacity-0 group-hover:opacity-80 blur-3xl transition-opacity duration-700"
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
