import { apiClient } from '@/api';

export const seekerService = {
  async getDashboard() {
    return apiClient.get('/dashboard/seeker');
  },

  async getApplications(params = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        query.append(key, String(value));
      }
    });
    const queryString = query.toString();
    const path = queryString ? `/applications/me?${queryString}` : '/applications/me';
    return apiClient.get(path);
  },

  async getOneApplication(id) {
    return apiClient.get(`/applications/${id}`);
  },

  async withdrawApplication(id) {
    return apiClient.post(`/applications/${id}/withdraw`);
  },

  async getSavedJobs() {
    return apiClient.get('/saved-jobs');
  },

  async saveJob(jobId) {
    return apiClient.post('/saved-jobs', { jobId });
  },

  async unsaveJob(jobId) {
    return apiClient.delete(`/saved-jobs/${jobId}`);
  },

  async getProfile() {
    return apiClient.get('/profile/me');
  },

  async updateProfile(data) {
    return apiClient.put('/profile/me', data);
  },

  async uploadAvatar(file) {
    const formData = new FormData();
    formData.append('avatar', file);
    return apiClient.post('/profile/me/avatar', formData);
  },

  async deleteAvatar() {
    return apiClient.delete('/profile/me/avatar');
  },

  async uploadResume(file) {
    const formData = new FormData();
    formData.append('resume', file);
    return apiClient.post('/profile/me/resume', formData);
  },

  async deleteResume() {
    return apiClient.delete('/profile/me/resume');
  },

  async addExperience(data) {
    return apiClient.post('/profile/me/experience', data);
  },

  async updateExperience(expId, data) {
    return apiClient.put(`/profile/me/experience/${expId}`, data);
  },

  async deleteExperience(expId) {
    return apiClient.delete(`/profile/me/experience/${expId}`);
  },

  async addEducation(data) {
    return apiClient.post('/profile/me/education', data);
  },

  async updateEducation(eduId, data) {
    return apiClient.put(`/profile/me/education/${eduId}`, data);
  },

  async deleteEducation(eduId) {
    return apiClient.delete(`/profile/me/education/${eduId}`);
  },
};

export default seekerService;
