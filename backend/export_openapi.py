import json
import os
import sys

sys.path.insert(0, os.path.dirname(__file__))

from app.main import app

def export_openapi():
    openapi_data = app.openapi()
    output_path = os.path.join(os.path.dirname(__file__), "..", "openapi.json")
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(openapi_data, f, indent=2)
    print(f"OpenAPI specification exported successfully to {output_path}")

if __name__ == "__main__":
    export_openapi()
