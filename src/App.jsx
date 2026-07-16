import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import CommandCenter from './components/CommandCenter';
import IntelligenceTable from './components/IntelligenceTable';
import InspectorPane from './components/InspectorPane';
import QueryBar from './components/QueryBar';

export default function App() {
  const [activeView, setActiveView] = useState('command'); // 'command' or 'table'
  const [inspectedNodeId, setInspectedNodeId] = useState(null);
  const [sessions, setSessions] = useState([
    { id: Date.now().toString(), title: 'New Conversation', history: [], queriedNodeIds: [] }
  ]);
  const [activeSessionId, setActiveSessionId] = useState(sessions[0].id);
  const activeSession = sessions.find(s => s.id === activeSessionId) || sessions[0];
  
  const [persona, setPersona] = useState('ceo'); // 'ceo', 'manager', 'analyst'
  const [resolvedNodes, setResolvedNodes] = useState([]);
  const [chatInputValue, setChatInputValue] = useState('');

  const createNewSession = () => {
    const newId = Date.now().toString();
    setSessions(prev => [...prev, { id: newId, title: 'New Conversation', history: [], queriedNodeIds: [] }]);
    setActiveSessionId(newId);
  };

  const setChatHistory = React.useCallback((updater) => {
    setSessions(prev => prev.map(s => {
      if (s.id === activeSessionId) {
        const newHistory = typeof updater === 'function' ? updater(s.history) : updater;
        let newTitle = s.title;
        if (s.title === 'New Conversation' && newHistory.length > 0) {
          const firstUserMsg = newHistory.find(m => m.type === 'user');
          if (firstUserMsg) {
             newTitle = firstUserMsg.text.length > 30 ? firstUserMsg.text.substring(0, 30) + '...' : firstUserMsg.text;
          }
        }
        return { ...s, history: newHistory, title: newTitle };
      }
      return s;
    }));
  }, [activeSessionId]);
  
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

  const getInsightId = (query) => {
    const lowerQ = query.toLowerCase();
    if (lowerQ.includes('birmingham')) return 'LOC-BirminghamDC';
    if (lowerQ.includes('charlotte')) return 'LOC-Charlotte';
    if (lowerQ.includes('leland')) return 'LOC-Leland';
    if (lowerQ.includes('opelika')) return 'LOC-Opelika';
    if (lowerQ.includes('pollocksville')) return 'LOC-Pollocksville';
    if (lowerQ.includes('unassigned')) return 'LOC-Unassigned';
    return null;
  };

  const handleQuery = (query) => {
    // Auto-focus table row based on query
    const newId = getInsightId(query);
    
    if (newId) {
      setSessions(prev => prev.map(s => {
        if (s.id === activeSessionId) {
          if (s.queriedNodeIds.includes(newId)) return s;
          return { ...s, queriedNodeIds: [...s.queriedNodeIds, newId] };
        }
        return s;
      }));
      setTimeout(() => {
        const el = document.getElementById(`chat-insight-${newId}`);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  const handleHistoryClick = (query) => {
    const newId = getInsightId(query);
    if (newId) {
      const el = document.getElementById(`chat-insight-${newId}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
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
              onHistoryClick={handleHistoryClick}
              persona={persona} 
              history={activeSession.history} 
              setHistory={setChatHistory} 
              inputValue={chatInputValue} 
              setInputValue={setChatInputValue}
              sessions={sessions}
              activeSessionId={activeSessionId}
              setActiveSessionId={setActiveSessionId}
              createNewSession={createNewSession}
            />
          </div>
          <div className="sv-right">
            <IntelligenceTable 
              activeNodeId={inspectedNodeId || (activeSession.queriedNodeIds.length > 0 ? activeSession.queriedNodeIds[activeSession.queriedNodeIds.length - 1] : null)} 
              onNodeClick={setInspectedNodeId} 
              queriedNodeIds={activeSession.queriedNodeIds}
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
