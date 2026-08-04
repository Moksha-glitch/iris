import React from 'react';
import FormattedReply from './FormattedReply';
import { useChatContext } from '../agentic';

/**
 * Vision answer pattern:
 * Summary → Table/list → Chart → Analysis → Recommendation → Suggested questions
 */
export default function StructuredAnswer({
  sections,
  sources = [],
  insights = [],
  mode = 'detail',
  onTraverse,
  onAsk,
  onToast,
  onWidgetPinned,
  compact = false,
}) {
  if (!sections?.summary) return null;

  const { addWidget, dashboardWidgets, addReport } = useChatContext();
  let n = 0;
  const num = () => {
    n += 1;
    return n;
  };

  const pinChart = () => {
    const insight = insights.find((i) => i.dataForWidget?.chartType === 'bar');
    if (!insight?.dataForWidget) {
      onToast?.('No chart widget available for this answer');
      return;
    }
    if (dashboardWidgets.some((w) => w.id === insight.id)) {
      onToast?.('Already on dashboard');
      return;
    }
    addWidget({ id: insight.id, title: insight.dataForWidget.title, ...insight.dataForWidget });
    onWidgetPinned?.();
    onToast?.(`Pinned “${insight.title}” to dashboard`);
  };

  const pinReport = () => {
    if (!sections.table) {
      onToast?.('No table to add to reports');
      return;
    }
    const id = `report-structured-${sections.table.title}`;
    addReport({
      id,
      title: sections.table.title,
      query: '',
      type: 'structured-table',
      persona: 'serviceProvider',
      createdAt: Date.now(),
      rows: sections.table.rows.map((r) => ({
        serviceProvider: typeof r.cells[0] === 'string' ? r.cells[0] : '—',
        metric: typeof r.cells[0] === 'string' ? r.cells[0] : '—',
        value: r.cells
          .slice(1)
          .map((c) => (typeof c === 'object' ? c.text : c))
          .join(' · '),
        confidence: r.flag ? 'high' : 'prov',
        source: sections.table.title,
        note: sections.table.note || '',
      })),
    });
    onToast?.('Added table to Reports');
  };

  // Chat: compact summary + suggested questions only
  if (compact || mode === 'chat') {
    return (
      <div className="sa-root sa-compact">
        <section className="sa-sec">
          <div className="sa-sec-h">
            <span className="sa-num">{num()}</span>
            Summary
          </div>
          <div className="sa-summary">
            <FormattedReply
              text={sections.summary}
              sources={sources}
              mode="chat"
              onTraverse={onTraverse}
            />
          </div>
        </section>
        {sections.follows?.length > 0 && (
          <section className="sa-sec sa-follows">
            <div className="sa-fl-t">Suggested questions</div>
            <div className="sa-fchips">
              {sections.follows.map((q) => (
                <button
                  key={q}
                  type="button"
                  className="sa-fchip"
                  onClick={() => onAsk?.(q)}
                >
                  {q}
                </button>
              ))}
            </div>
          </section>
        )}
      </div>
    );
  }

  return (
    <div className="sa-root">
      <section className="sa-sec">
        <div className="sa-sec-h">
          <span className="sa-num">{num()}</span>
          Summary
          <span className="sa-req">Always shown</span>
        </div>
        <div className="sa-summary">
          <FormattedReply
            text={sections.summary}
            sources={sources}
            mode="detail"
            onTraverse={onTraverse}
          />
        </div>
      </section>

      {sections.table && (
        <section className="sa-sec">
          <div className="sa-sec-h">
            <span className="sa-num">{num()}</span>
            {sections.table.title}
          </div>
          <AnswerTable table={sections.table} />
          <div className="sa-comp-actions">
            <button type="button" className="sa-cbtn" onClick={pinChart}>
              + Add to dashboard
            </button>
            <button type="button" className="sa-cbtn" onClick={pinReport}>
              + Add to reports
            </button>
          </div>
        </section>
      )}

      {sections.chart && (
        <section className="sa-sec">
          <div className="sa-sec-h">
            <span className="sa-num">{num()}</span>
            {sections.chart.title}
          </div>
          <AnswerChart chart={sections.chart} />
        </section>
      )}

      {sections.analysis?.length > 0 && (
        <section className="sa-sec">
          <div className="sa-sec-h">
            <span className="sa-num">{num()}</span>
            Analysis
          </div>
          <div className="sa-arbox">
            {sections.analysis.map((p, i) => (
              <div key={i} className="sa-para">
                <FormattedReply text={p} sources={sources} mode="detail" />
              </div>
            ))}
          </div>
        </section>
      )}

      {sections.recommendations?.length > 0 && (
        <section className="sa-sec">
          <div className="sa-sec-h">
            <span className="sa-num">{num()}</span>
            Recommendation
          </div>
          <div className="sa-arbox sa-rec-box">
            <div className="sa-rec-t">Recommended plays</div>
            <ul className="sa-rec-list">
              {sections.recommendations.map((r, i) => (
                <li key={i}>
                  <FormattedReply text={r} sources={sources} mode="detail" />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {sections.follows?.length > 0 && (
        <section className="sa-sec sa-follows">
          <div className="sa-fl-t">Suggested questions</div>
          <div className="sa-fchips">
            {sections.follows.map((q) => (
              <button key={q} type="button" className="sa-fchip" onClick={() => onAsk?.(q)}>
                {q}
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function AnswerTable({ table }) {
  return (
    <>
      <div className="sa-table-wrap">
        <table className="sa-table">
          <thead>
            <tr>
              {table.cols.map((c) => (
                <th key={c}>{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((r, i) => (
              <tr key={i} className={r.flag ? 'flag' : ''}>
                {r.cells.map((cell, j) => (
                  <td key={j} className={j === 0 ? 'c0' : ''}>
                    {typeof cell === 'object' && cell?.pill ? (
                      <span className={`sa-pill ${cell.pill}`}>{cell.text}</span>
                    ) : (
                      cell
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {table.note && <p className="sa-tnote">{table.note}</p>}
    </>
  );
}

function AnswerChart({ chart }) {
  const max = Math.max(...chart.data.map((d) => d.v), 1);
  return (
    <>
      <div className="sa-chart" role="img" aria-label={chart.title}>
        {chart.data.map((d) => (
          <div key={d.l} className="sa-bcol">
            <div className="sa-bwrap">
              <div
                className={`sa-bar ${d.c || ''}`}
                style={{ height: `${Math.max(8, Math.round((d.v / max) * 100))}%` }}
              />
            </div>
            <span className="sa-bv">
              {d.v}
              {chart.unit || ''}
            </span>
            <small>{d.l}</small>
          </div>
        ))}
      </div>
      {chart.cap && <p className="sa-ccap">{chart.cap}</p>}
    </>
  );
}
