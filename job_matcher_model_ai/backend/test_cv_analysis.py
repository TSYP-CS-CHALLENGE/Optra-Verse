# test_cv_analysis.py

from pathlib import Path
from cv_analysis import CVAnalyzer
import json
from pathlib import Path

# Path to your sample CV
cv_file_path = Path("example_cv.pdf")

if not cv_file_path.exists():
    print("❌ Test CV not found. Place 'example_cv.pdf' in the project root.")
    exit()

with open(cv_file_path, "rb") as f:
    analyzer = CVAnalyzer()
    result = analyzer.analyze_pdf_file(f)

print("✅ CV Analysis Result:")
print(json.dumps(result, indent=2))
