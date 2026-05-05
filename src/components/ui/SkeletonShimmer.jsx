import React from 'react';

/**
 * Dark-theme shimmer skeleton primitives — noir surface with gold-tinted shimmer.
 */
export const Skeleton = ({ className = '', rounded = 'rounded-lg' }) => (
  <div
    className={[
      'animate-pulse-slow',
      'bg-gradient-to-br from-noir-800 via-noir-700 to-noir-800',
      rounded,
      className,
    ].join(' ')}
  />
);

/**
 * Cardless skeleton matching the new floating-illustration ServiceCard layout.
 */
export const SkeletonCard = ({ className = '' }) => (
  <div className={['flex flex-col items-center text-center px-2 py-3 space-y-3', className].join(' ')}>
    <Skeleton className="w-[220px] h-[220px]" rounded="rounded-full" />
    <Skeleton className="h-5 w-3/5" rounded="rounded-md" />
    <Skeleton className="h-3 w-2/3" rounded="rounded-md" />
    <Skeleton className="h-3 w-1/3" rounded="rounded-md" />
  </div>
);

export default Skeleton;
