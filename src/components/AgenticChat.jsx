import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import {
  useChatContext,
  mockAgentResponse,
  getWorkflowSteps,
  getPredictiveQuestions,
  getPersonaConfig,
  PERSONAS,
  reportContext,
} from '../agentic';
import PredictiveQuestions from './PredictiveQuestions';
import StructuredAnswer from './StructuredAnswer';

const { fleetSummary, woSummary } = reportContext;

const VIEW_HINTS = {
  command: 'Summary in chat · full Table / Chart / Analysis in detail',
  table: 'Directory stays available from the sidebar',
  reports: 'Tabular reports pinned from analysis insights',
};

const INFO_BITS = [
  { label: 'Trucks', value: () => fleetSummary.totalTrucks.toLocaleString() },
  { label: 'Providers', value: () => String(fleetSummary.totalProviders) },
  { label: 'Open WOs', value: () => String(woSummary.totalWOs) },
  { label: 'RFID', value: () => `${fleetSummary.rfidCoverage}%` },
  { label: 'Unequipped', value: () => String(fleetSummary.trucksWithoutRFID) },
  { label: 'Overdue WOs', value: () => String(woSummary.overdueWOs) },
];

export default function AgenticChat({
  embedded = false,
  activeView = 'command',
  onToast,
  onOpenAnalysis,
  askRef,
}) {
  const {
    activePersona,
    setPersona,
    chatHistory,
    addMessage,
    updateLastMessage,
    trackQuery,
    usedQueries,
    clearChat,
    setAnalysis,
    updateAnalysis,
    clearAnalysis,
    focusClaim,
    activeAnalysis,
    analysisHistory,
    upsertAnalysisHistory,
    scrollToAnalysis,
  } = useChatContext();

  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const historyRef = useRef(null);
  const inputRef = useRef(null);
  const infoRef = useRef(null);
  const infoBtnRef = useRef(null);

  const questionHistory = useMemo(
    () => analysisHistory.filter((a) => a.query && !a.isStreaming),
    [analysisHistory]
  );

  useEffect(() => {
    if (historyRef.current) {
      historyRef.current.scrollTop = historyRef.current.scrollHeight;
    }
  }, [chatHistory, isProcessing]);

  useEffect(() => {
    if (!infoOpen) return undefined;
    const onDoc = (e) => {
      if (infoRef.current && !infoRef.current.contains(e.target)) setInfoOpen(false);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setInfoOpen(false);
        infoBtnRef.current?.focus();
      }
    };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [infoOpen]);

  const predictiveQs = getPredictiveQuestions(activePersona, usedQueries);
  const currentPersona = getPersonaConfig(activePersona);

  const openHistoryItem = useCallback(
    (analysisId) => {
      if (!analysisId) return;
      const item = analysisHistory.find((a) => a.id === analysisId);
      if (item) {
        onOpenAnalysis?.();
        setAnalysis(item);
        scrollToAnalysis(analysisId);
      }
    },
    [analysisHistory, setAnalysis, scrollToAnalysis, onOpenAnalysis]
  );

  const runQuery = useCallback(
    async (query) => {
      const trimmed = query.trim();
      if (!trimmed || isProcessing) return;

      const analysisId = `analysis-${Date.now()}`;

      setInputValue('');
      setConfirmClear(false);
      onOpenAnalysis?.();
      trackQuery(trimmed);
      addMessage({
        type: 'user',
        text: trimmed,
        analysisId,
        timestamp: Date.now(),
      });

      const steps = getWorkflowSteps();

      const draft = {
        id: analysisId,
        query: trimmed,
        persona: activePersona,
        workflowSteps: steps,
        summary: '',
        detail: '',
        sections: null,
        sources: [],
        insights: [],
        follows: [],
        isStreaming: true,
        timestamp: Date.now(),
      };

      setAnalysis(draft);
      upsertAnalysisHistory(draft);

      addMessage({
        type: 'agent',
        text: '',
        sources: [],
        analysisId,
        isStreaming: true,
        timestamp: Date.now(),
      });

      setIsProcessing(true);

      try {
        const result = await mockAgentResponse(trimmed, activePersona, (stepIdx, status) => {
          const workflowSteps = steps.map((s, i) => ({
            ...s,
            status: i < stepIdx ? 'done' : i === stepIdx ? status : 'pending',
          }));
          updateAnalysis({ workflowSteps });
          upsertAnalysisHistory({ id: analysisId, workflowSteps });
        });

        const doneSteps = steps.map((s) => ({ ...s, status: 'done' }));
        const completed = {
          id: analysisId,
          query: trimmed,
          persona: activePersona,
          workflowSteps: doneSteps,
          summary: result.summary,
          detail: result.detail,
          sections: result.sections || null,
          intent: result.intent || null,
          sources: result.sources || [],
          insights: result.actionableInsights || [],
          follows: result.follows || result.sections?.follows || [],
          isStreaming: false,
          timestamp: Date.now(),
        };

        updateLastMessage({
          text: result.summary || result.text,
          sections: result.sections || null,
          sources: result.sources || [],
          analysisId,
          isStreaming: false,
        });

        setAnalysis(completed);
        upsertAnalysisHistory(completed);
        scrollToAnalysis(analysisId);
      } catch {
        updateLastMessage({
          text: 'Something went wrong. Try again in a moment.',
          analysisId,
          isStreaming: false,
        });
        const failed = {
          id: analysisId,
          workflowSteps: steps.map((s) => ({ ...s, status: 'done' })),
          detail: 'Analysis failed. Retry the question.',
          isStreaming: false,
        };
        updateAnalysis(failed);
        upsertAnalysisHistory({ id: analysisId, ...failed });
      }

      setIsProcessing(false);
      inputRef.current?.focus();
    },
    [
      isProcessing,
      activePersona,
      addMessage,
      updateLastMessage,
      trackQuery,
      setAnalysis,
      updateAnalysis,
      upsertAnalysisHistory,
      scrollToAnalysis,
      onOpenAnalysis,
    ]
  );

  useEffect(() => {
    if (!askRef) return undefined;
    askRef.current = runQuery;
    return () => {
      if (askRef.current === runQuery) askRef.current = null;
    };
  }, [askRef, runQuery]);

  const handleClear = () => {
    if (!confirmClear) {
      setConfirmClear(true);
      return;
    }
    clearChat();
    clearAnalysis();
    setConfirmClear(false);
    onToast?.('Conversation cleared');
    inputRef.current?.focus();
  };

  return (
    <div className={`agentic-chat-layout ${embedded ? 'embedded' : ''}`}>
      <div className="ac-chat-panel">
        <header className="ac-header">
          <div className="ac-brand">
            <div className="ac-brand-text">
              <span className="ac-logo">Vision AI</span>
              <span className="ac-subtitle">Summary in chat · Detail in dashboard</span>
            </div>
            <div className="ac-header-actions">
              <div className="ac-info-menu" ref={infoRef}>
                <button
                  ref={infoBtnRef}
                  type="button"
                  className={`ac-icon-btn ${infoOpen ? 'active' : ''}`}
                  onClick={() => setInfoOpen((v) => !v)}
                  aria-expanded={infoOpen}
                  aria-controls="ac-info-panel"
                  aria-label="Key metrics and context"
                >
                  Info ▾
                </button>
                {infoOpen && (
                  <div id="ac-info-panel" className="ac-info-dropdown" role="region" aria-label="Context">
                    <div className="ac-info-section">
                      <div className="ac-info-heading">Persona</div>
                      <div className="ac-info-persona">
                        <span aria-hidden>{currentPersona.icon}</span>
                        <div>
                          <strong>{currentPersona.shortLabel}</strong>
                          <p>{currentPersona.desc}</p>
                        </div>
                      </div>
                    </div>
                    <div className="ac-info-section">
                      <div className="ac-info-heading">Live snapshot</div>
                      <ul className="ac-info-list">
                        {INFO_BITS.map((bit) => (
                          <li key={bit.label}>
                            <span>{bit.label}</span>
                            <strong>{bit.value()}</strong>
                          </li>
                        ))}
                      </ul>
                    </div>
                    {embedded && (
                      <div className="ac-info-section">
                        <div className="ac-info-heading">This view</div>
                        <p className="ac-info-hint">
                          {VIEW_HINTS[activeView] || VIEW_HINTS.command}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="ac-persona-selector" role="group" aria-label="Analysis persona">
            {Object.entries(PERSONAS).map(([key, cfg]) => {
              const selected = activePersona === key;
              return (
                <button
                  key={key}
                  type="button"
                  aria-pressed={selected}
                  className={`ac-persona-btn ${selected ? 'active' : ''}`}
                  disabled={isProcessing}
                  onClick={() => {
                    if (key !== activePersona) {
                      setPersona(key);
                      onToast?.(`Switched to ${cfg.shortLabel}`);
                    }
                  }}
                  style={
                    selected
                      ? { borderColor: cfg.color, color: cfg.color, background: `${cfg.color}0F` }
                      : undefined
                  }
                  title={cfg.desc}
                >
                  <span className="ac-persona-icon" aria-hidden>
                    {cfg.icon}
                  </span>
                  <span className="ac-persona-label">{cfg.shortLabel}</span>
                </button>
              );
            })}
          </div>

          {(questionHistory.length > 0 || chatHistory.length > 0) && (
            <div className="ac-chat-history" aria-label="Chat history">
              <div className="ac-chat-history-head">
                <div className="ac-chat-history-label">History</div>
                {chatHistory.length > 0 && (
                  <button
                    type="button"
                    className={`ac-icon-btn ${confirmClear ? 'danger' : ''}`}
                    onClick={handleClear}
                    onBlur={() => setConfirmClear(false)}
                    aria-label={confirmClear ? 'Confirm clear conversation' : 'Clear conversation'}
                  >
                    {confirmClear ? 'Confirm?' : 'Clear'}
                  </button>
                )}
              </div>
              {questionHistory.length > 0 && (
                <div className="ac-chat-history-list">
                  {questionHistory.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className={`ac-history-chip ${
                        activeAnalysis?.id === item.id ? 'active' : ''
                      }`}
                      onClick={() => openHistoryItem(item.id)}
                      title={item.query}
                    >
                      {item.query}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </header>

        <div
          className={`ac-messages ${chatHistory.length === 0 ? 'is-empty' : ''}`}
          ref={historyRef}
          aria-live="polite"
        >
          {chatHistory.length === 0 && (
            <div className={`ac-welcome ${embedded ? 'compact' : ''}`}>
              <div className="ac-welcome-icon" aria-hidden>
                {currentPersona.icon}
              </div>
              <h2>Service Provider ops desk</h2>
              <p>
                Ask a question for a short summary. Detail replaces Command Center. Use history to
                jump back; pin insights to dashboard or reports.
              </p>
            </div>
          )}

          {chatHistory.map((msg) => (
            <div key={msg.id} className={`ac-msg ${msg.type}`}>
              {msg.type === 'user' && (
                <div className="ac-msg-user">
                  <div className="ac-msg-avatar user-avatar" aria-hidden>
                    You
                  </div>
                  <button
                    type="button"
                    className={`ac-msg-bubble user-bubble is-history ${
                      activeAnalysis?.id === msg.analysisId ? 'active' : ''
                    }`}
                    onClick={() => msg.analysisId && openHistoryItem(msg.analysisId)}
                    title="Jump to this question in details"
                  >
                    {msg.text}
                  </button>
                </div>
              )}

              {msg.type === 'agent' && (
                <div className="ac-msg-agent">
                  <div
                    className="ac-msg-avatar agent-avatar"
                    style={{ borderColor: currentPersona.color }}
                    aria-hidden
                  >
                    {currentPersona.icon}
                  </div>
                  <div className="ac-msg-content">
                    {msg.text || msg.sections ? (
                      <div className="ac-msg-text">
                        <StructuredAnswer
                          sections={
                            msg.sections ||
                            analysisHistory.find((a) => a.id === msg.analysisId)?.sections || {
                              summary: msg.text,
                              follows:
                                analysisHistory.find((a) => a.id === msg.analysisId)?.follows ||
                                [],
                            }
                          }
                          sources={
                            msg.sources ||
                            analysisHistory.find((a) => a.id === msg.analysisId)?.sources ||
                            activeAnalysis?.sources ||
                            []
                          }
                          mode="chat"
                          compact
                          onAsk={runQuery}
                          onTraverse={(claim) => {
                            if (msg.analysisId) openHistoryItem(msg.analysisId);
                            else if (!activeAnalysis) {
                              onToast?.('Ask a question first to open details');
                              return;
                            }
                            focusClaim(claim);
                          }}
                        />
                      </div>
                    ) : (
                      <div className="ac-msg-text ac-msg-pending">
                        Working the Service Provider lens… detail is opening in the dashboard.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}

          {isProcessing && chatHistory[chatHistory.length - 1]?.text === '' && (
            <div className="ac-typing" aria-live="polite">
              Streaming summary · detail pane is live
            </div>
          )}
        </div>

        <div className="ac-input-area">
          <PredictiveQuestions
            questions={predictiveQs}
            onSelect={runQuery}
            disabled={isProcessing}
          />
          <div className="ac-input-row">
            <input
              ref={inputRef}
              type="text"
              className="ac-input"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && inputValue.trim()) runQuery(inputValue);
              }}
              placeholder={`Ask as ${currentPersona.shortLabel}…`}
              disabled={isProcessing}
              autoComplete="off"
              aria-label="Ask Vision AI"
            />
            <button
              type="button"
              className="ac-send-btn"
              onClick={() => runQuery(inputValue)}
              disabled={isProcessing || !inputValue.trim()}
              style={{ background: currentPersona.color }}
              aria-label="Send message"
            >
              {isProcessing ? (
                <div className="ac-send-spinner" />
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
