import os
import time
import psutil
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, Response
from pydantic import BaseModel
from typing import List, Optional

from app.data_loader import get_stock_data
from app.feature_engineering import prepare_features_and_target
from app.model_engine import train_and_evaluate_svm, compare_kernels
from app.backtester import run_backtest
from app.grid_search import optimize_svm_hyperparameters
from app.report_generator import generate_backtest_csv
from app.monte_carlo import run_monte_carlo_simulation
from app.portfolio_analytics import compare_portfolio_stocks
from app.alerts import generate_signal_alert
from app.nlp_sentiment import analyze_stock_news_sentiment
from app.drift_monitor import check_feature_drift
from app.signal_comparison import compare_feature_strategies
from app.diagnostic_metrics import calculate_advanced_diagnostics
from app.cvar_calculator import calculate_expected_shortfall
from app.asset_correlation import compute_asset_correlation_matrix

app = FastAPI(title="Quantum SVM Stock Predictor API", version="9.0")

START_TIME = time.time()

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
    commission_bps: float = 10.0
    slippage_bps: float = 5.0

class OptimizeRequest(BaseModel):
    symbol: str = "RELIANCE"
    selected_features: List[str] = ["Open-Close", "High-Low", "RSI"]
    kernel: str = "rbf"

@app.get("/api/health")
def health_check():
    uptime_seconds = round(time.time() - START_TIME, 2)
    process = psutil.Process(os.getpid())
    memory_mb = round(process.memory_info().rss / (1024 * 1024), 2)
    
    return {
        "status": "healthy",
        "container": "docker-alpine-python3.12",
        "model_engine": "Support Vector Machine (SVC)",
        "version": "9.0.0",
        "uptime_seconds": uptime_seconds,
        "memory_usage_mb": memory_mb,
        "cpu_threads": os.cpu_count() or 4
    }

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
        
        svm_res = train_and_evaluate_svm(
            X, y,
            split_percentage=req.split_percentage,
            kernel=req.kernel,
            C=req.C,
            gamma=req.gamma,
            degree=req.degree
        )
        
        backtest_res = run_backtest(
            df_clean,
            svm_res['predictions'],
            commission_bps=req.commission_bps,
            slippage_bps=req.slippage_bps
        )
        
        latest_price = float(df_clean['Close'].iloc[-1])
        prev_price = float(df_clean['Close'].iloc[-2]) if len(df_clean) > 1 else latest_price
        pct_change = round(((latest_price - prev_price) / prev_price) * 100, 2)
        
        latest_signal = int(svm_res['predictions'][-1])
        alert = generate_signal_alert(req.symbol, latest_signal, latest_price, svm_res['test_accuracy'])
        sentiment = analyze_stock_news_sentiment(req.symbol)
        
        cm = svm_res['confusion_matrix']
        advanced = calculate_advanced_diagnostics(cm['tp'], cm['fp'], cm['tn'], cm['fn'])
        
        df_clean['Predicted_Signal'] = svm_res['predictions']
        returns = df_clean['Close'].pct_change().dropna()
        cvar_res = calculate_expected_shortfall(returns)
        
        return {
            "symbol": req.symbol,
            "latest_price": latest_price,
            "pct_change": pct_change,
            "used_features": used_features,
            "signal_alert": alert,
            "sentiment_analysis": sentiment,
            "advanced_diagnostics": advanced,
            "tail_risk": cvar_res,
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

@app.get("/api/cvar")
def get_cvar(symbol: str = "RELIANCE"):
    try:
        df = get_stock_data(symbol)
        returns = df['Close'].pct_change().dropna()
        cvar_res = calculate_expected_shortfall(returns)
        return {"symbol": symbol, "tail_risk": cvar_res}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/correlation")
def get_correlation():
    try:
        return compute_asset_correlation_matrix()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/diagnostics")
def get_diagnostics(symbol: str = "RELIANCE", kernel: str = "rbf"):
    try:
        df = get_stock_data(symbol)
        df_clean, X, y, _ = prepare_features_and_target(df, ["Open-Close", "High-Low", "RSI"])
        svm_res = train_and_evaluate_svm(X, y, kernel=kernel)
        cm = svm_res['confusion_matrix']
        advanced = calculate_advanced_diagnostics(cm['tp'], cm['fp'], cm['tn'], cm['fn'])
        return {"symbol": symbol, "kernel": kernel, "diagnostics": advanced}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/feature-comparison")
def feature_comparison(symbol: str = "RELIANCE", kernel: str = "rbf", C: float = 1.0):
    try:
        results = compare_feature_strategies(symbol=symbol, kernel=kernel, C=C)
        return {"symbol": symbol, "kernel": kernel, "feature_comparison": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/sentiment")
def get_sentiment(symbol: str = "RELIANCE"):
    try:
        return analyze_stock_news_sentiment(symbol)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/drift-status")
def get_drift_status(symbol: str = "RELIANCE"):
    try:
        df = get_stock_data(symbol)
        df_clean, X, _, _ = prepare_features_and_target(df, ["Open-Close", "High-Low", "RSI"])
        split = int(0.8 * len(X))
        X_train, X_recent = X.iloc[:split], X.iloc[split:]
        drift_res = check_feature_drift(X_train, X_recent)
        return {"symbol": symbol, "drift_analysis": drift_res}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/portfolio-comparison")
def portfolio_comparison(kernel: str = "rbf", C: float = 1.0):
    try:
        results = compare_portfolio_stocks(kernel=kernel, C=C)
        return {"kernel": kernel, "portfolio": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/optimize")
def optimize_hyperparams(req: OptimizeRequest):
    try:
        df = get_stock_data(req.symbol)
        df_clean, X, y, _ = prepare_features_and_target(df, req.selected_features)
        opt_res = optimize_svm_hyperparameters(X, y, kernel=req.kernel)
        return {"symbol": req.symbol, "optimization": opt_res}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/monte-carlo")
def monte_carlo_forecast(req: PredictRequest):
    try:
        df = get_stock_data(req.symbol)
        df_clean, X, y, _ = prepare_features_and_target(df, req.selected_features)
        svm_res = train_and_evaluate_svm(X, y, kernel=req.kernel, C=req.C)
        df_clean['Predicted_Signal'] = svm_res['predictions']
        df_clean['Return'] = df_clean['Close'].pct_change().fillna(0)
        strat_returns = df_clean['Return'] * df_clean['Predicted_Signal'].shift(1).fillna(0)
        mc_res = run_monte_carlo_simulation(strat_returns)
        return {"symbol": req.symbol, "monte_carlo": mc_res}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/export")
def export_backtest_report(req: PredictRequest):
    try:
        df = get_stock_data(req.symbol)
        df_clean, X, y, _ = prepare_features_and_target(df, req.selected_features)
        svm_res = train_and_evaluate_svm(X, y, kernel=req.kernel, C=req.C)
        backtest_res = run_backtest(df_clean, svm_res['predictions'])
        csv_data = generate_backtest_csv(backtest_res['timeseries'])
        
        filename = f"SVM_Backtest_{req.symbol}_{req.kernel}.csv"
        return Response(content=csv_data, media_type="text/csv", headers={"Content-Disposition": f"attachment; filename={filename}"})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/kernels")
def kernel_comparison(symbol: str = "RELIANCE"):
    try:
        df = get_stock_data(symbol)
        df_clean, X, y, _ = prepare_features_and_target(df, ["Open-Close", "High-Low", "RSI"])
        
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

static_dir = os.path.join(os.path.dirname(__file__), "..", "..", "frontend", "dist")
if os.path.exists(static_dir):
    app.mount("/assets", StaticFiles(directory=os.path.join(static_dir, "assets")), name="assets")
    
    @app.get("/{full_path:path}")
    def serve_frontend(full_path: str):
        file_path = os.path.join(static_dir, full_path)
        if os.path.exists(file_path) and os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(static_dir, "index.html"))
