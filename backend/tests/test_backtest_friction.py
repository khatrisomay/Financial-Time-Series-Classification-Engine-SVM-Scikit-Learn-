import sys
import os
import pandas as pd
import numpy as np
import pytest

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from app.data_loader import get_stock_data
from app.backtester import run_backtest

def test_trade_friction_deduction():
    df = get_stock_data("RELIANCE")
    signals = np.random.choice([0, 1], size=len(df))
    
    bt_clean = run_backtest(df, signals, commission_bps=0.0, slippage_bps=0.0)
    bt_friction = run_backtest(df, signals, commission_bps=20.0, slippage_bps=10.0)
    
    # Net return with friction should be <= clean gross return
    assert bt_friction["total_strategy_return"] <= bt_clean["total_strategy_return"]

def test_sortino_and_calmar_ratios():
    df = get_stock_data("RELIANCE")
    signals = np.ones(len(df))
    bt = run_backtest(df, signals)
    
    assert "sortino_ratio" in bt
    assert "calmar_ratio" in bt
    assert isinstance(bt["sortino_ratio"], float)
    assert isinstance(bt["calmar_ratio"], float)
