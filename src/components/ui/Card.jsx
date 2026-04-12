import React from 'react';
import { motion } from 'framer-motion';

/**
 * Base Card primitive. Composable with header, body, footer.
 * Variants: default | elevated | outlined | tint | dark | glow
 */
const variantClasses = {
  default:
    'bg-white border border-ink-100 shadow-[0_2px_4px_rgba(11,18,32,0.04),0_1px_2px_rgba(11,18,32,0.04)]',
  elevated:
    'bg-white border border-ink-100/60 shadow-[0_8px_16px_-4px_rgba(11,18,32,0.08),0_4px_8px_-4px_rgba(11,18,32,0.04)]',
  outlined:
    'bg-white border-[1.5px] border-ink-100',
  tint:
    'bg-teal-50 border border-teal-100',
  dark:
    'bg-ink-900 text-white border border-white/5',
  glow:
    'bg-white border border-teal-100 shadow-[0_0_0_1px_rgba(16,185,129,0.12),0_20px_40px_-12px_rgba(16,185,129,0.25)]',
};

const Card = ({
  variant = 'default',
  hover = false,
  padding = 'md',
  className = '',
  children,
  as: Component = 'div',
  ...rest
}) => {
  const paddingMap = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10',
  };

  const baseClass = [
    'rounded-2xl',
    variantClasses[variant] || variantClasses.default,
    paddingMap[padding] || paddingMap.md,
    hover ? 'transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:shadow-[0_24px_48px_-12px_rgba(11,18,32,0.14)]' : '',
    className,
  ].join(' ');

  if (hover) {
    return (
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className={baseClass}
        {...rest}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <Component className={baseClass} {...rest}>
      {children}
    </Component>
  );
};

export default Card;
