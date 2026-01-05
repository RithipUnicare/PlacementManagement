import React, { createContext, useState, useEffect, useContext } from 'react';
import { authService, LoginRequest, SignupRequest } from '../services/authService';
import { userService, User } from '../services/userService';
import { storage } from '../utils/storage';

interface AuthContextType {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    login: (data: LoginRequest) => Promise<void>;
    signup: (data: SignupRequest) => Promise<void>;
    logout: () => Promise<void>;
    updateUser: (userData: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Check for existing token on mount
    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const savedToken = await storage.getAccessToken();
            const savedUser = await storage.getUserData();

            if (savedToken && savedUser) {
                setToken(savedToken);
                setUser(savedUser);
            }
        } catch (error) {
            console.error('Auth check error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (data: LoginRequest) => {
        try {
            const response = await authService.login(data);

            // Store tokens
            await storage.setAccessToken(response.accessToken);
            await storage.setRefreshToken(response.refreshToken);

            // Get full user data
            const userData = await userService.getCurrentUser();
            await storage.setUserData(userData);

            setToken(response.accessToken);
            setUser(userData);
        } catch (error) {
            throw error;
        }
    };

    const signup = async (data: SignupRequest) => {
        try {
            await authService.signup(data);
        } catch (error) {
            throw error;
        }
    };

    const logout = async () => {
        try {
            await storage.clearAll();
            setToken(null);
            setUser(null);
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const updateUser = (userData: User) => {
        setUser(userData);
        storage.setUserData(userData);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isLoading,
                login,
                signup,
                logout,
                updateUser,
            }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
