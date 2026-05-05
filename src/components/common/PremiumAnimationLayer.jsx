import React, { useEffect, useRef } from 'react';

/**
 * Premium animation layer — mounts global awwwards-style micro-interactions.
 *   - Sticky scroll-progress gold bar at top
 *   - 3D perspective tilt for any element with [data-tilt]
 *   - Magnetic pull for [data-magnetic] CTAs (gold pull near cursor)
 *
 * Mount once at app shell level (CustomerLayout). Tilt and magnetic effects
 * are scoped to desktop pointer-fine devices via media queries; mobile is
 * unaffected. (The native browser cursor is preserved — no custom cursor.)
 */
const PremiumAnimationLayer = () => {
  const progressRef = useRef(null);

  // ---- Scroll progress bar ----
  useEffect(() => {
    const handleScroll = () => {
      if (!progressRef.current) return;
      const max = (document.documentElement.scrollHeight || 0) - window.innerHeight;
      const pct = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
      progressRef.current.style.transform = `scaleX(${pct})`;
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  // ---- 3D tilt on [data-tilt] cards ----
  useEffect(() => {
    const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!isFinePointer) return;

    const handlers = new WeakMap();

    const observer = new MutationObserver(() => attachTilts());
    observer.observe(document.body, { childList: true, subtree: true });

    const attachTilts = () => {
      document.querySelectorAll('[data-tilt]:not([data-tilt-bound])').forEach((el) => {
        el.setAttribute('data-tilt-bound', 'true');
        const onMove = (e) => {
          const rect = el.getBoundingClientRect();
          const x = (e.clientX - rect.left) / rect.width - 0.5;
          const y = (e.clientY - rect.top) / rect.height - 0.5;
          const rotY = x * 8;
          const rotX = -y * 8;
          el.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-6px)`;
        };
        const onLeave = () => {
          el.style.transform = '';
        };
        el.addEventListener('mousemove', onMove);
        el.addEventListener('mouseleave', onLeave);
        handlers.set(el, { onMove, onLeave });
      });
    };

    attachTilts();

    return () => observer.disconnect();
  }, []);

  // ---- Magnetic pull on [data-magnetic] elements ----
  useEffect(() => {
    const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!isFinePointer) return;

    const observer = new MutationObserver(() => attachMagnets());
    observer.observe(document.body, { childList: true, subtree: true });

    const attachMagnets = () => {
      document.querySelectorAll('[data-magnetic]:not([data-magnetic-bound])').forEach((el) => {
        el.setAttribute('data-magnetic-bound', 'true');
        el.classList.add('magnetic-cta');
        const onMove = (e) => {
          const rect = el.getBoundingClientRect();
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;
          const dx = e.clientX - cx;
          const dy = e.clientY - cy;
          const dist = Math.hypot(dx, dy);
          const radius = Math.max(rect.width, rect.height) * 1.2;
          if (dist < radius) {
            const strength = 0.32 * (1 - dist / radius);
            el.style.transform = `translate(${dx * strength}px, ${dy * strength}px)`;
          } else {
            el.style.transform = '';
          }
        };
        const onLeave = () => {
          el.style.transform = '';
        };
        window.addEventListener('mousemove', onMove);
        el.addEventListener('mouseleave', onLeave);
      });
    };

    attachMagnets();

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={progressRef} className="scroll-progress-bar" style={{ width: '100%', transform: 'scaleX(0)' }} />
  );
};

export default PremiumAnimationLayer;
