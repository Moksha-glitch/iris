import React, { useMemo } from 'react';
import { useChatContext, buildReportFromInsight } from '../agentic';

/**
 * Flatten analysis sources + insight widget data into one table,
 * with Add to dashboard / Add to reports actions.
 */
export function buildRelatedRows(block) {
  const rows = [];
  const sources = block?.sources || [];
  const insights = block?.insights || [];

  sources.forEach((s, i) => {
    rows.push({
      id: `src-${block.id}-${i}`,
      metric: s.claim,
      value: extractNumericHint(s.claim) || s.claim,
      confidence: s.confidence || '—',
      source: s.source || '—',
      note: s.note || '',
      kind: 'source',
      insightId: null,
    });
  });

  insights.forEach((insight) => {
    const w = insight.dataForWidget || {};
    if (w.chartType === 'kpi') {
      rows.push({
        id: `kpi-${insight.id}`,
        metric: w.title || insight.title,
        value: w.value ?? '—',
        confidence: 'high',
        source: w.subtitle || insight.title,
        note: w.delta || insight.type,
        kind: 'kpi',
        insightId: insight.id,
      });
    }
    if (w.chartType === 'bar' && Array.isArray(w.data)) {
      w.data.forEach((d, di) => {
        Object.entries(d).forEach(([k, v]) => {
          if (k === 'name' || typeof v !== 'number') return;
          rows.push({
            id: `bar-${insight.id}-${di}-${k}`,
            metric: `${d.name} · ${k}`,
            value: String(v),
            confidence: 'high',
            source: w.title || insight.title,
            note: insight.type,
            kind: 'series',
            insightId: insight.id,
          });
        });
      });
    }
    if (!w.chartType) {
      rows.push({
        id: `ins-${insight.id}`,
        metric: insight.title,
        value: insight.type,
        confidence: 'prov',
        source: block.query || 'IRIS',
        note: 'Insight',
        kind: 'insight',
        insightId: insight.id,
      });
    }
  });

  return rows;
}

function extractNumericHint(claim) {
  const m = String(claim).match(/[\d,.]+%?/);
  return m ? m[0] : null;
}

export default function AnalysisDataTable({ block, onToast, onWidgetPinned }) {
  const { addWidget, dashboardWidgets, addReport, reports } = useChatContext();
  const rows = useMemo(() => buildRelatedRows(block), [block]);
  const insights = block?.insights || [];

  const allPinned =
    insights.length > 0 && insights.every((ins) => dashboardWidgets.some((w) => w.id === ins.id));
  const reportId = `report-table-${block.id}`;
  const reported = reports.some((r) => r.id === reportId);

  if (!rows.length) return null;

  const handleAddDashboard = () => {
    let added = 0;
    insights.forEach((insight) => {
      if (dashboardWidgets.some((w) => w.id === insight.id)) return;
      if (!insight.dataForWidget) return;
      addWidget({
        id: insight.id,
        title: insight.dataForWidget.title,
        ...insight.dataForWidget,
      });
      added += 1;
    });
    if (added > 0) {
      onWidgetPinned?.();
      onToast?.(`Added ${added} widget${added === 1 ? '' : 's'} to dashboard`);
    } else {
      onToast?.(allPinned ? 'Already on dashboard' : 'No dashboard widgets available for this analysis');
    }
  };

  const handleAddReports = () => {
    if (reported) {
      onToast?.('Already in reports');
      return;
    }
    // One combined report with the full related-data table
    addReport({
      id: reportId,
      title: block.query ? `Report · ${block.query}` : 'Analysis report',
      query: block.query || '',
      type: 'analysis-table',
      persona: block.persona || 'serviceProvider',
      createdAt: Date.now(),
      rows: rows.map((r) => ({
        metric: r.metric,
        value: r.value,
        confidence: r.confidence,
        source: r.source,
        note: r.note,
      })),
    });
    // Also register per-insight reports when present
    insights.forEach((insight) => {
      const r = buildReportFromInsight(insight, block);
      addReport(r);
    });
    onToast?.('Added related data to Reports');
  };

  return (
    <section className="ap-section ap-data-table-section">
      <div className="ap-data-table-head">
        <h3 className="ap-section-title">Related data</h3>
        <div className="ap-data-table-actions" role="group" aria-label="Pin related data">
          <button
            type="button"
            className={`ai-pin-btn ${allPinned ? 'pinned' : ''}`}
            onClick={handleAddDashboard}
            disabled={allPinned || insights.length === 0}
          >
            {allPinned ? 'On dashboard' : 'Add to dashboard'}
          </button>
          <button
            type="button"
            className={`ai-pin-btn report ${reported ? 'pinned' : ''}`}
            onClick={handleAddReports}
            disabled={reported}
          >
            {reported ? 'In reports' : 'Add to reports'}
          </button>
        </div>
      </div>

      <div className="ap-data-table-wrap">
        <table className="ap-data-table">
          <thead>
            <tr>
              <th>Metric</th>
              <th>Value</th>
              <th>Confidence</th>
              <th>Source</th>
              <th>Note</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td className="ap-dt-metric">{row.metric}</td>
                <td className="ap-dt-value">{row.value}</td>
                <td>
                  <span className={`ap-conf ${row.confidence}`}>{row.confidence}</span>
                </td>
                <td className="ap-dt-source">{row.source}</td>
                <td className="ap-dt-note">{row.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="ap-data-table-hint">
        {rows.length} rows from this answer · dashboard pins visual widgets · reports keep this
        table
      </p>
    </section>
  );
}
