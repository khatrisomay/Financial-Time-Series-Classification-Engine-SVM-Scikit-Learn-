# Financial Time-Series Classification Engine (SVM & Scikit-Learn)

![Python](https://img.shields.io/badge/Python-3.10%20%7C%203.11%20%7C%203.12-blue.svg)
![Scikit-Learn](https://img.shields.io/badge/scikit--learn-1.6.1-orange.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-0.141.1-green.svg)
![React](https://img.shields.io/badge/React-18-cyan.svg)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED.svg)
![Kubernetes](https://img.shields.io/badge/Kubernetes-K8s_Ready-326CE5.svg)
![Helm](https://img.shields.io/badge/Helm-v3_Chart-0F1689.svg)
![GitHub Actions CI](https://img.shields.io/badge/CI%2FCD-GitHub_Actions_v10.5-2088FF.svg)

An end-to-end Machine Learning platform and interactive quantitative trading dashboard for **Predicting Stock Price Direction using Support Vector Machines (SVM)** based on historical market data, technical indicator feature engineering, financial NLP sentiment scoring, data drift monitoring, multi-kernel benchmarking, probability confidence estimation, feature importance weight inspection, feature subset strategy comparison, advanced classification metrics (MCC & Specificity), Expected Shortfall (CVaR) tail risk evaluation, cross-asset Pearson correlation matrices, trade execution friction simulation (commission & slippage), downside risk analytics (Sortino & Calmar Ratios), hyperparameter grid search optimization, Monte Carlo return forecasting, cross-asset portfolio ranking, and financial strategy backtesting.

---

## 🌟 Key Features & Architecture (v10.5 Enterprise)

1. **Python Machine Learning Engine (`backend/`)**:
   - **Data Ingestion**: Multi-stock historical loader supporting **RELIANCE**, **TCS**, **ICICI BANK**, **AAPL**, and **TSLA** with synthetic fallback generators and live `yfinance` integration.
   - **Feature Engineering**: Calculates core variables (`Open-Close`, `High-Low`) alongside extended technical indicators (`RSI`, `SMA_Diff`, `MACD`, `Bollinger_Bands`, `Volatility`) and binary target signals ($+1$ Buy, $0$ Hold).
   - **Feature Importance & Weights Inspector**: Extracts linear coefficient weights and feature variance contribution rankings (`feature_importance.py`).
   - **Probability Confidence Estimator**: Calculates continuous decision probability scores (`SVC(probability=True)`) to score signal conviction percentages.
   - **Expected Shortfall (CVaR) & Tail Risk**: Calculates 95% & 99% Value-at-Risk (VaR) and Conditional Value-at-Risk (`cvar_calculator.py`) for tail loss risk management.
   - **Cross-Asset Pearson Correlation Heatmap**: Computes pairwise correlation matrices (`asset_correlation.py`) across multi-stock universe.
   - **Trade Execution Friction Simulator**: Incorporates realistic broker commission (`10 bps`) and market slippage (`5 bps`) penalties into net strategy yield calculations.
   - **Risk-Adjusted Performance Ratios**: Calculates Sharpe Ratio, **Sortino Ratio** (downside volatility adjustment), and **Calmar Ratio** (CAGR to max drawdown ratio).
   - **Advanced Classification Diagnostics**: Computes Specificity, Balanced Accuracy, False Positive Rate (FPR), and **Matthews Correlation Coefficient (MCC)** for robust ML evaluation (`diagnostic_metrics.py`).
   - **Feature Subset Benchmark Matrix**: Evaluates predictive accuracy and Sharpe Ratio yields across different indicator combinations (`Price Action Only`, `Price + RSI`, `Price + MACD`, `Full Technical Suite`).
   - **Financial NLP Sentiment Engine**: Scrapes and analyzes market headlines using domain-specific financial sentiment lexicons, producing compound sentiment scores and Bullish/Bearish conviction labels.
   - **Data Drift & Health Monitoring**: Performs Kolmogorov-Smirnov distribution tests (`drift_monitor.py`) between training baseline and recent incoming data to flag feature distribution shifts.
   - **Hyperparameter Grid Search**: Time-Series Cross Validation (`TimeSeriesSplit`) grid search optimizer to dynamically find optimal penalty $C$, $\gamma$, and degree parameters without data leakage.
   - **SVM Classifier Suite**: Sequential 80/20 train/test split, feature standard scaling, multi-kernel support (`linear`, `rbf`, `poly`, `sigmoid`), and test confusion matrix metrics (`TN`, `FP`, `FN`, `TP`, Precision, Recall, F1-Score).
   - **Cross-Asset Portfolio Analytics**: Multi-stock performance evaluator ranking assets by risk-adjusted Sharpe Ratio and Alpha outperformance.
   - **Monte Carlo Risk Engine**: 500-path stochastic return simulation calculating 95% Value at Risk (VaR), 5th percentile Bear case, 50th percentile Expected case, and 95th percentile Bull case.
   - **Quantitative Backtesting Simulator**: Signal generation, cumulative strategy returns calculation, CAGR %, Sharpe Ratio, Maximum Drawdown %, Win/Loss %, and Alpha (% Outperformance over stock Buy & Hold).

2. **☸️ Kubernetes (K8s) & Cloud-Native Infrastructure**:
   - **Kubernetes Deployments (`k8s/deployment.yaml`)**: Rolling updates with 2 replica pods, readiness & liveness probes (`/api/health`), and CPU/Memory resource constraints (`512Mi`).
   - **ClusterIP & Ingress (`k8s/service.yaml`, `k8s/ingress.yaml`)**: Internal service load balancing and NGINX Ingress controller for SSL/TLS domain termination.
   - **Horizontal Pod Autoscaler (`k8s/hpa.yaml`)**: Dynamic auto-scaling from 2 to 10 pod replicas based on 70% CPU / 80% Memory thresholds.
   - **ConfigMaps & Secrets (`k8s/configmap.yaml`, `k8s/secret.yaml`)**: Decoupled environment variables and secure credentials.
   - **Helm v3 Chart (`helm/`)**: Standardized Helm chart packaging (`Chart.yaml`, `values.yaml`) for one-command enterprise cluster deployment.

3. **🛠️ GitHub Actions CI/CD & DevOps Security**:
   - **Python Matrix Testing (`python-matrix-ci.yml`)**: Automated matrix builds across Python 3.10, 3.11, and 3.12 on Ubuntu and Windows runners.
   - **Frontend React Build Pipeline (`frontend-ci.yml`)**: Automated npm dependency resolution, Vite bundling, and asset size verification.
   - **Docker Build Automation (`docker-ci.yml`)**: Automated multi-stage Docker image verification with `HEALTHCHECK` probes.
   - **Dependency Supply Chain Security (`dependency-review.yml`)**: Automated vulnerability reviewer for pull requests.
   - **Bandit SAST Security Audit (`security-scan.yml`)**: Static code analysis checking for security vulnerabilities and unhandled exceptions.
   - **PyTest Integration Suite (`backend/tests/`)**: Complete test coverage covering REST API endpoints, model training, feature scaling, Monte Carlo risk engine, CVaR math, friction backtesting, and portfolio analytics.
   - **OpenAPI 3.0 Documentation (`export_openapi.py`)**: Automated export of `openapi.json` API specification.

4. **Widescreen Glassmorphic Web Dashboard (`frontend/`)**:
   - **Terminal View**: Live KPI metric cards, widescreen interactive Recharts trajectory chart, Financial NLP News Sentiment Card, real-time SVM Sandbox (kernel toggles, hyperparameter sliders $C$ & $\gamma$, Auto-Tune Grid Search button, feature selection), Monte Carlo risk forecaster with 95%/99% Expected Shortfall CVaR, DevOps Health modal with GitHub Actions badge, and 2x2 diagnostic confusion matrix.
   - **Signals & Benchmarks View**: Technical Feature Combination Benchmark Matrix comparing accuracy, strategy return, Sharpe ratio, and alpha outperformance across feature subsets.
   - **Portfolio Analytics View**: Cross-asset efficiency table ranking multi-stock SVM strategy performance by Sharpe Ratio and Win Rate, alongside the Interactive Cross-Asset Correlation Matrix Heatmap.
   - **Kernel Matrix Lab**: Feature Importance Weight Inspector rankings and comparative benchmark matrix across Linear, Polynomial, RBF, and Sigmoid kernels.

---

## ☸️ Kubernetes (K8s) & Helm Deployment

### 1. Apply Kubernetes Manifests
```bash
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secret.yaml
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
kubectl apply -f k8s/ingress.yaml
kubectl apply -f k8s/hpa.yaml
```

### 2. Deploy via Helm v3
```bash
helm install quantum-svm ./helm
```

---

## 🐳 Docker Setup & Deployment

Run the entire application in a single command using Docker Compose:

```bash
docker compose up --build
```

For production deployment:
```bash
docker compose -f docker-compose.prod.yml up --build -d
```

Access the application in your browser:
👉 **[http://localhost:8000/](http://localhost:8000/)**

---

## 💻 Local Setup & Local CI Verification

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

4. **Run Local CI Test Suite**:
   ```bash
   python scripts/run_local_ci.py
   ```

5. **Generate Enterprise Benchmark Report**:
   ```bash
   python scripts/generate_benchmark_report.py
   ```

6. **Launch Application**:
   ```bash
   python run_app.py
   ```

---

## 📊 REST API Endpoints

- `GET /api/health` - API Health check, container uptime & memory metrics.
- `GET /api/stocks` - List available preset stocks.
- `POST /api/predict` - Train SVM model with selected parameters and return predictions & backtest stats (supports `commission_bps` & `slippage_bps`).
- `GET /api/feature-importance` - Feature coefficient weights and feature importance rankings.
- `GET /api/cvar` - Tail risk Expected Shortfall (CVaR 95% / 99%) calculations.
- `GET /api/correlation` - Pairwise Pearson cross-asset correlation matrix.
- `GET /api/diagnostics` - Advanced classification metrics (Specificity, MCC, Balanced Accuracy).
- `GET /api/feature-comparison` - Compare predictive performance across feature variable subsets.
- `GET /api/sentiment` - Analyze financial news sentiment scores and headlines.
- `GET /api/drift-status` - Kolmogorov-Smirnov feature data drift test results.
- `GET /api/portfolio-comparison` - Compare and rank cross-asset portfolio efficiency.
- `POST /api/optimize` - Run Time-Series Grid Search to optimize $C$ and $\gamma$ parameters.
- `POST /api/monte-carlo` - Run 500-path Monte Carlo risk & return forecast simulation.
- `POST /api/export` - Export backtesting performance report as downloadable CSV.
- `GET /api/kernels` - Compare performance across all 4 SVM kernels (Linear, Poly, RBF, Sigmoid).

---

## 📄 License
MIT License
