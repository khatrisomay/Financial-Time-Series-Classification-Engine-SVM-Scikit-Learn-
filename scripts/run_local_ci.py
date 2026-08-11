import subprocess
import sys
import os

def run_command(cmd, cwd=None):
    print(f"\n🚀 Running: {' '.join(cmd)}")
    result = subprocess.run(cmd, cwd=cwd, shell=True)
    if result.returncode != 0:
        print(f"❌ Command failed with exit code {result.returncode}")
        sys.exit(result.returncode)
    print("✅ Passed!")

def main():
    root_dir = os.path.join(os.path.dirname(__file__), "..")
    
    print("--- 1. Running Python ML Unit Tests & Validation ---")
    run_command("py backend/test_pipeline.py", cwd=root_dir)
    
    print("\n--- 2. Running PyTest Test Suite ---")
    run_command("py -m pytest backend/tests/", cwd=root_dir)
    
    print("\n--- 3. Building React Production Bundle ---")
    run_command("npm run build", cwd=os.path.join(root_dir, "frontend"))
    
    print("\n🎉 Local CI Validation Passed Cleanly!")

if __name__ == "__main__":
    main()
