import React, { useState } from 'react';
import SmoothReveal from './SmoothReveal';
import { submitContactMessage } from '../utils/api';
import { sound } from '../utils/audio';

export default function ContactSection() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '', role: 'project' });
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const emailAddress = 'sankhaanurag2005@gmail.com';

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(emailAddress);
    setCopied(true);
    sound.playSuccess();
    setTimeout(() => setCopied(false), 2400);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message || isSubmitting) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await submitContactMessage(formData);
      sound.playSuccess();
      setSubmitted(true);
    } catch (err) {
      console.error('Submission error:', err);
      setSubmitError(err.message || 'Something went wrong while sending your message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const socialLinks = [
    {
      name: 'GitHub',
      url: 'https://github.com/Anurag786ace',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
        </svg>
      )
    },
    {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/in/anurag-giri-334259241',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      )
    },
    {
      name: 'Email',
      url: 'mailto:sankhaanurag2005@gmail.com',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="4" width="20" height="16" rx="2"/>
          <polyline points="22,7 12,13 2,7"/>
        </svg>
      )
    }
  ];

  return (
    <section id="contact" style={{ borderTop: '1px solid var(--border-subtle)', background: 'var(--bg-secondary)' }}>
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(300px, 1fr) 1.25fr',
            gap: '4.5rem',
            alignItems: 'start'
          }}
          className="contact-grid"
        >
          {/* Left Column */}
          <SmoothReveal direction="left">
            <div>
              <div className="section-badge">
                <span className="badge-dot" />
                <span>GET IN TOUCH // CONNECT</span>
              </div>

              <h2
                style={{
                  fontSize: 'clamp(2.5rem, 4.5vw, 4.2rem)',
                  lineHeight: 1.05,
                  fontWeight: 700,
                  letterSpacing: '-0.03em',
                  marginBottom: '1.5rem'
                }}
              >
                Let's build something impossible.
              </h2>

              <p style={{ fontSize: '1.1rem', lineHeight: 1.6, color: 'var(--text-secondary)', marginBottom: '2.5rem' }}>
                Have an ambitious vision, a 3D web experience to construct, or an engineering role to discuss?
                Reach out directly or drop a message.
              </p>

              {/* Direct Email Pill with Copy Button */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '0.75rem 1.25rem',
                  background: '#fff',
                  borderRadius: 'var(--radius-pill)',
                  border: '1px solid var(--border-subtle)',
                  boxShadow: '0 6px 20px rgba(0, 0, 0, 0.04)',
                  marginBottom: '2rem',
                  transition: 'all 0.3s ease'
                }}
              >
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                  {emailAddress}
                </span>
                <button
                  onClick={handleCopyEmail}
                  style={{
                    background: copied ? '#22c55e' : 'var(--bg-dark)',
                    color: '#fff',
                    border: 'none',
                    padding: '0.4rem 0.85rem',
                    borderRadius: 'var(--radius-pill)',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                    transform: copied ? 'scale(1.05)' : 'scale(1)'
                  }}
                >
                  {copied ? 'Copied! ✓' : 'Copy Email'}
                </button>
              </div>

              {/* Social Links */}
              <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem' }}>
                {socialLinks.map((link, i) => (
                  <a
                    key={i}
                    href={link.url}
                    target={link.url.startsWith('mailto:') ? undefined : '_blank'}
                    rel="noreferrer"
                    title={link.name}
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      background: 'rgba(25, 23, 20, 0.06)',
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--text-primary)',
                      textDecoration: 'none',
                      transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'var(--bg-dark)';
                      e.currentTarget.style.color = '#fff';
                      e.currentTarget.style.transform = 'translateY(-4px) scale(1.08)';
                      e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(25, 23, 20, 0.06)';
                      e.currentTarget.style.color = 'var(--text-primary)';
                      e.currentTarget.style.transform = 'translateY(0) scale(1)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    {link.icon}
                  </a>
                ))}
              </div>

              {/* Availability Badge */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.8rem',
                  color: 'var(--text-secondary)'
                }}
              >
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: '#22c55e',
                    boxShadow: '0 0 10px #22c55e',
                    animation: 'pulseGlow 2s ease-in-out infinite'
                  }}
                />
                <span>Open to select projects & full-time roles (Q4 2026 / 2027)</span>
              </div>
            </div>
          </SmoothReveal>

          {/* Right Column: Interactive Form */}
          <SmoothReveal direction="right" delay={200}>
            <div
              className="glass-card"
              style={{
                padding: '2.8rem 2.4rem',
                background: '#fff'
              }}
            >
              {submitted ? (
                <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                  <div
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '50%',
                      background: 'rgba(34, 197, 94, 0.12)',
                      color: '#22c55e',
                      fontSize: '2rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 1.5rem auto',
                      animation: 'scaleIn 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}
                  >
                    ✓
                  </div>
                  <h3
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.8rem',
                      fontWeight: 700,
                      marginBottom: '0.75rem'
                    }}
                  >
                    Message Transmitted!
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '0.85rem' }}>
                    Thank you, {formData.name}. Your note has been safely stored in the database and notified to Anurag.
                  </p>
                  <p style={{ fontSize: '0.85rem', color: '#16a34a', marginBottom: '2rem', fontFamily: 'var(--font-mono)' }}>
                    ● Stored in MongoDB & notification dispatched
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: '', email: '', message: '', role: 'project' });
                    }}
                    className="btn-pill btn-pill-dark"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {submitError && (
                    <div
                      style={{
                        padding: '0.85rem 1.1rem',
                        borderRadius: 'var(--radius-md)',
                        background: 'rgba(239, 68, 68, 0.08)',
                        border: '1px solid rgba(239, 68, 68, 0.25)',
                        color: '#dc2626',
                        fontSize: '0.88rem'
                      }}
                    >
                      {submitError}
                    </div>
                  )}

                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        marginBottom: '0.5rem',
                        color: 'var(--text-primary)'
                      }}
                    >
                      YOUR NAME
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alex Vance"
                      value={formData.name}
                      disabled={isSubmitting}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.85rem 1.1rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-card)',
                        background: 'rgba(25, 23, 20, 0.02)',
                        fontSize: '0.95rem',
                        fontFamily: 'var(--font-body)',
                        outline: 'none',
                        transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                        opacity: isSubmitting ? 0.7 : 1
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = 'var(--accent-gold)';
                        e.target.style.boxShadow = '0 0 0 3px var(--accent-gold-glow)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'var(--border-card)';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>

                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        marginBottom: '0.5rem',
                        color: 'var(--text-primary)'
                      }}
                    >
                      EMAIL ADDRESS
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="alex@company.com"
                      value={formData.email}
                      disabled={isSubmitting}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.85rem 1.1rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-card)',
                        background: 'rgba(25, 23, 20, 0.02)',
                        fontSize: '0.95rem',
                        fontFamily: 'var(--font-body)',
                        outline: 'none',
                        transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                        opacity: isSubmitting ? 0.7 : 1
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = 'var(--accent-gold)';
                        e.target.style.boxShadow = '0 0 0 3px var(--accent-gold-glow)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'var(--border-card)';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>

                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        marginBottom: '0.5rem',
                        color: 'var(--text-primary)'
                      }}
                    >
                      PROJECT OR INQUIRY DETAILS
                    </label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Tell me about what you're building..."
                      value={formData.message}
                      disabled={isSubmitting}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.85rem 1.1rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-card)',
                        background: 'rgba(25, 23, 20, 0.02)',
                        fontSize: '0.95rem',
                        fontFamily: 'var(--font-body)',
                        outline: 'none',
                        resize: 'vertical',
                        transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                        opacity: isSubmitting ? 0.7 : 1
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = 'var(--accent-gold)';
                        e.target.style.boxShadow = '0 0 0 3px var(--accent-gold-glow)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'var(--border-card)';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-pill btn-pill-dark"
                    style={{
                      padding: '0.9rem',
                      justifyContent: 'center',
                      fontSize: '0.95rem',
                      marginTop: '0.5rem',
                      opacity: isSubmitting ? 0.75 : 1,
                      cursor: isSubmitting ? 'not-allowed' : 'pointer'
                    }}
                  >
                    <span>{isSubmitting ? 'Transmitting to Database...' : 'Transmit Message'}</span>
                    <span className="arrow-circle">{isSubmitting ? '⌛' : '→'}</span>
                  </button>
                </form>
              )}
            </div>
          </SmoothReveal>
        </div>
      </div>
    </section>
  );
}
