import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import List, Optional

from app.data_loader import get_stock_data
from app.feature_engineering import prepare_features_and_target
from app.model_engine import train_and_evaluate_svm, compare_kernels
from app.backtester import run_backtest

app = FastAPI(title="Quantum SVM Stock Predictor API", version="2.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PredictRequest(BaseModel):
    symbol: str = "RELIANCE"
    selected_features: List[str] = ["Open-Close", "High-Low"]
    split_percentage: float = 0.8
    kernel: str = "rbf"
    C: float = 1.0
    gamma: str = "scale"
    degree: int = 3

@app.get("/api/health")
def health_check():
    return {"status": "online", "model_engine": "Support Vector Machine (SVC)"}

@app.get("/api/stocks")
def list_stocks():
    return {
        "stocks": [
            {"symbol": "RELIANCE", "name": "Reliance Industries Ltd", "exchange": "NSE"},
            {"symbol": "TCS", "name": "Tata Consultancy Services", "exchange": "NSE"},
            {"symbol": "ICICI", "name": "ICICI Bank Ltd", "exchange": "NSE"},
            {"symbol": "AAPL", "name": "Apple Inc.", "exchange": "NASDAQ"},
            {"symbol": "TSLA", "name": "Tesla Inc.", "exchange": "NASDAQ"}
        ]
    }

@app.post("/api/predict")
def predict_and_backtest(req: PredictRequest):
    try:
        df = get_stock_data(req.symbol)
        if df.empty:
            raise HTTPException(status_code=400, detail=f"Could not load data for symbol {req.symbol}")
            
        df_clean, X, y, used_features = prepare_features_and_target(df, req.selected_features)
        
        # Train & Evaluate Model
        svm_res = train_and_evaluate_svm(
            X, y,
            split_percentage=req.split_percentage,
            kernel=req.kernel,
            C=req.C,
            gamma=req.gamma,
            degree=req.degree
        )
        
        # Run Backtest Simulator
        backtest_res = run_backtest(df_clean, svm_res['predictions'])
        
        # Current Stock Summary info
        latest_price = float(df_clean['Close'].iloc[-1])
        prev_price = float(df_clean['Close'].iloc[-2]) if len(df_clean) > 1 else latest_price
        pct_change = round(((latest_price - prev_price) / prev_price) * 100, 2)
        
        return {
            "symbol": req.symbol,
            "latest_price": latest_price,
            "pct_change": pct_change,
            "used_features": used_features,
            "model_performance": {
                "kernel": req.kernel,
                "train_accuracy": svm_res['train_accuracy'],
                "test_accuracy": svm_res['test_accuracy'],
                "confusion_matrix": svm_res['confusion_matrix'],
                "precision": svm_res['precision'],
                "recall": svm_res['recall'],
                "f1_score": svm_res['f1_score']
            },
            "backtest": backtest_res
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/kernels")
def kernel_comparison(symbol: str = "RELIANCE"):
    try:
        df = get_stock_data(symbol)
        df_clean, X, y, _ = prepare_features_and_target(df, ["Open-Close", "High-Low", "RSI"])
        comparison = compare_kernels(X, y)
        
        # Also run backtest for each kernel to get strategy returns
        detailed_matrix = []
        for k_name in ['linear', 'poly', 'rbf', 'sigmoid']:
            eval_res = train_and_evaluate_svm(X, y, kernel=k_name)
            bt_res = run_backtest(df_clean, eval_res['predictions'])
            detailed_matrix.append({
                "kernel": k_name,
                "label": "Linear" if k_name == 'linear' else ("Polynomial (d=3)" if k_name == 'poly' else ("RBF (Radial Basis)" if k_name == 'rbf' else "Sigmoid")),
                "train_acc": eval_res['train_accuracy'],
                "test_acc": eval_res['test_accuracy'],
                "strategy_return": bt_res['total_strategy_return'],
                "sharpe_ratio": bt_res['sharpe_ratio'],
                "max_drawdown": bt_res['max_drawdown'],
                "win_rate": bt_res['win_rate'],
                "f1_score": eval_res['f1_score']
            })
            
        return {"symbol": symbol, "comparison": detailed_matrix}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Mount static frontend build if present
static_dir = os.path.join(os.path.dirname(__file__), "..", "..", "frontend", "dist")
if os.path.exists(static_dir):
    app.mount("/assets", StaticFiles(directory=os.path.join(static_dir, "assets")), name="assets")
    
    @app.get("/{full_path:path}")
    def serve_frontend(full_path: str):
        file_path = os.path.join(static_dir, full_path)
        if os.path.exists(file_path) and os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(static_dir, "index.html"))
