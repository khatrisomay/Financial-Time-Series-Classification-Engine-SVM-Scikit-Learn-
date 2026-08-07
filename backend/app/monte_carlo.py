import numpy as np
import pandas as pd

def run_monte_carlo_simulation(strategy_returns, num_simulations=500, forecast_days=60):
    """
    Runs Monte Carlo simulation of strategy returns to calculate 95% Confidence Intervals & Value-at-Risk (VaR).
    """
    returns_clean = pd.Series(strategy_returns).fillna(0)
    mean_ret = returns_clean.mean()
    std_ret = returns_clean.std()
    
    if std_ret == 0 or np.isnan(std_ret):
        std_ret = 0.015
        
    simulated_paths = np.zeros((forecast_days, num_simulations))
    simulated_paths[0] = 100.0 # Base portfolio value $100
    
    np.random.seed(42)
    for t in range(1, forecast_days):
        random_shocks = np.random.normal(mean_ret, std_ret, num_simulations)
        simulated_paths[t] = simulated_paths[t-1] * (1 + random_shocks)
        
    final_values = simulated_paths[-1]
    pct_changes = ((final_values - 100.0) / 100.0) * 100.0
    
    p5 = float(np.percentile(pct_changes, 5))
    p50 = float(np.percentile(pct_changes, 50))
    p95 = float(np.percentile(pct_changes, 95))
    var_95 = round(abs(min(0, p5)), 2)
    
    # Format sample quantile paths for web visualization
    forecast_timeline = []
    for d in range(forecast_days):
        day_slice = simulated_paths[d]
        forecast_timeline.append({
            'day': d + 1,
            'p5': round(float(np.percentile(day_slice, 5) - 100.0), 2),
            'p50': round(float(np.percentile(day_slice, 50) - 100.0), 2),
            'p95': round(float(np.percentile(day_slice, 95) - 100.0), 2)
        })
        
    return {
        'forecast_days': forecast_days,
        'simulations': num_simulations,
        'bear_case_p5': round(p5, 2),
        'expected_p50': round(p50, 2),
        'bull_case_p95': round(p95, 2),
        'var_95': var_95,
        'timeline': forecast_timeline
    }
