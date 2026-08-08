from app.data_loader import get_stock_data
from app.feature_engineering import prepare_features_and_target
from app.model_engine import train_and_evaluate_svm
from app.backtester import run_backtest

def compare_portfolio_stocks(symbols=None, kernel='rbf', C=1.0):
    """
    Evaluates SVM strategy performance across multiple asset classes simultaneously
    and ranks them by Risk-Adjusted Sharpe Ratio.
    """
    if symbols is None:
        symbols = ['RELIANCE', 'TCS', 'ICICI', 'AAPL', 'TSLA']
        
    portfolio_results = []
    
    for sym in symbols:
        try:
            df = get_stock_data(sym)
            if df.empty:
                continue
            df_clean, X, y, _ = prepare_features_and_target(df, ['Open-Close', 'High-Low', 'RSI'])
            svm_res = train_and_evaluate_svm(X, y, kernel=kernel, C=C)
            bt_res = run_backtest(df_clean, svm_res['predictions'])
            
            portfolio_results.append({
                'symbol': sym,
                'accuracy': svm_res['test_accuracy'],
                'stock_return': bt_res['total_stock_return'],
                'strategy_return': bt_res['total_strategy_return'],
                'alpha': bt_res['alpha'],
                'sharpe_ratio': bt_res['sharpe_ratio'],
                'max_drawdown': bt_res['max_drawdown'],
                'win_rate': bt_res['win_rate']
            })
        except Exception as e:
            print(f"Error benchmarking {sym}: {e}")
            
    # Rank assets by Sharpe Ratio descending
    portfolio_results.sort(key=lambda x: x['sharpe_ratio'], reverse=True)
    return portfolio_results
