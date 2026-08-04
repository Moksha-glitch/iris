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
  const sources = result?.sources || buildSourcesFromText(fullText);
  const sections = buildSections(fullText, insights, query);

  return {
    summary: sections.summary,
    sections,
    detail: fullText,
    sources,
    actionableInsights: insights,
    text: sections.summary,
    follows: sections.follows,
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
  const follows = buildFollowUps(q);

  return {
    summary,
    table,
    chart,
    analysis,
    recommendations,
    follows,
  };
}

/** Compact prose summary — Claude-style paragraphs, not bullet dumps */
function buildSummaryParagraph(fullText, query, kpiInsight) {
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

  const lead = stripMd(prose[1] || prose[0] || '');
  const support = stripMd(prose[2] || '');
  const kpiBit = kpiInsight?.dataForWidget
    ? ` Current signal: **${kpiInsight.dataForWidget.value}** (${kpiInsight.dataForWidget.subtitle || kpiInsight.title}).`
    : '';

  let para = lead;
  if (support && support.length > 20 && support !== lead) {
    para = `${lead} ${support}`;
  }
  para = para.replace(/\s+/g, ' ').trim();
  if (kpiBit && !para.includes(String(kpiInsight.dataForWidget.value))) {
    para += kpiBit;
  }

  // Keep compact
  if (para.length > 420) {
    para = `${para.slice(0, 417).replace(/\s+\S*$/, '')}…`;
  }

  return para || `Operational read on “${truncate(query, 48)}”. See the table and chart below for the detail.`;
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

function buildFollowUps(q) {
  if (q.includes('rfid') || q.includes('coverage') || q.includes('unequipp')) {
    return [
      'Which trucks in Edmonton AB are missing RFID readers?',
      'Which providers have the largest RFID gaps?',
      'Give me an executive summary of fleet and work orders',
    ];
  }
  if (q.includes('sla') || q.includes('overdue') || q.includes('aging')) {
    return [
      'List the 5 oldest open work orders',
      "What's the OBS-Bulk Pickup backlog?",
      'Which dispatch centers have the most unresolved work orders?',
    ];
  }
  if (q.includes('edmonton')) {
    return [
      'Which trucks in Edmonton AB are missing RFID readers?',
      'Show overdue work orders for Edmonton AB',
      'Which dispatch centers have the most unresolved work orders?',
    ];
  }
  if (q.includes('provider') || q.includes('top') || q.includes('fleet size')) {
    return [
      "What's the fleet RFID coverage gap?",
      'Which providers have the largest RFID gaps?',
      'Deep dive into Edmonton AB fleet and work orders',
    ];
  }
  return [
    "What's the fleet RFID coverage gap?",
    'Which work orders pose the highest SLA risk?',
    'Deep dive into Edmonton AB fleet and work orders',
  ];
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

function truncate(s, n) {
  const t = String(s || '').trim();
  return t.length > n ? `${t.slice(0, n - 1)}…` : t;
}
