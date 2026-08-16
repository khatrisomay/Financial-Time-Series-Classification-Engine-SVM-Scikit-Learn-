import numpy as np
import pandas as pd
from sklearn.svm import SVC
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import confusion_matrix, precision_score, recall_score, f1_score

def train_and_evaluate_svm(X, y, split_percentage=0.8, kernel='rbf', C=1.0, gamma='scale', degree=3):
    """
    Trains a Support Vector Machine (SVC) classifier with probability estimation,
    feature standard scaling, 80/20 train/test split, and confusion matrix diagnostics.
    """
    split = int(len(X) * split_percentage)
    X_train, X_test = X.iloc[:split], X.iloc[split:]
    y_train, y_test = y.iloc[:split], y.iloc[split:]
    
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    X_all_scaled = scaler.transform(X)
    
    # Enable probability estimation for conviction scoring
    model = SVC(kernel=kernel, C=C, gamma=gamma, degree=degree, probability=True, random_state=42)
    model.fit(X_train_scaled, y_train)
    
    y_train_pred = model.predict(X_train_scaled)
    y_test_pred = model.predict(X_test_scaled)
    all_preds = model.predict(X_all_scaled)
    
    # Calculate probability scores for all samples
    all_probs = model.predict_proba(X_all_scaled)
    latest_prob = float(np.max(all_probs[-1])) * 100.0
    
    train_acc = float(np.mean(y_train_pred == y_train)) * 100.0
    test_acc = float(np.mean(y_test_pred == y_test)) * 100.0
    
    cm = confusion_matrix(y_test, y_test_pred)
    if cm.shape == (2, 2):
        tn, fp, fn, tp = cm.ravel()
    else:
        tn, fp, fn, tp = 0, 0, 0, len(y_test)
        
    prec = precision_score(y_test, y_test_pred, zero_division=0) * 100.0
    rec = recall_score(y_test, y_test_pred, zero_division=0) * 100.0
    f1 = f1_score(y_test, y_test_pred, zero_division=0)
    
    return {
        'model': model,
        'scaler': scaler,
        'train_accuracy': round(train_acc, 2),
        'test_accuracy': round(test_acc, 2),
        'predictions': all_preds,
        'latest_probability': round(latest_prob, 1),
        'confusion_matrix': {'tn': int(tn), 'fp': int(fp), 'fn': int(fn), 'tp': int(tp)},
        'precision': round(prec, 2),
        'recall': round(rec, 2),
        'f1_score': round(f1, 2)
    }

def compare_kernels(X, y):
    """
    Benchmarks performance across Linear, Polynomial, RBF, and Sigmoid kernels.
    """
    kernels = ['linear', 'poly', 'rbf', 'sigmoid']
    results = {}
    
    for k in kernels:
        res = train_and_evaluate_svm(X, y, kernel=k)
        results[k] = {
            'train_accuracy': res['train_accuracy'],
            'test_accuracy': res['test_accuracy'],
            'f1_score': res['f1_score'],
            'precision': res['precision'],
            'recall': res['recall']
        }
        
    return results
