import React, { useState, useMemo, useEffect } from 'react';

// --- Reusable KPI Cells ---
const KpiCell = ({ val, lbl, valClass = '' }) => (
  <div className="cc-kpi-cell">
    <div className={`kpi-val ${valClass}`}>{val}</div>
    <div className="kpi-lbl">{lbl}</div>
  </div>
);

// --- Shared Components ---
const RouteSummary = React.memo(({ mult }) => (
  <div className="cc-card">
    <div className="cc-card-header">
      <h2>Route Summary</h2>
      <select className="cc-card-select"><option>Today</option></select>
    </div>
    <div className="cc-kpi-grid">
      <KpiCell val={Math.round(1317 * mult).toLocaleString()} lbl="Total routes" />
      <KpiCell val={Math.round(567 * mult).toLocaleString()} lbl="Incomplete" valClass="warning-text" />
      <KpiCell val={Math.round(7352 * mult).toLocaleString()} lbl="Total stops" />
      <KpiCell val={Math.round(703 * mult).toLocaleString()} lbl="Delayed stops" valClass="critical-text" />
    </div>
  </div>
));

const LiftSummary = React.memo(({ mult }) => {
  const uptime = Math.min(99.9, Math.max(0, 57.6 + (mult > 1 ? mult * 2 : -2)));
  return (
    <div className="cc-card">
      <div className="cc-card-header">
        <h2>Lift Summary</h2>
        <select className="cc-card-select"><option>Today</option></select>
      </div>
      <div className="cc-kpi-grid">
        <KpiCell val={Math.round(1162 * mult).toLocaleString()} lbl="In service" />
        <KpiCell val={Math.round(855 * mult).toLocaleString()} lbl="Offline" valClass="warning-text" />
        <KpiCell val="0" lbl="In fault" valClass="success-text" />
        <KpiCell val={`${uptime.toFixed(1)}%`} lbl="Avg. uptime" />
      </div>
    </div>
  );
});

const AssetManagement = React.memo(({ mult }) => {
  const recovery = Math.min(99.9, Math.max(0, 90.2 + (mult > 1 ? mult * 1.5 : -1.5)));
  return (
    <div className="cc-card">
      <div className="cc-card-header">
        <h2>Asset Management</h2>
        <select className="cc-card-select"><option>Today</option></select>
      </div>
      <div className="cc-kpi-grid">
        <KpiCell val={Math.round(40000 * mult).toLocaleString()} lbl="At DC" />
        <KpiCell val={Math.round(33705 * mult).toLocaleString()} lbl="On routes" />
        <KpiCell val={Math.round(7218 * mult).toLocaleString()} lbl="Flagged lost" valClass="critical-text" />
        <KpiCell val={`${recovery.toFixed(1)}%`} lbl="Recovery rate" />
      </div>
    </div>
  );
});

const CasesSummary = React.memo(({ mult }) => (
  <div className="cc-card">
    <div className="cc-card-header">
      <h2>Cases Summary</h2>
      <select className="cc-card-select"><option>Today</option></select>
    </div>
    <div className="cc-kpi-grid">
      <KpiCell val={Math.round(1240 * mult).toLocaleString()} lbl="Cases planned" />
      <KpiCell val={Math.round(188 * (mult > 0.5 ? 1 : 0.6)).toLocaleString()} lbl="Cases / hour" />
    </div>
  </div>
));

const GanttChart = React.memo(() => (
  <div className="cc-card" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
    <div className="cc-card-header">
      <h2>Route Execution Status</h2>
      <select className="cc-card-select"><option>Today</option></select>
    </div>
    
    <div className="gantt-legend">
      <span className="g-leg"><span className="g-box start"></span>Start</span>
      <span className="g-leg"><span className="g-box on-time"></span>On time</span>
      <span className="g-leg"><span className="g-box ahead"></span>Ahead</span>
      <span className="g-leg"><span className="g-box delayed"></span>Delayed</span>
      <span className="g-leg"><span className="g-box progress"></span>In progress</span>
    </div>
    
    <div className="gantt-chart">
      <div className="gantt-axis">
        <span>04:00</span><span>06:00</span><span>08:00</span><span>10:00</span><span>12:00</span>
      </div>
      
      <div className="gantt-row">
        <div className="gantt-label"><strong>R-64</strong><br/>10 stops</div>
        <div className="gantt-track">
          <div className="gantt-bar start" style={{left: '5%', width: '5%'}}></div>
          <div className="gantt-bar on-time" style={{left: '11%', width: '25%'}}></div>
          <div className="gantt-bar on-time" style={{left: '37%', width: '15%'}}></div>
          <div className="gantt-bar ahead" style={{left: '53%', width: '10%'}}></div>
          <div className="gantt-bar on-time" style={{left: '64%', width: '10%'}}></div>
          <div className="gantt-bar progress" style={{left: '75%', width: '20%'}}></div>
          <div className="gantt-status critical-text">+88m</div>
        </div>
      </div>
      <div className="gantt-row">
        <div className="gantt-label"><strong>R-65</strong><br/>7 stops</div>
        <div className="gantt-track">
          <div className="gantt-bar start" style={{left: '0%', width: '4%'}}></div>
          <div className="gantt-bar on-time" style={{left: '5%', width: '15%'}}></div>
          <div className="gantt-bar delayed" style={{left: '21%', width: '15%'}}></div>
          <div className="gantt-bar on-time" style={{left: '37%', width: '20%'}}></div>
          <div className="gantt-bar progress" style={{left: '58%', width: '15%'}}></div>
          <div className="gantt-status critical-text">+159m</div>
        </div>
      </div>
      <div className="gantt-row">
        <div className="gantt-label"><strong>R-66</strong><br/>8 stops</div>
        <div className="gantt-track">
          <div className="gantt-bar ahead" style={{left: '18%', width: '10%'}}></div>
          <div className="gantt-bar on-time" style={{left: '29%', width: '22%'}}></div>
          <div className="gantt-bar on-time" style={{left: '52%', width: '21%'}}></div>
          <div className="gantt-status success-text">-139m</div>
        </div>
      </div>
      <div className="gantt-row">
        <div className="gantt-label"><strong>R-67</strong><br/>9 stops</div>
        <div className="gantt-track">
          <div className="gantt-bar start" style={{left: '2%', width: '5%'}}></div>
          <div className="gantt-bar on-time" style={{left: '8%', width: '5%'}}></div>
          <div className="gantt-bar ahead" style={{left: '14%', width: '11%'}}></div>
          <div className="gantt-bar on-time" style={{left: '26%', width: '22%'}}></div>
          <div className="gantt-bar ahead" style={{left: '49%', width: '11%'}}></div>
          <div className="gantt-bar on-time" style={{left: '61%', width: '21%'}}></div>
          <div className="gantt-status success-text">-153m</div>
        </div>
      </div>
    </div>
  </div>
));

// --- Triage Components ---
const TriageRow = ({ id, type, title, desc, varText, onInvestigate, resolvedNodes }) => {
  const isResolved = resolvedNodes.includes(id);
  return (
    <div className={`triage-item ${type} ${isResolved ? 'resolved' : ''}`} onClick={() => onInvestigate(id)}>
      <div className="ti-status" style={{background: isResolved ? 'transparent' : '', fontSize: '10px'}}>{isResolved ? '✅' : ''}</div>
      <div className="ti-content">
        <div className="ti-title" style={{textDecoration: isResolved ? 'line-through' : 'none', color: isResolved ? 'var(--text-muted)' : 'inherit'}}>{title}</div>
        <div className="ti-desc">{desc}</div>
        <div className="ti-var" style={{color: isResolved ? 'var(--green)' : ''}}>{isResolved ? 'RESOLVED' : varText}</div>
      </div>
      <button className="ti-btn">Investigate</button>
    </div>
  );
};

const CEOTriage = React.memo(({ onInvestigate, resolvedNodes }) => (
  <div className="cc-card cc-triage">
    <div className="cc-card-header">
      <h2>Recommended Investigations</h2>
      <select className="cc-card-select">
        <option value="var">Sort by: Value at Risk</option>
        <option value="urgency">Sort by: Urgency</option>
      </select>
    </div>
    <TriageRow id="LOC-Charlotte" type="critical" title="1,648 pallets left Charlotte unscanned" desc="Single biggest recovery opportunity today." varText="VaR: $58.0K" onInvestigate={onInvestigate} resolvedNodes={resolvedNodes} />
    <TriageRow id="LOC-BirminghamDC" type="warning" title="Birmingham DC - Lifts overdue" desc="Pulling tonight avoids unplanned downtime." varText="2 Lifts Overdue" onInvestigate={onInvestigate} resolvedNodes={resolvedNodes} />
    <TriageRow id="LOC-Leland" type="warning" title="Leland route tracking late" desc="Re-sequencing could recover 12 min." varText="1 Route at Risk" onInvestigate={onInvestigate} resolvedNodes={resolvedNodes} />
  </div>
));

const ManagerTriage = React.memo(({ onInvestigate, resolvedNodes }) => (
  <div className="cc-card cc-triage">
    <div className="cc-card-header">
      <h2>Regional Alerts</h2>
      <select className="cc-card-select">
        <option value="urgency">Sort by: Urgency</option>
      </select>
    </div>
    <TriageRow id="LOC-Charlotte" type="critical" title="Charlotte Approaching Capacity" desc="Inbound volume exceeds throughput by 14%." varText="Action Required" onInvestigate={onInvestigate} resolvedNodes={resolvedNodes} />
    <TriageRow id="LOC-Opelika" type="warning" title="Asset Loss Spike - Opelika" desc="Unscanned departures up 8% week-over-week." varText="Monitor closely" onInvestigate={onInvestigate} resolvedNodes={resolvedNodes} />
  </div>
));

const AnalystTriage = React.memo(({ onInvestigate, resolvedNodes }) => (
  <div className="cc-card cc-triage">
    <div className="cc-card-header">
      <h2>Route Anomalies</h2>
      <select className="cc-card-select">
        <option value="delay">Sort by: Delay Time</option>
      </select>
    </div>
    <TriageRow id="LOC-Charlotte" type="critical" title="Charlotte tracking 159m late" desc="Traffic collision on I-95." varText="Delay: +159m" onInvestigate={onInvestigate} resolvedNodes={resolvedNodes} />
    <TriageRow id="LOC-Leland" type="critical" title="Leland tracking 88m late" desc="Driver deviated from AI route." varText="Delay: +88m" onInvestigate={onInvestigate} resolvedNodes={resolvedNodes} />
  </div>
));

export default function CommandCenter({ isActive, onInvestigate, persona, setPersona, resolvedNodes = [] }) {
  const [region, setRegion] = useState('global');
  const [bu, setBu] = useState('all');
  const [timeframe, setTimeframe] = useState('30d');

  // Update defaults when persona changes
  useEffect(() => {
    setRegion(persona === 'manager' ? 'na' : 'global');
    setBu(persona === 'analyst' ? 'fleet' : 'all');
    setTimeframe(persona === 'analyst' ? '7d' : '30d');
  }, [persona]);

  const mult = useMemo(() => {
    let m = 1.0;
    if (region === 'emea') m *= 0.4;
    if (region === 'apac') m *= 0.2;
    if (bu === 'fleet') m *= 0.8;
    if (bu === 'manufacturing') m *= 0.3;
    if (timeframe === '7d') m *= 0.25;
    if (timeframe === 'q3') m *= 3.0;
    if (timeframe === 'ytd') m *= 8.0;
    return m;
  }, [region, bu, timeframe]);

  const headerDetails = useMemo(() => {
    const formatScore = (base, isMoney=false) => {
      const val = Math.round(base * mult);
      if (isMoney) return val > 1000 ? `(${(val/1000).toFixed(1)}M)` : `($${val}K)`;
      return `(${val.toLocaleString()})`;
    };
    
    switch(persona) {
      case 'manager':
        return { label: "Regional Recovery Rate / Assets Missing", score: "90.2%", varAmount: formatScore(7218) };
      case 'analyst':
        return { label: "On-Time Routing / Delayed Stops", score: "90.4%", varAmount: formatScore(703) };
      case 'ceo':
      default:
        return { label: "Network Health / VaR exposed", score: "72%", varAmount: formatScore(721.8, true) };
    }
  }, [persona, mult]);

  return (
    <div className={`command-center ${isActive ? 'active' : ''}`}>
      
      {/* Header */}
      <header className="cc-header">
        <div className="cc-title">
          <h1>REHRIG DECISION INTELLIGENCE</h1>
          <div className="user-role" style={{
            position: 'relative',
            background: 'var(--surface)',
            padding: '4px 8px',
            borderRadius: 'var(--radius)',
            border: '1px solid var(--border)',
            marginTop: '8px'
          }}>
            <div style={{ 
              position: 'absolute', 
              top: '-7px', 
              left: '8px', 
              background: 'var(--bg)', 
              padding: '0 4px', 
              fontSize: '9px', 
              fontWeight: 600, 
              color: 'var(--text-muted)',
              letterSpacing: '0.5px'
            }}>
              PERSONA SIMULATOR
            </div>
            <select 
              className="cc-select" 
              style={{
                border: 'none', 
                background: 'transparent', 
                paddingLeft: 0, 
                fontWeight: 600,
                color: 'var(--text-main)',
                outline: 'none',
                width: '100%',
                cursor: 'pointer'
              }} 
              value={persona} 
              onChange={(e) => setPersona(e.target.value)}
            >
              <option value="ceo">Persona: CEO / Global Supply Chain</option>
              <option value="manager">Persona: Manager / Regional Logistics</option>
              <option value="analyst">Persona: Analyst / Route Optimization</option>
            </select>
          </div>
        </div>
        <div className="cc-network-health">
          <div className="nh-label">{headerDetails.label}</div>
          <div className="nh-score">{headerDetails.score} <span className="nh-var">{headerDetails.varAmount}</span></div>
        </div>
      </header>

      {/* Filters */}
      <div className="cc-filters">
        <div className="filter-group">
          <label>Region</label>
          <select className="cc-select" value={region} onChange={(e) => setRegion(e.target.value)}>
            <option value="global">Global (All Regions)</option>
            <option value="na">North America</option>
            <option value="emea">EMEA</option>
            <option value="apac">APAC</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label>Business Unit</label>
          <select className="cc-select" value={bu} onChange={(e) => setBu(e.target.value)}>
            <option value="all">All Divisions</option>
            <option value="supply">Supply Chain</option>
            <option value="fleet">Fleet Operations</option>
            <option value="manufacturing">Manufacturing</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Timeframe</label>
          <select className="cc-select" value={timeframe} onChange={(e) => setTimeframe(e.target.value)}>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="q3">Q3 Forecast</option>
            <option value="ytd">Year to Date</option>
          </select>
        </div>
      </div>

      {/* CEO Layout */}
      {persona === 'ceo' && (
        <>
          <div className="cc-grid-top">
            <CEOTriage onInvestigate={onInvestigate} resolvedNodes={resolvedNodes} />
            <RouteSummary mult={mult} />
          </div>
          <div className="cc-grid-3col" style={{marginTop: '24px'}}>
            <LiftSummary mult={mult} />
            <AssetManagement mult={mult} />
            <CasesSummary mult={mult} />
          </div>
          <div style={{marginTop: '24px', display: 'flex'}}>
            <GanttChart />
          </div>
        </>
      )}

      {/* Manager Layout */}
      {persona === 'manager' && (
        <>
          <div className="cc-grid-top">
            <ManagerTriage onInvestigate={onInvestigate} resolvedNodes={resolvedNodes} />
            <AssetManagement mult={mult} />
          </div>
          <div className="cc-grid-3col" style={{marginTop: '24px'}}>
            <LiftSummary mult={mult} />
            <CasesSummary mult={mult} />
            <RouteSummary mult={mult} />
          </div>
          <div style={{marginTop: '24px', display: 'flex'}}>
            <GanttChart />
          </div>
        </>
      )}

      {/* Analyst Layout */}
      {persona === 'analyst' && (
        <>
          <div className="cc-grid-top">
            <AnalystTriage onInvestigate={onInvestigate} resolvedNodes={resolvedNodes} />
            <RouteSummary mult={mult} />
          </div>
          <div className="cc-grid-3col" style={{marginTop: '24px'}}>
            <LiftSummary mult={mult} />
            <AssetManagement mult={mult} />
            <CasesSummary mult={mult} />
          </div>
          <div style={{marginTop: '24px', display: 'flex'}}>
            <GanttChart />
          </div>
        </>
      )}

    </div>
  );
}
