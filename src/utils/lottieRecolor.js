/**
 * Lottie recolor utility — swaps matching RGB colors in a Lottie JSON in-place
 * (after a deep clone). Preserves all animation, transforms, paths, and keyframes.
 *
 * Lottie color shape: every fill (`ty: "fl"`) and stroke (`ty: "st"`) has a
 * `.c.k` of either `[r, g, b, a]` (static, when `c.a === 0`) or an array of
 * keyframes each holding `s: [r, g, b, a]` (animated, when `c.a === 1`).
 * All channels are 0..1 floats.
 */

const TOL = 0.012;

const colorsMatch = (a, b) => {
  if (!Array.isArray(a) || !Array.isArray(b)) return false;
  if (a.length < 3 || b.length < 3) return false;
  return (
    Math.abs(a[0] - b[0]) < TOL &&
    Math.abs(a[1] - b[1]) < TOL &&
    Math.abs(a[2] - b[2]) < TOL
  );
};

export const hexToRgba = (hex, alpha = 1) => {
  const clean = String(hex).replace('#', '').trim();
  if (clean.length !== 6) return [0, 0, 0, alpha];
  const r = parseInt(clean.substring(0, 2), 16) / 255;
  const g = parseInt(clean.substring(2, 4), 16) / 255;
  const b = parseInt(clean.substring(4, 6), 16) / 255;
  return [r, g, b, alpha];
};

// 0..1 floats -> "#RRGGBB"
export const rgbaToHex = (rgba) => {
  if (!Array.isArray(rgba) || rgba.length < 3) return '#000000';
  const toByte = (n) => {
    const v = Math.round(Math.max(0, Math.min(1, n)) * 255);
    return v.toString(16).padStart(2, '0');
  };
  return `#${toByte(rgba[0])}${toByte(rgba[1])}${toByte(rgba[2])}`.toUpperCase();
};

// RGB (0..1) -> HSL (0..1 each)
export const rgbToHsl = (r, g, b) => {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l };
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h;
  switch (max) {
    case r: h = (g - b) / d + (g < b ? 6 : 0); break;
    case g: h = (b - r) / d + 2; break;
    default: h = (r - g) / d + 4;
  }
  h /= 6;
  return { h, s, l };
};

export const cloneLottie = (data) => JSON.parse(JSON.stringify(data));

/**
 * Walk a Lottie JSON and tally every unique RGB colour used in fills/strokes
 * (static `c.a===0` and animated `c.a===1` keyframes).
 *
 * @returns Array<{ hex: string, rgba: number[], count: number, hsl: {h,s,l} }>
 *         sorted by brand-worthiness score DESC, with raw occurrence as the
 *         tiebreaker — so the most "subject-y" colours appear at the top of
 *         the admin list.
 */
export const extractColors = (data) => {
  if (!data) return [];
  const tally = new Map();

  const record = (rgba) => {
    if (!Array.isArray(rgba) || rgba.length < 3) return;
    const hex = rgbaToHex(rgba);
    const existing = tally.get(hex);
    if (existing) {
      existing.count += 1;
    } else {
      tally.set(hex, {
        hex,
        rgba: [rgba[0], rgba[1], rgba[2], rgba.length >= 4 ? rgba[3] : 1],
        count: 1,
        hsl: rgbToHsl(rgba[0], rgba[1], rgba[2]),
      });
    }
  };

  const visit = (node) => {
    if (!node || typeof node !== 'object') return;
    if ((node.ty === 'fl' || node.ty === 'st') && node.c) {
      if (node.c.a === 0 && Array.isArray(node.c.k)) {
        record(node.c.k);
      } else if (node.c.a === 1 && Array.isArray(node.c.k)) {
        for (const kf of node.c.k) {
          if (kf && Array.isArray(kf.s)) record(kf.s);
        }
      }
    }
    if (Array.isArray(node)) {
      for (const item of node) visit(item);
      return;
    }
    for (const key in node) {
      const v = node[key];
      if (v && typeof v === 'object') visit(v);
    }
  };

  visit(data);
  return Array.from(tally.values()).sort((a, b) => {
    // Primary: brand-worthiness DESC (so the most "subject-y" colours float to
    // the top of the admin list and are easy to spot).
    // Tiebreaker: raw occurrence DESC (preserves a sensible order among greys).
    const sa = brandScore(a);
    const sb = brandScore(b);
    if (sb !== sa) return sb - sa;
    return b.count - a.count;
  });
};

// Brand-worthiness score used for both UI ordering and auto-mapping.
// Returns 0 for greys / near-black / near-white (those should be skipped).
//
// Why this shape:
//  - sat^1.5 punishes muted/beige colors that aren't really brand colors
//  - log(1 + min(count, COUNT_CAP)) caps the influence of high-occurrence
//    background shapes (skies, building windows) so a small subject can compete
//  - warm hues (red / orange / yellow) get a strong boost since insurance
//    illustrations almost always use a warm "subject" against a cooler scene.
//    For genuinely blue brands the admin still wins via the dropdown.
const SAT_MIN = 0.15;
const LIGHT_MIN = 0.05;
const LIGHT_MAX = 0.95;
const COUNT_CAP = 12;
const WARM_BOOST = 2.0;
// Hue distance (0..0.5, wrap-around) within which a colour is considered the
// same "family" as the chosen accent. ≈75° of the colour wheel — wide enough
// to catch the typical red→orange→yellow→olive sweep of a vehicle illustration.
const HUE_FAMILY = 75 / 360;

const brandScore = (c) => {
  if (!c || !c.hsl) return 0;
  const { h, s, l } = c.hsl;
  if (s < SAT_MIN || l < LIGHT_MIN || l > LIGHT_MAX) return 0;
  const hueDeg = h * 360;
  const isWarm = hueDeg < 60 || hueDeg >= 320;
  const hueBoost = isWarm ? WARM_BOOST : 1.0;
  const cappedCount = Math.min(c.count, COUNT_CAP);
  return Math.pow(s, 1.5) * Math.log(1 + cappedCount) * hueBoost;
};

// Wrap-around hue distance on the 0..1 scale (so 0.95 and 0.05 are close).
const hueDistance = (a, b) => {
  const d = Math.abs(a - b);
  return Math.min(d, 1 - d);
};

/**
 * Auto-suggest a theme mapping from extracted colours.
 *
 * Strategy (pragmatic, multi-source):
 *   1. Pick the highest-scoring brand-worthy colour as the "anchor".
 *   2. Map EVERY brand-worthy colour in the anchor's hue family (within ~60°)
 *      to the `accent` token. This guarantees that whatever shade the subject
 *      uses — body, highlight, secondary trim, shadow — they all become the
 *      live --site-accent. Bright reds, dull reds, peach, tan all themed together.
 *   3. Everything else (cool secondaries, greys, blacks, whites) stays 'skip'.
 *
 * Why "all → accent" instead of distributing across light/strong/cream slots:
 *   Identifying which shape is the subject's "highlight" vs "body" vs "shadow"
 *   automatically is unreliable — small details often outrank the actual body
 *   on saturation/count. Mapping everything in the warm family to one token
 *   removes that guesswork. Admins who want finer control can manually move
 *   colours to other slots via the editor.
 *
 * @param {ReturnType<typeof extractColors>} colors
 * @returns Array<{ from: string, token: string }>
 */
export const suggestMapping = (colors) => {
  if (!Array.isArray(colors) || colors.length === 0) return [];

  const candidates = colors.filter((c) => brandScore(c) > 0);
  if (candidates.length === 0) {
    return colors.map((c) => ({ from: c.hex, token: 'skip' }));
  }

  const anchorHue = candidates[0].hsl.h;
  const familyHexes = new Set(
    candidates
      .filter((c) => hueDistance(c.hsl.h, anchorHue) <= HUE_FAMILY)
      .map((c) => c.hex)
  );

  return colors.map((c) => ({
    from: c.hex,
    token: familyHexes.has(c.hex) ? 'accent' : 'skip',
  }));
};

/**
 * Recolor a Lottie JSON.
 * @param {object} data    - Lottie animation JSON (will be deep-cloned)
 * @param {Array<{from:number[], to:number[]}>} mapping - source/target RGBA arrays (0..1)
 * @returns {object} new Lottie JSON with swapped colors
 */
export const recolorLottie = (data, mapping) => {
  if (!data || !Array.isArray(mapping) || mapping.length === 0) return data;
  const cloned = cloneLottie(data);

  const trySwap = (color) => {
    for (const { from, to } of mapping) {
      if (colorsMatch(color, from)) {
        // preserve alpha already present on the source color
        const alpha = color.length >= 4 ? color[3] : 1;
        return [to[0], to[1], to[2], to.length >= 4 ? to[3] : alpha];
      }
    }
    return null;
  };

  const visit = (node) => {
    if (!node || typeof node !== 'object') return;

    if ((node.ty === 'fl' || node.ty === 'st') && node.c) {
      if (node.c.a === 0 && Array.isArray(node.c.k)) {
        const swapped = trySwap(node.c.k);
        if (swapped) node.c.k = swapped;
      } else if (node.c.a === 1 && Array.isArray(node.c.k)) {
        for (const kf of node.c.k) {
          if (kf && Array.isArray(kf.s)) {
            const swapped = trySwap(kf.s);
            if (swapped) kf.s = swapped;
          }
        }
      }
    }

    if (Array.isArray(node)) {
      for (const item of node) visit(item);
      return;
    }

    for (const key in node) {
      const v = node[key];
      if (v && typeof v === 'object') visit(v);
    }
  };

  visit(cloned);
  return cloned;
};
