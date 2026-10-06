import React from 'react';

export default function AudienceSection() {
  const metrics = [
    {
      label: 'Developer Reach',
      value: '150K+',
      desc: 'Engineers & creators impacted across technical guides, open source, and web tools.'
    },
    {
      label: 'Open Source Repos',
      value: '50+',
      desc: 'Public libraries, AI tooling experiments, interactive UI components, and boilerplates.'
    },
    {
      label: 'Core Performance',
      value: '99.9%',
      desc: 'Benchmark uptime and lighthouse scores delivered across client & production apps.'
    },
    {
      label: 'Years Crafting Web & AI',
      value: '4+',
      desc: 'Continuous evolution from foundational full-stack architectures to autonomous AI agents.'
    }
  ];

  const channels = [
    { name: 'GitHub', handle: '@Anurag786ace', link: 'https://github.com/Anurag786ace', color: '#181717' },
    { name: 'LinkedIn', handle: 'in/anurag-giri', link: 'https://linkedin.com/in/anurag-giri', color: '#0A66C2' },
    { name: 'X / Twitter', handle: '@anuraggiri', link: 'https://x.com', color: '#000000' },
    { name: 'YouTube', handle: 'Creative Dev Hub', link: 'https://youtube.com', color: '#FF0000' }
  ];

  return (
    <section id="audience" style={{ borderTop: '1px solid var(--border-subtle)' }}>
      <div className="container">
        {/* Section Header Matching the Video scr_21.png */}
        <div style={{ maxWidth: '780px', marginBottom: '4rem' }}>
          <div className="section-badge">
            <span className="badge-dot" />
            <span>AUDIENCE & IMPACT</span>
          </div>

          <h2
            style={{
              fontSize: 'clamp(2.5rem, 4.8vw, 4.2rem)',
              lineHeight: 1.05,
              fontWeight: 700,
              letterSpacing: '-0.03em',
              marginBottom: '1.25rem'
            }}
          >
            Over one hundred thousand curious minds.
          </h2>

          <p
            style={{
              fontSize: '1.15rem',
              lineHeight: 1.6,
              color: 'var(--text-secondary)'
            }}
          >
            Across YouTube, GitHub, engineering blogs, and community forums. Building
            open tools, architectural deep-dives, and interactive experiments for developers worldwide.
          </p>
        </div>

        {/* Dynamic Metric Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.5rem',
            marginBottom: '3rem'
          }}
        >
          {metrics.map((m, idx) => (
            <div
              key={idx}
              className="glass-card"
              style={{
                padding: '2rem 1.8rem',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.72rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'var(--text-muted)',
                  marginBottom: '0.8rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <span style={{ color: 'var(--accent-gold)' }}>0{idx + 1}</span>
                <span>{m.label}</span>
              </div>

              <div
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '3.2rem',
                  fontWeight: 800,
                  lineHeight: 1,
                  letterSpacing: '-0.03em',
                  color: 'var(--text-primary)',
                  marginBottom: '0.85rem'
                }}
              >
                {m.value}
              </div>

              <p
                style={{
                  fontSize: '0.92rem',
                  lineHeight: 1.5,
                  color: 'var(--text-secondary)'
                }}
              >
                {m.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Platform Links Bar */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1.2rem',
            padding: '1.5rem 2rem',
            background: 'rgba(25, 23, 20, 0.03)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)'
          }}
        >
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            CHANNELS & ACTIVE SPACES:
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem' }}>
            {channels.map((c, i) => (
              <a
                key={i}
                href={c.link}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  padding: '0.45rem 1rem',
                  background: '#fff',
                  borderRadius: 'var(--radius-pill)',
                  textDecoration: 'none',
                  color: 'var(--text-primary)',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  border: '1px solid var(--border-subtle)',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.borderColor = 'var(--accent-gold)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'var(--border-subtle)';
                }}
              >
                <span>{c.name}</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
                  {c.handle}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--accent-gold)' }}>↗</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
