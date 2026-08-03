// ============================================================
// Chat Context — Chat + Dashboard widgets + Reports + Analysis history
// ============================================================

import React, { createContext, useContext, useReducer, useCallback } from 'react';

const ChatContext = createContext(null);

const initialState = {
  activePersona: 'serviceProvider',
  chatHistory: [],
  dashboardWidgets: [],
  usedQueries: [],
  /** Current center-pane analysis (streaming or selected) */
  activeAnalysis: null,
  /** Completed analyses for stacked detail + chat history navigation */
  analysisHistory: [],
  /** Tabular report rows pinned from insights/analysis */
  reports: [],
  scrollToAnalysisId: null,
  scrollToken: 0,
};

function chatReducer(state, action) {
  switch (action.type) {
    case 'SET_PERSONA':
      return { ...state, activePersona: action.payload, usedQueries: [] };

    case 'ADD_MESSAGE': {
      const msg = {
        id: action.payload.id || `msg-${Date.now()}-${state.chatHistory.length}`,
        ...action.payload,
      };
      return { ...state, chatHistory: [...state.chatHistory, msg] };
    }

    case 'UPDATE_LAST_MESSAGE': {
      const updated = [...state.chatHistory];
      const lastIdx = updated.length - 1;
      if (lastIdx >= 0) {
        updated[lastIdx] = { ...updated[lastIdx], ...action.payload };
      }
      return { ...state, chatHistory: updated };
    }

    case 'TRACK_QUERY':
      return { ...state, usedQueries: [...state.usedQueries, action.payload] };

    case 'ADD_WIDGET':
      if (state.dashboardWidgets.some((w) => w.id === action.payload.id)) {
        return state;
      }
      return { ...state, dashboardWidgets: [...state.dashboardWidgets, action.payload] };

    case 'REMOVE_WIDGET':
      return {
        ...state,
        dashboardWidgets: state.dashboardWidgets.filter((w) => w.id !== action.payload),
      };

    case 'ADD_REPORT': {
      if (state.reports.some((r) => r.id === action.payload.id)) return state;
      return { ...state, reports: [action.payload, ...state.reports] };
    }

    case 'REMOVE_REPORT':
      return {
        ...state,
        reports: state.reports.filter((r) => r.id !== action.payload),
      };

    case 'CLEAR_CHAT':
      return {
        ...state,
        chatHistory: [],
        usedQueries: [],
        activeAnalysis: null,
        analysisHistory: [],
        scrollToAnalysisId: null,
      };

    case 'SET_ANALYSIS':
      return { ...state, activeAnalysis: action.payload };

    case 'UPDATE_ANALYSIS':
      if (!state.activeAnalysis) return state;
      return {
        ...state,
        activeAnalysis: { ...state.activeAnalysis, ...action.payload },
      };

    case 'CLEAR_ANALYSIS':
      return { ...state, activeAnalysis: null, scrollToAnalysisId: null };

    case 'FOCUS_CLAIM':
      if (!state.activeAnalysis) return state;
      return {
        ...state,
        activeAnalysis: {
          ...state.activeAnalysis,
          focusedClaim: action.payload,
          focusToken: Date.now(),
        },
      };

    case 'UPSERT_ANALYSIS_HISTORY': {
      const item = action.payload;
      const idx = state.analysisHistory.findIndex((a) => a.id === item.id);
      let analysisHistory;
      if (idx >= 0) {
        analysisHistory = [...state.analysisHistory];
        analysisHistory[idx] = { ...analysisHistory[idx], ...item };
      } else {
        analysisHistory = [...state.analysisHistory, item];
      }
      return { ...state, analysisHistory };
    }

    case 'SCROLL_TO_ANALYSIS':
      return {
        ...state,
        scrollToAnalysisId: action.payload,
        scrollToken: Date.now(),
        activeAnalysis:
          state.analysisHistory.find((a) => a.id === action.payload) ||
          state.activeAnalysis,
      };

    default:
      return state;
  }
}

export function ChatProvider({ children }) {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  const setPersona = useCallback((p) => dispatch({ type: 'SET_PERSONA', payload: p }), []);
  const addMessage = useCallback((msg) => dispatch({ type: 'ADD_MESSAGE', payload: msg }), []);
  const updateLastMessage = useCallback(
    (updates) => dispatch({ type: 'UPDATE_LAST_MESSAGE', payload: updates }),
    []
  );
  const trackQuery = useCallback((q) => dispatch({ type: 'TRACK_QUERY', payload: q }), []);
  const addWidget = useCallback((w) => dispatch({ type: 'ADD_WIDGET', payload: w }), []);
  const removeWidget = useCallback((id) => dispatch({ type: 'REMOVE_WIDGET', payload: id }), []);
  const addReport = useCallback((r) => dispatch({ type: 'ADD_REPORT', payload: r }), []);
  const removeReport = useCallback((id) => dispatch({ type: 'REMOVE_REPORT', payload: id }), []);
  const clearChat = useCallback(() => dispatch({ type: 'CLEAR_CHAT' }), []);
  const setAnalysis = useCallback((a) => dispatch({ type: 'SET_ANALYSIS', payload: a }), []);
  const updateAnalysis = useCallback((u) => dispatch({ type: 'UPDATE_ANALYSIS', payload: u }), []);
  const clearAnalysis = useCallback(() => dispatch({ type: 'CLEAR_ANALYSIS' }), []);
  const focusClaim = useCallback((claim) => dispatch({ type: 'FOCUS_CLAIM', payload: claim }), []);
  const upsertAnalysisHistory = useCallback(
    (item) => dispatch({ type: 'UPSERT_ANALYSIS_HISTORY', payload: item }),
    []
  );
  const scrollToAnalysis = useCallback(
    (id) => dispatch({ type: 'SCROLL_TO_ANALYSIS', payload: id }),
    []
  );

  const value = {
    ...state,
    setPersona,
    addMessage,
    updateLastMessage,
    trackQuery,
    addWidget,
    removeWidget,
    addReport,
    removeReport,
    clearChat,
    setAnalysis,
    updateAnalysis,
    clearAnalysis,
    focusClaim,
    upsertAnalysisHistory,
    scrollToAnalysis,
  };

  return React.createElement(ChatContext.Provider, { value }, children);
}

export function useChatContext() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChatContext must be used within ChatProvider');
  return ctx;
}

/** Build tabular report rows from an insight + parent analysis */
export function buildReportFromInsight(insight, analysis) {
  const sources = analysis?.sources || [];
  const rows =
    sources.length > 0
      ? sources.map((s) => ({
          metric: s.claim,
          value: s.claim,
          confidence: s.confidence || '—',
          source: s.source || '—',
          note: s.note || '',
        }))
      : [
          {
            metric: insight.title,
            value:
              insight.dataForWidget?.value ||
              insight.dataForWidget?.subtitle ||
              insight.type,
            confidence: 'high',
            source: analysis?.query ? `Q: ${analysis.query}` : 'IRIS analysis',
            note: insight.type,
          },
        ];

  // Flatten bar chart data into extra rows when present
  if (insight.dataForWidget?.chartType === 'bar' && Array.isArray(insight.dataForWidget.data)) {
    insight.dataForWidget.data.forEach((d) => {
      Object.entries(d).forEach(([k, v]) => {
        if (k === 'name' || typeof v !== 'number') return;
        rows.push({
          metric: `${d.name} · ${k}`,
          value: String(v),
          confidence: 'high',
          source: insight.title,
          note: 'Chart series',
        });
      });
    });
  }

  return {
    id: `report-${insight.id}`,
    title: insight.title,
    query: analysis?.query || '',
    type: insight.type || 'analysis',
    persona: analysis?.persona || 'serviceProvider',
    createdAt: Date.now(),
    rows,
  };
}
