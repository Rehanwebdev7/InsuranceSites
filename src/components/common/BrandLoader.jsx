import React from 'react';

/**
 * BrandLoader — branded full-screen / inline loader.
 * Noir background, gold-gradient spinning ring, optional caption.
 *
 * Props:
 *   fullscreen?: boolean — when true, fills the viewport on a noir bg.
 *   caption?: string     — small italic gold caption shown under the ring.
 *   size?: 'sm' | 'md' | 'lg' — ring size, defaults to 'md'.
 */
const BrandLoader = ({ fullscreen = true, caption = 'Loading the desk', size = 'md' }) => {
  const sizeMap = { sm: 36, md: 56, lg: 72 };
  const px = sizeMap[size] || sizeMap.md;

  const wrapperCls = fullscreen
    ? 'fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-noir-950'
    : 'flex flex-col items-center justify-center gap-3 py-16';

  return (
    <div className={wrapperCls}>
      {/* Soft warm halo on fullscreen */}
      {fullscreen && (
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(201,169,97,0.10) 0%, transparent 60%)',
          }}
        />
      )}
      <div
        className="relative rounded-full"
        style={{
          width: px,
          height: px,
          border: '2px solid rgba(201, 169, 97, 0.18)',
          borderTopColor: '#D4AF37',
          borderRightColor: '#C9A961',
          animation: 'bri-spin 0.9s linear infinite',
          boxShadow: '0 0 24px rgba(201, 169, 97, 0.25)',
        }}
      />
      {caption && (
        <span className="font-display italic text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-[#E5C770]">
          {caption}
        </span>
      )}
      <span
        aria-hidden
        className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]"
        style={{
          boxShadow: '0 0 10px rgba(212, 175, 55, 0.7)',
          animation: 'pulseSoft 1.4s ease-in-out infinite',
        }}
      />
      <style>{`
        @keyframes bri-spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default BrandLoader;
