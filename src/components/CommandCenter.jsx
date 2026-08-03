import React, { useState, useMemo, useEffect } from 'react';
import { truckFleetData, fleetSummary, woSummary, missingWorkOrders, providerId } from '../excelData';
import { useChatContext, PERSONAS } from '../agentic';

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
  return (
    <div className="cc-card">
      <div className="cc-card-header">
        <h2>Fleet Summary</h2>
        <MetaChip>Filtered view</MetaChip>
      </div>
      <div className="cc-kpi-grid">
        <KpiCell val={total.toLocaleString()} lbl="Total trucks" />
        <KpiCell val={providers.length.toLocaleString()} lbl="Providers" />
        <KpiCell val={without.toLocaleString()} lbl="Without RFID" valClass="critical-text" />
        <KpiCell val={`${coverage}%`} lbl="RFID coverage" valClass={parseFloat(coverage) < 85 ? 'warning-text' : 'success-text'} />
      </div>
    </div>
  );
});

const RfidSummary = React.memo(({ providers }) => {
  const withRfid = providers.reduce((s, p) => s + p.trucksWithRFID, 0);
  const without = providers.reduce((s, p) => s + p.trucksWithoutRFID, 0);
  const gaps = [...providers].filter(p => p.trucksWithoutRFID > 0).sort((a, b) => b.trucksWithoutRFID - a.trucksWithoutRFID);
  return (
    <div className="cc-card">
      <div className="cc-card-header">
        <h2>RFID Coverage</h2>
        <MetaChip>Live</MetaChip>
      </div>
      <div className="cc-kpi-grid">
        <KpiCell val={withRfid.toLocaleString()} lbl="Equipped" valClass="success-text" />
        <KpiCell val={without.toLocaleString()} lbl="Unequipped" valClass="warning-text" />
        <KpiCell val={gaps.length.toLocaleString()} lbl="Providers with gaps" />
        <KpiCell val={gaps[0] ? gaps[0].trucksWithoutRFID : 0} lbl={gaps[0] ? `Largest: ${gaps[0].serviceProvider}` : 'Largest gap'} valClass="critical-text" />
      </div>
    </div>
  );
});

const WorkOrderSummary = React.memo(() => (
  <div className="cc-card">
    <div className="cc-card-header">
      <h2>Missing Work Orders</h2>
      <MetaChip>Edmonton AB</MetaChip>
    </div>
    <div className="cc-kpi-grid">
      <KpiCell val={woSummary.totalWOs} lbl="Open WOs" />
      <KpiCell val={woSummary.overdueWOs} lbl="Overdue (>700d)" valClass="critical-text" />
      <KpiCell val={woSummary.avgCaseAge} lbl="Avg case age (d)" valClass="warning-text" />
      <KpiCell val={woSummary.maxCaseAge} lbl="Oldest case (d)" valClass="critical-text" />
    </div>
  </div>
));

const DispatchSummary = React.memo(() => (
  <div className="cc-card">
    <div className="cc-card-header">
      <h2>Dispatch Load</h2>
      <MetaChip>Open WOs</MetaChip>
    </div>
    <div className="cc-kpi-grid">
      <KpiCell val={woSummary.dispatchBreakdown.length} lbl="Active dispatches" />
      <KpiCell val={woSummary.dispatchBreakdown[0]?.count || 0} lbl={woSummary.dispatchBreakdown[0]?.dispatch || 'Top dispatch'} valClass="warning-text" />
      <KpiCell val={woSummary.requestTypeBreakdown[0]?.count || 0} lbl={woSummary.requestTypeBreakdown[0]?.type?.slice(0, 18) || 'Top type'} />
      <KpiCell val={woSummary.requestTypeBreakdown.length} lbl="Request types" />
    </div>
  </div>
));

const ProviderBars = React.memo(({ providers }) => {
  const top = [...providers].sort((a, b) => b.truckCount - a.truckCount).slice(0, 6);
  const max = top[0]?.truckCount || 1;
  return (
    <div className="cc-card" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <div className="cc-card-header">
        <h2>Top Providers by Fleet Size</h2>
        <MetaChip>By trucks</MetaChip>
      </div>
      <div className="gantt-legend">
        <span className="g-leg"><span className="g-box on-time"></span>With RFID</span>
        <span className="g-leg"><span className="g-box delayed"></span>Without RFID</span>
      </div>
      <div className="gantt-chart">
        {top.map(p => {
          const withPct = (p.trucksWithRFID / max) * 100;
          const withoutPct = (p.trucksWithoutRFID / max) * 100;
          const cov = p.truckCount ? ((p.trucksWithRFID / p.truckCount) * 100).toFixed(0) : 0;
          return (
            <div className="gantt-row" key={p.serviceProvider}>
              <div className="gantt-label"><strong>{p.serviceProvider}</strong><br/>{p.truckCount} trucks</div>
              <div className="gantt-track">
                <div className="gantt-bar on-time" style={{ left: '0%', width: `${withPct}%` }}></div>
                <div className="gantt-bar delayed" style={{ left: `${withPct}%`, width: `${withoutPct}%` }}></div>
                <div className={`gantt-status ${p.trucksWithoutRFID > 0 ? 'critical-text' : 'success-text'}`}>{cov}% RFID</div>
              </div>
            </div>
          );
        })}
      </div>
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
      <div
        className={`ti-status ${isResolved ? 'is-resolved' : ''}`}
        aria-hidden
      >
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

const CEOTriage = React.memo(({ onInvestigate, resolvedNodes }) => {
  const [sortBy, setSortBy] = useState('var');
  const gap = fleetSummary.largestGap;
  const oldest = [...missingWorkOrders].sort((a, b) => b.caseAge - a.caseAge)[0];
  const edmonton = truckFleetData.find(p => p.serviceProvider === 'Edmonton AB');

  const rows = [
    {
      id: 'WO-Edmonton-Missing',
      type: 'critical',
      title: `${woSummary.overdueWOs} overdue missing work orders`,
      desc: `Oldest: WO #${oldest?.woNumber} at ${oldest?.caseAge} days (${oldest?.requestType}).`,
      varText: `VaR: $${(woSummary.overdueWOs * 1250).toLocaleString()}`,
      score: woSummary.overdueWOs * 1250,
      urgency: 3,
    },
    gap && {
      id: providerId(gap.serviceProvider),
      type: 'warning',
      title: `${gap.serviceProvider} — ${gap.trucksWithoutRFID} trucks without RFID`,
      desc: `Largest RFID gap in the network (${gap.truckCount} total trucks).`,
      varText: `${gap.trucksWithoutRFID} unequipped`,
      score: gap.trucksWithoutRFID * 450,
      urgency: 2,
    },
    edmonton && {
      id: providerId(edmonton.serviceProvider),
      type: 'warning',
      title: `Edmonton AB fleet — ${edmonton.truckCount} trucks`,
      desc: `${edmonton.trucksWithRFID} RFID-equipped, ${edmonton.trucksWithoutRFID} gaps, ${woSummary.totalWOs} open WOs.`,
      varText: `${((edmonton.trucksWithRFID / edmonton.truckCount) * 100).toFixed(1)}% coverage`,
      score: edmonton.truckCount,
      urgency: 1,
    },
  ].filter(Boolean);

  const sorted = [...rows].sort((a, b) =>
    sortBy === 'urgency' ? b.urgency - a.urgency : b.score - a.score
  );

  return (
    <div className="cc-card cc-triage">
      <div className="cc-card-header">
        <h2>Recommended Investigations</h2>
        <select
          className="cc-card-select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          aria-label="Sort investigations"
        >
          <option value="var">Sort by: Value at Risk</option>
          <option value="urgency">Sort by: Urgency</option>
        </select>
      </div>
      {sorted.map((row) => (
        <TriageRow
          key={row.id + row.title}
          id={row.id}
          type={row.type}
          title={row.title}
          desc={row.desc}
          varText={row.varText}
          onInvestigate={onInvestigate}
          resolvedNodes={resolvedNodes}
        />
      ))}
    </div>
  );
});

const ManagerTriage = React.memo(({ onInvestigate, resolvedNodes }) => {
  const gaps = [...truckFleetData].filter(p => p.trucksWithoutRFID > 0).sort((a, b) => b.trucksWithoutRFID - a.trucksWithoutRFID).slice(0, 2);
  const topDispatch = woSummary.dispatchBreakdown[0];
  return (
    <div className="cc-card cc-triage">
      <div className="cc-card-header">
        <h2>Regional Alerts</h2>
        <MetaChip>By urgency</MetaChip>
      </div>
      {gaps.map(p => (
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
    </div>
  );
});

const AnalystTriage = React.memo(({ onInvestigate, resolvedNodes }) => {
  const oldest = [...missingWorkOrders].sort((a, b) => b.caseAge - a.caseAge).slice(0, 2);
  const bulk = woSummary.requestTypeBreakdown.find(r => r.type === 'OBS-Bulk Pickup');
  return (
    <div className="cc-card cc-triage">
      <div className="cc-card-header">
        <h2>Work Order Anomalies</h2>
        <MetaChip>By case age</MetaChip>
      </div>
      {oldest.map(w => (
        <TriageRow
          key={w.woNumber}
          id="WO-Edmonton-Missing"
          type="critical"
          title={`WO #${w.woNumber} — ${w.caseAge}d old`}
          desc={`${w.requestType} · ${w.address}`}
          varText={`Age: ${w.caseAge}d`}
          onInvestigate={onInvestigate}
          resolvedNodes={resolvedNodes}
        />
      ))}
      {bulk && (
        <TriageRow
          id="WO-Edmonton-Missing"
          type="warning"
          title={`OBS-Bulk Pickup backlog (${bulk.count})`}
          desc={`Avg age ${bulk.avgAge} days — consider batch dispatch.`}
          varText={`${bulk.count} pending`}
          onInvestigate={onInvestigate}
          resolvedNodes={resolvedNodes}
        />
      )}
    </div>
  );
});

export default function CommandCenter({ isActive, onInvestigate, resolvedNodes = [], embedded = false }) {
  const { activePersona: persona } = useChatContext();
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
    if (region === 'emea') list = list.filter(p => /barbados|eu|uk|london/i.test(p.serviceProvider));
    if (region === 'apac') list = list.filter(p => /asia|sydney|singapore/i.test(p.serviceProvider));
    if (region === 'na') list = list.filter(p => !/barbados/i.test(p.serviceProvider));
    if (bu === 'fleet') list = list.filter(p => p.truckCount >= 10);
    if (bu === 'service') list = list.filter(p => missingWorkOrders.some(w => w.segment === p.serviceProvider) || p.serviceProvider.includes('Edmonton'));
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
        return { label: 'RFID Coverage / Unequipped Trucks', score: `${coverage}%`, varAmount: `(${without.toLocaleString()})` };
      case 'segments':
        return { label: 'Open WOs / Overdue Cases', score: `${woSummary.totalWOs}`, varAmount: `(${woSummary.overdueWOs} overdue)` };
      case 'leadership':
      default:
        return { label: 'Network Health / Fleet Exposure', score: `${coverage}%`, varAmount: `(${trucks.toLocaleString()} trucks)` };
    }
  }, [persona, filteredProviders]);

  const personaCfg = PERSONAS[persona] || PERSONAS.leadership;

  return (
    <div className={`command-center ${isActive ? 'active' : ''} ${embedded ? 'embedded' : ''}`}>
      <header className="cc-header">
        <div className="cc-title">
          <div className="cc-eyebrow">Command Center</div>
          <h1>Network operations</h1>
          <div className="cc-persona-chip" style={{ borderColor: personaCfg.color, color: personaCfg.color }}>
            <span aria-hidden>{personaCfg.icon}</span>
            {personaCfg.shortLabel} view
          </div>
        </div>
        <div className="cc-network-health">
          <div className="nh-label">{headerDetails.label}</div>
          <div className="nh-score">
            {headerDetails.score} <span className="nh-var">{headerDetails.varAmount}</span>
          </div>
        </div>
      </header>

      <div className="cc-filters">
        <div className="filter-group">
          <label htmlFor="cc-region">Region</label>
          <select id="cc-region" className="cc-select" value={region} onChange={(e) => setRegion(e.target.value)}>
            <option value="global">All regions</option>
            <option value="na">North America</option>
            <option value="emea">EMEA / Caribbean</option>
            <option value="apac">APAC</option>
          </select>
        </div>
        <div className="filter-group">
          <label htmlFor="cc-focus">Focus</label>
          <select id="cc-focus" className="cc-select" value={bu} onChange={(e) => setBu(e.target.value)}>
            <option value="all">All fleets</option>
            <option value="fleet">Large fleets (10+)</option>
            <option value="service">Service / WO focus</option>
          </select>
        </div>
        <div className="filter-group">
          <label htmlFor="cc-time">Timeframe</label>
          <select id="cc-time" className="cc-select" value={timeframe} onChange={(e) => setTimeframe(e.target.value)}>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="q3">Quarter view</option>
            <option value="ytd">Year to date</option>
          </select>
        </div>
      </div>

      {persona === 'leadership' && (
        <>
          <div className="cc-grid-top">
            <CEOTriage onInvestigate={onInvestigate} resolvedNodes={resolvedNodes} />
            <FleetSummary providers={filteredProviders} />
          </div>
          <div className="cc-grid-3col" style={{ marginTop: '24px' }}>
            <RfidSummary providers={filteredProviders} />
            <WorkOrderSummary />
            <DispatchSummary />
          </div>
          <div style={{ marginTop: '24px', display: 'flex' }}>
            <ProviderBars providers={filteredProviders} />
          </div>
        </>
      )}

      {persona === 'serviceProvider' && (
        <>
          <div className="cc-grid-top">
            <ManagerTriage onInvestigate={onInvestigate} resolvedNodes={resolvedNodes} />
            <RfidSummary providers={filteredProviders} />
          </div>
          <div className="cc-grid-3col" style={{ marginTop: '24px' }}>
            <FleetSummary providers={filteredProviders} />
            <WorkOrderSummary />
            <DispatchSummary />
          </div>
          <div style={{ marginTop: '24px', display: 'flex' }}>
            <ProviderBars providers={filteredProviders} />
          </div>
        </>
      )}

      {persona === 'segments' && (
        <>
          <div className="cc-grid-top">
            <AnalystTriage onInvestigate={onInvestigate} resolvedNodes={resolvedNodes} />
            <WorkOrderSummary />
          </div>
          <div className="cc-grid-3col" style={{ marginTop: '24px' }}>
            <FleetSummary providers={filteredProviders} />
            <RfidSummary providers={filteredProviders} />
            <DispatchSummary />
          </div>
          <div style={{ marginTop: '24px', display: 'flex' }}>
            <ProviderBars providers={filteredProviders} />
          </div>
        </>
      )}
    </div>
  );
}
