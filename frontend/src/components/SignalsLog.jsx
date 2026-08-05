import React from 'react';

export default function SignalsLog({ timeseries = [], symbol }) {
  const recentLogs = timeseries.slice(-50).reverse();

  return (
    <section className="glass-panel rounded-lg p-4 flex flex-col gap-4">
      <div className="flex justify-between items-center border-b border-glow/30 pb-3">
        <div>
          <h3 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">format_list_bulleted</span>
            SVM Signal Prediction Log ({symbol})
          </h3>
          <p className="text-xs text-text-muted">Recent daily signal classifications (+1 Buy, 0 Cash/Hold)</p>
        </div>
        <span className="font-label-caps text-label-caps px-2.5 py-1 rounded bg-primary/10 text-secondary border border-primary/30">
          Showing 50 Recent Days
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left font-data-sm text-data-sm">
          <thead>
            <tr className="border-b border-glow/40 text-text-muted font-label-caps text-xs">
              <th className="py-2.5 px-3">Date</th>
              <th className="py-2.5 px-3">Close Price</th>
              <th className="py-2.5 px-3">Daily Stock Ret</th>
              <th className="py-2.5 px-3">SVM Signal</th>
              <th className="py-2.5 px-3">Strategy Return</th>
            </tr>
          </thead>
          <tbody>
            {recentLogs.map((row, idx) => (
              <tr key={idx} className="border-b border-glow/10 hover:bg-surface-container-high/50 transition-colors">
                <td className="py-2 px-3 font-mono text-on-surface">{row.date}</td>
                <td className="py-2 px-3 font-semibold text-on-surface">₹{row.close}</td>
                <td className={`py-2 px-3 ${row.stock_return >= 0 ? 'text-signal-positive' : 'text-signal-negative'}`}>
                  {row.stock_return >= 0 ? `+${row.stock_return}%` : `${row.stock_return}%`}
                </td>
                <td className="py-2 px-3">
                  {row.signal === 1 ? (
                    <span className="px-2 py-0.5 rounded bg-signal-positive/20 text-signal-positive border border-signal-positive/40 font-bold">
                      +1 BUY
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded bg-surface-variant text-text-muted border border-transparent">
                      0 CASH
                    </span>
                  )}
                </td>
                <td className={`py-2 px-3 font-bold ${row.strategy_return >= 0 ? 'text-secondary' : 'text-signal-negative'}`}>
                  {row.strategy_return >= 0 ? `+${row.strategy_return}%` : `${row.strategy_return}%`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
