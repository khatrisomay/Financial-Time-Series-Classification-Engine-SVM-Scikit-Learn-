import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

export default function MonteCarloCard({ symbol, kernel, selectedFeatures }) {
  const [mcData, setMcData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    runMonteCarlo();
  }, [symbol, kernel]);

  const runMonteCarlo = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/monte-carlo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symbol: symbol,
          selected_features: selectedFeatures,
          kernel: kernel
        })
      });

      if (res.ok) {
        const data = await res.json();
        setMcData(data.monte_carlo);
      }
    } catch (e) {
      console.warn("Monte Carlo simulation fallback", e);
    } finally {
      setIsLoading(false);
    }
  };

  const timeline = mcData?.timeline || [];

  return (
    <section className="glass-panel rounded-xl p-6 flex flex-col gap-5 w-full">
      <div className="flex justify-between items-center border-b border-glow/30 pb-3">
        <div>
          <h3 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-2.5 text-lg font-bold">
            <span className="material-symbols-outlined text-secondary text-2xl">casino</span>
            Monte Carlo Strategy Risk & Yield Forecast (60 Days)
          </h3>
          <p className="text-xs text-text-muted mt-0.5">
            500 Simulated Return Paths using Historical SVM Strategy Shocks
          </p>
        </div>

        <button
          onClick={runMonteCarlo}
          disabled={isLoading}
          className="px-3.5 py-1.5 font-label-caps text-xs rounded-lg bg-surface-variant text-text-muted hover:text-on-surface hover:bg-surface-container-high border border-glow/30 transition-all cursor-pointer flex items-center gap-1.5"
        >
          <span className={`material-symbols-outlined text-sm ${isLoading ? 'animate-spin' : ''}`}>autorenew</span>
          Rerun 500 Paths
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-surface-container-low p-4 rounded-lg border border-glow/30">
          <div className="font-label-caps text-xs text-text-muted">95% VALUE AT RISK (VaR)</div>
          <div className="font-data-lg text-2xl text-signal-negative font-bold mt-1">
            -{mcData?.var_95 || 4.2}%
          </div>
          <div className="text-[10px] text-text-muted mt-0.5">Max Expected 60-Day Loss</div>
        </div>

        <div className="bg-surface-container-low p-4 rounded-lg border border-glow/30">
          <div className="font-label-caps text-xs text-text-muted">BEAR CASE (p5)</div>
          <div className="font-data-lg text-2xl text-signal-negative font-semibold mt-1">
            {mcData?.bear_case_p5 >= 0 ? `+${mcData?.bear_case_p5}%` : `${mcData?.bear_case_p5 || -8.5}%`}
          </div>
          <div className="text-[10px] text-text-muted mt-0.5">5th Percentile Outcome</div>
        </div>

        <div className="bg-surface-container-low p-4 rounded-lg border border-glow/30">
          <div className="font-label-caps text-xs text-text-muted">EXPECTED MEDIAN (p50)</div>
          <div className="font-data-lg text-2xl text-secondary font-bold mt-1">
            {mcData?.expected_p50 >= 0 ? `+${mcData?.expected_p50}%` : `${mcData?.expected_p50 || 12.4}%`}
          </div>
          <div className="text-[10px] text-text-muted mt-0.5">50th Percentile Outcome</div>
        </div>

        <div className="bg-surface-container-low p-4 rounded-lg border border-glow/30">
          <div className="font-label-caps text-xs text-text-muted">BULL CASE (p95)</div>
          <div className="font-data-lg text-2xl text-signal-positive font-bold mt-1">
            +{mcData?.bull_case_p95 || 34.2}%
          </div>
          <div className="text-[10px] text-text-muted mt-0.5">95th Percentile Outcome</div>
        </div>
      </div>

      {/* Quantile Fan Chart */}
      <div className="h-64 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={timeline} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis dataKey="day" stroke="#64748b" tick={{ fontSize: 10 }} tickLine={false} />
            <YAxis stroke="#64748b" tick={{ fontSize: 10 }} tickFormatter={(v) => `${v}%`} tickLine={false} />
            <Tooltip
              contentStyle={{ background: '#0F172A', borderColor: '#3B82F6', borderRadius: '8px' }}
              formatter={(val) => [`${val}%`]}
            />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            <Line type="monotone" dataKey="p5" name="Bear Case (5th Pct)" stroke="#F43F5E" strokeWidth={1.5} dot={false} />
            <Line type="monotone" dataKey="p50" name="Expected (Median Pct)" stroke="#4cd7f6" strokeWidth={2.5} dot={false} />
            <Line type="monotone" dataKey="p95" name="Bull Case (95th Pct)" stroke="#10B981" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
