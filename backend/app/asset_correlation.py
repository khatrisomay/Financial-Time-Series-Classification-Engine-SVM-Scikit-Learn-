import pandas as pd
from app.data_loader import get_stock_data

def compute_asset_correlation_matrix(symbols=None):
    """
    Computes pairwise Pearson correlation matrix across multi-asset universe.
    """
    if symbols is None:
        symbols = ['RELIANCE', 'TCS', 'ICICI', 'AAPL', 'TSLA']
        
    prices_df = pd.DataFrame()
    for sym in symbols:
        try:
            df = get_stock_data(sym)
            if not df.empty:
                prices_df[sym] = df['Close']
        except Exception:
            pass
            
    if prices_df.empty:
        return {}
        
    returns_df = prices_df.pct_change().dropna()
    corr_matrix = returns_df.corr().round(2)
    
    matrix_dict = {}
    for col in corr_matrix.columns:
        matrix_dict[col] = corr_matrix[col].to_dict()
        
    return {
        "symbols": list(corr_matrix.columns),
        "correlation_matrix": matrix_dict
    }
