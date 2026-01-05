import api from './api';

export interface StudentProfileRequest {
  rollNumber: string;
  department: string;
  year: number;
  cgpa: number;
  skills?: string;
}

export interface StudentProfileResponse {
  id: number;
  name: string;
  mobileNumber: string;
  rollNumber: string;
  department: string;
  year: number;
  cgpa: number;
  skills?: string;
  resumePath?: string;
  placementStatus: string;
}

export const studentService = {
  // Get My Profile (Currently only ready for SUPERADMIN)
  async getMyProfile(): Promise<StudentProfileResponse> {
    const response = await api.get('/students/me');
    return response.data;
  },

  // Update Profile
  async updateProfile(
    data: StudentProfileRequest,
  ): Promise<StudentProfileResponse> {
    const response = await api.put('/students/me', data);
    return response.data;
  },

  // Upload Resume
  async uploadResume(file: any): Promise<void> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/students/me/resume', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};
