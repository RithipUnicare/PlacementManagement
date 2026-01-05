import api from './api';

export interface LoginRequest {
    mobileNumber: string;
    password: string;
}

export interface SignupRequest {
    name: string;
    mobileNumber: string;
    password: string;
    email?: string;
}

export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    user: any;
}

export const authService = {
    // Login
    async login(data: LoginRequest): Promise<LoginResponse> {
        const response = await api.post('/auth/login', data);
        return response.data;
    },

    // Signup
    async signup(data: SignupRequest): Promise<string> {
        const response = await api.post('/auth/signup', data);
        return response.data;
    },

    // Request Password Reset
    async requestPasswordReset(mobileNumber: string): Promise<string> {
        const response = await api.post('/auth/request-password-reset', {
            mobileNumber,
        });
        return response.data;
    },

    // Reset Password
    async resetPassword(token: string, newPassword: string): Promise<string> {
        const response = await api.post('/auth/reset-password', {
            token,
            newPassword,
        });
        return response.data;
    },

    // Refresh Token
    async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
        const response = await api.post('/auth/refresh', { refreshToken });
        return response.data;
    },

    // Update User Role (Admin only)
    async updateUserRole(mobileNumber: string, roles: string): Promise<string> {
        const response = await api.post('/auth/update-role', {
            mobileNumber,
            roles,
        });
        return response.data;
    },
};
