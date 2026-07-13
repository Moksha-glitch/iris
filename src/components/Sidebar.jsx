import React from 'react';

export default function Sidebar({ activeView, setActiveView }) {
  return (
    <nav className="global-sidebar">
      <div className="brand">RP</div>
      <div className="nav-icons">
        <div 
          className={`nav-item ${activeView === 'command' ? 'active' : ''}`} 
          title="Command Center"
          onClick={() => setActiveView('command')}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <line x1="3" y1="9" x2="21" y2="9"/>
            <line x1="3" y1="15" x2="21" y2="15"/>
            <line x1="9" y1="9" x2="9" y2="21"/>
            <line x1="15" y1="9" x2="15" y2="21"/>
          </svg>
        </div>
        <div 
          className={`nav-item ${activeView === 'table' ? 'active' : ''}`} 
          title="Intelligence Directory"
          onClick={() => setActiveView('table')}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><path d="M3 9h18M9 21V9"/></svg>
        </div>

      </div>
    </nav>
  );
}
