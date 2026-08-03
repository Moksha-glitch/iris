import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { truckFleetData, missingWorkOrders, fleetSummary, woSummary, providerId } from '../src/excelData.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

function coveragePct(p) {
  return p.truckCount ? (p.trucksWithRFID / p.truckCount) * 100 : 100;
}

function ragForProvider(p) {
  const cov = coveragePct(p);
  const relatedWOs = missingWorkOrders.filter(w => w.segment === p.serviceProvider);
  const criticalWOs = relatedWOs.filter(w => w.caseAge > 700).length;
  if (p.trucksWithoutRFID >= 10 || criticalWOs >= 2 || cov < 70) return 'r';
  if (p.trucksWithoutRFID > 0 || relatedWOs.length > 0 || cov < 90) return 'a';
  return 'g';
}

function trendForProvider(p) {
  const cov = coveragePct(p);
  if (cov >= 95) return 'up';
  if (cov < 80 || p.trucksWithoutRFID >= 5) return 'down';
  return 'stable';
}

const decisions = truckFleetData.map((p) => {
  const id = providerId(p.serviceProvider);
  const cov = coveragePct(p);
  const relatedWOs = missingWorkOrders.filter(w => w.segment === p.serviceProvider);
  const overdue = relatedWOs.filter(w => w.caseAge > 700);
  const rag = ragForProvider(p);
  const trend = trendForProvider(p);
  const varEstimate = p.trucksWithoutRFID * 450 + overdue.length * 1250;

  const whatsChanged = [];
  if (p.trucksWithoutRFID > 0) {
    whatsChanged.push(`${p.trucksWithoutRFID} trucks operating without RFID readers.`);
  }
  if (relatedWOs.length > 0) {
    whatsChanged.push(`${relatedWOs.length} open missing work orders in segment.`);
  }
  if (overdue.length > 0) {
    whatsChanged.push(`${overdue.length} work orders exceed 700-day age threshold.`);
  }
  if (whatsChanged.length === 0) {
    whatsChanged.push('Full RFID coverage with no open work orders.');
  }

  return {
    id,
    title: p.serviceProvider,
    verdict: rag === 'r' ? 'Critical Gap' : rag === 'a' ? 'Needs Attention' : 'On Track',
    rag,
    confidence: Math.min(99.5, Math.max(70, 100 - p.trucksWithoutRFID * 0.8 - overdue.length * 2)),
    valueAtRisk: varEstimate > 0 ? `$${varEstimate.toLocaleString()}` : '$0',
    financialImpact: varEstimate,
    trend,
    truckCount: p.truckCount,
    trucksWithRFID: p.trucksWithRFID,
    trucksWithoutRFID: p.trucksWithoutRFID,
    rfidCoverage: Number(cov.toFixed(1)),
    openWOs: relatedWOs.length,
    whatsChanged,
    drivers: [
      {
        id: `DR-${id}-1`,
        title: 'RFID Coverage',
        status: p.trucksWithoutRFID === 0 ? 'valid' : 'invalid',
        trend: p.trucksWithoutRFID === 0 ? 'up' : 'down',
        owner: 'Fleet Ops',
        lastUpdated: 'Today',
        signals: [
          {
            type: p.trucksWithoutRFID === 0 ? 'positive' : 'negative',
            text: `${p.trucksWithRFID}/${p.truckCount} trucks RFID-equipped (${cov.toFixed(1)}%)`,
            source: 'Customers with Truck/Cameras',
            fresh: 'Today',
            reliability: 'High',
            quarantined: false,
          },
        ],
      },
      {
        id: `DR-${id}-2`,
        title: 'Missing Work Orders',
        status: overdue.length === 0 ? 'valid' : 'invalid',
        trend: relatedWOs.length === 0 ? 'stable' : 'down',
        owner: 'Service Ops',
        lastUpdated: 'Today',
        signals: relatedWOs.length
          ? relatedWOs.slice(0, 5).map(w => ({
              type: w.caseAge > 700 ? 'negative' : 'positive',
              text: `WO #${w.woNumber} — ${w.requestType} — ${w.caseAge}d — ${w.dispatchNumber}`,
              source: 'Missing WO Report',
              fresh: 'Today',
              reliability: 'High',
              quarantined: false,
            }))
          : [{
              type: 'positive',
              text: 'No open missing work orders for this provider',
              source: 'Missing WO Report',
              fresh: 'Today',
              reliability: 'High',
              quarantined: false,
            }],
      },
      {
        id: `DR-${id}-3`,
        title: 'Fleet Size',
        status: 'valid',
        trend: 'stable',
        owner: 'Operations',
        lastUpdated: 'Today',
        signals: [
          {
            type: 'positive',
            text: `${p.truckCount} active trucks in service`,
            source: 'Customers with Truck/Cameras',
            fresh: 'Today',
            reliability: 'High',
            quarantined: false,
          },
        ],
      },
    ],
    realityCheck: {
      metric: 'RFID Coverage %',
      prediction: 95,
      reality: Number(cov.toFixed(1)),
      unit: '%',
      timeSeries: [
        Math.max(50, cov - 8),
        Math.max(50, cov - 5),
        Math.max(50, cov - 3),
        Math.max(50, cov - 1),
        cov,
      ].map(v => Number(v.toFixed(1))),
    },
  };
});

// Add a network-level WO decision for Edmonton segment visibility
const edmontonWOs = missingWorkOrders;
if (edmontonWOs.length) {
  const oldest = [...edmontonWOs].sort((a, b) => b.caseAge - a.caseAge)[0];
  decisions.unshift({
    id: 'WO-Edmonton-Missing',
    title: 'Edmonton AB — Missing Work Orders',
    verdict: woSummary.overdueWOs > 0 ? 'Critical Backlog' : 'Monitoring',
    rag: woSummary.overdueWOs >= 2 ? 'r' : 'a',
    confidence: 92.5,
    valueAtRisk: `$${(woSummary.overdueWOs * 1250).toLocaleString()}`,
    financialImpact: woSummary.overdueWOs * 1250,
    trend: 'down',
    truckCount: 0,
    trucksWithRFID: 0,
    trucksWithoutRFID: 0,
    rfidCoverage: 0,
    openWOs: woSummary.totalWOs,
    whatsChanged: [
      `${woSummary.totalWOs} open missing work orders (avg age ${woSummary.avgCaseAge} days).`,
      `${woSummary.overdueWOs} cases exceed 700-day threshold.`,
      `Oldest: WO #${oldest.woNumber} at ${oldest.caseAge} days (${oldest.requestType}).`,
    ],
    drivers: [
      {
        id: 'DR-WO-Edmonton-1',
        title: 'Case Aging',
        status: 'invalid',
        trend: 'down',
        owner: 'Service Ops',
        lastUpdated: 'Today',
        signals: edmontonWOs
          .slice()
          .sort((a, b) => b.caseAge - a.caseAge)
          .slice(0, 6)
          .map(w => ({
            type: w.caseAge > 700 ? 'negative' : 'positive',
            text: `WO #${w.woNumber} — ${w.requestType} — ${w.caseAge}d`,
            source: 'Missing WO Report',
            fresh: 'Today',
            reliability: 'High',
            quarantined: false,
          })),
      },
      {
        id: 'DR-WO-Edmonton-2',
        title: 'Request Type Mix',
        status: 'valid',
        trend: 'stable',
        owner: 'Dispatch',
        lastUpdated: 'Today',
        signals: woSummary.requestTypeBreakdown.slice(0, 5).map(r => ({
          type: r.count >= 3 ? 'negative' : 'positive',
          text: `${r.type}: ${r.count} (avg ${r.avgAge}d)`,
          source: 'Missing WO Report',
          fresh: 'Today',
          reliability: 'High',
          quarantined: false,
        })),
      },
      {
        id: 'DR-WO-Edmonton-3',
        title: 'Dispatch Load',
        status: 'valid',
        trend: 'stable',
        owner: 'Dispatch',
        lastUpdated: 'Today',
        signals: woSummary.dispatchBreakdown.slice(0, 5).map(d => ({
          type: d.count >= 4 ? 'negative' : 'positive',
          text: `${d.dispatch}: ${d.count} open WOs`,
          source: 'Missing WO Report',
          fresh: 'Today',
          reliability: 'High',
          quarantined: false,
        })),
      },
    ],
    realityCheck: {
      metric: 'Avg Case Age (days)',
      prediction: 30,
      reality: woSummary.avgCaseAge,
      unit: 'days',
      timeSeries: [woSummary.minCaseAge, 500, 650, 750, woSummary.avgCaseAge].map(v => Number(v)),
    },
  });
}

const storeOut = `// Auto-generated from excelData.js (Customers + Missing WO reports)
import { providerId } from './excelData';

export const decisions = ${JSON.stringify(decisions, null, 2)};

export function getDecision(id) {
  return decisions.find(d => d.id === id) || null;
}

export function findDecisionByQuery(query) {
  const q = String(query || '').toLowerCase();
  if (!q) return null;
  if (q.includes('missing') || q.includes('work order') || q.includes('wo') || q.includes('sla')) {
    return decisions.find(d => d.id === 'WO-Edmonton-Missing') || null;
  }
  const match = decisions.find(d => d.title.toLowerCase().includes(q) || q.includes(d.title.toLowerCase()));
  if (match) return match;
  // fuzzy provider token match
  return decisions.find(d => {
    const tokens = d.title.toLowerCase().split(/\\s+/).filter(t => t.length > 3);
    return tokens.some(t => q.includes(t));
  }) || null;
}

export { providerId, fleetSummaryMeta };

const fleetSummaryMeta = {
  totalProviders: ${fleetSummary.totalProviders},
  totalTrucks: ${fleetSummary.totalTrucks},
  trucksWithRFID: ${fleetSummary.trucksWithRFID},
  trucksWithoutRFID: ${fleetSummary.trucksWithoutRFID},
  rfidCoverage: '${fleetSummary.rfidCoverage}',
  totalWOs: ${woSummary.totalWOs},
  avgCaseAge: ${woSummary.avgCaseAge},
  overdueWOs: ${woSummary.overdueWOs},
};
`;

// Fix: fleetSummaryMeta used before declaration — rewrite cleanly
const storeOutFixed = `// Auto-generated from excelData.js (Customers + Missing WO reports)
// Run: node scripts/generateStore.mjs

export const decisions = ${JSON.stringify(decisions, null, 2)};

export const connections = [];

export const networkMeta = {
  totalProviders: ${fleetSummary.totalProviders},
  totalTrucks: ${fleetSummary.totalTrucks},
  trucksWithRFID: ${fleetSummary.trucksWithRFID},
  trucksWithoutRFID: ${fleetSummary.trucksWithoutRFID},
  rfidCoverage: '${fleetSummary.rfidCoverage}',
  totalWOs: ${woSummary.totalWOs},
  avgCaseAge: ${woSummary.avgCaseAge},
  overdueWOs: ${woSummary.overdueWOs},
};

export function getDecision(id) {
  return decisions.find(d => d.id === id) || null;
}

export function findDecisionByQuery(query) {
  const q = String(query || '').toLowerCase();
  if (!q) return null;
  if (
    q.includes('missing') ||
    q.includes('work order') ||
    q.includes('sla') ||
    q.includes('overdue') ||
    q.includes('case age') ||
    q.includes('dispatch') ||
    q.includes('bulk') ||
    q.includes('repair')
  ) {
    return decisions.find(d => d.id === 'WO-Edmonton-Missing') || null;
  }
  if (q.includes('rfid') || q.includes('gap') || q.includes('unequipp') || q.includes('coverage') || q.includes('fleet')) {
    const gap = decisions
      .filter(d => d.trucksWithoutRFID > 0)
      .sort((a, b) => b.trucksWithoutRFID - a.trucksWithoutRFID)[0];
    return gap || decisions.find(d => d.title === 'Edmonton AB') || null;
  }
  const byTitle = decisions.find(d => {
    const t = d.title.toLowerCase();
    return t.length > 2 && (q.includes(t) || t.includes(q));
  });
  if (byTitle) return byTitle;
  return decisions.find(d => {
    const tokens = d.title.toLowerCase().split(/\\s+/).filter(t => t.length > 3);
    return tokens.some(t => q.includes(t));
  }) || null;
}
`;

fs.writeFileSync(path.join(root, 'src', 'store.js'), storeOutFixed);
console.log('wrote store.js with', decisions.length, 'decisions');
console.log('rag counts', {
  r: decisions.filter(d => d.rag === 'r').length,
  a: decisions.filter(d => d.rag === 'a').length,
  g: decisions.filter(d => d.rag === 'g').length,
});
