import numpy as np
import pandas as pd

def run_backtest(df, predictions, commission_bps=10.0, slippage_bps=5.0):
    """
    Executes financial strategy backtest incorporating trading friction (commission & slippage)
    and risk-adjusted performance ratios (Sharpe, Sortino, Calmar).
    """
    df_bt = df.copy()
    df_bt['Signal'] = predictions
    
    # Daily returns
    df_bt['Stock_Return'] = df_bt['Close'].pct_change().fillna(0)
    
    # Position shifts (signal applied next day)
    df_bt['Position'] = df_bt['Signal'].shift(1).fillna(0)
    
    # Trade execution friction penalty (15 bps total when position changes)
    trade_executed = (df_bt['Position'] != df_bt['Position'].shift(1).fillna(0)).astype(int)
    friction_pct = (commission_bps + slippage_bps) / 10000.0
    
    # Strategy Gross & Net Returns
    df_bt['Gross_Strategy_Return'] = df_bt['Stock_Return'] * df_bt['Position']
    df_bt['Friction_Penalty'] = trade_executed * friction_pct
    df_bt['Net_Strategy_Return'] = df_bt['Gross_Strategy_Return'] - df_bt['Friction_Penalty']
    
    # Cumulative Yields
    total_stock = float((df_bt['Stock_Return'] + 1).prod() - 1) * 100
    total_strategy = float((df_bt['Net_Strategy_Return'] + 1).prod() - 1) * 100
    alpha = total_strategy - total_stock
    
    # Sharpe Ratio (annualized)
    mean_ret = df_bt['Net_Strategy_Return'].mean()
    std_ret = df_bt['Net_Strategy_Return'].std()
    sharpe = float((mean_ret / max(1e-6, std_ret)) * np.sqrt(252)) if std_ret > 0 else 0.0
    
    # Downside Volatility & Sortino Ratio
    downside_returns = df_bt['Net_Strategy_Return'][df_bt['Net_Strategy_Return'] < 0]
    downside_std = downside_returns.std()
    sortino = float((mean_ret / max(1e-6, downside_std)) * np.sqrt(252)) if downside_std > 0 else 0.0
    
    # Max Drawdown & Calmar Ratio
    cum_returns = (1 + df_bt['Net_Strategy_Return']).cumprod()
    peak = cum_returns.cummax()
    drawdown = (cum_returns - peak) / peak
    max_drawdown = float(drawdown.min()) * 100
    
    cagr = float(((1 + total_strategy / 100) ** (252 / max(1, len(df_bt)))) - 1) * 100
    calmar = float(cagr / max(1e-6, abs(max_drawdown))) if max_drawdown < 0 else 0.0
    
    # Win Rate
    active_days = df_bt[df_bt['Position'] == 1]
    wins = len(active_days[active_days['Net_Strategy_Return'] > 0])
    win_rate = float((wins / max(1, len(active_days))) * 100) if len(active_days) > 0 else 0.0
    
    timeseries = []
    cum_stock = 0.0
    cum_strat = 0.0
    for idx, row in df_bt.iterrows():
        cum_stock += row['Stock_Return'] * 100
        cum_strat += row['Net_Strategy_Return'] * 100
        timeseries.append({
            "date": str(row['Date']) if 'Date' in row else str(idx),
            "close": round(float(row['Close']), 2),
            "stock_return": round(cum_stock, 2),
            "strategy_return": round(cum_strat, 2),
            "signal": int(row['Signal'])
        })
        
    return {
        "total_stock_return": round(total_stock, 2),
        "total_strategy_return": round(total_strategy, 2),
        "alpha": round(alpha, 2),
        "sharpe_ratio": round(sharpe, 2),
        "sortino_ratio": round(sortino, 2),
        "calmar_ratio": round(calmar, 2),
        "max_drawdown": round(max_drawdown, 2),
        "win_rate": round(win_rate, 2),
        "timeseries": timeseries
    }
