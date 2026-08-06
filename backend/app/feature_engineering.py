import pandas as pd
import numpy as np

def calculate_rsi(series, period=14):
    delta = series.diff()
    gain = (delta.where(delta > 0, 0)).rolling(window=period).mean()
    loss = (-delta.where(delta < 0, 0)).rolling(window=period).mean()
    rs = gain / (loss + 1e-9)
    return 100 - (100 / (1 + rs))

def prepare_features_and_target(df, selected_features=None):
    """
    Computes technical indicators and target binary signal (+1 for Buy, 0 for Hold/No position).
    """
    df_feat = df.copy()
    
    # Core GeeksforGeeks features
    df_feat['Open-Close'] = df_feat['Open'] - df_feat['Close']
    df_feat['High-Low'] = df_feat['High'] - df_feat['Low']
    
    # Extended technical features
    df_feat['RSI'] = calculate_rsi(df_feat['Close'], period=14)
    df_feat['SMA_10'] = df_feat['Close'].rolling(window=10).mean()
    df_feat['SMA_50'] = df_feat['Close'].rolling(window=50).mean()
    df_feat['SMA_Diff'] = df_feat['SMA_10'] - df_feat['SMA_50']
    
    # Advanced Indicators: MACD & Bollinger Bands
    ema_12 = df_feat['Close'].ewm(span=12, adjust=False).mean()
    ema_26 = df_feat['Close'].ewm(span=26, adjust=False).mean()
    df_feat['MACD'] = ema_12 - ema_26
    
    sma_20 = df_feat['Close'].rolling(window=20).mean()
    std_20 = df_feat['Close'].rolling(window=20).std()
    df_feat['Bollinger_Bands'] = (df_feat['Close'] - sma_20) / (std_20 * 2 + 1e-9)
    
    returns = df_feat['Close'].pct_change()
    df_feat['Volatility'] = returns.rolling(window=10).std()
    
    # Target variable: 1 if tomorrow's close > today's close, else 0
    df_feat['Target'] = np.where(df_feat['Close'].shift(-1) > df_feat['Close'], 1, 0)
    
    # Drop rows with NaN values resulting from rolling windows
    df_clean = df_feat.dropna().copy()
    
    if selected_features is None or len(selected_features) == 0:
        selected_features = ['Open-Close', 'High-Low']
        
    available_features = [f for f in selected_features if f in df_clean.columns]
    if not available_features:
        available_features = ['Open-Close', 'High-Low']
        
    X = df_clean[available_features]
    y = df_clean['Target']
    
    return df_clean, X, y, available_features
