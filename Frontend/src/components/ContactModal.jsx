import React, { useState } from 'react';
import { submitSubscriber } from '../utils/api';
import { sound } from '../utils/audio';

export default function ContactModal({ isOpen, onClose }) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  if (!isOpen) return null;

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email || isSubmitting) return;

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      await submitSubscriber(email, 'contact_modal');
      sound.playSuccess();
      setSubscribed(true);
    } catch (err) {
      console.error('Subscription error:', err);
      setErrorMsg(err.message || 'Could not subscribe. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    sound.playClose();
    onClose();
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
      onClick={handleClose}
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
          onClick={handleClose}
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
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '0.75rem' }}>
              Your email is stored in MongoDB & notification recorded.
            </p>
            <button
              onClick={handleClose}
              className="btn-pill btn-pill-dark"
              style={{ padding: '0.55rem 1.2rem', fontSize: '0.85rem' }}
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubscribe} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {errorMsg && (
              <div
                style={{
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(239, 68, 68, 0.08)',
                  border: '1px solid rgba(239, 68, 68, 0.25)',
                  color: '#dc2626',
                  fontSize: '0.85rem'
                }}
              >
                {errorMsg}
              </div>
            )}

            <input
              type="email"
              required
              disabled={isSubmitting}
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
                fontFamily: 'var(--font-body)',
                opacity: isSubmitting ? 0.7 : 1
              }}
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-pill btn-pill-dark"
              style={{
                padding: '0.85rem',
                justifyContent: 'center',
                fontSize: '0.92rem',
                opacity: isSubmitting ? 0.75 : 1,
                cursor: isSubmitting ? 'not-allowed' : 'pointer'
              }}
            >
              <span>{isSubmitting ? 'Saving to Database...' : 'Subscribe to Updates'}</span>
              <span className="arrow-circle">{isSubmitting ? '⌛' : '→'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

