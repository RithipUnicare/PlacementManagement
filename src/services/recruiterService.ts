import api from './api';

export interface CompanyProfileRequest {
    companyName: string;
    description?: string;
    website?: string;
}

export const recruiterService = {
    // Create or Update Company Profile
    async createOrUpdateCompany(data: CompanyProfileRequest): Promise<void> {
        const response = await api.post('/recruiters/company', data);
        return response.data;
    },
};
