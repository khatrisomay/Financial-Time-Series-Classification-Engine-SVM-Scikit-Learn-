import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';

export default function PerformanceChart({ timeseries, symbol }) {
  if (!timeseries || timeseries.length === 0) {
    return (
      <div className="glass-panel rounded-xl p-8 flex items-center justify-center text-text-muted">
        Loading strategy performance chart...
      </div>
    );
  }

  const latest = timeseries[timeseries.length - 1];

  return (
    <section className="glass-panel rounded-xl p-6 flex flex-col gap-6 w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-glow/30 pb-4 gap-4">
        <div>
          <h2 className="font-headline-md text-headline-md text-on-surface flex items-center gap-2.5 text-xl font-bold">
            <span className="material-symbols-outlined text-primary text-2xl">ssid_chart</span>
            SVM Strategy Trajectory vs Benchmark ({symbol})
          </h2>
          <p className="text-xs text-text-muted mt-0.5">
            250-Day Backtest Trajectory Incorporating Trade Execution Friction & Downside Risk Analytics
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="glass-panel px-3 py-1 rounded-lg border border-glow/30 flex items-center gap-2 text-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-primary"></span>
            <span className="text-text-muted">SVM Strategy:</span>
            <span className="font-bold text-primary">+{latest.strategy_return}%</span>
          </div>

          <div className="glass-panel px-3 py-1 rounded-lg border border-glow/30 flex items-center gap-2 text-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-signal-negative"></span>
            <span className="text-text-muted">Stock Holding:</span>
            <span className={`font-bold ${latest.stock_return >= 0 ? 'text-signal-positive' : 'text-signal-negative'}`}>
              {latest.stock_return >= 0 ? `+${latest.stock_return}%` : `${latest.stock_return}%`}
            </span>
          </div>
        </div>
      </div>

      {/* Trajectory Recharts Chart */}
      <div className="h-[360px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={timeseries} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="stratColor" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0}/>
              </linearGradient>
              <linearGradient id="stockColor" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ff5252" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#ff5252" stopOpacity={0.0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(37,99,235,0.15)" vertical={false} />
            <XAxis dataKey="date" stroke="#94a3b8" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
            <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} unit="%" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(15, 23, 42, 0.95)',
                borderColor: 'rgba(37, 99, 235, 0.4)',
                borderRadius: '0.75rem',
                color: '#f8fafc',
                fontSize: '12px',
                boxShadow: '0 0 20px rgba(37,99,235,0.3)'
              }}
            />
            <Area type="monotone" dataKey="strategy_return" name="SVM Strategy Net Yield" stroke="#2563eb" strokeWidth={2.5} fillOpacity={1} fill="url(#stratColor)" />
            <Area type="monotone" dataKey="stock_return" name="Stock Buy & Hold Yield" stroke="#ff5252" strokeWidth={1.5} fillOpacity={1} fill="url(#stockColor)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
