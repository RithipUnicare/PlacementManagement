import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import AuthNavigator from './AuthNavigator';
import StudentNavigator from './StudentNavigator';
import RecruiterNavigator from './RecruiterNavigator';
import AdminNavigator from './AdminNavigator';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { USER_ROLES } from '../utils/constants';

const AppNavigator = () => {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return <LoadingSpinner />;
    }

    const getRoleNavigator = () => {
        if (!user) {
            return <AuthNavigator />;
        }

        // Normalize role for navigation (handles ROLE_SUPERADMIN, ROLE_ADMIN, etc.)
        const normalizedRole = user.roles?.includes('ROLE_')
            ? user.roles.replace('ROLE_', '')
            : user.roles;

        // Map SUPERADMIN to ADMIN navigator
        if (normalizedRole === 'SUPERADMIN' || normalizedRole === 'ADMIN') {
            return <AdminNavigator />;
        }

        switch (normalizedRole) {
            case 'STUDENT':
                return <StudentNavigator />;
            case 'RECRUITER':
                return <RecruiterNavigator />;
            default:
                // If role doesn't match, logout and show auth
                return <AuthNavigator />;
        }
    };

    return <NavigationContainer>{getRoleNavigator()}</NavigationContainer>;
};

export default AppNavigator;
