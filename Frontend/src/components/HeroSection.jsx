import React from 'react';
import Hero3DCanvas from './Hero3DCanvas';

export default function HeroSection({ scrollProgress, onExploreWork, onOpenContact }) {
  return (
    <section
      id="hero"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        paddingTop: '6.5rem',
        paddingBottom: '3rem',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div className="container" style={{ width: '100%' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            alignItems: 'center',
            position: 'relative',
            minHeight: '75vh'
          }}
          className="hero-grid"
        >
          {/* Left Hero Content */}
          <div
            style={{
              position: 'relative',
              zIndex: 10,
              maxWidth: '560px',
              pointerEvents: 'auto'
            }}
          >
            <div className="section-badge">
              <span className="badge-dot" />
              <span>CREATIVE TECHNOLOGIST & AI ARCHITECT</span>
            </div>

            {/* Exact Lowercase Title Match to the Video: "content that connects." */}
            <h1
              style={{
                fontSize: 'clamp(3.2rem, 6.5vw, 5.6rem)',
                lineHeight: 0.95,
                fontWeight: 700,
                letterSpacing: '-0.04em',
                marginBottom: '1.8rem',
                color: 'var(--text-primary)',
                textTransform: 'lowercase'
              }}
            >
              content that<br />
              <span
                style={{
                  color: 'var(--text-primary)',
                  position: 'relative',
                  display: 'inline-block'
                }}
              >
                connects.
                <span
                  style={{
                    position: 'absolute',
                    bottom: '6px',
                    left: 0,
                    width: '100%',
                    height: '4px',
                    background: 'var(--accent-gold)',
                    opacity: 0.75,
                    borderRadius: '2px'
                  }}
                />
              </span>
            </h1>

            <p
              style={{
                fontSize: 'clamp(1.05rem, 1.4vw, 1.22rem)',
                lineHeight: 1.6,
                color: 'var(--text-secondary)',
                marginBottom: '2.5rem',
                maxWidth: '480px'
              }}
            >
              Hi, I’m <strong>Anurag Giri</strong>. I craft high-performance web applications,
              intelligent AI workflows, and cinematic 3D digital experiences that bridge human intuition and computational precision.
            </p>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                flexWrap: 'wrap'
              }}
            >
              <button
                onClick={onExploreWork}
                className="btn-pill btn-pill-dark"
                style={{
                  padding: '0.75rem 1.4rem'
                }}
              >
                <span>Explore Works</span>
                <span className="arrow-circle">↓</span>
              </button>

              <button
                onClick={onOpenContact}
                className="btn-pill btn-pill-light"
                style={{
                  padding: '0.75rem 1.4rem'
                }}
              >
                <span>Get In Touch</span>
                <span style={{ fontSize: '1rem', color: 'var(--accent-gold)' }}>✦</span>
              </button>
            </div>

            {/* Quick Spec Pills */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1.5rem',
                marginTop: '3.5rem',
                paddingTop: '1.5rem',
                borderTop: '1px solid var(--border-subtle)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                color: 'var(--text-muted)'
              }}
            >
              <div>
                <span style={{ display: 'block', color: 'var(--text-primary)', fontWeight: 700, fontSize: '0.9rem' }}>
                  NEW DELHI, IN
                </span>
                <span>AVAILABLE WORLDWIDE</span>
              </div>
              <div style={{ width: '1px', height: '24px', background: 'var(--border-subtle)' }} />
              <div>
                <span style={{ display: 'block', color: 'var(--text-primary)', fontWeight: 700, fontSize: '0.9rem' }}>
                  STACK FOCUS
                </span>
                <span>REACT · THREE.JS · AI SYSTEMS</span>
              </div>
            </div>
          </div>

          {/* Center 3D Interactive Head Canvas (Matches Video Sculpture) */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-42%, -50%)',
              width: 'min(90vw, 760px)',
              height: 'min(85vh, 760px)',
              zIndex: 5,
              pointerEvents: 'auto'
            }}
            className="hero-canvas-wrap"
          >
            <Hero3DCanvas scrollProgress={scrollProgress} />
          </div>

          {/* Right Floating Scroll Indicator */}
          <div
            style={{
              position: 'absolute',
              right: 0,
              top: '50%',
              transform: 'translateY(-50%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.75rem',
              zIndex: 10,
              pointerEvents: 'none'
            }}
            className="hero-scroll-hint"
          >
            <div
              style={{
                writingMode: 'vertical-rl',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.7rem',
                letterSpacing: '0.15em',
                color: 'var(--text-muted)',
                textTransform: 'uppercase'
              }}
            >
              Scroll to disperse particles
            </div>
            <div
              style={{
                width: '1px',
                height: '48px',
                background: 'linear-gradient(to bottom, var(--text-muted), transparent)'
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
