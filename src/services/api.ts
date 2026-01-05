import axios from 'axios';
import { API_BASE_URL, API_TIMEOUT } from '../utils/constants';
import { storage } from '../utils/storage';

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: API_TIMEOUT,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use(
    async config => {
        const token = await storage.getAccessToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    },
);

// Response interceptor for error handling
api.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;

        // Handle 401 Unauthorized - try to refresh token
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = await storage.getRefreshToken();
                if (refreshToken) {
                    const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
                        refreshToken,
                    });

                    const { accessToken } = response.data;
                    await storage.setAccessToken(accessToken);

                    // Retry original request with new token
                    originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                    return api(originalRequest);
                }
            } catch (refreshError) {
                // Refresh failed, clear storage and logout
                await storage.clearAll();
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    },
);

export default api;
