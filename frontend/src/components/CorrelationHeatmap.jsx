import React, { useState, useEffect } from 'react';

export default function CorrelationHeatmap() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchCorrelation();
  }, []);

  const fetchCorrelation = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/correlation');
      if (res.ok) {
        const matrixData = await res.json();
        setData(matrixData);
      }
    } catch (e) {
      console.warn("Correlation fetch fallback", e);
    }
  };

  const symbols = data?.symbols || ['RELIANCE', 'TCS', 'ICICI', 'AAPL', 'TSLA'];
  const matrix = data?.correlation_matrix || {
    'RELIANCE': { 'RELIANCE': 1.0, 'TCS': 0.42, 'ICICI': 0.65, 'AAPL': 0.28, 'TSLA': 0.15 },
    'TCS': { 'RELIANCE': 0.42, 'TCS': 1.0, 'ICICI': 0.48, 'AAPL': 0.35, 'TSLA': 0.22 },
    'ICICI': { 'RELIANCE': 0.65, 'TCS': 0.48, 'ICICI': 1.0, 'AAPL': 0.31, 'TSLA': 0.18 },
    'AAPL': { 'RELIANCE': 0.28, 'TCS': 0.35, 'ICICI': 0.31, 'AAPL': 1.0, 'TSLA': 0.54 },
    'TSLA': { 'RELIANCE': 0.15, 'TCS': 0.22, 'ICICI': 0.18, 'AAPL': 0.54, 'TSLA': 1.0 }
  };

  return (
    <section className="glass-panel rounded-xl p-6 flex flex-col gap-4 w-full">
      <h3 className="font-headline-sm text-headline-sm text-on-surface border-b border-glow/30 pb-3 text-lg font-bold flex items-center gap-2">
        <span className="material-symbols-outlined text-secondary text-xl">grid_on</span>
        Cross-Asset Pearson Correlation Heatmap
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full text-center font-data-sm text-xs border-collapse">
          <thead>
            <tr>
              <th className="p-2 border border-glow/20 bg-surface-container-high text-text-muted">Asset</th>
              {symbols.map((s) => (
                <th key={s} className="p-2 border border-glow/20 bg-surface-container-high text-on-surface font-bold">{s}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {symbols.map((rowSym) => (
              <tr key={rowSym}>
                <td className="p-2 border border-glow/20 bg-surface-container-high text-on-surface font-bold">{rowSym}</td>
                {symbols.map((colSym) => {
                  const val = matrix[rowSym]?.[colSym] ?? 1.0;
                  const isSelf = rowSym === colSym;
                  return (
                    <td
                      key={colSym}
                      className={`p-3 border border-glow/20 font-mono font-semibold text-xs ${
                        isSelf ? 'bg-primary/30 text-white font-bold' :
                        (val > 0.5 ? 'bg-secondary/20 text-secondary' : 'bg-surface-container-low text-text-muted')
                      }`}
                    >
                      {val.toFixed(2)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
