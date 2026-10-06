import React, { useState } from 'react';

export default function ContactModal({ isOpen, onClose }) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  if (!isOpen) return null;

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(18, 17, 15, 0.65)',
        backdropFilter: 'blur(12px)',
        padding: '1.5rem'
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '480px',
          background: '#fff',
          borderRadius: 'var(--radius-lg)',
          padding: '2.5rem',
          position: 'relative',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.35)',
          border: '1px solid rgba(25, 23, 20, 0.1)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            border: '1px solid var(--border-subtle)',
            background: 'transparent',
            cursor: 'pointer',
            fontSize: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-secondary)'
          }}
        >
          ✕
        </button>

        <div className="section-badge" style={{ marginBottom: '1rem' }}>
          <span className="badge-dot" />
          <span>CONNECT WITH ANURAG</span>
        </div>

        <h3
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.9rem',
            fontWeight: 700,
            marginBottom: '0.75rem',
            letterSpacing: '-0.02em'
          }}
        >
          Join the circle.
        </h3>

        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '2rem' }}>
          Receive occasional dispatches on creative coding experiments, 3D web shaders,
          autonomous AI agent architectures, and direct project updates.
        </p>

        {subscribed ? (
          <div
            style={{
              padding: '1.5rem',
              background: 'rgba(34, 197, 94, 0.08)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(34, 197, 94, 0.2)',
              textAlign: 'center'
            }}
          >
            <div style={{ color: '#22c55e', fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.4rem' }}>
              You're on the list!
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
              Check your inbox shortly for an introductory transmission.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubscribe} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input
              type="email"
              required
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '0.85rem 1.1rem',
                borderRadius: 'var(--radius-pill)',
                border: '1px solid var(--border-card)',
                outline: 'none',
                fontSize: '0.95rem',
                fontFamily: 'var(--font-body)'
              }}
            />

            <button
              type="submit"
              className="btn-pill btn-pill-dark"
              style={{
                padding: '0.85rem',
                justifyContent: 'center',
                fontSize: '0.92rem'
              }}
            >
              <span>Subscribe to Updates</span>
              <span className="arrow-circle">→</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
