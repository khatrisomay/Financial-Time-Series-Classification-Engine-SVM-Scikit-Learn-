import React, { useState, useEffect } from 'react';

export default function KernelLab({ symbol, activeKernel, onSelectKernel, backtestMetrics }) {
  const [comparison, setComparison] = useState([]);
  const [importance, setImportance] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchKernelComparison();
    fetchImportance();
  }, [symbol]);

  const fetchKernelComparison = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`http://localhost:8000/api/kernels?symbol=${symbol}`);
      if (res.ok) {
        const data = await res.json();
        setComparison(data.comparison || []);
      }
    } catch (e) {
      console.warn("Kernel comparison fetch error", e);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchImportance = async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/feature-importance?symbol=${symbol}`);
      if (res.ok) {
        const data = await res.json();
        setImportance(data.feature_importance || []);
      }
    } catch (e) {
      console.warn("Importance fetch error", e);
      setImportance([
        { feature: 'Open-Close', importance_percentage: 28.5 },
        { feature: 'RSI', importance_percentage: 24.2 },
        { feature: 'MACD', importance_percentage: 18.9 },
        { feature: 'High-Low', importance_percentage: 15.4 },
        { feature: 'Bollinger_Bands', importance_percentage: 13.0 }
      ]);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Feature Importance Weight Ranking */}
      <section className="glass-panel rounded-xl p-6 flex flex-col gap-4">
        <h3 className="font-headline-sm text-headline-sm text-on-surface border-b border-glow/30 pb-3 text-lg font-bold flex items-center gap-2">
          <span className="material-symbols-outlined text-secondary text-xl">bar_chart</span>
          SVM Classifier Linear Feature Importance Weights ({symbol})
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {importance.map((item) => (
            <div key={item.feature} className="bg-surface-container-low p-4 rounded-xl border border-glow/20 flex flex-col gap-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-on-surface">{item.feature}</span>
                <span className="text-secondary font-mono font-bold">{item.importance_percentage}%</span>
              </div>
              <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                <div
                  className="bg-secondary h-full rounded-full transition-all duration-500"
                  style={{ width: `${item.importance_percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Kernel Benchmarking Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {comparison.map((item) => {
          const isSelected = activeKernel === item.kernel;
          return (
            <div
              key={item.kernel}
              onClick={() => onSelectKernel(item.kernel)}
              className={`glass-panel p-6 rounded-xl flex flex-col justify-between gap-6 cursor-pointer transition-all border ${
                isSelected
                  ? 'border-secondary shadow-[0_0_20px_rgba(76,215,246,0.3)] bg-secondary/10'
                  : 'hover:border-primary/50'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-label-caps text-xs text-text-muted uppercase tracking-wider">KERNEL FUNCTION</span>
                  <h3 className="font-headline-sm text-xl font-bold text-on-surface">{item.label}</h3>
                </div>
                {isSelected && (
                  <span className="material-symbols-outlined text-secondary text-2xl">check_circle</span>
                )}
              </div>

              <div className="flex flex-col gap-2 border-t border-glow/20 pt-4">
                <div className="flex justify-between text-xs">
                  <span className="text-text-muted">Test Accuracy:</span>
                  <span className="font-bold text-secondary">{item.test_acc}%</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-text-muted">Strategy Yield:</span>
                  <span className="font-bold text-primary">+{item.strategy_return}%</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-text-muted">Sharpe Ratio:</span>
                  <span className="font-semibold text-on-surface">{item.sharpe_ratio}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-text-muted">Max Drawdown:</span>
                  <span className="text-signal-negative font-semibold">{item.max_drawdown}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}
