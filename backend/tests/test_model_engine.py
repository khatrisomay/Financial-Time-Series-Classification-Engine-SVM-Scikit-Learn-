import sys
import os
import pytest

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from app.data_loader import get_stock_data
from app.feature_engineering import prepare_features_and_target
from app.model_engine import train_and_evaluate_svm

def test_feature_engineering_pipeline():
    df = get_stock_data("RELIANCE")
    assert not df.empty
    df_clean, X, y, used = prepare_features_and_target(df, ['Open-Close', 'High-Low', 'RSI'])
    assert len(X) == len(y)
    assert 'Open-Close' in X.columns
    assert 'RSI' in X.columns

def test_svm_model_training():
    df = get_stock_data("RELIANCE")
    df_clean, X, y, _ = prepare_features_and_target(df, ['Open-Close', 'High-Low', 'RSI'])
    res = train_and_evaluate_svm(X, y, kernel='rbf', C=1.0)
    
    assert res['train_accuracy'] >= 50.0
    assert res['test_accuracy'] >= 50.0
    assert 'confusion_matrix' in res
    assert res['f1_score'] >= 0.0
