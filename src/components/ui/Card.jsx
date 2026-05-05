import React from 'react';
import { motion } from 'framer-motion';

/**
 * Base Card primitive. Composable with header, body, footer.
 * Variants: default | elevated | outlined | tint | dark | glow
 */
const variantClasses = {
  default:
    'bg-white border border-[#E8DEC4] shadow-[0_2px_4px_rgba(46,37,16,0.04),0_1px_2px_rgba(46,37,16,0.04)]',
  elevated:
    'bg-white border border-[#EBDCB1]/60 shadow-[0_8px_16px_-4px_rgba(46,37,16,0.08),0_4px_8px_-4px_rgba(46,37,16,0.04)]',
  outlined:
    'bg-white border-[1.5px] border-[#EBDCB1]',
  tint:
    'bg-[#FDFAF1] border border-[#EBDCB1]',
  dark:
    'bg-noir-950 text-white border border-[#C9A961]/20',
  glow:
    'bg-white border border-[#EBDCB1] shadow-[0_0_0_1px_rgba(201,169,97,0.15),0_20px_40px_-12px_rgba(201,169,97,0.30)]',
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
    hover ? 'transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:shadow-[0_24px_48px_-12px_rgba(201,169,97,0.25)] hover:border-[#C9A961]' : '',
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
