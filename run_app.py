import sys
import os
import webbrowser
import time
import uvicorn

# Force utf-8 encoding for standard output if needed
if sys.stdout.encoding and sys.stdout.encoding.lower() != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

root_dir = os.path.dirname(os.path.abspath(__file__))
backend_dir = os.path.join(root_dir, "backend")
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

def main():
    print("=" * 60)
    print("QUANTUM_SVM: Stock Price Direction Prediction System")
    print("=" * 60)
    print("--> Backend Engine: Support Vector Classifier (SVC)")
    print("--> Web Dashboard: Glassmorphic Dark UI (Tailwind + Recharts)")
    print("--> Server Address: http://localhost:8000/")
    print("=" * 60)

    def open_browser():
        time.sleep(1.5)
        webbrowser.open("http://localhost:8000/")

    import threading
    threading.Thread(target=open_browser, daemon=True).start()

    from app.main import app
    uvicorn.run(app, host="127.0.0.1", port=8000, log_level="info")

if __name__ == "__main__":
    main()
