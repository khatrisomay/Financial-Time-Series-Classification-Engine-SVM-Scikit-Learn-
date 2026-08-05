import sys
import os

# Add backend directory to path
sys.path.insert(0, os.path.dirname(__file__))

from app.data_loader import get_stock_data
from app.feature_engineering import prepare_features_and_target
from app.model_engine import train_and_evaluate_svm, compare_kernels
from app.backtester import run_backtest

def main():
    print("--- 1. Testing Data Loader ---")
    df = get_stock_data("RELIANCE")
    print(f"Loaded RELIANCE dataset with shape: {df.shape}")
    print(df.head(3))
    
    print("\n--- 2. Testing Feature Engineering ---")
    df_clean, X, y, used_features = prepare_features_and_target(df, ['Open-Close', 'High-Low', 'RSI'])
    print(f"Features shape: {X.shape}, Target distribution: {y.value_counts().to_dict()}")
    
    print("\n--- 3. Testing SVM Model Fit ---")
    res = train_and_evaluate_svm(X, y, kernel='rbf', C=1.0)
    print(f"Train Accuracy: {res['train_accuracy']}%")
    print(f"Test Accuracy: {res['test_accuracy']}%")
    print(f"Confusion Matrix: {res['confusion_matrix']}")
    
    print("\n--- 4. Testing Kernel Comparison ---")
    comp = compare_kernels(X, y)
    for k, metrics in comp.items():
        print(f"Kernel '{k}': Train Acc = {metrics['train_acc']}%, Test Acc = {metrics['test_acc']}%")
        
    print("\n--- 5. Testing Backtesting Simulator ---")
    bt = run_backtest(df_clean, res['predictions'])
    print(f"Stock Return: {bt['total_stock_return']}%")
    print(f"Strategy Return: {bt['total_strategy_return']}%")
    print(f"Alpha: {bt['alpha']}% | Sharpe Ratio: {bt['sharpe_ratio']} | Max Drawdown: {bt['max_drawdown']}%")
    print("--- ML Pipeline Test Passed Successfully! ---")

if __name__ == "__main__":
    main()
