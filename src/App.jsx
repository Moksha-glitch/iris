import React, { useState, useCallback, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import CommandCenter from './components/CommandCenter';
import IntelligenceTable from './components/IntelligenceTable';
import InspectorPane from './components/InspectorPane';
import AgenticChat from './components/AgenticChat';
import DashboardPanel from './components/DashboardPanel';
import Toast from './components/Toast';
import { ChatProvider, useChatContext } from './agentic';
import { findDecisionByQuery } from './store';

function WidgetsAside({ open, onClose }) {
  const { dashboardWidgets } = useChatContext();
  const hasWidgets = dashboardWidgets.length > 0;
  const visible = hasWidgets && open;

  return (
    <aside
      className={`sv-right widgets-pane ${visible ? 'is-active' : 'is-inactive'} ${
        open && hasWidgets ? 'is-drawer-open' : ''
      }`}
      aria-label="Dashboard widgets"
      aria-hidden={!visible}
    >
      <DashboardPanel onClose={onClose} />
    </aside>
  );
}

function AppShell() {
  const { dashboardWidgets } = useChatContext();
  const [activeView, setActiveView] = useState('command');
  const [inspectedNodeId, setInspectedNodeId] = useState(null);
  const [queriedNodeIds, setQueriedNodeIds] = useState([]);
  const [resolvedNodes, setResolvedNodes] = useState([]);
  const [highlightId, setHighlightId] = useState(null);
  const [toast, setToast] = useState('');
  const [widgetsOpen, setWidgetsOpen] = useState(false);

  const showToast = useCallback((msg) => setToast(msg), []);

  // Open widgets bar when the first widget is pinned; close when empty
  useEffect(() => {
    if (dashboardWidgets.length === 0) {
      setWidgetsOpen(false);
      return;
    }
    if (dashboardWidgets.length === 1) {
      setWidgetsOpen(true);
    }
  }, [dashboardWidgets.length]);

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

  const handleChatNavigate = useCallback((query, { openDirectory = false } = {}) => {
    const hit = findDecisionByQuery(query);
    if (!hit) return;
    setQueriedNodeIds((prev) => (prev.includes(hit.id) ? prev : [...prev, hit.id]));
    setInspectedNodeId(null);
    setHighlightId(hit.id);
    if (openDirectory) setActiveView('table');
  }, []);

  const closeWidgets = useCallback(() => {
    setWidgetsOpen(false);
  }, []);

  const toggleWidgets = useCallback(() => {
    setWidgetsOpen((v) => !v);
  }, []);

  const handleWidgetPinned = useCallback(() => {
    setWidgetsOpen(true);
  }, []);

  return (
    <div id="app">
      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView}
        widgetCount={dashboardWidgets.length}
        widgetsOpen={widgetsOpen}
        onOpenWidgets={toggleWidgets}
      />

      <div className="split-view-container">
        <aside className="sv-left iris-pane" aria-label="IRIS assistant">
          <AgenticChat
            embedded
            activeView={activeView}
            onInsightNavigate={handleChatNavigate}
            onToast={showToast}
            onWidgetPinned={handleWidgetPinned}
          />
        </aside>

        <main
          className="sv-center"
          aria-label={activeView === 'command' ? 'Command Center' : 'Intelligence Directory'}
        >
          {activeView === 'command' ? (
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

        <WidgetsAside open={widgetsOpen} onClose={closeWidgets} />
      </div>

      {widgetsOpen && dashboardWidgets.length > 0 && (
        <div
          className="widgets-drawer-overlay"
          onClick={closeWidgets}
          aria-hidden="true"
        />
      )}

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
