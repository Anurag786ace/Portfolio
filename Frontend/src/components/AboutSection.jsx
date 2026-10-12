import React, { useState } from 'react';
import SmoothReveal from './SmoothReveal';
import realPhoto from '../assets/user_photo.jpg';
import { sound } from '../utils/audio';

export default function AboutSection({ onOpenContact }) {
  const [activeTab, setActiveTab] = useState('philosophy'); // 'philosophy' | 'timeline'
  const [downloading, setDownloading] = useState(false);

  const handleDownloadResume = () => {
    setDownloading(true);
    sound.playSuccess();

    // Create and download a formatted resume summary
    const resumeContent = `ANURAG GIRI — CREATIVE TECHNOLOGIST & FULL-STACK ENGINEER
Location: India | Email: sankhaanurag2005@gmail.com
GitHub: https://github.com/Anurag786ace
LinkedIn: https://www.linkedin.com/in/anurag-giri-334259241

--------------------------------------------------
CORE SPECIALIZATIONS:
- Interactive 3D Web & GLSL Shaders (Three.js, WebGL 2.0, Raymarching, PBR materials)
- Autonomous AI Agent Orchestration (Tool Calling, Context Graphs, Background Scheduling)
- High-Performance Full-Stack Systems (React 19, TypeScript, Node.js, Fastify, Zero-CSS Bloat)
- Algorithmic Problem Solving (Data Structures, Huffman Coding, Time-Space Optimization)

--------------------------------------------------
FEATURED ACHIEVEMENTS:
- Built 60 FPS real-time WebGL depth displacement interactive 3D face bust with particle dispersion.
- Architected multi-agent tool execution platforms with self-healing feedback loops.
- Engineered zero-dependency modern CSS design systems with sub-60ms response metrics.
`;

    const blob = new Blob([resumeContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Anurag_Giri_Engineering_Resume.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setTimeout(() => setDownloading(false), 1500);
  };

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
          {/* Left: Authentic Portrait of Anurag */}
          <SmoothReveal direction="left">
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
                      boxShadow: '0 0 10px #22c55e',
                      animation: 'pulseGlow 2s ease-in-out infinite'
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
          </SmoothReveal>

          {/* Right: Personal Narrative, Tab Switcher & Resume */}
          <SmoothReveal direction="right" delay={200}>
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '1rem',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}
              >
                <div className="section-badge" style={{ marginBottom: 0 }}>
                  <span className="badge-dot" />
                  <span>ABOUT // THE JOURNEY</span>
                </div>

                {/* Tab Pill Switcher */}
                <div
                  style={{
                    display: 'flex',
                    gap: '0.3rem',
                    background: 'rgba(25, 23, 20, 0.05)',
                    padding: '0.25rem',
                    borderRadius: 'var(--radius-pill)',
                    border: '1px solid var(--border-subtle)'
                  }}
                >
                  <button
                    onClick={() => {
                      setActiveTab('philosophy');
                      sound.playClick();
                    }}
                    onMouseEnter={() => sound.playHover()}
                    style={{
                      padding: '0.35rem 0.85rem',
                      borderRadius: 'var(--radius-pill)',
                      border: 'none',
                      fontSize: '0.75rem',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 600,
                      cursor: 'pointer',
                      background: activeTab === 'philosophy' ? 'var(--bg-dark)' : 'transparent',
                      color: activeTab === 'philosophy' ? '#fff' : 'var(--text-secondary)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    Philosophy
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('timeline');
                      sound.playClick();
                    }}
                    onMouseEnter={() => sound.playHover()}
                    style={{
                      padding: '0.35rem 0.85rem',
                      borderRadius: 'var(--radius-pill)',
                      border: 'none',
                      fontSize: '0.75rem',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 600,
                      cursor: 'pointer',
                      background: activeTab === 'timeline' ? 'var(--bg-dark)' : 'transparent',
                      color: activeTab === 'timeline' ? '#fff' : 'var(--text-secondary)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    Milestones
                  </button>
                </div>
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

              {activeTab === 'philosophy' ? (
                <>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2.5rem' }}>
                    <p style={{ fontSize: '1.1rem', lineHeight: 1.7, color: 'var(--text-primary)' }}>
                      I'm Anurag Giri, a computer science engineer and creative technologist based in India.
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
                          border: '1px solid var(--border-subtle)',
                          transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-4px)';
                          e.currentTarget.style.boxShadow = '0 12px 24px rgba(25, 23, 20, 0.08)';
                          e.currentTarget.style.borderColor = 'var(--accent-gold)';
                          sound.playHover();
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = 'none';
                          e.currentTarget.style.borderColor = 'var(--border-subtle)';
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
                </>
              ) : (
                /* Milestones / Experience Timeline View */
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2.8rem' }}>
                  {[
                    {
                      period: '2024 — PRESENT',
                      role: 'Creative Technologist & AI Architect',
                      org: 'Independent / Open Source',
                      desc: 'Architecting real-time WebGL interactive 3D portfolios, autonomous multi-agent task orchestrators, and custom GLSL vertex shader pipelines.'
                    },
                    {
                      period: '2022 — 2024',
                      role: 'Systems Engineering & Full-Stack Core',
                      org: 'CS Engineering',
                      desc: 'Specialized in asymptotic complexity analysis, graph optimization, low-latency microservices with Node.js, and modern React design systems.'
                    },
                    {
                      period: 'CORE MILESTONES',
                      role: 'Creative Web & AI Tooling Milestones',
                      org: 'GitHub Ecosystem',
                      desc: 'Over 150K+ developer reach across social engineering deep dives, and production WebGL shader experiments.'
                    }
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '1.25rem 1.4rem',
                        borderRadius: 'var(--radius-md)',
                        background: 'rgba(25, 23, 20, 0.03)',
                        borderLeft: '3px solid var(--accent-gold)',
                        borderTop: '1px solid var(--border-subtle)',
                        borderRight: '1px solid var(--border-subtle)',
                        borderBottom: '1px solid var(--border-subtle)'
                      }}
                    >
                      <div
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.72rem',
                          color: 'var(--accent-gold)',
                          fontWeight: 700,
                          letterSpacing: '0.08em',
                          marginBottom: '0.3rem'
                        }}
                      >
                        {item.period} · {item.org}
                      </div>
                      <div
                        style={{
                          fontFamily: 'var(--font-display)',
                          fontSize: '1.1rem',
                          fontWeight: 700,
                          color: 'var(--text-primary)',
                          marginBottom: '0.35rem'
                        }}
                      >
                        {item.role}
                      </div>
                      <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                        {item.desc}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Action Buttons with Download Resume */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <button
                  onClick={() => {
                    sound.playClick();
                    onOpenContact();
                  }}
                  className="btn-pill btn-pill-dark"
                >
                  <span>Start a Project</span>
                  <span className="arrow-circle">→</span>
                </button>

                <button
                  onClick={handleDownloadResume}
                  className="btn-pill btn-pill-light"
                  title="Download Resume Summary"
                >
                  <span>{downloading ? '✓ Downloading...' : 'Download Resume Spec'}</span>
                  <span style={{ fontSize: '0.85rem' }}>↓</span>
                </button>

                <a
                  href="https://github.com/Anurag786ace"
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => sound.playClick()}
                  className="btn-pill btn-pill-light"
                >
                  <span>GitHub Profile</span>
                  <span style={{ fontSize: '0.85rem' }}>↗</span>
                </a>
              </div>
            </div>
          </SmoothReveal>
        </div>
      </div>
    </section>
  );
}
