import numpy as np
import pandas as pd
from scipy.stats import ks_2samp

def check_feature_drift(X_train, X_recent, threshold=0.05):
    """
    Performs Kolmogorov-Smirnov test to detect feature distribution drift between training baseline and recent data.
    """
    drift_report = {}
    drift_detected = False
    
    for col in X_train.columns:
        train_vals = X_train[col].values
        recent_vals = X_recent[col].values
        
        stat, p_value = ks_2samp(train_vals, recent_vals)
        has_drift = bool(p_value < threshold)
        
        if has_drift:
            drift_detected = True
            
        drift_report[col] = {
            'ks_stat': round(float(stat), 4),
            'p_value': round(float(p_value), 4),
            'drift_detected': has_drift
        }
        
    return {
        'overall_drift': drift_detected,
        'threshold_p_val': threshold,
        'feature_details': drift_report
    }
