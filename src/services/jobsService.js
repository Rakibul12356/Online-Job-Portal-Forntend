import { apiClient } from '@/api';

export const jobsService = {
  async listJobs(params = {}) {
    const query = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          if (value.length > 0) {
            query.append(key, value.join(','));
          }
        } else {
          query.append(key, String(value));
        }
      }
    });

    const queryString = query.toString();
    const path = queryString ? `/jobs?${queryString}` : '/jobs';
    return apiClient.get(path);
  },

  async getJobDetails(id) {
    return apiClient.get(`/jobs/${id}`);
  },

  async getSimilarJobs(id) {
    return apiClient.get(`/jobs/${id}/similar`);
  },

  async applyToJob(id, { resume, coverMessage }) {
    const formData = new FormData();
    if (resume) {
      formData.append('resume', resume);
    }
    if (coverMessage) {
      formData.append('coverMessage', coverMessage);
    }
    return apiClient.post(`/jobs/${id}/applications`, formData);
  },

  async reportJob(id, { reason, details }) {
    return apiClient.post(`/jobs/${id}/report`, { reason, details });
  },
};

export default jobsService;
