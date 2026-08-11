import sys
import os
import pandas as pd
import numpy as np

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from app.monte_carlo import run_monte_carlo_simulation
from app.portfolio_analytics import compare_portfolio_stocks

def test_monte_carlo_simulation():
    returns = pd.Series(np.random.normal(0.001, 0.02, 100))
    res = run_monte_carlo_simulation(returns, num_simulations=100, forecast_days=30)
    
    assert res['simulations_count'] == 100
    assert 'var_95' in res
    assert 'p50_median' in res
    assert len(res['quantile_paths']['median']) == 30

def test_portfolio_comparison():
    portfolio = compare_portfolio_stocks(symbols=['RELIANCE', 'TCS'])
    assert len(portfolio) == 2
    assert portfolio[0]['sharpe_ratio'] >= portfolio[1]['sharpe_ratio']
