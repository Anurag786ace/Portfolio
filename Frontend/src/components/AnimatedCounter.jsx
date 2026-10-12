import React, { useEffect, useRef, useState } from 'react';

/**
 * AnimatedCounter — Counts up from 0 to a target number with easing.
 * Triggered when scrolled into view.
 * 
 * @param {Object} props
 * @param {string} props.value - Target value like "150K+", "50+", "99.9%"
 * @param {number} props.duration - Animation duration in ms
 */
export default function AnimatedCounter({ value, duration = 2000, style = {} }) {
  const [displayValue, setDisplayValue] = useState('0');
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  // Parse the numeric part and suffix
  const parseValue = (val) => {
    const match = val.match(/^([\d.]+)(.*)$/);
    if (!match) return { num: 0, suffix: val };
    return { num: parseFloat(match[1]), suffix: match[2] };
  };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;

    const { num, suffix } = parseValue(value);
    const startTime = performance.now();
    const isDecimal = value.includes('.');

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = eased * num;

      if (isDecimal) {
        setDisplayValue(current.toFixed(1) + suffix);
      } else {
        setDisplayValue(Math.floor(current) + suffix);
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayValue(value);
      }
    };

    requestAnimationFrame(animate);
  }, [started, value, duration]);

  return (
    <span ref={ref} style={style}>
      {displayValue}
    </span>
  );
}
