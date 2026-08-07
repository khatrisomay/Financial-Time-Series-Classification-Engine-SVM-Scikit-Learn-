import io
import pandas as pd

def generate_backtest_csv(timeseries_data):
    """
    Generates a clean CSV file string containing full backtesting time-series and trading signals.
    """
    df = pd.DataFrame(timeseries_data)
    df.rename(columns={
        'date': 'Date',
        'close': 'Close_Price',
        'stock_return': 'Cum_Stock_Return_Pct',
        'strategy_return': 'Cum_Strategy_Return_Pct',
        'signal': 'Predicted_Signal_Buy1_Hold0'
    }, inplace=True)
    
    output = io.StringIO()
    df.to_csv(output, index=False)
    return output.getvalue()
