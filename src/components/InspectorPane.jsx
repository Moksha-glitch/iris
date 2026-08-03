import React, { useEffect, useId, useRef, useState } from 'react';
import { getDecision } from '../store';

const Sparkline = ({ data, color }) => {
  if (!data || data.length === 0) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data
    .map((val, i) => {
      const x = (i / (data.length - 1)) * 100;
      const y = 24 - ((val - min) / range) * 24;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg className="rc-sparkline" viewBox="0 0 100 24" preserveAspectRatio="none" aria-hidden>
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
};

const DriverAccordion = ({ dr, index }) => {
  const [isOpen, setIsOpen] = useState(false);
  const panelId = useId();

  return (
    <div className={`driver ${isOpen ? 'open' : ''}`}>
      <button
        type="button"
        className="driver-head"
        onClick={() => setIsOpen((v) => !v)}
        aria-expanded={isOpen}
        aria-controls={panelId}
      >
        <div className={`driver-status ${dr.status}`} aria-hidden />
        <div className="driver-title">{dr.title}</div>
        <div className="driver-owner">{dr.owner}</div>
        <div className="driver-updated">{dr.lastUpdated}</div>
        <div className="driver-caret" aria-hidden>
          {isOpen ? '▲' : '▼'}
        </div>
      </button>
      <div
        id={panelId}
        className="driver-body"
        hidden={!isOpen}
        style={{ display: isOpen ? 'block' : 'none', paddingBottom: '16px' }}
      >
        {dr.signals.length > 0 && (
          <div className="signal-header">
            <div />
            <div>Live Signal</div>
            <div>Source</div>
            <div>Freshness</div>
          </div>
        )}
        {dr.signals.map((sig, i) => (
          <div key={`${index}-${i}`} className={`signal-item ${sig.quarantined ? 'quarantined' : ''}`}>
            <div
              className={`sig-dot ${sig.type === 'positive' ? 'positive' : 'negative'}`}
              aria-label={sig.type === 'positive' ? 'Positive' : 'Negative'}
            />
            <div className="sig-text">
              {sig.text}
              {sig.quarantined && (
                <span className="sig-tag-quarantine" style={{ marginLeft: '8px' }}>
                  UNVERIFIED
                </span>
              )}
            </div>
            <div className="sig-source">{sig.source}</div>
            <div className="sig-fresh">{sig.fresh}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export function InspectorContent({
  activeNodeId,
  onClose,
  isInline = false,
  onResolveNode,
  resolvedNodes = [],
}) {
  const d = getDecision(activeNodeId);
  const closeRef = useRef(null);

  useEffect(() => {
    if (!isInline && d) closeRef.current?.focus();
  }, [activeNodeId, isInline, d]);

  if (!d) return null;

  const variance = d.realityCheck.reality - d.realityCheck.prediction;
  const varSign = variance > 0 ? '+' : '';
  const varClass = variance < 0 ? 'negative' : 'positive';
  const maxVal = Math.max(d.realityCheck.reality, d.realityCheck.prediction) * 1.2;
  const pPct = (d.realityCheck.prediction / maxVal) * 100;
  const rPct = (d.realityCheck.reality / maxVal) * 100;
  const sparklineColor = d.trend === 'up' ? '#2E7D32' : d.trend === 'down' ? '#C62828' : '#F57F17';
  const isResolved = resolvedNodes.includes(d.id);

  return (
    <div className={isInline ? 'inline-inspector' : 'inspector-pane active'}>
      <div className="ins-header">
        {!isInline && (
          <button type="button" className="ins-nav" ref={closeRef} onClick={onClose}>
            ← Back
          </button>
        )}
        <div className="ins-title-row">
          <div>
            <div className="ins-title">{d.title}</div>
            <div className="ins-subtitle">Verdict: {d.verdict}</div>
          </div>
          <div className="ins-metrics-col">
            <div className={`ins-confidence trend-${d.trend}`}>{d.confidence.toFixed(1)}%</div>
            <div className="ins-var-badge">VaR: {d.valueAtRisk}</div>
          </div>
        </div>
        {!isInline && onResolveNode && (
          <div className="ins-resolve-row">
            <button
              type="button"
              className={`ins-resolve-btn ${isResolved ? 'resolved' : ''}`}
              onClick={() => onResolveNode(d.id)}
              disabled={isResolved}
            >
              {isResolved ? 'Resolved' : 'Mark resolved'}
            </button>
          </div>
        )}
      </div>

      <div className="ins-body" style={isInline ? { padding: '24px' } : undefined}>
        <div className="section-label">Intelligence Summary</div>
        <div className="ai-box">
          <ul>
            {d.whatsChanged.map((t, i) => (
              <li key={i} className={t.startsWith('WARNING:') ? 'alert' : ''}>
                {t}
              </li>
            ))}
          </ul>
        </div>

        <div className="section-label">Reality Check</div>
        <div className="reality-check rc-featured">
          <div className="rc-metric">
            <span>
              {d.realityCheck.metric} (Prediction vs Reality)
            </span>
            <Sparkline data={d.realityCheck.timeSeries} color={sparklineColor} />
          </div>

          <div className="rc-bar-container">
            <div className="rc-label-row pred">
              <span>Prediction</span>
              <span>
                {d.realityCheck.prediction}
                {d.realityCheck.unit}
              </span>
            </div>
            <div className="rc-bar-bg">
              <div className="rc-bar-fill pred" style={{ width: `${pPct}%` }} />
            </div>
          </div>

          <div className="rc-bar-container">
            <div className="rc-label-row real">
              <span>Reality</span>
              <span>
                {d.realityCheck.reality}
                {d.realityCheck.unit}
              </span>
            </div>
            <div className="rc-bar-bg">
              <div className="rc-bar-fill real" style={{ width: `${rPct}%` }} />
            </div>
          </div>

          <div className={`rc-variance ${varClass}`}>
            Variance: {varSign}
            {variance.toFixed(1)}
            {d.realityCheck.unit}
          </div>
        </div>

        <div className="section-label">Operational Drivers</div>
        <div className="driver-list">
          {d.drivers.map((dr, i) => (
            <DriverAccordion key={i} dr={dr} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function InspectorPane({
  activeNodeId,
  onClose,
  onResolveNode,
  resolvedNodes = [],
}) {
  useEffect(() => {
    if (!activeNodeId) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [activeNodeId, onClose]);

  if (!activeNodeId) {
    return (
      <>
        <div className="inspector-overlay" />
        <div className="inspector-pane" aria-hidden="true" />
      </>
    );
  }

  return (
    <>
      <div className="inspector-overlay active" onClick={onClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Decision inspector"
      >
        <InspectorContent
          activeNodeId={activeNodeId}
          onClose={onClose}
          onResolveNode={onResolveNode}
          resolvedNodes={resolvedNodes}
        />
      </div>
    </>
  );
}
