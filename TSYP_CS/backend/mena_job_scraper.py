"""
MENA & Sub-Saharan Africa Job Scraper
Scrapes jobs from multiple regional job boards

Sources:
- Bayt.com (MENA's #1 job board)
- LinkedIn (regional focus)
- Indeed (MENA/Africa)
- Glassdoor (regional)
"""

import requests
from bs4 import BeautifulSoup
from datetime import datetime
import time
from urllib.parse import quote, urljoin
import hashlib
import json
import re
from typing import List, Dict, Optional
import sqlite3
import os

class MENAAfricaJobScraper:
    """
    Production-ready job scraper for MENA & Sub-Saharan Africa
    """
    
    def __init__(self, db_path: str = "data/cvs.db"):
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9,ar;q=0.8',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
        }
        self.db_path = db_path
        self.session = requests.Session()
        self.session.headers.update(self.headers)
    
    def _generate_job_id(self, source: str, title: str, company: str) -> str:
        """Generate unique job ID"""
        unique_string = f"{source}_{title}_{company}_{datetime.now().date()}"
        return hashlib.md5(unique_string.encode()).hexdigest()[:16]
    
    def _clean_text(self, text: str) -> str:
        """Clean and normalize text"""
        if not text:
            return ""
        text = re.sub(r'\s+', ' ', text)
        return text.strip()
    
    def scrape_bayt(
        self, 
        keywords: str = "software engineer", 
        location: str = "UAE", 
        max_results: int = 20
    ) -> List[Dict]:
        """
        Scrape Bayt.com (UAE's #1 job site)
        
        Example: scrape_bayt("Python Developer", "Dubai", 20)
        """
        
        jobs = []
        
        try:
            # Build Bayt search URL
            search_term = f"{keywords} {location}".strip()
            url = f"https://www.bayt.com/en/international/jobs/{quote(search_term.replace(' ', '-'))}-jobs/"
            
            print(f"🔍 Scraping Bayt.com: {search_term}")
            
            response = self.session.get(url, timeout=15)
            
            if response.status_code != 200:
                print(f"❌ Bayt returned status {response.status_code}")
                return jobs
            
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Find job listings (update selectors based on current Bayt HTML)
            job_cards = soup.find_all('li', class_='has-pointer-d')[:max_results]
            
            if not job_cards:
                # Try alternative selectors
                job_cards = soup.find_all('div', class_='job-card')[:max_results]
            
            for card in job_cards:
                try:
                    # Extract job details
                    title_elem = card.find('h2', class_='t-default') or card.find('a', class_='jb-title')
                    company_elem = card.find('b', class_='jb-company') or card.find('span', class_='company-name')
                    location_elem = card.find('span', class_='jb-loc') or card.find('span', class_='location')
                    link_elem = card.find('a', href=True)
                    
                    if not title_elem:
                        continue
                    
                    title = self._clean_text(title_elem.get_text())
                    company = self._clean_text(company_elem.get_text()) if company_elem else "Company Name"
                    job_location = self._clean_text(location_elem.get_text()) if location_elem else location
                    
                    # Build full URL
                    if link_elem and link_elem.get('href'):
                        job_url = urljoin("https://www.bayt.com", link_elem['href'])
                    else:
                        job_url = url
                    
                    # Extract salary if available
                    salary_elem = card.find('span', class_='salary') or card.find('div', class_='jb-salary')
                    salary = self._clean_text(salary_elem.get_text()) if salary_elem else None
                    
                    # Extract posting date
                    date_elem = card.find('time') or card.find('span', class_='date')
                    posted_date = self._clean_text(date_elem.get_text()) if date_elem else datetime.now().strftime('%Y-%m-%d')
                    
                    job = {
                        'job_id': self._generate_job_id('bayt', title, company),
                        'title': title,
                        'company': company,
                        'location': job_location,
                        'region': 'MENA',
                        'country': self._extract_country(job_location),
                        'salary': salary,
                        'salary_min': None,
                        'salary_max': None,
                        'employment_type': 'Full-time',
                        'category': self._categorize_job(title),
                        'description': None,  # Fetch separately if needed
                        'required_skills': keywords,
                        'experience_level': self._infer_experience_level(title),
                        'url': job_url,
                        'source': 'Bayt.com',
                        'posted_date': posted_date,
                        'scraped_at': datetime.now().isoformat()
                    }
                    
                    jobs.append(job)
                    
                except Exception as e:
                    print(f"Error parsing Bayt job: {e}")
                    continue
            
            print(f"✅ Bayt.com: Found {len(jobs)} jobs")
            
        except Exception as e:
            print(f"❌ Bayt scraping error: {e}")
        
        return jobs
    
    def scrape_linkedin_jobs(
        self,
        keywords: str = "software engineer",
        location: str = "United Arab Emirates",
        max_results: int = 15
    ) -> List[Dict]:
        """
        Scrape LinkedIn jobs (MENA/Africa focus)
        
        Note: LinkedIn has anti-scraping measures. Use sparingly.
        """
        
        jobs = []
        
        try:
            search_url = f"https://www.linkedin.com/jobs/search/?keywords={quote(keywords)}&location={quote(location)}"
            
            print(f"🔍 Scraping LinkedIn: {keywords} in {location}")
            
            response = self.session.get(search_url, timeout=15)
            
            if response.status_code != 200:
                print(f"⚠️ LinkedIn returned status {response.status_code}")
                return jobs
            
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Find job cards
            job_cards = soup.find_all('div', class_='base-card')[:max_results]
            
            if not job_cards:
                job_cards = soup.find_all('li', class_='jobs-search-results__list-item')[:max_results]
            
            for card in job_cards:
                try:
                    title_elem = card.find('h3', class_='base-search-card__title') or card.find('a', class_='job-card-list__title')
                    company_elem = card.find('h4', class_='base-search-card__subtitle') or card.find('span', class_='job-card-container__company-name')
                    location_elem = card.find('span', class_='job-search-card__location') or card.find('span', class_='job-card-container__metadata-item')
                    link_elem = card.find('a', class_='base-card__full-link') or card.find('a', href=True)
                    
                    if not title_elem:
                        continue
                    
                    title = self._clean_text(title_elem.get_text())
                    company = self._clean_text(company_elem.get_text()) if company_elem else "Company"
                    job_location = self._clean_text(location_elem.get_text()) if location_elem else location
                    job_url = link_elem['href'] if link_elem and link_elem.get('href') else search_url
                    
                    job = {
                        'job_id': self._generate_job_id('linkedin', title, company),
                        'title': title,
                        'company': company,
                        'location': job_location,
                        'region': self._determine_region(job_location),
                        'country': self._extract_country(job_location),
                        'salary': None,
                        'salary_min': None,
                        'salary_max': None,
                        'employment_type': 'Full-time',
                        'category': self._categorize_job(title),
                        'description': None,
                        'required_skills': keywords,
                        'experience_level': self._infer_experience_level(title),
                        'url': job_url,
                        'source': 'LinkedIn',
                        'posted_date': datetime.now().strftime('%Y-%m-%d'),
                        'scraped_at': datetime.now().isoformat()
                    }
                    
                    jobs.append(job)
                    
                except Exception as e:
                    print(f"Error parsing LinkedIn job: {e}")
                    continue
            
            print(f"✅ LinkedIn: Found {len(jobs)} jobs")
            
        except Exception as e:
            print(f"❌ LinkedIn scraping error: {e}")
        
        return jobs
    
    def scrape_indeed_mena(
        self,
        keywords: str = "software engineer",
        location: str = "Dubai",
        max_results: int = 15
    ) -> List[Dict]:
        """
        Scrape Indeed (MENA version)
        """
        
        jobs = []
        
        try:
            # Indeed UAE/Middle East
            base_url = "https://ae.indeed.com"
            search_url = f"{base_url}/jobs?q={quote(keywords)}&l={quote(location)}"
            
            print(f"🔍 Scraping Indeed MENA: {keywords} in {location}")
            
            response = self.session.get(search_url, timeout=15)
            
            if response.status_code != 200:
                print(f"⚠️ Indeed returned status {response.status_code}")
                return jobs
            
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Find job cards
            job_cards = soup.find_all('div', class_='job_seen_beacon')[:max_results]
            
            if not job_cards:
                job_cards = soup.find_all('td', class_='resultContent')[:max_results]
            
            for card in job_cards:
                try:
                    title_elem = card.find('h2', class_='jobTitle') or card.find('a', class_='jcs-JobTitle')
                    company_elem = card.find('span', class_='companyName')
                    location_elem = card.find('div', class_='companyLocation')
                    link_elem = card.find('a', href=True)
                    
                    if not title_elem:
                        continue
                    
                    title = self._clean_text(title_elem.get_text())
                    company = self._clean_text(company_elem.get_text()) if company_elem else "Company"
                    job_location = self._clean_text(location_elem.get_text()) if location_elem else location
                    
                    if link_elem and link_elem.get('href'):
                        job_url = urljoin(base_url, link_elem['href'])
                    else:
                        job_url = search_url
                    
                    # Extract salary
                    salary_elem = card.find('div', class_='salary-snippet')
                    salary = self._clean_text(salary_elem.get_text()) if salary_elem else None
                    
                    job = {
                        'job_id': self._generate_job_id('indeed', title, company),
                        'title': title,
                        'company': company,
                        'location': job_location,
                        'region': 'MENA',
                        'country': self._extract_country(job_location),
                        'salary': salary,
                        'salary_min': None,
                        'salary_max': None,
                        'employment_type': 'Full-time',
                        'category': self._categorize_job(title),
                        'description': None,
                        'required_skills': keywords,
                        'experience_level': self._infer_experience_level(title),
                        'url': job_url,
                        'source': 'Indeed',
                        'posted_date': datetime.now().strftime('%Y-%m-%d'),
                        'scraped_at': datetime.now().isoformat()
                    }
                    
                    jobs.append(job)
                    
                except Exception as e:
                    print(f"Error parsing Indeed job: {e}")
                    continue
            
            print(f"✅ Indeed: Found {len(jobs)} jobs")
            
        except Exception as e:
            print(f"❌ Indeed scraping error: {e}")
        
        return jobs
    
    def scrape_all_sources(
        self,
        keywords: str,
        location: str = "",
        max_per_source: int = 10
    ) -> List[Dict]:
        """
        Scrape from all available sources
        
        Returns deduplicated list of jobs
        """
        
        all_jobs = []
        
        print(f"🚀 Scraping all sources for: {keywords}")
        
        # Determine region for targeted scraping
        is_mena = any(country in location.lower() for country in ['uae', 'dubai', 'saudi', 'egypt', 'jordan', 'qatar', 'kuwait'])
        is_africa = any(country in location.lower() for country in ['nigeria', 'kenya', 'south africa', 'ghana', 'ethiopia'])
        
        # Scrape Bayt (MENA focus)
        if is_mena or not location:
            bayt_jobs = self.scrape_bayt(keywords, location or "UAE", max_per_source)
            all_jobs.extend(bayt_jobs)
            time.sleep(2)  # Be respectful to servers
        
        # Scrape LinkedIn
        if location:
            linkedin_jobs = self.scrape_linkedin_jobs(keywords, location, max_per_source)
            all_jobs.extend(linkedin_jobs)
            time.sleep(2)
        
        # Scrape Indeed (MENA)
        if is_mena or not is_africa:
            indeed_jobs = self.scrape_indeed_mena(keywords, location or "Dubai", max_per_source)
            all_jobs.extend(indeed_jobs)
            time.sleep(2)
        
        # Deduplicate by job title + company
        unique_jobs = self._deduplicate_jobs(all_jobs)
        
        print(f"✅ Total unique jobs: {len(unique_jobs)}")
        
        return unique_jobs
    
    def _deduplicate_jobs(self, jobs: List[Dict]) -> List[Dict]:
        """Remove duplicate jobs"""
        seen = set()
        unique = []
        
        for job in jobs:
            key = f"{job['title'].lower()}_{job['company'].lower()}"
            if key not in seen:
                seen.add(key)
                unique.append(job)
        
        return unique
    
    def _categorize_job(self, title: str) -> str:
        """Categorize job by title"""
        title_lower = title.lower()
        
        if any(word in title_lower for word in ['data', 'analyst', 'scientist', 'ml', 'ai']):
            return 'Data & AI'
        elif any(word in title_lower for word in ['software', 'developer', 'engineer', 'programmer']):
            return 'Software Engineering'
        elif any(word in title_lower for word in ['devops', 'cloud', 'infrastructure']):
            return 'DevOps & Cloud'
        elif any(word in title_lower for word in ['manager', 'product', 'project']):
            return 'Management'
        elif any(word in title_lower for word in ['designer', 'ux', 'ui']):
            return 'Design'
        elif any(word in title_lower for word in ['marketing', 'sales', 'business']):
            return 'Business & Marketing'
        else:
            return 'Other'
    
    def _infer_experience_level(self, title: str) -> str:
        """Infer experience level from job title"""
        title_lower = title.lower()
        
        if any(word in title_lower for word in ['senior', 'lead', 'principal', 'staff']):
            return 'Senior'
        elif any(word in title_lower for word in ['junior', 'entry', 'graduate', 'intern']):
            return 'Junior'
        else:
            return 'Mid'
    
    def _determine_region(self, location: str) -> str:
        """Determine region from location"""
        location_lower = location.lower()
        
        mena_countries = ['uae', 'dubai', 'saudi', 'egypt', 'jordan', 'qatar', 'kuwait', 'bahrain', 'oman', 'morocco', 'tunisia', 'lebanon']
        africa_countries = ['nigeria', 'kenya', 'south africa', 'ghana', 'ethiopia', 'tanzania', 'uganda', 'rwanda']
        
        if any(country in location_lower for country in mena_countries):
            return 'MENA'
        elif any(country in location_lower for country in africa_countries):
            return 'Sub-Saharan Africa'
        else:
            return 'Other'
    
    def _extract_country(self, location: str) -> str:
        """Extract country from location string"""
        location_lower = location.lower()
        
        country_map = {
            'uae': 'United Arab Emirates',
            'dubai': 'United Arab Emirates',
            'abu dhabi': 'United Arab Emirates',
            'saudi': 'Saudi Arabia',
            'riyadh': 'Saudi Arabia',
            'jeddah': 'Saudi Arabia',
            'egypt': 'Egypt',
            'cairo': 'Egypt',
            'jordan': 'Jordan',
            'amman': 'Jordan',
            'qatar': 'Qatar',
            'doha': 'Qatar',
            'kuwait': 'Kuwait',
            'nigeria': 'Nigeria',
            'lagos': 'Nigeria',
            'kenya': 'Kenya',
            'nairobi': 'Kenya',
            'south africa': 'South Africa',
            'ghana': 'Ghana'
        }
        
        for key, country in country_map.items():
            if key in location_lower:
                return country
        
        return location
    
    def save_to_database(self, jobs: List[Dict]):
        """Save jobs to database"""
        
        if not jobs:
            print("No jobs to save")
            return
        
        try:
            conn = sqlite3.connect(self.db_path)
            c = conn.cursor()
            
            for job in jobs:
                c.execute('''
                    INSERT OR REPLACE INTO jobs (
                        job_id, title, company, location, region, country,
                        salary_min, salary_max, employment_type, category,
                        description, required_skills, experience_level,
                        url, source, posted_date, scraped_at
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ''', (
                    job.get('job_id'),
                    job.get('title'),
                    job.get('company'),
                    job.get('location'),
                    job.get('region'),
                    job.get('country'),
                    job.get('salary_min'),
                    job.get('salary_max'),
                    job.get('employment_type'),
                    job.get('category'),
                    job.get('description'),
                    job.get('required_skills'),
                    job.get('experience_level'),
                    job.get('url'),
                    job.get('source'),
                    job.get('posted_date'),
                    job.get('scraped_at')
                ))
            
            conn.commit()
            conn.close()
            
            print(f"✅ Saved {len(jobs)} jobs to database")
            
        except Exception as e:
            print(f"❌ Database error: {e}")
    
    def scrape_and_save(
        self,
        keywords: str,
        location: str = "",
        max_per_source: int = 10
    ) -> List[Dict]:
        """
        Scrape jobs and save to database
        
        One-liner for easy use
        """
        
        jobs = self.scrape_all_sources(keywords, location, max_per_source)
        self.save_to_database(jobs)
        
        return jobs


# ==================== USAGE EXAMPLE ====================

if __name__ == "__main__":
    """
    Example: How to use the scraper
    """
    
    scraper = MENAAfricaJobScraper()
    
    # Example 1: Scrape Python jobs in Dubai
    print("\n=== Example 1: Python Developer in Dubai ===")
    jobs = scraper.scrape_and_save("Python Developer", "Dubai", max_per_source=5)
    print(f"Found {len(jobs)} jobs")
    
    # Example 2: Scrape Data Science jobs in MENA
    print("\n=== Example 2: Data Scientist in MENA ===")
    jobs = scraper.scrape_and_save("Data Scientist", "UAE", max_per_source=5)
    
    # Example 3: Scrape Software Engineer jobs in Africa
    print("\n=== Example 3: Software Engineer in Nigeria ===")
    jobs = scraper.scrape_and_save("Software Engineer", "Nigeria", max_per_source=5)
    
    print("\n✅ Scraping complete!")