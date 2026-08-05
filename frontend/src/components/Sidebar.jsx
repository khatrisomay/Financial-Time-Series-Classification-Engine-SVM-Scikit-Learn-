import React from 'react';

export default function Sidebar({ activeTab, setActiveTab, activeKernel }) {
  const navItems = [
    { id: 'terminal', label: 'Terminal', icon: 'terminal' },
    { id: 'lab', label: 'Kernel Matrix Lab', icon: 'tune' },
    { id: 'signals', label: 'Signals & Signals Log', icon: 'query_stats' },
    { id: 'backtest', label: 'Risk & Backtest', icon: 'history_toggle_off' }
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <nav className="hidden md:flex flex-col pt-20 pb-4 h-full fixed left-0 w-64 border-r border-glow bg-surface-container-lowest/90 backdrop-blur-2xl z-40">
        <div className="px-6 mb-8 flex flex-col gap-1">
          <span className="font-display-lg text-display-lg text-primary text-2xl font-bold tracking-tight">
            SVM_CORE_v2
          </span>
          <span className="font-body-sm text-body-sm text-text-muted">
            Active Kernel: <span className="text-secondary font-semibold uppercase">{activeKernel}</span>
          </span>
          <span className="font-label-caps text-label-caps text-signal-positive mt-1 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-signal-positive animate-pulse"></span>
            Status: Engine Active
          </span>
        </div>

        <div className="flex flex-col gap-1.5 px-3">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-md transition-all text-left ${
                  isActive
                    ? 'text-primary bg-primary-container/15 border-l-4 border-primary font-semibold shadow-[0_0_15px_rgba(37,99,235,0.2)]'
                    : 'text-text-muted hover:text-on-surface hover:bg-surface-container-high/60'
                }`}
              >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>
                  {item.icon}
                </span>
                <span className="font-body-md text-body-md">{item.label}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-auto px-6 pt-4 border-t border-glow/50 text-xs text-text-muted">
          <div className="font-label-caps text-[10px] text-text-muted mb-1">SVM ALGORITHMIC SYSTEM</div>
          <p>Support Vector Classification on Technical Indicator Features</p>
        </div>
      </nav>

      {/* Mobile Bottom Bar */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center h-16 px-4 bg-surface-container/90 backdrop-blur-md border-t border-glow sm:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.5)]">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center p-2 transition-all ${
                isActive ? 'text-primary bg-primary/10 rounded-full p-2.5 shadow-[inset_0_0_8px_rgba(37,99,235,0.3)]' : 'text-on-surface-variant'
              }`}
            >
              <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>
                {item.icon}
              </span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
