import React, { useEffect, useRef, useState } from 'react';
import { getPersonaConfig, useChatContext } from '../agentic';

const NAV = [
  {
    id: 'command',
    title: 'Command Center',
    label: 'Home',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    id: 'table',
    title: 'Intelligence Directory',
    label: 'Data',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18M9 21V9" />
      </svg>
    ),
  },
  {
    id: 'reports',
    title: 'Reports',
    label: 'Reports',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 6h16M4 12h16M4 18h10" />
        <path d="M18 16v4M16 18h4" />
      </svg>
    ),
  },
];

export default function Sidebar({ activeView, setActiveView, reportCount = 0 }) {
  const { activePersona, logout } = useChatContext();
  const persona = getPersonaConfig(activePersona);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const btnRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const onDoc = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    const onKey = (e) => {
      if (e.key !== 'Escape') return;
      setMenuOpen(false);
      btnRef.current?.focus();
    };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  return (
    <nav className="global-sidebar" aria-label="Primary">
      <div className="brand" title="Rehrig Pacific">
        RP
      </div>
      <div className="nav-icons">
        {NAV.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`nav-item ${activeView === item.id ? 'active' : ''}`}
            title={item.title}
            aria-label={item.title}
            aria-current={activeView === item.id ? 'page' : undefined}
            onClick={() => setActiveView(item.id)}
          >
            {item.icon}
            <span className="nav-item-label">{item.label}</span>
            {item.id === 'reports' && reportCount > 0 && (
              <span className="nav-badge">{reportCount}</span>
            )}
          </button>
        ))}
      </div>

      <div className="sidebar-account" ref={menuRef}>
        <button
          ref={btnRef}
          type="button"
          className={`sidebar-account-btn ${menuOpen ? 'active' : ''}`}
          style={{ borderColor: persona.color, background: `${persona.color}18` }}
          aria-expanded={menuOpen}
          aria-controls="sidebar-account-panel"
          aria-label={`${persona.shortLabel} account`}
          title={persona.shortLabel}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span aria-hidden>{persona.icon}</span>
        </button>
        {menuOpen && (
          <div id="sidebar-account-panel" className="sidebar-account-dropdown" role="menu">
            <div className="ac-info-heading">Signed in</div>
            <div className="ac-profile-item active" role="presentation">
              <span
                className="ac-profile-avatar"
                style={{ borderColor: persona.color, background: `${persona.color}18` }}
                aria-hidden
              >
                {persona.icon}
              </span>
              <span className="ac-profile-item-text">
                <strong>{persona.shortLabel}</strong>
                <span>{persona.desc}</span>
              </span>
            </div>
            <button
              type="button"
              className="ac-signout-btn"
              onClick={() => {
                setMenuOpen(false);
                logout();
              }}
            >
              Sign out
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
