import React from 'react';

/**
 * Shimmer skeleton primitives that match the teal design system.
 * Use as building blocks for per-section loading states.
 */
export const Skeleton = ({ className = '', rounded = 'rounded-lg' }) => (
  <div
    className={[
      'shimmer-bg',
      rounded,
      className,
    ].join(' ')}
  />
);

export const SkeletonCard = ({ className = '' }) => (
  <div
    className={[
      'rounded-2xl bg-white border border-ink-100 p-6 space-y-4',
      className,
    ].join(' ')}
  >
    <Skeleton className="w-14 h-14" rounded="rounded-xl" />
    <Skeleton className="h-5 w-3/4" />
    <Skeleton className="h-3 w-full" />
    <Skeleton className="h-3 w-5/6" />
    <Skeleton className="h-10 w-full mt-4" rounded="rounded-xl" />
  </div>
);

export default Skeleton;
