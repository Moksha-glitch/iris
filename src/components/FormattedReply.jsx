import React, { useState, useEffect, useId, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { inferSource } from '../agentic/responseShape';

/** Only one receipt open across all cites */
let activeReceiptId = null;
const receiptListeners = new Set();

function setActiveReceipt(id) {
  activeReceiptId = id;
  receiptListeners.forEach((fn) => fn(activeReceiptId));
}

export function claimAnchorId(claim) {
  return `ap-claim-${String(claim || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 56)}`;
}

/**
 * Bold metric claims → underlined cites with confidence + receipt on hover.
 */
export default function FormattedReply({
  text,
  sources = [],
  mode = 'chat',
  onTraverse,
}) {
  if (!text) return null;

  return text.split('\n').map((line, i) => {
    if (!line.trim()) return <div key={i} className="ac-spacer" />;

    const content = renderInline(line, sources, mode, i, onTraverse);

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

function findSourceMeta(label, sources) {
  const key = label.toLowerCase().trim();
  const exact = (sources || []).find((s) => s.claim.toLowerCase() === key);
  if (exact) return exact;

  const partial = (sources || []).find((s) => {
    const c = s.claim.toLowerCase();
    return key.includes(c) || c.includes(key) || shareNumber(key, c);
  });
  if (partial) return partial;

  const inferred = inferSource(label);
  return {
    claim: label,
    confidence: inferred.confidence,
    source: inferred.source,
    note: inferred.note,
    computed: null,
  };
}

function shareNumber(a, b) {
  const na = a.match(/[\d,.]+%?/);
  const nb = b.match(/[\d,.]+%?/);
  return na && nb && na[0] === nb[0];
}

function renderInline(line, sources, mode, lineKey, onTraverse) {
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
    const meta = findSourceMeta(parsed.label, sources);

    if (sourced || parsed.confidence) {
      parts.push(
        <SourceCite
          key={`${lineKey}-c-${idx}`}
          label={parsed.label}
          confidence={parsed.confidence || meta.confidence || 'high'}
          source={parsed.source || meta.source}
          note={meta.note}
          computed={meta.computed}
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

function SourceCite({
  label,
  confidence,
  source,
  note,
  computed,
  mode,
  traversable,
  onTraverse,
}) {
  const citeId = useId();
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0, place: 'below' });
  const anchorId = mode === 'detail' ? claimAnchorId(label) : undefined;
  const confLabel = confidence === 'high' ? 'high' : 'provisional';
  const closeTimer = useRef(null);

  useEffect(() => {
    const onChange = (id) => setOpen(id === citeId);
    receiptListeners.add(onChange);
    return () => receiptListeners.delete(onChange);
  }, [citeId]);

  const updatePos = useCallback(() => {
    const el = anchorRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const tipW = 320;
    const tipH = 140;
    const gap = 8;
    const spaceBelow = window.innerHeight - r.bottom;
    const place = spaceBelow < tipH + gap && r.top > tipH + gap ? 'above' : 'below';
    let left = r.left;
    left = Math.max(8, Math.min(left, window.innerWidth - tipW - 8));
    const top = place === 'below' ? r.bottom + gap : r.top - tipH - gap;
    setPos({ top: Math.max(8, top), left, place });
  }, []);

  const show = () => {
    clearTimeout(closeTimer.current);
    updatePos();
    setActiveReceipt(citeId);
  };

  const hide = () => {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => {
      if (activeReceiptId === citeId) setActiveReceipt(null);
    }, 80);
  };

  useEffect(() => {
    if (!open) return undefined;
    const onScroll = () => updatePos();
    window.addEventListener('scroll', onScroll, true);
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll, true);
      window.removeEventListener('resize', onScroll);
    };
  }, [open, updatePos]);

  const receipt =
    open &&
    createPortal(
      <div
        className={`ac-receipt is-${pos.place}`}
        role="tooltip"
        style={{ top: pos.top, left: pos.left }}
        onMouseEnter={() => {
          clearTimeout(closeTimer.current);
          setActiveReceipt(citeId);
        }}
        onMouseLeave={hide}
      >
        <div className="ac-receipt-lbl">Receipt · “{label}”</div>
        <div className="ac-receipt-row">
          Source: <code>{source}</code>
        </div>
        {computed && (
          <div className="ac-receipt-row">
            Computed: <code>{computed}</code>
          </div>
        )}
        <div className="ac-receipt-row">
          Confidence:{' '}
          <b className={confidence === 'high' ? 'ok' : 'soft'}>{confLabel}</b>
          {note ? ` — ${note}` : ''}
        </div>
        <div className="ac-receipt-def">
          {traversable ? 'Click claim to open detail' : 'Source confidence receipt'}
        </div>
      </div>,
      document.body
    );

  const sharedProps = {
    ref: anchorRef,
    id: anchorId,
    className: `ac-cite ac-source-cite ${mode} ${traversable ? 'is-traversable' : ''} ${
      open ? 'is-open' : ''
    }`,
    onMouseEnter: show,
    onMouseLeave: hide,
    onFocus: show,
    onBlur: hide,
    title: `${confLabel} · ${source}`,
    'data-claim': label,
  };

  const inner = (
    <>
      <span className="ac-cite-text">{label}</span>
      <sup className={`ac-cite-badge ${confidence}`}>{confidence}</sup>
      {receipt}
    </>
  );

  if (traversable) {
    return (
      <button type="button" {...sharedProps} onClick={() => onTraverse(label)}>
        {inner}
      </button>
    );
  }

  return (
    <span {...sharedProps} tabIndex={0}>
      {inner}
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
