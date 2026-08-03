import React, { useRef, useEffect, useState } from 'react';
import { decisions } from '../store';
import { InspectorContent } from './InspectorPane';

const TableGroup = ({ title, items, colorClass, activeNodeId, onNodeClick, highlightId }) => {
  const [expanded, setExpanded] = useState(false);
  const displayItems = expanded ? items : items.slice(0, 5);

  return (
    <div className={`table-group ${colorClass}`}>
      <div className="table-group-header">
        <h3>
          {title} <span className="tg-count">({items.length})</span>
        </h3>
      </div>
      <table className="intel-table">
        <thead>
          <tr>
            <th style={{ width: '35%' }}>Provider / Initiative</th>
            <th style={{ width: '20%' }}>Status</th>
            <th style={{ width: '15%' }}>VaR Exposed</th>
            <th style={{ width: '10%' }}>AI Confidence</th>
            <th style={{ width: '20%', textAlign: 'right' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {displayItems.map((d) => {
            const isActive = activeNodeId === d.id;
            const isHighlighted = highlightId === d.id;
            return (
              <tr
                key={d.id}
                id={`dir-row-${d.id}`}
                className={`${isActive ? 'active-row' : ''} ${isHighlighted ? 'is-highlighted' : ''}`}
                tabIndex={0}
                aria-selected={isActive}
                onClick={() => onNodeClick(d.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onNodeClick(d.id);
                  }
                }}
              >
                <td>
                  <div className="it-title">{d.title}</div>
                  <div className="it-verdict">{d.verdict}</div>
                </td>
                <td>
                  <div className="it-trend">
                    {d.trend === 'up' && <span className="success-text">↑ Improving</span>}
                    {d.trend === 'down' && <span className="critical-text">↓ Degrading</span>}
                    {d.trend === 'stable' && <span className="warning-text">− Stable</span>}
                  </div>
                </td>
                <td className="it-var">{d.valueAtRisk === '$0' ? '-' : d.valueAtRisk}</td>
                <td className="it-conf">
                  <div className="conf-flex">
                    <span>{d.confidence.toFixed(1)}%</span>
                    <div className="conf-bar-bg">
                      <div className="conf-bar-fill" style={{ width: `${d.confidence}%` }} />
                    </div>
                  </div>
                </td>
                <td className="it-action">
                  <button
                    type="button"
                    className="ti-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      onNodeClick(d.id);
                    }}
                  >
                    Inspect
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {items.length > 5 && (
        <div className="tg-more">
          <button
            type="button"
            className="tg-more-btn"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? 'Show less' : `View all (${items.length - 5} more)`}
          </button>
        </div>
      )}
    </div>
  );
};

export default function IntelligenceTable({
  activeNodeId,
  onNodeClick,
  queriedNodeIds = [],
  highlightId = null,
  onToast,
}) {
  const critical = decisions.filter((d) => d.rag === 'r');
  const atRisk = decisions.filter((d) => d.rag === 'a');
  const onTrack = decisions.filter((d) => d.rag === 'g');
  const insightRef = useRef(null);

  useEffect(() => {
    if (!highlightId) return;
    const el =
      document.getElementById(`chat-insight-${highlightId}`) ||
      document.getElementById(`dir-row-${highlightId}`);
    if (!el) return;
    const t = requestAnimationFrame(() => {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
    return () => cancelAnimationFrame(t);
  }, [highlightId, queriedNodeIds]);

  const exportStub = (label) => {
    onToast?.(label);
  };

  return (
    <div className="intelligence-table-container">
      <div className="it-main-header">
        <div>
          <div className="cc-eyebrow">Directory</div>
          <h2>Providers & work orders</h2>
          <div className="it-subtitle">
            Prioritized by RFID gaps and missing-WO risk. Click a cite in IRIS to jump here.
          </div>
        </div>
        <div className="it-summary-chips">
          <span className="it-chip critical">{critical.length} critical</span>
          <span className="it-chip warning">{atRisk.length} at risk</span>
          <span className="it-chip success">{onTrack.length} on track</span>
        </div>
      </div>

      <TableGroup
        title="Critical"
        items={critical}
        colorClass="critical-group"
        activeNodeId={activeNodeId}
        onNodeClick={onNodeClick}
        highlightId={highlightId}
      />
      <TableGroup
        title="At risk"
        items={atRisk}
        colorClass="warning-group"
        activeNodeId={activeNodeId}
        onNodeClick={onNodeClick}
        highlightId={highlightId}
      />
      <TableGroup
        title="On track"
        items={onTrack}
        colorClass="success-group"
        activeNodeId={activeNodeId}
        onNodeClick={onNodeClick}
        highlightId={highlightId}
      />

      {queriedNodeIds.length > 0 && (
        <div className="it-insights-section">
          <div className="it-insights-head">
            <h2>From IRIS</h2>
            <button
              type="button"
              className="ti-btn ghost"
              onClick={() => exportStub('Export is a demo stub in this build')}
            >
              Export all
            </button>
          </div>
          <div className="it-insights-list">
            {queriedNodeIds.map((id, idx) => (
              <div
                key={id}
                id={`chat-insight-${id}`}
                ref={idx === queriedNodeIds.length - 1 ? insightRef : null}
                className={`it-insight-card ${highlightId === id ? 'is-highlighted' : ''}`}
              >
                <div className="it-insight-card-head">
                  <h3>Insight · {id}</h3>
                  <button
                    type="button"
                    className="ti-btn ghost"
                    onClick={() => exportStub('Export is a demo stub in this build')}
                  >
                    Export
                  </button>
                </div>
                <InspectorContent activeNodeId={id} isInline />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
