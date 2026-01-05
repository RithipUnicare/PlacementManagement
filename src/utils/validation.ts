export const validation = {
    // Mobile Number Validation (10 digits)
    validateMobile(mobile: string): { isValid: boolean; error?: string } {
        const mobileRegex = /^[0-9]{10}$/;
        if (!mobile) {
            return { isValid: false, error: 'Mobile number is required' };
        }
        if (!mobileRegex.test(mobile)) {
            return { isValid: false, error: 'Please enter a valid 10-digit mobile number' };
        }
        return { isValid: true };
    },

    // Email Validation
    validateEmail(email: string): { isValid: boolean; error?: string } {
        if (!email) {
            return { isValid: true }; // Email is optional
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return { isValid: false, error: 'Please enter a valid email address' };
        }
        return { isValid: true };
    },

    // Password Validation
    validatePassword(password: string): { isValid: boolean; error?: string } {
        if (!password) {
            return { isValid: false, error: 'Password is required' };
        }
        if (password.length < 6) {
            return { isValid: false, error: 'Password must be at least 6 characters' };
        }
        return { isValid: true };
    },

    // CGPA Validation (0-10)
    validateCGPA(cgpa: string | number): { isValid: boolean; error?: string } {
        const cgpaNum = typeof cgpa === 'string' ? parseFloat(cgpa) : cgpa;
        if (isNaN(cgpaNum)) {
            return { isValid: false, error: 'CGPA must be a valid number' };
        }
        if (cgpaNum < 0 || cgpaNum > 10) {
            return { isValid: false, error: 'CGPA must be between 0 and 10' };
        }
        return { isValid: true };
    },

    // Required Field Validation
    validateRequired(value: string, fieldName: string): { isValid: boolean; error?: string } {
        if (!value || value.trim() === '') {
            return { isValid: false, error: `${fieldName} is required` };
        }
        return { isValid: true };
    },

    // Roll Number Validation
    validateRollNumber(rollNumber: string): { isValid: boolean; error?: string } {
        if (!rollNumber || rollNumber.trim() === '') {
            return { isValid: false, error: 'Roll number is required' };
        }
        return { isValid: true };
    },

    // Year Validation (1-4)
    validateYear(year: number | string): { isValid: boolean; error?: string } {
        const yearNum = typeof year === 'string' ? parseInt(year) : year;
        if (isNaN(yearNum) || yearNum < 1 || yearNum > 4) {
            return { isValid: false, error: 'Please select a valid year' };
        }
        return { isValid: true };
    },
};
