import React from 'react';
import { useChatContext } from '../agentic';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

const KpiWidget = ({ widget, onRemove }) => {
  const trendColors = { up: '#166534', down: '#B91C1C', stable: '#B45309' };
  const trendIcons = { up: '↑', down: '↓', stable: '→' };

  return (
    <div className="dash-widget kpi-widget">
      <div className="dw-header">
        <h4>{widget.title}</h4>
        <button
          type="button"
          className="dw-remove"
          onClick={() => onRemove(widget.id)}
          aria-label={`Remove ${widget.title}`}
        >
          ×
        </button>
      </div>
      <div className="kpi-body">
        <div className="kpi-value">{widget.value}</div>
        <div className="kpi-subtitle">{widget.subtitle}</div>
        {widget.delta && (
          <div className="kpi-delta" style={{ color: trendColors[widget.trend] || '#52525B' }}>
            <span aria-hidden>{trendIcons[widget.trend] || ''}</span> {widget.delta}
          </div>
        )}
      </div>
    </div>
  );
};

const BarChartWidget = ({ widget, onRemove }) => {
  const sampleItem = widget.data?.[0] || {};
  const valueKeys = Object.keys(sampleItem).filter(
    (k) => k !== 'name' && typeof sampleItem[k] === 'number'
  );
  const colors = widget.colors || ['#1D4ED8', '#B91C1C', '#166534', '#B45309'];

  return (
    <div className="dash-widget chart-widget">
      <div className="dw-header">
        <h4>{widget.title}</h4>
        <button
          type="button"
          className="dw-remove"
          onClick={() => onRemove(widget.id)}
          aria-label={`Remove ${widget.title}`}
        >
          ×
        </button>
      </div>
      <div className="chart-body">
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={widget.data} margin={{ top: 8, right: 8, bottom: 4, left: -12 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E4E4E7" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 10, fill: '#52525B' }}
              interval={0}
              angle={-20}
              textAnchor="end"
              height={50}
            />
            <YAxis tick={{ fontSize: 10, fill: '#52525B' }} />
            <Tooltip
              contentStyle={{
                background: '#fff',
                border: '1px solid #E4E4E7',
                borderRadius: '6px',
                fontSize: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              }}
            />
            {valueKeys.map((key, idx) => (
              <Bar key={key} dataKey={key} fill={colors[idx % colors.length]} radius={[3, 3, 0, 0]} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default function DashboardPanel({ onClose }) {
  const { dashboardWidgets, removeWidget } = useChatContext();

  return (
    <div className="dashboard-panel">
      <div className="dp-header">
        <div>
          <h2>Widgets</h2>
          <p className="dp-sub">Pinned from IRIS insights</p>
        </div>
        <div className="dp-header-right">
          <span className="dp-count" aria-label={`${dashboardWidgets.length} widgets`}>
            {dashboardWidgets.length}
          </span>
          {onClose && (
            <button type="button" className="dp-close" onClick={onClose} aria-label="Close widgets">
              ×
            </button>
          )}
        </div>
      </div>

      {dashboardWidgets.length === 0 ? (
        <div className="dp-empty">
          <h3>No widgets yet</h3>
          <p>
            Ask IRIS a question, then pin an insight with <strong>Add to dashboard</strong>.
          </p>
        </div>
      ) : (
        <div className="dp-grid">
          {dashboardWidgets.map((w) => {
            if (w.chartType === 'kpi') {
              return <KpiWidget key={w.id} widget={w} onRemove={removeWidget} />;
            }
            return <BarChartWidget key={w.id} widget={w} onRemove={removeWidget} />;
          })}
        </div>
      )}
    </div>
  );
}
