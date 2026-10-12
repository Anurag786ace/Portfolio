import React from 'react';

/**
 * InfiniteMarquee — Horizontal scrolling text band with smooth CSS animation.
 * Used between sections for a luxurious editorial feel.
 */
export default function InfiniteMarquee({ items, speed = 35, separator = '✦', reverse = false }) {
  const content = items.join(` ${separator} `) + ` ${separator} `;
  // Duplicate for seamless loop
  const doubledContent = content + content;

  return (
    <div
      style={{
        width: '100%',
        overflow: 'hidden',
        padding: '1.5rem 0',
        borderTop: '1px solid var(--border-subtle)',
        borderBottom: '1px solid var(--border-subtle)',
        background: 'rgba(25, 23, 20, 0.02)',
        position: 'relative',
        zIndex: 2
      }}
    >
      <div
        style={{
          display: 'flex',
          whiteSpace: 'nowrap',
          animation: `marquee-scroll ${speed}s linear infinite ${reverse ? 'reverse' : ''}`,
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(1.6rem, 3vw, 2.8rem)',
          fontWeight: 700,
          letterSpacing: '-0.02em',
          color: 'var(--text-primary)',
          opacity: 0.08
        }}
      >
        <span style={{ paddingRight: '2rem' }}>{doubledContent}</span>
        <span style={{ paddingRight: '2rem' }}>{doubledContent}</span>
      </div>

      <style>{`
        @keyframes marquee-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
