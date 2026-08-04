import React, { useEffect, useRef } from 'react';
import WorkflowTrace from './WorkflowTrace';
import FormattedReply, { claimAnchorId } from './FormattedReply';
import StructuredAnswer from './StructuredAnswer';
import { getPersonaConfig, useChatContext, buildIntent } from '../agentic';

/**
 * Center dashboard replacement: stacked BTS + structured answer per question.
 */
export default function AnalysisPanel({
  analysis,
  onClose,
  onToast,
  onWidgetPinned,
  onAsk,
  variant = 'center',
}) {
  const { analysisHistory, scrollToAnalysisId, scrollToken } = useChatContext();
  const bodyRef = useRef(null);

  const blocks = (() => {
    const list = [...analysisHistory];
    if (analysis?.id && !list.some((a) => a.id === analysis.id)) {
      list.push(analysis);
    } else if (analysis?.id) {
      const i = list.findIndex((a) => a.id === analysis.id);
      if (i >= 0) list[i] = { ...list[i], ...analysis };
    } else if (analysis) {
      list.push(analysis);
    }
    return list;
  })();

  useEffect(() => {
    if (!scrollToAnalysisId || !bodyRef.current) return undefined;
    const el = bodyRef.current.querySelector(`#analysis-block-${scrollToAnalysisId}`);
    if (!el) return undefined;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    el.classList.add('is-focused');
    const t = setTimeout(() => el.classList.remove('is-focused'), 1800);
    return () => {
      clearTimeout(t);
      el.classList.remove('is-focused');
    };
  }, [scrollToAnalysisId, scrollToken]);

  useEffect(() => {
    if (!analysis?.focusedClaim || !bodyRef.current) return undefined;

    const claim = analysis.focusedClaim;
    const root =
      bodyRef.current.querySelector(`#analysis-block-${analysis.id}`) || bodyRef.current;

    let target = null;
    if (claim === '__detail__') {
      target = root.querySelector('.sa-root') || root.querySelector('.ap-full-analysis');
    } else {
      target =
        root.querySelector(`#${claimAnchorId(claim)}`) ||
        [...root.querySelectorAll('[data-claim]')].find(
          (el) => el.getAttribute('data-claim')?.toLowerCase() === claim.toLowerCase()
        ) ||
        root.querySelector('.sa-summary');
    }

    if (!target) return undefined;

    target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    target.classList.add('is-focused');
    const t = setTimeout(() => target.classList.remove('is-focused'), 1800);
    return () => {
      clearTimeout(t);
      target.classList.remove('is-focused');
    };
  }, [analysis?.focusedClaim, analysis?.focusToken, analysis?.id]);

  if (!analysis && !blocks.length) return null;

  return (
    <div className={`analysis-pane variant-${variant}`} aria-label="Analysis detail">
      <div className="ap-panel">
        <header className="ap-header">
          <div>
            <div className="ap-eyebrow">Answer</div>
            <h2 className="ap-title">Evidence & detail</h2>
            <p className="ap-query">
              {blocks.length} answered question{blocks.length === 1 ? '' : 's'} · Summary → Table →
              Chart → Analysis → Recommendation
            </p>
          </div>
          <button
            type="button"
            className="ap-close"
            onClick={onClose}
            aria-label="Back to Command Center"
            title="Back to Command Center"
          >
            ×
          </button>
        </header>

        <div className="ap-body" ref={bodyRef}>
          {blocks.map((block, index) => (
            <AnalysisBlock
              key={block.id || `block-${index}`}
              block={block}
              isLatest={index === blocks.length - 1}
              onToast={onToast}
              onWidgetPinned={onWidgetPinned}
              onAsk={onAsk}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function AnalysisBlock({ block, isLatest, onToast, onWidgetPinned, onAsk }) {
  const persona = getPersonaConfig(block.persona || 'serviceProvider');
  const steps = block.workflowSteps || [];
  const sources = block.sources || [];
  const insights = block.insights || [];
  const blockId = block.id || 'current';
  const sections =
    block.sections ||
    (block.summary
      ? { summary: block.summary, follows: block.follows || [] }
      : null);
  const intent = block.intent || (block.query ? buildIntent(block.query) : null);

  const exportResponse = () => {
    if (!sections) {
      onToast?.('Nothing to export yet');
      return;
    }
    const html = buildExportHtml({
      query: block.query,
      persona: persona.shortLabel || persona.label,
      sections,
      sources,
      timestamp: block.timestamp,
    });
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const slug = String(block.query || 'response')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 40);
    link.href = url;
    link.download = `vision-response-${slug || blockId}.html`;
    link.click();
    URL.revokeObjectURL(url);
    onToast?.('Response exported as HTML');
  };

  return (
    <article
      id={`analysis-block-${blockId}`}
      className={`ap-history-block ${isLatest ? 'is-latest' : ''}`}
      data-query={block.query}
    >
      <header className="ap-block-head">
        <span className="ap-block-index">Q</span>
        <div className="ap-block-head-main">
          <h3 className="ap-block-query">{block.query}</h3>
          <p className="ap-block-meta">
            {persona.shortLabel}
            {block.timestamp
              ? ` · ${new Date(block.timestamp).toLocaleTimeString()}`
              : ''}
            {block.isStreaming ? ' · analyzing…' : ''}
          </p>
        </div>
        <button
          type="button"
          className="ap-export-btn"
          onClick={exportResponse}
          disabled={block.isStreaming || !sections}
          title="Export this response as HTML"
        >
          ⬇ Export response
        </button>
      </header>

      {intent && (
        <section className="ap-intent" aria-label="How I read your question">
          <div className="ap-intent-lbl">
            <span className="ap-intent-dot" aria-hidden />
            How I read your question
          </div>
          {(intent.query || block.query) && (
            <blockquote className="ap-intent-query">
              {intent.query || block.query}
            </blockquote>
          )}
          <div className="ap-intent-read">
            <FormattedReply text={intent.read} sources={sources} mode="detail" />
          </div>
          {intent.chips?.length > 0 && (
            <div className="ap-intent-chips">
              {intent.chips.map(([label, value]) => (
                <div key={label} className="ap-intent-chip">
                  <span>{label}</span>
                  {value}
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      <section className="ap-section">
        <WorkflowTrace
          steps={steps}
          personaLabel={persona.shortLabel}
          variant="panel"
        />
      </section>

      {sections && (
        <section
          className="ap-section ap-full-analysis"
          id={isLatest ? 'ap-full-analysis' : undefined}
        >
          <StructuredAnswer
            sections={sections}
            sources={sources}
            insights={insights}
            mode="detail"
            onAsk={onAsk}
            onToast={onToast}
            onWidgetPinned={onWidgetPinned}
          />
        </section>
      )}
    </article>
  );
}

function buildExportHtml({ query, persona, sections, sources, timestamp }) {
  const esc = (s) =>
    String(s || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');

  const inline = (text) =>
    esc(text).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

  let body = '';
  let n = 0;
  const sec = (title, html) => {
    n += 1;
    body += `<div class="sec"><div class="sec-h">${n}. ${esc(title)}</div>${html}</div>`;
  };

  sec('Summary', `<div class="summary">${inline(sections.summary)}</div>`);

  if (sections.table) {
    const head = sections.table.cols.map((c) => `<th>${esc(c)}</th>`).join('');
    const rows = sections.table.rows
      .map((r) => {
        const cells = r.cells
          .map((c, i) => {
            const inner =
              typeof c === 'object' && c?.pill
                ? `<span class="pill ${c.pill}">${esc(c.text)}</span>`
                : esc(c);
            return `<td${i === 0 ? ' class="c0"' : ''}>${inner}</td>`;
          })
          .join('');
        return `<tr class="${r.flag ? 'flag' : ''}">${cells}</tr>`;
      })
      .join('');
    sec(
      sections.table.title,
      `<table><thead><tr>${head}</tr></thead><tbody>${rows}</tbody></table>${
        sections.table.note ? `<p class="note">${esc(sections.table.note)}</p>` : ''
      }`
    );
  }

  if (sections.chart?.data?.length) {
    const max = Math.max(...sections.chart.data.map((d) => d.v), 1);
    const bars = sections.chart.data
      .map(
        (d) =>
          `<div class="bcol"><div class="bwrap"><div class="bar ${d.c || ''}" style="height:${Math.max(
            8,
            Math.round((d.v / max) * 100)
          )}%"></div></div><span>${d.v}${esc(sections.chart.unit || '')}</span><small>${esc(
            d.l
          )}</small></div>`
      )
      .join('');
    sec(
      sections.chart.title,
      `<div class="chart">${bars}</div>${
        sections.chart.cap ? `<p class="note">${esc(sections.chart.cap)}</p>` : ''
      }`
    );
  }

  if (sections.analysis?.length) {
    sec(
      'Analysis',
      `<div class="arbox">${sections.analysis.map((p) => `<p>${inline(p)}</p>`).join('')}</div>`
    );
  }

  if (sections.recommendations?.length) {
    sec(
      'Recommendation',
      `<div class="arbox"><ul class="rec">${sections.recommendations
        .map((r) => `<li>${inline(r)}</li>`)
        .join('')}</ul></div>`
    );
  }

  if (sources?.length) {
    body += `<div class="sec"><div class="sec-h">Sources</div><ul class="srcs">${sources
      .map(
        (s) =>
          `<li><b>${esc(s.claim)}</b> · ${esc(s.confidence)} · <code>${esc(s.source)}</code>${
            s.note ? ` — ${esc(s.note)}` : ''
          }</li>`
      )
      .join('')}</ul></div>`;
  }

  const when = timestamp ? new Date(timestamp).toLocaleString() : new Date().toLocaleString();

  return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Vision AI — ${esc(
    query
  )}</title>
<style>
body{font-family:Inter,Georgia,serif;max-width:720px;margin:32px auto;padding:0 20px;color:#18181B;line-height:1.6;background:#fff}
h1{font-size:18px;color:#18181B;margin-bottom:4px}.meta{color:#71717A;font-size:12px;margin-bottom:22px}
.sec{margin-bottom:22px}.sec-h{font-size:11px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:#52525B;margin-bottom:8px}
.summary{border-left:3px solid #E4E4E7;padding-left:14px;font-size:15px;line-height:1.75}
table{width:100%;border-collapse:collapse;font-size:12.5px;margin:8px 0}
th{background:#FAFAFA;text-align:left;font-size:10px;text-transform:uppercase;letter-spacing:.04em}
th,td{border:1px solid #E4E4E7;padding:8px 11px}.c0{font-weight:700}
.flag td{background:#FEF6F5}
.pill{font-size:10px;font-weight:800;padding:2px 8px;border-radius:999px}
.pill.r{background:#FBE3E0;color:#C0362C}.pill.a{background:#FDECC8;color:#B45309}.pill.g{background:#DEF3E8;color:#0F7A52}
.chart{display:flex;align-items:flex-end;gap:12px;height:150px;border:1px solid #E4E4E7;padding:10px;border-radius:8px}
.bcol{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;height:100%}
.bwrap{flex:1;width:100%;display:flex;align-items:flex-end;justify-content:center}
.bar{width:36px;background:#3d4f8c;border-radius:5px 5px 0 0}.bar.hi{background:#C0362C}.bar.ok{background:#0F7A52}
.bcol span{font-size:11px;font-weight:800;margin-top:4px}.bcol small{font-size:10px;color:#71717A}
.arbox{border:1px solid #E4E4E7;border-radius:10px;padding:14px}.arbox p{margin:0 0 10px;font-size:13.5px}.arbox p:last-child{margin:0}
.rec{list-style:none;padding:0;margin:0}.rec li{margin:8px 0;padding-left:18px;position:relative}.rec li::before{content:"→";position:absolute;left:0;color:#0F7A52;font-weight:800}
.note{font-size:11px;color:#71717A;font-style:italic;margin-top:6px}
.srcs{font-size:12px;color:#52525B;padding-left:18px}.srcs code{font-size:11px;background:#FAFAFA;padding:1px 5px;border-radius:4px;border:1px solid #E4E4E7}
</style></head><body>
<h1>${esc(query)}</h1>
<p class="meta">Vision AI · ${esc(persona)} · exported ${esc(when)}</p>
${body}
</body></html>`;
}
