import React, { useEffect, useRef, useState } from 'react';

/**
 * TextScramble — Cyber/Glitch text reveal animation.
 * Characters scramble through random symbols before settling into the final text.
 */
export default function TextScramble({ text, delay = 0, className = '', style = {} }) {
  const [displayText, setDisplayText] = useState('');
  const [started, setStarted] = useState(false);
  const ref = useRef(null);
  const chars = '!<>-_\\/[]{}—=+*^?#________';

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;

    const timeout = setTimeout(() => {
      let iteration = 0;
      const totalIterations = text.length * 3;

      const interval = setInterval(() => {
        setDisplayText(
          text
            .split('')
            .map((char, i) => {
              if (char === ' ') return ' ';
              if (i < iteration / 3) return text[i];
              return chars[Math.floor(Math.random() * chars.length)];
            })
            .join('')
        );

        iteration++;
        if (iteration > totalIterations) {
          setDisplayText(text);
          clearInterval(interval);
        }
      }, 30);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timeout);
  }, [started, text, delay]);

  return (
    <span ref={ref} className={className} style={style}>
      {displayText || '\u00A0'}
    </span>
  );
}
