import React, { useState, useEffect } from 'react';
import { sound } from '../utils/audio';

export default function Navbar({
  onOpenContact,
  onOpenCommandPalette,
  soundEnabled,
  onToggleSound,
  currentTheme,
  onSelectTheme
}) {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);

      const sections = ['hero', 'audience', 'works', 'topics', 'about', 'contact'];
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom >= 200) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      sound.playClick();
    }
  };

  const handleCycleTheme = () => {
    const themes = ['alabaster', 'obsidian', 'emerald'];
    const nextIdx = (themes.indexOf(currentTheme) + 1) % themes.length;
    onSelectTheme(themes[nextIdx]);
    sound.playModeSwitch();
  };

  return (
    <header
      style={{
        position: 'fixed',
        top: '1.25rem',
        left: 0,
        width: '100%',
        zIndex: 100,
        pointerEvents: 'none'
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem'
        }}
      >
        {/* Left: Brand / Creator Identity */}
        <div
          onClick={() => scrollTo('hero')}
          style={{
            pointerEvents: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: '0.85rem',
            cursor: 'pointer',
            userSelect: 'none'
          }}
        >
          {/* Plus Mark Icon matching the reference */}
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-card)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 300,
              fontSize: '1.2rem',
              color: 'var(--text-primary)',
              transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
            }}
            className="brand-plus"
          >
            +
          </div>
          <div>
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: '1.05rem',
                letterSpacing: '-0.02em',
                color: 'var(--text-primary)',
                lineHeight: 1.1
              }}
            >
              Anurag Giri
            </div>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.65rem',
                color: 'var(--text-muted)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                fontWeight: 600,
                marginTop: '1px'
              }}
            >
              Creative Technologist & AI
            </div>
          </div>
        </div>

        {/* Center: Floating Dark Pill Menu */}
        <nav
          style={{
            pointerEvents: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: '0.2rem',
            background: 'var(--glass-pill)',
            backdropFilter: 'var(--glass-blur)',
            padding: '0.35rem 0.5rem',
            borderRadius: 'var(--radius-pill)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 16px 36px -8px rgba(0, 0, 0, 0.28)'
          }}
          className="desktop-nav"
        >
          {[
            { id: 'works', label: 'Work' },
            { id: 'audience', label: 'Impact' },
            { id: 'topics', label: 'Topics' },
            { id: 'about', label: 'About' },
            { id: 'contact', label: 'Contact' }
          ].map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                onMouseEnter={() => sound.playHover()}
                style={{
                  background: isActive ? 'rgba(255, 255, 255, 0.14)' : 'transparent',
                  border: 'none',
                  color: isActive ? '#fff' : 'rgba(255, 255, 255, 0.65)',
                  padding: '0.42rem 0.95rem',
                  borderRadius: 'var(--radius-pill)',
                  fontSize: '0.82rem',
                  fontWeight: 500,
                  fontFamily: 'var(--font-body)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  letterSpacing: '0.01em'
                }}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right: Quick Controls & CTA */}
        <div
          style={{
            pointerEvents: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem'
          }}
        >
          {/* ⌘K Command Palette Button */}
          <button
            onClick={() => {
              if (onOpenCommandPalette) onOpenCommandPalette();
              sound.playClick();
            }}
            onMouseEnter={() => sound.playHover()}
            title="Open Developer Command Palette (⌘K)"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-card)',
              borderRadius: 'var(--radius-pill)',
              padding: '0.42rem 0.75rem',
              fontSize: '0.75rem',
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
              transition: 'all 0.2s ease'
            }}
          >
            <span style={{ opacity: 0.7 }}>⌘K</span>
          </button>

          {/* Procedural Sound FX Toggle */}
          <button
            onClick={() => {
              if (onToggleSound) onToggleSound();
            }}
            onMouseEnter={() => sound.playHover()}
            title={soundEnabled ? 'Mute Procedural Sound Effects' : 'Enable Procedural Sound Effects'}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-card)',
              borderRadius: 'var(--radius-pill)',
              padding: '0.42rem 0.65rem',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
              transition: 'all 0.2s ease'
            }}
          >
            <div className={`sound-bars ${soundEnabled ? 'sound-playing' : ''}`}>
              <div className="sound-bar" style={{ height: soundEnabled ? '10px' : '3px' }} />
              <div className="sound-bar" style={{ height: soundEnabled ? '14px' : '3px' }} />
              <div className="sound-bar" style={{ height: soundEnabled ? '6px' : '3px' }} />
            </div>
            <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
              {soundEnabled ? 'FX' : 'MUTED'}
            </span>
          </button>

          {/* Atmosphere Theme Switcher */}
          <button
            onClick={handleCycleTheme}
            onMouseEnter={() => sound.playHover()}
            title={`Atmosphere: ${currentTheme.toUpperCase()} (Click to toggle)`}
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-card)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: '0.85rem',
              color: 'var(--accent-gold)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
              transition: 'transform 0.25s ease'
            }}
          >
            {currentTheme === 'obsidian' ? '🌑' : currentTheme === 'emerald' ? '🌿' : '☀️'}
          </button>

          {/* Primary Let's Talk CTA */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenContact();
            }}
            onMouseEnter={() => sound.playHover()}
            className="btn-pill btn-pill-dark"
            style={{
              padding: '0.45rem 0.6rem 0.45rem 1.1rem',
              fontSize: '0.85rem'
            }}
          >
            <span>Let's Talk</span>
            <div
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: '#fff',
                color: '#161513',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: 700,
                marginLeft: '0.2rem'
              }}
            >
              →
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}
