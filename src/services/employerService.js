import { apiClient } from '@/api';

export const employerService = {
  async getDashboard() {
    return apiClient.get('/dashboard/company');
  },

  async getOwnedJobs(params = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        query.append(key, String(value));
      }
    });
    const queryString = query.toString();
    const path = queryString ? `/company/jobs?${queryString}` : '/company/jobs';
    return apiClient.get(path);
  },

  async createJob(jobData) {
    return apiClient.post('/company/jobs', jobData);
  },

  async getJobDetails(id) {
    return apiClient.get(`/company/jobs/${id}`);
  },

  async updateJob(id, jobData) {
    return apiClient.put(`/company/jobs/${id}`, jobData);
  },

  async deleteJob(id) {
    return apiClient.delete(`/company/jobs/${id}`);
  },

  async publishJob(id) {
    return apiClient.post(`/company/jobs/${id}/publish`);
  },

  async closeJob(id) {
    return apiClient.post(`/company/jobs/${id}/close`);
  },

  async reactivateJob(id) {
    return apiClient.post(`/company/jobs/${id}/reactivate`);
  },

  async bulkJobsAction(jobIds, action) {
    return apiClient.post('/company/jobs/bulk', { jobIds, action });
  },

  async listApplicants(params = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        query.append(key, String(value));
      }
    });
    const queryString = query.toString();
    const path = queryString ? `/company/applicants?${queryString}` : '/company/applicants';
    return apiClient.get(path);
  },

  async getApplicantDetails(id) {
    return apiClient.get(`/company/applicants/${id}`);
  },

  async updateApplicantStatus(id, status) {
    return apiClient.patch(`/company/applicants/${id}/status`, { status });
  },

  async getCompanySettings() {
    return apiClient.get('/company/settings');
  },

  async updateCompanySettings(data) {
    return apiClient.put('/company/settings', data);
  },

  async uploadLogo(file) {
    const formData = new FormData();
    formData.append('logo', file);
    return apiClient.post('/company/logo', formData);
  },

  async removeLogo() {
    return apiClient.delete('/company/logo');
  },

  async getOwnCompanyProfile() {
    return apiClient.get('/company/profile');
  },
};

export default employerService;
