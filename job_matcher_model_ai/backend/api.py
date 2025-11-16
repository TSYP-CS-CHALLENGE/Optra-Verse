
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, EmailStr
from typing import List, Optional, Dict
import tempfile
import os
import json
from datetime import datetime

# Environment setup
from dotenv import load_dotenv
load_dotenv()

# Initialize Groq with proper env var
from groq import Groq
groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))

# Verify API key is loaded
if not os.getenv("GROQ_API_KEY"):
    raise RuntimeError("❌ GROQ_API_KEY not found in environment variables!")

# Import utilities 
from utils import (
    extract_text_from_pdf,
    analyze_cv_with_groq_mena,
    extract_skills_from_text
)

# Import services
from vector_search import vector_matcher
from smart_recommendations import smart_recommender
from mena_job_scraper import MENAAfricaJobScraper

# Set dependencies
smart_recommender.set_dependencies(vector_matcher, MENAAfricaJobScraper())

# Initialize FastAPI
app = FastAPI(
    title="UtopiaHire API v2.0",
    description="AI-powered hiring platform for MENA & Sub-Saharan Africa",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==================== PYDANTIC MODELS ====================

class JobDescriptionInput(BaseModel):
    """Job description input model"""
    job_title: str
    job_description: str
    company_name: Optional[str] = None
    location: Optional[str] = None
    salary_range: Optional[str] = None
    employment_type: Optional[str] = "Full-time"

class CVAnalysisResponse(BaseModel):
    """CV analysis response"""
    success: bool
    overall_match_score: int
    ats_score: int
    matched_skills: List[str]
    missing_skills: List[str]
    strengths: List[str]
    weaknesses: List[str]
    suggestions: List[str]
    overall_feedback: str
    recommendation: str
    timestamp: str

# ==================== STARTUP EVENT ====================

@app.on_event("startup")
async def startup_event():
    """Initialize services on startup"""
    print("🚀 Starting UtopiaHire API v2.0...")
    
    # Verify Groq API key
    if not os.getenv("GROQ_API_KEY"):
        print("❌ WARNING: GROQ_API_KEY not set!")
    else:
        print("✅ Groq API configured")
    
    # Check vector DB
    try:
        count = vector_matcher.job_collection.count()
        print(f"✅ Vector DB initialized ({count} jobs)")
    except Exception as e:
        print(f"⚠️ Vector DB warning: {e}")
    
    print("📚 API Docs available at: http://localhost:8000/docs")

# ==================== API ENDPOINTS ====================

@app.get("/", tags=["Health"])
async def root():
    """API health check"""
    return {
        "status": "online",
        "message": "UtopiaHire API v2.0",
        "version": "2.0.0",
        "features": [
            "✅ Dynamic job description input",
            "✅ Resume review with AI",
            "✅ Smart job matching",
            "✅ Footprint scanning",
            "✅ Career insights"
        ],
        "endpoints": {
            "docs": "/docs",
            "health": "/api/health",
            "analyze_cv": "/api/resume/analyze",
            "match_jobs": "/api/jobs/match"
        }
    }

@app.get("/api/health", tags=["Health"])
async def health_check():
    """Detailed health check"""
    groq_configured = bool(os.getenv("GROQ_API_KEY"))
    
    try:
        db_count = vector_matcher.job_collection.count()
        vector_status = "healthy"
    except Exception as e:
        db_count = 0
        vector_status = f"error: {str(e)}"
    
    return {
        "status": "healthy" if groq_configured else "degraded",
        "groq_api": "configured" if groq_configured else "missing",
        "vector_db": vector_status,
        "vector_db_count": db_count,
        "version": "2.0.0",
        "timestamp": datetime.now().isoformat()
    }

# ==================== MODULE 1: RESUME REVIEWER ====================

@app.post("/api/resume/analyze", tags=["Resume Reviewer"], response_model=CVAnalysisResponse)
async def analyze_resume(
    file: UploadFile = File(...),
    job_title: str = Form(...),
    job_description: str = Form(...),
    candidate_name: Optional[str] = Form(None),
    candidate_email: Optional[str] = Form(None)
):
    """
    Analyze CV against job description
    
    Returns:
    - Overall match score (0-100)
    - ATS compatibility score
    - Matched/missing skills
    - Strengths & weaknesses
    - Actionable suggestions
    - Hiring recommendation
    """
    
    # Input validation
    if not file.filename.lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")
    
    if len(job_description.strip()) < 20:
        raise HTTPException(
            status_code=400, 
            detail="Job description too short (minimum 20 characters required)"
        )
    
    if len(job_description) > 10000:
        raise HTTPException(
            status_code=400,
            detail="Job description too long (maximum 10,000 characters)"
        )
    
    # Extract CV text
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
            content = await file.read()
            tmp.write(content)
            tmp_path = tmp.name
        
        cv_text = extract_text_from_pdf(tmp_path)
        os.unlink(tmp_path)
        
        if len(cv_text.strip()) < 100:
            raise HTTPException(
                status_code=400, 
                detail="Could not extract sufficient text from PDF. Ensure it's not a scanned image."
            )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error reading PDF: {str(e)}")
    
    # Analyze with AI
    try:
        analysis = analyze_cv_with_groq_mena(cv_text, job_description)
        
        if "error" in analysis:
            raise HTTPException(status_code=500, detail=analysis["error"])
        
        return CVAnalysisResponse(
            success=True,
            overall_match_score=analysis.get('overall_match_score', 0),
            ats_score=analysis.get('ats_score', 0),
            matched_skills=analysis.get('matched_skills', []),
            missing_skills=analysis.get('missing_skills', []),
            strengths=analysis.get('strengths', []),
            weaknesses=analysis.get('weaknesses', []),
            suggestions=analysis.get('suggestions', []),
            overall_feedback=analysis.get('overall_feedback', ''),
            recommendation=analysis.get('recommendation', 'N/A'),
            timestamp=datetime.now().isoformat()
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@app.post("/api/resume/extract-skills", tags=["Resume Reviewer"])
async def extract_skills(file: UploadFile = File(...)):
    """
    Extract skills from CV using AI
    
    Returns list of technical and soft skills
    """
    
    if not file.filename.lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")
    
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
            content = await file.read()
            tmp.write(content)
            tmp_path = tmp.name
        
        cv_text = extract_text_from_pdf(tmp_path)
        os.unlink(tmp_path)
        
        skills = extract_skills_from_text(cv_text, text_type="cv")
        
        return {
            "success": True,
            "total_skills": len(skills),
            "skills": skills,
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/resume/batch-analyze", tags=["Resume Reviewer"])
async def batch_analyze(
    files: List[UploadFile] = File(...),
    job_title: str = Form(...),
    job_description: str = Form(...)
):
    """
    Analyze multiple CVs against one job description
    
    Perfect for recruiters reviewing multiple candidates
    
    Returns ranked list of candidates
    """
    
    if len(job_description.strip()) < 50:
        raise HTTPException(status_code=400, detail="Job description too short")
    
    if len(files) > 20:
        raise HTTPException(status_code=400, detail="Maximum 20 files per batch")
    
    results = []
    
    for file in files:
        try:
            with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
                content = await file.read()
                tmp.write(content)
                tmp_path = tmp.name
            
            cv_text = extract_text_from_pdf(tmp_path)
            os.unlink(tmp_path)
            
            if len(cv_text.strip()) < 100:
                continue
            
            analysis = analyze_cv_with_groq_mena(cv_text, job_description)
            
            if "error" not in analysis:
                results.append({
                    "filename": file.filename,
                    "match_score": analysis.get('overall_match_score', 0),
                    "recommendation": analysis.get('recommendation', 'N/A'),
                    "matched_skills": analysis.get('matched_skills', []),
                    "missing_skills": analysis.get('missing_skills', [])
                })
        
        except Exception as e:
            print(f"Error processing {file.filename}: {e}")
            continue
    
    # Sort by match score
    results.sort(key=lambda x: x['match_score'], reverse=True)
    
    return {
        "success": True,
        "total_analyzed": len(results),
        "total_submitted": len(files),
        "job_title": job_title,
        "candidates": results,
        "timestamp": datetime.now().isoformat()
    }

# ==================== MODULE 2: JOB MATCHER ====================

@app.post("/api/jobs/match", tags=["Job Matcher"])
async def match_cv_to_jobs(
    file: UploadFile = File(...),
    preferred_locations: str = Form('["Dubai", "Remote"]'),
    salary_min: int = Form(0),
    salary_max: int = Form(100000),
    open_to_remote: bool = Form(True),
    max_results: int = Form(20)
):
    """
    Match CV to available jobs using AI + vector search
    
    Returns top matching jobs with scores
    """
    
    # Validate max_results
    if max_results > 100:
        raise HTTPException(status_code=400, detail="max_results cannot exceed 100")
    
    # Extract CV
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
            content = await file.read()
            tmp.write(content)
            tmp_path = tmp.name
        
        cv_text = extract_text_from_pdf(tmp_path)
        os.unlink(tmp_path)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error reading PDF: {str(e)}")
    
    # Extract profile
    cv_profile = smart_recommender.extract_candidate_profile(cv_text)
    
    # Parse preferences
    try:
        locations = json.loads(preferred_locations)
        if not isinstance(locations, list):
            locations = ["Dubai", "Remote"]
    except:
        locations = ["Dubai", "Remote"]
    
    user_preferences = {
        'preferred_locations': locations,
        'salary_expectation_min': salary_min,
        'salary_expectation_max': salary_max,
        'open_to_remote': open_to_remote
    }
    
    # Find matches
    matches = smart_recommender.find_matching_jobs_advanced(
        cv_profile,
        user_preferences,
        top_k=max_results
    )
    
    # Get recommendations
    recommendations = smart_recommender.generate_personalized_recommendations(
        cv_profile,
        matches
    )
    
    return {
        "success": True,
        "profile": cv_profile,
        "total_matches": len(matches),
        "matches": matches,
        "recommendations": recommendations,
        "timestamp": datetime.now().isoformat()
    }

@app.post("/api/jobs/search-live", tags=["Job Matcher"])
async def search_live_jobs(
    keywords: str = Form(...),
    location: str = Form("Dubai"),
    max_results: int = Form(20)
):
    """
    Search live jobs from Bayt, LinkedIn, Indeed
    
    Real-time job scraping from MENA job boards
    """
    
    if max_results > 50:
        raise HTTPException(status_code=400, detail="max_results cannot exceed 50")
    
    try:
        scraper = MENAAfricaJobScraper()
        
        jobs = scraper.scrape_all_sources(
            keywords=keywords,
            location=location,
            max_per_source=max_results // 3
        )
        
        return {
            "success": True,
            "total_jobs": len(jobs),
            "keywords": keywords,
            "location": location,
            "jobs": jobs,
            "sources": list(set([j['source'] for j in jobs])),
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ==================== MODULE 3: FOOTPRINT SCANNER ====================

@app.post("/api/footprint/scan", tags=["Footprint Scanner"])
async def scan_footprint(
    github_username: Optional[str] = Form(None),
    linkedin_url: Optional[str] = Form(None),
    stackoverflow_id: Optional[str] = Form(None)
):
    """
    Scan candidate's digital footprint
    
    Returns GitHub stats, LinkedIn summary, StackOverflow reputation
    """
    
    if not any([github_username, linkedin_url, stackoverflow_id]):
        raise HTTPException(status_code=400, detail="Provide at least one profile")
    
    results = {}
    
    # GitHub scanning
    if github_username:
        try:
            from github import Github
            g = Github()
            user = g.get_user(github_username)
            
            repos = list(user.get_repos()[:10])
            total_stars = sum([repo.stargazers_count for repo in repos])
            
            # Get top languages
            languages = {}
            for repo in repos[:5]:
                langs = repo.get_languages()
                for lang, bytes_count in langs.items():
                    languages[lang] = languages.get(lang, 0) + bytes_count
            
            top_languages = sorted(languages.items(), key=lambda x: x[1], reverse=True)[:5]
            top_languages = [lang[0] for lang in top_languages]
            
            results['github'] = {
                "username": github_username,
                "public_repos": user.public_repos,
                "followers": user.followers,
                "following": user.following,
                "total_stars": total_stars,
                "top_languages": top_languages,
                "profile_url": f"https://github.com/{github_username}",
                "activity_score": min(100, (user.public_repos * 5) + (user.followers * 2))
            }
            
        except Exception as e:
            results['github'] = {"error": str(e)}
    
    # LinkedIn (limited without auth)
    if linkedin_url:
        results['linkedin'] = {
            "url": linkedin_url,
            "note": "LinkedIn scraping requires authentication",
            "profile_url": linkedin_url
        }
    
    # StackOverflow
    if stackoverflow_id:
        try:
            import requests
            api_url = f"https://api.stackexchange.com/2.3/users/{stackoverflow_id}"
            params = {'site': 'stackoverflow'}
            
            response = requests.get(api_url, params=params, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                
                if data.get('items'):
                    user = data['items'][0]
                    
                    results['stackoverflow'] = {
                        "user_id": stackoverflow_id,
                        "reputation": user.get('reputation', 0),
                        "gold_badges": user.get('badge_counts', {}).get('gold', 0),
                        "silver_badges": user.get('badge_counts', {}).get('silver', 0),
                        "bronze_badges": user.get('badge_counts', {}).get('bronze', 0),
                        "profile_url": f"https://stackoverflow.com/users/{stackoverflow_id}"
                    }
        
        except Exception as e:
            results['stackoverflow'] = {"error": str(e)}
    
    # Calculate overall footprint score
    overall_score = 0
    weights = 0
    
    if results.get('github') and 'activity_score' in results['github']:
        overall_score += results['github']['activity_score'] * 0.5
        weights += 0.5
    
    if results.get('stackoverflow') and 'reputation' in results['stackoverflow']:
        so_score = min(100, results['stackoverflow']['reputation'] / 100)
        overall_score += so_score * 0.3
        weights += 0.3
    
    if weights > 0:
        overall_score = int(overall_score / weights)
    
    return {
        "success": True,
        "overall_footprint_score": overall_score,
        "results": results,
        "scanned_at": datetime.now().isoformat()
    }

# ==================== MODULE 4: CAREER INSIGHTS ====================

@app.post("/api/insights/generate", tags=["Career Insights"])
async def generate_career_insights(file: UploadFile = File(...)):
    """
    Generate comprehensive career insights
    
    Returns personalized career recommendations
    """
    
    # Extract CV
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
            content = await file.read()
            tmp.write(content)
            tmp_path = tmp.name
        
        cv_text = extract_text_from_pdf(tmp_path)
        os.unlink(tmp_path)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error reading PDF: {str(e)}")
    
    # Extract profile
    profile = smart_recommender.extract_candidate_profile(cv_text)
    
    # Generate insights using AI
    prompt = f"""
You are a career counselor for MENA & Sub-Saharan Africa.

Generate career insights for:
- Skills: {', '.join(profile.get('skills', [])[:10])}
- Experience: {profile.get('experience_years', 0)} years
- Level: {profile.get('seniority_level', 'Mid')}

Return JSON:
{{
  "career_summary": "Overview",
  "market_competitiveness": "High/Medium/Low",
  "salary_insights": {{"range": "20K-30K AED", "factors": ["Factor1"]}},
  "growth_opportunities": [{{"role": "Senior Engineer", "timeline": "1-2 years"}}],
  "recommended_actions": [{{"action": "Get cert", "priority": "High"}}],
  "industry_trends": ["Trend1"],
  "skill_gaps": ["Gap1"]
}}
"""

    try:
        response = groq_client.chat.completions.create(
            model="openai/gpt-oss-120b",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3,
            response_format={"type": "json_object"}
        )
        
        raw = response.choices[0].message.content.strip()
        
        if "```json" in raw:
            raw = raw.split("```json")[1].split("```")[0]
        elif "```" in raw:
            raw = raw.split("```")[1].split("```")[0]
        
        insights = json.loads(raw.strip())
        
        return {
            "success": True,
            "profile": profile,
            "insights": insights,
            "generated_at": datetime.now().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ==================== ERROR HANDLERS ====================

@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """Global exception handler"""
    return JSONResponse(
        status_code=500,
        content={
            "error": str(exc),
            "type": type(exc).__name__,
            "timestamp": datetime.now().isoformat()
        }
    )

# ==================== RUN SERVER ====================

if __name__ == "__main__":
    import uvicorn
    
    print("🚀 Starting UtopiaHire API v2.0...")
    print("📚 API Docs: http://localhost:8000/docs")
    print("🔧 Health Check: http://localhost:8000/api/health")
    
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)