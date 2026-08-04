// ============================================================
// Predictive Questions Engine
// Generates persona-aware suggested questions from report data
// ============================================================

import { preloadedReports } from './preloadedReports';

const fleetReport = preloadedReports.find((r) => r.domain === 'fleet');
const woReport = preloadedReports.find((r) => r.domain === 'workOrders');

/**
 * Parses preloaded report context and returns persona-specific
 * predictive questions for the floating suggestion UI.
 * `query` must be a clean, standalone question (no trailing stats).
 */
const questionPool = {
  leadership: [
    {
      label: 'Fleet Coverage Gap',
      query: "What's the fleet RFID coverage gap across all service providers?",
      icon: '📡',
    },
    {
      label: 'SLA Risk Overview',
      query: 'Which open work orders pose the highest SLA risk?',
      icon: '⚠️',
    },
    {
      label: 'Top Providers',
      query: 'Show the top 5 service providers by fleet size.',
      icon: '🚛',
    },
    {
      label: 'Operational Summary',
      query: `Give me an executive summary of fleet coverage and open work orders.`,
      icon: '📋',
    },
    {
      label: 'WO Aging Trend',
      query: 'How is the aging trend looking for open work orders?',
      icon: '📈',
    },
    {
      label: 'Dispatch Bottlenecks',
      query: 'Which dispatch centers have the most unresolved work orders?',
      icon: '🔄',
    },
  ],
  serviceProvider: [
    {
      label: 'Edmonton RFID Gaps',
      query: 'Which trucks in Edmonton AB are missing RFID readers?',
      icon: '🔧',
    },
    {
      label: 'WO by Request Type',
      query: 'Show overdue work orders grouped by request type.',
      icon: '📊',
    },
    {
      label: 'Bulk Pickup Backlog',
      query: "What's the OBS-Bulk Pickup backlog, and where are the open orders clustered?",
      icon: '🚛',
    },
    {
      label: 'Cart Repair Status',
      query: "How many cart repair work orders are outstanding, and what's their average age?",
      icon: '🛒',
    },
    {
      label: 'Dispatch D-05960',
      query: 'Show all work orders assigned to dispatch D-05960.',
      icon: '📍',
    },
    {
      label: 'Oldest Open WOs',
      query: 'List the 5 oldest open work orders that need immediate attention.',
      icon: '🔴',
    },
  ],
  segments: [
    {
      label: 'Top 5 Providers',
      query: 'Compare fleet size and RFID coverage across the top 5 service providers.',
      icon: '📊',
    },
    {
      label: 'Edmonton Deep Dive',
      query: 'Deep dive into Edmonton AB fleet, dispatch patterns, and work-order distribution.',
      icon: '🔍',
    },
    {
      label: 'Case Age Distribution',
      query: 'Show the case age distribution across all missing work orders.',
      icon: '⏱️',
    },
    {
      label: 'Geographic Clustering',
      query: 'Identify geographic clusters in the work order addresses — are there hotspots?',
      icon: '🗺️',
    },
    {
      label: 'RFID Coverage Map',
      query: 'Map RFID reader coverage across all service providers.',
      icon: '📡',
    },
    {
      label: 'Report Highlights',
      query: `Summarize preloaded reports: ${fleetReport?.name || 'Fleet'} and ${woReport?.name || 'Work Orders'}.`,
      icon: '📁',
    },
  ],
};

/**
 * Returns 3-4 predictive questions for the active persona
 * Rotates through the pool to avoid repetition
 */
export function getPredictiveQuestions(persona, usedQueries = []) {
  const pool = questionPool[persona] || questionPool.leadership;
  const used = new Set(usedQueries);
  const available = pool.filter((q) => !used.has(q.query));
  return available.length >= 3 ? available.slice(0, 4) : pool.slice(0, 4);
}

/**
 * Returns all questions for a persona (for secondary rotation)
 */
export function getAllQuestions(persona) {
  return questionPool[persona] || questionPool.leadership;
}
