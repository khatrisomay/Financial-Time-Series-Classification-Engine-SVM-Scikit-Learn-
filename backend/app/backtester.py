import numpy as np
import pandas as pd

def run_backtest(df_clean, predictions):
    """
    Computes daily returns, strategy returns, cumulative return curves,
    and financial risk metrics (Sharpe Ratio, Max Drawdown, Alpha).
    """
    df = df_clean.copy()
    df['Predicted_Signal'] = predictions
    
    # Calculate daily returns of the stock
    df['Return'] = df['Close'].pct_change().fillna(0)
    
    # Strategy Return: Trade on signal predicted yesterday for today
    df['Strategy_Return'] = df['Return'] * df['Predicted_Signal'].shift(1).fillna(0)
    
    # Cumulative Growth Curves
    df['Cum_Ret'] = (1 + df['Return']).cumprod() - 1
    df['Cum_Strategy'] = (1 + df['Strategy_Return']).cumprod() - 1
    
    total_stock_return = float(df['Cum_Ret'].iloc[-1]) * 100
    total_strategy_return = float(df['Cum_Strategy'].iloc[-1]) * 100
    alpha = total_strategy_return - total_stock_return
    
    # Sharpe Ratio (assuming 252 trading days/year and 3% risk-free rate)
    strat_daily_mean = df['Strategy_Return'].mean()
    strat_daily_std = df['Strategy_Return'].std()
    rf_daily = 0.03 / 252
    
    if strat_daily_std > 0:
        sharpe_ratio = float((strat_daily_mean - rf_daily) / strat_daily_std * np.sqrt(252))
    else:
        sharpe_ratio = 0.0
        
    # Maximum Drawdown
    cum_strat_wealth = (1 + df['Strategy_Return']).cumprod()
    peak = cum_strat_wealth.cummax()
    drawdown = (cum_strat_wealth - peak) / peak
    max_drawdown = float(drawdown.min()) * 100
    
    # Win / Loss ratio
    active_trades = df[df['Predicted_Signal'].shift(1) == 1]
    winning_days = len(active_trades[active_trades['Return'] > 0])
    total_trades = len(active_trades)
    win_rate = (winning_days / total_trades * 100) if total_trades > 0 else 50.0
    
    # Structure time-series curve data for interactive web chart
    dates_str = [d.strftime('%Y-%m-%d') if hasattr(d, 'strftime') else str(d) for d in df.index]
    
    timeseries_data = []
    for i in range(len(df)):
        timeseries_data.append({
            'date': dates_str[i],
            'close': float(df['Close'].iloc[i]),
            'stock_return': round(float(df['Cum_Ret'].iloc[i]) * 100, 2),
            'strategy_return': round(float(df['Cum_Strategy'].iloc[i]) * 100, 2),
            'signal': int(df['Predicted_Signal'].iloc[i])
        })
        
    return {
        'total_stock_return': round(total_stock_return, 2),
        'total_strategy_return': round(total_strategy_return, 2),
        'alpha': round(alpha, 2),
        'sharpe_ratio': round(sharpe_ratio, 2),
        'max_drawdown': round(max_drawdown, 2),
        'win_rate': round(win_rate, 1),
        'timeseries': timeseries_data
    }
