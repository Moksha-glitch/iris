import React, { useState, useRef, useEffect } from 'react';
import { fleetSummary, woSummary, missingWorkOrders, truckFleetData } from '../excelData';
import { findDecisionByQuery } from '../store';

const edmonton = truckFleetData.find(p => p.serviceProvider === 'Edmonton AB');
const largestGap = fleetSummary.largestGap;
const oldest = [...missingWorkOrders].sort((a, b) => b.caseAge - a.caseAge)[0];

const followUps = {
  "What's the fleet RFID coverage gap?": [
    { label: 'Largest Gap', query: `Show RFID gap for ${largestGap?.serviceProvider || 'top provider'}` },
    { label: 'Close Gap Cost', query: 'Estimate cost to close all RFID gaps' },
  ],
  'Which work orders pose the highest SLA risk?': [
    { label: 'Oldest Cases', query: 'List the 5 oldest open work orders' },
    { label: 'Dispatch Load', query: 'Which dispatch centers have the most unresolved work orders?' },
  ],
  'Give me an executive summary of fleet and work orders': [
    { label: 'Edmonton Dive', query: 'Deep dive into Edmonton AB fleet and work orders' },
    { label: 'Top Providers', query: 'Compare fleet size across the top 5 service providers' },
  ],
  'Which trucks in Edmonton AB are missing RFID readers?': [
    { label: 'Open WOs', query: 'Show overdue work orders for Edmonton AB' },
    { label: 'Dispatch Focus', query: 'Show all work orders assigned to dispatch D-05960' },
  ],
  'Show overdue work orders grouped by request type': [
    { label: 'Bulk Backlog', query: "What's the OBS-Bulk Pickup backlog?" },
    { label: 'Cart Repairs', query: 'How many cart repair work orders are outstanding?' },
  ],
  'Compare fleet size and RFID coverage across top providers': [
    { label: 'RFID Map', query: 'Map RFID reader coverage across all service providers' },
    { label: 'Gap Providers', query: 'Which providers have the largest RFID gaps?' },
  ],
};

const initialChips = {
  ceo: [
    { label: 'RFID Coverage', query: "What's the fleet RFID coverage gap?" },
    { label: 'SLA Risk', query: 'Which work orders pose the highest SLA risk?' },
    { label: 'Exec Summary', query: 'Give me an executive summary of fleet and work orders' },
  ],
  manager: [
    { label: 'Edmonton RFID', query: 'Which trucks in Edmonton AB are missing RFID readers?' },
    { label: 'WO by Type', query: 'Show overdue work orders grouped by request type' },
    { label: 'Top Providers', query: 'Compare fleet size and RFID coverage across top providers' },
  ],
  analyst: [
    { label: 'Oldest WOs', query: 'List the 5 oldest open work orders' },
    { label: 'Dispatch Load', query: 'Which dispatch centers have the most unresolved work orders?' },
    { label: 'Bulk Backlog', query: "What's the OBS-Bulk Pickup backlog?" },
  ],
};

const secondaryPool = {
  ceo: [
    { label: 'Gap Cost', query: 'Estimate cost to close all RFID gaps' },
    { label: 'Edmonton Dive', query: 'Deep dive into Edmonton AB fleet and work orders' },
    { label: 'Provider ROI', query: 'Show ROI impact of the top 5 service providers by fleet size' },
  ],
  manager: [
    { label: 'D-05960', query: 'Show all work orders assigned to dispatch D-05960' },
    { label: 'Cart Repairs', query: 'How many cart repair work orders are outstanding?' },
    { label: 'RFID Gaps', query: 'Which providers have the largest RFID gaps?' },
  ],
  analyst: [
    { label: 'Case Age', query: `Show the case age distribution across all ${woSummary.totalWOs} missing work orders` },
    { label: 'Geo Clusters', query: 'Identify geographic clusters in the work order addresses' },
    { label: 'Coverage Map', query: 'Map RFID reader coverage across all service providers' },
  ],
};

function buildResponse(query) {
  const q = query.toLowerCase();
  const gapProviders = [...truckFleetData].filter(p => p.trucksWithoutRFID > 0).sort((a, b) => b.trucksWithoutRFID - a.trucksWithoutRFID).slice(0, 5);
  const oldest5 = [...missingWorkOrders].sort((a, b) => b.caseAge - a.caseAge).slice(0, 5);

  if (q.includes('rfid coverage gap') || (q.includes('coverage') && q.includes('gap'))) {
    return `Network RFID coverage is ${fleetSummary.rfidCoverage}% across ${fleetSummary.totalTrucks} trucks. ${fleetSummary.trucksWithoutRFID} trucks are unequipped. Largest gap: ${largestGap?.serviceProvider} (${largestGap?.trucksWithoutRFID} trucks).`;
  }
  if (q.includes('estimate cost') || q.includes('close all rfid')) {
    return `Estimated cost to equip ${fleetSummary.trucksWithoutRFID} unequipped trucks: $${(fleetSummary.trucksWithoutRFID * 450).toLocaleString()} at $450/unit.`;
  }
  if (q.includes('sla risk') || (q.includes('work order') && q.includes('risk'))) {
    return `${woSummary.overdueWOs} of ${woSummary.totalWOs} open WOs exceed 700 days. Oldest: WO #${oldest?.woNumber} (${oldest?.caseAge} days, ${oldest?.requestType}). Avg age: ${woSummary.avgCaseAge} days.`;
  }
  if (q.includes('executive summary') || q.includes('overview')) {
    return `Fleet: ${fleetSummary.totalProviders} providers, ${fleetSummary.totalTrucks} trucks, ${fleetSummary.rfidCoverage}% RFID. WOs: ${woSummary.totalWOs} open (avg ${woSummary.avgCaseAge}d), ${woSummary.overdueWOs} overdue. Top type: ${woSummary.requestTypeBreakdown[0]?.type}.`;
  }
  if (q.includes('edmonton') && q.includes('rfid')) {
    const unequipped = edmonton?.trucks.filter(t => !t.rfid).slice(0, 8) || [];
    return `Edmonton AB: ${edmonton?.truckCount || 0} trucks, ${edmonton?.trucksWithoutRFID || 0} without RFID (${((edmonton?.trucksWithRFID / edmonton?.truckCount) * 100 || 0).toFixed(1)}% coverage). Sample unequipped: ${unequipped.map(t => t.name).join(', ') || 'n/a'}.`;
  }
  if (q.includes('edmonton')) {
    return `Edmonton AB deep dive: ${edmonton?.truckCount || 0} trucks (${edmonton?.trucksWithRFID || 0} RFID), ${woSummary.totalWOs} open WOs, top dispatch ${woSummary.dispatchBreakdown[0]?.dispatch} (${woSummary.dispatchBreakdown[0]?.count}).`;
  }
  if (q.includes('request type') || q.includes('grouped by')) {
    return woSummary.requestTypeBreakdown.map(r => `${r.type}: ${r.count} (avg ${r.avgAge}d)`).join(' · ');
  }
  if (q.includes('top 5') || q.includes('top providers') || q.includes('fleet size')) {
    return fleetSummary.top5Providers.map((p, i) => `${i + 1}. ${p.serviceProvider}: ${p.truckCount} trucks (${((p.trucksWithRFID / p.truckCount) * 100).toFixed(0)}% RFID)`).join(' | ');
  }
  if (q.includes('oldest')) {
    return oldest5.map((w, i) => `${i + 1}. WO #${w.woNumber} — ${w.requestType} — ${w.caseAge}d`).join(' | ');
  }
  if (q.includes('dispatch')) {
    if (q.includes('d-05960')) {
      const rows = missingWorkOrders.filter(w => w.dispatchNumber === 'D-05960');
      return `D-05960 has ${rows.length} open WOs: ${rows.map(w => `#${w.woNumber} (${w.requestType})`).join(', ')}.`;
    }
    return woSummary.dispatchBreakdown.map(d => `${d.dispatch}: ${d.count}`).join(' · ');
  }
  if (q.includes('bulk')) {
    const bulk = missingWorkOrders.filter(w => w.requestType === 'OBS-Bulk Pickup');
    return `OBS-Bulk Pickup backlog: ${bulk.length} orders. Avg age ${bulk.length ? Math.round(bulk.reduce((s, w) => s + w.caseAge, 0) / bulk.length) : 0} days.`;
  }
  if (q.includes('cart repair') || q.includes('repair')) {
    const repairs = missingWorkOrders.filter(w => w.requestType.includes('Repair'));
    return `${repairs.length} cart/RFID repair WOs outstanding. Avg age ${repairs.length ? Math.round(repairs.reduce((s, w) => s + w.caseAge, 0) / repairs.length) : 0} days.`;
  }
  if (q.includes('largest rfid gaps') || q.includes('providers have the largest')) {
    return gapProviders.map(p => `${p.serviceProvider}: ${p.trucksWithoutRFID} unequipped`).join(' · ');
  }
  if (q.includes('case age') || q.includes('distribution')) {
    return `0-500d: ${missingWorkOrders.filter(w => w.caseAge <= 500).length} · 501-700d: ${missingWorkOrders.filter(w => w.caseAge > 500 && w.caseAge <= 700).length} · 701-1000d: ${missingWorkOrders.filter(w => w.caseAge > 700 && w.caseAge <= 1000).length} · 1000d+: ${missingWorkOrders.filter(w => w.caseAge > 1000).length}`;
  }
  if (q.includes('geographic') || q.includes('cluster') || q.includes('hotspot')) {
    const dallas = missingWorkOrders.filter(w => /dallas|mockingbird|pulaski/i.test(w.address)).length;
    const edm = missingWorkOrders.filter(w => /edmonton/i.test(w.address)).length;
    return `WO hotspots — Dallas TX area: ${dallas}, Edmonton AB addresses: ${edm}, Other: ${woSummary.totalWOs - dallas - edm}.`;
  }
  if (q.includes('map rfid') || q.includes('coverage across')) {
    return `RFID coverage ${fleetSummary.rfidCoverage}% network-wide. ${gapProviders.length} providers have gaps. Top gap: ${largestGap?.serviceProvider} (${largestGap?.trucksWithoutRFID}).`;
  }
  if (q.includes('roi')) {
    return `Current RFID ROI ~$${(fleetSummary.trucksWithRFID * 2100).toLocaleString()}/yr. Gap opportunity ~$${(fleetSummary.trucksWithoutRFID * 2100).toLocaleString()}/yr at $2,100 per equipped truck.`;
  }

  const hit = findDecisionByQuery(query);
  if (hit) {
    return `Centered on ${hit.title}. Verdict: ${hit.verdict}. VaR: ${hit.valueAtRisk}. ${hit.whatsChanged[0] || ''}`;
  }
  return `Analyzed against ${fleetSummary.totalTrucks} fleet assets and ${woSummary.totalWOs} open WOs. Try RFID coverage, SLA risk, Edmonton, or dispatch queries.`;
}

export default function QueryBar({ onQuery, onHistoryClick, persona, history, setHistory, inputValue, setInputValue, sessions, activeSessionId, setActiveSessionId, createNewSession }) {
  let systemMsg = 'Intelligence Console Online. Query fleet, RFID coverage, and missing work orders.';
  if (persona === 'manager') {
    systemMsg = 'Provider Console Online. Monitoring fleet RFID gaps and dispatch load.';
  } else if (persona === 'analyst') {
    systemMsg = 'WO Analytics Console Online. Monitoring case aging and request-type backlogs.';
  }

  useEffect(() => {
    setHistory(prev => {
      if (prev.length > 0 && prev[prev.length - 1].text === systemMsg) return prev;
      return [...prev, { type: 'system', text: systemMsg }];
    });
  }, [systemMsg, setHistory, activeSessionId]);

  const [isProcessing, setIsProcessing] = useState(false);
  const [uiState, setUiState] = useState({});

  useEffect(() => {
    setUiState({});
  }, [persona]);

  const activeUi = uiState[activeSessionId] || {
    questionStack: [],
    mainChips: initialChips[persona] || initialChips.ceo
  };
  const questionStack = activeUi.questionStack;
  const mainChips = activeUi.mainChips;

  const setQuestionStack = (updater) => {
    setUiState(prev => {
      const current = prev[activeSessionId] || { questionStack: [], mainChips: initialChips[persona] || initialChips.ceo };
      const nextVal = typeof updater === 'function' ? updater(current.questionStack) : updater;
      return { ...prev, [activeSessionId]: { ...current, questionStack: nextVal } };
    });
  };

  const setMainChips = (updater) => {
    setUiState(prev => {
      const current = prev[activeSessionId] || { questionStack: [], mainChips: initialChips[persona] || initialChips.ceo };
      const nextVal = typeof updater === 'function' ? updater(current.mainChips) : updater;
      return { ...prev, [activeSessionId]: { ...current, mainChips: nextVal } };
    });
  };

  const [showSessions, setShowSessions] = useState(false);
  const historyRef = useRef(null);

  useEffect(() => {
    if (historyRef.current) {
      historyRef.current.scrollTop = historyRef.current.scrollHeight;
    }
  }, [history, isProcessing]);

  const getDemoChips = () => {
    if (questionStack.length > 0) {
      const currentQ = questionStack[questionStack.length - 1];
      if (followUps[currentQ]) return followUps[currentQ];
      return [];
    }
    return mainChips;
  };

  const handleChipClick = (query) => {
    setQuestionStack(prev => [...prev, query]);
    runQuery(query);

    setMainChips(prev => {
      const idx = prev.findIndex(c => c.query === query);
      if (idx !== -1) {
        const secChip = secondaryPool[persona]?.[idx];
        if (secChip && prev[idx].query !== secChip.query) {
          const newChips = [...prev];
          newChips[idx] = secChip;
          return newChips;
        }
      }
      return prev;
    });
  };

  const runQuery = (query) => {
    setInputValue('');
    setHistory(prev => [...prev, { type: 'user', text: query }]);
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      const response = buildResponse(query);
      setHistory(prev => [...prev, { type: 'system', text: response }]);
      if (onQuery) onQuery(query);
    }, 600);
  };

  const handleSubmit = (e) => {
    if (e.key === 'Enter' && inputValue.trim() !== '') {
      runQuery(inputValue.trim());
    }
  };

  const chips = getDemoChips();

  return (
    <div className="sidebar-query-container">
      <div className="sidebar-query-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2
          style={{ cursor: 'pointer', margin: 0, display: 'flex', alignItems: 'center' }}
          onClick={() => setShowSessions(!showSessions)}
        >
          Iris Chat
          <span style={{ fontSize: '10px', marginLeft: '6px', color: 'var(--text-muted)' }}>
            {showSessions ? '▲' : '▼'}
          </span>
        </h2>
        <button
          className="ti-btn"
          style={{ padding: '4px 8px', fontSize: '12px', background: 'var(--text-main)', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          onClick={createNewSession}
        >
          + New Chat
        </button>
      </div>

      {showSessions && sessions && (
        <div className="sessions-dropdown" style={{ background: 'var(--surface-elevated)', borderBottom: '1px solid var(--border)', maxHeight: '150px', overflowY: 'auto' }}>
          {sessions.map(s => (
            <div
              key={s.id}
              onClick={() => {
                setActiveSessionId(s.id);
                setShowSessions(false);
              }}
              style={{
                padding: '8px 12px',
                cursor: 'pointer',
                background: s.id === activeSessionId ? 'var(--surface-hover)' : 'transparent',
                color: 'var(--text-main)',
                fontWeight: s.id === activeSessionId ? '600' : 'normal',
                borderBottom: '1px solid var(--border)',
                fontSize: '13px'
              }}
            >
              {s.title}
            </div>
          ))}
        </div>
      )}

      <div className="sidebar-query-history" ref={historyRef}>
        {history.map((msg, i) => (
          <div
            key={i}
            className={`query-msg ${msg.type} ${msg.type === 'user' ? 'clickable' : ''}`}
            onClick={() => {
              if (msg.type === 'user' && !isProcessing) {
                setQuestionStack([msg.text]);
                if (onHistoryClick) onHistoryClick(msg.text);
              }
            }}
          >
            <span className="query-author">{msg.type === 'system' ? 'SYS' : 'USR'}</span>
            <span className="query-text">{msg.text}</span>
          </div>
        ))}
        {isProcessing && (
          <div className="query-msg system">
            <span className="query-author">SYS</span>
            <span className="query-text processing">Processing</span>
          </div>
        )}
      </div>

      <div className="sidebar-demo-chips">
        {questionStack.length > 0 && (
          <button className="demo-chip" onClick={() => setQuestionStack(prev => prev.slice(0, -1))}>
            ← Back
          </button>
        )}
        {chips.map((chip, idx) => (
          <button key={idx} className="demo-chip" onClick={() => handleChipClick(chip.query)}>{chip.label}</button>
        ))}
      </div>

      <div className="sidebar-query-input">
        <span className="prompt-char">{'>'}</span>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleSubmit}
          placeholder="Ask about fleet, RFID, or WOs..."
          autoComplete="off"
        />
      </div>
    </div>
  );
}
