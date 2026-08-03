import React from 'react';

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
    </nav>
  );
}
