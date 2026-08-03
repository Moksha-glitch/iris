import React from 'react';
import { useChatContext, buildReportFromInsight } from '../agentic';

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

export default function ActionableInsight({
  insight,
  onExplore,
  onToast,
  onPinned,
  pinOnly = false,
  analysis = null,
}) {
  const { addWidget, dashboardWidgets, addReport, reports, activeAnalysis } =
    useChatContext();
  const pinned = dashboardWidgets.some((w) => w.id === insight.id);
  const reported = reports.some((r) => r.id === `report-${insight.id}`);
  const badge = TYPE_BADGE[insight.type] || { label: insight.type, color: '#52525B' };
  const ctx = analysis || activeAnalysis;

  const handlePin = (e) => {
    e.stopPropagation();
    if (pinned) return;
    addWidget({
      id: insight.id,
      title: insight.dataForWidget.title,
      ...insight.dataForWidget,
    });
    onPinned?.();
    onToast?.(`Pinned “${insight.title}” to dashboard`);
  };

  const handleReport = (e) => {
    e.stopPropagation();
    if (reported) return;
    const report = buildReportFromInsight(insight, ctx);
    addReport(report);
    onToast?.(`Added “${insight.title}” to Reports`);
  };

  return (
    <div className={`actionable-insight ${pinOnly ? 'pin-only' : ''}`}>
      <div className="ai-main">
        {!pinOnly ? (
          <button
            type="button"
            className="ai-body"
            onClick={() => onExplore?.(insight)}
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
        ) : (
          <div className="ai-body static">
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
          </div>
        )}
        <div className="ai-actions ai-actions-combo">
          {!pinOnly && (
            <button
              type="button"
              className="ai-explore-btn"
              onClick={() => onExplore?.(insight)}
              aria-label={`Explore ${insight.title}`}
            >
              Explore
            </button>
          )}
          <div className="ai-pin-combo" role="group" aria-label="Pin destinations">
            <button
              type="button"
              className={`ai-pin-btn ${pinned ? 'pinned' : ''}`}
              onClick={handlePin}
              disabled={pinned}
              aria-label={pinned ? `${insight.title} on dashboard` : `Add ${insight.title} to dashboard`}
            >
              {pinned ? 'On dashboard' : 'Add to dashboard'}
            </button>
            <button
              type="button"
              className={`ai-pin-btn report ${reported ? 'pinned' : ''}`}
              onClick={handleReport}
              disabled={reported}
              aria-label={
                reported ? `${insight.title} in reports` : `Add ${insight.title} to reports`
              }
            >
              {reported ? 'In reports' : 'Add to reports'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
