/**
 * Normalize mock agent output into:
 * Summary → Table/list → Chart → Analysis → Recommendation → Suggested questions
 */

import { reportContext } from './preloadedReports';

const { fleetSummary, woSummary, gapProviders } = reportContext;

const SOURCE_CATALOG = [
  { match: /rfid|coverage|unequipp|fleet|truck|provider/i, source: 'Fleet Excel · RFID', confidence: 'high' },
  { match: /work order|wo\b|sla|overdue|case age|dispatch|missing/i, source: 'Missing WO Excel', confidence: 'high' },
  { match: /estimat|approx|~|roi|forecast|model|potential/i, source: 'Derived model', confidence: 'prov' },
  { match: /edmonton|dallas|address|geo/i, source: 'WO geo fields', confidence: 'high' },
  { match: /%/i, source: 'Aggregated metric', confidence: 'prov' },
];

export function shapeAgentResponse(result, query = '') {
  const fullText = result?.text || '';
  const insights = result?.actionableInsights || [];
  const sections = buildSections(fullText, insights, query);
  const intent = buildIntent(query);
  const sources = mergeSources(
    result?.sources || buildSourcesFromText(fullText),
    buildMetricReceipts(query, sections.summary)
  );

  return {
    summary: sections.summary,
    sections,
    intent,
    detail: fullText,
    sources,
    actionableInsights: insights,
    text: sections.summary,
    follows: sections.follows,
  };
}

/** Intent card: how Vision read the question + scope chips */
export function buildIntent(query = '') {
  const raw = String(query || '').trim();
  const q = raw.toLowerCase();
  const trucks = fleetSummary.totalTrucks?.toLocaleString?.() || String(fleetSummary.totalTrucks);
  const gap = fleetSummary.largestGap?.serviceProvider || 'top gap provider';

  let read;
  let chips;

  // Prefer specific topics before broad RFID/Edmonton matches
  if (q.includes('bulk') || q.includes('obs-bulk') || (q.includes('pickup') && q.includes('backlog'))) {
    read =
      'I read this as the **OBS-Bulk Pickup** backlog — pending bulk pickup orders, geographic clusters, and case age.';
    chips = [
      ['Scope', 'Edmonton AB · OBS-Bulk Pickup'],
      ['Metric', 'Open bulk WOs'],
      ['Window', 'Current backlog'],
      ['Grain', 'Address → dispatch'],
    ];
  } else if (q.includes('rfid') || q.includes('coverage') || q.includes('unequipp') || q.includes('no rfid') || q.includes('missing rfid')) {
    read =
      'I read this as trucks with **no RFID reader fitted** (empty RFID Reader field), excluding maintenance vehicles — so you can see where collections can’t be confirmed electronically.';
    chips = [
      ['Scope', `Fleet · ${trucks} trucks`],
      ['Metric', 'Trucks missing RFID'],
      ['Filter', 'Excl. maintenance vehicles'],
      ['Grain', 'Truck → account'],
    ];
  } else if (q.includes('sla') || q.includes('overdue') || q.includes('aging') || q.includes('risk')) {
    read =
      'I read “risk / overdue” as **open work orders** past the **700-day** age threshold in the Missing WO extract, ranked by case age.';
    chips = [
      ['Scope', `Edmonton AB · ${woSummary.totalWOs} open WOs`],
      ['Metric', 'Overdue WOs & case age'],
      ['Window', 'Open backlog'],
      ['Filter', 'Status = Open · age > 700d'],
    ];
  } else if (q.includes('edmonton')) {
    read =
      'I read this as a drill into **Edmonton AB** — fleet RFID gaps and the open work-order backlog for that segment, with dispatch + unequipped trucks.';
    chips = [
      ['Scope', 'Service Provider · Edmonton AB'],
      ['Metric', 'RFID gaps + open WOs'],
      ['Window', 'Current extract'],
      ['Grain', 'Truck → dispatch'],
    ];
  } else if (q.includes('dispatch')) {
    read =
      'I read this as ranking **dispatch centers** by unresolved Missing WO load and flagging overloaded queues.';
    chips = [
      ['Scope', `Edmonton AB · ${woSummary.dispatchBreakdown?.length || 0} dispatches`],
      ['Metric', 'Open WOs by dispatch'],
      ['Window', 'Current backlog'],
      ['Filter', 'Status = Open'],
    ];
  } else if (q.includes('provider') || q.includes('top') || q.includes('fleet size')) {
    read = `I read this as comparing **service providers by fleet size** and RFID coverage. Largest gap focus: **${gap}**.`;
    chips = [
      ['Scope', `${fleetSummary.totalProviders} providers · ${trucks} trucks`],
      ['Metric', 'Fleet size & RFID %'],
      ['Window', 'Current fleet extract'],
      ['Grain', 'Provider'],
    ];
  } else if (q.includes('executive') || q.includes('summary') || q.includes('overview')) {
    read =
      'I read this as an **executive overview** across fleet RFID coverage and open work orders — portfolio health, not a single-ticket drill.';
    chips = [
      ['Scope', `Network · ${fleetSummary.totalProviders} providers`],
      ['Metric', 'Coverage + WO health'],
      ['Window', 'Current extracts'],
      ['Grain', 'Portfolio'],
    ];
  } else {
    read =
      'I’ll resolve intent against the fleet and Missing WO extracts, enforce Service Provider scope, then assemble evidence.';
    chips = [
      ['Scope', `Service Provider · ${trucks} trucks`],
      ['Metric', 'Ops signal'],
      ['Window', 'Current extracts'],
      ['Grain', 'Provider → truck'],
    ];
  }

  return {
    query: raw,
    read,
    chips,
  };
}

function buildSections(fullText, insights, query) {
  const q = (query || '').toLowerCase();
  const barInsight = insights.find((i) => i.dataForWidget?.chartType === 'bar');
  const kpiInsight = insights.find((i) => i.dataForWidget?.chartType === 'kpi');

  const summary = buildSummaryParagraph(fullText, query, kpiInsight);
  const table = buildTable(barInsight, insights, q);
  const chart = buildChart(barInsight, q);
  const analysis = buildAnalysisParagraphs(fullText, insights);
  const recommendations = buildRecommendations(fullText, insights, q);
  const follows = buildFollowUps(query);

  return {
    summary,
    table,
    chart,
    analysis,
    recommendations,
    follows,
  };
}

/** Compact prose summary — Claude-style paragraphs with highlighted metric claims */
function buildSummaryParagraph(fullText, query, kpiInsight) {
  const q = (query || '').toLowerCase();
  const providers = fleetSummary.totalProviders;
  const trucks = fleetSummary.totalTrucks.toLocaleString();
  const coverage = fleetSummary.rfidCoverage;
  const unequipped = fleetSummary.trucksWithoutRFID;
  const gap = fleetSummary.largestGap;

  // RFID / coverage — explicit claims the user expects highlighted
  if (
    q.includes('rfid') ||
    q.includes('coverage') ||
    q.includes('unequipp') ||
    q.includes('fleet coverage') ||
    q.includes('no rfid')
  ) {
    return (
      `Across **${providers} service providers** and **${trucks} trucks**, RFID reader coverage stands at **${coverage}%**. ` +
      `**${unequipped} unequipped trucks** create a tracking blind spot` +
      (gap
        ? ` — largest gap at **${gap.serviceProvider}** (${gap.trucksWithoutRFID} unequipped).`
        : '.')
    );
  }

  if (q.includes('sla') || q.includes('overdue') || q.includes('aging') || q.includes('risk')) {
    return (
      `**${woSummary.totalWOs} open work orders** sit at an average case age of **${woSummary.avgCaseAge} days**. ` +
      `**${woSummary.overdueWOs} overdue cases** exceed the 700-day threshold (oldest **${woSummary.maxCaseAge} days**).`
    );
  }

  if (!fullText) {
    return 'I reviewed the available fleet and work-order data for this question. Open the detail pane for the full breakdown.';
  }

  const lines = fullText.split('\n').map((l) => l.trim()).filter(Boolean);
  const prose = lines.filter(
    (l) =>
      !l.startsWith('•') &&
      !l.startsWith('-') &&
      !l.startsWith('–') &&
      !l.startsWith('#') &&
      !/^\d+\./.test(l) &&
      !l.startsWith('|') &&
      !/^recommendation:/i.test(l) &&
      !/^immediate /i.test(l)
  );

  const lead = keepBold(prose[1] || prose[0] || '');
  const support = keepBold(prose[2] || '');
  const kpiBit = kpiInsight?.dataForWidget
    ? ` Current signal: **${kpiInsight.dataForWidget.value}** (${kpiInsight.dataForWidget.subtitle || kpiInsight.title}).`
    : '';

  let para = lead;
  if (support && stripMd(support).length > 20 && stripMd(support) !== stripMd(lead)) {
    para = `${lead} ${support}`;
  }
  para = para.replace(/\s+/g, ' ').trim();
  if (kpiBit && !para.includes(String(kpiInsight.dataForWidget.value))) {
    para += kpiBit;
  }

  if (para.length > 420) {
    const cut = para.slice(0, 417);
    const lastBold = cut.lastIndexOf('**');
    para = `${(lastBold > 300 ? cut.slice(0, lastBold) : cut).replace(/\s+\S*$/, '')}…`;
  }

  return para || `Operational read on “${truncate(query, 48)}”. See the table and chart below for the detail.`;
}

/** Receipt metadata for highlighted summary metrics */
function buildMetricReceipts(query, summary) {
  const q = (query || '').toLowerCase();
  const receipts = [];

  const push = (claim, conf, source, computed, note) => {
    receipts.push({
      id: `rcpt-${receipts.length}`,
      claim,
      confidence: conf,
      source,
      computed,
      note,
    });
  };

  if (
    q.includes('rfid') ||
    q.includes('coverage') ||
    q.includes('unequipp') ||
    q.includes('fleet') ||
    /\d+\s+service providers/i.test(summary || '')
  ) {
    push(
      `${fleetSummary.totalProviders} service providers`,
      'high',
      'Fleet Excel · Providers',
      `COUNT(DISTINCT service_provider) = ${fleetSummary.totalProviders}`,
      'Direct count from Customers with Truck and/or Cameras extract.'
    );
    push(
      `${fleetSummary.totalTrucks.toLocaleString()} trucks`,
      'high',
      'Fleet Excel · Trucks',
      `SUM(truck_count) = ${fleetSummary.totalTrucks}`,
      'Device-logged fleet rows — not estimated.'
    );
    push(
      `${fleetSummary.rfidCoverage}%`,
      'high',
      'Fleet Excel · RFID',
      `trucks_with_rfid ÷ total_trucks × 100 = ${fleetSummary.trucksWithRFID} ÷ ${fleetSummary.totalTrucks} × 100`,
      'Re-aggregated from truck RFID Reader field (non-empty = equipped).'
    );
    push(
      `${fleetSummary.trucksWithoutRFID} unequipped trucks`,
      'high',
      'Fleet Excel · RFID gaps',
      `COUNT(RFID Reader IS EMPTY) = ${fleetSummary.trucksWithoutRFID}`,
      'Empty RFID Reader field; maintenance vehicles excluded in intent filter.'
    );
    if (fleetSummary.largestGap) {
      push(
        fleetSummary.largestGap.serviceProvider,
        'high',
        'Fleet Excel · Largest gap',
        `${fleetSummary.largestGap.serviceProvider}: ${fleetSummary.largestGap.trucksWithoutRFID} unequipped of ${fleetSummary.largestGap.truckCount}`,
        'Provider with max unequipped truck count.'
      );
    }
  }

  if (q.includes('sla') || q.includes('overdue') || q.includes('aging') || q.includes('risk')) {
    push(
      `${woSummary.totalWOs} open work orders`,
      'high',
      'Missing WO Excel',
      `COUNT(*) WHERE status=Open = ${woSummary.totalWOs}`,
      'All rows in Missing WO extract for Edmonton AB.'
    );
    push(
      `${woSummary.avgCaseAge} days`,
      'high',
      'Missing WO Excel · Case age',
      `AVG(case_age) = ${woSummary.avgCaseAge}`,
      'Mean of open case ages in days.'
    );
    push(
      `${woSummary.overdueWOs} overdue cases`,
      'high',
      'Missing WO Excel · SLA',
      `COUNT(case_age > 700) = ${woSummary.overdueWOs}`,
      '700-day threshold applied as SLA overdue rule.'
    );
    push(
      `${woSummary.maxCaseAge} days`,
      'high',
      'Missing WO Excel · Oldest',
      `MAX(case_age) = ${woSummary.maxCaseAge}`,
      'Oldest open work order in the extract.'
    );
  }

  return receipts;
}

function mergeSources(base = [], receipts = []) {
  const out = [...base];
  receipts.forEach((r) => {
    const idx = out.findIndex((s) => s.claim.toLowerCase() === r.claim.toLowerCase());
    if (idx >= 0) {
      out[idx] = { ...out[idx], ...r };
    } else {
      out.push(r);
    }
  });
  return out;
}

function buildTable(barInsight, insights, q) {
  // Prefer provider RFID table when relevant
  if (q.includes('rfid') || q.includes('coverage') || q.includes('unequipp') || q.includes('provider') || q.includes('fleet')) {
    const rows = (fleetSummary.top5Providers || []).map((p) => {
      const cov = p.truckCount ? ((p.trucksWithRFID / p.truckCount) * 100).toFixed(0) : '0';
      const behind = p.trucksWithoutRFID > 0;
      return {
        cells: [
          p.serviceProvider,
          String(p.truckCount),
          String(p.trucksWithRFID),
          String(p.trucksWithoutRFID),
          `${cov}%`,
          behind ? { pill: p.trucksWithoutRFID >= 5 ? 'r' : 'a', text: behind ? 'Gap' : 'OK' } : { pill: 'g', text: 'On track' },
        ],
        flag: behind && p.trucksWithoutRFID >= 5,
      };
    });
    return {
      title: 'Service providers — fleet & RFID',
      cols: ['Service Provider', 'Trucks', 'With RFID', 'Without', 'Coverage', 'Status'],
      rows,
      note: 'Sorted by fleet size. Flagged rows have the largest unequipped gaps.',
    };
  }

  if (q.includes('sla') || q.includes('overdue') || q.includes('aging') || q.includes('work order')) {
    if (barInsight?.dataForWidget?.data) {
      return {
        title: barInsight.dataForWidget.title || 'Work order breakdown',
        cols: ['Bucket', 'Count', 'Share', 'Status'],
        rows: barInsight.dataForWidget.data.map((d) => {
          const key = Object.keys(d).find((k) => k !== 'name' && typeof d[k] === 'number');
          const n = key ? d[key] : 0;
          const total = woSummary.totalWOs || 1;
          const share = `${((n / total) * 100).toFixed(0)}%`;
          const hot = /1000|700|overdue/i.test(d.name);
          return {
            cells: [
              d.name,
              String(n),
              share,
              { pill: hot ? 'r' : n > 0 ? 'a' : 'g', text: hot ? 'Critical' : 'Watch' },
            ],
            flag: hot,
          };
        }),
        note: `Edmonton AB segment · ${woSummary.totalWOs} open WOs · avg age ${woSummary.avgCaseAge}d`,
      };
    }
  }

  if (barInsight?.dataForWidget?.data) {
    const sample = barInsight.dataForWidget.data[0] || {};
    const valueKeys = Object.keys(sample).filter((k) => k !== 'name' && typeof sample[k] === 'number');
    return {
      title: barInsight.dataForWidget.title || 'Breakdown',
      cols: ['Name', ...valueKeys],
      rows: barInsight.dataForWidget.data.map((d) => ({
        cells: [d.name, ...valueKeys.map((k) => String(d[k]))],
        flag: false,
      })),
      note: null,
    };
  }

  // Fallback list from top gap providers
  if (gapProviders?.length) {
    return {
      title: 'Largest RFID gaps',
      cols: ['Service Provider', 'Unequipped', 'Fleet', 'Coverage'],
      rows: gapProviders.slice(0, 6).map((p) => ({
        cells: [
          p.serviceProvider,
          String(p.trucksWithoutRFID),
          String(p.truckCount),
          `${((p.trucksWithRFID / p.truckCount) * 100).toFixed(0)}%`,
        ],
        flag: p.trucksWithoutRFID >= 5,
      })),
      note: 'Providers with unequipped trucks, ranked by gap size.',
    };
  }

  return null;
}

function buildChart(barInsight, q) {
  if (!barInsight?.dataForWidget?.data?.length) {
    // Synthesize from top gaps
    if (gapProviders?.length && (q.includes('rfid') || q.includes('coverage') || q.includes('provider'))) {
      const data = gapProviders.slice(0, 6).map((p) => ({
        l: p.serviceProvider.length > 10 ? `${p.serviceProvider.slice(0, 9)}…` : p.serviceProvider,
        v: p.trucksWithoutRFID,
        c: p.trucksWithoutRFID >= 5 ? 'hi' : 'ok',
      }));
      return {
        title: 'Unequipped trucks by provider',
        data,
        cap: 'Higher bars = larger RFID blind spots.',
        unit: '',
      };
    }
    return null;
  }

  const rows = barInsight.dataForWidget.data;
  const valueKeys = Object.keys(rows[0] || {}).filter((k) => k !== 'name' && typeof rows[0][k] === 'number');
  // Prefer "Without RFID" / unequipped / count as the chart metric
  const prefer =
    valueKeys.find((k) => /without|unequipp|gap|overdue|count|days/i.test(k)) || valueKeys[0];
  if (!prefer) return null;

  const data = rows.slice(0, 8).map((d) => {
    const v = d[prefer];
    const hi = /without|unequipp|overdue|1000|700/i.test(prefer) || /1000|700|SE |overdue/i.test(d.name);
    return {
      l: String(d.name).length > 11 ? `${String(d.name).slice(0, 10)}…` : String(d.name),
      v: Number(v) || 0,
      c: hi && v > 0 ? 'hi' : 'ok',
    };
  });

  return {
    title: barInsight.dataForWidget.title || 'Distribution',
    data,
    cap: `Showing ${prefer} across the top series.`,
    unit: prefer.includes('%') ? '%' : '',
  };
}

function buildAnalysisParagraphs(fullText, insights) {
  const paras = [];

  // Prefer expanded insight prose, converted to paragraphs
  insights.forEach((ins) => {
    if (!ins.expandedText) return;
    const cleaned = ins.expandedText
      .replace(/\*\*/g, '')
      .replace(/^#{1,3}\s+/gm, '')
      .trim();
    const chunks = cleaned
      .split(/\n\n+/)
      .map((c) =>
        c
          .split('\n')
          .map((l) => l.replace(/^[•\-–]\s*/, '').replace(/^\d+\.\s*/, '').trim())
          .filter(Boolean)
          .join(' ')
      )
      .map((p) => p.replace(/\s+/g, ' ').trim())
      .filter((p) => p.length > 40 && !/^recommendation/i.test(p));

    chunks.slice(0, 2).forEach((p) => {
      if (!paras.some((x) => x.slice(0, 40) === p.slice(0, 40))) paras.push(emphasizeKeyPhrases(p));
    });
  });

  if (paras.length === 0) {
    const prose = fullText
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l && !l.startsWith('•') && !l.startsWith('#') && !/^\d+\./.test(l));
    const joined = stripMd(prose.slice(1, 3).join(' '));
    if (joined.length > 40) paras.push(emphasizeKeyPhrases(joined));
  }

  if (paras.length === 0) {
    paras.push(
      emphasizeKeyPhrases(
        `The signal is concentrated rather than evenly spread. Focus on the flagged rows in the table — that is where intervention moves the portfolio metric fastest.`
      )
    );
  }

  return paras.slice(0, 2);
}

function buildRecommendations(fullText, insights, q) {
  const recs = [];
  const text = `${fullText}\n${insights.map((i) => i.expandedText || '').join('\n')}`;

  const recLine = text.match(/recommendation[:\s]+([^\n]+)/i);
  if (recLine) recs.push(emphasizeKeyPhrases(stripMd(recLine[1])));

  const immediate = text.match(/immediate[^\n]*:\s*([^\n]+)/i);
  if (immediate) recs.push(emphasizeKeyPhrases(stripMd(immediate[1])));

  // Numbered action lines
  const actions = [...text.matchAll(/^\d+\.\s+(.+)$/gm)].map((m) => stripMd(m[1]));
  actions.slice(0, 3).forEach((a) => {
    if (a.length > 20 && !recs.includes(a)) recs.push(emphasizeKeyPhrases(a));
  });

  if (recs.length === 0) {
    if (q.includes('rfid') || q.includes('coverage')) {
      recs.push(
        emphasizeKeyPhrases(
          `Prioritize RFID deployment to **${fleetSummary.largestGap?.serviceProvider || 'the largest gap provider'}** — it closes the biggest visibility blind spot in one move.`
        )
      );
      recs.push(
        emphasizeKeyPhrases(
          `Leave fully covered providers alone this cycle; put install capacity on unequipped fleets first.`
        )
      );
    } else if (q.includes('sla') || q.includes('overdue') || q.includes('work order')) {
      recs.push(
        emphasizeKeyPhrases(
          `Escalate the **${woSummary.overdueWOs} overdue** cases past 700 days — start with those over 1,000 days.`
        )
      );
      recs.push(
        emphasizeKeyPhrases(
          `Batch-clear geographic clusters (Dallas / Edmonton) so one dispatch run closes multiple WOs.`
        )
      );
    } else {
      recs.push(
        emphasizeKeyPhrases(
          `Act on the flagged rows first — that is where effort clears the most risk for the portfolio.`
        )
      );
    }
  }

  return recs.slice(0, 3);
}

function normalizeQuestion(text = '') {
  return String(text)
    .toLowerCase()
    .replace(/[?“”"']/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function buildFollowUps(query = '') {
  const q = (query || '').toLowerCase();
  const current = normalizeQuestion(query);

  let pool;
  if (q.includes('bulk') || q.includes('obs-bulk') || (q.includes('pickup') && q.includes('backlog'))) {
    pool = [
      'Which dispatch centers handle the most OBS-Bulk Pickup work orders?',
      'List the 5 oldest open work orders',
      'Show overdue work orders grouped by request type',
    ];
  } else if (
    (q.includes('edmonton') && (q.includes('rfid') || q.includes('missing') || q.includes('unequipp'))) ||
    (q.includes('trucks in edmonton') && q.includes('rfid'))
  ) {
    // Already asked Edmonton RFID gaps — offer adjacent drills, not the same question
    pool = [
      'Which providers have the largest RFID gaps?',
      "What's the fleet RFID coverage gap across all service providers?",
      'Show overdue work orders for Edmonton AB',
    ];
  } else if (q.includes('rfid') || q.includes('coverage') || q.includes('unequipp')) {
    pool = [
      'Which trucks in Edmonton AB are missing RFID readers?',
      'Which providers have the largest RFID gaps?',
      'Give me an executive summary of fleet and work orders',
    ];
  } else if (q.includes('sla') || q.includes('overdue') || q.includes('aging')) {
    pool = [
      'List the 5 oldest open work orders',
      "What's the OBS-Bulk Pickup backlog, and where are the open orders clustered?",
      'Which dispatch centers have the most unresolved work orders?',
    ];
  } else if (q.includes('edmonton')) {
    pool = [
      'Which trucks in Edmonton AB are missing RFID readers?',
      'Show overdue work orders for Edmonton AB',
      'Which dispatch centers have the most unresolved work orders?',
    ];
  } else if (q.includes('provider') || q.includes('top') || q.includes('fleet size')) {
    pool = [
      "What's the fleet RFID coverage gap across all service providers?",
      'Which providers have the largest RFID gaps?',
      'Deep dive into Edmonton AB fleet and work orders',
    ];
  } else {
    pool = [
      "What's the fleet RFID coverage gap across all service providers?",
      'Which open work orders pose the highest SLA risk?',
      'Deep dive into Edmonton AB fleet and work orders',
    ];
  }

  const fallback = [
    'Which providers have the largest RFID gaps?',
    'Which dispatch centers have the most unresolved work orders?',
    'List the 5 oldest open work orders',
    'Give me an executive summary of fleet and work orders',
  ];

  const seen = new Set();
  const unique = [];
  for (const item of [...pool, ...fallback]) {
    const key = normalizeQuestion(item);
    if (!key || key === current || seen.has(key)) continue;
    // Also drop near-duplicates of the current ask (subset match either way)
    if (current && (key.includes(current) || current.includes(key))) continue;
    seen.add(key);
    unique.push(item);
    if (unique.length >= 3) break;
  }
  return unique;
}

function emphasizeKeyPhrases(text) {
  // Light emphasis: wrap known provider / metrics if not already bolded
  let t = String(text || '');
  if (!/\*\*/.test(t)) {
    t = t.replace(
      /\b(Edmonton AB|Southeast Grocery|Midwest Retail|\d+%|\d{2,} overdue|\d+ unequipped)\b/g,
      '**$1**'
    );
  }
  return t;
}

function buildSourcesFromText(text) {
  const claims = [];
  const re = /\*\*(.+?)\*\*/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    const label = m[1].split('|')[0].trim();
    if (!label || label.length < 2) continue;
    if (
      /^(analysis|summary|recommendation|fleet|work order|immediate|top )/i.test(label) &&
      !/\d/.test(label)
    ) {
      continue;
    }
    if (
      !/\d|%|\$|rfid|gap|overdue|sla|coverage|truck|wo|dispatch|unequipp|missing|provider|edmonton/i.test(
        label
      )
    ) {
      continue;
    }
    const meta = inferSource(label);
    if (!claims.some((c) => c.claim === label)) {
      claims.push({
        id: `src-${claims.length}`,
        claim: label,
        confidence: meta.confidence,
        source: meta.source,
        note: meta.note,
      });
    }
  }
  return claims;
}

export function inferSource(label) {
  const t = label.toLowerCase();
  for (const row of SOURCE_CATALOG) {
    if (row.match.test(t)) {
      return {
        confidence: row.confidence,
        source: row.source,
        note:
          row.confidence === 'high'
            ? 'Directly observed in source extract'
            : 'Provisional — derived or incomplete join',
      };
    }
  }
  return {
    confidence: /\d/.test(t) ? 'high' : 'prov',
    source: 'Ops corpus',
    note: 'Matched during retrieval',
  };
}

function stripMd(s) {
  return String(s || '')
    .replace(/\*\*/g, '')
    .replace(/^[_*]+|[_*]+$/g, '')
    .trim();
}

/** Strip heading markers but preserve **claim** markers for cite hover */
function keepBold(s) {
  return String(s || '')
    .replace(/^#{1,3}\s+/, '')
    .replace(/^[_]+|[_]+$/g, '')
    .trim();
}

function truncate(s, n) {
  const t = String(s || '').trim();
  return t.length > n ? `${t.slice(0, n - 1)}…` : t;
}
