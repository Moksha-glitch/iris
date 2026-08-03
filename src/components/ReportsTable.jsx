import React from 'react';
import { useChatContext } from '../agentic';

/**
 * Tabular reports pinned from analysis insights.
 */
export default function ReportsTable() {
  const { reports, removeReport } = useChatContext();

  if (!reports.length) {
    return (
      <div className="reports-table-page">
        <header className="rt-header">
          <div className="cc-eyebrow">Reports</div>
          <h2>Pinned analysis tables</h2>
          <p className="rt-sub">
            From a chat detail view, use <strong>Add to reports</strong> to capture source metrics
            in a tabular format.
          </p>
        </header>
        <div className="rt-empty">
          <h3>No reports yet</h3>
          <p>Ask Vision AI a question, open the detail dashboard, then pin an insight to Reports.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="reports-table-page">
      <header className="rt-header">
        <div className="cc-eyebrow">Reports</div>
        <h2>Pinned analysis tables</h2>
        <p className="rt-sub">
          {reports.length} report{reports.length === 1 ? '' : 's'} from Vision AI evidence.
        </p>
      </header>

      <div className="rt-stack">
        {reports.map((report) => (
          <section key={report.id} className="rt-card">
            <div className="rt-card-head">
              <div>
                <h3>{report.title}</h3>
                <p className="rt-card-meta">
                  <span className="rt-type">{report.type}</span>
                  {report.query && <span title={report.query}>Q: {report.query}</span>}
                  <span>{new Date(report.createdAt).toLocaleString()}</span>
                </p>
              </div>
              <button
                type="button"
                className="rt-remove"
                onClick={() => removeReport(report.id)}
                aria-label={`Remove report ${report.title}`}
              >
                Remove
              </button>
            </div>
            <div className="rt-table-wrap">
              <table className="rt-table">
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
                  {report.rows.map((row, i) => (
                    <tr key={`${report.id}-${i}`}>
                      <td>{row.serviceProvider || row.metric}</td>
                      <td className="rt-val">{row.value}</td>
                      <td>
                        <span className={`rt-conf ${row.confidence}`}>{row.confidence}</span>
                      </td>
                      <td className="rt-src">{row.source}</td>
                      <td className="rt-note">{row.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
