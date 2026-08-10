import sys
import os

sys.path.insert(0, os.path.dirname(__file__))

from app.data_loader import get_stock_data
from app.feature_engineering import prepare_features_and_target
from app.model_engine import train_and_evaluate_svm, compare_kernels
from app.backtester import run_backtest
from app.nlp_sentiment import analyze_stock_news_sentiment
from app.drift_monitor import check_feature_drift

def main():
    print("--- 1. Testing Data Loader ---")
    df = get_stock_data("RELIANCE")
    print(f"Loaded RELIANCE dataset with shape: {df.shape}")
    
    print("\n--- 2. Testing Feature Engineering ---")
    df_clean, X, y, used_features = prepare_features_and_target(df, ['Open-Close', 'High-Low', 'RSI', 'MACD', 'Bollinger_Bands'])
    print(f"Features shape: {X.shape}, Target distribution: {y.value_counts().to_dict()}")
    
    print("\n--- 3. Testing SVM Model Fit ---")
    res = train_and_evaluate_svm(X, y, kernel='rbf', C=1.0)
    print(f"Train Accuracy: {res['train_accuracy']}% | Test Accuracy: {res['test_accuracy']}%")
    
    print("\n--- 4. Testing NLP Sentiment Engine ---")
    s_res = analyze_stock_news_sentiment("RELIANCE")
    print(f"Overall Sentiment: {s_res['overall_sentiment']} (Score: {s_res['avg_compound_score']})")
    
    print("\n--- 5. Testing Data Drift Monitoring ---")
    split = int(0.8 * len(X))
    drift = check_feature_drift(X.iloc[:split], X.iloc[split:])
    print(f"Drift Analysis Status: Overall Drift Detected = {drift['overall_drift']}")
    
    print("\n--- 6. Testing Backtesting Simulator ---")
    bt = run_backtest(df_clean, res['predictions'])
    print(f"Stock Return: {bt['total_stock_return']}% | Strategy Return: {bt['total_strategy_return']}%")
    print("--- All ML & NLP Pipeline Validation Tests Passed Successfully! ---")

if __name__ == "__main__":
    main()
