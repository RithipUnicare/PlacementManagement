import api from './api';

export interface DashboardResponse {
    totalStudents: number;
    placedStudents: number;
    totalCompanies: number;
    activeJobs: number;
}

export const adminService = {
    // Get Admin Dashboard Stats
    async getDashboard(): Promise<DashboardResponse> {
        const response = await api.get('/dashboard/admin');
        return response.data;
    },

    // Approve Job
    async approveJob(jobId: number): Promise<void> {
        const response = await api.post(`/admin/jobs/${jobId}/approve`);
        return response.data;
    },
};
