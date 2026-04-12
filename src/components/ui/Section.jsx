import React from 'react';
import { motion } from 'framer-motion';
import Container from './Container';
import Eyebrow from './Eyebrow';

/**
 * Section wrapper with consistent vertical rhythm + optional header.
 * Handles `eyebrow`, `title`, `subtitle`, `align` props for the section intro.
 */
const toneMap = {
  default: 'bg-white',
  soft: 'bg-[var(--surface-2)]',
  tint: 'bg-teal-50',
  dark: 'grad-dark text-white',
  brand: 'grad-hero text-white',
};

const sizeMap = {
  sm: 'py-8 md:py-12',
  md: 'py-10 md:py-14',
  lg: 'py-12 md:py-16 lg:py-20',
};

const Section = ({
  id,
  tone = 'default',
  size = 'lg',
  eyebrow,
  title,
  subtitle,
  align = 'center',
  container = 'xl',
  className = '',
  headerClassName = '',
  children,
}) => {
  const alignClass = align === 'center' ? 'text-center items-center' : 'text-left items-start';
  const isDarkTone = tone === 'dark' || tone === 'brand';

  return (
    <section
      id={id}
      className={[
        'relative',
        sizeMap[size] || sizeMap.lg,
        toneMap[tone] || toneMap.default,
        className,
      ].join(' ')}
    >
      <Container size={container}>
        {(eyebrow || title || subtitle) && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className={[
              'flex flex-col gap-3 mb-8 md:mb-10',
              align === 'center' ? 'max-w-3xl mx-auto' : 'max-w-2xl',
              alignClass,
              headerClassName,
            ].join(' ')}
          >
            {eyebrow && <Eyebrow tone={isDarkTone ? 'light' : 'brand'}>{eyebrow}</Eyebrow>}
            {title && (
              <h2
                className={[
                  'text-display-md font-display font-semibold text-balance',
                  isDarkTone ? 'text-white' : 'text-ink-900',
                ].join(' ')}
              >
                {title}
              </h2>
            )}
            {subtitle && (
              <p
                className={[
                  'text-base md:text-lg leading-relaxed text-pretty',
                  isDarkTone ? 'text-teal-100/80' : 'text-ink-500',
                ].join(' ')}
              >
                {subtitle}
              </p>
            )}
          </motion.div>
        )}
        {children}
      </Container>
    </section>
  );
};

export default Section;
