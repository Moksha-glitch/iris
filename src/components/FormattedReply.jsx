import React, { useState } from 'react';
import { inferSource } from '../agentic/responseShape';

export function claimAnchorId(claim) {
  return `ap-claim-${String(claim || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 56)}`;
}

/**
 * Bold metric claims → source-confidence badges.
 * In chat mode, cites are traversable into the detail pane.
 */
export default function FormattedReply({
  text,
  sources = [],
  mode = 'chat',
  onTraverse,
}) {
  if (!text) return null;

  const sourceMap = Object.fromEntries(
    (sources || []).map((s) => [s.claim.toLowerCase(), s])
  );

  return text.split('\n').map((line, i) => {
    if (!line.trim()) return <div key={i} className="ac-spacer" />;

    const content = renderInline(line, sourceMap, mode, i, onTraverse);

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
    if (line.startsWith('### ')) {
      return (
        <h4 key={i} className="ac-h4">
          {line.slice(4)}
        </h4>
      );
    }
    if (line.startsWith('---')) {
      return <hr key={i} className="ac-hr" />;
    }
    if (line.startsWith('_') && line.endsWith('_')) {
      const muted = line.slice(1, -1);
      if (mode === 'chat' && onTraverse) {
        return (
          <button
            key={i}
            type="button"
            className="ac-muted ac-traverse-link"
            onClick={() => onTraverse('__detail__')}
          >
            {muted}
          </button>
        );
      }
      return (
        <div key={i} className="ac-muted">
          {muted}
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

function renderInline(line, sourceMap, mode, lineKey, onTraverse) {
  const parts = [];
  const re = /\*\*(.+?)\*\*/g;
  let last = 0;
  let match;
  let idx = 0;

  while ((match = re.exec(line)) !== null) {
    if (match.index > last) {
      parts.push(<span key={`${lineKey}-t-${idx}`}>{line.slice(last, match.index)}</span>);
    }

    const parsed = parseBold(match[1]);
    const sourced = isSourcedClaim(parsed.label);
    const fromMap = sourceMap[parsed.label.toLowerCase()];
    const meta = fromMap || {
      confidence: parsed.confidence || inferSource(parsed.label).confidence,
      source: parsed.source || inferSource(parsed.label).source,
      note: inferSource(parsed.label).note,
      claim: parsed.label,
    };

    if (sourced || parsed.confidence) {
      parts.push(
        <SourceCite
          key={`${lineKey}-c-${idx}`}
          label={parsed.label}
          confidence={meta.confidence || 'high'}
          source={meta.source}
          note={meta.note}
          mode={mode}
          traversable={mode === 'chat' && typeof onTraverse === 'function'}
          onTraverse={onTraverse}
        />
      );
    } else {
      parts.push(
        <strong key={`${lineKey}-b-${idx}`} className="ac-strong">
          {parsed.label}
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

function SourceCite({ label, confidence, source, note, mode, traversable, onTraverse }) {
  const [open, setOpen] = useState(false);

  const body = (
    <>
      <span className="ac-cite-text">{label}</span>
      <sup className={`ac-cite-badge ${confidence}`}>{confidence}</sup>
      {open && (
        <span className="ac-source-tip" role="tooltip">
          <strong>{confidence === 'high' ? 'High confidence' : 'Provisional'}</strong>
          <span className="ac-source-tip-src">{source}</span>
          {note && <span className="ac-source-tip-note">{note}</span>}
          {traversable && (
            <span className="ac-source-tip-note">Click to open in detail pane →</span>
          )}
        </span>
      )}
    </>
  );

  const sharedProps = {
    className: `ac-cite ac-source-cite ${mode} ${traversable ? 'is-traversable' : ''}`,
    onMouseEnter: () => setOpen(true),
    onMouseLeave: () => setOpen(false),
    onFocus: () => setOpen(true),
    onBlur: () => setOpen(false),
    title: traversable
      ? `Open detail: ${source} · ${confidence}`
      : `${source} · ${confidence}`,
  };

  if (traversable) {
    return (
      <button
        type="button"
        {...sharedProps}
        onClick={() => onTraverse(label)}
      >
        {body}
      </button>
    );
  }

  return (
    <span
      {...sharedProps}
      tabIndex={0}
      data-claim={mode === 'detail' ? label : undefined}
    >
      {body}
    </span>
  );
}

function parseBold(raw) {
  const bits = raw.split('|').map((s) => s.trim());
  const label = bits[0] || raw;
  let confidence = null;
  let source = null;
  if (bits[1] && (bits[1] === 'high' || bits[1] === 'prov')) {
    confidence = bits[1];
    source = bits[2] || null;
  } else if (bits[1]) {
    source = bits[1];
  }
  return { label, confidence, source };
}

function isSourcedClaim(label) {
  const t = label.trim();
  if (!t) return false;
  if (/[:—–-]\s*$/.test(t)) return false;
  if (
    /^(analysis|summary|assessment|breakdown|recommendation|pattern|critical alert|fleet|work order|immediate|executive|top \d|obs-|cart |dispatch |case age|preloaded|detailed|full |geographic|service provider|nothing urgent)/i.test(
      t
    ) &&
    !/\d/.test(t)
  ) {
    return false;
  }
  if (/\d|%|\$|#\s*\d|wo\s*#/i.test(t)) return true;
  if (
    /overdue|critical|gap|without|unequipp|missing|sla|alert|backlog|risk|coverage|rfid|dispatch|repair|bulk|truck|provider/i.test(
      t
    )
  ) {
    return true;
  }
  return false;
}
