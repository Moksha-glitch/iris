import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import {
  useChatContext,
  mockAgentResponse,
  getWorkflowSteps,
  getPredictiveQuestions,
  getPersonaConfig,
} from '../agentic';
import PredictiveQuestions from './PredictiveQuestions';
import StructuredAnswer from './StructuredAnswer';

export default function AgenticChat({
  embedded = false,
  onToast,
  onOpenAnalysis,
  askRef,
}) {
  const {
    activePersona,
    chatHistory,
    addMessage,
    updateLastMessage,
    trackQuery,
    usedQueries,
    sessions,
    activeSessionId,
    newChat,
    switchSession,
    deleteSession,
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
  const [historyOpen, setHistoryOpen] = useState(false);
  const [itemMenuId, setItemMenuId] = useState(null);
  const historyRef = useRef(null);
  const inputRef = useRef(null);
  const historyMenuRef = useRef(null);
  const historyBtnRef = useRef(null);

  const sortedSessions = useMemo(
    () =>
      [...sessions]
        .filter((s) => s.persona === activePersona)
        .sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0) || (b.createdAt || 0) - (a.createdAt || 0)),
    [sessions, activePersona]
  );

  useEffect(() => {
    if (historyRef.current) {
      historyRef.current.scrollTop = historyRef.current.scrollHeight;
    }
  }, [chatHistory, isProcessing]);

  useEffect(() => {
    if (!historyOpen && !itemMenuId) return undefined;
    const onDoc = (e) => {
      if (historyMenuRef.current && !historyMenuRef.current.contains(e.target)) {
        setHistoryOpen(false);
        setItemMenuId(null);
      }
    };
    const onKey = (e) => {
      if (e.key !== 'Escape') return;
      setHistoryOpen(false);
      setItemMenuId(null);
      if (historyOpen) historyBtnRef.current?.focus();
    };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [historyOpen, itemMenuId]);

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

  const handleNewChat = () => {
    if (isProcessing) return;
    setHistoryOpen(false);
    setItemMenuId(null);
    newChat();
    clearAnalysis();
    onToast?.('New chat');
    inputRef.current?.focus();
  };

  const handleSwitchSession = (id) => {
    if (isProcessing || id === activeSessionId) {
      setHistoryOpen(false);
      return;
    }
    switchSession(id);
    setHistoryOpen(false);
    setItemMenuId(null);
    onOpenAnalysis?.();
    inputRef.current?.focus();
  };

  const handleDeleteSession = (id) => {
    deleteSession(id);
    setItemMenuId(null);
    onToast?.('Chat deleted');
  };

  return (
    <div className={`agentic-chat-layout ${embedded ? 'embedded' : ''}`}>
      <div className="ac-chat-panel">
        <header className="ac-header">
          <div className="ac-brand">
            <div className="ac-brand-text">
              <span className="ac-logo">Vision AI</span>
              <span className="ac-subtitle">Ask anything about the network</span>
            </div>
          </div>

          <div className="ac-toolbar">
            <button
              type="button"
              className="ac-toolbar-btn"
              onClick={handleNewChat}
              disabled={isProcessing}
              aria-label="New chat"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12h14" />
              </svg>
              New chat
            </button>

            <div className="ac-history-menu" ref={historyMenuRef}>
              <button
                ref={historyBtnRef}
                type="button"
                className={`ac-toolbar-btn ${historyOpen ? 'active' : ''}`}
                onClick={() => {
                  setItemMenuId(null);
                  setHistoryOpen((v) => !v);
                }}
                aria-expanded={historyOpen}
                aria-controls="ac-history-panel"
                aria-label="Chat history"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 7v5l3 2" />
                </svg>
                History
                <span className="ac-history-count">{sortedSessions.length}</span>
              </button>
              {historyOpen && (
                <div id="ac-history-panel" className="ac-history-dropdown" role="menu" aria-label="All chats">
                  <div className="ac-info-heading">Your chats</div>
                  {sortedSessions.length === 0 ? (
                    <p className="ac-history-empty">No chats yet</p>
                  ) : (
                    sortedSessions.map((session) => {
                      const persona = getPersonaConfig(session.persona);
                      const active = session.id === activeSessionId;
                      return (
                        <div
                          key={session.id}
                          className={`ac-history-row ${active ? 'active' : ''} ${
                            itemMenuId === session.id ? 'menu-open' : ''
                          }`}
                        >
                          <button
                            type="button"
                            role="menuitem"
                            className="ac-history-item"
                            onClick={() => handleSwitchSession(session.id)}
                            title={session.title}
                            disabled={isProcessing}
                          >
                            <span
                              className="ac-history-item-icon"
                              style={{ color: persona.color }}
                              aria-hidden
                            >
                              {persona.icon}
                            </span>
                            <span className="ac-history-item-copy">
                              <span className="ac-history-item-title">{session.title}</span>
                              <span className="ac-history-item-sub">{persona.shortLabel}</span>
                            </span>
                          </button>
                          <button
                            type="button"
                            className={`ac-history-more ${itemMenuId === session.id ? 'active' : ''}`}
                            aria-label={`More options for ${session.title}`}
                            aria-haspopup="menu"
                            aria-expanded={itemMenuId === session.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              setItemMenuId((id) => (id === session.id ? null : session.id));
                            }}
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                              <circle cx="12" cy="5" r="1.7" />
                              <circle cx="12" cy="12" r="1.7" />
                              <circle cx="12" cy="19" r="1.7" />
                            </svg>
                          </button>
                          {itemMenuId === session.id && (
                            <div className="ac-history-flyout" role="menu">
                              <button
                                type="button"
                                role="menuitem"
                                className="ac-history-flyout-item danger"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteSession(session.id);
                                }}
                              >
                                Delete chat
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          </div>
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
              <h2>How can I help?</h2>
              <p>
                Ask as {currentPersona.shortLabel}. Answers summarize here; full analysis opens
                beside you.
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
                        Thinking…
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}

          {isProcessing && chatHistory[chatHistory.length - 1]?.text === '' && (
            <div className="ac-typing" aria-live="polite">
              Thinking…
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
