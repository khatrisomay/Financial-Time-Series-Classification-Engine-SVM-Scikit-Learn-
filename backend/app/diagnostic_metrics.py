import math

def calculate_advanced_diagnostics(tp, fp, tn, fn):
    """
    Calculates advanced machine learning classification diagnostic metrics
    including Specificity, Matthews Correlation Coefficient (MCC), and Balanced Accuracy.
    """
    total = tp + fp + tn + fn
    if total == 0:
        return {}
        
    accuracy = round(((tp + tn) / total) * 100, 2)
    precision = round((tp / max(1, tp + fp)) * 100, 2)
    recall = round((tp / max(1, tp + fn)) * 100, 2)
    specificity = round((tn / max(1, tn + fp)) * 100, 2)
    balanced_accuracy = round((recall + specificity) / 2.0, 2)
    
    # Matthews Correlation Coefficient (MCC)
    mcc_num = (tp * tn) - (fp * fn)
    mcc_den = math.sqrt(max(1, (tp + fp) * (tp + fn) * (tn + fp) * (tn + fn)))
    mcc = round(mcc_num / mcc_den, 3)
    
    return {
        "accuracy": accuracy,
        "precision": precision,
        "recall": recall,
        "specificity": specificity,
        "balanced_accuracy": balanced_accuracy,
        "mcc": mcc,
        "false_positive_rate": round(100.0 - specificity, 2),
        "total_test_samples": total
    }
