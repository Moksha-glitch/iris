// ============================================================
// Chat Context — Chat + Dashboard widgets + Reports + Analysis history
// ============================================================

import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';

const ChatContext = createContext(null);

function makeSession(persona, id) {
  const now = Date.now();
  return {
    id: id || `session-${now}`,
    title: 'New chat',
    persona,
    chatHistory: [],
    analysisHistory: [],
    usedQueries: [],
    createdAt: now,
    updatedAt: now,
  };
}

function titleFromMessages(chatHistory, analysisHistory) {
  const user = (chatHistory || []).find((m) => m.type === 'user' && m.text);
  if (user?.text) return user.text.trim();
  const query = (analysisHistory || []).find((a) => a.query)?.query;
  return query?.trim() || 'New chat';
}

function isSessionEmpty(session) {
  if (!session) return true;
  return (
    (session.chatHistory?.length || 0) === 0 && (session.analysisHistory?.length || 0) === 0
  );
}

function captureActive(state) {
  const prev = state.sessions.find((s) => s.id === state.activeSessionId);
  return {
    id: state.activeSessionId,
    title: titleFromMessages(state.chatHistory, state.analysisHistory),
    persona: state.activePersona,
    chatHistory: state.chatHistory,
    analysisHistory: state.analysisHistory,
    usedQueries: state.usedQueries,
    createdAt: prev?.createdAt || Date.now(),
    updatedAt: Date.now(),
  };
}

function persistActive(state) {
  const snap = captureActive(state);
  const idx = state.sessions.findIndex((s) => s.id === snap.id);
  const sessions =
    idx >= 0
      ? state.sessions.map((s, i) => (i === idx ? { ...s, ...snap } : s))
      : [snap, ...state.sessions];
  return { ...state, sessions };
}

function hydrateSession(state, session) {
  const analysisHistory = session.analysisHistory || [];
  const lastDone = [...analysisHistory].reverse().find((a) => !a.isStreaming);
  return {
    ...state,
    activeSessionId: session.id,
    activePersona: session.persona || state.activePersona,
    chatHistory: session.chatHistory || [],
    analysisHistory,
    usedQueries: session.usedQueries || [],
    activeAnalysis: lastDone || analysisHistory[analysisHistory.length - 1] || null,
    scrollToAnalysisId: null,
  };
}

const AUTH_STORAGE_KEY = 'vision-ai-auth';

function loadAuth() {
  try {
    const raw = sessionStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return { isAuthenticated: false, activePersona: 'serviceProvider' };
    const parsed = JSON.parse(raw);
    const persona = parsed?.persona;
    if (parsed?.authenticated && ['leadership', 'serviceProvider', 'segments'].includes(persona)) {
      return { isAuthenticated: true, activePersona: persona };
    }
  } catch {
    /* ignore */
  }
  return { isAuthenticated: false, activePersona: 'serviceProvider' };
}

const savedAuth = loadAuth();
const INITIAL_SESSION = makeSession(savedAuth.activePersona, 'session-initial');

const initialState = {
  isAuthenticated: savedAuth.isAuthenticated,
  activePersona: savedAuth.activePersona,
  activeSessionId: INITIAL_SESSION.id,
  sessions: [INITIAL_SESSION],
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
      return persistActive({ ...state, activePersona: action.payload, usedQueries: [] });

    case 'ADD_MESSAGE': {
      const msg = {
        id: action.payload.id || `msg-${Date.now()}-${state.chatHistory.length}`,
        ...action.payload,
      };
      return persistActive({ ...state, chatHistory: [...state.chatHistory, msg] });
    }

    case 'UPDATE_LAST_MESSAGE': {
      const updated = [...state.chatHistory];
      const lastIdx = updated.length - 1;
      if (lastIdx >= 0) {
        updated[lastIdx] = { ...updated[lastIdx], ...action.payload };
      }
      return persistActive({ ...state, chatHistory: updated });
    }

    case 'TRACK_QUERY':
      return persistActive({ ...state, usedQueries: [...state.usedQueries, action.payload] });

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
      return persistActive({
        ...state,
        chatHistory: [],
        usedQueries: [],
        activeAnalysis: null,
        analysisHistory: [],
        scrollToAnalysisId: null,
      });

    case 'NEW_CHAT': {
      const persisted = persistActive(state);
      const current = persisted.sessions.find((s) => s.id === persisted.activeSessionId);
      if (isSessionEmpty(current)) return persisted;
      const next = makeSession(persisted.activePersona);
      return hydrateSession({ ...persisted, sessions: [next, ...persisted.sessions] }, next);
    }

    case 'SWITCH_SESSION': {
      if (!action.payload || action.payload === state.activeSessionId) return state;
      const persisted = persistActive(state);
      const target = persisted.sessions.find((s) => s.id === action.payload);
      if (!target) return persisted;
      return hydrateSession(persisted, target);
    }

    case 'DELETE_SESSION': {
      const persisted = persistActive(state);
      const remaining = persisted.sessions.filter((s) => s.id !== action.payload);
      if (remaining.length === 0) {
        const next = makeSession(persisted.activePersona);
        return hydrateSession({ ...persisted, sessions: [next] }, next);
      }
      if (persisted.activeSessionId !== action.payload) {
        return { ...persisted, sessions: remaining };
      }
      const latest = [...remaining].sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0))[0];
      return hydrateSession({ ...persisted, sessions: remaining }, latest);
    }

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
      return persistActive({ ...state, analysisHistory });
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

    case 'LOGIN': {
      const persona = action.payload;
      const persisted = persistActive({ ...state, isAuthenticated: true, activePersona: persona });
      const mine = persisted.sessions.filter((s) => s.persona === persona);
      if (mine.length) {
        const latest = [...mine].sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0))[0];
        return hydrateSession(persisted, latest);
      }
      const next = makeSession(persona);
      return hydrateSession({ ...persisted, sessions: [next, ...persisted.sessions] }, next);
    }

    case 'LOGOUT':
      return { ...persistActive(state), isAuthenticated: false, activeAnalysis: null };

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
  const newChat = useCallback(() => dispatch({ type: 'NEW_CHAT' }), []);
  const switchSession = useCallback(
    (id) => dispatch({ type: 'SWITCH_SESSION', payload: id }),
    []
  );
  const deleteSession = useCallback(
    (id) => dispatch({ type: 'DELETE_SESSION', payload: id }),
    []
  );
  const logout = useCallback(() => dispatch({ type: 'LOGOUT' }), []);
  const login = useCallback((persona) => dispatch({ type: 'LOGIN', payload: persona }), []);
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
    newChat,
    switchSession,
    deleteSession,
    login,
    logout,
    setAnalysis,
    updateAnalysis,
    clearAnalysis,
    focusClaim,
    upsertAnalysisHistory,
    scrollToAnalysis,
  };

  useEffect(() => {
    if (state.isAuthenticated) {
      sessionStorage.setItem(
        AUTH_STORAGE_KEY,
        JSON.stringify({ authenticated: true, persona: state.activePersona })
      );
    } else {
      sessionStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [state.isAuthenticated, state.activePersona]);

  return React.createElement(ChatContext.Provider, { value }, children);
}

export function useChatContext() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChatContext must be used within ChatProvider');
  return ctx;
}

/** Build tabular report rows from an insight + parent analysis */
export function buildReportFromInsight(insight, analysis) {
  // Lazy import avoided — keep provider resolution inline for chart names
  const sources = analysis?.sources || [];
  const rows =
    sources.length > 0
      ? sources.map((s) => {
          const serviceProvider = extractProviderLabel(s.claim) || 'Network';
          return {
            serviceProvider,
            metric: serviceProvider,
            value: s.claim,
            confidence: s.confidence || '—',
            source: s.source || '—',
            note: s.note || '',
          };
        })
      : [
          {
            serviceProvider: extractProviderLabel(insight.title) || 'Network',
            metric: extractProviderLabel(insight.title) || 'Network',
            value:
              insight.dataForWidget?.value ||
              insight.dataForWidget?.subtitle ||
              insight.type,
            confidence: 'high',
            source: analysis?.query ? `Q: ${analysis.query}` : 'Vision AI analysis',
            note: insight.type,
          },
        ];

  // Flatten bar chart data into extra rows when present
  if (insight.dataForWidget?.chartType === 'bar' && Array.isArray(insight.dataForWidget.data)) {
    insight.dataForWidget.data.forEach((d) => {
      Object.entries(d).forEach(([k, v]) => {
        if (k === 'name' || typeof v !== 'number') return;
        const serviceProvider = d.name || 'Network';
        rows.push({
          serviceProvider,
          metric: serviceProvider,
          value: String(v),
          confidence: 'high',
          source: insight.title,
          note: k,
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

function extractProviderLabel(text) {
  const t = String(text || '');
  if (/edmonton/i.test(t)) return 'Edmonton AB';
  if (/network|fleet-wide|all providers/i.test(t)) return 'Network';
  // Capture "Provider Name — …" or leading proper-noun style labels before metrics
  const m = t.match(/^([A-Za-z][A-Za-z0-9 .&/-]{1,40}?)(?:\s+[—–-]|\s+\d|\s+\()/);
  if (m) return m[1].trim();
  return null;
}
