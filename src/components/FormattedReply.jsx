import React from 'react';

/**
 * Renders agent reply text.
 * - Plain **bold** stays emphasized
 * - Actionable **claims** become redirectable cites with high/prov badges
 * - Optional: **claim|high** or **claim|prov** forces a cite + badge
 */
export default function FormattedReply({ text, onRedirect }) {
  if (!text) return null;

  return text.split('\n').map((line, i) => {
    if (!line.trim()) return <div key={i} className="ac-spacer" />;

    const content = renderInline(line, onRedirect, i);

    if (line.startsWith('• ') || line.startsWith('- ') || line.startsWith('– ')) {
      return (
        <div key={i} className="ac-bullet">
          {content}
        </div>
      );
    }
    if (/^\d+\.\s/.test(line)) {
      return (
        <div key={i} className="ac-numbered">
          {content}
        </div>
      );
    }
    return (
      <div key={i} className="ac-line">
        {content}
      </div>
    );
  });
}

function renderInline(line, onRedirect, lineKey) {
  const parts = [];
  const re = /\*\*(.+?)\*\*/g;
  let last = 0;
  let match;
  let idx = 0;

  while ((match = re.exec(line)) !== null) {
    if (match.index > last) {
      parts.push(<span key={`${lineKey}-t-${idx}`}>{line.slice(last, match.index)}</span>);
    }

    const raw = match[1];
    const { label, forcedBadge } = parseBold(raw);
    const actionable = Boolean(forcedBadge) || isActionable(label);
    const badge = forcedBadge || (actionable ? inferBadge(label) : null);

    if (actionable) {
      parts.push(
        <button
          key={`${lineKey}-c-${idx}`}
          type="button"
          className="ac-cite"
          onClick={() => onRedirect?.(label)}
          title={`Open in Directory: ${label}`}
        >
          <span className="ac-cite-text">{label}</span>
          {badge && <sup className={`ac-cite-badge ${badge}`}>{badge}</sup>}
        </button>
      );
    } else {
      parts.push(
        <strong key={`${lineKey}-b-${idx}`} className="ac-strong">
          {label}
        </strong>
      );
    }

    last = match.index + match[0].length;
    idx += 1;
  }

  if (last < line.length) {
    parts.push(<span key={`${lineKey}-t-end`}>{line.slice(last)}</span>);
  }

  return parts.length ? parts : line;
}

function parseBold(raw) {
  const pipe = raw.lastIndexOf('|');
  if (pipe > 0) {
    const maybe = raw.slice(pipe + 1).trim().toLowerCase();
    if (maybe === 'high' || maybe === 'prov') {
      return { label: raw.slice(0, pipe).trim(), forcedBadge: maybe };
    }
  }
  return { label: raw, forcedBadge: null };
}

/** Only metric / risk / entity claims are actionable cites. */
function isActionable(label) {
  const t = label.trim();
  if (!t) return false;

  // Numeric metrics, WO ids, percentages, currency
  if (/\d/.test(t) || /\$|%|#\s*\d|wo\s*#/i.test(t)) return true;

  // Risk / action nouns worth redirecting
  if (
    /overdue|critical|gap|without|unequipp|missing|sla|alert|backlog|risk|blind spot|oldest|coverage|rfid|dispatch|repair|bulk|duplicate|import error|address fix|already closed/i.test(
      t
    )
  ) {
    return true;
  }

  // Provider / place entities that can open Directory
  if (/\b(edmonton|dallas|richardson)\b/i.test(t)) return true;
  if (/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)+\s+(?:AB|TX|ON|BC)\b/.test(t)) return true;

  // Section titles / prose emphasis — not cites
  if (/[:—–-]\s*$/.test(t)) return false;
  if (
    /^(analysis|summary|assessment|breakdown|recommendation|pattern|critical alert|fleet|work order|immediate|executive|top \d|obs-|cart |dispatch |case age|preloaded|detailed|full |geographic|service provider)/i.test(
      t
    )
  ) {
    return false;
  }
  if (/^(nothing|no |not |all |only |note|important|update|status|overview|context)/i.test(t)) {
    return false;
  }

  // Short plain emphasis without a claim signal
  if (!/\d/.test(t) && t.split(/\s+/).length <= 4) return false;

  return false;
}

function inferBadge(label) {
  const t = label.toLowerCase();
  if (/estimat|approx|~|potential|model|forecast|roi|provisional|duplicate|flagged/.test(t)) {
    return 'prov';
  }
  if (/%|coverage|avg|average/.test(t) && !/overdue|critical|gap|missing|without|unequipp|risk|sla/.test(t)) {
    return 'prov';
  }
  return 'high';
}
