import sys
import os
import pytest
from fastapi.testclient import TestClient

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from app.main import app

client = TestClient(app)

def test_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "uptime_seconds" in data
    assert "memory_usage_mb" in data

def test_stocks_endpoint():
    response = client.get("/api/stocks")
    assert response.status_code == 200
    data = response.json()
    assert "stocks" in data
    assert len(data["stocks"]) >= 5

def test_predict_endpoint():
    response = client.post("/api/predict", json={
        "symbol": "RELIANCE",
        "selected_features": ["Open-Close", "High-Low", "RSI"],
        "kernel": "rbf",
        "C": 1.0
    })
    assert response.status_code == 200
    data = response.json()
    assert data["symbol"] == "RELIANCE"
    assert "model_performance" in data
    assert "backtest" in data
    assert data["model_performance"]["test_accuracy"] > 0

def test_sentiment_endpoint():
    response = client.get("/api/sentiment?symbol=RELIANCE")
    assert response.status_code == 200
    data = response.json()
    assert "overall_sentiment" in data
    assert "avg_compound_score" in data

def test_kernels_endpoint():
    response = client.get("/api/kernels?symbol=RELIANCE")
    assert response.status_code == 200
    data = response.json()
    assert "comparison" in data
    assert len(data["comparison"]) == 4
