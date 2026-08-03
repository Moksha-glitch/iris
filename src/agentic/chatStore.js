// ============================================================
// Chat Context — State Management for Chat + Dashboard
// ============================================================

import React, { createContext, useContext, useReducer, useCallback } from 'react';

const ChatContext = createContext(null);

const initialState = {
  activePersona: 'leadership', // 'leadership' | 'serviceProvider' | 'segments'
  chatHistory: [],
  dashboardWidgets: [],
  usedQueries: [],
};

function chatReducer(state, action) {
  switch (action.type) {
    case 'SET_PERSONA':
      // Keep conversation continuity; only reset suggestion rotation
      return { ...state, activePersona: action.payload, usedQueries: [] };

    case 'ADD_MESSAGE': {
      const msg = {
        id: action.payload.id || `msg-${Date.now()}-${state.chatHistory.length}`,
        ...action.payload,
      };
      return { ...state, chatHistory: [...state.chatHistory, msg] };
    }

    case 'UPDATE_LAST_MESSAGE':
      // Update the most recent message (used for streaming workflow steps)
      const updated = [...state.chatHistory];
      const lastIdx = updated.length - 1;
      if (lastIdx >= 0) {
        updated[lastIdx] = { ...updated[lastIdx], ...action.payload };
      }
      return { ...state, chatHistory: updated };

    case 'TRACK_QUERY':
      return { ...state, usedQueries: [...state.usedQueries, action.payload] };

    case 'ADD_WIDGET':
      // Prevent duplicate widgets
      if (state.dashboardWidgets.some(w => w.id === action.payload.id)) {
        return state;
      }
      return { ...state, dashboardWidgets: [...state.dashboardWidgets, action.payload] };

    case 'REMOVE_WIDGET':
      return { ...state, dashboardWidgets: state.dashboardWidgets.filter(w => w.id !== action.payload) };

    case 'CLEAR_CHAT':
      return { ...state, chatHistory: [], usedQueries: [] };

    default:
      return state;
  }
}

export function ChatProvider({ children }) {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  const setPersona = useCallback((p) => dispatch({ type: 'SET_PERSONA', payload: p }), []);
  const addMessage = useCallback((msg) => dispatch({ type: 'ADD_MESSAGE', payload: msg }), []);
  const updateLastMessage = useCallback((updates) => dispatch({ type: 'UPDATE_LAST_MESSAGE', payload: updates }), []);
  const trackQuery = useCallback((q) => dispatch({ type: 'TRACK_QUERY', payload: q }), []);
  const addWidget = useCallback((w) => dispatch({ type: 'ADD_WIDGET', payload: w }), []);
  const removeWidget = useCallback((id) => dispatch({ type: 'REMOVE_WIDGET', payload: id }), []);
  const clearChat = useCallback(() => dispatch({ type: 'CLEAR_CHAT' }), []);

  const value = {
    ...state,
    setPersona,
    addMessage,
    updateLastMessage,
    trackQuery,
    addWidget,
    removeWidget,
    clearChat,
  };

  return React.createElement(ChatContext.Provider, { value }, children);
}

export function useChatContext() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChatContext must be used within ChatProvider');
  return ctx;
}
