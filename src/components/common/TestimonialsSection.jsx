import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiStar } from 'react-icons/fi';
import { FaQuoteLeft } from 'react-icons/fa';
import { Section } from '../ui';
import { useCustomerData } from '../../contexts/CustomerDataContext';

const DEFAULT_FEEDBACK = [
  {
    id: 'd1',
    name: 'Priya Sharma',
    role: 'Mumbai',
    rating: 5,
    message:
      'Honestly, the quickest insurance experience I have ever had. Paid half of what I was paying before, and the claim last month was settled in 4 days flat.',
  },
  {
    id: 'd2',
    name: 'Rahul Verma',
    role: 'Pune',
    rating: 5,
    message:
      'Got a health plan for my parents in under 10 minutes. The person on call actually knew what they were talking about — a rare thing these days.',
  },
  {
    id: 'd3',
    name: 'Aisha Khan',
    role: 'Delhi',
    rating: 5,
    message:
      'I have recommended them to everyone in my family. Transparent pricing, no hidden terms, and they pick up the phone. That alone is five stars.',
  },
];

const Stars = ({ rating = 5 }) => (
  <div className="flex items-center gap-0.5" style={{ color: '#D4AF37' }}>
    {Array.from({ length: 5 }).map((_, i) => (
      <FiStar
        key={i}
        className={i < rating ? 'fill-current' : 'opacity-30'}
        strokeWidth={2}
      />
    ))}
  </div>
);

const AUTOPLAY_MS = 4000;

const TestimonialsSection = () => {
  const { customerFeedback, isLoading } = useCustomerData();
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const active = (customerFeedback || []).filter((f) => f.active !== false);
  const list = !isLoading && active.length > 0 ? active : DEFAULT_FEEDBACK;
  const total = list.length;

  useEffect(() => {
    if (isPaused || total <= 1) return undefined;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % total);
    }, AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [isPaused, total]);

  if (isLoading) return null;

  // Compute the card offset relative to the current center index.
  // Normalized to -total/2 … +total/2 so wrap-around works correctly.
  const computeOffset = (index) => {
    let diff = index - current;
    const half = total / 2;
    if (diff > half) diff -= total;
    else if (diff < -half) diff += total;
    return diff;
  };

  return (
    <Section
      tone="soft"
      eyebrow="Happy customers"
      title="What people who actually called us say."
      subtitle="Real stories, real names, real ratings. No stock quotes here."
    >
      <div
        className="relative w-full overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Carousel stage — fixed height, cards absolutely positioned */}
        <div className="relative h-[360px] md:h-[340px] flex items-center justify-center">
          {list.map((item, i) => {
            const offset = computeOffset(i);
            const isCenter = offset === 0;
            const isAdjacent = Math.abs(offset) === 1;
            const isVisible = Math.abs(offset) <= 1;

            // Horizontal translation: center=0, left=-75%, right=+75%
            const xPercent = offset * 72;

            return (
              <motion.div
                key={item.id || i}
                className="absolute top-1/2 left-1/2 w-[88%] sm:w-[420px] md:w-[460px]"
                style={{ zIndex: isCenter ? 20 : isAdjacent ? 10 : 0 }}
                initial={false}
                animate={{
                  x: `calc(-50% + ${xPercent}%)`,
                  y: '-50%',
                  scale: isCenter ? 1 : isAdjacent ? 0.82 : 0.7,
                  opacity: isVisible ? (isCenter ? 1 : 0.4) : 0,
                  filter: isCenter ? 'blur(0px)' : 'blur(1px)',
                }}
                transition={{
                  duration: 0.9,
                  ease: [0.32, 0.72, 0, 1],
                }}
              >
                <div
                  className={`relative rounded-2xl bg-white border shadow-sm overflow-hidden transition-shadow duration-500 ${
                    isCenter
                      ? 'border-[#EBDCB1] shadow-[0_24px_48px_-16px_rgba(201,169,97,0.32)]'
                      : 'border-[#E8DEC4] shadow-[0_12px_24px_-16px_rgba(46,37,16,0.10)] pointer-events-none'
                  }`}
                >
                  <FaQuoteLeft
                    aria-hidden
                    className={`absolute -top-2 -right-2 text-6xl pointer-events-none transition-colors ${
                      isCenter ? 'text-[#F5EBD3]' : 'text-[#FAF6EE]'
                    }`}
                  />
                  <div className="relative z-10 flex flex-col p-6 md:p-8">
                    <Stars rating={item.rating || 5} />
                    <p className="mt-4 mb-5 text-[0.9375rem] md:text-base text-ink-700 leading-relaxed italic line-clamp-4">
                      &ldquo;{item.message}&rdquo;
                    </p>
                    <div className="mt-auto flex items-center gap-3 pt-4 border-t border-[#EBDCB1]">
                      <div className="w-11 h-11 rounded-full flex items-center justify-center bg-gradient-to-br from-[#C9A961] to-[#8B6F2C] text-noir-950 font-display font-semibold shadow-[0_8px_16px_-8px_rgba(201,169,97,0.5)] border border-[#E5C770] shrink-0">
                        {item.avatar ? (
                          <img
                            src={item.avatar}
                            alt={item.name}
                            className="w-full h-full object-cover rounded-full"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <span>{(item.name || '?').charAt(0).toUpperCase()}</span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-noir-950 truncate">
                          {item.name}
                        </div>
                        {item.role && (
                          <div className="text-xs text-ink-500 truncate">{item.role}</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Dots indicator */}
        {total > 1 && (
          <div className="flex items-center justify-center gap-2 mt-2">
            {list.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`rounded-full transition-all duration-300 ${
                  i === current
                    ? 'w-7 h-2.5 bg-[#C9A961]'
                    : 'w-2.5 h-2.5 bg-[#E8DEC4] hover:bg-[#EBDCB1]'
                }`}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </Section>
  );
};

export default TestimonialsSection;
