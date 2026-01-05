// API Constants
export const API_BASE_URL = 'http://app.undefineddevelopers.online/placement/api';
export const API_TIMEOUT = 30000;

// Storage Keys
export const STORAGE_KEYS = {
    ACCESS_TOKEN: '@placement_access_token',
    REFRESH_TOKEN: '@placement_refresh_token',
    USER_DATA: '@placement_user_data',
};

// User Roles (as returned by API with ROLE_ prefix)
export const USER_ROLES = {
    STUDENT: 'ROLE_STUDENT',
    RECRUITER: 'ROLE_RECRUITER',
    ADMIN: 'ROLE_ADMIN',
    SUPERADMIN: 'ROLE_SUPERADMIN', // SuperAdmin also gets admin access
};

// Helper function to normalize role for navigation
export const getRoleForNavigation = (role: string): string => {
    if (role === 'ROLE_SUPERADMIN' || role === 'ROLE_ADMIN') {
        return 'ADMIN';
    }
    if (role === 'ROLE_STUDENT') {
        return 'STUDENT';
    }
    if (role === 'ROLE_RECRUITER') {
        return 'RECRUITER';
    }
    return 'UNKNOWN';
};

// Application Status
export const APPLICATION_STATUS = {
    APPLIED: 'APPLIED',
    SHORTLISTED: 'SHORTLISTED',
    REJECTED: 'REJECTED',
    INTERVIEW_SCHEDULED: 'INTERVIEW_SCHEDULED',
    OFFER_RECEIVED: 'OFFER_RECEIVED',
    OFFER_ACCEPTED: 'OFFER_ACCEPTED',
};

// Job Types
export const JOB_TYPES = [
    { label: 'Full-time', value: 'Full-time' },
    { label: 'Internship', value: 'Internship' },
    { label: 'Contract', value: 'Contract' },
];

// Interview Modes
export const INTERVIEW_MODES = [
    { label: 'Online', value: 'Online' },
    { label: 'Offline', value: 'Offline' },
];

// Departments
export const DEPARTMENTS = [
    { label: 'Computer Science', value: 'Computer Science' },
    { label: 'Information Technology', value: 'Information Technology' },
    { label: 'Electronics', value: 'Electronics' },
    { label: 'Mechanical', value: 'Mechanical' },
    { label: 'Civil', value: 'Civil' },
    { label: 'Electrical', value: 'Electrical' },
];

// Academic Years
export const ACADEMIC_YEARS = [
    { label: '1st Year', value: 1 },
    { label: '2nd Year', value: 2 },
    { label: '3rd Year', value: 3 },
    { label: '4th Year', value: 4 },
];

// Placement Status
export const PLACEMENT_STATUS = {
    NOT_PLACED: 'NOT_PLACED',
    PLACED: 'PLACED',
    HIGHER_STUDIES: 'HIGHER_STUDIES',
};
