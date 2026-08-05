import React from 'react';

export default function ConfusionMatrix({ matrix = { tn: 0, fp: 0, fn: 0, tp: 0 }, precision = 0, recall = 0, f1 = 0 }) {
  return (
    <section className="glass-panel rounded-lg p-4 flex flex-col gap-4">
      <h3 className="font-headline-sm text-headline-sm text-on-surface border-b border-glow/30 pb-2 flex items-center justify-between">
        <span className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">grid_view</span>
          Diagnostic Matrix
        </span>
        <span className="text-xs font-label-caps text-text-muted">Test Set Evaluation</span>
      </h3>

      {/* Confusion Matrix Grid */}
      <div className="grid grid-cols-3 gap-1 bg-surface-container-low p-2 rounded border border-glow/40">
        <div></div>
        <div className="text-center font-label-caps text-label-caps text-text-muted pb-1">PRED. DOWN (0)</div>
        <div className="text-center font-label-caps text-label-caps text-text-muted pb-1">PRED. UP (+1)</div>

        <div className="flex items-center justify-end pr-2 font-label-caps text-label-caps text-text-muted">ACTUAL DOWN</div>
        <div className="bg-surface-variant/60 border border-glow/20 p-3 flex flex-col items-center justify-center rounded-sm">
          <span className="font-data-lg text-data-lg text-on-surface">{matrix.tn}</span>
          <span className="font-label-caps text-label-caps text-text-muted mt-1">True Negative (TN)</span>
        </div>
        <div className="bg-signal-negative/10 border border-signal-negative/30 p-3 flex flex-col items-center justify-center rounded-sm">
          <span className="font-data-lg text-data-lg text-signal-negative">{matrix.fp}</span>
          <span className="font-label-caps text-label-caps text-text-muted mt-1">False Positive (FP)</span>
        </div>

        <div className="flex items-center justify-end pr-2 font-label-caps text-label-caps text-text-muted">ACTUAL UP</div>
        <div className="bg-surface-variant/60 border border-glow/20 p-3 flex flex-col items-center justify-center rounded-sm">
          <span className="font-data-lg text-data-lg text-text-muted">{matrix.fn}</span>
          <span className="font-label-caps text-label-caps text-text-muted mt-1">False Negative (FN)</span>
        </div>
        <div className="bg-signal-positive/20 border border-signal-positive/40 p-3 flex flex-col items-center justify-center rounded-sm shadow-[0_0_12px_rgba(16,185,129,0.15)]">
          <span className="font-data-lg text-data-lg text-signal-positive drop-shadow-[0_0_4px_rgba(16,185,129,0.5)]">
            {matrix.tp}
          </span>
          <span className="font-label-caps text-label-caps text-text-muted mt-1">True Positive (TP)</span>
        </div>
      </div>

      {/* Classification Metrics Table */}
      <div className="mt-1 flex flex-col">
        <div className="flex justify-between py-2 border-b border-glow/30 hover:border-l-2 hover:border-l-primary pl-2 transition-all">
          <span className="font-body-sm text-body-sm text-on-surface-variant">Precision (Buy Signal)</span>
          <span className="font-data-sm text-data-sm text-secondary font-bold">{precision}%</span>
        </div>
        <div className="flex justify-between py-2 border-b border-glow/30 hover:border-l-2 hover:border-l-primary pl-2 transition-all">
          <span className="font-body-sm text-body-sm text-on-surface-variant">Recall (Sensitivity)</span>
          <span className="font-data-sm text-data-sm text-on-surface font-semibold">{recall}%</span>
        </div>
        <div className="flex justify-between py-2 border-b border-glow/30 hover:border-l-2 hover:border-l-primary pl-2 transition-all">
          <span className="font-body-sm text-body-sm text-on-surface-variant">F1-Score (Harmonic Mean)</span>
          <span className="font-data-sm text-data-sm text-primary font-semibold">{f1}</span>
        </div>
      </div>
    </section>
  );
}
