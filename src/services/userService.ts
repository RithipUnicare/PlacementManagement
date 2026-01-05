import api from './api';

export interface User {
    id: number;
    name: string;
    mobileNumber: string;
    roles: string;
    email?: string;
}

export interface UserEditRequest {
    name?: string;
    mobileNumber?: string;
    email?: string;
}

export interface DashboardResponse {
    totalStudents: number;
    placedStudents: number;
    totalCompanies: number;
    activeJobs: number;
}

export const userService = {
    // Get Current User
    async getCurrentUser(): Promise<User> {
        const response = await api.get('/users/me');
        return response.data;
    },

    // Edit Current User Profile
    async editProfile(data: UserEditRequest): Promise<void> {
        const response = await api.put('/users/me', data);
        return response.data;
    },

    // Get All Users (Admin)
    async getAllUsers(): Promise<User[]> {
        const response = await api.get('/users');
        return response.data;
    },

    // Delete User (Admin)
    async deleteUser(id: number): Promise<void> {
        const response = await api.delete(`/users/${id}`);
        return response.data;
    },
};
