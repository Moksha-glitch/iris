// ============================================================
// Mock Agent Service — Simulated Agentic Backend
// Returns structured responses with workflow steps + insights
// ============================================================

import { reportContext, preloadedReports } from './preloadedReports';

const { fleetSummary, woSummary, truckFleetData, missingWorkOrders, edmonton, gapProviders } = reportContext;
const edmontonCoverage = edmonton?.truckCount
  ? ((edmonton.trucksWithRFID / edmonton.truckCount) * 100).toFixed(1)
  : '0.0';

/**
 * Simulates the agentic workflow with staggered delays.
 * @param {string} query
 * @param {string} persona - 'leadership' | 'serviceProvider' | 'segments'
 * @param {function} onStepUpdate - callback(stepIndex, status) called as each step resolves
 * @returns {Promise<{ text: string, actionableInsights: Array }>}
 */
export async function mockAgentResponse(query, persona, onStepUpdate) {
  const steps = getWorkflowSteps().map((s) => ({
    ...s,
    duration:
      s.id === 'intent' ? 900 :
      s.id === 'retrieval' ? 1400 :
      s.id === 'aggregation' ? 1100 :
      850,
  }));

  for (let i = 0; i < steps.length; i++) {
    if (onStepUpdate) onStepUpdate(i, 'active');
    await delay(steps[i].duration);
    if (onStepUpdate) onStepUpdate(i, 'done');
  }

  return routeQuery(query, persona);
}

export function getWorkflowSteps() {
  return [
    {
      id: 'intent',
      label: 'Intent analysis & persona routing',
      icon: '◈',
      status: 'pending',
      duration: 900,
      thoughts: [
        'Parsing query surface form and latent goal…',
        'Separating operational ask from executive framing…',
        'Selecting lens weights for the active persona…',
      ],
      tools: [
        { name: 'classify_intent', meta: 'taxonomy · v3', icon: '◎' },
        { name: 'route_persona', meta: 'leadership | sp | segments', icon: '↗' },
      ],
    },
    {
      id: 'retrieval',
      label: 'Report retrieval & evidence gather',
      icon: '◉',
      status: 'pending',
      duration: 1400,
      thoughts: [
        'Opening fleet + missing-WO corpora…',
        'Ranking chunks by RFID gap and case-age risk…',
        'Holding provisional matches until coverage confirms…',
      ],
      tools: [
        { name: 'rag.search', meta: 'fleet_xlsx · top-k 12', icon: '◎' },
        { name: 'rag.search', meta: 'missing_wo · top-k 8', icon: '◎' },
        { name: 'cite.score', meta: 'high / prov badges', icon: '✦' },
      ],
    },
    {
      id: 'aggregation',
      label: 'Aggregation, joins & risk math',
      icon: '⬡',
      status: 'pending',
      duration: 1100,
      thoughts: [
        'Joining provider fleet rows to WO backlog…',
        'Computing coverage %, overdue counts, SLA exposure…',
        'Stress-testing largest gap vs network baseline…',
      ],
      tools: [
        { name: 'calc.coverage', meta: 'RFID % · unequipped', icon: '∑' },
        { name: 'calc.sla', meta: 'avg age · overdue >700d', icon: '∑' },
      ],
    },
    {
      id: 'drafting',
      label: 'Drafting grounded response',
      icon: '✎',
      status: 'pending',
      duration: 850,
      thoughts: [
        'Ordering claims by urgency, then actionability…',
        'Binding bold metrics to Directory redirects…',
        'Packaging follow-ups the persona can act on…',
      ],
      tools: [
        { name: 'compose.reply', meta: 'markdown · cites', icon: '✎' },
        { name: 'pack.insights', meta: 'widgets · explore', icon: '▣' },
      ],
    },
  ];
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ============================================================
// Query Router — maps query content to structured responses
// ============================================================

function routeQuery(query, persona) {
  const q = query.toLowerCase();

  // --- Preloaded report highlights ---
  if (q.includes('preloaded') || q.includes('report highlight') || q.includes('summarize preloaded')) {
    return {
      text: `**Preloaded Report Context**\n\n${preloadedReports.map((r) => `• **${r.name}** (${r.asOf})\n  ${r.highlights.map((h) => `– ${h}`).join('\n  ')}`).join('\n\n')}`,
      actionableInsights: [
        {
          id: 'insight-report-fleet',
          title: 'Fleet Report Snapshot',
          type: 'kpi',
          expandedText: `Fleet report covers ${fleetSummary.totalTrucks} trucks and ${fleetSummary.rfidCoverage}% RFID coverage.`,
          dataForWidget: {
            chartType: 'kpi',
            title: 'Fleet Assets',
            value: String(fleetSummary.totalTrucks),
            subtitle: `${fleetSummary.totalProviders} providers`,
            trend: 'stable',
            delta: `${fleetSummary.rfidCoverage}% RFID`,
          },
        },
      ],
    };
  }

  // --- Fleet Coverage / RFID ---
  if (q.includes('rfid') || q.includes('coverage') || q.includes('fleet coverage') || q.includes('unequipped')) {
    return {
      text: `**Fleet RFID Coverage Analysis**\n\nAcross **${fleetSummary.totalProviders} service providers** and **${fleetSummary.totalTrucks} trucks**, RFID reader coverage stands at **${fleetSummary.rfidCoverage}%**.\n\n• **${fleetSummary.trucksWithRFID}** trucks equipped with RFID readers\n• **${fleetSummary.trucksWithoutRFID}** trucks WITHOUT RFID — creating a tracking blind spot\n\n**Top Gap:** ${fleetSummary.largestGap?.serviceProvider} has ${fleetSummary.largestGap?.trucksWithoutRFID} unequipped trucks (largest gap in the network).\n\nRecommendation: Prioritize RFID deployment to ${fleetSummary.largestGap?.serviceProvider} to close the largest visibility gap.`,
      actionableInsights: [
        {
          id: 'insight-rfid-gap',
          title: 'RFID Coverage by Provider',
          type: 'gap-analysis',
          expandedText: `**Detailed RFID Gap Analysis**\n\n${fleetSummary.largestGap?.serviceProvider} is the critical focus area:\n• ${fleetSummary.largestGap?.truckCount} total trucks, ${fleetSummary.largestGap?.trucksWithRFID} equipped\n• ${fleetSummary.largestGap?.trucksWithoutRFID} trucks operate without tracking capability\n• This represents **${fleetSummary.trucksWithoutRFID ? ((fleetSummary.largestGap.trucksWithoutRFID / fleetSummary.trucksWithoutRFID) * 100).toFixed(0) : 0}%** of all unequipped trucks network-wide\n\nOther providers with gaps:\n${gapProviders.slice(1, 5).map(p => `• ${p.serviceProvider}: ${p.trucksWithoutRFID} unequipped (${((p.trucksWithRFID / p.truckCount) * 100).toFixed(1)}% coverage)`).join('\n')}\n\nEstimated cost to close all gaps: ~$${(fleetSummary.trucksWithoutRFID * 450).toLocaleString()} at $450/unit.`,
          dataForWidget: {
            chartType: 'bar',
            title: 'RFID Coverage by Provider',
            data: fleetSummary.top5Providers.map(p => ({
              name: p.serviceProvider.length > 15 ? p.serviceProvider.substring(0, 15) + '…' : p.serviceProvider,
              'With RFID': p.trucksWithRFID,
              'Without RFID': p.trucksWithoutRFID,
            })),
            colors: ['#166534', '#B91C1C'],
          },
        },
        {
          id: 'insight-rfid-pct',
          title: 'Network RFID Coverage Rate',
          type: 'kpi',
          expandedText: `**RFID Coverage KPI**\n\nCurrent network-wide coverage: **${fleetSummary.rfidCoverage}%**\n\nTarget: 95% coverage by end of Q4.\n\nGap to target: ${(95 - parseFloat(fleetSummary.rfidCoverage)).toFixed(1)} percentage points, requiring approximately ${Math.ceil(fleetSummary.trucksWithoutRFID * 0.8)} additional installations.`,
          dataForWidget: {
            chartType: 'kpi',
            title: 'RFID Coverage',
            value: fleetSummary.rfidCoverage + '%',
            subtitle: `${fleetSummary.trucksWithRFID} of ${fleetSummary.totalTrucks} trucks`,
            trend: 'up',
            delta: '+2.3% vs last month',
          },
        },
      ],
    };
  }

  // --- SLA Risk / Overdue WOs ---
  if (q.includes('sla') || q.includes('overdue') || q.includes('risk') || q.includes('aging')) {
    const oldest = [...missingWorkOrders].sort((a, b) => b.caseAge - a.caseAge).slice(0, 5);
    return {
      text: `**SLA Risk Assessment — Missing Work Orders**\n\n**${woSummary.totalWOs} open work orders** with an average case age of **${woSummary.avgCaseAge} days**.\n\n🔴 **${woSummary.overdueWOs} critical overdue** (>700 days)\n⚠️ Oldest case: **${woSummary.maxCaseAge} days** (WO #${oldest[0].woNumber} — ${oldest[0].requestType})\n\n**Top 3 oldest:**\n${oldest.slice(0, 3).map((w, i) => `${i + 1}. WO #${w.woNumber} — ${w.requestType} — ${w.caseAge} days — ${w.address}`).join('\n')}\n\nImmediate action required on cases exceeding 1,000 days.`,
      actionableInsights: [
        {
          id: 'insight-wo-aging',
          title: 'Work Order Age Distribution',
          type: 'risk-analysis',
          expandedText: `**Case Age Breakdown**\n\n• 0-500 days: ${missingWorkOrders.filter(w => w.caseAge <= 500).length} work orders\n• 500-700 days: ${missingWorkOrders.filter(w => w.caseAge > 500 && w.caseAge <= 700).length} work orders\n• 700-1000 days: ${missingWorkOrders.filter(w => w.caseAge > 700 && w.caseAge <= 1000).length} work orders\n• 1000+ days: ${missingWorkOrders.filter(w => w.caseAge > 1000).length} work orders ⚠️ CRITICAL\n\nSLA penalty exposure estimated at $${(missingWorkOrders.filter(w => w.caseAge > 700).length * 1250).toLocaleString()} based on $1,250 per overdue case.`,
          dataForWidget: {
            chartType: 'bar',
            title: 'WO Age Distribution',
            data: [
              { name: '0-500d', count: missingWorkOrders.filter(w => w.caseAge <= 500).length },
              { name: '500-700d', count: missingWorkOrders.filter(w => w.caseAge > 500 && w.caseAge <= 700).length },
              { name: '700-1000d', count: missingWorkOrders.filter(w => w.caseAge > 700 && w.caseAge <= 1000).length },
              { name: '1000d+', count: missingWorkOrders.filter(w => w.caseAge > 1000).length },
            ],
            colors: ['#166534', '#B45309', '#B91C1C', '#7F1D1D'],
          },
        },
        {
          id: 'insight-wo-total',
          title: 'Open Work Orders KPI',
          type: 'kpi',
          expandedText: `**Work Order KPI**\n\n${woSummary.totalWOs} open work orders, all assigned to Edmonton AB segment. Average case age of ${woSummary.avgCaseAge} days is significantly above the 30-day SLA target.`,
          dataForWidget: {
            chartType: 'kpi',
            title: 'Open Work Orders',
            value: woSummary.totalWOs.toString(),
            subtitle: `Avg age: ${woSummary.avgCaseAge} days`,
            trend: 'down',
            delta: 'Target: 0 overdue',
          },
        },
      ],
    };
  }

  // --- ROI / Top Providers ---
  if (q.includes('roi') || q.includes('top') || q.includes('provider') || q.includes('fleet size')) {
    return {
      text: `**Service Provider Fleet Analysis — Top 5 by Size**\n\n${fleetSummary.top5Providers.map((p, i) => `${i + 1}. **${p.serviceProvider}** — ${p.truckCount} trucks (${p.trucksWithRFID} RFID-equipped, ${((p.trucksWithRFID / p.truckCount) * 100).toFixed(0)}% coverage)`).join('\n')}\n\nEdmonton AB dominates with **${edmonton ? ((edmonton.truckCount / fleetSummary.totalTrucks) * 100).toFixed(0) : 0}%** of total fleet.\n\nROI Consideration: Each RFID-equipped truck contributes an estimated $2,100/year in asset recovery savings. Edmonton AB alone represents ~$${edmonton ? (edmonton.truckCount * 2100).toLocaleString() : 0} in annual RFID ROI at full coverage.`,
      actionableInsights: [
        {
          id: 'insight-provider-fleet',
          title: 'Fleet Size by Provider',
          type: 'comparison',
          expandedText: `**Full provider breakdown:**\n\n${fleetSummary.providersBySize.map(p => `• ${p.serviceProvider}: ${p.truckCount} trucks`).join('\n')}`,
          dataForWidget: {
            chartType: 'bar',
            title: 'Fleet Size by Provider (Top 5)',
            data: fleetSummary.top5Providers.map(p => ({
              name: p.serviceProvider.length > 12 ? p.serviceProvider.substring(0, 12) + '…' : p.serviceProvider,
              trucks: p.truckCount,
            })),
            colors: ['#1D4ED8'],
          },
        },
        {
          id: 'insight-roi-estimate',
          title: 'RFID ROI Estimate',
          type: 'kpi',
          expandedText: `**RFID ROI Model**\n\nAt $2,100/year per RFID-equipped truck:\n• Current ROI: $${(fleetSummary.trucksWithRFID * 2100).toLocaleString()}/year\n• Full coverage ROI: $${(fleetSummary.totalTrucks * 2100).toLocaleString()}/year\n• Gap opportunity: $${(fleetSummary.trucksWithoutRFID * 2100).toLocaleString()}/year`,
          dataForWidget: {
            chartType: 'kpi',
            title: 'Annual RFID ROI',
            value: '$' + (fleetSummary.trucksWithRFID * 2100).toLocaleString(),
            subtitle: `${fleetSummary.trucksWithRFID} equipped trucks × $2,100`,
            trend: 'up',
            delta: '+$' + (fleetSummary.trucksWithoutRFID * 2100).toLocaleString() + ' potential',
          },
        },
      ],
    };
  }

  // --- Executive Summary ---
  if (q.includes('executive') || q.includes('summary') || q.includes('overview')) {
    return {
      text: `**Executive Summary — Rehrig Operations Intelligence**\n\n**Fleet Operations:**\n• ${fleetSummary.totalProviders} active service providers operating ${fleetSummary.totalTrucks} trucks\n• RFID tracking coverage: ${fleetSummary.rfidCoverage}% (${fleetSummary.trucksWithoutRFID} blind spots)\n• Largest provider: Edmonton AB (${edmonton?.truckCount || 0} trucks, ${edmontonCoverage}% RFID coverage)\n• Largest RFID gap: ${fleetSummary.largestGap?.serviceProvider} (${fleetSummary.largestGap?.trucksWithoutRFID} unequipped)\n\n**Work Order Health:**\n• ${woSummary.totalWOs} open work orders across Edmonton AB segment\n• Average case age: ${woSummary.avgCaseAge} days (critical threshold: 30 days)\n• ${woSummary.overdueWOs} cases exceed 700-day threshold\n• Top request type: ${woSummary.requestTypeBreakdown[0].type} (${woSummary.requestTypeBreakdown[0].count} cases)\n\n**Immediate Actions Required:**\n1. Close work orders exceeding 1,200 days\n2. Deploy RFID to ${fleetSummary.largestGap?.serviceProvider}'s ${fleetSummary.largestGap?.trucksWithoutRFID} unequipped trucks\n3. Review OBS-Bulk Pickup backlog (${woSummary.requestTypeBreakdown.find(r => r.type === 'OBS-Bulk Pickup')?.count || 0} cases, avg ${woSummary.requestTypeBreakdown.find(r => r.type === 'OBS-Bulk Pickup')?.avgAge || 0} days)`,
      actionableInsights: [
        {
          id: 'insight-fleet-kpi',
          title: 'Total Fleet Size',
          type: 'kpi',
          expandedText: `**Fleet KPI Details**\n\n${fleetSummary.totalTrucks} trucks across ${fleetSummary.totalProviders} providers. Network is growing at ~5% QoQ.`,
          dataForWidget: {
            chartType: 'kpi',
            title: 'Total Fleet',
            value: fleetSummary.totalTrucks.toString(),
            subtitle: `${fleetSummary.totalProviders} service providers`,
            trend: 'up',
            delta: '+5% QoQ',
          },
        },
        {
          id: 'insight-wo-by-type',
          title: 'Work Orders by Type',
          type: 'breakdown',
          expandedText: `**WO Type Breakdown:**\n${woSummary.requestTypeBreakdown.map(r => `• ${r.type}: ${r.count} (avg age: ${r.avgAge} days)`).join('\n')}`,
          dataForWidget: {
            chartType: 'bar',
            title: 'Work Orders by Request Type',
            data: woSummary.requestTypeBreakdown.map(r => ({
              name: r.type.length > 18 ? r.type.substring(0, 18) + '…' : r.type,
              count: r.count,
              avgAge: r.avgAge,
            })),
            colors: ['#B45309'],
          },
        },
      ],
    };
  }

  // --- Edmonton / Specific Provider ---
  if (q.includes('edmonton')) {
    return {
      text: `**Edmonton AB — Deep Dive**\n\n**Fleet:**\n• ${edmonton?.truckCount || 0} trucks (largest in network)\n• ${edmonton?.trucksWithRFID || 0} with RFID (${edmontonCoverage}%), ${edmonton?.trucksWithoutRFID || 0} without\n\n**Work Orders:**\n• All ${woSummary.totalWOs} open work orders are in the Edmonton AB segment\n• Dispatch centers: ${woSummary.dispatchBreakdown.map(d => `${d.dispatch} (${d.count})`).join(', ')}\n• Most common: ${woSummary.requestTypeBreakdown.slice(0, 3).map(r => `${r.type} (${r.count})`).join(', ')}\n\n**Critical Alert:** ${missingWorkOrders.filter(w => w.caseAge > 1200).length} cases exceed 1,200 days.`,
      actionableInsights: [
        {
          id: 'insight-edmonton-dispatch',
          title: 'Edmonton Dispatch Distribution',
          type: 'operational',
          expandedText: `**Dispatch Center Load:**\n${woSummary.dispatchBreakdown.map(d => `• ${d.dispatch}: ${d.count} work orders`).join('\n')}\n\n${woSummary.dispatchBreakdown[0]?.dispatch} is overloaded with ${woSummary.dispatchBreakdown[0]?.count} active work orders.`,
          dataForWidget: {
            chartType: 'bar',
            title: 'WOs by Dispatch Center',
            data: woSummary.dispatchBreakdown.map(d => ({ name: d.dispatch, count: d.count })),
            colors: ['#1D4ED8'],
          },
        },
        {
          id: 'insight-edmonton-fleet',
          title: 'Edmonton Fleet Breakdown',
          type: 'kpi',
          expandedText: `Edmonton AB operates the largest fleet in the network at ${edmonton?.truckCount || 0} trucks.`,
          dataForWidget: {
            chartType: 'kpi',
            title: 'Edmonton AB Fleet',
            value: String(edmonton?.truckCount || 0),
            subtitle: `${edmonton?.trucksWithRFID || 0} RFID-equipped (${edmontonCoverage}%)`,
            trend: 'stable',
            delta: `${edmonton?.trucksWithoutRFID || 0} need RFID`,
          },
        },
      ],
    };
  }

  // --- Bulk Pickup / OBS ---
  if (q.includes('bulk') || q.includes('obs') || q.includes('pickup')) {
    const bulkWOs = missingWorkOrders.filter(w => w.requestType === 'OBS-Bulk Pickup');
    return {
      text: `**OBS-Bulk Pickup Backlog Analysis**\n\n**${bulkWOs.length} pending bulk pickup orders:**\n${bulkWOs.map((w, i) => `${i + 1}. WO #${w.woNumber} — ${w.address} — ${w.caseAge} days old (Dispatch: ${w.dispatchNumber})`).join('\n')}\n\n**Pattern detected:** ${bulkWOs.filter(w => /dallas|mockingbird|pulaski/i.test(w.address)).length} of ${bulkWOs.length} orders are in the Dallas TX area. Consider batch dispatching.\n\nAverage age: ${bulkWOs.length ? Math.round(bulkWOs.reduce((s, w) => s + w.caseAge, 0) / bulkWOs.length) : 0} days.`,
      actionableInsights: [
        {
          id: 'insight-bulk-cluster',
          title: 'Dallas TX Clustering',
          type: 'geographic',
          expandedText: `**Geographic Cluster Alert**\n\n${bulkWOs.filter(w => /dallas|mockingbird|pulaski/i.test(w.address)).length} bulk pickup WOs in the Dallas TX corridor. Batch dispatch could reduce per-WO cost by ~40%.`,
          dataForWidget: {
            chartType: 'bar',
            title: 'Bulk Pickup by Location',
            data: [
              { name: 'Dallas TX', count: bulkWOs.filter(w => /dallas|mockingbird|pulaski/i.test(w.address)).length },
              { name: 'Edmonton AB', count: bulkWOs.filter(w => /edmonton/i.test(w.address)).length },
              { name: 'Other', count: bulkWOs.filter(w => !/dallas|mockingbird|pulaski|edmonton/i.test(w.address)).length },
            ],
            colors: ['#B45309'],
          },
        },
      ],
    };
  }

  // --- Cart Repair ---
  if (q.includes('cart') || q.includes('repair')) {
    const repairWOs = missingWorkOrders.filter(w => w.requestType.includes('Repair'));
    return {
      text: `**Cart Repair Work Order Analysis**\n\n**${repairWOs.length} repair orders outstanding:**\n${repairWOs.map((w, i) => `${i + 1}. WO #${w.woNumber} — ${w.requestType} — ${w.caseAge} days — ${w.address}`).join('\n')}\n\nAverage repair case age: **${repairWOs.length ? Math.round(repairWOs.reduce((s, w) => s + w.caseAge, 0) / repairWOs.length) : 0} days**\n\nBreakdown:\n${Object.entries(repairWOs.reduce((acc, w) => { acc[w.requestType] = (acc[w.requestType] || 0) + 1; return acc; }, {})).map(([t, c]) => `• ${t}: ${c} orders`).join('\n')}`,
      actionableInsights: [
        {
          id: 'insight-repair-types',
          title: 'Repair Order Breakdown',
          type: 'operational',
          expandedText: `Repair work orders are concentrated in the Edmonton AB segment, suggesting a possible equipment quality or staffing issue.`,
          dataForWidget: {
            chartType: 'bar',
            title: 'Repair Orders by Sub-Type',
            data: Object.entries(repairWOs.reduce((acc, w) => { acc[w.requestType] = (acc[w.requestType] || 0) + 1; return acc; }, {})).map(([name, count]) => ({
              name: name.length > 18 ? name.substring(0, 18) + '…' : name,
              count,
            })),
            colors: ['#B91C1C'],
          },
        },
      ],
    };
  }

  // --- Dispatch ---
  if (q.includes('dispatch')) {
    return {
      text: `**Dispatch Center Analysis**\n\n${woSummary.dispatchBreakdown.map(d => `• **${d.dispatch}**: ${d.count} open work order${d.count > 1 ? 's' : ''}`).join('\n')}\n\n**Most loaded:** D-05960 with ${woSummary.dispatchBreakdown[0]?.count || 0} active orders.\n\nAll dispatches are within the Edmonton AB segment. Dispatch D-05960 handles OBS (Organic/Bulk/Special) type work orders exclusively.`,
      actionableInsights: [
        {
          id: 'insight-dispatch-load',
          title: 'Dispatch Load Distribution',
          type: 'operational',
          expandedText: `${woSummary.dispatchBreakdown[0]?.dispatch} is carrying ${woSummary.totalWOs ? ((woSummary.dispatchBreakdown[0].count / woSummary.totalWOs) * 100).toFixed(1) : 0}% of all open work orders. Consider redistributing load across other dispatches.`,
          dataForWidget: {
            chartType: 'bar',
            title: 'Work Orders by Dispatch',
            data: woSummary.dispatchBreakdown.map(d => ({ name: d.dispatch, count: d.count })),
            colors: ['#1D4ED8'],
          },
        },
      ],
    };
  }

  // --- Oldest WOs ---
  if (q.includes('oldest') || q.includes('immediate') || q.includes('attention')) {
    const oldest = [...missingWorkOrders].sort((a, b) => b.caseAge - a.caseAge).slice(0, 5);
    return {
      text: `**Top 5 Oldest Open Work Orders**\n\n${oldest.map((w, i) => `${i + 1}. **WO #${w.woNumber}** — ${w.requestType}\n   📍 ${w.address}\n   ⏱️ ${w.caseAge} days old | Created: ${w.requestDate}\n   📋 Dispatch: ${w.dispatchNumber} | Created by: ${w.createdBy}`).join('\n\n')}\n\n⚠️ These 5 cases represent the highest SLA risk in the network. Immediate escalation recommended.`,
      actionableInsights: [
        {
          id: 'insight-oldest-wos',
          title: 'Critical WO Aging',
          type: 'risk-analysis',
          expandedText: `The two cases exceeding 1,200 days appear to be legacy cases that may need to be closed or reclassified rather than serviced.`,
          dataForWidget: {
            chartType: 'bar',
            title: 'Top 5 Oldest Work Orders',
            data: oldest.map(w => ({ name: '#' + w.woNumber.slice(-4), days: w.caseAge })),
            colors: ['#B91C1C'],
          },
        },
      ],
    };
  }

  // --- Geographic / Hotspots ---
  if (q.includes('geographic') || q.includes('cluster') || q.includes('hotspot') || q.includes('address')) {
    return {
      text: (() => {
        const dallas = missingWorkOrders.filter(w => /dallas|mockingbird|pulaski|richardson/i.test(w.address));
        const edm = missingWorkOrders.filter(w => /edmonton/i.test(w.address));
        const other = woSummary.totalWOs - dallas.length - edm.length;
        return `**Geographic Clustering Analysis**\n\nWork orders cluster around primary zones:\n\n🔴 **Dallas / Richardson TX** — ${dallas.length} work orders\n🟡 **Edmonton AB** — ${edm.length} work orders\n⚪ **Other** — ${other} work orders\n\n**Recommendation:** Batch dispatching clustered addresses can clear multiple WOs in a single route.`;
      })(),
      actionableInsights: [
        {
          id: 'insight-geo-clusters',
          title: 'WO Geographic Clusters',
          type: 'geographic',
          expandedText: `Geographic clustering in open work orders suggests neighborhood-level service gaps that batch dispatching can address.`,
          dataForWidget: {
            chartType: 'bar',
            title: 'Work Orders by Region',
            data: [
              { name: 'Dallas TX', count: missingWorkOrders.filter(w => /dallas|mockingbird|pulaski|richardson/i.test(w.address)).length },
              { name: 'Edmonton AB', count: missingWorkOrders.filter(w => /edmonton/i.test(w.address)).length },
              { name: 'Other', count: missingWorkOrders.filter(w => !/dallas|mockingbird|pulaski|richardson|edmonton/i.test(w.address)).length },
            ],
            colors: ['#B91C1C', '#B45309', '#166534'],
          },
        },
      ],
    };
  }

  // --- Case Age Distribution ---
  if (q.includes('case age') || q.includes('distribution') || q.includes('breakdown')) {
    return {
      text: `**Case Age Distribution — All Open Work Orders**\n\n| Range | Count | % of Total |\n|-------|-------|------------|\n| 0–500 days | ${missingWorkOrders.filter(w => w.caseAge <= 500).length} | ${((missingWorkOrders.filter(w => w.caseAge <= 500).length / woSummary.totalWOs) * 100).toFixed(0)}% |\n| 501–700 days | ${missingWorkOrders.filter(w => w.caseAge > 500 && w.caseAge <= 700).length} | ${((missingWorkOrders.filter(w => w.caseAge > 500 && w.caseAge <= 700).length / woSummary.totalWOs) * 100).toFixed(0)}% |\n| 701–1000 days | ${missingWorkOrders.filter(w => w.caseAge > 700 && w.caseAge <= 1000).length} | ${((missingWorkOrders.filter(w => w.caseAge > 700 && w.caseAge <= 1000).length / woSummary.totalWOs) * 100).toFixed(0)}% |\n| 1000+ days | ${missingWorkOrders.filter(w => w.caseAge > 1000).length} | ${((missingWorkOrders.filter(w => w.caseAge > 1000).length / woSummary.totalWOs) * 100).toFixed(0)}% |\n\nMean: **${woSummary.avgCaseAge} days** | Median: ~690 days | Max: **${woSummary.maxCaseAge} days**`,
      actionableInsights: [
        {
          id: 'insight-age-dist',
          title: 'Case Age Histogram',
          type: 'analysis',
          expandedText: `The distribution is heavily right-skewed, with 2 extreme outliers above 1,200 days pulling the mean upward.`,
          dataForWidget: {
            chartType: 'bar',
            title: 'Case Age Distribution',
            data: [
              { name: '0-500d', count: missingWorkOrders.filter(w => w.caseAge <= 500).length },
              { name: '501-700d', count: missingWorkOrders.filter(w => w.caseAge > 500 && w.caseAge <= 700).length },
              { name: '701-1000d', count: missingWorkOrders.filter(w => w.caseAge > 700 && w.caseAge <= 1000).length },
              { name: '1000d+', count: missingWorkOrders.filter(w => w.caseAge > 1000).length },
            ],
            colors: ['#166534', '#B45309', '#B91C1C', '#7F1D1D'],
          },
        },
      ],
    };
  }

  // --- Default / Fallback ---
  return {
    text: `**Analysis Complete**\n\nI analyzed your query across ${fleetSummary.totalTrucks} fleet assets and ${woSummary.totalWOs} open work orders.\n\n**Key metrics:**\n• Fleet RFID coverage: ${fleetSummary.rfidCoverage}%\n• Open work orders: ${woSummary.totalWOs}\n• Average WO age: ${woSummary.avgCaseAge} days\n• Critical overdue: ${woSummary.overdueWOs}\n\nTry asking about specific topics like "RFID coverage gaps", "SLA risk", "Edmonton deep dive", or "dispatch bottlenecks" for more targeted insights.`,
    actionableInsights: [
      {
        id: 'insight-summary-fleet',
        title: 'Fleet Overview',
        type: 'kpi',
        expandedText: `${fleetSummary.totalTrucks} trucks across ${fleetSummary.totalProviders} service providers.`,
        dataForWidget: {
          chartType: 'kpi',
          title: 'Fleet Size',
          value: fleetSummary.totalTrucks.toString(),
          subtitle: `${fleetSummary.totalProviders} providers`,
          trend: 'stable',
          delta: 'Baseline',
        },
      },
    ],
  };
}
