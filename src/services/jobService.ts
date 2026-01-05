import api from './api';

export interface JobRequest {
    title: string;
    description: string;
    location: string;
    type: string;
    minCgpa: number;
    lastDate: string; // format: YYYY-MM-DD
}

export interface JobResponse {
    id: number;
    companyName: string;
    title: string;
    description: string;
    location: string;
    type: string;
    minCgpa: number;
    lastDate: string;
    approved: boolean;
}

export const jobService = {
    // Get All Approved Jobs (Students)
    async getApprovedJobs(): Promise<JobResponse[]> {
        const response = await api.get('/jobs');
        return response.data;
    },

    // Create Job (Recruiter)
    async createJob(job: JobRequest): Promise<void> {
        const response = await api.post('/jobs', job);
        return response.data;
    },

    // Get Company Jobs (Recruiter)
    async getCompanyJobs(): Promise<JobResponse[]> {
        const response = await api.get('/jobs/company');
        return response.data;
    },
};
