import React, { useState } from 'react';

export default function ContactSection() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '', role: 'project' });
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  const emailAddress = 'anuraggiri.dev@gmail.com';

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(emailAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2400);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setSubmitted(true);
  };

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
              Let’s build something impossible.
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
                marginBottom: '2rem'
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
                  transition: 'all 0.2s ease'
                }}
              >
                {copied ? 'Copied! ✓' : 'Copy Email'}
              </button>
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
                  boxShadow: '0 0 10px #22c55e'
                }}
              />
              <span>Open to select projects & full-time roles (Q4 2026 / 2027)</span>
            </div>
          </div>

          {/* Right Column: Interactive Form */}
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
                    margin: '0 auto 1.5rem auto'
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
                  Message Sent!
                </h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                  Thank you, {formData.name}. I’ll review your note and get back to you within 24 hours.
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
                      transition: 'border-color 0.2s ease'
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'var(--text-primary)'}
                    onBlur={(e) => e.target.style.borderColor = 'var(--border-card)'}
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
                      transition: 'border-color 0.2s ease'
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'var(--text-primary)'}
                    onBlur={(e) => e.target.style.borderColor = 'var(--border-card)'}
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
                      transition: 'border-color 0.2s ease'
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'var(--text-primary)'}
                    onBlur={(e) => e.target.style.borderColor = 'var(--border-card)'}
                  />
                </div>

                <button
                  type="submit"
                  className="btn-pill btn-pill-dark"
                  style={{
                    padding: '0.9rem',
                    justifyContent: 'center',
                    fontSize: '0.95rem',
                    marginTop: '0.5rem'
                  }}
                >
                  <span>Transmit Message</span>
                  <span className="arrow-circle">→</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
