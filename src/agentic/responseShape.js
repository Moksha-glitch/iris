/**
 * Normalize mock agent output into chat summary + right-pane detail + source cites.
 */

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
  const summary = result?.summary || buildSummary(fullText, query);
  const detailParts = [fullText];

  insights.forEach((ins) => {
    if (ins.expandedText) {
      detailParts.push(`\n\n---\n### ${ins.title}\n\n${ins.expandedText}`);
    }
  });

  return {
    summary,
    detail: detailParts.filter(Boolean).join('\n'),
    sources,
    actionableInsights: insights,
    text: summary, // chat message body
  };
}

function buildSummary(fullText, query) {
  if (!fullText) return 'Analysis complete. See the detail pane for evidence and BTS.';

  const lines = fullText.split('\n').map((l) => l.trim()).filter(Boolean);
  const bullets = lines.filter((l) => l.startsWith('•') || l.startsWith('-') || l.startsWith('–'));
  const prose = lines.filter(
    (l) =>
      !l.startsWith('•') &&
      !l.startsWith('-') &&
      !l.startsWith('–') &&
      !l.startsWith('#') &&
      !/^\d+\./.test(l) &&
      !l.startsWith('|')
  );

  const title = prose[0]?.replace(/\*\*/g, '') || 'Operational summary';
  const lead = prose[1] || prose[0] || '';
  const topBullets = (bullets.length ? bullets : prose.slice(2)).slice(0, 3);

  const header = title.length > 80 ? `**Service Provider view**` : `**${title.replace(/^Analysis.*$/i, 'Service Provider summary')}**`;

  return [
    header.includes('summary') || header.includes('Service Provider')
      ? `**Nothing urgent to escalate** — operational read on “${truncate(query, 48)}”.`
      : `**${stripMd(title)}**`,
    '',
    stripMd(lead),
    '',
    ...topBullets.map((b) => (b.startsWith('•') || b.startsWith('-') ? b : `• ${b}`)),
    '',
    '_Full evidence, sources, and BTS are in the dashboard →_',
  ]
    .filter((l, i, arr) => !(l === '' && arr[i - 1] === ''))
    .join('\n');
}

function buildSourcesFromText(text) {
  const claims = [];
  const re = /\*\*(.+?)\*\*/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    const label = m[1].split('|')[0].trim();
    if (!label || label.length < 2) continue;
    if (/^(analysis|summary|recommendation|fleet|work order|immediate|top )/i.test(label) && !/\d/.test(label)) {
      continue;
    }
    if (!/\d|%|\$|rfid|gap|overdue|sla|coverage|truck|wo|dispatch|unequipp|missing|provider|edmonton/i.test(label)) {
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
