import React, { useState, useEffect } from 'react';
import { fetchMessages, checkBackendHealth } from '../utils/api';
import { sound } from '../utils/audio';

export default function InquiriesModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('messages'); // 'messages' | 'subscribers'
  const [messages, setMessages] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dbStatus, setDbStatus] = useState('checking...');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      sound.playOpen();
      loadData();
    }
  }, [isOpen]);

  const loadData = async () => {
    setLoading(true);
    setError(null);

    try {
      const health = await checkBackendHealth();
      setDbStatus(health.online ? `Connected (${health.db})` : 'Disconnected');

      // Fetch messages
      const msgs = await fetchMessages();
      setMessages(msgs || []);

      // Fetch subscribers
      const subRes = await fetch('/api/subscribers').catch(() => null);
      if (subRes && subRes.ok) {
        const subData = await subRes.json();
        setSubscribers(subData.data || []);
      }
    } catch (err) {
      console.error('Failed to load inquiries:', err);
      setError(err.message || 'Failed to connect to backend API');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    sound.playClose();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(18, 17, 15, 0.72)',
        backdropFilter: 'blur(14px)',
        padding: '1.5rem'
      }}
      onClick={handleClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '720px',
          maxHeight: '85vh',
          background: '#fff',
          borderRadius: 'var(--radius-lg)',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          boxShadow: '0 30px 80px rgba(0, 0, 0, 0.4)',
          border: '1px solid rgba(25, 23, 20, 0.1)',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.75rem 2rem 1.25rem 2rem',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--bg-secondary)'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: dbStatus.includes('Connected') ? '#22c55e' : '#ef4444',
                  boxShadow: dbStatus.includes('Connected') ? '0 0 10px #22c55e' : 'none'
                }}
              />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                MONGODB DATABASE // {dbStatus.toUpperCase()}
              </span>
            </div>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.6rem',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                margin: 0
              }}
            >
              Inquiries & Circle Members
            </h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              onClick={loadData}
              disabled={loading}
              title="Refresh MongoDB Data"
              style={{
                background: 'rgba(25, 23, 20, 0.05)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-pill)',
                padding: '0.4rem 0.85rem',
                fontSize: '0.8rem',
                fontFamily: 'var(--font-mono)',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              <span>{loading ? 'Fetching...' : '↻ Refresh'}</span>
            </button>

            <button
              onClick={handleClose}
              style={{
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
          </div>
        </div>

        {/* Tabs Bar */}
        <div
          style={{
            display: 'flex',
            padding: '0.75rem 2rem',
            borderBottom: '1px solid var(--border-subtle)',
            gap: '1rem',
            background: '#fafaf9'
          }}
        >
          <button
            onClick={() => setActiveTab('messages')}
            style={{
              background: 'none',
              border: 'none',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.82rem',
              fontWeight: 700,
              padding: '0.4rem 0.6rem',
              cursor: 'pointer',
              color: activeTab === 'messages' ? 'var(--text-primary)' : 'var(--text-secondary)',
              borderBottom: activeTab === 'messages' ? '2px solid var(--text-primary)' : '2px solid transparent'
            }}
          >
            Direct Inquiries ({messages.length})
          </button>
          <button
            onClick={() => setActiveTab('subscribers')}
            style={{
              background: 'none',
              border: 'none',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.82rem',
              fontWeight: 700,
              padding: '0.4rem 0.6rem',
              cursor: 'pointer',
              color: activeTab === 'subscribers' ? 'var(--text-primary)' : 'var(--text-secondary)',
              borderBottom: activeTab === 'subscribers' ? '2px solid var(--text-primary)' : '2px solid transparent'
            }}
          >
            Subscribers ({subscribers.length})
          </button>
        </div>

        {/* Scrollable Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.75rem 2rem' }}>
          {error && (
            <div
              style={{
                padding: '1rem',
                background: 'rgba(239, 68, 68, 0.08)',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                borderRadius: 'var(--radius-md)',
                color: '#dc2626',
                fontSize: '0.9rem',
                marginBottom: '1rem'
              }}
            >
              {error}
            </div>
          )}

          {activeTab === 'messages' ? (
            messages.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-secondary)' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>📭</div>
                <div style={{ fontWeight: 600, fontSize: '1.05rem', color: 'var(--text-primary)' }}>No messages yet</div>
                <p style={{ fontSize: '0.88rem' }}>Inquiries sent via the Contact form will be stored here in MongoDB.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {messages.map((item) => (
                  <div
                    key={item._id}
                    style={{
                      border: '1px solid var(--border-card)',
                      borderRadius: 'var(--radius-md)',
                      padding: '1.25rem',
                      background: '#fff',
                      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.6rem' }}>
                      <div>
                        <span style={{ fontWeight: 700, fontSize: '1.05rem', marginRight: '0.75rem' }}>{item.name}</span>
                        <a
                          href={`mailto:${item.email}?subject=Re:%20Inquiry%20from%20Portfolio`}
                          style={{
                            color: 'var(--accent-gold, #b59f7b)',
                            textDecoration: 'none',
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.85rem'
                          }}
                        >
                          {item.email}
                        </a>
                      </div>
                      <span
                        style={{
                          background: 'rgba(25, 23, 20, 0.06)',
                          borderRadius: 'var(--radius-pill)',
                          padding: '0.2rem 0.65rem',
                          fontSize: '0.75rem',
                          fontFamily: 'var(--font-mono)',
                          fontWeight: 600
                        }}
                      >
                        {item.role || 'project'}
                      </span>
                    </div>

                    <div
                      style={{
                        background: 'rgba(25, 23, 20, 0.02)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '0.85rem 1rem',
                        fontSize: '0.92rem',
                        lineHeight: 1.6,
                        color: 'var(--text-primary)',
                        marginBottom: '0.75rem',
                        whiteSpace: 'pre-wrap',
                        border: '1px solid var(--border-subtle)'
                      }}
                    >
                      {item.message}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      <span style={{ fontFamily: 'var(--font-mono)' }}>
                        {new Date(item.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST
                      </span>
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          color: item.notificationSent ? '#16a34a' : 'var(--text-secondary)'
                        }}
                      >
                        {item.notificationSent ? '● Email Notified ✓' : '● Stored in MongoDB'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            subscribers.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-secondary)' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>✨</div>
                <div style={{ fontWeight: 600, fontSize: '1.05rem', color: 'var(--text-primary)' }}>No subscribers yet</div>
                <p style={{ fontSize: '0.88rem' }}>Visitors who join through the "Join the Circle" modal appear here.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {subscribers.map((sub) => (
                  <div
                    key={sub._id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '0.85rem 1.1rem',
                      background: 'rgba(25, 23, 20, 0.02)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-subtle)'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{sub.email}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                        Source: {sub.source} • {new Date(sub.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <span style={{ color: '#22c55e', fontSize: '0.78rem', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                      ● Active
                    </span>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
