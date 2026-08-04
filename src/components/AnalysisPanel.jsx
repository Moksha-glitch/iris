import React, { useEffect, useRef } from 'react';
import WorkflowTrace from './WorkflowTrace';
import { claimAnchorId } from './FormattedReply';
import StructuredAnswer from './StructuredAnswer';
import { getPersonaConfig, useChatContext } from '../agentic';

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
  const focused = block.focusedClaim;
  const blockId = block.id || 'current';
  const sections =
    block.sections ||
    (block.summary
      ? { summary: block.summary, follows: block.follows || [] }
      : null);

  return (
    <article
      id={`analysis-block-${blockId}`}
      className={`ap-history-block ${isLatest ? 'is-latest' : ''}`}
      data-query={block.query}
    >
      <header className="ap-block-head">
        <span className="ap-block-index">Q</span>
        <div>
          <h3 className="ap-block-query">{block.query}</h3>
          <p className="ap-block-meta">
            {persona.shortLabel}
            {block.timestamp
              ? ` · ${new Date(block.timestamp).toLocaleTimeString()}`
              : ''}
            {block.isStreaming ? ' · analyzing…' : ''}
          </p>
        </div>
      </header>

      <section className="ap-section">
        <WorkflowTrace
          steps={steps}
          personaLabel={persona.shortLabel}
          variant="panel"
        />
      </section>

      {sources.length > 0 && (
        <section className="ap-section ap-sources-section">
          <h3 className="ap-section-title">Source confidence</h3>
          <ul className="ap-sources">
            {sources.map((s) => {
              const id = `${claimAnchorId(s.claim)}-${blockId}`;
              const isFocused =
                focused && focused.toLowerCase() === s.claim.toLowerCase();
              return (
                <li
                  key={s.id || s.claim}
                  id={isLatest ? claimAnchorId(s.claim) : id}
                  data-claim={s.claim}
                  className={`ap-source ${isFocused ? 'is-focused' : ''}`}
                >
                  <div className="ap-source-top">
                    <span className="ap-source-claim">{s.claim}</span>
                    <span className={`ap-conf ${s.confidence}`}>{s.confidence}</span>
                  </div>
                  <div className="ap-source-meta">
                    <span className="ap-source-name">{s.source}</span>
                    {s.note && <span className="ap-source-note">{s.note}</span>}
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {sections && (
        <section className="ap-section ap-full-analysis" id={isLatest ? 'ap-full-analysis' : undefined}>
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
