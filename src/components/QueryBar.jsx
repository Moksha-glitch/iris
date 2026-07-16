import React, { useState, useRef, useEffect } from 'react';

const followUps = {
  // CEO
  'Why are pallets leaving Charlotte unscanned?': [
    { label: 'Manager Contact', query: 'Who is managing the Charlotte DC?' },
    { label: 'Financial Impact', query: 'Show financial impact of unscanned pallets' }
  ],
  'What is the status of Birmingham lifts?': [
    { label: 'Schedule Maintenance', query: 'Schedule maintenance for Birmingham lifts' },
    { label: 'Backup Lifts', query: 'Are there backup lifts available?' }
  ],
  'Why are Leland routes not ran?': [
    { label: 'Re-assign Routes', query: 'Re-assign Leland routes to available drivers' },
    { label: 'Cause of Delay', query: 'What is the delay cause for Leland?' }
  ],

  // Manager
  'Why is Charlotte approaching capacity?': [
    { label: 'Re-route Options', query: 'Where can we re-route Charlotte freight?' },
    { label: 'Duration of Issue', query: 'Is this a temporary capacity issue?' }
  ],
  'Analyze Asset loss spike in Opelika': [
    { label: 'Site B Procedures', query: 'What are the new procedures at Site B?' },
    { label: 'Revert Procedures', query: 'Revert to previous loading procedures' }
  ],
  'Lifts overdue for maintenance?': [
    { label: 'Maintenance Contractor', query: 'Who is the maintenance contractor?' },
    { label: 'Approve Overtime', query: 'Approve overtime for maintenance' }
  ],

  // Analyst
  'Why is Charlotte tracking late?': [
    { label: 'Alternate Routes', query: 'Show alternate routes for Charlotte' },
    { label: 'Notify Customers', query: 'Notify customers of delay' }
  ],
  'Analyze Leland route deviation': [
    { label: 'Update Model', query: 'Update routing model with road closure' },
    { label: 'Message Driver', query: 'Message driver for status update' }
  ],
  'Traffic blockages on I-95?': [
    { label: 'Clearance ETA', query: 'ETA for I-95 clearance?' },
    { label: 'Re-route Trucks', query: 'Re-route all active I-95 trucks' }
  ],

  // Secondary CEO
  'What is the global VaR exposure across all DCs?': [
    { label: 'View Breakdown', query: 'Show VaR breakdown by region' }
  ],
  'Identify underperforming Regional Managers': [
    { label: 'Message Manager', query: 'Send alert to Region 4 Manager' }
  ],
  'Are any critical shipments at risk of missing SLA?': [
    { label: 'Escalate Shipments', query: 'Escalate Tier-1 shipments' }
  ],

  // Secondary Manager
  'Show me staffing levels at Charlotte DC': [
    { label: 'Approve Overtime', query: 'Approve overtime for Charlotte DC' }
  ],
  'Any upcoming scheduled maintenance for Opelika?': [
    { label: 'View Schedule', query: 'Show maintenance schedule' }
  ],
  'Compare Asset loss between Site B and Site C': [
    { label: 'Audit Site B', query: 'Initiate audit for Site B' }
  ],

  // Secondary Analyst
  'Check weather impact on I-95 corridor': [
    { label: 'Weather Reroute', query: 'Calculate weather reroute' }
  ],
  'Are there any alternative models for Leland routing?': [
    { label: 'Deploy Model B', query: 'Deploy Model B for Leland' }
  ],
  'Review recent driver feedback logs': [
    { label: 'Flag Issues', query: 'Flag unmapped road work' }
  ]
};

const initialChips = {
  manager: [
    { label: 'Charlotte Capacity', query: 'Why is Charlotte approaching capacity?' },
    { label: 'Opelika Asset Loss', query: 'Analyze Asset loss spike in Opelika' },
    { label: 'Overdue Lifts', query: 'Lifts overdue for maintenance?' }
  ],
  analyst: [
    { label: 'Charlotte Delay', query: 'Why is Charlotte tracking late?' },
    { label: 'Leland Deviation', query: 'Analyze Leland route deviation' },
    { label: 'I-95 Traffic Blockages', query: 'Traffic blockages on I-95?' }
  ],
  ceo: [
    { label: 'Charlotte Scans', query: 'Why are pallets leaving Charlotte unscanned?' },
    { label: 'Birmingham Lifts', query: 'What is the status of Birmingham lifts?' },
    { label: 'Leland Routes', query: 'Why are Leland routes not ran?' }
  ]
};

const secondaryPool = {
  manager: [
    { label: 'Charlotte Staffing', query: 'Show me staffing levels at Charlotte DC' },
    { label: 'Opelika Maintenance', query: 'Any upcoming scheduled maintenance for Opelika?' },
    { label: 'Site Comparison', query: 'Compare Asset loss between Site B and Site C' }
  ],
  analyst: [
    { label: 'Weather Impact', query: 'Check weather impact on I-95 corridor' },
    { label: 'Alternate Routing', query: 'Are there any alternative models for Leland routing?' },
    { label: 'Driver Logs', query: 'Review recent driver feedback logs' }
  ],
  ceo: [
    { label: 'Global VaR', query: 'What is the global VaR exposure across all DCs?' },
    { label: 'Manager Performance', query: 'Identify underperforming Regional Managers' },
    { label: 'SLA Risks', query: 'Are any critical shipments at risk of missing SLA?' }
  ]
};

export default function QueryBar({ onQuery, onHistoryClick, persona, history, setHistory, inputValue, setInputValue, sessions, activeSessionId, setActiveSessionId, createNewSession }) {
  
  // Set the system message based on persona
  let systemMsg = 'Intelligence Console Online. Query the directory to traverse nodes.';
  if (persona === 'manager') {
    systemMsg = 'Regional Console Online. Monitoring DC throughput and asset tracking.';
  } else if (persona === 'analyst') {
    systemMsg = 'Tactical Execution Console Online. Monitoring real-time route telemetry.';
  }

  // Effect to append history if persona changes or on initial load
  useEffect(() => {
    setHistory(prev => {
      // Don't append if the last message is already this system message
      if (prev.length > 0 && prev[prev.length - 1].text === systemMsg) {
        return prev;
      }
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
      if (followUps[currentQ]) {
        return followUps[currentQ];
      }
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
        const secChip = secondaryPool[persona][idx];
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
      const lowerQ = query.toLowerCase();
      
      let response = '';

      if (lowerQ === 'who is managing the charlotte dc?') {
        response = 'Charlotte DC is managed by Sarah Jenkins. Contacting her now...';
      } else if (lowerQ === 'show financial impact of unscanned pallets') {
        response = 'Financial impact: $58.0K in unverified assets, potential $12.5K in SLA penalties.';
      } else if (lowerQ === 'schedule maintenance for birmingham lifts') {
        response = 'Maintenance scheduled for 0200 hours. Downtime estimated at 4 hours.';
      } else if (lowerQ === 'are there backup lifts available?') {
        response = 'Yes, 3 backup lifts have been activated from reserve.';
      } else if (lowerQ === 're-assign leland routes to available drivers') {
        response = 'Re-assigning 30 routes. ETA for new driver dispatch: 45 minutes.';
      } else if (lowerQ === 'what is the delay cause for leland?') {
        response = 'Delay caused by unexpected system outage at Leland dispatch center.';
      } else if (lowerQ === 'where can we re-route charlotte freight?') {
        response = 'Recommended alternate: Raleigh DC (currently at 62% capacity).';
      } else if (lowerQ === 'is this a temporary capacity issue?') {
        response = 'Yes, volume spike is due to seasonal overflow. Expected to normalize in 48 hours.';
      } else if (lowerQ === 'what are the new procedures at site b?') {
        response = 'Site B introduced "Fast-Load" bypassing secondary scans. Recommend immediate suspension.';
      } else if (lowerQ === 'revert to previous loading procedures') {
        response = 'Previous standard operating procedures reinstated. Site B notified.';
      } else if (lowerQ === 'who is the maintenance contractor?') {
        response = 'Contractor is Apex Industrial. SLA response time is 4 hours.';
      } else if (lowerQ === 'approve overtime for maintenance') {
        response = 'Overtime approved. Technicians dispatched for immediate service.';
      } else if (lowerQ === 'show alternate routes for charlotte') {
        response = 'Alternate route via US-1 calculated. Saves 45 minutes.';
      } else if (lowerQ === 'notify customers of delay') {
        response = 'Automated delay notifications sent to 14 affected customers.';
      } else if (lowerQ === 'update routing model with road closure') {
        response = 'Nav model updated. Subsequent drivers will bypass this closure.';
      } else if (lowerQ === 'message driver for status update') {
        response = 'Message sent to Driver 402. Awaiting response.';
      } else if (lowerQ === 'eta for i-95 clearance?') {
        response = 'Local authorities estimate 2 hours for full clearance.';
      } else if (lowerQ === 're-route all active i-95 trucks') {
        response = 'Re-routing 3 active trucks. Average delay mitigated to +15m.';
      }

      // Secondary level queries
      else if (lowerQ === 'what is the global var exposure across all dcs?') {
        response = 'Global Value at Risk currently stands at $1.2M. Primary drivers: Charlotte, Birmingham.';
      } else if (lowerQ === 'identify underperforming regional managers') {
        response = 'Analyzing KPIs... Region 4 (Southeast) is trailing 12% behind SLA targets.';
      } else if (lowerQ === 'are any critical shipments at risk of missing sla?') {
        response = 'Yes, 4 Tier-1 shipments via I-95 are at risk due to traffic blockages.';
      } else if (lowerQ === 'show me staffing levels at charlotte dc') {
        response = 'Charlotte DC is operating at 85% staffing capacity. 12 call-outs reported today.';
      } else if (lowerQ === 'any upcoming scheduled maintenance for opelika?') {
        response = 'Opelika has 4 lifts scheduled for preventative maintenance next Tuesday.';
      } else if (lowerQ === 'compare asset loss between site b and site c') {
        response = 'Site B: 8% loss rate (Trending Up). Site C: 2% loss rate (Stable). Site B requires audit.';
      } else if (lowerQ === 'check weather impact on i-95 corridor') {
        response = 'Severe thunderstorms detected along I-95 South. Expect 20-30% reduction in average speeds.';
      } else if (lowerQ === 'are there any alternative models for leland routing?') {
        response = 'Yes, Model B prioritizes toll roads and bypasses urban centers. Estimated time saved: 18 minutes.';
      } else if (lowerQ === 'review recent driver feedback logs') {
        response = 'Recent logs indicate frequent complaints about unmapped road work near Leland.';
      }
      
      // Secondary level follow ups
      else if (lowerQ === 'show var breakdown by region') {
        response = 'Region 1: $400K, Region 2: $150K, Region 3: $310K, Region 4: $340K.';
      } else if (lowerQ === 'send alert to region 4 manager') {
        response = 'Alert sent to Region 4 Manager regarding SLA targets.';
      } else if (lowerQ === 'escalate tier-1 shipments') {
        response = 'Tier-1 shipments escalated. Prioritizing routing.';
      } else if (lowerQ === 'approve overtime for charlotte dc') {
        response = 'Overtime approved to cover 12 call-outs at Charlotte DC.';
      } else if (lowerQ === 'show maintenance schedule') {
        response = 'Displaying maintenance schedule for Opelika...';
      } else if (lowerQ === 'initiate audit for site b') {
        response = 'Audit initiated for Site B unscanned loading procedures.';
      } else if (lowerQ === 'calculate weather reroute') {
        response = 'Calculating routes avoiding I-95 South thunderstorms...';
      } else if (lowerQ === 'deploy model b for leland') {
        response = 'Model B deployed. Drivers notified of new toll-road prioritization.';
      } else if (lowerQ === 'flag unmapped road work') {
        response = 'Unmapped road work near Leland flagged for map update.';
      }
      
      // Global / CEO Queries
      else if (lowerQ.includes('charlotte scans') || (lowerQ.includes('charlotte') && persona === 'ceo')) {
        response = 'Analyzing Charlotte Asset Tracking [LOC-Charlotte]. 1,648 pallets unscanned. Exposure: $58.0K.';
      } else if (lowerQ.includes('birmingham') || lowerQ.includes('lifts')) {
        response = 'Analyzing Birmingham DC Lifts [LOC-BirminghamDC]. WARNING: 2 Lifts overdue for maintenance. Recommend pulling tonight.';
      } else if (lowerQ.includes('leland routes') || lowerQ.includes('ran')) {
        response = 'Analyzing Leland Routes [LOC-Leland]. BLOCKED: 30 routes scheduled but not ran.';
      } 
      
      // Manager Queries
      else if (lowerQ.includes('charlotte capacity') || (lowerQ.includes('capacity') && persona === 'manager')) {
        response = 'Charlotte Inbound volume is up 14%. Re-routing incoming freight to alternate DC recommended.';
      } else if (lowerQ.includes('opelika') || lowerQ.includes('asset loss')) {
        response = 'Opelika asset loss up 8% WoW. Correlated with new un-scanned loading procedures at Site B.';
      } else if (lowerQ.includes('overdue lifts') || lowerQ.includes('maintenance')) {
        response = 'Lifts at Birmingham are 2 days past service window. Pulling tonight avoids unplanned downtime.';
      }

      // Analyst Queries
      else if (lowerQ.includes('charlotte delay') || (lowerQ.includes('delayed') && persona === 'analyst')) {
        response = 'Charlotte route is 159m late. Cause: Major traffic collision on I-95 South. Recommend dynamic re-routing.';
      } else if (lowerQ.includes('leland deviation') || lowerQ.includes('deviation')) {
        response = 'Driver departed from AI-optimized route in Leland. Driver feedback: "Road closure not reflected in nav". Model updated.';
      } else if (lowerQ.includes('i-95') || lowerQ.includes('traffic')) {
        response = 'I-95 South is completely blocked. 3 active routes impacted. Running re-optimization simulation...';
      }
      
      // Fallback
      else {
        response = 'Unable to verify query against specific signals. Centering view on related operational drivers.';
      }
      
      setHistory(prev => [...prev, { type: 'system', text: response }]);
      if (onQuery) onQuery(query);
    }, 800);
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
                // If it has follow-ups or if we just want to focus it in the menu
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
          placeholder="Ask Iris..."
          autoComplete="off"
        />
      </div>
    </div>
  );
}
