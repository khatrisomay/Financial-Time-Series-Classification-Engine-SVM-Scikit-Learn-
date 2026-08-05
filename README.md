# Financial Time-Series Classification Engine (SVM & Scikit-Learn)

![Python](https://img.shields.io/badge/Python-3.12-blue.svg)
![Scikit-Learn](https://img.shields.io/badge/scikit--learn-1.6.1-orange.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-0.141.1-green.svg)
![React](https://img.shields.io/badge/React-18-cyan.svg)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED.svg)

An end-to-end Machine Learning platform and interactive quantitative trading dashboard for **Predicting Stock Price Direction using Support Vector Machines (SVM)** based on historical market data, technical indicator feature engineering, multi-kernel benchmarking, and financial strategy backtesting.

---

## 🌟 Key Features

1. **Python Machine Learning Engine (`backend/`)**:
   - **Data Ingestion**: Multi-stock historical loader supporting **RELIANCE**, **TCS**, **ICICI BANK**, **AAPL**, and **TSLA** with synthetic fallback generators and live `yfinance` integration.
   - **Feature Engineering**: Calculates core variables (`Open-Close`, `High-Low`) alongside extended technical indicators (`RSI(14)`, `SMA_Diff`, `Volatility`) and binary target signals ($+1$ Buy, $0$ Hold).
   - **SVM Classifier Suite**: Sequential 80/20 train/test split, feature standard scaling, multi-kernel support (`linear`, `rbf`, `poly`, `sigmoid`), and test confusion matrix metrics (`TN`, `FP`, `FN`, `TP`, Precision, Recall, F1-Score).
   - **Quantitative Backtesting Simulator**: Signal generation, cumulative strategy returns calculation, CAGR %, Sharpe Ratio, Maximum Drawdown %, Win/Loss %, and Alpha (% Outperformance over stock Buy & Hold).
   - **FastAPI REST Server**: Serves live predictions, kernel comparisons, and market data payloads via REST API.

2. **Widescreen Glassmorphic Web Dashboard (`frontend/`)**:
   - **Terminal View**: Live KPI metric cards, widescreen interactive Recharts trajectory chart, real-time SVM Sandbox (kernel toggles, hyperparameter sliders $C$ & $\gamma$, feature selection), and 2x2 diagnostic confusion matrix.
   - **Kernel Matrix Lab**: Comparative benchmark matrix across Linear, Polynomial, RBF, and Sigmoid kernels with accuracy sparklines and risk gauges.
   - **Signals Log**: Tabular record of recent daily signal classifications.

3. **Containerized Deployment**:
   - Multi-stage Docker build producing a lightweight production image with built frontend assets and backend API.

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

- `GET /api/health` - API Health check.
- `GET /api/stocks` - List available preset stocks.
- `POST /api/predict` - Train SVM model with selected parameters and return predictions & backtest stats.
- `GET /api/kernels` - Compare performance across all 4 SVM kernels (Linear, Poly, RBF, Sigmoid).

---

## 📄 License
MIT License
