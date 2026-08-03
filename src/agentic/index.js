// ============================================================
// IRIS Agentic Chat — Main Scaffolding (Vite + React)
//
// All new agentic features should extend this module.
// Contract: mockAgentResponse(query, persona) →
//   { text, actionableInsights: [{ id, title, type, expandedText, dataForWidget }] }
//
// Pipeline: Query → WorkflowTrace → Insights → Add to Dashboard widgets
// ============================================================

export { ChatProvider, useChatContext } from './chatStore';
export { mockAgentResponse, getWorkflowSteps } from './mockAgentService';
export { getPredictiveQuestions, getAllQuestions } from './predictiveQuestions';
export { PERSONAS, getPersonaConfig } from './personas';
export { preloadedReports, reportContext } from './preloadedReports';
