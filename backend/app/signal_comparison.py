from app.data_loader import get_stock_data
from app.feature_engineering import prepare_features_and_target
from app.model_engine import train_and_evaluate_svm
from app.backtester import run_backtest

def compare_feature_strategies(symbol="RELIANCE", kernel="rbf", C=1.0):
    """
    Compares SVM predictive accuracy and backtest returns across different feature variable subsets.
    """
    df = get_stock_data(symbol)
    if df.empty:
        return []
        
    feature_sets = [
        {"name": "Price Action Only", "features": ["Open-Close", "High-Low"]},
        {"name": "Price Action + RSI", "features": ["Open-Close", "High-Low", "RSI"]},
        {"name": "Price Action + MACD", "features": ["Open-Close", "High-Low", "MACD"]},
        {"name": "Full Technical Suite", "features": ["Open-Close", "High-Low", "RSI", "MACD", "Bollinger_Bands", "Volatility"]}
    ]
    
    results = []
    for fset in feature_sets:
        try:
            df_clean, X, y, _ = prepare_features_and_target(df, fset["features"])
            svm_eval = train_and_evaluate_svm(X, y, kernel=kernel, C=C)
            bt_eval = run_backtest(df_clean, svm_eval["predictions"])
            
            results.append({
                "preset_name": fset["name"],
                "features_used": fset["features"],
                "test_accuracy": svm_eval["test_accuracy"],
                "strategy_return": bt_eval["total_strategy_return"],
                "sharpe_ratio": bt_eval["sharpe_ratio"],
                "win_rate": bt_eval["win_rate"],
                "alpha": bt_eval["alpha"]
            })
        except Exception as e:
            print(f"Feature set evaluation error: {e}")
            
    return results
