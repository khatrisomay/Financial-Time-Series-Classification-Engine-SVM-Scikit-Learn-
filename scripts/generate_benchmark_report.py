import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "backend"))

from app.data_loader import get_stock_data
from app.feature_engineering import prepare_features_and_target
from app.model_engine import train_and_evaluate_svm
from app.backtester import run_backtest

def main():
    print("# Quantum SVM Enterprise Quantitative Benchmark Report\n")
    stocks = ['RELIANCE', 'TCS', 'ICICI', 'AAPL', 'TSLA']
    kernels = ['linear', 'rbf', 'poly', 'sigmoid']
    
    print("| Stock | Kernel | Test Acc | Strategy Yield | Sharpe | Max Drawdown | Win Rate |")
    print("| :--- | :--- | :--- | :--- | :--- | :--- | :--- |")
    
    for s in stocks:
        df = get_stock_data(s)
        if df.empty:
            continue
        df_clean, X, y, _ = prepare_features_and_target(df, ['Open-Close', 'High-Low', 'RSI'])
        for k in kernels:
            res = train_and_evaluate_svm(X, y, kernel=k)
            bt = run_backtest(df_clean, res['predictions'])
            print(f"| {s} | {k.upper()} | {res['test_accuracy']}% | +{bt['total_strategy_return']}% | {bt['sharpe_ratio']} | {bt['max_drawdown']}% | {bt['win_rate']}% |")

if __name__ == "__main__":
    main()
