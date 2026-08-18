import numpy as np
import pandas as pd
from app.data_loader import get_stock_data
from app.feature_engineering import prepare_features_and_target
from app.model_engine import train_and_evaluate_svm

def calculate_feature_importance(symbol="RELIANCE", selected_features=None):
    """
    Calculates feature importance weights for Support Vector Machine predictors.
    Uses absolute coefficient weights for linear kernel or feature variance impact.
    """
    if selected_features is None:
        selected_features = ['Open-Close', 'High-Low', 'RSI', 'MACD', 'Bollinger_Bands', 'Volatility']
        
    df = get_stock_data(symbol)
    if df.empty:
        return {}
        
    df_clean, X, y, used = prepare_features_and_target(df, selected_features)
    res = train_and_evaluate_svm(X, y, kernel='linear')
    model = res['model']
    
    if hasattr(model, 'coef_'):
        coefs = np.abs(model.coef_[0])
        total = np.sum(coefs) if np.sum(coefs) > 0 else 1.0
        normalized = (coefs / total) * 100.0
        
        importance_dict = []
        for feat, score in zip(used, normalized):
            importance_dict.append({
                "feature": feat,
                "importance_percentage": round(float(score), 2)
            })
            
        importance_dict.sort(key=lambda x: x['importance_percentage'], reverse=True)
        return {
            "symbol": symbol,
            "kernel": "linear",
            "feature_importance": importance_dict
        }
        
    return {}
