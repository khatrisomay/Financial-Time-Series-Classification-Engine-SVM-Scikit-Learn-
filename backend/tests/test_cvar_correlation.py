import sys
import os
import pandas as pd
import numpy as np
import pytest

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from app.cvar_calculator import calculate_expected_shortfall
from app.asset_correlation import compute_asset_correlation_matrix

def test_expected_shortfall_cvar():
    returns = pd.Series(np.random.normal(0.0, 0.02, 200))
    res = calculate_expected_shortfall(returns)
    
    assert "var_95" in res
    assert "cvar_95" in res
    assert "cvar_99" in res
    assert res["cvar_95"] >= res["var_95"]

def test_asset_correlation_matrix():
    corr_res = compute_asset_correlation_matrix(symbols=['RELIANCE', 'TCS'])
    assert "symbols" in corr_res
    assert "correlation_matrix" in corr_res
    assert corr_res["correlation_matrix"]["RELIANCE"]["RELIANCE"] == 1.0
