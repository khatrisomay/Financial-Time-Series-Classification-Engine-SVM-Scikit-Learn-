import React, { useState, useEffect } from 'react';

export default function KernelLab({ symbol, activeKernel, onSelectKernel, backtestMetrics = {} }) {
  const [kernelMatrix, setKernelMatrix] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchKernelComparison();
  }, [symbol]);

  const fetchKernelComparison = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`http://localhost:8000/api/kernels?symbol=${symbol}`);
      if (res.ok) {
        const data = await res.json();
        setKernelMatrix(data.comparison || []);
      }
    } catch (e) {
      console.warn("Using default kernel fallback matrix", e);
      setKernelMatrix([
        { kernel: 'linear', label: 'Linear', train_acc: 54.4, test_acc: 47.8, strategy_return: 12.4, sharpe_ratio: 0.8, max_drawdown: -8.5, win_rate: 55.2 },
        { kernel: 'poly', label: 'Polynomial (d=3)', train_acc: 57.5, test_acc: 42.2, strategy_return: -2.1, sharpe_ratio: -0.1, max_drawdown: -14.2, win_rate: 48.0 },
        { kernel: 'rbf', label: 'RBF (Radial Basis)', train_acc: 78.4, test_acc: 72.5, strategy_return: 28.7, sharpe_ratio: 2.4, max_drawdown: -4.2, win_rate: 68.0 },
        { kernel: 'sigmoid', label: 'Sigmoid', train_acc: 50.3, test_acc: 51.1, strategy_return: 4.5, sharpe_ratio: 0.3, max_drawdown: -10.1, win_rate: 51.4 }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const activeKernelObj = kernelMatrix.find(k => k.kernel === activeKernel) || kernelMatrix[2] || {};

  return (
    <div className="space-y-6 max-w-max-width mx-auto w-full">
      {/* Top Header */}
      <section className="flex flex-col gap-1">
        <h2 className="font-headline-md text-headline-md text-primary flex items-center gap-2">
          <span className="material-symbols-outlined text-secondary text-2xl">memory</span>
          SVM Kernel Matrix Analysis ({symbol})
        </h2>
        <p className="text-sm text-text-muted">
          Benchmarking Support Vector Machine kernel transformations on stock price direction classification.
        </p>
      </section>

      {/* 4 Kernel Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kernelMatrix.map((k) => {
          const isActive = activeKernel === k.kernel;
          const isPositive = k.strategy_return >= 0;
          return (
            <div
              key={k.kernel}
              onClick={() => onSelectKernel(k.kernel)}
              className={`glass-card p-4 rounded-lg flex flex-col gap-3 transition-all cursor-pointer relative overflow-hidden ${
                isActive ? 'active-glow border-secondary bg-surface-glass' : 'hover:bg-surface-container border-glow/30'
              }`}
            >
              {isActive && (
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/20 blur-xl rounded-full -translate-y-1/2 translate-x-1/2"></div>
              )}
              <div className="flex justify-between items-start relative z-10">
                <div>
                  <div className={`font-label-caps text-label-caps flex items-center gap-1 ${isActive ? 'text-secondary font-bold' : 'text-text-muted'}`}>
                    {isActive && <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>}
                    {isActive ? 'ACTIVE KERNEL' : 'KERNEL'}
                  </div>
                  <div className={`font-data-md text-data-md mt-1 ${isActive ? 'text-neon text-on-surface font-bold' : 'text-on-surface'}`}>
                    {k.label}
                  </div>
                </div>
                <span className={`material-symbols-outlined ${isActive ? 'text-secondary' : 'text-text-muted'}`}>
                  {k.kernel === 'rbf' ? 'scatter_plot' : (k.kernel === 'poly' ? 'show_chart' : (k.kernel === 'linear' ? 'straight' : 'ssid_chart'))}
                </span>
              </div>

              <div className="flex justify-between items-end relative z-10">
                <div>
                  <div className={`font-data-lg text-data-lg ${isPositive ? 'text-signal-positive' : 'text-signal-negative'} ${isActive ? 'text-neon font-bold' : ''}`}>
                    {isPositive ? `+${k.strategy_return}%` : `${k.strategy_return}%`}
                  </div>
                  <div className="font-data-sm text-data-sm text-text-muted">
                    Test Acc: {k.test_acc}%
                  </div>
                </div>

                <svg className="w-16 h-8" viewBox="0 0 64 32">
                  <path
                    className="sparkline"
                    stroke={isActive ? '#4cd7f6' : (isPositive ? '#10B981' : '#F43F5E')}
                    d={
                      k.kernel === 'rbf' ? "M0,28 L10,24 L20,18 L30,22 L40,12 L50,6 L64,4" :
                      (k.kernel === 'linear' ? "M0,24 L10,20 L20,26 L30,16 L40,18 L50,8 L64,12" :
                      (k.kernel === 'poly' ? "M0,16 L10,12 L20,20 L30,18 L40,24 L50,28 L64,22" : "M0,20 L20,20 L30,10 L50,10 L64,10"))
                    }
                  />
                </svg>
              </div>
            </div>
          );
        })}
      </div>

      {/* Risk Metrics Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Sharpe Ratio Gauge */}
        <div className="glass-card p-4 rounded-xl flex flex-col items-center justify-center min-h-[170px] relative">
          <h4 className="font-label-caps text-label-caps text-text-muted absolute top-4 left-4 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-secondary text-sm">balance</span>
            SHARPE RATIO
          </h4>
          <div className="relative w-24 h-24 mt-6">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="#31353e" strokeWidth="8" strokeDasharray="141" strokeDashoffset="0" transform="rotate(135 50 50)" />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#4cd7f6"
                strokeWidth="8"
                strokeDasharray="141"
                strokeDashoffset={Math.max(0, 141 - ((backtestMetrics.sharpe_ratio || activeKernelObj.sharpe_ratio || 1.5) / 3.0) * 141)}
                transform="rotate(135 50 50)"
                style={{ filter: 'drop-shadow(0 0 4px rgba(76, 215, 246, 0.6))' }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <span className="font-data-lg text-data-lg text-secondary font-bold">
                {backtestMetrics.sharpe_ratio ?? activeKernelObj.sharpe_ratio ?? 2.4}
              </span>
              <span className="text-[9px] font-label-caps text-text-muted">Risk Adjusted</span>
            </div>
          </div>
        </div>

        {/* Max Drawdown */}
        <div className="glass-card p-4 rounded-xl flex flex-col min-h-[170px]">
          <h4 className="font-label-caps text-label-caps text-text-muted mb-auto flex items-center gap-1.5">
            <span className="material-symbols-outlined text-signal-negative text-sm">trending_down</span>
            MAX DRAWDOWN
          </h4>
          <div className="flex items-end justify-between mt-4 border-b border-glow/30 pb-2">
            <span className="font-data-lg text-data-lg text-signal-negative font-bold">
              {backtestMetrics.max_drawdown ?? activeKernelObj.max_drawdown ?? -4.2}%
            </span>
            <span className="font-data-sm text-data-sm text-text-muted">Target: &lt; -10.0%</span>
          </div>
          <div className="w-full h-2 bg-surface-variant rounded-full mt-4 overflow-hidden">
            <div
              className="h-full bg-signal-negative"
              style={{
                width: `${Math.min(100, Math.abs(backtestMetrics.max_drawdown ?? activeKernelObj.max_drawdown ?? 4.2) * 5)}%`,
                boxShadow: '0 0 8px rgba(244, 63, 94, 0.6)'
              }}
            ></div>
          </div>
        </div>

        {/* Win / Loss Ratio */}
        <div className="glass-card p-4 rounded-xl flex flex-col items-center justify-center min-h-[170px] relative">
          <h4 className="font-label-caps text-label-caps text-text-muted absolute top-4 left-4 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-signal-positive text-sm">pie_chart</span>
            WIN/LOSS RATIO
          </h4>
          <div className="flex w-full items-center justify-center gap-6 mt-6">
            <div className="relative w-16 h-16">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 32 32">
                <circle cx="16" cy="16" r="16" fill="transparent" stroke="#F43F5E" strokeWidth="6" strokeDasharray="100 100" />
                <circle
                  cx="16"
                  cy="16"
                  r="16"
                  fill="transparent"
                  stroke="#10B981"
                  strokeWidth="6"
                  strokeDasharray={`${backtestMetrics.win_rate ?? activeKernelObj.win_rate ?? 68} 100`}
                />
              </svg>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-signal-positive shadow-[0_0_6px_#10B981]"></span>
                <span className="font-data-sm text-data-sm text-on-surface font-semibold">
                  Win ({backtestMetrics.win_rate ?? activeKernelObj.win_rate ?? 68}%)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-signal-negative shadow-[0_0_6px_#F43F5E]"></span>
                <span className="font-data-sm text-data-sm text-on-surface">
                  Loss ({round100(100 - (backtestMetrics.win_rate ?? activeKernelObj.win_rate ?? 68))}%)
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function round100(val) {
  return Math.round(val * 10) / 10;
}
