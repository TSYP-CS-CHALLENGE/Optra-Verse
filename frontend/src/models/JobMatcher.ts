// models/JobMatcher.ts
export interface CVAnalysis {
    success: boolean;
    overall_match_score: number;
    ats_score: number;
    matched_skills: string[];
    missing_skills: string[];
    strengths: string[];
    weaknesses: string[];
    suggestions: string[];
    overall_feedback: string;
    recommendation: string;
    timestamp: string;
}

export interface CVAnalysisForm {
    file: File | null;
    job_title: string;
    job_description: string;
    candidate_name: string;
    candidate_email: string;
}

export interface HealthStatus {
    status: string;
    groq_api: string;
    vector_db: string;
    vector_db_count: number;
    version: string;
    timestamp: string;
}

export interface JobStats {
    label: string;
    value: string;
    change: string;
    icon: any;
    color: string;
}

export interface Job {
    id: number;
    title: string;
    company: string;
    logo: string;
    location: string;
    type: string;
    salary: string;
    match: number;
    skills: string[];
    posted: string;
    urgent: boolean;
    featured: boolean;
    views?: number;
}

// Types pour le matching d'emplois
export interface JobMatch {
    id: string;
    title: string;
    company: string;
    location: string;
    salary_min: number;
    salary_max: number;
    match_score: number;
    skills_match: string[];
    description: string;
    url: string;
    source: string;
    posted_date: string;
    is_remote: boolean;
}

export interface LiveJob {
    id: string;
    title: string;
    company: string;
    location: string;
    salary?: string;
    description: string;
    url: string;
    source: string;
    posted_date: string;
    type?: string;
}

export interface JobMatchRequest {
    preferred_locations?: string[];
    salary_min?: number;
    salary_max?: number;
    open_to_remote?: boolean;
    max_results?: number;
}

export interface LiveJobSearchRequest {
    keywords: string;
    location?: string;
    max_results?: number;
}


export interface FootprintScanRequest {
    github_username?: string;
    linkedin_url?: string;
    stackoverflow_id?: string;
}

export interface FootprintScanResponse {
    success: boolean;
    overall_footprint_score: number;
    results: {
        github?: GitHubProfile;
        linkedin?: LinkedInProfile;
        stackoverflow?: StackOverflowProfile;
    };
    scanned_at: string;
}

export interface GitHubProfile {
    username: string;
    public_repos: number;
    followers: number;
    following: number;
    total_stars: number;
    top_languages: string[];
    profile_url: string;
    activity_score: number;
    error?: string;
}

export interface LinkedInProfile {
    url: string;
    note: string;
    profile_url: string;
}

export interface StackOverflowProfile {
    user_id: string;
    reputation: number;
    gold_badges: number;
    silver_badges: number;
    bronze_badges: number;
    profile_url: string;
    error?: string;
}

export interface CareerInsightsResponse {
    success: boolean;
    profile: any;
    insights: CareerInsights;
    generated_at: string;
}

export interface CareerInsights {
    career_summary: string;
    market_competitiveness: string;
    salary_insights: SalaryInsights;
    growth_opportunities: GrowthOpportunity[];
    recommended_actions: RecommendedAction[];
    industry_trends: string[];
    skill_gaps: string[];
}

export interface SalaryInsights {
    range: string;
    factors: string[];
}

export interface GrowthOpportunity {
    role: string;
    timeline: string;
    requirements?: string[];
}

export interface RecommendedAction {
    action: string;
    priority: "High" | "Medium" | "Low";
    timeline?: string;
}