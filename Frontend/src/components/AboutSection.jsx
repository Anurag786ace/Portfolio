import React from 'react';
import realPhoto from '../assets/user_photo.jpg';

export default function AboutSection({ onOpenContact }) {
  return (
    <section id="about" style={{ borderTop: '1px solid var(--border-subtle)' }}>
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(320px, 460px) 1fr',
            gap: '4.5rem',
            alignItems: 'center'
          }}
          className="about-grid"
        >
          {/* Left: Authentic Portrait of Anurag in Olive Green Shirt */}
          <div style={{ position: 'relative' }}>
            <div
              style={{
                position: 'relative',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                boxShadow: '0 25px 60px -15px rgba(25, 22, 19, 0.16)',
                border: '1px solid var(--border-subtle)',
                background: '#cfc6bb'
              }}
            >
              <img
                src={realPhoto}
                alt="Anurag Giri"
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                  filter: 'contrast(1.02) saturate(1.02)',
                  transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
                className="about-portrait"
              />

              {/* Luxury Floating Glass Badge */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '1.5rem',
                  left: '1.5rem',
                  right: '1.5rem',
                  background: 'rgba(22, 21, 19, 0.85)',
                  backdropFilter: 'blur(16px)',
                  padding: '1rem 1.25rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid rgba(255, 255, 255, 0.14)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem' }}>
                    Anurag Giri
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.68rem',
                      color: 'var(--accent-gold)',
                      letterSpacing: '0.08em'
                    }}
                  >
                    CREATOR & ENGINEER
                  </div>
                </div>
                <div
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: '#22c55e',
                    boxShadow: '0 0 10px #22c55e'
                  }}
                  title="Available for collaboration"
                />
              </div>
            </div>

            {/* Background Aesthetic Glow */}
            <div
              style={{
                position: 'absolute',
                top: '-15px',
                left: '-15px',
                width: '100%',
                height: '100%',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)',
                pointerEvents: 'none',
                zIndex: -1
              }}
            />
          </div>

          {/* Right: Personal Narrative & Philosophy */}
          <div>
            <div className="section-badge">
              <span className="badge-dot" />
              <span>ABOUT // THE PHILOSOPHY</span>
            </div>

            <h2
              style={{
                fontSize: 'clamp(2.4rem, 4.2vw, 3.8rem)',
                lineHeight: 1.05,
                fontWeight: 700,
                letterSpacing: '-0.03em',
                marginBottom: '1.8rem'
              }}
            >
              Building software with emotional resonance.
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2.5rem' }}>
              <p style={{ fontSize: '1.1rem', lineHeight: 1.7, color: 'var(--text-primary)' }}>
                I’m Anurag Giri, a computer science engineer and creative technologist based in India.
                I believe software shouldn't just be functional—it should be captivating, intuitive, and unforgettable.
              </p>

              <p style={{ fontSize: '1rem', lineHeight: 1.65, color: 'var(--text-secondary)' }}>
                Whether architecting multi-agent AI ecosystems, coding mathematical 3D shaders in WebGL,
                or developing high-availability cloud backends, my focus remains constant:
                <strong> zero friction, cinematic aesthetics, and algorithmic precision.</strong>
              </p>
            </div>

            {/* Core Values */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1.2rem',
                marginBottom: '2.8rem'
              }}
            >
              {[
                { title: 'Sub-60ms Latency', desc: 'Performance is a non-negotiable design feature.' },
                { title: 'Algorithmic Depth', desc: 'From Huffman trees to vector spaces and agent loops.' },
                { title: 'Tactile Polish', desc: 'Every hover, curve, and shadow has deliberate intention.' }
              ].map((val, i) => (
                <div
                  key={i}
                  style={{
                    padding: '1.2rem',
                    background: 'rgba(25, 23, 20, 0.03)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)'
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1rem',
                      fontWeight: 700,
                      marginBottom: '0.4rem',
                      color: 'var(--text-primary)'
                    }}
                  >
                    {val.title}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                    {val.desc}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <button onClick={onOpenContact} className="btn-pill btn-pill-dark">
                <span>Start a Project</span>
                <span className="arrow-circle">→</span>
              </button>

              <a
                href="https://github.com/Anurag786ace"
                target="_blank"
                rel="noreferrer"
                className="btn-pill btn-pill-light"
              >
                <span>View GitHub Profile</span>
                <span style={{ fontSize: '0.85rem' }}>↗</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
