import api from './api';

export const offerService = {
    // Upload Offer Letter (Recruiter)
    async uploadOfferLetter(applicationId: number, file: any): Promise<void> {
        const formData = new FormData();
        formData.append('file', file);

        const response = await api.post(`/offers/${applicationId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    // Accept Offer (Student)
    async acceptOffer(offerId: number): Promise<void> {
        const response = await api.post(`/offers/${offerId}/accept`);
        return response.data;
    },
};
