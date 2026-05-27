import React, { useEffect, useState } from 'react';
import ThemedLottie from '../../components/common/ThemedLottie';
import vehicleAnim from '../../assets/lottie/vehicle-accident.json';

/**
 * Demo page proving the ThemedLottie wrapper works end-to-end.
 *
 * - Loads the vehicle-accident Lottie.
 * - Recolours the car body (+ cargo box) to match the live site accent.
 * - 3 swatch buttons set `--site-accent` inline on <html> to demonstrate
 *   the live update without going through the admin panel.
 * - Reset button removes the inline override, so the SettingsContext-supplied
 *   accent (whatever admin saved) takes over again.
 *
 * The mapping ONLY touches the 4 brand colours that belong to the vehicle.
 * Buildings, smoke, sky, wheels, brake-light remain untouched.
 */

const VEHICLE_MAPPING = [
  // Main car body — bright red → site accent
  { fromHex: '#FF3A3A', toToken: 'accent' },
  // Top trim strip — lighter red → derived gold-light
  { fromHex: '#FF5A5A', toToken: 'accent-light' },
  // Bottom skirt — orange/peach → cream
  { fromHex: '#FFC169', toToken: 'cream' },
  // Cargo box on roof — green → darker gold
  { fromHex: '#39905E', toToken: 'accent-strong' },
];

const SWATCHES = [
  { label: 'Gold (default)', value: '#C9A961' },
  { label: 'Crimson', value: '#B22234' },
  { label: 'Royal Blue', value: '#1F3A93' },
  { label: 'Emerald', value: '#0F8A5F' },
];

const setLiveAccent = (hex) => {
  document.documentElement.style.setProperty('--site-accent', hex);
  document.documentElement.style.setProperty(
    '--site-accent-strong',
    `color-mix(in srgb, ${hex} 65%, black)`
  );
};

const clearLiveAccent = () => {
  document.documentElement.style.removeProperty('--site-accent');
  document.documentElement.style.removeProperty('--site-accent-strong');
};

const LottieDemo = () => {
  const [current, setCurrent] = useState(null);

  // Cleanup on unmount so the override doesn't leak.
  useEffect(() => clearLiveAccent, []);

  const apply = (hex) => {
    setLiveAccent(hex);
    setCurrent(hex);
  };

  const reset = () => {
    clearLiveAccent();
    setCurrent(null);
  };

  return (
    <section className="min-h-[80vh] py-12 px-4 sm:px-6 lg:px-8 bg-noir-950">
      <div className="max-w-5xl mx-auto">
        <header className="text-center mb-8">
          <p className="font-display italic text-[0.7rem] font-semibold text-[#C9A961] tracking-[0.22em] uppercase mb-3">
            Theme-aware Lottie · live demo
          </p>
          <h1
            className="font-display font-semibold text-white text-balance tracking-tight mb-3"
            style={{ fontSize: 'clamp(1.75rem, 3.4vw, 2.5rem)', lineHeight: 1.1 }}
          >
            Vehicle recolours <span className="italic text-[#E5C770]">live</span> with your theme.
          </h1>
          <p className="text-ink-300 text-base max-w-2xl mx-auto">
            Sirf gadi ka body, top strip, skirt aur cargo box swap hote hain — buildings,
            smoke, wheels, brake-light untouched.
          </p>
        </header>

        <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-noir-900 to-noir-800 border border-[rgba(201,169,97,0.25)] shadow-[0_20px_44px_-18px_rgba(0,0,0,0.65)] p-2 sm:p-4 mb-8">
          <ThemedLottie
            animationData={vehicleAnim}
            mapping={VEHICLE_MAPPING}
            loop
            play
            style={{ width: '100%', maxWidth: 760, margin: '0 auto', display: 'block' }}
          />
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 mb-4">
          {SWATCHES.map((s) => (
            <button
              key={s.value}
              type="button"
              onClick={() => apply(s.value)}
              className={[
                'inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200',
                'border border-[rgba(201,169,97,0.30)] hover:border-[#C9A961]',
                current === s.value
                  ? 'bg-[#C9A961] text-noir-950'
                  : 'bg-noir-900 text-white hover:bg-noir-800',
              ].join(' ')}
            >
              <span
                aria-hidden
                className="w-4 h-4 rounded-full border border-white/20"
                style={{ background: s.value }}
              />
              {s.label}
            </button>
          ))}
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-semibold border border-white/20 text-white hover:bg-white/10 transition-all duration-200"
          >
            Reset to saved theme
          </button>
        </div>

        <p className="text-center text-xs text-ink-400 max-w-xl mx-auto">
          Swatch click → vehicle instantly recolours. Naya tab kholo, <code className="text-[#E5C770]">/admin/theme</code> par accent change karo aur save karo —
          wapas is page pe aate hi vehicle naye accent mein paint ho jaayega. No refresh.
        </p>
      </div>
    </section>
  );
};

export default LottieDemo;
