import React, { useState, useCallback, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import CommandCenter from './components/CommandCenter';
import IntelligenceTable from './components/IntelligenceTable';
import InspectorPane from './components/InspectorPane';
import AgenticChat from './components/AgenticChat';
import AnalysisPanel from './components/AnalysisPanel';
import ReportsTable from './components/ReportsTable';
import Toast from './components/Toast';
import { ChatProvider, useChatContext } from './agentic';

function AppShell() {
  const { activeAnalysis, clearAnalysis, reports } = useChatContext();
  const [activeView, setActiveView] = useState('command');
  const [inspectedNodeId, setInspectedNodeId] = useState(null);
  const [queriedNodeIds, setQueriedNodeIds] = useState([]);
  const [resolvedNodes, setResolvedNodes] = useState([]);
  const [highlightId, setHighlightId] = useState(null);
  const [toast, setToast] = useState('');

  const showToast = useCallback((msg) => setToast(msg), []);
  const showAnalysis = Boolean(activeAnalysis);

  useEffect(() => {
    if (!highlightId) return undefined;
    const t = setTimeout(() => setHighlightId(null), 2200);
    return () => clearTimeout(t);
  }, [highlightId]);

  const openInspector = useCallback((id) => {
    setActiveView('table');
    setInspectedNodeId(id);
    setHighlightId(id);
  }, []);

  const closeInspector = useCallback(() => {
    setInspectedNodeId(null);
  }, []);

  const handleResolveNode = useCallback(
    (id) => {
      setResolvedNodes((prev) => (prev.includes(id) ? prev : [...prev, id]));
      showToast('Marked as resolved');
      setInspectedNodeId(null);
    },
    [showToast]
  );

  const closeAnalysis = useCallback(() => {
    clearAnalysis();
  }, [clearAnalysis]);

  const handleNav = useCallback((view) => {
    setActiveView(view);
  }, []);

  const goToCommand = useCallback(() => {
    setActiveView('command');
  }, []);

  const handleWidgetPinned = useCallback(() => {
    clearAnalysis();
    setActiveView('command');
  }, [clearAnalysis]);

  return (
    <div id="app">
      <Sidebar
        activeView={activeView}
        setActiveView={handleNav}
        reportCount={reports.length}
      />

      <div className="split-view-container">
        <aside className="sv-left iris-pane" aria-label="Vision AI assistant">
          <AgenticChat
            embedded
            activeView={activeView}
            onToast={showToast}
            onOpenAnalysis={goToCommand}
          />
        </aside>

        <main
          className={`sv-center ${showAnalysis && activeView === 'command' ? 'showing-analysis' : ''}`}
          aria-label={
            showAnalysis && activeView === 'command'
              ? 'Analysis detail'
              : activeView === 'command'
                ? 'Command Center'
                : activeView === 'reports'
                  ? 'Reports'
                  : 'Intelligence Directory'
          }
        >
          {activeView === 'reports' ? (
            <ReportsTable />
          ) : showAnalysis && activeView === 'command' ? (
            <AnalysisPanel
              analysis={activeAnalysis}
              onClose={closeAnalysis}
              onToast={showToast}
              onWidgetPinned={handleWidgetPinned}
              variant="center"
            />
          ) : activeView === 'command' ? (
            <CommandCenter
              isActive
              embedded
              onInvestigate={openInspector}
              resolvedNodes={resolvedNodes}
            />
          ) : (
            <IntelligenceTable
              activeNodeId={
                inspectedNodeId ||
                (queriedNodeIds.length > 0 ? queriedNodeIds[queriedNodeIds.length - 1] : null)
              }
              onNodeClick={setInspectedNodeId}
              queriedNodeIds={queriedNodeIds}
              highlightId={highlightId}
              onToast={showToast}
            />
          )}
        </main>
      </div>

      <InspectorPane
        activeNodeId={inspectedNodeId}
        onClose={closeInspector}
        onResolveNode={handleResolveNode}
        resolvedNodes={resolvedNodes}
      />

      <Toast message={toast} onDismiss={() => setToast('')} />
    </div>
  );
}

export default function App() {
  return (
    <ChatProvider>
      <AppShell />
    </ChatProvider>
  );
}
