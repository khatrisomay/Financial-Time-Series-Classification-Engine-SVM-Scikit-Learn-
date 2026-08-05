import numpy as np
import pandas as pd
from sklearn.svm import SVC
from sklearn.metrics import accuracy_score, confusion_matrix, precision_score, recall_score, f1_score
from sklearn.preprocessing import StandardScaler

def train_and_evaluate_svm(X, y, split_percentage=0.8, kernel='rbf', C=1.0, gamma='scale', degree=3):
    """
    Splits time-series data sequentially (80/20 standard split), scales features, fits SVC model,
    and returns comprehensive metrics and full dataset predictions.
    """
    split = int(split_percentage * len(X))
    if split <= 0 or split >= len(X):
        split = int(0.8 * len(X))
        
    X_train, X_test = X.iloc[:split], X.iloc[split:]
    y_train, y_test = y.iloc[:split], y.iloc[split:]
    
    # Feature Scaling (Crucial for SVM performance)
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    X_full_scaled = scaler.transform(X)
    
    # Configure SVM Model
    if kernel == 'poly':
        cls = SVC(kernel='poly', degree=int(degree), C=float(C), gamma=gamma, random_state=42)
    else:
        cls = SVC(kernel=kernel, C=float(C), gamma=gamma, random_state=42)
        
    # Fit Model
    cls.fit(X_train_scaled, y_train)
    
    # Train / Test predictions
    y_train_pred = cls.predict(X_train_scaled)
    y_test_pred = cls.predict(X_test_scaled)
    y_full_pred = cls.predict(X_full_scaled)
    
    # Calculate Accuracy
    train_acc = float(accuracy_score(y_train, y_train_pred))
    test_acc = float(accuracy_score(y_test, y_test_pred))
    
    # Diagnostics Matrix (Confusion Matrix on Test set)
    cm = confusion_matrix(y_test, y_test_pred)
    tn, fp, fn, tp = int(cm[0, 0]), int(cm[0, 1]), int(cm[1, 0]), int(cm[1, 1]) if cm.shape == (2, 2) else (0, 0, 0, 0)
    
    precision = float(precision_score(y_test, y_test_pred, zero_division=0))
    recall = float(recall_score(y_test, y_test_pred, zero_division=0))
    f1 = float(f1_score(y_test, y_test_pred, zero_division=0))
    
    return {
        'model': cls,
        'scaler': scaler,
        'train_accuracy': round(train_acc * 100, 2),
        'test_accuracy': round(test_acc * 100, 2),
        'predictions': y_full_pred,
        'split_index': split,
        'confusion_matrix': {
            'tn': tn,
            'fp': fp,
            'fn': fn,
            'tp': tp
        },
        'precision': round(precision * 100, 2),
        'recall': round(recall * 100, 2),
        'f1_score': round(f1, 2)
    }

def compare_kernels(X, y, split_percentage=0.8):
    """
    Evaluates linear, poly (deg 3), rbf, and sigmoid kernels.
    """
    kernels = ['linear', 'poly', 'rbf', 'sigmoid']
    results = {}
    
    for k in kernels:
        res = train_and_evaluate_svm(X, y, split_percentage=split_percentage, kernel=k)
        results[k] = {
            'train_acc': res['train_accuracy'],
            'test_acc': res['test_accuracy'],
            'precision': res['precision'],
            'recall': res['recall'],
            'f1_score': res['f1_score']
        }
        
    return results
