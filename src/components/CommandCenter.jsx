import React, { useState, useMemo, useEffect } from 'react';
import { truckFleetData, fleetSummary, woSummary, missingWorkOrders, providerId } from '../excelData';
import { useChatContext, PERSONAS } from '../agentic';
import DashboardPanel from './DashboardPanel';

const KpiCell = ({ val, lbl, valClass = '' }) => (
  <div className="cc-kpi-cell">
    <div className={`kpi-val ${valClass}`}>{val}</div>
    <div className="kpi-lbl">{lbl}</div>
  </div>
);

const MetaChip = ({ children }) => <span className="cc-meta-chip">{children}</span>;

const FleetSummary = React.memo(({ providers }) => {
  const total = providers.reduce((s, p) => s + p.truckCount, 0);
  const withRfid = providers.reduce((s, p) => s + p.trucksWithRFID, 0);
  const without = providers.reduce((s, p) => s + p.trucksWithoutRFID, 0);
  const coverage = total ? ((withRfid / total) * 100).toFixed(1) : '0.0';
  const covPct = total ? (withRfid / total) * 100 : 0;
  const gapProviders = [...providers]
    .filter((p) => p.trucksWithoutRFID > 0)
    .sort((a, b) => b.trucksWithoutRFID - a.trucksWithoutRFID)
    .slice(0, 4);
  const maxGap = gapProviders[0]?.trucksWithoutRFID || 1;
  const topBySize = [...providers].sort((a, b) => b.truckCount - a.truckCount).slice(0, 4);
  const list = gapProviders.length ? gapProviders : topBySize;
  const listMode = gapProviders.length ? 'gap' : 'size';

  return (
    <div className="cc-card cc-fold-card">
      <div className="cc-card-header">
        <h2>Fleet Summary</h2>
        <MetaChip>Live</MetaChip>
      </div>
      <div className="cc-kpi-grid compact">
        <KpiCell val={total.toLocaleString()} lbl="Total trucks" />
        <KpiCell val={providers.length.toLocaleString()} lbl="Providers" />
        <KpiCell val={without.toLocaleString()} lbl="Without RFID" valClass="critical-text" />
        <KpiCell
          val={`${coverage}%`}
          lbl="Coverage"
          valClass={parseFloat(coverage) < 85 ? 'warning-text' : 'success-text'}
        />
      </div>
      <div className="cc-fleet-meter" aria-label={`RFID coverage ${coverage}%`}>
        <div className="cc-fleet-meter-track">
          <span className="cc-fleet-meter-eq" style={{ width: `${covPct}%` }} />
          <span className="cc-fleet-meter-gap" style={{ width: `${100 - covPct}%` }} />
        </div>
        <div className="cc-fleet-meter-legend">
          <span>
            <i className="cc-dot eq" /> {withRfid.toLocaleString()} equipped
          </span>
          <span>
            <i className="cc-dot gap" /> {without.toLocaleString()} unequipped
          </span>
        </div>
      </div>
      <div className="cc-fleet-list-lbl">
        {listMode === 'gap' ? 'Largest RFID gaps' : 'Largest fleets'}
      </div>
      <ul className="cc-dispatch-list cc-fleet-list">
        {list.map((p) => {
          const n = listMode === 'gap' ? p.trucksWithoutRFID : p.truckCount;
          const denom = listMode === 'gap' ? maxGap : topBySize[0]?.truckCount || 1;
          return (
            <li key={p.serviceProvider}>
              <span className="cc-fleet-name" title={p.serviceProvider}>
                {p.serviceProvider}
              </span>
              <span className="cc-dispatch-bar-wrap">
                <span
                  className={`cc-dispatch-bar ${listMode === 'gap' ? 'is-gap' : ''}`}
                  style={{ width: `${Math.min(100, (n / denom) * 100)}%` }}
                />
              </span>
              <span className="cc-dispatch-n">{n}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
});

const LiveDispatches = React.memo(() => (
  <div className="cc-card cc-fold-card">
    <div className="cc-card-header">
      <h2>Live Dispatches</h2>
      <MetaChip>Open WOs</MetaChip>
    </div>
    <div className="cc-kpi-grid compact">
      <KpiCell val={woSummary.dispatchBreakdown.length} lbl="Active dispatches" />
      <KpiCell
        val={woSummary.dispatchBreakdown[0]?.count || 0}
        lbl={woSummary.dispatchBreakdown[0]?.dispatch || 'Top dispatch'}
        valClass="warning-text"
      />
      <KpiCell
        val={woSummary.requestTypeBreakdown[0]?.count || 0}
        lbl={woSummary.requestTypeBreakdown[0]?.type?.slice(0, 18) || 'Top type'}
      />
      <KpiCell val={woSummary.totalWOs} lbl="Open WOs" />
    </div>
    <ul className="cc-dispatch-list">
      {woSummary.dispatchBreakdown.slice(0, 4).map((d) => (
        <li key={d.dispatch}>
          <span className="cc-dispatch-id">{d.dispatch}</span>
          <span className="cc-dispatch-bar-wrap">
            <span
              className="cc-dispatch-bar"
              style={{
                width: `${Math.min(
                  100,
                  (d.count / (woSummary.dispatchBreakdown[0]?.count || 1)) * 100
                )}%`,
              }}
            />
          </span>
          <span className="cc-dispatch-n">{d.count}</span>
        </li>
      ))}
    </ul>
  </div>
));

/** Ops Health — compact chart of WO age / coverage signal */
const OpsHealth = React.memo(() => {
  const bands = useMemo(() => {
    const ages = missingWorkOrders.map((w) => w.caseAge);
    const buckets = [
      { l: '0–500d', v: ages.filter((a) => a <= 500).length, c: 'ok' },
      { l: '501–700d', v: ages.filter((a) => a > 500 && a <= 700).length, c: 'ok' },
      { l: '701–1000d', v: ages.filter((a) => a > 700 && a <= 1000).length, c: 'hi' },
      { l: '1000d+', v: ages.filter((a) => a > 1000).length, c: 'hi' },
    ];
    return buckets;
  }, []);
  const max = Math.max(...bands.map((b) => b.v), 1);

  return (
    <div className="cc-card cc-fold-card">
      <div className="cc-card-header">
        <h2>Ops Health</h2>
        <MetaChip>
          {woSummary.overdueWOs} overdue · {fleetSummary.rfidCoverage}% RFID
        </MetaChip>
      </div>
      <div className="cc-ops-chart" role="img" aria-label="Work order age distribution">
        {bands.map((b) => (
          <div key={b.l} className="cc-ops-col">
            <div className="cc-ops-bwrap">
              <div
                className={`cc-ops-bar ${b.c}`}
                style={{ height: `${Math.max(8, Math.round((b.v / max) * 100))}%` }}
              />
            </div>
            <span className="cc-ops-v">{b.v}</span>
            <small>{b.l}</small>
          </div>
        ))}
      </div>
      <p className="cc-ops-cap">
        Avg case age {woSummary.avgCaseAge}d · oldest {woSummary.maxCaseAge}d
      </p>
    </div>
  );
});

const TriageRow = ({ id, type, title, desc, varText, onInvestigate, resolvedNodes }) => {
  const isResolved = resolvedNodes.includes(id);
  return (
    <button
      type="button"
      className={`triage-item ${type} ${isResolved ? 'resolved' : ''}`}
      onClick={() => onInvestigate(id)}
      aria-label={`Investigate ${title}`}
    >
      <div className={`ti-status ${isResolved ? 'is-resolved' : ''}`} aria-hidden>
        {isResolved ? '✓' : ''}
      </div>
      <div className="ti-content">
        <div
          className="ti-title"
          style={{
            textDecoration: isResolved ? 'line-through' : 'none',
            color: isResolved ? 'var(--text-muted)' : 'inherit',
          }}
        >
          {title}
        </div>
        <div className="ti-desc">{desc}</div>
        <div className="ti-var" style={{ color: isResolved ? 'var(--green)' : '' }}>
          {isResolved ? 'RESOLVED' : varText}
        </div>
      </div>
      <span className="ti-btn" aria-hidden>
        Investigate
      </span>
    </button>
  );
};

const RegionalAlerts = React.memo(({ onInvestigate, resolvedNodes }) => {
  const gaps = [...truckFleetData]
    .filter((p) => p.trucksWithoutRFID > 0)
    .sort((a, b) => b.trucksWithoutRFID - a.trucksWithoutRFID)
    .slice(0, 2);
  const topDispatch = woSummary.dispatchBreakdown[0];
  const oldest = [...missingWorkOrders].sort((a, b) => b.caseAge - a.caseAge)[0];

  return (
    <div className="cc-card cc-triage cc-fold-card">
      <div className="cc-card-header">
        <h2>Regional Alerts</h2>
        <MetaChip>By urgency</MetaChip>
      </div>
      {gaps.map((p) => (
        <TriageRow
          key={p.serviceProvider}
          id={providerId(p.serviceProvider)}
          type={p.trucksWithoutRFID >= 10 ? 'critical' : 'warning'}
          title={`${p.serviceProvider} RFID gap`}
          desc={`${p.trucksWithoutRFID} of ${p.truckCount} trucks unequipped.`}
          varText="Action Required"
          onInvestigate={onInvestigate}
          resolvedNodes={resolvedNodes}
        />
      ))}
      {topDispatch && (
        <TriageRow
          id="WO-Edmonton-Missing"
          type="warning"
          title={`Dispatch ${topDispatch.dispatch} overloaded`}
          desc={`${topDispatch.count} open missing work orders on this dispatch.`}
          varText="Monitor closely"
          onInvestigate={onInvestigate}
          resolvedNodes={resolvedNodes}
        />
      )}
      {oldest && gaps.length < 2 && (
        <TriageRow
          id="WO-Edmonton-Missing"
          type="critical"
          title={`Oldest WO #${oldest.woNumber} — ${oldest.caseAge}d`}
          desc={`${oldest.requestType} · ${oldest.address}`}
          varText={`Age: ${oldest.caseAge}d`}
          onInvestigate={onInvestigate}
          resolvedNodes={resolvedNodes}
        />
      )}
    </div>
  );
});

export default function CommandCenter({
  isActive,
  onInvestigate,
  resolvedNodes = [],
  embedded = false,
}) {
  const { activePersona: persona, dashboardWidgets } = useChatContext();
  const [region, setRegion] = useState('global');
  const [bu, setBu] = useState('all');
  const [timeframe, setTimeframe] = useState('30d');

  useEffect(() => {
    setRegion(persona === 'serviceProvider' ? 'na' : 'global');
    setBu(persona === 'segments' ? 'fleet' : 'all');
    setTimeframe(persona === 'segments' ? '7d' : '30d');
  }, [persona]);

  const filteredProviders = useMemo(() => {
    let list = [...truckFleetData];
    if (region === 'emea') list = list.filter((p) => /barbados|eu|uk|london/i.test(p.serviceProvider));
    if (region === 'apac') list = list.filter((p) => /asia|sydney|singapore/i.test(p.serviceProvider));
    if (region === 'na') list = list.filter((p) => !/barbados/i.test(p.serviceProvider));
    if (bu === 'fleet') list = list.filter((p) => p.truckCount >= 10);
    if (bu === 'service') {
      list = list.filter(
        (p) =>
          missingWorkOrders.some((w) => w.segment === p.serviceProvider) ||
          p.serviceProvider.includes('Edmonton')
      );
    }
    if (timeframe === '7d') list = list.slice(0, Math.max(8, Math.ceil(list.length * 0.35)));
    return list.length ? list : truckFleetData;
  }, [region, bu, timeframe]);

  const headerDetails = useMemo(() => {
    const trucks = filteredProviders.reduce((s, p) => s + p.truckCount, 0);
    const withRfid = filteredProviders.reduce((s, p) => s + p.trucksWithRFID, 0);
    const coverage = trucks ? ((withRfid / trucks) * 100).toFixed(1) : fleetSummary.rfidCoverage;
    const without = filteredProviders.reduce((s, p) => s + p.trucksWithoutRFID, 0);

    switch (persona) {
      case 'serviceProvider':
        return {
          label: 'Coverage / unequipped',
          score: `${coverage}%`,
          varAmount: `(${without.toLocaleString()})`,
        };
      case 'segments':
        return {
          label: 'Open WOs / overdue',
          score: `${woSummary.totalWOs}`,
          varAmount: `(${woSummary.overdueWOs} overdue)`,
        };
      case 'leadership':
      default:
        return {
          label: 'Network health',
          score: `${coverage}%`,
          varAmount: `(${trucks.toLocaleString()} trucks)`,
        };
    }
  }, [persona, filteredProviders]);

  const personaCfg = PERSONAS[persona] || PERSONAS.leadership;
  const hasPins = dashboardWidgets.length > 0;

  return (
    <div
      className={`command-center one-fold ${isActive ? 'active' : ''} ${embedded ? 'embedded' : ''} ${
        hasPins ? 'has-pins' : ''
      }`}
    >
      <header className="cc-header compact">
        <div className="cc-title">
          <div className="cc-eyebrow">Command Center</div>
          <h1>Network operations</h1>
          <div
            className="cc-persona-chip"
            style={{ borderColor: personaCfg.color, color: personaCfg.color }}
          >
            <span aria-hidden>{personaCfg.icon}</span>
            {personaCfg.shortLabel} view
          </div>
        </div>
        <div className="cc-header-right">
          <div className="cc-filters inline">
            <div className="filter-group">
              <label htmlFor="cc-region">Region</label>
              <select
                id="cc-region"
                className="cc-select"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
              >
                <option value="global">All regions</option>
                <option value="na">North America</option>
                <option value="emea">EMEA / Caribbean</option>
                <option value="apac">APAC</option>
              </select>
            </div>
            <div className="filter-group">
              <label htmlFor="cc-focus">Focus</label>
              <select
                id="cc-focus"
                className="cc-select"
                value={bu}
                onChange={(e) => setBu(e.target.value)}
              >
                <option value="all">All fleets</option>
                <option value="fleet">Large fleets (10+)</option>
                <option value="service">Service / WO focus</option>
              </select>
            </div>
            <div className="filter-group">
              <label htmlFor="cc-time">Time</label>
              <select
                id="cc-time"
                className="cc-select"
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
              >
                <option value="7d">7 days</option>
                <option value="30d">30 days</option>
                <option value="q3">Quarter</option>
                <option value="ytd">YTD</option>
              </select>
            </div>
          </div>
          <div className="cc-network-health">
            <div className="nh-label">{headerDetails.label}</div>
            <div className="nh-score">
              {headerDetails.score}{' '}
              <span className="nh-var">{headerDetails.varAmount}</span>
            </div>
          </div>
        </div>
      </header>

      {hasPins && (
        <div className="cc-pins-strip">
          <DashboardPanel embedded />
        </div>
      )}

      <div className="cc-home-fold">
        <RegionalAlerts onInvestigate={onInvestigate} resolvedNodes={resolvedNodes} />
        <OpsHealth />
        <LiveDispatches />
        <FleetSummary providers={filteredProviders} />
      </div>
    </div>
  );
}
