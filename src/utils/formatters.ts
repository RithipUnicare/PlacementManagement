export const formatters = {
    // Format date to DD/MM/YYYY
    formatDate(dateString: string): string {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    },

    // Format date-time to DD/MM/YYYY HH:MM
    formatDateTime(dateTimeString: string): string {
        const date = new Date(dateTimeString);
        const formattedDate = this.formatDate(dateTimeString);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${formattedDate} ${hours}:${minutes}`;
    },

    // Format CGPA to 2 decimal places
    formatCGPA(cgpa: number): string {
        return cgpa.toFixed(2);
    },

    // Format mobile number
    formatMobile(mobile: string): string {
        if (mobile.length === 10) {
            return `${mobile.slice(0, 5)} ${mobile.slice(5)}`;
        }
        return mobile;
    },

    // Capitalize first letter
    capitalize(text: string): string {
        return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    },

    // Get status color
    getStatusColor(status: string): string {
        const statusColors: { [key: string]: string } = {
            APPLIED: '#FF9800',
            SHORTLISTED: '#2196F3',
            REJECTED: '#F44336',
            INTERVIEW_SCHEDULED: '#9C27B0',
            OFFER_RECEIVED: '#4CAF50',
            OFFER_ACCEPTED: '#4CAF50',
            PENDING: '#FF9800',
            APPROVED: '#4CAF50',
        };
        return statusColors[status] || '#757575';
    },
};
