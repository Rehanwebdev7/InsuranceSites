import React from 'react';

/**
 * Responsive max-width container with symmetric horizontal padding.
 * Use for every section's content wrapper.
 */
const sizeMap = {
  sm: 'max-w-3xl',
  md: 'max-w-5xl',
  lg: 'max-w-6xl',
  xl: 'max-w-7xl',
  full: 'max-w-none',
};

const Container = ({ size = 'xl', className = '', children, as: Component = 'div' }) => {
  return (
    <Component
      className={[
        'w-full mx-auto',
        'px-4 sm:px-6 lg:px-8',
        sizeMap[size] || sizeMap.xl,
        className,
      ].join(' ')}
    >
      {children}
    </Component>
  );
};

export default Container;
