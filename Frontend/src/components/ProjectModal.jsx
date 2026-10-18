import React, { useEffect } from 'react';
import { sound } from '../utils/audio';

export default function ProjectModal({ project, isOpen, onClose, onOpenContact }) {
  useEffect(() => {
    if (isOpen) {
      sound.playOpen();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        sound.playClose();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !project) return null;

  return (
    <div
      className="drawer-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          sound.playClose();
          onClose();
        }
      }}
    >
      <div className="drawer-panel">
        {/* Top Header Bar */}
        <div
          style={{
            position: 'sticky',
            top: 0,
            background: 'var(--bg-primary)',
            borderBottom: '1px solid var(--border-subtle)',
            padding: '1.25rem 2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            zIndex: 10
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.7rem',
                textTransform: 'uppercase',
                padding: '0.2rem 0.6rem',
                borderRadius: '9999px',
                background: 'rgba(216, 131, 42, 0.12)',
                color: 'var(--accent-gold)',
                fontWeight: 600,
                letterSpacing: '0.05em'
              }}
            >
              CASE STUDY // {(Array.isArray(project.category) ? project.category.join(' & ') : (project.category || '')).toUpperCase()}
            </span>
          </div>

          <button
            onClick={() => {
              sound.playClose();
              onClose();
            }}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'rgba(0, 0, 0, 0.05)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.1rem',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              transition: 'transform 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.1)';
              sound.playHover();
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
            title="Close Case Study"
          >
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div style={{ padding: '2rem 2.5rem 4rem' }}>
          {/* Main Visual or Graphic Preview */}
          {project.image ? (
            <a
              href={project.liveUrl || project.githubUrl}
              target="_blank"
              rel="noreferrer"
              onClick={() => sound.playClick()}
              style={{ display: 'block', textDecoration: 'none', cursor: 'pointer' }}
              title={project.liveUrl ? "Click to open live application" : "View source"}
            >
              <div
                style={{
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  marginBottom: '2rem',
                  border: '1px solid var(--border-subtle)',
                  boxShadow: '0 15px 40px rgba(0,0,0,0.1)',
                  position: 'relative'
                }}
              >
                <img
                  src={project.image}
                  alt={project.title}
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                />
              </div>
            </a>
          ) : (
            <div
              style={{
                height: '240px',
                borderRadius: 'var(--radius-md)',
                background: 'linear-gradient(135deg, var(--bg-dark-surface), var(--bg-dark))',
                border: '1px solid var(--border-dark)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '2rem',
                color: '#fff',
                padding: '1.5rem',
                textAlign: 'center'
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.8rem',
                  color: 'var(--accent-gold)',
                  letterSpacing: '0.1em',
                  marginBottom: '0.5rem'
                }}
              >
                // SYSTEM ARCHITECTURE
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700 }}>
                {project.title}
              </div>
              <div
                style={{
                  fontSize: '0.85rem',
                  color: 'rgba(255,255,255,0.65)',
                  marginTop: '0.5rem',
                  maxWidth: '400px'
                }}
              >
                {project.metrics}
              </div>
            </div>
          )}

          {/* Title & Subtitle */}
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2rem, 3.5vw, 2.8rem)',
              lineHeight: 1.1,
              fontWeight: 700,
              letterSpacing: '-0.02em',
              marginBottom: '0.75rem',
              color: 'var(--text-primary)'
            }}
          >
            {project.title}
          </h2>

          <p
            style={{
              fontSize: '1.15rem',
              lineHeight: 1.55,
              color: 'var(--accent-gold)',
              fontWeight: 500,
              marginBottom: '2rem'
            }}
          >
            {project.subtitle}
          </p>

          {/* Tech Stack Pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '2.5rem' }}>
            {project.tags.map((tag, i) => (
              <span
                key={i}
                style={{
                  padding: '0.35rem 0.85rem',
                  borderRadius: '9999px',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-card)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  color: 'var(--text-primary)'
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Deep Dive Breakdown */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginBottom: '3rem' }}>
            <div
              style={{
                padding: '1.5rem',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-card)'
              }}
            >
              <h4
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.8rem',
                  textTransform: 'uppercase',
                  color: 'var(--accent-gold)',
                  letterSpacing: '0.08em',
                  marginBottom: '0.65rem'
                }}
              >
                01 // The Engineering Challenge
              </h4>
              <p style={{ fontSize: '0.95rem', lineHeight: 1.65, color: 'var(--text-secondary)' }}>
                {project.desc}
              </p>
            </div>

            <div
              style={{
                padding: '1.5rem',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-card)'
              }}
            >
              <h4
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.8rem',
                  textTransform: 'uppercase',
                  color: 'var(--accent-gold)',
                  letterSpacing: '0.08em',
                  marginBottom: '0.65rem'
                }}
              >
                02 // Algorithmic Architecture & Verification
              </h4>
              <p style={{ fontSize: '0.95rem', lineHeight: 1.65, color: 'var(--text-secondary)' }}>
                {project.architectureDesc || 'Leveraging modular state management, hardware-accelerated shaders, and strict latency bounds. All calculations utilize optimized matrix transformations and vector operations to prevent frame dropping across mobile and desktop viewports.'}
              </p>
            </div>

            <div
              style={{
                padding: '1.5rem',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-card)'
              }}
            >
              <h4
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.8rem',
                  textTransform: 'uppercase',
                  color: 'var(--accent-gold)',
                  letterSpacing: '0.08em',
                  marginBottom: '0.65rem'
                }}
              >
                03 // Performance Telemetry
              </h4>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.9rem',
                  color: 'var(--text-primary)',
                  fontWeight: 600
                }}
              >
                {project.metrics}
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="btn-pill btn-pill-dark"
                onClick={() => sound.playClick()}
                style={{
                  background: 'var(--accent-gold)',
                  color: '#1a1816',
                  fontWeight: 700
                }}
              >
                <span>Launch Live Application</span>
                <span className="arrow-circle" style={{ background: '#1a1816', color: '#fff' }}>↗</span>
              </a>
            )}

            <a
              href={project.githubUrl || 'https://github.com/Anurag786ace'}
              target="_blank"
              rel="noreferrer"
              className="btn-pill btn-pill-dark"
              onClick={() => sound.playClick()}
            >
              <span>Explore GitHub Repository</span>
              <span className="arrow-circle">↗</span>
            </a>

            <button
              onClick={() => {
                sound.playClick();
                onClose();
                if (onOpenContact) onOpenContact();
              }}
              className="btn-pill btn-pill-light"
            >
              <span>Discuss Implementation</span>
              <span>→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
