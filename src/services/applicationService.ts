import api from './api';

export interface ApplicationResponse {
    applicationId: number;
    jobId: number;
    jobTitle: string;
    status: string;
    appliedAt: string;
}

export const applicationService = {
    // Apply for Job
    async applyForJob(jobId: number): Promise<void> {
        const response = await api.post(`/applications/${jobId}`);
        return response.data;
    },

    // Get My Applications
    async getMyApplications(): Promise<ApplicationResponse[]> {
        const response = await api.get('/applications/me');
        return response.data;
    },

    // Shortlist Application (Recruiter)
    async shortlistApplication(applicationId: number): Promise<void> {
        const response = await api.post(`/applications/${applicationId}/shortlist`);
        return response.data;
    },
};
