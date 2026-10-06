import React, { useState } from 'react';
import bloomImg from '../assets/fibrous_bloom_orb.jpg';
import canImg from '../assets/futuristic_can_showcase.jpg';

export default function WorksSection({ onSelectProject }) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [tiltAngles, setTiltAngles] = useState({});

  const projects = [
    {
      id: 'bloom',
      category: '3d-ai',
      badge: 'GENERATIVE 3D & AI',
      title: 'Emergent Neural Bloom',
      subtitle: 'Parametric generative fibrous organism built with math & GLSL shaders',
      desc: 'An exploration of algorithmic organic beauty, featuring tens of thousands of procedural fibrous tendrils driven by noise fields and reactive to user audio and mouse dynamics.',
      image: bloomImg,
      tags: ['Three.js', 'GLSL Shaders', 'WebGL', 'Generative Math'],
      metrics: '60 FPS WebGL · Octane Aesthetics · Audio Reactive',
      liveUrl: 'https://github.com/Anurag786ace',
      githubUrl: 'https://github.com/Anurag786ace'
    },
    {
      id: 'neon-flow',
      category: 'interactive-3d',
      badge: '3D COMMERCIAL & WEBGL',
      title: 'Neon Flow 3D Product Experience',
      subtitle: 'Photorealistic commercial digital can with dynamic studio reflections',
      desc: 'An interactive luxury commercial showcase featuring physical specular condensation shaders, dynamic lighting angles, and gyroscope-driven tilt on mobile devices.',
      image: canImg,
      tags: ['React 19', 'Three.js', 'PBR Shaders', 'Commercial UI'],
      metrics: 'Dynamic Normal Maps · Realtime Specular · Zero-Latency',
      liveUrl: 'https://github.com/Anurag786ace',
      githubUrl: 'https://github.com/Anurag786ace'
    },
    {
      id: 'agent-studio',
      category: 'ai-agents',
      badge: 'AUTONOMOUS SYSTEMS',
      title: 'Antigravity Agent Orchestrator',
      subtitle: 'Multi-agent developer assistant with reactive background scheduling',
      desc: 'Full-stack platform empowering autonomous coding agents to navigate workspaces, execute commands, reason over context graphs, and self-heal build failures.',
      image: null,
      customVisual: 'agent-matrix',
      tags: ['TypeScript', 'Node.js', 'LLM Tool Calling', 'Fastify', 'Context Graph'],
      metrics: 'Autonomous Reasoning · Subagent Hierarchy · 99.4% Task Success',
      liveUrl: 'https://github.com/Anurag786ace',
      githubUrl: 'https://github.com/Anurag786ace'
    },
    {
      id: 'prism-ui',
      category: 'frontend',
      badge: 'UI FRAMEWORK',
      title: 'Prism Micro-Interaction System',
      subtitle: 'High-performance design system with zero-dependency CSS architecture',
      desc: 'A curated collection of frictionless web components, physics-based gesture navigation, spring animations, and glassmorphic micro-utilities built without bloat.',
      image: null,
      customVisual: 'prism-grid',
      tags: ['React', 'Vanilla CSS', 'Web Audio API', 'Accessibility', 'Vite'],
      metrics: '<12kb Bundle · 100/100 Lighthouse · 0 External CSS Libs',
      liveUrl: 'https://github.com/Anurag786ace',
      githubUrl: 'https://github.com/Anurag786ace'
    }
  ];

  const filteredProjects = activeFilter === 'all'
    ? projects
    : projects.filter(p => p.category === activeFilter);

  // 3D Card Hover Tilt Effect
  const handleMouseMove = (e, id) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const rotateX = -(y / (rect.height / 2)) * 7;
    const rotateY = (x / (rect.width / 2)) * 7;
    setTiltAngles(prev => ({ ...prev, [id]: { rx: rotateX, ry: rotateY } }));
  };

  const handleMouseLeave = (id) => {
    setTiltAngles(prev => ({ ...prev, [id]: { rx: 0, ry: 0 } }));
  };

  return (
    <section id="works" style={{ borderTop: '1px solid var(--border-subtle)' }}>
      <div className="container">
        {/* Section Heading */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: '2rem',
            marginBottom: '3.5rem'
          }}
        >
          <div>
            <div className="section-badge">
              <span className="badge-dot" />
              <span>SELECTED WORKS & LAB EXPERIMENTS</span>
            </div>
            <h2
              style={{
                fontSize: 'clamp(2.5rem, 4.5vw, 4rem)',
                lineHeight: 1.05,
                fontWeight: 700,
                letterSpacing: '-0.03em'
              }}
            >
              Crafting experiences that linger.
            </h2>
          </div>

          {/* Filter Pills */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.4rem',
              background: 'rgba(25, 23, 20, 0.05)',
              padding: '0.3rem',
              borderRadius: 'var(--radius-pill)',
              border: '1px solid var(--border-subtle)'
            }}
          >
            {[
              { id: 'all', label: 'All Artifacts' },
              { id: '3d-ai', label: '3D & Generative' },
              { id: 'interactive-3d', label: 'Commercial 3D' },
              { id: 'ai-agents', label: 'AI & Agents' },
              { id: 'frontend', label: 'UI Architecture' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                style={{
                  padding: '0.45rem 1rem',
                  borderRadius: 'var(--radius-pill)',
                  border: 'none',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  background: activeFilter === tab.id ? 'var(--bg-dark)' : 'transparent',
                  color: activeFilter === tab.id ? '#fff' : 'var(--text-secondary)'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))',
            gap: '2.5rem'
          }}
          className="works-grid"
        >
          {filteredProjects.map(proj => {
            const tilt = tiltAngles[proj.id] || { rx: 0, ry: 0 };

            return (
              <div
                key={proj.id}
                onMouseMove={(e) => handleMouseMove(e, proj.id)}
                onMouseLeave={() => handleMouseLeave(proj.id)}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-card)',
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                  transform: `perspective(1000px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
                  transition: 'transform 0.15s ease-out, box-shadow 0.3s ease, border-color 0.3s ease',
                  boxShadow: '0 20px 40px -15px rgba(25, 22, 19, 0.08)',
                  display: 'flex',
                  flexDirection: 'column'
                }}
                className="project-card"
              >
                {/* Media Preview Box */}
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    height: '360px',
                    background: '#181715',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {proj.image ? (
                    <img
                      src={proj.image}
                      alt={proj.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
                      }}
                      className="project-img"
                    />
                  ) : proj.customVisual === 'agent-matrix' ? (
                    // Futuristic Matrix Agent Terminal Graphic
                    <div
                      style={{
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(135deg, #141311 0%, #201e1a 100%)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: '2rem',
                        position: 'relative'
                      }}
                    >
                      <div
                        style={{
                          width: '80px',
                          height: '80px',
                          borderRadius: '50%',
                          border: '2px solid var(--accent-gold)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginBottom: '1.25rem',
                          boxShadow: '0 0 30px var(--accent-gold-glow)'
                        }}
                      >
                        <span style={{ fontSize: '2rem', color: 'var(--accent-gold)' }}>⚡</span>
                      </div>
                      <div
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.85rem',
                          color: '#fff',
                          letterSpacing: '0.1em',
                          textAlign: 'center'
                        }}
                      >
                        REACTIVE AGENT GRAPH ACTIVE
                      </div>
                      <div
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.72rem',
                          color: 'var(--text-muted)',
                          marginTop: '0.5rem'
                        }}
                      >
                        6 Parallel Workers · Zero Bottlenecks
                      </div>
                    </div>
                  ) : (
                    // Prism UI Geometric Waveform Graphic
                    <div
                      style={{
                        width: '100%',
                        height: '100%',
                        background: 'radial-gradient(circle at center, #2c2722 0%, #151412 100%)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: '2rem'
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          gap: '8px',
                          alignItems: 'flex-end',
                          height: '60px',
                          marginBottom: '1rem'
                        }}
                      >
                        {[40, 65, 25, 80, 50, 95, 30, 70].map((h, i) => (
                          <div
                            key={i}
                            style={{
                              width: '8px',
                              height: `${h}%`,
                              background: 'var(--accent-gold)',
                              borderRadius: '4px',
                              opacity: 0.85
                            }}
                          />
                        ))}
                      </div>
                      <div
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.85rem',
                          color: '#fff',
                          letterSpacing: '0.1em'
                        }}
                      >
                        60FPS SPRING MOTION ENGINE
                      </div>
                    </div>
                  )}

                  {/* Corner Badge */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '1.25rem',
                      left: '1.25rem',
                      background: 'rgba(22, 21, 19, 0.85)',
                      backdropFilter: 'blur(10px)',
                      color: 'var(--accent-gold)',
                      padding: '0.35rem 0.8rem',
                      borderRadius: 'var(--radius-pill)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      letterSpacing: '0.08em',
                      border: '1px solid rgba(255, 255, 255, 0.12)'
                    }}
                  >
                    {proj.badge}
                  </div>
                </div>

                {/* Card Information */}
                <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '0.6rem'
                    }}
                  >
                    <h3
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '1.65rem',
                        fontWeight: 700,
                        color: 'var(--text-primary)',
                        letterSpacing: '-0.02em'
                      }}
                    >
                      {proj.title}
                    </h3>
                    <a
                      href={proj.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        width: '34px',
                        height: '34px',
                        borderRadius: '50%',
                        background: 'rgba(25, 23, 20, 0.06)',
                        border: '1px solid var(--border-subtle)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textDecoration: 'none',
                        color: 'var(--text-primary)',
                        fontSize: '1rem',
                        fontWeight: 700,
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'var(--bg-dark)';
                        e.currentTarget.style.color = '#fff';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(25, 23, 20, 0.06)';
                        e.currentTarget.style.color = 'var(--text-primary)';
                      }}
                    >
                      ↗
                    </a>
                  </div>

                  <p
                    style={{
                      fontSize: '0.96rem',
                      lineHeight: 1.55,
                      color: 'var(--text-secondary)',
                      marginBottom: '1.4rem'
                    }}
                  >
                    {proj.desc}
                  </p>

                  {/* Highlights Bar */}
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.72rem',
                      color: 'var(--text-muted)',
                      padding: '0.6rem 0.85rem',
                      background: 'rgba(25, 23, 20, 0.03)',
                      borderRadius: 'var(--radius-sm)',
                      marginBottom: '1.25rem',
                      borderLeft: '2px solid var(--accent-gold)'
                    }}
                  >
                    {proj.metrics}
                  </div>

                  {/* Tech Stack Pills */}
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '0.4rem',
                      marginTop: 'auto'
                    }}
                  >
                    {proj.tags.map((t, i) => (
                      <span
                        key={i}
                        style={{
                          fontSize: '0.72rem',
                          fontFamily: 'var(--font-mono)',
                          padding: '0.25rem 0.65rem',
                          background: 'rgba(25, 23, 20, 0.05)',
                          borderRadius: 'var(--radius-pill)',
                          color: 'var(--text-secondary)',
                          border: '1px solid var(--border-subtle)'
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
