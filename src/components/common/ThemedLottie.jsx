import React, { useContext, useEffect, useMemo, useState } from 'react';
import Lottie from 'react-lottie-player';
import { hexToRgba, recolorLottie } from '../../utils/lottieRecolor';
import { SettingsContext } from '../../contexts/SettingsContext';

/**
 * ThemedLottie — wraps react-lottie-player and recolors specific source colors
 * in the JSON to match the site theme. Re-renders live when the admin panel
 * changes the accent (we observe <html> attribute and inline-style mutations).
 *
 * Props:
 *   animationData : raw Lottie JSON
 *   mapping       : Array of mapping entries. Two equivalent shapes accepted:
 *                   (a) legacy:   { fromHex: '#RRGGBB', toToken?: Token, toHex?: '#RRGGBB' }
 *                   (b) firestore:{ from:    '#RRGGBB', token:   Token | 'skip' }
 *                   Entries with token === 'skip' (or null/undefined) are dropped,
 *                   so that colour is left untouched.
 *   ...rest       : forwarded to <Lottie> (loop, play, style, etc.)
 */

// Hardcoded fallbacks ONLY used when the live `--site-accent` CSS variable
// can't be read at all (no theme loaded, server render, etc.). When a custom
// accent IS set, `accent-light` and `accent-strong` are derived from it so the
// whole brand cascade follows whatever colour the admin picked — not the gold
// defaults below.
const TOKEN_FALLBACK = {
  accent: '#C9A961',
  'accent-light': '#E5C770',
  'accent-strong': '#8B6F2C',
  cream: '#FAF6EE',
  noir: '#0A0A0A',
};

const HEX6 = /^#([0-9a-f]{6})$/i;
const HEX3 = /^#([0-9a-f]{3})$/i;

// Read a CSS variable on <html> and normalise to a 6-char hex if possible.
// Handles `#FFF`, `#FFFFFF`, and `rgb(r,g,b)` / `rgba(r,g,b,a)` shapes.
// `color-mix(...)` and other functional forms can't be reliably parsed —
// for those we return null and let the caller derive or fall back.
const readCssHex = (cssVar) => {
  if (typeof window === 'undefined') return null;
  const v = getComputedStyle(document.documentElement)
    .getPropertyValue(cssVar)
    .trim();
  if (!v) return null;
  if (HEX6.test(v)) return v.toUpperCase();
  if (HEX3.test(v)) {
    return ('#' + v[1] + v[1] + v[2] + v[2] + v[3] + v[3]).toUpperCase();
  }
  const m = v.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
  if (m) {
    const toByte = (n) => parseInt(n, 10).toString(16).padStart(2, '0');
    return ('#' + toByte(m[1]) + toByte(m[2]) + toByte(m[3])).toUpperCase();
  }
  return null;
};

// Blend a hex colour with white (frac>0) or black (frac<0). Used so the
// accent-light / accent-strong slots track whatever the admin set as accent,
// instead of being permanently locked to the gold fallbacks.
const blendHex = (hex, frac) => {
  if (!hex) return hex;
  const h = hex.replace('#', '');
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  const target = frac >= 0 ? 255 : 0;
  const a = Math.abs(frac);
  const mix = (c) => Math.round(c + (target - c) * a);
  const toByte = (n) => Math.max(0, Math.min(255, n)).toString(16).padStart(2, '0');
  return ('#' + toByte(mix(r)) + toByte(mix(g)) + toByte(mix(b))).toUpperCase();
};

// Token resolver. `liveAccent` (when given) wins over the CSS variable so
// React state drives the recolor synchronously and we don't race the
// MutationObserver on first paint.
const resolveToken = (token, liveAccent) => {
  if (!token || token === 'skip') return null;

  const accent = liveAccent || readCssHex('--site-accent');

  if (token === 'accent') return accent || TOKEN_FALLBACK.accent;
  if (token === 'accent-light') {
    return accent ? blendHex(accent, 0.40) : TOKEN_FALLBACK['accent-light'];
  }
  if (token === 'accent-strong') {
    return accent ? blendHex(accent, -0.45) : TOKEN_FALLBACK['accent-strong'];
  }
  // Static palette tokens (cream / noir / etc.) — never derived from accent.
  return TOKEN_FALLBACK[token] || null;
};

const ThemedLottie = ({
  animationData,
  mapping = [],
  loop = true,
  play = true,
  goTo,
  speed,
  style,
  className,
  rendererSettings,
  ...rest
}) => {
  // Primary signal: React state from SettingsContext (synchronous, no race).
  // Falls back to the CSS variable + MutationObserver when this component is
  // used outside a SettingsProvider (e.g. /lottie-demo standalone page).
  const settingsCtx = useContext(SettingsContext);
  const ctxAccent = settingsCtx?.brandColors?.primary || null;

  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const obs = new MutationObserver(() => setTick((t) => t + 1));
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-site-theme', 'data-site-accent', 'data-site-frame', 'style', 'class'],
    });
    return () => obs.disconnect();
  }, []);

  const recolored = useMemo(() => {
    if (!animationData) return null;
    const resolved = mapping
      .map((entry) => {
        const source = entry.fromHex || entry.from;
        const tok = entry.toToken || entry.token;
        const literal = entry.toHex;
        if (!source) return null;
        if (tok === 'skip') return null;
        const targetHex = literal || resolveToken(tok, ctxAccent);
        if (!targetHex) return null;
        return {
          from: hexToRgba(source),
          to: hexToRgba(targetHex),
        };
      })
      .filter(Boolean);
    if (resolved.length === 0) return animationData;
    return recolorLottie(animationData, resolved);
    // `tick` + `ctxAccent` in deps so live theme changes re-run this.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animationData, mapping, tick, ctxAccent]);

  if (!recolored) return null;

  return (
    <Lottie
      animationData={recolored}
      loop={loop}
      play={play}
      goTo={goTo}
      speed={speed}
      style={style}
      className={className}
      rendererSettings={rendererSettings}
      {...rest}
    />
  );
};

export default ThemedLottie;
