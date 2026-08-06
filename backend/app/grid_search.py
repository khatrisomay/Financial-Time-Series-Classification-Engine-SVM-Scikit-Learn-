import numpy as np
import pandas as pd
from sklearn.svm import SVC
from sklearn.model_selection import TimeSeriesSplit, GridSearchCV
from sklearn.preprocessing import StandardScaler

def optimize_svm_hyperparameters(X, y, kernel='rbf'):
    """
    Performs Time-Series aware Grid Search to find optimal SVM hyperparameters (C, gamma, degree)
    without data leakage.
    """
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    
    tscv = TimeSeriesSplit(n_splits=3)
    
    if kernel == 'rbf':
        param_grid = {
            'C': [0.1, 1.0, 5.0, 10.0],
            'gamma': ['scale', 'auto', 0.01, 0.1]
        }
        svc = SVC(kernel='rbf', random_state=42)
    elif kernel == 'poly':
        param_grid = {
            'C': [0.1, 1.0, 10.0],
            'degree': [2, 3, 4]
        }
        svc = SVC(kernel='poly', random_state=42)
    else: # linear
        param_grid = {
            'C': [0.01, 0.1, 1.0, 10.0]
        }
        svc = SVC(kernel='linear', random_state=42)
        
    grid_search = GridSearchCV(
        estimator=svc,
        param_grid=param_grid,
        cv=tscv,
        scoring='accuracy',
        n_jobs=-1
    )
    
    grid_search.fit(X_scaled, y)
    
    best_params = grid_search.best_params_
    best_score = round(float(grid_search.best_score_) * 100, 2)
    
    return {
        'kernel': kernel,
        'best_C': float(best_params.get('C', 1.0)),
        'best_gamma': str(best_params.get('gamma', 'scale')),
        'best_degree': int(best_params.get('degree', 3)),
        'best_cv_accuracy': best_score,
        'total_combinations_tested': len(grid_search.cv_results_['params'])
    }
