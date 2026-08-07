import React from 'react';

export default function Header({ selectedSymbol, onSelectSymbol, latestPrice, pctChange, isLiveLoading, onExportCSV }) {
  const stocks = [
    { symbol: "RELIANCE", name: "Reliance Industries", exchange: "NSE" },
    { symbol: "TCS", name: "TCS Ltd", exchange: "NSE" },
    { symbol: "ICICI", name: "ICICI Bank", exchange: "NSE" },
    { symbol: "AAPL", name: "Apple Inc", exchange: "NASDAQ" },
    { symbol: "TSLA", name: "Tesla Inc", exchange: "NASDAQ" }
  ];

  return (
    <header className="fixed top-0 right-0 left-0 md:left-64 bg-surface-glass/80 backdrop-blur-xl border-b border-glow shadow-[0_0_20px_rgba(37,99,235,0.1)] flex justify-between items-center px-6 md:px-8 z-40 h-16">
      <div className="flex items-center gap-3">
        <span className="material-symbols-outlined text-primary text-2xl animate-pulse">monitoring</span>
        <h1 className="font-headline-md text-headline-md text-primary tracking-tight hidden sm:block">QUANTUM_SVM</h1>
        <span className="text-[11px] font-label-caps px-2.5 py-0.5 rounded-full bg-primary/10 text-secondary border border-primary/30 font-semibold">
          v3.0 QUANT ENTERPRISE
        </span>
      </div>

      <div className="flex items-center gap-4">
        {/* Stock Selector Dropdown */}
        <div className="glass-panel px-4 py-1.5 rounded-lg flex items-center gap-4 border border-glow/30">
          <div className="flex flex-col items-end">
            <div className="font-data-md text-data-md text-on-surface flex items-center gap-2">
              <span className="text-xs font-label-caps text-text-muted hidden md:inline">TICKER:</span>
              <select
                value={selectedSymbol}
                onChange={(e) => onSelectSymbol(e.target.value)}
                className="bg-surface-glass text-on-surface font-semibold focus:outline-none cursor-pointer border-b border-primary/40 py-0.5 px-1 rounded-sm text-sm"
              >
                {stocks.map((s) => (
                  <option key={s.symbol} value={s.symbol} className="bg-surface-glass text-on-surface">
                    {s.symbol} ({s.exchange}) - {s.name}
                  </option>
                ))}
              </select>
              <span className={`font-data-sm text-data-sm font-bold ${pctChange >= 0 ? 'text-signal-positive' : 'text-signal-negative'}`}>
                {pctChange >= 0 ? `+${pctChange}%` : `${pctChange}%`}
              </span>
            </div>
            <div className="font-data-sm text-data-sm text-text-muted">
              {latestPrice ? `₹${latestPrice.toLocaleString('en-IN')}` : 'Loading...'}
            </div>
          </div>
        </div>

        {/* CSV Export Button */}
        <button
          onClick={onExportCSV}
          title="Export CSV Report"
          className="px-3.5 py-2 font-label-caps text-xs rounded-lg bg-primary-container text-on-primary-container font-semibold hover:shadow-[0_0_12px_rgba(37,99,235,0.4)] transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <span className="material-symbols-outlined text-sm">download</span>
          <span className="hidden sm:inline">Export CSV</span>
        </button>

        <button 
          onClick={() => onSelectSymbol(selectedSymbol)}
          title="Refresh ML Predictor Engine"
          className={`material-symbols-outlined text-on-surface-variant hover:text-secondary hover:bg-surface-container-high/50 transition-all p-2 rounded-full cursor-pointer active:scale-95 duration-200 ${isLiveLoading ? 'animate-spin text-secondary' : ''}`}
        >
          autorenew
        </button>
      </div>
    </header>
  );
}
