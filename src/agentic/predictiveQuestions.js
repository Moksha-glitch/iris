// ============================================================
// Predictive Questions Engine
// Generates persona-aware suggested questions from report data
// ============================================================

import { reportContext, preloadedReports } from './preloadedReports';

const { fleetSummary, woSummary, edmonton } = reportContext;
const fleetReport = preloadedReports.find((r) => r.domain === 'fleet');
const woReport = preloadedReports.find((r) => r.domain === 'workOrders');

/**
 * Parses preloaded report context and returns persona-specific
 * predictive questions for the floating suggestion UI.
 */
const questionPool = {
  leadership: [
    { label: 'Fleet Coverage Gap', query: `What's the fleet RFID coverage gap? ${fleetSummary.trucksWithoutRFID} trucks are unequipped.`, icon: '📡' },
    { label: 'SLA Risk Overview', query: `Which work orders pose the highest SLA risk? ${woSummary.overdueWOs} are overdue.`, icon: '⚠️' },
    { label: 'Provider ROI', query: `Show ROI impact of the top 5 service providers by fleet size.`, icon: '💰' },
    { label: 'Operational Summary', query: `Give me an executive summary of ${fleetSummary.totalProviders} providers and ${woSummary.totalWOs} open work orders.`, icon: '📋' },
    { label: 'WO Aging Trend', query: `Analyze the aging trend of open work orders. Average age is ${woSummary.avgCaseAge} days.`, icon: '📈' },
    { label: 'Dispatch Bottlenecks', query: `Which dispatch centers have the most unresolved work orders?`, icon: '🔄' },
  ],
  serviceProvider: [
    { label: 'Edmonton RFID Gaps', query: `Which trucks in Edmonton AB are missing RFID readers? ${edmonton?.trucksWithoutRFID || 0} trucks unequipped.`, icon: '🔧' },
    { label: 'WO by Request Type', query: `Show overdue work orders grouped by request type.`, icon: '📊' },
    { label: 'Bulk Pickup Backlog', query: `What's the OBS-Bulk Pickup backlog? ${woSummary.requestTypeBreakdown.find(r => r.type === 'OBS-Bulk Pickup')?.count || 0} orders pending.`, icon: '🚛' },
    { label: 'Cart Repair Status', query: `How many cart repair work orders are outstanding and what's their average age?`, icon: '🛒' },
    { label: 'Dispatch D-05960', query: `Show all work orders assigned to dispatch D-05960.`, icon: '📍' },
    { label: 'Oldest Open WOs', query: `List the 5 oldest open work orders that need immediate attention.`, icon: '🔴' },
  ],
  segments: [
    { label: 'Top 5 Providers', query: `Compare fleet size and RFID coverage across the top 5 service providers.`, icon: '📊' },
    { label: 'Edmonton Deep Dive', query: `Deep dive into Edmonton AB: ${edmonton?.truckCount || 0} trucks, dispatch patterns, and WO distribution.`, icon: '🔍' },
    { label: 'Case Age Distribution', query: `Show the case age distribution across all ${woSummary.totalWOs} missing work orders.`, icon: '⏱️' },
    { label: 'Geographic Clustering', query: `Identify geographic clusters in the work order addresses — are there hotspots?`, icon: '🗺️' },
    { label: 'RFID Coverage Map', query: `Map RFID reader coverage across all ${fleetSummary.totalProviders} service providers.`, icon: '📡' },
    { label: 'Report Highlights', query: `Summarize preloaded reports: ${fleetReport?.name} and ${woReport?.name}.`, icon: '📁' },
  ],
};

/**
 * Returns 3-4 predictive questions for the active persona
 * Rotates through the pool to avoid repetition
 */
export function getPredictiveQuestions(persona, usedQueries = []) {
  const pool = questionPool[persona] || questionPool.leadership;
  const available = pool.filter(q => !usedQueries.includes(q.query));
  return available.length >= 3 ? available.slice(0, 4) : pool.slice(0, 4);
}

/**
 * Returns all questions for a persona (for secondary rotation)
 */
export function getAllQuestions(persona) {
  return questionPool[persona] || questionPool.leadership;
}
