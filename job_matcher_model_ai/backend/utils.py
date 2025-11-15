import json
import fitz
from pdfminer.high_level import extract_text as pdf_extract_text
import tempfile
from dotenv import load_dotenv


load_dotenv()
from groq import Groq
import os
groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))
def extract_text_from_pdf(pdf_path):
    """Extract text from PDF"""
    text = ""
    with fitz.open(pdf_path) as doc:
        for page in doc:
            text += page.get_text()
    return text

def analyze_cv_with_groq_mena(cv_text, job_description):
    """Analyze CV vs job description using Groq 120B"""
    
    prompt = f"""
You are an expert recruiter specializing in MENA & Sub-Saharan Africa.

Analyze how well this CV matches the job description.

Return ONLY valid JSON:
{{
  "overall_match_score": (0-100),
  "ats_score": (0-100),
  "matched_skills": ["Skill1", "Skill2"],
  "missing_skills": ["Skill3", "Skill4"],
  "strengths": ["Strength1", "Strength2"],
  "weaknesses": ["Weakness1"],
  "suggestions": ["Suggestion1", "Suggestion2"],
  "overall_feedback": "2-3 sentence summary",
  "recommendation": "STRONG FIT / GOOD FIT / POTENTIAL FIT / NOT RECOMMENDED"
}}

CV Text:
{cv_text[:3500]}

Job Description:
{job_description[:2500]}
"""

    try:
        response = groq_client.chat.completions.create(
            model="openai/gpt-oss-120b",
            messages=[
                {"role": "system", "content": "You are a professional recruiter. Return clean JSON only."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.1
        )

        raw = response.choices[0].message.content.strip()

        # Clean JSON
        if "```json" in raw:
            raw = raw.split("```json")[1].split("```")[0]
        elif "```" in raw:
            raw = raw.split("```")[1].split("```")[0]

        return json.loads(raw.strip())

    except Exception as e:
        print(f"Analysis error: {e}")
        return {"error": str(e)}

def extract_skills_from_text(text, text_type="cv"):
    """Extract skills from CV or job description using AI"""
    
    prompt = f"""Extract all technical and soft skills from this {text_type}.

Return ONLY a JSON array of skills:
["Python", "Machine Learning", "Communication", "Leadership"]

Text:
{text[:2000]}

JSON array only:"""

    try:
        response = groq_client.chat.completions.create(
            model="openai/gpt-oss-120b",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.1
        )

        raw = response.choices[0].message.content.strip()
        
        # Clean
        if "```json" in raw:
            raw = raw.split("```json")[1].split("```")[0]
        elif "```" in raw:
            raw = raw.split("```")[1].split("```")[0]
        
        # Remove any text before/after array
        import re
        match = re.search(r'\[.*?\]', raw, re.DOTALL)
        if match:
            raw = match.group(0)
        
        skills = json.loads(raw)
        return skills if isinstance(skills, list) else []
        
    except Exception as e:
        print(f"Skill extraction error: {e}")
        return []
def load_job_descriptions():
    """Load job descriptions"""
    try:
        with open("job_descriptions.json", "r", encoding="utf-8") as f:
            return json.load(f)
    except FileNotFoundError:
        return {}

def save_job_descriptions(data):
    """Save job descriptions"""
    with open("job_descriptions.json", "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)