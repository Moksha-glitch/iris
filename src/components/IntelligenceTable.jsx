import React, { useRef, useEffect } from 'react';
import { decisions } from '../store';
import { InspectorContent } from './InspectorPane';

const TableGroup = ({ title, items, colorClass, activeNodeId, onNodeClick }) => {
  const [expanded, setExpanded] = React.useState(false);
  const displayItems = expanded ? items : items.slice(0, 5);

  return (
    <div className={`table-group ${colorClass}`}>
      <div className="table-group-header">
        <h3>{title} <span className="tg-count">({items.length})</span></h3>
      </div>
      <table className="intel-table">
        <thead>
          <tr>
            <th style={{width: '35%'}}>Initiative</th>
            <th style={{width: '20%'}}>Status</th>
            <th style={{width: '15%'}}>VaR Exposed</th>
            <th style={{width: '10%'}}>AI Confidence</th>
            <th style={{width: '20%', textAlign: 'right'}}>Action</th>
          </tr>
        </thead>
        <tbody>
          {displayItems.map(d => {
            const isActive = activeNodeId === d.id;
            return (
              <tr key={d.id} className={isActive ? 'active-row' : ''} onClick={() => onNodeClick(d.id)}>
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
                      <div className="conf-bar-fill" style={{width: `${d.confidence}%`}}></div>
                    </div>
                  </div>
                </td>
                <td className="it-action">
                  <button className="ti-btn">Inspect</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {items.length > 5 && (
        <div style={{ textAlign: 'center', marginTop: '12px', paddingBottom: '12px' }}>
          <button 
            className="ti-btn" 
            style={{ background: 'transparent', color: 'var(--text-muted)' }}
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? 'Show Less' : `View All (${items.length - 5} more)`}
          </button>
        </div>
      )}
    </div>
  );
};

export default function IntelligenceTable({ activeNodeId, onNodeClick, queriedNodeIds = [] }) {
  const critical = decisions.filter(d => d.rag === 'r');
  const atRisk = decisions.filter(d => d.rag === 'a');
  const onTrack = decisions.filter(d => d.rag === 'g');

  const bottomRef = useRef(null);

  useEffect(() => {
    if (queriedNodeIds.length > 0 && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [queriedNodeIds]);

  return (
    <div className="intelligence-table-container">
      <div className="it-main-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2>Intelligence Directory</h2>
          <div className="it-subtitle">Tabular view of all tracked initiatives and modeled supply chain operations.</div>
        </div>
        <button className="ti-btn" onClick={() => alert('Exporting all insights...')}>Export All</button>
      </div>
      
      <TableGroup title="Critical Interventions Required" items={critical} colorClass="critical-group" activeNodeId={activeNodeId} onNodeClick={onNodeClick} />
      <TableGroup title="At Risk / Monitoring" items={atRisk} colorClass="warning-group" activeNodeId={activeNodeId} onNodeClick={onNodeClick} />
      <TableGroup title="On Track" items={onTrack} colorClass="success-group" activeNodeId={activeNodeId} onNodeClick={onNodeClick} />

      {queriedNodeIds.length > 0 && (
        <div style={{ marginTop: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '18px', color: 'var(--text-main)', margin: 0 }}>Chat Insights History</h2>
            <button className="ti-btn" style={{ background: 'var(--surface-elevated)', color: 'var(--text-main)', border: '1px solid var(--border)', fontWeight: 600 }} onClick={() => alert('Exporting all chat insights...')}>Export All Insights</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {queriedNodeIds.map((id, idx) => (
              <div key={id} id={`chat-insight-${id}`} ref={idx === queriedNodeIds.length - 1 ? bottomRef : null}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>Chat Insight: {id}</h3>
                  <button className="ti-btn" style={{ background: 'transparent', color: 'var(--text-main)', border: '1px solid var(--border)' }} onClick={() => alert('Exporting chat insight...')}>Export Insight</button>
                </div>
                <InspectorContent activeNodeId={id} isInline={true} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
