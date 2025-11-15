import os
import json
import io
from groq import Groq
import requests
from bs4 import BeautifulSoup
from datetime import datetime
import time
from urllib.parse import urljoin, urlparse
import sqlite3
import pandas as pd
import streamlit as st
from dotenv import load_dotenv
from pydantic import BaseModel
from pydantic import BaseModel
from typing import List, Optional
from llama_cloud.core.api_error import ApiError
import tempfile
import re
from pathlib import Path
import requests
from deep_translator import GoogleTranslator
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.responses import JSONResponse
import openai
from openai import OpenAI
from sentence_transformers import SentenceTransformer, util
import chromadb
from sentence_transformers import util
import shutil
import os
from pydantic import BaseModel, EmailStr, validator 
from typing import List, Optional
from pydantic import BaseModel
from typing import List, Optional
import sqlite3
import json
import fitz
import requests
from smart_recommendations import smart_recommender
from vector_search import vector_matcher
from mena_job_scraper import MENAAfricaJobScraper


def ensure_vector_db_populated():
    """Ensure vector database has jobs"""
    try:
        count = vector_matcher.job_collection.count()
        
        if count == 0:
            print("⚠️ Vector DB empty, populating...")
            jobs = load_job_descriptions()
            
            if jobs:
                vector_matcher.populate_with_existing_jobs(jobs)
                print(f"✅ Populated with {len(jobs)} jobs")
            else:
                print("⚠️ No jobs to populate")
    except Exception as e:
        print(f"⚠️ Vector DB check failed: {e}")

# Call it once when app loads
if 'vector_db_populated' not in st.session_state:
    ensure_vector_db_populated()
    st.session_state.vector_db_populated = True
TRANSLATIONS = {
    "en": {
        "welcome": "🎓 Welcome to Our Job Application Portal",
        "subtitle": "Find your perfect match and get instant CV feedback!",
        "tab1": "🔍 Analyze My CV",
        "tab2": "💼 Browse Jobs",
        "tab3": "📝 My Applications",
        "name": "👤 Your Name",
        "email": "📧 Your Email",
        "upload_cv": "📎 Upload CV (PDF)",
        "select_position": "💼 Select Target Position",
        "analyze_btn": "🚀 Analyze My CV",
        "fill_all": "❌ Please fill all fields",
        "analyzing": "🔍 Analyzing your CV with 70B AI model...",
        "results_title": "📊 Analysis Results",
        "match_score": "🎯 Match Score",
        "matched_skills": "✅ Matched Skills",
        "skills_to_learn": "⚠️ Skills to Learn",
        "your_strengths": "✅ Your Strengths",
        "skills_to_develop": "⚠️ Skills to Develop",
        "suggestions": "💡 Suggestions",
        "submit_app": "📤 Submit Application",
        "app_submitted": "✅ Application submitted! We'll contact you soon.",
        "excellent_match": "🎉 Excellent match! Apply now!",
        "good_match": "👍 Good match! Review suggestions below.",
        "gaps_to_address": "💡 Some gaps to address first.",
    },
    "ar": {
        "welcome": "🎓 مرحبا بك في بوابة التوظيف",
        "subtitle": "اعثر على الوظيفة المثالية واحصل على تحليل فوري لسيرتك الذاتية!",
        "tab1": "🔍 تحليل السيرة الذاتية",
        "tab2": "💼 تصفح الوظائف",
        "tab3": "📝 طلباتي",
        "name": "👤 اسمك",
        "email": "📧 بريدك الإلكتروني",
        "upload_cv": "📎 ارفع سيرتك الذاتية (PDF)",
        "select_position": "💼 اختر الوظيفة المستهدفة",
        "analyze_btn": "🚀 تحليل سيرتي الذاتية",
        "fill_all": "❌ يرجى ملء جميع الحقول",
        "analyzing": "🔍 جاري تحليل سيرتك الذاتية باستخدام الذكاء الاصطناعي...",
        "results_title": "📊 نتائج التحليل",
        "match_score": "🎯 نسبة التطابق",
        "matched_skills": "✅ المهارات المطابقة",
        "skills_to_learn": "⚠️ مهارات يجب تعلمها",
        "your_strengths": "✅ نقاط القوة",
        "skills_to_develop": "⚠️ مهارات يجب تطويرها",
        "suggestions": "💡 اقتراحات",
        "submit_app": "📤 إرسال الطلب",
        "app_submitted": "✅ تم إرسال طلبك! سنتواصل معك قريباً.",
        "excellent_match": "🎉 تطابق ممتاز! قدم الآن!",
        "good_match": "👍 تطابق جيد! راجع الاقتراحات أدناه.",
        "gaps_to_address": "💡 بعض الفجوات التي يجب معالجتها أولاً.",
    }
}



def extract_text_from_pdf(pdf_path):
    """Shared: Extract text from PDF"""
    text = ""
    with fitz.open(pdf_path) as doc:
        for page in doc:
            text += page.get_text()
    return text

def load_job_descriptions():
    """Shared: Load job descriptions"""
    try:
        with open("job_descriptions.json", "r", encoding="utf-8") as f:
            return json.load(f)
    except FileNotFoundError:
        return {}

def save_job_descriptions(data):
    """Shared: Save job descriptions"""
    with open("job_descriptions.json", "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

def create_database():
    """Shared: Create SQLite database"""
    conn = sqlite3.connect("cvs.db")
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS candidates (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            email TEXT UNIQUE,
            phone TEXT,
            json_data TEXT,
            applied_jobs TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()

def save_to_database(name, email, phone, json_data, applied_jobs):
    """Shared: Save candidate to database"""
    with sqlite3.connect("cvs.db") as conn:
        c = conn.cursor()
        c.execute("SELECT * FROM candidates WHERE email = ?", (email,))
        existing = c.fetchone()

        if existing:
            c.execute('''
                UPDATE candidates 
                SET name = ?, phone = ?, json_data = ?, applied_jobs = ?
                WHERE email = ?
            ''', (name, phone, json_data, json.dumps(applied_jobs), email))
        else:
            c.execute('''
                INSERT INTO candidates (name, email, phone, applied_jobs, json_data)
                VALUES (?, ?, ?, ?, ?)
            ''', (name, email, phone, json.dumps(applied_jobs), json_data))
        conn.commit()



# ===== EXPORT FUNCTION =====
def export_analytics_report():
    """Generate and export full analytics report"""
    conn = sqlite3.connect("cvs.db")
    df = pd.read_sql_query("SELECT * FROM candidates", conn)
    conn.close()
    
    # Create comprehensive report
    report = {
        "summary": {
            "total_candidates": len(df),
            "generated_at": datetime.now().strftime('%Y-%m-%d %H:%M')
        },
        "candidates": df.to_dict('records')
    }
    
    return json.dumps(report, indent=2)



# Initialize Groq client
groq_client = Groq(api_key=os.getenv("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"))

def analyze_cv_with_groq_mena(cv_text, job_description):
    """Analyze CV vs job description with MENA context awareness using Groq GPT OSS 120B"""
    prompt = f"""
You are an expert recruiter who specializes in evaluating MENA-region candidates.

Your task: Analyze this CV against the job description and provide an assessment tailored to MENA profiles.

Consider:
- Multilingual resumes (Arabic, French, English)
- Common MENA academic systems and certificates
- Regional skills (e.g., internships, AI, data analysis, digital marketing)
- Balance between technical and soft skills

Return **ONLY valid JSON** in the following format:
{{
  "match_score": (number from 0 to 100),
  "matched_skills": ["Skill1", "Skill2"],
  "missing_skills": ["Skill3"],
  "suggestions": ["Suggestion1"],
  "strengths": ["Strength1"],
  "overall_feedback": "Short summary in English (2–3 sentences) highlighting fit for MENA market"
}}

CV:
{cv_text[:3000]}

Job Description:
{job_description[:2000]}
"""

    try:
        response = groq_client.chat.completions.create(
            model="openai/gpt-oss-120b",
            messages=[
                {
                    "role": "system",
                    "content": "You are a professional recruiter specialized in analyzing MENA-region CVs and job descriptions. Always return clean JSON output only."
                },
                {"role": "user", "content": prompt}
            ],
            temperature=0.1
        )

        raw = response.choices[0].message.content.strip()

        # Clean Markdown JSON block
        if "```json" in raw:
            raw = raw.split("```json")[1].split("```")[0]
        elif "```" in raw:
            raw = raw.split("```")[1].split("```")[0]

        return json.loads(raw.strip())

    except Exception as e:
        return {"error": str(e)}





