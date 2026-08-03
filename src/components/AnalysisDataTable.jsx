import React, { useMemo } from 'react';
import { useChatContext, buildReportFromInsight } from '../agentic';
import { truckFleetData, fleetSummary } from '../excelData';

const PROVIDER_NAMES = [...truckFleetData]
  .map((p) => p.serviceProvider)
  .sort((a, b) => b.length - a.length);

/**
 * Resolve a service provider name from free text / chart labels.
 */
export function resolveServiceProvider(text, fallback = 'Network') {
  const t = String(text || '').trim();
  if (!t) return fallback;

  const stem = t.replace(/…$/, '').trim();

  // Exact / prefix match against known providers (handles truncated chart labels)
  const exact = PROVIDER_NAMES.find(
    (name) =>
      name === t ||
      name === stem ||
      name.startsWith(stem) ||
      (stem.length >= 8 && name.toLowerCase().startsWith(stem.toLowerCase()))
  );
  if (exact) return exact;

  const lower = t.toLowerCase();
  const contained = PROVIDER_NAMES.find((name) => lower.includes(name.toLowerCase()));
  if (contained) return contained;

  // Common aliases
  if (/edmonton/i.test(t)) return 'Edmonton AB';
  if (/network|fleet-wide|all providers|total/i.test(t)) return 'Network';

  return fallback;
}

/**
 * Flatten analysis sources + insight widget data into one table,
 * with Add to dashboard / Add to reports actions.
 */
export function buildRelatedRows(block) {
  const rows = [];
  const sources = block?.sources || [];
  const insights = block?.insights || [];
  const defaultProvider =
    fleetSummary.largestGap?.serviceProvider ||
    fleetSummary.top5Providers?.[0]?.serviceProvider ||
    'Network';

  sources.forEach((s, i) => {
    const serviceProvider = resolveServiceProvider(s.claim, defaultProvider);
    rows.push({
      id: `src-${block.id}-${i}`,
      serviceProvider,
      metric: serviceProvider, // back-compat for reports
      value: extractNumericHint(s.claim) || s.claim,
      confidence: s.confidence || '—',
      source: s.source || '—',
      note: s.note || s.claim || '',
      kind: 'source',
      insightId: null,
    });
  });

  insights.forEach((insight) => {
    const w = insight.dataForWidget || {};
    if (w.chartType === 'kpi') {
      const serviceProvider = resolveServiceProvider(
        `${w.title || ''} ${w.subtitle || ''} ${insight.title || ''}`,
        defaultProvider
      );
      rows.push({
        id: `kpi-${insight.id}`,
        serviceProvider,
        metric: serviceProvider,
        value: w.value ?? '—',
        confidence: 'high',
        source: w.title || insight.title,
        note: w.delta || w.subtitle || insight.type,
        kind: 'kpi',
        insightId: insight.id,
      });
    }
    if (w.chartType === 'bar' && Array.isArray(w.data)) {
      const woContext = /wo|work order|sla|dispatch|aging|case age|bulk|repair/i.test(
        `${w.title || ''} ${insight.title || ''} ${insight.type || ''}`
      );
      const barFallback = woContext ? 'Edmonton AB' : defaultProvider;
      w.data.forEach((d, di) => {
        const lookedUp = resolveServiceProvider(d.name, null);
        const serviceProvider = lookedUp || barFallback;
        Object.entries(d).forEach(([k, v]) => {
          if (k === 'name' || typeof v !== 'number') return;
          rows.push({
            id: `bar-${insight.id}-${di}-${k}`,
            serviceProvider,
            metric: serviceProvider,
            value: String(v),
            confidence: 'high',
            source: w.title || insight.title,
            note: lookedUp ? k : `${d.name}${k !== 'count' && k !== 'trucks' ? ` · ${k}` : ''}`,
            kind: 'series',
            insightId: insight.id,
          });
        });
      });
    }
    if (!w.chartType) {
      const serviceProvider = resolveServiceProvider(insight.title, defaultProvider);
      rows.push({
        id: `ins-${insight.id}`,
        serviceProvider,
        metric: serviceProvider,
        value: insight.type,
        confidence: 'prov',
        source: block.query || 'Vision AI',
        note: insight.title || 'Insight',
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
    addReport({
      id: reportId,
      title: block.query ? `Report · ${block.query}` : 'Analysis report',
      query: block.query || '',
      type: 'analysis-table',
      persona: block.persona || 'serviceProvider',
      createdAt: Date.now(),
      rows: rows.map((r) => ({
        serviceProvider: r.serviceProvider,
        metric: r.serviceProvider,
        value: r.value,
        confidence: r.confidence,
        source: r.source,
        note: r.note,
      })),
    });
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
              <th>Service Provider</th>
              <th>Value</th>
              <th>Confidence</th>
              <th>Source</th>
              <th>Note</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td className="ap-dt-metric">{row.serviceProvider}</td>
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
