# Financial Time-Series Classification Engine (SVM & Scikit-Learn)

![Python](https://img.shields.io/badge/Python-3.12-blue.svg)
![Scikit-Learn](https://img.shields.io/badge/scikit--learn-1.6.1-orange.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-0.141.1-green.svg)
![React](https://img.shields.io/badge/React-18-cyan.svg)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED.svg)
![CI/CD](https://img.shields.io/badge/CI%2FCD-GitHub_Actions-2088FF.svg)

An end-to-end Machine Learning platform and interactive quantitative trading dashboard for **Predicting Stock Price Direction using Support Vector Machines (SVM)** based on historical market data, technical indicator feature engineering, multi-kernel benchmarking, hyperparameter grid search optimization, Monte Carlo return forecasting, cross-asset portfolio ranking, and financial strategy backtesting.

---

## 🌟 Key Features & Architecture

1. **Python Machine Learning Engine (`backend/`)**:
   - **Data Ingestion**: Multi-stock historical loader supporting **RELIANCE**, **TCS**, **ICICI BANK**, **AAPL**, and **TSLA** with synthetic fallback generators and live `yfinance` integration.
   - **Feature Engineering**: Calculates core variables (`Open-Close`, `High-Low`) alongside extended technical indicators (`RSI`, `SMA_Diff`, `MACD`, `Bollinger_Bands`, `Volatility`) and binary target signals ($+1$ Buy, $0$ Hold).
   - **Hyperparameter Grid Search**: Time-Series Cross Validation (`TimeSeriesSplit`) grid search optimizer to dynamically find optimal penalty $C$, $\gamma$, and degree parameters without data leakage.
   - **SVM Classifier Suite**: Sequential 80/20 train/test split, feature standard scaling, multi-kernel support (`linear`, `rbf`, `poly`, `sigmoid`), and test confusion matrix metrics (`TN`, `FP`, `FN`, `TP`, Precision, Recall, F1-Score).
   - **Cross-Asset Portfolio Analytics**: Multi-stock performance evaluator ranking assets by risk-adjusted Sharpe Ratio and Alpha outperformance.
   - **Monte Carlo Risk Engine**: 500-path stochastic return simulation calculating 95% Value at Risk (VaR), 5th percentile Bear case, 50th percentile Expected case, and 95th percentile Bull case.
   - **Quantitative Backtesting Simulator**: Signal generation, cumulative strategy returns calculation, CAGR %, Sharpe Ratio, Maximum Drawdown %, Win/Loss %, and Alpha (% Outperformance over stock Buy & Hold).

2. **🛠️ DevOps & Infrastructure Stack (v4.0 Enterprise)**:
   - **Docker Multi-Stage Build**: Stage 1 (`node:20-alpine`) compiles React SPA static assets; Stage 2 (`python:3.12-slim`) runs the Python ASGI backend.
   - **Docker Compose Orchestration**: Configures single-command startup (`docker compose up --build`), port binding (`8000:8000`), and `unless-stopped` restart policies.
   - **GitHub Actions CI/CD**: Automated `.github/workflows/ci.yml` pipeline validating Python ML test suites (`test_pipeline.py`) and building React assets on every commit.
   - **Container Health & Telemetry Probes**: Endpoint `/api/health` exposing real-time RSS memory consumption (`psutil`), container uptime, and active worker threads.
   - **Uvicorn ASGI Production Server**: Hosts REST APIs, applies CORS security headers, and serves minified SPA production assets.

3. **Widescreen Glassmorphic Web Dashboard (`frontend/`)**:
   - **Terminal View**: Live KPI metric cards, widescreen interactive Recharts trajectory chart, real-time SVM Sandbox (kernel toggles, hyperparameter sliders $C$ & $\gamma$, Auto-Tune Grid Search button, feature selection), Monte Carlo risk forecaster, DevOps Health modal, and 2x2 diagnostic confusion matrix.
   - **Portfolio Analytics View**: Cross-asset efficiency table ranking multi-stock SVM strategy performance by Sharpe Ratio and Win Rate.
   - **Kernel Matrix Lab**: Comparative benchmark matrix across Linear, Polynomial, RBF, and Sigmoid kernels with accuracy sparklines and risk gauges.
   - **Signals Log & CSV Export**: Tabular record of recent daily signal classifications with one-click CSV export button.

---

## 🐳 Docker Setup & Deployment

Run the entire application in a single command using Docker Compose:

```bash
docker compose up --build
```

Access the application in your browser:
👉 **[http://localhost:8000/](http://localhost:8000/)**

---

## 💻 Local Setup (Without Docker)

### Prerequisites
- Python 3.10+
- Node.js v18+ & npm

### Installation Steps

1. **Clone the repository**:
   ```bash
   git clone https://github.com/khatrisomay/Financial-Time-Series-Classification-Engine-SVM-Scikit-Learn-.git
   cd Financial-Time-Series-Classification-Engine-SVM-Scikit-Learn-
   ```

2. **Install Python dependencies**:
   ```bash
   pip install -r backend/requirements.txt
   ```

3. **Install Frontend dependencies & Build**:
   ```bash
   cd frontend
   npm install
   npm run build
   cd ..
   ```

4. **Launch Application**:
   ```bash
   python run_app.py
   ```

---

## 📊 REST API Endpoints

- `GET /api/health` - API Health check, container uptime & memory metrics.
- `GET /api/stocks` - List available preset stocks.
- `POST /api/predict` - Train SVM model with selected parameters and return predictions & backtest stats.
- `GET /api/portfolio-comparison` - Compare and rank cross-asset portfolio efficiency.
- `POST /api/optimize` - Run Time-Series Grid Search to optimize $C$ and $\gamma$ parameters.
- `POST /api/monte-carlo` - Run 500-path Monte Carlo risk & return forecast simulation.
- `POST /api/export` - Export backtesting performance report as downloadable CSV.
- `GET /api/kernels` - Compare performance across all 4 SVM kernels (Linear, Poly, RBF, Sigmoid).

---

## 📄 License
MIT License
