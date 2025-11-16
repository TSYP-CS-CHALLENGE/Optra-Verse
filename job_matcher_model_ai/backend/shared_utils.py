import json
import fitz

def extract_text_from_pdf(pdf_path):
    """Extract text from PDF"""
    text = ""
    with fitz.open(pdf_path) as doc:
        for page in doc:
            text += page.get_text()
    return text

def load_job_descriptions():
    """Load job descriptions from JSON"""
    try:
        with open("job_descriptions.json", "r", encoding="utf-8") as f:
            return json.load(f)
    except FileNotFoundError:
        return {}

def save_job_descriptions(data):
    """Save job descriptions to JSON"""
    with open("job_descriptions.json", "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)