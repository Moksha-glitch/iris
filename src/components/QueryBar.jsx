import React, { useState, useRef, useEffect } from 'react';

export default function QueryBar({ onQuery, persona, history, setHistory, inputValue, setInputValue }) {
  
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
  }, [persona, systemMsg, setHistory]);

  const [isProcessing, setIsProcessing] = useState(false);
  const historyRef = useRef(null);

  useEffect(() => {
    if (historyRef.current) {
      historyRef.current.scrollTop = historyRef.current.scrollHeight;
    }
  }, [history, isProcessing]);

  const getDemoChips = () => {
    if (persona === 'manager') {
      return [
        { label: 'Charlotte Capacity', query: 'Why is Charlotte approaching capacity?' },
        { label: 'Opelika Asset Loss', query: 'Analyze Asset loss spike in Opelika' },
        { label: 'Overdue Lifts', query: 'Lifts overdue for maintenance?' }
      ];
    }
    if (persona === 'analyst') {
      return [
        { label: 'Charlotte Delay', query: 'Why is Charlotte tracking late?' },
        { label: 'Leland Deviation', query: 'Analyze Leland route deviation' },
        { label: 'I-95 Traffic Blockages', query: 'Traffic blockages on I-95?' }
      ];
    }
    return [
      { label: 'Charlotte Scans', query: 'Why are pallets leaving Charlotte unscanned?' },
      { label: 'Birmingham Lifts', query: 'What is the status of Birmingham lifts?' },
      { label: 'Leland Routes', query: 'Why are Leland routes not ran?' }
    ];
  };

  const runQuery = (query) => {
    setInputValue('');
    setHistory(prev => [...prev, { type: 'user', text: query }]);
    setIsProcessing(true);
    
    setTimeout(() => {
      setIsProcessing(false);
      const lowerQ = query.toLowerCase();
      
      let response = '';
      
      // Global / CEO Queries
      if (lowerQ.includes('charlotte scans') || (lowerQ.includes('charlotte') && persona === 'ceo')) {
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
      <div className="sidebar-query-header">
        <h2>Iris Chat</h2>
      </div>
      
      <div className="sidebar-query-history" ref={historyRef}>
        {history.map((msg, i) => (
          <div 
            key={i} 
            className={`query-msg ${msg.type} ${msg.type === 'user' ? 'clickable' : ''}`}
            onClick={() => {
              if (msg.type === 'user' && !isProcessing) {
                runQuery(msg.text);
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
        {chips.map((chip, idx) => (
          <button key={idx} className="demo-chip" onClick={() => runQuery(chip.query)}>{chip.label}</button>
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
