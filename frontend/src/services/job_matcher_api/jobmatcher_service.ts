import type { CareerInsightsResponse, FootprintScanRequest, FootprintScanResponse, JobMatchRequest, LiveJobSearchRequest } from "@/models/JobMatcher";
import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5000",
    timeout: 15000,
});

export const getHealthStatus = async (): Promise<any> => {
    const response = await api.get('/api/health');
    return response.data;
};

export const analyzeCV = async (formData: FormData): Promise<any> => {
    const response = await api.post('/api/resume/analyze', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const extractSkills = async (file: File): Promise<{ skills: string[]; total_skills: number }> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/api/resume/extract-skills', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const batchAnalyze = async (files: File[], job_title: string, job_description: string) => {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    formData.append('job_title', job_title);
    formData.append('job_description', job_description);

    const response = await api.post('/api/resume/batch-analyze', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
}


export const matchCVToJobs = async (
    file: File, 
    options: JobMatchRequest = {}
): Promise<any> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('preferred_locations', JSON.stringify(options.preferred_locations || ['Dubai', 'Remote']));
    formData.append('salary_min', options.salary_min?.toString() || '0');
    formData.append('salary_max', options.salary_max?.toString() || '100000');
    formData.append('open_to_remote', options.open_to_remote?.toString() || 'true');
    formData.append('max_results', options.max_results?.toString() || '20');

    const response = await api.post('/api/jobs/match', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const searchLiveJobs = async (
    request: LiveJobSearchRequest
): Promise<any> => {
    const formData = new FormData();
    formData.append('keywords', request.keywords);
    formData.append('location', request.location || 'Tunisia');
    formData.append('max_results', request.max_results?.toString() || '20');

    const response = await api.post('/api/jobs/search-live', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};


export const scanDigitalFootprint = async (
    request: FootprintScanRequest
): Promise<FootprintScanResponse> => {
    const formData = new FormData();
    if (request.github_username) formData.append('github_username', request.github_username);
    if (request.linkedin_url) formData.append('linkedin_url', request.linkedin_url);
    if (request.stackoverflow_id) formData.append('stackoverflow_id', request.stackoverflow_id);

    const response = await api.post('/api/footprint/scan', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const generateCareerInsights = async (
    file: File
): Promise<CareerInsightsResponse> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/api/insights/generate', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};