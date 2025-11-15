import tempfile
from utils import extract_text_from_pdf
from groq import Groq
import os
import json

from dotenv import load_dotenv
import os

load_dotenv()  # this loads .env variables
groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))

class CVAnalyzer:
    def __init__(self):
        pass

    def analyze_cv(self, cv_file):
        try:
            # If cv_file is file object
            with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
                tmp.write(cv_file.read())
                tmp_path = tmp.name

            cv_text = extract_text_from_pdf(tmp_path)

            # Call AI model
            prompt = f"Extract candidate profile from this CV:\n\n{cv_text[:4000]}\n\nReturn JSON only."
            response = groq_client.chat.completions.create(
                model="openai/gpt-oss-120b",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.1,
                response_format={"type": "json_object"}
            )
            profile = json.loads(response.choices[0].message.content)

            return {"profile": profile, "analysis": {"match_score": 0}}
        except Exception as e:
            print(f"[ERROR] PDF analysis failed: {e}")
            return {"profile": {}, "analysis": {}}
