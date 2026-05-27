import React, { useEffect, useMemo, useState } from 'react';
import { FiRefreshCw, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import ThemedLottie from '../common/ThemedLottie';
import { extractColors, suggestMapping } from '../../utils/lottieRecolor';
import useAdminTheme from '../../hooks/useAdminTheme';

/**
 * LottieColorMapper — slot-based editor that maps an admin-uploaded Lottie's
 * detected colours to four theme "slots" (Accent, Light, Strong, Cream).
 *
 * Defaults to a tiny 4-row view: each row is a named slot with ONE dropdown
 * picking from the lottie's detected colours. Anything not picked stays
 * original. "Show all colours" expands to a per-colour advanced view for
 * services where multiple source colours should map to the same theme token
 * (e.g. several red shades on a vehicle all becoming gold).
 *
 * Props:
 *   animationData : parsed Lottie JSON
 *   mapping       : current mapping array [{ from, token }]
 *   onChange(next): called whenever the mapping changes
 */

const SLOTS = [
  { token: 'accent', label: 'Accent (main)' },
  { token: 'accent-light', label: 'Accent · light' },
  { token: 'accent-strong', label: 'Accent · strong' },
  { token: 'cream', label: 'Cream' },
];

// Tokens valid in the advanced per-colour dropdown.
const ROW_TOKENS = [
  { value: 'skip', label: 'Skip (keep original)' },
  { value: 'accent', label: 'Accent (main)' },
  { value: 'accent-light', label: 'Accent · light' },
  { value: 'accent-strong', label: 'Accent · strong' },
  { value: 'cream', label: 'Cream' },
  { value: 'noir', label: 'Noir' },
];

const HEX6 = /^#([0-9a-f]{6})$/i;
const HEX3 = /^#([0-9a-f]{3})$/i;

// Read a CSS variable on <html> and return a 6-char hex if possible.
// Handles `#FFF`, `#FFFFFF`, and `rgb(...)` forms.
const readCssHex = (cssVar) => {
  if (typeof window === 'undefined') return null;
  const v = getComputedStyle(document.documentElement).getPropertyValue(cssVar).trim();
  if (!v) return null;
  if (HEX6.test(v)) return v.toUpperCase();
  if (HEX3.test(v)) return ('#' + v[1] + v[1] + v[2] + v[2] + v[3] + v[3]).toUpperCase();
  const m = v.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
  if (m) {
    const toByte = (n) => parseInt(n, 10).toString(16).padStart(2, '0');
    return ('#' + toByte(m[1]) + toByte(m[2]) + toByte(m[3])).toUpperCase();
  }
  return null;
};

const fromOf = (entry) => (entry?.from || entry?.fromHex || '').toUpperCase();
const tokenOf = (entry) => entry?.token || entry?.toToken || 'skip';

const LottieColorMapper = ({ animationData, mapping = [], onChange }) => {
  const theme = useAdminTheme();
  const isLight = theme === 'light';
  const [showAll, setShowAll] = useState(false);
  const [tick, setTick] = useState(0);

  // Re-bind to live theme changes so swatches stay current.
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const obs = new MutationObserver(() => setTick((t) => t + 1));
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-site-theme', 'data-site-accent', 'data-site-frame', 'style'],
    });
    return () => obs.disconnect();
  }, []);

  // Detected colours, sorted by brand-worthiness.
  const detected = useMemo(() => extractColors(animationData), [animationData]);

  // Reverse lookup: for each slot, find the FIRST source mapped to that token.
  const slotSource = (token) => {
    const entry = mapping.find((m) => tokenOf(m) === token);
    return entry ? fromOf(entry) : '';
  };

  // Count how many source colours are mapped to a given token (multi-source).
  const slotCount = (token) => mapping.filter((m) => tokenOf(m) === token).length;

  // For the slot dropdown change: a colour can only belong to one slot, so
  // remove any prior mapping for either the slot or the chosen source.
  const handleSlotChange = (token, newSource) => {
    let next = mapping.filter((m) => tokenOf(m) !== token);
    if (newSource) {
      const upper = newSource.toUpperCase();
      next = next.filter((m) => fromOf(m) !== upper);
      next.push({ from: upper, token });
    }
    onChange?.(next);
  };

  // Advanced row change — per-colour, allows multi-source per token.
  const handleRowChange = (hex, newToken) => {
    const upper = hex.toUpperCase();
    const without = mapping.filter((m) => fromOf(m) !== upper);
    onChange?.([...without, { from: upper, token: newToken }]);
  };

  const handleReAuto = () => {
    const next = suggestMapping(detected);
    onChange?.(next);
  };

  // Same derivation logic as ThemedLottie.resolveToken — keeps the slot swatches
  // in sync with whatever colour the lottie itself will actually render with.
  const blendHex = (hex, frac) => {
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
  const livePreviewHex = (token) => {
    if (token === 'skip') return 'transparent';
    const accent = readCssHex('--site-accent');
    if (token === 'accent') return accent || '#C9A961';
    if (token === 'accent-light') return accent ? blendHex(accent, 0.40) : '#E5C770';
    if (token === 'accent-strong') return accent ? blendHex(accent, -0.45) : '#8B6F2C';
    if (token === 'cream') return '#FAF6EE';
    if (token === 'noir') return '#0A0A0A';
    return 'transparent';
  };

  const currentAccent = livePreviewHex('accent');

  const t = isLight
    ? {
        wrap: 'bg-ivory-100 border border-[#EBDCB1] text-noir-900',
        heading: 'text-noir-950',
        sub: 'text-ink-500',
        preview: 'bg-noir-900',
        slotRow: 'bg-white border border-[#EBDCB1] hover:border-[#C9A961]',
        slotLabel: 'text-noir-900',
        select: 'bg-white border border-[#EBDCB1] text-noir-900 focus:border-[#C9A961]',
        btn: 'bg-white text-noir-900 border border-[#EBDCB1] hover:bg-ivory-200',
        chip: 'bg-white border border-[#EBDCB1] text-noir-900',
      }
    : {
        wrap: 'bg-noir-800/70 border border-[rgba(201,169,97,0.25)] text-white',
        heading: 'text-white',
        sub: 'text-ink-400',
        preview: 'bg-noir-950',
        slotRow: 'bg-noir-900 border border-[rgba(201,169,97,0.20)] hover:border-[#C9A961]',
        slotLabel: 'text-white',
        select: 'bg-noir-900 border border-[rgba(201,169,97,0.25)] text-white focus:border-[#C9A961]',
        btn: 'bg-noir-900 text-white border border-[rgba(201,169,97,0.25)] hover:bg-noir-800',
        chip: 'bg-noir-900 border border-[rgba(201,169,97,0.25)] text-white',
      };

  if (!animationData) return null;

  return (
    <div className={`rounded-xl p-4 ${t.wrap}`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <p className="font-display italic text-[0.6rem] font-semibold text-[#C9A961] tracking-[0.18em] uppercase mb-1">
            Theme colours
          </p>
          <h4 className={`text-sm font-semibold ${t.heading}`}>
            Pick which colour becomes each theme slot
          </h4>
          <p className={`text-xs mt-1 ${t.sub}`}>
            Auto-detected. Baaki sab original rahega.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span
            className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[0.65rem] font-mono ${t.chip}`}
            title="Live site accent — change in /admin/theme"
          >
            <span
              aria-hidden
              className="w-3 h-3 rounded-sm border border-black/15"
              style={{ background: currentAccent }}
            />
            <span>{currentAccent}</span>
          </span>
          <button
            type="button"
            onClick={handleReAuto}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${t.btn}`}
            title="Re-run auto-detect"
          >
            <FiRefreshCw className="w-3.5 h-3.5" />
            Re-auto
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-4">
        {/* LIVE preview */}
        <div className={`rounded-lg overflow-hidden p-2 ${t.preview}`}>
          <ThemedLottie
            animationData={animationData}
            mapping={mapping}
            loop
            play
            style={{ width: '100%', height: 160 }}
          />
          <p className="text-[0.65rem] text-center text-ink-400 mt-1">
            Live preview · theme change pe auto update
          </p>
        </div>

        {/* Slot rows OR advanced full list */}
        <div className="space-y-2">
          {!showAll && (
            <>
              {SLOTS.map((s) => {
                const source = slotSource(s.token);
                const count = slotCount(s.token);
                const multi = count > 1;
                return (
                  <div
                    key={s.token}
                    className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg transition-colors ${t.slotRow}`}
                    data-tick={tick}
                  >
                    <span
                      aria-hidden
                      className="w-4 h-4 rounded-sm border border-black/15 shrink-0"
                      style={{ background: livePreviewHex(s.token) }}
                      title={`Target: ${livePreviewHex(s.token)}`}
                    />
                    <label className={`text-xs font-medium w-[120px] shrink-0 ${t.slotLabel}`}>
                      {s.label}
                      {multi && (
                        <span className="ml-1 text-[0.6rem] font-normal text-[#C9A961]">
                          ×{count}
                        </span>
                      )}
                    </label>
                    <select
                      value={source}
                      onChange={(e) => handleSlotChange(s.token, e.target.value)}
                      className={`flex-1 text-xs rounded-md px-2 py-1 outline-none transition-colors ${t.select}`}
                      title={multi ? `${count} colours auto-mapped — pick one to override, or use Re-auto to restore multi-mapping` : undefined}
                    >
                      <option value="">— none (keep original) —</option>
                      {detected.map((c) => (
                        <option key={c.hex} value={c.hex}>
                          {c.hex}  ×{c.count}
                        </option>
                      ))}
                    </select>
                    {source && (
                      <span
                        aria-hidden
                        className="w-4 h-4 rounded-sm border border-black/15 shrink-0"
                        style={{ background: source }}
                        title={`Source: ${source}`}
                      />
                    )}
                  </div>
                );
              })}
            </>
          )}

          {showAll && (
            <div className="max-h-[260px] overflow-y-auto pr-1 space-y-1">
              {detected.length === 0 ? (
                <p className={`text-xs ${t.sub}`}>Koi colours detect nahi hue.</p>
              ) : (
                detected.map((c) => {
                  const entry = mapping.find((m) => fromOf(m) === c.hex.toUpperCase());
                  const tok = entry ? tokenOf(entry) : 'skip';
                  return (
                    <div
                      key={c.hex}
                      className={`flex items-center gap-2 px-2 py-1 rounded-md transition-colors ${t.slotRow}`}
                      data-tick={tick}
                    >
                      <span
                        aria-hidden
                        className="w-4 h-4 rounded-sm border border-black/15 shrink-0"
                        style={{ background: c.hex }}
                      />
                      <code className={`text-[0.7rem] font-mono w-[68px] shrink-0 ${t.heading}`}>
                        {c.hex}
                      </code>
                      <span className={`text-[0.65rem] w-9 shrink-0 ${t.sub}`}>×{c.count}</span>
                      <select
                        value={tok}
                        onChange={(e) => handleRowChange(c.hex, e.target.value)}
                        className={`flex-1 text-xs rounded-md px-2 py-1 outline-none transition-colors ${t.select}`}
                      >
                        {ROW_TOKENS.map((o) => (
                          <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                      </select>
                      {tok !== 'skip' && (
                        <span
                          aria-hidden
                          className="w-4 h-4 rounded-sm border border-black/15 shrink-0"
                          style={{ background: livePreviewHex(tok) }}
                        />
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}

          <button
            type="button"
            onClick={() => setShowAll((s) => !s)}
            className={`inline-flex items-center gap-1 px-2 py-1 text-[0.7rem] font-semibold rounded-md transition-colors ${t.btn}`}
          >
            {showAll ? <FiChevronUp className="w-3 h-3" /> : <FiChevronDown className="w-3 h-3" />}
            {showAll ? 'Show simple view' : `Show all ${detected.length} colours (advanced)`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LottieColorMapper;
