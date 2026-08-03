import React from 'react';
import { useChatContext } from '../agentic';

const TYPE_BADGE = {
  'gap-analysis': { label: 'Gap', color: '#B91C1C' },
  kpi: { label: 'KPI', color: '#1D4ED8' },
  'risk-analysis': { label: 'Risk', color: '#B45309' },
  comparison: { label: 'Compare', color: '#166534' },
  breakdown: { label: 'Breakdown', color: '#7C3AED' },
  operational: { label: 'Ops', color: '#0D9488' },
  geographic: { label: 'Geo', color: '#D97706' },
  analysis: { label: 'Analysis', color: '#4338CA' },
};

export default function ActionableInsight({ insight, onExplore, onToast, onPinned }) {
  const { addWidget, dashboardWidgets } = useChatContext();
  // Sync with live dashboard so removing/closing widgets re-enables Add
  const pinned = dashboardWidgets.some((w) => w.id === insight.id);
  const badge = TYPE_BADGE[insight.type] || { label: insight.type, color: '#52525B' };

  const handlePin = (e) => {
    e.stopPropagation();
    if (pinned) return;
    addWidget({
      id: insight.id,
      title: insight.dataForWidget.title,
      ...insight.dataForWidget,
    });
    onPinned?.();
    onToast?.(`Pinned “${insight.title}” to Widgets`);
  };

  return (
    <div className="actionable-insight">
      <div className="ai-main">
        <button
          type="button"
          className="ai-body"
          onClick={() => onExplore(insight)}
          aria-label={`Explore insight: ${insight.title}`}
        >
          <div className="ai-top-row">
            <span
              className="ai-badge"
              style={{
                background: `${badge.color}14`,
                color: badge.color,
                borderColor: `${badge.color}33`,
              }}
            >
              {badge.label}
            </span>
            <span className="ai-title">{insight.title}</span>
          </div>
        </button>
        <div className="ai-actions">
          <button
            type="button"
            className="ai-explore-btn"
            onClick={() => onExplore(insight)}
            aria-label={`Explore ${insight.title}`}
          >
            Explore
          </button>
          <button
            type="button"
            className={`ai-pin-btn ${pinned ? 'pinned' : ''}`}
            onClick={handlePin}
            disabled={pinned}
            aria-label={pinned ? `${insight.title} pinned` : `Pin ${insight.title} to dashboard`}
          >
            {pinned ? 'Pinned' : 'Add to dashboard'}
          </button>
        </div>
      </div>
    </div>
  );
}
