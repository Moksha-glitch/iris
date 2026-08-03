import React from 'react';

export default function PredictiveQuestions({ questions, onSelect, disabled }) {
  if (!questions?.length) return null;

  return (
    <div className="predictive-questions">
      <div className="pq-label" id="pq-label">
        Suggested
      </div>
      <div className="pq-pills" role="group" aria-labelledby="pq-label">
        {questions.map((q, i) => (
          <button
            key={`${q.label}-${i}`}
            type="button"
            className="pq-pill"
            disabled={disabled}
            onClick={() => onSelect(q.query)}
            title={q.query}
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <span className="pq-icon" aria-hidden>
              {q.icon}
            </span>
            <span className="pq-text">{q.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
