import React, { useState } from 'react';

export default function TopicsSection() {
  const [selectedTopic, setSelectedTopic] = useState(0);

  const topics = [
    {
      title: 'Interactive 3D Web & GLSL Shaders',
      tag: 'CREATIVE COMPUTING',
      desc: 'Building spatial computing and WebGL environments directly inside the browser. Harnessing vertex displacement, custom PBR fragment shaders, raymarching, and particle systems running at a fluid 60 FPS.',
      skills: ['Three.js', 'WebGL 2.0', 'GLSL Shaders', 'Post-Processing', 'Blender / 3D Scans'],
      highlight: 'Depth-map displacement, volumetric fog, dynamic studio reflections.'
    },
    {
      title: 'Autonomous AI Agents & Orchestration',
      tag: 'AI & INTELLIGENCE',
      desc: 'Architecting intelligent autonomous agents capable of multithreaded reasoning, tool execution, terminal automation, background monitoring, and self-healing task loops without hallucination.',
      skills: ['LLM Tool Calling', 'Agent Memory & Graph', 'Context Pruning', 'Fastify / WebSockets', 'Vector Embeddings'],
      highlight: 'Subagent hierarchy, background reactive execution, automated verification.'
    },
    {
      title: 'Full-Stack Performance & Modern Architecture',
      tag: 'SYSTEMS ENGINEERING',
      desc: 'Developing scalable, resilient web infrastructures. Clean decoupled frontend design systems coupled with robust backend APIs, database indexing, and low-latency SSR/SSG execution.',
      skills: ['React 19', 'Next.js / Vite', 'TypeScript', 'Node.js', 'PostgreSQL / Prisma', 'Docker'],
      highlight: 'Sub-second initial paint, zero-dependency CSS, strict type safety.'
    },
    {
      title: 'Algorithmic Problem Solving & Core CS',
      tag: 'FOUNDATIONAL THEORY',
      desc: 'Deep grounding in data structures, dynamic programming, graph theory, Huffman coding compression, and time-space optimization for mission-critical computational challenges.',
      skills: ['Data Structures & Algorithms', 'C / C++', 'Python 3', 'Compression Trees', 'System Design'],
      highlight: 'Mathematical rigor, asymptotic complexity analysis, efficient memory layout.'
    }
  ];

  return (
    <section id="topics" style={{ borderTop: '1px solid var(--border-subtle)' }}>
      <div className="container">
        <div style={{ maxWidth: '780px', marginBottom: '4rem' }}>
          <div className="section-badge">
            <span className="badge-dot" />
            <span>TOPICS & DOMAIN MASTERY</span>
          </div>

          <h2
            style={{
              fontSize: 'clamp(2.5rem, 4.5vw, 4rem)',
              lineHeight: 1.05,
              fontWeight: 700,
              letterSpacing: '-0.03em',
              marginBottom: '1.25rem'
            }}
          >
            Where code meets craftsmanship.
          </h2>

          <p style={{ fontSize: '1.15rem', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
            Deep exploration at the convergence of high-end visual design, high-frequency algorithms,
            and machine intelligence.
          </p>
        </div>

        {/* Interactive Topic Tabs and Detailed Display */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(280px, 1fr) 1.5fr',
            gap: '2.5rem',
            alignItems: 'start'
          }}
          className="topics-layout"
        >
          {/* Left: Topic Selector List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {topics.map((t, idx) => {
              const isSelected = selectedTopic === idx;
              return (
                <div
                  key={idx}
                  onClick={() => setSelectedTopic(idx)}
                  style={{
                    padding: '1.4rem 1.6rem',
                    borderRadius: 'var(--radius-md)',
                    background: isSelected ? 'var(--bg-dark)' : 'var(--bg-card)',
                    color: isSelected ? '#fff' : 'var(--text-primary)',
                    border: '1px solid',
                    borderColor: isSelected ? 'transparent' : 'var(--border-subtle)',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)',
                    boxShadow: isSelected ? '0 12px 28px rgba(0,0,0,0.2)' : 'none'
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.7rem',
                      letterSpacing: '0.08em',
                      color: isSelected ? 'var(--accent-gold)' : 'var(--text-muted)',
                      marginBottom: '0.4rem',
                      fontWeight: 600
                    }}
                  >
                    0{idx + 1} · {t.tag}
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.2rem',
                      fontWeight: 700,
                      lineHeight: 1.25
                    }}
                  >
                    {t.title}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Topic Expanded Showcase */}
          <div
            className="glass-card"
            style={{
              padding: '3rem 2.5rem',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                color: 'var(--accent-gold)',
                fontWeight: 700,
                letterSpacing: '0.1em',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <span>DEEP DIVE // FOCUS {selectedTopic + 1}</span>
            </div>

            <h3
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '2.1rem',
                fontWeight: 700,
                lineHeight: 1.15,
                marginBottom: '1.25rem',
                color: 'var(--text-primary)'
              }}
            >
              {topics[selectedTopic].title}
            </h3>

            <p
              style={{
                fontSize: '1.05rem',
                lineHeight: 1.7,
                color: 'var(--text-secondary)',
                marginBottom: '2rem'
              }}
            >
              {topics[selectedTopic].desc}
            </p>

            <div
              style={{
                padding: '1.2rem 1.5rem',
                background: 'rgba(25, 23, 20, 0.04)',
                borderRadius: 'var(--radius-md)',
                marginBottom: '2rem',
                borderLeft: '3px solid var(--accent-gold)'
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  marginBottom: '0.3rem'
                }}
              >
                KEY COMPETENCY & CAPABILITY
              </div>
              <div style={{ fontSize: '0.92rem', color: 'var(--text-secondary)' }}>
                {topics[selectedTopic].highlight}
              </div>
            </div>

            <div>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.72rem',
                  color: 'var(--text-muted)',
                  marginBottom: '0.8rem',
                  fontWeight: 600
                }}
              >
                CORE TECH IN PRODUCTION:
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {topics[selectedTopic].skills.map((s, i) => (
                  <span
                    key={i}
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      padding: '0.4rem 0.85rem',
                      background: '#fff',
                      color: 'var(--text-primary)',
                      borderRadius: 'var(--radius-pill)',
                      border: '1px solid var(--border-subtle)',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
                    }}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
