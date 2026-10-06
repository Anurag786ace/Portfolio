import React, { useState, useEffect } from 'react';

export default function Footer() {
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' IST');
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      style={{
        background: 'var(--bg-dark)',
        color: '#fff',
        padding: '4rem 0 3rem 0',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)'
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '2rem',
            paddingBottom: '2.5rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          {/* Brand & Tagline */}
          <div>
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.4rem',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                marginBottom: '0.35rem'
              }}
            >
              Anurag Giri
            </div>
            <p style={{ color: 'rgba(255, 255, 255, 0.55)', fontSize: '0.88rem' }}>
              Creative Technologist & Full-Stack AI Engineer
            </p>
          </div>

          {/* Realtime Timezone Clock */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.5rem 1rem',
              background: 'rgba(255, 255, 255, 0.06)',
              borderRadius: 'var(--radius-pill)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.78rem'
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: '#22c55e',
                boxShadow: '0 0 6px #22c55e'
              }}
            />
            <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>NEW DELHI:</span>
            <span style={{ color: '#fff', fontWeight: 600 }}>{time || 'LIVE'}</span>
          </div>

          {/* Back to Top */}
          <button
            onClick={scrollToTop}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1.1rem',
              background: 'rgba(255, 255, 255, 0.08)',
              color: '#fff',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: 'var(--radius-pill)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.16)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'}
          >
            <span>BACK TO TOP</span>
            <span>↑</span>
          </button>
        </div>

        {/* Bottom Credits */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            paddingTop: '2rem',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem',
            color: 'rgba(255, 255, 255, 0.45)'
          }}
        >
          <div>
            © {new Date().getFullYear()} Anurag Giri. Crafted with React 19, Three.js & GLSL.
          </div>
          <div>
            Built without Tailwind · 100% Bespoke Craftsmanship
          </div>
        </div>
      </div>
    </footer>
  );
}
