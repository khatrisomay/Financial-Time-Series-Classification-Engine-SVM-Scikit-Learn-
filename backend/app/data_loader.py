import os
import pandas as pd
import numpy as np

def generate_sample_stock_data(symbol="RELIANCE", num_days=500, base_price=2500.0):
    """
    Generates realistic synthetic OHLCV stock data for offline reliability and demonstration.
    """
    np.random.seed(42 if symbol == "RELIANCE" else (101 if symbol == "TCS" else 202))
    
    dates = pd.date_range(end=pd.Timestamp.today(), periods=num_days, freq='B')
    
    # Geometric Brownian Motion simulation
    returns = np.random.normal(loc=0.0005, scale=0.018, size=num_days)
    price_series = base_price * np.exp(np.cumsum(returns))
    
    data = []
    for i, price in enumerate(price_series):
        daily_vol = price * np.random.uniform(0.01, 0.025)
        open_price = price + np.random.normal(0, daily_vol * 0.3)
        high_price = max(open_price, price) + abs(np.random.normal(0, daily_vol * 0.5))
        low_price = min(open_price, price) - abs(np.random.normal(0, daily_vol * 0.5))
        close_price = price
        volume = int(np.random.uniform(1000000, 5000000))
        
        data.append({
            'Date': dates[i],
            'Open': round(open_price, 2),
            'High': round(high_price, 2),
            'Low': round(low_price, 2),
            'Close': round(close_price, 2),
            'Volume': volume
        })
        
    df = pd.DataFrame(data)
    df.set_index('Date', inplace=True)
    return df

def get_stock_data(symbol="RELIANCE"):
    """
    Attempts to download stock data via yfinance, or falls back to synthetic/preset CSV data.
    """
    symbol_clean = symbol.upper().strip()
    
    # Check if a custom CSV file exists in backend/data/
    csv_path = os.path.join(os.path.dirname(__file__), "..", "data", f"{symbol_clean}.csv")
    if os.path.exists(csv_path):
        df = pd.read_csv(csv_path)
        if 'Date' in df.columns:
            df.index = pd.to_datetime(df['Date'])
            df.drop(['Date'], axis=1, inplace=True, errors='ignore')
        return df

    # Try downloading using yfinance if available
    try:
        import yfinance as yf
        ticker_sym = symbol_clean
        if not ticker_sym.endswith(('.NS', '.BO', '=X')) and symbol_clean in ['RELIANCE', 'TCS', 'ICICI']:
            ticker_sym = f"{symbol_clean}.NS"
            
        ticker = yf.Ticker(ticker_sym)
        df = ticker.history(period="2y")
        if not df.empty and len(df) > 100:
            df = df[['Open', 'High', 'Low', 'Close', 'Volume']].copy()
            df.index = pd.to_datetime(df.index)
            return df
    except Exception as e:
        print(f"yfinance download failed for {symbol_clean}: {e}")

    # Default presets fallback
    presets = {
        "RELIANCE": 2500.0,
        "TCS": 3800.0,
        "ICICI": 1150.0,
        "AAPL": 220.0,
        "TSLA": 240.0
    }
    base_price = presets.get(symbol_clean, 1000.0)
    return generate_sample_stock_data(symbol=symbol_clean, base_price=base_price)
