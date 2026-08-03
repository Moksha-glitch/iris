// ============================================================
// WorkflowTrace — Claude-style BTS / extended thinking
// ============================================================

import React, { useEffect, useMemo, useRef, useState } from 'react';

export default function WorkflowTrace({ steps = [], personaLabel = 'All segments' }) {
  const [collapsed, setCollapsed] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [thoughtCursor, setThoughtCursor] = useState({});
  const [toolVisible, setToolVisible] = useState({});
  const [scanLine, setScanLine] = useState(0);
  const startRef = useRef(Date.now());
  const wasComplete = useRef(false);

  const allDone = steps.length > 0 && steps.every((s) => s.status === 'done');
  const activeIdx = steps.findIndex((s) => s.status === 'active');
  const doneCount = steps.filter((s) => s.status === 'done').length;
  const activeStep = activeIdx >= 0 ? steps[activeIdx] : null;

  // Elapsed timer while running
  useEffect(() => {
    if (!steps.length || allDone) return undefined;
    startRef.current = Date.now();
    const id = setInterval(() => setElapsedMs(Date.now() - startRef.current), 40);
    return () => clearInterval(id);
  }, [allDone, steps.length]);

  // Auto-collapse when complete (Claude behavior)
  useEffect(() => {
    if (!steps.length) return undefined;
    if (allDone && !wasComplete.current) {
      wasComplete.current = true;
      const t = setTimeout(() => setCollapsed(true), 700);
      return () => clearTimeout(t);
    }
    if (!allDone) {
      wasComplete.current = false;
      setCollapsed(false);
    }
    return undefined;
  }, [allDone, steps.length]);

  // Stream thought tokens for the active step
  useEffect(() => {
    if (!activeStep || allDone) return undefined;
    const thoughts = activeStep.thoughts || [];
    if (!thoughts.length) return undefined;

    const stepId = activeStep.id;
    setThoughtCursor((prev) => ({ ...prev, [stepId]: 0 }));
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setThoughtCursor((prev) => ({
        ...prev,
        [stepId]: Math.min(i, thoughts.length),
      }));
      if (i >= thoughts.length) clearInterval(id);
    }, 220);
    return () => clearInterval(id);
  }, [activeStep?.id, allDone]);

  // Reveal nested tools mid-step
  useEffect(() => {
    if (!activeStep || allDone) return undefined;
    const tools = activeStep.tools || [];
    if (!tools.length) return undefined;

    const stepId = activeStep.id;
    setToolVisible((prev) => ({ ...prev, [stepId]: 0 }));
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setToolVisible((prev) => ({
        ...prev,
        [stepId]: Math.min(i, tools.length),
      }));
      if (i >= tools.length) clearInterval(id);
    }, 380);
    return () => clearInterval(id);
  }, [activeStep?.id, allDone]);

  // Scan pulse along the rail
  useEffect(() => {
    if (!steps.length || allDone) return undefined;
    const id = setInterval(() => {
      setScanLine((v) => (v + 1) % 100);
    }, 30);
    return () => clearInterval(id);
  }, [allDone, steps.length]);

  const seconds = useMemo(() => {
    if (allDone) {
      const total = steps.reduce((sum, st) => sum + (st.duration || 0), 0);
      if (total > 0) return (total / 1000).toFixed(1);
    }
    return (Math.max(elapsedMs, 0) / 1000).toFixed(1);
  }, [allDone, elapsedMs, steps]);

  if (!steps.length) return null;

  const progress = allDone
    ? 100
    : Math.min(98, ((doneCount + (activeIdx >= 0 ? 0.45 : 0)) / steps.length) * 100);

  const headerTitle = allDone
    ? `Traced — ${steps.length} steps · ${seconds}s`
    : `Thinking · ${seconds}s`;

  return (
    <div
      className={`workflow-trace ${allDone ? 'complete' : 'running'} ${collapsed ? 'is-collapsed' : ''}`}
    >
      <button
        type="button"
        className="wt-header"
        onClick={() => setCollapsed((v) => !v)}
        aria-expanded={!collapsed}
      >
        <div className="wt-header-left">
          <span className={`wt-orb ${allDone ? 'done' : 'live'}`} aria-hidden>
            <span className="wt-orb-core" />
            {!allDone && (
              <>
                <span className="wt-orb-ring r1" />
                <span className="wt-orb-ring r2" />
                <span className="wt-orb-spark s1" />
                <span className="wt-orb-spark s2" />
                <span className="wt-orb-spark s3" />
              </>
            )}
            {allDone && <span className="wt-orb-check">✓</span>}
          </span>

          <div className="wt-header-copy">
            <span className={`wt-title ${allDone ? '' : 'shimmer'}`}>{headerTitle}</span>
            <span className="wt-subtitle">
              {allDone
                ? `showing ${personaLabel} scope`
                : 'routing · retrieving · synthesizing'}
              {allDone && <span className="wt-view-link"> view</span>}
            </span>
          </div>
        </div>

        <div className="wt-header-right">
          {!allDone && (
            <div className="wt-mini-bars" aria-hidden>
              <i style={{ animationDelay: '0ms' }} />
              <i style={{ animationDelay: '120ms' }} />
              <i style={{ animationDelay: '240ms' }} />
              <i style={{ animationDelay: '360ms' }} />
            </div>
          )}
          <span className="wt-toggle">{collapsed ? '▸' : '▾'}</span>
        </div>
      </button>

      {!allDone && (
        <div className="wt-progress-track" aria-hidden>
          <div className="wt-progress-fill" style={{ width: `${progress}%` }} />
          <div className="wt-progress-glow" style={{ left: `${progress}%` }} />
        </div>
      )}

      {!collapsed && (
        <div className="wt-body">
          <div className="wt-rail" aria-hidden>
            <div className="wt-rail-line" />
            {!allDone && (
              <div className="wt-rail-scan" style={{ top: `${8 + scanLine * 0.72}%` }} />
            )}
          </div>

          <div className="wt-steps">
            {steps.map((step, i) => {
              const thoughts = step.thoughts || [];
              const tools = step.tools || [];
              const shownThoughts =
                step.status === 'done'
                  ? thoughts.length
                  : step.status === 'active'
                    ? thoughtCursor[step.id] || 0
                    : 0;
              const shownTools =
                step.status === 'done'
                  ? tools.length
                  : step.status === 'active'
                    ? toolVisible[step.id] || 0
                    : 0;

              return (
                <div
                  key={step.id}
                  className={`wt-step ${step.status}`}
                  style={{ animationDelay: `${i * 70}ms` }}
                >
                  <div className="wt-step-indicator">
                    {step.status === 'done' && (
                      <span className="wt-check">
                        <span className="wt-check-burst" />
                        ✓
                      </span>
                    )}
                    {step.status === 'active' && (
                      <span className="wt-spinner-wrap">
                        <span className="wt-spinner" />
                        <span className="wt-spinner-orbit" />
                      </span>
                    )}
                    {step.status === 'pending' && <span className="wt-dot" />}
                  </div>

                  <div className="wt-step-main">
                    <div className="wt-step-row">
                      <span className="wt-step-icon" aria-hidden>
                        {step.icon}
                      </span>
                      <span className="wt-step-label">{step.label}</span>
                      {step.status === 'active' && (
                        <span className="wt-live-chip">
                          <span className="wt-live-dot" />
                          live
                        </span>
                      )}
                      {step.status === 'done' && (
                        <span className="wt-ms">
                          {step.duration ? `${(step.duration / 1000).toFixed(1)}s` : 'ok'}
                        </span>
                      )}
                    </div>

                    {shownThoughts > 0 && (
                      <div className="wt-thoughts">
                        {thoughts.slice(0, shownThoughts).map((t, ti) => (
                          <div
                            key={`${step.id}-t-${ti}`}
                            className={`wt-thought ${
                              step.status === 'active' && ti === shownThoughts - 1 ? 'typing' : ''
                            }`}
                            style={{ animationDelay: `${ti * 40}ms` }}
                          >
                            <span className="wt-thought-mark">↳</span>
                            <span className="wt-thought-text">{t}</span>
                            {step.status === 'active' && ti === shownThoughts - 1 && (
                              <span className="wt-caret" />
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {shownTools > 0 && (
                      <div className="wt-tools">
                        {tools.slice(0, shownTools).map((tool, ti) => (
                          <div
                            key={`${step.id}-tool-${ti}`}
                            className={`wt-tool ${
                              step.status === 'active' && ti === shownTools - 1 ? 'active' : 'done'
                            }`}
                          >
                            <span className="wt-tool-icon">{tool.icon || '◎'}</span>
                            <span className="wt-tool-name">{tool.name}</span>
                            <span className="wt-tool-meta">{tool.meta}</span>
                            {step.status === 'active' && ti === shownTools - 1 ? (
                              <span className="wt-tool-pulse" />
                            ) : (
                              <span className="wt-tool-ok">✓</span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {step.status === 'active' && (
                      <div className="wt-token-stream" aria-hidden>
                        {Array.from({ length: 12 }).map((_, k) => (
                          <span
                            key={k}
                            className="wt-token"
                            style={{
                              animationDelay: `${k * 90}ms`,
                              width: `${18 + ((k * 17) % 42)}px`,
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {!allDone && (
            <div className="wt-neural" aria-hidden>
              <svg viewBox="0 0 200 40" preserveAspectRatio="none">
                <path
                  className="wt-wave w1"
                  d="M0,20 C20,5 40,35 60,20 S100,5 120,20 S160,35 180,20 S200,10 220,20"
                />
                <path
                  className="wt-wave w2"
                  d="M0,22 C25,38 45,8 70,22 S115,38 140,22 S180,8 200,22"
                />
                <path
                  className="wt-wave w3"
                  d="M0,18 C30,12 50,28 80,18 S130,8 160,18 S190,28 220,18"
                />
              </svg>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
