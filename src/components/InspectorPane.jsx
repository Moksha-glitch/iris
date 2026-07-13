import React, { useState } from 'react';
import { getDecision } from '../store';

const Sparkline = ({ data, color }) => {
  if (!data || data.length === 0) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1; 
  
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 24 - (((val - min) / range) * 24);
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg className="rc-sparkline" viewBox="0 0 100 24" preserveAspectRatio="none">
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
};

const DriverAccordion = ({ dr }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className={`driver ${isOpen ? 'open' : ''}`}>
      <div className="driver-head" onClick={() => setIsOpen(!isOpen)}>
        <div className={`driver-status ${dr.status}`}></div>
        <div className="driver-title">{dr.title}</div>
        <div className="driver-owner">{dr.owner}</div>
        <div className="driver-updated">{dr.lastUpdated}</div>
        <div className="driver-caret">▼</div>
      </div>
      <div className="driver-body" style={{ display: isOpen ? 'block' : 'none', paddingBottom: '16px' }}>
        {dr.signals.length > 0 && (
          <div className="signal-header">
            <div></div><div>Live Signal</div><div>Source</div><div>Freshness</div>
          </div>
        )}
        {dr.signals.map((sig, i) => (
          <div key={i} className={`signal-item ${sig.quarantined ? 'quarantined' : ''}`}>
            <div className="sig-icon">{sig.type === 'positive' ? '🟢' : '🔴'}</div>
            <div className="sig-text">
              {sig.text}
              {sig.quarantined && <span className="sig-tag-quarantine" style={{marginLeft: '8px'}}>UNVERIFIED</span>}
            </div>
            <div className="sig-source">{sig.source}</div>
            <div className="sig-fresh">{sig.fresh}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export function InspectorContent({ activeNodeId, onClose, isInline = false }) {
  const d = getDecision(activeNodeId);
  if (!d) return null;

  const variance = d.realityCheck.reality - d.realityCheck.prediction;
  const varSign = variance > 0 ? '+' : '';
  const varClass = variance < 0 ? 'negative' : 'positive';
  const maxVal = Math.max(d.realityCheck.reality, d.realityCheck.prediction) * 1.2;
  const pPct = (d.realityCheck.prediction / maxVal) * 100;
  const rPct = (d.realityCheck.reality / maxVal) * 100;
  const sparklineColor = d.trend === 'up' ? '#2E7D32' : d.trend === 'down' ? '#C62828' : '#F57F17';

  return (
    <div className={isInline ? "inline-inspector" : "inspector-pane active"}>
      <div className="ins-header">
        {!isInline && <div className="ins-nav" onClick={onClose}>[←] Back</div>}
        <div className="ins-title-row">
          <div>
            <div className="ins-title">{d.title}</div>
            <div className="ins-subtitle">Verdict: {d.verdict}</div>
          </div>
          <div className="ins-metrics-col">
            <div className={`ins-confidence trend-${d.trend}`}>
              {d.confidence.toFixed(1)}%
            </div>
            <div className="ins-var-badge">VaR: {d.valueAtRisk}</div>
          </div>
        </div>
      </div>
      
      <div className="ins-body" style={isInline ? { padding: '24px' } : {}}>
        <div className="section-label">Intelligence Summary</div>
        <div className="ai-box">
          <ul>
            {d.whatsChanged.map((t, i) => (
              <li key={i} className={t.startsWith('WARNING:') ? 'alert' : ''}>{t}</li>
            ))}
          </ul>
        </div>
        
        <div className="section-label">Reality Check</div>
        <div className="reality-check rc-featured">
          <div className="rc-metric">
            <span>{d.realityCheck.metric} (Prediction vs Reality)</span>
            <Sparkline data={d.realityCheck.timeSeries} color={sparklineColor} />
          </div>
          
          <div className="rc-bar-container">
            <div className="rc-label-row pred">
              <span>Prediction</span>
              <span>{d.realityCheck.prediction}{d.realityCheck.unit}</span>
            </div>
            <div className="rc-bar-bg"><div className="rc-bar-fill pred" style={{width: `${pPct}%`}}></div></div>
          </div>
          
          <div className="rc-bar-container">
            <div className="rc-label-row real">
              <span>Reality</span>
              <span>{d.realityCheck.reality}{d.realityCheck.unit}</span>
            </div>
            <div className="rc-bar-bg"><div className="rc-bar-fill real" style={{width: `${rPct}%`}}></div></div>
          </div>
          
          <div className="rc-variance" className={`rc-variance ${varClass}`}>
            Variance: {varSign}{variance.toFixed(1)}{d.realityCheck.unit}
          </div>
        </div>
        
        <div className="section-label">Operational Drivers</div>
        <div className="driver-list">
          {d.drivers.map((dr, i) => (
            <DriverAccordion key={i} dr={dr} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function InspectorPane({ activeNodeId, onClose }) {
  if (!activeNodeId) {
    return (
      <>
        <div className="inspector-overlay" onClick={onClose}></div>
        <div className="inspector-pane"></div>
      </>
    );
  }

  return (
    <>
      <div className="inspector-overlay active" onClick={onClose}></div>
      <InspectorContent activeNodeId={activeNodeId} onClose={onClose} />
    </>
  );
}
