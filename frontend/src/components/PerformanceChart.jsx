import React, { useState } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

export default function PerformanceChart({ timeseries = [], symbol }) {
  const [timeRange, setTimeRange] = useState('ALL');

  const filteredData = React.useMemo(() => {
    if (!timeseries || timeseries.length === 0) return [];
    if (timeRange === '1M') return timeseries.slice(-22);
    if (timeRange === '6M') return timeseries.slice(-130);
    if (timeRange === '1Y') return timeseries.slice(-252);
    return timeseries;
  }, [timeseries, timeRange]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload;
      return (
        <div className="glass-panel p-4 rounded-xl border border-secondary text-data-sm shadow-2xl backdrop-blur-xl z-30 min-w-[200px]">
          <div className="text-text-muted font-label-caps mb-1 border-b border-glow/30 pb-1">{label}</div>
          <div className="font-semibold text-on-surface text-base py-1">Close: ₹{dataPoint.close}</div>
          <div className="text-secondary font-bold flex items-center justify-between gap-4 py-0.5">
            <span>SVM Strategy:</span>
            <span className="text-base">{dataPoint.strategy_return >= 0 ? `+${dataPoint.strategy_return}%` : `${dataPoint.strategy_return}%`}</span>
          </div>
          <div className="text-signal-negative flex items-center justify-between gap-4 py-0.5">
            <span>Benchmark:</span>
            <span>{dataPoint.stock_return >= 0 ? `+${dataPoint.stock_return}%` : `${dataPoint.stock_return}%`}</span>
          </div>
          <div className="mt-2 pt-1.5 border-t border-glow/40 font-label-caps flex items-center justify-between">
            <span className="text-xs text-text-muted">Signal:</span>
            <span className={dataPoint.signal === 1 ? 'text-signal-positive font-bold px-2 py-0.5 rounded bg-signal-positive/20 border border-signal-positive/30' : 'text-text-muted px-2 py-0.5 rounded bg-surface-variant'}>
              {dataPoint.signal === 1 ? '+1 BUY' : '0 HOLD'}
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <section className="glass-panel rounded-xl p-6 flex flex-col gap-4 w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-glow/30 pb-4">
        <div>
          <h2 className="font-headline-md text-headline-md text-on-surface flex items-center gap-2.5 text-xl font-bold">
            <span className="material-symbols-outlined text-secondary text-2xl">show_chart</span>
            Performance Trajectory: SVM Strategy vs Stock Benchmark ({symbol})
          </h2>
          <p className="text-xs text-text-muted mt-0.5">
            Cumulative Strategy Returns vs Buy & Hold Benchmark across historical dataset
          </p>
        </div>

        <div className="flex gap-1.5 bg-surface-container-high/80 rounded-lg p-1.5 border border-glow/20">
          {['1M', '6M', '1Y', 'ALL'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-1.5 font-label-caps text-label-caps rounded-md transition-all text-xs font-semibold ${
                timeRange === range
                  ? 'bg-primary-container text-on-primary-container shadow-[0_0_12px_rgba(37,99,235,0.4)] border border-primary/50'
                  : 'text-text-muted hover:text-on-surface hover:bg-surface-variant'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Widescreen Desktop Chart Canvas */}
      <div className="h-[360px] md:h-[420px] w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={filteredData} margin={{ top: 15, right: 25, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 11 }} tickLine={false} dy={5} />
            <YAxis stroke="#64748b" tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}%`} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: '13px', paddingTop: '15px' }}
              formatter={(value) => <span className="text-on-surface-variant font-medium px-2">{value}</span>}
            />
            {/* Stock Benchmark Return Line (Red) */}
            <Line
              type="monotone"
              dataKey="stock_return"
              name="Stock Benchmark (Buy & Hold)"
              stroke="#F43F5E"
              strokeWidth={1.8}
              strokeDasharray="3 3"
              dot={false}
              activeDot={{ r: 5 }}
            />
            {/* SVM Strategy Cumulative Return Line (Neon Blue) */}
            <Line
              type="monotone"
              dataKey="strategy_return"
              name="SVM Strategy Cumulative Yield"
              stroke="#4cd7f6"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 7, fill: '#4cd7f6', stroke: '#070A12', strokeWidth: 2 }}
              style={{ filter: 'drop-shadow(0 0 8px rgba(76, 215, 246, 0.7))' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex flex-wrap gap-8 font-data-sm text-data-sm justify-center text-text-muted pt-3 border-t border-glow/30">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-secondary shadow-[0_0_10px_#4cd7f6]"></div>
          <span className="text-on-surface font-semibold">SVM Cumulative Strategy Return</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-signal-negative opacity-80"></div>
          <span className="text-on-surface">Buy & Hold Benchmark</span>
        </div>
      </div>
    </section>
  );
}
