import React, { useState, useEffect, useRef } from 'react';
import { sound } from '../utils/audio';

export default function CommandPalette({
  isOpen,
  onClose,
  onSelectTheme,
  currentTheme,
  soundEnabled,
  onToggleSound,
  onOpenContact,
  onOpenInquiries
}) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      sound.playOpen();
      setTimeout(() => inputRef.current?.focus(), 60);
    } else {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    sound.playClick();
    onClose();
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('sankhaanurag2005@gmail.com');
    setCopied(true);
    sound.playSuccess();
    setTimeout(() => {
      setCopied(false);
      onClose();
    }, 1200);
  };

  const commands = [
    // Navigation
    {
      id: 'nav-works',
      title: 'View Selected Works & Creative Lab',
      category: 'Navigation',
      shortcut: 'W',
      action: () => scrollTo('works')
    },
    {
      id: 'nav-topics',
      title: 'Explore Topics & Domain Mastery',
      category: 'Navigation',
      shortcut: 'T',
      action: () => scrollTo('topics')
    },
    {
      id: 'nav-about',
      title: 'About Anurag Giri & Philosophy',
      category: 'Navigation',
      shortcut: 'A',
      action: () => scrollTo('about')
    },
    {
      id: 'nav-contact',
      title: 'Initiate Contact & Collaboration',
      category: 'Navigation',
      shortcut: 'C',
      action: () => {
        scrollTo('contact');
        if (onOpenContact) onOpenContact();
      }
    },
    // Themes
    {
      id: 'theme-alabaster',
      title: 'Theme: Alabaster Editorial (Warm Sand & Obsidian)',
      category: 'Atmosphere',
      badge: currentTheme === 'alabaster' ? 'Active' : '',
      action: () => {
        onSelectTheme('alabaster');
        sound.playModeSwitch();
        onClose();
      }
    },
    {
      id: 'theme-obsidian',
      title: 'Theme: Obsidian Void (OLED Black & Amber Glow)',
      category: 'Atmosphere',
      badge: currentTheme === 'obsidian' ? 'Active' : '',
      action: () => {
        onSelectTheme('obsidian');
        sound.playModeSwitch();
        onClose();
      }
    },
    {
      id: 'theme-emerald',
      title: 'Theme: Cyber Emerald (Bioluminescent Slate & Mint)',
      category: 'Atmosphere',
      badge: currentTheme === 'emerald' ? 'Active' : '',
      action: () => {
        onSelectTheme('emerald');
        sound.playModeSwitch();
        onClose();
      }
    },
    // Sound FX
    {
      id: 'toggle-sound',
      title: soundEnabled ? 'Mute Procedural Sound FX' : 'Enable Procedural Sound FX',
      category: 'Audio',
      badge: soundEnabled ? 'ON' : 'MUTED',
      action: () => {
        onToggleSound();
        onClose();
      }
    },
    // Direct Actions
    {
      id: 'action-email',
      title: copied ? '✓ Copied sankhaanurag2005@gmail.com!' : 'Copy Direct Email (sankhaanurag2005@gmail.com)',
      category: 'Action',
      shortcut: '⌘C',
      action: handleCopyEmail
    },
    {
      id: 'action-inquiries',
      title: 'View Inquiries & Messages (MongoDB Database)',
      category: 'Database',
      shortcut: '⌘M',
      badge: 'MongoDB',
      action: () => {
        onClose();
        if (onOpenInquiries) onOpenInquiries();
      }
    },
    {
      id: 'action-github',
      title: 'Open GitHub Profile (@Anurag786ace)',
      category: 'Social',
      action: () => {
        sound.playClick();
        window.open('https://github.com/Anurag786ace', '_blank');
        onClose();
      }
    },
    {
      id: 'action-linkedin',
      title: 'Connect on LinkedIn',
      category: 'Social',
      action: () => {
        sound.playClick();
        window.open('https://www.linkedin.com/in/anurag-giri-334259241', '_blank');
        onClose();
      }
    }
  ];

  const filteredCommands = commands.filter((cmd) =>
    cmd.title.toLowerCase().includes(query.toLowerCase()) ||
    cmd.category.toLowerCase().includes(query.toLowerCase())
  );

  // Keyboard navigation inside command palette
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      sound.playClose();
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      sound.playHover();
      setSelectedIndex((prev) => (prev + 1) % (filteredCommands.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      sound.playHover();
      setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % (filteredCommands.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        filteredCommands[selectedIndex].action();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="cmd-palette-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          sound.playClose();
          onClose();
        }
      }}
    >
      <div className="cmd-palette-container" onKeyDown={handleKeyDown}>
        {/* Search Input Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '1.1rem 1.4rem',
            borderBottom: '1px solid var(--border-subtle)',
            gap: '0.85rem'
          }}
        >
          <span style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>⌘</span>
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command or jump to section..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              fontFamily: 'var(--font-body)',
              fontSize: '1.05rem',
              color: 'var(--text-primary)',
              letterSpacing: '-0.01em'
            }}
          />
          <button
            onClick={() => {
              sound.playClose();
              onClose();
            }}
            style={{
              background: 'rgba(25, 23, 20, 0.06)',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              padding: '0.2rem 0.55rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem',
              color: 'var(--text-muted)',
              cursor: 'pointer'
            }}
          >
            ESC
          </button>
        </div>

        {/* Command List */}
        <div
          style={{
            maxHeight: '380px',
            overflowY: 'auto',
            padding: '0.6rem 0.6rem'
          }}
        >
          {filteredCommands.length === 0 ? (
            <div
              style={{
                padding: '2.5rem',
                textAlign: 'center',
                color: 'var(--text-muted)',
                fontSize: '0.9rem'
              }}
            >
              No commands matching "{query}"
            </div>
          ) : (
            filteredCommands.map((cmd, idx) => {
              const isSelected = selectedIndex === idx;
              return (
                <div
                  key={cmd.id}
                  onClick={() => cmd.action()}
                  onMouseEnter={() => {
                    setSelectedIndex(idx);
                    sound.playHover();
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-sm)',
                    background: isSelected ? 'var(--bg-card-hover)' : 'transparent',
                    border: '1px solid',
                    borderColor: isSelected ? 'var(--border-active)' : 'transparent',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.65rem',
                        textTransform: 'uppercase',
                        padding: '0.15rem 0.45rem',
                        borderRadius: '4px',
                        background: 'rgba(0, 0, 0, 0.08)',
                        color: 'var(--text-muted)',
                        letterSpacing: '0.05em'
                      }}
                    >
                      {cmd.category}
                    </span>
                    <span
                      style={{
                        fontSize: '0.92rem',
                        fontWeight: isSelected ? 600 : 500,
                        color: isSelected ? 'var(--accent-gold)' : 'var(--text-primary)'
                      }}
                    >
                      {cmd.title}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    {cmd.badge && (
                      <span
                        style={{
                          fontSize: '0.7rem',
                          fontFamily: 'var(--font-mono)',
                          padding: '0.15rem 0.5rem',
                          borderRadius: '9999px',
                          background: 'var(--accent-gold)',
                          color: '#fff',
                          fontWeight: 700
                        }}
                      >
                        {cmd.badge}
                      </span>
                    )}
                    {cmd.shortcut && (
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.72rem',
                          color: 'var(--text-muted)',
                          padding: '0.1rem 0.4rem',
                          borderRadius: '4px',
                          background: 'rgba(0,0,0,0.05)'
                        }}
                      >
                        {cmd.shortcut}
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info pill */}
        <div
          style={{
            padding: '0.65rem 1.4rem',
            background: 'rgba(0,0,0,0.03)',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.68rem',
            color: 'var(--text-muted)'
          }}
        >
          <span>Navigate with ↑ ↓ and Press Enter</span>
          <span>Tip: Press ⌘K anywhere</span>
        </div>
      </div>
    </div>
  );
}
