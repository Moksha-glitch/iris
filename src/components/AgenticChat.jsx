import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  useChatContext,
  mockAgentResponse,
  getWorkflowSteps,
  getPredictiveQuestions,
  getPersonaConfig,
  PERSONAS,
  reportContext,
} from '../agentic';
import WorkflowTrace from './WorkflowTrace';
import PredictiveQuestions from './PredictiveQuestions';
import ActionableInsight from './ActionableInsight';
import FormattedReply from './FormattedReply';

const { fleetSummary, woSummary } = reportContext;

const VIEW_HINTS = {
  command: 'Answers update the Command Center lens',
  table: 'Matching providers open in the Directory',
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
  onInsightNavigate,
  onToast,
  onWidgetPinned,
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
  } = useChatContext();

  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const historyRef = useRef(null);
  const inputRef = useRef(null);
  const infoRef = useRef(null);
  const infoBtnRef = useRef(null);

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

  const runQuery = useCallback(
    async (query) => {
      const trimmed = query.trim();
      if (!trimmed || isProcessing) return;

      setInputValue('');
      setConfirmClear(false);
      trackQuery(trimmed);
      addMessage({ type: 'user', text: trimmed, timestamp: Date.now() });

      const steps = getWorkflowSteps();
      addMessage({
        type: 'agent',
        text: '',
        workflowSteps: steps,
        insights: [],
        isStreaming: true,
        timestamp: Date.now(),
      });

      setIsProcessing(true);

      try {
        const result = await mockAgentResponse(trimmed, activePersona, (stepIdx, status) => {
          updateLastMessage({
            workflowSteps: steps.map((s, i) => ({
              ...s,
              status: i < stepIdx ? 'done' : i === stepIdx ? status : 'pending',
            })),
          });
        });

        updateLastMessage({
          text: result.text,
          insights: result.actionableInsights || [],
          workflowSteps: steps.map((s) => ({ ...s, status: 'done' })),
          isStreaming: false,
        });
        // Update Directory "From IRIS" trail — do not open inspector popup
        onInsightNavigate?.(trimmed);
      } catch {
        updateLastMessage({
          text: 'Something went wrong. Try again in a moment.',
          workflowSteps: steps.map((s) => ({ ...s, status: 'done' })),
          isStreaming: false,
        });
      }

      setIsProcessing(false);
      inputRef.current?.focus();
    },
    [isProcessing, activePersona, addMessage, updateLastMessage, trackQuery, onInsightNavigate]
  );

  const handleExploreInsight = useCallback(
    (insight) => {
      if (!insight.expandedText || isProcessing) return;
      addMessage({
        type: 'user',
        text: `Tell me more about: ${insight.title}`,
        timestamp: Date.now(),
      });
      addMessage({
        type: 'agent',
        text: insight.expandedText,
        insights: [],
        workflowSteps: [],
        isStreaming: false,
        timestamp: Date.now(),
      });
    },
    [addMessage, isProcessing]
  );

  const handleClear = () => {
    if (!confirmClear) {
      setConfirmClear(true);
      return;
    }
    clearChat();
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
              <span className="ac-logo">IRIS</span>
              <span className="ac-subtitle">Ask · Analyze · Act</span>
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
        </header>

        <div className="ac-messages" ref={historyRef} aria-live="polite">
          {chatHistory.length === 0 && (
            <div className={`ac-welcome ${embedded ? 'compact' : ''}`}>
              <div className="ac-welcome-icon" aria-hidden>
                {currentPersona.icon}
              </div>
              <h2>What do you need to decide?</h2>
              <p>Pick a suggested question, or type your own. Pin insights to open Widgets.</p>
            </div>
          )}

          {chatHistory.map((msg) => (
            <div key={msg.id} className={`ac-msg ${msg.type}`}>
              {msg.type === 'user' && (
                <div className="ac-msg-user">
                  <div className="ac-msg-avatar user-avatar" aria-hidden>
                    You
                  </div>
                  <div className="ac-msg-bubble user-bubble">{msg.text}</div>
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
                    {msg.workflowSteps?.length > 0 && (
                      <WorkflowTrace
                        steps={msg.workflowSteps}
                        personaLabel={currentPersona.shortLabel}
                      />
                    )}
                    {msg.text && (
                      <div className="ac-msg-text">
                        <FormattedReply
                          text={msg.text}
                          onRedirect={(label) =>
                            onInsightNavigate?.(label, { openDirectory: true })
                          }
                        />
                      </div>
                    )}
                    {msg.insights?.length > 0 && (
                      <div className="ac-insights-container">
                        <div className="ac-insights-label">Actionable insights</div>
                        {msg.insights.map((insight) => (
                          <ActionableInsight
                            key={insight.id}
                            insight={insight}
                            onExplore={handleExploreInsight}
                            onToast={onToast}
                            onPinned={onWidgetPinned}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}

          {isProcessing && chatHistory[chatHistory.length - 1]?.text === '' && (
            <div className="ac-typing" aria-live="polite">
              Analyzing with {currentPersona.shortLabel} lens…
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
              aria-label="Ask IRIS"
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
