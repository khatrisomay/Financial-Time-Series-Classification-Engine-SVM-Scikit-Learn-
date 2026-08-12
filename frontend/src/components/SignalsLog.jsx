import React, { useState, useEffect } from 'react';

export default function SignalsLog({ timeseries, symbol }) {
  const [comparisons, setComparisons] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchComparisons();
  }, [symbol]);

  const fetchComparisons = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`http://localhost:8000/api/feature-comparison?symbol=${symbol}`);
      if (res.ok) {
        const data = await res.json();
        setComparisons(data.feature_comparison || []);
      }
    } catch (e) {
      console.warn("Feature comparison fetch error", e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Feature Subset Comparison Table */}
      <section className="glass-panel rounded-xl p-6 flex flex-col gap-4">
        <div className="flex justify-between items-center border-b border-glow/30 pb-3">
          <div>
            <h3 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-2 text-lg font-bold">
              <span className="material-symbols-outlined text-secondary text-xl">compare_arrows</span>
              Technical Feature Combination Benchmark Matrix ({symbol})
            </h3>
            <p className="text-xs text-text-muted mt-0.5">
              Comparative Strategy Returns & Sharpe Ratio across feature variable subsets
            </p>
          </div>

          <button
            onClick={fetchComparisons}
            disabled={isLoading}
            className="px-3 py-1.5 font-label-caps text-xs rounded-lg bg-surface-variant text-text-muted hover:text-white border border-glow/30 transition-all flex items-center gap-1.5"
          >
            <span className={`material-symbols-outlined text-sm ${isLoading ? 'animate-spin' : ''}`}>sync</span>
            Benchmark
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-data-sm text-xs">
            <thead>
              <tr className="border-b border-glow/40 text-text-muted font-label-caps">
                <th className="py-2.5 px-3">Preset Name</th>
                <th className="py-2.5 px-3">Feature Set</th>
                <th className="py-2.5 px-3">SVM Acc</th>
                <th className="py-2.5 px-3">Strategy Yield</th>
                <th className="py-2.5 px-3">Sharpe</th>
                <th className="py-2.5 px-3">Win Rate</th>
                <th className="py-2.5 px-3">Alpha</th>
              </tr>
            </thead>
            <tbody>
              {comparisons.map((row, idx) => (
                <tr key={idx} className="border-b border-glow/10 hover:bg-surface-container-high/50">
                  <td className="py-2.5 px-3 font-bold text-on-surface">{row.preset_name}</td>
                  <td className="py-2.5 px-3 text-text-muted font-mono">{row.features_used.join(', ')}</td>
                  <td className="py-2.5 px-3 text-secondary font-semibold">{row.test_accuracy}%</td>
                  <td className="py-2.5 px-3 text-primary font-bold">+{row.strategy_return}%</td>
                  <td className="py-2.5 px-3 text-on-surface font-semibold">{row.sharpe_ratio}</td>
                  <td className="py-2.5 px-3 text-on-surface">{row.win_rate}%</td>
                  <td className="py-2.5 px-3 text-signal-positive font-bold">+{row.alpha}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Signals Table */}
      <section className="glass-panel rounded-xl p-6 flex flex-col gap-4">
        <h3 className="font-headline-sm text-headline-sm text-on-surface border-b border-glow/30 pb-3 text-lg font-bold flex justify-between items-center">
          <span>Signal Classification Logs</span>
          <span className="font-data-sm text-xs text-text-muted">TOTAL SAMPLES: {timeseries.length}</span>
        </h3>

        <div className="overflow-x-auto max-h-[500px]">
          <table className="w-full text-left font-data-sm text-xs">
            <thead className="sticky top-0 bg-surface-glass backdrop-blur-md">
              <tr className="border-b border-glow/40 text-text-muted font-label-caps">
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Close Price</th>
                <th className="py-2.5 px-3">Stock Return</th>
                <th className="py-2.5 px-3">Strategy Return</th>
                <th className="py-2.5 px-3">SVM Signal</th>
              </tr>
            </thead>
            <tbody>
              {timeseries.map((item, idx) => (
                <tr key={idx} className="border-b border-glow/10 hover:bg-surface-container-high/50">
                  <td className="py-2 px-3 text-text-muted">{item.date}</td>
                  <td className="py-2 px-3 font-semibold">₹{item.close}</td>
                  <td className={`py-2 px-3 ${item.stock_return >= 0 ? 'text-signal-positive' : 'text-signal-negative'}`}>
                    {item.stock_return >= 0 ? `+${item.stock_return}%` : `${item.stock_return}%`}
                  </td>
                  <td className={`py-2 px-3 font-bold ${item.strategy_return >= 0 ? 'text-primary' : 'text-signal-negative'}`}>
                    {item.strategy_return >= 0 ? `+${item.strategy_return}%` : `${item.strategy_return}%`}
                  </td>
                  <td className="py-2 px-3">
                    <span className={`px-2 py-0.5 rounded font-label-caps text-[10px] font-bold ${
                      item.signal === 1 ? 'bg-signal-positive/20 text-signal-positive border border-signal-positive/40' : 'bg-surface-variant text-text-muted'
                    }`}>
                      {item.signal === 1 ? 'BUY (+1)' : 'HOLD (0)'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
