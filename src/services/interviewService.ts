import api from './api';

export interface InterviewRequest {
    applicationId: number;
    interviewDateTime: string; // ISO format
    mode: string; // Online or Offline
    location?: string;
}

export const interviewService = {
    // Schedule Interview (Recruiter)
    async scheduleInterview(data: InterviewRequest): Promise<void> {
        const response = await api.post('/interviews', data);
        return response.data;
    },
};
