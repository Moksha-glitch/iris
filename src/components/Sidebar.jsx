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
];

export default function Sidebar({
  activeView,
  setActiveView,
  widgetCount = 0,
  onOpenWidgets,
  widgetsOpen = false,
}) {
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
          </button>
        ))}

        {widgetCount > 0 && (
          <button
            type="button"
            className={`nav-item nav-widgets ${widgetsOpen ? 'active' : ''}`}
            title="Pinned widgets"
            aria-label={`Open widgets (${widgetCount})`}
            aria-pressed={widgetsOpen}
            onClick={onOpenWidgets}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="8" height="8" rx="1" />
              <rect x="13" y="3" width="8" height="5" rx="1" />
              <rect x="13" y="10" width="8" height="11" rx="1" />
              <rect x="3" y="13" width="8" height="8" rx="1" />
            </svg>
            <span className="nav-item-label">Widgets</span>
            <span className="nav-badge">{widgetCount}</span>
          </button>
        )}
      </div>
    </nav>
  );
}
