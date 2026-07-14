import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import CommandCenter from './components/CommandCenter';
import IntelligenceTable from './components/IntelligenceTable';
import InspectorPane from './components/InspectorPane';
import QueryBar from './components/QueryBar';

export default function App() {
  const [activeView, setActiveView] = useState('command'); // 'command' or 'table'
  const [inspectedNodeId, setInspectedNodeId] = useState(null);
  const [queriedNodeIds, setQueriedNodeIds] = useState([]);
  const [persona, setPersona] = useState('ceo'); // 'ceo', 'manager', 'analyst'
  const [resolvedNodes, setResolvedNodes] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const [chatInputValue, setChatInputValue] = useState('');
  
  const openInspector = (id) => {
    setActiveView('table');
    setInspectedNodeId(id);
  };
  
  const closeInspector = () => {
    setInspectedNodeId(null);
  };

  const handleResolveNode = (id) => {
    if (!resolvedNodes.includes(id)) {
      setResolvedNodes(prev => [...prev, id]);
    }
  };

  const handleQuery = (query) => {
    const lowerQ = query.toLowerCase();
    
    // Auto-focus table row based on query
    let newId = null;
    if (lowerQ.includes('birmingham')) {
      newId = 'LOC-BirminghamDC';
    } else if (lowerQ.includes('charlotte')) {
      newId = 'LOC-Charlotte';
    } else if (lowerQ.includes('leland')) {
      newId = 'LOC-Leland';
    } else if (lowerQ.includes('opelika')) {
      newId = 'LOC-Opelika';
    } else if (lowerQ.includes('pollocksville')) {
      newId = 'LOC-Pollocksville';
    } else if (lowerQ.includes('unassigned')) {
      newId = 'LOC-Unassigned';
    }
    
    if (newId) {
      setQueriedNodeIds(prev => {
        if (prev.includes(newId)) {
          return prev;
        }
        return [...prev, newId];
      });
      setTimeout(() => {
        const el = document.getElementById(`chat-insight-${newId}`);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  return (
    <div id="app">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      
      {/* Split View for Tabular Dashboard */}
      {activeView === 'table' && (
        <div className="split-view-container">
          <div className="sv-left">
            <QueryBar 
              onQuery={handleQuery} 
              persona={persona} 
              history={chatHistory} 
              setHistory={setChatHistory} 
              inputValue={chatInputValue} 
              setInputValue={setChatInputValue} 
            />
          </div>
          <div className="sv-right">
            <IntelligenceTable 
              activeNodeId={inspectedNodeId || (queriedNodeIds.length > 0 ? queriedNodeIds[queriedNodeIds.length - 1] : null)} 
              onNodeClick={setInspectedNodeId} 
              queriedNodeIds={queriedNodeIds}
            />
          </div>
        </div>
      )}
      
      {/* Views */}
      <CommandCenter 
        isActive={activeView === 'command'} 
        onInvestigate={openInspector} 
        persona={persona}
        setPersona={setPersona}
        resolvedNodes={resolvedNodes}
      />
      
      <InspectorPane 
        activeNodeId={inspectedNodeId} 
        onClose={closeInspector} 
        onResolveNode={handleResolveNode}
        resolvedNodes={resolvedNodes}
      />
      
    </div>
  );
}
