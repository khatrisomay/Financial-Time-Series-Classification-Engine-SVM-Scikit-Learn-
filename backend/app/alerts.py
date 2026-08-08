import datetime

def generate_signal_alert(symbol, latest_signal, latest_price, accuracy):
    """
    Generates actionable trade signal alert payload for webhooks and notification systems.
    """
    action = "BUY" if latest_signal == 1 else "NO POSITION / CASH"
    conviction = "HIGH" if accuracy > 70 else "MODERATE"
    
    return {
        'timestamp': datetime.datetime.now().isoformat(),
        'symbol': symbol,
        'signal': latest_signal,
        'action': action,
        'price': latest_price,
        'model_accuracy': accuracy,
        'conviction': conviction,
        'message': f"SVM Predictor Alert: [{symbol}] signal is {action} at ₹{latest_price} (Model Acc: {accuracy}%, Conviction: {conviction})."
    }
