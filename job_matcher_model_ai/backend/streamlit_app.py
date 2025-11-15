"""
Streamlit Testing App - FIXED VERSION
No circular imports
"""
import os
import streamlit as st
import tempfile
import json
import sqlite3
from datetime import datetime
import time
from dotenv import load_dotenv
from groq import Groq



load_dotenv()
groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))
# Import ONLY what we need, avoiding circular imports
from vector_search import vector_matcher
from smart_recommendations import smart_recommender
from mena_job_scraper import MENAAfricaJobScraper

from utils import (
    extract_text_from_pdf,
    analyze_cv_with_groq_mena,
    extract_skills_from_text,
    load_job_descriptions,
    save_job_descriptions
)
smart_recommender.set_dependencies(vector_matcher, MENAAfricaJobScraper())
if 'vector_db_populated' not in st.session_state:
    jobs = load_job_descriptions()
    if jobs and vector_matcher.job_collection.count() == 0:
        vector_matcher.populate_with_existing_jobs(jobs)
        print(f"✅ Populated vector DB with {len(jobs)} jobs")
    st.session_state.vector_db_populated = True
st.set_page_config(
    page_title="UtopiaHire - AI Recruitment",
    page_icon="🎯",
    layout="wide"
)

# Custom CSS
st.markdown("""
<style>
    .main-header {
        font-size: 2.5rem;
        font-weight: 700;
        color: #1f1f1f;
        margin-bottom: 0.5rem;
    }
    .sub-header {
        font-size: 1.1rem;
        color: #666;
        margin-bottom: 2rem;
    }
</style>
""", unsafe_allow_html=True)

# Header
st.markdown('<div class="main-header">🎯 UtopiaHire</div>', unsafe_allow_html=True)
st.markdown('<div class="sub-header">AI-Powered Hiring Platform for MENA & Sub-Saharan Africa</div>', unsafe_allow_html=True)

# Main tabs
tab1, tab2, tab3, tab4 = st.tabs([
    "📄 Resume Reviewer",
    "💼 Job Matcher", 
    "🔍 Footprint Scanner",
    "📊 Career Insights"
])

# ==================== TAB 1: RESUME REVIEWER ====================

with tab1:
    st.header("📄 Resume Reviewer")
    st.markdown("Upload a CV and paste the job description for instant AI analysis")
    
    col1, col2 = st.columns([1, 1])
    
    with col1:
        st.markdown("### 👤 Candidate Information")
        name = st.text_input("Full Name", placeholder="e.g., Ahmed Hassan")
        email = st.text_input("Email", placeholder="ahmed@example.com")
        uploaded_cv = st.file_uploader("📎 Upload CV (PDF)", type=["pdf"], key="reviewer_cv")
        
        if uploaded_cv:
            st.success(f"✅ {uploaded_cv.name} uploaded ({uploaded_cv.size / 1024:.1f} KB)")
    
    with col2:
        st.markdown("### 💼 Job Description")
        
        # Option to use saved jobs or paste new
        input_method = st.radio(
            "Choose input method:",
            ["Paste job description", "Select from saved jobs"],
            horizontal=True
        )
        
        if input_method == "Paste job description":
            job_description = st.text_area(
                "Paste the full job description here:",
                height=300,
                placeholder="""Example:

We are looking for a Senior Software Engineer with:
- 5+ years of Python experience
- Strong knowledge of Django and Flask
- Experience with AWS/GCP
- Machine Learning background (preferred)
- Excellent communication skills

Location: Dubai, UAE
Salary: 20,000-30,000 AED/month
"""
            )
        else:
            # Load saved jobs
            try:
                from shared_utils import load_job_descriptions
                jobs = load_job_descriptions()
                
                if jobs:
                    selected_job = st.selectbox("Select job:", list(jobs.keys()))
                    job_data = jobs[selected_job]
                    job_description = job_data.get('description', '') if isinstance(job_data, dict) else str(job_data)
                else:
                    st.warning("⚠️ No saved jobs found. Use 'Paste job description' instead.")
                    job_description = ""
            except:
                st.warning("⚠️ Could not load saved jobs. Use 'Paste job description' instead.")
                job_description = ""
    
    st.markdown("---")
    
    # Analysis button
    if st.button("🚀 Analyze CV Against Job", type="primary", use_container_width=True):
        
        if not uploaded_cv:
            st.error("❌ Please upload a CV")
        elif not job_description or len(job_description.strip()) < 50:
            st.error("❌ Please provide a job description (at least 50 characters)")
        else:
            # Extract CV text
            try:
                with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
                    tmp.write(uploaded_cv.getbuffer())
                    tmp_path = tmp.name
                
                cv_text = extract_text_from_pdf(tmp_path)
                os.unlink(tmp_path)
                
                if len(cv_text.strip()) < 100:
                    st.error("❌ Could not extract text from PDF. Please ensure it's not a scanned image.")
                else:
                    # Analyze
                    with st.spinner("🔍 Analyzing CV with AI (Groq 120B)..."):
                        analysis = analyze_cv_with_groq_mena(cv_text, job_description)
                    
                    if "error" not in analysis:
                        st.success("✅ Analysis Complete!")
                        
                        # Top metrics
                        col1, col2, col3, col4 = st.columns(4)
                        
                        with col1:
                            score = analysis.get('overall_match_score', 0)
                            color = "🟢" if score >= 80 else "🟡" if score >= 60 else "🔴"
                            st.metric("Match Score", f"{color} {score}%")
                        
                        with col2:
                            ats = analysis.get('ats_score', 0)
                            st.metric("ATS Score", f"{ats}%")
                        
                        with col3:
                            matched = len(analysis.get('matched_skills', []))
                            st.metric("Matched Skills", f"✅ {matched}")
                        
                        with col4:
                            missing = len(analysis.get('missing_skills', []))
                            st.metric("Missing Skills", f"⚠️ {missing}")
                        
                        # Progress bar
                        st.progress(score / 100)
                        
                        # Recommendation badge
                        recommendation = analysis.get('recommendation', 'N/A')
                        
                        if recommendation == "STRONG FIT":
                            st.success(f"🎉 **Recommendation:** {recommendation} - Move forward immediately!")
                        elif recommendation == "GOOD FIT":
                            st.info(f"👍 **Recommendation:** {recommendation} - Consider for interview")
                        elif recommendation == "POTENTIAL FIT":
                            st.warning(f"🤔 **Recommendation:** {recommendation} - Review carefully")
                        else:
                            st.error(f"❌ **Recommendation:** {recommendation}")
                        
                        # Overall feedback
                        st.markdown("### 📝 Overall Feedback")
                        st.info(analysis.get('overall_feedback', 'N/A'))
                        
                        # Detailed breakdown
                        col1, col2 = st.columns(2)
                        
                        with col1:
                            st.markdown("### ✅ Strengths")
                            for strength in analysis.get('strengths', []):
                                st.markdown(f"- 💪 {strength}")
                            
                            st.markdown("### 🎯 Matched Skills")
                            matched_skills = analysis.get('matched_skills', [])
                            if matched_skills:
                                st.success(", ".join(matched_skills))
                            else:
                                st.info("No specific skills matched")
                        
                        with col2:
                            st.markdown("### ⚠️ Weaknesses")
                            for weakness in analysis.get('weaknesses', []):
                                st.markdown(f"- 📉 {weakness}")
                            
                            st.markdown("### 📚 Missing Skills")
                            missing_skills = analysis.get('missing_skills', [])
                            if missing_skills:
                                st.warning(", ".join(missing_skills))
                            else:
                                st.success("No critical skills missing!")
                        
                        # Suggestions
                        st.markdown("### 💡 Suggestions for Improvement")
                        for i, suggestion in enumerate(analysis.get('suggestions', []), 1):
                            st.markdown(f"{i}. {suggestion}")
                        
                        # Export results
                        st.markdown("---")
                        
                        report = {
                            "candidate_name": name or "N/A",
                            "candidate_email": email or "N/A",
                            "analyzed_at": datetime.now().strftime("%Y-%m-%d %H:%M"),
                            "job_description_preview": job_description[:200] + "...",
                            "analysis": analysis
                        }
                        
                        report_json = json.dumps(report, indent=2)
                        
                        col1, col2 = st.columns(2)
                        
                        with col1:
                            st.download_button(
                                "📥 Download Full Report (JSON)",
                                report_json,
                                f"cv_analysis_{name or 'candidate'}_{datetime.now().strftime('%Y%m%d')}.json",
                                "application/json"
                            )
                        
                        with col2:
                            if st.button("📧 Send Report via Email"):
                                st.info("Email feature coming soon!")
                    
                    else:
                        st.error(f"❌ Analysis failed: {analysis.get('error', 'Unknown error')}")
                        
            except Exception as e:
                st.error(f"❌ Error processing CV: {str(e)}")

# ==================== TAB 2: JOB MATCHER ====================

with tab2:
    st.header("💼 Smart Job Matcher")
    st.markdown("Match CVs to multiple jobs or find candidates for a specific job")
    
    matching_mode = st.radio(
        "Select matching mode:",
        ["Find jobs for this candidate", "Find candidates for this job"],
        horizontal=True
    )
    
    if matching_mode == "Find jobs for this candidate":
        st.markdown("### 📤 Upload Candidate CV")
        
        uploaded_cv2 = st.file_uploader("Upload CV (PDF)", type=["pdf"], key="matcher_cv")
        
        col1, col2, col3 = st.columns(3)
        
        with col1:
            locations = st.multiselect(
                "Preferred Locations",
                ["Dubai", "Abu Dhabi", "Riyadh", "Cairo", "Amman", "Lagos", "Nairobi", "Remote"],
                default=["Dubai"]
            )
        
        with col2:
            salary_min = st.number_input("Min Salary", value=10000, step=1000)
            salary_max = st.number_input("Max Salary", value=30000, step=1000)
        
        with col3:
            open_to_remote = st.checkbox("Open to Remote", value=True)
        
        if st.button("🎯 Find Matching Jobs", type="primary"):
            if uploaded_cv2:
                # Extract CV
                with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
                    tmp.write(uploaded_cv2.getbuffer())
                    tmp_path = tmp.name
                
                cv_text = extract_text_from_pdf(tmp_path)
                os.unlink(tmp_path)
                
                # Extract profile
                with st.spinner("🧠 Extracting candidate profile..."):
                    cv_profile = smart_recommender.extract_candidate_profile(cv_text)
                
                st.success("✅ Profile extracted!")
                
                with st.expander("👤 Candidate Profile", expanded=False):
                    col1, col2, col3 = st.columns(3)
                    
                    with col1:
                        st.markdown("**Skills:**")
                        for skill in cv_profile.get('skills', [])[:10]:
                            st.markdown(f"- {skill}")
                    
                    with col2:
                        st.markdown("**Experience:**")
                        st.write(f"- {cv_profile.get('experience_years', 0)} years")
                        st.write(f"- {cv_profile.get('seniority_level', 'Mid')} level")
                    
                    with col3:
                        st.markdown("**Languages:**")
                        for lang in cv_profile.get('languages', []):
                            st.markdown(f"- {lang}")
                
                # Find matches
                with st.spinner("🔍 Finding matching jobs..."):
                    user_prefs = {
                        'preferred_locations': locations,
                        'open_to_remote': open_to_remote,
                        'salary_expectation_min': salary_min,
                        'salary_expectation_max': salary_max
                    }
                    
                    matches = smart_recommender.find_matching_jobs_advanced(
                        cv_profile,
                        user_prefs,
                        top_k=10
                    )
                
                if matches:
                    st.success(f"✅ Found {len(matches)} matching jobs!")
                    
                    for i, job in enumerate(matches, 1):
                        score = job.get('match_score', 0)
                        color = "🟢" if score >= 80 else "🟡" if score >= 60 else "🔴"
                        
                        with st.expander(f"{color} {i}. {job['title']} - {score}% match"):
                            col1, col2, col3 = st.columns(3)
                            
                            col1.metric("Match Score", f"{score}%")
                            col2.markdown(f"**📍 Location:** {job['location']}")
                            col3.markdown(f"**💼 Type:** {job['type']}")
                            
                            if job.get('is_live'):
                                st.info(f"🌐 Live job from {job.get('source', 'N/A')}")
                                st.markdown(f"[🔗 View Job]({job.get('url', '#')})")
                else:
                    st.warning("⚠️ No matching jobs found. Try adjusting your criteria.")
            else:
                st.warning("⚠️ Please upload a CV")
    
    else:
        st.markdown("### 💼 Job Description")
        
        job_desc_matcher = st.text_area(
            "Paste the job description:",
            height=200,
            placeholder="Paste full job description here..."
        )
        
        if st.button("🔍 Find Matching Candidates", type="primary"):
            if job_desc_matcher:
                st.info("🚧 Candidate database matching feature coming soon!")
            else:
                st.warning("⚠️ Please provide a job description")

# ==================== TAB 3: FOOTPRINT SCANNER ====================

with tab3:
    st.header("🔍 Digital Footprint Scanner")
    st.markdown("Scan candidate's GitHub, LinkedIn, and StackOverflow profiles")
    
    col1, col2, col3 = st.columns(3)
    
    with col1:
        github_username = st.text_input("GitHub Username", placeholder="octocat")
    
    with col2:
        linkedin_url = st.text_input("LinkedIn URL", placeholder="https://linkedin.com/in/...")
    
    with col3:
        so_id = st.text_input("StackOverflow ID", placeholder="123456")
    
    if st.button("🔎 Scan Footprint", type="primary"):
        if not any([github_username, linkedin_url, so_id]):
            st.warning("⚠️ Please provide at least one profile URL")
        else:
            results = {}
            
            # GitHub
            if github_username:
                try:
                    from github import Github
                    g = Github()
                    user = g.get_user(github_username)
                    
                    repos = list(user.get_repos()[:10])
                    total_stars = sum([repo.stargazers_count for repo in repos])
                    
                    results['github'] = {
                        "username": github_username,
                        "public_repos": user.public_repos,
                        "followers": user.followers,
                        "following": user.following,
                        "total_stars": total_stars,
                        "profile_url": f"https://github.com/{github_username}"
                    }
                    
                    st.success("✅ GitHub scan complete!")
                    
                    with st.expander("🐙 GitHub Profile", expanded=True):
                        col1, col2, col3, col4 = st.columns(4)
                        col1.metric("Repos", user.public_repos)
                        col2.metric("Followers", user.followers)
                        col3.metric("Following", user.following)
                        col4.metric("⭐ Stars", total_stars)
                        
                        st.markdown(f"[🔗 View Profile](https://github.com/{github_username})")
                    
                except Exception as e:
                    st.error(f"❌ GitHub error: {e}")
            
            # LinkedIn
            if linkedin_url:
                results['linkedin'] = {
                    "url": linkedin_url,
                    "note": "LinkedIn scraping requires authentication"
                }
                st.info("ℹ️ LinkedIn scanning limited (requires authentication)")
            
            # StackOverflow
            if so_id:
                results['stackoverflow'] = {
                    "user_id": so_id,
                    "profile_url": f"https://stackoverflow.com/users/{so_id}"
                }
                st.success(f"✅ StackOverflow link: https://stackoverflow.com/users/{so_id}")
            
            if results:
                st.markdown("---")
                st.markdown("### 📊 Full Scan Results")
                st.json(results)

# ==================== TAB 4: CAREER INSIGHTS ====================

with tab4:
    st.header("📊 Career Insights Report")
    st.markdown("Get personalized career recommendations based on CV")
    
    uploaded_cv3 = st.file_uploader("Upload CV (PDF)", type=["pdf"], key="insights_cv")
    
    if st.button("📈 Generate Career Insights", type="primary"):
        if uploaded_cv3:
            # Extract CV
            with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
                tmp.write(uploaded_cv3.getbuffer())
                tmp_path = tmp.name
            
            cv_text = extract_text_from_pdf(tmp_path)
            os.unlink(tmp_path)
            
            with st.spinner("🔮 Analyzing career trajectory..."):
                # Extract profile
                profile = smart_recommender.extract_candidate_profile(cv_text)
                
                # Generate insights
                prompt = f"""
You are a career counselor for MENA & Sub-Saharan Africa.

Generate career insights for this candidate.

Profile:
- Skills: {', '.join(profile.get('skills', [])[:10])}
- Experience: {profile.get('experience_years', 0)} years
- Level: {profile.get('seniority_level', 'Mid')}
- Current Role: {profile.get('current_role', 'N/A')}

Return ONLY valid JSON:
{{
  "career_summary": "2-3 sentence overview of career trajectory",
  "market_competitiveness": "High/Medium/Low",
  "salary_insights": {{
    "estimated_range": "20,000-30,000 AED",
    "currency": "AED",
    "factors": ["Factor1", "Factor2"]
  }},
  "growth_opportunities": [
    {{
      "role": "Senior Engineer",
      "timeline": "1-2 years",
      "requirements": ["Req1", "Req2"]
    }}
  ],
  "recommended_actions": [
    {{
      "action": "Get AWS certification",
      "priority": "High",
      "timeline": "3 months",
      "impact": "Increases job offers by 40%"
    }}
  ],
  "industry_trends": ["Trend1", "Trend2"],
  "skill_gaps": ["Skill1", "Skill2"]
}}

JSON ONLY:"""

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
                    
                    st.success("✅ Career insights generated!")
                    
                    # Display insights
                    st.markdown("### 🎯 Career Summary")
                    st.info(insights.get('career_summary', 'N/A'))
                    
                    col1, col2 = st.columns(2)
                    
                    with col1:
                        competitiveness = insights.get('market_competitiveness', 'N/A')
                        
                        if competitiveness == "High":
                            st.success(f"📈 **Market Competitiveness:** {competitiveness}")
                        elif competitiveness == "Medium":
                            st.info(f"📊 **Market Competitiveness:** {competitiveness}")
                        else:
                            st.warning(f"📉 **Market Competitiveness:** {competitiveness}")
                        
                        st.markdown("### 💰 Salary Insights")
                        salary = insights.get('salary_insights', {})
                        st.metric("Estimated Range", salary.get('estimated_range', 'N/A'))
                        
                        if salary.get('factors'):
                            st.markdown("**Factors:**")
                            for factor in salary['factors']:
                                st.markdown(f"- {factor}")
                    
                    with col2:
                        st.markdown("### 🚀 Growth Opportunities")
                        for opp in insights.get('growth_opportunities', [])[:3]:
                            st.success(f"**{opp.get('role', 'N/A')}**")
                            st.write(f"⏱️ Timeline: {opp.get('timeline', 'N/A')}")
                            if opp.get('requirements'):
                                st.write(f"📋 Requirements: {', '.join(opp['requirements'][:3])}")
                    
                    st.markdown("---")
                    
                    st.markdown("### 🎯 Recommended Actions")
                    
                    for i, action in enumerate(insights.get('recommended_actions', [])[:5], 1):
                        priority = action.get('priority', 'Medium')
                        
                        emoji = "🔴" if priority == "High" else "🟡" if priority == "Medium" else "🟢"
                        
                        st.markdown(f"{emoji} **{i}. {action.get('action', 'N/A')}**")
                        st.write(f"   ⏱️ Timeline: {action.get('timeline', 'N/A')} | 💡 Impact: {action.get('impact', 'N/A')}")
                    
                    st.markdown("---")
                    
                    col1, col2 = st.columns(2)
                    
                    with col1:
                        st.markdown("### 📈 Industry Trends")
                        for trend in insights.get('industry_trends', []):
                            st.markdown(f"- 🔥 {trend}")
                    
                    with col2:
                        st.markdown("### 📚 Skill Gaps to Address")
                        for gap in insights.get('skill_gaps', []):
                            st.markdown(f"- ⚠️ {gap}")
                    
                except Exception as e:
                    st.error(f"❌ Error generating insights: {e}")
        else:
            st.warning("⚠️ Please upload a CV")

# ==================== FOOTER ====================

st.markdown("---")

col1, col2, col3 = st.columns(3)

with col1:
    st.caption("🎯 **UtopiaHire v2.0**")
    st.caption("AI-Powered Hiring for MENA & Africa")

with col2:
    st.caption("⚡ Powered by Groq (120B)")
    st.caption("🔍 Smart Vector Search")

with col3:
    st.caption("🌍 Regions: MENA + Sub-Saharan Africa")
    st.caption("📧 Support: support@utopiahire.com")