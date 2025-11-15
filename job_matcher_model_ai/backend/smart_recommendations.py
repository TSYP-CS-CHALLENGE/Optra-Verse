"""
Smart Job Recommender - FIXED VERSION
No circular imports
"""

from groq import Groq
import os
from dotenv import load_dotenv
import json

load_dotenv()

groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))

class SmartJobRecommender:
    """
    AI-powered job recommender
    """
    
    def __init__(self):
        # Don't import here - will be set externally
        self.vector_matcher = None
        self.job_scraper = None
    
    def set_dependencies(self, vector_matcher, job_scraper):
        """Set dependencies after initialization to avoid circular imports"""
        self.vector_matcher = vector_matcher
        self.job_scraper = job_scraper
    
    def extract_candidate_profile(self, cv_text):
        """Extract profile from CV using AI"""
        
        prompt = f"""Extract candidate profile from this CV.

Return ONLY valid JSON:
{{
  "skills": ["Python", "Machine Learning", "Docker"],
  "experience_years": 5,
  "seniority_level": "Senior",
  "current_role": "Software Engineer",
  "industries": ["Technology", "Finance"],
  "languages": ["English", "Arabic", "French"],
  "education_level": "Bachelor",
  "preferred_locations": ["Dubai", "Abu Dhabi", "Remote"],
  "open_to_remote": true,
  "current_location": "Dubai, UAE",
  "willing_to_relocate": true,
  "salary_expectation_min": 15000,
  "salary_expectation_max": 25000,
  "currency": "AED"
}}

CV:
{cv_text[:4000]}

JSON ONLY:"""

        try:
            response = groq_client.chat.completions.create(
                model="openai/gpt-oss-120b",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.1,
                response_format={"type": "json_object"}
            )
            
            profile = json.loads(response.choices[0].message.content)
            return profile
            
        except Exception as e:
            print(f"Profile extraction error: {e}")
            return {
                "skills": [],
                "experience_years": 0,
                "preferred_locations": [],
                "open_to_remote": False
            }
    
    def find_matching_jobs_advanced(
        self, 
        cv_profile, 
        user_preferences=None,
        top_k=20,
        include_live_jobs=False  # Changed to False by default to avoid scraper issues
    ):
        """Find matching jobs"""
        
        # Merge preferences
        if user_preferences:
            cv_profile.update(user_preferences)
        
        all_jobs = []
        
        # Get from vector database
        skills = cv_profile.get('skills', [])
        
        if skills and self.vector_matcher:
            try:
                vector_matches = self.vector_matcher.find_matching_jobs(skills, top_k=top_k*2)
                
                # Filter by location
                preferred_locations = cv_profile.get('preferred_locations', [])
                open_to_remote = cv_profile.get('open_to_remote', False)
                
                for job in vector_matches:
                    job_location = job.get('location', '').lower()
                    
                    location_match = False
                    
                    if open_to_remote and ('remote' in job_location or 'anywhere' in job_location):
                        location_match = True
                    elif preferred_locations:
                        for pref_loc in preferred_locations:
                            if pref_loc.lower() in job_location:
                                location_match = True
                                break
                    else:
                        location_match = True
                    
                    if location_match:
                        all_jobs.append(job)
                
            except Exception as e:
                print(f"Vector search error: {e}")
        
        # Optionally add live jobs
        if include_live_jobs and self.job_scraper:
            try:
                # Import only when needed
                from mena_job_scraper import MENAAfricaJobScraper
                
                if not self.job_scraper:
                    self.job_scraper = MENAAfricaJobScraper()
                
                print("🔍 Searching live MENA job boards...")
                # Search by current role + top skill
                search_term = cv_profile.get('current_role', 'Software Engineer')
                if skills:
                    search_term += f" {skills[0]}"
                
                live_jobs = self.job_scraper.scrape_all_sources(
                    keywords=search_term,
                    location=cv_profile.get('preferred_locations', ['Dubai'])[0] if cv_profile.get('preferred_locations') else 'Dubai',
                    max_per_source=5
                )
                
                for job in live_jobs:
                    all_jobs.append({
                        'job_id': job['job_id'],
                        'title': job['title'],
                        'company': job['company'],
                        'location': job['location'],
                        'type': job.get('employment_type', 'Full-time'),
                        'match_score': 75,  # Default score
                        'source': job['source'],
                        'url': job.get('url', ''),
                        'is_live': True
                    })
                
            except Exception as e:
                print(f"Live scraping error: {e}")
        
        return all_jobs[:top_k]
    
    def generate_personalized_recommendations(self, cv_profile, matched_jobs):
        """Generate recommendations"""
        
        if not matched_jobs:
            return {
                "overall_assessment": "No matching jobs found",
                "job_recommendations": [],
                "market_insights": "Expand your search criteria",
                "next_steps": []
            }
        
        prompt = f"""You are a career coach. Give personalized job search advice.

Candidate:
- Skills: {', '.join(cv_profile.get('skills', [])[:5])}
- Experience: {cv_profile.get('experience_years', 0)} years
- Preferred locations: {', '.join(cv_profile.get('preferred_locations', []))}

Top jobs:
{json.dumps([{'title': j['title'], 'location': j['location'], 'score': j.get('match_score', 0)} for j in matched_jobs[:3]], indent=2)}

Return JSON:
{{
  "overall_assessment": "Brief overview",
  "job_recommendations": [
    {{
      "job_title": "Job name",
      "why_good_fit": "Reason",
      "what_to_emphasize": "What to highlight",
      "application_tips": "Tips"
    }}
  ],
  "market_insights": "Market analysis",
  "next_steps": ["Action 1", "Action 2"]
}}

JSON ONLY:"""

        try:
            response = groq_client.chat.completions.create(
                model="openai/gpt-oss-120b",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.4,
                response_format={"type": "json_object"}
            )
            
            return json.loads(response.choices[0].message.content)
            
        except Exception as e:
            print(f"Recommendations error: {e}")
            return {
                "overall_assessment": "Good job matches found!",
                "job_recommendations": [],
                "market_insights": "Keep applying!",
                "next_steps": []
            }


# Initialize globally
smart_recommender = SmartJobRecommender()