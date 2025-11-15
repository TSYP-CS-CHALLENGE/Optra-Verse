from groq import Groq
import json
import os

groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))

class JobMatcher:
    def __init__(self, vector_matcher, live_scraper):
        self.vector_matcher = vector_matcher
        self.live_scraper = live_scraper

    def match_jobs(self, cv_profile, top_k=10):
        """
        Returns a list of recommended jobs for the candidate
        """
        # Vector search
        skills = cv_profile.get("skills", [])
        matched_jobs = self.vector_matcher.find_matching_jobs(skills, top_k=top_k)

        # Optionally include live jobs
        live_jobs = self.live_scraper.search_jobs_by_profile(cv_profile, max_results=5)
        matched_jobs.extend(live_jobs)

        # Re-rank using AI
        return matched_jobs
