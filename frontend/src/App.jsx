import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import PerformanceChart from './components/PerformanceChart';
import ConfusionMatrix from './components/ConfusionMatrix';
import KernelLab from './components/KernelLab';
import SignalsLog from './components/SignalsLog';
import MonteCarloCard from './components/MonteCarloCard';
import PortfolioAnalytics from './components/PortfolioAnalytics';

export default function App() {
  const [activeTab, setActiveTab] = useState('terminal');
  const [symbol, setSymbol] = useState('RELIANCE');
  const [kernel, setKernel] = useState('rbf');
  const [penaltyC, setPenaltyC] = useState(1.0);
  const [gamma, setGamma] = useState('scale');
  const [degree, setDegree] = useState(3);
  const [splitRatio, setSplitRatio] = useState(0.8);
  const [selectedFeatures, setSelectedFeatures] = useState(['Open-Close', 'High-Low', 'RSI']);

  const [predictionData, setPredictionData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optNotice, setOptNotice] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    runPrediction();
  }, [symbol, kernel]);

  const runPrediction = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch('http://localhost:8000/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symbol: symbol,
          selected_features: selectedFeatures,
          split_percentage: parseFloat(splitRatio),
          kernel: kernel,
          C: parseFloat(penaltyC),
          gamma: gamma,
          degree: parseInt(degree)
        })
      });

      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`);
      }

      const data = await res.json();
      setPredictionData(data);
    } catch (err) {
      console.warn("API request failed, generating client fallback simulation", err);
      setErrorMsg("Backend server offline. Running simulated ML pipeline mode.");
      generateFallbackData();
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportCSV = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symbol: symbol,
          selected_features: selectedFeatures,
          kernel: kernel,
          C: parseFloat(penaltyC)
        })
      });

      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `SVM_Backtest_${symbol}_${kernel}.csv`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      }
    } catch (e) {
      console.warn("CSV export failed", e);
    }
  };

  const handleAutoOptimize = async () => {
    setIsOptimizing(true);
    setOptNotice(null);
    try {
      const res = await fetch('http://localhost:8000/api/optimize', {
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
        const opt = data.optimization;
        setPenaltyC(opt.best_C);
        if (opt.best_gamma) setGamma(opt.best_gamma);
        if (opt.best_degree) setDegree(opt.best_degree);

        setOptNotice(`Optimal Parameters Found: C=${opt.best_C}, CV Accuracy=${opt.best_cv_accuracy}%`);
        setTimeout(() => setOptNotice(null), 5000);
      }
    } catch (e) {
      console.warn("Auto optimize failed", e);
    } finally {
      setIsOptimizing(false);
    }
  };

  const generateFallbackData = () => {
    const basePrice = symbol === 'RELIANCE' ? 2500 : (symbol === 'TCS' ? 3800 : 1150);
    const timeseries = [];
    let stockCum = 0;
    let stratCum = 0;

    for (let i = 250; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const stockRet = (Math.random() * 3.2 - 1.5);
      const signal = Math.random() > 0.4 ? 1 : 0;
      const stratRet = signal === 1 ? stockRet * 1.15 : 0;

      stockCum += stockRet;
      stratCum += stratRet;

      timeseries.push({
        date: dateStr,
        close: round2(basePrice * (1 + stockCum / 100)),
        stock_return: round2(stockCum),
        strategy_return: round2(stratCum),
        signal: signal
      });
    }

    setPredictionData({
      symbol: symbol,
      latest_price: timeseries[timeseries.length - 1].close,
      pct_change: 1.4,
      used_features: selectedFeatures,
      model_performance: {
        kernel: kernel,
        train_accuracy: 78.4,
        test_accuracy: 72.5,
        confusion_matrix: { tn: 342, fp: 89, fn: 64, tp: 415 },
        precision: 82.3,
        recall: 86.6,
        f1_score: 0.84
      },
      backtest: {
        total_stock_return: round2(stockCum),
        total_strategy_return: round2(stratCum),
        alpha: round2(stratCum - stockCum),
        sharpe_ratio: 2.4,
        max_drawdown: -4.2,
        win_rate: 68.0,
        timeseries: timeseries
      }
    });
  };

  const toggleFeature = (feat) => {
    setSelectedFeatures(prev => 
      prev.includes(feat) ? prev.filter(f => f !== feat) : [...prev, feat]
    );
  };

  const backtest = predictionData?.backtest || {};
  const modelPerf = predictionData?.model_performance || {};
  const signalAlert = predictionData?.signal_alert || {};

  return (
    <div className="min-h-screen flex flex-col md:pl-64 bg-background text-on-surface">
      <Header
        selectedSymbol={symbol}
        onSelectSymbol={setSymbol}
        latestPrice={predictionData?.latest_price}
        pctChange={predictionData?.pct_change || 0}
        isLiveLoading={isLoading}
        onExportCSV={handleExportCSV}
      />

      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} activeKernel={kernel} />

      <main className="flex-1 mt-16 p-6 md:p-8 space-y-6 w-full max-w-[1920px]">
        {errorMsg && (
          <div className="bg-primary/10 border border-primary/40 text-primary px-5 py-3 rounded-lg text-sm flex justify-between items-center shadow-lg">
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined text-base">info</span>
              {errorMsg}
            </span>
            <button onClick={runPrediction} className="underline hover:text-white font-semibold">Retry Connection</button>
          </div>
        )}

        {/* Live Signal Alert Pill */}
        {signalAlert.message && (
          <div className="glass-panel px-5 py-3 rounded-lg border border-secondary/40 flex items-center justify-between text-sm shadow-xl">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse"></span>
              <span className="font-semibold text-on-surface">{signalAlert.message}</span>
            </div>
            <span className="font-label-caps text-xs text-secondary font-bold px-2 py-0.5 rounded bg-secondary/10">
              CONVICTION: {signalAlert.conviction}
            </span>
          </div>
        )}

        {optNotice && (
          <div className="bg-signal-positive/10 border border-signal-positive/40 text-signal-positive px-5 py-3 rounded-lg text-sm flex items-center gap-2 shadow-lg">
            <span className="material-symbols-outlined text-base">auto_fix_high</span>
            {optNotice}
          </div>
        )}

        {activeTab === 'terminal' && (
          <>
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="glass-panel p-5 rounded-xl flex flex-col gap-2 relative overflow-hidden transition-all hover:border-secondary/50">
                <span className="font-label-caps text-label-caps text-text-muted flex items-center justify-between text-xs">
                  SVM TEST ACCURACY
                  <span className="material-symbols-outlined text-secondary text-base">verified</span>
                </span>
                <span className="font-data-lg text-3xl text-secondary font-bold drop-shadow-[0_0_10px_rgba(76,215,246,0.4)]">
                  {modelPerf.test_accuracy ? `${modelPerf.test_accuracy}%` : '78.4%'}
                </span>
                <span className="text-xs text-text-muted flex items-center gap-1">
                  <span>Train Accuracy:</span>
                  <span className="text-on-surface font-semibold">{modelPerf.train_accuracy || 80.2}%</span>
                </span>
              </div>

              <div className="glass-panel p-5 rounded-xl flex flex-col gap-2 relative overflow-hidden transition-all hover:border-primary/50">
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-primary/20 blur-xl rounded-full"></div>
                <span className="font-label-caps text-label-caps text-text-muted flex items-center justify-between text-xs">
                  STRATEGY CUMULATIVE RETURN
                  <span className="material-symbols-outlined text-primary text-base">trending_up</span>
                </span>
                <span className="font-data-lg text-3xl text-primary font-bold">
                  {backtest.total_strategy_return >= 0 ? `+${backtest.total_strategy_return}%` : `${backtest.total_strategy_return}%`}
                </span>
                <span className="text-xs text-text-muted">Total Yield on Signals</span>
              </div>

              <div className="glass-panel p-5 rounded-xl flex flex-col gap-2 relative overflow-hidden transition-all hover:border-signal-negative/50">
                <span className="font-label-caps text-label-caps text-text-muted flex items-center justify-between text-xs">
                  STOCK BUY & HOLD BENCHMARK
                  <span className="material-symbols-outlined text-signal-negative text-base">finance</span>
                </span>
                <span className="font-data-lg text-3xl text-signal-negative font-bold">
                  {backtest.total_stock_return >= 0 ? `+${backtest.total_stock_return}%` : `${backtest.total_stock_return}%`}
                </span>
                <span className="text-xs text-text-muted">Passive Stock Holding Yield</span>
              </div>

              <div className="glass-panel p-5 rounded-xl flex flex-col gap-2 relative overflow-hidden transition-all hover:border-signal-positive/50">
                <div className="absolute bottom-0 right-0 w-20 h-20 bg-signal-positive/10 blur-xl rounded-full"></div>
                <span className="font-label-caps text-label-caps text-text-muted flex items-center justify-between text-xs">
                  ALPHA (OUTPERFORMANCE)
                  <span className="material-symbols-outlined text-signal-positive text-base">workspace_premium</span>
                </span>
                <span className="font-data-lg text-3xl text-signal-positive font-bold drop-shadow-[0_0_10px_rgba(16,185,129,0.4)]">
                  {backtest.alpha >= 0 ? `+${backtest.alpha}%` : `${backtest.alpha}%`}
                </span>
                <span className="text-xs text-text-muted">Strategy Yield vs Stock Delta</span>
              </div>
            </section>

            <PerformanceChart timeseries={backtest.timeseries || []} symbol={symbol} />

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
              <section className="xl:col-span-7 glass-panel rounded-xl p-6 flex flex-col gap-6">
                <h3 className="font-headline-sm text-headline-sm text-on-surface border-b border-glow/30 pb-3 flex items-center justify-between text-lg font-bold">
                  <span className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-secondary text-2xl">tune</span>
                    SVM Machine Learning Sandbox
                  </span>
                  <button
                    onClick={handleAutoOptimize}
                    disabled={isOptimizing}
                    className="text-xs text-secondary font-label-caps uppercase px-3 py-1.5 rounded-lg bg-secondary/10 border border-secondary/40 font-bold flex items-center gap-1.5 hover:bg-secondary/20 transition-all cursor-pointer"
                  >
                    <span className={`material-symbols-outlined text-sm ${isOptimizing ? 'animate-spin' : ''}`}>auto_fix_high</span>
                    {isOptimizing ? 'Tuning...' : 'Auto-Tune Grid'}
                  </button>
                </h3>

                <div className="flex flex-col gap-2.5">
                  <span className="font-label-caps text-xs text-text-muted">SELECT KERNEL FUNCTION</span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {['rbf', 'linear', 'poly', 'sigmoid'].map((k) => (
                      <button
                        key={k}
                        onClick={() => setKernel(k)}
                        className={`py-2 px-4 font-body-sm text-sm rounded-lg transition-all uppercase font-semibold text-center cursor-pointer ${
                          kernel === k
                            ? 'bg-primary/20 text-secondary border-2 border-secondary shadow-[0_0_15px_rgba(76,215,246,0.3)] font-bold'
                            : 'bg-surface-variant/80 text-text-muted hover:text-on-surface hover:bg-surface-container-high border border-transparent'
                        }`}
                      >
                        {k}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-2.5">
                  <span className="font-label-caps text-xs text-text-muted">PREDICTOR FEATURE VARIABLES</span>
                  <div className="flex flex-wrap gap-2.5">
                    {['Open-Close', 'High-Low', 'RSI', 'SMA_Diff', 'MACD', 'Bollinger_Bands', 'Volatility'].map((feat) => {
                      const isSelected = selectedFeatures.includes(feat);
                      return (
                        <button
                          key={feat}
                          onClick={() => toggleFeature(feat)}
                          className={`px-3.5 py-1.5 font-data-sm text-xs rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-primary-container/20 text-primary border border-primary/60 font-semibold shadow-[0_0_10px_rgba(37,99,235,0.2)]'
                              : 'bg-surface-container-high text-text-muted hover:text-on-surface border border-transparent'
                          }`}
                        >
                          <span className="material-symbols-outlined text-sm">
                            {isSelected ? 'check_box' : 'checkbox_outline_blank'}
                          </span>
                          {feat}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between">
                      <label className="font-label-caps text-xs text-text-muted">PENALTY PARAMETER (C)</label>
                      <span className="font-data-sm text-sm text-secondary font-bold">{penaltyC}</span>
                    </div>
                    <input
                      type="range"
                      min="0.1"
                      max="10.0"
                      step="0.1"
                      value={penaltyC}
                      onChange={(e) => setPenaltyC(e.target.value)}
                      className="w-full h-2 bg-surface-container-high rounded-lg appearance-none cursor-pointer accent-secondary"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between">
                      <label className="font-label-caps text-xs text-text-muted">TRAIN / TEST SPLIT RATIO</label>
                      <span className="font-data-sm text-sm text-primary font-bold">{Math.round(splitRatio * 100)}% Train</span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="0.9"
                      step="0.05"
                      value={splitRatio}
                      onChange={(e) => setSplitRatio(e.target.value)}
                      className="w-full h-2 bg-surface-container-high rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                  </div>
                </div>

                <button
                  onClick={runPrediction}
                  disabled={isLoading}
                  className="w-full py-3.5 mt-2 rounded-xl bg-primary-container text-on-primary-container font-headline-sm text-base hover:shadow-[0_0_24px_rgba(37,99,235,0.6)] transition-all duration-300 active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer font-bold"
                >
                  <span className={`material-symbols-outlined ${isLoading ? 'animate-spin' : ''}`}>psychology</span>
                  {isLoading ? 'Retraining Support Vector Engine...' : 'Run Retrain & Execute Backtest'}
                </button>
              </section>

              <div className="xl:col-span-5">
                <ConfusionMatrix
                  matrix={modelPerf.confusion_matrix}
                  precision={modelPerf.precision}
                  recall={modelPerf.recall}
                  f1={modelPerf.f1_score}
                />
              </div>
            </div>

            <MonteCarloCard symbol={symbol} kernel={kernel} selectedFeatures={selectedFeatures} />
          </>
        )}

        {activeTab === 'lab' && (
          <KernelLab
            symbol={symbol}
            activeKernel={kernel}
            onSelectKernel={(k) => { setKernel(k); setActiveTab('terminal'); }}
            backtestMetrics={backtest}
          />
        )}

        {activeTab === 'portfolio' && (
          <PortfolioAnalytics onSelectStock={(s) => { setSymbol(s); setActiveTab('terminal'); }} />
        )}

        {(activeTab === 'signals' || activeTab === 'backtest') && (
          <SignalsLog timeseries={backtest.timeseries || []} symbol={symbol} />
        )}
      </main>
    </div>
  );
}

function round2(val) {
  return Math.round(val * 100) / 100;
}
