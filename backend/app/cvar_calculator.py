import numpy as np
import pandas as pd

def calculate_expected_shortfall(returns, confidence_levels=[0.95, 0.99]):
    """
    Calculates Value at Risk (VaR) and Conditional Value at Risk (CVaR / Expected Shortfall)
    for tail risk evaluation.
    """
    clean_returns = returns.dropna().values
    if len(clean_returns) == 0:
        return {}
        
    results = {}
    for conf in confidence_levels:
        cutoff_index = int((1.0 - conf) * len(clean_returns))
        sorted_returns = np.sort(clean_returns)
        var_val = float(-sorted_returns[max(0, cutoff_index)])
        cvar_val = float(-np.mean(sorted_returns[:max(1, cutoff_index)]))
        
        pct_key = int(conf * 100)
        results[f"var_{pct_key}"] = round(var_val * 100, 2)
        results[f"cvar_{pct_key}"] = round(cvar_val * 100, 2)
        
    return results
